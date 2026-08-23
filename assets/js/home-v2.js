(() => {
  const app = document.querySelector('#app');
  if (!app) return;

  const state = {
    date: 'today',
    customDate: '',
    city: 'tbilisi',
    intent: null
  };

  const copy = {
    en: {
      title: 'Wemo — Discover Georgia', kicker: 'Your day, made simple', questionStart: 'What should we do', questionMiddle: 'in',
      intro: 'Choose a time, place, and mood. Wemo will shape a simple plan from trusted local picks.',
      ask: 'Ask Wemo for a place or plan…', food: 'Eat', fun: 'Go out', sights: 'See', stay: 'Stay',
      recommendation: 'Wemo recommends', recommendationSub: 'One strong pick for your plan', popular: 'Popular now', popularSub: 'Places people are choosing today',
      viewAll: 'View all', map: 'Explore the map', mapSub: 'See what is close to your plan', mapOpen: 'Open map', nearby: '12 places around you',
      useful: 'Useful nearby', usefulSub: 'Everyday essentials, one tap away', medical: 'Pharmacy & hospital', bank: 'Bank & exchange', transport: 'Transport & fuel', wc: 'Public restroom',
      near: 'nearby', open: 'Open now', planning: 'Planning mode', planFor: 'Your picks are tuned for', chooseDate: 'Choose a date', chooseCity: 'Choose a location', close: 'Close',
      today: 'today', tomorrow: 'tomorrow', dayAfter: 'the day after', custom: 'another date', todayOption: 'Today', tomorrowOption: 'Tomorrow', dayAfterOption: 'Day after tomorrow', customOption: 'Choose a date',
      confirm: 'Use this date', chooseOnMap: 'Choose on map', language: 'ქარ', saved: 'Saved', save: 'Save'
    },
    ka: {
      title: 'Wemo — აღმოაჩინე საქართველო', kicker: 'შენი დღე, მარტივად', questionStart: '', questionMiddle: 'რას ვაკეთებთ',
      intro: 'აირჩიე დრო, ადგილი და განწყობა — Wemo სანდო ადგილებიდან მარტივ გეგმას შეგირჩევს.',
      ask: 'ჰკითხე Wemo-ს — სად წავიდეთ?', food: 'კვება', fun: 'გართობა', sights: 'ხედები', stay: 'ღამისთევა',
      recommendation: 'Wemo-ს რჩევა', recommendationSub: 'ერთი კარგი არჩევანი შენი გეგმისთვის', popular: 'პოპულარული ახლა', popularSub: 'რას ირჩევენ სხვები დღეს',
      viewAll: 'ყველას ნახვა', map: 'აღმოაჩინე რუკაზე', mapSub: 'ნახე, რა არის შენს გეგმასთან ახლოს', mapOpen: 'რუკის გახსნა', nearby: '12 ადგილი შენ გარშემო',
      useful: 'სასარგებლო ახლოს', usefulSub: 'ყოველდღიური საჭიროებები ერთი შეხებით', medical: 'აფთიაქი და საავადმყოფო', bank: 'ბანკი და გადამცვლელი', transport: 'ტრანსპორტი და საწვავი', wc: 'საჯარო საპირფარეშო',
      near: 'ახლოს', open: 'ღიაა ახლა', planning: 'დაგეგმვის რეჟიმი', planFor: 'შერჩევა მორგებულია:', chooseDate: 'აირჩიე თარიღი', chooseCity: 'აირჩიე ლოკაცია', close: 'დახურვა',
      today: 'დღეს', tomorrow: 'ხვალ', dayAfter: 'ზეგ', custom: 'სხვა თარიღი', todayOption: 'დღეს', tomorrowOption: 'ხვალ', dayAfterOption: 'ზეგ', customOption: 'სხვა თარიღი',
      confirm: 'ამ თარიღის არჩევა', chooseOnMap: 'ლოკაციის არჩევა რუკაზე', language: 'EN', saved: 'შენახულია', save: 'შენახვა'
    }
  };

  const cities = {
    tbilisi: { en: 'Tbilisi', ka: 'თბილისში', nameEn: 'Tbilisi', nameKa: 'თბილისი' },
    batumi: { en: 'Batumi', ka: 'ბათუმში', nameEn: 'Batumi', nameKa: 'ბათუმი' },
    kutaisi: { en: 'Kutaisi', ka: 'ქუთაისში', nameEn: 'Kutaisi', nameKa: 'ქუთაისი' },
    kakheti: { en: 'Kakheti', ka: 'კახეთში', nameEn: 'Kakheti', nameKa: 'კახეთი' },
    gudauri: { en: 'Gudauri', ka: 'გუდაურში', nameEn: 'Gudauri', nameKa: 'გუდაური' }
  };

  const images = {
    city: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1000&q=82',
    food: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=82',
    sea: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82',
    night: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=82',
    stay: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=82',
    activity: 'https://images.unsplash.com/photo-1532727965015-2e7aefc6a307?auto=format&fit=crop&w=900&q=82'
  };

  const cityItems = {
    tbilisi: [
      item('tbilisi-old-town', 'sights', 'Old Tbilisi at golden hour', 'ძველი თბილისი ოქროს საათზე', 'Sololaki · Tbilisi', 'სოლოლაკი · თბილისი', images.city, 4.9, true),
      item('tbilisi-kitchen', 'food', 'Ezo — Georgian kitchen', 'ეზო — ქართული სამზარეულო', 'Mtatsminda · Tbilisi', 'მთაწმინდა · თბილისი', images.food, 4.8, true),
      item('tbilisi-night', 'fun', 'Courtyard jazz evening', 'ჯაზის საღამო ეზოში', 'Chugureti · Tbilisi', 'ჩუღურეთი · თბილისი', images.night, 4.7, true),
      item('tbilisi-stay', 'stay', 'Design stay near Rustaveli', 'დიზაინ-სასტუმრო რუსთაველთან', 'Vera · Tbilisi', 'ვერა · თბილისი', images.stay, 4.8, false),
      item('tbilisi-lake', 'sights', 'Lisi lake sunset walk', 'ლისის ტბა მზის ჩასვლისას', 'Lisi · Tbilisi', 'ლისი · თბილისი', images.activity, 4.7, true)
    ],
    batumi: [
      item('lighthouse-beach-bar', 'food', 'Lighthouse Beach Bar', 'Lighthouse Beach Bar', 'Kvariati · Batumi', 'კვარიათი · ბათუმი', images.sea, 4.9, true, 'place-pro.html?place=lighthouse-beach-bar'),
      item('old-town-wine-house', 'food', 'Old Town Wine House', 'ძველი ქალაქის ღვინის სახლი', 'Old Batumi', 'ძველი ბათუმი', images.food, 4.8, true, 'place.html?place=old-town-wine-house'),
      item('boulevard-rooftop', 'fun', 'Boulevard rooftop evening', 'საღამო ბულვარის რუფტოპზე', 'Old Boulevard · Batumi', 'ძველი ბულვარი · ბათუმი', images.night, 4.7, true, 'place-pro.html?place=boulevard-rooftop'),
      item('san-remo', 'stay', 'San Remo city stay', 'San Remo — ქალაქში დარჩენა', 'Rustaveli Ave · Batumi', 'რუსთაველის გამზირი · ბათუმი', images.stay, 4.7, false, 'place-pro.html?place=san-remo'),
      item('kobuleti-jet-ski', 'sights', 'Kobuleti coast escape', 'ქობულეთის სანაპირო', 'Kobuleti seafront', 'ქობულეთის სანაპირო', images.activity, 4.7, true, 'place.html?place=kobuleti-jet-ski')
    ],
    kutaisi: [
      item('kutaisi-bagrati', 'sights', 'Bagrati & old Kutaisi', 'ბაგრატი და ძველი ქუთაისი', 'Central Kutaisi', 'ქუთაისის ცენტრი', images.city, 4.8, true),
      item('kutaisi-table', 'food', 'Imeretian family table', 'იმერული საოჯახო სუფრა', 'White Bridge · Kutaisi', 'თეთრი ხიდი · ქუთაისი', images.food, 4.8, true),
      item('kutaisi-cave', 'sights', 'Prometheus cave day trip', 'პრომეთეს მღვიმის ტური', 'Tskaltubo', 'წყალტუბო', images.activity, 4.7, true),
      item('kutaisi-music', 'fun', 'Riverside live music', 'ცოცხალი მუსიკა რიონის პირას', 'Rioni · Kutaisi', 'რიონი · ქუთაისი', images.night, 4.6, true),
      item('kutaisi-stay', 'stay', 'Old house guestroom', 'ძველი სახლის საოჯახო სასტუმრო', 'Historic Kutaisi', 'ძველი ქუთაისი', images.stay, 4.8, false)
    ],
    kakheti: [
      item('kakheti-wine', 'food', 'Family cellar tasting', 'საოჯახო მარნის დეგუსტაცია', 'Telavi · Kakheti', 'თელავი · კახეთი', images.food, 4.9, true),
      item('kakheti-sighnaghi', 'sights', 'Sighnaghi wall walk', 'სიღნაღის გალავანზე სეირნობა', 'Sighnaghi · Kakheti', 'სიღნაღი · კახეთი', images.city, 4.8, true),
      item('kakheti-supra', 'fun', 'Vineyard sunset supra', 'სუფრა ვენახში მზის ჩასვლისას', 'Kvareli · Kakheti', 'ყვარელი · კახეთი', images.night, 4.9, true),
      item('kakheti-stay', 'stay', 'Wine estate guesthouse', 'მარნის საოჯახო სასტუმრო', 'Tsinandali · Kakheti', 'წინანდალი · კახეთი', images.stay, 4.8, false),
      item('kakheti-view', 'sights', 'Alazani valley viewpoint', 'ალაზნის ველის ხედი', 'Gombori pass', 'გომბორის უღელტეხილი', images.activity, 4.9, true)
    ],
    gudauri: [
      item('gudauri-view', 'sights', 'Caucasus panorama', 'კავკასიონის პანორამა', 'Upper Gudauri', 'ზემო გუდაური', images.activity, 4.9, true),
      item('gudauri-table', 'food', 'Warm mountain table', 'თბილი მთის სუფრა', 'New Gudauri', 'ახალი გუდაური', images.food, 4.7, true),
      item('gudauri-flight', 'fun', 'Paragliding over Gudauri', 'პარაგლაიდინგი გუდაურზე', 'Kobi pass', 'კობის უღელტეხილი', images.city, 4.9, true),
      item('gudauri-stay', 'stay', 'Alpine lodge with a view', 'ალპური სასტუმრო ხედით', 'Upper Gudauri', 'ზემო გუდაური', images.stay, 4.8, false),
      item('gudauri-night', 'fun', 'Après-ski fireside', 'საღამო ბუხართან', 'New Gudauri', 'ახალი გუდაური', images.night, 4.6, true)
    ]
  };

  function item(id, category, en, ka, subEn, subKa, image, rating, open, href) {
    return { id, category, name: { en, ka }, sub: { en: subEn, ka: subKa }, image, rating, open, href: href || `search-results.html?q=${encodeURIComponent(en)}` };
  }

  function lang() { return WemoI18n.lang === 'ka' ? 'ka' : 'en'; }
  function t(key) { return copy[lang()][key]; }
  function icon(name) { return window.icon(name); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }

  function dateLabel() {
    if (state.date !== 'custom') return t(state.date);
    if (!state.customDate) return t('custom');
    const date = new Date(`${state.customDate}T12:00:00`);
    if (lang() === 'ka') {
      const months = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
      return `${date.getDate()} ${months[date.getMonth()]}`;
    }
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(date);
  }

  function cityName() { return cities[state.city][lang()]; }
  function cityPlainName() { return lang() === 'ka' ? cities[state.city].nameKa : cities[state.city].nameEn; }
  function planningMode() { return state.date !== 'today' || state.city !== 'tbilisi'; }

  function filteredItems() {
    const items = cityItems[state.city] || cityItems.tbilisi;
    if (!state.intent) return items;
    const matches = items.filter((place) => place.category === state.intent);
    return matches.length ? [...matches, ...items.filter((place) => place.category !== state.intent)] : items;
  }

  function questionMarkup() {
    if (lang() === 'ka') {
      return `<button type="button" class="planner-chip" data-open-dialog="date-dialog">${escapeHtml(dateLabel())}${icon('chevron')}</button> ${t('questionMiddle')} <button type="button" class="planner-chip" data-open-dialog="city-dialog">${escapeHtml(cityName())}${icon('chevron')}</button>?`;
    }
    return `${t('questionStart')} <button type="button" class="planner-chip" data-open-dialog="date-dialog">${escapeHtml(dateLabel())}${icon('chevron')}</button> ${t('questionMiddle')} <button type="button" class="planner-chip" data-open-dialog="city-dialog">${escapeHtml(cityName())}${icon('chevron')}</button>?`;
  }

  function placeCard(place, compact = false) {
    const saved = WemoStorage.has(place.id);
    const title = place.name[lang()];
    const subtitle = place.sub[lang()];
    return `<article class="${compact ? 'compact-place' : 'feature-place'}">
      <img src="${place.image}" alt="${escapeHtml(title)}">
      ${compact ? `<span class="compact-rating">★ ${place.rating}</span>` : `<div class="feature-place__badges"><span class="place-badge rating">${icon('star')} ${place.rating}</span>${place.open && state.date === 'today' ? `<span class="place-badge open">${t('open')}</span>` : ''}</div>`}
      <button type="button" class="place-save ${saved ? 'saved' : ''}" data-save-home="${place.id}" aria-label="${saved ? t('saved') : t('save')} ${escapeHtml(title)}" aria-pressed="${saved}">${icon('heart')}</button>
      <a class="${compact ? 'compact-place__content' : 'feature-place__content'}" href="${place.href}"><h3>${escapeHtml(title)}</h3><p>${icon('pin')}${escapeHtml(subtitle)}</p></a>
    </article>`;
  }

  function dateDialog() {
    const options = [
      ['today', t('todayOption'), 'calendar'], ['tomorrow', t('tomorrowOption'), 'sun'], ['dayAfter', t('dayAfterOption'), 'spark']
    ];
    return `<dialog class="planner-dialog" id="date-dialog" aria-labelledby="date-dialog-title">
      <div class="planner-dialog__head"><h2 id="date-dialog-title">${t('chooseDate')}</h2><button type="button" class="dialog-close" data-close-dialog aria-label="${t('close')}">${icon('close')}</button></div>
      <div class="planner-options">${options.map(([key, label, iconName]) => `<button type="button" class="planner-option ${state.date === key ? 'active' : ''}" data-date="${key}"><span class="planner-option__label">${icon(iconName)}${label}</span><span class="option-check"></span></button>`).join('')}
        <button type="button" class="planner-option ${state.date === 'custom' ? 'active' : ''}" data-show-custom><span class="planner-option__label">${icon('calendar')}${t('customOption')}</span><span class="option-check"></span></button>
      </div>
      <div class="custom-date" data-custom-date ${state.date === 'custom' ? '' : 'hidden'}><label>${t('chooseDate')}<input type="date" data-date-input min="${new Date().toISOString().slice(0, 10)}" value="${state.customDate}"></label><button type="button" class="dialog-confirm" data-confirm-date>${t('confirm')}</button></div>
    </dialog>`;
  }

  function cityDialog() {
    return `<dialog class="planner-dialog" id="city-dialog" aria-labelledby="city-dialog-title">
      <div class="planner-dialog__head"><h2 id="city-dialog-title">${t('chooseCity')}</h2><button type="button" class="dialog-close" data-close-dialog aria-label="${t('close')}">${icon('close')}</button></div>
      <div class="planner-options">
        <a class="planner-option city-map-option" href="map.html"><span class="planner-option__label">${icon('map')}${t('chooseOnMap')}</span>${icon('arrow')}</a>
        ${Object.entries(cities).map(([key, city]) => `<button type="button" class="planner-option ${state.city === key ? 'active' : ''}" data-city="${key}"><span class="planner-option__label">${icon('pin')}${lang() === 'ka' ? city.nameKa : city.nameEn}</span><span class="option-check"></span></button>`).join('')}
      </div>
    </dialog>`;
  }

  function render() {
    const items = filteredItems();
    const featured = items[0];
    const popular = items.slice(1, 4).length === 3 ? items.slice(1, 4) : [...items.slice(1), featured].slice(0, 3);
    const categoryName = state.intent ? t(state.intent) : '';
    document.documentElement.lang = lang();
    document.title = t('title');
    document.body.className = `${lang() === 'ka' ? 'lang-ka' : 'lang-en'} home-v2-body`;
    app.innerHTML = `<div class="home-v2">
      <header class="wemo-header"><a class="wemo-wordmark" href="index.html" aria-label="Wemo home">wemo<span>.</span></a><button type="button" class="language-switch" data-language-home aria-label="${lang() === 'ka' ? 'Switch to English' : 'ქართულ ენაზე გადასვლა'}">${icon('globe')}<span>${t('language')}</span></button></header>
      <main>
        <section class="planner-hero"><p class="planner-kicker"><i></i>${t('kicker')}</p><h1 class="planner-question">${questionMarkup()}</h1><p class="planner-copy">${t('intro')}</p></section>
        <form class="ask-wemo" data-home-search>${icon('search')}<label class="sr-only" for="home-plan-search">${t('ask')}</label><input id="home-plan-search" name="q" placeholder="${t('ask')}" autocomplete="off"><button class="ask-submit" aria-label="${t('ask')}">${icon('arrow')}</button></form>
        <div class="intent-grid" aria-label="${lang() === 'ka' ? 'აირჩიე განწყობა' : 'Choose a mood'}">${[['food','utensils'],['fun','music'],['sights','mountain'],['stay','bed']].map(([key, iconName]) => `<button type="button" class="intent-card ${state.intent === key ? 'active' : ''}" data-intent="${key}" aria-pressed="${state.intent === key}"><span class="intent-card__icon">${icon(iconName)}</span><span>${t(key)}</span><span class="intent-card__check">${icon('check')}</span></button>`).join('')}</div>
        <div class="planning-note" ${planningMode() ? '' : 'hidden'}>${icon('calendar')}<span><strong>${t('planning')}.</strong> ${t('planFor')} ${escapeHtml(dateLabel())}, ${escapeHtml(cityPlainName())}${categoryName ? ` · ${categoryName}` : ''}</span></div>
        <section class="home-section"><div class="home-section__head"><div><h2>${t('recommendation')}</h2><p>${t('recommendationSub')}</p></div><a href="explore.html">${t('viewAll')}${icon('arrow')}</a></div>${placeCard(featured)}</section>
        <section class="home-section"><div class="home-section__head"><div><h2>${t('popular')}</h2><p>${t('popularSub')}</p></div><a href="explore.html">${t('viewAll')}${icon('arrow')}</a></div><div class="places-rail">${popular.map((place) => placeCard(place, true)).join('')}</div></section>
        <section class="home-section"><div class="home-section__head"><div><h2>${t('map')}</h2><p>${t('mapSub')}</p></div></div><a class="map-preview" href="map.html" aria-label="${t('mapOpen')}"><span class="map-preview__grid"></span><span class="map-preview__road"></span><span class="map-pin one">${icon('pin')}</span><span class="map-pin two">${icon('pin')}</span><span class="map-pin three">${icon('pin')}</span><span class="map-preview__info">${t('nearby')}</span><span class="map-preview__cta">${icon('map')}${t('mapOpen')}</span></a></section>
        <section class="home-section"><div class="home-section__head"><div><h2>${t('useful')}</h2><p>${t('usefulSub')}</p></div></div><div class="utility-grid">${[['medical','medical','medical'],['bank','bank','bank'],['transport','fuel','transport'],['wc','toilet','wc']].map(([className, iconName, key]) => `<a class="utility-card ${className}" href="search-results.html?q=${encodeURIComponent(t(key))}"><span class="utility-card__icon">${icon(iconName)}</span><span><strong>${t(key)}</strong><small>${t('near')}</small></span></a>`).join('')}</div></section>
      </main>
      ${dateDialog()}${cityDialog()}${renderNav()}
    </div>`;
    bind();
  }

  function bind() {
    document.querySelector('[data-language-home]')?.addEventListener('click', () => {
      WemoI18n.lang = lang() === 'en' ? 'ka' : 'en';
      render();
    });

    document.querySelector('[data-home-search]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = event.currentTarget.querySelector('input').value.trim();
      location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    });

    document.querySelectorAll('[data-open-dialog]').forEach((button) => button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      dialog?.showModal();
    }));

    document.querySelectorAll('.planner-dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    });
    document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));

    document.querySelectorAll('[data-date]').forEach((button) => button.addEventListener('click', () => {
      state.date = button.dataset.date;
      state.customDate = '';
      button.closest('dialog')?.close();
      render();
    }));

    document.querySelector('[data-show-custom]')?.addEventListener('click', () => {
      const container = document.querySelector('[data-custom-date]');
      container.hidden = false;
      document.querySelector('[data-date-input]')?.focus();
    });

    document.querySelector('[data-confirm-date]')?.addEventListener('click', () => {
      const input = document.querySelector('[data-date-input]');
      if (!input?.value) { input?.focus(); return; }
      state.date = 'custom';
      state.customDate = input.value;
      input.closest('dialog')?.close();
      render();
    });

    document.querySelectorAll('[data-city]').forEach((button) => button.addEventListener('click', () => {
      state.city = button.dataset.city;
      button.closest('dialog')?.close();
      render();
    }));

    document.querySelectorAll('[data-intent]').forEach((button) => button.addEventListener('click', () => {
      state.intent = state.intent === button.dataset.intent ? null : button.dataset.intent;
      render();
    }));

    document.querySelectorAll('[data-save-home]').forEach((button) => button.addEventListener('click', () => {
      const saved = WemoStorage.toggle(button.dataset.saveHome);
      button.classList.toggle('saved', saved);
      button.setAttribute('aria-pressed', String(saved));
    }));
  }

  render();
})();
