const {chromium}=require('playwright');const assert=require('node:assert/strict');const server=require('./business-server.cjs');
(async()=>{
 await new Promise(r=>server.listen(4176,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'msedge'});const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const base='http://127.0.0.1:4176';
 try {
  await page.goto(base+'/profile.html');await page.locator('[data-theme-open]').click();await page.locator('[data-theme-option=dark]').click();await page.locator('.setting[data-language]').click();await page.locator('a[href="business.html"]').click();
  assert.equal(await page.locator('.wb').getAttribute('lang'),'ka');await page.getByRole('link',{name:'დაამატეთ თქვენი ბიზნესი',exact:true}).waitFor();
  await page.getByRole('button',{name:'დემო ბიზნესის ნახვა'}).click();
  await page.getByRole('button',{name:'თემა',exact:true}).click();await page.getByRole('button',{name:'მუქი',exact:true}).click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('wemo-theme')),'dark');
  const routes=['dashboard','profile','ai','chat','listings','create','bookings','booking-settings','performance','subscription','billing','preview'];const english={};
  for(const route of routes){
   await page.goto(base+'/business.html#'+route);
   assert.equal(await page.locator('.wb').getAttribute('lang'),'ka',route);
   assert.equal(await page.locator('html').getAttribute('data-theme'),'dark',route);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow');
   assert.match(await page.locator('.wb-main h1').first().evaluate(e=>getComputedStyle(e).fontFamily),/BPG Nino Mtavruli/,route);
   english[route]=await page.locator('.wb-main').evaluate(root=>{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const out=[];while(w.nextNode()){const e=w.currentNode;if(!e.parentElement.closest('input,textarea,option')&&/[A-Za-z]{3}/.test(e.textContent))out.push(e.textContent.trim());}return out;});
  }
  assert.ok(!JSON.stringify(english).includes('Or upload an image'));
  assert.ok(!JSON.stringify(english).includes('No renewal'));
  assert.ok(!JSON.stringify(english).includes('Sep '));
  await page.goto(base+'/business.html#subscription');await page.getByRole('button',{name:'Pro გეგმაზე გადასვლა',exact:true}).click();
  await page.getByRole('dialog').getByText(/გეგმის ცვლილება დემოა/).waitFor();await page.getByRole('dialog').getByRole('button',{name:'გაუქმება',exact:true}).click();
  await page.goto(base+'/business.html#profile');await page.getByLabel('ბიზნესის სახელი',{exact:true}).fill('ჩემი ბიზნესი — Draft');
  await page.getByRole('button',{name:'Switch to English',exact:true}).click();assert.equal(await page.getByLabel('Business name',{exact:true}).inputValue(),'ჩემი ბიზნესი — Draft');
  await page.getByRole('button',{name:'ქართულ ენაზე გადასვლა',exact:true}).click();assert.equal(await page.getByLabel('ბიზნესის სახელი',{exact:true}).inputValue(),'ჩემი ბიზნესი — Draft');
  await page.goto(base+'/business.html#chat');await page.getByLabel('თქვენი პასუხი').fill('შესასვლელი ადაპტირებულია.');await page.getByRole('button',{name:'პასუხის გაგზავნა'}).click();await page.getByText('გასაგებია. რა გამოარჩევს თქვენს ბიზნესს?',{exact:true}).waitFor();
  await page.goto(base+'/business.html#dashboard');await page.getByRole('button',{name:'გამოქვეყნება Wemo-ზე'}).click();
  for(const route of ['public','request/courtyard-tasting','request-sent']){await page.goto(base+'/business.html#'+route);assert.equal(await page.locator('.wb').getAttribute('lang'),'ka');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow');}
  await page.goto(base+'/business.html#dashboard');await page.screenshot({path:'tests/business-georgian-dark.png',fullPage:true});await page.getByRole('button',{name:'თემა',exact:true}).click();await page.getByRole('button',{name:'ნათელი',exact:true}).click();await page.screenshot({path:'tests/business-georgian-light.png',fullPage:true});
  await page.setViewportSize({width:320,height:740});for(const route of [...routes,'public','request/courtyard-tasting']){await page.goto(base+'/business.html#'+route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' 320px overflow');}
  await page.goto(base+'/profile.html');assert.equal(await page.locator('html').getAttribute('lang'),'ka');assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.goto(base+'/business.html#bookings');await page.evaluate(()=>{const s=WemoBusinessStore.read();s.bookings=[];WemoBusinessStore.write(s);});await page.reload();
  await page.getByRole('heading',{name:'ახალი ჯავშნები არ არის'}).waitFor();
  await page.locator('[data-value="Upcoming"]').click();await page.getByRole('heading',{name:'მომავალი ჯავშნები არ არის'}).waitFor();
  // Fresh setup and claim share the same preferences and Georgian font.
  await page.evaluate(()=>localStorage.removeItem('wemo-business-v1'));await page.reload();
  await page.getByRole('link',{name:'დაამატეთ თქვენი ბიზნესი',exact:true}).click();await page.getByRole('heading',{name:'გაგვაცანით თქვენი ბიზნესი'}).waitFor();
  assert.match(await page.getByLabel('ბიზნესის სახელი').evaluate(e=>getComputedStyle(e).fontFamily),/BPG Nino Mtavruli/);
  await page.goto(base+'/business.html#claim');await page.getByRole('heading',{name:'თქვენი ბიზნესი უკვე Wemo-ზეა?'}).waitFor();
  await page.getByRole('button',{name:/ძველი ქალაქის ღვინის სახლი/}).waitFor();
  assert.deepEqual(errors,[]);console.log('PASS: shared language/theme, Georgian fonts, all business routes, AI replies, draft preservation, theme switching and 320px layout.');
 }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);server.closeAllConnections();server.close();process.exitCode=1;});
