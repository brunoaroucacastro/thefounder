// Cenário que abre direto no tabuleiro de campanha (modelo de marketing aprovado), a partir do cenário NV8.
// Uso: node scripts/build-scenario-campanha.cjs (rode antes scripts/build-scenario-nv8.cjs)
const fs=require('fs');
const {C,act,until}=require('../tests/modern-support.cjs');
const version=(fs.readFileSync('scripts/build-first-loop.cjs','utf8').match(/Primeira-Aposta-(\d+\.\d+)\.html/)||[])[1];
const nv8=fs.readFileSync('dist/The-Founder-Cenario-NV8-Escritorio-'+version+'.html','utf8');
const m=nv8.match(/localStorage\.setItem\("the-founder-cenario-nv8",(".*?")\);\}catch/);if(!m)throw Error('estado do NV8 não encontrado');
let s=C.load(JSON.parse(m[1]));
s=act(s,'stopSales');if(s.phase==='recap')s=act(s,'newCampaign');
const steps=[];for(let i=0;i<20&&s.phase!=='recampaignReady';i++){steps.push(s.phase);
 if(s.phase==='recampaignPlan'){if(!s.campaignDraft?.priced){s=act(s,'campaignPrice');s=act(s,'confirmPrice');}s=act(s,'recampaignStart');continue;}
 if(s.weekly?.stage==='report'){s=act(s,'readWeek');continue;}if(s.weekly?.stage==='weekend'){s=act(s,'weekend',{choice:'work'});continue;}
 s=until(s,'recampaignReady');}
if(s.phase!=='recampaignReady')throw Error('não chegou ao tabuleiro: '+s.phase+' · '+steps.join(' > '));
s.paused=false;const state=JSON.stringify(s);
let html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-'+version+'.html','utf8');
// a campanha vai embutida na memória da página: não depende do armazenamento do navegador e recomeça a cada abertura
if(!html.includes('memory=new Map()'))throw Error('memória do save não encontrada');
const literal=JSON.stringify(state).replace(/<\//g,'<\\/');
html=html.replace('memory=new Map()',()=>'memory=new Map([["the-founder-contract-v1",'+literal+']])');
const out='dist/The-Founder-Cenario-Campanha-'+version+'.html';fs.writeFileSync(out,html);console.log('PASS:',out,'· fase',s.phase,'· caminho',steps.join(' > '));
