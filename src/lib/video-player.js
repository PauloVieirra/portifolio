import { esc } from './home-render.js';

/* =========================================================
   VIDEO PLAYER - file, YouTube or Vimeo; "Em breve" when empty
   ========================================================= */
/* Files play in a native <video>. YouTube and Vimeo start as a cover with a play button and only load the
   embed when clicked (no third-party iframe on page load). Starting one video pauses the others. */
const youtubeId = (url) => url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/)?.[1];
const vimeoId = (url) => url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];

const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

/* the 16:9 frame for one video */
export function playerHTML(v, { label = v.title } = {}) {
  const src = String(v.src || '').trim();
  const yt = src && youtubeId(src), vm = !yt && src && vimeoId(src);
  if (!src) return `
    <div class="player player--soon" role="img" aria-label="${esc(label)}: vídeo em breve">
      <span class="player-play" aria-hidden="true">${PLAY}</span>
      <span class="player-soon">Em breve</span>
    </div>`;
  if (yt || vm) {
    const embed = yt ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0` : `https://player.vimeo.com/video/${vm}?autoplay=1`;
    const poster = v.poster || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : '');
    return `
    <div class="player">
      <button class="player-cover" type="button" data-embed="${esc(embed)}" aria-label="Assistir: ${esc(label)}">
        ${poster ? `<img src="${esc(poster)}" alt="" loading="lazy">` : ''}
        <span class="player-play" aria-hidden="true">${PLAY}</span>
      </button>
    </div>`;
  }
  return `
    <div class="player">
      <video controls playsinline preload="metadata"${v.poster ? ` poster="${esc(v.poster)}"` : ''} aria-label="${esc(label)}">
        <source src="${esc(src)}">
      </video>
    </div>`;
}

/* a grid card: player + title, description, duration */
export const videoCardHTML = (v, i) => `
  <article class="video-card reveal" style="--i:${i % 3}">
    ${playerHTML(v)}
    <div class="video-info">
      <h2>${esc(v.title)}</h2>
      ${v.description ? `<p>${esc(v.description)}</p>` : ''}
      ${v.duration ? `<span class="video-time num">${esc(v.duration)}</span>` : ''}
    </div>
  </article>`;

/* click-to-load embeds, one video at a time */
export function initPlayers(root = document) {
  root.addEventListener('click', (e) => {
    const cover = e.target.closest('.player-cover');
    if (!cover) return;
    const frame = document.createElement('iframe');
    frame.src = cover.dataset.embed;
    frame.title = cover.getAttribute('aria-label').replace(/^Assistir: /, '');
    frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    frame.allowFullscreen = true;
    root.querySelectorAll('video').forEach(v => v.pause());
    cover.replaceWith(frame);
  });
  root.addEventListener('play', (e) => {
    root.querySelectorAll('video').forEach(v => { if (v !== e.target) v.pause(); });
  }, true);
}
