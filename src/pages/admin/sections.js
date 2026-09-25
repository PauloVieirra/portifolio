import { h, field, input, textarea } from './ui.js';
import { paragraphs, joinParagraphs, normalizeSections } from '../../lib/admin-rules.js';
import { imagesEditor } from './media.js';
import { sectionImages } from '../../lib/figures.js';

/* Repeatable reading sections: title, paragraphs, optional pull quote (articles), optional figure. */
export function sectionsEditor(initial, { folder, quote }) {
  const state = (initial || []).map(s => ({ ...s, body: s.body || [], images: sectionImages(s).map(i => ({ ...i })), figure: null }));
  const wrap = h('div', { class: 'adm-sections' });
  const swap = (i, j) => { [state[i], state[j]] = [state[j], state[i]]; render(); };
  function render() {
    wrap.replaceChildren(...state.map((s, i) => {
      const imgs = imagesEditor({ label: 'Imagens da seção (opcional)', value: s.images, folder, hint: '1 imagem ocupa a largura toda; 2 ficam lado a lado; 3 ou mais formam uma grade.',
        onChange: (list) => { s.images = list; } });
      return h('fieldset', { class: 'adm-section' },
        h('legend', {}, `Seção ${i + 1}`),
        field('Título da seção', input(s.title, { oninput: (e) => { s.title = e.target.value; } })),
        field('Texto', textarea(joinParagraphs(s.body), { rows: 6, oninput: (e) => { s.body = paragraphs(e.target.value); } }), 'Separe os parágrafos com uma linha em branco. Para incorporar um vídeo, cole sozinho num parágrafo o link do post do LinkedIn ou do YouTube. Aceita markdown: ### subtítulo, **negrito**, *itálico*, listas com - e [link](https://…).'),
        quote && field('Citação em destaque (opcional)', input(s.quote || '', { oninput: (e) => { s.quote = e.target.value; } })),
        imgs.el,
        h('div', { class: 'adm-actions' },
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', disabled: i === 0, onclick: () => swap(i, i - 1) }, '↑ Subir'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm', disabled: i === state.length - 1, onclick: () => swap(i, i + 1) }, '↓ Descer'),
          h('button', { type: 'button', class: 'btn btn-ghost btn-sm adm-danger', onclick: () => { state.splice(i, 1); render(); } }, 'Remover seção')));
    }), h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => { state.push({ title: '', body: [], images: [], figure: null }); render(); } }, '+ Adicionar seção'));
  }
  render();
  return { el: wrap, value: () => normalizeSections(state, { quote }) };
}
