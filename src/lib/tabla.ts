// Lee src/data/tabla-periodica.json, lo revisa y prepara todo lo que usan las páginas de la tabla.
// Si el archivo tiene un error (símbolo repetido, capa mal escrita, relación a un elemento que no existe…),
// la construcción del sitio se detiene con un mensaje en español que explica qué arreglar.
import datos from '../data/tabla-periodica.json';

export const BASE = '/tabla';
export const TITULO: string = datos.titulo;

export interface Capa {
  nombre: string;
  color: string;
  /** Posición de la capa (0-5). Las plataformas usan -1. */
  indice: number;
}

export interface Elemento {
  numero: number;
  simbolo: string;
  slug: string;
  nombre_corto: string;
  nombre: string;
  capa: Capa;
  esPlataforma: boolean;
  nivel: number | null;
  nivelNombre: string | null;
  columna: number;
  que_es: string;
  como_se_mide: string;
  error_comun: string;
  reacciona_con: Elemento[];
  /** Elementos que mencionan a este en su "reacciona con" (y que este no menciona). */
  mencionado_por: Elemento[];
  concepto_propio: boolean;
  /** Ubicación en la cuadrícula de la tabla */
  fila: number;
  col: number;
  url: string;
  og: string;
}

type Crudo = (typeof datos.elementos)[number] & { nivel?: number; concepto_propio?: boolean; slug?: string };

const errores: string[] = [];
const capas: Capa[] = datos.capas.map((c, i) => ({ ...c, indice: i }));
const plataformas: Capa = { ...datos.plataformas, indice: -1 };
export const NIVELES: string[] = datos.niveles;
export const CAPAS = capas;
export const PLATAFORMAS = plataformas;

const slugify = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const crudos = datos.elementos as Crudo[];
const celdas = new Map<string, string>();
const porSimbolo = new Map<string, Elemento>();

export const ELEMENTOS: Elemento[] = crudos.map((x, i) => {
  const donde = `Elemento ${i + 1} (${x.simbolo || 'sin símbolo'})`;
  for (const campo of ['simbolo', 'nombre_corto', 'nombre', 'capa', 'que_es', 'como_se_mide', 'error_comun'] as const) {
    if (!x[campo] || typeof x[campo] !== 'string') errores.push(`${donde}: falta el campo "${campo}".`);
  }
  const esPlataforma = x.capa === plataformas.nombre;
  const capa = esPlataforma ? plataformas : capas.find((c) => c.nombre === x.capa);
  if (!capa) errores.push(`${donde}: la capa "${x.capa}" no existe. Usa una de estas: ${[...capas, plataformas].map((c) => c.nombre).join(', ')}.`);
  const nivel = esPlataforma ? null : (x.nivel ?? null);
  if (!esPlataforma && (!nivel || nivel < 1 || nivel > NIVELES.length)) errores.push(`${donde}: "nivel" tiene que ser un número del 1 al ${NIVELES.length}.`);
  const maxCol = esPlataforma ? 12 : 2;
  if (!Number.isInteger(x.columna) || x.columna < 1 || x.columna > maxCol)
    errores.push(`${donde}: "columna" tiene que ser un número del 1 al ${maxCol}${esPlataforma ? ' (en la fila de plataformas)' : ' (cada capa tiene 2 columnas)'}.`);
  const fila = esPlataforma ? 8 : (nivel ?? 1) + 1;
  const col = esPlataforma ? 1 + x.columna : 2 + (capa?.indice ?? 0) * 2 + (x.columna - 1);
  const celda = `${fila}-${col}`;
  if (capa && celdas.has(celda)) errores.push(`${donde}: ocupa el mismo lugar de la tabla que ${celdas.get(celda)}. Cambia su "nivel" o su "columna".`);
  celdas.set(celda, x.simbolo);
  const slug = x.slug ? slugify(x.slug) : slugify(x.simbolo);
  const e: Elemento = {
    numero: i + 1,
    simbolo: x.simbolo,
    slug,
    nombre_corto: x.nombre_corto,
    nombre: x.nombre,
    capa: capa ?? plataformas,
    esPlataforma,
    nivel,
    nivelNombre: nivel ? NIVELES[nivel - 1] : null,
    columna: x.columna,
    que_es: x.que_es,
    como_se_mide: x.como_se_mide,
    error_comun: x.error_comun,
    reacciona_con: [],
    mencionado_por: [],
    concepto_propio: !!x.concepto_propio,
    fila,
    col,
    url: `${BASE}/elemento/${slug}/`,
    og: `${BASE}/og/${slug}.png`,
  };
  if (porSimbolo.has(x.simbolo)) errores.push(`${donde}: el símbolo "${x.simbolo}" está repetido. Cada elemento necesita un símbolo distinto.`);
  if (slug === 'tabla') errores.push(`${donde}: el símbolo "tabla" está reservado; usa otro.`);
  porSimbolo.set(x.simbolo, e);
  return e;
});

