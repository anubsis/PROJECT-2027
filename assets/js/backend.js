/* Server-backed state is kept in memory, never mixed with browser-only demo data. */
(() => {
  const enabled=window.WEMO_SERVER===true;
  const B=window.WemoBackend={enabled,user:null,saved:[],ownerState:null,bookings:[],businesses:[],syncing:false,epoch:0};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  B.uid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
  B.api=async(path,method='GET',data)=>{
    let response;try{response=await fetch('/api'+path,{method,credentials:'same-origin',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(10000)});}catch{throw Object.assign(new Error('offline'),{code:'offline'});}
    let result;try{result=await response.json();}catch{throw Object.assign(new Error('server_error'),{code:'server_error'});}
    if(!response.ok)throw Object.assign(new Error(result.error||'server_error'),{code:result.error,status:response.status});if(method!=='GET')B.epoch++;return result;
  };
  B.catalog=()=>{
    if(!enabled)return;const places=window.WEMO_PLACES;if(!places)return;
    for(let i=places.length-1;i>=0;i--)if(places[i].ownerManaged)places.splice(i,1);
    for(const state of B.businesses){const b=state.business;places.push({id:b.id,name:{en:b.name,ka:b.name},category:b.category,location:{en:b.address,ka:b.address},rating:'New',reviews:0,price:b.prices||'',image:b.cover,detailPage:'business.html?business='+encodeURIComponent(b.id)+'#public',isPro:false,isOpen:false,ownerManaged:true});}
  };
  B.accept=data=>{const previous=B.user?.id;Object.assign(B,data);B.catalog();window.dispatchEvent(new CustomEvent('wemo:sync',{detail:{accountChanged:previous!==B.user?.id}}));};
  B.refresh=async()=>{if(!enabled||B.syncing)return;B.syncing=true;const epoch=B.epoch;try{const data=await B.api('/bootstrap');if(B.epoch===epoch)B.accept(data);window.dispatchEvent(new CustomEvent('wemo:connection',{detail:{ok:true}}));}catch(error){window.dispatchEvent(new CustomEvent('wemo:connection',{detail:{ok:false}}));throw error;}finally{B.syncing=false;}};
  B.ready=enabled?B.refresh():Promise.resolve();B.ready.catch(()=>{});
  B.publicId=()=>new URLSearchParams(location.search).get('business');
  B.businessState=()=>B.publicId()?B.businesses.find(s=>s.business.id===B.publicId()):B.ownerState;
  B.saveBusiness=async state=>{const result=await B.api('/business','PUT',state);B.ownerState=result.ownerState;return structuredClone(result.ownerState);};
  B.updateBooking=async(id,status,previous)=>{const result=await B.api('/bookings/'+encodeURIComponent(id),'PATCH',{status,previous});B.ownerState=result.ownerState;return structuredClone(result.ownerState);};
  B.requireAccount=()=>{if(B.user)return true;location.href='account.html?next='+encodeURIComponent(location.pathname+location.search+location.hash);return false;};
  B.toggleSaved=async id=>{if(!B.requireAccount())return;const result=await B.api('/saved','PUT',{id,saved:!B.saved.includes(id)});B.saved=result.saved;};
  B.ownerCards=page=>{
    const ka=window.WemoI18n?.lang==='ka';const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Tbilisi'});
    return B.businesses.flatMap(s=>s.listings.filter(l=>l.active&&l.end>=today&&(page==='events'?l.type==='Event':l.type!=='Event')).map(l=>`<article class="place-card"><a class="place-card__image" href="business.html?business=${encodeURIComponent(s.business.id)}#public"><img src="${esc(l.image)}" alt="${esc(l.title)}"><span class="place-tier">${esc(ka?({Offer:'შეთავაზება',Event:'ღონისძიება',Experience:'გამოცდილება'}[l.type]):l.type)}</span></a><div class="place-card__body"><span class="tag">${esc(s.business.name)}</span><a href="business.html?business=${encodeURIComponent(s.business.id)}#public"><h3>${esc(l.title)}</h3></a><p class="meta">${esc(l.start)} – ${esc(l.end)}</p><p class="rating">₾${Number(l.price)} / ${ka?'სტუმარი':'guest'}</p></div></article>`)).join('');
  };
  if(enabled){window.WemoOwnerContent={cards:B.ownerCards};setInterval(()=>{if(!document.hidden)B.refresh().catch(()=>{});},3000);window.addEventListener('focus',()=>B.refresh().catch(()=>{}));}
})();
