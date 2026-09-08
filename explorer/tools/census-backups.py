import hashlib
import json
import re
import runpy
import sys
import tarfile
from pathlib import Path, PurePosixPath


def revision_order(revision):
    identity = revision.get("id", "")
    return revision.get("timestamp", ""), int(identity) if identity.isdigit() else -1, identity


def census(job):
    reader_file = Path(__file__).with_name("scan-backups.py")
    if hashlib.sha256(reader_file.read_bytes()).hexdigest() != job["readerSha256"]:
        raise ValueError("Trusted XML reader hash mismatch")
    reader = runpy.run_path(str(reader_file))
    extractor = reader["load_extractor"](job["extractor"])
    source = job["source"]
    if source["kind"] not in {"baseline", "wiki-export", "converted-tables"}:
        raise ValueError("Unexpected source kind")
    root = Path(source["root"]).resolve(strict=True)
    records = {}
    page_identities = set()
    page_titles = set()
    latest_pages = {}
    inputs = []
    summary = {"filesScanned": 0, "pageRecords": 0, "revisionRecords": 0, "distinctRevisionTexts": 0,
               "tableBlocksParsed": 0, "colonHeaderDeclarations": 0}

    def table_record(page, subtable, metadata):
        key = (metadata["sourceFile"], metadata.get("pageId"), page, subtable)
        if key not in records:
            records[key] = {**metadata, "page": page, "subtable": subtable,
                            "variants": {}, "contributors": {}, "definitionOccurrences": 0,
                            "firstRevision": None, "lastRevision": None, "_latestVariants": set()}
        return key, records[key]

    def definitions(text, page, metadata, converted=False, line_offset=0):
        masked = text if converted else reader["mask_inactive"](text)
        blocks = [(0, len(text), masked)] if converted else [
            (match.start(1), match.end(1), match.group(1)) for match in extractor.SGTABLE_RE.finditer(masked)
        ]
        found = []
        for block_index, (start, end, inner) in enumerate(blocks):
            parsed = extractor.parse_sgtable_block(inner, page, {page}, {})
            summary["tableBlocksParsed"] += 1
            lines = text[start:end].splitlines()
            for index, subtable in enumerate(parsed["subtables"]):
                first = subtable["line_number"] - 1
                last = parsed["subtables"][index + 1]["line_number"] - 1 if index + 1 < len(parsed["subtables"]) else len(lines)
                raw = "\n".join(lines[first:last]).strip("\n")
                raw_hash = hashlib.sha256(raw.encode("utf-8")).hexdigest()
                key, record = table_record(page, subtable["name"], metadata)
                warnings = list(parsed["warnings"]) + list(subtable["warnings"])
                if converted and re.search(r"(?m)^\s*#\s*\d+\s*[,;]", raw):
                    warnings.append("Converted file contains a commented-out weighted row; probabilities need review.")
                if converted and re.search(r"(?m)^\s*\d+\s*-\s*\d+\s*,", raw):
                    warnings.append("Converted file contains range weights; their semantics were not evaluated.")
                if not converted and reader["mask_inactive"](raw) != raw:
                    warnings.append("Inactive markup was masked for detection; the source archive is unchanged.")
                positive = [entry for entry in subtable["entries"] if type(entry["weight"]) is int and 0 < entry["weight"] <= 2**53 - 1]
                variant = {"sha256": raw_hash, "format": "semicolon" if converted else "wiki-sgtable",
                           "parsedRows": len(subtable["entries"]), "positiveRows": len(positive),
                           "totalPositiveWeight": sum(entry["weight"] for entry in positive), "warnings": sorted(set(warnings)),
                           "blockIndex": block_index, "line": line_offset + text[:start].count("\n") + subtable["line_number"]}
                if raw_hash in record["variants"]:
                    variant["warnings"] = sorted(set(variant["warnings"] + record["variants"][raw_hash]["warnings"]))
                record["variants"][raw_hash] = variant
                found.append((key, raw_hash))
        return found

    def converted_definitions(text, page, metadata):
        headers = list(re.finditer(r"(?m)^[ \t]*([;:])([^\r\n]+)", text))
        found = []
        for index, header in enumerate(headers):
            end = headers[index + 1].start() if index + 1 < len(headers) else len(text)
            chunk = text[header.start():end]
            line_offset = text[:header.start()].count("\n")
            if header.group(1) == ";":
                found.extend(definitions(chunk, page, metadata, converted=True, line_offset=line_offset))
                continue
            name = header.group(2).strip()
            if not name:
                continue
            key, record = table_record(page, name, metadata)
            raw_hash = hashlib.sha256(chunk.strip("\n").encode("utf-8")).hexdigest()
            record["variants"][raw_hash] = {"sha256": raw_hash, "format": "colon-declaration", "parsedRows": None,
                "positiveRows": None, "totalPositiveWeight": None, "line": line_offset + 1, "blockIndex": index,
                "warnings": ["Colon-style declaration only; weight and expression semantics were not evaluated."]}
            summary["colonHeaderDeclarations"] += 1
            found.append((key, raw_hash))
        return found

    def observe(found, revision=None):
        for key, raw_hash in found:
            record = records[key]
            record["definitionOccurrences"] += 1
            if revision is None:
                record["_latestVariants"].add(raw_hash)
                continue
            order = revision_order(revision)
            if record["firstRevision"] is None or order < revision_order(record["firstRevision"]):
                record["firstRevision"] = revision
            previous = revision_order(record["lastRevision"]) if record["lastRevision"] else None
            if previous is None or order > previous:
                record["lastRevision"] = revision
                record["_latestVariants"] = {raw_hash}
            elif order == previous:
                record["_latestVariants"].add(raw_hash)
            contributor = revision["contributor"]
            if contributor:
                record["contributors"][json.dumps(contributor, sort_keys=True)] = contributor

    def converted_file(specification, content):
        name = specification["name"]
        if len(content) != specification["bytes"] or hashlib.sha256(content).hexdigest() != specification["sha256"]:
            raise ValueError("Converted table file hash or size mismatch: " + name)
        if specification.get("gitBlobSha1"):
            blob = hashlib.sha1(("blob " + str(len(content)) + "\0").encode() + content).hexdigest()
            if blob != specification["gitBlobSha1"]:
                raise ValueError("Converted Git blob hash mismatch: " + name)
        encoding = specification.get("encoding", "utf-8")
        if encoding not in {"utf-8", "utf-8-sig", "cp1252", "latin-1"}:
            raise ValueError("Unsupported source encoding")
        text = content.decode(encoding)
        page = PurePosixPath(name).stem
        page_identities.add((name, page))
        page_titles.add(page)
        summary["pageRecords"] += 1
        summary["distinctRevisionTexts"] += 1
        colon_headers = len(re.findall(r"(?m)^[ \t]*:[^\r\n]+", text))
        found = converted_definitions(text, page, {"sourceFile": name, "sourceSha256": specification["sha256"],
                              "pageIdentity": "filename-derived"})
        observe(found)
        inputs.append({**specification, "encoding": encoding, "tableIdentities": len({key for key, raw_hash in found}),
                   "colonHeaderDeclarations": colon_headers})
        summary["filesScanned"] += 1

    if source["kind"] == "converted-tables":
        archive = source["archive"]
        filename = reader["contained_file"](root, archive["name"])
        if reader["digest_file"](filename) != archive["sha256"]:
            raise ValueError("Converted archive hash mismatch")
        prefix = PurePosixPath(archive["prefix"])
        if prefix.is_absolute() or ".." in prefix.parts:
            raise ValueError("Unsafe archive member prefix")
        wanted = {}
        for specification in source["files"]:
            relative = PurePosixPath(specification["name"])
            if relative.is_absolute() or ".." in relative.parts:
                raise ValueError("Unsafe converted member name")
            member = str(prefix / relative)
            if member in wanted:
                raise ValueError("Duplicate converted member identity")
            wanted[member] = specification
        seen = set()
        with tarfile.open(filename, mode="r|gz") as stream:
            for member in stream:
                if member.name not in wanted:
                    continue
                if member.name in seen or not member.isfile() or member.size > 90 * 1024 * 1024:
                    raise ValueError("Duplicate or unsafe converted data member")
                specification = wanted[member.name]
                if member.size != specification["bytes"]:
                    raise ValueError("Converted member byte size mismatch")
                with stream.extractfile(member) as content:
                    converted_file(specification, content.read(member.size + 1))
                seen.add(member.name)
        if seen != set(wanted):
            raise ValueError("Converted archive is missing planned table members")
    else:
        seen = set()
        for specification in source["files"]:
            name = specification["name"]
            if name in seen:
                raise ValueError("Duplicate XML file identity")
            seen.add(name)
            filename = reader["contained_file"](root, name)
            before = filename.stat()
            if reader["digest_file"](filename) != specification["sha256"]:
                raise ValueError("XML source archive hash mismatch")
            with reader["xml_input"](filename, specification) as stream:
                for page_element in extractor.iter_pages(stream):
                    page = extractor.child_text(page_element, "title")
                    page_id = extractor.child_text(page_element, "id")
                    page_key = (name, page_id, page)
                    page_identities.add(page_key)
                    page_titles.add(page)
                    summary["pageRecords"] += 1
                    cache = {}
                    for element in page_element:
                        if extractor.local_name(element.tag) != "revision":
                            continue
                        summary["revisionRecords"] += 1
                        text = extractor.child_text(element, "text")
                        text_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
                        contributor_element = extractor.child_element(element, "contributor")
                        contributor = {} if contributor_element is None else {
                            field: extractor.child_text(contributor_element, field) for field in ("id", "username", "ip")
                            if extractor.child_text(contributor_element, field)
                        }
                        revision = {"id": extractor.child_text(element, "id"), "timestamp": extractor.child_text(element, "timestamp"),
                                    "textSha256": text_hash, "contributor": contributor}
                        order = revision_order(revision)
                        if page_key not in latest_pages or order > latest_pages[page_key]["order"]:
                            latest_pages[page_key] = {"order": order, "texts": {text_hash}, "revision": revision}
                        elif order == latest_pages[page_key]["order"]:
                            latest_pages[page_key]["texts"].add(text_hash)
                        if text_hash not in cache:
                            summary["distinctRevisionTexts"] += 1
                            cache[text_hash] = definitions(text, page, {"sourceFile": name, "sourceSha256": specification["sha256"],
                                "pageId": page_id, "pageIdentity": "xml-title"})
                        observe(cache[text_hash], revision)
                decoded_hash = stream.digest.hexdigest()
                if specification.get("xmlSha256") and decoded_hash != specification["xmlSha256"]:
                    raise ValueError("Decoded XML hash mismatch")
                if specification.get("xmlBytes") is not None and stream.bytes != specification["xmlBytes"]:
                    raise ValueError("Decoded XML byte size mismatch")
                inputs.append({**specification, "xmlSha256": decoded_hash, "xmlBytes": stream.bytes})
            after = filename.stat()
            if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
                raise ValueError("Source archive changed during census")
            summary["filesScanned"] += 1

    tables = []
    for key, record in records.items():
        latest_variants = record.pop("_latestVariants")
        record["presentInLatest"] = True
        if "pageId" in record:
            latest = latest_pages[key[:3]]
            record["presentInLatest"] = revision_order(record["lastRevision"]) == latest["order"] if len(latest["texts"]) == 1 else None
            record["latestPageRevision"] = {"id": latest["revision"]["id"], "timestamp": latest["revision"]["timestamp"],
                                            "ambiguous": len(latest["texts"]) > 1}
        latest_rows = [record["variants"][variant]["positiveRows"] for variant in latest_variants]
        record["latestPositiveRows"] = max(latest_rows, default=0) if record["presentInLatest"] and None not in latest_rows else None
        record["variants"] = sorted(record["variants"].values(), key=lambda variant: variant["sha256"])
        record["contributors"] = [value for identity, value in sorted(record["contributors"].items())]
        tables.append(record)
    tables.sort(key=lambda record: (record["page"], record.get("pageId", ""), record["subtable"], record["sourceFile"]))
    inputs.sort(key=lambda specification: specification["name"])
    summary.update({"uniquePageTitles": len(page_titles), "uniquePageIdentities": len(page_identities),
                    "tableIdentities": len(tables), "positiveTableIdentities": sum(any(variant["positiveRows"] for variant in table["variants"]) for table in tables),
                    "latestTableIdentities": sum(table["presentInLatest"] is True for table in tables),
                    "latestPositiveTableIdentities": sum(bool(table["latestPositiveRows"]) for table in tables),
                    "formatReviewTableIdentities": sum(any(variant["positiveRows"] is None for variant in table["variants"]) for table in tables),
                    "definitionVariants": sum(len(table["variants"]) for table in tables),
                    "ambiguousLatestTableIdentities": sum(table["presentInLatest"] is None for table in tables),
                    "filesWithoutNamedTables": sum(specification.get("tableIdentities") == 0 for specification in inputs)})
    return {"schemaVersion": 1, "id": source["id"], "kind": source["kind"], "complete": True,
            "readerSha256": job["readerSha256"], "extractorSha256": job["extractor"]["sha256"],
            "files": inputs, "summary": summary, "tables": tables}


if __name__ == "__main__":
    try:
        json.dump(census(json.load(sys.stdin)), sys.stdout, ensure_ascii=True, separators=(",", ":"))
        sys.stdout.write("\n")
    except Exception as error:
        print(type(error).__name__ + ": " + str(error), file=sys.stderr)
        sys.exit(1)