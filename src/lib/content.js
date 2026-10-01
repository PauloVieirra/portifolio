import { supabase } from './supabase.js';
import { PROJECTS } from '../data/projects.js';
import { ARTICLES } from '../data/articles.js';
import { VIDEOS } from '../data/videos.js';
import { fromProjectRow, fromArticleRow } from './content-map.js';

/* Page content comes from Supabase on every load. If it fails or takes longer than TIMEOUT_MS, projects and
   articles fall back to the bundled copy (src/data) and the home keeps its static HTML (timeline/site = null). */
const TIMEOUT_MS = 2500;

const QUERIES = {
  projects: (db) => db.from('projects').select('*').eq('published', true).order('position'),
  articles: (db) => db.from('articles').select('*').eq('published', true).order('date', { ascending: false }),
  timeline: (db) => db.from('timeline').select('*').order('position'),
  site: (db) => db.from('site_content').select('key,value'),
  /* the videos table came later: until supabase/schema.sql is run again it does not exist, and that must not
     send projects and articles to the local copy too, so a failure here only falls back the videos */
  videos: async (db) => {
    const res = await db.from('videos').select('*').eq('published', true).order('position');
    if (res.error) console.warn('[content] vídeos: usando a cópia local:', res.error.message);
    return res.error ? { data: null, error: null } : res;
  },
};
const MAP = {
  projects: (rows) => rows.map(fromProjectRow),
  articles: (rows) => rows.map(fromArticleRow),
  timeline: (rows) => rows,
  site: (rows) => Object.fromEntries(rows.map(r => [r.key, r.value])),
  videos: (rows) => rows ?? VIDEOS,
};
const FALLBACK = { projects: () => PROJECTS, articles: () => ARTICLES, timeline: () => null, site: () => null, videos: () => VIDEOS };

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
