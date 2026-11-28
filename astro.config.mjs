// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const SITE = 'https://flopezmiranda.com';
// Fecha de la última revisión de las páginas fijas (inicio, sobre mí, legales…). Cámbiala al editarlas.
const PAGES_UPDATED = '2026-11-07';

// --- Fechas reales para el sitemap (Bing y Google las usan para decidir qué volver a rastrear) ---
const blogDir = './src/content/blog';
const articles = fs
  .readdirSync(blogDir)
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => {
    const fm = fs.readFileSync(`${blogDir}/${f}`, 'utf8').split('---')[1] ?? '';
    const get = (k) => fm.match(new RegExp(`^${k}:\\s*'?([^'\\n]+)'?`, 'm'))?.[1]?.trim();
    return {
      path: `/blog/${f.replace(/\.mdx?$/, '')}/`,
      date: get('updatedDate') ?? get('pubDate'),
      draft: get('draft') === 'true',
      exclusive: get('exclusive') === 'true',
    };
  })
  .filter((a) => !a.draft);
const hasPosts = articles.length > 0;

const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);
const posts = [...readJson('./src/data/linkedin-manual-posts.json'), ...readJson('./src/data/linkedin-posts.json')].filter((p) => p.recent);
const tagSlug = (t) => t.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const latest = (dates) => dates.filter(Boolean).sort().at(-1);

const lastmod = new Map();
const priority = new Map();
for (const a of articles) {
  lastmod.set(a.path, a.date);
  priority.set(a.path, a.exclusive ? 0.9 : 0.7);
}
for (const p of posts) {
  if (!p.slug) continue;
  lastmod.set(`/linkedin/${p.slug}/`, p.date);
  priority.set(`/linkedin/${p.slug}/`, 0.5);
}
const tagDates = {};
for (const p of posts) for (const t of p.tags ?? []) tagDates[tagSlug(t)] = latest([tagDates[tagSlug(t)], p.date]);
for (const [slug, date] of Object.entries(tagDates)) lastmod.set(`/linkedin/tema/${slug}/`, date);
const latestPost = latest(posts.map((p) => p.date));
const latestArticle = latest(articles.map((a) => a.date));
lastmod.set('/linkedin/', latestPost);
lastmod.set('/blog/', latestArticle);
lastmod.set('/', latest([latestPost, latestArticle, PAGES_UPDATED]));
priority.set('/', 1.0);

// --- Tabla periódica: la fecha es la del último cambio del archivo de datos en GitHub ---
let tablaUpdated = PAGES_UPDATED;
try {
  tablaUpdated = execSync('git log -1 --format=%cs -- src/data/tabla-periodica.json src/pages/tabla').toString().trim() || PAGES_UPDATED;
} catch {}
const tabla = JSON.parse(fs.readFileSync('./src/data/tabla-periodica.json', 'utf8'));
lastmod.set('/tabla/', tablaUpdated);
lastmod.set('/tabla/sobre-la-tabla/', tablaUpdated);
priority.set('/tabla/', 0.9);
priority.set('/tabla/sobre-la-tabla/', 0.6);
for (const e of tabla.elementos) {
  const slug = (e.slug ?? e.simbolo).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  lastmod.set(`/tabla/elemento/${slug}/`, tablaUpdated);
  priority.set(`/tabla/elemento/${slug}/`, 0.7);
}
for (const p of ['/blog/', '/linkedin/', '/sobre-mi/', '/guias/']) priority.set(p, 0.8);
for (const p of ['/privacidad/', '/cookies/', '/terminos/']) priority.set(p, 0.2);

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => hasPosts || !page.includes('/blog/'),
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        const date = lastmod.get(path) ?? PAGES_UPDATED;
        return { ...item, lastmod: new Date(date).toISOString(), priority: priority.get(path) ?? 0.6 };
      },
    }),
  ],
});
