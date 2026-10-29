import { getCollection } from 'astro:content';

/** Artículos publicados (sin borradores), del más reciente al más antiguo. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Minutos estimados de lectura (≈200 palabras por minuto). */
export function readingTime(body = '') {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}
