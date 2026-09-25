/* Database rows (snake_case, nullable) ⇄ the objects the pages render (same shape as src/data/*.js). */
export const AURORA = ['violet', 'blue', 'mint', 'peach', 'rose', 'lilac'].map(n => `var(--aurora-${n}-fill)`);
export const AURORA_OPTIONS = AURORA.map(v => [v, v.match(/aurora-(\w+)-fill/)[1]]);

const str = (v) => v ?? '';
const sections = (list) => (list || []).map(s => {
  const out = { id: s.id, title: str(s.title), body: Array.isArray(s.body) ? s.body : [] };
  if (s.quote) out.quote = s.quote;
  if (s.figure) out.figure = { src: str(s.figure.src), caption: str(s.figure.caption) };
  if (s.images?.length) out.images = images(s.images);
  return out;
});
const images = (list) => (list || []).map(i => ({ src: str(i.src), caption: str(i.caption) }));

/* featured items first, the rest keep their order (Array.prototype.sort is stable) */
export const featuredFirst = (list) => [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

export const fromProjectRow = (r) => ({
  id: r.id, tags: r.tags || [], url: str(r.url), img: str(r.img), cat: str(r.cat), catLabel: str(r.cat_label),
  year: str(r.year), tag: str(r.tag), c1: r.c1 || AURORA[0], c2: r.c2 || AURORA[1],
  title: str(r.title), summary: str(r.summary), challenge: str(r.challenge), role: str(r.role),
  deliver: r.deliver || [], stack: str(r.stack),
  article: { intro: str(r.article?.intro), sections: sections(r.article?.sections) },
  featured: !!r.featured,
  gallery: images(r.gallery),
});

export const fromArticleRow = (r) => ({
  id: r.id, date: r.date, readMin: r.read_min ?? 1, tags: r.tags || [], img: str(r.img), project: str(r.project),
  c1: r.c1 || AURORA[0], c2: r.c2 || AURORA[1], tag: str(r.tag),
  title: str(r.title), summary: str(r.summary), intro: str(r.intro), sections: sections(r.sections),
  featured: !!r.featured, gallery: images(r.gallery),
});

export const toProjectRow = (p, position) => ({
  id: p.id, position, published: true, featured: !!p.featured,
  title: p.title, summary: p.summary, cat: p.cat ?? null, cat_label: p.catLabel ?? null, year: p.year ?? null, tag: p.tag ?? null,
  tags: p.tags ?? [], url: p.url || null, img: p.img || null, c1: p.c1 ?? null, c2: p.c2 ?? null,
  challenge: p.challenge ?? null, role: p.role ?? null, stack: p.stack ?? null, deliver: p.deliver ?? [],
  article: { intro: p.article?.intro ?? '', sections: p.article?.sections ?? [] },
  gallery: p.gallery ?? [],
});

export const toArticleRow = (a, position) => ({
  id: a.id, position, published: true, date: a.date, read_min: a.readMin ?? null, tags: a.tags ?? [],
  img: a.img || null, c1: a.c1 ?? null, c2: a.c2 ?? null, tag: a.tag ?? null, project: a.project || null,
  title: a.title, summary: a.summary, intro: a.intro ?? '', sections: a.sections ?? [],
  featured: !!a.featured, gallery: a.gallery ?? [],
});

/* home carousel filters: the most used tags (ties alphabetical), without tags every article has
   (a filter that shows everything is the same as "Todos") */
export const filterTags = (articles, max = 5) => {
  const count = new Map();
  articles.forEach(a => new Set(a.tags || []).forEach(t => count.set(t, (count.get(t) || 0) + 1)));
  return [...count]
    .filter(([, n]) => articles.length < 2 || n < articles.length)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt'))
    .slice(0, max).map(([t]) => t);
};
