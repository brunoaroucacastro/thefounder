const fs=require('fs'),path=require('path'),vm=require('vm');
const root='src/first-loop/';let html=fs.readFileSync(root+'index.html','utf8');
html=html.replace('<link rel="stylesheet" href="pixel-font.css">',()=>'<style>\n'+fs.readFileSync(root+'pixel-font.css','utf8')+'\n</style>');
html=html.replace('<link rel="stylesheet" href="theme.css">',()=>'<style>\n'+fs.readFileSync(root+'theme.css','utf8')+'\n</style>');
html=html.replace('<link rel="stylesheet" href="play.css">',()=>'<style>\n'+fs.readFileSync(root+'play.css','utf8')+'\n</style>');
for(const name of ['../founder-rules.js','universal-products.js','gadgets.js','product-book.js','market-reach.js','consumer-model.js','audience.js','learning.js','core.js','world.js','sound.js','town.js','play.js']){const content=fs.readFileSync(path.join(root,name),'utf8');new vm.Script(content,{filename:name});html=html.replace('<script src="'+name+'"></script>',()=>'<script>\n'+content+'\n</script>');}
html=html.replace(/src="(assets\/[\w-]+\.svg)"/g,(_,file)=>'src="data:image/svg+xml;base64,'+fs.readFileSync(root+file).toString('base64')+'"');
if(/<script[^>]+src=|<link[^>]+stylesheet/.test(html))throw Error('O pacote ainda depende de arquivos externos.');
fs.mkdirSync('dist/audio',{recursive:true});for(const f of fs.readdirSync(root+'audio'))fs.copyFileSync(root+'audio/'+f,'dist/audio/'+f);fs.writeFileSync('dist/The-Founder-Primeira-Aposta-0.84.html',html);
console.log('PASS: primeira aposta 0.84 independente; doze scripts, estilos, tema e fonte incorporados; '+Buffer.byteLength(html)+' bytes.');
