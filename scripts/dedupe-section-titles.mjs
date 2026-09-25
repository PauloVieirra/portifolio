// Removes a section's first paragraph when it only repeats the section title (e.g. "**Contexto**", "### Processo").
// Dry run (lists only):  node scripts/dedupe-section-titles.mjs
// Apply (needs admin):   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/dedupe-section-titles.mjs --apply
import { writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

process.loadEnvFile('.env');
const apply = process.argv.includes('--apply');
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
if (apply) {
  const { error } = await db.auth.signInWithPassword({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  if (error) { console.error('Login falhou:', error.message); process.exit(1); }
}
const bare = (s) => String(s ?? '').replace(/^#{1,6}\s+/, '').replace(/[*_]/g, '').trim().toLowerCase();
const clean = (sections) => {
  let removed = [];
  const out = (sections || []).map(s => {
    if (s.body?.length && bare(s.body[0]) === bare(s.title)) { removed.push(`${s.title}: "${s.body[0]}"`); return { ...s, body: s.body.slice(1) }; }
    return s;
  });
  return { out, removed };
};

const changes = [];
const { data: projects, error: e1 } = await db.from('projects').select('id,title,article');
const { data: articles, error: e2 } = await db.from('articles').select('id,title,sections');
if (e1 || e2) { console.error((e1 || e2).message); process.exit(1); }
for (const p of projects) {
  const { out, removed } = clean(p.article?.sections);
  if (removed.length) changes.push({ table: 'projects', id: p.id, title: p.title, removed, patch: { article: { ...p.article, sections: out } }, before: { article: p.article } });
}
for (const a of articles) {
  const { out, removed } = clean(a.sections);
  if (removed.length) changes.push({ table: 'articles', id: a.id, title: a.title, removed, patch: { sections: out }, before: { sections: a.sections } });
}
if (!changes.length) { console.log('Nenhum título duplicado encontrado.'); process.exit(0); }
for (const c of changes) console.log(`${c.table}/${c.id} (${c.title})\n  - ${c.removed.join('\n  - ')}`);
if (!apply) { console.log(`\n${apply ? '' : 'Simulação: nada foi alterado.'}`); process.exit(0); }

mkdirSync('.backups', { recursive: true });
const file = `.backups/sections-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
writeFileSync(file, JSON.stringify(changes.map(({ table, id, before }) => ({ table, id, before })), null, 2));
for (const c of changes) {
  const { data, error } = await db.from(c.table).update(c.patch).eq('id', c.id).select('id');
  if (error || !data.length) { console.error(`Falhou em ${c.table}/${c.id}:`, error?.message || 'sem permissão (conta não está em admins?)'); process.exit(1); }
}
console.log(`\nAplicado. Cópia do conteúdo anterior: ${file}`);
