/* Progressão (1.16): pontos de pesquisa, baralho de peças e de cartas, conquistas, efeitos da empresa,
   rivais, fãs e o livro de deduções. Regras puras: só mudam o estado que recebem. */
const Progress=(()=>{
 const G=typeof GadgetDesign!=='undefined'?GadgetDesign:require('./gadgets.js');
 const R=typeof MarketReach!=='undefined'?MarketReach:require('./market-reach.js');
 const U=G.U,copy=x=>JSON.parse(JSON.stringify(x));
 const ALL_PIECES=U.gridShapes.map((s,i)=>i),STARTER_PIECES=[0,1,2,3,4,5,6,7,9,31,14];
 const ALL_CARDS=['inf','pr','ooh','ugc','seo','soc','email','cont','tv'],STARTER_CARDS=['inf','pr','ooh','ugc'];
 const START_CATS=['headphones','mouse'],RESEARCH_COST=1200,CREDIT_AT=20000;
 const CARD_NAMES={inf:'Influenciador',pr:'Assessoria PR',ooh:'Out of Home',ugc:'UGC',seo:'SEO',soc:'Redes Sociais',email:'E-mail',cont:'Conteúdo',tv:'Televisão'};
 const AXIS=Object.fromEntries(U.axes.map(a=>[a.id,a.name]));
 // Rivais: dois por categoria, cada um com um foco (o atributo em que aposta) e um ritmo de vendas.
 const RIVALS={
  headphones:[{id:'sommax',name:'SomMax',focus:'economy',weak:'durability',rating:3.9,pace:70,color:'#d55e00'},{id:'zuvi',name:'Zuvi',focus:'quality',weak:'economy',rating:4.3,pace:38,color:'#56b4e9'}],
  mouse:[{id:'klik',name:'Klik',focus:'performance',weak:'durability',rating:4.1,pace:60,color:'#cc79a7'},{id:'kora',name:'Kora',focus:'economy',weak:'quality',rating:3.8,pace:45,color:'#009e73'}],
  keyboard:[{id:'teclab',name:'TecLab',focus:'durability',weak:'practicality',rating:4.0,pace:52,color:'#e69f00'},{id:'tipo',name:'Tipo',focus:'versatility',weak:'durability',rating:3.9,pace:34,color:'#0072b2'}],
  speaker:[{id:'boombox',name:'BoomBox',focus:'performance',weak:'practicality',rating:4.0,pace:58,color:'#d55e00'},{id:'nuvem',name:'Nuvem',focus:'practicality',weak:'performance',rating:3.9,pace:40,color:'#56b4e9'}]};
 const CAT_PRICE={headphones:129,mouse:99,keyboard:169,speaker:189},FOCUS_MULT={economy:.7,quality:1.35,performance:1.1,durability:1.05,versatility:1,practicality:.9};
 const ADJ={durability:'durável',economy:'barato',quality:'caprichado',performance:'rápido',practicality:'fácil de usar',versatility:'versátil'};
 const WEAK_LINE={durability:(n,p)=>'Meu '+p+' da '+n+' quebrou de novo. Terceiro em um ano.',economy:(n,p)=>'O '+p+' da '+n+' é bom, mas o preço está um absurdo.',quality:(n,p)=>'O acabamento do '+p+' da '+n+' é fraquinho, descascou todo.',performance:(n,p)=>'O '+p+' da '+n+' é lento demais pro que eu preciso.',practicality:(n,p)=>'Configurar o '+p+' da '+n+' é um parto.',versatility:(n,p)=>'O '+p+' da '+n+' só funciona num aparelho. Que raiva.'};
 const allRivals=()=>Object.entries(RIVALS).flatMap(([cat,l])=>l.map(r=>({...r,cat})));
 const ACH=[
  {id:'sold100',icon:'📦',name:'Cem unidades',text:'Venda 100 unidades no total.',reward:'piece'},
  {id:'five',icon:'⭐',name:'Cinco estrelas',text:'Receba a primeira avaliação de 5 estrelas.',reward:'piece'},
  {id:'rev50',icon:'💰',name:'R$ 50 mil',text:'Fature R$ 50 mil no total.',reward:'card'},
  {id:'nv6',icon:'🛠',name:'Nível 6',text:'Leve um produto ao nível 6.',reward:'piece'},
  {id:'twoCats',icon:'🗂',name:'Duas frentes',text:'Lance produtos de duas categorias diferentes.',reward:'card'},
  {id:'fans10',icon:'💬',name:'Comunidade',text:'Junte 10 posts positivos de clientes no Nexus.',reward:'piece'}];
 const week=s=>s.weekly?.reports?.length||0;
 function hash(k){let h=2166136261;for(const c of String(k)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;return(h>>>0)/4294967296;}
 function fill(P){P.mat??={v:1,hist:[1]};const R=P.rivals??={};R.posted??={};R.m??={};R.k??={};R.hist??={};R.snap??={};R.conv??={};R.press??={};R.passed??={};R.lastCamp??={};if(R.poach===undefined)R.poach=null;for(const r of allRivals()){R.m[r.id]??={cut:0,under:0,out:0,camp:0,lost:0};R.k[r.id]??={focus:false,weak:false,react:false,wrong:[]};}return P;}
 function ensure(s){
  if(s.prog)return fill(s.prog);
  const legacy=(s.history||[]).length>0;
  const stage=R.Board.stageFor(s.marketingExp||0);
  s.prog={v:1,pts:0,pieces:legacy?[...ALL_PIECES]:[...STARTER_PIECES],cards:legacy?[...new Set(R.Board.stages.slice(0,stage+1).flatMap(x=>x.cards))]:[...STARTER_CARDS],
   ach:{},fx:[],launched:{},cats:[],lastLaunchWeek:null,lab:null,news:[],
   fans:{pos:0,posUsed:0,replied:{},asks:[],bonus:{m:0,d:0,inf:0}},rivals:{posted:{},lastAct:-9},book:{},tried:{},town:{}};
  if(!legacy&&s.gadgets&&!s.productId&&Array.isArray(s.unlocked))s.unlocked=START_CATS.filter(id=>G.products.some(p=>p.id===id));
  return fill(s.prog);
 }
 const news=(s,n)=>{ensure(s).news.push({id:'n'+week(s)+'-'+(s.prog.news.length+Object.keys(s.prog.ach).length)+'-'+Math.floor(hash(JSON.stringify(n)+s.revision)*1e6),...n});if(s.prog.news.length>6)s.prog.news.splice(0,s.prog.news.length-6);};
 const pick=(list,k)=>list[Math.floor(hash(k)*list.length)%list.length];
 const lockedPieces=s=>ALL_PIECES.filter(i=>!ensure(s).pieces.includes(i)),lockedCards=s=>ALL_CARDS.filter(c=>!ensure(s).cards.includes(c)),lockedCats=s=>G.products.map(p=>p.id).filter(id=>!(s.unlocked||[]).includes(id));
 const tierName=t=>U.gridTiers[t]?.[0]||'Comum';
 function grantPiece(s,why,k){const L=lockedPieces(s);if(!L.length)return null;
  // peças menores saem primeiro: a sorte escolhe dentro do nível de raridade mais baixo ainda bloqueado, com uma chance de pular um nível
  const tiers=[...new Set(L.map(i=>U.gridShapes[i].t))].sort((a,b)=>a-b),t=tiers[Math.min(tiers.length-1,hash(k+'t')<.3?1:0)],pool=L.filter(i=>U.gridShapes[i].t===t),n=pick(pool,k);
  s.prog.pieces.push(n);news(s,{kind:'piece',piece:n,icon:'🧩',title:'Nova peça na bancada',text:'Peça '+tierName(U.gridShapes[n].t)+' de '+U.gridShapes[n].c.length+' casas. '+why});return n;}
 function grantCard(s,why,k){const L=lockedCards(s);if(!L.length)return null;const c=pick(L,k);s.prog.cards.push(c);news(s,{kind:'card',card:c,icon:'🃏',title:'Nova carta no baralho: '+CARD_NAMES[c],text:why});return c;}
 function grantCat(s,why,k){const L=lockedCats(s);if(!L.length)return null;const c=pick(L,k);s.unlocked.push(c);const p=G.products.find(x=>x.id===c);news(s,{kind:'cat',cat:c,icon:p.icon,title:'Nova categoria: '+p.name,text:why});return c;}
 // ---------- pesquisa: 1 ponto por produto novo lançado; o resultado chega no fim da semana ----------
 function research(s,kind){const P=ensure(s);if(!['cat','piece','card','rival'].includes(kind))throw Error('Pesquisa inválida.');if(P.lab)throw Error('Já existe uma pesquisa em andamento.');if(kind==='rival'){if(!nextSecret(s))throw Error('Você já sabe tudo dos concorrentes liberados.');if(s.cash<1500)throw Error('Estudar um concorrente custa R$ 1.500.');s.cash=Math.round((s.cash-1500)*100)/100;s.operatingCost=(s.operatingCost||0)+1500;P.lab={kind,week:week(s)};if(!s.weekly)finishLab(s);return;}if(P.pts<1)throw Error('Lance um produto novo para ganhar um ponto de pesquisa.');
  if(kind==='cat'&&!lockedCats(s).length)throw Error('Todas as categorias já estão liberadas.');if(kind==='piece'&&!lockedPieces(s).length)throw Error('Você já tem todas as peças.');if(kind==='card'&&!lockedCards(s).length)throw Error('Você já tem todas as cartas.');
  if(s.cash<RESEARCH_COST)throw Error('A pesquisa custa R$ 1.200.');s.cash=Math.round((s.cash-RESEARCH_COST)*100)/100;s.operatingCost=(s.operatingCost||0)+RESEARCH_COST;P.pts--;P.lab={kind,week:week(s)};if(!s.weekly)finishLab(s);}
 function finishLab(s){const P=ensure(s),L=P.lab;if(!L)return;P.lab=null;const k=s.id+':lab:'+week(s)+':'+L.kind+':'+P.pts;
  if(L.kind==='rival'){reveal(s,'Estudo de concorrente');return;}
  if(L.kind==='cat')grantCat(s,'A pesquisa da semana abriu uma nova família de produtos. Ela já aparece na escolha de produto.',k);
  else if(L.kind==='piece')grantPiece(s,'Saiu da pesquisa da semana e já entra nas próximas ofertas da prancheta.',k);
  else grantCard(s,'Saiu da pesquisa da semana e já entra na próxima campanha.',k);}
 // ---------- lançamento: ponto de pesquisa, variedade, cópia e pedidos dos fãs ----------
 function onLaunch(s){const P=ensure(s),key=s.id+':'+s.cycle,w=week(s),cat=s.productId;if(!cat)return;
  if(!P.launched[key]){P.launched[key]=w;P.pts++;news(s,{kind:'pts',icon:'🔬',title:'+1 ponto de pesquisa',text:'Cada produto novo lançado rende um ponto. Use em P&D para liberar uma categoria, uma peça ou uma carta.'});
   const fresh=!P.cats.includes(cat);if(fresh&&P.cats.length)addFx(s,{id:'novidade',kind:'buff',icon:'🆕',name:'Novidade no ar',eff:'Conversão +10% em toda a empresa',src:'Lançou uma categoria nova',mult:1.1,weeks:3,scope:'all'});
   P.cats.push(cat);const last=P.cats.slice(-3);if(P.cats.length>=3&&last.every(c=>c===cat))addFx(s,{id:'umso',kind:'debuff',icon:'🔁',name:'Marca de um produto só',eff:'Conversão −10% em toda a empresa',src:'Três lançamentos seguidos de '+G.products.find(p=>p.id===cat).name.toLowerCase(),mult:.9,weeks:4,scope:'all'});
   if(new Set(P.cats).size>=2)achieve(s,'twoCats');}
  P.lastLaunchWeek=w;
  // pedidos atendidos
  for(const a of P.fans.asks)if(!a.done&&w-a.week<=6&&(a.kind==='cat'?a.cat===cat:a.lineage===(s.lineage||s.id)&&(s.generation||1)>a.gen)){a.done=true;const beat=a.axis&&(s.attributes?.[a.axis]||0)>=3;if(beat)P.rivals.conv[cat]=(P.rivals.conv[cat]||0)+8;addFx(s,{id:'comunidade',kind:'buff',icon:'🤝',name:'Ouviu sua comunidade',eff:'Conversão +'+(beat?15:10)+'% em toda a empresa',src:beat?'Atendeu o pedido e superou a '+a.rivalName+' em '+AXIS[a.axis].toLowerCase():'Atendeu um pedido dos fãs no Nexus',mult:beat?1.15:1.1,weeks:4,scope:'all'});news(s,{kind:'fx',icon:'🤝',title:'Você ouviu sua comunidade',text:beat?'Pediram melhor que a '+a.rivalName+' em '+AXIS[a.axis].toLowerCase()+' e você entregou. +15% de conversão por 4 semanas, e clientes da '+a.rivalName+' trocaram de marca.':a.axis?'Você lançou o que pediram, mas sem superar a '+a.rivalName+' em '+AXIS[a.axis].toLowerCase()+' (precisava de 3 ou mais). +10% por 4 semanas.':'Quem pediu no Nexus viu o lançamento. Buff de +10% de conversão por 4 semanas.'});}
  // parece cópia: seu atributo principal é exatamente o foco de um rival da categoria
  if(s.office){const top=Object.entries(s.attributes||{}).sort((a,b)=>b[1]-a[1])[0],r=(RIVALS[cat]||[]).find(x=>top&&top[1]>0&&x.focus===top[0]);if(r)addFx(s,{id:'copia-'+cat,kind:'debuff',icon:'🪞',name:'Parece cópia',eff:'Conversão −10% em '+G.products.find(p=>p.id===cat).name.toLowerCase(),src:'Seu foco em '+AXIS[top[0]].toLowerCase()+' é o mesmo da '+r.name,mult:.9,weeks:3,scope:cat,rival:r.id});const alt=(RIVALS[cat]||[]).find(x=>top&&top[1]>0&&x.weak===top[0]);if(alt)addFx(s,{id:'alt-'+cat,kind:'buff',icon:'🧭',name:'Alternativa à '+alt.name,eff:'Conversão +8% em '+G.products.find(p=>p.id===cat).name.toLowerCase(),src:'Seu foco em '+AXIS[top[0]].toLowerCase()+' é o ponto fraco da '+alt.name,mult:1.08,weeks:3,scope:cat,rival:alt.id});}
 }
 function addFx(s,f){const P=ensure(s);P.fx=P.fx.filter(x=>x.id!==f.id);P.fx.push({...f,until:week(s)+f.weeks});}
 // efeitos guardados e calculados, no formato da coluna de buffs
 function effects(s){const P=s.prog;if(!P)return[];const w=week(s),L=P.fx.filter(f=>f.until>w).map(f=>({...f,dur:(f.until-w)+' semana'+(f.until-w>1?'s':''),tag:(f.mult>=1?'+':'−')+Math.round(Math.abs(f.mult-1)*100)+'%'}));
  if(s.weekly&&P.lastLaunchWeek!=null&&w-P.lastLaunchWeek>=4)L.push({id:'semnovidade',kind:'debuff',icon:'💤',name:'Sem novidade',eff:'Conversão −10% em toda a empresa',src:(w-P.lastLaunchWeek)+' semanas sem lançar',dur:'Até o próximo lançamento',mult:.9,scope:'all',tag:'−10%'});
  if(s.productId&&(s.generation||1)>=3)L.push({id:'cansados',kind:'debuff',icon:'🥱',name:'Fãs cansados',eff:'Conversão −8% para '+(s.name||'este produto'),src:'Versão '+(s.generation||1)+' seguida da mesma linha',dur:'Enquanto a linha seguir igual',mult:.92,scope:'product',tag:'−8%'});
  const pc=priceComp(s);if(Math.abs(pc-1)>=.01){const pm=avgRivalPrice(s);L.push({id:'precorival',kind:pc>1?'buff':'debuff',icon:'🏷',name:pc>1?'Mais barato que a concorrência':'Mais caro que a concorrência',eff:'Conversão '+(pc>1?'+':'−')+Math.round(Math.abs(pc-1)*100)+'% em '+G.products.find(p=>p.id===s.productId).name.toLowerCase(),src:'Seu preço R$ '+s.price.toFixed(2).replace('.',',')+' contra R$ '+pm.toFixed(2).replace('.',',')+' da '+nearestRival(s).name+', a concorrente de preço mais próximo',dur:'Enquanto os preços ficarem assim',mult:pc,scope:s.productId,tag:(pc>1?'+':'−')+Math.round(Math.abs(pc-1)*100)+'%'});}
  return L;}
 function factor(s){return effects(s).filter(f=>f.scope==='all'||f.scope==='product'||f.scope===s.productId).reduce((n,f)=>n*(f.mult||1),1);}
 // ---------- encaixe na persona (só dá nome ao que o modelo já calcula) ----------
 function fit(s,persona){if(!persona||!persona.minimum||!s.attributes)return null;const A=s.attributes,total=Object.values(A).reduce((n,v)=>n+v,0);if(!total)return null;const order=Object.entries(persona.weights).sort((a,b)=>b[1]-a[1]).map(x=>x[0]),met=(A[persona.minimum.axis]||0)>=persona.minimum.minimum,share=Object.entries(A).reduce((n,[k,v])=>n+v*(persona.weights[k]||0),0)/(total*.35);
  if(!met)return{id:'miss',icon:'❌',kind:'debuff',name:'Errou o alvo',eff:persona.name+' exige '+AXIS[persona.minimum.axis].toLowerCase()+' '+persona.minimum.minimum+' ou mais. As vendas para ela caem.'};
  if((A[order[1]]||0)>0&&share>=.7)return{id:'hit',icon:'🎯',kind:'buff',name:'Encaixou na persona',eff:'Exigência atendida e o que '+persona.name+' valoriza caprichado.'};
  return{id:'almost',icon:'😐',kind:'neutral',name:'Quase lá',eff:'Exigência atendida, mas faltou capricho no que '+persona.name+' valoriza.'};}
 // ---------- conquistas ----------
 function achieve(s,id){const P=ensure(s),a=ACH.find(x=>x.id===id);if(!a||P.ach[id])return;P.ach[id]=week(s)+1;const why='Conquista: '+a.name+'.';if(a.reward==='piece')grantPiece(s,why,s.id+':ach:'+id);else grantCard(s,why,s.id+':ach:'+id);}
 function checkAch(s,revenue){const P=ensure(s),sold=(s.history||[]).filter(h=>h.cycle!==s.cycle).reduce((n,h)=>n+(h.sold||0),0)+(s.sold||0);if(sold>=100)achieve(s,'sold100');if((s.reviews||[]).some(r=>r.stars===5))achieve(s,'five');if(revenue>=50000)achieve(s,'rev50');if((s.level||0)>=6)achieve(s,'nv6');if(P.fans.pos>=10)achieve(s,'fans10');
  if(!P.ach.credit&&revenue>=CREDIT_AT){P.ach.credit=week(s)+1;news(s,{kind:'credit',icon:'🏦',title:'Crédito liberado',text:'Por conta do seu faturamento de R$ 20 mil, o Banco do Bairro liberou crédito para você. Ele fica em Finanças.'});}}
 // ---------- semana: pesquisa termina, rivais se mexem, fãs pedem, quem ficou sem resposta reclama ----------
 function onWeek(s,publish,img){const P=ensure(s),w=week(s);finishLab(s);
  const cats=(s.unlocked||[]).filter(c=>RIVALS[c]),k=s.id+':wk:'+w;
  const R=P.rivals;for(const m of Object.values(R.m)){if(m.camp>0)m.camp--;if(m.out>0)m.out--;}
  for(const cat of cats)rivalWeek(s,cat);
  passCheck(s,cats,w);
  // estágio 1: os rivais existem e aparecem no Nexus
  if(cats.length&&hash(k+'post')<.55){const cat=pick(cats,k+'cat'),r=pick(RIVALS[cat],k+'r'),p=G.products.find(x=>x.id===cat);R.k[r.id].focus=true;
   const lines=[r.name+' anuncia mais um '+p.name.toLowerCase()+' com aposta em '+AXIS[r.focus].toLowerCase()+'.',r.name+' diz que vendeu bem no mês e promete novidades em '+p.name.toLowerCase()+'.','Comparativo: o '+p.name.toLowerCase()+' da '+r.name+' segue forte em '+AXIS[r.focus].toLowerCase()+'.'];
   publish(s,{id:k+':rival',origin:'media',mediaType:'rival',authorId:'rival-'+r.id,author:r.name,handle:r.id,verified:true,context:'Concorrente · '+p.name,headline:pick(lines,k+'l'),product:r.name+' '+p.name,image:{kind:cat,color:r.color},text:'Foco declarado: '+AXIS[r.focus].toLowerCase()+'. Quem compete em '+p.name.toLowerCase()+' sente a pressão.',reactions:20+Math.floor(hash(k+'lk')*180),comments:[]});}
 market(s,publish,k,w);
  // pedidos dos fãs: com uma base de posts positivos, alguém pede uma categoria ou uma nova versão
  if(P.fans.pos>=5&&hash(k+'ask')<.35&&!P.fans.asks.some(a=>!a.done&&w-a.week<=6)){const locked=G.products.filter(p=>!P.cats.includes(p.id)),cat=locked.length&&hash(k+'kind')<.5?pick(locked,k+'ac'):null,who=pick(['Lu Ferraz','Caio M.','Dani Rocha','Bruna T.','Jorge Lima','Paty S.'],k+'who');
   const ask=cat?{id:k+':ask',kind:'cat',cat,week:w,done:false}:s.productId?{id:k+':ask',kind:'version',lineage:s.lineage||s.id,gen:s.generation||1,name:s.name,week:w,done:false}:null;const acat=cat||s.productId,ar=s.office&&RIVALS[acat]?pick(RIVALS[acat],k+'askr'):null;if(ask&&ar){ask.axis=ar.weak;ask.rivalName=ar.name;}
   if(ask){P.fans.asks.push(ask);P.fans.asks=P.fans.asks.slice(-8);publish(s,{id:ask.id,origin:'consumer',fan:true,authorId:'fan-'+who,author:who,context:'Fã da marca',sentiment:'positive',text:(cat?'@'+String(s.company||'').toLowerCase().replace(/[^a-z0-9]/g,'')+' faz um '+G.products.find(p=>p.id===cat).name.toLowerCase()+(ar?' mais '+ADJ[ar.weak]+' que o da '+ar.name:'')+'! Eu compraria no primeiro dia.':'Quero uma nova versão do '+s.name+(ar?' mais '+ADJ[ar.weak]+' que o da '+ar.name:'')+'. Já uso todo dia e dá pra ficar ainda melhor.'),reactions:60+Math.floor(hash(k+'al')*300),comments:['+1','Eu também!','Assino embaixo.']});}}
  // quem reclamou e ficou sem resposta vira cancelamento na próxima campanha
  const ignored=(s.social?.posts||[]).filter(p=>p.origin==='consumer'&&p.sentiment==='negative'&&!P.fans.replied[p.id]&&p.week===w&&!p.fan&&!p.rivalFan).length;if(ignored)P.fans.bonus.d=Math.min(2,P.fans.bonus.d+1);
 }
 // ---------- Nexus: responder posts ----------
 const TONES={thanks:'🙏 Agradecer',explain:'🛠 Explicar',joke:'😄 Brincar'};
 function reply(s,id,tone){const P=ensure(s),post=(s.social?.posts||[]).find(p=>p.id===id);if(!post||!(post.origin==='consumer'||post.provoke))throw Error('Post indisponível.');if(P.fans.replied[id])throw Error('Você já respondeu.');if(!TONES[tone])throw Error('Tom inválido.');
  if(post.provoke||post.rivalFan)return replyRival(s,post,tone);
  const good=post.sentiment==='positive'?tone!=='explain':post.sentiment==='negative'?tone==='explain':tone!=='joke';
  P.fans.replied[id]={tone,good};const lines={thanks:'Muito obrigado por contar! Isso faz nosso dia.',explain:'Obrigado pelo retorno. Já anotamos e vamos melhorar isso na próxima versão.',joke:'Prometemos que o próximo vem com ainda mais capricho 😄'};
  post.comments=[...(post.comments||[]),'@'+(s.company||'empresa')+': '+lines[tone],good?(post.author.split(' ')[0]+': Valeu pela resposta!'):(post.author.split(' ')[0]+': Não foi bem isso que eu quis dizer.')];
  if(good){post.reactions=(post.reactions||0)+5;P.fans.bonus.m=Math.min(3,P.fans.bonus.m+1);}else P.fans.bonus.d=Math.min(3,P.fans.bonus.d+1);return good;}
 function countPost(s,post){const P=s.prog;if(P&&post.origin==='consumer'&&post.sentiment==='positive'&&!post.fan)P.fans.pos++;}
 function consumerComments(s,sentiment,rand){const r=(RIVALS[s.productId]||[]);if(r.length&&sentiment!=='positive'&&rand('rival')<.45){const x=pick(r,s.id+':'+s.sold+':rc');return[{economy:'Comprei o da '+x.name+', era mais barato.',quality:'O da '+x.name+' tem acabamento melhor.',performance:'O da '+x.name+' responde mais rápido.',durability:'O meu da '+x.name+' já tem dois anos.',versatility:'O da '+x.name+' funciona em tudo.',practicality:'O da '+x.name+' é só ligar e usar.'}[x.focus]];}return rand('comment')<.4?['Valeu por contar como foi no uso.']:[];}
 // ---------- bônus da comunidade para a próxima campanha ----------
 function boardBonus(s){const P=s.prog;if(!P)return{m:0,d:0,inf:0,free:0};return{m:P.fans.bonus.m,d:P.fans.bonus.d,inf:P.fans.bonus.inf,free:Math.min(3,Math.floor(Math.max(0,P.fans.pos-P.fans.posUsed)/5))};}
 function useBoard(s){const P=s.prog;if(!P)return;const b=boardBonus(s);P.fans.posUsed+=b.free*5;P.fans.bonus={m:0,d:0,inf:0};}
 // ---------- ranking ----------
 function rankingOld(s,cat=s.productId){const r=RIVALS[cat];if(!r)return[];const w=Math.max(1,week(s)),own=(s.history||[]).filter(h=>h.productId===cat&&h.cycle!==s.cycle).reduce((n,h)=>n+(h.sold||0),0)+(s.productId===cat?s.sold||0:0)+(s.portfolio||[]).filter(p=>p.productId===cat).reduce((n,p)=>n+(p.sold||0),0);
  const rows=[...r.map(x=>({name:x.name,units:Math.round(x.pace*(8+w)),rival:true})),{name:s.company||'Você',units:own,you:true}],total=rows.reduce((n,x)=>n+x.units,0)||1;return rows.map(x=>({...x,share:Math.round(x.units/total*100)})).sort((a,b)=>b.units-a.units);}
 // ---------- livro: deduzir qual atributo está por trás de cada fala ----------
 // falas: 0 = a frase principal (exigência), 1 e 2 = o que ela valoriza, 3 = o que não importa
 function truth(p){const o=Object.entries(p.weights).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);return[p.minimum?.axis||o[0],o[1],o[2],Object.entries(p.weights).find(([,v])=>v===0)?.[0]||o[5]];}
 const LINE_KIND=['Exigência','Valoriza','Valoriza','Não importa'],LINE_SYM=['!','++','+','·'];
 function deduceSlot(s){const w=s.learningWindow;if(!w||!w.closed)return{ok:false,why:'Lance e encerre as vendas de um produto para juntar pistas.'};const P=s.prog||{tried:{}};if(P.tried[w.id])return{ok:false,why:'Você já usou a dedução deste lançamento. Lance de novo para tentar outra fala.'};if((w.sales?.[w.personaId]||0)<10)return{ok:false,why:'Precisamos de pelo menos dez compras da persona deste lançamento.'};return{ok:true,window:w};}
 function deduce(s,line,axis){const slot=deduceSlot(s);if(!slot.ok)throw Error(slot.why);const w=slot.window,p=G.personas({productId:w.productId,universal:true,personaSet:s.personaSet}).find(x=>x.id===w.personaId);if(!p)throw Error('Persona indisponível.');if(![0,1,2,3].includes(line)||!AXIS[axis])throw Error('Escolha uma fala e um atributo.');
  const P=s.prog,key=w.productId+':'+p.id,b=P.book[key]??=[{},{},{},{}];if(b[line].ok)throw Error('Essa fala já foi decifrada.');if((b[line].wrong||[]).includes(axis))throw Error('Esse atributo já foi descartado para essa fala.');
  P.tried[w.id]=true;const ok=truth(p)[line]===axis;if(ok){b[line]={ok:true,axis};
   if(s.learning){const fk=line===0?'minimum:'+w.productId+':'+p.id+':'+axis:'product:'+w.productId+':'+p.id+':'+axis;s.learning.facts[fk]={kind:line===0?'minimum':'product',key:fk,productId:w.productId,personaId:p.id,axis,symbol:LINE_SYM[line],title:AXIS[axis]+' · '+p.name,text:LINE_KIND[line]+' de '+p.name+'. Deduzido a partir das vendas e das falas.',learnedAt:w.id};}}
  else b[line]={...b[line],wrong:[...(b[line].wrong||[]),axis]};return ok;}
 function bookStats(s){const P=s.prog;let done=0,total=0;for(const p of G.products){const n=G.personas({productId:p.id,universal:true,personaSet:s.personaSet}).length*4;total+=n;}for(const b of Object.values(P?.book||{}))done+=b.filter(x=>x.ok).length;return{done,total};}
 // ---------- cidade: Seu Zé vende peças, Kaique grava vídeos ----------
 function townAct(s,what){const P=ensure(s),wk=week(s);
  if(what==='zeBuy'){if(P.town.zeWeek===wk)throw Error('O Seu Zé só recebe peça nova uma vez por semana.');if(!lockedPieces(s).length)throw Error('Você já tem todas as peças.');P.town.zeWeek=wk;grantPiece(s,'Comprada na loja do Seu Zé.',s.id+':ze:'+wk);}
  else if(what==='zeGift'){if(P.town.zeGift)throw Error('O Seu Zé já te deu uma peça.');P.town.zeGift=true;grantPiece(s,'Presente do Seu Zé, pela amizade.',s.id+':zegift');}
  else if(what==='kaique'){if(P.town.kaiqueWeek===wk)throw Error('O Kaique já gravou um vídeo nesta semana.');P.town.kaiqueWeek=wk;P.fans.bonus.inf=Math.min(2,P.fans.bonus.inf+1);news(s,{kind:'fx',icon:'🎥',title:'O Kaique vai falar da sua marca',text:'Uma carta extra de Influenciador entra na sua próxima campanha.'});}
  else if(what==='zeGossip'){if(P.town.gossipWeek===wk)throw Error('O Seu Zé já contou as novidades desta semana.');P.town.gossipWeek=wk;P.town.line=gossip(s);}
  else throw Error('Ação indisponível.');}
 function onHire(s,person){if(person?.ex){const R=ensure(s).rivals,r=allRivals().find(x=>x.id===person.ex.id);if(r){R.k[r.id].focus=true;R.k[r.id].weak=true;R.m[r.id].camp=2;R.press[r.cat]=Math.min(2,(R.press[r.cat]||0)+1);news(s,{kind:'fx',icon:'🕵',title:(person.name||'Quem chegou')+' veio da '+r.name,text:'Contou que o foco deles é '+AXIS[r.focus].toLowerCase()+' e o ponto fraco é '+AXIS[r.weak].toLowerCase()+'. Está no livro. A '+r.name+' não gostou e entrou em campanha.'});}}if(person?.area==='product')grantPiece(s,(person.name||'Quem chegou')+' trouxe uma peça do antigo emprego.',s.id+':hire:'+person.id);else if(person?.area==='marketing')grantCard(s,(person.name||'Quem chegou')+' trouxe uma carta que usava no antigo emprego.',s.id+':hire:'+person.id);}
 // ================= CONCORRENTES (1.17) =================
 const charm=p=>Math.max(9.9,Math.round(p/10)*10-.1),stage2=s=>!!s.office,matIndex=s=>s.prog?.mat?.v??1,pn=c=>G.products.find(x=>x.id===c).name.toLowerCase();
 // preço do rival: preço de partida da categoria × perfil do foco × bolsa (raiz de 0,4) × corte de preço
 function rivalPrice(s,r,cat){const m=s.prog?.rivals?.m?.[r.id]||{cut:0};return charm(CAT_PRICE[cat]*FOCUS_MULT[r.focus]*Math.pow(matIndex(s),.4)*(1-(m.cut||0)));}
 function rivalPrices(s,cat=s.productId){return(RIVALS[cat]||[]).map(r=>({id:r.id,name:r.name,price:rivalPrice(s,r,cat),cut:s.prog?.rivals?.m?.[r.id]?.cut||0,out:!!s.prog?.rivals?.m?.[r.id]?.out,known:s.prog?.rivals?.k?.[r.id]||{}}));}
 function avgRivalPrice(s,cat=s.productId){return nearestRival(s,cat)?.price||0;}
 function nearestRival(s,cat=s.productId){const L=rivalPrices(s,cat).filter(x=>!x.out);if(!L.length||!(s.price>0))return null;return L.sort((a,b)=>Math.abs(a.price-s.price)-Math.abs(b.price-s.price))[0];}
 // estágio 2: (preço do concorrente mais próximo / seu preço) elevado a 0,25, limitado entre −12% e +8%
 function priceComp(s){if(!stage2(s)||!s.productId||!RIVALS[s.productId]||!(s.price>0))return 1;const pm=avgRivalPrice(s);if(!pm)return 1;return Math.round(Math.max(.88,Math.min(1.08,Math.pow(pm/s.price,.25)))*1000)/1000;}
 // bolsa de componentes: índice 100% = preço normal. Comprar q unidades custa em média índice × (1 + q/6000) e empurra o índice em q/3000.
 const LIQ=3000;
 function matPrice(s,q){return matIndex(s)*(1+Math.max(0,q||0)/(2*LIQ));}
 function onBuy(s,q){const P=ensure(s);P.mat.v=Math.round(Math.min(1.6,P.mat.v+Math.max(0,q)/LIQ)*1000)/1000;P.mat.hist[P.mat.hist.length-1]=P.mat.v;}
 // todo dia: volta 12% em direção a 100%, ruído de ±3% e +1,5% se algum rival estiver em campanha
 function onDay(s){const P=ensure(s),d=s.weekly?.days||0,camp=Object.values(P.rivals.m).some(m=>m.camp>0)?.015:0;const v=P.mat.v+.12*(1-P.mat.v)+(hash(s.id+':mat:'+d)-.5)*.06+camp;P.mat.v=Math.round(Math.max(.7,Math.min(1.6,v))*1000)/1000;P.mat.hist.push(P.mat.v);if(P.mat.hist.length>20)P.mat.hist.shift();}
 function catSold(s,cat){return(s.history||[]).filter(h=>h.productId===cat&&h.cycle!==s.cycle).reduce((n,h)=>n+(h.sold||0),0)+(s.productId===cat?s.sold||0:0)+(s.portfolio||[]).filter(p=>p.productId===cat).reduce((n,p)=>n+(p.sold||0),0);}
 // vendas da semana do rival = ritmo × (1/bolsa)^0,8 × campanha 1,3 × (0 se sem estoque) × vantagem de preço − clientes que você tirou + clientes que voltaram para ele
 function rivalWeek(s,cat){const R=s.prog.rivals,total=catSold(s,cat),mine=Math.max(0,total-(R.snap[cat]??0));R.snap[cat]=total;const M=matIndex(s),row={w:week(s),you:mine},conv=R.conv[cat]||0;R.conv[cat]=0;
  for(const r of RIVALS[cat]){const m=R.m[r.id],adv=s.productId===cat&&s.price>0?Math.max(.8,Math.min(1.25,Math.pow(s.price/rivalPrice(s,r,cat),.5))):1;row[r.id]=Math.max(0,Math.round(r.pace*Math.pow(1/M,.8)*(m.camp>0?1.3:1)*(m.out>0?0:1)*adv-conv*4/RIVALS[cat].length+(m.lost||0)));m.lost=0;}
  (R.hist[cat]??=[]).push(row);if(R.hist[cat].length>12)R.hist[cat].shift();}
 function ranking(s,cat=s.productId){const r=RIVALS[cat];if(!r)return[];const H=s.prog?.rivals?.hist?.[cat]||[];
  const sum=rows=>{const t={you:0};r.forEach(x=>t[x.id]=rows.length?0:x.pace);rows.forEach(z=>{t.you+=z.you||0;r.forEach(x=>t[x.id]+=z[x.id]||0);});return t;};
  const share=t=>{const tot=Object.values(t).reduce((a,b)=>a+b,0)||1;return k=>Math.round(t[k]/tot*100);},now=sum(H.slice(-4)),sn=share(now),sp=share(sum(H.slice(-5,-1))),tr=k=>H.length>=2?sn(k)-sp(k):0;
  return[...r.map(x=>({id:x.id,name:x.name,units:now[x.id],share:sn(x.id),trend:tr(x.id),rival:true})),{id:'you',name:s.company||'Você',units:now.you,share:sn('you'),trend:tr('you'),you:true}].sort((a,b)=>b.units-a.units);}
 function passCheck(s,cats,w){const R=s.prog.rivals;for(const cat of cats){if((R.hist[cat]||[]).length<2)continue;const rk=ranking(s,cat),me=rk.findIndex(x=>x.you);rk.slice(me+1).filter(x=>x.rival&&!R.passed[x.id]&&rk[me].units>0).forEach(x=>{R.passed[x.id]=w;const n=Object.keys(R.passed).length;news(s,{kind:'fx',icon:'🏆',title:'Você passou a '+x.name+' em '+pn(cat),text:'Nas últimas 4 semanas você vendeu mais que ela. De prêmio, '+(n%2?'uma carta nova':'uma peça nova')+'.'});(n%2?grantCard:grantPiece)(s,'Prêmio por passar a '+x.name+' no ranking.',s.id+':pass:'+x.id);});}}
 function rpost(s,publish,id,r,cat,o){publish(s,{id,origin:'media',mediaType:'rival',authorId:'rival-'+r.id,author:r.name,handle:r.id,verified:true,context:'Concorrente · '+G.products.find(x=>x.id===cat).name,product:r.name+' '+G.products.find(x=>x.id===cat).name,image:{kind:cat,color:r.color},reactions:30+Math.floor(hash(id+'lk')*220),comments:[],...o});}
 // o mercado da semana: estoque, preço, campanha, cópia, comparativo, provocação, fã do rival e assédio
 function market(s,publish,k,w){const P=s.prog,R=P.rivals,cur=s.productId&&RIVALS[s.productId]?s.productId:null;if(!cur)return;let ev=0;
  if(P.mat.v>=1.25&&hash(k+'out')<.5){const r=pick(RIVALS[cur],k+'outr');R.m[r.id].out=1;ev++;rpost(s,publish,k+':out',r,cur,{headline:r.name+' está sem estoque de '+pn(cur),text:'Com os componentes caros, a '+r.name+' não conseguiu produzir nesta semana.'});if(stage2(s))addFx(s,{id:'out-'+r.id,kind:'buff',icon:'📦',name:r.name+' sem estoque',eff:'Conversão +12% em '+pn(cur),src:'A bolsa de componentes passou de 125%',mult:1.12,weeks:1,scope:cur});}
  if(!stage2(s))return;
  const rk=ranking(s,cur),my=rk.find(x=>x.you)?.share||0,launched=P.lastLaunchWeek===w;
  if(s.price>0)for(const r of RIVALS[cur]){const m=R.m[r.id],rp=rivalPrice(s,r,cur);if(s.price<rp*.95&&s.price>rp*.7){m.under++;if(m.under>=2&&m.cut<.2){m.cut=Math.round((m.cut+.1)*100)/100;m.under=0;R.k[r.id].react=true;ev++;rpost(s,publish,k+':cut:'+r.id,r,cur,{headline:r.name+' baixou o preço do '+pn(cur)+' para R$ '+rivalPrice(s,r,cur).toFixed(2).replace('.',','),text:'Foram duas semanas vendo a concorrência mais barata. A resposta veio no preço.'});}}else{m.under=0;if(m.cut>0)m.cut=Math.max(0,Math.round((m.cut-.05)*100)/100);}}
  if(ev<2&&(my>=20||launched)&&hash(k+'camp')<.35){const r=pick(RIVALS[cur],k+'cr');if(w-(R.lastCamp[r.id]??-9)>=3&&!R.m[r.id].camp){R.m[r.id].camp=2;R.lastCamp[r.id]=w;R.press[cur]=Math.min(2,(R.press[cur]||0)+1);ev++;rpost(s,publish,k+':camp',r,cur,{headline:r.name+' entra em campanha pesada de '+pn(cur),text:'Outdoor, influenciador e anúncio em todo canto. Na sua próxima campanha, mais gente vai estar ocupada com a '+r.name+'.'});}}
  if(ev<2&&rk[0]?.you&&hash(k+'copy')<.25&&!P.fx.some(f=>f.id==='copiou-'+cur&&f.until>w)){const r=pick(RIVALS[cur],k+'cp');ev++;addFx(s,{id:'copiou-'+cur,kind:'debuff',icon:'🪞',name:r.name+' copiou você',eff:'Conversão −15% em '+pn(cur),src:'Você lidera o ranking e virou alvo',mult:.85,weeks:3,scope:cur,rival:r.id});rpost(s,publish,k+':copy',r,cur,{headline:r.name+' lança um '+pn(cur)+' parecido com o da '+(s.company||'concorrência'),text:'Quem lidera vira referência. E referência é copiada.'});}
  const revs=s.reviews||[];if(ev<2&&revs.length>=5&&hash(k+'cmp')<.25){const r=pick(RIVALS[cur],k+'cmpr'),mine=revs.reduce((n,x)=>n+x.stars,0)/revs.length,f=v=>v.toFixed(1).replace('.',',');ev++;publish(s,{id:k+':cmp',origin:'media',mediaType:'seo',authorId:'media-seo',author:'Guia Compra Certa',handle:'guiacompracerta',verified:true,context:'Comparativo',headline:(s.name||'Seu produto')+' × '+r.name+': '+f(mine)+' contra '+f(r.rating),product:s.name,text:mine>r.rating+.1?'Na nota dos clientes, o '+s.name+' levou a melhor.':mine<r.rating-.1?'Na nota dos clientes, a '+r.name+' ainda está na frente.':'Empate técnico na nota dos clientes.',reactions:80+Math.floor(hash(k+'cmpl')*300),comments:[]});if(mine>r.rating+.1)addFx(s,{id:'cmp',kind:'buff',icon:'🥇',name:'Ganhou o comparativo',eff:'Conversão +8% em '+pn(cur),src:'Guia Compra Certa: '+f(mine)+' contra '+f(r.rating)+' da '+r.name,mult:1.08,weeks:2,scope:cur});else if(mine<r.rating-.1)addFx(s,{id:'cmp',kind:'debuff',icon:'🥈',name:'Perdeu o comparativo',eff:'Conversão −6% em '+pn(cur),src:'Guia Compra Certa: '+f(mine)+' contra '+f(r.rating)+' da '+r.name,mult:.94,weeks:2,scope:cur});}
  if(ev<2&&(my>=25||Object.values(R.passed).includes(w))&&hash(k+'prov')<.3){const r=pick(RIVALS[cur],k+'pv');ev++;rpost(s,publish,k+':prov',r,cur,{provoke:r.id,headline:pick(['Mais um '+pn(cur)+' querendo aparecer? A gente faz isso há anos 😏','Tem marca nova achando que entende de '+pn(cur)+'. Fica a dica: '+AXIS[r.focus].toLowerCase()+' não se improvisa.','Concorrência é bom. Pena que nem toda concorrência entrega.'],k+'pvl'),text:'A '+r.name+' provocou. Responder pode render ou custar caro.'});}
  if(hash(k+'rfan')<.3){const r=pick(RIVALS[cur],k+'rf'),who=pick(['Rafa Lins','Gabi Souza','Téo Martins','Lia Prado','Nando Reis','Cris Alves'],k+'rfw');publish(s,{id:k+':rfan',origin:'consumer',rivalFan:r.id,sentiment:'negative',authorId:'rf-'+who,author:who,context:'Cliente da '+r.name,text:WEAK_LINE[r.weak](r.name,pn(cur)),reactions:5+Math.floor(hash(k+'rfl')*60),comments:[]});}
  poach(s,w,k);}
 function poach(s,w,k){const R=s.prog.rivals,T=s.team;if(!T?.staff?.length)return;
  if(R.poach&&w>R.poach.week){const p=T.staff.find(x=>x.id===R.poach.id);if(p){if((p.motivation||0)<40){T.staff=T.staff.filter(x=>x!==p);const o=(s.weekly?.obligations||[]).find(x=>x.active&&(x.id==='salary:'+p.id||x.id.startsWith('salary:'+p.id+':')));if(o)o.active=false;news(s,{kind:'fx',icon:'🚪',title:p.name+' foi para a '+R.poach.name,text:'A motivação não passou de 40 a tempo e a proposta da concorrência venceu.'});}else news(s,{kind:'fx',icon:'🤝',title:p.name+' recusou a proposta da '+R.poach.name,text:'Com a motivação em dia, a equipe ficou.'});}R.poach=null;return;}
  if(R.poach)return;const low=T.staff.filter(p=>(p.motivation||0)<40);if(!low.length||hash(k+'poach')>=.3)return;const p=pick(low,k+'pp'),r=pick(RIVALS[s.productId],k+'pr');R.poach={id:p.id,name:r.name,week:w};news(s,{kind:'fx',icon:'📨',title:'A '+r.name+' fez uma proposta para '+p.name,text:'Se a motivação de '+p.name+' não passar de 40 até o fim da próxima semana, a proposta é aceita. Treino e bons resultados ajudam.'});}
 // avaliações: nota baixa pode voltar para o rival; nota 5 pode ter vindo dele
 function onReview(s,e,rand){const r=RIVALS[s.productId];if(!r||!s.prog)return;const R=ensure(s).rivals;if(e.stars<=2&&rand('switch')<.35){const x=pick(r,s.id+':sw:'+s.sold);R.m[x.id].lost=(R.m[x.id].lost||0)+1;e.feedback=(e.feedback?e.feedback+' ':'')+'Voltei pra '+x.name+'.';e.switched=x.id;}else if(e.stars===5&&rand('won')<.3){const x=pick(r,s.id+':wn:'+s.sold);R.conv[s.productId]=(R.conv[s.productId]||0)+.25;e.feedback=(e.feedback?e.feedback+' ':'')+'Larguei a '+x.name+' por esse.';e.won=x.id;}}
 // tabuleiro: cada cliente do rival convertido tira 4 vendas dele na semana
 function onBoard(s,cat,n){if(!RIVALS[cat]||!(n>0))return;const R=ensure(s).rivals;R.conv[cat]=(R.conv[cat]||0)+n;}
 function boardPress(s){return stage2(s)&&s.productId?(s.prog?.rivals?.press?.[s.productId]||0):0;}
 function replyRival(s,post,tone){const P=s.prog,R=P.rivals,co='@'+(s.company||'empresa')+': ';let good;
  if(post.provoke){const r=allRivals().find(x=>x.id===post.provoke),revs=s.reviews||[],avg=revs.length?revs.reduce((n,x)=>n+x.stars,0)/revs.length:0;let fx;
   if(tone==='thanks'){good=true;fx=['elegancia','🎩','Resposta elegante',1.05];}else if(tone==='explain'){good=avg>=r.rating;fx=good?['numeros','📊','Respondeu com números',1.08]:['pegoumal','😬','Pegou mal',.94];}else{good=avg>=4.2;fx=good?['viral','🔥','Resposta viralizou',1.12]:['pegoumal','😬','Pegou mal',.92];}
   addFx(s,{id:'resp-'+fx[0],kind:fx[3]>=1?'buff':'debuff',icon:fx[1],name:fx[2],eff:'Conversão '+(fx[3]>=1?'+':'−')+Math.round(Math.abs(fx[3]-1)*100)+'% em toda a empresa',src:'Resposta à provocação da '+r.name,mult:fx[3],weeks:2,scope:'all'});
   post.comments=[...(post.comments||[]),co+{thanks:'Concorrência faz bem pro mercado. Boa sorte pra vocês também!',explain:'Nossa nota média está em '+avg.toFixed(1).replace('.',',')+'. Os clientes respondem por nós.',joke:'Fica tranquila, '+r.name+', a gente deixa um espacinho pra vocês na prateleira 😄'}[tone],good?'Mandou bem!':'Eita, essa doeu… em vocês.'];
   P.fans.replied[post.id]={tone,good,fx:fx[2]};if(good)post.reactions=(post.reactions||0)+40;return good;}
  const r=allRivals().find(x=>x.id===post.rivalFan);good=tone!=='joke';
  post.comments=[...(post.comments||[]),co+{thanks:'Poxa, sinto muito. Se quiser conhecer o nosso, estamos por aqui.',explain:'Entendemos. O nosso foi pensado justamente pra isso. Qualquer dúvida, chama.',joke:'Clássico da '+r.name+' 😂'}[tone],good?post.author.split(' ')[0]+': Vou dar uma olhada no de vocês.':post.author.split(' ')[0]+': Não achei graça.'];
  if(good){P.fans.bonus.m=Math.min(3,P.fans.bonus.m+1);R.conv[r.cat]=(R.conv[r.cat]||0)+4;R.k[r.id].weak=true;}else P.fans.bonus.d=Math.min(3,P.fans.bonus.d+1);
  P.fans.replied[post.id]={tone,good};return good;}
 // segredos dos rivais: ponto fraco primeiro, depois o jeito de reagir a preço
 function nextSecret(s){const R=s.prog?.rivals;if(!R?.k)return null;const cats=[s.productId,...(s.unlocked||[])].filter((c,i,a)=>c&&RIVALS[c]&&a.indexOf(c)===i);for(const c of cats)for(const r of RIVALS[c]){const K=R.k[r.id]||{};if(!K.weak)return{r,cat:c,item:'weak'};}for(const c of cats)for(const r of RIVALS[c]){const K=R.k[r.id]||{};if(!K.react)return{r,cat:c,item:'react'};}return null;}
 function reveal(s,why){const n=nextSecret(s);if(!n){news(s,{kind:'fx',icon:'🕵',title:why,text:'Não sobrou nada para descobrir dos concorrentes liberados.'});return null;}const K=s.prog.rivals.k[n.r.id];K.focus=true;K[n.item]=true;const t=n.item==='weak'?'O ponto fraco da '+n.r.name+' em '+pn(n.cat)+' é '+AXIS[n.r.weak].toLowerCase()+'. Um produto forte nisso vira alternativa a ela.':'A '+n.r.name+' baixa o preço em 10% quando você fica 5% mais barato por 2 semanas seguidas.';news(s,{kind:'fx',icon:'🕵',title:why+': '+n.r.name,text:t+' Está no livro.'});return t;}
 function gossip(s){const P=s.prog,R=P.rivals,cur=s.productId&&RIVALS[s.productId]?s.productId:(s.unlocked||[]).find(c=>RIVALS[c]);if(!cur)return 'Por enquanto, nada de novo no bairro.';const leader=RIVALS[cur][0];
  if(R.passed[leader.id]&&!P.town.zeVitrine){P.town.zeVitrine=true;return 'Tirei a '+leader.name+' da vitrine e botei o seu. Tá saindo mais, sabia?';}
  const soon=RIVALS[cur].find(r=>R.m[r.id].under===1);if(soon)return 'Ouvi do fornecedor que a '+soon.name+' tá pra baixar o preço. Vocês estão mais baratos e eles não gostaram.';
  const t=reveal(s,'Fofoca do Seu Zé');return t?'Conserto muita coisa aqui, sabe? '+t:'Dos concorrentes, já te contei tudo o que eu sei.';}
 function deduceRival(s,rid,axis){const slot=deduceSlot(s);if(!slot.ok)throw Error(slot.why);const r=allRivals().find(x=>x.id===rid),K=ensure(s).rivals.k[rid];if(!r)throw Error('Concorrente indisponível.');if(!AXIS[axis])throw Error('Escolha um atributo.');if(K.weak)throw Error('Já sabemos o ponto fraco.');if(K.wrong.includes(axis))throw Error('Esse atributo já foi descartado.');s.prog.tried[slot.window.id]=true;const ok=r.weak===axis;if(ok){K.weak=true;K.focus=true;}else K.wrong.push(axis);return ok;}
 function tagCandidates(s,list){if(!stage2(s)||!list?.length)return;const cats=(s.unlocked||[]).filter(c=>RIVALS[c]);if(!cats.length||hash(s.id+':cand:'+(s.team?.seq||0))>=.3)return;const cat=pick(cats,s.id+':cc:'+(s.team?.seq||0)),r=pick(RIVALS[cat],s.id+':cr:'+(s.team?.seq||0));list[0].ex={id:r.id,name:r.name};}
 return{ALL_PIECES,STARTER_PIECES,ALL_CARDS,STARTER_CARDS,CARD_NAMES,RIVALS,ACH,TONES,RESEARCH_COST,CREDIT_AT,LINE_KIND,LINE_SYM,AXIS,ensure,research,finishLab,onLaunch,onWeek,addFx,effects,factor,fit,achieve,checkAch,reply,countPost,consumerComments,boardBonus,useBoard,ranking,truth,deduceSlot,deduce,bookStats,townAct,onHire,allRivals,rivalPrices,avgRivalPrice,nearestRival,priceComp,matIndex,matPrice,onBuy,onDay,onReview,onBoard,boardPress,deduceRival,tagCandidates,catSold,stage2,nextSecret,lockedPieces,lockedCards,lockedCats,week};
})();
if(typeof module!=='undefined')module.exports=Progress;
