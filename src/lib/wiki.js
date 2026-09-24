/* =========================================================
   WIKI — shared by projetos.html and artigos.html.
   Search (from 3 letters), combinable tag filters (AND), sort and
   pagination (5 per page). State mirrors the URL: ?q=&tags=A,B&sort=&page=
   Markup contract: #q #qClear #qHint #searchForm #tagFilters #resultCount
   #clearAll #sort #entries #pager #pagerRange #pagerNav  (styles: src/styles/wiki.css)

   initWiki({
     items,                     array of records (each needs .tags)
     text(item),                searchable string for one record
     sorters: { key: fn },      first key is the default order
     noun: ['projeto', 'projetos'],
     emptyTitle, hintIdle,
     row(item, ctx)             HTML for one <a class="entry"> — ctx: { terms, hl, esc, tags }
     transitionName             optional view-transition name given to the clicked row's .cover
   })
   ========================================================= */
export function initWiki(cfg) {
  const PER_PAGE = 5;
  const MIN_CHARS = 3;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);
  const els = { q: $('q'), clear: $('qClear'), hint: $('qHint'), tags: $('tagFilters'), count: $('resultCount'),
    clearAll: $('clearAll'), sort: $('sort'), list: $('entries'), pager: $('pager'), range: $('pagerRange'), nav: $('pagerNav') };

  // accent- and case-insensitive text for matching
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const INDEX = cfg.items.map(item => ({ item, text: norm(cfg.text(item)) }));
  const SORT_KEYS = Object.keys(cfg.sorters);

  // tag vocabulary, most used first
  const TAGS = [...cfg.items.flatMap(i => i.tags || []).reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map())]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt')).map(([t]) => t);

  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    tags: new Set((params.get('tags') || '').split(',').filter(t => TAGS.includes(t))),
    sort: SORT_KEYS.includes(params.get('sort')) ? params.get('sort') : SORT_KEYS[0],
    page: Math.max(1, parseInt(params.get('page'), 10) || 1)
  };

  const activeTerms = () => { const q = norm(state.q.trim()); return q.length >= MIN_CHARS ? q.split(/\s+/) : []; };
  const matches = (entry, terms, tags) =>
    terms.every(t => entry.text.includes(t)) && [...tags].every(t => (entry.item.tags || []).includes(t));

  // wrap search terms in <mark>, accent-insensitively, without breaking HTML
  const hl = (str, terms) => {
    str = String(str ?? '');
    if (!terms.length) return esc(str);
    const n = norm(str); const hits = [];
    terms.forEach(t => { let i = n.indexOf(t); while (i > -1) { hits.push([i, i + t.length]); i = n.indexOf(t, i + t.length); } });
    if (!hits.length) return esc(str);
    hits.sort((a, b) => a[0] - b[0]);
    let out = '', last = 0;
    hits.forEach(([s, e]) => { if (s < last) return; out += esc(str.slice(last, s)) + '<mark>' + esc(str.slice(s, e)) + '</mark>'; last = e; });
    return out + esc(str.slice(last));
  };

  function syncURL() {
    const u = new URLSearchParams();
    if (state.q.trim()) u.set('q', state.q.trim());
    if (state.tags.size) u.set('tags', [...state.tags].join(','));
    if (state.sort !== SORT_KEYS[0]) u.set('sort', state.sort);
    if (state.page > 1) u.set('page', state.page);
    const qs = u.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  function renderTags(terms) {
    // facet counts: how many results each tag would give combined with the current search + filters
    els.tags.innerHTML = [`<button class="filter" type="button" data-tag="" aria-pressed="${!state.tags.size}">Todos</button>`]
      .concat(TAGS.map(t => {
        const on = state.tags.has(t);
        const combo = new Set(state.tags).add(t);
        const n = INDEX.filter(e => matches(e, terms, combo)).length;
        return `<button class="filter" type="button" data-tag="${esc(t)}" aria-pressed="${on}" ${!on && !n ? 'disabled' : ''}>${esc(t)} <span class="ct">${n}</span></button>`;
      })).join('');
  }

  function render({ animate = true } = {}) {
    const terms = activeTerms();
    const typed = norm(state.q.trim()).length;
    const results = INDEX.filter(e => matches(e, terms, state.tags)).map(e => e.item).sort(cfg.sorters[state.sort]);
    const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * PER_PAGE;
    const slice = results.slice(start, start + PER_PAGE);
    const anim = animate && !reduce ? 'entry-in' : '';

    els.clear.hidden = !state.q;
    els.hint.textContent = typed > 0 && typed < MIN_CHARS
      ? `Digite mais ${MIN_CHARS - typed} ${MIN_CHARS - typed === 1 ? 'letra' : 'letras'} para buscar`
      : typed ? '' : cfg.hintIdle;

    renderTags(terms);

    // result summary: "3 artigos · IA + UX · “prompt”"
    const bits = [];
    if (state.tags.size) bits.push([...state.tags].map(esc).join(' + '));
    if (terms.length) bits.push(`“${esc(state.q.trim())}”`);
    els.count.innerHTML = `<b class="num">${results.length}</b> ${results.length === 1 ? cfg.noun[0] : cfg.noun[1]}${bits.length ? ' · ' + bits.join(' · ') : ''}`;
    els.clearAll.hidden = !state.tags.size && !state.q;
    els.sort.value = state.sort;

    els.list.innerHTML = !slice.length ? `
      <li class="empty glass ${anim}">
        <h2>${esc(cfg.emptyTitle)}</h2>
        <p>Nada com ${bits.length ? bits.join(' e ') : 'esses critérios'}. Tente remover um filtro ou buscar outro termo.</p>
        <button class="btn btn-ghost btn-sm" type="button" data-clear-all>Limpar busca e filtros</button>
      </li>`
      : slice.map((item, i) => `<li class="${anim}" style="--i:${i}">${cfg.row(item, { terms, hl, esc, tags: state.tags })}</li>`).join('');

    els.pager.hidden = !results.length;
    els.range.textContent = results.length ? `Mostrando ${start + 1}–${start + slice.length} de ${results.length}` : '';
    els.nav.innerHTML = pages < 2 ? '' : `
      <button class="page-btn" type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Página anterior">←</button>
      ${Array.from({ length: pages }, (_, i) => i + 1).map(n =>
        `<button class="page-btn" type="button" data-page="${n}" ${n === state.page ? 'aria-current="page"' : ''} aria-label="Página ${n}">${n}</button>`).join('')}
      <button class="page-btn" type="button" data-page="${state.page + 1}" ${state.page === pages ? 'disabled' : ''} aria-label="Próxima página">→</button>`;

    syncURL();
  }

  /* ---- events ---- */
  let lastTerms = activeTerms().join(' ');
  let debounce;
  els.q.value = state.q;
  els.q.addEventListener('input', () => {
    state.q = els.q.value;
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const t = activeTerms().join(' ');
      const changed = t !== lastTerms;         // below 3 letters the results don't change → no re-animation
      lastTerms = t;
      if (changed) state.page = 1;
      render({ animate: changed });
    }, 140);
  });
  $('searchForm').addEventListener('submit', (e) => { e.preventDefault(); els.q.blur(); });
  els.clear.addEventListener('click', () => { els.q.value = state.q = ''; lastTerms = ''; state.page = 1; render(); els.q.focus(); });

  els.tags.addEventListener('click', (e) => {
    const b = e.target.closest('.filter'); if (!b || b.disabled) return;
    const t = b.dataset.tag;
    if (!t) state.tags.clear();
    else state.tags.has(t) ? state.tags.delete(t) : state.tags.add(t);
    state.page = 1; render();
    els.tags.querySelector(`[data-tag="${CSS.escape(t)}"]`)?.focus({ preventScroll: true });
  });

  const clearAll = () => { state.tags.clear(); els.q.value = state.q = ''; lastTerms = ''; state.page = 1; render(); };
  els.clearAll.addEventListener('click', clearAll);
  els.list.addEventListener('click', (e) => { if (e.target.closest('[data-clear-all]')) clearAll(); });

  els.sort.addEventListener('change', () => { state.sort = els.sort.value; state.page = 1; render(); });

  els.nav.addEventListener('click', (e) => {
    const b = e.target.closest('.page-btn'); if (!b || b.disabled || b.hasAttribute('aria-current')) return;
    state.page = +b.dataset.page; render();
    const top = els.list.getBoundingClientRect().top + scrollY - 120;
    if (scrollY > top) scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  });

  // "/" focuses the search, like most wikis
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); els.q.focus(); }
  });

  // clicked row's cover morphs into the reader's cover (cross-page view transition)
  if (cfg.transitionName) {
    els.list.addEventListener('click', (e) => {
      const cover = e.target.closest('.entry')?.querySelector('.cover');
      if (cover) cover.style.viewTransitionName = cfg.transitionName;
    });
    addEventListener('pageshow', () => els.list.querySelectorAll('.cover').forEach(c => { c.style.viewTransitionName = ''; }));
  }

  render({ animate: false });
  if (!reduce) els.list.querySelectorAll('li').forEach(li => li.classList.add('entry-in'));
}
