const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');const server=require('./business-server.cjs');
(async()=>{
 await new Promise(r=>server.listen(4178,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge'});const errors=[];fs.mkdirSync('tests/visual-polish',{recursive:true});
 const routes=['index.html','wemo.html','atlas.html','profile.html','search-results.html','events.html','deals.html','place.html','place-pro.html','map.html','business.html'];
 try{
  for(const lang of ['en','ka'])for(const theme of ['light','dark']){
   const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await ctx.addInitScript(({lang,theme})=>{localStorage.setItem('wemo-language',lang);localStorage.setItem('wemo-theme',theme);},{lang,theme});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(`${lang}/${theme}: ${e.message}`));
   for(const route of routes){
    await page.goto('http://127.0.0.1:4178/'+route,{waitUntil:'load'});await page.locator('main').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'),lang,route);
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme,route);
    for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} ${lang} ${theme} ${width}px overflow`);}
    await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,0));
    if(lang==='en'){
     const loaded=await page.evaluate(async()=>{const faces=await document.fonts.load('800 16px "Plus Jakarta Sans"');return faces.length>0&&faces.every(f=>f.status==='loaded');});assert.ok(loaded,route+' local English font loaded');
     const mismatches=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>el.getClientRects().length&&[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&/[a-z]/i.test(n.textContent))&&!getComputedStyle(el).fontFamily.startsWith('"Plus Jakarta Sans"')).map(el=>el.tagName+'.'+el.className));assert.deepEqual(mismatches,[],route+' English typography');
    }
    if(lang==='ka'&&await page.locator('h1').count())assert.match(await page.locator('h1').first().evaluate(e=>getComputedStyle(e).fontFamily),/Noto Sans Georgian/,route);
    if(['index.html','profile.html','atlas.html','wemo.html'].includes(route))await page.screenshot({path:`tests/visual-polish/${route.split('.')[0]}-${lang}-${theme}.png`,animations:'disabled'});
    assert.ok(await page.locator('.wemo-icon').count()>0,route+' icons');
    assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect.getTiming().duration>1).length),0,route+' reduced motion');
   }
   const contrast=await page.evaluate(()=>{
    const rgb=token=>{const el=document.createElement('i');el.style.color=`var(${token})`;document.body.append(el);const vals=getComputedStyle(el).color.match(/[\d.]+/g).slice(0,3).map(Number);el.remove();return vals;};
    const lum=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    return [['--text','--bg'],['--muted','--surface'],['--accent','--accent-soft']].map(([a,b])=>{const x=lum(rgb(a)),y=lum(rgb(b));return [a,(Math.max(x,y)+.05)/(Math.min(x,y)+.05)];});
   });for(const [token,ratio]of contrast)assert.ok(ratio>=4.5,`${theme} ${token}: ${ratio}`);
   await ctx.close();console.log(`PASS ${lang}/${theme}: 11 pages, 320/390px, fonts, icons, reduced motion, contrast.`);
  }
  const ctx=await browser.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:4178/index.html');await p.locator('[data-planner-open="city-dialog"]').first().click();await p.locator('#city-dialog').waitFor({state:'visible'});await p.keyboard.press('Escape');await p.locator('#city-dialog').waitFor({state:'hidden'});
  await p.locator('.bottom-nav a[href="atlas.html"]').click();await p.locator('.atlas-title').waitFor();await p.locator('[data-atlas-filter="bookings"]').click();assert.equal(await p.locator('[data-atlas-kind="trips"]').isVisible(),false);
  await p.locator('.bottom-nav a[href="profile.html"]').click();await p.locator('[data-theme-open]').click();await p.locator('[data-theme-option="dark"]').click();await p.locator('[data-theme-dialog]').waitFor({state:'hidden'});assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');
  await p.setViewportSize({width:1440,height:1000});await p.locator('.desktop-preview-toggle').click();await p.locator('.desktop-phone-active').waitFor();
  const nav=await p.locator('.bottom-nav').boundingBox(),screen=await p.locator('.desktop-phone__screen').boundingBox();assert.ok(nav.x>=screen.x&&nav.x+nav.width<=screen.x+screen.width+1);assert.ok(nav.y+nav.height<=screen.y+screen.height+1);
  await p.screenshot({path:'tests/visual-polish/desktop-profile.png'});await p.locator('.lang-button').click();assert.equal(await p.locator('html').getAttribute('lang'),'ka');assert.match(await p.locator('.profile-head h1').evaluate(e=>getComputedStyle(e).fontFamily),/Noto Sans Georgian/);
  console.log('PASS desktop phone preview: navigation bounds, language switching and Georgian font.');
  await ctx.close();assert.deepEqual(errors,[]);console.log('PASS normal motion: page navigation, filter interaction, dialog focus/escape, theme selection, no browser errors.');
 }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);server.closeAllConnections();server.close();process.exitCode=1;});
