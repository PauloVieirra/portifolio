import { loadContent } from '../lib/content.js';
import { renderHome } from '../lib/home-render.js';
import { featuredFirst } from '../lib/content-map.js';
import { closeOverlays } from '../lib/overlays.js';

/* Content comes from Supabase (src/lib/content.js; falls back to src/data + the static HTML). The admin-managed
   home blocks are rendered first, so the carousel, orbit, timeline and reveal code below see the final DOM.
   PROJECTS fill the featured bento and name each article's related project; ARTICLES fill the carousel. */
const { projects: PROJECTS, articles: ARTICLES, timeline: TIMELINE, site: SITE } =
  await loadContent(['projects', 'articles', 'timeline', 'site']);
renderHome(SITE, TIMELINE);
document.documentElement.classList.add('is-ready');

/* =========================================================
   IN-PAGE LINKS — scroll only this page
   ========================================================= */
/* Runs in the capture phase so it wins over any host click handler: a plain
   scrollIntoView() also scrolls whatever frame embeds this page. */
addEventListener('click', (e) => {
  const link = e.target instanceof Element && e.target.closest('a[href^="#"]');
  if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  /* in a frame stretched to the page height the frame cannot scroll: the host scrolls the canvas instead */
  if (document.documentElement.classList.contains('is-canvas')) return;
  e.preventDefault();
  e.stopPropagation();
  if (link.hasAttribute('data-overlay-close')) closeOverlays();
  const id = link.getAttribute('href').slice(1);
  const target = id && document.getElementById(id);
  if (!target) return;   /* "#" placeholders stay put */
  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: reduce ? 'auto' : 'smooth' });
  try { history.replaceState(null, '', location.href.split('#')[0] + '#' + id); } catch (_) {}
}, true);

/* =========================================================
   ARTICLES — featured carousel, filter by tag, open reader
   ========================================================= */
