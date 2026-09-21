'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { DatabaseSync } = require('node:sqlite');
const scrypt = promisify(crypto.scrypt);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const id = () => crypto.randomUUID();
const fail = (status, code) => { throw Object.assign(new Error(code), { status, code }); };
const text = (value, max = 1500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const list = value => Array.isArray(value) ? value : [];
const pick = (obj, keys) => Object.fromEntries(keys.map(k => [k, text(obj?.[k], k==='cover'||k==='logo'||k==='image'?1500000:k==='gallery'?10000:2000)]));
const validDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
const image = v => !v || /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(v) || (/^https?:\/\/[^\s]+$/i.test(v)&&!/["'<>`]/.test(v));

function createServer({ database = path.join(__dirname, '..', '.local', 'wemo.sqlite'), root = path.join(__dirname, '..') } = {}) {
  if (database !== ':memory:') fs.mkdirSync(path.dirname(database), {recursive:true});
  const db = new DatabaseSync(database);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE COLLATE NOCASE,name TEXT NOT NULL,password TEXT NOT NULL,salt TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS businesses(id TEXT PRIMARY KEY,owner_id TEXT NOT NULL UNIQUE REFERENCES users(id),state TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS bookings(id TEXT PRIMARY KEY,customer_id TEXT NOT NULL REFERENCES users(id),business_id TEXT NOT NULL REFERENCES businesses(id),request_key TEXT NOT NULL,data TEXT NOT NULL,UNIQUE(customer_id,request_key));
    CREATE TABLE IF NOT EXISTS saved(user_id TEXT NOT NULL REFERENCES users(id),place_id TEXT NOT NULL,PRIMARY KEY(user_id,place_id));
    CREATE INDEX IF NOT EXISTS bookings_business ON bookings(business_id);
    CREATE INDEX IF NOT EXISTS bookings_customer ON bookings(customer_id);`);
  const rates = new Map();
  const getUser = req => {
    const token = /(?:^|;\s*)wemo_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    if (!token) return null;
    return db.prepare('SELECT u.id,u.email,u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?').get(hash(token),Date.now()) || null;
  };
  const own = user => db.prepare('SELECT * FROM businesses WHERE owner_id=?').get(user.id);
  const bookingData = row => ({...JSON.parse(row.data), id:row.id, businessId:row.business_id});
  const ownedState = row => row ? {...JSON.parse(row.state),revision:row.revision,bookings:db.prepare('SELECT * FROM bookings WHERE business_id=? ORDER BY rowid DESC').all(row.id).map(bookingData)} : null;
  const publicState = row => {
    const s=JSON.parse(row.state); if (!s.business.published) return null;
    return {version:1,business:s.business,listings:s.listings,settings:s.settings,ai:pick(s.ai,['special','accessibility','languages']),plan:s.plan,bookings:[],activity:[],messages:[],invoices:[],billing:{},demo:false};
  };
  const customerBookings = user => db.prepare('SELECT b.*,v.state FROM bookings b JOIN businesses v ON v.id=b.business_id WHERE b.customer_id=? ORDER BY b.rowid DESC').all(user.id).map(row=>({...bookingData(row),businessName:JSON.parse(row.state).business.name}));
  const bootstrap = user => ({user,saved:user?db.prepare('SELECT place_id FROM saved WHERE user_id=?').all(user.id).map(r=>r.place_id):[],ownerState:user?ownedState(own(user)):null,bookings:user?customerBookings(user):[],businesses:db.prepare('SELECT * FROM businesses').all().map(publicState).filter(Boolean)});
  const json = (res,status,value) => {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  const body = async req => {
    if (!String(req.headers['content-type']).startsWith('application/json')) fail(415,'json_required');
    let raw='',size=0;for await(const chunk of req){size+=chunk.length;if(size>3500000)fail(413,'too_large');raw+=chunk;}
    try {const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))fail(400,'invalid_data');return parsed;}catch(e){fail(400,'invalid_data');}
  };
  function normalizeState(input, businessId) {
    if (!input.business || typeof input.business!=='object') fail(400,'invalid_data');
    const business=pick(input.business,['name','category','description','address','lat','lng','phone','social','hours','logo','cover','gallery','prices','amenities']);
    if(!business.name||!['restaurants','beach-clubs','hotels','activities','events','bars','tours'].includes(business.category)||!business.address||!business.phone)fail(400,'required_fields');
    if(!image(business.cover)||!image(business.logo)||business.gallery.split('\n').some(v=>!image(v)))fail(400,'invalid_image');
    if(business.social&&!/^https?:\/\//.test(business.social))fail(400,'invalid_data');
    business.id=businessId;business.published=input.business.published===true;business.claim=false;
    if(business.published&&['description','hours','cover'].some(k=>!business[k]))fail(400,'publish_details');
    const listings=list(input.listings).slice(0,100).map(l=>{
      const out=pick(l,['id','title','description','image','start','end','type']);out.price=String(l.price);out.availability=String(l.availability);out.active=l.active===true;
      if(!/^[a-zA-Z0-9-]{1,80}$/.test(out.id)||!out.title||!['Offer','Event','Experience'].includes(out.type)||!validDate(out.start)||!validDate(out.end)||out.end<out.start||!image(out.image)||!out.image||!Number.isFinite(Number(out.price))||Number(out.price)<0||Number(out.price)>1000000||!Number.isInteger(Number(out.availability))||Number(out.availability)<1||Number(out.availability)>1000)fail(400,'invalid_listing');return out;
    });
    if(new Set(listings.map(l=>l.id)).size!==listings.length)fail(400,'invalid_listing');
    const plan=['Free','Pro','Premium'].includes(input.plan)?input.plan:'Free';
    if(listings.filter(l=>l.active).length>({Free:3,Pro:15,Premium:50}[plan]))fail(400,'plan_limit');
    const settings=pick(input.settings,['accepting','notice','maxGuests','policy']);
    if(!['yes','no'].includes(settings.accepting)||!Number.isFinite(Number(settings.notice))||Number(settings.notice)<0||Number(settings.notice)>720||!Number.isInteger(Number(settings.maxGuests))||Number(settings.maxGuests)<1||Number(settings.maxGuests)>1000)fail(400,'invalid_settings');
    return {version:1,business,listings,settings,plan,demo:false,ai:pick(input.ai,['customer','budget','audience','setting','bestTime','booking','languages','accessibility','special']),billing:pick(input.billing,['name','email','method']),renewal:text(input.renewal,20),messages:list(input.messages).slice(-100).map(m=>({role:m.role==='user'?'user':'assistant',text:text(m.text)})),activity:list(input.activity).slice(0,25).map(a=>({text:text(a.text),at:text(a.at,40)})),invoices:list(input.invoices).slice(0,100).map(i=>({id:text(i.id,80),date:text(i.date,20),plan:text(i.plan,20),amount:Number(i.amount)||0}))};
  }
  const server = http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
    try {
      const host=new URL('http://'+(req.headers.host||'invalid')).hostname.replace(/^\[|\]$/g,'');
      if(host!=='localhost'&&!require('node:net').isIP(host))fail(403,'origin');
      const url=new URL(req.url,'http://localhost');
      if(!url.pathname.startsWith('/api/')) {
        if(!['GET','HEAD'].includes(req.method))fail(405,'method');
        const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
        // Serve only app HTML and public assets. Database, source, tests and dotfiles are private.
        if(!(/^\/[a-z0-9-]+\.html$/i.test(pathname)||pathname.startsWith('/assets/'))||pathname.split('/').some(s=>s.startsWith('.')))fail(404,'not_found');
        const file=path.resolve(root,'.'+pathname);if(!file.startsWith(path.resolve(root)+path.sep))fail(404,'not_found');
        let content;try{content=fs.readFileSync(file);}catch{fail(404,'not_found');}
        const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.txt':'text/plain; charset=utf-8'};
        if(ext==='.html')content=Buffer.from(content.toString().replace(/<head>/i,'<head><script>window.WEMO_SERVER=true;</script>'));
        res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-store':'no-cache'});res.end(req.method==='HEAD'?undefined:content);return;
      }
      if(!['GET','POST','PUT','PATCH','DELETE'].includes(req.method))fail(405,'method');
      if(req.method!=='GET') {
        const origin=req.headers.origin;
        if(origin && origin!==`http://${req.headers.host}` && origin!==`https://${req.headers.host}`)fail(403,'origin');
        if(req.headers['sec-fetch-site']==='cross-site')fail(403,'origin');
      }
      const user=getUser(req);
      if(url.pathname==='/api/bootstrap'&&req.method==='GET')return json(res,200,bootstrap(user));
      if(['/api/auth/register','/api/auth/login'].includes(url.pathname)&&req.method==='POST') {
        const key=req.socket.remoteAddress;const now=Date.now();let rate=rates.get(key);if(!rate||rate.until<now){rate={count:0,until:now+15*60000};rates.set(key,rate);}if(++rate.count>40)fail(429,'rate_limit');
        for(const [k,v]of rates)if(v.until<now)rates.delete(k);
        const d=await body(req);const email=text(d.email,255).toLowerCase();const password=typeof d.password==='string'?d.password:'';
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<10||password.length>256)fail(400,'credentials_format');
        let account=db.prepare('SELECT * FROM users WHERE email=?').get(email);
        if(url.pathname.endsWith('/register')) {
          if(account)fail(409,'email_exists');const name=text(d.name,100);if(!name)fail(400,'required_fields');
          const salt=crypto.randomBytes(16).toString('hex');const passwordHash=(await scrypt(password,salt,64)).toString('hex');
          try{db.prepare('INSERT INTO users VALUES(?,?,?,?,?)').run(id(),email,name,passwordHash,salt);}catch(e){if(String(e.message).includes('UNIQUE'))fail(409,'email_exists');throw e;}
          account=db.prepare('SELECT * FROM users WHERE email=?').get(email);
        }else{
          const derived=await scrypt(password,account?.salt||'wemo-invalid-account',64);
          if(!account||!crypto.timingSafeEqual(derived,Buffer.from(account.password,'hex')))fail(401,'invalid_credentials');
        }
        db.prepare('DELETE FROM sessions WHERE expires<?').run(now);
        const token=crypto.randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(token),account.id,now+7*86400000);
        res.setHeader('Set-Cookie',`wemo_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`);
        return json(res,200,bootstrap({id:account.id,name:account.name,email:account.email}));
      }
      if(url.pathname==='/api/auth/logout'&&req.method==='POST') {
        const token=/(?:^|;\s*)wemo_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie||'')?.[1];if(token)db.prepare('DELETE FROM sessions WHERE token=?').run(hash(token));
        res.setHeader('Set-Cookie','wemo_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return json(res,200,{ok:true});
      }
      if(!user)fail(401,'sign_in');
      if(url.pathname==='/api/saved'&&req.method==='PUT') {
        const d=await body(req);const placeId=text(d.id,100);if(!/^[a-zA-Z0-9-]{1,100}$/.test(placeId)||typeof d.saved!=='boolean')fail(400,'invalid_data');
        if(d.saved)db.prepare('INSERT OR IGNORE INTO saved VALUES(?,?)').run(user.id,placeId);else db.prepare('DELETE FROM saved WHERE user_id=? AND place_id=?').run(user.id,placeId);
        return json(res,200,{saved:db.prepare('SELECT place_id FROM saved WHERE user_id=?').all(user.id).map(r=>r.place_id)});
      }
      if(url.pathname==='/api/business'&&req.method==='PUT') {
        const d=await body(req);const existing=own(user);
        if(d.business?.claim===true||d.demo===true)fail(400,'demo_only');
        if(existing&&d.business?.id!==existing.id)fail(403,'not_owner');
        if(!existing&&d.business?.id&&d.business.id!=='wemo-owner-business')fail(403,'not_owner');
        if(existing&&d.revision!==existing.revision)fail(409,'conflict');
        const businessId=existing?.id||id();const state=normalizeState(d,businessId);
        if(existing)db.prepare('UPDATE businesses SET state=?,revision=revision+1 WHERE id=?').run(JSON.stringify(state),businessId);
        else db.prepare('INSERT INTO businesses(id,owner_id,state) VALUES(?,?,?)').run(businessId,user.id,JSON.stringify(state));
        return json(res,200,{ownerState:ownedState(own(user))});
      }
      if(url.pathname==='/api/bookings'&&req.method==='POST') {
        const d=await body(req);if(!/^[a-zA-Z0-9-]{10,100}$/.test(d.requestKey||''))fail(400,'invalid_data');
        const duplicate=db.prepare('SELECT * FROM bookings WHERE customer_id=? AND request_key=?').get(user.id,d.requestKey);if(duplicate)return json(res,200,{booking:bookingData(duplicate)});
        const row=db.prepare('SELECT * FROM businesses WHERE id=?').get(text(d.businessId,100));if(!row)fail(404,'unavailable');
        const s=JSON.parse(row.state);const l=s.listings.find(l=>l.id===d.listingId&&l.active);
        if(!s.business.published||s.settings.accepting!=='yes'||!l)fail(409,'unavailable');
        if(row.owner_id===user.id)fail(400,'own_booking');
        const date=text(d.date,10),time=text(d.time,5),guests=Number(d.guests);
        // App and businesses use Georgia's time zone, independently of the server's zone.
        if(!validDate(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||date<l.start||date>l.end||new Date(`${date}T${time}:00+04:00`).getTime()<Date.now()+Number(s.settings.notice)*3600000)fail(400,'booking_date');
        if(!Number.isInteger(guests)||guests<1||guests>Math.min(Number(l.availability),Number(s.settings.maxGuests)))fail(400,'guests');
        const customer=text(d.customer,100);if(!customer)fail(400,'required_fields');
        const data={customer,date,time,guests,item:l.title,listingId:l.id,source:'consumer',price:Math.round(Number(l.price)*guests*100)/100,status:'New',createdAt:new Date().toISOString()};
        const bookingId=id();db.prepare('INSERT INTO bookings VALUES(?,?,?,?,?)').run(bookingId,user.id,row.id,d.requestKey,JSON.stringify(data));
        return json(res,201,{booking:{...data,id:bookingId,businessId:row.id}});
      }
      const match=/^\/api\/bookings\/([a-zA-Z0-9-]+)$/.exec(url.pathname);
      if(match&&req.method==='PATCH') {
        const d=await body(req);const row=db.prepare('SELECT b.* FROM bookings b JOIN businesses v ON v.id=b.business_id WHERE b.id=? AND v.owner_id=?').get(match[1],user.id);if(!row)fail(404,'not_found');
        const booking=bookingData(row);if(d.previous!==booking.status)fail(409,'conflict');
        if(!({New:['Upcoming','Cancelled'],Upcoming:['Completed','Cancelled']}[booking.status]||[]).includes(d.status))fail(400,'invalid_status');
        booking.status=d.status;if(d.status==='Completed')booking.completedAt=new Date().toISOString();db.prepare('UPDATE bookings SET data=? WHERE id=?').run(JSON.stringify(booking),row.id);
        return json(res,200,{ownerState:ownedState(own(user))});
      }
      fail(404,'not_found');
    }catch(e){if(!res.headersSent)json(res,e.status||500,{error:e.code||'server_error'});else res.end();if(!e.status)console.error(e);}
  });
  server.on('close',()=>db.close());return server;
}
module.exports={createServer};
if(require.main===module){const port=Number(process.env.PORT)||4173;const host=process.argv.includes('--lan')?'0.0.0.0':'127.0.0.1';createServer().listen(port,host,()=>{console.log(`Wemo: http://localhost:${port}\nDatabase: .local/wemo.sqlite`);if(host==='0.0.0.0'){for(const entries of Object.values(require('node:os').networkInterfaces()))for(const e of entries||[])if(e.family==='IPv4'&&!e.internal)console.log(`Same Wi-Fi: http://${e.address}:${port}`);console.log('Local HTTP testing only. Use test passwords on a trusted network.');}});}
