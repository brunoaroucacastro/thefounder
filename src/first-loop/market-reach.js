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

 /* Tabuleiro de campanha (0.62): canais com padrões próprios e quatro fases pela experiência da empresa. Regras puras. */
 const Board=(()=>{
  const cards={inf:{n:'Influenciador',d:'Área 3×3',tag:'Precisão',ch:1},pr:{n:'Assessoria PR',d:'Uma linha inteira',tag:'Controle',ch:4},ooh:{n:'Out of Home',d:'Uma coluna inteira',tag:'Cruza com PR',ch:3},seo:{n:'SEO',d:'Uma diagonal inteira (R gira)',tag:'Cantos difíceis',ch:0},soc:{n:'Redes Sociais',d:'8 alvos ao acaso numa região 5×5',tag:'Risco com mira',ch:1},email:{n:'E-mail',d:'5 casas vizinhas de quem já foi alcançado',tag:'Finalização',ch:2},cont:{n:'Conteúdo',d:'2×2 agora, vira 4×4 na jogada seguinte',tag:'Investimento',ch:5},tv:{n:'Televisão',d:'Linha + coluna',tag:'Alto risco',ch:3}};
  const stages=[{label:'Iniciante',n:6,plays:3,p:2,e:2,d:1,k:0,rival:0,clusters:false,cards:['inf','pr','ooh'],bars:[50,85,120,150]},{label:'Em crescimento',n:8,plays:3,p:3,e:3,d:2,k:3,rival:0,clusters:false,cards:['inf','pr','ooh','seo','soc'],bars:[25,50,75,100]},{label:'Experiente',n:10,plays:4,p:3,e:3,d:3,k:4,rival:1,clusters:false,cards:['inf','pr','ooh','seo','soc','email','cont'],bars:[25,50,75,100]},{label:'Referência',n:12,plays:5,p:4,e:4,d:5,k:6,rival:1,clusters:true,cards:['inf','pr','ooh','seo','soc','email','cont','tv'],bars:[25,50,75,100]}];
  const stageFor=exp=>exp<2?0:exp<4?1:exp<7?2:3;
  const shuffle=(a,rand)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const area=(n,c,rx=1)=>{const r=Math.floor(c/n),k=c%n,o=[];for(let a=r-rx;a<=r+rx;a++)for(let b=k-rx;b<=k+rx;b++)if(a>=0&&a<n&&b>=0&&b<n)o.push(a*n+b);return o;};
  function create(stage=2,rand=Math.random){const S=stages[stage],n=S.n,kind=Array(n*n).fill('c'),blocked=[];
   for(let i=0;i<S.rival;i++){const c=(1+Math.floor(rand()*(n-2)))*n+1+Math.floor(rand()*(n-2));area(n,c).forEach(x=>{if(!blocked.includes(x)){blocked.push(x);kind[x]='x';}});}
   const free=()=>shuffle(kind.map((k,i)=>k==='c'?i:-1).filter(i=>i>=0),rand);
   if(S.clusters){const anchors=[n+1,n*n-n-2];let left=S.p;anchors.forEach((a,idx)=>{const spots=shuffle(area(n,a,2).filter(c=>kind[c]==='c'),rand),take=idx===0?Math.ceil(S.p/2):left;spots.slice(0,take).forEach(c=>{kind[c]='p';left--;});});}else free().slice(0,S.p).forEach(c=>kind[c]='p');
   free().slice(0,S.e).forEach(c=>kind[c]='e');free().slice(0,S.d).forEach(c=>kind[c]='d');free().slice(0,S.k).forEach(c=>kind[c]='k');
   return{stage,n,kind,hits:{},blocked,rivals:blocked.length,firedE:[],firedD:[],grow:[],played:[],byChannel:{},hand:draw(stage,rand),used:[],resets:0,spent:0};}
  function draw(stage,rand){const list=stages[stage].cards;return Array.from({length:Math.max(5,stages[stage].plays+2)},()=>list[Math.floor(rand()*list.length)]);}
  function emailTargets(b){const blocked=new Set(b.blocked),hit=Object.keys(b.hits).map(Number).filter(c=>!blocked.has(c)),o=new Set();hit.forEach(c=>area(b.n,c).forEach(x=>{if(!blocked.has(x)&&x!==c)o.add(x);}));return[...o];}
  function preview(b,type,cell,rot=0){const n=b.n,r=Math.floor(cell/n),k=cell%n,row=[...Array(n).keys()].map(i=>r*n+i),col=[...Array(n).keys()].map(i=>i*n+k);if(type==='inf')return area(n,cell);if(type==='pr')return row;if(type==='ooh')return col;if(type==='tv')return[...new Set([...row,...col])];if(type==='soc')return area(n,cell,2);if(type==='cont'){const o=[];[[0,0],[0,1],[1,0],[1,1]].forEach(([a,c])=>{if(r+a<n&&k+c<n)o.push((r+a)*n+k+c);});return o;}if(type==='seo'){const o=[];for(let i=-n;i<=n;i++){const a=r+i,c=rot?k-i:k+i;if(a>=0&&a<n&&c>=0&&c<n)o.push(a*n+c);}return o;}return[cell];}
  function counted(b){const blocked=new Set(b.blocked);return Object.keys(b.hits).map(Number).filter(c=>!blocked.has(c)&&(b.kind[c]!=='k'||b.hits[c]>=2));}
  function hitAll(b,cells){const blocked=new Set(b.blocked),on=cells.filter(c=>!blocked.has(c));on.forEach(c=>b.hits[c]=(b.hits[c]||0)+1);return on;}
  function resolve(b,type,cell,{rot=0,rand=Math.random,picks=null}={}){const before=counted(b).length,stages_=[],cellsNow=[];if(b.grow.length){const g=b.grow.flatMap(c=>{const r=Math.floor(c/b.n),k=c%b.n,o=[];for(let a=r-1;a<=r+2;a++)for(let i=k-1;i<=k+2;i++)if(a>=0&&a<b.n&&i>=0&&i<b.n)o.push(a*b.n+i);return o;});b.grow=[];cellsNow.push(...new Set(g));}
   let main=type==='email'?(picks||[]):type==='soc'?shuffle(area(b.n,cell,2),rand).slice(0,8):preview(b,type,cell,rot);if(type==='cont')b.grow=[cell];
   const direct=hitAll(b,[...new Set([...cellsNow,...main])]);stages_.push({type:'direct',cells:direct});
   const fired=new Set(b.firedE);let queue=Object.keys(b.hits).map(Number).filter(c=>b.kind[c]==='e'&&!b.blocked.includes(c)&&!fired.has(c));
   while(queue.length){const wave=[];queue.forEach(e=>{fired.add(e);area(b.n,e).filter(c=>c!==e).forEach(c=>wave.push(c));});const on=hitAll(b,[...new Set(wave)]);stages_.push({type:'wave',cells:on,count:queue.length});queue=Object.keys(b.hits).map(Number).filter(c=>b.kind[c]==='e'&&!b.blocked.includes(c)&&!fired.has(c));}
   b.firedE=[...fired];const firedD=new Set(b.firedD),blocks=Object.keys(b.hits).map(Number).filter(c=>b.kind[c]==='d'&&!b.blocked.includes(c)&&!firedD.has(c)).map(d=>{firedD.add(d);return{type:'block',cells:area(b.n,d)};});blocks.forEach(s=>s.cells.forEach(c=>{if(!b.blocked.includes(c))b.blocked.push(c);}));stages_.push(...blocks);b.firedD=[...firedD];
   b.played.push(type);const ch=cards[type].ch;b.byChannel[ch]=(b.byChannel[ch]||0)+Math.max(0,counted(b).length-before);return stages_;}
  function score(b,channels=null){const on=counted(b),space=b.n*b.n-b.rivals,reach=on.length,pct=reach/space*100,total=stages[b.stage].p,personas=on.filter(c=>b.kind[c]==='p').length,mult=personas?1+(personas-1)/Math.max(1,total-1):0,avg=channels&&b.played.length?b.played.reduce((n,t)=>n+channels[cards[t].ch],0)/b.played.length:17.5,factor=.75+avg/35*.5;return{reach,space,pct,personas,total,mult,factor,score:Math.round(pct*mult*factor*10)/10};}
  const grade=(n,stage=2)=>{const[b1,b2,b3,b4]=stages[stage].bars;return n<=0?'critical':n<b1?'partial':n<b2?'normal':n<b3?'great':'exceptional';};
  return{cards,stages,stageFor,create,draw,emailTargets,preview,resolve,score,grade,counted};})();
 const channels=['Redes sociais','Anúncios pagos','Influenciadores','Relações públicas','Conteúdo','SEO'];
 const channelsV2=['SEO (Buscas)','Redes Sociais (Influenciadores)','E-mail Marketing','Out of Home (Mídia Offline)','PR (Revistas, Jornais, Portais)','Produção de Conteúdo'];
 const channelNames=s=>s&&s.personaSet==='v2'?channelsV2:channels;
 const defaultMix=()=>[20,20,15,15,15,15];
 const validMix=m=>Array.isArray(m)&&m.length===6&&m.every(p=>Number.isInteger(p)&&p>=0)&&sum(m)===100;
 const ageAffinity=[[.95,.88,.64,.42],[.72,.83,.75,.53],[.86,.77,.54,.31],[.35,.47,.71,.86],[.57,.73,.78,.65],[.40,.64,.82,.88]];
 const productAffinity={headphones:[1.12,.94,1.2,.9,.95,.84],mouse:[.9,1.06,.85,.85,1.04,1.2],keyboard:[.93,.91,1.05,1.12,1.19,1.08],speaker:[1.06,.9,1.13,1.22,.95,.88]};
 const saturation=[2.4,1.6,2.8,1.2,1.9,1.1];
 const marketingRange=[.8,1.5];
 function marketing(s,mix){
  if(!validMix(mix))throw Error('Distribua exatamente 100% do esforço.');
  if(s.boardCampaign)return 1.15;
  const ideal=s.personaSet==='v2'&&G.personas(s).find(p=>p.id===s.clientId)?.channels;
  // v2: eficiência = sobreposição entre o mix do jogador e o mix ideal da persona (100% quando igual).
  if(ideal)return marketingRange[0]+(marketingRange[1]-marketingRange[0])*clamp(sum(mix.map((p,i)=>Math.min(p,ideal[i])))/100,0,1);
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
  const total=Math.max(0,Math.min(segment.available,weekRoom,Math.round(base*multiplier*(options.fade||1))));
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
  const byAge=roundWithin(base.byAge.map((n,i)=>Math.min(limits[i],n*multiplier*(options.fade||1))),limits);
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
 return {gadgetMarkets,enableGrowth,growthProfile,settleGrowth,renewGrowth,Board,channels,channelsV2,channelNames,defaultMix,validMix,marketing,ages,demography,population,coefficients,unitCoefficients,venueCoefficients,now,key,ensure,product,readProduct,validate,enable,recordReview,closeBrand,wordOfMouth,fatigue,campaignStrength,plan,commit,beginRetarget,nextBuyer,paidCustomer,organicPotential,inviteOrganic,startOrganic,message,brandLabel};
})();
if(typeof module!=='undefined')module.exports=MarketReach;

