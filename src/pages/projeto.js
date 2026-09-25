import { loadContent } from '../lib/content.js';
import { showConstructionNotice } from '../lib/notice.js';
import { md, mdInline, isLead, groupItems } from '../lib/markdown.js';
import { sectionImages, figuresHTML } from '../lib/figures.js';
import { esc } from '../lib/home-render.js';
import { initLightbox } from '../lib/lightbox.js';
import '../lib/overlays.js';

const { projects: PROJECTS } = await loadContent(['projects']);
document.documentElement.classList.add('is-ready');
showConstructionNotice();

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
    ? `<img src="${esc(p.img)}" alt="Tela do projeto ${esc(p.title)}" width="1600" height="1000">`
    : `<div class="cover-ui glass"><span class="tag">${esc(p.tag)}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>`;
/* CTA to the published project. Until `url` is filled in the admin it renders disabled. */
const projectLink = (p, cls, label = 'Ver projeto publicado') => p.url
  ? `<a class="${cls}" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="${label}: ${esc(p.title)} (abre em nova aba)">${label} <span class="arrow">↗</span></a>`
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
  /* a short intro is the opening line; a long one opens the study and the summary takes the top */
  const longIntro = a.intro && !isLead(a.intro);
  /* optional fields render nothing when empty (the admin only requires title and summary) */
  const eyebrow = [p.catLabel && esc(p.catLabel), p.year && `<span class="num">${esc(p.year)}</span>`].filter(Boolean).join(' · ');
  const facts = [
    p.role && `<div class="wide${p.role.length > 160 ? ' full' : ''}"><dt>Meu papel</dt><dd>${md(p.role)}</dd></div>`,
    p.catLabel && `<div><dt>Categoria</dt><dd>${esc(p.catLabel)}</dd></div>`,
    p.year && `<div><dt>Ano</dt><dd class="num">${esc(p.year)}</dd></div>`,
    p.stack && `<div><dt>Stack</dt><dd>${esc(p.stack)}</dd></div>`,
  ].filter(Boolean).join('');
  const deliver = groupItems(p.deliver).filter(d => d.text);
  document.title = `${p.title} — Paulo Vieira · UX IA Engineer`;
  document.querySelector('meta[name="description"]').content = p.summary;

  main.innerHTML = `
    <article>
      <header class="container art-head" data-scene="hero">
        <a class="back-link reveal" href="projetos.html">← Todos os projetos</a>
        ${eyebrow ? `<p class="eyebrow reveal" style="--i:1">${eyebrow}</p>` : ''}
        <h1 class="art-title reveal" style="--i:2">${esc(p.title)}</h1>
        <p class="art-intro reveal" style="--i:3">${mdInline(longIntro || !a.intro ? p.summary : a.intro)}</p>
        <div class="art-actions reveal" style="--i:4">
          ${projectLink(p, 'btn btn-primary')}
          ${a.sections.length ? `<a class="btn btn-ghost" href="#${esc(a.sections[0].id)}">Ler o estudo <span class="arrow">↓</span></a>` : ''}
        </div>
        ${facts ? `<dl class="art-facts glass reveal" style="--i:5">${facts}</dl>` : ''}
      </header>

      <div class="container">${cover(p, 'art-cover')}</div>

      <div class="container art-body" data-scene="projetos">
        <nav class="toc" aria-label="Neste estudo">
          <p class="eyebrow">Neste estudo</p>
          ${longIntro ? '<a href="#introducao" data-toc="introducao">Introdução</a>' : ''}
          ${a.sections.map(s => `<a href="#${esc(s.id)}" data-toc="${esc(s.id)}">${esc(s.title)}</a>`).join('')}
          ${p.gallery?.length ? '<a href="#galeria" data-toc="galeria">Galeria</a>' : ''}
          ${deliver.length ? '<a href="#entregas" data-toc="entregas">Entregas</a>' : ''}
          ${projectLink(p, 'btn btn-ghost btn-sm', 'Ver projeto')}
        </nav>
        <div class="prose">
          ${longIntro ? `<section class="prose-sec" id="introducao">${md(a.intro, { cls: 'reveal' })}</section>` : ''}
          ${p.challenge ? `<blockquote class="challenge glass reveal">
            <p class="eyebrow">O desafio</p>
            ${md(p.challenge)}
          </blockquote>` : ''}
          ${a.sections.map(s => `
            <section class="prose-sec" id="${esc(s.id)}">
              <h2 class="reveal">${esc(s.title)}</h2>
              ${md(s.body.join('\n\n'), { cls: 'reveal' })}
              ${figuresHTML(sectionImages(s), p)}
            </section>`).join('')}
          ${p.gallery?.length ? `<section class="prose-sec" id="galeria"><h2 class="reveal">Galeria</h2>${figuresHTML(p.gallery, p)}</section>` : ''}
          ${deliver.length ? `<section class="prose-sec" id="entregas">
            <h2 class="reveal">Entregas</h2>
            <ul class="deliver-list reveal">${deliver.map(d => `<li>${mdInline(d.text)}${d.children.length ? ` ${d.children.map(mdInline).join(', ')}` : ''}</li>`).join('')}</ul>
          </section>` : ''}
        </div>
      </div>

      <footer class="container art-end" data-scene="contato">
        <div class="end-cta glass reveal">
          <p class="eyebrow">Projeto publicado</p>
          <h2><strong>Veja</strong> funcionando</h2>
          ${projectLink(p, 'btn btn-primary')}
        </div>
        ${next && next !== p ? `
        <a class="next-card glass reveal" href="projeto.html?p=${encodeURIComponent(next.id)}" aria-label="Próximo projeto: ${esc(next.title)}">
          ${cover(next)}
          <div class="next-info">
            <p class="eyebrow">Próximo projeto</p>
            <h3>${esc(next.title)}</h3>
            <p class="go">Ler estudo de caso →</p>
          </div>
        </a>` : ''}
      </footer>
    </article>`;
};

index < 0 ? renderNotFound() : renderArticle(PROJECTS[index]);
initLightbox();

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
