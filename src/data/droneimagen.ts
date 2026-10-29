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

// ✏️ Pendiente: fotos aéreas (archivo en public/img/drone/ y lugar que muestran).
export const PHOTOS: { src: string; place: string; href?: string }[] = [];
