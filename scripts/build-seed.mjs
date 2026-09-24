// scripts/build-seed.mjs — node scripts/build-seed.mjs → supabase/seed.sql
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { PROJECTS } from '../src/data/projects.js';
import { ARTICLES } from '../src/data/articles.js';
import { toProjectRow, toArticleRow } from '../src/lib/content-map.js';
import { extractHome } from './lib/extract-home.mjs';
import { insertSQL, sqlValue } from './lib/sql.mjs';

const home = extractHome(readFileSync('index.html', 'utf8'));
const tl = home.timeline;
const timelineSQL = `insert into public.timeline (position, kind, period, title, org, description, title_full)
select * from (values
${tl.map(r => `  (${[r.position, r.kind, r.period, r.title, r.org, r.description, r.title_full].map((v, i) => i === 0 ? v : sqlValue(v, 'x')).join(', ')})`).join(',\n')}
) as v(position, kind, period, title, org, description, title_full)
where not exists (select 1 from public.timeline);
`;
const site = [
  { key: 'hero_bubbles', value: home.bubbles },
  { key: 'services', value: home.services },
  { key: 'skills', value: home.skills },
  { key: 'contact', value: home.contact },
];
const sql = [
  '-- Gerado por scripts/build-seed.mjs. Seguro para executar de novo: não sobrescreve edições.',
  insertSQL('projects', PROJECTS.map(toProjectRow), 'id'),
  insertSQL('articles', ARTICLES.map(toArticleRow), 'id'),
  timelineSQL,
  insertSQL('site_content', site, 'key'),
].join('\n');
mkdirSync('supabase', { recursive: true });
writeFileSync('supabase/seed.sql', sql);
console.log(`seed.sql: ${PROJECTS.length} projetos, ${ARTICLES.length} artigos, ${tl.length} itens de trajetória, ${site.length} blocos`);
