/* "Portfolio under construction" notice: shown on a visitor's first page view, remembered once closed.
   Storage can be blocked (private mode, cleared data): then it simply shows again next time. */
const KEY = 'pv-notice-construcao-v1';

const seen = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
const remember = () => { try { localStorage.setItem(KEY, '1'); } catch { /* storage blocked */ } };

export function showConstructionNotice() {
  if (seen()) return;
  const box = document.createElement('section');
  box.className = 'site-notice glass';
  box.setAttribute('role', 'region');
  box.setAttribute('aria-label', 'Aviso');
  box.innerHTML = `
    <p class="eyebrow">Em construção</p>
    <p>Este portfólio ainda está sendo construído. Algumas informações podem não ter sido revisadas.</p>
    <button class="btn btn-primary btn-sm" type="button">Entendi</button>`;
  box.querySelector('button').addEventListener('click', () => {
    remember();
    box.classList.remove('is-in');
    setTimeout(() => box.remove(), 300);
  });
  document.body.appendChild(box);
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-in')));
}
