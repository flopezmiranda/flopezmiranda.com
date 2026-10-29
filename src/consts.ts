// Datos globales del sitio. Edita aquí tu nombre, descripción y redes.
export const SITE_TITLE = 'Felipe López Miranda';
export const SITE_DESCRIPTION =
  'Marketing, datos e inteligencia artificial: ideas prácticas para crecer con evidencia.';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/flopezmiranda/';

// Redes que aparecen en el pie de página. Deja vacía ('') la que no quieras mostrar.
export const SOCIAL = {
  linkedin: LINKEDIN_URL,
  x: '',
  email: '',
};

// Cifras de LinkedIn para la portada. Deja en null las que no quieras mostrar.
export const LINKEDIN_STATS: { label: string; value: string | null }[] = [
  { label: 'seguidores en LinkedIn', value: null },
  { label: 'impresiones en el último año', value: null },
  { label: 'publicaciones', value: null },
  { label: 'interacciones', value: null },
];
