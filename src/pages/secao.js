import { loadContent } from '../lib/content.js';
import { showConstructionNotice } from '../lib/notice.js';
import { renderHome } from '../lib/home-render.js';
import { initTimeline } from '../lib/sections/timeline.js';
import { initContact } from '../lib/sections/contact.js';
import { initFrameworks } from '../lib/sections/frameworks.js';
import '../lib/overlays.js';

/* /processo, /trajetoria and /contato: one home section per page (src/partials). The admin-managed
   blocks are filled the same way as on the home; renderHome skips the ones this page does not have. */
const { timeline: TIMELINE, site: SITE } = await loadContent(['timeline', 'site']);
renderHome(SITE, TIMELINE);
document.documentElement.classList.add('is-ready');
showConstructionNotice();
initTimeline();
initContact();
initFrameworks();

/* =========================================================
   MOTION - reveal, sticky nav
   ========================================================= */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

const topnav = document.getElementById('topnav');
const onScroll = () => {
  const y = scrollY;
  topnav.classList.toggle('is-stuck', y > 24);
  document.documentElement.style.setProperty('--scroll', Math.min(y / innerHeight, 6).toFixed(3));
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.getElementById('year').textContent = new Date().getFullYear();
