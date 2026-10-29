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
