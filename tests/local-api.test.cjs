const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const {createServer}=require('../server/index.cjs');
test('Local accounts, authorization, durable saved places and shared bookings',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wemo-api-'));const database=path.join(dir,'test.sqlite');let server,base;
 const start=async()=>{server=createServer({database});await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;};
 const close=async()=>{server.closeAllConnections();await new Promise(r=>server.close(r));};await start();
 const client=()=>({cookie:'',async call(route,method='GET',data,headers={}){const r=await fetch(base+route,{method,headers:{Cookie:this.cookie,...(data?{'Content-Type':'application/json'}:{}),...headers},body:data?JSON.stringify(data):undefined});const cookie=r.headers.get('set-cookie');if(cookie)this.cookie=cookie.split(';')[0];const result=await r.json();return {status:r.status,body:result};}});
 const owner=client(),customer=client(),stranger=client(),guest=client();const password='Wemo-test-password-24';
 const register=async(c,email,name)=>{const r=await c.call('/api/auth/register','POST',{email,name,password});assert.equal(r.status,200);assert.ok(r.body.user.id);assert.equal('password' in r.body.user,false);};
 try{
  await register(owner,'owner@example.test','Owner');await register(customer,'guest@example.test','Guest');await register(stranger,'other@example.test','Other');
  assert.equal((await guest.call('/api/auth/login','POST',{email:'owner@example.test',password:'wrong-password-24'})).status,401);
  assert.equal((await guest.call('/api/auth/register','POST',{email:'OWNER@example.test',password,name:'Duplicate'})).status,409);
  assert.equal((await guest.call('/api/saved','PUT',{id:'old-town-wine-house',saved:true})).status,401);
  assert.equal((await customer.call('/api/saved','PUT',{id:'old-town-wine-house',saved:true},{Origin:'https://evil.example'})).status,403);
  assert.equal((await customer.call('/api/saved','PUT',{id:'old-town-wine-house',saved:true})).status,200);
  assert.deepEqual((await owner.call('/api/bootstrap')).body.saved,[]);
  const date=new Date(Date.now()+3*86400000).toISOString().slice(0,10);
  const state={version:1,business:{id:'wemo-owner-business',name:'Local Kitchen',category:'restaurants',address:'Tbilisi',phone:'555000000',description:'A local table',hours:'12–22',cover:'https://example.test/photo.jpg',published:true},listings:[{id:'tasting',type:'Experience',title:'Tasting',description:'A meal',image:'https://example.test/photo.jpg',start:date,end:date,price:'40',availability:'4',active:true}],settings:{accepting:'yes',notice:'2',maxGuests:'6',policy:'Please cancel ahead'},ai:{special:'Seasonal',customer:'private segment'},billing:{email:'billing@example.test'},messages:[{role:'user',text:'Private chat'}],plan:'Free'};
  let result=await owner.call('/api/business','PUT',state);assert.equal(result.status,200);const saved=result.body.ownerState;const businessId=saved.business.id;assert.notEqual(businessId,'wemo-owner-business');
  const publicData=(await guest.call('/api/bootstrap')).body;assert.equal(publicData.businesses.length,1);assert.deepEqual(publicData.businesses[0].billing,{});assert.deepEqual(publicData.businesses[0].messages,[]);assert.equal(publicData.businesses[0].ai.customer,undefined);assert.equal(publicData.ownerState,null);
  assert.equal((await stranger.call('/api/business','PUT',saved)).status,403);
  const request={requestKey:'request-123456789',businessId,listingId:'tasting',customer:'Guest',date,time:'19:00',guests:2,price:1,status:'Completed'};
  assert.equal((await owner.call('/api/bookings','POST',request)).body.error,'own_booking');
  assert.equal((await customer.call('/api/bookings','POST',{...request,guests:5})).body.error,'guests');
  assert.equal((await customer.call('/api/bookings','POST',{...request,date:'2020-01-01'})).body.error,'booking_date');
  result=await customer.call('/api/bookings','POST',request);assert.equal(result.status,201);const booking=result.body.booking;assert.equal(booking.price,80);assert.equal(booking.status,'New');
  assert.equal((await customer.call('/api/bookings','POST',request)).body.booking.id,booking.id);
  assert.equal((await customer.call('/api/bookings/'+booking.id,'PATCH',{previous:'New',status:'Upcoming'})).status,404);
  assert.equal((await stranger.call('/api/bookings/'+booking.id,'PATCH',{previous:'New',status:'Upcoming'})).status,404);
  assert.equal((await owner.call('/api/bookings/'+booking.id,'PATCH',{previous:'New',status:'Completed'})).status,400);
  assert.equal((await owner.call('/api/bookings/'+booking.id,'PATCH',{previous:'New',status:'Upcoming'})).status,200);
  assert.equal((await customer.call('/api/bootstrap')).body.bookings[0].status,'Upcoming');assert.deepEqual((await stranger.call('/api/bootstrap')).body.bookings,[]);
  // A stale profile save cannot overwrite an independently received booking.
  result=await owner.call('/api/business','PUT',{...saved,bookings:[]});assert.equal(result.status,200);assert.equal(result.body.ownerState.bookings[0].status,'Upcoming');
  assert.equal((await owner.call('/api/business','PUT',saved)).status,409);
  assert.equal((await owner.call('/api/bookings/'+booking.id,'PATCH',{previous:'New',status:'Cancelled'})).status,409);
  assert.equal((await owner.call('/api/bookings/'+booking.id,'PATCH',{previous:'Upcoming',status:'Completed'})).status,200);
  for(const route of ['/.local/wemo.sqlite','/server/index.cjs','/tests/local-api.test.cjs','/assets/../.local/wemo.sqlite'])assert.equal((await fetch(base+route)).status,404);
  const html=await(await fetch(base+'/index.html')).text();assert.ok(html.includes('window.WEMO_SERVER=true'));
  await close();await start();assert.deepEqual((await customer.call('/api/bootstrap')).body.saved,['old-town-wine-house']);assert.equal((await customer.call('/api/bootstrap')).body.bookings[0].status,'Completed');
  const secondDevice=client();await secondDevice.call('/api/auth/login','POST',{email:'guest@example.test',password});assert.deepEqual((await secondDevice.call('/api/bootstrap')).body.saved,['old-town-wine-house']);
  const oldCookie=customer.cookie;await customer.call('/api/auth/logout','POST',{});customer.cookie=oldCookie;assert.equal((await customer.call('/api/bootstrap')).body.user,null);
 }finally{await close();fs.rmSync(dir,{recursive:true,force:true});}
});
