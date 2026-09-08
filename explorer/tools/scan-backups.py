import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from contextlib import contextmanager
from pathlib import Path


INACTIVE = re.compile(r"<!--.*?(?:-->|\Z)|<nowiki\b[^>]*>.*?(?:</nowiki\s*>|\Z)", re.IGNORECASE | re.DOTALL)


def digest_file(filename):
    digest = hashlib.sha256()
    with filename.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class VerifiedXMLReader:
    def __init__(self, stream):
        self.stream = stream
        self.digest = hashlib.sha256()
        self.bytes = 0
        self.previous = b""

    def read(self, size):
        chunk = self.stream.read(size)
        self.bytes += len(chunk)
        if self.bytes > 1024 * 1024 * 1024:
            raise ValueError("Decoded XML exceeds 1 GiB")
        probe = (self.previous + chunk).lower()
        if b"<!doctype" in probe or b"<!entity" in probe or b"\x00" in probe:
            raise ValueError("DOCTYPE, entity declarations, and non-UTF-8 XML are not permitted")
        self.previous = chunk[-32:]
        self.digest.update(chunk)
        return chunk


@contextmanager
def xml_input(filename, input_file):
    member = input_file.get("member")
    if not member:
        with filename.open("rb") as stream:
            yield VerifiedXMLReader(stream)
        return
    if not isinstance(member, str) or Path(member).is_absolute() or ".." in Path(member).parts or not member.endswith(".xml"):
        raise ValueError("Expected an exact, relative XML archive member")
    process = subprocess.Popen(["bsdtar", "-xOf", str(filename), "--", member], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        yield VerifiedXMLReader(process.stdout)
        error = process.stderr.read(4096).decode("utf-8", errors="replace")
        if process.wait() != 0:
            raise ValueError("Archive extraction failed: " + error)
    finally:
        if process.poll() is None:
            process.kill()
            process.wait()
        process.stdout.close()
        process.stderr.close()


def mask_inactive(text):
    return INACTIVE.sub(lambda match: re.sub(r"[^\r\n]", " ", match.group()), text)


def load_extractor(configuration):
    filename = Path(configuration["file"]).resolve(strict=True)
    if digest_file(filename) != configuration["sha256"]:
        raise ValueError("Extractor source hash mismatch")
    specification = importlib.util.spec_from_file_location("backup_source_extractor", filename)
    module = importlib.util.module_from_spec(specification)
    sys.modules[specification.name] = module
    specification.loader.exec_module(module)
    return module


def contained_file(root, relative):
    if not isinstance(relative, str) or not relative or Path(relative).is_absolute() or ".." in Path(relative).parts:
        raise ValueError("Source file paths must be contained and relative")
    filename = root / relative
    for component in [filename, *filename.parents]:
        if component == root:
            break
        if component.is_symlink():
            raise ValueError("Source symbolic links are not permitted")
    if not filename.is_file() or filename.stat().st_size > 1024 * 1024 * 1024:
        raise ValueError("Source must be a regular file no larger than 1 GiB")
    return filename


def scan(job):
    extractor = load_extractor(job["extractor"])
    source = job["source"]
    if source["kind"] not in {"baseline", "wiki-export", "converted-tables"}:
        raise ValueError("Unexpected source kind")
    root = Path(source["root"]).resolve(strict=True)
    wanted = {}
    for target in job["targets"]:
        if target.get("page") and target.get("subtable"):
            if target["name"] != target["page"] + "." + target["subtable"]:
                raise ValueError("Target identity mismatch")
            wanted.setdefault(target["page"].lower(), set()).add(target["subtable"].lower())
    known_titles = {target["page"] for target in job["targets"] if target.get("page")}
    definitions = {}
    revision_keys = {}
    page_titles = set()
    page_identities = set()
    title_ids = {}
    latest_by_page = {}
    summary = {"filesScanned": 0, "pagesScanned": 0, "revisionsScanned": 0, "relevantPages": 0,
               "distinctRelevantTexts": 0, "tableBlocksParsed": 0}
    inputs = []
    seen_files = set()

    def find_definitions(text, page, metadata, converted=False):
        masked = text if converted else mask_inactive(text)
        blocks = [(0, len(text), masked)] if converted else [
            (match.start(1), match.end(1), match.group(1)) for match in extractor.SGTABLE_RE.finditer(masked)
        ]
        found = []
        for block_index, (start, end, inner) in enumerate(blocks):
            declared = {match.group(1).strip().lower() for match in re.finditer(r"(?m)^[ \t]*;([^\r\n]*)", inner)}
            if not declared.intersection(wanted[page.lower()]):
                continue
            parsed = extractor.parse_sgtable_block(inner, page, known_titles, {})
            summary["tableBlocksParsed"] += 1
            raw_lines = text[start:end].splitlines()
            for index, subtable in enumerate(parsed["subtables"]):
                if subtable["name"].lower() not in wanted[page.lower()]:
                    continue
                first_line = subtable["line_number"] - 1
                last_line = parsed["subtables"][index + 1]["line_number"] - 1 if index + 1 < len(parsed["subtables"]) else len(raw_lines)
                raw = "\n".join(raw_lines[first_line:last_line]).strip("\n")
                warnings = list(parsed["warnings"]) + list(subtable["warnings"])
                if converted and re.search(r"(?m)^\s*#\s*\d+\s*[,;]", raw):
                    warnings.append("Converted file contains a commented-out weighted row; original probabilities are unverified.")
                if converted and re.search(r"(?m)^\s*\d+\s*-\s*\d+\s*,", raw):
                    warnings.append("Converted file contains range weights; range semantics were not evaluated.")
                if not converted and mask_inactive(raw) != raw:
                    warnings.append("Inactive markup was masked for definition detection; raw source remains unchanged.")
                raw_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
                key = (metadata["sourceFile"], metadata.get("pageId"), page, subtable["name"], block_index, first_line, raw_hash)
                if key not in definitions:
                    definitions[key] = {**metadata, "page": page, "subtable": subtable["name"], "rawSource": raw,
                                        "rawSha256": raw_hash, "entries": subtable["entries"], "warnings": warnings,
                                        "line": text[:start].count("\n") + subtable["line_number"], "blockIndex": block_index,
                                        "revisions": [], "presentInLatest": converted}
                    revision_keys[key] = set()
                found.append(key)
        return found

    for input_file in source["files"]:
        relative = input_file["name"]
        if relative in seen_files:
            raise ValueError("Duplicate source file identity")
        seen_files.add(relative)
        filename = contained_file(root, relative)
        before = filename.stat()
        xml = source["kind"] != "converted-tables"
        actual_hash = digest_file(filename)
        if actual_hash != input_file["sha256"]:
            raise ValueError("Source file hash mismatch: " + relative)
        inputs.append({**input_file, "bytes": before.st_size})
        if not xml:
            page = filename.stem
            summary["pagesScanned"] += 1
            page_titles.add(page)
            page_identities.add((relative, page))
            if page.lower() in wanted:
                summary["relevantPages"] += 1
                encoding = input_file.get("encoding", "utf-8")
                if encoding not in {"utf-8", "cp1252", "latin-1"}:
                    raise ValueError("Unsupported source encoding")
                text = filename.read_text(encoding=encoding)
                summary["distinctRelevantTexts"] += 1
                find_definitions(text, page, {"sourceFile": relative, "sourceSha256": actual_hash,
                                             "pageIdentity": "filename-derived", "encoding": encoding}, converted=True)
        else:
            with xml_input(filename, input_file) as reader:
                for page_element in extractor.iter_pages(reader):
                    summary["pagesScanned"] += 1
                    page = extractor.child_text(page_element, "title")
                    page_id = extractor.child_text(page_element, "id")
                    page_identity = (relative, page, page_id)
                    page_titles.add(page)
                    page_identities.add(page_identity)
                    title_ids.setdefault((relative, page), set()).add(page_id)
                    revisions = [element for element in page_element if extractor.local_name(element.tag) == "revision"]
                    summary["revisionsScanned"] += len(revisions)
                    if page.lower() not in wanted:
                        continue
                    summary["relevantPages"] += 1
                    cache = {}
                    latest = latest_by_page.get(page_identity, ("", -1, ""))
                    for revision in revisions:
                        revision_id = extractor.child_text(revision, "id")
                        timestamp = extractor.child_text(revision, "timestamp")
                        latest = max(latest, (timestamp, int(revision_id) if revision_id.isdigit() else -1, revision_id))
                        text = extractor.child_text(revision, "text")
                        text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
                        if text_hash not in cache:
                            summary["distinctRelevantTexts"] += 1
                            cache[text_hash] = find_definitions(text, page, {"sourceFile": relative,
                                "sourceSha256": actual_hash, "sourceMember": input_file.get("member"),
                                "pageId": page_id, "pageIdentity": "xml-title"})
                        contributor_element = extractor.child_element(revision, "contributor")
                        contributor = {} if contributor_element is None else {
                            field: extractor.child_text(contributor_element, field) for field in ("id", "username", "ip")
                            if extractor.child_text(contributor_element, field)
                        }
                        for key in cache[text_hash]:
                            revision_key = (revision_id, timestamp, text_hash, json.dumps(contributor, sort_keys=True))
                            if revision_key not in revision_keys[key]:
                                definitions[key]["revisions"].append({"id": revision_id, "timestamp": timestamp,
                                                                      "textSha256": text_hash, "contributor": contributor})
                                revision_keys[key].add(revision_key)
                    latest_by_page[page_identity] = latest
                inputs[-1]["xmlSha256"] = reader.digest.hexdigest()
                inputs[-1]["xmlBytes"] = reader.bytes
        after = filename.stat()
        if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
            raise ValueError("Source file changed during scanning: " + relative)
        summary["filesScanned"] += 1
    for definition in definitions.values():
        if "pageId" not in definition:
            continue
        latest = latest_by_page[(definition["sourceFile"], definition["page"], definition["pageId"])]
        definition["presentInLatest"] = any((revision["timestamp"], revision["id"]) == (latest[0], latest[2])
                                            for revision in definition["revisions"])
        definition["latestPageRevision"] = {"id": latest[2], "timestamp": latest[0]}
        if len(title_ids[(definition["sourceFile"], definition["page"])]) > 1:
            definition["warnings"].append("Multiple XML page IDs use this title; identity needs review.")
    summary["uniquePageTitles"] = len(page_titles)
    summary["uniquePageIdentities"] = len(page_identities)
    summary["duplicatePageRecords"] = summary["pagesScanned"] - len(page_identities)
    return {**source, "root": str(root), "files": inputs, "complete": True, "summary": summary,
            "extractorSha256": job["extractor"]["sha256"], "definitions": list(definitions.values())}


if __name__ == "__main__":
    try:
        json.dump(scan(json.load(sys.stdin)), sys.stdout, ensure_ascii=True)
        sys.stdout.write("\n")
    except Exception as error:
        print(type(error).__name__ + ": " + str(error), file=sys.stderr)
        sys.exit(1)