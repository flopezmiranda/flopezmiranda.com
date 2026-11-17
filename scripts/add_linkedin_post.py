"""Agrega una publicación de LinkedIn pegada a mano (solo el texto) al sitio.

Uso:
    python scripts/add_linkedin_post.py <texto.txt> [--date AAAA-MM-DD] [--url ENLACE] [--image ruta.png]

Guarda la publicación en src/data/linkedin-manual-posts.json, que se mezcla con las importadas del
Shares.csv y no se pierde al volver a importar. Con --image, copia el diseño a
public/img/posts/<slug>.png y lo usa como imagen principal y para compartir.
"""

import argparse
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from import_linkedin_shares import clean  # noqa: E402
from linkedin_text import category, slugify  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
MANUAL = ROOT / 'src' / 'data' / 'linkedin-manual-posts.json'
IMPORTED = ROOT / 'src' / 'data' / 'linkedin-posts.json'
PROFILE_ACTIVITY = 'https://www.linkedin.com/in/flopezmiranda/recent-activity/all/'


def norm(t):
    return re.sub(r'\W+', '', t.lower())[:300]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('textfile')
    ap.add_argument('--date', default=date.today().isoformat())
    ap.add_argument('--url', default='')
    ap.add_argument('--image', default='')
    a = ap.parse_args()

    text = clean(Path(a.textfile).read_text(encoding='utf-8-sig'))
    manual = json.loads(MANUAL.read_text()) if MANUAL.exists() else []
    imported = json.loads(IMPORTED.read_text())
    if any(norm(p['text']) == norm(text) for p in manual + imported):
        print('Ya existe: no se agrega.')
        return

    headline = next((l for l in text.split('\n') if len(re.sub(r'\W', '', l)) > 3), text)[:140].strip()
    used = {p.get('slug') for p in manual + imported}
    base = slugify(re.sub(r'#\w+', '', headline))[:60].rsplit('-', 1)[0] or 'publicacion'
    slug = base if base not in used else f'{base}-{a.date}'
    m = re.search(r'(\d{15,})', a.url)
    post = {
        'id': m.group(1) if m else f'manual-{a.date}-{slug}',
        'date': a.date,
        'url': a.url or PROFILE_ACTIVITY,
        'headline': headline,
        'text': text,
        'words': len(re.findall(r'\w+', text)),
        'slug': slug,
        'tags': sorted({t.lower() for t in re.findall(r'#(\w+)', text)}),
        'category': category(text),
        'recent': True,
        'manual': True,
    }
    if a.image:
        dest = ROOT / 'public' / 'img' / 'posts' / f'{slug}.png'
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(a.image, dest)
        post['image'] = f'/img/posts/{slug}.png'
    manual.insert(0, post)
    MANUAL.write_text(json.dumps(manual, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'OK -> /linkedin/{slug}/ ({post["words"]} palabras, {post["category"]})')


if __name__ == '__main__':
    main()
