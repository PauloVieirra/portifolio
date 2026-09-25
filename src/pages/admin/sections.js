import { h, field, input, textarea } from './ui.js';
import { paragraphs, joinParagraphs, normalizeSections } from '../../lib/admin-rules.js';
import { imageField } from './media.js';

/* Repeatable reading sections: title, paragraphs, optional pull quote (articles), optional figure. */
export function sectionsEditor(initial, { folder, quote }) {
  const state = (initial || []).map(s => ({ ...s, body: s.body || [], figure: s.figure ? { ...s.figure } : null }));
  const wrap = h('div', { class: 'adm-sections' });
  const swap = (i, j) => { [state[i], state[j]] = [state[j], state[i]]; render(); };
  function render() {
    wrap.replaceChildren(...state.map((s, i) => {
      const img = imageField({ label: 'Figura (opcional)', value: s.figure?.src || '', folder,
        onChange: (v) => { s.figure = { caption: s.figure?.caption || '', src: v }; } });
      return h('fieldset', { class: 'adm-section' },
        h('legend', {}, `Seção ${i + 1}`),
        field('Título da seção', input(s.title, { oninput: (e) => { s.title = e.target.value; } })),
        field('Texto', textarea(joinParagraphs(s.body), { rows: 6, oninput: (e) => { s.body = paragraphs(e.target.value); } }), 'Separe os parágrafos com uma linha em branco. Para incorporar um vídeo, cole sozinho num parágrafo o link do post do LinkedIn ou do YouTube. Aceita markdown: ### subtítulo, **negrito**, *itálico*, listas com - e [link](https://…).'),
        quote && field('Citação em destaque (opcional)', input(s.quote || '', { oninput: (e) => { s.quote = e.target.value; } })),
        img.el,
        field('Legenda da figura', input(s.figure?.caption || '', { oninput: (e) => { s.figure = { src: s.figure?.src || '', caption: e.target.value }; } })),
        h('div', { class: 'adm-actions' },
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', disabled: i === 0, onclick: () => swap(i, i - 1) }, '↑ Subir'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', disabled: i === state.length - 1, onclick: () => swap(i, i + 1) }, '↓ Descer'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm adm-danger', onclick: () => { state.splice(i, 1); render(); } }, 'Remover seção')));
    }), h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => { state.push({ title: '', body: [], figure: null }); render(); } }, '+ Adicionar seção'));
  }
  render();
  return { el: wrap, value: () => normalizeSections(state, { quote }) };
}
