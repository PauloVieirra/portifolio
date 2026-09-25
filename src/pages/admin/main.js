import { supabase } from '../../lib/supabase.js';
import { h } from './ui.js';
import { renderProjects } from './projects.js';
import { renderArticles } from './articles.js';
import { renderTimeline } from './timeline.js';
import { renderHero } from './hero.js';
import { renderServices } from './services.js';
import { renderContact } from './contact.js';

/* hash → [menu label, screen renderer]. Screens receive the view element and render into it. */
export const SECTIONS = {
  projetos: ['Projetos', renderProjects],
  artigos: ['Artigos', renderArticles],
  trajetoria: ['Trajetória', renderTimeline],
  hero: ['Hero', renderHero],
  servicos: ['Serviços', renderServices],
  contato: ['Contato', renderContact],
};

const app = document.getElementById('admin');
let shown = false;

/* No session (or signed out) → /login. Supabase advises not to await its own calls inside this callback: defer the work. */
supabase.auth.onAuthStateChange((_event, session) => {
  if (!session) { location.replace('login.html'); return; }
  if (shown) return;
  shown = true;
  setTimeout(() => showApp(session), 0);
});

async function showApp(session) {
  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) {
    app.replaceChildren(h('div', { class: 'adm-login glass' },
      h('h1', {}, 'Sem acesso'),
      h('p', {}, `A conta ${session.user.email} não tem permissão para editar o site.`),
      h('button', { class: 'btn btn-ghost', onclick: () => supabase.auth.signOut() }, 'Sair')));
    return;
  }
  const view = h('main', { class: 'adm-view', tabindex: '-1' });
  const nav = h('nav', { class: 'adm-nav', 'aria-label': 'Seções' },
    Object.entries(SECTIONS).map(([k, [label]]) => h('a', { href: `#${k}`, 'data-k': k }, label)));
  app.replaceChildren(h('div', { class: 'adm-shell' },
    h('aside', { class: 'adm-side glass' },
      h('a', { class: 'brand', href: 'index.html', target: '_blank', rel: 'noopener' }, h('span', { class: 'brand-mark' }, 'PV'), ' Gestão'),
      nav,
      h('div', { class: 'adm-user' }, h('small', {}, session.user.email),
        h('button', { class: 'btn btn-ghost btn-sm', onclick: () => supabase.auth.signOut() }, 'Sair'))),
    view));

  const route = async () => {
    const k = SECTIONS[location.hash.slice(1)] ? location.hash.slice(1) : Object.keys(SECTIONS)[0];
    nav.querySelectorAll('a').forEach(a => a.dataset.k === k ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    /* each navigation renders into its own slot: a slower, older load that finishes later writes into a
       detached slot instead of wiping the screen (or a form) opened in the meantime */
    const slot = h('div', {}, h('p', { class: 'adm-empty' }, 'Carregando…'));
    view.replaceChildren(slot);
    try { await SECTIONS[k][1](slot); } catch (e) { slot.replaceChildren(h('p', { class: 'adm-empty' }, `Erro ao carregar: ${e.message}`)); }
    if (slot.isConnected) view.focus({ preventScroll: true });
  };
  window.onhashchange = route;
  route();
}
