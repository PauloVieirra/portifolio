import { describe, it, expect } from 'vitest';
import { md, mdInline, isLead, groupItems, embedSrc } from '../src/lib/markdown.js';

describe('md blocks', () => {
  it('splits paragraphs on blank lines and joins soft wraps', () => expect(md('a\nb\n\nc')).toBe('<p>a b</p><p>c</p>'));
  it('turns ### lines into subheadings', () => expect(md('### Título\ntexto')).toBe('<h3>Título</h3><p>texto</p>'));
  it('renders nested unordered lists', () => expect(md('- a\n  - b\n- c')).toBe('<ul><li>a<ul><li>b</li></ul></li><li>c</li></ul>'));
  it('renders ordered lists', () => expect(md('1. a\n2. b')).toBe('<ol><li>a</li><li>b</li></ol>'));
  it('recovers a list that was saved on one line', () =>
    expect(md('* **A** — x. * **B** — y.')).toBe('<ul><li><strong>A</strong> — x.</li><li><strong>B</strong> — y.</li></ul>'));
  it('does not mistake a bold opening for a list', () => expect(md('**Contexto**')).toBe('<p><strong>Contexto</strong></p>'));
  it('adds a class to top-level blocks', () => expect(md('### T\n\np', { cls: 'reveal' })).toBe('<h3 class="reveal">T</h3><p class="reveal">p</p>'));
  it('returns empty for empty text', () => expect(md('  ')).toBe(''));
});

describe('mdInline', () => {
  it('formats bold, italic and http links, escaping HTML', () => expect(mdInline('**P&D** *x* <b> [site](https://a.co)'))
    .toBe('<strong>P&amp;D</strong> <em>x</em> &lt;b&gt; <a href="https://a.co" target="_blank" rel="noopener">site</a>'));
  it('links to internal pages in the same tab', () => expect(mdInline('[leia](artigo.html?a=vision-design-ferramenta-propria)'))
    .toBe('<a href="artigo.html?a=vision-design-ferramenta-propria">leia</a>'));
  it('does not treat other relative paths as internal links', () => expect(mdInline('[x](admin.html)')).toBe('[x](admin.html)'));
  it('never links non-http urls', () => expect(mdInline('[x](javascript:alert(1))')).toBe('[x](javascript:alert(1))'));
  it('keeps spaced asterisks literal', () => expect(mdInline('2 * 3 * 4')).toBe('2 * 3 * 4'));
});

describe('isLead', () => {
  it('accepts one short plain paragraph', () => expect(isLead('Um projeto sobre confiança em IA.')).toBe(true));
  it('rejects long, multi-paragraph, heading or list text, and empty', () => {
    expect(isLead('x'.repeat(321))).toBe(false);
    expect(isLead('a\n\nb')).toBe(false);
    expect(isLead('### T')).toBe(false);
    expect(isLead('- a')).toBe(false);
    expect(isLead('')).toBe(false);
  });
});

describe('groupItems', () => {
  it('nests "- " lines under the previous item', () => expect(groupItems(['Gestão, incluindo:', '- Criação', '- Edição', 'Outra', ]))
    .toEqual([{ text: 'Gestão, incluindo:', children: ['Criação', 'Edição'] }, { text: 'Outra', children: [] }]));
  it('keeps a leading "- " line as its own item', () => expect(groupItems(['- solto'])).toEqual([{ text: 'solto', children: [] }]));
});

describe('embeds', () => {
  const LI = 'https://www.linkedin.com/embed/feed/update/urn:li:activity:7432372253549531136?compact=true';
  it('builds LinkedIn embed urls from post links', () => {
    expect(embedSrc('https://www.linkedin.com/feed/update/urn:li:activity:7432372253549531136')).toBe(LI);
    expect(embedSrc('https://www.linkedin.com/posts/paulo-vieira_ia-ugcPost-7432372110112550913-XdaP/?utm_source=x'))
      .toBe('https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7432372110112550913?compact=true');
  });
  it('builds YouTube embed urls', () => {
    expect(embedSrc('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(embedSrc('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });
  it('ignores other urls and text', () => {
    expect(embedSrc('https://evil.example/embed/feed/update/urn:li:activity:1')).toBeNull();
    expect(embedSrc('veja https://youtu.be/dQw4w9WgXcQ')).toBeNull();
  });
  it('turns a paragraph that is only a video link into an embedded player', () => {
    const html = md('Antes\n\nhttps://www.linkedin.com/feed/update/urn:li:activity:7432372253549531136', { cls: 'reveal' });
    expect(html).toContain(`<div class="embed embed--linkedin reveal"><iframe src="${LI.replace('&', '&amp;')}"`);
    expect(html).toContain('allowfullscreen');
    expect(html).toContain('<a href="https://www.linkedin.com/feed/update/urn:li:activity:7432372253549531136" target="_blank" rel="noopener">Ver no LinkedIn</a>');
    expect(html.startsWith('<p class="reveal">Antes</p>')).toBe(true);
  });
});
