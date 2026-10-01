'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {bogPayload,normalizeBogLocation}=require('../server/index.cjs');
const endpoint='https://bankofgeorgia.ge/api/locations/searchLocations';
const output=path.join(__dirname,'..','assets','data');
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  for(const type of ['branches','atms','bogpay']){
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(bogPayload(type)),signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw new Error(type+': '+response.status);
    const raw=await response.json();
    const locations=(Array.isArray(raw.data)?raw.data:[]).map(row=>normalizeBogLocation(row,type)).filter(Boolean);
    const payload={type,total:locations.length,updatedAt:new Date().toISOString(),locations};
    fs.writeFileSync(path.join(output,'bog-'+type+'.json'),JSON.stringify(payload));
    console.log(type+': '+locations.length);
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
