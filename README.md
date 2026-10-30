# flopezmiranda.com

Blog de Felipe López Miranda sobre marketing, datos e IA. Hecho con [Astro](https://astro.build) y publicado en GitHub Pages.

## Comandos

| Comando           | Qué hace                                   |
| ----------------- | ------------------------------------------ |
| `npm install`     | Instala dependencias                       |
| `npm run dev`     | Servidor local en `http://localhost:4321`  |
| `npm run build`   | Genera el sitio en `dist/`                 |
| `npm run preview` | Previsualiza el sitio generado             |

## Publicar un artículo

Crea un archivo `.md` en `src/content/blog/` con este encabezado:

```md
---
title: 'Título del artículo'
description: 'Resumen de una línea'
pubDate: 2026-11-01
category: 'Marketing' # Marketing | Datos | IA
tags: ['etiqueta1', 'etiqueta2']
draft: false # true = no se publica
---

Texto del artículo en Markdown...
```

Al hacer push a `main`, GitHub Actions compila y publica el sitio automáticamente.

## Dónde editar

- `src/consts.ts` — nombre, descripción y enlaces a redes.
- `src/pages/sobre-mi.astro` — tu biografía.
- `src/styles/global.css` — colores y tipografía.

## Actualizar las cifras de LinkedIn

1. En LinkedIn: **Análisis → Impresiones de publicaciones → Últimos 365 días → Exportar**.
2. Ejecuta:

   ```bash
   pip install openpyxl
   python scripts/import_linkedin.py ruta/al/AnalisisConjunto_....xlsx
   ```

3. Sube el cambio de `src/data/linkedin.json` a `main` y la web se actualiza sola.

## Importar contenido de LinkedIn

Del archivo "Obtener una copia de tus datos" de LinkedIn:

```bash
pip install markdownify
python scripts/import_linkedin_articles.py ruta/a/Articles   # artículos y newsletter -> src/content/blog/
python scripts/import_linkedin_shares.py ruta/a/Shares.csv    # publicaciones -> src/data/linkedin-posts.json
```

- Los artículos quedan con su fecha original y un enlace al original en LinkedIn. Las imágenes no se copian (los enlaces de LinkedIn caducan).
- `/linkedin/` muestra las publicaciones del último año, agrupadas por mes.
- Ambos scripts aplican la regla de marca: "Efecto Wow" se reemplaza por Efecto Podcast o Efecto Newsletter según el contexto.

## Portadas de los escritos

```bash
python scripts/make_covers.py
```

Genera una portada por artículo en `public/img/covers/` y su imagen para compartir en `public/og/blog/`. El dibujo depende del tema del título (WhatsApp, Google Ads, IA, e-commerce…) y el color, de la categoría. Si agregas un artículo nuevo, vuelve a correrlo.

## SEO, AEO y GEO

- **Datos estructurados**: `src/seo.ts` define la ficha de Persona, el sitio, Efecto Podcast y DroneImagen. Cada página suma lo suyo (preguntas frecuentes, migas de pan, artículo) con la prop `schema` de `Base`.
- **Título, descripción e imagen para redes**: props `title`/`fullTitle`, `description`, `image` de `Base`. Las imágenes para compartir están en `public/og/` (1200×630).
- **`/llms.txt`**: resumen para asistentes de IA, se genera solo en `src/pages/llms.txt.ts` con las cifras de LinkedIn.
- **`robots.txt`**: permite a buscadores y rastreadores de IA.
- **IndexNow**: después de cada publicación, GitHub Actions avisa a Bing y Yandex (clave en `public/<clave>.txt`).
- **Artículos**: si todos los artículos son borradores (`draft: true`), `/blog/` queda fuera del sitemap y con `noindex`.
