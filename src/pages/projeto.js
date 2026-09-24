import { PROJECTS } from '../data/projects.js';
import '../lib/overlays.js';

/* =========================================================
   ARTICLE — pick the project from the URL and render it
   projeto.html?p=<id>  (also accepts projeto.html#<id>)
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const main = document.getElementById('content');
const params = new URLSearchParams(location.search);
const wanted = params.get('p') || decodeURIComponent(location.hash.slice(1));
const index = PROJECTS.findIndex(p => p.id === wanted);

const cover = (p, cls = '') => `
  <div class="cover ${cls}" style="--c1:${p.c1}; --c2:${p.c2}">${p.img
    ? `<img src="${p.img}" alt="Tela do projeto ${p.title}" width="1600" height="1000">`
    : `<div class="cover-ui glass"><span class="tag">${p.tag}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>`;
const figure = (p, f) => `
  <figure class="figure reveal">
    <div class="cover" style="--c1:${p.c1}; --c2:${p.c2}">${f.src
      ? `<img src="${f.src}" alt="${f.caption}" loading="lazy" width="1600" height="1000">`
      : `<div class="cover-ui glass"><span class="ln m"></span><span class="ln s"></span><span class="ln m"></span></div>`}</div>
    <figcaption>${f.caption}</figcaption>
  </figure>`;
/* CTA to the published project. Until `url` is filled in src/data/projects.js it renders disabled. */
const projectLink = (p, cls, label = 'Ver projeto publicado') => p.url
  ? `<a class="${cls}" href="${p.url}" target="_blank" rel="noopener" aria-label="${label}: ${p.title} (abre em nova aba)">${label} <span class="arrow">↗</span></a>`
  : `<a class="${cls}" aria-disabled="true" role="link">Link do projeto em breve</a>`;

const renderNotFound = () => {
  document.title = 'Projeto não encontrado — Paulo Vieira';
  main.innerHTML = `
    <section class="container not-found">
      <p class="eyebrow">Projeto não encontrado</p>
      <h1 class="art-title">Este estudo de caso não existe ou mudou de endereço.</h1>
      <a class="btn btn-primary" href="projetos.html">Ver todos os projetos <span class="arrow">→</span></a>
    </section>`;
};

const renderArticle = (p) => {
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const a = p.article || { intro: p.summary, sections: [] };
  document.title = `${p.title} — Paulo Vieira · UX IA Engineer`;
  document.querySelector('meta[name="description"]').content = p.summary;

  main.innerHTML = `
    <article>
      <header class="container art-head" data-scene="hero">
        <a class="back-link reveal" href="projetos.html">← Todos os projetos</a>
        <p class="eyebrow reveal" style="--i:1">${p.catLabel} · <span class="num">${p.year}</span></p>
        <h1 class="art-title reveal" style="--i:2">${p.title}</h1>
        <p class="art-intro reveal" style="--i:3">${a.intro}</p>
        <div class="art-actions reveal" style="--i:4">
          ${projectLink(p, 'btn btn-primary')}
          ${a.sections.length ? `<a class="btn btn-ghost" href="#${a.sections[0].id}">Ler o estudo <span class="arrow">↓</span></a>` : ''}
        </div>
        <dl class="art-facts glass reveal" style="--i:5">
          <div class="wide"><dt>Meu papel</dt><dd>${p.role}</dd></div>
          <div><dt>Categoria</dt><dd>${p.catLabel}</dd></div>
          <div><dt>Ano</dt><dd class="num">${p.year}</dd></div>
          <div><dt>Stack</dt><dd>${p.stack}</dd></div>
        </dl>
      </header>

      <div class="container">${cover(p, 'art-cover')}</div>

      <div class="container art-body" data-scene="projetos">
        <nav class="toc" aria-label="Neste estudo">
          <p class="eyebrow">Neste estudo</p>
          ${a.sections.map(s => `<a href="#${s.id}" data-toc="${s.id}">${s.title}</a>`).join('')}
          <a href="#entregas" data-toc="entregas">Entregas</a>
          ${projectLink(p, 'btn btn-ghost btn-sm', 'Ver projeto')}
        </nav>
        <div class="prose">
          <blockquote class="challenge glass reveal">
            <p class="eyebrow">O desafio</p>
            <p>${p.challenge}</p>
          </blockquote>
          ${a.sections.map(s => `
            <section class="prose-sec" id="${s.id}">
              <h2 class="reveal">${s.title}</h2>
              ${s.body.map(t => `<p class="reveal">${t}</p>`).join('')}
              ${s.figure ? figure(p, s.figure) : ''}
            </section>`).join('')}
          <section class="prose-sec" id="entregas">
            <h2 class="reveal">Entregas</h2>
            <ul class="deliver-list reveal">${p.deliver.map(d => `<li>${d}</li>`).join('')}</ul>
          </section>
        </div>
      </div>

      <footer class="container art-end" data-scene="contato">
        <div class="end-cta glass reveal">
          <p class="eyebrow">Projeto publicado</p>
          <h2><strong>Veja</strong> funcionando</h2>
          ${projectLink(p, 'btn btn-primary')}
        </div>
        ${next && next !== p ? `
        <a class="next-card glass reveal" href="projeto.html?p=${encodeURIComponent(next.id)}" aria-label="Próximo projeto: ${next.title}">
          ${cover(next)}
          <div class="next-info">
            <p class="eyebrow">Próximo projeto</p>
            <h3>${next.title}</h3>
            <p class="go">Ler estudo de caso →</p>
          </div>
        </a>` : ''}
      </footer>
    </article>`;
};

index < 0 ? renderNotFound() : renderArticle(PROJECTS[index]);

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
