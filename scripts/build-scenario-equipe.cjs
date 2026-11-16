// Simulador que abre direto na tela da Equipe: escritório alugado, mesas vagas e 2 candidatos esperando.
// Uso: node scripts/build-scenario-equipe.cjs (rode antes scripts/build-scenario-nv8.cjs)
const fs=require('fs');
const {C,act}=require('../tests/modern-support.cjs');
const version=(fs.readFileSync('scripts/build-first-loop.cjs','utf8').match(/Primeira-Aposta-(\d+\.\d+)\.html/)||[])[1];
const nv8=fs.readFileSync('dist/The-Founder-Cenario-NV8-Escritorio-'+version+'.html','utf8');
const m=nv8.match(/localStorage\.setItem\("the-founder-cenario-nv8",(".*?")\);\}catch/);if(!m)throw Error('estado do NV8 não encontrado');
let s=C.load(JSON.parse(m[1]));
s=act(s,'hrSearch',{id:'product'});
for(let i=0;i<60000&&!s.team.candidates;i++){if(s.weekly?.stage==='report'){s=act(s,'readWeek');continue;}if(s.weekly?.stage==='weekend'){s=act(s,'weekend',{choice:'work'});continue;}if(s.phase==='opportunity'){s=act(s,'offer',{choice:'decline'});continue;}s=C.tick(s,.2);}
if(!s.team.candidates)throw Error('candidatos não chegaram');
s.paused=true;const state=JSON.stringify(s);
let html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-'+version+'.html','utf8');
if(!html.includes('memory=new Map()'))throw Error('memória do save não encontrada');
const literal=JSON.stringify(state).replace(/<\//g,'<\\/');
html=html.replace('memory=new Map()',()=>'memory=new Map([["the-founder-contract-v1",'+literal+']])');
// abre a Equipe e seleciona a primeira mesa vaga assim que o jogo carrega
html=html.replace('</body>',()=>'<script>addEventListener("load",()=>setTimeout(()=>{document.getElementById("team-nav")?.click();setTimeout(()=>document.querySelector(\'#workshop-info [data-action=teamDesk][data-id="1"]\')?.click(),200);},600));</script></body>');
const out='dist/The-Founder-Cenario-Equipe-'+version+'.html';fs.writeFileSync(out,html);
console.log('PASS:',out,'· candidatos',s.team.candidates.map(c=>c.name+' ('+C.seniority(c.level)+' '+c.level+', '+C.SKILLS[c.profile]?.name+', '+c.trait+')').join(' e '));
