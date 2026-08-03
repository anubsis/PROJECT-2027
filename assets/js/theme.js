(() => {
  const storageKey = 'wemo-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function preferredTheme() {
    return media.matches ? 'dark' : 'light';
  }

  function updateControls() {
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      const selected = button.dataset.themeOption === document.documentElement.dataset.theme;
      button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-theme-current]').forEach((label) => {
      label.textContent = document.documentElement.dataset.theme === 'light'
        ? label.dataset.lightLabel
        : label.dataset.darkLabel;
    });
  }

  function apply(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem(storageKey, theme); } catch { /* Storage can be unavailable. */ }
    }
    updateControls();
  }

  function bind() {
    const dialog = document.querySelector('[data-theme-dialog]');

    document.querySelectorAll('[data-theme-open]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!dialog) return;
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      });
    });

    document.querySelectorAll('[data-theme-close]').forEach((button) => {
      button.addEventListener('click', () => {
        if (typeof dialog?.close === 'function') dialog.close();
        else dialog?.removeAttribute('open');
      });
    });

    dialog?.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });

    dialog?.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });

    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => {
        apply(button.dataset.themeOption, true);
        if (typeof dialog?.close === 'function') dialog.close();
        else dialog?.removeAttribute('open');
      });
    });
    updateControls();
  }

  apply(storedTheme() || preferredTheme());
  media.addEventListener?.('change', () => {
    if (!storedTheme()) apply(preferredTheme());
  });

  window.WemoTheme = { bind, set: (theme) => apply(theme, true) };
})();
