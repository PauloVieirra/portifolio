import { describe, it, expect } from 'vitest';
import { md, mdInline, isLead, groupItems } from '../src/lib/markdown.js';

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
