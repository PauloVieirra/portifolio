/* Images inside a case study / article: one image is a full-width figure, two or more become a grid.
   Older content has a single `figure` per section; newer content has an `images` list. */
const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ENT[c]);

export const sectionImages = (s) => s?.images?.length ? s.images : s?.figure ? [s.figure] : [];

const figure = (img, { c1, c2 }, cls = '') => `
  <figure class="figure${cls}">
    <div class="cover" style="--c1:${c1}; --c2:${c2}">${img.src
      ? `<img src="${esc(img.src)}" alt="${esc(img.caption)}" loading="lazy" width="1600" height="1000">`
      : `<div class="cover-ui glass"><span class="ln m"></span><span class="ln s"></span><span class="ln m"></span></div>`}</div>
    ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ''}
  </figure>`;

export const figuresHTML = (images, colors) => {
  if (!images?.length) return '';
  if (images.length === 1) return figure(images[0], colors, ' reveal');
  const cols = images.length === 2 ? 2 : 3;
  return `<div class="figure-grid figure-grid--${cols} reveal">${images.map(img => figure(img, colors)).join('')}</div>`;
};
