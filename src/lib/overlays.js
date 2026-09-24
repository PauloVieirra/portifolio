/* =========================================================
   OVERLAYS (data-overlay contract)
   ========================================================= */
const openOverlay = (id) => {
  const el = document.querySelector(`[data-overlay="${id}"]`);
  if (!el) return;
  el.style.display = el.dataset.overlayDisplay || 'block';
  document.body.style.overflow = 'hidden';
  const focusable = el.querySelector('button, a, input');
  focusable && focusable.focus({ preventScroll: true });
};
export const closeOverlays = () => {
  document.querySelectorAll('[data-overlay]').forEach(el => { el.style.display = 'none'; });
  document.body.style.overflow = '';
};
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open-overlay]');
  if (opener) { e.preventDefault(); openOverlay(opener.dataset.openOverlay); return; }
  if (e.target.closest('[data-overlay-close]')) { closeOverlays(); return; }
  if (e.target.matches('[data-overlay]')) closeOverlays();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlays(); });
