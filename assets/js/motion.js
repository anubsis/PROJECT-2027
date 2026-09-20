(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const closing = new WeakSet();
  const ease = 'cubic-bezier(.22, 1, .36, 1)';
  function animate(element, frames, options = {}) {
    if (!element || reduced.matches || !element.animate) return Promise.resolve();
    const animation = element.animate(frames, { duration: 260, easing: ease, ...options });
    running.add(animation);
    return animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) running.forEach(animation => animation.finish());
  });
  function enter(element) {
    return animate(element, [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }]);
  }
  function open(dialog) {
    if (!dialog || closing.has(dialog) || dialog.open) return;
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    animate(dialog, [{ opacity: 0, translate: '0 14px', scale: '.97' }, { opacity: 1, translate: '0 0', scale: '1' }]);
  }
  function close(dialog, after) {
    if (!dialog) { after?.(); return; }
    if (closing.has(dialog)) return;
    closing.add(dialog);
    dialog.classList.add('motion-closing');
    const wasInert = dialog.inert;
    dialog.inert = true;
    const finish = () => {
      if (dialog.close) dialog.close(); else dialog.removeAttribute('open');
      dialog.inert = wasInert;
      dialog.classList.remove('motion-closing');
      closing.delete(dialog);
      after?.();
    };
    if (reduced.matches) { finish(); return; }
    animate(dialog, [{ opacity: 1, translate: '0 0', scale: '1' }, { opacity: 0, translate: '0 8px', scale: '.98' }], { duration: 150, easing: 'ease-in' }).then(finish);
  }
  function dismiss(element) {
    if (!element || closing.has(element)) return;
    closing.add(element);
    const finish = () => element.remove();
    if (reduced.matches) { finish(); return; }
    element.inert = true;
    const panel = element.querySelector('.modal-box');
    if (panel) animate(panel, [{ translate: '0 0' }, { translate: '0 24px' }], { duration: 150 });
    animate(element, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'ease-in' }).then(finish);
  }
  const controls = '[data-planner-intent],[data-save],[data-atlas-save],[data-planner-open]';
  function key(element) {
    return ['data-planner-intent', 'data-save', 'data-atlas-save', 'data-planner-open'].map(name => element.hasAttribute(name) ? name + ':' + element.getAttribute(name) : '').join('');
  }
  function capture(app) {
    return {
      focus: document.activeElement?.matches(controls) ? key(document.activeElement) : null,
      states: new Map([...app.querySelectorAll(controls)].map(el => [key(el), el.className])),
      conversations: new Set([...app.querySelectorAll('[data-conversation]')].map(el => el.dataset.conversation)),
      mode: app.querySelector('.planner-mode')?.textContent,
      initial: !app.firstElementChild
    };
  }
  function rendered(app, before) {
    if (!before) return;
    app.querySelectorAll(controls).forEach(el => {
      const id = key(el);
      if (id === before.focus) el.focus({ preventScroll: true });
      if (before.states.has(id) && before.states.get(id) !== el.className) {
        const target = el.querySelector('svg') || el;
        animate(target, [{ scale: '.85' }, { scale: '1.12', offset: .55 }, { scale: '1' }], { duration: 240 });
      }
    });
    app.querySelectorAll('[data-conversation]').forEach(el => {
      if (!before.conversations.has(el.dataset.conversation)) enter(el);
    });
    const mode = app.querySelector('.planner-mode:not([hidden])');
    if (mode && mode.textContent !== before.mode) enter(mode);
    // Opacity only: never turn a page into a containing block for fixed navigation.
    if (before.initial) animate(app.querySelector('main'), [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
  }
  document.addEventListener('cancel', event => {
    if (!event.target.matches('.planner-dialog, .theme-dialog')) return;
    event.preventDefault();
    close(event.target);
  }, true);
  window.WemoMotion = { open, close, dismiss, enter, capture, rendered };
})();
