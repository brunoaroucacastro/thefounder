/* Pure domain rules: no DOM, globals, localStorage or callbacks in the plan. */
const GameRules=(()=>{
 const copy=x=>JSON.parse(JSON.stringify(x)),limit=(x,a,b)=>Math.max(a,Math.min(b,x));
 const staff=[{name:'Lia',role:'Produto',salary:4500,color:'#be8066'},{name:'Caio',role:'Marketing',salary:3500,color:'#809ec1'},{name:'Nina',role:'Suporte',salary:2800,color:'#beac5e'}];
 const labels={develop:'Desenvolver produto',launch:'Lançar produto',research:'Ouvir clientes',price:'Ajustar preço',budget:'Orçamento de marketing',hire:'Contratar',promote:'Promover',fire:'Desligar',meeting:'Reunião da equipe',loan:'Captar R$ 20 mil',repay:'Amortizar dívida',target:'Escolher público'};
 function migrate(input,seed=Date.now()){
  const s=copy(input);if(s.schemaVersion>2)throw Error('Save de uma versão mais nova. Abra-o na versão correspondente.');
  if(s.schemaVersion!==2){s.legacyUsed=limit(4-(s.actions??4),0,4);s.plan=[];s.planRevision=0;s.nextId=1;s.schemaVersion=2;}
  s.plan??=[];s.planRevision??=0;s.nextId??=1;s.legacyUsed??=0;s.rolls??=[];s.rng??=(seed>>>0)||123456789;s.companyId??='company-'+s.rng;
  s.marketId??=['dnvb','wearables','electric-mobility','saas','games','ai-app','health-network','charging','shared-mobility','fintech','marketplace','edtech'][s.business]||'legacy-default';
  s.team.forEach(p=>{if(!p.id)p.id='person-'+s.nextId++;});return s;
 }
 function rollD20(state,{label='D20',modifiers=[],difficulty=11}={},random){
  let u;if(random){u=random();}else{let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;u=state.rng/4294967296;}
  if(!(u>=0&&u<1))throw Error('Sorteio inválido');
  const natural=1+Math.floor(u*20),mods=modifiers.map(m=>({label:String(m.label),value:Number(m.value)}));
  if(mods.some(m=>!Number.isFinite(m.value)))throw Error('Modificador inválido');
  const total=natural+mods.reduce((a,m)=>a+m.value,0),critical=natural===1;
  const r={label,natural,modifiers:mods,total,difficulty,critical,outcome:critical?'critical':total>=difficulty?'success':'failure',month:state.month};state.rolls.push(r);state.rolls=state.rolls.slice(-100);return r;
 }
 function cost(s,a,meta){switch(a.type){case'develop':return 3000;case'research':return 500;case'hire':return meta.skills.includes('people')?600:1200;case'fire':return s.team.find(p=>p.id===a.personId)?.salary??0;case'repay':return Math.min(10000,s.debt);default:return 0;}}
 function apply(s,a,meta){
  if(!labels[a.type])throw Error('Ação desconhecida');
  const p=s.team.find(p=>p.id===a.personId);let n;
  if(['promote','fire'].includes(a.type)&&!p)throw Error('Pessoa não está na equipe nesta etapa.');
  if(a.type==='develop'&&s.quality>=100)throw Error('Qualidade já chegou ao máximo.');
  if(a.type==='launch'&&(s.launched||s.dev<2))throw Error('Lançar exige duas entregas anteriores e produto ainda não lançado.');
  if(a.type==='hire'&&(!staff[a.index]||s.team.length>=12))throw Error('Contratação indisponível.');
  if(a.type==='loan'&&s.debt>=60000)throw Error('Limite de crédito atingido.');
  if(a.type==='repay'&&s.debt<=0)throw Error('Não há dívida para amortizar.');
  if(a.type==='price'&&(!Number.isFinite(a.value)||a.value<29||a.value>249))throw Error('Preço inválido.');
  if(a.type==='budget'&&(![0,1,2].includes(a.index)||![0,500,1500,3000,6000].includes(a.value)))throw Error('Orçamento inválido.');
  if(a.type==='target'&&![0,1,2,3].includes(a.value))throw Error('Público inválido.');
  const paid=cost(s,a,meta);if(s.cash<paid)throw Error('Caixa insuficiente nesta etapa. Reordene ou remova ações.');s.cash-=paid;
  switch(a.type){
   case'develop':s.dev++;s.quality=limit(s.quality+Math.round((10+s.team.filter(p=>p.role==='Produto').reduce((v,p)=>v+p.level,0)*5)*s.motivation/100)+(meta.skills.includes('product')?3:0),0,100);s.motivation=limit(s.motivation-2,0,100);break;
   case'launch':s.launched=true;break;
   case'research':s.research++;s.quality=limit(s.quality+3,0,100);if(!meta.knowledge.includes('b2b'))meta.knowledge.push('b2b');break;
   case'price':s.price=a.value;break;
   case'budget':s.budgets[a.index]=a.value;break;
   case'target':s.target=a.value;break;
   case'hire':s.team.push({...staff[a.index],id:'hire-'+a.id,level:1});break;
   case'promote':p.salary=Math.round(p.salary*1.2);p.level++;s.motivation=limit(s.motivation+12,0,100);break;
   case'fire':s.team=s.team.filter(x=>x.id!==a.personId);s.motivation=limit(s.motivation-8,0,100);break;
   case'meeting':s.motivation=limit(s.motivation+14,0,100);break;
   case'loan':s.debt+=20000;s.cash+=20000;break;
   case'repay':s.debt-=paid;break;
  }
  return {id:a.id,type:a.type,label:describe(a),cost:paid,status:'executed'};
 }
 function describe(a){let label=labels[a.type]||a.type;if(a.type==='budget')label+=' · '+['Busca','SEO','Redes'][a.index]+' · R$ '+a.value+'/mês';if(a.type==='price')label+=' · R$ '+a.value;if(a.type==='hire')label+=' · '+(staff[a.index]?.name||'');if(a.personName)label+=' · '+a.personName;if(a.type==='target')label+=' · '+['18–24','25–34','35–54','55+'][a.value];return label;}
 function project(input,meta){let state=migrate(input),m=copy(meta),entries=[],errors=[];
  if(state.plan.length>4-state.legacyUsed)errors.push({index:-1,message:'Máximo de quatro ações por mês.'});
  state.plan.forEach((a,index)=>{try{entries.push(apply(state,a,m));}catch(e){errors.push({index,message:e.message});entries.push({id:a.id,label:describe(a),status:'invalid',cost:0});}});
  const expenses=2000+state.team.reduce((n,p)=>n+p.salary,0)+state.budgets.reduce((n,v)=>n+v,0)+state.debt*.025;
  const friendsDue=state.capital===1&&state.month+1>6?Math.min(1750,state.friendsDebt||0):0;
  return {state,meta:m,entries,errors,cost:entries.reduce((n,e)=>n+e.cost,0),expenses,friendsDue,reserve:state.cash-expenses-friendsDue};
 }
 function enqueue(input,meta,action){let s=migrate(input);if(s.ended)throw Error('Esta jornada terminou.');if(s.plan.length>=4-s.legacyUsed)throw Error('Agenda cheia. Remova uma ação para substituir.');const a={...action,id:s.companyId+'-'+s.nextId++};s.plan.push(a);const p=project(s,meta);if(p.errors.length)throw Error(p.errors.at(-1).message);s.planRevision++;return s;}
 function edit(input,index,direction){let s=migrate(input);if(index<0||index>=s.plan.length)return s;if(direction===0)s.plan.splice(index,1);else{let j=index+direction;if(j<0||j>=s.plan.length)return s;[s.plan[index],s.plan[j]]=[s.plan[j],s.plan[index]];}s.planRevision++;return s;}
 function token(s){return s.companyId+':'+s.month+':'+s.planRevision;}
 function resolve(input,meta,expected,context={}){
  let s=migrate(input);if(s.ended||token(s)!==expected)throw Error('Revisão expirou. Revise a agenda novamente.');const preview=project(s,meta);if(preview.errors.length)throw Error('Corrija a ordem ou remova as ações marcadas.');
  const startCash=s.cash,startMonth=s.month,startRoll=s.rolls.length,m=copy(meta),entries=[];
  // All mutations occur on a private clone; persist the complete result atomically.
  s.plan.forEach(a=>entries.push(apply(s,a,m)));s.plan=[];s.planRevision++;s.legacyUsed=0;
  let marketing=s.budgets.reduce((a,b)=>a+b,0),exec=1+s.team.filter(p=>p.role==='Marketing').reduce((a,p)=>a+.18*p.level,0),reach=Math.round((Math.sqrt(s.budgets[0])*110+Math.sqrt(s.budgets[1])*95*(1+Math.min(s.month,18)*.04)+Math.sqrt(s.budgets[2])*230+200)*exec),leads=Math.round((Math.sqrt(s.budgets[0])*10+Math.sqrt(s.budgets[1])*9*(1+Math.min(s.month,18)*.04)+Math.sqrt(s.budgets[2])*4+15)*exec);
  const market=context.models?.[s.business],willingness=(60+s.quality*.9)*(market?(market[6][0]*1.6+market[6][1]+market[6][2]*.65)/100:1),share=market?market[5][s.target||0]/100:1,factor=market?Math.min(2,Math.sqrt(market[4]*share/25000))*Math.max(.1,1-s.customers/Math.max(1,market[4]*share)):1;
  const conversion=.19*Math.exp(-((s.price/willingness)**1.8))*s.quality/65,cap=Math.round((45+s.team.filter(p=>p.role==='Suporte').reduce((a,p)=>a+p.level,0)*110+s.quality*2)*s.motivation/100),overload=Math.max(0,s.customers-cap)/Math.max(1,s.customers),newCustomers=s.launched?Math.round(leads*conversion*factor):0,churn=Math.round(s.customers*limit(.12-s.quality*.0009+overload*.2-(s.budgets[1]>0?.008:0),.015,.45));s.customers=Math.max(0,s.customers-churn+newCustomers);
  const revenue=s.customers*s.price,cogs=s.customers*(m.skills.includes('negotiation')?12:14),payroll=s.team.reduce((a,p)=>a+p.salary,0),interest=s.debt*.025,profit=revenue-cogs-payroll-2000-marketing-interest;
  s.cash+=profit;s.totalRevenue+=revenue;s.month++;s.actions=4;s.streak=profit>0?s.streak+1:0;s.motivation=limit(s.motivation-4-(overload>.1?5:0),0,100);
  const events=[],monthRolls=[];let eventCash=0,friendsPaid=0;const monthRoll=label=>{const r=rollD20(s,{label},context.random);monthRolls.push(r);return r;};
  if(s.month%3===0){const r=monthRoll('Evento do trimestre');if(r.natural<=6){eventCash=-1500;events.push(r.critical?'Falha crítica: pane no servidor · −R$ 1.500':'Pane no servidor · −R$ 1.500');}else if(r.natural<=13){eventCash=2000;events.push('Parceria extraordinária · +R$ 2.000');}else{s.motivation=limit(s.motivation+8,0,100);events.push('Elogio de cliente · ânimo +8');}s.cash+=eventCash;}
  if(s.motivation<35&&s.team.length){const r=monthRoll('Risco de saída da equipe');if(r.natural<=7){const p=s.team.pop();events.push(p.name+' pediu demissão.');}}
  if(s.capital===1&&s.month>6&&s.friendsDebt>0){const due=Math.min(1750,s.friendsDebt);if(s.cash>=due){s.cash-=due;s.friendsDebt-=due;friendsPaid=due;events.push('Parcela aos amigos paga.');}else{s.trust=limit(s.trust-15,0,100);events.push('Parcela aos amigos atrasada · confiança −15.');}}
  if(s.capital===3&&s.month%3===0){s.trust=limit(s.trust+(revenue>(s.history.at(-3)?.revenue||0)*1.2?8:-15),0,100);events.push('Confiança dos investidores: '+s.trust+'/100.');}
  const report={month:s.month,revenue,cogs,payroll,marketing,interest,profit,reach,leads,newCustomers,churn,startCash,actionCost:entries.reduce((a,e)=>a+e.cost,0),eventCash,friendsPaid,cash:s.cash,entries,events,rolls:monthRolls,token:expected};
  // history retains the canonical financial close, including financing and actions.
  s.history.push(report);s.lastMonthReport=report;s.lastResolvedToken=expected;
  if(s.cash<0){s.ended=true;const xp=2+Math.floor(s.month/3)+Math.floor(s.totalRevenue/100000);m.xp=(m.xp||0)+xp;m.runs=(m.runs||0)+1;report.bankruptcyXP=xp;}
  s.logs.unshift(...events.map(text=>({text,month:startMonth})),{text:'Fechamento: '+newCustomers+' novos clientes; resultado R$ '+profit+'.',month:startMonth});s.logs=s.logs.slice(0,35);
  return {state:s,meta:m,report,bankrupt:s.cash<0};
 }
 return {migrate,rollD20,cost,describe,project,enqueue,edit,token,resolve};
})();
if(typeof module!=='undefined')module.exports=GameRules;
