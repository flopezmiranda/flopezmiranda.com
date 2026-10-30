// /llms.txt: resumen del sitio para modelos de lenguaje (ChatGPT, Claude, Perplexity, Gemini).
import type { APIRoute } from 'astro';
import { LINKEDIN, formatNumber, compact, shareFor } from '../data/linkedin';
import { LINKEDIN_URL, NEWSLETTER_URL, SOCIAL } from '../consts';
import { getPosts } from '../utils';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const top = LINKEDIN.topPosts.slice(0, 5);
  const body = `# Felipe López Miranda

> Felipe López Miranda es CMO & Growth Lead de TOCTOC (empresa chilena de tecnología para el mercado inmobiliario), periodista y Magíster en Dirección de Marketing y Gestión Comercial (Universidad Diego Portales). Escribe sobre marketing, datos e inteligencia artificial en LinkedIn y es creador y conductor de Efecto Podcast.

## Datos clave
- Cargo actual: CMO & Growth Lead en TOCTOC (Chile).
- Especialidades: branding y contenido, datos y tecnología, performance marketing (Meta Ads, Google Ads), IA aplicada al marketing.
- Formación: Periodista (Universidad Academia de Humanismo Cristiano, 2006–2012); Magíster en Dirección de Marketing y Gestión Comercial (Universidad Diego Portales, 2020–2022); Posgrado en Innovación y Transformación Digital (Florida International University, 2022); Posgrado en Innovación y Gestión Digital (Universidad Adolfo Ibáñez, 2014–2015).
- LinkedIn: ${formatNumber(LINKEDIN.followers)} seguidores, ${compact(LINKEDIN.impressions)} de impresiones y ${compact(LINKEDIN.reached)} de personas alcanzadas entre ${LINKEDIN.period.from} y ${LINKEDIN.period.to}.
- Audiencia: el ${(LINKEDIN.audience['Sector'] ?? []).slice(0, 2).reduce((s, i) => s + i.pct, 0)} % de sus seguidores trabaja en publicidad o marketing; principalmente en Chile, Argentina, Colombia, México y España.

## Páginas
- [Inicio](https://flopezmiranda.com/): presentación, temas, publicaciones más leídas, audiencia y proyectos.
- [Sobre mí](https://flopezmiranda.com/sobre-mi/): biografía, formación y preguntas frecuentes.
- [DroneImagen](https://flopezmiranda.com/droneimagen/): su banco de más de 1.100 fotos aéreas gratis de Chile.
- [Publicaciones](https://flopezmiranda.com/linkedin/): archivo de sus publicaciones de LinkedIn del último año.
- [Escritos](https://flopezmiranda.com/blog/): artículos y ediciones de su newsletter.

## Artículos
${posts.map((p) => `- [${p.data.title}](https://flopezmiranda.com/blog/${p.id}/): ${p.data.description}`).join('\n')}

## Proyectos
- [Efecto Podcast](https://efectopodcast.com/): podcast chileno de conversaciones sobre marketing, negocios, emprendimiento, IA y creatividad. 39 episodios (unas 32 horas) con 17 invitados. Canal principal en YouTube: https://www.youtube.com/@efecto_podcast
- [DroneImagen](https://www.droneimagen.cl/): banco de fotos gratis con más de 1.100 fotografías aéreas de Chile tomadas por Felipe; descarga en alta resolución sin marca de agua para uso personal y comercial.

## Publicaciones de LinkedIn con más alcance
${top.map((p) => `- ${p.date}: "${shareFor(p)?.headline ?? p.title + '…'}" (${p.impressions ? formatNumber(p.impressions) + ' impresiones' : ''}) ${p.url}`).join('\n')}

## Contacto y redes
- LinkedIn: ${LINKEDIN_URL}
- Newsletter en LinkedIn: ${NEWSLETTER_URL}
${SOCIAL.instagram ? `- Instagram: ${SOCIAL.instagram}\n` : ''}`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
