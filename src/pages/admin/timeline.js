import { h, field, input, textarea, select, toast, guard, busy, pageHead } from './ui.js';
import { listRows, insertRow, updateRow } from './db.js';
import { nextPosition } from '../../lib/admin-rules.js';
import { FORMACAO, planFormacaoSync, missingFormacao } from '../../lib/timeline-sync.js';
import { renderList } from './list.js';

const KINDS = [['trabalho', 'Experiência'], ['formacao', 'Formação / curso']];

/* Two groups, like the two columns of /trajetoria: work on the left, education (courses included) on the right.
   Each group has its own "new" button (the kind comes preset), order (↑↓ within the group) and delete. */
const GROUPS = [
  { kind: 'trabalho', title: 'Experiência profissional', newLabel: 'Nova experiência' },
  { kind: 'formacao', title: 'Formação, cursos e treinamentos', newLabel: 'Novo curso ou formação' },
];

export async function renderTimeline(root) {
  const rows = await listRows('timeline');
  const reload = () => renderTimeline(root);
  const groups = GROUPS.map(g => {
    const el = h('section', { class: 'adm-group' });
    renderList(el, {
      title: g.title, level: 'h2', newLabel: g.newLabel, table: 'timeline', reload,
      items: rows.filter(r => (r.kind || 'trabalho') === g.kind),
      meta: (r) => [r.period, r.org].filter(Boolean).join(' · '),
      onNew: () => editItem(root, null, rows, g.kind),
      onEdit: (r) => editItem(root, r, rows),
    });
    if (g.kind === 'formacao') el.querySelector('.adm-head').after(...cvNotice(rows, reload));
    return el;
  });
  root.replaceChildren(h('header', { class: 'adm-head' }, h('h1', {}, 'Trajetória')), ...groups);
}

/* One-time import of the CV's education entries: one click adds them (and puts education first, in the CV's order).
   Offered only while none of them is in the table besides the MBA, so a course deleted on purpose is not pushed back. */
function cvNotice(rows, reload) {
  const missing = missingFormacao(rows);
  if (missing.length < FORMACAO.length - 1) return [];
  const btn = h('button', { class: 'btn btn-primary btn-sm', type: 'button' }, 'Adicionar do currículo');
  btn.addEventListener('click', async () => {
    const ok = await busy(btn, () => guard(async () => {
      for (const op of planFormacaoSync(rows)) await (op.id ? updateRow('timeline', 'id', op.id, op.patch) : insertRow('timeline', op.patch));
    }, `${missing.length} ${missing.length === 1 ? 'item adicionado' : 'itens adicionados'}.`));
    if (ok) reload();
  });
  return [h('div', { class: 'adm-note glass' },
    h('p', {}, `Faltam ${missing.length} ${missing.length === 1 ? 'item' : 'itens'} do currículo: ${missing.map(e => e.title).join(', ')}.`), btn)];
}

function editItem(root, row, all, kind = 'trabalho') {
  const t = row ? { ...row } : { kind, period: '', title: '', title_full: '', org: '', description: '' };
  const f = {
    kind: select(t.kind, KINDS), period: input(t.period, { required: true, placeholder: '2025 - hoje' }),
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
  root.replaceChildren(pageHead(row ? t.title : t.kind === 'formacao' ? 'Novo curso ou formação' : 'Nova experiência', back), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    h('div', { class: 'adm-grid2' }, field('Tipo', f.kind), field('Período', f.period, 'Texto livre: "2024", "2021 - 2022", "Em andamento".')),
    field('Título', f.title, 'Curto: no celular títulos longos ocupam várias linhas.'),
    field('Título completo (opcional)', f.title_full, 'Aparece ao passar o mouse, quando o título foi abreviado.'),
    field('Organização', f.org),
    field('Descrição (opcional)', f.description),
    h('div', { class: 'adm-savebar glass' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: back }, 'Cancelar'), save)));
  f.title.focus();
}
