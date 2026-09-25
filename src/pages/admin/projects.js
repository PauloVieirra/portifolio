import { h, field, input, textarea, select, checkbox, toast, guard, busy, csv, lines, pageHead } from './ui.js';
import { listRows, insertRow, updateRow, countWhere } from './db.js';
import { slugify, validateSlug, nextPosition } from '../../lib/admin-rules.js';
import { AURORA, AURORA_OPTIONS } from '../../lib/content-map.js';
import { imageField } from './media.js';
import { sectionsEditor } from './sections.js';
import { renderList } from './list.js';

export async function renderProjects(root) {
  const rows = await listRows('projects');
  renderList(root, {
    title: 'Projetos', newLabel: 'Novo projeto', items: rows, table: 'projects',
    meta: (r) => [r.cat_label, r.year, r.featured ? '★ destaque na home' : ''].filter(Boolean).join(' · '),
    viewHref: (r) => `projeto.html?p=${encodeURIComponent(r.id)}`,
    onNew: () => editProject(root, null, rows),
    onEdit: (r) => editProject(root, r, rows),
    reload: () => renderProjects(root),
    beforeDelete: async (r) => { const n = await countWhere('articles', 'project', r.id); return n ? `${n} artigo(s) vão perder o vínculo com este projeto.` : ''; },
  });
}

function editProject(root, row, all) {
  const isNew = !row;
  const p = row ? structuredClone(row) : { id: '', title: '', summary: '', cat_label: '', year: String(new Date().getFullYear()), tag: '', tags: [], url: '',
    img: '', c1: AURORA[0], c2: AURORA[1], challenge: '', role: '', stack: '', deliver: [], featured: false, published: false, article: { intro: '', sections: [] } };
  let slugTouched = !isNew;
  const f = {
    title: input(p.title, { required: true, oninput: (e) => { if (!slugTouched) f.id.value = slugify(e.target.value); } }),
    id: input(p.id, { required: true, oninput: () => { slugTouched = true; } }),
    summary: textarea(p.summary, { rows: 3, required: true }),
    cat_label: input(p.cat_label), year: input(p.year, { inputmode: 'numeric' }), tag: input(p.tag),
    tags: input((p.tags || []).join(', ')), url: input(p.url, { type: 'url', placeholder: 'https://' }),
    c1: select(p.c1, AURORA_OPTIONS), c2: select(p.c2, AURORA_OPTIONS),
    challenge: textarea(p.challenge, { rows: 2 }), role: textarea(p.role, { rows: 2 }), stack: input(p.stack),
    deliver: textarea((p.deliver || []).join('\n'), { rows: 3 }), intro: textarea(p.article?.intro, { rows: 4 }),
    featured: checkbox('Destaque na home (abre a seção de projetos; os outros completam até 3)', p.featured), published: checkbox('Publicado', p.published),
  };
  const img = imageField({ label: 'Capa', value: p.img || '', folder: 'projects' });
  const sections = sectionsEditor(p.article?.sections || [], { folder: 'projects', quote: false });
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar');
  const back = () => renderProjects(root);

  const onSubmit = async (e) => {
    e.preventDefault();
    const id = f.id.value.trim();
    const slugOk = validateSlug(id, all.map(r => r.id), row?.id ?? null);
    if (slugOk !== true) { toast(slugOk, 'error'); f.id.focus(); return; }
    if (!f.title.value.trim() || !f.summary.value.trim()) { toast('Título e resumo são obrigatórios.', 'error'); return; }
    const catLabel = f.cat_label.value.trim();
    const data = {
      id, title: f.title.value.trim(), summary: f.summary.value.trim(), cat_label: catLabel || null, cat: slugify(catLabel) || null,
      year: f.year.value.trim() || null, tag: f.tag.value.trim() || null, tags: csv(f.tags.value), url: f.url.value.trim() || null,
      img: img.value() || null, c1: f.c1.value, c2: f.c2.value, challenge: f.challenge.value.trim() || null, role: f.role.value.trim() || null,
      stack: f.stack.value.trim() || null, deliver: lines(f.deliver.value), featured: f.featured.input.checked, published: f.published.input.checked,
      article: { intro: f.intro.value.trim(), sections: sections.value() },
    };
    const ok = await busy(save, () => guard(() => isNew
      ? insertRow('projects', { ...data, position: nextPosition(all) })
      : updateRow('projects', 'id', row.id, data), 'Projeto salvo.'));
    if (ok) back();
  };

  root.replaceChildren(pageHead(isNew ? 'Novo projeto' : p.title, back), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    field('Título', f.title),
    field('Endereço (slug)', f.id, 'Aparece na URL: projeto.html?p=…'),
    field('Resumo', f.summary),
    h('div', { class: 'adm-grid2' }, field('Categoria', f.cat_label), field('Ano', f.year), field('Rótulo da capa', f.tag, 'Usado quando não há imagem.')),
    field('Tags', f.tags, 'Separadas por vírgula. Viram filtros em projetos.html.'),
    field('Link do projeto publicado', f.url),
    img.el,
    h('div', { class: 'adm-grid2' }, field('Cor 1 da capa', f.c1), field('Cor 2 da capa', f.c2)),
    field('Desafio', f.challenge, 'Aceita markdown: ### subtítulo, **negrito**, *itálico*, listas com - e [link](https://…).'), field('Meu papel', f.role, 'Aceita markdown: ### subtítulo, **negrito**, *itálico*, listas com - e [link](https://…).'), field('Stack', f.stack),
    field('Entregas', f.deliver, 'Uma por linha. Comece a linha com - para ser subitem da linha de cima.'),
    field('Introdução do estudo de caso', f.intro, 'Até ~300 caracteres num parágrafo: aparece no topo. Mais longa: abre o estudo e o Resumo vai para o topo. Aceita markdown: ### subtítulo, **negrito**, *itálico*, listas com - e [link](https://…).'),
    h('h2', {}, 'Seções'), sections.el,
    h('div', { class: 'adm-actions' }, f.featured, f.published),
    h('div', { class: 'adm-savebar glass' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: back }, 'Cancelar'), save)));
  f.title.focus();
}
