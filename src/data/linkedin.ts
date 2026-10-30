// Datos generados con: python scripts/import_linkedin.py <Excel de LinkedIn>
import data from './linkedin.json';

export interface LinkedInPost {
  url: string;
  date: string; // AAAA-MM-DD
  title: string; // primeras palabras del post (vienen en la URL)
  impressions?: number;
  interactions?: number;
}

export interface AudienceItem {
  label: string;
  pct: number;
}

export const LINKEDIN = data as {
  period: { from: string; to: string };
  followers: number;
  newFollowers: number;
  impressions: number;
  reached: number;
  interactions: number;
  monthly: { month: string; impressions: number; interactions: number; newFollowers: number }[];
  topPosts: LinkedInPost[];
  audience: Record<string, AudienceItem[]>;
};

const full = new Intl.NumberFormat('es-CL');
/** 3220623 -> "3,2 M"; 727510 -> "728 mil"; 25665 -> "25.665" */
export function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} M`;
  if (n >= 100_000) return `${Math.round(n / 1000)} mil`;
  return full.format(n);
}
export const formatNumber = (n: number) => full.format(n);

// Publicaciones con texto completo (generadas con scripts/import_linkedin_shares.py)
import postsData from './linkedin-posts.json';

export interface LinkedInShare {
  id: string;
  date: string;
  url: string;
  headline: string;
  text: string;
  category: string;
  recent: boolean;
}

export const SHARES = postsData as LinkedInShare[];
const byId = new Map(SHARES.map((p) => [p.id, p]));

/** Texto real de una publicación de "Lo más leído", si está en el archivo exportado */
export function shareFor(post: LinkedInPost) {
  const id = post.url.match(/(\d{15,})/)?.[1];
  return id ? byId.get(id) : undefined;
}

/** Quita emojis y símbolos sueltos del inicio de un titular para usarlo en miniaturas */
export function cleanHeadline(s: string) {
  return s.replace(/^[^\p{L}\p{N}¡¿"“]+/u, '').trim();
}
