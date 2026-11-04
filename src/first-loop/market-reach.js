/* Paid discovery and bounded referrals. Pure plans; state changes only on committed events. */
const MarketReach=(()=>{
 const G=typeof GadgetDesign!=='undefined'?GadgetDesign:require('./gadgets.js');
 const ages=['18–24','25–34','35–54','55+'],demography=[.15,.25,.45,.15],population=100000;
 const venueCoefficients={online:[1.6,1.2,.75,.5],local:[.75,1.15,1.4,.85],partner:[.6,.9,1.1,1.8]};
 const unitCoefficients={creator:[2.2,1.35,.55,.2],demo:[.55,.95,1.6,1.8],offer:[1.25,1.5,1,.65]};
 const coefficients={creator:[1.6,1.3,.75,.4],demo:[.7,1,1.35,1.5],offer:[1.2,1.45,1.15,.9]};
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),copy=x=>JSON.parse(JSON.stringify(x)),sum=a=>a.reduce((n,v)=>n+v,0),now=s=>(s.clock||0)/300,key=s=>s.lineage||s.id+'-'+s.cycle;
 function random(key){let h=2166136261;for(const c of String(key)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;return(h>>>0)/4294967296;}
 const blankProduct=()=>({covered:[0,0,0,0],pressure:{creator:0,demo:0,offer:0},pressureAt:0,signals:[],paidCustomers:0,organicGenerated:0,organicThisWave:0});
 function ensure(s){s.market??={schema:1,brand:1,reviewCount:0,starSum:0,reviewKeys:{},lastBrandCount:0,products:{},active:null,serial:0,organicTotal:0,lastOrganic:0};return s.market;}
 function product(s,k=key(s)){const m=ensure(s);return m.products[k]??=blankProduct();}
 const readProduct=s=>s.market?.products[key(s)]||blankProduct();
 function validate(s){const m=s.market;if(!s.universal||!s.behavior||!m||m.schema!==1||!Number.isFinite(m.brand)||m.brand<.7||m.brand>1.5||!m.products||!m.reviewKeys||!Number.isInteger(m.reviewCount)||m.reviewCount<0||!Number.isFinite(m.starSum)||m.starSum<m.reviewCount||m.starSum>m.reviewCount*5||!Number.isInteger(m.lastBrandCount)||m.lastBrandCount<0||m.lastBrandCount>m.reviewCount||!Number.isInteger(m.serial)||m.serial<0||!Number.isInteger(m.organicTotal)||m.organicTotal<0)throw Error('Descoberta de mercado inválida.');for(const p of Object.values(m.products)){if(!Array.isArray(p.covered)||p.covered.length!==4||p.covered.some((v,i)=>!Number.isInteger(v)||v<0||v>population*demography[i])||!Array.isArray(p.signals)||p.signals.some(r=>!Number.isInteger(r.stars)||r.stars<1||r.stars>5||!Number.isFinite(r.at)||r.at<0||!Number.isInteger(r.age)||r.age<0||r.age>3)||!p.pressure||['creator','demo','offer'].some(c=>!Number.isFinite(p.pressure[c])||p.pressure[c]<0)||!Number.isFinite(p.pressureAt)||p.pressureAt<0||!Number.isInteger(p.organicThisWave)||p.organicThisWave<0||p.organicThisWave>30||!Number.isInteger(p.organicGenerated)||p.organicGenerated<0||!Number.isInteger(p.paidCustomers)||p.paidCustomers<0)throw Error('Histórico de alcance inválido.');}if(m.active&&(!['paid','retarget','organic'].includes(m.active.kind)||!Array.isArray(m.active.remaining)||m.active.remaining.length!==4||m.active.remaining.some(v=>!Number.isInteger(v)||v<0)||!Array.isArray(m.active.organicQueue)||m.active.organicQueue.some(v=>!Number.isInteger(v)||v<0||v>3)))throw Error('Fila de interessados inválida.');return s;}
 function enable(input){const s=copy(input);if(!s.universal||!s.behavior)throw Error('Use uma partida com atributos universais.');if(s.reach)return validate(s);s.reach=true;ensure(s);for(const h of s.history||[])for(const r of h.reviews||[])recordReview(s,r,h.account?.lineage||s.id+'-'+h.cycle);for(const p of s.portfolio||[])for(const r of p.reviews||[])recordReview(s,r,p.account?.lineage||p.name);if(s.productId){for(const r of s.reviews||[])recordReview(s,r);product(s);}s.market.lastBrandCount=s.market.reviewCount;s.market.active={legacy:true,kind:'paid',remaining:[0,0,0,0],organicQueue:[],byAge:[0,0,0,0]};return s;}
 function recordReview(s,r,k=key(s)){const m=ensure(s),id=s.id+':'+r.id;if(m.reviewKeys[id])return;m.reviewKeys[id]=true;m.reviewCount++;m.starSum+=r.stars;product(s,k).signals.push({stars:r.stars,at:now(s),age:Math.max(0,ages.indexOf(r.profile?.age))});}
 function closeBrand(s){const m=ensure(s),n=m.reviewCount;if(n===m.lastBrandCount)return;const reputation=(m.starSum-3*n)/(2*(n+40)),target=clamp(1+.5*reputation,.7,1.5);m.brand=clamp(m.brand+.1*(target-m.brand),.7,1.5);m.lastBrandCount=n;}
 function wordOfMouth(s){let n=0,satisfaction=0;for(const r of readProduct(s).signals){const w=2**(-Math.max(0,now(s)-r.at)/2);n+=w;satisfaction+=w*(r.stars-3)/2;}return{effective:n,satisfaction,factor:1+.3*satisfaction/(n+20),enthusiasm:Math.max(0,satisfaction)/(n+5)};}
 function fatigue(s,promo){const p=readProduct(s),decay=2**(-Math.max(0,now(s)-p.pressureAt)/2),used=sum(Object.values(promo));return used?Object.entries(promo).reduce((n,[c,v])=>n+v*(.6+.4*Math.exp(-p.pressure[c]*decay)),0)/used:1;}
 function campaignStrength(promo,a,unit=false,modern=false){if(modern){const selected=Object.entries(promo).filter(([,v])=>v>0);return(1+.65*selected.reduce((n,[c])=>n+unitCoefficients[c][a],0))*(selected.length===3?1.08:1);}if(unit)return 1+.24*Object.entries(promo).reduce((n,[c,v])=>n+unitCoefficients[c][a]*v**.9,0);const pairs=Object.entries(promo),max=Math.max(...pairs.map(([,v])=>v)),dominant=pairs.filter(([,v])=>v===max),focus=max>2?.03*(max-2)*sum(dominant.map(([c])=>coefficients[c][a]))/dominant.length:0;return 1+.24*pairs.reduce((n,[c,v])=>n+coefficients[c][a]*v**.9,0)+focus;}
 function roundWithin(values,limits){const out=values.map((v,i)=>Math.min(limits[i],Math.floor(v))),target=Math.min(sum(limits),Math.round(sum(values)));const order=values.map((v,i)=>({i,f:v-Math.floor(v)})).sort((a,b)=>b.f-a.f);let left=target-sum(out);for(const x of order){if(left>0&&out[x.i]<limits[x.i]){out[x.i]++;left--;}}return out;}
 function legacyPlan(s,{promo=s.promo,budget=150+sum(Object.values(promo))*100,grade='normal',criticalSuccess=false}={}){if(!Number.isFinite(budget)||budget<0||Object.values(promo).some(v=>!Number.isInteger(v)||v<0)||sum(Object.values(promo))>4)throw Error('Campanha inválida.');const p=readProduct(s),persona=G.personas(s).find(p=>p.id===s.clientId),weights=demography.map((d,i)=>d*(.25+.75*(persona?.ages[i]??.25))),den=sum(weights),R=(s.modernGameplay?{critical:.6,partial:.8,normal:1,great:1.15,exceptional:1.3}:s.unitAcquisition?{critical:.6,partial:.8,normal:1,great:1.2,exceptional:1.4}:{critical:.35,partial:.65,normal:1,great:1.45,exceptional:1.8})[grade];if(!Number.isFinite(R))throw Error('Resultado de campanha inválido.');const B=s.market?.brand||1,W=wordOfMouth(s).factor,S=fatigue(s,promo),cost={online:2,local:2.5,partner:1.7}[s.placeId]||2,limits=demography.map((d,i)=>Math.max(0,population*d-p.covered[i])),expected=demography.map((d,i)=>{const N=population*d,E=((s.unitAcquisition?population*.004:budget/cost)+(s.early?6:0))*weights[i]/den*campaignStrength(promo,i,s.unitAcquisition,s.modernGameplay)*(s.modernGameplay?(venueCoefficients[s.placeId]?.[i]||1):1)*R*(s.modernGameplay&&criticalSuccess?1.1:1)*B*W*S;return limits[i]*(-Math.expm1(-E/N));}),byAge=roundWithin(expected,limits);return{total:sum(byAge),byAge,expected,budget,kind:'paid',brand:B,wom:W,fatigue:S};}

 const channels=['Redes sociais','Anúncios pagos','Influenciadores','Relações públicas','Conteúdo','SEO'];
 const defaultMix=()=>[20,20,15,15,15,15];
 const validMix=m=>Array.isArray(m)&&m.length===6&&m.every(p=>Number.isInteger(p)&&p>=0)&&sum(m)===100;
 const ageAffinity=[[.95,.88,.64,.42],[.72,.83,.75,.53],[.86,.77,.54,.31],[.35,.47,.71,.86],[.57,.73,.78,.65],[.40,.64,.82,.88]];
 const productAffinity={headphones:[1.12,.94,1.2,.9,.95,.84],mouse:[.9,1.06,.85,.85,1.04,1.2],keyboard:[.93,.91,1.05,1.12,1.19,1.08],speaker:[1.06,.9,1.13,1.22,.95,.88]};
 const saturation=[2.4,1.6,2.8,1.2,1.9,1.1];
 const marketingRange=[.8,1.5];
 function marketing(s,mix){
  if(!validMix(mix))throw Error('Distribua exatamente 100% do esforço.');
  const [young,adult,middle,older]=G.personas(s).find(p=>p.id===s.clientId)?.ages||[.25,.25,.25,.25];
  // The existing 35–54 bin contributes five of its twenty years to 50+.
  const ages=[young,adult,middle*.75,older+middle*.25];
  const product=productAffinity[s.productId]||productAffinity.headphones;
  const a=ageAffinity.map((row,i)=>sum(row.map((v,j)=>v*ages[j]))*product[i]);
  const effortAt=lambda=>a.map((v,i)=>Math.max(0,Math.log(v/lambda)/saturation[i]));
  let low=0,high=Math.max(...a);
  for(let i=0;i<48;i++){
   const mid=(low+high)/2;
   if(sum(effortAt(mid))>1)low=mid;else high=mid;
  }
  const score=effort=>sum(effort.map((p,i)=>a[i]*(-Math.expm1(-saturation[i]*p))/saturation[i]));
  const efficiency=clamp(score(mix.map(p=>p/100))/score(effortAt(high)),0,1);
  return marketingRange[0]+(marketingRange[1]-marketingRange[0])*efficiency;
 }

 const gadgetMarkets={headphones:5000000,keyboard:3000000,mouse:2000000};
 const renewal=1-Math.pow(.5,1/36);
 const growthWeek=s=>s.weekly?.reports.length??Math.floor((s.clock||0)/300);
 function enableGrowth(s){
  if(!s.traction||!s.market||s.market.growth)return s;
  return {...s,market:{...s.market,growth:{audience:0,reputation:70,segments:{},validated:{},lastWindow:null}}};
 }
 function growthProfile(s){
  const growth=s.market?.growth;
  if(!growth||!gadgetMarkets[s.productId]||!s.clientId)return null;
  const key=s.productId+':'+s.clientId;
  const capacity=Math.floor(gadgetMarkets[s.productId]/G.personas(s).length);
  const segment=growth.segments[key]||{available:capacity,firstWeek:growthWeek(s),week:growthWeek(s),allowance:Math.floor(capacity*.12),used:0};
  const validated=Object.keys(growth.validated).length;
  const audience=growth.audience;
  const distribution=validated>=5&&audience>=10000?12:validated>=3&&audience>=2500?6:validated>=2&&audience>=500?2.5:1;
  return {key,capacity,segment,distribution,audience,reputation:growth.reputation};
 }
 function growthPlan(s,options,mix,multiplier,profile){
  const {capacity,segment,distribution,audience,reputation}=profile;
  const grade={critical:.6,partial:.8,normal:1,great:1.15,exceptional:1.3}[options.grade||'normal'];
  const novelty=.25+.75*Math.exp(-(growthWeek(s)-segment.firstWeek)/8);
  const saturation=Math.sqrt(segment.available/capacity);
  const weekRoom=segment.week===growthWeek(s)?segment.allowance-segment.used:Math.floor(segment.available*.12);
  const base= (600+.4*audience)*distribution*(.5+reputation/100)/1.2*novelty*saturation*grade*(options.criticalSuccess?1.1:1)/1.35;
  const total=Math.max(0,Math.min(segment.available,weekRoom,Math.round(base*multiplier)));
  const persona=G.personas(s).find(p=>p.id===s.clientId);
  const weights=demography.map((d,i)=>d*(.25+.75*(persona?.ages[i]??.25)));
  const byAge=roundWithin(weights.map(w=>total*w/sum(weights)),weights.map(()=>total));
  return {total,byAge,budget:0,kind:'paid',baseLeads:Math.round(base),mix:[...mix],multiplier,growthKey:profile.key};
 }
 function reserveGrowth(s,result){
  const profile=growthProfile(s);
  const g=s.market.growth;
  const segment=g.segments[profile.key]??={...profile.segment};
  if(segment.week!==growthWeek(s)){
   segment.week=growthWeek(s);
   segment.allowance=Math.floor(segment.available*.12);
   segment.used=0;
  }
  segment.available-=result.total;
  segment.used+=result.total;
 }
 function settleGrowth(s,metrics,window){
  const g=s.market?.growth,active=s.market?.active;
  if(!g||!active?.growthKey||!window||g.lastWindow===window.id)return;
  g.lastWindow=window.id;
  const reviews=s.reviews.slice(window.reviewStart);
  const confidence=Math.min(1,Math.sqrt(reviews.length/10));
  const quality=reviews.length?sum(reviews.map(r=>r.stars))/reviews.length:3.5;
  const signal=(quality-3.5)*confidence;
  g.reputation=clamp(g.reputation+.9*signal,0,100);
  const followed=.04*Math.max(0,metrics.seen-metrics.buyers);
  const retained=metrics.buyers*clamp(.35+.33*signal,.05,.65);
  const loss=g.audience*.025*Math.max(0,-signal);
  g.audience=clamp(Math.round(g.audience-loss+(followed+retained)*(1-g.audience/200000)),0,200000);
  if(metrics.sold>=60&&reviews.length>=3&&quality>=4)g.validated[active.growthKey]=true;
 }
 function renewGrowth(s){
  const g=s.market?.growth;
  if(!g)return;
  g.audience=Math.round(g.audience*.98);
  for(const [key,segment] of Object.entries(g.segments)){
   const productId=key.split(':')[0];
   const capacity=Math.floor(gadgetMarkets[productId]/G.personas({...s,productId}).length);
   segment.available=Math.min(capacity,segment.available+Math.round((capacity-segment.available)*renewal));
  }
 }
 function plan(s,options={}){
  if(!s.traction)return legacyPlan(s,options);
  const mix=options.mix||s.traction;
  const base=legacyPlan({...s,placeId:null},{...options,promo:{demo:0,creator:0,offer:0},budget:0});
  const multiplier=marketing(s,mix);
  const profile=growthProfile(s);
  if(profile)return growthPlan(s,options,mix,multiplier,profile);
  const limits=demography.map((d,i)=>population*d-readProduct(s).covered[i]);
  const byAge=roundWithin(base.byAge.map((n,i)=>Math.min(limits[i],n*multiplier)),limits);
  return {...base,baseLeads:base.total,total:sum(byAge),byAge,mix:[...mix],multiplier};
 }
 function commit(s,options){const result=plan(s,options),m=ensure(s),p=product(s),decay=2**(-Math.max(0,now(s)-p.pressureAt)/2);if(!s.traction)for(const c of Object.keys(p.pressure))p.pressure[c]=p.pressure[c]*decay+(s.modernGameplay?(options.promo[c]>0?.8:0):(result.budget/550)*(options.promo[c]||0)/4);p.pressureAt=now(s);if(result.growthKey)reserveGrowth(s,result);else result.byAge.forEach((n,i)=>p.covered[i]+=n);p.organicThisWave=0;m.serial++;m.active={...result,id:m.serial,legacy:false,remaining:[...result.byAge],organicQueue:[],organicEntered:0};return result.total;}
 function beginRetarget(s){const m=ensure(s);m.serial++;m.active={id:m.serial,kind:'retarget',remaining:[0,0,0,0],organicQueue:[],byAge:[0,0,0,0],legacy:false};product(s).organicThisWave=0;}
 function pick(weights,u){let t=u*sum(weights);for(let i=0;i<weights.length;i++){t-=weights[i];if(t<0)return i;}return weights.length-1;}
 function stamp(s,id,a,source){const people=G.personas(s),weights=people.map(p=>(p.ages[a]||0)*(p.id===s.clientId?20:1));const chosen=people[pick(weights,random(id+':persona'))];return{id,seed:Math.floor(random(id)*4294967296),personaId:chosen.id,ageIndex:a,source};}
 function nextBuyer(s,id){const active=ensure(s).active;if(!active||active.legacy)return null;if(active.organicQueue.length){const a=active.organicQueue.shift();active.organicEntered=(active.organicEntered||0)+1;return stamp(s,id,a,'organic');}if(!sum(active.remaining))return null;const a=pick(active.remaining,random(id+':age'));active.remaining[a]--;return stamp(s,id,a,'paid');}
 function paidCustomer(s){product(s).paidCustomers++;}
 function organicPotential(s){const p=readProduct(s);if(p.organicThisWave>=30)return 0;const w=wordOfMouth(s),credit=Math.max(0,Math.floor(.35*p.paidCustomers)-p.organicGenerated),waveLimit=Math.max(0,30-p.organicThisWave),available=sum(ages.map((_,a)=>p.signals.some(r=>r.age===a&&r.stars>=4)?Math.max(0,population*demography[a]-p.covered[a]):0));return Math.max(0,Math.min(available,waveLimit,credit,Math.floor(credit*w.enthusiasm)));}
 function inviteOrganic(s){const n=organicPotential(s);if(!n)return 0;const m=ensure(s),p=product(s);m.active??={kind:'organic',remaining:[0,0,0,0],organicQueue:[],byAge:[0,0,0,0]};let issued=0;const weights=ages.map((_,a)=>p.signals.filter(r=>r.age===a&&r.stars>=4).reduce((n,r)=>n+(r.stars-3)*2**(-Math.max(0,now(s)-r.at)/2),0));for(let i=0;i<n;i++){const eligible=weights.map((w,a)=>p.covered[a]<population*demography[a]?w:0);if(!sum(eligible))break;const a=pick(eligible,random(s.id+':organic:'+key(s)+':'+p.organicGenerated));p.covered[a]++;p.organicGenerated++;p.organicThisWave++;m.active.organicQueue.push(a);m.organicTotal++;issued++;}m.lastOrganic=issued;return issued;}
 function startOrganic(s){if(!organicPotential(s))throw Error('Ainda não há novas recomendações para circular.');const m=ensure(s);m.serial++;m.active={id:m.serial,kind:'organic',remaining:[0,0,0,0],organicQueue:[],byAge:[0,0,0,0],organicEntered:0};return inviteOrganic(s);}
 function message(s){const a=s.market?.active;if(!a||a.legacy||!['campaignOutcome','recampaignOutcome','selling','recap'].includes(s.phase))return'Observe as reações e os reviews para aprender quem sua campanha alcança.';if(a.kind==='retarget')return'Quem já conhecia o produto voltou para olhar de novo.';if(a.kind==='organic')return'As recomendações trouxeram pessoas sem uma nova campanha paga.';if(a.fatigue<.82)return'A abordagem parece conhecida. Talvez seja hora de mudar a apresentação.';if(sum(a.byAge||[])>0){const i=a.byAge.indexOf(Math.max(...a.byAge));return['A novidade chamou atenção de pessoas mais jovens.','Jovens adultos apareceram bastante nesta apresentação.','A apresentação chamou atenção de adultos com a rotina estabelecida.','Pessoas mais velhas apareceram bastante nesta apresentação.'][i];}return'As primeiras reações estão chegando. Os compradores vão contar o que acharam.';}
 function brandLabel(s){const b=s.market?.brand||1;return b<.94?'Reputação abalada':b>1.18?'Marca respeitada':b>1.04?'Ganhando confiança':'Marca pouco conhecida';}
 return {gadgetMarkets,enableGrowth,growthProfile,settleGrowth,renewGrowth,channels,defaultMix,validMix,marketing,ages,demography,population,coefficients,unitCoefficients,venueCoefficients,now,key,ensure,product,readProduct,validate,enable,recordReview,closeBrand,wordOfMouth,fatigue,campaignStrength,plan,commit,beginRetarget,nextBuyer,paidCustomer,organicPotential,inviteOrganic,startOrganic,message,brandLabel};
})();
if(typeof module!=='undefined')module.exports=MarketReach;

