"""Convierte el Excel de analíticas de LinkedIn en src/data/linkedin.json.

Uso:
    pip install openpyxl
    python scripts/import_linkedin.py ruta/al/AnalisisConjunto_....xlsx

El Excel se obtiene en LinkedIn: Análisis > Impresiones de publicaciones >
período "Últimos 365 días" > Exportar.
"""

import json
import re
import sys
import unicodedata
from collections import OrderedDict
from datetime import datetime
from pathlib import Path
from urllib.parse import unquote

import openpyxl

OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'linkedin.json'

# Palabras clave para clasificar cada publicación por tema (si no calza, queda en Marketing).
CATEGORY_KEYWORDS = {
    'IA': ['ia', 'ai', 'gemini', 'nanobanana', 'chatgpt', 'gpt', 'claude', 'openai', 'inteligencia', 'agente', 'agentes', 'prompt'],
    'Datos': ['datos', 'data', 'analytics', 'analyticsadvisor', 'ga4', 'métricas', 'metricas', 'dashboard', 'medición', 'medicion', 'atribución', 'atribucion'],
}


def num(v):
    return int(str(v).replace('.', '').replace(',', '').strip() or 0)


def date(v):
    if isinstance(v, datetime):
        return v.date().isoformat()
    d, m, y = str(v).strip().split('/')
    return f'{y}-{int(m):02d}-{int(d):02d}'


def pct(v):
    s = str(v).replace('\xa0', ' ').strip()
    return 0.5 if s.startswith('<') else float(s.replace('%', '').replace(',', '.').strip())


def title_from_url(url):
    """LinkedIn arma la URL con las primeras palabras del post: las recuperamos."""
    m = re.search(r'/posts/[^_]+_(.+?)-(?:share|ugcPost|activity)-\d+', url)
    if not m:
        return ''
    text = unicodedata.normalize('NFKC', unquote(m.group(1))).replace('-', ' ').strip()
    return text[:1].upper() + text[1:]


def category(title):
    words = set(re.findall(r'\w+', title.lower()))
    for cat, keys in CATEGORY_KEYWORDS.items():
        if words & set(keys):
            return cat
    return 'Marketing'


def rows(ws):
    return [tuple(c for c in r) for r in ws.iter_rows(values_only=True)]


def main(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    by_title = {ws.title.upper(): rows(ws) for ws in wb.worksheets}

    def sheet(prefix):
        return next(v for k, v in by_title.items() if k.startswith(prefix))

    disc = sheet('DESCUBRIMIENTO')
    period_from, period_to = [date(x) for x in str(disc[0][1]).split(' - ')]
    impressions = num(disc[1][1])
    reached = num(disc[2][1])

    # Serie diaria -> mensual
    monthly = OrderedDict()
    for r in sheet('INTERACCIÓN')[1:]:
        if not r[0]:
            continue
        key = date(r[0])[:7]
        m = monthly.setdefault(key, {'month': key, 'impressions': 0, 'interactions': 0, 'newFollowers': 0})
        m['impressions'] += num(r[1])
        m['interactions'] += num(r[2])

    fol = sheet('SEGUIDORES')
    followers = num(fol[0][1])
    new_followers = 0
    for r in fol[3:]:
        if r[0]:
            new_followers += num(r[1])
            key = date(r[0])[:7]
            if key in monthly:
                monthly[key]['newFollowers'] += num(r[1])

    # Publicaciones principales: dos rankings lado a lado (interacciones | impresiones)
    posts = {}
    for r in sheet('PUBLICACIONES')[3:]:
        for url, d, value, field in ((r[0], r[1], r[2], 'interactions'), (r[4], r[5], r[6], 'impressions')):
            if url and str(url).startswith('http'):
                p = posts.setdefault(url, {'url': url, 'date': date(d), 'title': title_from_url(url)})
                p[field] = num(value)
    for p in posts.values():
        p['category'] = category(p['title'])
    top_posts = sorted(posts.values(), key=lambda p: (p.get('impressions', 0), p.get('interactions', 0)), reverse=True)

    # Audiencia: hoja "Información detallada del público" (seguidores), no la "del contenido"
    audience_sheet = sheet('INFORMACIÓN DETALLADA DEL PÚBLI')
    audience = {}
    for r in audience_sheet[1:]:
        if r[0] and r[1]:
            audience.setdefault(r[0], []).append({'label': r[1], 'pct': pct(r[2])})

    data = {
        'period': {'from': period_from, 'to': period_to},
        'followers': followers,
        'newFollowers': new_followers,
        'impressions': impressions,
        'reached': reached,
        'interactions': sum(m['interactions'] for m in monthly.values()),
        'monthly': list(monthly.values()),
        'topPosts': top_posts,
        'audience': audience,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'OK -> {OUT}  ({len(top_posts)} publicaciones, {len(monthly)} meses)')


if __name__ == '__main__':
    main(sys.argv[1])
