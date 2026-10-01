import { describe, it, expect } from 'vitest';
import { extractHome } from '../scripts/lib/extract-home.mjs';
import { readHomeBlocks } from '../scripts/lib/partials.mjs';
import { findDuplicateTags } from '../src/lib/admin-rules.js';

describe('extractHome(index.html)', () => {
  const h = extractHome(readHomeBlocks());
  it('reads the 4 bubbles with unique tags', () => {
    expect(h.bubbles.map(b => b.value)).toEqual(['UX', '1.5M', 'Code', 'IA']);
    expect(h.bubbles[2].tags.map(t => t.label)).toContain('React JS');
    expect(h.bubbles[0].tags[0]).toEqual({ label: 'Lean Inception', icon: 'i-sparkle' });
    expect(findDuplicateTags(h.bubbles)).toEqual([]);
  });
  it('reads the timeline with kind and full title', () => {
    expect(h.timeline).toHaveLength(14);
    expect(h.timeline[0]).toMatchObject({ kind: 'formacao', period: 'Em andamento', title: 'MBA em Inovação Orientada à IA e UX', org: 'Pós-graduação' });
    expect(h.timeline[0].title_full).toMatch(/Inteligência Artificial/);
    expect(h.timeline.filter(t => t.kind === 'formacao').map(t => t.title))
      .toEqual(['MBA em Inovação Orientada à IA e UX', 'IA UX Design', 'Google UX Design', 'UX/UI', 'Superior em Desenvolvimento Mobile',
        'Protótipo com Figma', 'React Native e React JS', 'Desenvolvimento Front-end: JavaScript, HTML5 e CSS', 'Metodologia Scrum', 'UI Design']);
    expect(h.timeline[10]).toMatchObject({ kind: 'trabalho', title: 'Product Designer', org: 'SEA Tecnologia' });
  });
  it('reads services, skills and contact', () => {
    expect(h.services.map(s => s.title)).toEqual(['Pesquisa e UX Design', 'Engenharia de UX', 'Design systems']);
    expect(h.services[0].items).toHaveLength(3);
    expect(h.skills).toEqual(['Figma', 'Maze', 'React', 'React Native', 'Supabase', 'Design systems', 'Acessibilidade', 'Scrum']);
    expect(h.contact).toEqual({ email: 'vieirajjr@gmail.com', linkedin: 'https://abrir.link/IjGTS', github: '', dribbble: '' });
  });
});
