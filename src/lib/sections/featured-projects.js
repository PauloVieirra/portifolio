import { esc } from '../home-render.js';

/* =========================================================
   PROJECTS - featured bento; open the case study
   Markup: src/partials/projetos.html (home)
   ========================================================= */
/* "Destaque na home" (featured) projects open the bento; the others fill it up to three, in the admin's order */
export function renderFeaturedProjects(PROJECTS) {
  const worksEl = document.getElementById('works');
  if (!worksEl) return;
  const projectHref = (p) => `projeto.html?p=${encodeURIComponent(p.id)}`;
  const flagged = PROJECTS.filter(p => p.featured);
  const WORKS = [...flagged, ...PROJECTS.filter(p => !p.featured)].slice(0, 3);
  const worksRest = PROJECTS.length - WORKS.length;
  worksEl.innerHTML = WORKS.map((p, i) => `
    <a class="work reveal${i === 0 ? ' work--lead' : ''}" href="${projectHref(p)}" style="--i:${i}; --c1:${p.c1}; --c2:${p.c2}">
      <div class="cover" aria-hidden="true">${p.img
        ? `<img src="${esc(p.img)}" alt="" loading="lazy" width="1600" height="1000">`
        : `<div class="cover-ui glass"><span class="tag">${esc(p.tag)}</span><span class="ln m"></span><span class="ln s"></span></div>`}</div>
      <span class="work-go glass" aria-hidden="true">→</span>
      <div class="work-panel glass">
        <div class="work-meta"><span>${esc(p.catLabel)}</span><span class="num">${esc(p.year)}</span></div>
        <h3>${esc(p.title)}</h3>
        <div class="work-more"><div>
          <p>${esc(p.summary)}</p>
          <ul class="work-tags" aria-label="Temas">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        </div></div>
      </div>
    </a>`).join('') + (worksRest > 0 ? `
    <div class="works-more glass reveal" style="--i:3">
      <p>Mais <b class="num">${worksRest}</b> ${worksRest === 1 ? 'projeto' : 'projetos'} na busca, com filtros por tema.</p>
      <a href="/projetos" class="btn btn-ghost btn-sm">Ver todos os projetos <span class="arrow" aria-hidden="true">→</span></a>
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
}
