/* Fictional finance simulation. Every draw uses the shared D20 engine. */
const FinanceRules=(()=>{
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),round=n=>Math.round(n*100)/100;
 const banks=[{id:'raiz',name:'Banco Raiz',rate:.025,dc:11},{id:'orbita',name:'Órbita Crédito',rate:.022,dc:13},{id:'ponte',name:'Banco Ponte',rate:.03,dc:10}];
 const supplierNames={production:'Produto / operação',rent:'Aluguel'};
 const categories=[{id:'cogs',name:'Custo variável'},{id:'payroll',name:'Pessoas'},{id:'marketing',name:'Marketing'},{id:'rent',name:'Aluguel'},{id:'interest',name:'Juros'}];
 const kinds=['finance_benchmark','finance_supplier','finance_credit','finance_accept','finance_repay'];
 function ensure(s){if(!s.finance)s.finance={legacyBalance:s.debt||0,loans:[],offers:[],creditScore:65,creditBlockedUntil:0,lastCreditRequest:-1,inflationFactor:1,lastInflationYear:Math.floor(s.month/12),suppliers:{production:{adjustment:0,availableAfter:0,offer:null},rent:{adjustment:0,availableAfter:0,offer:null}},benchmarks:[]};return s;}
 function sync(s){ensure(s);s.debt=round(s.finance.legacyBalance+s.finance.loans.reduce((n,l)=>n+l.balance,0));}
 function rent(s){ensure(s);return round((s.officeMode==='garage'&&s.team.length<3?500:2000)*s.finance.inflationFactor*(1+s.finance.suppliers.rent.adjustment));}
 function interest(s){ensure(s);return round(s.finance.legacyBalance*.025+s.finance.loans.reduce((n,l)=>n+l.balance*l.rate,0));}
 function principalDue(s){ensure(s);return round(s.finance.loans.reduce((n,l)=>n+(s.month+1>=l.nextDueMonth?Math.min(l.balance,l.installment+(l.overdue||0)):0),0));}
 function specialist(s,kind){return Math.min(4,Math.max(0,...s.team.filter(p=>p.role==='Financeiro'&&p.specialty===kind).map(p=>p.level)));}
 function modifiers(s,kind){const mods=[{label:'Especialista em '+({suppliers:'fornecedores',credit:'crédito',benchmarks:'pesquisa'}[kind]),value:specialist(s,kind)}];if(kind==='credit'){const last=s.history.at(-1);if(last){const flow=Number.isFinite(last.cash)&&Number.isFinite(last.startCash)?last.cash-last.startCash-(last.creditReceived||0):last.profit;mods.push({label:flow>0?'Geração de caixa':'Caixa em queda',value:flow>0?2:-2});}else mods.push({label:'Empresa sem histórico',value:-1});mods.push({label:'Score de crédito',value:clamp(Math.floor((s.finance.creditScore-50)/20),-2,2)});if(s.debt>Math.max(1,last?.revenue||0)*6)mods.push({label:'Endividamento elevado',value:-2});}return mods;}
 function findOffer(s,id){return s.finance.offers.find(o=>o.id===id&&o.status==='open');}
 function cost(s,a){return a.type==='finance_benchmark'?500:a.type==='finance_repay'?round(Math.min(a.amount,s.debt)):0;}
 function validate(s,a,touched){ensure(s);if(a.type==='finance_supplier'){const p=s.finance.suppliers[a.supplierId];if(!p)throw Error('Fornecedor inválido.');if(s.month<p.availableAfter)throw Error('Aguarde seis meses entre negociações deste fornecedor.');if(p.offer?.status==='open')throw Error('Conclua a oferta pendente.');if(touched?.has('supplier-'+a.supplierId))throw Error('Uma negociação por fornecedor nesta rodada.');}
  if(a.type==='finance_credit'){if(!banks.some(b=>b.id===a.bankId)||![10000,20000,40000,80000].includes(a.amount))throw Error('Escolha banco e valor válidos.');if(s.month<s.finance.creditBlockedUntil)throw Error('Crédito bloqueado após falha crítica.');if(s.finance.lastCreditRequest===s.month)throw Error('Uma consulta de crédito por mês.');if(s.debt+a.amount>200000)throw Error('Limite de dívida desta demo: R$ 200 mil.');if(s.finance.offers.some(o=>o.status==='open'&&s.month<=o.expiresAt))throw Error('Aceite ou descarte a proposta pendente antes de consultar outro banco.');}
  if(a.type==='finance_accept'){const o=findOffer(s,a.offerId);if(!o||s.month>o.expiresAt)throw Error('Proposta indisponível ou expirada.');if(s.debt+o.amount>200000)throw Error('Oferta excede o limite de dívida.');}
  if(a.type==='finance_repay'&&(!Number.isFinite(a.amount)||a.amount<.01||s.debt<=0))throw Error('Informe uma amortização positiva para uma dívida existente.');
 }
 function payoff(s,amount){let left=amount,used=0;const legacy=Math.min(left,s.finance.legacyBalance);s.finance.legacyBalance=round(s.finance.legacyBalance-legacy);left-=legacy;used+=legacy;for(const loan of [...s.finance.loans].sort((a,b)=>b.rate-a.rate)){const value=Math.min(left,loan.balance);loan.balance=round(loan.balance-value);loan.overdue=round(Math.max(0,(loan.overdue||0)-value));used+=value;left-=value;}sync(s);return round(used);}
 function benchmarkTarget(s,key){const physical=['dnvb','wearables','electric-mobility','gadgets','fashion','consumables','beauty','pet','home-garden'].includes(s.marketId);return (physical?{cogs:45,payroll:15,marketing:18,rent:8,interest:3}:{cogs:15,payroll:30,marketing:25,rent:6,interest:3})[key];}
 function apply(s,a,{preview=false,roll,touched}={}){
  validate(s,a,touched);const f=s.finance;
  if(a.type==='finance_benchmark'){
   if(preview)return {status:'planned'};
   const select=roll(s,{label:'Categoria do benchmark',modifiers:[],difficulty:1});select.kind='selection';const category=categories[(select.natural-1)%categories.length];
   const die=roll(s,{label:'Pesquisar benchmark · '+category.name,modifiers:modifiers(s,'benchmarks'),difficulty:11});let note='Pesquisa inconclusiva: nenhum benchmark confiável foi registrado.';
   if(!die.critical&&die.total>=11){const value=benchmarkTarget(s,category.id),width=Math.max(0,20-die.total)*2,offset=.25+((select.natural*7)%11)/20,low=Math.max(0,Math.floor(value-width*offset)),high=Math.ceil(value+width*(1-offset));f.benchmarks.push({id:a.id,category:category.id,name:category.name,low,high,month:s.month+1,confidence:die.total>=20?'Exata':die.total>=16?'Alta':'Parcial'});note=category.name+': referência simulada '+low+'% a '+high+'% da receita.';}
   return {status:die.critical?'critical':die.outcome,die,rollCards:[{die:select,display:{tone:'neutral',title:'CATEGORIA ESCOLHIDA',effect:category.name,target:'SORTEIO',targetValue:'D20',rule:'O dado escolhe um dos cinco custos.',label:'O que vamos investigar?'}},{die}],note};
  }
  if(a.type==='finance_supplier'){
   touched?.add('supplier-'+a.supplierId);const p=f.suppliers[a.supplierId],before=p.adjustment;p.availableAfter=s.month+6;
   if(preview)return {status:'planned'};
   const die=roll(s,{label:'Negociar · '+supplierNames[a.supplierId],modifiers:modifiers(s,'suppliers'),difficulty:11});let note;
   if(die.critical||die.total<=10){p.adjustment=die.critical?.05:Math.min(.05,Math.ceil((11-die.total)/2)/100);p.offer=null;note='Negociação fracassou: novo custo '+Math.round(p.adjustment*100)+'% maior a partir do próximo mês. Nova tentativa em seis meses.';}
   else{const discount=clamp(die.total-10,1,10)/100;p.offer={id:a.id,supplierId:a.supplierId,status:'open',discount,score:die.total,attempts:0,failures:0,expiresAt:s.month+1};note='Oferta: '+Math.round(discount*100)+'% de desconto. Aceite ou insista até duas vezes após o fechamento; vigência no próximo mês.';}
   // Supplier conditions obtained during a close affect the following month.
   p.pendingAdjustment=p.adjustment;p.adjustment=before;
   return {status:die.critical?'critical':die.outcome,die,supplierId:a.supplierId,note};
  }
  if(a.type==='finance_credit'){
   f.lastCreditRequest=s.month;const bank=banks.find(b=>b.id===a.bankId);if(preview)return {status:'planned'};
   const die=roll(s,{label:'Crédito · '+bank.name,modifiers:modifiers(s,'credit'),difficulty:bank.dc});let note;
   if(die.critical){f.creditScore=clamp(f.creditScore-20,0,100);f.creditBlockedUntil=s.month+4;note='Falha crítica: proposta negada e três meses seguintes sem consultas a bancos.';}
   else if(die.total<bank.dc){f.creditScore=clamp(f.creditScore-5,0,100);note='Crédito negado. Você pode consultar outro banco no próximo mês.';}
   else{const rate=Math.max(.008,bank.rate-(die.total-bank.dc)*.001),months=die.total>=20?24:die.total>=15?18:12,grace=die.total>=18?2:die.total>=15?1:0;const offer={id:'offer-'+a.id,bankId:bank.id,bankName:bank.name,amount:a.amount,rate,months,grace,expiresAt:s.month+3,status:'open'};f.offers.push(offer);note='Proposta recebida: R$ '+a.amount+', '+(rate*100).toFixed(2)+'%/mês, '+months+' parcelas, '+grace+' mês(es) de carência do principal. Aceite pela agenda; dinheiro ainda não entrou.';}
   return {status:die.critical?'critical':die.outcome,die,note};
  }
  if(a.type==='finance_accept'){
   const o=findOffer(s,a.offerId);o.status='accepted';s.cash+=o.amount;f.loans.push({id:'loan-'+a.id,bankName:o.bankName,original:o.amount,balance:o.amount,rate:o.rate,installment:round(o.amount/o.months),overdue:0,nextDueMonth:s.month+1+o.grace});sync(s);return {status:'executed',credit:o.amount,note:'Crédito recebido. Juros mensais sobre o saldo; carência adia apenas a amortização.'};
  }
  if(a.type==='finance_repay'){const paid=payoff(s,Math.min(a.amount,s.debt));return {status:'executed',principal:paid,note:'Dívida amortizada em R$ '+paid+'.'};}
 }
 function respondSupplier(input,supplierId,choice,{roll,insertAfter}={}){
  if(input.ended)throw Error('Esta empresa já encerrou.');const s=JSON.parse(JSON.stringify(input)),p=s.finance.suppliers[supplierId],o=p?.offer;if(!o||o.status!=='open'||s.month>o.expiresAt)throw Error('Oferta indisponível.');
  let entry=null;if(choice==='accept'){p.adjustment=-o.discount;o.status='accepted';}
  else if(choice==='reject'){o.status='rejected';}
  else if(choice==='insist'){
   if(o.attempts>=2)throw Error('As duas insistências já foram usadas.');o.attempts++;const die=roll(s,{label:'Insistir · '+supplierNames[supplierId],modifiers:modifiers(s,'suppliers'),difficulty:o.score});let note;
   if(die.critical){p.adjustment=.05;o.status='lost';note='Falha crítica: fornecedor perdido, custo +5%. Negociação encerrada.';}
   else if(die.total>=o.score){o.score=die.total;o.discount=Math.max(o.discount,clamp(die.total-10,1,10)/100);note='Oferta atual: '+Math.round(o.discount*100)+'% de desconto. '+(2-o.attempts)+' insistência(s) restante(s).';}
   else{o.failures++;if(o.failures>=2){o.status='lost';note='Segunda insistência malsucedida: oferta retirada. Condição anterior mantida.';}else note='Insistência falhou. A oferta anterior foi mantida.';}
   entry={id:o.id+'-insist-'+o.attempts,type:'finance_supplier',substep:true,parentActionId:o.id,label:'Insistir · '+supplierNames[supplierId],status:die.critical?'critical':die.outcome,cost:0,die,supplierId,note};s.lastMonthReport.entries.push(entry);s.lastMonthReport.events.push(note);const index=Number.isInteger(insertAfter)?insertAfter+1:s.lastMonthReport.rolls.length;s.lastMonthReport.rolls.splice(index,0,die);
  }else throw Error('Escolha inválida.');
  if(s.history.length)s.history[s.history.length-1]=s.lastMonthReport;s.planRevision++;return {state:s,entry};
 }
 function settleMonth(s){ensure(s);let principalPaid=0;const events=[];if(s.officeMode==='garage'&&s.team.length>=3){s.officeMode='office';events.push('Equipe ampliada: aluguel base do escritório R$ 2.000/mês.');}
  for(const l of s.finance.loans){if(!l.balance||s.month<l.nextDueMonth)continue;const due=Math.min(l.balance,l.installment+(l.overdue||0)),paid=round(Math.min(due,Math.max(0,s.cash)));s.cash=round(s.cash-paid);l.balance=round(l.balance-paid);l.overdue=round(due-paid);principalPaid=round(principalPaid+paid);l.nextDueMonth=s.month+1;if(paid<due){s.finance.creditScore=clamp(s.finance.creditScore-10,0,100);events.push(l.bankName+': amortização em atraso de R$ '+l.overdue+'.');}else s.finance.creditScore=clamp(s.finance.creditScore+1,0,100);}
  for(const p of Object.values(s.finance.suppliers)){if(p.pendingAdjustment!==undefined){p.adjustment=p.pendingAdjustment;delete p.pendingAdjustment;}if(p.offer?.status==='open'&&s.month>p.offer.expiresAt){p.offer.status='expired';events.push('Uma oferta de fornecedor expirou.');}}
  for(const o of s.finance.offers)if(o.status==='open'&&s.month>o.expiresAt)o.status='expired';
  const year=Math.floor(s.month/12);if(year>s.finance.lastInflationYear){s.finance.inflationFactor*=Math.pow(1.03,year-s.finance.lastInflationYear);s.finance.lastInflationYear=year;events.push('Inflação anual: custos variáveis e aluguel +3% a partir do próximo mês.');}
  sync(s);return {principalPaid,events};
 }
 return {banks,categories,supplierNames,kinds,ensure,sync,rent,interest,principalDue,specialist,modifiers,findOffer,cost,validate,payoff,benchmarkTarget,apply,respondSupplier,settleMonth};
})();
if(typeof module!=='undefined')module.exports=FinanceRules;
