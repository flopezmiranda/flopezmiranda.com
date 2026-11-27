// Genera /tabla/og/tabla.png (página principal) y /tabla/og/<elemento>.png (una por elemento).
import type { APIRoute, GetStaticPaths } from 'astro';
import { ELEMENTOS, type Elemento } from '../../../lib/tabla';
import { imagenElemento, imagenTabla } from '../../../lib/tabla-og';

export const getStaticPaths: GetStaticPaths = () => [
  { params: { slug: 'tabla' }, props: { e: null } },
  ...ELEMENTOS.map((e) => ({ params: { slug: e.slug }, props: { e } })),
];

export const GET: APIRoute = async ({ props }) => {
  const e = (props as { e: Elemento | null }).e;
  const png = e ? await imagenElemento(e) : await imagenTabla();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
