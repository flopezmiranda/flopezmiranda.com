// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Si todos los artículos son borradores, /blog/ queda fuera del sitemap (la página es noindex).
const hasPosts = fs
  .readdirSync('./src/content/blog')
  .some((f) => /\.mdx?$/.test(f) && !/^draft:\s*true/m.test(fs.readFileSync(`./src/content/blog/${f}`, 'utf8')));

export default defineConfig({
  site: 'https://flopezmiranda.com',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => hasPosts || !page.includes('/blog/'),
      serialize: (item) => ({ ...item, lastmod: new Date().toISOString() }),
    }),
  ],
});
