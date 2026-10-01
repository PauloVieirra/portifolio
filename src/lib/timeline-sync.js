/* Education entries from the CV (Educação + "Cursos e treinamentos"), newest first: the "Formação" column of
   /trajetoria. Used by the admin's "Adicionar do currículo" button and by scripts/sync-formacao.mjs.
   Keep in sync with the static fallback in src/partials/trajetoria.html. */
export const FORMACAO = [
  { period: 'Em andamento', title: 'MBA em Inovação Orientada à IA e UX', org: 'Pós-graduação',
    title_full: 'MBA em Inovação Orientada à Inteligência Artificial e Experiência do Usuário' },
  { period: '2025', title: 'IA UX Design', org: 'UX Unicórnio · Curso' },
  { period: '2025', title: 'Google UX Design', org: 'Google · Curso' },
  { period: '2024', title: 'UX/UI', org: 'Uxcell · Curso' },
  { period: '2023', title: 'Superior em Desenvolvimento Mobile', org: 'Graduação' },
  { period: '2023', title: 'Protótipo com Figma', org: 'Curso' },
  { period: '2023', title: 'React Native e React JS', org: 'Curso' },
  { period: '2023', title: 'Desenvolvimento Front-end: JavaScript, HTML5 e CSS', org: 'Curso' },
  { period: '2023', title: 'Metodologia Scrum', org: 'Certiprof · Curso' },
  { period: '2022', title: 'UI Design', org: 'UX Unicórnio · Curso' },
].map(e => ({ kind: 'formacao', description: null, title_full: null, ...e }));

const FIELDS = ['kind', 'period', 'title', 'org', 'description', 'title_full'];

/* Plans the writes that bring `rows` (the timeline table) in line with FORMACAO. Entries are matched by title:
   existing ones get the CV's fields, missing ones are inserted. Education goes first, in the CV's order; every
   other row keeps its relative order after it. Nothing is deleted.
   Returns [{ label, id?, patch }]: with id → update that row, without → insert patch. */
export function planFormacaoSync(rows) {
  const ops = [];
  FORMACAO.forEach((entry, i) => {
    const row = rows.find(r => r.title === entry.title);
    if (!row) { ops.push({ label: `+ ${entry.period} · ${entry.title} (${entry.org})`, patch: { ...entry, position: i } }); return; }
    const patch = Object.fromEntries(FIELDS.filter(k => (row[k] ?? null) !== entry[k]).map(k => [k, entry[k]]));
    if (row.position !== i) patch.position = i;
    if (Object.keys(patch).length) ops.push({ label: `~ ${entry.title}: ${Object.keys(patch).join(', ')}`, id: row.id, patch });
  });
  const known = new Set(FORMACAO.map(e => e.title));
  [...rows].sort((a, b) => a.position - b.position).filter(r => !known.has(r.title)).forEach((row, j) => {
    const position = FORMACAO.length + j;
    if (row.position !== position) ops.push({ label: `~ ${row.title}: posição ${row.position} → ${position}`, id: row.id, patch: { position } });
  });
  return ops;
}

/* CV entries the table does not have yet (by title) */
export const missingFormacao = (rows) => FORMACAO.filter(e => !rows.some(r => r.title === e.title));
