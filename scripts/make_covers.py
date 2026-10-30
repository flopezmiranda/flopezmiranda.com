"""Genera la portada de cada escrito (src/content/blog/*.md).

Uso:
    python scripts/make_covers.py

Crea public/img/covers/<slug>.webp (1600x900, portada del artículo y tarjetas) y
public/og/blog/<slug>.png (1200x630, imagen al compartir). El dibujo depende del tema
(palabras clave del título) y los colores de la categoría.
"""

import math
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / 'src' / 'content' / 'blog'
COVERS = ROOT / 'public' / 'img' / 'covers'
OG = ROOT / 'public' / 'og' / 'blog'
FONTS = Path('/usr/share/fonts/opentype/inter')
W, H = 1600, 900

PALETTES = {
    'Marketing': ('#0b1b3a', '#1d4fd8', '#2f6bff'),
    'Datos': ('#04253a', '#0a6aa8', '#00b3ff'),
    'IA': ('#170f45', '#4338ca', '#7c6bff'),
}
WHITE = (255, 255, 255)
YELLOW = '#ffd60a'


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def frontmatter(md):
    fm = md.split('---', 2)[1]
    get = lambda k: (re.search(rf"^{k}:\s*'?(.*?)'?\s*$", fm, re.M) or [None, None])[1]
    return {k: get(k) for k in ('title', 'category', 'series', 'edition', 'pubDate')}


# --- Dibujos por tema (trazos blancos sobre el fondo) --------------------------------

def line(d, pts, w=14, fill=WHITE):
    d.line(pts, fill=fill, width=w, joint='curve')


def ring(d, cx, cy, r, w=14, fill=WHITE):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=fill, width=w)


def m_chat(d, x, y):
    d.rounded_rectangle((x, y, x + 380, y + 230), 60, outline=WHITE, width=14)
    d.polygon([(x + 70, y + 222), (x + 40, y + 310), (x + 150, y + 222)], fill=WHITE)
    for i in range(3):
        d.ellipse((x + 110 + i * 70, y + 100, x + 140 + i * 70, y + 130), fill=WHITE)
    d.rounded_rectangle((x + 200, y + 280, x + 470, y + 430), 50, fill=YELLOW)
    d.polygon([(x + 400, y + 425), (x + 450, y + 490), (x + 360, y + 425)], fill=YELLOW)


def m_bars(d, x, y):
    for i, h in enumerate((140, 220, 300, 400)):
        d.rounded_rectangle((x + i * 110, y + 430 - h, x + i * 110 + 72, y + 430), 14, fill=WHITE if i < 3 else YELLOW)
    line(d, [(x - 10, y + 250), (x + 140, y + 170), (x + 250, y + 210), (x + 420, y + 40)], 12)
    d.polygon([(x + 430, y + 30), (x + 370, y + 40), (x + 420, y + 90)], fill=WHITE)


def m_search(d, x, y):
    d.rounded_rectangle((x, y + 40, x + 460, y + 140), 50, outline=WHITE, width=12)
    ring(d, x + 400, y + 90, 26, 10)
    line(d, [(x + 418, y + 108), (x + 440, y + 130)], 10)
    m_bars(d, x + 40, y + 120)


def m_spark(d, x, y):
    def star(cx, cy, r, fill):
        pts = []
        for i in range(8):
            a = math.pi / 4 * i
            rr = r if i % 2 == 0 else r * 0.28
            pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
        d.polygon(pts, fill=fill)
    nodes = [(x + 40, y + 380), (x + 180, y + 300), (x + 320, y + 420), (x + 420, y + 260)]
    for a, b in zip(nodes, nodes[1:]):
        line(d, [a, b], 6)
    for n in nodes:
        d.ellipse((n[0] - 18, n[1] - 18, n[0] + 18, n[1] + 18), fill=WHITE)
    star(x + 230, y + 120, 130, WHITE)
    star(x + 420, y + 60, 60, YELLOW)


def m_bag(d, x, y):
    d.rounded_rectangle((x + 40, y + 140, x + 400, y + 470), 40, outline=WHITE, width=14)
    d.arc((x + 130, y + 40, x + 310, y + 240), 180, 360, fill=WHITE, width=14)
    d.ellipse((x + 190, y + 270, x + 250, y + 330), fill=YELLOW)


def m_phone(d, x, y):
    d.rounded_rectangle((x + 100, y, x + 360, y + 480), 40, outline=WHITE, width=14)
    for r in range(3):
        for c in range(2):
            d.rounded_rectangle((x + 140 + c * 95, y + 60 + r * 120, x + 220 + c * 95, y + 160 + r * 120), 14, fill=YELLOW if (r, c) == (0, 0) else WHITE)


