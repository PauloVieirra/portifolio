import { describe, it, expect } from 'vitest';
import { FORMACAO, planFormacaoSync, missingFormacao } from '../src/lib/timeline-sync.js';

const MBA = { id: 'm', position: 0, kind: 'formacao', period: 'Em andamento', title: 'MBA em Inovação Orientada à IA e UX',
  org: 'Formação · Superior em Desenvolvimento Mobile (2023)', description: null, title_full: FORMACAO[0].title_full };
const work = (id, position, title) => ({ id, position, kind: 'trabalho', period: '2024', title, org: 'X', description: 'y', title_full: null });

describe('planFormacaoSync', () => {
  const rows = [MBA, work('a', 1, 'Product Designer'), work('b', 2, 'UX e UI Design')];
  const ops = planFormacaoSync(rows);

  it('inserts the missing CV entries in the CV order, right after the MBA', () => {
    const inserts = ops.filter(o => !o.id).map(o => o.patch);
    expect(inserts.map(p => p.title)).toEqual(FORMACAO.slice(1).map(e => e.title));
    expect(inserts.map(p => p.position)).toEqual(FORMACAO.slice(1).map((_, i) => i + 1));
    expect(inserts.every(p => p.kind === 'formacao')).toBe(true);
  });
  it('updates the MBA label and moves the work entries after education, in their order', () => {
    expect(ops.find(o => o.id === 'm').patch).toEqual({ org: 'Pós-graduação' });
    expect(ops.filter(o => o.id === 'a' || o.id === 'b').map(o => o.patch.position)).toEqual([FORMACAO.length, FORMACAO.length + 1]);
  });
  it('never deletes, and has nothing left to do once applied', () => {
    const applied = [...FORMACAO.map((e, i) => ({ ...e, id: `f${i}`, position: i })),
      { ...work('a', FORMACAO.length, 'Product Designer') }, { ...work('b', FORMACAO.length + 1, 'UX e UI Design') }];
    expect(planFormacaoSync(applied)).toEqual([]);
    expect(missingFormacao(applied)).toEqual([]);
  });
  it('keeps an extra course added in the admin (not in the CV) after the CV entries', () => {
    const extra = { id: 'x', position: 3, kind: 'formacao', period: '2026', title: 'Curso novo', org: 'Curso', description: null, title_full: null };
    const op = planFormacaoSync([MBA, extra]).find(o => o.id === 'x');
    expect(op.patch).toEqual({ position: FORMACAO.length });
  });
});
