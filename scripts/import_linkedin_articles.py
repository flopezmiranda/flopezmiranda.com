"""Convierte los artículos exportados de LinkedIn (carpeta Articles/*.html) en entradas del blog.

Uso:
    pip install markdownify
    python scripts/import_linkedin_articles.py ruta/a/Articles

Crea un archivo .md por artículo en src/content/blog/. Las imágenes de LinkedIn no se copian
(sus enlaces caducan); cada artículo usa la portada generada del sitio.
"""

import html as htmllib
import re
import sys
from pathlib import Path

from markdownify import markdownify

sys.path.insert(0, str(Path(__file__).resolve().parent))
from linkedin_text import category, fix_brand, plain, slugify  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / 'src' / 'content' / 'blog'


def yaml_str(s):
    return "'" + s.replace("'", "''") + "'"


def convert(path):
    raw = path.read_text(encoding='utf-8')
    body = raw.split('<body>', 1)[1].rsplit('</body>', 1)[0]
    title = plain(htmllib.unescape(re.search(r'<title>(.*?)</title>', raw, re.S).group(1))).strip()
    url = htmllib.unescape(re.search(r'<h1><a href="([^"]+)"', body).group(1))
    date = re.search(r'class="published">Published on ([\d-]+ [\d:]+)', body) or re.search(r'class="created">Created on ([\d-]+ [\d:]+)', body)
    series = re.search(r'class="series-title">([^<]+)', body)
    edition = re.search(r'Edici[oó]n\s*#\s*(\d+)', title)

    # Contenido: lo que viene después de la fecha de publicación
    content = re.split(r'<p class="published">[^<]*</p>', body, maxsplit=1)[-1]
    content = re.sub(r'<img[^>]*>', '', content)
    content = re.sub(r'<figure[^>]*>\s*</figure>', '', content)
    md = markdownify(content, heading_style='ATX', bullets='-', escape_asterisks=False, escape_underscores=False)
    md = plain(fix_brand(md)).replace('​', '')
    md = re.sub(r'\n{3,}', '\n\n', md).strip()

    clean_title = fix_brand(re.sub(r'\s*\|\s*Edici[oó]n\s*#?\s*\d+\s*$', '', title)).replace('\u200b', '').strip()
    if clean_title.count('"') == 2:  # comillas rectas -> tipográficas
        clean_title = clean_title.replace('"', '“', 1).replace('"', '”', 1)
    # Descripción: primer párrafo con texto real
    paras = [p.strip() for p in re.split(r'\n\s*\n', md) if len(re.sub(r'[*_#>\-\d.\s]', '', p)) > 60]
    first = re.sub(r'[*_#>]', '', paras[0] if paras else clean_title)
    first = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', first)
    desc = re.sub(r'\s+', ' ', first).strip()
    if len(desc) > 155:
        desc = desc[:152].rsplit(' ', 1)[0] + '…'

    cat = category(clean_title)
    tags = ['LinkedIn'] + (['Efecto Newsletter'] if series else [])
    fm = [
        '---',
        f'title: {yaml_str(clean_title)}',
        f'description: {yaml_str(desc)}',
        f'pubDate: {date.group(1)[:10]}',
        f'category: {yaml_str(cat)}',
        f'tags: [{", ".join(yaml_str(t) for t in tags)}]',
        f'originalUrl: {yaml_str(url)}',
    ]
    if series:
        fm.append(f'series: {yaml_str(fix_brand(series.group(1).strip()))}')
    if edition:
        fm.append(f'edition: {edition.group(1)}')
    fm.append('---')
    slug = slugify(clean_title)
    (OUT / f'{slug}.md').write_text('\n'.join(fm) + '\n\n' + md + '\n', encoding='utf-8')
    return slug, date.group(1)[:10], cat, clean_title


def main(folder):
    for f in sorted(Path(folder).glob('*.html')):
        print(*convert(f), sep=' | ')


if __name__ == '__main__':
    main(sys.argv[1])
