/* Local MVP repository. Replace this boundary with authenticated API calls in production. */
(() => {
  'use strict';
  const KEY = 'wemo-business-v1';
  const plans = {
    Free: { price: 0, limit: 3, features: ['Public business profile', 'Wemo AI information', '3 active offers, events or experiences', 'Bookings & basic insights'] },
    Pro: { price: 49, limit: 15, features: ['Everything in Free', '15 active listings', 'Detailed performance insights', 'Priority support'] },
    Premium: { price: 99, limit: 50, features: ['Everything in Pro', '50 active listings', 'Featured profile eligibility', 'Dedicated onboarding support'] }
  };
  const blank = () => ({ version: 1, business: null, ai: {}, listings: [], bookings: [], activity: [], messages: [], plan: 'Free', invoices: [], settings: { accepting: 'yes', notice: '2', maxGuests: '12', policy: window.WemoBusinessI18n.t('Cancel at least 24 hours before your visit.') }, billing: { email: '', name: '', method: 'No payment method' }, demo: false });
  function read() { if(window.WemoBackend?.enabled)return {...blank(),...structuredClone(WemoBackend.businessState()||{})}; try { const saved = JSON.parse(localStorage.getItem(KEY)); return saved?.version === 1 ? { ...blank(), ...saved } : blank(); } catch { return blank(); } }
  function write(state) { if(window.WemoBackend?.enabled)return WemoBackend.saveBusiness(state); localStorage.setItem(KEY, JSON.stringify(state)); }
  function dateAfter(days = 0) { const d = new Date(); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function sample() {
    const s = blank(); s.demo = true;
    s.business = { id: 'wemo-owner-business', name: 'Ezo — courtyard kitchen', category: 'restaurants', description: 'Seasonal Georgian food, natural wine, and slow evenings in a leafy courtyard. Come for a long lunch; stay for the conversation.', address: '16 Geronti Kikodze Street, Tbilisi', lat: '41.6898', lng: '44.7992', phone: '+995 555 012 345', social: 'https://instagram.com/', hours: 'Mon–Sun · 12:00–23:00', logo: '', cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', gallery: '', prices: 'Main dishes ₾25–45 · wine from ₾15', amenities: 'Courtyard, Wi-Fi, card payments, vegetarian options', published: false, claim: false };
    s.ai = { customer: 'Couples, friends and curious travellers', budget: '₾40–80 per person', audience: 'Couples, tourists', setting: 'Indoor and outdoor', bestTime: 'Golden hour, 18:00–20:00', booking: 'Recommended', languages: 'Georgian, English', accessibility: '', special: '' };
    s.listings = [{ id: 'courtyard-tasting', type: 'Experience', title: 'A taste of Georgia', description: 'Three natural wines and seasonal Georgian small plates in our courtyard.', image: s.business.cover, price: '65', start: dateAfter(), end: dateAfter(30), availability: '12', active: true }];
    s.bookings = [ ['Nino K.',1,'19:00',2,'New'], ['Alex M.',2,'18:30',4,'New'], ['Mariam G.',3,'20:00',2,'Upcoming'], ['David L.',-1,'19:30',3,'Completed'], ['Sophie B.',-2,'18:00',2,'Cancelled'] ].map(([customer,day,time,guests,status],i) => ({id:`sample-${i}`, customer, date:dateAfter(day), time, guests, item:'A taste of Georgia', price:65*guests, status, createdAt:dateAfter(-Math.max(1,i)), completedAt:status==='Completed'?dateAfter(-1):null, listingId:'courtyard-tasting'}));
    s.activity = [{ text: 'Welcome to your sample business', at: new Date().toISOString() }];
    return s;
  }
  const profileFields = ['name','category','description','address','lat','lng','phone','hours','cover','prices','amenities'];
  const aiFields = ['customer','budget','audience','setting','bestTime','booking','languages','accessibility','special'];
  const completeness = (obj, fields) => Math.round(fields.filter(k => String(obj?.[k] || '').trim()).length / fields.length * 100);
  window.WemoBusinessStore = { key:KEY, read, write, blank, sample, plans, dateAfter, profileFields, aiFields, completeness };
  /* Async provider contract: a real AI adapter can return { reply, field, value } here. */
  window.WemoBusinessAI = {
    questions: [['customer','Who feels most at home at your business?'],['budget','How much does a guest usually spend?'],['audience','Is your place best for couples, families, tourists, or another group?'],['setting','Do you have indoor seating, outdoor seating, or both?'],['bestTime','When is the best time to visit?'],['booking','Is a booking required, recommended, or unnecessary?'],['languages','Which languages can your team help guests in?'],['accessibility','What should guests know about steps, wheelchair access, or other accessibility needs?'],['special','What makes your business special?']],
    async respond({ field, answer, information }) {
      const next = this.questions.find(([key]) => key !== field && !information[key]);
      return { field, value: answer.trim(), reply: next ? `Got it. ${next[1]}` : 'Thank you! Your information is ready. You can review and edit every answer in Wemo AI information.' };
    }
  };
})();
