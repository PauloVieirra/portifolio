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
