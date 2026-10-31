const fs=require('fs'),assert=require('node:assert/strict'),boot=require('./ui.cjs');
const html=fs.readFileSync('dist/The-Founder-Jogar.html','utf8'),a=boot(new Map(),html),run=c=>a.run(c);
assert(html.includes('PROTÓTIPO 0.15 · PIXEL OFFICE'));assert(!html.includes('PROTÓTIPO 0.154'));assert(!html.includes('PROTÓTIPO 0.155'));assert.equal(run('GameRules.founders.profiles.length'),11);assert.equal(run('draft.profile'),10);assert(!/<script[^>]+src=|<link[^>]+stylesheet/.test(html));
function cards(){const page=a.el('creation').innerHTML;return [...page.matchAll(/<div class="pick-grid models">([\s\S]*?)<\/div>/g)].flatMap(([,group])=>[...group.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map(([,text])=>text.replace(/<strong>[\s\S]*?<\/strong>/g,'').trim()));}
run('step=1;draft.model=0;creator()');assert.equal(run('draft.model'),12);assert(a.el('creation').innerHTML.includes('VERSÃO 0.15 · 12 MERCADOS B2C'));
assert.deepEqual(cards(),['Gadgets & tecnologia','Moda & vestuário','Consumíveis','Beleza & cosméticos','Pet','Home & Garden']);
run('draft.model=18;creator()');assert.deepEqual(cards(),['Fintechs','Healthtechs','Educação','Redes sociais & conteúdo','Softwares & aplicativos','Mobilidade & delivery']);
for(const name of ['DNVB','Wearables','Mobilidade elétrica','App de IA','Marketplace'])assert(!cards().includes(name));
run('draft.model=20;creator()');assert(a.el('creation').innerHTML.includes('50%'));run('draft.capital=1;foundCompany()');assert.equal(run('s.marketId'),'education');assert.equal(run('s.cash'),50000);assert.equal(run('s.friendsInstallment'),2500);
assert.equal(run("GameRules.founders.modifiers(s,'product_development').length"),0);run("s.founder.profileId='builder'");assert.equal(run("GameRules.rollD20(s,{category:'product_development'},()=>.5).total"),12);
console.log('✓ Entrega HTML: pacote independente executado em DOM simulado; versão exata, guarda contra setor legado, seis cartões físicos e seis serviços, percentuais e fundação corretos.');
