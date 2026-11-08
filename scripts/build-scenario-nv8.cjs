// Gera um cenário de teste: fone NV8 já vendendo, ~1000 vendas, nota média 3,9, 3000 seguidores,
// R$150.000 em caixa e sala comercial alugada. Uso: node scripts/build-scenario-nv8.cjs
const fs=require('fs'),assert=require('node:assert/strict');
const {C,flags,act,until}=require('../tests/modern-support.cjs'),U=require('../src/first-loop/universal-products.js');
const version=(fs.readFileSync('scripts/build-first-loop.cjs','utf8').match(/Primeira-Aposta-(\d+\.\d+)\.html/)||[])[1];

let s=act(C.fresh(11,{...flags,traction:true,personaSet:'v2',boardCampaign:true}),'start');
s=C.enableWeekly(s);
s=act(s,'product',{id:'headphones'});s=until(s,'customer');s=act(s,'customer',{id:s.personaCandidates[0]});
// Produto já no nível 8, montado na prancheta para a persona
s.level=8;s.designOffer=null;s.designPieces=[];s=act(s,'name',{name:'Pulso Pro'});
const persona=C.G.personas(s).find(p=>p.id===s.clientId),order=Object.entries(persona.weights).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
const cfg=U.gridConfig(s.level);
s.cash+=100000;// verba só para montar o cenário; o caixa final é fixado abaixo
for(let k=0,tries=0;k<cfg.limit&&tries<30;){const attr=order[k%3];let placed=false;
 for(let index=0;index<s.designOffer.length&&!placed;index++)for(let rot=0;rot<4&&!placed;rot++)for(let y=0;y<cfg.h&&!placed;y++)for(let x=0;x<cfg.w&&!placed;x++){try{s=act(s,'designPlace',{index,rot,x,y,attr});placed=true;}catch(e){}}
 if(placed)k++;else{tries++;try{s=act(s,'designReset');}catch(e){break;}}}
s=act(s,'reveal');s=until(act(s,'build'),'testReady');s=act(s,'test',{},15);s=act(s,'testChoice',{choice:s.quality===0?'repair':'continue'});
s=until(s,'batchPlanning');s.cash+=200000;s=act(s,'batch',{quantity:1500});s=act(s,'confirmBatch');const uc=C.batchUnitCost(s);let best=[0,0];for(let pr=Math.ceil(uc)+5;pr<=uc*6;pr+=5){const c=C.Audience.Model.chance(s,undefined,{price:pr});if((pr-uc)*c>best[1])best=[pr,(pr-uc)*c];}s=act(s,'setPrice',{price:best[0]});s=act(s,'confirmPrice');
s.marketingExp=5;
s=until(act(s,'launchAndRoll',{board:{score:80,reach:60,personas:3,stage:1}}),'selling');
s=C.Reach.enableGrowth(s);
// Vende até ~1000 unidades, atravessando as semanas
for(let i=0;i<400000&&s.sold<1000&&s.phase==='selling';i++){
 if(s.phase==='opportunity'){s=act(s,'offer',{choice:'decline'});continue;}
 if(s.weekly.stage==='report'){s=act(s,'readWeek');continue;}
 if(s.weekly.stage==='weekend'){s=act(s,'weekend',{choice:'work'});continue;}
 if(i%4000===0&&s.stock<300&&!s.crew)s=act(s,'crew',{task:'produce',quantity:1000});
 s=C.tick(s,.2);}
// Ajustes finais do cenário
const stars=[5,4,4,4,3,4,4,4,3,4];s.reviews.forEach((r,i)=>r.stars=stars[i%10]);// média 3,9
const avg=s.reviews.reduce((n,r)=>n+r.stars,0)/s.reviews.length;
s.market.growth.audience=3000;
const delta=150000-s.cash;s.cash=150000;s.weekly.cashStart=Math.round((s.weekly.cashStart+delta)*100)/100;
s.officeOffer=true;s=act(s,'officeRent');
if(s.weekly.stage!=='work')s.weekly.stage='work';s.paused=false;
assert(C.load(JSON.stringify(s)));

// Conferência rápida das regras de RH neste save
let h=act(s,'hrSearch',{id:'finance'});for(let i=0;i<20000&&!h.team.candidates;i++){if(h.weekly.stage==='report'){h=act(h,'readWeek');continue;}if(h.weekly.stage==='weekend'){h=act(h,'weekend',{choice:'work'});continue;}h=C.tick(h,.2);}
assert.equal(h.team.candidates.length,2);const fin=h.team.candidates[0];h=act(h,'hrHire',{id:fin.id});
const loan=C.loanStatus(h)[0];assert.equal(loan.amount,12000);assert.equal(loan.weeks,6);
h=act(h,'autoRestock',{on:true,threshold:h.stock+1,quantity:500});const before=h.stock;for(let i=0;i<50&&!h.crew;i++)h=C.tick(h,.2);assert(h.crew&&h.crew.quantity===500,'compra programada disparou');
console.log('RH ok: candidato',fin.name,'nível',fin.level,'· empréstimo',loan.amount,'em',loan.weeks,'semanas · compra programada disparou com estoque',before);

const state=JSON.stringify(s);
let html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-'+version+'.html','utf8');
const KEY='the-founder-cenario-nv8';
if(!html.includes("KEY='the-founder-contract-v1'"))throw Error('chave do save não encontrada');
html=html.replace("KEY='the-founder-contract-v1'","KEY='"+KEY+"'").replace('START_FRESH=true','START_FRESH=false');
html=html.replace('<script>','<script>try{if(!localStorage.getItem('+JSON.stringify(KEY)+')||location.hash==="#reset")localStorage.setItem('+JSON.stringify(KEY)+','+JSON.stringify(state)+');}catch(e){}</script><script>');
const out='dist/The-Founder-Cenario-NV8-Escritorio-'+version+'.html';fs.writeFileSync(out,html);
console.log('PASS:',out,'· vendas',s.sold,'· nota',avg.toFixed(2),'· seguidores',s.market.growth.audience,'· caixa',s.cash,'· estoque',s.stock,'· preço',s.price,'· avaliações',s.reviews.length,'· nível',s.level,'· semana',s.weekly.reports.length+1);
