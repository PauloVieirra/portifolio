/* Small DOM helpers for the admin screens. */
export const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') el.className = v;
    else if (k === 'value' || k === 'checked') el[k] = v;
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  el.append(...children.flat(Infinity).filter(c => c != null && c !== false));
  return el;
};

let toastTimer;
export const toast = (msg, kind = 'ok') => {
  const el = document.getElementById('adminToast');
  el.textContent = msg;
  el.dataset.kind = kind;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), kind === 'error' ? 6000 : 2500);
};

let seq = 0;
export const field = (label, control, hint) => {
  if (!control.id) control.id = `f${++seq}`;
  return h('div', { class: 'field' }, h('label', { for: control.id }, label), control, hint && h('small', { class: 'hint' }, hint));
};
export const input = (value, attrs = {}) => h('input', { ...attrs, value: value ?? '' });
export const textarea = (value, attrs = {}) => { const t = h('textarea', attrs); t.value = value ?? ''; return t; };
export const select = (value, options, attrs = {}) =>
  h('select', attrs, options.map(([v, l]) => h('option', { value: v, selected: v === value }, l)));
export const checkbox = (label, checked, attrs = {}) => {
  const box = h('input', { type: 'checkbox', ...attrs, checked: !!checked });
  const el = h('label', { class: 'check' }, box, label);
  el.input = box;
  return el;
};

/* disables the button while fn runs */
export const busy = async (btn, fn) => {
  const text = btn.textContent;
  btn.disabled = true; btn.textContent = 'Salvando…';
  try { return await fn(); } finally { btn.disabled = false; btn.textContent = text; }
};
/* runs fn, toasts the error (or okMsg) and tells whether it worked */
export const guard = async (fn, okMsg) => {
  try { await fn(); if (okMsg) toast(okMsg); return true; } catch (e) { toast(e.message || String(e), 'error'); return false; }
};

export const lines = (text) => String(text ?? '').split('\n').map(s => s.trim()).filter(Boolean);
export const csv = (text) => String(text ?? '').split(',').map(s => s.trim()).filter(Boolean);
export const pageHead = (title, onBack) => h('header', { class: 'adm-head' }, h('h1', {}, title),
  onBack && h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: onBack }, '← Voltar'));
