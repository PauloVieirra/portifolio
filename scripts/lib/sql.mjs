const JSONB = new Set(['article', 'sections', 'value']);
export const sqlString = (s) => `'${String(s).replace(/'/g, "''")}'`;
export const sqlValue = (v, col) => {
  if (v === null || v === undefined) return 'null';
  if (JSONB.has(col)) return `${sqlString(JSON.stringify(v))}::jsonb`;
  if (Array.isArray(v)) return v.length ? `array[${v.map(sqlString).join(', ')}]` : "'{}'::text[]";
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return sqlString(v);
};
export const insertSQL = (table, rows, conflict) => {
  const cols = Object.keys(rows[0]);
  return `insert into public.${table} (${cols.join(', ')}) values\n${rows.map(r => `  (${cols.map(c => sqlValue(r[c], c)).join(', ')})`).join(',\n')}\non conflict (${conflict}) do nothing;\n`;
};
