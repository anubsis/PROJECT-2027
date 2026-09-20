window.WemoStorage={key:'wemo-saved-places',get(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}},has(id){return this.get().includes(id)},toggle(id){let a=this.get();a=a.includes(id)?a.filter(x=>x!==id):[...a,id];localStorage.setItem(this.key,JSON.stringify(a));return a.includes(id)}};

/* Locally published owner content joins existing discovery without replacing seed places. */
(() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validImage = value => { try { if (/^data:image\/(png|jpeg|webp);base64,/.test(value)) return value; const url = new URL(value); return ['https:','http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  try {
    const state = JSON.parse(localStorage.getItem('wemo-business-v1'));
    const b = state?.business;
    if (state?.version !== 1 || !b?.published) return;
    const image = validImage(b.cover);
    if (!image) return;
    window.WEMO_PLACES.push({ id:'wemo-owner-business', name:{en:b.name,ka:b.name}, category:b.category, location:{en:b.address,ka:b.address}, rating:'New', reviews:0, price:b.prices || '', image, detailPage:'business.html#public', isPro:state.plan!=='Free', isOpen:false, ownerManaged:true });
    window.WemoOwnerContent = {
      cards(page) {
        if (!['events','deals'].includes(page)) return '';
        const now = new Date(); const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        return (state.listings || []).filter(l=>l.active && l.end>=today && (page==='events'?l.type==='Event':l.type!=='Event')).map(l=>`<article class="place-card"><a class="place-card__image" href="business.html#public"><img src="${escape(validImage(l.image))}" alt="${escape(l.title)}"><span class="place-tier">${escape(l.type)}</span></a><div class="place-card__body"><span class="tag">${escape(b.name)}</span><a href="business.html#public"><h3>${escape(l.title)}</h3></a><p class="meta">${escape(l.start)} – ${escape(l.end)}</p><p class="rating">₾${Number(l.price).toLocaleString()} / guest</p></div></article>`).join('');
      }
    };
  } catch { /* Missing or invalid local owner data must not break consumer pages. */ }
})();
