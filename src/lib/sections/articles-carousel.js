import { esc } from '../home-render.js';
import { featuredFirst, filterTags } from '../content-map.js';

/* =========================================================
   ARTICLES - featured carousel, filter by tag, open reader
   Markup: src/partials/artigos.html (home and /artigos)
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* No published articles: the section leaves the page (it returns with the first article) */
export function initArticlesCarousel(ARTICLES, PROJECTS) {
  const section = document.getElementById('artigos');
  if (!section) return;
  if (!ARTICLES.length) { section.remove(); return; }
  const grid = document.getElementById('projectsGrid');
  /* Reader page is assembled from the article id in the URL */
  const articleHref = (a) => `artigo.html?a=${encodeURIComponent(a.id)}`;
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');
  /* "Destaque na home" articles open the carousel; the rest follow, newest first */
  const FEATURED = featuredFirst([...ARTICLES].sort((a, b) => b.date.localeCompare(a.date)));
  const projectOf = (a) => a.project && PROJECTS.find(p => p.id === a.project);
  grid.innerHTML = FEATURED.map((a, i) => {
    const rel = projectOf(a);
    return `
    <article class="project glass" aria-roledescription="slide" aria-label="${i + 1} de ${FEATURED.length}: ${esc(a.title)}" style="--c1:${a.c1}; --c2:${a.c2}" data-tags="${esc(a.tags.join('|'))}" data-index="${i}">
      <div class="cover">${a.img
        ? `<img src="${esc(a.img)}" alt="Capa do artigo ${esc(a.title)}" loading="lazy" width="1600" height="1000">`
        : `<div class="cover-ui glass"><span class="tag">${esc(a.tag)}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>
      <div class="project-body">
        <div class="project-meta"><time datetime="${esc(a.date)}">${fmtDate(a.date)}</time><span><span class="num">${esc(a.readMin)}</span> min de leitura</span></div>
        <h3><a class="project-open" href="${articleHref(a)}">${esc(a.title)}</a></h3>
        <p>${esc(a.summary)}</p>
        <ul class="project-deliver" aria-label="Temas">${a.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${rel ? `<p class="project-stack">Projeto relacionado: ${esc(rel.title)}</p>` : ''}
        <div class="project-foot">
          <a class="btn btn-ghost" href="${articleHref(a)}">Ler artigo <span class="arrow" aria-hidden="true">→</span></a>
          <span class="project-more" aria-hidden="true"><span class="num">${a.sections.length}</span> seções</span>
        </div>
      </div>
    </article>`;
  }).join('');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.project');
    if (!card) return;
    if (drag.moved) { e.preventDefault(); return; }
    if (!card.classList.contains('is-active')) { e.preventDefault(); goTo(visible().indexOf(card)); return; }
    card.querySelector('.cover').style.viewTransitionName = 'article-cover';   // morphs into the reader cover
    if (!e.target.closest('a')) location.href = articleHref(FEATURED[+card.dataset.index]);
  });
  /* coming back from an article: clear the morph name so only one element carries it */
  addEventListener('pageshow', () => grid.querySelectorAll('.cover').forEach(c => { c.style.viewTransitionName = ''; }));

  /* filters come from the published articles' tags (src/lib/content-map.js · filterTags) */
  section.querySelector('.filters').innerHTML = ['todos', ...filterTags(ARTICLES)].map((t, i) =>
    `<button class="filter" aria-pressed="${i === 0}" data-filter="${esc(t)}">${i === 0 ? 'Todos' : esc(t)}</button>`).join('');

  section.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
    section.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', b === btn));
    const f = btn.dataset.filter;
    grid.querySelectorAll('.project').forEach(card => card.classList.toggle('is-hidden', !(f === 'todos' || card.dataset.tags.split('|').includes(f))));
    grid.scrollLeft = 0;
    updateCarousel();
  }));

  /* =========================================================
     CAROUSEL - scroll-linked approach, arrows, keys, drag
     ========================================================= */
  const visible = () => [...grid.querySelectorAll('.project:not(.is-hidden)')];
  let active = 0;
  const updateCarousel = () => {
    const cards = visible();
    const mid = grid.scrollLeft + grid.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.forEach((card, i) => {
      const c = card.offsetLeft + card.offsetWidth / 2;
      const o = Math.max(-1.5, Math.min(1.5, (c - mid) / card.offsetWidth));   // signed, in slide widths
      card.style.setProperty('--o', o.toFixed(3));
      card.style.setProperty('--p', Math.max(0, 1 - Math.abs(o)).toFixed(3));
      if (Math.abs(o) < bestD) { bestD = Math.abs(o); best = i; }
    });
    active = best;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === best));
    const max = grid.scrollWidth - grid.clientWidth;
    document.getElementById('cProgress').style.setProperty('--progress', cards.length < 2 ? 1 : (max > 0 ? grid.scrollLeft / max : 1).toFixed(3));
    document.getElementById('cIndex').textContent = String(best + 1).padStart(2, '0');
    document.getElementById('cTotal').textContent = String(cards.length).padStart(2, '0');
    document.getElementById('cPrev').disabled = best === 0;
    document.getElementById('cNext').disabled = best === cards.length - 1;
  };
  const goTo = (i) => {
    const cards = visible(), card = cards[Math.max(0, Math.min(cards.length - 1, i))];
    if (!card) return;
    grid.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - grid.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
  };
  let cTick = false;
  grid.addEventListener('scroll', () => { if (!cTick) { cTick = true; requestAnimationFrame(() => { cTick = false; updateCarousel(); }); } }, { passive: true });
  addEventListener('resize', updateCarousel);
  document.getElementById('cPrev').addEventListener('click', () => goTo(active - 1));
  document.getElementById('cNext').addEventListener('click', () => goTo(active + 1));
  grid.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(active - 1); }
  });
  /* mouse drag (touch already scrolls natively).
     Snap stays off until our own release glide lands exactly on the target slide, so the
     browser never snaps back to the starting card mid-gesture (that was the "rebound"). */
  const drag = { on: false, moved: false, x: 0, left: 0, start: 0, v: 0, lx: 0, lt: 0 };
  let glideRaf = 0;
  const slideLeft = (card) => card.offsetLeft + card.offsetWidth / 2 - grid.clientWidth / 2;
  const glide = (i) => {
    const cards = visible(), card = cards[Math.max(0, Math.min(cards.length - 1, i))];
    const done = () => grid.classList.remove('is-free');
    if (!card) return done();
    const from = grid.scrollLeft, to = slideLeft(card), dist = Math.abs(to - from);
    if (reduce || dist < 1) { grid.scrollLeft = to; return done(); }
    const dur = Math.max(320, Math.min(700, 260 + dist * .5)), t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);   // ease-out: continues the throw, settles softly
      grid.scrollLeft = from + (to - from) * e;
      if (k < 1) glideRaf = requestAnimationFrame(step); else { grid.scrollLeft = to; done(); }
    };
    glideRaf = requestAnimationFrame(step);
  };
  grid.addEventListener('dragstart', (e) => e.preventDefault());
  grid.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.project-foot a')) return;
    cancelAnimationFrame(glideRaf);
    Object.assign(drag, { on: true, moved: false, x: e.clientX, left: grid.scrollLeft, start: active, v: 0, lx: e.clientX, lt: e.timeStamp });
  });
  addEventListener('pointermove', (e) => {
    if (!drag.on) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; grid.classList.add('is-free', 'is-dragging'); }
    if (!drag.moved) return;
    grid.scrollLeft = drag.left - dx;
    const dt = e.timeStamp - drag.lt;
    if (dt > 0) { drag.v = .8 * ((e.clientX - drag.lx) / dt) + .2 * drag.v; drag.lx = e.clientX; drag.lt = e.timeStamp; }
  });
  addEventListener('pointerup', (e) => {
    if (!drag.on) return;
    drag.on = false;
    if (!drag.moved) { grid.classList.remove('is-free'); return; }
    grid.classList.remove('is-dragging');
    const moved = grid.scrollLeft - drag.left, w = visible()[drag.start]?.offsetWidth || grid.clientWidth;
    const flick = e.timeStamp - drag.lt < 100 && Math.abs(drag.v) > .35;       // fast throw counts even if short
    const steps = Math.round(moved / w);                                          // dragged past whole slides
    let target = drag.start + steps;
    if (steps === 0 && (Math.abs(moved) > w * .12 || flick)) target += Math.sign(moved);  // intent: advance one
    glide(target);
    setTimeout(() => { drag.moved = false; }, 0);
  });
  updateCarousel();
}
