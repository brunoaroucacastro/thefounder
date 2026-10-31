/* People simulation: shared D20, one monthly retention check, no DOM. */
const PeopleRules=(()=>{
 const clamp=n=>Math.max(0,Math.min(100,n));
 const roles=['Produto','Marketing','Suporte','Financeiro'];
 const specialties={Produto:{development:'Desenvolvimento',research:'Pesquisa'},Marketing:{ads:'Busca paga',seo:'SEO',social:'Redes sociais'},Suporte:{retention:'Atendimento'},Financeiro:{suppliers:'Fornecedores',credit:'Crédito',benchmarks:'Benchmarks'}};
 const bases=[4500,3500,2800,3800],colors=['#be8066','#809ec1','#beac5e','#b49b72'];
 const kinds=['people_recruit','people_hire','people_train','people_fire','people_meeting','people_cancel'];
 const titles=['','Júnior','Pleno','Pleno','Sênior','Especialista'];
 function sync(s){s.motivation=s.team.length?Math.round(s.team.reduce((n,p)=>n+p.motivation,0)/s.team.length):82;}
 function ensure(s){s.people??={searches:[],lastMeeting:-1};s.team.forEach(p=>{p.level=Math.max(1,Math.min(5,Math.floor(p.level||1)));p.motivation=clamp(Number.isFinite(p.motivation)?p.motivation:s.motivation??82);p.specialty??=Object.keys(specialties[p.role]||{})[0];});sync(s);return s;}
 function bump(s,value){s.team.forEach(p=>p.motivation=clamp(p.motivation+value));sync(s);}
 function cost(s,a,meta){if(a.type==='people_recruit')return meta.skills.includes('people')?600:1200;if(a.type==='people_train')return (s.team.find(p=>p.id===a.personId)?.level||1)*1000;if(a.type==='people_fire')return s.team.find(p=>p.id===a.personId)?.salary||0;return 0;}
 function candidate(s,id){return s.people.searches.flatMap(v=>v.candidates||[]).find(p=>p.id===id&&!p.hired);}
 function validate(s,a,touched){ensure(s);const p=s.team.find(p=>p.id===a.personId);
  if(a.type==='people_recruit'){if(!roles.includes(a.role)||!specialties[a.role][a.specialty])throw Error('Escolha área e especialidade.');if(s.people.searches.filter(v=>v.status!=='closed').length>=4)throw Error('Limite de quatro seleções abertas.');}
  if(a.type==='people_hire'){if(s.team.length>=12||!candidate(s,a.candidateId))throw Error('Candidato indisponível ou equipe cheia.');}
  if(a.type==='people_cancel'&&!s.people.searches.some(v=>v.id===a.searchId&&v.status!=='closed'))throw Error('Seleção já encerrada.');
  if(['people_train','people_fire'].includes(a.type)&&!p)throw Error('Pessoa não está mais na equipe.');
  if(a.type==='people_train'){if(p.level>=5)throw Error('Nível máximo: 5.');if(touched?.has('train-'+p.id))throw Error('Um treino por pessoa a cada mês.');}
  if(a.type==='people_meeting'&&(s.people.lastMeeting===s.month||touched?.has('people-meeting')))throw Error('Uma reunião por mês.');
 }
 function apply(s,a,{preview=false,roll,touched}={}){const p=s.team.find(p=>p.id===a.personId);let note,die;
  if(a.type==='people_recruit'){s.people.searches.push({id:'search-'+a.id,role:a.role,specialty:a.specialty,readyAt:s.month+1,status:'pending',candidates:[]});note='Seleção aberta. Três candidatos chegam no próximo mês.';}
  if(a.type==='people_cancel'){s.people.searches.find(v=>v.id===a.searchId).status='closed';note='Seleção encerrada sem contratar.';}
  if(a.type==='people_hire'){const c=candidate(s,a.candidateId);c.hired=true;const search=s.people.searches.find(v=>v.candidates.some(x=>x.id===c.id));search.status='closed';search.candidates.forEach(x=>x.hired=true);bump(s,5);s.team.push({...c,id:'person-'+c.id,motivation:82,joinedMonth:s.month+1});note=c.name+' contratado. Salário já entra neste fechamento.';}
  if(a.type==='people_fire'){s.team=s.team.filter(x=>x.id!==p.id);bump(s,-5);note=p.name+' desligado. Equipe: −5 de motivação.';}
  if(a.type==='people_train'){touched?.add('train-'+p.id);const difficulty=9+p.level*2;if(preview){p.level++;p.salary=Math.round(p.salary*1.2);return {status:'planned',note:'Prévia supõe promoção; salário +20% apenas se passar.'};}die=roll(s,{label:'Treinamento · '+p.name,difficulty});if(die.outcome==='success'){p.level++;p.salary=Math.round(p.salary*1.2);p.motivation=clamp(p.motivation+10);note=p.name+' promovido ao nível '+p.level+' · salário +20% já neste mês · motivação +10.';}else{p.motivation=clamp(p.motivation-5);note='Treino sem evolução. Salário mantido · motivação −5.';}}
  if(a.type==='people_meeting'){touched?.add('people-meeting');s.people.lastMeeting=s.month;if(preview)return {status:'planned',note:'D20: 1–5 −5 · 6–10 zero · 11–15 +5 · 16–20 +10.'};die=roll(s,{label:'Reunião geral',difficulty:11});const delta=die.natural<=5?-5:die.natural<=10?0:die.natural<=15?5:10;bump(s,delta);note='Reunião: '+(delta>=0?'+':'')+delta+' de motivação para todos.';die.peopleDisplay={tone:delta<0?'failure':delta>0?'success':'neutral',title:delta<0?'CLIMA PIOROU':delta>0?'EQUIPE ANIMADA':'SEM MUDANÇA',effect:note,target:'CLIMA',targetValue:'D20',rule:'1–5 −5 · 6–10 zero · 11–15 +5 · 16–20 +10',label:'Reunião geral'};}
  sync(s);return {status:preview?'planned':die?.outcome||'executed',...(die?{die}:{}),personRole:p?.role,note};
 }
 function area(type){if(type.startsWith('product_')||['develop','launch','research','price','target'].includes(type))return 'Produto';if(['campaign','budget'].includes(type))return 'Marketing';if(type.startsWith('finance_')||['loan','repay'].includes(type))return 'Financeiro';return null;}
 function threshold(m){return m<10?17:m<35?13:m<=75?7:2;}
 function settle(s,{entries,profit,revenue,roll}){ensure(s);const events=[],rolls=[],changes=[],previous=s.history.at(-1)?.revenue,financial=profit<0||(previous>0&&revenue<previous*.8)?-5:previous>0&&revenue>previous*1.2?5:0,active=new Set(entries.filter(e=>!['skipped','invalid'].includes(e.status)).map(e=>area(e.type)).filter(Boolean));
  // Support actually works whenever there are customers; count once, not per client.
  if(s.customers>0)active.add('Suporte');
  entries.filter(e=>e.type==='people_train'&&e.status!=='skipped').forEach(e=>{if(e.personRole)active.add(e.personRole);});
  s.team.forEach(p=>{const before=p.motivation;p.motivation=clamp(p.motivation+financial+(active.has(p.role)?5:-5));changes.push({id:p.id,name:p.name,before,after:p.motivation,financial,activity:active.has(p.role)?5:-5});});sync(s);
  if(s.team.length){const p=[...s.team].sort((a,b)=>a.motivation-b.motivation||a.id.localeCompare(b.id))[0],min=threshold(p.motivation),die=roll(s,{label:'Retenção · '+p.name,difficulty:min}),leaves=die.natural<min;rolls.push(die);die.peopleDisplay={tone:leaves?'failure':'success',title:leaves?'PEDIDO DE DEMISSÃO':'PERMANECE NA EQUIPE',effect:leaves?p.name+' saiu após o fechamento. Bônus e salário deixam de valer no próximo mês.':p.name+' permanece na equipe.',target:'PERMANÊNCIA',targetValue:min+'+',rule:'Motivação '+p.motivation+'/100 · 1–'+(min-1)+' saída · '+min+'–20 permanece. Uma verificação por empresa/mês.',label:die.label};if(leaves){s.team=s.team.filter(x=>x.id!==p.id);events.push(p.name+' pediu demissão'+(p.motivation>75?' após proposta da concorrência.':'.'));}}
  s.people.searches.filter(v=>v.status==='pending'&&v.readyAt<=s.month).forEach(v=>{const i=roles.indexOf(v.role),names=['Alex','Bia','Davi','Eva','Noa','Ravi','Yas','Luca','Mila','Tom'];v.status='ready';v.candidates=[1,3,4].map((level,j)=>({id:v.id+'-'+j,name:names[(s.month+i*2+j)%names.length],role:v.role,specialty:v.specialty,level,salary:Math.round(bases[i]*(level===1?1:level===3?1.6:2.2)),color:colors[i],motivation:82}));events.push('Seleção de '+v.role+': três candidatos disponíveis.');});sync(s);return {events,rolls,changes};
 }
 return {roles,specialties,titles,kinds,ensure,sync,bump,cost,validate,apply,settle,threshold,candidate};
})();
if(typeof module!=='undefined')module.exports=PeopleRules;
