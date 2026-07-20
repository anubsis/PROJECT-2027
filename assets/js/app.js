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

  function icon(name) {
    return window.icon(name);
  }

  function topBar() {
    return `
      <header class="topbar">
        <a class="brand" href="index.html" aria-label="Wemo home">wemo<span>.</span></a>
        <div class="location-pill" aria-label="Current location">
          ${icon('pin')}<span>Batumi</span>
        </div>
        <div class="top-actions">
          <button type="button" class="lang-button" data-language aria-label="Change language">
            ${i18n.lang === 'en' ? 'ქარ' : 'EN'}
          </button>
          <button type="button" class="icon-btn" data-toast="Notifications are a demo feature" aria-label="Notifications">
            ${icon('bell')}
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

  function categoryStrip(active = 'all') {
    return `
      <div class="category-strip">
        ${categories.slice(0, 6).map((category) => `
          <a class="category-tile ${category === active ? 'active' : ''}" href="explore.html?category=${category}">
            <span>${icon(category === 'beach-clubs' ? 'sun' : category === 'restaurants' ? 'utensils' : 'spark')}</span>
            ${text(category)}
          </a>`).join('')}
      </div>`;
  }

  function sectionHead(title, href, label = text('seeAll')) {
    return `<div class="section-head"><h2>${title}</h2>${href ? `<a href="${href}">${label} ${icon('arrow')}</a>` : ''}</div>`;
  }

  function home() {
    const pro = places.filter((place) => place.isPro).slice(0, 2);
    const nearby = places.filter((place) => place.isOpen).slice(1, 4);
    return `
      ${topBar()}
      <main class="page home-page">
        <section class="city-hero">
          <img src="https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=85" alt="Batumi skyline at dusk">
          <div class="city-hero__wash"></div>
          <div class="city-hero__content">
            <p class="eyebrow"><i></i>${i18n.lang === 'en' ? 'LIVE IN BATUMI' : 'ბათუმი ახლა'}</p>
            <h1>${i18n.lang === 'en' ? 'A better way to<br>feel <em>Georgia.</em>' : 'აღმოაჩინე<br><em>საქართველო.</em>'}</h1>
            <p>${i18n.lang === 'en' ? 'Local tables, sunlit shores and plans worth making.' : 'საყვარელი ადგილები, სანაპირო და ახალი შთაბეჭდილებები.'}</p>
            <a class="hero-link" href="explore.html">${i18n.lang === 'en' ? 'Explore nearby' : 'აღმოაჩინე ახლოს'} ${icon('arrow')}</a>
          </div>
          <div class="city-hero__stats"><strong>24</strong><span>${i18n.lang === 'en' ? 'places open now' : 'ადგილი ღიაა'}</span></div>
        </section>
        ${searchField()}
        ${categoryStrip()}
        ${sectionHead(text('popular'), 'explore.html')}
        <div class="listing-grid">${places.slice(0, 3).map((place) => placeCard(place)).join('')}</div>
        ${sectionHead(i18n.lang === 'en' ? 'Wemo Pro picks' : 'Wemo Pro არჩევანი', 'explore.html')}
        <section class="editorial-row">${pro.map((place) => `
          <a class="editorial-card" href="${place.detailPage}?place=${place.id}">
            <img src="${place.image}" alt="${escapeHtml(place.name[i18n.lang])}">
            <div><span>Wemo Pro</span><h3>${escapeHtml(place.name[i18n.lang])}</h3><p>${place.rating} ★ · ${place.location[i18n.lang]}</p></div>
          </a>`).join('')}</section>
        ${sectionHead(i18n.lang === 'en' ? 'This weekend' : 'ამ შაბათ-კვირას', 'events.html')}
        <a href="events.html" class="event-feature">
          <span class="event-date"><b>19</b> JUL</span>
          <span><small>${i18n.lang === 'en' ? 'SUNSET SERIES' : 'მზის ჩასვლის სერია'}</small><strong>${i18n.lang === 'en' ? 'Music by the sea' : 'მუსიკა ზღვასთან'}</strong><em>${i18n.lang === 'en' ? 'See event' : 'ივენთის ნახვა'} ${icon('arrow')}</em></span>
        </a>
        <a href="deals.html" class="deal-feature">
          <small>${i18n.lang === 'en' ? 'WEMO WEEKEND' : 'WEMO შაბათ-კვირა'}</small>
          <h2>${i18n.lang === 'en' ? '20% off<br>beach beds.' : '20% ფასდაკლება<br>შეზლონგებზე.'}</h2>
          <p>${i18n.lang === 'en' ? 'At selected Batumi beach clubs.' : 'ბათუმის შერჩეულ ბიჩ კლუბებში.'}</p>
          <span>${i18n.lang === 'en' ? 'See all deals' : 'შეთავაზებების ნახვა'} ${icon('arrow')}</span>
        </a>
        <a href="business.html" class="business-banner">${icon('briefcase')}<div><b>${i18n.lang === 'en' ? 'Own a business?' : 'გაქვთ ბიზნესი?'}</b><small>${i18n.lang === 'en' ? 'Get listed on Wemo — free' : 'დაემატეთ Wemo-ს — უფასოდ'}</small></div>${icon('arrow')}</a>
      </main>
      ${renderNav()}`;
  }

  function chips(active) {
    return `<div class="chips">${categories.map((category) => `<button type="button" class="chip ${category === active ? 'active' : ''}" data-category="${category}">${text(category)}</button>`).join('')}</div>`;
  }

  function explore() {
    const category = new URLSearchParams(location.search).get('category') || 'all';
    return `${topBar()}<main class="page utility-page">
      <p class="eyebrow">${i18n.lang === 'en' ? 'DISCOVER' : 'აღმოაჩინე'}</p><h1 class="page-title">${text('exploreTitle')}</h1>
      <p class="page-subtitle">${i18n.lang === 'en' ? 'Thoughtful places, one good plan at a time.' : 'ადგილები, რომლებიც კარგ დღეს ქმნის.'}</p>
      ${searchField()}${chips(categories.includes(category) ? category : 'all')}
      <div class="filter-row"><button type="button" class="filter-button" data-open>${icon('clock')}${text('open')}</button><button type="button" class="filter-button" data-sort>${icon('sort')}${i18n.lang === 'en' ? 'Top rated' : 'რეიტინგით'}</button></div>
      ${sectionHead(`<span data-result-title>${text(category)}</span>`, null)}<span class="result-count" data-result-count></span><div class="listing-grid" data-listings></div>
    </main>${renderNav()}`;
  }

  function saved() {
    return `${topBar()}<main class="page utility-page"><p class="eyebrow">${i18n.lang === 'en' ? 'YOUR LIST' : 'თქვენი სია'}</p><h1 class="page-title">${text('saved')}</h1><p class="page-subtitle">${i18n.lang === 'en' ? 'Keep every good idea close.' : 'შეინახეთ ყველა კარგი იდეა.'}</p><div class="listing-grid" data-saved-list></div></main>${renderNav()}`;
  }

  function mapChips(active) {
    return `<div class="chips">${categories.map((category) => `<button type="button" class="chip ${category === active ? 'active' : ''}" data-map-category="${category}">${text(category)}</button>`).join('')}</div>`;
  }

  function map() {
    return `${topBar()}<main class="page utility-page map-page"><p class="eyebrow">BATUMI</p><h1 class="page-title">${text('mapTitle')}</h1><p class="page-subtitle">${i18n.lang === 'en' ? 'A small map for a good day out.' : 'პატარა რუკა კარგი დღისთვის.'}</p>${mapChips('all')}<section class="map-canvas" aria-label="Map of Batumi"><span class="map-label" style="left:34px;top:120px">Old Batumi</span><span class="map-label" style="left:150px;top:214px">Boulevard</span><span class="map-label" style="right:40px;top:80px">Seafront</span>${places.slice(0, 4).map((place, index) => `<button type="button" class="marker" style="left:${22 + index * 17}%;top:${38 + (index % 2) * 19}%" data-marker="${index}" aria-label="${escapeHtml(place.name.en)}"></button>`).join('')}<div class="map-controls"><button type="button" data-toast="Location is a demo feature" aria-label="Find my location">${icon('target')}</button><button type="button" data-marker-next aria-label="Next place">${icon('arrow')}</button></div><div class="map-sheet"><div class="map-sheet__handle"></div><div class="map-sheet__list" data-map-preview></div></div></section></main>${renderNav()}`;
  }

  function profile() {
    const language = i18n.lang === 'en' ? 'English' : 'ქართული';
    return `${topBar()}<main class="page utility-page"><section class="profile-head"><span class="profile-orb">W</span><div><p class="eyebrow">${i18n.lang === 'en' ? 'WEMO MEMBER' : 'WEMO წევრი'}</p><h1>${text('guest')}</h1><p>${i18n.lang === 'en' ? 'Plans, saved places and more.' : 'გეგმები, შენახული ადგილები და მეტი.'}</p></div><button type="button" class="primary" data-toast="Sign-in is a frontend placeholder">${text('join')}</button></section>${sectionHead(text('profileTitle'), null)}<div class="settings"><button type="button" class="setting" data-toast="Bookings will appear here"><span>${icon('calendar')}<b>${i18n.lang === 'en' ? 'My bookings' : 'ჩემი ჯავშნები'}</b><small>${i18n.lang === 'en' ? 'No upcoming plans' : 'მომავალი გეგმები არ არის'}</small></span>${icon('chevron')}</button><button type="button" class="setting" data-language><span>${icon('globe')}<b>${i18n.lang === 'en' ? 'Language' : 'ენა'}</b><small>${language}</small></span>${icon('chevron')}</button><button type="button" class="setting" data-toast="Notifications are a frontend placeholder"><span>${icon('bell')}<b>${i18n.lang === 'en' ? 'Notifications' : 'შეტყობინებები'}</b><small>${i18n.lang === 'en' ? 'Manage preferences' : 'პარამეტრების მართვა'}</small></span>${icon('chevron')}</button><a class="setting" href="business.html"><span>${icon('briefcase')}<b>${i18n.lang === 'en' ? 'Add your business' : 'დაამატეთ ბიზნესი'}</b><small>${i18n.lang === 'en' ? 'For owners and teams' : 'მფლობელებისა და გუნდებისთვის'}</small></span>${icon('chevron')}</a></div></main>${renderNav()}`;
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
    return `<section class="detail-section"><h2>${i18n.lang === 'en' ? 'Recent reviews' : 'ბოლო შეფასებები'}</h2><article class="review"><span>M</span><div><b>Mari K.</b><small>★★★★★ · 3 ${i18n.lang === 'en' ? 'days ago' : 'დღის წინ'}</small><p>${i18n.lang === 'en' ? 'Beautiful local favourite with thoughtful service.' : 'ულამაზესი ადგილობრივი ადგილი ყურადღებიანი მომსახურებით.'}</p></div></article><a class="text-link" href="search-results.html?q=${encodeURIComponent(place.name.en)}">${i18n.lang === 'en' ? 'Explore similar places' : 'მსგავსი ადგილების ნახვა'} ${icon('arrow')}</a></section>`;
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
    const output = page === 'home' ? home() : page === 'explore' ? explore() : page === 'saved' ? saved() : page === 'map' ? map() : page === 'profile' ? profile() : page === 'place' ? detail() : page === 'business' ? business() : page === 'search' ? collection(i18n.lang === 'en' ? 'Search results' : 'ძიების შედეგები', i18n.lang === 'en' ? 'SEARCH' : 'ძიება') : page === 'events' ? collection(text('events'), 'WHAT’S ON') : collection(i18n.lang === 'en' ? 'Local deals' : 'შეთავაზებები', 'WEMO WEEKEND');
    app.innerHTML = output;
    bind();
    if (page === 'explore') refreshExplore();
    if (page === 'saved') refreshSaved();
    if (page === 'map') refreshMap();
    if (page === 'search') refreshSearch();
  }

  function refreshExplore() {
    const active = $('.chip.active')?.dataset.category || 'all';
    const open = $('[data-open]')?.classList.contains('active');
    const sorted = $('[data-sort]')?.classList.contains('active');
    const list = places.filter((place) => (active === 'all' || place.category === active) && (!open || place.isOpen));
    if (sorted) list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    $('[data-listings]').innerHTML = list.length ? list.map((place) => placeCard(place)).join('') : `<div class="empty"><h2>${i18n.lang === 'en' ? 'No places match these filters.' : 'ამ ფილტრებს ადგილი არ ემთხვევა.'}</h2></div>`;
    $('[data-result-count]').textContent = `${list.length} ${i18n.lang === 'en' ? 'places' : 'ადგილი'}`;
  }

  function refreshSaved() {
    const list = places.filter((place) => WemoStorage.has(place.id));
    $('[data-saved-list]').innerHTML = list.length ? list.map((place) => placeCard(place)).join('') : `<section class="empty"><h2>${text('savedEmpty')}</h2><p>${text('savedEmptyText')}</p><a class="primary" href="explore.html">${text('explore')}</a></section>`;
  }

  let mapIndex = 0;
  let mapCategory = 'all';
  function refreshMap() {
    const preview = $('[data-map-preview]');
    if (!preview) return;
    const filtered = places.filter((place) => mapCategory === 'all' || place.category === mapCategory);
    const list = filtered.length ? filtered : places;
    if (!list.includes(places[mapIndex])) mapIndex = places.indexOf(list[0]);
    preview.innerHTML = list.map((place) => `
      <button type="button" class="map-sheet__card ${place.id === places[mapIndex]?.id ? 'active' : ''}" data-marker="${places.indexOf(place)}">
        <img src="${place.image}" alt="">
        <div><span class="tag">${text(place.category)}</span><h3>${escapeHtml(place.name[i18n.lang])}</h3><p>${place.rating} ★ · ${place.location[i18n.lang]}</p></div>
      </button>`).join('');
    $$('.marker').forEach((marker, index) => marker.classList.toggle('active', index === mapIndex));
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
    $$('[data-save]').forEach((button) => button.addEventListener('click', () => { WemoStorage.toggle(button.dataset.save); render(); }));
    $$('[data-language]').forEach((button) => button.addEventListener('click', () => { i18n.lang = i18n.lang === 'en' ? 'ka' : 'en'; document.documentElement.lang = i18n.lang; document.body.className = `lang-${i18n.lang}`; render(); }));
    $$('[data-toast]').forEach((button) => button.addEventListener('click', () => toast(button.dataset.toast)));
    $('[data-search]')?.addEventListener('submit', (event) => { event.preventDefault(); location.href = `search-results.html?q=${encodeURIComponent(new FormData(event.currentTarget).get('q').trim())}`; });
    $$('[data-category]').forEach((button) => button.addEventListener('click', () => { $$('[data-category]').forEach((chip) => chip.classList.remove('active')); button.classList.add('active'); refreshExplore(); }));
    $('[data-open]')?.addEventListener('click', (event) => { event.currentTarget.classList.toggle('active'); refreshExplore(); });
    $('[data-sort]')?.addEventListener('click', (event) => { event.currentTarget.classList.toggle('active'); refreshExplore(); });
    $('[data-marker-next]')?.addEventListener('click', () => { mapIndex = (mapIndex + 1) % places.length; refreshMap(); $(`[data-marker="${mapIndex}"].map-sheet__card`)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }); });
    $$('[data-marker]').forEach((button) => button.addEventListener('click', () => { mapIndex = Number(button.dataset.marker); refreshMap(); }));
    $$('[data-map-category]').forEach((button) => button.addEventListener('click', () => { $$('[data-map-category]').forEach((chip) => chip.classList.remove('active')); button.classList.add('active'); mapCategory = button.dataset.mapCategory; refreshMap(); }));
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
