// Interacción de la tabla: ficha lateral, líneas animadas, buscador, filtros y flechas del teclado.
// Las casillas son enlaces a la página de cada elemento; aquí se interceptan para abrir la ficha sin recargar.
declare global {
  interface Window { tablaEvento?: (nombre: string, datos: Record<string, string | number>) => void }
}

const pt = document.getElementById('pt')!;
const svg = document.getElementById('links')!;
const panel = document.getElementById('panel')!;
const q = document.getElementById('q') as HTMLInputElement;
const count = document.getElementById('count')!;
const lg = document.getElementById('legend')!;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const tiles = [...pt.querySelectorAll<HTMLAnchorElement>('.el')];
const btn: Record<string, HTMLAnchorElement> = {};
tiles.forEach((b) => (btn[b.dataset.id!] = b));
const ids = tiles.map((b) => b.dataset.id!);
const rel = (id: string) => (btn[id].dataset.rel || '').split(',').filter((r) => btn[r]);

let cur: string | null = panel.dataset.inicial || null;
let famOn: string | null = null;

function track(id: string, origen: string) {
  const b = btn[id];
  window.tablaEvento?.('elemento_click', { elemento: b.dataset.sym!, elemento_nombre: b.dataset.name!, capa: b.dataset.capa!, origen });
}

function sel(id: string, opts: { scroll?: boolean; origen?: string; hash?: boolean } = {}) {
  if (!btn[id]) return;
  const tpl = document.getElementById(`f-${id}`) as HTMLTemplateElement | null;
  if (!tpl) return;
  cur = id;
  tiles.forEach((b) => b.classList.remove('on', 'rel'));
  btn[id].classList.add('on');
  rel(id).forEach((r) => btn[r].classList.add('rel'));
  panel.replaceChildren(tpl.content.cloneNode(true));
  drawLinks();
  if (opts.origen) track(id, opts.origen);
  if (opts.hash !== false && location.hash.slice(1) !== id) {
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }
  if (opts.scroll && innerWidth < 1320) {
    const r = panel.getBoundingClientRect();
    if (r.top > innerHeight - 120) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}

function center(b: HTMLElement) { return [b.offsetLeft + b.offsetWidth / 2, b.offsetTop + b.offsetHeight / 2]; }
function drawLinks() {
  if (!cur) { svg.innerHTML = ''; return; }
  svg.setAttribute('viewBox', `0 0 ${pt.clientWidth} ${pt.clientHeight}`);
  const [x1, y1] = center(btn[cur]);
  let s = '';
  rel(cur).forEach((r, i) => {
    const [x2, y2] = center(btn[r]);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, k = 0.18 * (i % 2 ? 1 : -1);
    const d = `M${x1},${y1} Q${mx - dy * k},${my + dx * k} ${x2},${y2}`;
    s += `<path d="${d}"/>`;
    if (!reduce) s += `<circle r="4"><animateMotion dur="${1.4 + i * 0.25}s" repeatCount="indefinite" path="${d}"/></circle>`;
  });
  s += `<circle cx="${x1}" cy="${y1}" r="5"/>`;
  svg.innerHTML = s;
}
new ResizeObserver(() => drawLinks()).observe(pt);

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function filter() {
  const v = norm(q.value.trim());
  let n = 0;
  tiles.forEach((b) => {
    const ok = (!v || b.dataset.q!.includes(v)) && (!famOn || b.dataset.capa === famOn);
    if (ok) n++;
    b.classList.toggle('dim', !ok);
  });
  count.textContent = v || famOn ? (n ? `${n} elemento${n > 1 ? 's' : ''} ${n > 1 ? 'coinciden' : 'coincide'}` : 'Ningún elemento coincide. Prueba con otra palabra.') : '';
}
q.addEventListener('input', filter);
q.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const b = tiles.find((b) => !b.classList.contains('dim'));
    if (b) sel(b.dataset.id!, { scroll: true, origen: 'buscador' });
  }
});
lg.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.chip');
  if (!b) return;
  famOn = famOn === b.dataset.k ? null : b.dataset.k!;
  lg.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String((c as HTMLElement).dataset.k === famOn)));
  filter();
});

// Ctrl/⌘/Shift + clic o clic con la rueda: dejar que el navegador abra la página completa.
const plain = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
pt.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLAnchorElement>('.el');
  if (!b || !plain(e)) return;
  e.preventDefault();
  sel(b.dataset.id!, { scroll: true, origen: 'tabla' });
});
panel.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const full = t.closest<HTMLAnchorElement>('[data-full]');
  if (full) { window.tablaEvento?.('ver_pagina_completa', { elemento: btn[full.dataset.full!]?.dataset.sym ?? full.dataset.full! }); return; }
  const b = t.closest<HTMLAnchorElement>('[data-go]');
  if (!b || !plain(e)) return;
  e.preventDefault();
  sel(b.dataset.go!, { origen: 'ficha' });
});
addEventListener('keydown', (e) => {
  if (e.target === q || !cur || e.altKey || e.ctrlKey || e.metaKey) return;
  const i = ids.indexOf(cur);
  if (e.key === 'ArrowRight') sel(ids[(i + 1) % ids.length], { origen: 'teclado' });
  if (e.key === 'ArrowLeft') sel(ids[(i - 1 + ids.length) % ids.length], { origen: 'teclado' });
});

function fromHash() {
  const id = decodeURIComponent(location.hash.slice(1)).toLowerCase();
  if (btn[id] && id !== cur) sel(id);
}
addEventListener('hashchange', fromHash);
const start = decodeURIComponent(location.hash.slice(1)).toLowerCase();
if (btn[start]) sel(start);
else if (cur) sel(cur, { hash: false });
if (document.fonts) document.fonts.ready.then(drawLinks);

export {};
