import { supabase } from '../../lib/supabase.js';
import { h, field, input } from './ui.js';

export function renderLogin(root, { onSuccess } = {}) {
  const email = input('', { type: 'email', autocomplete: 'username', required: true });
  const pass = input('', { type: 'password', autocomplete: 'current-password', required: true });
  const err = h('p', { class: 'adm-error', role: 'alert' });
  const btn = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Entrar');
  root.replaceChildren(h('form', { class: 'adm-login glass', onsubmit: async (e) => {
    e.preventDefault();
    err.textContent = '';
    btn.disabled = true; btn.textContent = 'Entrando…';
    const { error } = await supabase.auth.signInWithPassword({ email: email.value.trim(), password: pass.value });
    btn.disabled = false; btn.textContent = 'Entrar';
    if (error) { err.textContent = error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message; pass.select(); return; }
    onSuccess?.();
  } }, h('p', { class: 'eyebrow' }, 'Área de gestão'), h('h1', {}, 'Entrar'), field('E-mail', email), field('Senha', pass), err, btn));
  email.focus();
}
