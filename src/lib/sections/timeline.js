/* =========================================================
   TIMELINE - progress line follows the scroll, dots light up
   Markup: src/partials/trajetoria.html (home and /trajetoria)
   ========================================================= */
/* Split layout (/trajetoria, section.is-split): the centre line divides the entries by kind (set in the admin),
   work on the left and education on the right, each column in the admin's order. An empty kind has no column. */
const COLUMNS = [['trabalho', 'Experiência profissional'], ['formacao', 'Formação']];
const splitByKind = (timeline) => {
  const items = [...timeline.querySelectorAll('.tl-item')];
  COLUMNS.forEach(([kind, label]) => {
    const own = items.filter(el => (el.dataset.kind || 'trabalho') === kind);
    if (!own.length) return;
    const col = document.createElement('div');
    col.className = 'tl-col';
    col.dataset.kind = kind;
    col.innerHTML = `<h2 class="tl-col-title reveal">${label}</h2><div class="tl-list"></div>`;
    col.querySelector('.tl-list').append(...own);
    timeline.append(col);
  });
};

export function initTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  if (timeline.closest('.is-split')) splitByKind(timeline);
  let ticking = false;
  const update = () => {
    const r = timeline.getBoundingClientRect();
    const t = Math.min(Math.max((innerHeight * 0.6 - r.top) / r.height, 0), 1);
    timeline.style.setProperty('--tl', t.toFixed(3));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  const tlIO = new IntersectionObserver((entries) => entries.forEach(en => en.isIntersecting && en.target.classList.add('is-in')), { rootMargin: '-40% 0px -40% 0px' });
  timeline.querySelectorAll('.tl-item').forEach(el => tlIO.observe(el));
}
