"""Utilidades compartidas para limpiar texto exportado de LinkedIn."""

import re
import unicodedata


def plain(text):
    """Convierte las letras 'negrita/cursiva' Unicode (𝗔𝗧𝗘𝗡𝗧𝗢𝗦) en texto normal."""
    return unicodedata.normalize('NFKC', text)


def fix_brand(text):
    """Reglas de marca: el nombre antiguo "Efecto Wow" ya no se usa."""
    text = re.sub(r'#EfectoWowNewsletter', '#EfectoNewsletter', text, flags=re.I)
    text = re.sub(r'#EfectoWowPodcast', '#EfectoPodcast', text, flags=re.I)
    text = re.sub(r'Efecto\s*Wow\s+Newsletter', 'Efecto Newsletter', text, flags=re.I)
    text = re.sub(r'Efecto\s*Wow\s+Podcast', 'Efecto Podcast', text, flags=re.I)
    target = 'Newsletter' if re.search(r'newsletter|edici[oó]n', text, re.I) else 'Podcast'
    text = re.sub(r'#EfectoWow\b', f'#Efecto{target}', text, flags=re.I)
    text = re.sub(r'Efecto\s*Wow\b', f'Efecto {target}', text, flags=re.I)
    return text


def slugify(text):
    text = unicodedata.normalize('NFKD', plain(text)).encode('ascii', 'ignore').decode()
    text = re.sub(r'[^a-zA-Z0-9]+', '-', text).strip('-').lower()
    text = re.sub(r'-+', '-', text)
    if len(text) > 80:
        text = text[:80].rsplit('-', 1)[0]
    return text.strip('-')


def category(text):
    t = text.lower()
    if re.search(r'\bia\b|inteligencia artificial|chatgpt|gemini|herramientas con ia', t):
        return 'IA'
    if re.search(r'n[uú]mero|dato|m[eé]trica|decisiones|usuario define|analytics', t):
        return 'Datos'
    return 'Marketing'
