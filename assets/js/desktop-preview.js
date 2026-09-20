(() => {
  const desktop = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  const key = 'wemo-phone-preview';
  const app = document.getElementById('app');
  if (!app) return;
  let enabled = false, frame, screen, toggle;
  try { enabled = localStorage.getItem(key) === 'on'; } catch {}
  function mount() {
    if (frame) return;
    frame = document.createElement('div');
    frame.className = 'desktop-phone';
    frame.innerHTML = '<div class="desktop-phone__screen"><div class="desktop-phone__status" aria-hidden="true"><span>9:41</span><i class="desktop-phone__island"></i><span class="desktop-phone__indicators"><svg viewBox="0 0 36 16"><path d="M2 13v-3m5 3V7m5 6V4m5 9V1" stroke-width="3"/><path d="M23 5q5-5 10 0m-8 3q3-3 6 0m-4 3h2"/></svg><i class="desktop-phone__battery"></i></span></div><div class="desktop-phone__home" aria-hidden="true"></div></div>';
    screen = frame.firstElementChild;
    app.before(frame);
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'desktop-preview-toggle';
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-label', 'iPhone view');
    toggle.innerHTML = '<span>iPhone view</span><i aria-hidden="true"></i>';
    document.body.append(toggle);
    toggle.addEventListener('click', () => {
      enabled = !enabled;
      try { localStorage.setItem(key, enabled ? 'on' : 'off'); } catch {}
      update();
    });
  }
  function update() {
    if (desktop.matches) mount();
    if (!frame) return;
    const active = desktop.matches && enabled;
    const wasActive = document.body.classList.contains('desktop-phone-active');
    const scroll = wasActive ? app.scrollTop : window.scrollY;
    if (active) screen.append(app);
    else frame.before(app);
    document.body.classList.toggle('desktop-phone-active', active);
    frame.hidden = !active;
    toggle.hidden = !desktop.matches;
    toggle.setAttribute('aria-checked', String(active));
    if (active) { window.scrollTo(0, 0); app.scrollTop = scroll; }
    else if (wasActive) window.scrollTo(0, scroll);
    window.dispatchEvent(new Event('resize'));
  }
  desktop.addEventListener('change', update);
  update();
})();
