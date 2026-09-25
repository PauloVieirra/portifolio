/* Click any image in a case study / article to see it large. Arrows move through the page's images,
   Esc (or the ×, or a click on the backdrop) closes. Built on <dialog> for focus and keyboard handling. */
const SELECTOR = 'main .figure img, main .art-cover img';

export function initLightbox(root = document) {
  let items = [], index = 0, dialog = null;

  const show = () => {
    const img = items[index];
    dialog.querySelector('img').src = img.currentSrc || img.src;
    dialog.querySelector('img').alt = img.alt;
    dialog.querySelector('figcaption').textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt || '';
    dialog.querySelector('.lb-count').textContent = `${index + 1} / ${items.length}`;
    dialog.querySelectorAll('.lb-nav').forEach(b => { b.hidden = items.length < 2; });
  };
  const step = (d) => { index = (index + d + items.length) % items.length; show(); };
  const close = () => { dialog?.close(); };

  const open = (img) => {
    items = [...root.querySelectorAll(SELECTOR)].filter(i => i.getAttribute('src'));
    index = Math.max(0, items.indexOf(img));
    dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Imagem ampliada');
    dialog.innerHTML = `
      <button class="lb-close" type="button" aria-label="Fechar">×</button>
      <button class="lb-nav lb-prev" type="button" aria-label="Imagem anterior">←</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-nav lb-next" type="button" aria-label="Próxima imagem">→</button>
      <p class="lb-count num" aria-live="polite"></p>`;
    dialog.querySelector('.lb-close').addEventListener('click', close);
    dialog.querySelector('.lb-prev').addEventListener('click', () => step(-1));
    dialog.querySelector('.lb-next').addEventListener('click', () => step(1));
    dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    dialog.addEventListener('close', () => { dialog.remove(); img.focus?.({ preventScroll: true }); });
    document.body.appendChild(dialog);
    show();
    dialog.showModal();
  };

  root.addEventListener('click', (e) => {
    const img = e.target instanceof Element && e.target.closest(SELECTOR);
    if (img && img.getAttribute('src')) { e.preventDefault(); open(img); }
  });
}
