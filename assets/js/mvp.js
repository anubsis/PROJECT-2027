(() => {
  const KEY = 'wemo-atlas-mvp-v1';

  const copy = {
    en: {
      country: 'Georgia', eyebrow: 'WEMO AI', title: 'What should we plan?', guide: 'Your local guide',
      intro: 'Ask for a day, a route, a meal or a complete trip. This preview plans with trusted local knowledge.',
      placeholder: 'Ask Wemo anything.', send: 'Send message', save: 'Save to Atlas', saved: 'Saved in Atlas',
      thinking: 'Wemo prepared a simple starting point',
      prompts: { day: 'Plan one day in Batumi', food: 'Where should I eat in Tbilisi?', nature: 'Find nature near me', tonight: 'What is happening tonight?' },
      atlasEyebrow: 'YOUR TRAVEL MEMORY', atlasTitle: 'Atlas', atlasSub: 'Trips, bookings and every idea Wemo keeps with you.',
      featured: 'NEXT TRIP', openTrip: 'Open trip', days: 'days', budget: 'Budget', ready: 'ready',
      filters: { all: 'All', trips: 'Trips', bookings: 'Bookings', places: 'Places', history: 'History' },
      trips: 'Trips', tripsSub: 'Multi-day plans built with Wemo', bookings: 'AI bookings', bookingsSub: 'Your reservations in one calm view',
      places: 'Saved ideas', placesSub: 'Places and suggestions worth keeping', history: 'Wemo history', historySub: 'Ideas stay here even when you do not save them',
      resume: 'Continue chat', confirmed: 'Confirmed', pending: 'Pending', planned: 'Planned', savedPlace: 'Saved place',
      emptyPlaces: 'Save a Wemo suggestion or tap a heart anywhere to see it here.'
    },
    ka: {}
  };

  Object.assign(copy.en,{atlasAdded:'Saved to Atlas',atlasRemoved:'Removed from Atlas'});
  Object.assign(copy.ka,{"country":"საქართველო","eyebrow":"WEMO AI","title":"რას დავგეგმავთ?","guide":"შენი ადგილობრივი მეგზური","intro":"მკითხე დღის, მარშრუტის, კვების ან სრული მოგზაურობის შესახებ. ეს დემო სანდო ადგილობრივი ცოდნით გეგმავს.","placeholder":"ჰკითხე Wemo-ს ყველაფერი…","send":"შეტყობინების გაგზავნა","save":"ატლასში შენახვა","saved":"ატლასშია","thinking":"Wemo-მ მარტივი საწყისი გეგმა მოამზადა","prompts":{"day":"დამიგეგმე ერთი დღე ბათუმში","food":"სად ვჭამო დღეს თბილისში?","nature":"მირჩიე ბუნება ჩემთან ახლოს","tonight":"რა ხდება ამ საღამოს?"},"atlasEyebrow":"შენი მოგზაურობის მეხსიერება","atlasTitle":"ატლასი","atlasSub":"მოგზაურობები, ჯავშნები და ყველა იდეა, რომელსაც Wemo შენთან ინახავს.","featured":"შემდეგი მოგზაურობა","openTrip":"გეგმის გახსნა","days":"დღე","budget":"ბიუჯეტი","ready":"მზადაა","filters":{"all":"ყველა","trips":"გეგმები","bookings":"ჯავშნები","places":"ადგილები","history":"ისტორია"},"trips":"მოგზაურობები","tripsSub":"Wemo-სთან ერთად შექმნილი მრავალდღიანი გეგმები","bookings":"AI ჯავშნები","bookingsSub":"ყველა დაჯავშნა ერთ მშვიდ ხედში","places":"შენახული იდეები","placesSub":"ადგილები და რჩევები, რომელთა დამახსოვრებაც ღირს","history":"Wemo-ს ისტორია","historySub":"იდეები აქ რჩება, მაშინაც კი თუ არ შეგინახავს","resume":"ჩატის გაგრძელება","confirmed":"დადასტურებული","pending":"მოლოდინში","planned":"დაგეგმილი","savedPlace":"შენახული ადგილი","emptyPlaces":"შეინახე Wemo-ს რჩევა ან დააჭირე გულს ნებისმიერ ადგილას.","disclaimer":"ინტერაქტიული frontend MVP · გეგმები და ჯავშნები სიმულირებულია","atlasAdded":"ატლასში შენახულია","atlasRemoved":"ატლასიდან წაიშალა"});
  const kaByEn={"One easy day in Batumi":"ერთი მარტივი დღე ბათუმში","Start by the old city, slow down at the sea and finish with sunset food.":"დაიწყე ძველ ქალაქში, შეანელე ზღვის პირას და დღე მზის ჩასვლის ვახშმით დაასრულე.","Old Batumi coffee":"ყავა ძველ ბათუმში","Boulevard bicycle loop":"ველოსეირნობა ბულვარზე","Kvariati sunset table":"ვახშამი კვარიათში","From ₾145 per person":"₾145-დან ერთ ადამიანზე","A thoughtful Tbilisi table":"კარგად შერჩეული თბილისური სუფრა","A neighbourhood-first food route: bakery, modern Georgian lunch and a small wine bar.":"უბნებზე აწყობილი კვების გზა: საცხობი, თანამედროვე ქართული სადილი და პატარა ღვინის ბარი.","Morning bakery in Chugureti":"დილის საცხობი ჩუღურეთში","Lunch near Dry Bridge":"სადილი მშრალ ხიდთან","Sololaki wine bar":"სოლოლაკის ღვინის ბარი","Around ₾110 per person":"დაახლოებით ₾110 ერთ ადამიანზე","A quiet nature reset":"მშვიდი დღე ბუნებაში","A low-stress route with an easy trail, a local lunch and time for the view.":"მარტივი მარშრუტი მსუბუქი ბილიკით, ადგილობრივი სადილით და ხედისთვის საკმარისი დროით.","Easy forest trail":"მსუბუქი ტყის ბილიკი","Village lunch stop":"სადილი სოფელში","Golden-hour viewpoint":"ხედი ოქროს საათზე","From ₾90 plus transport":"₾90-დან, ტრანსპორტის გარეშე","Tonight, without rushing":"ეს საღამო, აუჩქარებლად","A warm dinner, live music and one late stop selected by distance.":"თბილი ვახშამი, ცოცხალი მუსიკა და ერთი გვიანი გაჩერება მანძილის მიხედვით.","Early local dinner":"ადრეული ადგილობრივი ვახშამი","Courtyard live set":"ცოცხალი მუსიკა ეზოში","Late dessert nearby":"გვიანი დესერტი ახლოს","Around ₾85 per person":"დაახლოებით ₾85 ერთ ადამიანზე","A first plan for your request":"შენი მოთხოვნის პირველი გეგმა","This MVP prepared a balanced starting point. Refine dates, people and budget in your next message.":"MVP-მ დაბალანსებული საწყისი გეგმა მოამზადა. შემდეგ შეტყობინებაში დააზუსტე თარიღები, ადამიანების რაოდენობა და ბიუჯეტი.","Confirm location and timing":"ლოკაციისა და დროის დაზუსტება","Build a simple route":"მარტივი მარშრუტის აწყობა","Save the best options":"საუკეთესო ვარიანტების შენახვა","Budget split available in the next step":"შემდეგ ეტაპზე ბიუჯეტის გაყოფაც შეიძლება","A relaxed first evening in Tbilisi":"მშვიდი პირველი საღამო თბილისში","Nature close to Kutaisi":"ბუნება ქუთაისთან ახლოს","Old Tbilisi slow afternoon":"ძველი თბილისის მშვიდი შუადღე","Sulphur baths · Sololaki · dinner":"გოგირდის აბანოები · სოლოლაკი · ვახშამი","Small cellar near Telavi":"პატარა მარანი თელავთან","Family tasting · advance call advised":"საოჯახო დეგუსტაცია · წინასწარი ზარი სასურველია","Kakheti harvest route":"კახეთის რთველის მარშრუტი","Tbilisi → Telavi → Sighnaghi":"თბილისი → თელავი → სიღნაღი","12–15 September":"12–15 სექტემბერი","Batumi coast weekend":"ბათუმის სანაპირო — უიქენდი","Old town · coast · botanical garden":"ძველი ქალაქი · სანაპირო · ბოტანიკური ბაღი","4–5 October":"4–5 ოქტომბერი","Telavi design stay":"დიზაინ-სასტუმრო თელავში","13 Sep · 2 guests":"13 სექტ · 2 სტუმარი","Vineyard dinner":"ვახშამი ვენახში","14 Sep · 19:30":"14 სექტ · 19:30","Private route transfer":"პირადი ტრანსფერი მარშრუტზე","12 Sep · Tbilisi pickup":"12 სექტ · თბილისიდან"};

  const localized = (value, lang) => value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] || value.en || '') : value;
  const uid = (prefix) => prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);

  function responseFor(key, custom) {
    const responses = {
      day: {
        title: { en: 'One easy day in Batumi' },
        summary: { en: 'Start by the old city, slow down at the sea and finish with sunset food.' },
        stops: [{ en: 'Old Batumi coffee' }, { en: 'Boulevard bicycle loop' }, { en: 'Kvariati sunset table' }],
        budget: { en: 'From ?145 per person' }
      },
      food: {
        title: { en: 'A thoughtful Tbilisi table' },
        summary: { en: 'A neighbourhood-first food route: bakery, modern Georgian lunch and a small wine bar.' },
        stops: [{ en: 'Morning bakery in Chugureti' }, { en: 'Lunch near Dry Bridge' }, { en: 'Sololaki wine bar' }],
        budget: { en: 'Around ?110 per person' }
      },
      nature: {
        title: { en: 'A quiet nature reset' },
        summary: { en: 'A low-stress route with an easy trail, a local lunch and time for the view.' },
        stops: [{ en: 'Easy forest trail' }, { en: 'Village lunch stop' }, { en: 'Golden-hour viewpoint' }],
        budget: { en: 'From ?90 plus transport' }
      },
      tonight: {
        title: { en: 'Tonight, without rushing' },
        summary: { en: 'A warm dinner, live music and one late stop selected by distance.' },
        stops: [{ en: 'Early local dinner' }, { en: 'Courtyard live set' }, { en: 'Late dessert nearby' }],
        budget: { en: 'Around ?85 per person' }
      }
    };
    if (key !== 'custom') return responses[key] || responses.day;
    return {
      title: { en: 'A first plan for your request' },
      summary: { en: 'This MVP prepared a balanced starting point. Refine dates, people and budget in your next message.' },
      stops: [{ en: 'Confirm location and timing' }, { en: 'Build a simple route' }, { en: 'Save the best options' }],
      budget: { en: 'Budget split available in the next step' },
      request: custom || ''
    };
  }

  function seed() {
    return {
      conversations: [
        { id: 'history-tbilisi', demo: true, createdAt: 1723305600000, prompt: { en: 'A relaxed first evening in Tbilisi' }, response: responseFor('tonight'), saved: false },
        { id: 'history-nature', demo: true, createdAt: 1723219200000, prompt: { en: 'Nature close to Kutaisi' }, response: responseFor('nature'), saved: false }
      ],
      suggestions: [
        { id: 'suggestion-sulphur', title: { en: 'Old Tbilisi slow afternoon' }, sub: { en: 'Sulphur baths · Sololaki · dinner' }, icon: 'pin' },
        { id: 'suggestion-wine', title: { en: 'Small cellar near Telavi' }, sub: { en: 'Family tasting · advance call advised' }, icon: 'utensils' }
      ],
      trips: [
        {
          id: 'trip-kakheti', title: { en: 'Kakheti harvest route' },
          sub: { en: 'Tbilisi  Telavi  Sighnaghi' }, days: 4, budget: '?1,240', progress: 72,
          dates: { en: '12-15 September' },
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=82'
        },
        {
          id: 'trip-batumi', title: { en: 'Batumi coast weekend' },
          sub: { en: 'Old town · coast · botanical garden' }, days: 2, budget: '?620', progress: 46,
          dates: { en: '4-5 October' },
          image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=900&q=82'
        }
      ],
      bookings: [
        { id: 'booking-stay', icon: 'bed', title: { en: 'Telavi design stay' }, meta: { en: '13 Sep · 2 guests' }, status: 'confirmed' },
        { id: 'booking-table', icon: 'utensils', title: { en: 'Vineyard dinner' }, meta: { en: '14 Sep · 19:30' }, status: 'pending' },
        { id: 'booking-driver', icon: 'map', title: { en: 'Private route transfer' }, meta: { en: '12 Sep · Tbilisi pickup' }, status: 'planned' }
      ]
    };
  }

  function getState() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));
      if (stored && Array.isArray(stored.conversations) && Array.isArray(stored.trips)) return stored;
    } catch {}
    const fresh = seed();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }

  function setState(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function addConversation(key, customText) {
    const state = getState();
    const prompt = key === 'custom' ? { en: customText, ka: customText } : { en: copy.en.prompts[key], ka: copy.ka.prompts[key] };
    const conversation = { id: uid('chat'), demo: false, createdAt: Date.now(), prompt, response: responseFor(key, customText), saved: false };
    state.conversations.push(conversation);
    setState(state);
    sessionStorage.setItem('wemo-active-chat', conversation.id);
    return conversation;
  }

  function toggleConversation(id) {
    const state = getState();
    const item = state.conversations.find((entry) => entry.id === id);
    if (item) item.saved = !item.saved;
    setState(state);
    return Boolean(item && item.saved);
  }

  function conversationCard(item, ctx) {
    const lang = ctx.i18n.lang;
    const c = copy[lang];
    const response = item.response;
    return [
      '<article class="ai-exchange" data-conversation="', ctx.escapeHtml(item.id), '">',
        '<div class="ai-message ai-message--user">', ctx.escapeHtml(localized(item.prompt, lang)), '</div>',
        '<div class="ai-message ai-message--wemo">',
          '<span class="ai-avatar" aria-hidden="true"><i></i></span>',
          '<div class="ai-answer"><small>', c.thinking, '</small><h2>', ctx.escapeHtml(localized(response.title, lang)), '</h2>',
          '<p>', ctx.escapeHtml(localized(response.summary, lang)), '</p>',
          '<ol>', response.stops.map((stop) => '<li><span>' + ctx.icon('pin') + '</span>' + ctx.escapeHtml(localized(stop, lang)) + '</li>').join(''), '</ol>',
          '<div class="ai-answer__foot"><b>', ctx.icon('card'), ctx.escapeHtml(localized(response.budget, lang)), '</b>',
          '<button type="button" class="ai-save ', item.saved ? 'saved' : '', '" data-atlas-save="', ctx.escapeHtml(item.id), '" aria-pressed="', item.saved, '">', ctx.icon(item.saved ? 'check' : 'plus'), item.saved ? c.saved : c.save, '</button></div>',
          '</div>',
        '</div>',
      '</article>'
    ].join('');
  }

  function orb() {
    return '<div class="wemo-orb" aria-hidden="true"><span class="orb-halo"></span><span class="orb-core"><i></i><i></i></span></div>';
  }

  function wemoPage(ctx) {
    const lang = ctx.i18n.lang;
    const c = copy[lang];
    const state = getState();
    const activeId = new URLSearchParams(location.search).get('conversation') || sessionStorage.getItem('wemo-active-chat');
    const live = state.conversations.filter((item) => !item.demo);
    const active = activeId ? live.filter((item) => item.id === activeId) : live.slice(-2);
    document.title = 'wemo AI - Wemo';
    return [
      ctx.topBar(c.country),
      '<main class="page wemo-page">',
        '<section class="ai-hero">',
          '<p class="eyebrow">', c.eyebrow, '</p><h1>', c.title, '</h1>',
          orb(),
          '<strong>Wemo AI</strong><span>', c.guide, '</span><p>', c.intro, '</p>',
        '</section>',
        '<div class="ai-prompts" aria-label="', c.title, '">',
          Object.entries(c.prompts).map(([key, label], index) => {
            const icons = ['calendar', 'utensils', 'mountain', 'star'];
            return '<button type="button" data-ai-prompt="' + key + '"><span>' + ctx.icon(icons[index]) + '</span><b>' + label + '</b></button>';
          }).join(''),
        '</div>',
        '<section class="ai-thread" aria-live="polite">', active.map((item) => conversationCard(item, ctx)).join(''), '</section>',
        '<form class="ai-composer" data-ai-chat>',
          '<label class="sr-only" for="wemo-ai-input">', c.placeholder, '</label>',
          '<input id="wemo-ai-input" data-ai-input name="message" placeholder="', c.placeholder, '" autocomplete="off" maxlength="280">',
          '<button type="submit" aria-label="', c.send, '">', ctx.icon('arrow'), '</button>',
        '</form>',
        '<p class="ai-disclaimer">', lang === 'en' ? 'Interactive frontend MVP \u00b7 plans and bookings are simulated' : c.disclaimer, '</p>',
      '</main>',
      ctx.renderNav()
    ].join('');
  }

  function sectionTitle(title, sub) {
    return '<div class="atlas-section__head"><div><h2>' + title + '</h2><p>' + sub + '</p></div></div>';
  }

  function atlasPage(ctx) {
    const lang = ctx.i18n.lang;
    const c = copy[lang];
    const state = getState();
    const featured = state.trips[0];
    const savedChats = state.conversations.filter((item) => item.saved);
    const savedIds = window.WemoStorage ? window.WemoStorage.get() : [];
    const catalog = window.WEMO_PLACES || [];
    const savedPlaces = savedIds.map((id) => {
      const place = catalog.find((entry) => entry.id === id);
      return place ? { id, title: place.name, sub: place.location, icon: 'heart' } : { id, title: { en: id.split('-').join(' '), ka: id.split('-').join(' ') }, sub: { en: c.savedPlace, ka: c.savedPlace }, icon: 'heart' };
    });
    const ideaCards = state.suggestions.concat(savedChats.map((item) => ({ id: item.id, conversation: true, title: item.response.title, sub: item.response.summary, icon: 'spark' }))).concat(savedPlaces);
    document.title = c.atlasTitle + ' - Wemo';

    return [
      ctx.topBar(c.country),
      '<main class="page atlas-page">',
        '<header class="atlas-title"><p class="eyebrow">', c.atlasEyebrow, '</p><h1>', c.atlasTitle, '</h1><p>', c.atlasSub, '</p></header>',
        '<section class="atlas-hero" style="--atlas-image:url(', featured.image, ')">',
          '<div class="atlas-hero__content"><span>', c.featured, '</span><h2>', ctx.escapeHtml(localized(featured.title, lang)), '</h2><p>', ctx.escapeHtml(localized(featured.sub, lang)), '</p>',
          '<div class="atlas-hero__meta"><b>', featured.days, ' ', c.days, '</b><b>', c.budget, ' ', featured.budget, '</b></div>',
          '<div class="atlas-progress"><i style="width:', featured.progress, '%"></i></div><small>', featured.progress, '% ', c.ready, '</small>',
          '<a href="wemo.html?conversation=history-tbilisi">', c.openTrip, ctx.icon('arrow'), '</a></div>',
        '</section>',
        '<div class="atlas-filters" role="group" aria-label="', c.atlasTitle, '">',
          Object.entries(c.filters).map(([key, label]) => '<button type="button" class="' + (key === 'all' ? 'active' : '') + '" data-atlas-filter="' + key + '">' + label + '</button>').join(''),
        '</div>',
        '<section class="atlas-section" data-atlas-kind="trips">', sectionTitle(c.trips, c.tripsSub),
          '<div class="atlas-trip-grid">', state.trips.map((trip) => [
            '<article class="atlas-trip"><img src="', trip.image, '" alt=""><div><span>', trip.days, ' ', c.days, '</span><h3>', ctx.escapeHtml(localized(trip.title, lang)), '</h3><p>', ctx.escapeHtml(localized(trip.sub, lang)), '</p><small>', ctx.icon('calendar'), ctx.escapeHtml(localized(trip.dates, lang)), ' · ', trip.budget, '</small></div></article>'
          ].join('')).join(''), '</div>',
        '</section>',
        '<section class="atlas-section" data-atlas-kind="bookings">', sectionTitle(c.bookings, c.bookingsSub),
          '<div class="atlas-bookings">', state.bookings.map((booking) => [
            '<article class="atlas-booking"><span>', ctx.icon(booking.icon), '</span><div><h3>', ctx.escapeHtml(localized(booking.title, lang)), '</h3><p>', ctx.escapeHtml(localized(booking.meta, lang)), '</p></div><b class="status-', booking.status, '">', c[booking.status], '</b></article>'
          ].join('')).join(''), '</div>',
        '</section>',
        '<section class="atlas-section" data-atlas-kind="places">', sectionTitle(c.places, c.placesSub),
          ideaCards.length ? '<div class="atlas-ideas">' + ideaCards.map((idea) => [
            '<article class="atlas-idea"><span>', ctx.icon(idea.icon || 'pin'), '</span><div><h3>', ctx.escapeHtml(localized(idea.title, lang)), '</h3><p>', ctx.escapeHtml(localized(idea.sub, lang)), '</p></div>',
            idea.conversation ? '<button type="button" class="ai-save saved" data-atlas-save="' + idea.id + '" aria-label="' + c.saved + '">' + ctx.icon('check') + '</button>' : '',
            '</article>'
          ].join('')).join('') + '</div>' : '<div class="empty"><p>' + c.emptyPlaces + '</p></div>',
        '</section>',
        '<section class="atlas-section" data-atlas-kind="history">', sectionTitle(c.history, c.historySub),
          '<div class="atlas-history">', state.conversations.slice().reverse().map((item) => [
            '<a href="wemo.html?conversation=', item.id, '"><span>', ctx.icon('message'), '</span><div><h3>', ctx.escapeHtml(localized(item.prompt, lang)), '</h3><p>', ctx.escapeHtml(localized(item.response.title, lang)), '</p></div><b>', c.resume, ctx.icon('chevron'), '</b></a>'
          ].join('')).join(''), '</div>',
        '</section>',
      '</main>',
      ctx.renderNav()
    ].join('');
  }

  function bind(page, actions) {
    if (page === 'wemo') {
      document.querySelectorAll('[data-ai-prompt]').forEach((button) => button.addEventListener('click', () => {
        addConversation(button.dataset.aiPrompt);
        actions.render();
        requestAnimationFrame(() => document.querySelector('.ai-thread')?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
      }));
      document.querySelector('[data-ai-chat]')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector('[data-ai-input]');
        const value = input.value.trim();
        if (!value) { input.focus(); return; }
        addConversation('custom', value);
        actions.render();
        requestAnimationFrame(() => document.querySelector('.ai-thread')?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
      });
    }

    document.querySelectorAll('[data-atlas-save]').forEach((button) => button.addEventListener('click', () => {
      const saved = toggleConversation(button.dataset.atlasSave);
      actions.toast(saved ? copy[window.WemoI18n.lang].atlasAdded : copy[window.WemoI18n.lang].atlasRemoved);
      actions.render();
    }));

    if (page === 'atlas') {
      document.querySelectorAll('[data-atlas-filter]').forEach((button) => button.addEventListener('click', () => {
        document.querySelectorAll('[data-atlas-filter]').forEach((item) => item.classList.toggle('active', item === button));
        document.querySelectorAll('[data-atlas-kind]').forEach((section) => { section.hidden = button.dataset.atlasFilter !== 'all' && section.dataset.atlasKind !== button.dataset.atlasFilter; });
      }));
    }
  }

  window.WemoMvp = { wemoPage, atlasPage, bind };
})();
