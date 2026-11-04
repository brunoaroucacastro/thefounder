const fs=require('fs'),path=require('path'),vm=require('vm');
const root='src/first-loop/';let html=fs.readFileSync(root+'index.html','utf8');
html=html.replace('<link rel="stylesheet" href="pixel-font.css">',()=>'<style>\n'+fs.readFileSync(root+'pixel-font.css','utf8')+'\n</style>');
html=html.replace('<link rel="stylesheet" href="play.css">',()=>'<style>\n'+fs.readFileSync(root+'play.css','utf8')+'\n</style>');
for(const name of ['../founder-rules.js','universal-products.js','gadgets.js','product-book.js','market-reach.js','consumer-model.js','audience.js','learning.js','core.js','world.js','play.js']){const content=fs.readFileSync(path.join(root,name),'utf8');new vm.Script(content,{filename:name});html=html.replace('<script src="'+name+'"></script>',()=>'<script>\n'+content+'\n</script>');}
if(/<script[^>]+src=|<link[^>]+stylesheet/.test(html))throw Error('O pacote ainda depende de arquivos externos.');
fs.writeFileSync('dist/The-Founder-Primeira-Aposta-0.43.html',html);
console.log('PASS: primeira aposta 0.43 independente; onze scripts, estilo e fonte pixel incorporados; '+Buffer.byteLength(html)+' bytes.');
