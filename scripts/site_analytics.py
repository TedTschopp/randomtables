#!/usr/bin/env python3
"""Finalize and audit published HTML. Portable stdlib helper shared with consumer builds."""
import argparse
import html
import json
import re
from pathlib import Path

RUNTIME = 'https://tedt.org/assets/analytics/v1/analytics.js'
SCRIPT = re.compile(r'<script\b[^>]*>.*?</script\s*>', re.I | re.S)
CSP_META = re.compile(r'<meta\b[^>]*http-equiv\s*=\s*[\"\']Content-Security-Policy[\"\'][^>]*>', re.I)
CONTENT = re.compile(r'(\bcontent\s*=\s*)([\"\'])(.*?)\2', re.I | re.S)
EMBED = re.compile(r'<script\b[^>]*\bsrc\s*=\s*[\"\']' + re.escape(RUNTIME) + r'[\"\'][^>]*>\s*</script\s*>', re.I)
EXCLUDE_DIRS = {'.git', 'node_modules', 'vendor', '.venv', '__pycache__', '.hosting', '.wrangler', 'test-results', '.cache', '.agents', '.codex', '.github', 'tests', 'test', '_site', '.build', 'downloads', 'bundles'}
ORIGINS = {
    'script-src': ['https://tedt.org/assets/analytics/v1/', 'https://www.googletagmanager.com', 'https://www.clarity.ms', 'https://scripts.clarity.ms', 'https://static.cloudflareinsights.com'],
    'connect-src': ['https://www.google-analytics.com', 'https://region1.google-analytics.com', 'https://*.google-analytics.com', 'https://*.clarity.ms', 'https://cloudflareinsights.com'],
    'img-src': ['https://*.clarity.ms', 'https://c.bing.com', 'https://*.google-analytics.com', 'https://www.googletagmanager.com'],
}

def csp(value):
    directives = {}
    for part in value.split(';'):
        fields = part.split()
        if fields: directives[fields[0]] = fields[1:]
    for key, sources in ORIGINS.items():
        values = directives.setdefault(key, list(directives.get('default-src', ["'self'"])))
        if "'none'" in values: values.remove("'none'")
        for source in sources:
            if source not in values: values.append(source)
    if 'script-src-elem' in directives:
        for source in ORIGINS['script-src']:
            if source not in directives['script-src-elem']: directives['script-src-elem'].append(source)
    return '; '.join(' '.join([key, *values]) for key, values in directives.items())

def eligible(text):
    return bool(re.search(r'<html\b|<!doctype\b', text, re.I)) and not re.search(r'<meta[^>]+http-equiv\s*=\s*[\"\']?refresh', text, re.I)

def competitor(script):
    return bool(re.search(r'(?:src\s*=\s*[\"\'][^\"\']*(?:googletagmanager\.com/gtag/js|google-analytics\.com/(?:analytics|ga)\.js|clarity\.ms/tag/|static\.cloudflareinsights\.com/beacon\.min\.js|main-site-analytics\.js))|(?:clarity\.ms/tag/)|(?:gtag\s*\([\"\']config[\"\'])|(?:\b__cfBeacon\s*=(?!=))', script, re.I))

def masked(path, mode):
    return mode == 'masked' or bool(re.match(r'(?:tools|RPG|inside-ai|game-theory|math-guide)/', path, re.I))

def transform(text, private=False):
    text = SCRIPT.sub(lambda m: '' if competitor(m.group()) or EMBED.fullmatch(m.group()) else m.group(), text)
    def meta(m):
        return CONTENT.sub(lambda a: a.group(1) + a.group(2) + html.escape(csp(html.unescape(a.group(3))), quote=True) + a.group(2), m.group())
    text = CSP_META.sub(meta, text)
    if private:
        text = re.sub(r'\sdata-clarity-unmask(?:\s*=\s*(?:[\"\'][^\"\']*[\"\']|[^\s>]+))?', '', text, flags=re.I)
        text = re.sub(r'(<html\b)([^>]*>)', lambda m: m.group() if re.search(r'\bdata-clarity-mask=', m.group(2), re.I) else m.group(1) + ' data-clarity-mask="true"' + m.group(2), text, count=1, flags=re.I)
        text = re.sub(r'(<body\b)([^>]*>)', lambda m: m.group() if re.search(r'\bdata-clarity-mask=', m.group(2), re.I) else m.group(1) + ' data-clarity-mask="true"' + m.group(2), text, count=1, flags=re.I)
    tag = '<script defer src="' + RUNTIME + '" data-tedt-analytics="v1" data-privacy="' + ('masked' if private else 'standard') + '"></script>'
    # Adjacent insertion avoids adding whitespace on every repeat pass.
    if re.search(r'</head\s*>', text, re.I): return re.sub(r'</head\s*>', lambda m: tag + m.group(), text, count=1, flags=re.I)
    return re.sub(r'(<html\b[^>]*>)', lambda m: m.group() + '<head>' + tag + '</head>', text, count=1, flags=re.I)

def check(text, private=False):
    failures = []
    matches = EMBED.findall(text)
    if len(matches) != 1: failures.append('expected exactly one shared analytics embed')
    elif 'defer' not in matches[0] or ('data-privacy="masked"' if private else 'data-privacy="standard"') not in matches[0]: failures.append('invalid embed mode or loading order')
    if any(competitor(m.group()) for m in SCRIPT.finditer(text)): failures.append('competing collector initialization')
    if private and not re.search(r'<html\b[^>]*data-clarity-mask=[\"\']true[\"\']', text, re.I): failures.append('missing initial content mask')
    if private and re.search(r'<body\b', text, re.I) and not re.search(r'<body\b[^>]*data-clarity-mask=[\"\']true[\"\']', text, re.I): failures.append('missing initial body mask')
    for m in CSP_META.finditer(text):
        value = CONTENT.search(m.group())
        if value and csp(html.unescape(value.group(3))) != html.unescape(value.group(3)): failures.append('CSP is missing collector origins')
    return failures

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('--mode', choices=['standard', 'masked'], default='standard')
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    if not args.directory.is_dir(): parser.error('HTML directory does not exist')
    report = dict(directory=str(args.directory), mode=args.mode, eligible=0, changed=0, skipped=0, failures=[])
    for path in sorted(p for p in args.directory.rglob('*') if p.is_file() and p.suffix.lower() in {'.html', '.htm'}):
        relative = path.relative_to(args.directory)
        if EXCLUDE_DIRS.intersection(relative.parts): continue
        text = path.read_bytes().decode('utf-8')
        if not eligible(text): report['skipped'] += 1; continue
        report['eligible'] += 1
        private = masked(relative.as_posix(), args.mode)
        if not args.check:
            result = transform(text, private)
            if result != text: path.write_bytes(result.encode('utf-8')); report['changed'] += 1
            text = result
        report['failures'].extend(str(relative) + ': ' + reason for reason in check(text, private))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))
    if not report['eligible'] or report['failures']: raise SystemExit(1)

if __name__ == '__main__': main()
