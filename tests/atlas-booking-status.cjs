const {chromium}=require('playwright');const assert=require('node:assert/strict');const server=require('./business-server.cjs');
(async()=>{
 await new Promise(r=>server.listen(4177,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'msedge'});const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const customer=await context.newPage();const owner=await context.newPage();const errors=[];for(const p of [customer,owner])p.on('pageerror',e=>errors.push(e.message));const base='http://127.0.0.1:4177';
 try{
  await customer.goto(base+'/business.html');await customer.evaluate(()=>{const s=WemoBusinessStore.sample();s.business.published=true;WemoBusinessStore.write(s);});await customer.reload();
  await customer.goto(base+'/business.html#request/courtyard-tasting');await customer.getByLabel('Your name').fill('Atlas Guest');await customer.getByLabel('Date',{exact:true}).fill(await customer.evaluate(()=>WemoBusinessStore.dateAfter(1)));await customer.getByLabel('Time',{exact:true}).fill('19:00');await customer.getByRole('button',{name:'Send booking request'}).click();
  await customer.getByRole('link',{name:'View in Atlas'}).click();
  const id=await customer.evaluate(()=>JSON.parse(localStorage.getItem('wemo-business-v1')).bookings.find(b=>b.customer==='Atlas Guest').id);
  const card=customer.locator('[data-booking-id="'+id+'"]');await card.getByText('Pending',{exact:true}).waitFor();assert.equal(await card.count(),1);assert.equal(await customer.locator('[data-booking-id^="sample-"]').count(),0);
  assert.equal(await customer.locator('[data-atlas-kind="trips"]').isVisible(),false);
  await owner.goto(base+'/business.html#bookings');await owner.locator('.wb-card').filter({has:owner.getByRole('heading',{name:'Atlas Guest'})}).getByRole('button',{name:'Confirm',exact:true}).click();
  await card.getByText('Confirmed',{exact:true}).waitFor();
  await owner.getByRole('button',{name:/^Upcoming/}).click();await owner.locator('.wb-card').filter({has:owner.getByRole('heading',{name:'Atlas Guest'})}).getByRole('button',{name:'Mark complete'}).click();await card.getByText('Completed',{exact:true}).waitFor();
  await customer.reload();await card.getByText('Completed',{exact:true}).waitFor();assert.equal(await card.count(),1);
  // Canonical cancellation maps to the fourth customer status without copying records.
  await owner.evaluate(id=>{const s=WemoBusinessStore.read();s.bookings.find(b=>b.id===id).status='Cancelled';WemoBusinessStore.write(s);},id);await card.getByText('Cancelled',{exact:true}).waitFor();
  await customer.locator('[data-language]').click();await card.getByText('გაუქმებული',{exact:true}).waitFor();assert.match(await card.evaluate(e=>getComputedStyle(e).fontFamily),/BPG Nino Mtavruli/);
  await customer.setViewportSize({width:320,height:740});assert.equal(await card.locator('b').isVisible(),true);assert.equal(await customer.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await customer.evaluate(()=>WemoTheme.set('dark'));assert.equal(await customer.locator('html').getAttribute('data-theme'),'dark');
  // Missing/malformed business storage must leave Atlas's existing content usable.
  await owner.evaluate(()=>localStorage.setItem('wemo-business-v1','{invalid'));await customer.reload();await customer.locator('.atlas-title h1').waitFor();assert.equal(await customer.locator('.atlas-booking').count(),3);
  assert.deepEqual(errors,[]);console.log('PASS: customer request → Atlas, owner status sync, all four statuses, no duplicates or owner samples, reload, Georgian/font, 320px, dark theme, malformed storage fallback.');
 }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);server.closeAllConnections();server.close();process.exitCode=1;});