/* No published articles: the section and its menu links leave the page (they return with the first article) */
if (!ARTICLES.length) {
  document.getElementById('artigos').remove();
  document.querySelectorAll('a[href="#artigos"]').forEach(a => a.remove());
} else {
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
    <article class="project glass" aria-roledescription="slide" aria-label="${i + 1} de ${FEATURED.length}: ${a.title}" style="--c1:${a.c1}; --c2:${a.c2}" data-tags="${a.tags.join('|')}" data-index="${i}">
      <div class="cover">${a.img
        ? `<img src="${a.img}" alt="Capa do artigo ${a.title}" loading="lazy" width="1600" height="1000">`
        : `<div class="cover-ui glass"><span class="tag">${a.tag}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>
      <div class="project-body">
        <div class="project-meta"><time datetime="${a.date}">${fmtDate(a.date)}</time><span><span class="num">${a.readMin}</span> min de leitura</span></div>
        <h3><a class="project-open" href="${articleHref(a)}">${a.title}</a></h3>
        <p>${a.summary}</p>
        <ul class="project-deliver" aria-label="Temas">${a.tags.map(t => `<li>${t}</li>`).join('')}</ul>
        ${rel ? `<p class="project-stack">Projeto relacionado: ${rel.title}</p>` : ''}
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

  document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', b === btn));
    const f = btn.dataset.filter;
    grid.querySelectorAll('.project').forEach(card => card.classList.toggle('is-hidden', !(f === 'todos' || card.dataset.tags.split('|').includes(f))));
    grid.scrollLeft = 0;
    updateCarousel();
  }));

  /* =========================================================
     CAROUSEL — scroll-linked approach, arrows, keys, drag
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

/* =========================================================
   PROJECTS — featured bento; open the case study
   ========================================================= */
/* "Destaque na home" (featured) projects open the bento; the others fill it up to three, in the admin's order */
const worksEl = document.getElementById('works');
const projectHref = (p) => `projeto.html?p=${encodeURIComponent(p.id)}`;
const flagged = PROJECTS.filter(p => p.featured);
const WORKS = [...flagged, ...PROJECTS.filter(p => !p.featured)].slice(0, 3);
const worksRest = PROJECTS.length - WORKS.length;
worksEl.innerHTML = WORKS.map((p, i) => `
  <a class="work reveal${i === 0 ? ' work--lead' : ''}" href="${projectHref(p)}" style="--i:${i}; --c1:${p.c1}; --c2:${p.c2}">
    <div class="cover" aria-hidden="true">${p.img
      ? `<img src="${p.img}" alt="" loading="lazy" width="1600" height="1000">`
      : `<div class="cover-ui glass"><span class="tag">${p.tag}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>
    <span class="work-go glass" aria-hidden="true">→</span>
    <div class="work-panel glass">
      <div class="work-meta"><span>${p.catLabel}</span><span class="num">${p.year}</span></div>
      <h3>${p.title}</h3>
      <div class="work-more"><div>
        <p>${p.summary}</p>
        <ul class="work-tags" aria-label="Temas">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
      </div></div>
    </div>
  </a>`).join('') + (worksRest > 0 ? `
  <div class="works-more glass reveal" style="--i:3">
    <p>Mais <b class="num">${worksRest}</b> ${worksRest === 1 ? 'projeto' : 'projetos'} na busca, com filtros por tema.</p>
    <a href="projetos.html" class="btn btn-ghost btn-sm">Ver todos os projetos <span class="arrow" aria-hidden="true">→</span></a>
  </div>` : '');
/* the strip sits outside the grid so the cards can become a swipe rail on small screens */
const worksMoreEl = worksEl.querySelector('.works-more');
if (worksMoreEl) worksEl.after(worksMoreEl);
/* the clicked cover morphs into the case-study cover */
worksEl.addEventListener('click', (e) => {
  const card = e.target.closest('.work');
  if (card) card.querySelector('.cover').style.viewTransitionName = 'project-cover';
});
addEventListener('pageshow', () => worksEl.querySelectorAll('.cover').forEach(c => { c.style.viewTransitionName = ''; }));

/* =========================================================
   MOTION — reveal, scenes, nav state, parallax
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: '0px' });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

const navLinks = document.querySelectorAll('[data-nav]');
const scenes = [...document.querySelectorAll('main > [data-scene]')];
/* Active section = the last one whose top has crossed 60% of the screen (it fills 40%+ of it).
   Pure geometry on every scroll tick, so it reads the same going down and coming back up. */
let currentScene = '';
const setScene = (scene) => {
  if (scene === currentScene) return;
  currentScene = scene;
  document.body.dataset.scene = scene;
  navLinks.forEach(a => {
    const on = a.dataset.nav === scene;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  spineDots.forEach(d => d.classList.toggle('is-active', d.dataset.scene === scene));
};
const trackScene = () => {
  const line = innerHeight * 0.6;
  let idx = 0;
  scenes.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) idx = i; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) idx = scenes.length - 1;
  setScene(scenes[idx].dataset.scene);
};

/* SPINE — one line from the hero eyebrow to the contact card, a dot beside each section title */
const mainEl = document.getElementById('content');
const spine = document.getElementById('spine');
const spineDots = [];
let spineTop = 0, spineH = 0;
const offsetIn = (el) => { let y = 0; for (let n = el; n && n !== mainEl; n = n.offsetParent) y += n.offsetTop; return y; };
const layoutSpine = () => {
  const anchors = scenes.map(s => s.querySelector('.eyebrow')).filter(Boolean);
  if (anchors.length < 2) return;
  const first = anchors[0], last = anchors[anchors.length - 1];
  spineTop = offsetIn(first) + first.offsetHeight / 2;
  spineH = offsetIn(last) + last.offsetHeight / 2 - spineTop;
  const x = first.getBoundingClientRect().left - mainEl.getBoundingClientRect().left;
  const sx = Math.max(x / 2, 6);
  spine.style.setProperty('--spine-x', `${sx.toFixed(1)}px`);
  const spineLeft = mainEl.getBoundingClientRect().left + sx;
  anchors.forEach(a => a.style.setProperty('--branch', `${(a.getBoundingClientRect().left - spineLeft).toFixed(1)}px`));
  spine.style.top = `${spineTop}px`;
  spine.style.height = `${spineH}px`;
  if (!spineDots.length) anchors.forEach(a => {
    const d = document.createElement('span');
    d.className = 'spine-dot';
    d.dataset.scene = a.closest('[data-scene]').dataset.scene;
    spine.appendChild(d); spineDots.push(d);
  });
  anchors.forEach((a, i) => { spineDots[i].style.top = `${offsetIn(a) + a.offsetHeight / 2 - spineTop}px`; });
  spineDots.forEach(d => d.classList.toggle('is-active', d.dataset.scene === currentScene));
};
const fillSpine = () => {
  if (!spineH) return;
  const y = innerHeight * 0.6 - mainEl.getBoundingClientRect().top - spineTop;
  const p = Math.min(Math.max(y / spineH, 0), 1);
  spine.style.setProperty('--spine', p.toFixed(3));
  spineDots.forEach(d => d.classList.toggle('is-past', parseFloat(d.style.top) <= p * spineH + 1));
};
layoutSpine();
addEventListener('resize', () => { layoutSpine(); fillSpine(); trackScene(); });
addEventListener('load', () => { layoutSpine(); fillSpine(); });
document.fonts && document.fonts.ready.then(layoutSpine);

const topnav = document.getElementById('topnav');
const timeline = document.getElementById('timeline');
let ticking = false;
const onScroll = () => {
  const y = scrollY;
  topnav.classList.toggle('is-stuck', y > 24);
  document.documentElement.style.setProperty('--scroll', Math.min(y / innerHeight, 6).toFixed(3));
  const r = timeline.getBoundingClientRect();
  const t = Math.min(Math.max((innerHeight * 0.6 - r.top) / r.height, 0), 1);
  timeline.style.setProperty('--tl', t.toFixed(3));
  trackScene();
  fillSpine();
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

const tlIO = new IntersectionObserver((entries) => entries.forEach(en => en.isIntersecting && en.target.classList.add('is-in')), { rootMargin: '-40% 0px -40% 0px' });
timeline.querySelectorAll('.tl-item').forEach(el => tlIO.observe(el));

/* =========================================================
   HERO ORBIT — KPI bubbles circle the portrait on a tilted
   ellipse. Front half renders over the photo, back half behind.
   Clicking a bubble rotates the orbit until it sits in front and
   its tags fan out, one by one, along its right edge (lists over
   6 split between both sides, 5 per side at most). Losing focus
   (outside click, Esc, same bubble) sends them back, in reverse.
   ========================================================= */
(() => {
  const stage = document.getElementById('heroVisual');
  const kpis = [...stage.querySelectorAll('.kpi')];
  const groups = kpis.map(k => [...document.getElementById(k.getAttribute('aria-controls')).children]
    .map(el => ({ el, v: 0, start: 0, w: 0, h: 0 })));
  // Tags split evenly across both sides of the bubble (odd counts put the extra one on the right).
  // Rows are reassigned by width on every measure (see below).
  groups.forEach(g => {
    const n = g.length, right = Math.ceil(n / 2);
    g.forEach((t, j) => {
      t.side = j < right ? 1 : -1;
      t.row = j < right ? j : j - right;
      t.rows = j < right ? right : n - right;
    });
    g.maxRows = Math.max(...g.map(t => t.rows));
  });
  const STEP = Math.PI * 2 / kpis.length;
  const TILT = -10 * Math.PI / 180;
  const TAG_TILT = -16 * Math.PI / 180;    // satellite ellipse: wide + flat so tags pass outside the bubble text
  const SPEED = 0.00011;                   // rad per ms (~57s per turn)
  const TAG_SPEED = 0.00042;               // satellites turn ~4× faster than the main orbit
  const TAG_DUR = 460, TAG_STAGGER = 70;   // per-tag travel time + delay between siblings
  let rot = 0.35, tween = null, holdUntil = 0, hovering = false, visible = true, last = performance.now();
  let spin = 0, active = -1, targets = [], d = {};
  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (v) => v * v * (3 - 2 * v);

  // Satellite ring: siblings are spaced by equal arc length (not equal angle), so the
  // gap between neighbouring tags stays even all the way round the flat ellipse.
  const SPREAD = 1.35, FLAT = .6, ARC = [0];
  for (let q = 1; q <= 256; q++) {
    const a = (q - .5) / 256 * Math.PI * 2;
    ARC.push(ARC[q - 1] + Math.hypot(SPREAD * Math.sin(a), FLAT * Math.cos(a)));
  }
  const arcAngle = (u) => {
    const turns = Math.floor(u / (Math.PI * 2)), want = (u / (Math.PI * 2) - turns) * ARC[256];
    let lo = 0, hi = 256;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ARC[m] < want) lo = m; else hi = m; }
    const f = (want - ARC[lo]) / (ARC[hi] - ARC[lo] || 1);
    return (turns + (lo + f) / 256) * Math.PI * 2;
  };

  // Person silhouette (alpha of the cut-out portrait), sampled low-res. Used to fade a
  // tag only where it overlaps the body while its bubble swaps from behind the photo to
  // in front of it (or back), so it never visibly "passes through" the arm.
  const photo = stage.querySelector('.portrait img');
  const mask = { w: 64, h: 96, a: null, x: 0, y: 0, sw: 1, sh: 1 };
  const readMask = () => {
    try {
      const c = document.createElement('canvas'); c.width = mask.w; c.height = mask.h;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(photo, 0, 0, mask.w, mask.h);
      const px = g.getImageData(0, 0, mask.w, mask.h).data;
      mask.a = new Uint8Array(mask.w * mask.h).map((_, q) => px[q * 4 + 3] > 96);
    } catch { mask.a = null; }             // tainted canvas → fall back to a body-shaped band
  };
  if (photo) photo.complete && photo.naturalWidth ? readMask() : photo.addEventListener('load', () => { readMask(); measure(); place(); }, { once: true });
  const onBody = (x, y) => {
    if (y < 0 || y > d.h) return false;                  // the photo is cropped at the section floor
    if (!photo?.isConnected) return false;
    if (!mask.a) return Math.abs(x - d.cx) < d.w * .3 && y > d.h * .12;
    const u = Math.floor((x - mask.x) / mask.sw * mask.w), v = Math.floor((y - mask.y) / mask.sh * mask.h);
    return u >= 0 && v >= 0 && u < mask.w && v < mask.h && !!mask.a[v * mask.w + u];
  };

  const measure = () => {
    const w = stage.clientWidth, h = stage.clientHeight, b = kpis[0].offsetWidth;
    // Wide enough to clear the arms; on small screens the side bubbles (scale ~.82) stay inside the viewport.
    const r = stage.getBoundingClientRect();
    const room = Math.min(r.left + w * .5, innerWidth - r.left - w * .5) - b * .41 - 8;
    d = { cx: w * .5, cy: h * .6, rx: Math.min(w * .5 + b * .35, room), ry: h * .22, b, w, h };
    if (photo?.isConnected) {
      const pr = photo.getBoundingClientRect();
      Object.assign(mask, { x: pr.left - r.left, y: pr.top - r.top, sw: pr.width || 1, sh: pr.height || 1 });
    }
    stage.style.setProperty('--orbit-w', `${(d.rx * 2).toFixed(0)}px`);
    stage.style.setProperty('--orbit-h', `${(d.ry * 2).toFixed(0)}px`);
    // Natural tag sizes, then pick where each bubble parks so its list(s) fit.
    groups.flat().forEach(t => { t.el.style.maxWidth = 'none'; });
    groups.flat().forEach(t => { t.w = t.nw = t.el.offsetWidth; t.h = t.el.offsetHeight; });
    // Each column is ordered by natural width: widest at the bottom, narrowest on top.
    groups.forEach(g => [1, -1].forEach(side => {
      g.filter(t => t.side === side).sort((p, q) => q.nw - p.nw)
        .forEach((t, k) => { t.row = t.rows - 1 - k; });
    }));
    const edge = innerWidth - r.left - 12, left = -r.left + 12;  // stage-local viewport limits
    const R = b * 1.28 / 2 + 12;                                 // selected bubble radius + gap
    // Every selected bubble parks at the bottom centre of the portrait: the front point
    // of the tilted ellipse whose x is exactly the stage centre.
    const tg = Math.atan2(d.rx * Math.cos(TILT), d.ry * Math.sin(TILT)), fx = d.cx;
    targets = groups.map(g => {
      const maxR = Math.max(72, edge - fx - R), maxL = Math.max(72, fx - R - left);
      g.forEach(t => {
        const m = t.side > 0 ? maxR : maxL;
        t.el.style.maxWidth = `${m.toFixed(0)}px`;
        t.w = Math.min(t.w, m);
      });
      return tg;
    });
  };
  const norm = (a) => Math.atan2(Math.sin(a), Math.cos(a));

  const placeTags = (i, x, y, s, alpha, z, pd, now, dt) => {
    const tags = groups[i], n = tags.length, open = i === active;
    const R = d.b * s / 2 + 12;
    tags.forEach((t, j) => {
      // Advance this tag's orbit→list progress once its stagger slot has come up.
      if (now >= t.start) t.v = reduce ? +open : clamp(t.v + (open ? dt : -dt) / TAG_DUR, 0, 1);
      const e = ease(t.v);
      // Orbit: tilted ellipse around the bubble; back half dimmer and behind it.
      const a = arcAngle(spin + j * (Math.PI * 2 / n) + i * .9);
      const ex = Math.cos(a) * d.b * s * SPREAD, ey = Math.sin(a) * d.b * s * FLAT;
      const depth = Math.sin(a), k = (depth + 1) / 2;
      const os = (.68 + .14 * k) * clamp(s, .8, 1.1);   // small, but never below legible size
      const ox = x + ex * Math.cos(TAG_TILT) - ey * Math.sin(TAG_TILT) - t.w * os / 2;
      const oy = y + ex * Math.sin(TAG_TILT) + ey * Math.cos(TAG_TILT);
      // Arm crossing: the bubble flips over/under the photo at depth -0.1. Around that
      // moment, each tag fades by how much of it sits on the body, then fades back in.
      const near = smooth(clamp(Math.abs(pd + .1) / .14, 0, 1));
      let fade = 1;
      if (near < 1) {
        const tw = t.w * os, cover = (onBody(ox + tw * .15, oy) + onBody(ox + tw * .5, oy) + onBody(ox + tw * .85, oy)) / 3;
        fade = 1 - cover * (1 - near);
      }
      // List: stacked on its side, each row pushed out to the bubble's circumference.
      const gap = t.h + 16;                                            // even space between sibling rows
      const ly = (t.row - (t.rows - 1) / 2) * gap;
      const inner = Math.max(Math.abs(ly) - t.h / 2, 0);                // row edge nearest the bubble's centre
      const off = Math.max(Math.sqrt(Math.max(R * R - inner * inner, 0)), R * .35);
      const lx = t.side > 0 ? x + off : x - off - t.w;                  // left column: right edge hugs the curve
      const px = ox + (lx - ox) * e + Math.sin(Math.PI * e) * 14 * t.side;   // small outward bow on the way
      const py = oy + (y + ly - oy) * e;
      const sc = os + (1 - os) * e;
      t.el.style.transform = `translate3d(${px.toFixed(1)}px, ${(py - t.h / 2).toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
      t.el.style.opacity = ((alpha * (.36 + .32 * k) * fade) * (1 - e) + e).toFixed(2);
      t.el.style.zIndex = t.v > 0 ? 100 : z === 1 ? +(depth > 0) : z + (depth > 0 ? 1 : -1);
    });
  };

  const place = (now = performance.now(), dt = 0) => {
    kpis.forEach((el, i) => {
      const a = rot + i * STEP;
      const ex = Math.cos(a) * d.rx, ey = Math.sin(a) * d.ry;
      const depth = Math.sin(a);           // -1 back … 1 front
      const k = (depth + 1) / 2;
      const s = (.52 + .6 * k) * (i === active ? 1 + .14 * k ** 4 : 1);   // back .52 → front 1.12 (+14% when selected)
      const x = d.cx + ex * Math.cos(TILT) - ey * Math.sin(TILT);
      const y = d.cy + ex * Math.sin(TILT) + ey * Math.cos(TILT);
      const z = depth > -0.1 ? 30 + Math.round(depth * 10) * 3 : 1;
      const alpha = .5 + .5 * k;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      el.style.zIndex = z;
      el.style.opacity = alpha.toFixed(2);
      placeTags(i, x, y, s, alpha, z, depth, now, dt);
    });
  };

  // Stagger by row: opening runs top → bottom (both columns together), closing runs the exact reverse.
  const stagger = (i, open) => {
    if (i < 0) return;
    const now = performance.now(), m = groups[i].maxRows;
    groups[i].forEach(t => { t.start = now + (open ? t.row : m - 1 - t.row) * TAG_STAGGER; });
  };
  const select = (i) => {
    if (i === active) i = -1;
    stagger(active, false);
    active = i;
    kpis.forEach((k, j) => k.setAttribute('aria-pressed', String(j === i)));
    if (i < 0) { holdUntil = performance.now() + 1200; return; }
    const delta = norm(targets[i] - (rot + i * STEP));
    // All bubbles travel together; longer trips take longer so the rotation reads clearly.
    const dur = 800 + 900 * Math.abs(delta) / Math.PI;
    tween = { from: rot, to: rot + delta, t0: performance.now(), dur };
    // Tags start fanning out as the bubble lands in front.
    const now = performance.now();
    groups[i].forEach(t => { t.start = now + dur * .55 + t.row * TAG_STAGGER; });
  };

  const tick = (now) => {
    const dt = Math.min(now - last, 64); last = now;
    if (tween) {
      const t = reduce ? 1 : Math.min(1, (now - tween.t0) / tween.dur);
      rot = tween.from + (tween.to - tween.from) * ease(t);
      if (t === 1) { tween = null; holdUntil = now + 4500; }
    } else if (!reduce && !hovering && active < 0 && now > holdUntil) {
      rot += dt * SPEED;                   // the orbit waits while a bubble is open
    }
    if (!reduce) spin += dt * TAG_SPEED;
    place(now, dt);
    if (visible) requestAnimationFrame(tick);
  };

  kpis.forEach((el, i) => {
    el.addEventListener('click', () => select(i));
    el.addEventListener('pointerenter', () => { hovering = true; });
    el.addEventListener('pointerleave', () => { hovering = false; });
    el.addEventListener('focus', () => { hovering = true; });
    el.addEventListener('blur', () => { hovering = false; });
  });
  // Focus leaves the bubble → tags return to orbit.
  document.addEventListener('pointerdown', (e) => { if (active >= 0 && !e.target.closest('.kpi')) select(-1); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && active >= 0) select(-1); });

  new IntersectionObserver(([en]) => {
    const was = visible; visible = en.isIntersecting;
    if (!visible && active >= 0) { select(-1); groups.flat().forEach(t => { t.v = 0; }); }
    if (visible && !was) { last = performance.now(); requestAnimationFrame(tick); }
  }).observe(stage);

  addEventListener('resize', () => { measure(); place(); });
  document.fonts?.ready.then(() => { measure(); place(); });
  measure(); place(); requestAnimationFrame(tick);
})();

/* =========================================================
   CONTACT — copy e-mail, validation, success state
   ========================================================= */
const toast = document.getElementById('toast');
const showToast = (msg) => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('is-on'), 2200); };
document.getElementById('copyEmail').addEventListener('click', async () => {
  const email = document.getElementById('emailAddr').textContent;
  try { await navigator.clipboard.writeText(email); showToast('E-mail copiado'); }
  catch { showToast(email); }
});

const form = document.getElementById('contactForm');
const rules = {
  name: v => v.trim().length >= 2 || 'Informe seu nome.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Informe um e-mail válido.',
  msg: v => v.trim().length >= 20 || 'Escreva pelo menos 20 caracteres.'
};
const check = (input) => {
  const rule = rules[input.name]; if (!rule) return true;
  const res = rule(input.value);
  const field = input.closest('.field');
  field.classList.toggle('has-error', res !== true);
  field.querySelector('.err').textContent = res === true ? '' : res;
  return res === true;
};
form.querySelectorAll('input, textarea').forEach(i => i.addEventListener('blur', () => check(i)));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = [...form.querySelectorAll('input, textarea')].map(check).every(Boolean);
  if (!ok) { form.querySelector('.has-error input, .has-error textarea').focus(); return; }
  document.getElementById('sentName').textContent = form.elements.name.value.trim().split(' ')[0];
  document.getElementById('formWrap').classList.add('is-sent');
});
document.getElementById('resetForm').addEventListener('click', () => {
  form.reset(); document.getElementById('formWrap').classList.remove('is-sent');
});

document.getElementById('year').textContent = new Date().getFullYear();
