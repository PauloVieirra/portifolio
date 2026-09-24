import { h, field, input, select, toast, guard, busy, pageHead } from './ui.js';
import { getSite, saveSite } from './db.js';
import { validateBubbles } from '../../lib/admin-rules.js';
import { ICONS, ICON_LABELS } from '../../lib/icons.js';

const ICON_OPTIONS = ICONS.map(id => [id, ICON_LABELS[id]]);

export async function renderHero(root) {
  const bubbles = structuredClone((await getSite('hero_bubbles')) || []);
  while (bubbles.length < 4) bubbles.push({ value: '', label: '', tags: [] });
  bubbles.length = 4;
  const errors = h('ul', { class: 'adm-errors', role: 'alert' });
  const wrap = h('div', { class: 'adm-bubbles' });
  const render = () => wrap.replaceChildren(...bubbles.map((b, i) => h('fieldset', { class: 'adm-section' },
    h('legend', {}, `Bolha ${i + 1}`),
    h('div', { class: 'adm-grid2' },
      field('Valor (texto grande)', input(b.value, { oninput: (e) => { b.value = e.target.value; } })),
      field('Rótulo', input(b.label, { oninput: (e) => { b.label = e.target.value; } }))),
    h('ul', { class: 'adm-tags' }, b.tags.map((t, j) => h('li', {},
      input(t.label, { 'aria-label': `Bolha ${i + 1}, tag ${j + 1}`, oninput: (e) => { t.label = e.target.value; } }),
      select(t.icon, ICON_OPTIONS, { 'aria-label': `Ícone da tag ${j + 1}`, onchange: (e) => { t.icon = e.target.value; } }),
      h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-label': 'Subir tag', disabled: j === 0,
        onclick: () => { [b.tags[j - 1], b.tags[j]] = [b.tags[j], b.tags[j - 1]]; render(); } }, '↑'),
      h('button', { type: 'button', class: 'btn btn-ghost btn-sm adm-danger', 'aria-label': 'Remover tag',
        onclick: () => { b.tags.splice(j, 1); render(); } }, '×')))),
    h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => { b.tags.push({ label: '', icon: ICONS[0] }); render(); } }, '+ Tag'))));
  render();
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar bolhas');
  const onSubmit = async (e) => {
    e.preventDefault();
    const clean = bubbles.map(b => ({ value: b.value.trim(), label: b.label.trim(), tags: b.tags.map(t => ({ label: t.label.trim(), icon: t.icon })) }));
    const errs = validateBubbles(clean);
    errors.replaceChildren(...errs.map(m => h('li', {}, m)));
    if (errs.length) { toast('Corrija os itens listados antes de salvar.', 'error'); errors.scrollIntoView({ block: 'center' }); return; }
    await busy(save, () => guard(() => saveSite('hero_bubbles', clean), 'Bolhas salvas.'));
  };
  root.replaceChildren(pageHead('Bolhas do hero'), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    h('p', { class: 'hint' }, 'São sempre 4 bolhas. Nenhuma tag pode se repetir, em nenhuma bolha.'),
    errors, wrap, h('div', { class: 'adm-savebar glass' }, save)));
}
