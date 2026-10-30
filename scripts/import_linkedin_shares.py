"""Convierte Shares.csv (exportación de datos de LinkedIn) en src/data/linkedin-posts.json.

Uso:
    python scripts/import_linkedin_shares.py ruta/a/Shares.csv [meses]

Guarda las publicaciones de los últimos N meses (12 por defecto) más las que aparecen en
"Lo más leído" (src/data/linkedin.json), con el texto limpio para mostrarlo en el sitio.
"""

import csv
import json
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from linkedin_text import category, fix_brand, plain  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'linkedin-posts.json'
STATS = ROOT / 'src' / 'data' / 'linkedin.json'


def clean(text):
    # LinkedIn exporta cada línea entre comillas: "línea"\n"línea"
    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if line.startswith('"'):
            line = line[1:]
        if line.endswith('"') and not line.endswith('""'):
            line = line[:-1]
        lines.append(line.replace('""', '"').strip())
    text = '\n'.join(lines)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return plain(fix_brand(text))


def post_id(url):
    m = re.search(r'(\d{15,})', url)
    return m.group(1) if m else None


def main(path, months=12):
    rows = list(csv.DictReader(open(path, encoding='utf-8')))
    top_ids = {post_id(p['url']) for p in json.loads(STATS.read_text())['topPosts']}
    since = (datetime.now() - timedelta(days=30 * months)).strftime('%Y-%m-%d')
    posts = []
    for r in rows:
        pid = post_id(r['ShareLink'])
        text = clean(r.get('ShareCommentary') or '')
        if not pid or not text or (r['Date'][:10] < since and pid not in top_ids):
            continue
        headline = next((l for l in text.split('\n') if len(re.sub(r'\W', '', l)) > 3), text)[:140]
        posts.append({
            'id': pid,
            'date': r['Date'][:10],
            'url': f'https://www.linkedin.com/feed/update/{r["ShareLink"].rsplit("/", 1)[-1]}',
            'headline': headline.strip(),
            'text': text[:1200],
            'category': category(text),
            'recent': r['Date'][:10] >= since,
        })
    posts.sort(key=lambda p: p['date'], reverse=True)
    OUT.write_text(json.dumps(posts, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'OK -> {OUT} ({sum(p["recent"] for p in posts)} del último año, {len(posts)} en total)')


if __name__ == '__main__':
    main(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 12)
