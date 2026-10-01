const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createServer,bogPayload,normalizeBogLocation}=require('../server/index.cjs');

test('BOG location payloads and normalized public fields',()=>{
  assert.equal(bogPayload('branches').objectType,'SC');
  assert.equal(bogPayload('atms').isGel,true);
  assert.equal(bogPayload('bogpay').objectType,'PBX');
  const location=normalizeBogLocation({objectKey:'7',nameEn:'ATM',nameGe:'ბანკომატი',latitude:'41.7',longitude:'44.8',addressEn:'Main St',addressGe:'მთავარი ქ.',cityEn:'Tbilisi',cityGe:'თბილისი',atmCcys:['GEL','USD'],worksFullTime:'Y',isAdapted:true},'atms');
  assert.deepEqual(location.currencies,['GEL','USD']);
  assert.equal(location.fullTime,true);
  assert.equal(location.lat,41.7);
  assert.equal(normalizeBogLocation({latitude:0,longitude:0},'atms'),null);
});

test('static BOG snapshots cover every supported service',()=>{
  for(const type of ['branches','atms','bogpay']){
    const data=JSON.parse(fs.readFileSync(path.join(__dirname,'..','assets','data','bog-'+type+'.json'),'utf8'));
    assert.equal(data.type,type);
    assert.equal(data.total,data.locations.length);
    assert.ok(data.total>0);
    assert.ok(data.locations.every(location=>Number.isFinite(location.lat)&&Number.isFinite(location.lng)));
  }
});

test('public BOG endpoint validates, normalizes and caches upstream data',async()=>{
  let calls=0;
  const fetchImpl=async(_url,options)=>{
    calls+=1;
    const request=JSON.parse(options.body);
    assert.equal(request.objectType,'SC');
    return {ok:true,async json(){return {data:[
      {objectKey:'1',nameEn:'Branch',nameGe:'ფილიალი',latitude:41.71,longitude:44.79,addressEn:'1 Test St',addressGe:'ტესტის ქ. 1',available:true},
      {objectKey:'bad',latitude:0,longitude:0}
    ]};}};
  };
  const server=createServer({database:':memory:',fetchImpl});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  try{
    let response=await fetch(base+'/api/bog/locations?type=branches');
    assert.equal(response.status,200);
    let data=await response.json();
    assert.equal(data.total,1);
    assert.equal(data.locations[0].nameKa,'ფილიალი');
    response=await fetch(base+'/api/bog/locations?type=branches');
    assert.equal(response.status,200);
    assert.equal(calls,1);
    response=await fetch(base+'/api/bog/locations?type=unknown');
    assert.equal(response.status,400);
  }finally{
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
  }
});
