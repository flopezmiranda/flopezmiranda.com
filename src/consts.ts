// Datos globales del sitio. Edita aquí tu nombre, descripción y redes.
export const SITE_TITLE = 'Felipe López Miranda';
export const SITE_DESCRIPTION =
  'Marketing, datos e inteligencia artificial: ideas prácticas para crecer con evidencia.';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/flopezmiranda/';
// Google AdSense (cuenta compartida con droneimagen.cl)
export const ADSENSE_CLIENT = 'ca-pub-4575022400399296';

// Verificación de Bing Webmaster Tools (meta msvalidate.01). Déjalo vacío si importaste el sitio desde Search Console.
export const BING_VERIFICATION = 'ED47257FF940F0BCB4A9F25B4A342CBE';

export const NEWSLETTER_URL = 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7346352735975292928';

// Redes que aparecen en el pie de página. Deja vacía ('') la que no quieras mostrar.
export const SOCIAL = {
  linkedin: LINKEDIN_URL,
  x: '',
  instagram: 'https://www.instagram.com/flopezmiranda/',
  email: 'contacto@flopezmiranda.com',
};

// Temas sobre los que escribo. "cat" es la categoría de los artículos (src/content.config.ts).
export const TOPICS = [
  { name: 'Performance marketing', cat: 'Performance', text: 'Meta Ads, Google Ads y cómo invertir mejor cada peso en medios.' },
  { name: 'Datos y analítica', cat: 'Datos', text: 'Funnels, señales y las métricas que de verdad explican el negocio.' },
  { name: 'Inteligencia artificial', cat: 'IA', text: 'Herramientas y casos reales de IA aplicada a las campañas.' },
  { name: 'Branding y contenido', cat: 'Branding y contenido', text: 'Marcas con algo que decir y contenido que la gente sí ve.' },
];

// Frase principal del sitio (portada)
export const TAGLINE = 'Performance marketing, datos e IA explicados por alguien que los usa todos los días.';

// Google Analytics 4 de la Tabla periódica (/tabla). Reemplaza 'G-XXXXXXXXXX' por tu ID de medición de GA4.
// Mientras tenga las X, no se carga Google Analytics (los eventos solo se muestran en la consola del navegador).
export const GA4_ID = 'G-XXXXXXXXXX';
