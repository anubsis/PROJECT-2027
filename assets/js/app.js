(() => {
  const i18n = window.WemoI18n;
  const places = window.WEMO_PLACES;
  const categories = window.WEMO_CATEGORIES;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const text = (key) => i18n.s(key);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  const homePlanner = {
    date: 'today',
    customDate: '',
    city: 'tbilisi',
    intent: null
  };

  const homeCopy = {
    en: {
      title: 'Wemo — Discover Georgia', kicker: 'Your day, made simple', questionStart: 'What should we do', questionMiddle: 'in',
      intro: 'Choose a time, place, and mood. Wemo will shape a simple plan from trusted local picks.',
      ask: 'Ask Wemo for a place or plan…', food: 'Eat', fun: 'Go out', sights: 'See', stay: 'Stay',
      recommendation: 'Wemo recommends', recommendationSub: 'Curated choices for your plan', popular: 'Popular now', popularSub: 'Places people are choosing today',
      viewAll: 'View all', map: 'Open the map', mapSub: 'See what is close to your plan', mapOpen: 'Open map', nearby: '12 places around you',
      useful: 'Useful nearby', usefulSub: 'Everyday essentials, one tap away', medical: 'Pharmacy & hospital', bank: 'Bank & exchange', transport: 'Transport & fuel', wc: 'Public restroom',
      near: 'nearby', cityTitle: 'Discover everything in', citySub: 'Food, culture, sights, stays and more', cityCta: 'Open', open: 'Open now', planning: 'Planning mode', planFor: 'Your picks are tuned for', chooseDate: 'Choose a date', chooseCity: 'Choose a location', close: 'Close',
      today: 'today', tomorrow: 'tomorrow', dayAfter: 'the day after', custom: 'another date', todayOption: 'Today', tomorrowOption: 'Tomorrow', dayAfterOption: 'Day after tomorrow', customOption: 'Choose a date',
      confirm: 'Use this date', chooseOnMap: 'Choose on map', language: 'ქარ', saved: 'Saved', save: 'Save'
    },
    ka: {
      title: 'Wemo — აღმოაჩინე საქართველო', kicker: 'შენი დღე, მარტივად', questionStart: '', questionMiddle: 'რას ვაკეთებთ',
      intro: 'აირჩიე დრო, ადგილი და განწყობა — Wemo სანდო ადგილებიდან მარტივ გეგმას შეგირჩევს.',
      ask: 'ჰკითხე Wemo-ს — სად წავიდეთ?', food: 'კვება', fun: 'გართობა', sights: 'ხედები', stay: 'ღამისთევა',
      recommendation: 'Wemo-ს რჩევები', recommendationSub: 'შენთვის შერჩეული არჩევანი', popular: 'პოპულარული ახლა', popularSub: 'რას ირჩევენ სხვები დღეს',
      viewAll: 'ყველას ნახვა', map: 'აღმოაჩინე რუკაზე', mapSub: 'ნახე, რა არის შენს გეგმასთან ახლოს', mapOpen: 'რუკის გახსნა', nearby: '12 ადგილი შენ გარშემო',
      useful: 'სასარგებლო ახლოს', usefulSub: 'ყოველდღიური საჭიროებები ერთი შეხებით', medical: 'აფთიაქი და საავადმყოფო', bank: 'ბანკი და გადამცვლელი', transport: 'ტრანსპორტი და საწვავი', wc: 'საჯარო საპირფარეშო',
      near: 'ახლოს', cityTitle: 'აღმოაჩინე ყველაფერი', citySub: 'კვება, გართობა, სანახავი, განთავსება და სხვა', cityCta: 'აღმოაჩინე', open: 'ღიაა ახლა', planning: 'დაგეგმვის რეჟიმი', planFor: 'შერჩევა მორგებულია:', chooseDate: 'აირჩიე თარიღი', chooseCity: 'აირჩიე ლოკაცია', close: 'დახურვა',
      today: 'დღეს', tomorrow: 'ხვალ', dayAfter: 'ზეგ', custom: 'სხვა თარიღი', todayOption: 'დღეს', tomorrowOption: 'ხვალ', dayAfterOption: 'ზეგ', customOption: 'სხვა თარიღი',
      confirm: 'ამ თარიღის არჩევა', chooseOnMap: 'ლოკაციის არჩევა რუკაზე', language: 'EN', saved: 'შენახულია', save: 'შენახვა'
    }
  };

  const homeCities = {
    tbilisi: { en: 'Tbilisi', ka: 'თბილისში', nameEn: 'Tbilisi', nameKa: 'თბილისი' },
    batumi: { en: 'Batumi', ka: 'ბათუმში', nameEn: 'Batumi', nameKa: 'ბათუმი' },
    kutaisi: { en: 'Kutaisi', ka: 'ქუთაისში', nameEn: 'Kutaisi', nameKa: 'ქუთაისი' },
    kakheti: { en: 'Kakheti', ka: 'კახეთში', nameEn: 'Kakheti', nameKa: 'კახეთი' },
    gudauri: { en: 'Gudauri', ka: 'გუდაურში', nameEn: 'Gudauri', nameKa: 'გუდაური' }
  };

  const homeImages = {
    city: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1000&q=82',
    food: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=82',
    sea: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82',
    night: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=82',
    stay: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=82',
    activity: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=82'
  };

  const homeCityItems = {
    tbilisi: [
      homePlannerItem('tbilisi-old-town', 'sights', 'Old Tbilisi at golden hour', 'ძველი თბილისი ოქროს საათზე', 'Sololaki · Tbilisi', 'სოლოლაკი · თბილისი', homeImages.city, 4.9, true),
      homePlannerItem('tbilisi-kitchen', 'food', 'Ezo — Georgian kitchen', 'ეზო — ქართული სამზარეულო', 'Mtatsminda · Tbilisi', 'მთაწმინდა · თბილისი', homeImages.food, 4.8, true),
      homePlannerItem('tbilisi-night', 'fun', 'Courtyard jazz evening', 'ჯაზის საღამო ეზოში', 'Chugureti · Tbilisi', 'ჩუღურეთი · თბილისი', homeImages.night, 4.7, true),
      homePlannerItem('tbilisi-stay', 'stay', 'Design stay near Rustaveli', 'დიზაინ-სასტუმრო რუსთაველთან', 'Vera · Tbilisi', 'ვერა · თბილისი', homeImages.stay, 4.8, false),
      homePlannerItem('tbilisi-lake', 'sights', 'Lisi lake sunset walk', 'ლისის ტბა მზის ჩასვლისას', 'Lisi · Tbilisi', 'ლისი · თბილისი', homeImages.activity, 4.7, true)
    ],
    batumi: [
      homePlannerItem('lighthouse-beach-bar', 'food', 'Lighthouse Beach Bar', 'Lighthouse Beach Bar', 'Kvariati · Batumi', 'კვარიათი · ბათუმი', homeImages.sea, 4.9, true, 'place-pro.html?place=lighthouse-beach-bar'),
      homePlannerItem('old-town-wine-house', 'food', 'Old Town Wine House', 'ძველი ქალაქის ღვინის სახლი', 'Old Batumi', 'ძველი ბათუმი', homeImages.food, 4.8, true, 'place.html?place=old-town-wine-house'),
      homePlannerItem('boulevard-rooftop', 'fun', 'Boulevard rooftop evening', 'საღამო ბულვარის რუფტოპზე', 'Old Boulevard · Batumi', 'ძველი ბულვარი · ბათუმი', homeImages.night, 4.7, true, 'place-pro.html?place=boulevard-rooftop'),
      homePlannerItem('san-remo', 'stay', 'San Remo city stay', 'San Remo — ქალაქში დარჩენა', 'Rustaveli Ave · Batumi', 'რუსთაველის გამზირი · ბათუმი', homeImages.stay, 4.7, false, 'place-pro.html?place=san-remo'),
      homePlannerItem('kobuleti-jet-ski', 'sights', 'Kobuleti coast escape', 'ქობულეთის სანაპირო', 'Kobuleti seafront', 'ქობულეთის სანაპირო', homeImages.activity, 4.7, true, 'place.html?place=kobuleti-jet-ski')
    ],
    kutaisi: [
      homePlannerItem('kutaisi-bagrati', 'sights', 'Bagrati & old Kutaisi', 'ბაგრატი და ძველი ქუთაისი', 'Central Kutaisi', 'ქუთაისის ცენტრი', homeImages.city, 4.8, true),
      homePlannerItem('kutaisi-table', 'food', 'Imeretian family table', 'იმერული საოჯახო სუფრა', 'White Bridge · Kutaisi', 'თეთრი ხიდი · ქუთაისი', homeImages.food, 4.8, true),
      homePlannerItem('kutaisi-cave', 'sights', 'Prometheus cave day trip', 'პრომეთეს მღვიმის ტური', 'Tskaltubo', 'წყალტუბო', homeImages.activity, 4.7, true),
      homePlannerItem('kutaisi-music', 'fun', 'Riverside live music', 'ცოცხალი მუსიკა რიონის პირას', 'Rioni · Kutaisi', 'რიონი · ქუთაისი', homeImages.night, 4.6, true),
      homePlannerItem('kutaisi-stay', 'stay', 'Old house guestroom', 'ძველი სახლის საოჯახო სასტუმრო', 'Historic Kutaisi', 'ძველი ქუთაისი', homeImages.stay, 4.8, false)
    ],
    kakheti: [
      homePlannerItem('kakheti-wine', 'food', 'Family cellar tasting', 'საოჯახო მარნის დეგუსტაცია', 'Telavi · Kakheti', 'თელავი · კახეთი', homeImages.food, 4.9, true),
      homePlannerItem('kakheti-sighnaghi', 'sights', 'Sighnaghi wall walk', 'სიღნაღის გალავანზე სეირნობა', 'Sighnaghi · Kakheti', 'სიღნაღი · კახეთი', homeImages.city, 4.8, true),
      homePlannerItem('kakheti-supra', 'fun', 'Vineyard sunset supra', 'სუფრა ვენახში მზის ჩასვლისას', 'Kvareli · Kakheti', 'ყვარელი · კახეთი', homeImages.night, 4.9, true),
      homePlannerItem('kakheti-stay', 'stay', 'Wine estate guesthouse', 'მარნის საოჯახო სასტუმრო', 'Tsinandali · Kakheti', 'წინანდალი · კახეთი', homeImages.stay, 4.8, false),
      homePlannerItem('kakheti-view', 'sights', 'Alazani valley viewpoint', 'ალაზნის ველის ხედი', 'Gombori pass', 'გომბორის უღელტეხილი', homeImages.activity, 4.9, true)
    ],
    gudauri: [
      homePlannerItem('gudauri-view', 'sights', 'Caucasus panorama', 'კავკასიონის პანორამა', 'Upper Gudauri', 'ზემო გუდაური', homeImages.activity, 4.9, true),
      homePlannerItem('gudauri-table', 'food', 'Warm mountain table', 'თბილი მთის სუფრა', 'New Gudauri', 'ახალი გუდაური', homeImages.food, 4.7, true),
      homePlannerItem('gudauri-flight', 'fun', 'Paragliding over Gudauri', 'პარაგლაიდინგი გუდაურზე', 'Kobi pass', 'კობის უღელტეხილი', homeImages.city, 4.9, true),
      homePlannerItem('gudauri-stay', 'stay', 'Alpine lodge with a view', 'ალპური სასტუმრო ხედით', 'Upper Gudauri', 'ზემო გუდაური', homeImages.stay, 4.8, false),
      homePlannerItem('gudauri-night', 'fun', 'Après-ski fireside', 'საღამო ბუხართან', 'New Gudauri', 'ახალი გუდაური', homeImages.night, 4.6, true)
    ]
  };

  function homePlannerItem(id, category, en, ka, subEn, subKa, image, rating, open, href) {
    return { id, category, name: { en, ka }, sub: { en: subEn, ka: subKa }, image, rating, open, href: href || `search-results.html?q=${encodeURIComponent(en)}` };
  }

  function icon(name) {
    return window.icon(name);
  }

  function topBar(location = 'Batumi', locationControl = false) {
    const locationMarkup = locationControl
      ? `<button type="button" class="location-pill" data-planner-open="city-dialog" aria-haspopup="dialog" aria-controls="city-dialog">${icon('pin')}<span>${escapeHtml(location)}</span></button>`
      : `<div class="location-pill" aria-label="Current location">${icon('pin')}<span>${escapeHtml(location)}</span></div>`;
    return `
      <header class="topbar">
        <a class="brand" href="index.html" aria-label="Wemo home">wemo<span>.</span></a>
        ${locationMarkup}
        <div class="top-actions">
          <button type="button" class="lang-button" data-language aria-label="${i18n.lang === 'en' ? 'ქართულ ენაზე გადასვლა' : 'Switch to English'}">
            ${i18n.lang === 'en' ? 'ქარ' : 'EN'}
          </button>
        </div>
      </header>`;
  }

  function searchField(value = '') {
    return `
      <form class="search" data-search>
        <label class="sr-only" for="place-search">${text('search')}</label>
        ${icon('search')}
        <input id="place-search" name="q" value="${escapeHtml(value)}" placeholder="${text('search')}" autocomplete="off">
      </form>`;
  }

  function placeCard(place, compact = false) {
    const name = place.name[i18n.lang];
    const location = place.location[i18n.lang];
    const saved = WemoStorage.has(place.id);
    const tier = place.isPro ? 'pro' : 'basic';
    return `
      <article class="place-card ${compact ? 'place-card--compact' : ''} place-card--${tier}">
        <a class="place-card__image" href="${place.detailPage}?place=${place.id}" aria-label="${escapeHtml(name)}">
          <img src="${place.image}" alt="${escapeHtml(name)}">
          <span class="place-tier">${place.isPro ? 'Wemo Pro' : 'Basic'}</span>
        </a>
        <div class="place-card__body">
          <span class="tag">${text(place.category)}</span>
          <a href="${place.detailPage}?place=${place.id}"><h3>${escapeHtml(name)}</h3></a>
          <p class="meta">${icon('pin')}${escapeHtml(location)}</p>
          <p class="rating"><span>★</span> ${place.rating} <small>(${place.reviews}) · ${place.price}</small></p>
        </div>
        <button type="button" class="save-button ${saved ? 'saved' : ''}" data-save="${place.id}" aria-label="Save ${escapeHtml(name)}">
          ${icon('heart')}
        </button>
      </article>`;
  }

  function sectionHead(title, href, label = text('seeAll')) {
    return `<div class="section-head"><h2>${title}</h2>${href ? `<a href="${href}">${label} ${icon('arrow')}</a>` : ''}</div>`;
  }

  function homeT(key) { return homeCopy[i18n.lang][key]; }

  function homeDateLabel() {
    if (homePlanner.date !== 'custom') return homeT(homePlanner.date);
    if (!homePlanner.customDate) return homeT('custom');
    const date = new Date(`${homePlanner.customDate}T12:00:00`);
    if (i18n.lang === 'ka') {
      const months = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
      return `${date.getDate()} ${months[date.getMonth()]}`;
    }
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(date);
  }

  function homeCityName(locative = true) {
    const city = homeCities[homePlanner.city] || homeCities.tbilisi;
    return i18n.lang === 'ka' ? (locative ? city.ka : city.nameKa) : city.nameEn;
  }

  function homePlanningMode() { return homePlanner.date !== 'today' || homePlanner.city !== 'tbilisi'; }

  function homeFilteredItems() {
    const items = homeCityItems[homePlanner.city] || homeCityItems.tbilisi;
    if (!homePlanner.intent) return items;
    const matches = items.filter((place) => place.category === homePlanner.intent);
    return matches.length ? [...matches, ...items.filter((place) => place.category !== homePlanner.intent)] : items;
  }

  function homeQuestion() {
    const date = `<button type="button" class="planner-chip" data-planner-open="date-dialog" aria-haspopup="dialog" aria-controls="date-dialog">${escapeHtml(homeDateLabel())}${icon('chevron')}</button>`;
    const city = `<button type="button" class="planner-chip" data-planner-open="city-dialog" aria-haspopup="dialog" aria-controls="city-dialog">${escapeHtml(homeCityName())}${icon('chevron')}</button>`;
    return i18n.lang === 'ka' ? `${date} ${homeT('questionMiddle')} ${city}?` : `${homeT('questionStart')} ${date} ${homeT('questionMiddle')} ${city}?`;
  }

  function homePlaceCard(place, compact = false) {
    const name = place.name[i18n.lang];
    const subtitle = place.sub[i18n.lang];
    const saved = WemoStorage.has(place.id);
    return `<article class="${compact ? 'planner-place planner-place--compact' : 'planner-place planner-place--feature'}"${compact ? ' role="listitem"' : ''}>
      <img src="${place.image}" alt="${escapeHtml(name)}">
      <div class="planner-place__badges"><span>${icon('star')}${place.rating}</span>${place.open && homePlanner.date === 'today' ? `<span class="is-open">${homeT('open')}</span>` : ''}</div>
      <button type="button" class="planner-save ${saved ? 'saved' : ''}" data-save="${place.id}" aria-label="${saved ? homeT('saved') : homeT('save')} ${escapeHtml(name)}" aria-pressed="${saved}">${icon('heart')}</button>
      <a class="planner-place__content" href="${place.href}"><h3>${escapeHtml(name)}</h3><p>${icon('pin')}${escapeHtml(subtitle)}</p></a>
    </article>`;
  }

  function homeDateDialog() {
    const options = [['today', homeT('todayOption'), 'calendar'], ['tomorrow', homeT('tomorrowOption'), 'sun'], ['dayAfter', homeT('dayAfterOption'), 'spark']];
    return `<dialog class="planner-dialog" id="date-dialog" data-planner-dialog aria-labelledby="date-dialog-title">
      <div class="planner-dialog__head"><h2 id="date-dialog-title">${homeT('chooseDate')}</h2><button type="button" class="planner-dialog__close" data-planner-close aria-label="${homeT('close')}">${icon('close')}</button></div>
      <div class="planner-options">${options.map(([key, label, iconName]) => `<button type="button" class="planner-option ${homePlanner.date === key ? 'active' : ''}" data-planner-date="${key}"><span>${icon(iconName)}${label}</span><i></i></button>`).join('')}
        <button type="button" class="planner-option ${homePlanner.date === 'custom' ? 'active' : ''}" data-planner-custom><span>${icon('calendar')}${homeT('customOption')}</span><i></i></button>
      </div>
      <div class="planner-custom-date" data-planner-custom-box ${homePlanner.date === 'custom' ? '' : 'hidden'}><label>${homeT('chooseDate')}<input type="date" data-planner-date-input min="${new Date().toISOString().slice(0, 10)}" value="${homePlanner.customDate}"></label><button type="button" class="primary" data-planner-date-confirm>${homeT('confirm')}</button></div>
    </dialog>`;
  }

  function homeCityDialog() {
    return `<dialog class="planner-dialog" id="city-dialog" data-planner-dialog aria-labelledby="city-dialog-title">
      <div class="planner-dialog__head"><h2 id="city-dialog-title">${homeT('chooseCity')}</h2><button type="button" class="planner-dialog__close" data-planner-close aria-label="${homeT('close')}">${icon('close')}</button></div>
      <div class="planner-options"><a class="planner-option planner-map-option" href="map.html"><span>${icon('map')}${homeT('chooseOnMap')}</span>${icon('arrow')}</a>
        ${Object.entries(homeCities).map(([key, city]) => `<button type="button" class="planner-option ${homePlanner.city === key ? 'active' : ''}" data-planner-city="${key}"><span>${icon('pin')}${i18n.lang === 'ka' ? city.nameKa : city.nameEn}</span><i></i></button>`).join('')}
      </div>
    </dialog>`;
  }

  function home() {
    const items = homeFilteredItems();
    const recommended = items.slice(0, 3);
    const popular = [...items.slice(2), ...items.slice(0, 2)].slice(0, 3);
    const category = homePlanner.intent ? homeT(homePlanner.intent) : '';
    const cityTitle = i18n.lang === 'ka' ? `${homeT('cityTitle')} ${homeCityName()}` : `${homeT('cityTitle')} ${homeCityName(false)}`;
    const cityCta = `${homeT('cityCta')} ${homeCityName(false)}`;
    document.title = homeT('title');
    return `
      ${topBar(homeCityName(false), true)}
      <main class="page home-page planner-home">
        <section class="planner-hero">
          <p class="planner-kicker"><i></i>${homeT('kicker')}</p>
          <h1 class="planner-question">${homeQuestion()}</h1>
          <p class="planner-copy">${homeT('intro')}</p>
        </section>
        <form class="planner-search" data-search>${icon('search')}<label class="sr-only" for="planner-search">${homeT('ask')}</label><input id="planner-search" name="q" placeholder="${homeT('ask')}" autocomplete="off"><button type="submit" aria-label="${homeT('ask')}">${icon('arrow')}</button></form>
        <div class="planner-intents" aria-label="${i18n.lang === 'ka' ? 'აირჩიე განწყობა' : 'Choose a mood'}">${[['food', 'utensils'], ['fun', 'music'], ['sights', 'mountain'], ['stay', 'bed']].map(([key, iconName]) => `<button type="button" class="planner-intent ${homePlanner.intent === key ? 'active' : ''}" data-planner-intent="${key}" aria-pressed="${homePlanner.intent === key}"><span class="planner-intent__icon">${icon(iconName)}</span><span>${homeT(key)}</span><i>${icon('check')}</i></button>`).join('')}</div>
        <div class="planner-mode" ${homePlanningMode() || category ? '' : 'hidden'}>${icon('calendar')}<span><strong>${homeT('planning')}</strong> · ${escapeHtml(homeDateLabel())}, ${escapeHtml(homeCityName(false))}${category ? ` · ${escapeHtml(category)}` : ''}</span></div>
        <section class="planner-section"><div class="planner-section__head"><div><h2>${homeT('recommendation')}</h2><p>${homeT('recommendationSub')}</p></div><a href="map.html">${homeT('viewAll')}${icon('arrow')}</a></div><div class="planner-rail planner-rail--recommendations" role="list" aria-label="${homeT('recommendation')}">${recommended.map((place) => homePlaceCard(place, true)).join('')}</div></section>
        <section class="planner-city-section"><a class="planner-city-viewer" href="map.html?city=${encodeURIComponent(homePlanner.city)}" aria-label="${escapeHtml(cityTitle)}"><span class="planner-city-viewer__content"><strong>${escapeHtml(cityTitle)}</strong><small>${homeT('citySub')}</small><i>${escapeHtml(cityCta)}${icon('arrow')}</i></span><span class="planner-city-viewer__map" aria-hidden="true"><b class="city-route route-one"></b><b class="city-route route-two"></b><b class="city-route route-three"></b><em>${icon('pin')}</em></span></a></section>
        <section class="planner-section"><div class="planner-section__head"><div><h2>${homeT('popular')}</h2><p>${homeT('popularSub')}</p></div><a href="map.html">${homeT('viewAll')}${icon('arrow')}</a></div><div class="planner-rail" role="list" aria-label="${homeT('popular')}">${popular.map((place) => homePlaceCard(place, true)).join('')}</div></section>
        <section class="planner-section"><div class="planner-section__head"><div><h2>${homeT('useful')}</h2><p>${homeT('usefulSub')}</p></div></div><div class="planner-utilities">${[['medical', 'medical'], ['bank', 'bank'], ['transport', 'fuel'], ['wc', 'toilet']].map(([key, iconName]) => `<a class="planner-utility planner-utility--${key}" href="search-results.html?q=${encodeURIComponent(homeT(key))}"><span>${icon(iconName)}</span><div><strong>${homeT(key)}</strong><small>${homeT('near')}</small></div></a>`).join('')}</div></section>
      </main>
      ${homeDateDialog()}${homeCityDialog()}${renderNav()}`;
  }

  function map() {
    const en = i18n.lang === 'en';
    const mapCategories = [
      ['all', 'grid', en ? 'All' : 'ყველა'], ['restaurants', 'utensils', en ? 'Food' : 'კვება'],
      ['events', 'star', en ? 'Events' : 'გართობა'], ['activities', 'eye', en ? 'See' : 'სანახავი'],
      ['hotels', 'bed', en ? 'Stay' : 'დარჩენა']
    ];
    const priorities = [
      ['medical', 'medical', en ? 'Emergency & health' : 'სასწრაფო და ჯანმრთელობა'],
      ['bank', 'bank', en ? 'ATM & banks' : 'ბანკები და ბანკომატები'],
      ['transport', 'fuel', en ? 'Transport, fuel & charging' : 'ტრანსპორტი, საწვავი და დამუხტვა'],
      ['toilet', 'toilet', en ? 'Public facilities' : 'საზოგადოებრივი სერვისები']
    ];
    return `<main class="map-page"><section class="map-discovery" aria-label="${en ? 'Search and map categories' : 'ძიება და რუკის კატეგორიები'}"><form class="map-search" data-map-search>${icon('search')}<input name="q" placeholder="${en ? 'Search this area' : 'მოძებნე ამ არეში'}" autocomplete="off"><button type="submit" aria-label="${en ? 'Search' : 'ძიება'}">${icon('arrow')}</button></form><div class="map-categories" role="group" aria-label="${en ? 'Categories' : 'კატეგორიები'}">${mapCategories.map(([key, iconName, label], index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-map-category="${key}">${icon(iconName)}<span>${label}</span></button>`).join('')}</div></section><section class="wemo-map" aria-label="${en ? 'Interactive map of Batumi' : 'ბათუმის ინტერაქტიული რუკა'}"><div id="wemo-leaflet-map"></div><div class="map-priority-control" data-priority-control><div class="map-priority-list" data-priority-list>${priorities.map(([key, iconName, label]) => `<button type="button" data-priority="${key}" aria-label="${label}" title="${label}">${icon(iconName)}<span>${label}</span></button>`).join('')}</div><button type="button" class="map-priority-toggle" data-priority-toggle aria-expanded="false" aria-label="${en ? 'Needed priorities' : 'საჭირო სერვისები'}">${icon('medical')}</button></div><div class="map-layer-control"><div class="map-layer-menu" data-map-layer-menu hidden><button type="button" data-map-layer="places" aria-label="${en ? 'Places map' : 'ადგილების რუკა'}">${icon('map')}<span>${en ? 'Places' : 'ადგილები'}</span></button><button type="button" data-map-layer="heat" aria-label="${en ? 'Beach heatmap' : 'პლაჟის დატვირთულობა'}">${icon('sun')}<span>${en ? 'Heatmap' : 'დატვირთულობა'}</span></button></div><button type="button" class="map-layer-toggle" data-map-layers aria-expanded="false" aria-label="${en ? 'Map layers' : 'რუკის ფენები'}">${icon('layers')}</button></div><div class="map-sheet"><div class="map-sheet__handle"></div><div data-map-context></div></div></section></main>${renderNav()}`;
  }

  function profile() {
    const language = i18n.lang === 'en' ? 'English' : 'ქართული';
    const themeLabel = i18n.lang === 'en' ? 'Appearance' : 'გარეგნობა';
    const themeHint = i18n.lang === 'en' ? 'Choose light or dark' : 'აირჩიეთ ნათელი ან მუქი';
    const lightLabel = i18n.lang === 'en' ? 'Light' : 'ნათელი';
    const darkLabel = i18n.lang === 'en' ? 'Dark' : 'მუქი';
    const currentTheme = document.documentElement.dataset.theme === 'light' ? lightLabel : darkLabel;
    return `${topBar()}<main class="page utility-page"><section class="profile-head"><span class="profile-orb">W</span><div><p class="eyebrow">${i18n.lang === 'en' ? 'WEMO MEMBER' : 'WEMO წევრი'}</p><h1>${text('guest')}</h1><p>${i18n.lang === 'en' ? 'Plans, saved places and more.' : 'გეგმები, შენახული ადგილები და მეტი.'}</p></div><button type="button" class="primary" data-toast="Sign-in is a frontend placeholder">${text('join')}</button></section>${sectionHead(text('profileTitle'), null)}<div class="settings"><button type="button" class="setting" data-toast="Bookings will appear here"><span>${icon('calendar')}<b>${i18n.lang === 'en' ? 'My bookings' : 'ჩემი ჯავშნები'}</b><small>${i18n.lang === 'en' ? 'No upcoming plans' : 'მომავალი გეგმები არ არის'}</small></span>${icon('chevron')}</button><button type="button" class="setting theme-setting" data-theme-open aria-haspopup="dialog" aria-controls="theme-dialog"><span>${icon('sun')}<b>${themeLabel}</b><small>${themeHint}</small></span><span class="theme-setting__current"><small data-theme-current data-light-label="${lightLabel}" data-dark-label="${darkLabel}">${currentTheme}</small>${icon('chevron')}</span></button><button type="button" class="setting" data-language><span>${icon('globe')}<b>${i18n.lang === 'en' ? 'Language' : 'ენა'}</b><small>${language}</small></span>${icon('chevron')}</button><button type="button" class="setting" data-toast="Notifications are a frontend placeholder"><span>${icon('bell')}<b>${i18n.lang === 'en' ? 'Notifications' : 'შეტყობინებები'}</b><small>${i18n.lang === 'en' ? 'Manage preferences' : 'პარამეტრების მართვა'}</small></span>${icon('chevron')}</button><a class="setting" href="business.html"><span>${icon('briefcase')}<b>${i18n.lang === 'en' ? 'Add your business' : 'დაამატეთ ბიზნესი'}</b><small>${i18n.lang === 'en' ? 'For owners and teams' : 'მფლობელებისა და გუნდებისთვის'}</small></span>${icon('chevron')}</a></div></main><dialog class="theme-dialog" id="theme-dialog" data-theme-dialog aria-labelledby="theme-dialog-title"><div class="theme-dialog__head"><h2 id="theme-dialog-title">${themeLabel}</h2><button type="button" class="theme-dialog__close" data-theme-close aria-label="${i18n.lang === 'en' ? 'Close theme selector' : 'თემის არჩევის დახურვა'}" autofocus>${icon('close')}</button></div><div class="theme-dialog__options" role="group" aria-label="${themeLabel}"><button type="button" data-theme-option="light" aria-pressed="false">${icon('sun')}<span>${lightLabel}</span></button><button type="button" data-theme-option="dark" aria-pressed="false">${icon('moon')}<span>${darkLabel}</span></button></div></dialog>${renderNav()}`;
  }

  function business() {
    const en = i18n.lang === 'en';
    return `${topBar()}<main class="page utility-page">
      <section class="business-hero"><p class="eyebrow">${en ? 'FOR BUSINESSES' : 'ბიზნესებისთვის'}</p><h1>${en ? 'Get found by every traveller in town.' : 'გახდით ხილული ყველა მოგზაურისთვის.'}</h1><p>${en ? "If your business isn't online yet, this is the fastest way to be. Free to list, no tech skills needed." : 'თუ თქვენი ბიზნესი ჯერ ონლაინ არ არის, ეს ყველაზე სწრაფი გზაა. დარეგისტრირება უფასოა და ტექნიკური ცოდნა არ სჭირდება.'}</p></section>
      <div class="benefit-list">
        <div class="benefit">${icon('spark')}<div><b>${en ? 'Free to list' : 'უფასო რეგისტრაცია'}</b><small>${en ? 'No cost to get your business on Wemo' : 'Wemo-ზე დამატება არაფერს გიჯდებათ'}</small></div></div>
        <div class="benefit">${icon('users')}<div><b>${en ? 'Reach tourists directly' : 'პირდაპირი წვდომა ტურისტებთან'}</b><small>${en ? 'Be the place people find while planning their day' : 'გახდით ადგილი, რომელსაც დღის დაგეგმვისას პოულობენ'}</small></div></div>
        <div class="benefit">${icon('briefcase')}<div><b>${en ? 'No tech skills needed' : 'ტექნიკური ცოდნა არ სჭირდება'}</b><small>${en ? 'We can build your profile for you' : 'პროფილს თქვენთვის ჩვენ ავაწყობთ'}</small></div></div>
      </div>
      <form class="business-form" data-business-form>
        <h2>${en ? 'Tell us about your business' : 'გვიამბეთ თქვენს ბიზნესზე'}</h2>
        <div class="field"><label>${en ? 'Business name' : 'ბიზნესის სახელი'}</label><input required name="name" placeholder="${en ? 'e.g. Lighthouse Beach Bar' : 'მაგ. Lighthouse Beach Bar'}"></div>
        <div class="field-row">
          <div class="field"><label>${en ? 'Category' : 'კატეგორია'}</label><select name="category">${categories.filter((category) => category !== 'all').map((category) => `<option value="${category}">${text(category)}</option>`).join('')}</select></div>
          <div class="field"><label>${en ? 'City' : 'ქალაქი'}</label><input required name="city" placeholder="${en ? 'Batumi' : 'ბათუმი'}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>${en ? 'Phone' : 'ტელეფონი'}</label><input required type="tel" name="phone" placeholder="+995"></div>
          <div class="field"><label>Email</label><input required type="email" name="email" placeholder="you@business.ge"></div>
        </div>
        <div class="field"><label>${en ? 'About your business' : 'ბიზნესის შესახებ'}</label><textarea name="about" placeholder="${en ? 'What makes it worth a visit?' : 'რატომ ღირს ვიზიტი?'}"></textarea></div>
        <button type="submit" class="primary">${icon('check')}${en ? 'Submit for review' : 'გაგზავნა განსახილველად'}</button>
      </form>
    </main>${renderNav()}`;
  }

  function detail() {
    const pro = document.body.dataset.pro === 'true';
    const id = new URLSearchParams(location.search).get('place');
    const profilePlaces = places.filter((place) => place.isPro === pro);
    const place = profilePlaces.find((item) => item.id === id) || profilePlaces[0];
    const name = place.name[i18n.lang];
    const locationName = place.location[i18n.lang];
    return `${topBar()}<main class="place-page">
      <section class="place-hero ${pro ? 'place-hero--pro' : ''}"><img src="${place.image}" alt="${escapeHtml(name)}"><div class="place-hero__wash"></div><div class="place-actions"><button type="button" class="icon-btn" data-back aria-label="Back">${icon('back')}</button><div><button type="button" class="icon-btn" data-share data-title="${escapeHtml(name)}" aria-label="Share">${icon('share')}</button><button type="button" class="icon-btn ${WemoStorage.has(place.id) ? 'saved' : ''}" data-save="${place.id}" aria-label="Save">${icon('heart')}</button></div></div>${pro ? `<span class="pro-badge">${icon('spark')} Wemo Pro</span><button type="button" class="video-pill" data-toast="Video tour is a demo feature">${icon('play')} ${i18n.lang === 'en' ? 'Watch the vibe' : 'ვიდეო ტური'}</button>` : ''}</section>
      <section class="place-content"><div class="place-status"><span class="open-status"><i></i>${place.isOpen ? text('open') : (i18n.lang === 'en' ? 'Closed now' : 'დახურულია')}</span><span class="tag">${text(place.category)}</span></div><div class="place-title"><div><h1>${escapeHtml(name)}</h1><p>${icon('pin')}${escapeHtml(locationName)}</p></div><b>${place.price}</b></div><div class="rating-board"><div><strong>${place.rating}</strong><span>★★★★★</span><small>${place.reviews} ${i18n.lang === 'en' ? 'reviews' : 'შეფასება'}</small></div><i></i><div><strong>${place.isOpen ? '12–23' : '12–00'}</strong><small>${i18n.lang === 'en' ? 'today' : 'დღეს'}</small></div><i></i><div><strong>2 km</strong><small>${i18n.lang === 'en' ? 'from centre' : 'ცენტრიდან'}</small></div></div>
      <section class="detail-section"><h2>${i18n.lang === 'en' ? 'About' : 'შესახებ'}</h2><p>${i18n.lang === 'en' ? (pro ? 'An all-day beachfront escape for slow lunches, sunset music and the kind of evenings that carry on.' : 'A welcoming Old Batumi table for traditional Georgian dishes and small-batch wines.') : (pro ? 'პრემიუმ სანაპირო ადგილი მთელი დღის მენიუთი, მზის ჩასვლის მუსიკით და მარტივი დაჯავშნით.' : 'მყუდრო სივრცე ძველ ბათუმში ქართული კერძებითა და ღვინით.')}</p></section>
      <section class="detail-section"><h2>${i18n.lang === 'en' ? 'Good to know' : 'სასარგებლო ინფორმაცია'}</h2><div class="amenity-grid"><span>${icon('wifi')}Wi‑Fi</span><span>${icon('sun')} ${i18n.lang === 'en' ? 'Outdoor seating' : 'ღია სივრცე'}</span><span>${icon('card')} ${i18n.lang === 'en' ? 'Card payment' : 'ბარათით გადახდა'}</span><span>${icon('users')} ${i18n.lang === 'en' ? 'Groups welcome' : 'ჯგუფებისთვის'}</span>${pro ? `<span>${icon('music')} ${i18n.lang === 'en' ? 'Live music' : 'ცოცხალი მუსიკა'}</span><span>${icon('camera')} ${i18n.lang === 'en' ? 'Photo spots' : 'ფოტო ზონა'}</span>` : ''}</div></section>
      <section class="detail-section"><div class="section-head"><h2>${pro ? (i18n.lang === 'en' ? 'The atmosphere' : 'ატმოსფერო') : (i18n.lang === 'en' ? 'A few photos' : 'რამდენიმე ფოტო')}</h2></div><div class="photo-gallery"><img src="${place.image}" alt=""><img src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&q=80" alt=""><img src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=500&q=80" alt=""></div></section>
      ${pro ? proSections(place) : basicSections(place)}</section>
    </main><div class="sticky-cta"><button type="button" class="quick-action" data-share aria-label="Share">${icon('share')}</button><button type="button" class="primary" data-book="${escapeHtml(name)}">${text('book')}</button></div>`;
  }

  function basicSections(place) {
    return `<section class="detail-section"><h2>${i18n.lang === 'en' ? 'Recent reviews' : 'ბოლო შეფასებები'}</h2><article class="review"><span>M</span><div><b>Mari K.</b><small>★★★★★ · 3 ${i18n.lang === 'en' ? 'days ago' : 'დღის წინ'}</small><p>${i18n.lang === 'en' ? 'Beautiful local favourite with thoughtful service.' : 'ულამაზესი ადგილობრივი ადგილი ყურადღებიანი მომსახურებით.'}</p></div></article><a class="text-link" href="search-results.html?q=${encodeURIComponent(place.name.en)}">${i18n.lang === 'en' ? 'See similar places' : 'მსგავსი ადგილების ნახვა'} ${icon('arrow')}</a></section>`;
  }

  function proSections(place) {
    return `<section class="detail-section"><div class="owner-note"><span>${icon('spark')}</span><div><small>${i18n.lang === 'en' ? 'OWNER NOTE' : 'მფლობელის წერილი'}</small><p>${i18n.lang === 'en' ? 'Sunset reservations are recommended on Fridays and Saturdays.' : 'პარასკევსა და შაბათს მზის ჩასვლის დროისთვის დაჯავშნა რეკომენდებულია.'}</p></div></div></section><section class="detail-section"><h2>${i18n.lang === 'en' ? 'Offers & events' : 'შეთავაზებები და ივენთები'}</h2><a href="deals.html" class="offer-card"><span>20%</span><div><b>${i18n.lang === 'en' ? 'Weekday cabanas' : 'შაბათის კაბანა'}</b><small>${i18n.lang === 'en' ? 'Available through July' : 'ხელმისაწვდომია ივლისში'}</small></div>${icon('arrow')}</a><a href="events.html" class="event-mini"><span>19<br><small>JUL</small></span><div><b>${i18n.lang === 'en' ? 'Golden hour sessions' : 'ოქროს საათის სესიები'}</b><small>${i18n.lang === 'en' ? 'Every Saturday · 18:00' : 'ყოველ შაბათს · 18:00'}</small></div></a></section><section class="detail-section"><h2>${i18n.lang === 'en' ? 'Visit & contact' : 'ვიზიტი და კონტაქტი'}</h2><div class="contact-actions"><a href="tel:+995555010101">${icon('phone')}${i18n.lang === 'en' ? 'Call' : 'დარეკვა'}</a><a href="mailto:hello@wemo.ge?subject=${encodeURIComponent(place.name.en)}">${icon('message')}${i18n.lang === 'en' ? 'Message' : 'მიწერა'}</a><a href="map.html">${icon('map')}${i18n.lang === 'en' ? 'Map' : 'რუკა'}</a></div></section><section class="detail-section"><h2>FAQ</h2><details class="faq"><summary>${i18n.lang === 'en' ? 'Do you take walk-ins?' : 'იღებთ სტუმრებს დაჯავშნის გარეშე?'} ${icon('plus')}</summary><p>${i18n.lang === 'en' ? 'Yes, although sunset hours fill up quickly.' : 'დიახ, თუმცა მზის ჩასვლის საათები სწრაფად ივსება.'}</p></details><details class="faq"><summary>${i18n.lang === 'en' ? 'Do you accept cards?' : 'იღებთ ბარათით გადახდას?'} ${icon('plus')}</summary><p>${i18n.lang === 'en' ? 'All major cards and contactless payments are welcome.' : 'ყველა ძირითადი ბარათი და უკონტაქტო გადახდა მისაღებია.'}</p></details></section>`;
  }

  function collection(title, eyebrow) {
    return `${topBar()}<main class="page utility-page"><p class="eyebrow">${eyebrow}</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${i18n.lang === 'en' ? 'Fresh reasons to go out in Batumi.' : 'ახალი მიზეზები ბათუმში გასასვლელად.'}</p><section class="listing-grid">${places.slice(0, 4).map((place) => placeCard(place)).join('')}</section></main>${renderNav()}`;
  }

  function render() {
    const page = document.body.dataset.page;
    const app = $('#app');
    const output = page === 'home' ? home() : page === 'map' ? map() : page === 'wemo' ? window.WemoMvp.wemoPage({ i18n, icon, escapeHtml, topBar, renderNav }) : page === 'atlas' ? window.WemoMvp.atlasPage({ i18n, icon, escapeHtml, topBar, renderNav }) : page === 'profile' ? profile() : page === 'place' ? detail() : page === 'business' ? business() : page === 'search' ? collection(i18n.lang === 'en' ? 'Search results' : 'ძიების შედეგები', i18n.lang === 'en' ? 'SEARCH' : 'ძიება') : page === 'events' ? collection(text('events'), 'WHAT’S ON') : collection(i18n.lang === 'en' ? 'Local deals' : 'შეთავაზებები', 'WEMO WEEKEND');
    app.innerHTML = output;
    bind();
    if (page === 'map') initializeMap();
    if (page === 'search') refreshSearch();
  }

  let activeMapLayer = 'places';
  let activeMapPlace = 'old-town-wine-house';
  let activeMapCategory = 'all';
  let activePriority = null;
  let wemoLeafletMap;
  let wemoMapLayers = [];

  const batumiBounds = [[41.625, 41.595], [41.675, 41.675]];
  const georgiaCoastBounds = [[41.42, 40.68], [43.6, 42.28]];

  function mapPlaces() {
    return (window.WEMO_BATUMI_MAP_PLACES || []).map((entry) => ({
      ...places.find((place) => place.id === entry.id), coordinates: entry.coordinates
    })).filter((place) => place.id && (activeMapCategory === 'all' || place.category === activeMapCategory));
  }

  function clearMapLayers() {
    wemoMapLayers.forEach((layer) => layer.remove());
    wemoMapLayers = [];
  }

  function mapContext() {
    const target = $('[data-map-context]');
    if (!target) return;
    const en = i18n.lang === 'en';
    if (activeMapLayer === 'heat') {
      target.innerHTML = `<div class="heat-context"><div><span class="map-context__eyebrow">${en ? 'BEACH HEATMAP' : 'პლაჟის დატვირთულობა'}</span><h2>${en ? 'Batumi shore, right now' : 'ბათუმის სანაპირო ახლა'}</h2><p>${en ? 'A smooth shoreline view of beach activity.' : 'სანაპიროს აქტივობის გლუვი ხედვა.'}</p></div><div class="heat-legend" aria-label="${en ? 'Crowd level legend' : 'დატვირთულობის ლეგენდა'}"><span>${en ? 'Quiet' : 'მშვიდი'}</span><i></i><span>${en ? 'Busy' : 'დატვირთული'}</span></div></div>`;
      return;
    }
    const place = mapPlaces().find((item) => item.id === activeMapPlace) || mapPlaces()[0];
    if (!place) return;
    target.innerHTML = `<a class="map-place-card" href="${place.detailPage}?place=${place.id}"><img src="${place.image}" alt="${escapeHtml(place.name[i18n.lang])}"><div><span class="tag">${text(place.category)}</span><h2>${escapeHtml(place.name[i18n.lang])}</h2><p>${place.rating} ★ · ${escapeHtml(place.location[i18n.lang])}</p></div>${icon('arrow')}</a>`;
  }

  function setMapLayer(layer) {
    activeMapLayer = layer;
    clearMapLayers();
    if (layer === 'heat') renderBeachHeatmap(); else renderPlacesMap();
    mapContext();
    $$('[data-map-layer]').forEach((button) => button.classList.toggle('active', button.dataset.mapLayer === layer));
  }

  function renderPlacesMap() {
    wemoLeafletMap.setMaxZoom(18);
    wemoLeafletMap.fitBounds(batumiBounds, { padding: [28, 28] });
    const placeLayer = window.L.layerGroup().addTo(wemoLeafletMap);
    mapPlaces().forEach((place) => {
      const marker = window.L.marker(place.coordinates, { icon: window.L.divIcon({ className: 'wemo-place-marker-wrap', html: `<button class="wemo-place-marker ${place.id === activeMapPlace ? 'active' : ''}" aria-label="${escapeHtml(place.name[i18n.lang])}"></button>`, iconSize: [34, 42], iconAnchor: [17, 42] }) }).addTo(placeLayer);
      marker.on('click', () => { activeMapPlace = place.id; renderPlacesMap(); mapContext(); });
    });
    wemoMapLayers.push(placeLayer);
    if (activePriority) {
      const priorityIcons = { medical: 'medical', bank: 'bank', transport: 'fuel', toilet: 'toilet' };
      const priorityPoints = {
        medical: [[41.6497, 41.6358], [41.6439, 41.6218]], bank: [[41.6515, 41.6388], [41.6472, 41.6296]],
        transport: [[41.6554, 41.6428], [41.6388, 41.6119]], toilet: [[41.6531, 41.6324], [41.6462, 41.6251]]
      };
      const utilityLayer = window.L.layerGroup().addTo(wemoLeafletMap);
      (priorityPoints[activePriority] || []).forEach((coordinates) => window.L.marker(coordinates, { icon: window.L.divIcon({ className: 'wemo-utility-marker-wrap', html: `<span class="wemo-utility-marker">${icon(priorityIcons[activePriority])}</span>`, iconSize: [38, 38], iconAnchor: [19, 19] }) }).addTo(utilityLayer));
      wemoMapLayers.push(utilityLayer);
    }
  }

  function interpolateCoastline(points, steps = 8) {
    const output = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const before = points[Math.max(0, index - 1)];
      const start = points[index];
      const end = points[index + 1];
      const after = points[Math.min(points.length - 1, index + 2)];
      for (let step = 0; step < steps; step += 1) {
        const t = step / steps; const t2 = t * t; const t3 = t2 * t;
        const latitude = 0.5 * ((2 * start[0]) + (-before[0] + end[0]) * t + (2 * before[0] - 5 * start[0] + 4 * end[0] - after[0]) * t2 + (-before[0] + 3 * start[0] - 3 * end[0] + after[0]) * t3);
        const longitude = 0.5 * ((2 * start[1]) + (-before[1] + end[1]) * t + (2 * before[1] - 5 * start[1] + 4 * end[1] - after[1]) * t2 + (-before[1] + 3 * start[1] - 3 * end[1] + after[1]) * t3);
        output.push([latitude, longitude]);
      }
    }
    return [...output, points[points.length - 1]];
  }

  function renderBeachHeatmap() {
    const zones = window.WEMO_COAST_HEAT_ZONES || [];
    const tierIntensity = { low: 0.45, medium: 0.66, high: 0.9 };
    const coastlines = zones.map((zone) => interpolateCoastline(zone.shape));
    const heatPoints = coastlines.flatMap((coast, zoneIndex) => coast.flatMap(([lat, lng], index) => {
      const intensity = tierIntensity[zones[zoneIndex].tier] * (0.75 + (Math.sin(index * 0.51) + 1) * 0.13);
      return [[lat, lng, intensity], [lat + 0.0012, lng - 0.0018, intensity * 0.72], [lat - 0.001, lng + 0.0012, intensity * 0.58]];
    }));
    const heatLayer = window.L.heatLayer(heatPoints, { radius: 34, blur: 27, maxZoom: 15, minOpacity: 0.34, gradient: { 0.2: '#0d3b4f', 0.45: '#4fd1a5', 0.7: '#ffb648', 1: '#ff3b3b' } }).addTo(wemoLeafletMap);
    const shorelines = window.L.layerGroup(coastlines.map((coast) => window.L.polyline(coast, { color: '#e8c468', weight: 2, opacity: 0.72, dashArray: '2 8' }))).addTo(wemoLeafletMap);
    const batumiCoast = coastlines[0];
    const sensorPoint = batumiCoast[Math.floor(batumiCoast.length * 0.55)];
    const sensor = window.L.marker(sensorPoint, { icon: window.L.divIcon({ className: 'wemo-heat-sensor-wrap', html: '<span class="wemo-heat-sensor"></span>', iconSize: [24, 24], iconAnchor: [12, 12] }) }).addTo(wemoLeafletMap);
    wemoMapLayers.push(heatLayer, shorelines, sensor);
    wemoLeafletMap.setMaxZoom(16);
    wemoLeafletMap.fitBounds(georgiaCoastBounds, { padding: [32, 32] });
  }

  function initializeMap() {
    const mapElement = $('#wemo-leaflet-map');
    if (!mapElement || !window.L) {
      $('[data-map-context]').innerHTML = `<p class="map-error">${i18n.lang === 'en' ? 'The map needs an internet connection to load.' : 'რუკის ჩასატვირთად საჭიროა ინტერნეტთან კავშირი.'}</p>`;
      return;
    }
    if (wemoLeafletMap) wemoLeafletMap.remove();
    wemoLeafletMap = window.L.map(mapElement, { zoomControl: false, attributionControl: false, zoomSnap: 0.25 });
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(wemoLeafletMap);
    window.L.control.zoom({ position: 'bottomright' }).addTo(wemoLeafletMap);
    setMapLayer(activeMapLayer);
    wemoLeafletMap.on('click', () => {
      const control = $('[data-priority-control]');
      if (activePriority && control) {
        control.classList.remove('open');
        control.classList.add('compact');
        $('[data-priority-toggle]')?.setAttribute('aria-expanded', 'false');
        $$('[data-priority]').forEach((button) => button.classList.remove('revealed'));
      }
      const layerMenu = $('[data-map-layer-menu]');
      if (layerMenu) layerMenu.hidden = true;
      $('[data-map-layers]')?.setAttribute('aria-expanded', 'false');
    });
    requestAnimationFrame(() => wemoLeafletMap.invalidateSize());
  }

  function refreshSearch() {
    const query = (new URLSearchParams(location.search).get('q') || '').trim().toLowerCase();
    const matches = places.filter((place) => !query || [place.name.en, place.name.ka, place.category, place.location.en, place.location.ka].join(' ').toLowerCase().includes(query));
    $('.page-subtitle').textContent = query ? `“${query}”` : (i18n.lang === 'en' ? 'Try a place, category or neighbourhood.' : 'მოძებნეთ ადგილი, კატეგორია ან უბანი.');
    $('.listing-grid').innerHTML = matches.length ? matches.map((place) => placeCard(place)).join('') : `<div class="empty"><h2>${i18n.lang === 'en' ? 'No results found' : 'შედეგი ვერ მოიძებნა'}</h2><p>${i18n.lang === 'en' ? 'Try another search term.' : 'სცადეთ სხვა საძიებო სიტყვა.'}</p></div>`;
  }

  function toast(message) {
    const notice = document.createElement('div'); notice.className = 'toast'; notice.textContent = message; document.body.append(notice); setTimeout(() => notice.remove(), 2600);
  }

  function booking(name) {
    const modal = document.createElement('div'); modal.className = 'modal';
    modal.innerHTML = `<form class="modal-box" data-book-form><button type="button" class="modal-close" data-close aria-label="Close">${icon('close')}</button><p class="eyebrow">${i18n.lang === 'en' ? 'BOOKING REQUEST' : 'დაჯავშნის მოთხოვნა'}</p><h2>${escapeHtml(name)}</h2><div class="form-grid"><label>Date<input required type="date"></label><label>Time<input required type="time"></label><label>${i18n.lang === 'en' ? 'People' : 'სტუმრები'}<input required type="number" min="1" value="2"></label><label>${i18n.lang === 'en' ? 'Name' : 'სახელი'}<input required></label></div><button class="primary">${i18n.lang === 'en' ? 'Save demo request' : 'დემო მოთხოვნის შენახვა'}</button></form>`;
    document.body.append(modal);
    modal.addEventListener('click', (event) => { if (event.target === modal || event.target.closest('[data-close]')) modal.remove(); });
    $('[data-book-form]', modal).addEventListener('submit', (event) => { event.preventDefault(); const requests = JSON.parse(localStorage.getItem('wemo-booking-requests') || '[]'); requests.push({ name, date: Date.now() }); localStorage.setItem('wemo-booking-requests', JSON.stringify(requests)); modal.remove(); toast(text('requestSaved')); });
  }

  function bind() {
    window.WemoTheme?.bind();
    $$('[data-planner-open]').forEach((button) => button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.plannerOpen);
      if (typeof dialog?.showModal === 'function') dialog.showModal();
      else dialog?.setAttribute('open', '');
    }));
    $$('[data-planner-dialog]').forEach((dialog) => dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }));
    $$('[data-planner-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
    $$('[data-planner-date]').forEach((button) => button.addEventListener('click', () => {
      homePlanner.date = button.dataset.plannerDate;
      homePlanner.customDate = '';
      button.closest('dialog')?.close();
      render();
    }));
    $('[data-planner-custom]')?.addEventListener('click', () => {
      $('[data-planner-custom-box]').hidden = false;
      $('[data-planner-date-input]')?.focus();
    });
    $('[data-planner-date-confirm]')?.addEventListener('click', () => {
      const input = $('[data-planner-date-input]');
      if (!input?.value) { input?.focus(); return; }
      homePlanner.date = 'custom';
      homePlanner.customDate = input.value;
      input.closest('dialog')?.close();
      render();
    });
    $$('[data-planner-city]').forEach((button) => button.addEventListener('click', () => {
      homePlanner.city = button.dataset.plannerCity;
      button.closest('dialog')?.close();
      render();
    }));
    $$('[data-planner-intent]').forEach((button) => button.addEventListener('click', () => {
      homePlanner.intent = homePlanner.intent === button.dataset.plannerIntent ? null : button.dataset.plannerIntent;
      render();
    }));
    $$('[data-save]').forEach((button) => button.addEventListener('click', () => { WemoStorage.toggle(button.dataset.save); render(); }));
    window.WemoMvp?.bind(document.body.dataset.page, { render, toast });
    $$('[data-language]').forEach((button) => button.addEventListener('click', () => { i18n.lang = i18n.lang === 'en' ? 'ka' : 'en'; document.documentElement.lang = i18n.lang; document.body.className = `lang-${i18n.lang}`; render(); }));
    $$('[data-toast]').forEach((button) => button.addEventListener('click', () => toast(button.dataset.toast)));
    $('[data-search]')?.addEventListener('submit', (event) => { event.preventDefault(); location.href = `search-results.html?q=${encodeURIComponent(new FormData(event.currentTarget).get('q').trim())}`; });
    $('[data-map-search]')?.addEventListener('submit', (event) => { event.preventDefault(); const query = new FormData(event.currentTarget).get('q').trim(); if (query) location.href = `search-results.html?q=${encodeURIComponent(query)}`; });
    $$('[data-map-category]').forEach((button) => button.addEventListener('click', () => {
      activeMapCategory = button.dataset.mapCategory;
      $$('[data-map-category]').forEach((item) => item.classList.toggle('active', item === button));
      setMapLayer('places');
    }));
    $('[data-priority-toggle]')?.addEventListener('click', (event) => {
      const control = $('[data-priority-control]');
      const open = !control.classList.contains('open');
      control.classList.toggle('open', open);
      control.classList.remove('compact');
      event.currentTarget.setAttribute('aria-expanded', String(open));
    });
    $$('[data-priority]').forEach((button) => button.addEventListener('click', () => {
      activePriority = button.dataset.priority;
      $$('[data-priority]').forEach((item) => { item.classList.toggle('selected', item === button); item.classList.toggle('revealed', item === button); });
      if (activeMapLayer !== 'places') setMapLayer('places'); else { clearMapLayers(); renderPlacesMap(); }
    }));
    $('[data-map-layers]')?.addEventListener('click', (event) => {
      const menu = $('[data-map-layer-menu]');
      const open = menu.hidden;
      menu.hidden = !open;
      event.currentTarget.setAttribute('aria-expanded', String(open));
    });
    $$('[data-map-layer]').forEach((button) => button.addEventListener('click', () => {
      $('[data-map-layer-menu]').hidden = true;
      $('[data-map-layers]').setAttribute('aria-expanded', 'false');
      setMapLayer(button.dataset.mapLayer);
    }));
    $('[data-back]')?.addEventListener('click', () => { history.length > 1 ? history.back() : location.assign('index.html'); });
    $$('[data-share]').forEach((button) => button.addEventListener('click', async () => { try { if (navigator.share) await navigator.share({ title: button.dataset.title || document.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast(i18n.lang === 'en' ? 'Link copied' : 'ბმული დაკოპირდა'); } } catch { toast(i18n.lang === 'en' ? 'Share cancelled' : 'გაზიარება გაუქმდა'); } }));
    $('[data-book]')?.addEventListener('click', (event) => booking(event.currentTarget.dataset.book));
    $('[data-business-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      const leads = JSON.parse(localStorage.getItem('wemo-business-leads') || '[]');
      leads.push({ ...data, date: Date.now() });
      localStorage.setItem('wemo-business-leads', JSON.stringify(leads));
      const en = i18n.lang === 'en';
      $('#app main').innerHTML = `<div class="business-success">${icon('check')}<h2>${en ? "You're on the list" : 'თქვენ დამატებული ხართ'}</h2><p>${en ? "We'll reach out to get your profile live. Usually within a couple of days." : 'მალე დაგიკავშირდებით პროფილის გასააქტიურებლად, ჩვეულებრივ რამდენიმე დღეში.'}</p><a class="primary" href="index.html">${en ? 'Back to Wemo' : 'დაბრუნება Wemo-ზე'}</a></div>`;
    });
  }

  document.documentElement.lang = i18n.lang;
  document.body.className = `lang-${i18n.lang}`;
  render();
})();
