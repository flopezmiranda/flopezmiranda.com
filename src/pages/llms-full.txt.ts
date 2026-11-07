// /llms-full.txt: todo el contenido escrito del sitio en un solo archivo de texto, para asistentes de IA.
import type { APIRoute } from 'astro';
import { SHARES, LINKEDIN, formatNumber, postTitle, noEmoji } from '../data/linkedin';
import { LINKEDIN_URL } from '../consts';
import { getPosts } from '../utils';

const SITE = 'https://flopezmiranda.com';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const guides = posts.filter((p) => p.data.exclusive);
  const articles = posts.filter((p) => !p.data.exclusive);
  const article = (p: (typeof posts)[number]) =>
    [
      `## ${p.data.title}`,
      `URL: ${SITE}/blog/${p.id}/`,
      `Fecha: ${p.data.pubDate.toISOString().slice(0, 10)} · Categoría: ${p.data.category}${p.data.series ? ` · ${p.data.series}` : ''}`,
      p.data.tldr ? `Respuesta rápida: ${p.data.tldr}` : `Resumen: ${p.data.description}`,
      '',
      (p.body ?? '').trim(),
      ...(p.data.faq.length ? ['', '### Preguntas frecuentes', ...p.data.faq.map((f) => `- ${f.q} ${f.a}`)] : []),
    ].join('\n');
  const shares = SHARES.filter((p) => p.slug && p.recent);
  const body = [
    '# Felipe López Miranda: contenido completo',
    '',
    `> Texto íntegro de las guías y artículos de flopezmiranda.com, y el listado de sus ${shares.length} publicaciones de LinkedIn del último año. Autor: Felipe López Miranda, CMO & Growth Lead de TOCTOC, periodista y Magíster en Dirección de Marketing (UDP), con ${formatNumber(LINKEDIN.followers)} seguidores en LinkedIn (${LINKEDIN_URL}). Resumen del sitio: ${SITE}/llms.txt`,
    '',
    '# Guías exclusivas',
    '',
    guides.map(article).join('\n\n---\n\n'),
    '',
    '# Artículos y ediciones de la newsletter',
    '',
    articles.map(article).join('\n\n---\n\n'),
    '',
    '# Publicaciones de LinkedIn (último año)',
    '',
    ...shares.map((p) => `- ${p.date} · [${noEmoji(postTitle(p))}](${SITE}/linkedin/${p.slug}/)`),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