def m_play(d, x, y):
    d.rounded_rectangle((x, y + 40, x + 460, y + 330), 50, outline=WHITE, width=14)
    d.polygon([(x + 190, y + 120), (x + 190, y + 250), (x + 300, y + 185)], fill=WHITE)
    d.rounded_rectangle((x + 20, y + 370, x + 170, y + 430), 30, fill=YELLOW)
    d.ellipse((x + 40, y + 388, x + 64, y + 412), fill='#e11d48')


def m_ball(d, x, y):
    cx, cy, r = x + 230, y + 240, 210
    ring(d, cx, cy, r, 14)
    pts = [(cx + 70 * math.cos(math.pi / 2 + i * 2 * math.pi / 5), cy - 70 * math.sin(math.pi / 2 + i * 2 * math.pi / 5)) for i in range(5)]
    d.polygon(pts, fill=WHITE)
    for px, py in pts:
        ang = math.atan2(py - cy, px - cx)
        line(d, [(px, py), (cx + (r - 6) * math.cos(ang), cy + (r - 6) * math.sin(ang))], 10)
    d.ellipse((x + 380, y - 10, x + 470, y + 80), fill=YELLOW)


def m_megaphone(d, x, y):
    d.polygon([(x + 60, y + 180), (x + 330, y + 40), (x + 330, y + 440), (x + 60, y + 300)], outline=WHITE, width=14)
    d.rectangle((x + 10, y + 180, x + 70, y + 300), outline=WHITE, width=14)
    for i, r in enumerate((60, 110)):
        d.arc((x + 330 - r, y + 240 - r * 1.4, x + 330 + r + 40, y + 240 + r * 1.4), -40, 40, fill=YELLOW if i else WHITE, width=12)


def m_house(d, x, y):
    d.polygon([(x + 40, y + 220), (x + 230, y + 50), (x + 420, y + 220)], outline=WHITE, width=14)
    d.rectangle((x + 90, y + 210, x + 370, y + 460), outline=WHITE, width=14)
    d.rectangle((x + 190, y + 320, x + 270, y + 460), fill=WHITE)
    d.rounded_rectangle((x + 300, y + 120, x + 480, y + 200), 20, fill=YELLOW)


def m_target(d, x, y):
    for r, c in ((220, WHITE), (150, WHITE), (80, YELLOW)):
        ring(d, x + 230, y + 250, r, 14, c)
    line(d, [(x + 230, y + 250), (x + 440, y + 40)], 14)
    d.polygon([(x + 450, y + 30), (x + 380, y + 40), (x + 440, y + 100)], fill=WHITE)


def m_funnel(d, x, y):
    d.polygon([(x + 20, y + 40), (x + 440, y + 40), (x + 280, y + 260), (x + 280, y + 440), (x + 180, y + 470), (x + 180, y + 260)], outline=WHITE, width=14)
    for i in range(3):
        d.ellipse((x + 120 + i * 90, y - 40 + (i % 2) * 30, x + 170 + i * 90, y + 10 + (i % 2) * 30), fill=YELLOW if i == 1 else WHITE)


