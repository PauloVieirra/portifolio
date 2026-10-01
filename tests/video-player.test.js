import { describe, it, expect } from 'vitest';
import { playerHTML } from '../src/lib/video-player.js';
import { VIDEOS } from '../src/data/videos.js';

describe('playerHTML', () => {
  it('shows "Em breve" while a video has no source', () => {
    expect(playerHTML({ title: 'X', src: '' })).toContain('player--soon');
    expect(playerHTML({ title: 'X', src: '' })).toContain('Em breve');
  });
  it('turns any YouTube link into a click-to-load nocookie embed with its thumbnail', () => {
    for (const url of ['https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10', 'https://www.youtube.com/shorts/dQw4w9WgXcQ']) {
      const html = playerHTML({ title: 'X', src: url });
      expect(html).toContain('data-embed="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&amp;rel=0"');
      expect(html).toContain('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
      expect(html).not.toContain('<iframe');
    }
  });
  it('embeds Vimeo links', () => {
    expect(playerHTML({ title: 'X', src: 'https://vimeo.com/76979871' })).toContain('https://player.vimeo.com/video/76979871?autoplay=1');
  });
  it('plays files in a native video, with the poster', () => {
    const html = playerHTML({ title: 'X', src: 'assets/videos/a.mp4', poster: 'assets/images/a.png' });
    expect(html).toContain('<video controls');
    expect(html).toContain('src="assets/videos/a.mp4"');
    expect(html).toContain('poster="assets/images/a.png"');
  });
  it('escapes the text it writes', () => {
    expect(playerHTML({ title: '"><script>', src: '' })).not.toContain('<script>');
  });
});

describe('videos data (local copy)', () => {
  it('is a list in the table format (empty until videos are added in the admin)', () => {
    expect(Array.isArray(VIDEOS)).toBe(true);
    expect(VIDEOS.filter(v => v.featured).length).toBeLessThanOrEqual(1);
  });
});
