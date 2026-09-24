import { h, guard } from './ui.js';
import { updateRow, deleteRow, swapPositions } from './db.js';

/* List screen: order (↑↓), publish/draft, view, edit, delete. Rows with `published` get the status pill. */
export function renderList(root, o) {
  const key = o.key || 'id';
  const label = o.label || ((r) => r.title);
  const movable = o.movable !== false;
  const move = async (i, d) => { if (await guard(() => swapPositions(o.table, o.items[i], o.items[i + d], key))) o.reload(); };
  const toggle = async (r) => {
    if (await guard(() => updateRow(o.table, key, r[key], { published: !r.published }), r.published ? 'Ocultado do site.' : 'Publicado.')) o.reload();
  };
  const remove = async (r) => {
    const extra = o.beforeDelete ? await o.beforeDelete(r) : '';
    if (!confirm(`Excluir “${label(r)}”? Esta ação não pode ser desfeita.${extra ? `\n${extra}` : ''}`)) return;
    if (await guard(() => deleteRow(o.table, key, r[key]), 'Excluído.')) o.reload();
  };
  const btn = (text, attrs) => h('button', { type: 'button', class: 'btn btn-ghost btn-sm', ...attrs }, text);
  root.replaceChildren(
    h('header', { class: 'adm-head' }, h('h1', {}, o.title), h('button', { class: 'btn btn-primary btn-sm', type: 'button', onclick: o.onNew }, o.newLabel)),
    o.items.length ? h('ul', { class: 'adm-list' }, o.items.map((r, i) => h('li', { class: 'adm-row glass' },
      h('div', { class: 'adm-row-main' }, h('strong', {}, label(r)), h('span', { class: 'adm-meta' }, o.meta ? o.meta(r) : '')),
      'published' in r && h('span', { class: `adm-pill${r.published ? ' is-on' : ''}` }, r.published ? 'Publicado' : 'Rascunho'),
      h('div', { class: 'adm-actions' },
        movable && btn('↑', { 'aria-label': `Subir ${label(r)}`, disabled: i === 0, onclick: () => move(i, -1) }),
        movable && btn('↓', { 'aria-label': `Descer ${label(r)}`, disabled: i === o.items.length - 1, onclick: () => move(i, 1) }),
        'published' in r && btn(r.published ? 'Ocultar' : 'Publicar', { onclick: () => toggle(r) }),
        o.viewHref && r.published && h('a', { class: 'btn btn-ghost btn-sm', href: o.viewHref(r), target: '_blank', rel: 'noopener' }, 'Ver'),
        btn('Editar', { onclick: () => o.onEdit(r) }),
        btn('Excluir', { class: 'btn btn-ghost btn-sm adm-danger', onclick: () => remove(r) })))))
      : h('p', { class: 'adm-empty' }, 'Nada por aqui ainda.'));
}
