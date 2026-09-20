(() => {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    wemo: '<path d="m12 3 1.8 5.7 5.7 1.8-5.7 1.8-1.8 5.7-1.8-5.7-5.7-1.8 5.7-1.8z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
    atlas: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14v18a3 3 0 0 1 3-3h.5a2.5 2.5 0 0 1 2.5 2.5z"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>', heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', back: '<path d="m15 18-6-6 6-6"/>', share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', moon: '<path d="M20.5 15.3A9 9 0 0 1 8.7 3.5 9 9 0 1 0 20.5 15.3Z"/>',
    spark: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>', utensils: '<path d="M7 2v9M4 2v5a3 3 0 0 0 6 0V2M7 11v11M17 2v20M14 2v8h6"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sort: '<path d="M4 7h16M7 12h10M10 17h4"/>', target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', chevron: '<path d="m9 18 6-6-6-6"/>',
    wifi: '<path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a4 4 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/>', card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>', users: '<circle cx="9" cy="8" r="3"/><path d="M3 21a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 21a5 5 0 0 0-3-4.6"/>', music: '<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>', camera: '<path d="M4 7h4l1-2h6l1 2h4v12H4z"/><circle cx="12" cy="13" r="3"/>',
    play: '<path d="m9 7 8 5-8 5z"/>', phone: '<path d="M5 3h3l2 5-2 2c1.5 3 3 4.5 6 6l2-2 5 2v3c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2z"/>', message: '<path d="M4 5h16v11H8l-4 4z"/>', plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>', mountain: '<path d="m3 20 7-12 4 7 2-3 5 8z"/><path d="m8.5 10.6 1.5 1.9 1.5-1.9"/>', bed: '<path d="M3 19V7M21 19v-7a3 3 0 0 0-3-3H9v7M3 16h18M6 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>',
    medical: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>', bank: '<path d="m3 9 9-6 9 6M5 10h14M6 10v8M10 10v8M14 10v8M18 10v8M4 21h16M3 18h18"/>', fuel: '<path d="M5 21V4h10v17M3 21h14M7 7h6v5H7zM15 8h2l3 3v7a2 2 0 0 1-4 0v-4"/>', toilet: '<circle cx="8" cy="5" r="2"/><circle cx="16" cy="5" r="2"/><path d="M5 10h6l-1 11H6L5 10zM14 10h4l2 6h-3v5h-3v-5h-2l2-6z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>', check: '<path d="M4 12l6 6L20 6"/>', building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h2"/>', layers: '<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>'
  };
  Object.assign(paths, {
  "home": "<path class=\"icon-wash\" d=\"M4.5 10 12 3.5 19.5 10v9a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19Z\"/><path d=\"m3 10.5 7.7-6.7a2 2 0 0 1 2.6 0l7.7 6.7M5 9v10a1.5 1.5 0 0 0 1.5 1.5H9v-6h6v6h2.5A1.5 1.5 0 0 0 19 19V9\"/>",
  "map": "<path class=\"icon-wash\" d=\"m9 4 6 3v13l-6-3Z\"/><path d=\"m3.5 6 5.5-2 6 3 5.5-2v13L15 20l-6-3-5.5 2ZM9 4v13m6-10v13\"/>",
  "atlas": "<rect class=\"icon-wash\" x=\"5\" y=\"3\" width=\"15\" height=\"18\" rx=\"3\"/><rect x=\"5\" y=\"3\" width=\"15\" height=\"18\" rx=\"3\"/><path d=\"M9 3v18M3 7h4m-4 5h4m-4 5h4m5-10h5m-5 4h3\"/>",
  "profile": "<circle class=\"icon-wash\" cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"9\" r=\"3\"/><path d=\"M5.5 18a7 7 0 0 1 13 0\"/>",
  "wemo": "<path class=\"icon-wash\" d=\"m11 3 2.5 6.5L20 12l-6.5 2.5L11 21l-2.5-6.5L2 12l6.5-2.5Z\"/><path d=\"m11 3 2.5 6.5L20 12l-6.5 2.5L11 21l-2.5-6.5L2 12l6.5-2.5ZM19 2v4m-2-2h4\"/>",
  "spark": "<path class=\"icon-wash\" d=\"m10 4 2.2 6.3L18.5 12l-6.3 2.2L10 20.5l-2.2-6.3L1.5 12l6.3-1.7Z\"/><path d=\"m10 4 2.2 6.3L18.5 12l-6.3 2.2L10 20.5l-2.2-6.3L1.5 12l6.3-1.7ZM19 3v5m-2.5-2.5h5\"/>",
  "grid": "<rect x=\"3.5\" y=\"3.5\" width=\"6.5\" height=\"6.5\" rx=\"2\"/><rect x=\"14\" y=\"3.5\" width=\"6.5\" height=\"6.5\" rx=\"2\"/><rect x=\"3.5\" y=\"14\" width=\"6.5\" height=\"6.5\" rx=\"2\"/><rect x=\"14\" y=\"14\" width=\"6.5\" height=\"6.5\" rx=\"2\"/>",
  "search": "<circle cx=\"10.75\" cy=\"10.75\" r=\"6.75\"/><path d=\"m16 16 4.5 4.5\"/>",
  "pin": "<path class=\"icon-wash\" d=\"M19 10c0 5-7 10.5-7 10.5S5 15 5 10a7 7 0 1 1 14 0Z\"/><path d=\"M19 10c0 5-7 10.5-7 10.5S5 15 5 10a7 7 0 1 1 14 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>",
  "heart": "<path d=\"M20.4 5.6a5.2 5.2 0 0 0-7.4 0l-1 1-1-1a5.2 5.2 0 0 0-7.4 7.4l8.4 7.5 8.4-7.5a5.2 5.2 0 0 0 0-7.4Z\"/>",
  "calendar": "<rect class=\"icon-wash\" x=\"4\" y=\"5.5\" width=\"16\" height=\"15\" rx=\"3\"/><rect x=\"4\" y=\"5.5\" width=\"16\" height=\"15\" rx=\"3\"/><path d=\"M8 3.5v4m8-4v4M4 10h16m-12 4h2m4 0h2m-8 3h2\"/>",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7v5l3.5 2\"/>",
  "briefcase": "<rect class=\"icon-wash\" x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"3\"/><rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"3\"/><path d=\"M8 7V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7M3 11l7 3h4l7-3m-9 1v4\"/>",
  "building": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M9 7h1m4 0h1m-6 4h1m4 0h1M10 21v-6h4v6\"/>",
  "card": "<rect class=\"icon-wash\" x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"M3 10h18M7 15h3\"/>",
  "users": "<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v1\"/>",
  "utensils": "<path d=\"M6 3v6m3-6v6M3 3v6a3 3 0 0 0 6 0M6 12v9M20 3v18m0-18a6 6 0 0 0-5 6v4h5\"/>",
  "mountain": "<path class=\"icon-wash\" d=\"m2.5 20 7-14 5 9 3-5 4 10Z\"/><path d=\"m2.5 20 7-14 5 9 3-5 4 10ZM7 11l2.5 2 2.2-2\"/>",
  "bed": "<path d=\"M3 20V7m18 13v-6H3m0-4h4a3 3 0 0 1 3 3v1m0 0V7h7a4 4 0 0 1 4 4v3M3 17h18\"/>",
  "message": "<path d=\"M7 18H4l.5-4A8.5 8.5 0 1 1 7 18Z\"/><path d=\"M8 10h8m-8 4h5\"/>",
  "bell": "<path d=\"M18 9a6 6 0 0 0-12 0v4l-2 4h16l-2-4Zm-8 11a2 2 0 0 0 4 0\"/>",
  "eye": "<path d=\"M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
  "arrow": "<path d=\"M4.5 12h15m-6-6 6 6-6 6\"/>",
  "back": "<path d=\"m14.5 5.5-6.5 6.5 6.5 6.5\"/>",
  "chevron": "<path d=\"m9.5 5.5 6.5 6.5-6.5 6.5\"/>",
  "check": "<path d=\"m5 12 4.5 4.5L19 7\"/>",
  "camera": "<path d=\"M8 6 9.5 3.5h5L16 6h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/>",
  "layers": "<path class=\"icon-wash\" d=\"m12 3-9 5 9 5 9-5Z\"/><path d=\"m12 3-9 5 9 5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5\"/>"
});
  window.icon = (name) => `<svg class="wemo-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.spark}</svg>`;
  window.renderNav = () => {
    const page = document.body.dataset.page || 'home';
    const items = ['home', 'map', 'wemo', 'atlas', 'profile'];
    return `<nav class="bottom-nav" aria-label="${WemoI18n.lang === 'ka' ? 'მთავარი ნავიგაცია' : 'Primary navigation'}">${items.map((item) => `<a href="${item === 'home' ? 'index.html' : `${item}.html`}" class="${page === item ? 'active' : ''}" ${page === item ? 'aria-current="page"' : ''} aria-label="${WemoI18n.s(item)}">${window.icon(item)}<span>${WemoI18n.s(item)}</span></a>`).join('')}</nav>`;
  };
})();
