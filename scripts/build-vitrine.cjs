// Gera a vitrine de cenários: páginas que abrem o jogo direto em cada lugar (empresa, bairro, minigames).
// Cada página usa um save próprio e recomeça do zero ao abrir, sem tocar nas partidas do jogador.
// Uso: node scripts/build-vitrine.cjs   (depois de build-first-loop e build-scenario-nv8)
const fs=require('fs'),path=require('path');
const {C,act}=require('../tests/modern-support.cjs');
const version=(fs.readFileSync('scripts/build-first-loop.cjs','utf8').match(/Primeira-Aposta-(\d+\.\d+)\.html/)||[])[1];
const scen=fs.readFileSync('dist/The-Founder-Cenario-NV8-Escritorio-'+version+'.html','utf8');
const m=scen.match(/localStorage\.setItem\("the-founder-cenario-nv8",(".*?")\);\}catch/);if(!m)throw Error('save do cenário não encontrado');
const base=JSON.parse(JSON.parse(m[1]));
const game=fs.readFileSync('dist/The-Founder-Primeira-Aposta-'+version+'.html','utf8');
if(!game.includes("KEY='the-founder-contract-v1'"))throw Error('chave do save não encontrada');

// Empresa: escritório com duas pessoas contratadas (produto e marketing)
function withTeam(s){let h=s;for(const area of ['product','marketing']){h=act(h,'hrSearch',{id:area});for(let i=0;i<20000&&!h.team.candidates;i++){if(h.weekly.stage==='report'){h=act(h,'readWeek');continue;}if(h.weekly.stage==='weekend'){h=act(h,'weekend',{choice:'work'});continue;}h=C.tick(h,.2);}
  h=act(h,'hrHire',{id:h.team.candidates[0].id});}
 if(h.weekly.stage!=='work')h.weekly.stage='work';h.paused=false;return h;}
const empresa=withTeam(JSON.parse(JSON.stringify(base)));
// Bairro: fim de semana, retomando um passeio já em andamento no lugar e hora pedidos
function weekend(scene,min,x,y,extra={}){const s=JSON.parse(JSON.stringify(base));s.weekly.stage='weekend';s.paused=true;
 s.life={outfit:'jacket',owned:['basic','jacket'],collection:['gato','pato'],friends:{duda:2,teo:2,ro:1,lia:1,ze:1},flags:{},spent:0,plant:{water:4,last:''},history:[],...extra,
  outing:{week:s.weekly.reports.length,day:'sat',min,scene,x,y,plan:null,log:[],dayLog:[]}};return s;}

// Teste do fim de semana: escritório com equipe e R$ 500 mil, já no panorama para escolher trabalhar ou viver
function rich(st,cash){const s=JSON.parse(JSON.stringify(st));const d=cash-s.cash;s.cash=cash;if(s.weekly)s.weekly.cashStart=Math.round((s.weekly.cashStart+d)*100)/100;return s;}
function atPanorama(st){const s=JSON.parse(JSON.stringify(st));s.weekly.stage='report';s.paused=true;if(s.life)s.life.outing=null;return s;}
const scenes=[
 {file:'teste-fim-de-semana',title:'Teste: fim de semana',icon:'🧪',desc:'Escritório com equipe e R$ 500 mil, no panorama da semana. Escolha trabalhar ou viver.',state:atPanorama(rich(empresa,500000)),auto:'',test:true},
 {file:'teste-escritorio',title:'Teste: escritório com R$ 500 mil',icon:'💼',desc:'Empresa no meio da semana, com equipe e R$ 500 mil em caixa.',state:rich(empresa,500000),auto:'',test:true},
 {file:'empresa',title:'A empresa',icon:'🏢',desc:'Escritório alugado com a equipe trabalhando e o produto vendendo.',state:empresa,auto:''},
 {file:'bairro-tarde',title:'O bairro à tarde',icon:'🌇',desc:'Praça com a quadra, pipoca, bar e galeria no fim de tarde.',state:weekend('street',16*60+30,14,17),auto:'town'},
 {file:'bairro-noite',title:'O bairro à noite',icon:'🌙',desc:'Postes acesos, varal de luzinhas e janelas iluminadas.',state:weekend('street',20*60+30,18,12),auto:'town'},
 {file:'casa',title:'A casa',icon:'🏠',desc:'Sala com o gato Biscoito, cozinha, planta e estante.',state:weekend('home',11*60,5,3),auto:'town'},
 {file:'bar',title:'O Bar da Praça',icon:'🍺',desc:'Balcão, jukebox, mesa de sinuca e o pessoal da noite.',state:weekend('bar',20*60,1,7),auto:'town'},
 {file:'galeria',title:'A Galeria do Bairro',icon:'🛍',desc:'Loja da Lia, gadgets do Zé com o seu produto e a garrinha.',state:weekend('gallery',15*60,1,7),auto:'town'},
 {file:'sinuca',title:'Minigame: sinuca',icon:'🎱',desc:'Contra o Téo, com guia de mira.',state:weekend('bar',20*60,5,7),auto:'mini:pool:Téo'},
 {file:'volei',title:'Minigame: vôlei',icon:'🏐',desc:'Contra a Duda na quadra da praça.',state:weekend('street',16*60,14,17),auto:'mini:volley:Duda'},
 {file:'garrinha',title:'Minigame: garrinha',icon:'🕹',desc:'A máquina de prêmios da galeria.',state:weekend('gallery',15*60,9,3),auto:'mini:claw'}];

