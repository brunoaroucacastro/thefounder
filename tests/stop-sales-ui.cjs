const fs=require('fs'),assert=require('assert/strict');
const C=require('../src/first-loop/core.js');
const flags={gadgets:true,fourPs:true,bulkDice:true,evolution:true,accounting:true,behavior:true,universal:true,reach:true,commercial:true,modernGameplay:false};
const act=(s,type,args={},r=.6)=>C.act(s,{type,...args},{random:()=>r});
function until(s,phase,max=5000,accept=false,restock=false){for(let i=0;i<max&&s.phase!==phase;i++){if(s.phase==='opportunity')s=act(s,'offer',{choice:accept?'accept':'decline'});else {if(restock&&s.phase==='selling'&&s.stock<20&&!s.crew&&s.cash>=C.batchTotal(s,100))s=act(s,'crew',{task:'produce',quantity:100});s=C.tick(s,.2);}}assert.equal(s.phase,phase,'não chegou em '+phase);return s;}
let seed;for(let n=1;n<=30;n++){let s=act(C.fresh(n,flags),'start');s=act(s,'product',{id:'headphones'});if(s.personaCandidates.includes('music')){seed=n;break;}}assert(seed);
function launch(o={}){let s=act(C.fresh(seed,flags),'start');s=until(act(s,'product',{id:'headphones'}),'customer');s=act(s,'customer',{id:'music'});for(const [id,n]of Object.entries(o.attrs||{quality:2,performance:2}))for(let i=0;i<n;i++)s=act(s,'attribute',{id,delta:1});s=act(s,'reveal');s=act(s,'place',{id:o.place||'online'});for(let i=0;i<4;i++)s=act(s,'promoPoint',{id:o.promo||'creator',delta:1});s=act(s,'confirmPromotion');s=until(act(s,'build'),'testReady');s=act(s,'test',{},o.die??.6);s=act(s,'testChoice',{choice:s.quality===0?(o.repair?'repair':'risk'):s.quality>=2?'polish':'continue'});s=until(s,'batchPlanning');s=act(s,'confirmBatch');if(o.price!==undefined)s=act(s,'setPrice',{price:o.price});else if(o.margin!==undefined)s=act(s,'margin',{margin:o.margin});s=act(s,'confirmPrice');s=act(s,'rollCampaign',{},o.marketing??.6);s=act(s,'launchReview');return until(act(s,'launch'),'selling');}
function end(s,o={}){return until(s,'recap',6000,o.accept,o.restock);}
function again(s,scale=1){s=act(s,'newCampaign');s=act(s,'recampaignScale',{scale});s=until(act(s,'recampaignStart'),'recampaignReady');s=act(s,'rollRecampaign');return act(s,'recampaignContinue');}
function metrics(s){return {phase:s.phase,price:s.price,sold:s.sold,seen:s.sales?.seen,leads:s.leads,stock:s.stock,cash:s.cash,revenue:s.revenue,profit:C.result(s).profit,cacSpent:s.campaignCost,reserved:C.reserved(s),contribution:C.contribution(s).amount,reviews:s.reviews.length,stars:s.reviews.length?s.reviews.reduce((n,r)=>n+r.stars,0)/s.reviews.length:null,finish:s.sales?.finishReason};}


const vm=require('vm');
function boot(store=new Map()){
 const els=new Map(),raf=[],timers=[],graphics=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>{}});let now=0;
 function element(id){if(!els.has(id))els.set(id,{id,innerHTML:'',textContent:'',style:{},listeners:{},classList:{add(){},remove(){}},addEventListener(type,fn){this.listeners[type]=fn;},getBoundingClientRect(){return {left:0,top:0,width:1200,height:570};},getContext(){return graphics;}});return els.get(id);}
 const local={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 const context=vm.createContext({document:{getElementById:element},window:{devicePixelRatio:1,matchMedia:()=>({matches:true}),confirm:()=>true,addEventListener(){}},localStorage:local,requestAnimationFrame:fn=>raf.push(fn),setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},console,Math,Date:class extends Date{static now(){return 123;}}});
 const html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-0.33.html','utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,11);assert(!/<script[^>]+src=|<link[^>]+stylesheet/.test(html));
 scripts.forEach(([,js],i)=>{vm.runInContext(js,context);if(i===8)vm.runInContext("for(const name of ['fresh','load','act','tick','enableEvolution','enableAccounting','enableBehavior','enableReach']){const original=FirstLoop[name];FirstLoop[name]=function(...args){const result=original(...args);globalThis.__state=result;return result;};}",context);});
 function click(type,params={}){element('tray').listeners.click({target:{closest:()=>({disabled:false,dataset:{action:type,...params}})}});}
 function frames(count=1){for(let i=0;i<count;i++){now+=100;const next=raf.shift();assert(next,'RAF continua ativo');next(now);}}
 function until(phase,max=2000){let i=0;while(context.__state.phase!==phase&&i++<max)frames();assert.equal(context.__state.phase,phase);}
 return {store,el:element,click,frames,until,state:()=>context.__state,local,run:code=>vm.runInContext(code,context)};
}







const initial=launch({price:500,promo:'demo'}),key='the-founder-contract-v1',store=new Map([[key,JSON.stringify(initial)]]),a=boot(store);assert.equal(a.state().phase,'selling');assert(a.el('tray').innerHTML.includes('Encerrar vendas e rever estratégia'));a.frames(15);a.run('window.confirm=()=>false');a.click('stopSales');assert.equal(a.state().phase,'selling');a.run('window.confirm=()=>true');a.click('stopSales');assert.equal(a.state().phase,'recap');assert(a.el('tray').innerHTML.includes('Você interrompeu as vendas'));assert(a.el('tray').innerHTML.includes('Reajustar preço'));assert(a.el('tray').innerHTML.includes('Otimizar produto'));assert(a.el('tray').innerHTML.includes('Criar novo produto'));a.click('relaunchPrice');assert.equal(a.state().phase,'pricing');a.el('tray').listeners.change({target:{id:'sale-price',value:'95'}});a.click('confirmPrice');assert.equal(a.state().phase,'recampaignPlan');const b=boot(store);assert.equal(b.state().price,95);assert.equal(b.state().phase,'recampaignPlan');b.click('recampaignStart');b.until('recampaignReady');b.click('rollRecampaign');b.frames(5);b.click('recampaignContinue');assert.equal(b.state().phase,'selling');const cash=b.state().cash;b.frames(80);assert(b.state().sales.seen>initial.sales.seen);assert(b.el('tray').innerHTML.includes('Encerrar vendas'));b.click('stopSales');assert.equal(b.state().phase,'recap');assert.equal(b.state().projectCost,8000);assert.equal(boot(store).state().cash,b.state().cash);console.log('PASS UI interrupção: botão, confirmação cancelada/aceita, retorno às três decisões, preço, reload, nova campanha e encerramento sem duplicação.');
