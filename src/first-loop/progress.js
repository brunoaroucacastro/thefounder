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
  headphones:[{id:'sommax',name:'SomMax',focus:'economy',pace:70,color:'#d55e00'},{id:'zuvi',name:'Zuvi',focus:'quality',pace:38,color:'#56b4e9'}],
  mouse:[{id:'klik',name:'Klik',focus:'performance',pace:60,color:'#cc79a7'},{id:'kora',name:'Kora',focus:'economy',pace:45,color:'#009e73'}],
  keyboard:[{id:'teclab',name:'TecLab',focus:'durability',pace:52,color:'#e69f00'},{id:'tipo',name:'Tipo',focus:'versatility',pace:34,color:'#0072b2'}],
  speaker:[{id:'boombox',name:'BoomBox',focus:'performance',pace:58,color:'#d55e00'},{id:'nuvem',name:'Nuvem',focus:'practicality',pace:40,color:'#56b4e9'}]};
 const ACH=[
  {id:'sold100',icon:'📦',name:'Cem unidades',text:'Venda 100 unidades no total.',reward:'piece'},
  {id:'five',icon:'⭐',name:'Cinco estrelas',text:'Receba a primeira avaliação de 5 estrelas.',reward:'piece'},
  {id:'rev50',icon:'💰',name:'R$ 50 mil',text:'Fature R$ 50 mil no total.',reward:'card'},
  {id:'nv6',icon:'🛠',name:'Nível 6',text:'Leve um produto ao nível 6.',reward:'piece'},
  {id:'twoCats',icon:'🗂',name:'Duas frentes',text:'Lance produtos de duas categorias diferentes.',reward:'card'},
  {id:'fans10',icon:'💬',name:'Comunidade',text:'Junte 10 posts positivos de clientes no Nexus.',reward:'piece'}];
 const week=s=>s.weekly?.reports?.length||0;
 function hash(k){let h=2166136261;for(const c of String(k)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;return(h>>>0)/4294967296;}
 function ensure(s){
  if(s.prog)return s.prog;
  const legacy=(s.history||[]).length>0;
  const stage=R.Board.stageFor(s.marketingExp||0);
  s.prog={v:1,pts:0,pieces:legacy?[...ALL_PIECES]:[...STARTER_PIECES],cards:legacy?[...new Set(R.Board.stages.slice(0,stage+1).flatMap(x=>x.cards))]:[...STARTER_CARDS],
   ach:{},fx:[],launched:{},cats:[],lastLaunchWeek:null,lab:null,news:[],
   fans:{pos:0,posUsed:0,replied:{},asks:[],bonus:{m:0,d:0,inf:0}},rivals:{posted:{},lastAct:-9},book:{},tried:{},town:{}};
  if(!legacy&&s.gadgets&&!s.productId&&Array.isArray(s.unlocked))s.unlocked=START_CATS.filter(id=>G.products.some(p=>p.id===id));
  return s.prog;
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
 function research(s,kind){const P=ensure(s);if(!['cat','piece','card'].includes(kind))throw Error('Pesquisa inválida.');if(P.lab)throw Error('Já existe uma pesquisa em andamento.');if(P.pts<1)throw Error('Lance um produto novo para ganhar um ponto de pesquisa.');
  if(kind==='cat'&&!lockedCats(s).length)throw Error('Todas as categorias já estão liberadas.');if(kind==='piece'&&!lockedPieces(s).length)throw Error('Você já tem todas as peças.');if(kind==='card'&&!lockedCards(s).length)throw Error('Você já tem todas as cartas.');
  if(s.cash<RESEARCH_COST)throw Error('A pesquisa custa R$ 1.200.');s.cash=Math.round((s.cash-RESEARCH_COST)*100)/100;s.operatingCost=(s.operatingCost||0)+RESEARCH_COST;P.pts--;P.lab={kind,week:week(s)};if(!s.weekly)finishLab(s);}
 function finishLab(s){const P=ensure(s),L=P.lab;if(!L)return;P.lab=null;const k=s.id+':lab:'+week(s)+':'+L.kind+':'+P.pts;
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
  for(const a of P.fans.asks)if(!a.done&&w-a.week<=6&&(a.kind==='cat'?a.cat===cat:a.lineage===(s.lineage||s.id)&&(s.generation||1)>a.gen)){a.done=true;addFx(s,{id:'comunidade',kind:'buff',icon:'🤝',name:'Ouviu sua comunidade',eff:'Conversão +10% em toda a empresa',src:'Atendeu um pedido dos fãs no Nexus',mult:1.1,weeks:4,scope:'all'});news(s,{kind:'fx',icon:'🤝',title:'Você ouviu sua comunidade',text:'Quem pediu no Nexus viu o lançamento. Buff de +10% de conversão por 4 semanas.'});}
  // parece cópia: seu atributo principal é exatamente o foco de um rival da categoria
  if(s.office){const top=Object.entries(s.attributes||{}).sort((a,b)=>b[1]-a[1])[0],r=(RIVALS[cat]||[]).find(x=>top&&top[1]>0&&x.focus===top[0]);if(r)addFx(s,{id:'copia-'+cat,kind:'debuff',icon:'🪞',name:'Parece cópia',eff:'Conversão −10% em '+G.products.find(p=>p.id===cat).name.toLowerCase(),src:'Seu foco em '+AXIS[top[0]].toLowerCase()+' é o mesmo da '+r.name,mult:.9,weeks:3,scope:cat,rival:r.id});}
 }
 function addFx(s,f){const P=ensure(s);P.fx=P.fx.filter(x=>x.id!==f.id);P.fx.push({...f,until:week(s)+f.weeks});}
 // efeitos guardados e calculados, no formato da coluna de buffs
 function effects(s){const P=s.prog;if(!P)return[];const w=week(s),L=P.fx.filter(f=>f.until>w).map(f=>({...f,dur:(f.until-w)+' semana'+(f.until-w>1?'s':''),tag:(f.mult>=1?'+':'−')+Math.round(Math.abs(f.mult-1)*100)+'%'}));
  if(s.weekly&&P.lastLaunchWeek!=null&&w-P.lastLaunchWeek>=4)L.push({id:'semnovidade',kind:'debuff',icon:'💤',name:'Sem novidade',eff:'Conversão −10% em toda a empresa',src:(w-P.lastLaunchWeek)+' semanas sem lançar',dur:'Até o próximo lançamento',mult:.9,scope:'all',tag:'−10%'});
  if(s.productId&&(s.generation||1)>=3)L.push({id:'cansados',kind:'debuff',icon:'🥱',name:'Fãs cansados',eff:'Conversão −8% para '+(s.name||'este produto'),src:'Versão '+(s.generation||1)+' seguida da mesma linha',dur:'Enquanto a linha seguir igual',mult:.92,scope:'product',tag:'−8%'});
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
  // estágio 1: os rivais existem e aparecem no Nexus
  if(cats.length&&hash(k+'post')<.55){const cat=pick(cats,k+'cat'),r=pick(RIVALS[cat],k+'r'),p=G.products.find(x=>x.id===cat);
   const lines=[r.name+' anuncia mais um '+p.name.toLowerCase()+' com aposta em '+AXIS[r.focus].toLowerCase()+'.',r.name+' diz que vendeu bem no mês e promete novidades em '+p.name.toLowerCase()+'.','Comparativo: o '+p.name.toLowerCase()+' da '+r.name+' segue forte em '+AXIS[r.focus].toLowerCase()+'.'];
   publish(s,{id:k+':rival',origin:'media',mediaType:'rival',authorId:'rival-'+r.id,author:r.name,handle:r.id,verified:true,context:'Concorrente · '+p.name,headline:pick(lines,k+'l'),product:r.name+' '+p.name,image:{kind:cat,color:r.color},text:'Foco declarado: '+AXIS[r.focus].toLowerCase()+'. Quem compete em '+p.name.toLowerCase()+' sente a pressão.',reactions:20+Math.floor(hash(k+'lk')*180),comments:[]});}
  // estágio 2 (com escritório): os rivais reagem e tiram vendas por algumas semanas
  if(s.office&&s.productId&&RIVALS[s.productId]&&w-(P.rivals.lastAct||-9)>=2&&hash(k+'act')<.4){const r=pick(RIVALS[s.productId],k+'ra'),p=G.products.find(x=>x.id===s.productId),move=pick([['preco','baixou o preço do '+p.name.toLowerCase(),.9,2,'💸'],['campanha','está em campanha pesada de '+p.name.toLowerCase(),.9,2,'📢'],['copiou','lançou um '+p.name.toLowerCase()+' parecido com o seu',.85,3,'🪞']],k+'mv');
   P.rivals.lastAct=w;addFx(s,{id:'rival-'+s.productId,kind:'debuff',icon:move[4],name:r.name+' '+(move[0]==='preco'?'baixou o preço':move[0]==='campanha'?'em campanha':'copiou você'),eff:'Conversão '+Math.round((move[2]-1)*100)+'% em '+p.name.toLowerCase(),src:'Concorrente '+r.name,mult:move[2],weeks:move[3],scope:s.productId,rival:r.id});
   publish(s,{id:k+':rivalmove',origin:'media',mediaType:'rival',authorId:'rival-'+r.id,author:r.name,handle:r.id,verified:true,context:'Concorrente · '+p.name,headline:r.name+' '+move[1],product:r.name+' '+p.name,image:{kind:s.productId,color:r.color},text:'O mercado de '+p.name.toLowerCase()+' ficou mais disputado nesta semana.',reactions:40+Math.floor(hash(k+'lk2')*240),comments:['Vou esperar pra comparar com a '+(s.company||'concorrência')+'.']});}
  // pedidos dos fãs: com uma base de posts positivos, alguém pede uma categoria ou uma nova versão
  if(P.fans.pos>=5&&hash(k+'ask')<.35&&!P.fans.asks.some(a=>!a.done&&w-a.week<=6)){const locked=G.products.filter(p=>!P.cats.includes(p.id)),cat=locked.length&&hash(k+'kind')<.5?pick(locked,k+'ac'):null,who=pick(['Lu Ferraz','Caio M.','Dani Rocha','Bruna T.','Jorge Lima','Paty S.'],k+'who');
   const ask=cat?{id:k+':ask',kind:'cat',cat,week:w,done:false}:s.productId?{id:k+':ask',kind:'version',lineage:s.lineage||s.id,gen:s.generation||1,name:s.name,week:w,done:false}:null;
   if(ask){P.fans.asks.push(ask);P.fans.asks=P.fans.asks.slice(-8);publish(s,{id:ask.id,origin:'consumer',fan:true,authorId:'fan-'+who,author:who,context:'Fã da marca',sentiment:'positive',text:cat?'@'+String(s.company||'').toLowerCase().replace(/[^a-z0-9]/g,'')+' faz um '+G.products.find(p=>p.id===cat).name.toLowerCase()+'! Eu compraria no primeiro dia.':'Quero uma nova versão do '+s.name+'. Já uso todo dia e dá pra ficar ainda melhor.',reactions:60+Math.floor(hash(k+'al')*300),comments:['+1','Eu também!','Assino embaixo.']});}}
  // quem reclamou e ficou sem resposta vira cancelamento na próxima campanha
  const ignored=(s.social?.posts||[]).filter(p=>p.origin==='consumer'&&p.sentiment==='negative'&&!P.fans.replied[p.id]&&p.week===w&&!p.fan).length;if(ignored)P.fans.bonus.d=Math.min(2,P.fans.bonus.d+1);
 }
 // ---------- Nexus: responder posts ----------
 const TONES={thanks:'🙏 Agradecer',explain:'🛠 Explicar',joke:'😄 Brincar'};
 function reply(s,id,tone){const P=ensure(s),post=(s.social?.posts||[]).find(p=>p.id===id);if(!post||post.origin!=='consumer')throw Error('Post indisponível.');if(P.fans.replied[id])throw Error('Você já respondeu.');if(!TONES[tone])throw Error('Tom inválido.');
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
 function ranking(s,cat=s.productId){const r=RIVALS[cat];if(!r)return[];const w=Math.max(1,week(s)),own=(s.history||[]).filter(h=>h.productId===cat&&h.cycle!==s.cycle).reduce((n,h)=>n+(h.sold||0),0)+(s.productId===cat?s.sold||0:0)+(s.portfolio||[]).filter(p=>p.productId===cat).reduce((n,p)=>n+(p.sold||0),0);
  const rows=[...r.map(x=>({name:x.name,units:Math.round(x.pace*(8+w)),rival:true})),{name:s.company||'Você',units:own,you:true}],total=rows.reduce((n,x)=>n+x.units,0)||1;return rows.map(x=>({...x,share:Math.round(x.units/total*100)})).sort((a,b)=>b.units-a.units);}
 // ---------- livro: deduzir qual atributo está por trás de cada fala ----------
 // falas: 0 = a frase principal (exigência), 1 e 2 = o que ela valoriza, 3 = o que não importa
 function truth(p){const o=Object.entries(p.weights).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);return[p.minimum?.axis||o[0],o[1],o[2],Object.entries(p.weights).find(([,v])=>v===0)?.[0]||o[5]];}
 const LINE_KIND=['Exigência','Valoriza','Valoriza','Não importa'],LINE_SYM=['!','++','+','·'];
 function deduceSlot(s){const w=s.learningWindow;if(!w||!w.closed)return{ok:false,why:'Lance e encerre as vendas de um produto para juntar pistas.'};const P=ensure(s);if(P.tried[w.id])return{ok:false,why:'Você já usou a dedução deste lançamento. Lance de novo para tentar outra fala.'};if((w.sales?.[w.personaId]||0)<10)return{ok:false,why:'Precisamos de pelo menos dez compras da persona deste lançamento.'};return{ok:true,window:w};}
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
  else throw Error('Ação indisponível.');}
 function onHire(s,person){if(person?.area==='product')grantPiece(s,(person.name||'Quem chegou')+' trouxe uma peça do antigo emprego.',s.id+':hire:'+person.id);else if(person?.area==='marketing')grantCard(s,(person.name||'Quem chegou')+' trouxe uma carta que usava no antigo emprego.',s.id+':hire:'+person.id);}
 return{ALL_PIECES,STARTER_PIECES,ALL_CARDS,STARTER_CARDS,CARD_NAMES,RIVALS,ACH,TONES,RESEARCH_COST,CREDIT_AT,LINE_KIND,LINE_SYM,AXIS,ensure,research,finishLab,onLaunch,onWeek,addFx,effects,factor,fit,achieve,checkAch,reply,countPost,consumerComments,boardBonus,useBoard,ranking,truth,deduceSlot,deduce,bookStats,townAct,onHire,lockedPieces,lockedCards,lockedCats,week};
})();
if(typeof module!=='undefined')module.exports=Progress;
