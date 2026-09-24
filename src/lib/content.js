import { supabase } from './supabase.js';
import { PROJECTS } from '../data/projects.js';
import { ARTICLES } from '../data/articles.js';
import { fromProjectRow, fromArticleRow } from './content-map.js';

/* Page content comes from Supabase on every load. If it fails or takes longer than TIMEOUT_MS, projects and
   articles fall back to the bundled copy (src/data) and the home keeps its static HTML (timeline/site = null). */
const TIMEOUT_MS = 2500;

const QUERIES = {
  projects: (db) => db.from('projects').select('*').eq('published', true).order('position'),
  articles: (db) => db.from('articles').select('*').eq('published', true).order('date', { ascending: false }),
  timeline: (db) => db.from('timeline').select('*').order('position'),
  site: (db) => db.from('site_content').select('key,value'),
};
const MAP = {
  projects: (rows) => rows.map(fromProjectRow),
  articles: (rows) => rows.map(fromArticleRow),
  timeline: (rows) => rows,
  site: (rows) => Object.fromEntries(rows.map(r => [r.key, r.value])),
};
const FALLBACK = { projects: () => PROJECTS, articles: () => ARTICLES, timeline: () => null, site: () => null };

export async function loadContent(keys, { client = supabase, timeoutMs = TIMEOUT_MS } = {}) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`sem resposta em ${timeoutMs} ms`)), timeoutMs); });
  const queries = Promise.all(keys.map(async (k) => {
    const { data, error } = await QUERIES[k](client);
    if (error) throw new Error(error.message);
    return [k, MAP[k](data)];
  }));
  queries.catch(() => {});   // a late failure after the timeout already fell back
  try {
    return Object.fromEntries(await Promise.race([queries, timeout]));
  } catch (err) {
    console.warn('[content] usando a cópia local:', err.message);
    return Object.fromEntries(keys.map(k => [k, FALLBACK[k]()]));
  } finally {
    clearTimeout(timer);
  }
}
