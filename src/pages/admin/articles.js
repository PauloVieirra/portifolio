import { h, field, input, textarea, select, checkbox, toast, guard, busy, csv, pageHead } from './ui.js';
import { listRows, insertRow, updateRow } from './db.js';
import { slugify, validateSlug, nextPosition } from '../../lib/admin-rules.js';
import { AURORA, AURORA_OPTIONS } from '../../lib/content-map.js';
import { imageField } from './media.js';
import { sectionsEditor } from './sections.js';
import { renderList } from './list.js';

const fmt = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

export async function renderArticles(root) {
  const [rows, projects] = await Promise.all([listRows('articles', 'date', false), listRows('projects')]);
  renderList(root, {
    title: 'Artigos', newLabel: 'Novo artigo', items: rows, table: 'articles', movable: false,
    meta: (r) => [fmt(r.date), r.read_min ? `${r.read_min} min` : '', (r.tags || []).join(', ')].filter(Boolean).join(' · '),
    viewHref: (r) => `artigo.html?a=${encodeURIComponent(r.id)}`,
    onNew: () => editArticle(root, null, rows, projects),
    onEdit: (r) => editArticle(root, r, rows, projects),
    reload: () => renderArticles(root),
  });
}

function editArticle(root, row, all, projects) {
  const isNew = !row;
  const a = row ? structuredClone(row) : { id: '', title: '', summary: '', date: new Date().toISOString().slice(0, 10), read_min: 5, tags: [], img: '',
    c1: AURORA[0], c2: AURORA[1], tag: '', project: '', intro: '', sections: [], published: false };
  let slugTouched = !isNew;
  const f = {
    title: input(a.title, { required: true, oninput: (e) => { if (!slugTouched) f.id.value = slugify(e.target.value); } }),
    id: input(a.id, { required: true, oninput: () => { slugTouched = true; } }),
    summary: textarea(a.summary, { rows: 3, required: true }),
    date: input(a.date, { type: 'date', required: true }), read_min: input(a.read_min ?? '', { type: 'number', min: 1, max: 120 }),
    tags: input((a.tags || []).join(', ')), tag: input(a.tag),
    project: select(a.project || '', [['', '— nenhum —'], ...projects.map(p => [p.id, p.title])]),
    c1: select(a.c1, AURORA_OPTIONS), c2: select(a.c2, AURORA_OPTIONS),
    intro: textarea(a.intro, { rows: 4 }), published: checkbox('Publicado', a.published),
  };
  const img = imageField({ label: 'Capa', value: a.img || '', folder: 'articles' });
  const sections = sectionsEditor(a.sections || [], { folder: 'articles', quote: true });
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar');
  const back = () => renderArticles(root);

  const onSubmit = async (e) => {
    e.preventDefault();
    const id = f.id.value.trim();
    const slugOk = validateSlug(id, all.map(r => r.id), row?.id ?? null);
    if (slugOk !== true) { toast(slugOk, 'error'); f.id.focus(); return; }
    if (!f.title.value.trim() || !f.summary.value.trim() || !f.date.value) { toast('Título, resumo e data são obrigatórios.', 'error'); return; }
    const data = {
      id, title: f.title.value.trim(), summary: f.summary.value.trim(), date: f.date.value,
      read_min: f.read_min.value ? Math.max(1, parseInt(f.read_min.value, 10)) : null, tags: csv(f.tags.value), tag: f.tag.value.trim() || null,
      project: f.project.value || null, img: img.value() || null, c1: f.c1.value, c2: f.c2.value,
      intro: f.intro.value.trim(), sections: sections.value(), published: f.published.input.checked,
    };
    const ok = await busy(save, () => guard(() => isNew
      ? insertRow('articles', { ...data, position: nextPosition(all) })
      : updateRow('articles', 'id', row.id, data), 'Artigo salvo.'));
    if (ok) back();
  };

  root.replaceChildren(pageHead(isNew ? 'Novo artigo' : a.title, back), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    field('Título', f.title),
    field('Endereço (slug)', f.id, 'Aparece na URL: artigo.html?a=…'),
    field('Resumo', f.summary),
    h('div', { class: 'adm-grid2' }, field('Data de publicação', f.date), field('Tempo de leitura (min)', f.read_min), field('Projeto relacionado', f.project)),
    field('Tags', f.tags, 'Separadas por vírgula. IA, UX, Design system e Pesquisa também são os filtros da home.'),
    img.el,
    h('div', { class: 'adm-grid2' }, field('Rótulo da capa', f.tag, 'Usado quando não há imagem.'), field('Cor 1 da capa', f.c1), field('Cor 2 da capa', f.c2)),
    field('Introdução', f.intro, 'Até ~300 caracteres num parágrafo: aparece no topo. Mais longa: abre o texto e o Resumo vai para o topo. Aceita markdown: ### subtítulo, **negrito**, *itálico*, listas com - e [link](https://…).'),
    h('h2', {}, 'Seções'), sections.el,
    h('div', { class: 'adm-actions' }, f.published),
    h('div', { class: 'adm-savebar glass' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: back }, 'Cancelar'), save)));
  f.title.focus();
}
