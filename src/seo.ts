// Datos estructurados (schema.org) compartidos por todo el sitio.
import { LINKEDIN_URL, SOCIAL, SITE_DESCRIPTION } from './consts';

export const SITE_URL = 'https://flopezmiranda.com';
export const PERSON_ID = `${SITE_URL}/#felipe`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Felipe López Miranda',
  givenName: 'Felipe',
  familyName: 'López Miranda',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/retrato.webp`,
  description:
    'CMO & Growth Lead de TOCTOC, periodista y Magíster en Dirección de Marketing. Escribe sobre marketing, datos e inteligencia artificial y conduce Efecto Podcast.',
  jobTitle: 'CMO & Growth Lead',
  worksFor: { '@type': 'Organization', name: 'TOCTOC', url: 'https://www.toctoc.com' },
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Chief Marketing Officer',
    occupationLocation: { '@type': 'Country', name: 'Chile' },
    skills: 'Performance marketing, branding, contenido, analítica de datos, inteligencia artificial aplicada al marketing',
  },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Universidad Diego Portales' },
    { '@type': 'CollegeOrUniversity', name: 'Florida International University' },
    { '@type': 'CollegeOrUniversity', name: 'Universidad Adolfo Ibáñez' },
    { '@type': 'CollegeOrUniversity', name: 'Universidad Academia de Humanismo Cristiano' },
  ],
  knowsAbout: [
    'Marketing digital',
    'Performance marketing',
    'Meta Ads',
    'Google Ads',
    'Branding',
    'Marketing de contenidos',
    'Analítica web',
    'Inteligencia artificial',
    'Transformación digital',
    'Growth marketing',
  ],
  knowsLanguage: 'es',
  sameAs: [LINKEDIN_URL, SOCIAL.instagram].filter(Boolean),
};

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'Felipe López Miranda',
  description: SITE_DESCRIPTION,
  inLanguage: 'es-CL',
  publisher: { '@id': PERSON_ID },
  author: { '@id': PERSON_ID },
};

export const podcast = {
  '@type': 'PodcastSeries',
  '@id': 'https://efectopodcast.com/#podcast',
  name: 'Efecto Podcast',
  url: 'https://efectopodcast.com/',
  description: 'Podcast chileno de conversaciones sobre marketing, negocios, emprendimiento, inteligencia artificial y creatividad.',
  inLanguage: 'es',
  author: { '@id': PERSON_ID },
  sameAs: ['https://www.youtube.com/@efecto_podcast'],
};

export const droneimagen = {
  '@type': 'WebSite',
  '@id': 'https://www.droneimagen.cl/#website',
  name: 'DroneImagen',
  url: 'https://www.droneimagen.cl/',
  description: 'Banco de fotos gratis con más de 1.100 fotografías aéreas de Chile tomadas con drone.',
  inLanguage: 'es-CL',
  creator: { '@id': PERSON_ID },
};

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbs(items: Crumb[]) {
  const all = [{ name: 'Inicio', path: '/' }, ...items];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE_URL}${c.path}` })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
