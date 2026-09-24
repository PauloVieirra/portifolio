import { describe, it, expect } from 'vitest';
import { bubblesHTML, timelineHTML, servicesHTML, skillsHTML, socialsHTML } from '../src/lib/home-render.js';

describe('bubblesHTML', () => {
  const html = bubblesHTML([{ value: 'UX', label: 'Processos', tags: [{ label: 'P&D <beta>', icon: 'i-atom' }] }]);
  it('keeps the existing markup contract', () => {
    expect(html).toContain('<button type="button" class="kpi" aria-pressed="false" aria-controls="tags-0" aria-describedby="tags-0">');
    expect(html).toContain('<ul class="kpi-tags" id="tags-0" aria-label="Temas relacionados">');
    expect(html).toContain('<use href="#i-atom"></use>');
  });
  it('escapes text', () => expect(html).toContain('<span>P&amp;D &lt;beta&gt;</span>'));
});

describe('timelineHTML', () => {
  it('renders period/title/org/description and the full-title tooltip', () => {
    const html = timelineHTML([{ period: '2025 — hoje', title: 'MBA', title_full: 'MBA "longo"', org: 'Formação', description: 'Texto' }]);
    expect(html).toContain('<span class="tl-when num">2025 — hoje</span>');
    expect(html).toContain('<h3 title="MBA &quot;longo&quot;">MBA</h3><span class="org">Formação</span>');
    expect(html).toContain('<p>Texto</p>');
  });
  it('omits empty org and description', () => {
    const html = timelineHTML([{ period: '2023', title: 'Curso', org: null, description: '' }]);
    expect(html).not.toContain('class="org"');
    expect(html).not.toContain('<p>');
  });
});

describe('servicesHTML', () => {
  it('numbers cards and staggers reveal', () => {
    const html = servicesHTML([{ title: 'A', text: 't', items: ['x'] }, { title: 'B', text: 't', items: [] }]);
    expect(html).toContain('<article class="service glass reveal" style="--i:1">');
    expect(html).toContain('<span class="idx num">02</span>');
    expect(html).toContain('<ul><li>x</li></ul>');
  });
});

describe('skillsHTML', () => {
  it('renders chips', () => expect(skillsHTML(['Figma', 'R&D'])).toBe(
    '<span class="chip glass reveal" style="--i:0">Figma</span><span class="chip glass reveal" style="--i:1">R&amp;D</span>'));
});

describe('socialsHTML', () => {
  it('renders only filled links, opening in a new tab', () => {
    const html = socialsHTML({ linkedin: 'https://l.in/x', github: '', dribbble: null });
    expect(html).toBe('<a class="chip glass" href="https://l.in/x" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn ↗</a>');
  });
});
