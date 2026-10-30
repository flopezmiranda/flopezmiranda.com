// Convierte el texto de una publicación de LinkedIn en HTML con enlaces internos y externos.
import { NEWSLETTER_URL } from '../consts';

/** Hashtags con página de tema propia (se calcula en src/data/linkedin.ts) */
export type TagPages = Map<string, string>;

// Primera mención de cada término -> enlace (artículos propios, proyectos, newsletter)
const TERMS: { re: RegExp; href: string }[] = [
  { re: /Efecto Podcast/i, href: 'https://efectopodcast.com/' },
  { re: /Efecto Newsletter|\bnewsletter\b/i, href: NEWSLETTER_URL },
  { re: /DroneImagen/i, href: '/droneimagen/' },
  { re: /\bWhatsApp\b/i, href: '/blog/5-razones-para-ocupar-whatsapp-y-vender-con-marketing/' },
  { re: /\bGoogle Ads\b/i, href: '/blog/3-aciertos-y-3-errores-de-grandes-marcas-en-campanas-de-google-ads/' },
  { re: /\bTikTok\b/i, href: '/blog/no-digas-que-no-lo-dije-ia-aplicada-a-meta-google-y-tiktok-para-vender/' },
  { re: /\bbranding\b/i, href: '/blog/como-usar-branding-y-performance-para-generar-ventas/' },
  { re: /\bperformance marketing\b/i, href: '/blog/especial-performance-marketing-e-ia-tips-para-mejorar-tu-rendimiento/' },
  { re: /\binteligencia artificial\b/i, href: '/blog/no-te-quitara-el-trabajo-aprende-a-ocupar-la-ia-en-tus-campanas/' },
  { re: /\bShopify\b/i, href: '/blog/por-que-shopify-es-la-mejor-plataforma-de-e-commerce-del-mercado/' },
  { re: /\binfluenc(?:er|ers|iadores?)\b/i, href: '/blog/influenciadores-sirven-o-no/' },
  { re: /\bTOCTOC\b/, href: 'https://www.toctoc.com' },
  { re: /\bAndr[oó]meda\b/i, href: '/linkedin/tema/andromeda/' },
  { re: /\bAI ?Max\b/i, href: '/linkedin/tema/aimax/' },
  { re: /\bChatGPT\b/i, href: '/linkedin/tema/chatgpt/' },
  { re: /\bMeta Ads\b/i, href: '/blog/no-digas-que-no-lo-dije-ia-aplicada-a-meta-google-y-tiktok-para-vender/' },
  { re: /\bperformance\b/i, href: '/linkedin/tema/performancemarketing/' },
];
const MAX_TERM_LINKS = 5;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = (href: string) => (href.startsWith('http') ? ' target="_blank" rel="noopener"' : '');

export function postToHtml(text: string, tagPages: TagPages, selfPath = '') {
  let termLinks = 0;
  const used = new Set<string>();
  const linkLine = (line: string) => {
    // Separa URLs y hashtags del resto para no enlazar dentro de ellos
    return line
      .split(/(https?:\/\/\S+|#[\p{L}\p{N}_]+)/u)
      .map((part) => {
        if (/^https?:\/\//.test(part)) return `<a href="${esc(part)}" target="_blank" rel="noopener">${esc(part)}</a>`;
        if (part.startsWith('#')) {
          const href = tagPages.get(part.slice(1).toLowerCase());
          return href ? `<a class="tag" href="${href}">${esc(part)}</a>` : `<span class="tag">${esc(part)}</span>`;
        }
        let out = esc(part);
        for (const t of TERMS) {
          if (termLinks >= MAX_TERM_LINKS || used.has(t.href) || t.href === selfPath) continue;
          const m = out.match(t.re);
          if (!m || m.index === undefined) continue;
          // No enlazar dentro de una etiqueta HTML ya creada
          if (out.lastIndexOf('<a', m.index) > out.lastIndexOf('</a>', m.index)) continue;
          out = `${out.slice(0, m.index)}<a href="${t.href}"${ext(t.href)}>${m[0]}</a>${out.slice(m.index + m[0].length)}`;
          used.add(t.href);
          termLinks++;
        }
        return out;
      })
      .join('');
  };
  return text
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.split('\n').map(linkLine).join('<br />')}</p>`)
    .join('\n');
}
