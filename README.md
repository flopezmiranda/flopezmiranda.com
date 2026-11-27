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

### Publicaciones sueltas (solo el texto)

```bash
python scripts/add_linkedin_post.py post.txt [--date AAAA-MM-DD] [--url ENLACE] [--image diseño.png]
```

Se guardan en `src/data/linkedin-manual-posts.json` y se mezclan con las del Shares.csv (sin duplicar). Con `--image`, el diseño (1080×1350) queda como imagen principal y para compartir.

## Portadas de los escritos

```bash
python scripts/make_covers.py
```

Genera una portada por artículo en `public/img/covers/` y su imagen para compartir en `public/og/blog/`. El dibujo depende del tema del título (WhatsApp, Google Ads, IA, e-commerce…) y el color, de la categoría. Si agregas un artículo nuevo, vuelve a correrlo. También crea portadas para las 50 publicaciones de "Lo más leído" (`public/img/covers/posts/`, `public/og/posts/`); vuelve a correrlo cuando actualices las cifras de LinkedIn.

## Tabla periódica del performance marketing (`/tabla`)

La tabla vive en [flopezmiranda.com/tabla](https://flopezmiranda.com/tabla/). Tiene la página principal interactiva, una página por elemento (`/tabla/elemento/roas/`) y la página `/tabla/sobre-la-tabla/`. Todo sale de **un solo archivo**: `src/data/tabla-periodica.json`.

### Editar un elemento y publicarlo en 5 pasos (desde el navegador, sin instalar nada)

1. **Abre el archivo.** Entra a github.com/flopezmiranda/flopezmiranda.com, haz clic en la carpeta `src`, luego en `data` y luego en `tabla-periodica.json`.
2. **Activa la edición.** Haz clic en el ícono del lápiz ✏️ (arriba a la derecha del archivo, "Edit this file").
3. **Haz el cambio.** Busca el elemento con `Ctrl + F` (por ejemplo, `"simbolo": "ROAS"`) y cambia el texto que está entre comillas. Deja las comillas, los dos puntos y las comas tal como están.
   - **Agregar** un elemento: copia un bloque completo, desde `{` hasta `},`, pégalo debajo y cambia sus datos. Revisa que su `nivel` y su `columna` no los ocupe otro elemento.
   - **Borrar** un elemento: elimina su bloque completo y quita su símbolo de las listas `reacciona_con` de los demás.
4. **Guarda.** Haz clic en el botón verde **Commit changes…**, escribe una frase corta de lo que cambiaste (por ejemplo, "Corrijo definición de ROAS") y vuelve a hacer clic en **Commit changes** (con la opción "Commit directly to the main branch").
5. **Espera unos 3 minutos y revisa.** En la pestaña **Actions** del repositorio vas a ver la publicación en curso. Si termina con ✅ verde, el cambio ya está en la web. Si termina con ❌ rojo, haz clic en ella: el mensaje dice en español qué falta o qué está mal (por ejemplo, un símbolo repetido). Mientras lo arreglas, la versión anterior del sitio sigue en línea.

### Qué significa cada campo

| Campo | Qué es | Ejemplo |
| --- | --- | --- |
| `simbolo` | Las letras grandes de la casilla. También forma la dirección de su página (`/tabla/elemento/roas/`). Si lo cambias, cambia la dirección y los enlaces que ya compartiste dejan de funcionar. | `"ROAS"` |
| `nombre_corto` | El texto chico bajo el símbolo, en la tabla. | `"Retorno ads"` |
| `nombre` | El nombre completo (título de la ficha y de su página). | `"Retorno sobre la inversión publicitaria"` |
| `capa` | Señales, Audiencias, Creatividad, Optimización, Métricas, Medición o Plataformas (escrito igual, con tilde). | `"Métricas"` |
| `nivel` | Fila de madurez, del 1 (Fundamentos) al 5 (Ventaja). Las plataformas no lo llevan. | `3` |
| `columna` | Cada capa tiene 2 columnas: `1` (izquierda) o `2` (derecha). En Plataformas es la posición en la fila de abajo (1 a 12). | `2` |
| `que_es` | Qué es. | |
| `como_se_mide` | Cómo se mide. En las plataformas se muestra como "Dónde rinde". | |
| `error_comun` | El error más común. | |
| `reacciona_con` | Lista de símbolos con los que se conecta (las líneas animadas). Respeta mayúsculas y minúsculas. | `["Vc", "Pv", "MER"]` |
| `concepto_propio` | Opcional. `true` muestra la etiqueta "Concepto de Arquitectura de Aprendizaje". | `true` |

El número de cada elemento (1 a 66) es su orden dentro del archivo. Al inicio del archivo están los colores de cada capa, los nombres de los niveles y `elemento_inicial`, el que se muestra abierto al entrar.

### Lo que se genera solo

- Las 66 páginas de elementos, con su título, descripción y datos estructurados (schema.org `DefinedTerm` y `DefinedTermSet`).
- Las imágenes para compartir en LinkedIn (1200×630): `/tabla/og/tabla.png` y una por elemento (`/tabla/og/roas.png`). Las dibuja `src/lib/tabla-og.ts` con la tipografía Archivo (`src/assets/tabla-fonts/`).
- El sitemap, con la fecha del último cambio del archivo de datos.

### Google Analytics 4

Cambia `GA4_ID` en `src/consts.ts` por tu ID de medición (empieza con `G-`). Mientras diga `G-XXXXXXXXXX`, Analytics no se carga. Eventos que registra:

- `elemento_click`: cada vez que se abre un elemento. Parámetros: `elemento` (símbolo), `elemento_nombre`, `capa` y `origen` (`tabla`, `ficha`, `teclado` o `buscador`).
- `ver_pagina_completa`: clic en "Ver página completa" de la ficha.

Para verlos como columnas en tus informes, en GA4 ve a **Administrar → Definiciones personalizadas → Crear dimensión personalizada** y crea `elemento`, `capa` y `origen` (alcance: Evento).

### Dónde está cada pieza

- `src/data/tabla-periodica.json`: los datos (lo único que necesitas editar).
- `src/lib/tabla.ts`: lee y revisa los datos.
- `src/components/tabla/`: la tabla, las casillas, la ficha, el buscador, la barra, el pie, el `<head>` y Analytics.
- `src/scripts/tabla.ts`: la interacción (ficha, líneas animadas, filtros, flechas del teclado).
- `src/styles/tabla.css`: el diseño.
- `src/pages/tabla/`: las páginas y las imágenes para compartir.

## SEO, AEO y GEO

- **Datos estructurados**: `src/seo.ts` define la ficha de Persona, el sitio, Efecto Podcast y DroneImagen. Cada página suma lo suyo (preguntas frecuentes, migas de pan, artículo) con la prop `schema` de `Base`.
- **Título, descripción e imagen para redes**: props `title`/`fullTitle`, `description`, `image` de `Base`. Las imágenes para compartir están en `public/og/` (1200×630).
- **`/llms.txt`**: resumen para asistentes de IA, se genera solo en `src/pages/llms.txt.ts` con las cifras de LinkedIn.
- **`robots.txt`**: permite a buscadores y rastreadores de IA.
- **IndexNow**: después de cada publicación, GitHub Actions avisa a Bing y Yandex (clave en `public/<clave>.txt`).
- **`/llms-full.txt`**: texto completo de guías y artículos para asistentes de IA (`src/pages/llms-full.txt.ts`).
- **RSS**: `/rss.xml` (escritos) y `/linkedin/rss.xml` (publicaciones).
- **Sitemap con fechas reales**: `astro.config.mjs` toma la fecha de cada artículo y publicación. Cambia `PAGES_UPDATED` cuando edites páginas fijas.
- **Guías (AEO)**: los campos `tldr` (respuesta rápida) y `faq` del frontmatter se muestran en la página y generan datos estructurados FAQPage.
- **Bing**: `BING_VERIFICATION` en `src/consts.ts` agrega la meta `msvalidate.01` si no importaste el sitio desde Search Console.
- **Fuentes**: Poppins e Inter alojadas en el sitio con `@fontsource` (sin Google Fonts).
- **Artículos**: si todos los artículos son borradores (`draft: true`), `/blog/` queda fuera del sitemap y con `noindex`.
