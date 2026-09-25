import { describe, it, expect } from 'vitest';
import { PROJECTS } from '../src/data/projects.js';
import { ARTICLES } from '../src/data/articles.js';
import { fromProjectRow, toProjectRow, fromArticleRow, toArticleRow, AURORA, featuredFirst, filterTags } from '../src/lib/content-map.js';

describe('project rows', () => {
  it('round-trips every bundled project', () => PROJECTS.forEach((p, i) =>
    expect(fromProjectRow(toProjectRow(p, i))).toEqual({ ...p, featured: !!p.featured, gallery: [] })));
  it('fills nulls with safe defaults', () => {
    const p = fromProjectRow({ id: 'x', title: 'T', summary: 'S', tags: null, deliver: null, article: null, c1: null, url: null, img: null });
    expect(p).toMatchObject({ tags: [], deliver: [], url: '', img: '', c1: AURORA[0], article: { intro: '', sections: [] } });
  });
});

describe('article rows', () => {
  it('round-trips every bundled article', () => ARTICLES.forEach((a, i) =>
    expect(fromArticleRow(toArticleRow(a, i))).toEqual({ ...a, project: a.project ?? '', featured: false, gallery: [] })));
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

describe('galleries, section images and featured articles', () => {
  it('reads gallery and section images from rows', () => {
    const p = fromProjectRow({ id: 'x', title: 'T', summary: 'S', gallery: [{ src: 'g.png', caption: null }], article: { sections: [{ id: 's', title: 'S', body: [], images: [{ src: 'i.png' }] }] } });
    expect(p.gallery).toEqual([{ src: 'g.png', caption: '' }]);
    expect(p.article.sections[0].images).toEqual([{ src: 'i.png', caption: '' }]);
    expect(fromArticleRow({ id: 'a', title: 'T', summary: 'S', date: '2026-01-01', featured: true }).featured).toBe(true);
  });
  it('writes gallery and featured back to rows', () => {
    expect(toProjectRow({ id: 'x', title: 't', summary: 's', gallery: [{ src: 'g.png', caption: '' }] }, 0).gallery).toEqual([{ src: 'g.png', caption: '' }]);
    const a = toArticleRow({ id: 'a', title: 't', summary: 's', date: '2026-01-01', featured: true }, 0);
    expect(a.featured).toBe(true); expect(a.gallery).toEqual([]);
  });
  it('puts featured items first, keeping the order otherwise', () => {
    const list = [{ id: 'a' }, { id: 'b', featured: true }, { id: 'c' }, { id: 'd', featured: true }];
    expect(featuredFirst(list).map(x => x.id)).toEqual(['b', 'd', 'a', 'c']);
  });
});

describe('filterTags', () => {
  const arts = [{ tags: ['UX', 'IA'] }, { tags: ['UX', 'IA', 'Acessibilidade'] }, { tags: ['UX', 'Comunicação'] }, { tags: ['UX', 'Acessibilidade'] }];
  it('ranks by use, then alphabetically, skipping tags every article has', () =>
    expect(filterTags(arts)).toEqual(['Acessibilidade', 'IA', 'Comunicação']));
  it('limits the count', () => expect(filterTags(arts, 2)).toEqual(['Acessibilidade', 'IA']));
  it('keeps a shared tag when there is a single article', () => expect(filterTags([{ tags: ['UX', 'IA'] }])).toEqual(['IA', 'UX']));
  it('handles no articles', () => expect(filterTags([])).toEqual([]));
});
