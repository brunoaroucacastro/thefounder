const fs=require('fs');
const root='src/';
let html=fs.readFileSync(root+'index.html','utf8');
for(const name of ['style.css','scene.css','agenda.css','campaign.css','dice.css','product.css','finance.css']){let css=fs.readFileSync(root+name,'utf8').replace(/@import\s+url\([^;]+;/g,'');html=html.replace('<link rel="stylesheet" href="'+name+'">',()=>'<style>\n'+css+'\n</style>');}
for(const name of ['campaign-rules.js','product-rules.js','finance-rules.js','rules.js','game.js','scene.js','create.js','planner.js','product-ui.js','finance-ui.js','dice.js']){let js=fs.readFileSync(root+name,'utf8');html=html.replace('<script src="'+name+'"></script>',()=>'<script>\n'+js+'\n</script>');}
html=html.replaceAll('PROTÓTIPO 0.1','PROTÓTIPO 0.8');
if(/<script[^>]+src=|<link[^>]+stylesheet/.test(html))throw Error('External assets remain');
const vm=require('vm');for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
fs.writeFileSync('dist/The-Founder-Jogar.html',html,'utf8');
console.log('PASS: HTML independente, sete estilos e onze scripts incorporados; sintaxe validada. '+Buffer.byteLength(html)+' bytes.');
