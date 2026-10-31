const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
// Integration harness, not a browser/layout test. Executes the shipped scripts.
function boot(storage=new Map()){
 let now=0,nextTimer=1;const timers=new Map();
 function schedule(fn,delay=0){const id=nextTimer++;timers.set(id,{fn,at:now+delay});return id;}
 function advanceTime(ms){const until=now+ms;let count=0;while(true){const next=[...timers].filter(([,v])=>v.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;if(count++>10000)throw Error('Timer loop');now=next[1].at;timers.delete(next[0]);next[1].fn();}now=until;}
 const els=new Map(),ctx2d=new Proxy({},{get:()=>()=>{}}),world={html:'',insertAdjacentHTML(_,html){this.html+=html;},querySelector(){return {textContent:''}}};
 const el=id=>{if(!els.has(id))els.set(id,{innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){}},open:false,value:'Nova empresa',showModal(){this.open=true},close(){this.open=false},remove(){},querySelector(sel){return sel==='.world'?world:null},getContext(){return ctx2d},addEventListener(){},getBoundingClientRect(){return {left:0,top:0,width:1280,height:800}}});return els.get(id);};
 const ctx=vm.createContext({document:{getElementById:el},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{},Date:class extends Date {static now(){return 123456789}},requestAnimationFrame:()=>{},setTimeout:schedule,clearTimeout:id=>timers.delete(id),console,Math});
 for(const f of ['campaign-rules','product-rules','finance-rules','people-rules','rules','game','scene','create','planner','product-ui','finance-ui','people-ui','dice'])vm.runInContext(fs.readFileSync('src/'+f+'.js','utf8'),ctx,{filename:f+'.js'});
 return {run:code=>vm.runInContext(code,ctx),storage,el,world,advanceTime};
}
let app=boot();const run=code=>app.run(code);
run('develop();develop();launch();');assert.equal(run('s.launched'),false);assert.equal(run('s.cash'),60000);assert.equal(run('s.plan.length'),3);assert.equal(run('s.actions'),1);assert(run('product()').includes('Prévia da agenda'));
run('advance()');assert.equal(run('s.month'),0);assert(app.el('modalBody').innerHTML.includes('Aprovar e executar'));
run('closeModal()');assert.equal(run('s.month'),0);assert.equal(run('s.dev'),0);
const before=run('s.cash');run('reviewMonth();approveMonth();approveMonth()');assert.equal(run('s.month'),1);assert.equal(run('s.launched'),true);assert.equal(run('s.cash'),run('s.lastMonthReport.cash'));assert(run('s.cash')<before);assert.equal(run('s.plan.length'),0);
run('queueAction("hire",{index:0});queueAction("hire",{index:1,specialty:"ads"});queueAction("hire",{index:2});meeting()');assert.equal(run('s.team.length'),0);assert.equal(run('s.plan.length'),4);run('develop()');assert.equal(run('s.plan.length'),4);
run('reviewMonth();editPlan(3,0);editPlan(1,-1)');assert.equal(run('s.plan.length'),3);run('closeModal()');assert.equal(run('s.team.length'),0);
app=boot(app.storage);assert.equal(run('s.plan.length'),3);assert.equal(run('s.team.length'),0);run('reviewMonth();approveMonth()');assert.equal(run('s.team.length'),3);
for(let i=0;i<6;i++)run('tab='+i+';render()');
run('s.cash=1;save();reviewMonth();approveMonth()');assert.equal(run('s.ended'),true);assert.equal(run('meta.runs'),1);
run('draft.capital=1;foundCompany();s.cash=100000;s.month=6;save();reviewMonth();approveMonth()');assert.equal(run('s.friendsDebt'),47500);assert.equal(run('s.cash'),run('s.lastMonthReport.cash'));
run('draft.capital=3;foundCompany()');assert.equal(run('s.equity'),.85);
run('draft.capital=2;foundCompany()');assert.equal(run('s.debt'),80000);
run('draft.capital=0;foundCompany()');assert.equal(run('s.cash'),25000);
run('s.month=6;s.streak=3;s.cash=70000;s.customers=200;s.history=[{month:6,revenue:20000,profit:10000,cogs:2800,payroll:2000,marketing:3200,interest:0,reach:10000,leads:400,newCustomers:30,churn:10}];sell()');assert.equal(run('s.ended'),true);assert.equal(run('meta.wealth'),334000);
// Failed persistence must not advance a month or apply any charges.
run('draft.capital=0;foundCompany();develop();reviewMonth();localStorage.setItem=()=>{throw Error("disco cheio")};approveMonth()');assert.equal(run('s.month'),0);assert.equal(run('s.cash'),25000);assert.equal(run('s.plan.length'),1);
console.log('✓ Integração: planejamento, prévia, cancelar, aprovação única, reload, finanças, falência, capitais, venda e falha de persistência.');
const shared=new Map(),first=boot(shared),second=boot(shared);
first.run('develop()');const latest=shared.get('the-founder-v1');second.run('meeting()');assert.equal(shared.get('the-founder-v1'),latest);assert.equal(second.run('s.plan.length'),0);
const migrated=JSON.parse(latest);delete migrated.s.schemaVersion;delete migrated.s.plan;migrated.s.actions=2;const legacyRaw=JSON.stringify(migrated),legacyStore=new Map([['the-founder-v1',legacyRaw]]);const legacy=boot(legacyStore);assert(legacyStore.has('the-founder-v1-backup-before-agenda'));assert.equal(legacy.run('s.legacyUsed'),2);legacy.run('meeting();meeting();meeting()');assert.equal(legacy.run('s.plan.length'),1);
console.log('✓ Integração: aba desatualizada não sobrescreve agenda; migração cria backup e respeita ações já gastas.');
const campaignApp=boot();const mkt=code=>campaignApp.run(code);
mkt('tab=2;render()');assert(campaignApp.el('content').innerHTML.includes('ROAS DO ÚLTIMO MÊS'));assert(campaignApp.el('content').innerHTML.includes('campaignBudget0'));
campaignApp.el('campaignBudget0').value='6000';mkt('campaignRisk(0)');assert(campaignApp.el('campaignRisk0').textContent.includes('agressiva'));
const startingCash=mkt('s.cash');mkt("campaignAction(0,'scale')");assert.equal(mkt('s.budgets[0]'),500);assert.equal(mkt('s.cash'),startingCash);assert.equal(mkt('s.plan[0].type'),'campaign');
mkt('reviewMonth()');assert(campaignApp.el('modalBody').innerHTML.includes('resultado incerto'));mkt('editPlan(0,0);closeModal()');assert.equal(mkt('s.plan.length'),0);
mkt('hire(1)');assert(campaignApp.el('modalBody').innerHTML.includes('Que talento'));assert.equal(mkt('s.plan.length'),0);
mkt("closeModal();queueAction('hire',{index:1,specialty:'seo'});queueAction('campaign',{channel:1,mode:'optimize'});reviewMonth();approveMonth()");assert.equal(mkt('s.team[0].specialty'),'seo');assert.equal(mkt('s.lastMonthReport.rolls.length'),2);assert.equal(mkt('s.cash'),mkt('s.lastMonthReport.cash'));assert(campaignApp.el('modalBody').innerHTML.includes('Rolar D20'));mkt('skipDice()');assert(campaignApp.el('modalBody').innerHTML.includes('ROAS de aquisição'));
const resumed=boot(campaignApp.storage);assert.equal(resumed.run('s.team[0].specialty'),'seo');assert.equal(resumed.run('s.lastMonthReport.rolls.length'),2);
const phase1Save=JSON.parse(campaignApp.storage.get('the-founder-v1'));phase1Save.s.schemaVersion=2;delete phase1Save.s.campaigns;delete phase1Save.s.audienceExposure;const upgradeStore=new Map([['the-founder-v1',JSON.stringify(phase1Save)]]);const upgrade=boot(upgradeStore);assert.equal(upgrade.run('s.schemaVersion'),6);assert(upgradeStore.has('the-founder-v1-backup-before-campaigns'));
console.log('✓ Integração MKT: cartões, risco de escala, agenda, revisão D20, especialidade, relatório, retomada e backup da Fase 1.');
module.exports=boot;
