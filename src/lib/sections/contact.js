/* =========================================================
   CONTACT - copy e-mail, validation, success state
   Markup: src/partials/contato.html (home and /contato)
   ========================================================= */
export function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const toast = document.getElementById('toast');
  const showToast = (msg) => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('is-on'), 2200); };
  document.getElementById('copyEmail').addEventListener('click', async () => {
    const email = document.getElementById('emailAddr').textContent;
    try { await navigator.clipboard.writeText(email); showToast('E-mail copiado'); }
    catch { showToast(email); }
  });

  const rules = {
    name: v => v.trim().length >= 2 || 'Informe seu nome.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Informe um e-mail válido.',
    msg: v => v.trim().length >= 20 || 'Escreva pelo menos 20 caracteres.'
  };
  const check = (input) => {
    const rule = rules[input.name]; if (!rule) return true;
    const res = rule(input.value);
    const field = input.closest('.field');
    field.classList.toggle('has-error', res !== true);
    field.querySelector('.err').textContent = res === true ? '' : res;
    return res === true;
  };
  form.querySelectorAll('input, textarea').forEach(i => i.addEventListener('blur', () => check(i)));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = [...form.querySelectorAll('input, textarea')].map(check).every(Boolean);
    if (!ok) { form.querySelector('.has-error input, .has-error textarea').focus(); return; }
    document.getElementById('sentName').textContent = form.elements.name.value.trim().split(' ')[0];
    document.getElementById('formWrap').classList.add('is-sent');
  });
  document.getElementById('resetForm').addEventListener('click', () => {
    form.reset(); document.getElementById('formWrap').classList.remove('is-sent');
  });
}
