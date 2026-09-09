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
        window.WemoMotion.open(dialog);
      });
    });

    document.querySelectorAll('[data-theme-close]').forEach((button) => {
      button.addEventListener('click', () => {
        window.WemoMotion.close(dialog);
      });
    });

    dialog?.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      window.WemoMotion.close(dialog);
    });

    dialog?.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      window.WemoMotion.close(dialog);
    });

    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => {
        apply(button.dataset.themeOption, true);
        window.WemoMotion.close(dialog);
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
