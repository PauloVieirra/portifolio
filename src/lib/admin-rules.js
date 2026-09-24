import { ICONS } from './icons.js';

/* Pure rules shared by the admin screens (and tested in isolation). */
const strip = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');

export const slugify = (title) => strip(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const validateSlug = (slug, existingIds, currentId = null) => {
  if (!slug) return 'Informe o endereço (slug).';
  if (!SLUG_RE.test(slug)) return 'Use só letras minúsculas, números e hífens no endereço.';
  if (slug !== currentId && existingIds.includes(slug)) return 'Já existe um item com este endereço.';
  return true;
};

const tagKey = (s) => strip(s).trim().toLowerCase().replace(/\s+/g, ' ');
export const findDuplicateTags = (bubbles) => {
  const seen = new Map(), dups = new Set();
  bubbles.forEach(b => (b.tags || []).forEach(t => {
    const k = tagKey(t.label);
    if (!k) return;
    if (seen.has(k)) dups.add(seen.get(k)); else seen.set(k, String(t.label).trim());
  }));
  return [...dups];
};

export const validateBubbles = (bubbles) => {
  if (bubbles.length !== 4) return ['São necessárias exatamente 4 bolhas.'];
  const errs = [];
  bubbles.forEach((b, i) => {
    const n = `Bolha ${i + 1}`;
    if (!String(b.value ?? '').trim()) errs.push(`${n}: informe o valor.`);
    if (!String(b.label ?? '').trim()) errs.push(`${n}: informe o rótulo.`);
    const tags = b.tags || [];
    if (!tags.length) errs.push(`${n}: adicione pelo menos uma tag.`);
    if (tags.length > 10) errs.push(`${n}: no máximo 10 tags.`);
    if (tags.some(t => !String(t.label ?? '').trim())) errs.push(`${n}: há uma tag sem nome.`);
    tags.filter(t => !ICONS.includes(t.icon)).forEach(t => errs.push(`${n}: ícone inválido em “${t.label}”.`));
  });
  findDuplicateTags(bubbles).forEach(d => errs.push(`Tag repetida: “${d}”.`));
  return errs;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/\S+$/;
export const validateContact = (c) => {
  const errs = [];
  if (!EMAIL_RE.test(String(c.email ?? '').trim())) errs.push('E-mail inválido.');
  [['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['dribbble', 'Dribbble']].forEach(([k, label]) => {
    const v = String(c[k] ?? '').trim();
    if (v && !URL_RE.test(v)) errs.push(`${label}: use um link completo, começando com https://`);
  });
  return errs;
};

export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const validateImage = ({ type, size }) => {
  if (!IMAGE_TYPES[type]) return 'Formato não suportado. Use JPG, PNG, WebP ou AVIF.';
  if (size > MAX_IMAGE_BYTES) return 'A imagem passa de 5 MB.';
  return true;
};

/* textarea ⇄ paragraphs: a blank line separates paragraphs; single line breaks are joined */
export const paragraphs = (text) => String(text ?? '').split(/\n\s*\n/).map(s => s.trim().replace(/\s*\n\s*/g, ' ')).filter(Boolean);
export const joinParagraphs = (list) => (list || []).join('\n\n');

export const normalizeSections = (sections, { quote }) => {
  const used = new Map();
  return (sections || [])
    .map(s => ({ ...s, title: String(s.title ?? '').trim(), body: (s.body || []).map(p => String(p).trim()).filter(Boolean) }))
    .filter(s => s.title || s.body.length)
    .map(s => {
      const base = slugify(s.title) || 'secao';
      const n = (used.get(base) || 0) + 1;
      used.set(base, n);
      const out = { id: n === 1 ? base : `${base}-${n}`, title: s.title, body: s.body };
      const q = String(s.quote ?? '').trim();
      if (quote && q) out.quote = q;
      const src = String(s.figure?.src ?? '').trim(), caption = String(s.figure?.caption ?? '').trim();
      if (src || caption) out.figure = { src, caption };
      return out;
    });
};

export const nextPosition = (rows) => rows.length ? Math.max(...rows.map(r => r.position ?? 0)) + 1 : 0;
