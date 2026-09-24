import { h, field, input, textarea, toast, guard, busy, lines, pageHead } from './ui.js';
import { getSite, saveSite } from './db.js';

export async function renderServices(root) {
  const [services0, skills0] = await Promise.all([getSite('services'), getSite('skills')]);
  const services = structuredClone(services0 || []);
  while (services.length < 3) services.push({ title: '', text: '', items: [] });
  services.length = 3;
  const cards = services.map((s, i) => ({
    title: input(s.title), text: textarea(s.text, { rows: 3 }), items: textarea((s.items || []).join('\n'), { rows: 3 }), i }));
  const skills = textarea((skills0 || []).join('\n'), { rows: 8 });
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar serviços');
  const onSubmit = async (e) => {
    e.preventDefault();
    const value = cards.map(c => ({ title: c.title.value.trim(), text: c.text.value.trim(), items: lines(c.items.value) }));
    const bad = value.findIndex(s => !s.title || !s.text || !s.items.length || s.items.length > 5);
    if (bad >= 0) { toast(`Card ${bad + 1}: preencha título, texto e de 1 a 5 itens.`, 'error'); return; }
    const chips = lines(skills.value);
    if (!chips.length) { toast('Informe pelo menos uma ferramenta.', 'error'); return; }
    await busy(save, () => guard(async () => { await saveSite('services', value); await saveSite('skills', chips); }, 'Serviços salvos.'));
  };
  root.replaceChildren(pageHead('Serviços'), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    ...cards.map(c => h('fieldset', { class: 'adm-section' }, h('legend', {}, `Card ${c.i + 1}`),
      field('Título', c.title), field('Texto', c.text), field('Itens', c.items, 'Um por linha (até 5).'))),
    field('Ferramentas e competências', skills, 'Uma por linha. Aparecem como pílulas abaixo dos cards.'),
    h('div', { class: 'adm-savebar glass' }, save)));
}
