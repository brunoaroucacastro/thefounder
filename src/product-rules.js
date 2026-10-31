/* Product economy. All randomness is provided by the shared D20 engine. */
const ProductRules=(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sum=a=>a.reduce((n,v)=>n+v,0);
 const axes=['Qualidade','Personalização','Originalidade','Recursos'];
 const opposites=['Preço acessível','Padronização','Familiaridade','Simplicidade'];
 const ages=['18–24','25–34','35–54','55+'],classes=['A','B','C'];
 const ideals=[[1,3,3,3],[2,3,3,2],[4,2,1,3],[7,1,1,1]];
 const kinds=['product_create','product_develop','product_launch','product_research','product_price','product_retire'];
 function ensure(s){
  s.marketResearch??={};
  if(!s.products){s.products=[];if(s.dev>0||s.launched){const level=clamp(Math.round((s.quality||40)/10),4,10),attrs=allocate(level,[4,2,2,2]);s.products.push({id:'legacy-product',familyId:'legacy-product',name:'Flow',generation:1,mode:'recurring',scale:'lean',age:s.target||0,income:1,level,attributes:attrs,blueprint:allocate(4,attrs),price:s.price||89,launched:!!s.launched,retired:false,active:s.customers||0,uniqueBuyers:s.customers||0,launchMonth:s.launched?s.month:null,nextObsolete:s.launched?s.month+6:null,history:[],migrated:true});}s.catalogStarted=!!s.products.length;}
  return s;
 }
 function allocate(points,weights){const total=sum(weights)||1,out=weights.map(v=>Math.floor(v/total*points));for(let i=0;sum(out)<points;i++)out[i%4]++;return out;}
 function find(s,id){return s.products.find(p=>p.id===id);}
 function ideal(age,income){const v=[...ideals[age]];if(income===0){v[0]+=2;v[3]++;}if(income===2){v[0]=Math.max(.5,v[0]-1);v[3]=Math.max(.5,v[3]-1);}return v.map(n=>n/sum(v));}
 function sector(s){const physical=['dnvb','wearables','electric-mobility','gadgets','fashion','consumables','beauty','pet','home-garden'].includes(s.marketId);return {physical,basePrice:physical?150:100,baseCost:physical?24:9};}
 function unitCost(s,p,meta={skills:[]}){const [q,c,n,f]=p.attributes,b=sector(s).baseCost;return Math.round(b*(1+q*.14+c*.12+n*.10+f*.16)*(p.scale==='lean'?1.25:1)*(meta.skills?.includes('negotiation')?.86:1)*100)/100;}
 function fit(p){if(!p.level)return 0;const target=ideal(p.age,p.income),shape=p.attributes.map(v=>v/Math.max(1,sum(p.attributes)));return clamp(1-sum(shape.map((v,i)=>Math.abs(v-target[i])))/2,0,1);}
 function willingness(s,p){return sector(s).basePrice*[1.8,1,.65][p.income]*(.6+p.level*.1)*(.5+fit(p)*.7)*(p.scale==='lean'?.85:1);}
 function nps(s,p){return clamp(Math.round((fit(p)-.55)*140+(p.level-4)*6-Math.max(0,(p.price||0)/Math.max(1,willingness(s,p))-.75)*90),-100,100);}
 function marketSize(s,p,models){const m=models?.[s.business];return Math.max(0,Math.floor(m?m[4]*m[5][p.age]/100*m[6][p.income]/100:100000));}
 function stage(p,size){const share=size?p.uniqueBuyers/size:1;if(share>=1)return {name:'Fim do ciclo',factor:0,share};if(share>=.84)return {name:'Declínio',factor:.12,share};if(share>=.50)return {name:'Maioria tardia',factor:.55,share};if(share>=.15)return {name:'Maioria inicial',factor:1,share};if(share>=.025)return {name:'Early adopters',factor:.45,share};return {name:'Inovadores',factor:.25,share};}
 function conversion(s,p,models){if(!p.launched||p.retired||p.price===null||p.price>=willingness(s,p))return 0;const life=stage(p,marketSize(s,p,models));const chasm=life.share>=.15&&(fit(p)<.55||nps(s,p)<0)?.15:1;return .30*fit(p)*(.5+p.level*.05)*Math.pow(Math.max(0,1-p.price/willingness(s,p)),1.35)*clamp((nps(s,p)+100)/140,0,1)*life.factor*chasm;}
 function nextLevel(p){return p.level===0?4:Math.min(10,p.level+1);}
 function developmentCost(p){return p.level===0?(p.scale==='lean'?6000:30000):Math.round((p.scale==='lean'?2500:5000)*Math.pow(1.6,Math.max(0,p.level-4)));}
 function difficulty(p){return p.level===0?6:Math.min(18,8+Math.max(0,p.level-4)*2);}
 function modifiers(s,meta){const best=Math.max(0,...s.team.filter(p=>p.role==='Produto').map(p=>p.level));return [{label:'Especialista de produto',value:Math.min(4,best)},{label:'Foco do catálogo',value:-Math.min(4,Math.max(0,s.products.filter(p=>!p.retired).length-1))},...(meta.skills?.includes('product')?[{label:'Habilidade de produto',value:2}]:[])];}
 function cost(s,a){const p=find(s,a.productId);if(a.type==='product_develop')return p?developmentCost(p):0;if(a.type==='product_research')return 1000;return 0;}
 function validAttributes(values,budget){return Array.isArray(values)&&values.length===4&&values.every(v=>Number.isInteger(v)&&v>=0&&v<=10)&&sum(values)===budget;}
 function validate(s,a){ensure(s);const p=find(s,a.productId);
  if(a.type==='product_create'){
   if(typeof a.name!=='string'||!a.name.trim()||a.name.length>32)throw Error('Dê um nome de até 32 caracteres ao produto.');
   if(!['oneoff','recurring'].includes(a.mode)||!['lean','standard'].includes(a.scale)||![0,1,2,3].includes(a.age)||![0,1,2].includes(a.income))throw Error('Escolha cobrança, escala e persona.');
   if(!validAttributes(a.attributes,4))throw Error('Distribua exatamente quatro pontos no MVP.');
   if(s.products.filter(p=>!p.retired).length>=8)throw Error('Limite de oito produtos em trabalho. Arquive um deles.');
   if(a.parentId&&(!find(s,a.parentId)||!find(s,a.parentId).launched))throw Error('Continuação exige um produto já lançado.');return;
  }
  if(a.type==='product_research'){if(![0,1,2,3].includes(a.age)||![0,1,2].includes(a.income))throw Error('Persona de pesquisa inválida.');return;}
  if(!p||p.retired)throw Error('Produto indisponível nesta etapa.');
  if(a.type==='product_develop'&&(p.level>=10||!validAttributes(a.attributes,nextLevel(p))))throw Error('Distribua os pontos do próximo nível, até o máximo de dez.');
  if(a.type==='product_launch'&&(p.launched||p.level<4))throw Error('Lançamento depende de MVP desenvolvido com sucesso.');
  if(a.type==='product_launch'&&a.mode!==undefined&&!['oneoff','recurring'].includes(a.mode))throw Error('Escolha compra única ou recorrência.');
  if(['product_launch','product_price'].includes(a.type)&&(!Number.isFinite(a.price)||a.price<=0||a.price>1000000))throw Error('Defina um preço maior que zero e até R$ 1 milhão.');
  if(a.type==='product_price'&&!p.launched)throw Error('Defina o primeiro preço ao lançar.');
 }
 function apply(s,a,{meta,preview=false,models,roll}={}){
  validate(s,a);let p=find(s,a.productId);
  if(a.type==='product_create'){const parent=a.parentId?find(s,a.parentId):null,id='product-'+a.id;p={id,familyId:parent?.familyId||id,name:a.name.trim(),generation:parent?parent.generation+1:1,mode:a.mode,scale:a.scale,age:a.age,income:a.income,level:0,attributes:[0,0,0,0],blueprint:[...a.attributes],price:null,launched:false,retired:false,active:0,uniqueBuyers:0,launchMonth:null,nextObsolete:null,parentId:parent?.id||null,history:[]};s.products.push(p);s.catalogStarted=true;return {status:'executed',productId:id,note:'Conceito criado. Falta desenvolver e lançar.'};}
  if(a.type==='product_research'){
   if(preview)return {status:'planned'};const die=roll(s,{label:'Pesquisa · '+ages[a.age]+' / '+classes[a.income],modifiers:modifiers(s,meta),difficulty:10});let note='Pesquisa inconclusiva. Nenhuma preferência foi validada.';
   if(!die.critical&&die.total>=10){const axis=die.natural%4,key=a.age+'-'+a.income,rank=ideal(a.age,a.income)[axis];s.marketResearch[key]??={};s.marketResearch[key][axis]={priority:rank>=.30?'Alta':rank>=.18?'Média':'Baixa',confidence:die.total>=18?'Alta':'Parcial',month:s.month};meta.productInsights??=[];const insight={marketId:s.marketId,age:a.age,income:a.income,axis,...s.marketResearch[key][axis]};meta.productInsights=meta.productInsights.filter(x=>!(x.marketId===insight.marketId&&x.age===a.age&&x.income===a.income&&x.axis===axis));meta.productInsights.push(insight);note=axes[axis]+': prioridade '+s.marketResearch[key][axis].priority.toLowerCase()+' para esta persona.';}
   return {status:die.critical?'critical':die.outcome,die,note};
  }
  if(a.type==='product_develop'){
   const target=nextLevel(p),before=p.level;if(preview){p.level=target;p.attributes=[...a.attributes];return {status:'planned',productId:p.id,note:'Prévia supõe sucesso; dependências podem ser puladas.'};}
   const die=roll(s,{label:'Desenvolver · '+p.name,modifiers:modifiers(s,meta),difficulty:difficulty(p)});
   if(die.critical){p.level=Math.max(0,p.level-1);const axis=p.attributes.indexOf(Math.max(...p.attributes));if(p.attributes[axis]>0)p.attributes[axis]--;}
   else if(die.outcome==='success'){p.level=target;p.attributes=[...a.attributes];}
   return {status:die.critical?'critical':die.outcome,die,productId:p.id,note:die.critical?'Falha crítica: nível '+before+' → '+p.level+'.':die.outcome==='success'?'Entrega concluída: nível '+before+' → '+p.level+'.':'Tentativa falhou. O nível foi mantido e o investimento foi consumido.'};
  }
  if(a.type==='product_launch'){p.mode=a.mode||p.mode;p.price=a.price;p.launched=true;p.launchMonth=s.month+1;p.nextObsolete=s.month+6;if(p.parentId){const parent=find(s,p.parentId);if(parent){parent.retired=true;parent.active=0;}}s.audienceExposure[p.age]=0;return {status:'executed',productId:p.id,note:'Lançado por R$ '+p.price+(p.mode==='recurring'?'/mês.':' por compra.')+(p.parentId?' A geração anterior foi substituída.':'')};}
  if(a.type==='product_price'){p.price=a.price;return {status:'executed',productId:p.id,note:'Novo preço: R$ '+p.price+'.'};}
  if(a.type==='product_retire'){p.retired=true;p.active=0;return {status:'executed',productId:p.id,note:'Produto arquivado; assinaturas deste produto encerradas.'};}
 }
 function closeSales(s,acquisition,{models,meta,overload=0}={}){
  const channels=acquisition.channels.map(c=>({...c,newCustomers:0,attributedRevenue:0})),m=models?.[s.business],classShares=m?m[6].map(v=>v/100):[.1,.4,.5],eligible=s.products.filter(p=>p.launched&&!p.retired&&p.age===(s.target||0));
  const sales=new Map(s.products.filter(p=>p.launched&&!p.retired).map(p=>[p.id,{productId:p.id,name:p.name,mode:p.mode,price:p.price,cost:unitCost(s,p,meta),newCustomers:0,channelBuyers:[0,0,0],organic:0}]));
  const totalPaidLeads=channels.reduce((n,c)=>n+c.leads,0),sources=[...channels.map(c=>c.leads),Math.max(0,acquisition.leads-totalPaidLeads)];
  sources.forEach((leads,source)=>{let allocated=0;classShares.forEach((share,income)=>{const segment=income===2?leads-allocated:Math.floor(leads*share);allocated+=segment;const products=eligible.filter(p=>p.income===income),perProduct=products.length?segment/products.length:0;products.forEach(p=>{const row=sales.get(p.id),remaining=Math.max(0,marketSize(s,p,models)-p.uniqueBuyers-row.newCustomers),customers=Math.min(remaining,Math.floor(perProduct*conversion(s,p,models)));row.newCustomers+=customers;if(source<3){row.channelBuyers[source]+=customers;channels[source].newCustomers+=customers;channels[source].attributedRevenue+=customers*p.price;}else row.organic+=customers;});});});
  let revenue=0,cogs=0,churn=0,active=0,newCustomers=0;const rows=[];
  for(const p of s.products.filter(p=>p.launched&&!p.retired)){
   const row=sales.get(p.id),score=nps(s,p),expectedChurn=p.mode==='recurring'?p.active*clamp(.10-score*.00065+overload*.2,.015,.65)+(p.churnRemainder||0):0,lost=Math.min(p.active,Math.floor(expectedChurn));p.churnRemainder=expectedChurn-lost;
   p.active=p.mode==='recurring'?Math.max(0,p.active-lost+row.newCustomers):0;p.uniqueBuyers+=row.newCustomers;
   const units=p.mode==='recurring'?p.active:row.newCustomers;row.units=units;row.churn=lost;row.revenue=units*p.price;row.cogs=units*row.cost;row.nps=score;row.fit=fit(p);row.stage=stage(p,marketSize(s,p,models));row.buyers=p.uniqueBuyers;row.marketSize=marketSize(s,p,models);
   revenue+=row.revenue;cogs+=row.cogs;churn+=lost;active+=p.active;newCustomers+=row.newCustomers;p.history.push({...row,month:s.month+1});p.history=p.history.slice(-36);rows.push(row);
  }
  channels.forEach(c=>{c.roas=c.spend?c.attributedRevenue/c.spend:null;s.campaigns[c.channel].last={...c,month:s.month+1};});const attributedRevenue=sum(channels.map(c=>c.attributedRevenue));
  return {revenue,cogs,churn,active,newCustomers,rows,acquisition:{...acquisition,channels,newCustomers,organicCustomers:sum(rows.map(r=>r.organic)),attributedRevenue,roas:acquisition.spend?attributedRevenue/acquisition.spend:null}};
 }
 function ageProducts(s){const events=[];for(const p of s.products.filter(p=>p.launched&&!p.retired)){if(p.nextObsolete!==null&&s.month>=p.nextObsolete){const axis=p.attributes.indexOf(Math.max(...p.attributes));if(p.attributes[axis]>0){p.attributes[axis]--;p.level=Math.max(0,p.level-1);events.push(p.name+': obsolescência −1 em '+axes[axis]+'.');}p.nextObsolete+=6;}}return events;}
 function sync(s){const live=s.products.filter(p=>p.launched&&!p.retired);s.launched=!!live.length;if(live.length){s.quality=Math.round(sum(live.map(p=>p.level*10))/live.length);s.price=live[0].price;}s.customers=sum(live.map(p=>p.active));}
 return {axes,opposites,ages,classes,kinds,ensure,allocate,find,ideal,sector,unitCost,fit,willingness,nps,marketSize,stage,conversion,nextLevel,developmentCost,difficulty,modifiers,cost,validate,apply,closeSales,ageProducts,sync};
})();
if(typeof module!=='undefined')module.exports=ProductRules;
