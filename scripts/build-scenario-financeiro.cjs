// Simulador que abre direto na negociação de crédito do Caixa: escritório alugado, semanas de faturamento e nenhum empréstimo ativo.
// Uso: node scripts/build-scenario-financeiro.cjs (rode antes scripts/build-scenario-nv8.cjs)
const fs=require('fs');
const {C}=require('../tests/modern-support.cjs');
const version=(fs.readFileSync('scripts/build-first-loop.cjs','utf8').match(/Primeira-Aposta-(\d+\.\d+)\.html/)||[])[1];
const nv8=fs.readFileSync('dist/The-Founder-Cenario-NV8-Escritorio-'+version+'.html','utf8');
const m=nv8.match(/localStorage\.setItem\("the-founder-cenario-nv8",(".*?")\);\}catch/);if(!m)throw Error('estado do NV8 não encontrado');
let s=C.load(JSON.parse(m[1]));
s.loan=null;s.bank={trust:0};s.bankNeg=null;s.paused=true;
const state=JSON.stringify(s);
let html=fs.readFileSync('dist/The-Founder-Primeira-Aposta-'+version+'.html','utf8');
if(!html.includes('memory=new Map()'))throw Error('memória do save não encontrada');
const literal=JSON.stringify(state).replace(/<\//g,'<\\/');
html=html.replace('memory=new Map()',()=>'memory=new Map([["the-founder-contract-v1",'+literal+']])');
// abre o Caixa e a negociação assim que o jogo carrega
html=html.replace('</body>',()=>'<script>addEventListener("load",()=>setTimeout(()=>{document.getElementById("ledger")?.click();setTimeout(()=>document.querySelector(\'#workshop-info [data-action=bankOpen]\')?.click(),300);},1200));</script></body>');
const out='dist/The-Founder-Cenario-Financeiro-'+version+'.html';fs.writeFileSync(out,html);
console.log('PASS:',out,'· base do crédito',C.creditBase(s),'· semana',C.creditWeek(s)+1);
