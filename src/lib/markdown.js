/* Small, safe markdown for text written in the admin: paragraphs, ### subheadings, lists (- * • 1.),
   **bold**, *italic* and http(s) links. Everything is HTML-escaped first, so text can never inject markup. */
const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ENT[c]);

export const mdInline = (text) => esc(String(text ?? '').replace(/\s*\n\s*/g, ' ').trim())
  .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  .replace(/\*\*(\S(?:.*?\S)?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*\w])\*(\S(?:.*?\S)?)\*(?!\*)/g, '$1<em>$2</em>');

const HEADING = /^#{1,6}\s+(.*)$/;
const ITEM = /^(\s*)([-*•]|\d+[.)])\s+(.*)$/;

/* consecutive item lines → nested <ul>/<ol> (indent of 2+ spaces = one level deeper) */
const list = (items) => {
  const tag = /\d/.test(items[0].marker) ? 'ol' : 'ul';
  const base = items[0].indent;
  const out = [];
  for (const it of items) {
    if (it.indent > base && out.length) out[out.length - 1].kids.push(it);
    else out.push({ ...it, kids: [] });
  }
  return `<${tag}>${out.map(it => `<li>${mdInline(it.text)}${it.kids.length ? list(it.kids) : ''}</li>`).join('')}</${tag}>`;
};

/* a list saved before line breaks were kept: "* A * B" on one line */
const flattened = (line) => {
  const m = line.match(/^([-*•])\s+\S/);
  if (!m) return null;
  const parts = line.split(new RegExp(`\\s\\${m[1]}\\s+(?=\\S)`));
  return parts.length > 1 ? parts.map((p, i) => ({ indent: 0, marker: m[1], text: i ? p : p.replace(/^[-*•]\s+/, '') })) : null;
};

export function md(text, { cls } = {}) {
  const attr = cls ? ` class="${cls}"` : '';
  const html = [];
  for (const block of String(text ?? '').split(/\n\s*\n/)) {
    const lines = block.split('\n');
    let para = [], items = [];
    const flushPara = () => {
      if (!para.length) return;
      html.push(`<p${attr}>${mdInline(para.join('\n'))}</p>`);
      para = [];
    };
    const flushList = () => { if (items.length) html.push(list(items).replace(/^<(ul|ol)>/, `<$1${attr}>`)); items = []; };
    for (const line of lines) {
      if (!line.trim()) continue;
      const h = line.trim().match(HEADING), it = line.match(ITEM);
      if (h) { flushPara(); flushList(); html.push(`<h3${attr}>${mdInline(h[1])}</h3>`); }
      else if (it) {
        flushPara();
        const indent = it[1].replace(/\t/g, '  ').length;
        const rec = !it[1] && flattened(line.trim());
        if (rec) items.push(...rec); else items.push({ indent, marker: it[2], text: it[3] });
      }
      else if (items.length && /^\s+\S/.test(line)) items[items.length - 1].text += ' ' + line.trim();
      else { flushList(); para.push(line); }
    }
    flushPara(); flushList();
  }
  return html.join('');
}

/* short enough to be the page's opening line (one plain paragraph, ≤ 320 chars) */
export const isLead = (text) => {
  const t = String(text ?? '').trim();
  return !!t && t.length <= 320 && !/\n\s*\n/.test(t) && !/^\s*(#{1,6}\s|[-*•]\s|\d+[.)]\s)/m.test(t);
};

/* deliverables: a line starting with "- " belongs to the item above it */
export const groupItems = (list) => (list || []).reduce((out, raw) => {
  const line = String(raw).trim(), sub = line.match(/^[-•]\s+(.*)$/);
  if (sub && out.length) out[out.length - 1].children.push(sub[1]);
  else out.push({ text: sub ? sub[1] : line, children: [] });
  return out;
}, []);