ELEMENTOS.forEach((e, i) => {
  const lista = crudos[i].reacciona_con ?? [];
  for (const s of lista) {
    const otro = porSimbolo.get(s);
    if (!otro) errores.push(`Elemento ${e.numero} (${e.simbolo}): en "reacciona_con" aparece "${s}", pero no hay ningún elemento con ese símbolo (ojo con mayúsculas y minúsculas).`);
    else if (otro !== e) e.reacciona_con.push(otro);
  }
});
for (const e of ELEMENTOS) for (const r of e.reacciona_con) if (!r.reacciona_con.includes(e) && !r.mencionado_por.includes(e)) r.mencionado_por.push(e);

if (errores.length) {
  throw new Error(`\n\nHay ${errores.length} problema(s) en src/data/tabla-periodica.json:\n- ${errores.join('\n- ')}\n`);
}

export const INICIAL: Elemento = porSimbolo.get((datos as { elemento_inicial?: string }).elemento_inicial ?? '') ?? ELEMENTOS[0];

export const porCapa = (c: Capa) => ELEMENTOS.filter((e) => e.capa === c);
export const anterior = (e: Elemento) => ELEMENTOS[(e.numero - 2 + ELEMENTOS.length) % ELEMENTOS.length];
export const siguiente = (e: Elemento) => ELEMENTOS[e.numero % ELEMENTOS.length];

/** "Señales · Nivel 1 · Fundamentos" o "Plataformas · Serie de plataformas" */
export const ubicacion = (e: Elemento) => (e.esPlataforma ? `${e.capa.nombre} · Serie de plataformas` : `${e.capa.nombre} · Nivel ${e.nivel} · ${e.nivelNombre}`);
export const etiquetaMedida = (e: Elemento) => (e.esPlataforma ? 'Dónde rinde' : 'Cómo se mide');

/** Texto sin tildes y en minúsculas, para el buscador */
export const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Recorta un texto a ~max caracteres sin cortar palabras */
export function recortar(t: string, max = 155) {
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[,;:.\s]+$/, '') + '…';
}

// --- Colores: el mismo "tinte" de capa que usa la tabla (color-mix en oklab con blanco o con el fondo oscuro) ---
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToOklab(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklabToHex([L, a, b]: number[]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, toSrgb(v))) * 255).toString(16).padStart(2, '0')).join('');
}
/** Mezcla dos colores como `color-mix(in oklab, a p%, b)` */
export function mezclar(a: string, p: number, b: string) {
  const A = hexToOklab(a),
    B = hexToOklab(b);
  return oklabToHex(A.map((v, i) => v * p + B[i] * (1 - p)));
}
export const tinte = (color: string) => mezclar(color, 0.62, '#ffffff');
export const borde = (color: string) => mezclar(color, 0.88, '#000000');
