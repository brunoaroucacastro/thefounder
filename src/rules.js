/* Pure domain rules: no DOM, globals, localStorage or callbacks in the plan. */
const GameRules=(()=>{
 const founders=typeof FounderRules!=='undefined'?FounderRules:require('./founder-rules.js');
 const markets=typeof MarketData!=='undefined'?MarketData:require('./market-data.js');
 const campaigns=typeof CampaignRules!=='undefined'?CampaignRules:require('./campaign-rules.js');
 const products=typeof ProductRules!=='undefined'?ProductRules:require('./product-rules.js');
 const finance=typeof FinanceRules!=='undefined'?FinanceRules:require('./finance-rules.js');
 const people=typeof PeopleRules!=='undefined'?PeopleRules:require('./people-rules.js');
 const copy=x=>JSON.parse(JSON.stringify(x)),limit=(x,a,b)=>Math.max(a,Math.min(b,x));
 const staff=[{name:'Lia',role:'Produto',salary:4500,color:'#be8066'},{name:'Caio',role:'Marketing',salary:3500,color:'#809ec1'},{name:'Nina',role:'Suporte',salary:2800,color:'#beac5e'},{name:'Ivo',role:'Financeiro',salary:3800,color:'#b49b72'}];
 const labels={develop:'Desenvolver produto',launch:'Lançar produto',research:'Ouvir clientes',price:'Ajustar preço',campaign:'Ajustar campanha',budget:'Orçamento de marketing',hire:'Contratar',promote:'Promover',fire:'Desligar',meeting:'Reunião da equipe',loan:'Captar R$ 20 mil',repay:'Amortizar dívida',target:'Escolher público'};
 function migrate(input,seed=Date.now()){
  const s=copy(input);if(s.schemaVersion>6)throw Error('Save de uma versão mais nova. Abra-o na versão correspondente.');
  if(!s.schemaVersion||s.schemaVersion<2){s.legacyUsed=limit(4-(s.actions??4),0,4);s.plan=[];s.planRevision=0;s.nextId=1;s.schemaVersion=2;}
  s.plan??=[];s.planRevision??=0;s.nextId??=1;s.legacyUsed??=0;s.rolls??=[];s.rng??=(seed>>>0)||123456789;s.companyId??='company-'+s.rng;
  s.marketId??=markets.ids[s.business]||'legacy-default';
  founders.ensure(s);campaigns.ensure(s);products.ensure(s);finance.ensure(s);people.ensure(s);s.rollSequence??=0;s.schemaVersion=6;
  s.team.forEach(p=>{if(!p.id)p.id='person-'+s.nextId++;});return s;
 }
 function rollD20(state,{label='D20',modifiers=[],difficulty=11,category=null}={},random){
  let u;if(random){u=random();}else{let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;u=state.rng/4294967296;}
  if(!(u>=0&&u<1))throw Error('Sorteio inválido');
  const natural=1+Math.floor(u*20),mods=[...modifiers,...founders.modifiers(state,category)].map(m=>({...m,label:String(m.label),value:Number(m.value)}));
  if(mods.some(m=>!Number.isFinite(m.value)))throw Error('Modificador inválido');
  const total=natural+mods.reduce((a,m)=>a+m.value,0),critical=natural===1;
  const r={id:state.companyId+'-die-'+(state.rollSequence=(state.rollSequence||0)+1),label,category,natural,modifiers:mods,total,difficulty,critical,outcome:critical?'critical':total>=difficulty?'success':'failure',month:state.month};state.rolls.push(r);state.rolls=state.rolls.slice(-100);return r;
 }
 function cost(s,a,meta){if(people.kinds.includes(a.type))return people.cost(s,a,meta);if(finance.kinds.includes(a.type))return finance.cost(s,a);if(products.kinds.includes(a.type))return products.cost(s,a);switch(a.type){case'campaign':return a.mode==='optimize'?500:0;case'develop':return 3000;case'research':return 500;case'hire':return meta.skills.includes('people')?600:1200;case'fire':return s.team.find(p=>p.id===a.personId)?.salary??0;case'repay':return Math.min(10000,s.debt);default:return 0;}}
 function apply(s,a,meta,context={}){
 if(people.kinds.includes(a.type)){people.validate(s,a,context.touched);const paid=people.cost(s,a,meta);if(s.cash<paid)throw Error('Caixa insuficiente para esta ação de pessoas.');s.cash-=paid;return {id:a.id,type:a.type,label:describe(a),cost:paid,...people.apply(s,a,{...context,roll:(state,options)=>rollD20(state,options,context.random)})};}
  if(finance.kinds.includes(a.type)){finance.validate(s,a,context.touched);const paid=finance.cost(s,a);if(s.cash<paid)throw Error('Caixa insuficiente para esta ação financeira.');s.cash-=paid;const effect=finance.apply(s,a,{...context,roll:(state,options)=>rollD20(state,options,context.random)});return {id:a.id,type:a.type,label:describe(a),cost:paid,...effect};}
  if(products.kinds.includes(a.type)){products.validate(s,a);const paid=products.cost(s,a);if(s.cash<paid)throw Error('Caixa insuficiente para esta tentativa.');s.cash-=paid;const effect=products.apply(s,a,{...context,meta,roll:(state,options)=>rollD20(state,options,context.random)});products.sync(s);return {id:a.id,type:a.type,label:describe(a),cost:paid,...effect};}
  if(['meeting','promote'].includes(a.type)){return apply(s,{...a,type:a.type==='meeting'?'people_meeting':'people_train'},meta,context);}
  if(!labels[a.type])throw Error('Ação desconhecida');
  const p=s.team.find(p=>p.id===a.personId);let n;
  if(['promote','fire'].includes(a.type)&&!p)throw Error('Pessoa não está na equipe nesta etapa.');
  if(a.type==='develop'&&s.quality>=100)throw Error('Qualidade já chegou ao máximo.');
  if(a.type==='launch'&&(s.launched||s.dev<2))throw Error('Lançar exige duas entregas anteriores e produto ainda não lançado.');
  if(a.type==='hire'&&(!staff[a.index]||s.team.length>=12))throw Error('Contratação indisponível.');
  if(a.type==='loan'&&s.debt>=60000)throw Error('Limite de crédito atingido.');
  if(a.type==='repay'&&s.debt<=0)throw Error('Não há dívida para amortizar.');
  if(a.type==='price'&&(!Number.isFinite(a.value)||a.value<29||a.value>249))throw Error('Preço inválido.');
  if(['budget','campaign'].includes(a.type))campaigns.validate(s,a,context.touched);
  if(a.type==='target'&&![0,1,2,3].includes(a.value))throw Error('Público inválido.');
  const paid=cost(s,a,meta);if(s.cash<paid)throw Error('Caixa insuficiente nesta etapa. Reordene ou remova ações.');s.cash-=paid;
  switch(a.type){
   case'develop':s.dev++;s.quality=limit(s.quality+Math.round((10+s.team.filter(p=>p.role==='Produto').reduce((v,p)=>v+p.level,0)*5)*s.motivation/100)+(meta.skills.includes('product')?3:0),0,100);s.motivation=limit(s.motivation-2,0,100);break;
   case'launch':s.launched=true;break;
   case'research':s.research++;s.quality=limit(s.quality+3,0,100);if(!meta.knowledge.includes('b2b'))meta.knowledge.push('b2b');break;
   case'price':s.price=a.value;break;
   case'budget':case'campaign':{const effect=campaigns.apply(s,a,{...context,roll:(state,options)=>rollD20(state,options,context.random)});return {id:a.id,type:a.type,label:describe(a),cost:paid,...effect};}
   case'target':s.target=a.value;break;
   case'hire':people.bump(s,5);s.team.push({...staff[a.index],motivation:82,id:'hire-'+a.id,level:1,...(a.index===1?{specialty:['ads','seo','social'].includes(a.specialty)?a.specialty:'ads'}:a.index===3?{specialty:['suppliers','credit','benchmarks'].includes(a.specialty)?a.specialty:'suppliers'}:{})});break;
   case'promote':p.salary=Math.round(p.salary*1.2);p.level++;s.motivation=limit(s.motivation+12,0,100);break;
   case'fire':s.team=s.team.filter(x=>x.id!==a.personId);people.bump(s,-5);break;
   case'meeting':s.motivation=limit(s.motivation+14,0,100);break;
   case'loan':s.finance.legacyBalance+=20000;s.cash+=20000;finance.sync(s);break;
   case'repay':finance.payoff(s,paid);break;
  }
  // Grandfather already-queued v0.6 decisions onto the migrated legacy product.
  const legacy=products.find(s,'legacy-product');if(legacy&&['develop','research','launch','price'].includes(a.type)){if(a.type==='develop'||a.type==='research'){legacy.level=Math.min(10,legacy.level+1);legacy.attributes=products.allocate(legacy.level,legacy.attributes);}if(a.type==='launch'){legacy.launched=true;legacy.launchMonth=s.month+1;legacy.nextObsolete=s.month+6;}if(a.type==='price')legacy.price=a.value;products.sync(s);}
  return {id:a.id,type:a.type,label:describe(a),cost:paid,status:'executed',...(a.type==='loan'?{credit:20000}:{})};
 }
 function describe(a){let label=({people_cancel:'Encerrar seleção',people_recruit:'Abrir seleção',people_hire:'Contratar candidato',people_train:'Treinar e promover',people_fire:'Desligar',people_meeting:'Reunião geral',finance_benchmark:'Pesquisar benchmark',finance_supplier:'Negociar fornecedor',finance_credit:'Consultar crédito',finance_accept:'Aceitar proposta',finance_repay:'Amortizar dívida',product_create:'Criar produto',product_develop:'Desenvolver produto',product_launch:'Lançar produto',product_research:'Pesquisar persona',product_price:'Reajustar produto',product_retire:'Arquivar produto'}[a.type])||labels[a.type]||a.type;if(a.role)label+=' · '+a.role;if(a.specialty&&a.role)label+=' · '+(people.specialties[a.role]?.[a.specialty]||a.specialty);if(a.supplierId)label+=' · '+finance.supplierNames[a.supplierId];if(a.bankId)label+=' · '+finance.banks.find(b=>b.id===a.bankId)?.name+' · R$ '+a.amount;if(a.type==='finance_repay')label+=' · R$ '+a.amount;if(a.productName||a.name)label+=' · '+(a.productName||a.name);if(a.type==='campaign')label+=' · '+({scale:'Escalar',reduce:'Reduzir',optimize:'Otimizar'}[a.mode]||'')+' · '+campaigns.names[a.channel]+(a.mode==='optimize'?'':' · R$ '+a.value+'/mês');if(a.type==='budget')label+=' · '+['Busca','SEO','Redes'][a.index]+' · R$ '+a.value+'/mês';if(a.type==='price')label+=' · R$ '+a.value;if(a.type==='hire')label+=' · '+(staff[a.index]?.name||'');if(a.personName)label+=' · '+a.personName;if(a.type==='target')label+=' · '+['18–24','25–34','35–54','55+'][a.value];return label;}
 function project(input,meta){let state=migrate(input),m=copy(meta),entries=[],errors=[],touched=new Set();
  if(state.plan.length>4-state.legacyUsed)errors.push({index:-1,message:'Máximo de quatro ações por mês.'});
  state.plan.forEach((a,index)=>{try{entries.push(apply(state,a,m,{preview:true,touched}));}catch(e){errors.push({index,message:e.message});entries.push({id:a.id,label:describe(a),status:'invalid',cost:0});}});
  const expenses=finance.rent(state)+state.team.reduce((n,p)=>n+p.salary,0)+campaigns.forecast(state)+finance.interest(state);
  const friendsDue=state.capital===1&&state.month+1>6?Math.min(state.friendsInstallment??1750,state.friendsDebt||0):0;
  return {state,meta:m,entries,errors,cost:entries.reduce((n,e)=>n+e.cost,0),expenses,friendsDue,principalDue:finance.principalDue(state),reserve:state.cash-expenses-friendsDue-finance.principalDue(state)};
 }
 function enqueue(input,meta,action){let s=migrate(input);if(s.ended)throw Error('Esta jornada terminou.');if(s.plan.length>=4-s.legacyUsed)throw Error('Agenda cheia. Remova uma ação para substituir.');const a={...action,id:s.companyId+'-'+s.nextId++};s.plan.push(a);const p=project(s,meta);if(p.errors.length)throw Error(p.errors.at(-1).message);s.planRevision++;return s;}
 function edit(input,index,direction){let s=migrate(input);if(index<0||index>=s.plan.length)return s;if(direction===0)s.plan.splice(index,1);else{let j=index+direction;if(j<0||j>=s.plan.length)return s;[s.plan[index],s.plan[j]]=[s.plan[j],s.plan[index]];}s.planRevision++;return s;}
 function token(s){return s.companyId+':'+s.month+':'+s.planRevision;}
 function resolve(input,meta,expected,context={}){
  let s=migrate(input);if(s.ended||token(s)!==expected)throw Error('Revisão expirou. Revise a agenda novamente.');const preview=project(s,meta);if(preview.errors.length)throw Error('Corrija a ordem ou remova as ações marcadas.');
  const startCash=s.cash,startMonth=s.month,entries=[];let m=copy(meta);
  // All mutations occur on a private clone; persist the complete result atomically.
  const touched=new Set();s.plan.forEach(a=>{const candidate=copy(s),candidateMeta=copy(m),candidateTouched=new Set(touched);try{const entry=apply(candidate,a,candidateMeta,{...context,touched:candidateTouched});s=candidate;m=candidateMeta;candidateTouched.forEach(i=>touched.add(i));entries.push(entry);}catch(e){entries.push({id:a.id,type:a.type,label:describe(a),cost:0,status:'skipped',note:'Não executada: '+e.message});}});s.plan=[];s.planRevision++;s.legacyUsed=0;
  let acquisition,reach,leads,newCustomers,marketing,churn,revenue,cogs,payroll,interest,profit,overload,rent,productSales=[];
  if(s.catalogStarted){
   products.sync(s);const cap=Math.round((45+s.team.filter(p=>p.role==='Suporte').reduce((a,p)=>a+p.level,0)*110+s.quality*2)*s.motivation/100);overload=Math.max(0,s.customers-cap)/Math.max(1,s.customers);
   const traffic=campaigns.acquire(s,{models:context.models,conversion:0}),sales=products.closeSales(s,traffic,{models:context.models,meta:m,overload});acquisition=sales.acquisition;({reach,leads,newCustomers}=acquisition);marketing=acquisition.spend;({churn,revenue,cogs}=sales);productSales=sales.rows;products.sync(s);
  }else{
  const market=context.models?.[s.business],willingness=(60+s.quality*.9)*(market?(market[6][0]*1.6+market[6][1]+market[6][2]*.65)/100:1);
  const conversion=.19*Math.exp(-((s.price/willingness)**1.8))*s.quality/65,cap=Math.round((45+s.team.filter(p=>p.role==='Suporte').reduce((a,p)=>a+p.level,0)*110+s.quality*2)*s.motivation/100),oldOverload=Math.max(0,s.customers-cap)/Math.max(1,s.customers);
  const oldAcquisition=campaigns.acquire(s,{models:context.models,conversion}),{reach:oldReach,leads:oldLeads,newCustomers:oldCustomers}=oldAcquisition,oldMarketing=oldAcquisition.spend,oldChurn=Math.round(s.customers*limit(.12-s.quality*.0009+oldOverload*.2-(s.budgets[1]>0&&!campaigns.blocked(s,1)?.008:0),.015,.45));s.customers=Math.max(0,s.customers-oldChurn+oldCustomers);
  const oldRevenue=s.customers*s.price,oldCogs=s.customers*(m.skills.includes('negotiation')?12:14)*s.finance.inflationFactor*(1+s.finance.suppliers.production.adjustment),oldPayroll=s.team.reduce((a,p)=>a+p.salary,0),oldInterest=s.debt*.025;
   acquisition=oldAcquisition;reach=oldReach;leads=oldLeads;newCustomers=oldCustomers;marketing=oldMarketing;churn=oldChurn;revenue=oldRevenue;cogs=oldCogs;overload=oldOverload;

  }
  payroll=s.team.reduce((a,p)=>a+p.salary,0);interest=finance.interest(s);rent=finance.rent(s);profit=revenue-cogs-payroll-rent-marketing-interest;
  s.cash+=profit;s.totalRevenue+=revenue;s.month++;s.actions=4;s.streak=profit>0?s.streak+1:0;
  const events=[...entries.filter(e=>e.note).map(e=>e.label+': '+e.note),...(s.catalogStarted?products.ageProducts(s):[])],monthRolls=entries.flatMap(e=>e.rollCards?e.rollCards.map(c=>c.die):e.die?[e.die]:[]);let eventCash=0,friendsPaid=0;const monthRoll=label=>{const r=rollD20(s,{label},context.random);monthRolls.push(r);return r;};
  if(s.month%3===0){const r=monthRoll('Evento do trimestre');if(r.natural<=6){eventCash=-1500;events.push(r.critical?'Falha crítica: pane no servidor · −R$ 1.500':'Pane no servidor · −R$ 1.500');}else if(r.natural<=13){eventCash=2000;events.push('Parceria extraordinária · +R$ 2.000');}else{people.bump(s,8);events.push('Elogio de cliente · ânimo +8');}s.cash+=eventCash;}
  if(s.capital===1&&s.month>6&&s.friendsDebt>0){const due=Math.min(s.friendsInstallment??1750,s.friendsDebt);if(s.cash>=due){s.cash-=due;s.friendsDebt-=due;friendsPaid=due;events.push('Parcela aos amigos paga.');}else{s.trust=limit(s.trust-15,0,100);events.push('Parcela aos amigos atrasada · confiança −15.');}}
  if(s.capital===3&&s.month%3===0){s.trust=limit(s.trust+(revenue>(s.history.at(-3)?.revenue||0)*1.2?8:-15),0,100);events.push('Confiança dos investidores: '+s.trust+'/100.');}
  const financeClose=finance.settleMonth(s);events.push(...financeClose.events);
  const peopleClose=people.settle(s,{entries,profit,revenue,roll:(state,options)=>rollD20(state,options,context.random)});events.push(...peopleClose.events);monthRolls.push(...peopleClose.rolls);
  const report={unitsSold:productSales.filter(p=>p.mode==='oneoff').reduce((n,p)=>n+p.units,0),subscriptionsBilled:productSales.filter(p=>p.mode==='recurring').reduce((n,p)=>n+p.units,0),activeSubscribers:s.products.reduce((n,p)=>n+(p.retired?0:p.active),0),newBuyers:newCustomers,peopleChanges:peopleClose.changes,creditReceived:entries.reduce((n,e)=>n+(e.credit||0),0),bankPrincipalPaid:financeClose.principalPaid,rent,month:s.month,revenue,cogs,payroll,marketing,interest,profit,reach,leads,newCustomers,churn,startCash,actionCost:entries.reduce((a,e)=>a+e.cost,0),eventCash,friendsPaid,cash:s.cash,entries,events,rolls:monthRolls,acquisition,productSales,token:expected};
  // history retains the canonical financial close, including financing and actions.
  s.history.push(report);s.lastMonthReport=report;s.lastResolvedToken=expected;
  if(s.cash<0){s.ended=true;const xp=2+Math.floor(s.month/3)+Math.floor(s.totalRevenue/100000);m.xp=(m.xp||0)+xp;m.runs=(m.runs||0)+1;report.bankruptcyXP=xp;}
  s.logs.unshift(...events.map(text=>({text,month:startMonth})),{text:'Fechamento: '+newCustomers+' novos clientes; resultado R$ '+profit+'.',month:startMonth});s.logs=s.logs.slice(0,35);
  return {state:s,meta:m,report,bankrupt:s.cash<0};
 }
 return {founders,people,finance,products,campaigns,migrate,rollD20,cost,describe,project,enqueue,edit,token,resolve};
})();
if(typeof module!=='undefined')module.exports=GameRules;
