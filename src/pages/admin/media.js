import { supabase } from '../../lib/supabase.js';
import { IMAGE_TYPES, validateImage } from '../../lib/admin-rules.js';
import { h, input, toast } from './ui.js';

/* Images go to the public `media` bucket as <folder>/<uuid>.<ext>; the page stores the public URL. */
export async function uploadImage(file, folder) {
  const ok = validateImage(file);
  if (ok !== true) throw new Error(ok);
  const path = `${folder}/${crypto.randomUUID()}.${IMAGE_TYPES[file.type]}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw new Error(error.message);
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

/* URL field + file picker + preview. Accepts existing relative paths (assets/images/…). */
export function imageField({ label, value = '', folder, onChange }) {
  let current = value;
  const preview = h('img', { class: 'adm-thumb', alt: '', src: current || null, hidden: !current });
  const status = h('span', { class: 'hint' });
  const url = input(current, { placeholder: 'Envie um arquivo ou cole uma URL', 'aria-label': `${label}: URL`, oninput: (e) => set(e.target.value.trim(), false) });
  const file = h('input', { type: 'file', accept: Object.keys(IMAGE_TYPES).join(','), 'aria-label': `${label}: enviar arquivo`, onchange: async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const ok = validateImage(f);
    if (ok !== true) { toast(ok, 'error'); e.target.value = ''; return; }
    status.textContent = 'Enviando…';
    try { set(await uploadImage(f, folder)); toast('Imagem enviada.'); }
    catch (err) { toast(err.message, 'error'); }
    finally { status.textContent = ''; e.target.value = ''; }
  } });
  function set(v, syncInput = true) {
    current = v;
    if (syncInput) url.value = v;
    preview.hidden = !v;
    if (v) preview.src = v; else preview.removeAttribute('src');
    onChange?.(v);
  }
  const el = h('div', { class: 'field adm-image' }, h('span', { class: 'label' }, label), preview, url,
    h('div', { class: 'adm-actions' }, file, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => set('') }, 'Remover'), status));
  return { el, value: () => current };
}

/* List of images with captions: upload several files at once or paste a URL; reorder and remove.
   Used for the images of each section and for the gallery. `onChange` receives the current list. */
export function imagesEditor({ label, value = [], folder, onChange, hint }) {
  let list = (value || []).map(i => ({ src: i.src || '', caption: i.caption || '' }));
  const changed = () => onChange?.(list);
  const items = h('ul', { class: 'adm-images' });
  const status = h('span', { class: 'hint', 'aria-live': 'polite' });
  const render = () => items.replaceChildren(...list.map((img, i) => h('li', { class: 'adm-image-item' },
    h('img', { class: 'adm-thumb', src: img.src, alt: '' }),
    input(img.caption, { placeholder: 'Legenda (opcional)', 'aria-label': `${label}: legenda da imagem ${i + 1}`, oninput: (e) => { img.caption = e.target.value; changed(); } }),
    h('div', { class: 'adm-actions' },
      h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-label': 'Mover para cima', disabled: i === 0, onclick: () => { [list[i - 1], list[i]] = [list[i], list[i - 1]]; render(); changed(); } }, '↑'),
      h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-label': 'Mover para baixo', disabled: i === list.length - 1, onclick: () => { [list[i + 1], list[i]] = [list[i], list[i + 1]]; render(); changed(); } }, '↓'),
      h('button', { type: 'button', class: 'btn btn-ghost btn-sm adm-danger', 'aria-label': `Remover imagem ${i + 1}`, onclick: () => { list.splice(i, 1); render(); changed(); } }, 'Remover')))));
  const add = (src) => { list.push({ src, caption: '' }); render(); changed(); };
  const file = h('input', { type: 'file', multiple: true, accept: Object.keys(IMAGE_TYPES).join(','), 'aria-label': `${label}: enviar arquivos`, onchange: async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    for (const [n, f] of files.entries()) {
      const ok = validateImage(f);
      if (ok !== true) { toast(`${f.name}: ${ok}`, 'error'); continue; }
      status.textContent = `Enviando ${n + 1} de ${files.length}…`;
      try { add(await uploadImage(f, folder)); } catch (err) { toast(`${f.name}: ${err.message}`, 'error'); }
    }
    status.textContent = '';
    if (files.length) toast(files.length === 1 ? 'Imagem enviada.' : 'Imagens enviadas.');
  } });
  const url = input('', { placeholder: 'ou cole a URL de uma imagem', 'aria-label': `${label}: URL da imagem` });
  const addUrl = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => {
    const v = url.value.trim();
    if (!/^(https?:\/\/|assets\/)/.test(v)) { toast('Use uma URL começando com https://', 'error'); return; }
    add(v); url.value = '';
  } }, 'Adicionar URL');
  render();
  const el = h('div', { class: 'field adm-image' }, h('span', { class: 'label' }, label), hint && h('small', { class: 'hint' }, hint), items,
    h('div', { class: 'adm-actions' }, file, status), h('div', { class: 'adm-actions adm-url' }, url, addUrl));
  return { el, value: () => list };
}
