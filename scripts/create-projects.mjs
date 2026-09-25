// Deletes the sample projects and articles and creates Paulo's case studies as drafts (published = false).
// Dry run (lists only):  node scripts/create-projects.mjs
// Apply (needs admin):   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/create-projects.mjs --apply
import { writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { NEW_PROJECTS } from './data/new-projects.mjs';
import { toProjectRow } from '../src/lib/content-map.js';

const SAMPLES = ['lumen', 'prompt-studio', 'confianca', 'triagem', 'onboarding'];
const SAMPLE_ARTICLES = ['desenhar-confianca', 'prototipar-com-modelo-real', 'tokens-para-agentes', 'estados-de-erro-em-ia',
  'pesquisa-com-usuarios-de-ia', 'handoff-com-codigo', 'onboarding-que-se-adapta'];
process.loadEnvFile('.env');
const apply = process.argv.includes('--apply');
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
if (apply) {
  const { error } = await db.auth.signInWithPassword({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  if (error) { console.error('Login falhou:', error.message); process.exit(1); }
}
const run = async (q) => { const { data, error } = await q; if (error) { console.error(error.message); process.exit(1); } return data; };

const existing = await run(db.from('projects').select('*'));
const toDelete = existing.filter(p => SAMPLES.includes(p.id));
const articlesToDelete = await run(db.from('articles').select('*').in('id', SAMPLE_ARTICLES));
const known = new Set(existing.map(p => p.id));
const maxPos = Math.max(-1, ...existing.filter(p => !SAMPLES.includes(p.id)).map(p => p.position));
const toCreate = NEW_PROJECTS.filter(p => !known.has(p.id)).map((p, i) => ({ ...toProjectRow(p, maxPos + 1 + i), published: false }));

console.log(`Excluir (${toDelete.length}): ${toDelete.map(p => `${p.id} — ${p.title}`).join('; ') || 'nenhum'}`);
console.log(`Excluir artigos de exemplo (${articlesToDelete.length}): ${articlesToDelete.map(a => a.title).join('; ') || 'nenhum'}`);
console.log(`Criar como rascunho (${toCreate.length}): ${toCreate.map(p => `${p.id} — ${p.title}`).join('; ') || 'nenhum (já existem)'}`);
if (!apply) { console.log('\nSimulação: nada foi alterado.'); process.exit(0); }

mkdirSync('.backups', { recursive: true });
const file = `.backups/projects-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
writeFileSync(file, JSON.stringify({ deletedProjects: toDelete, deletedArticles: articlesToDelete }, null, 2));
if (articlesToDelete.length) {
  const goneA = await run(db.from('articles').delete().in('id', articlesToDelete.map(a => a.id)).select('id'));
  if (goneA.length !== articlesToDelete.length) { console.error('Exclusão de artigos incompleta (a conta está em admins?)'); process.exit(1); }
}
if (toDelete.length) {
  const gone = await run(db.from('projects').delete().in('id', toDelete.map(p => p.id)).select('id'));
  if (gone.length !== toDelete.length) { console.error('Exclusão incompleta (a conta está em admins?)'); process.exit(1); }
}
if (toCreate.length) await run(db.from('projects').insert(toCreate).select('id'));
console.log(`\nAplicado. Cópia do que foi excluído: ${file}`);