function panel(KEY){return `<div id="tst" style="position:fixed;left:8px;bottom:8px;z-index:99999;display:grid;gap:4px;font:800 11px Consolas,monospace;background:#fffdf8;padding:6px;box-shadow:0 0 0 3px #2a2133,4px 4px 0 #0006">
<b style="letter-spacing:.08em">ATALHOS DE TESTE</b>
<button data-t="cash">+ R$ 100 mil</button><button data-t="cash5">Caixa = R$ 500 mil</button><button data-t="fds">Ir para o fim da semana</button><button data-t="reset">Recomeçar o cenário</button><button data-t="hide" style="opacity:.6">esconder</button></div>
<script>(function(){const K=${JSON.stringify(KEY)},p=document.getElementById('tst');
function edit(fn){try{const s=JSON.parse(localStorage.getItem(K));fn(s);localStorage.setItem(K,JSON.stringify(s));location.reload();}catch(e){alert('Não deu: '+e.message);}}
function cash(v,abs){return s=>{const d=abs?v-s.cash:v;s.cash=Math.round((s.cash+d)*100)/100;if(s.weekly)s.weekly.cashStart=Math.round((s.weekly.cashStart+d)*100)/100;};}
p.addEventListener('click',e=>{const t=e.target.dataset&&e.target.dataset.t;if(!t)return;
 if(t==='hide'){p.remove();return;}if(t==='reset'){location.hash='reset';location.reload();return;}
 if(t==='cash')edit(cash(100000));if(t==='cash5')edit(cash(500000,true));
 if(t==='fds')edit(s=>{if(!s.weekly)throw Error('este save não tem calendário semanal');s.weekly.stage='report';s.paused=true;if(s.life)s.life.outing=null;});});})();<\/script>`;}
// som: as páginas procuram audio/ ao lado delas
fs.mkdirSync('dist/vitrine/audio',{recursive:true});for(const a of fs.readdirSync('dist/audio'))fs.copyFileSync('dist/audio/'+a,'dist/vitrine/audio/'+a);
const out='dist/vitrine';fs.mkdirSync(out,{recursive:true});
for(const sc of scenes){const KEY='the-founder-vitrine-'+sc.file;
 let html=game.replace("KEY='the-founder-contract-v1'","KEY='"+KEY+"'").replace('START_FRESH=true','START_FRESH=false');
 html=html.replace('<script>','<script>try{if(!localStorage.getItem('+JSON.stringify(KEY)+')||location.hash==="#reset"){localStorage.setItem('+JSON.stringify(KEY)+','+JSON.stringify(JSON.stringify(sc.state))+');history.replaceState(null,"",location.pathname);}}catch(e){}</script><script>');
 html=html.replace('</body>',panel(KEY)+'</body>');
 const auto=sc.auto?`<script>addEventListener('load',()=>{const want=${JSON.stringify(sc.auto)};let tries=0;const t=setInterval(()=>{tries++;const b=document.querySelector('#weekly-modal [data-action=weekPick][data-choice=town]');
  if(b&&typeof Town!=='undefined'&&!Town.isOpen()){b.click();}
  if(typeof Town!=='undefined'&&Town.isOpen()){clearInterval(t);if(want.startsWith('mini:')){const [,kind,opp]=want.split(':');setTimeout(()=>Town.debug.mini(kind,opp),400);}}
  if(tries>40)clearInterval(t);},250);});</script>`:'';
 html=html.replace('</body>',auto+'</body>');html=html.replace(/<title>[^<]*<\/title>/,'<title>The Founder · '+sc.title+'</title>');
 fs.writeFileSync(path.join(out,sc.file+'.html'),html);}

const index=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Founder · Vitrine de cenários</title>
<style>:root{--ink:#241d33;--paper:#fff7ea;--card:#fffdf8;--line:#eadbc4;--accent:#7b5cd6}
body{margin:0;background:radial-gradient(#2d2350,#141526);min-height:100vh;font-family:"Nunito","Segoe UI",system-ui,sans-serif;color:var(--ink);padding:28px 16px}
main{max-width:980px;margin:0 auto}h1{color:#fff;margin:0 0 4px;font-size:28px}p.sub{color:#cfc6e8;margin:0 0 22px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
a.card{display:grid;gap:6px;text-decoration:none;color:var(--ink);background:var(--card);border-radius:18px;padding:16px;border:2px solid var(--line);box-shadow:0 6px 0 #0004;transition:.15s}
a.card:hover{transform:translateY(-3px);border-color:var(--accent)}a.card span{font-size:34px}a.card b{font-size:17px}a.card small{color:#5b5470;font-size:13px;line-height:1.35}
h2{color:#fff;font-size:15px;letter-spacing:.12em;margin:26px 0 10px;opacity:.8}</style></head><body><main>
<h1>The Founder · ${version}</h1><p class="sub">Cada cenário abre o jogo direto no lugar, com um save de demonstração separado. Fechar e abrir de novo recomeça a cena.</p>
<h2>TESTES</h2><div class="grid">${scenes.filter(s=>s.test).map(card).join('')}</div>
<h2>EMPRESA</h2><div class="grid">${scenes.filter(s=>s.file==='empresa').map(card).join('')}</div>
<h2>A CIDADE</h2><div class="grid">${scenes.filter(s=>!s.test&&!s.auto.startsWith('mini')&&s.file!=='empresa').map(card).join('')}</div>
<h2>MINIGAMES</h2><div class="grid">${scenes.filter(s=>s.auto.startsWith('mini')).map(card).join('')}</div></main></body></html>`;
function card(s){return '<a class="card" href="'+s.file+'.html#reset" target="_blank"><span>'+s.icon+'</span><b>'+s.title+'</b><small>'+s.desc+'</small></a>';}
fs.writeFileSync(path.join(out,'index.html'),index);
console.log('PASS: vitrine '+version+' · '+scenes.length+' cenários em '+out+' · equipe na empresa: '+empresa.team.staff.map(p=>p.name+' ('+p.area+')').join(', '));
