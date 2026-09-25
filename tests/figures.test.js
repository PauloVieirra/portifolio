import { describe, it, expect } from 'vitest';
import { sectionImages, figuresHTML } from '../src/lib/figures.js';

describe('sectionImages', () => {
  it('prefers the images list', () => expect(sectionImages({ images: [{ src: 'a.png', caption: 'A' }], figure: { src: 'x.png' } })).toEqual([{ src: 'a.png', caption: 'A' }]));
  it('falls back to the single figure of older content', () => expect(sectionImages({ figure: { src: 'x.png', caption: 'X' } })).toEqual([{ src: 'x.png', caption: 'X' }]));
  it('is empty when there is nothing', () => expect(sectionImages({})).toEqual([]));
});

describe('figuresHTML', () => {
  const colors = { c1: 'var(--a)', c2: 'var(--b)' };
  it('renders one image as a full-width figure with an escaped caption', () => {
    const html = figuresHTML([{ src: 'a.png', caption: 'P&D <1>' }], colors);
    expect(html).toContain('<figure class="figure reveal">');
    expect(html).toContain('<img src="a.png" alt="P&amp;D &lt;1&gt;" loading="lazy"');
    expect(html).toContain('<figcaption>P&amp;D &lt;1&gt;</figcaption>');
    expect(html).not.toContain('figure-grid');
  });
  it('lays out two or more images in a grid sized by count', () => {
    expect(figuresHTML([{ src: 'a.png' }, { src: 'b.png' }], colors)).toContain('<div class="figure-grid figure-grid--2 reveal">');
    expect(figuresHTML([{ src: 'a' }, { src: 'b' }, { src: 'c' }, { src: 'd' }], colors)).toContain('figure-grid--3');
  });
  it('keeps the colour placeholder for an image without src', () => expect(figuresHTML([{ src: '', caption: 'Em breve' }], colors)).toContain('cover-ui'));
  it('omits an empty caption', () => expect(figuresHTML([{ src: 'a.png', caption: '' }], colors)).not.toContain('figcaption'));
  it('returns empty for no images', () => expect(figuresHTML([], colors)).toBe(''));
});
