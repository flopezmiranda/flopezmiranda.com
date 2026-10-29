// Contenido y enlaces de la página /droneimagen/.
// Para sumar enlaces a lugares, regiones o colecciones, agrega filas a las listas de abajo
// con la ruta exacta de droneimagen.cl (por ejemplo '/lugar/valparaiso').

export const DI = 'https://www.droneimagen.cl';

export interface DroneLink {
  label: string;
  path: string;
  text?: string;
}

// Secciones principales del sitio (rutas tomadas del resumen del proyecto).
export const MAIN_LINKS: DroneLink[] = [
  { label: 'Galería completa', path: '/galeria', text: 'Todas las fotos aéreas, con búsqueda inteligente por IA.' },
  { label: 'Banco de imágenes gratis de Chile', path: '/banco-de-imagenes-gratis', text: 'Qué es, cómo descargar y para qué se pueden usar las fotos.' },
  { label: 'Guías', path: '/guias', text: '11 guías para usar fotografía aérea en proyectos reales.' },
];

// ✏️ Rutas por confirmar: el resumen nombra estas páginas pero no su dirección exacta.
export const MORE_LINKS: DroneLink[] = [
  { label: 'Licencia de uso', path: '/licencia' },
  { label: 'Mapa de fotos', path: '/mapa' },
  { label: 'Preguntas frecuentes', path: '/faq' },
  { label: 'Sobre DroneImagen', path: '/nosotros' },
  { label: 'Contacto', path: '/contacto' },
];

// ✏️ Pendiente: pegar aquí los 31 lugares, 6 regiones y 8 colecciones con su ruta real.
export const PLACES: DroneLink[] = [];
export const REGIONS: DroneLink[] = [];
export const COLLECTIONS: DroneLink[] = [];

// Fotos del mosaico (archivos en public/img/drone/).
// size: 'wide' = grande 2x2, 'tall' = vertical alta, 'long' = horizontal ancha. place: lugar (opcional).
export const PHOTOS: { src: string; alt: string; place?: string; size?: 'wide' | 'tall' | 'long' }[] = [
  { src: '/img/drone/playa-cenital.webp', alt: 'Playa vista desde arriba, con quitasoles, gente en la arena y olas', size: 'wide' },
  { src: '/img/drone/playa-olas.webp', alt: 'Olas rompiendo en la orilla de una playa junto a la avenida costera', size: 'tall' },
  { src: '/img/drone/parque-lagunas.webp', alt: 'Parque urbano con lagunas, senderos y árboles en otoño' },
  { src: '/img/drone/barrio-autopista.webp', alt: 'Barrio residencial de techos rojos junto a una autopista' },
  { src: '/img/drone/costanera.webp', alt: 'Costanera con autos estacionados, rompeolas y mar turquesa' },
];
