// Imágenes para compartir (1200×630) de la tabla, con el mismo estilo de las casillas.
// Se crean solas al construir el sitio: no hay que hacer nada a mano.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ELEMENTOS, CAPAS, NIVELES, TITULO, tinte, borde, ubicacion, type Elemento } from './tabla';

const INK = '#14171c', MUT = '#5b626d', LINE = '#e3e6ea', BG = '#ffffff';
const fontDir = path.join(process.cwd(), 'src/assets/tabla-fonts');
const font = (file: string, name: string, weight: 500 | 700 | 800) => ({ name, data: fs.readFileSync(path.join(fontDir, file)), weight, style: 'normal' as const });
let fonts: ReturnType<typeof font>[] | null = null;
const getFonts = () =>
  (fonts ??= [font('Archivo-80-800.ttf', 'A80', 800), font('Archivo-88-700.ttf', 'A88', 700), font('Archivo-100-500.ttf', 'A100', 500), font('Archivo-66-500.ttf', 'A66', 500)]);

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (style: Record<string, unknown>, ...children: unknown[]): Node => ({
  type: 'div',
  props: { style: { display: 'flex', boxSizing: 'border-box', ...style }, children: children.length === 1 ? children[0] : children },
});

async function render(tree: Node) {
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: getFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

const firma = (size = 24, columna = false) =>
  h({ alignItems: columna ? 'flex-start' : 'center', gap: 14, flexDirection: columna ? 'column' : 'row' },
    h({ gap: 6 }, ...[...CAPAS.map((c) => c.color)].map((c) => h({ width: 18, height: 18, borderRadius: 9, background: c }))),
    h({ fontFamily: 'A100', fontSize: size, color: MUT }, 'flopezmiranda.com/tabla'));

export async function imagenElemento(e: Elemento) {
  const len = e.simbolo.length;
  const simSize = len <= 2 ? 200 : len === 3 ? 150 : 116;
  const nameSize = e.nombre.length > 30 ? 58 : e.nombre.length > 20 ? 68 : 80;
  return render(
    h({ width: 1200, height: 630, background: BG, padding: '56px 72px', flexDirection: 'column', fontFamily: 'A100', color: INK },
      h({ height: 412, alignItems: 'center' },
        h({ width: 340, height: 380, flexShrink: 0, borderRadius: 28, background: tinte(e.capa.color), border: `3px solid ${borde(e.capa.color)}`, padding: '26px 30px', flexDirection: 'column', justifyContent: 'space-between' },
          h({ fontSize: 40, opacity: 0.75 }, String(e.numero)),
          h({ fontFamily: 'A80', fontSize: simSize, lineHeight: 1, letterSpacing: '-0.01em' }, e.simbolo),
          h({ fontFamily: 'A66', fontSize: 30, lineHeight: 1.1 }, e.nombre_corto)),
        h({ flexDirection: 'column', marginLeft: 56, width: 660 },
          h({ alignItems: 'center', gap: 12, fontSize: 28, color: MUT, marginBottom: 18 },
            h({ width: 18, height: 18, borderRadius: 9, background: e.capa.color }),
            ubicacion(e)),
          h({ fontFamily: 'A88', fontSize: nameSize, lineHeight: 1.02, letterSpacing: '-0.02em' }, e.nombre))),
      h({ borderTop: `2px solid ${LINE}`, paddingTop: 24, marginTop: 30, height: 74, justifyContent: 'space-between', alignItems: 'center' },
        h({ fontFamily: 'A88', fontSize: 30 }, TITULO),
        firma())));
}

export async function imagenTabla() {
  const W = 52, H = 62, G = 6;
  const celdas = new Map(ELEMENTOS.map((x) => [`${x.fila}-${x.col}`, x]));
  const filas = [2, 3, 4, 5, 6, 8].map((f) =>
    h({ gap: G, marginTop: f === 8 ? 14 : 0 },
      ...Array.from({ length: 12 }, (_, i) => {
        const x = celdas.get(`${f}-${i + 2}`);
        if (!x) return h({ width: W, height: H });
        return h({ width: W, height: H, borderRadius: 7, background: tinte(x.capa.color), border: `1.5px solid ${borde(x.capa.color)}`, padding: '4px 5px', flexDirection: 'column', justifyContent: 'space-between' },
          h({ fontSize: 11, opacity: 0.75 }, String(x.numero)),
          h({ fontFamily: 'A80', fontSize: x.simbolo.length >= 4 ? 15 : x.simbolo.length === 3 ? 18 : 23, lineHeight: 1 }, x.simbolo));
      })));
  return render(
    h({ width: 1200, height: 630, background: BG, padding: '60px 64px', fontFamily: 'A100', color: INK, alignItems: 'center' },
      h({ flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: 330, marginRight: 40 },
        h({ flexDirection: 'column' },
          h({ fontFamily: 'A88', fontSize: 60, lineHeight: 1.02, letterSpacing: '-0.02em' }, TITULO),
          h({ fontSize: 24, color: MUT, marginTop: 18, lineHeight: 1.3 }, `${ELEMENTOS.length} elementos · ${CAPAS.length} capas · ${NIVELES.length} niveles de madurez`)),
        h({ flexDirection: 'column', gap: 10 }, h({ fontFamily: 'A88', fontSize: 24 }, 'Felipe López Miranda'), firma(22, true))),
      h({ flexDirection: 'column', gap: G }, ...filas)));
}
