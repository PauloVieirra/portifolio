import { supabase } from '../../lib/supabase.js';

/* Admin data access. Every call throws an Error with Supabase's message, which the screens toast. */
const run = async (query) => { const { data, error } = await query; if (error) throw new Error(error.message); return data; };

export const listRows = (table, order = 'position', ascending = true) => run(supabase.from(table).select('*').order(order, { ascending }));
export const insertRow = (table, row) => run(supabase.from(table).insert(row).select().single());
export const updateRow = (table, key, id, patch) => run(supabase.from(table).update(patch).eq(key, id).select().single());
export const deleteRow = (table, key, id) => run(supabase.from(table).delete().eq(key, id));
export const swapPositions = async (table, a, b, key = 'id') => {
  await updateRow(table, key, a[key], { position: b.position });
  await updateRow(table, key, b[key], { position: a.position });
};
export const countWhere = async (table, col, value) => {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq(col, value);
  if (error) throw new Error(error.message);
  return count ?? 0;
};
export const getSite = async (key) => (await run(supabase.from('site_content').select('value').eq('key', key).maybeSingle()))?.value ?? null;
export const saveSite = (key, value) => run(supabase.from('site_content').upsert({ key, value }, { onConflict: 'key' }));
