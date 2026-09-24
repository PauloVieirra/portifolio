import { describe, it, expect, vi } from 'vitest';
import { loadContent } from '../src/lib/content.js';
import { PROJECTS } from '../src/data/projects.js';

/* fake supabase: from(table) returns a thenable query builder resolving to results[table] */
const fake = (results, delay = 0) => ({
  from: (table) => {
    const q = { select: () => q, eq: () => q, order: () => q,
      then: (ok, ko) => new Promise(r => setTimeout(r, delay)).then(() => results[table]).then(ok, ko) };
    return q;
  },
});

describe('loadContent', () => {
  it('maps rows from the database', async () => {
    const out = await loadContent(['projects', 'site'], { client: fake({
      projects: { data: [{ id: 'p1', title: 'P1', summary: 'S', cat_label: 'Produto' }], error: null },
      site_content: { data: [{ key: 'skills', value: ['Figma'] }], error: null },
    }) });
    expect(out.projects[0]).toMatchObject({ id: 'p1', catLabel: 'Produto' });
    expect(out.site).toEqual({ skills: ['Figma'] });
  });

  it('falls back to bundled data on a query error', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const out = await loadContent(['projects', 'timeline'], { client: fake({
      projects: { data: null, error: { message: 'relation "projects" does not exist' } },
      timeline: { data: [], error: null },
    }) });
    expect(out.projects).toBe(PROJECTS);
    expect(out.timeline).toBeNull();
    expect(warn).toHaveBeenCalled();
  });

  it('falls back when the database is slower than the timeout', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const out = await loadContent(['projects'], { timeoutMs: 20, client: fake({ projects: { data: [], error: null } }, 200) });
    expect(out.projects).toBe(PROJECTS);
  });
});
