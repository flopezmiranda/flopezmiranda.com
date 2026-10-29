import posts from './linkedin-posts.json';

/** Publicación destacada de LinkedIn que se muestra en la portada. */
export interface LinkedInPost {
  url: string;
  date: string; // AAAA-MM-DD
  text: string;
  category: 'Marketing' | 'Datos' | 'IA';
  impressions?: number;
  reactions?: number;
}

export const LINKEDIN_POSTS = posts as LinkedInPost[];
