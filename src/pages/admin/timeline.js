import { h, field, input, textarea, select, toast, guard, busy, pageHead } from './ui.js';
import { listRows, insertRow, updateRow } from './db.js';
import { nextPosition } from '../../lib/admin-rules.js';
import { renderList } from './list.js';

const KINDS = [['trabalho', 'Experiência'], ['formacao', 'Formação / curso']];
const kindLabel = (k) => KINDS.find(([v]) => v === k)?.[1] ?? k;

export async function renderTimeline(root) {
  const rows = await listRows('timeline');
  renderList(root, {
    title: 'Trajetória', newLabel: 'Novo item', items: rows, table: 'timeline',
    meta: (r) => [kindLabel(r.kind), r.period, r.org].filter(Boolean).join(' · '),
    onNew: () => editItem(root, null, rows),
    onEdit: (r) => editItem(root, r, rows),
    reload: () => renderTimeline(root),
  });
}

function editItem(root, row, all) {
  const t = row ? { ...row } : { kind: 'trabalho', period: '', title: '', title_full: '', org: '', description: '' };
  const f = {
    kind: select(t.kind, KINDS), period: input(t.period, { required: true, placeholder: '2025 — hoje' }),
    title: input(t.title, { required: true }), title_full: input(t.title_full),
    org: input(t.org), description: textarea(t.description, { rows: 3 }),
  };
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar');
  const back = () => renderTimeline(root);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!f.period.value.trim() || !f.title.value.trim()) { toast('Período e título são obrigatórios.', 'error'); return; }
    const data = { kind: f.kind.value, period: f.period.value.trim(), title: f.title.value.trim(), title_full: f.title_full.value.trim() || null,
      org: f.org.value.trim() || null, description: f.description.value.trim() || null };
    const ok = await busy(save, () => guard(() => row
      ? updateRow('timeline', 'id', row.id, data)
      : insertRow('timeline', { ...data, position: nextPosition(all) }), 'Item salvo.'));
    if (ok) back();
  };
  root.replaceChildren(pageHead(row ? t.title : 'Novo item da trajetória', back), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    h('div', { class: 'adm-grid2' }, field('Tipo', f.kind), field('Período', f.period, 'Texto livre: "2024", "2021 — 2022", "Em andamento".')),
    field('Título', f.title, 'Curto: no celular títulos longos ocupam várias linhas.'),
    field('Título completo (opcional)', f.title_full, 'Aparece ao passar o mouse, quando o título foi abreviado.'),
    field('Organização', f.org),
    field('Descrição (opcional)', f.description),
    h('div', { class: 'adm-savebar glass' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: back }, 'Cancelar'), save)));
  f.title.focus();
}
