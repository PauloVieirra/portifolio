import { describe, it, expect } from 'vitest';
import { PROJECTS } from '../src/data/projects.js';
import { ARTICLES } from '../src/data/articles.js';
import { fromProjectRow, toProjectRow, fromArticleRow, toArticleRow, AURORA } from '../src/lib/content-map.js';

describe('project rows', () => {
  it('round-trips every bundled project', () => PROJECTS.forEach((p, i) =>
    expect(fromProjectRow(toProjectRow(p, i))).toEqual({ ...p, featured: !!p.featured })));
  it('fills nulls with safe defaults', () => {
    const p = fromProjectRow({ id: 'x', title: 'T', summary: 'S', tags: null, deliver: null, article: null, c1: null, url: null, img: null });
    expect(p).toMatchObject({ tags: [], deliver: [], url: '', img: '', c1: AURORA[0], article: { intro: '', sections: [] } });
  });
});

describe('article rows', () => {
  it('round-trips every bundled article', () => ARTICLES.forEach((a, i) =>
    expect(fromArticleRow(toArticleRow(a, i))).toEqual({ ...a, project: a.project ?? '' })));
  it('keeps an article without project renderable', () =>
    expect(fromArticleRow({ id: 'a', title: 'T', summary: 'S', date: '2026-01-01', project: null, sections: null }))
      .toMatchObject({ project: '', sections: [], tags: [], readMin: 1 }));
  it('drops an empty figure', () =>
    expect(fromArticleRow({ id: 'a', title: 'T', summary: 'S', date: '2026-01-01', sections: [{ id: 's', title: 'S', body: ['b'], figure: null }] }).sections[0])
      .toEqual({ id: 's', title: 'S', body: ['b'] }));
});

describe('toRow shape', () => {
  it('always emits the same columns', () => {
    expect(Object.keys(toProjectRow(PROJECTS[0], 0))).toEqual(Object.keys(toProjectRow({ id: 'x', title: 't', summary: 's' }, 1)));
    expect(Object.keys(toArticleRow(ARTICLES[0], 0))).toEqual(Object.keys(toArticleRow({ id: 'x', title: 't', summary: 's', date: '2026-01-01' }, 1)));
  });
});
