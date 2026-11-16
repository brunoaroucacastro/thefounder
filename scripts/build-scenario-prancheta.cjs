// Simulador que abre direto na prancheta de produto (fone, persona escolhida, nível 4).
// Uso: node scripts/build-scenario-prancheta.cjs
const fs=require('fs');
const {C,flags,act,until}=require('../tests/modern-support.cjs');
const version=(fs.readFileSync('scripts/build-first-loop.cjs','utf8').match(/Primeira-Aposta-(\d+\.\d+)\.html/)||[])[1];
let s=act(C.fresh(21,{...flags,traction:true,personaSet:'v2',boardCampaign:true}),'start');
s=C.enableWeekly(s);
s=act(s,'product',{id:'headphones'});s=until(s,'customer');s=act(s,'customer',{id:s.personaCandidates[0]});
if(s.phase!=='design')throw Error('não chegou à prancheta: '+s.phase);
s.paused=true;const state=JSON.stringify(s);
let html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-'+version+'.html','utf8');
// o estado vai embutido na memória da página: recomeça a cada abertura, sem usar o armazenamento do navegador
if(!html.includes('memory=new Map()'))throw Error('memória do save não encontrada');
const literal=JSON.stringify(state).replace(/<\//g,'<\\/');
html=html.replace('memory=new Map()',()=>'memory=new Map([["the-founder-contract-v1",'+literal+']])');
const out='dist/The-Founder-Cenario-Prancheta-'+version+'.html';fs.writeFileSync(out,html);console.log('PASS:',out,'· fase',s.phase,'· nível',s.level,'· peças oferecidas',(s.designOffer||[]).length);
