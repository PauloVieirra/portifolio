/* =========================================================
   FRAMEWORKS - /processo: Lean Inception or Design Thinking
   Markup: src/partials/processo-frameworks.html
   ========================================================= */
/* Two tabs pick the framework; the choice lives in the URL hash (#lean-inception, #design-thinking) so a link
   opens the right one. Arrow keys move between tabs. The Design Thinking flow gets a dashed return line beside
   the centre line, from "Testar" back up to "Definir" (the cycle); it is measured, so it follows the layout. */
export function initFrameworks() {
  const tabs = [...document.querySelectorAll('.fw-tab')];
  if (!tabs.length) return;
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

  const select = (i, { focus = false, push = true } = {}) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus();
    if (push) try { history.replaceState(null, '', `#${tabs[i].dataset.hash}`); } catch (_) {}
    layoutReturn();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      select((i + d + tabs.length) % tabs.length, { focus: true });
    });
  });

  /* the cycle: from the last step's node up to the second one's */
  const layoutReturn = () => document.querySelectorAll('.flow--loop').forEach(flow => {
    const line = flow.querySelector('.flow-return');
    const nodes = [...flow.querySelectorAll('.flow-node')];
    if (!line || nodes.length < 3 || flow.closest('[hidden]')) return;
    const top = nodes[1].offsetTop + nodes[1].closest('.flow-step').offsetTop + nodes[1].offsetHeight / 2;
    const bottom = nodes.at(-1).offsetTop + nodes.at(-1).closest('.flow-step').offsetTop + nodes.at(-1).offsetHeight / 2;
    line.style.top = `${top}px`;
    line.style.height = `${Math.max(0, bottom - top)}px`;
  });
  addEventListener('resize', layoutReturn);
  document.fonts?.ready.then(layoutReturn);

  const fromHash = () => tabs.findIndex(t => `#${t.dataset.hash}` === location.hash);
  addEventListener('hashchange', () => { const i = fromHash(); if (i >= 0) select(i, { push: false }); });
  select(Math.max(0, fromHash()), { push: false });
}
