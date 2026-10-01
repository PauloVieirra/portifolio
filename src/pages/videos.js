import { loadContent } from '../lib/content.js';
import { showConstructionNotice } from '../lib/notice.js';
import { videoCardHTML, initPlayers } from '../lib/video-player.js';
import '../lib/overlays.js';

/* /videos: the published videos (Gestão → Vídeos), in the admin's order. Until there are nine, the grid is
   completed with "Em breve" slots so it keeps its 3 × 3 shape. */
const GRID = 9;
const { videos: VIDEOS } = await loadContent(['videos']);
const slots = [...VIDEOS, ...Array.from({ length: Math.max(0, GRID - VIDEOS.length) }, () => ({ title: 'Em breve', src: '' }))];
const grid = document.getElementById('videoGrid');
grid.innerHTML = slots.map(videoCardHTML).join('');
initPlayers(grid);
document.documentElement.classList.add('is-ready');
showConstructionNotice();

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
