const fs=require('fs'),vm=require('vm'),assert=require('assert');
const els=new Map(),storage=new Map();const context=new Proxy({},{get:()=>()=>{}});
function el(id){if(!els.has(id))els.set(id,{innerHTML:'',textContent:'',style:{},open:false,value:'Nova empresa',showModal(){this.open=true},close(){this.open=false},getContext(){return context},remove(){},addEventListener(){},getBoundingClientRect(){return {left:0,top:0,width:1280,height:800}}});return els.get(id)}
const ctx=vm.createContext({document:{getElementById:el},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{},requestAnimationFrame:()=>{},setTimeout:()=>1,clearTimeout:()=>{},console,Math});
vm.runInContext(fs.readFileSync('src/game.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('src/scene.js','utf8'),ctx);
function run(code){return vm.runInContext(code,ctx)}
run('develop();develop();launch();');assert.equal(run('s.launched'),true);assert.equal(run('s.actions'),1);run('advance()');assert(run('s.customers')>0);assert.equal(run('s.actions'),4);assert.equal(run('s.history.length'),1);
assert.equal(run('s.history[0].profit'),run('s.history[0].revenue-s.history[0].cogs-s.history[0].payroll-s.history[0].marketing-s.history[0].interest-2000'));
run('hire(0);hire(1);hire(2);meeting();');assert.equal(run('s.actions'),0);const cash=run('s.cash');run('develop()');assert.equal(run('s.cash'),cash);
for(let i=0;i<6;i++)run(`tab=${i};render()`);
run('s=fresh();s.cash=1;advance();');assert.equal(run('s.ended'),true);assert.equal(run('meta.runs'),1);assert(run('meta.xp')>=2);
run("meta.xp=6;unlock('product');newCompany();startNew();");assert.equal(run('s.ended'),false);assert.equal(run("skill('product')"),true);assert.equal(run('s.month'),0);
run('s.month=6;s.streak=3;s.cash=70000;s.customers=200;s.history=[{month:6,revenue:20000,profit:10000,cogs:2800,payroll:2000,marketing:3200,interest:0,reach:10000,leads:400,newCustomers:30,churn:10}];sell();');assert.equal(run('s.ended'),true);assert.equal(run('meta.wealth'),334000);
const saved=JSON.parse(storage.get('the-founder-v1'));assert.equal(saved.s.ended,true);
console.log('PASS: MVP, vendas, DRE, limite de ações, seis telas, falência, reinício, habilidades, venda e salvamento.');
vm.runInContext(fs.readFileSync('src/create.js','utf8'),ctx);
for(let i=0;i<12;i++){
 run('draft.model='+i+';step=1;creator()');
 assert.equal(run('models[draft.model][5].reduce((a,b)=>a+b,0)'),100);
 assert.equal(run('models[draft.model][6].reduce((a,b)=>a+b,0)'),100);
}
run('s.ended=true;draft.capital=1;foundCompany()');
assert.equal(run('s.cash'),35000);assert.equal(run('s.friendsDebt'),35000);
run('s.month=6;s.cash=100000;advance()');assert.equal(run('s.friendsDebt'),33250);
run('draft.capital=3;foundCompany()');assert.equal(run('s.equity'),.85);
run('draft.capital=2;foundCompany()');assert.equal(run('s.debt'),75000);
run('draft.capital=0;foundCompany()');assert.equal(run('s.cash'),12000);
console.log('PASS: 12 mercados, distribuições, quatro capitais, carência e participação.');
