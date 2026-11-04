const assert=require('node:assert/strict'),{C,flags,act,until}=require('./modern-support.cjs'),U=require('../src/first-loop/universal-products.js'),M=require('../src/first-loop/consumer-model.js'),R=require('../src/first-loop/market-reach.js');
// Equilíbrio: por produto, cada atributo e cada canal somam 100% e cada faixa etária soma 150%.
for(const [product,list] of Object.entries(U.v2)){
 assert.equal(list.length,6);
 for(const a of U.axes.map(a=>a.id))assert.equal(Math.round(list.reduce((n,p)=>n+p.weights[a],0)*100),100,product+' '+a);
 for(let i=0;i<6;i++)assert.equal(list.reduce((n,p)=>n+p.channels[i],0),100,product+' canal '+i);
 for(let i=0;i<4;i++)assert.equal(Math.round(list.reduce((n,p)=>n+p.ages[i],0)*100),150,product+' idade '+i);
 assert.deepEqual(new Set(list.map(p=>p.minimum.axis)).size,6,product+' mínimos');
 for(const p of list){assert.equal(p.comments.length,3);assert.equal(Object.values(p.weights).filter(v=>v===0).length,1);}
}
// Partida v2 completa: personas novas, canais novos, mix ideal dá eficiência máxima e avaliações vêm das frases novas.
let s=act(act(C.fresh(7,{...flags,personaSet:'v2'}),'start'),'product',{id:'headphones'});s=until(s,'customer');
const persona=C.G.personas(s).find(p=>p.id===s.personaCandidates[0]);assert(persona.comments.length===3);
assert.deepEqual(R.channelNames(s),R.channelsV2);
s=act(s,'customer',{id:persona.id});assert.equal(R.marketing(s,persona.channels),1.5);assert(R.marketing(s,R.defaultMix())<1.5);
const top=Object.entries(persona.weights).sort((a,b)=>b[1]-a[1]);for(const [id] of [top[0],top[0],top[1],top[2]])s=act(s,'attribute',{id,delta:1});
assert.equal(M.requirement(s).axis,top[0][0]);
s=act(s,'reveal');s=act(s,'place',{id:'online'});if(s.traction)s=act(s,'promotionMix',{mix:persona.channels});s=act(s,'confirmPromotion');s=until(act(s,'build'),'testReady');
s=act(s,'test',{},15);s=act(s,'testChoice',{choice:s.quality===0?'repair':'continue'});s=until(s,'batchPlanning');s=act(s,'confirmBatch');s=act(s,'setPrice',{price:Math.round(persona.budget*.5)});s=act(s,'confirmPrice');s=act(s,'rollCampaign',{},13);s=act(s,'launchReview');s=until(act(s,'launch'),'selling');
for(let i=0;i<4000&&s.phase!=='recap';i++)s=s.phase==='opportunity'?act(s,'offer',{choice:'decline'}):C.tick(s,.2);
assert(s.reviews.length>0,'sem avaliações');const all=JSON.stringify(require('fs').readFileSync(require.resolve('../src/first-loop/consumer-model.js'),'utf8'));
for(const r of s.reviews)assert(all.includes(r.feedback.replace(/"/g,'\\"').slice(-25)),'frase fora do repertório: '+r.feedback);
// Saves antigos (sem personaSet) continuam com as personas anteriores.
assert.equal(C.G.personas({...C.fresh(1,flags),productId:'headphones'}).length,10);
console.log('PASS personas v2: equilíbrio, partida completa ('+s.sold+' vendas, '+s.reviews.length+' avaliações), canais novos e saves antigos preservados.');
