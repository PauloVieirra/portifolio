// Rewrites the published copy without em dashes (—), using scripts/data/em-dash-rewrites.mjs.
// Dry run (lists only):  node scripts/remove-em-dashes.mjs
// Apply (needs admin):   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/remove-em-dashes.mjs --apply
import { writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { removeEmDashes } from './data/em-dash-rewrites.mjs';

process.loadEnvFile('.env');
const apply = process.argv.includes('--apply');
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
if (apply) {
  const { error } = await db.auth.signInWithPassword({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  if (error) { console.error('Login falhou:', error.message); process.exit(1); }
}
const fix = (v) => typeof v === 'string' ? removeEmDashes(v)
  : Array.isArray(v) ? v.map(fix)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)]))
  : v;
const leftovers = (v, path, out = []) => {
  if (typeof v === 'string') { if (v.includes('—')) out.push(`${path}: ${v.match(/.{0,50}—.{0,50}/)[0]}`); }
  else if (v && typeof v === 'object') for (const k in v) leftovers(v[k], `${path}.${k}`, out);
  return out;
};

const changes = [], left = [];
for (const table of ['projects', 'articles', 'timeline', 'site_content']) {
  const { data, error } = await db.from(table).select('*');
  if (error) { console.error(error.message); process.exit(1); }
  for (const row of data) {
    const key = table === 'site_content' ? 'key' : 'id';
    const patch = {}, before = {};
    for (const [col, v] of Object.entries(row)) {
      const next = fix(v);
      if (JSON.stringify(next) !== JSON.stringify(v)) { patch[col] = next; before[col] = v; }
    }
    left.push(...leftovers(fix(row), `${table}/${row[key]}`));
    if (Object.keys(patch).length) changes.push({ table, key, id: row[key], patch, before });
  }
}
for (const c of changes) console.log(`${c.table}/${c.id}: ${Object.keys(c.patch).join(', ')}`);
if (left.length) console.log(`\nSem regra (ficam como estão):\n  - ${left.join('\n  - ')}`);
if (!changes.length) { console.log('Nenhum travessão encontrado.'); process.exit(0); }
if (!apply) { console.log('\nSimulação: nada foi alterado.'); process.exit(0); }

mkdirSync('.backups', { recursive: true });
const file = `.backups/em-dashes-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
writeFileSync(file, JSON.stringify(changes.map(({ table, id, before }) => ({ table, id, before })), null, 2));
for (const c of changes) {
  const { data, error } = await db.from(c.table).update(c.patch).eq(c.key, c.id).select(c.key);
  if (error || !data.length) { console.error(`Falhou em ${c.table}/${c.id}:`, error?.message || 'sem permissão (conta não está em admins?)'); process.exit(1); }
}
console.log(`\nAplicado. Cópia do conteúdo anterior: ${file}`);
