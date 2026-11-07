import rss from '@astrojs/rss';
import { POST_PAGES, postTitle, noEmoji } from '../../data/linkedin';

// Feed de las publicaciones de LinkedIn con página propia (/linkedin/<slug>/).
export function GET(context) {
  return rss({
    title: 'Felipe López Miranda · Publicaciones',
    description: 'Publicaciones de Felipe López Miranda sobre marketing, performance, datos e inteligencia artificial.',
    site: context.site,
    items: POST_PAGES.slice(0, 100).map((p) => ({
      title: postTitle(p),
      description: noEmoji(p.text.replace(/#(\p{L}[\p{L}\p{N}_]*)/gu, '$1')).slice(0, 400),
      pubDate: new Date(p.date),
      link: `/linkedin/${p.slug}/`,
      categories: p.tags,
    })),
  });
}
