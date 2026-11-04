const assert=require('node:assert/strict');
const {C,act,flags}=require('./modern-support.cjs');
function step(s,n=1){for(let i=0;i<n;i++){const day=s.weekly.days;for(let j=0;j<121&&s.weekly.days===day&&s.weekly.stage==="work";j++)s=C.tick(s,.3/s.speed);}return s;}
function choose(s,choice='study'){return act(act(s,'readWeek'),'weekend',{choice});}
function scenario(speed){
 let s=C.enableWeekly(C.fresh(3,{...flags,traction:true}));
 s=act(act(s,'start'),'speed',{value:speed});
 s=act(s,'product',{id:'headphones'});
 s=step(s,2);
 assert.equal(s.weekly.days,2);
 s=act(s,'customer',{id:s.personaCandidates[0]});
 s=act(s,'attribute',{id:'quality',delta:1});
 s=act(s,'reveal');
 assert.deepEqual(C.tick(s,180),s);
 s=act(act(s,'confirmPromotion'),'build');
 assert.equal(s.job.daysRequired,5);
 s=step(s,3);
 assert.equal(s.weekly.stage,'report');
 assert.equal(s.job.elapsed,180);
 assert.equal(s.weekly.reports[0].result,-9000);
 assert.equal(s.weekly.reports[0].cashEnd,16000);
 assert.deepEqual(C.tick(s,120),s);
 s=C.load(JSON.stringify(s));
 assert.throws(()=>act(s,'weekend',{choice:'rest'}));
 s=act(s,'readWeek');
 assert.throws(()=>act(s,'weekend',{choice:'study'}));
 s=act(s,'weekend',{choice:'work'});
 assert.equal(s.weekly.effect.workRate,.95);
 assert.throws(()=>act(s,'weekend',{choice:'work'}));
 s=step(s,2);
 assert.equal(s.phase,'building');
 s=step(s);
 assert.equal(s.phase,'testReady');
 s=act(s,'test',{},18);
 s=act(s,'testChoice',{choice:'continue'});
 assert.equal(s.job.daysRequired,5);
 for(let i=0;i<5;i++){
  if(s.weekly.stage==='report')s=choose(s,'rest');
  s=step(s);
 }
 assert.equal(s.phase,'batchPlanning');
 if(s.weekly.stage==='report')s=choose(s,'rest');
 s=act(act(s,'confirmBatch'),'confirmPrice');
 s=act(s,'launchAndRoll');
 assert.equal(s.revenue,0);
 s=act(s,'ackLaunch');
 while(s.phase==='launching')s=C.tick(s,.3/s.speed);
 assert.equal(s.phase,'selling');
 assert.equal(s.revenue,0);
 for(let i=0;i<12&&s.phase!=='recap';i++){
  if(s.weekly.stage==='report')s=choose(s,'rest');
  s=step(s);
 }
 assert.equal(s.phase,'recap');
 assert(s.revenue>0);
 while(s.weekly.stage==='work')s=step(s);
 s=choose(s,'study');
 assert.equal(s.weekly.insights.length,1);
 assert.equal(C.load(JSON.stringify(s)).weekly.insights.length,1);
 for(const r of s.weekly.reports)assert(Math.abs(r.cashStart+r.inflow-r.outflow-r.cashEnd)<.011);
 assert.equal(s.weekly.reports.reduce((n,r)=>n+r.revenue,0).toFixed(2),s.revenue.toFixed(2));
 return {days:s.weekly.days,clock:s.clock,cash:s.cash,sold:s.sold,weekly:s.weekly.reports};
}
assert.deepEqual(scenario(1),scenario(2));
assert.deepEqual(scenario(1),scenario(4));
const fixed=C.enableWeekly(C.fresh(3,flags));
fixed.weekly.obligations.push({id:'office',startDay:2,amount:500});
let s=step(act(fixed,'start'),5);
assert.equal(s.weekly.reports[0].expenses.fixed,300);
s=C.load(JSON.stringify(s));
assert.equal(C.tick(s,120).cash,24700);
console.log('PASS: cinco dias úteis, velocidades equivalentes, fechamento, caixa, save e escolhas de fim de semana.');
