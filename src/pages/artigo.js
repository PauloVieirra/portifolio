import { loadContent } from '../lib/content.js';
import '../lib/overlays.js';

const { articles: ARTICLES, projects: PROJECTS } = await loadContent(['articles', 'projects']);
document.documentElement.classList.add('is-ready');

/* =========================================================
   ARTICLE — pick the article from the URL and render it
   artigo.html?a=<id>  (also accepts artigo.html#<id>)
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const main = document.getElementById('content');
const params = new URLSearchParams(location.search);
const wanted = params.get('a') || decodeURIComponent(location.hash.slice(1));
// reading order = newest first, so "próximo artigo" goes back in time
const ORDERED = [...ARTICLES].sort((x, y) => y.date.localeCompare(x.date));
const index = ORDERED.findIndex(a => a.id === wanted);

// "2026-08-18" → "18 ago 2026"
const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');

const cover = (a, cls = '', label = a.tag) => `
  <div class="cover ${cls}" style="--c1:${a.c1}; --c2:${a.c2}">${a.img
    ? `<img src="${a.img}" alt="Capa: ${a.title}" width="1600" height="1000">`
    : `<div class="cover-ui glass"><span class="tag">${label}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>`;
const figure = (a, f) => `
  <figure class="figure reveal">
    <div class="cover" style="--c1:${a.c1}; --c2:${a.c2}">${f.src
      ? `<img src="${f.src}" alt="${f.caption}" loading="lazy" width="1600" height="1000">`
      : `<div class="cover-ui glass"><span class="ln m"></span><span class="ln s"></span><span class="ln m"></span></div>`}</div>
    <figcaption>${f.caption}</figcaption>
  </figure>`;

const renderNotFound = () => {
  document.title = 'Artigo não encontrado — Paulo Vieira';
  main.innerHTML = `
    <section class="container not-found">
      <p class="eyebrow">Artigo não encontrado</p>
      <h1 class="art-title">Este artigo não existe ou mudou de endereço.</h1>
      <a class="btn btn-primary" href="artigos.html">Ver todos os artigos <span class="arrow">→</span></a>
    </section>`;
};

const renderArticle = (a) => {
  const next = ORDERED[(index + 1) % ORDERED.length];
  const project = PROJECTS.find(p => p.id === a.project);
  const sections = a.sections || [];
  document.title = `${a.title} — Paulo Vieira · UX IA Engineer`;
  document.querySelector('meta[name="description"]').content = a.summary;

  main.innerHTML = `
    <article>
      <header class="container art-head" data-scene="hero">
        <a class="back-link reveal" href="artigos.html">← Todos os artigos</a>
        <p class="eyebrow reveal" style="--i:1"><time datetime="${a.date}">${fmtDate(a.date)}</time> · <span class="num">${a.readMin}</span> min de leitura</p>
        <h1 class="art-title reveal" style="--i:2">${a.title}</h1>
        <p class="art-intro reveal" style="--i:3">${a.intro}</p>
        <div class="byline reveal" style="--i:4">
          <p class="author"><span class="brand-mark" aria-hidden="true">PV</span><span><b>Paulo Vieira</b><span>UX IA Engineer</span></span></p>
          <ul class="art-tags" aria-label="Temas">${(a.tags || []).map(t =>
            `<li><a href="artigos.html?tags=${encodeURIComponent(t)}">${t}</a></li>`).join('')}</ul>
        </div>
      </header>

      <div class="container">${cover(a, 'art-cover')}</div>

      <div class="container art-body" data-scene="projetos">
        <nav class="toc" aria-label="Neste artigo">
          <p class="eyebrow">Neste artigo</p>
          ${sections.map(s => `<a href="#${s.id}" data-toc="${s.id}">${s.title}</a>`).join('')}
          ${project ? `<a class="btn btn-ghost btn-sm" href="projeto.html?p=${encodeURIComponent(project.id)}">Ver o projeto <span class="arrow">→</span></a>` : ''}
        </nav>
        <div class="prose">
          ${sections.map(s => `
            <section class="prose-sec" id="${s.id}">
              <h2 class="reveal">${s.title}</h2>
              ${s.body.map(t => `<p class="reveal">${t}</p>`).join('')}
              ${s.quote ? `<blockquote class="pull reveal">${s.quote}</blockquote>` : ''}
              ${s.figure ? figure(a, s.figure) : ''}
            </section>`).join('')}
        </div>
      </div>

      <footer class="container art-end" data-scene="contato">
        <div class="end-cta glass reveal">
          <p class="eyebrow">Continue lendo</p>
          <h2><strong>Mais</strong> artigos sobre ${(a.tags || ['design'])[0]}</h2>
          <a class="btn btn-primary" href="artigos.html?tags=${encodeURIComponent((a.tags || [])[0] || '')}">Ver artigos <span class="arrow">→</span></a>
        </div>
        <div class="end-grid">
          ${project ? `
          <a class="next-card related glass reveal" href="projeto.html?p=${encodeURIComponent(project.id)}" aria-label="Projeto relacionado: ${project.title}">
            ${cover(project, '', project.tag)}
            <div class="next-info">
              <p class="eyebrow">Projeto relacionado</p>
              <h3>${project.title}</h3>
              <p class="go">Ler estudo de caso →</p>
            </div>
          </a>` : ''}
          ${next && next !== a ? `
          <a class="next-card glass reveal" href="artigo.html?a=${encodeURIComponent(next.id)}" aria-label="Próximo artigo: ${next.title}">
            ${cover(next)}
            <div class="next-info">
              <p class="eyebrow">Próximo artigo</p>
              <h3>${next.title}</h3>
              <p class="go"><span class="num">${next.readMin}</span> min de leitura →</p>
            </div>
          </a>` : ''}
        </div>
      </footer>
    </article>`;
};

index < 0 ? renderNotFound() : renderArticle(ORDERED[index]);

/* =========================================================
   MOTION — reveal, aurora scenes, reading progress, cover approach, toc
   ========================================================= */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* aurora overlays re-arrange as the reader moves header → body → end */
const sceneIO = new IntersectionObserver((entries) => entries.forEach(en => {
  if (en.isIntersecting) document.body.dataset.scene = en.target.dataset.scene;
}), { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('main [data-scene]').forEach(s => sceneIO.observe(s));

const tocLinks = [...document.querySelectorAll('[data-toc]')];
const tocIO = new IntersectionObserver((entries) => entries.forEach(en => {
  if (en.isIntersecting) tocLinks.forEach(a => a.classList.toggle('is-active', a.dataset.toc === en.target.id));
}), { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('.prose-sec').forEach(s => tocIO.observe(s));

const topnav = document.getElementById('topnav');
const bar = document.getElementById('readProgress');
const artCover = document.querySelector('.art-cover');
let ticking = false;
const onScroll = () => {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  topnav.classList.toggle('is-stuck', y > 24);
  document.documentElement.style.setProperty('--scroll', Math.min(y / innerHeight, 6).toFixed(3));
  bar.style.setProperty('--read', max > 0 ? (y / max).toFixed(4) : 0);
  if (artCover && !reduce) {
    const r = artCover.getBoundingClientRect();
    const near = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * .6)));
    artCover.style.setProperty('--near', near.toFixed(3));
  }
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

document.getElementById('year').textContent = new Date().getFullYear();
