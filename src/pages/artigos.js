import { loadContent } from '../lib/content.js';
import { initWiki } from '../lib/wiki.js';
import '../lib/overlays.js';

const { articles: ARTICLES } = await loadContent(['articles']);
document.documentElement.classList.add('is-ready');

/* =========================================================
   WIKI — articles. Engine: src/lib/wiki.js
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

// "2026-08-18" → "18 ago 2026"
const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');

const articleCover = (a, esc) => `
  <div class="cover" style="--c1:${a.c1};--c2:${a.c2}">
    ${a.img ? `<img src="${esc(a.img)}" alt="" loading="lazy">` : `
    <div class="cover-ui glass" aria-hidden="true"><span class="tag">${esc(a.tag)}</span><span class="ln"></span><span class="ln m"></span><span class="ln s"></span></div>`}
  </div>`;

initWiki({
  items: ARTICLES,
  // title, summary, tags, intro and the full reading text
  text: (a) => [a.title, a.summary, (a.tags || []).join(' '), a.intro,
    ...(a.sections || []).flatMap(s => [s.title, s.quote, ...s.body])].join(' '),
  sorters: {
    recent: (a, b) => b.date.localeCompare(a.date),
    old:    (a, b) => a.date.localeCompare(b.date),
    az:     (a, b) => a.title.localeCompare(b.title, 'pt'),
    short:  (a, b) => a.readMin - b.readMin || b.date.localeCompare(a.date)
  },
  noun: ['artigo', 'artigos'],
  emptyTitle: 'Nenhum artigo encontrado',
  hintIdle: 'Ex.: confiança, tokens, pesquisa. A busca começa a partir da 3ª letra. Atalho: /',
  transitionName: 'article-cover',
  row: (a, { terms, hl, esc, tags }) => `
    <a class="entry glass" href="artigo.html?a=${encodeURIComponent(a.id)}">
      ${articleCover(a, esc)}
      <div class="entry-body">
        <p class="entry-meta"><time datetime="${a.date}">${fmtDate(a.date)}</time> · <span class="num">${a.readMin}</span> min de leitura</p>
        <h2>${hl(a.title, terms)}</h2>
        <p class="sum">${hl(a.summary, terms)}</p>
        <ul class="entry-tags" aria-label="Temas">${(a.tags || []).map(t => `<li class="${tags.has(t) ? 'is-on' : ''}">${hl(t, terms)}</li>`).join('')}</ul>
      </div>
      <span class="entry-go" aria-hidden="true">→</span>
    </a>`
});

/* =========================================================
   MOTION — reveal, aurora scenes, sticky nav
   ========================================================= */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

const sceneIO = new IntersectionObserver((entries) => entries.forEach(en => {
  if (en.isIntersecting) document.body.dataset.scene = en.target.dataset.scene;
}), { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('main [data-scene]').forEach(s => sceneIO.observe(s));

const topnav = $('topnav');
const onScroll = () => {
  const y = scrollY;
  topnav.classList.toggle('is-stuck', y > 24);
  document.documentElement.style.setProperty('--scroll', Math.min(y / innerHeight, 6).toFixed(3));
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

$('year').textContent = new Date().getFullYear();
