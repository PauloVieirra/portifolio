/* Home blocks managed in the admin. The markup mirrors index.html exactly, so the existing CSS and the
   hero orbit / timeline / reveal scripts work unchanged. Missing blocks keep the static HTML. */
const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ENT[c]);

export const bubblesHTML = (bubbles) => bubbles.map((b, i) => `
            <button type="button" class="kpi" aria-pressed="false" aria-controls="tags-${i}" aria-describedby="tags-${i}"><span class="kpi-value num">${esc(b.value)}</span><span class="kpi-label">${esc(b.label)}</span></button>
            <ul class="kpi-tags" id="tags-${i}" aria-label="Temas relacionados">${(b.tags || []).map(t => `
              <li class="kpi-tag"><svg aria-hidden="true"><use href="#${esc(t.icon)}"></use></svg><span>${esc(t.label)}</span></li>`).join('')}
            </ul>`).join('');

export const timelineHTML = (rows) => rows.map(r => `
          <article class="tl-item reveal" data-kind="${esc(r.kind)}">
            <span class="tl-when num">${esc(r.period)}</span>
            <div><h3${r.title_full ? ` title="${esc(r.title_full)}"` : ''}>${esc(r.title)}</h3>${r.org ? `<span class="org">${esc(r.org)}</span>` : ''}${r.description ? `
              <p>${esc(r.description)}</p>` : ''}</div>
          </article>`).join('');

export const servicesHTML = (services) => services.map((s, i) => `
          <article class="service glass reveal" style="--i:${i}">
            <span class="idx num">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
            <ul>${(s.items || []).map(it => `<li>${esc(it)}</li>`).join('')}</ul>
          </article>`).join('');

export const skillsHTML = (skills) => skills.map((s, i) => `<span class="chip glass reveal" style="--i:${i}">${esc(s)}</span>`).join('');

const SOCIALS = [['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['dribbble', 'Dribbble']];
export const socialsHTML = (c) => SOCIALS.filter(([k]) => c[k])
  .map(([k, label]) => `<a class="chip glass" href="${esc(c[k])}" target="_blank" rel="noopener" aria-label="${label}">${label} ↗</a>`).join('');

/* Fills whichever of these blocks the page has: the home (hero bubbles), /trajetoria (timeline), /contato (contact) */
export function renderHome(site, timeline) {
  const $ = (sel) => document.querySelector(sel);
  if (site?.hero_bubbles?.length && $('#heroVisual')) $('#heroVisual [role="group"]').innerHTML = bubblesHTML(site.hero_bubbles);
  const tl = $('#timeline');
  if (timeline?.length && tl) {
    tl.querySelectorAll('.tl-item').forEach(n => n.remove());
    tl.insertAdjacentHTML('beforeend', timelineHTML(timeline));
  }
  if (site?.services?.length && $('#servicos .services')) $('#servicos .services').innerHTML = servicesHTML(site.services);
  if (site?.skills?.length && $('#servicos .skills')) $('#servicos .skills').innerHTML = skillsHTML(site.skills);
  if (site?.contact && $('#contato')) {
    const a = $('#emailAddr');
    if (site.contact.email) { a.href = `mailto:${site.contact.email}`; a.textContent = site.contact.email; }
    $('#contato .socials').innerHTML = socialsHTML(site.contact);
  }
}
