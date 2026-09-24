import { h, field, input, toast, guard, busy, pageHead } from './ui.js';
import { getSite, saveSite } from './db.js';
import { validateContact } from '../../lib/admin-rules.js';

export async function renderContact(root) {
  const c = (await getSite('contact')) || { email: '', linkedin: '', github: '', dribbble: '' };
  const f = {
    email: input(c.email, { type: 'email', required: true }),
    linkedin: input(c.linkedin, { type: 'url', placeholder: 'https://' }),
    github: input(c.github, { type: 'url', placeholder: 'https://' }),
    dribbble: input(c.dribbble, { type: 'url', placeholder: 'https://' }),
  };
  const errors = h('ul', { class: 'adm-errors', role: 'alert' });
  const save = h('button', { class: 'btn btn-primary', type: 'submit' }, 'Salvar contato');
  const onSubmit = async (e) => {
    e.preventDefault();
    const value = Object.fromEntries(Object.entries(f).map(([k, el]) => [k, el.value.trim()]));
    const errs = validateContact(value);
    errors.replaceChildren(...errs.map(m => h('li', {}, m)));
    if (errs.length) { toast('Corrija os itens listados.', 'error'); return; }
    await busy(save, () => guard(() => saveSite('contact', value), 'Contato salvo.'));
  };
  root.replaceChildren(pageHead('Contato'), h('form', { class: 'adm-form', novalidate: true, onsubmit: onSubmit },
    errors, field('E-mail', f.email),
    field('LinkedIn', f.linkedin), field('GitHub', f.github, 'Deixe vazio para esconder a pílula.'), field('Dribbble', f.dribbble, 'Deixe vazio para esconder a pílula.'),
    h('div', { class: 'adm-savebar glass' }, save)));
}
