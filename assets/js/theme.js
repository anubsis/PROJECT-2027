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
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => apply(button.dataset.themeOption, true));
    });
    updateControls();
  }

  apply(storedTheme() || preferredTheme());
  media.addEventListener?.('change', () => {
    if (!storedTheme()) apply(preferredTheme());
  });

  window.WemoTheme = { bind, set: (theme) => apply(theme, true) };
})();
