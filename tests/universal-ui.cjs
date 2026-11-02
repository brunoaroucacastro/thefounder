const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
function boot(store=new Map()){
 const els=new Map(),raf=[],timers=[],graphics=new Proxy({},{get:(o,k)=>k in o?o[k]:()=>{}});let now=0;
 function element(id){if(!els.has(id))els.set(id,{id,innerHTML:'',textContent:'',style:{},listeners:{},classList:{add(){},remove(){}},addEventListener(type,fn){this.listeners[type]=fn;},getBoundingClientRect(){return {left:0,top:0,width:1200,height:570};},getContext(){return graphics;}});return els.get(id);}
 const local={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 const context=vm.createContext({document:{getElementById:element},window:{devicePixelRatio:1,matchMedia:()=>({matches:true}),confirm:()=>true,addEventListener(){}},localStorage:local,requestAnimationFrame:fn=>raf.push(fn),setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},console,Math,Date:class extends Date{static now(){return 123;}}});
 const html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-0.27.html','utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,8);assert(!/<script[^>]+src=|<link[^>]+stylesheet/.test(html));
 scripts.forEach(([,js],i)=>{vm.runInContext(js,context);if(i===5)vm.runInContext("for(const name of ['fresh','load','act','tick','enableEvolution','enableAccounting','enableBehavior']){const original=FirstLoop[name];FirstLoop[name]=function(...args){const result=original(...args);globalThis.__state=result;return result;};}",context);});
 function click(type,params={}){element('tray').listeners.click({target:{closest:()=>({disabled:false,dataset:{action:type,...params}})}});}
 function frames(count=1){for(let i=0;i<count;i++){now+=100;const next=raf.shift();assert(next,'RAF continua ativo');next(now);}}
 function until(phase,max=2000){let i=0;while(context.__state.phase!==phase&&i++<max)frames();assert.equal(context.__state.phase,phase);}
 return {store,el:element,click,frames,until,state:()=>context.__state,local,run:code=>vm.runInContext(code,context)};
}





const a=boot();a.click('start');a.click('product',{id:'headphones'});a.until('customer');assert.equal(a.state().universal,true);assert(a.el('tray').innerHTML.includes('Clara'));a.click('personaPage');assert(a.el('tray').innerHTML.includes('Leo'));a.click('customer',{id:'gamer'});for(let i=0;i<4;i++)a.click('attribute',{id:'performance',delta:'1'});assert.equal(a.state().attributes.performance,4);assert(a.el('tray').innerHTML.includes('6,67')||a.el('tray').innerHTML.includes('6.67'));a.click('reveal');a.click('place',{id:'online'});a.click('confirmPromotion');a.click('build');a.until('testReady');console.log('PASS UI universal: 10 personas paginadas, quatro pontos, nota técnica e desenvolvimento.');