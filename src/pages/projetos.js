import { loadContent } from '../lib/content.js';
import { initWiki } from '../lib/wiki.js';
import '../lib/overlays.js';

const { projects: PROJECTS } = await loadContent(['projects']);
document.documentElement.classList.add('is-ready');

/* =========================================================
   WIKI — projects. Engine: src/lib/wiki.js
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

const projectCover = (p, esc) => `
  <div class="cover" style="--c1:${p.c1};--c2:${p.c2}">
    ${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : `
    <div class="cover-ui glass" aria-hidden="true"><span class="tag">${esc(p.tag)}</span><span class="ln"></span><span class="ln m"></span><span class="ln s"></span></div>`}
  </div>`;

initWiki({
  items: PROJECTS,
  // title, summary, tags, category, stack, deliverables, article text
  text: (p) => [p.title, p.summary, p.catLabel, p.year, p.stack, (p.tags || []).join(' '), (p.deliver || []).join(' '),
    p.challenge, p.article?.intro, ...(p.article?.sections || []).flatMap(s => [s.title, ...s.body])].join(' '),
  sorters: {
    recent: (a, b) => b.year - a.year || a.title.localeCompare(b.title, 'pt'),
    old:    (a, b) => a.year - b.year || a.title.localeCompare(b.title, 'pt'),
    az:     (a, b) => a.title.localeCompare(b.title, 'pt')
  },
  noun: ['projeto', 'projetos'],
  emptyTitle: 'Nenhum projeto encontrado',
  hintIdle: 'Ex.: prompt, React, saúde. A busca começa a partir da 3ª letra. Atalho: /',
  transitionName: 'project-cover',
  row: (p, { terms, hl, esc, tags }) => `
    <a class="entry glass" href="projeto.html?p=${encodeURIComponent(p.id)}">
      ${projectCover(p, esc)}
      <div class="entry-body">
        <p class="entry-meta">${esc(p.catLabel)} · <span class="num">${esc(p.year)}</span></p>
        <h2>${hl(p.title, terms)}</h2>
        <p class="sum">${hl(p.summary, terms)}</p>
        <ul class="entry-tags" aria-label="Temas">${(p.tags || []).map(t => `<li class="${tags.has(t) ? 'is-on' : ''}">${hl(t, terms)}</li>`).join('')}</ul>
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