def m_tree(d, x, y):
    root, mid, leaves = (x + 230, y + 40), [(x + 100, y + 230), (x + 360, y + 230)], [(x + 30, y + 420), (x + 170, y + 420), (x + 290, y + 420), (x + 430, y + 420)]
    for m in mid:
        line(d, [root, m], 10)
    for i, l in enumerate(leaves):
        line(d, [mid[i // 2], l], 10)
    for p in [root] + mid:
        d.ellipse((p[0] - 34, p[1] - 34, p[0] + 34, p[1] + 34), fill=WHITE)
    for i, p in enumerate(leaves):
        d.ellipse((p[0] - 30, p[1] - 30, p[0] + 30, p[1] + 30), fill=YELLOW if i == 2 else WHITE)


def m_alert(d, x, y):
    d.polygon([(x + 230, y + 20), (x + 450, y + 420), (x + 10, y + 420)], outline=WHITE, width=14)
    d.rounded_rectangle((x + 214, y + 150, x + 246, y + 310), 12, fill=YELLOW)
    d.ellipse((x + 210, y + 340, x + 250, y + 380), fill=YELLOW)


def m_rocket(d, x, y):
    d.polygon([(x + 230, y), (x + 320, y + 160), (x + 320, y + 360), (x + 140, y + 360), (x + 140, y + 160)], outline=WHITE, width=14)
    ring(d, x + 230, y + 200, 40, 12, YELLOW)
    d.polygon([(x + 140, y + 270), (x + 60, y + 380), (x + 140, y + 360)], fill=WHITE)
    d.polygon([(x + 320, y + 270), (x + 400, y + 380), (x + 320, y + 360)], fill=WHITE)
    d.polygon([(x + 180, y + 380), (x + 230, y + 480), (x + 280, y + 380)], fill=YELLOW)


MOTIFS = [
    (r'whatsapp', m_chat),
    (r'google ads', m_search),
    (r'herramientas|ia aplicada|\bia\b', m_spark),
    (r'shopify|ecommerce|e-commerce', m_bag),
    (r'facebook|collection', m_phone),
    (r'pollo|influenc', m_play),
    (r'argentin|f[uú]tbol|messi|psg', m_ball),
    (r'gobierno|video', m_megaphone),
    (r'inmobiliario|cybermonday', m_house),
    (r'crisis|cuarentena', m_alert),
    (r'decisiones', m_tree),
    (r'usuario|n[uú]mero', m_funnel),
    (r'vender de todo', m_rocket),
    (r'branding|performance', m_target),
]


def wrap(draw, text, fnt, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        test = f'{cur} {w}'.strip()
        if draw.textlength(test, font=fnt) <= width:
            cur = test
        else:
            lines.append(cur)
            cur = w
    return lines + [cur]


def cover(meta, slug):
    dark, mid, accent = PALETTES.get(meta['category'], PALETTES['Marketing'])
    im = Image.new('RGB', (W, H), dark)
    # Degradado diagonal + brillo
    grad = Image.linear_gradient('L').rotate(90).resize((W, H)).filter(ImageFilter.GaussianBlur(40))
    im = Image.composite(Image.new('RGB', (W, H), mid), im, grad)
    glow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(glow).ellipse((W - 900, -300, W + 200, 800), fill=150)
    im = Image.composite(Image.new('RGB', (W, H), accent), im, glow.filter(ImageFilter.GaussianBlur(160)))
    d = ImageDraw.Draw(im, 'RGBA')
    for gx in range(0, W, 80):
        d.line([(gx, 0), (gx, H)], fill=(255, 255, 255, 14), width=1)
    for gy in range(0, H, 80):
        d.line([(0, gy), (W, gy)], fill=(255, 255, 255, 14), width=1)

    # Dibujo del tema a la derecha
    title = meta['title']
    motif = next((fn for pat, fn in MOTIFS if re.search(pat, (title + ' ' + slug).lower())), m_target)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    motif(ImageDraw.Draw(layer), 1040, 200)
    im.paste(layer, (0, 0), layer)
    d = ImageDraw.Draw(im, 'RGBA')

    # Etiquetas
    x = 90
    kicker = f"{meta['category'].upper()} · {meta['pubDate'][:4]}"
    d.text((x, 90), kicker, font=font('Inter-Bold.otf', 30), fill=(255, 255, 255, 220))
    if meta['series']:
        label = f"EFECTO NEWSLETTER{' · #' + meta['edition'] if meta['edition'] else ''}"
        f = font('Inter-Black.otf', 28)
        tw = d.textlength(label, font=f)
        d.rounded_rectangle((x, 140, x + tw + 44, 192), 26, fill=YELLOW)
        d.text((x + 22, 147), label, font=f, fill='#0b1b3a')

    # Título: se achica hasta caber en 5 líneas
    clean = re.sub(r'\s+', ' ', title.replace('“', '"').replace('”', '"')).strip()
    for size in (88, 80, 72, 64, 58, 52):
        f = font('InterDisplay-Black.otf', size)
        lines = wrap(d, clean, f, 860)
        if len(lines) <= 5:
            break
    y = H - 140 - len(lines) * int(size * 1.08)
    for ln in lines:
        d.text((x, y), ln, font=f, fill=WHITE)
        y += int(size * 1.08)

    # Pie
    d.rounded_rectangle((x, H - 96, x + 74, H - 56), 10, fill=WHITE)
    d.text((x + 37, H - 76), 'FLM', font=font('Inter-Black.otf', 22), fill=dark, anchor='mm')
    d.text((x + 92, H - 76), 'Felipe López Miranda · flopezmiranda.com', font=font('Inter-Medium.otf', 26), fill=(255, 255, 255, 210), anchor='lm')
    return im


def main():
    COVERS.mkdir(parents=True, exist_ok=True)
    OG.mkdir(parents=True, exist_ok=True)
    for md in sorted(BLOG.glob('*.md')):
        meta = frontmatter(md.read_text(encoding='utf-8'))
        im = cover(meta, md.stem)
        im.save(COVERS / f'{md.stem}.webp', 'WEBP', quality=84)
        og = im.resize((1200, 675)).crop((0, 22, 1200, 652))
        og.save(OG / f'{md.stem}.png', optimize=True)
        print(md.stem)


if __name__ == '__main__':
    main()
