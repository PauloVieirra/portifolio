import { h, field, input, textarea, checkbox, toast, guard, busy, pageHead } from './ui.js';
import { listRows, insertRow, updateRow, clearFeatured } from './db.js';
import { nextPosition, validateVideoSrc, validateImageUrl } from '../../lib/admin-rules.js';
import { imageField, videoField } from './media.js';
import { renderList } from './list.js';
import VIDEOS_SQL from '../../../supabase/migrations/003-videos.sql?raw';

/* Vídeos: the /videos grid, in this order. The one marked "Destaque na home" is the presentation video on the
   home (one at most: marking another one moves the mark; the database refuses two). */
export async function renderVideos(root) {
  let rows;
  try { rows = await listRows('videos'); }
  catch (e) {
    if (/videos/.test(e.message)) { setupScreen(root); return; }
    throw e;
  }
  const reload = () => renderVideos(root);
  const feature = async (r) => {
    const on = !r.featured;
    if (await guard(async () => { if (on) await clearFeatured('videos', r.id); await updateRow('videos', 'id', r.id, { featured: on }); },
      on ? 'Agora é o vídeo de apresentação da home.' : 'Saiu da home.')) reload();
  };
  renderList(root, {
    title: 'Vídeos', newLabel: 'Novo vídeo', items: rows, table: 'videos', reload,
    meta: (r) => [r.featured ? '★ destaque na home' : '', r.duration, r.src ? sourceLabel(r.src) : 'sem vídeo (aparece como "Em breve")'].filter(Boolean).join(' · '),
    viewHref: () => 'videos.html',
    actions: (r) => [h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-pressed': String(!!r.featured), onclick: () => feature(r) }, r.featured ? '★ Tirar da home' : '☆ Destacar na home')],
    onNew: () => editVideo(root, null, rows),
    onEdit: (r) => editVideo(root, r, rows),
  });
}

/* The videos table is created once, in the Supabase SQL Editor (the site's key cannot change the database).
   Until then this screen hands over the SQL (supabase/migrations/003-videos.sql) and a link to the editor. */
function setupScreen(root) {
  const ref = new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0];
  const sql = h('textarea', { class: 'adm-sql', readonly: true, rows: 10, 'aria-label': 'SQL dos vídeos', spellcheck: 'false' });
  sql.value = VIDEOS_SQL;
  const copy = h('button', { class: 'btn btn-primary btn-sm', type: 'button', onclick: async () => {
    try { await navigator.clipboard.writeText(VIDEOS_SQL); toast('SQL copiado. Cole no SQL Editor e clique em Run.'); }
    catch { sql.select(); toast('Selecionei o SQL: copie com Ctrl+C (⌘C).'); }
  } }, '1. Copiar SQL');
  root.replaceChildren(pageHead('Vídeos'), h('div', { class: 'adm-note adm-setup glass' },
    h('p', {}, h('strong', {}, 'Falta um passo para enviar vídeos: '), 'criar a tabela de vídeos no Supabase. É só uma vez, e não mexe no que já existe.'),
    h('ol', {},
      h('li', {}, 'Copie o SQL abaixo.'),
      h('li', {}, 'Abra o SQL Editor do seu projeto no Supabase, cole e clique em ', h('strong', {}, 'Run'), '.'),
      h('li', {}, 'Volte aqui e recarregue: o formulário de vídeos aparece.')),
    h('div', { class: 'adm-actions' }, copy,
      h('a', { class: 'btn btn-ghost btn-sm', href: `https://supabase.com/dashboard/project/${ref}/sql/new`, target: '_blank', rel: 'noopener' }, '2. Abrir o SQL Editor ↗'),
      h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: () => renderVideos(root) }, '3. Já executei, recarregar')),
    sql));
}

const sourceLabel = (src) => /youtu\.?be/.test(src) ? 'YouTube' : /vimeo\.com/.test(src) ? 'Vimeo' : 'arquivo';

function editVideo(root, row, all) {
  const isNew = !row;
  const v = row ? { ...row } : { title: '', description: '', src: '', poster: '', duration: '', featured: false, published: true };
  const f = {
    title: input(v.title, { required: true }),
    description: textarea(v.description, { rows: 3 }),
    duration: input(v.duration, { placeholder: '3:20' }),
    featured: checkbox('Destaque na home (vira o vídeo de apresentação; só um vídeo pode ser o destaque)', v.featured),
    published: checkbox('Publicado', v.published),
  };
  const src = videoField({ label: 'Vídeo', value: v.src || '' });
  const poster = imageField({ label: 'Capa (opcional)', value: v.poster || '', folder: 'videos' });
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar');
  const back = () => renderVideos(root);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!f.title.value.trim()) { toast('O título é obrigatório.', 'error'); f.title.focus(); return; }
    const srcOk = validateVideoSrc(src.value());
    if (srcOk !== true) { toast(srcOk, 'error'); return; }
    const posterOk = validateImageUrl(poster.value());
    if (posterOk !== true) { toast(`Capa: ${posterOk}`, 'error'); return; }
    const data = {
      title: f.title.value.trim(), description: f.description.value.trim() || null, duration: f.duration.value.trim() || null,
      src: src.value() || null, poster: poster.value() || null, featured: f.featured.input.checked, published: f.published.input.checked,
    };
    const ok = await busy(save, () => guard(async () => {
      if (data.featured) await clearFeatured('videos', row?.id);
      return isNew ? insertRow('videos', { ...data, position: nextPosition(all) }) : updateRow('videos', 'id', row.id, data);
    }, data.featured ? 'Vídeo salvo. É o vídeo de apresentação da home.' : 'Vídeo salvo.'));
    if (ok) back();
  };

  root.replaceChildren(pageHead(isNew ? 'Novo vídeo' : v.title, back), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    field('Título', f.title),
    src.el,
    field('Descrição (opcional)', f.description, 'Aparece embaixo do vídeo, em /videos.'),
    field('Duração (opcional)', f.duration, 'Texto livre, como 3:20.'),
    poster.el,
    h('div', { class: 'adm-actions' }, f.featured, f.published),
    h('div', { class: 'adm-savebar glass' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: back }, 'Cancelar'), save)));
  f.title.focus();
}
