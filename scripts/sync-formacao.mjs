// Timeline: brings the education entries ("Formação" column of /trajetoria) in line with the CV
// (Educação + every entry of "Cursos e treinamentos"). Entries are matched by title: existing ones are updated,
// missing ones inserted. Education comes first in the order below, then the work entries in their current order.
// Nothing is deleted. Safe to run twice. The list and the rules: src/lib/timeline-sync.js (also behind the admin's
// "Adicionar do currículo" button).
// Dry run (lists only):  node scripts/sync-formacao.mjs
// Apply (needs admin):   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/sync-formacao.mjs --apply
import { writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { planFormacaoSync } from '../src/lib/timeline-sync.js';

process.loadEnvFile('.env');
const apply = process.argv.includes('--apply');
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
if (apply) {
  const { error } = await db.auth.signInWithPassword({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
  if (error) { console.error('Login falhou:', error.message); process.exit(1); }
}
const run = async (q) => { const { data, error } = await q; if (error) { console.error(error.message); process.exit(1); } return data; };

const rows = await run(db.from('timeline').select('*').order('position'));
const ops = planFormacaoSync(rows);
if (!ops.length) { console.log('A trajetória já está de acordo com o currículo.'); process.exit(0); }
ops.forEach(o => console.log(o.label));
if (!apply) { console.log('\nSimulação: nada foi alterado.'); process.exit(0); }

mkdirSync('.backups', { recursive: true });
const file = `.backups/timeline-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
writeFileSync(file, JSON.stringify(rows, null, 2));
for (const o of ops) {
  const q = o.id ? db.from('timeline').update(o.patch).eq('id', o.id) : db.from('timeline').insert(o.patch);
  const data = await run(q.select('id'));
  if (!data.length) { console.error(`Falhou em "${o.label}": sem permissão (conta não está em admins?)`); process.exit(1); }
}
console.log(`\nAplicado. Cópia da trajetória anterior: ${file}`);
