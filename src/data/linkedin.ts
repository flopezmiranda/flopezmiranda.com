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
