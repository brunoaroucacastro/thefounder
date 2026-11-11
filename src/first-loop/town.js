/* Bairro do fim de semana (0.84) — casa, rua, praça, bar e galeria em isométrico vetorial.
   Exploração com clique para andar, conversas, compras, celular da mãe e três minigames.
   Só altera a partida via api.act({type:'life', ...}); o resto é estado local da visita. */
const Town=(()=>{
 const TX=30,TY=15,TZ=34;
 const P=(x,y,z=0)=>[(x-y)*TX,(x+y)*TY-z*TZ];
 const inv=(sx,sy)=>{const a=sx/TX,b=sy/TY;return [(a+b)/2,(b-a)/2];};
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const mix=(a,b,t)=>'#'+rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
 const lit=(c,t)=>mix(c,'#fff4dc',t),dk=(c,t)=>mix(c,'#1d1530',t);
 const esc=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[ch]);
 const money=v=>'R$ '+Math.round(v).toLocaleString('pt-BR');
 const hhmm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(Math.floor(m%60)).padStart(2,'0');
 const FONT='"Nunito","Segoe UI",system-ui,sans-serif';
 const OUTFITS={basic:{name:'Camiseta lisa',shirt:'#5e6ad2',price:0},tee:{name:'Camiseta laranja',shirt:'#ef8a3c',price:60},hoodie:{name:'Moletom roxo',shirt:'#7b5cd6',price:120},jacket:{name:'Jaqueta jeans',shirt:'#3d6fa8',trim:'#a8c6ea',price:180}};
 const PRIZES=[{id:'chaveiro',name:'Chaveiro de dado',col:'#f2a93b',r:9,tol:20},{id:'gato',name:'Pelúcia de gato',col:'#4a4458',r:16,tol:26},{id:'pato',name:'Patinho de borracha',col:'#ffd84a',r:12,tol:22},{id:'fone',name:'Mini fone',col:'#7b5cd6',r:13,tol:16},{id:'robo',name:'Robozinho',col:'#9aa3b5',r:14,tol:18}];
 const START=10*60,LIMIT=23*60;

 /* ---------- primitivas ---------- */
 let c;
 function path(pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
 function poly(pts,fill,stroke,lw=1){path(pts);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineJoin='round';c.stroke();}}
 const fY=(y,x0,x1,z0,z1)=>[P(x0,y,z0),P(x1,y,z0),P(x1,y,z1),P(x0,y,z1)];
 const fX=(x,y0,y1,z0,z1)=>[P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)];
 const fZ=(z,x0,x1,y0,y1)=>[P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];
 function box(x,y,z,w,d,h,col,o={}){const st=o.stroke===false?null:dk(col,.45);
  poly(fY(y+d,x,x+w,z,z+h),o.left||lit(col,.04),st);poly(fX(x+w,y,y+d,z,z+h),o.right||dk(col,.22),st);poly(fZ(z+h,x,x+w,y,y+d),o.top||lit(col,.2),st);}
 function circle(x,y,r,fill,stroke,lw=1){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function ellipse(x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
 function rrect(x,y,w,h,r,fill,stroke){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
 function label(x,y,text,o={}){c.font=(o.weight||800)+' '+(o.size||11)+'px '+FONT;const w=c.measureText(text).width+16;c.save();c.globalAlpha=o.alpha??1;rrect(x-w/2,y-11,w,22,11,o.bg||'#fff',o.border||null);c.fillStyle=o.color||'#241d33';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y+.5);c.restore();c.textAlign='left';c.textBaseline='alphabetic';}
 function person(sx,sy,k,t,walking){
  ellipse(sx,sy,11,4.5,'#0000002e');const sw=walking?Math.sin(t*12)*3:0;
  c.fillStyle=k.pants||'#2d2a4a';c.fillRect(sx-6+sw*.3,sy-16,5,16);c.fillRect(sx+1-sw*.3,sy-16,5,16);
  rrect(sx-8,sy-34,16,20,6,k.shirt||'#5e6ad2');if(k.trim){c.fillStyle=k.trim;c.fillRect(sx-2,sy-34,4,18);}
  c.fillStyle=k.shirt||'#5e6ad2';c.save();c.translate(sx-8,sy-31);c.rotate(.25+sw*.04);c.fillRect(-3,0,4,14);c.restore();c.save();c.translate(sx+8,sy-31);c.rotate(-.25-sw*.04);c.fillRect(-1,0,4,14);c.restore();
  circle(sx,sy-42,7.5,k.skin||'#edbd97');c.beginPath();c.arc(sx,sy-44,8,Math.PI*1.05,Math.PI*1.95);c.lineTo(sx+7,sy-41);c.fillStyle=k.hair||'#3b2a2a';c.fill();
 }

 /* ---------- cenas ---------- */
 function newScene(id,w,h,name){const S={id,w,h,name,items:[],hots:[],npcs:[],block:new Set(),ground:()=> '#b98a5f',walls:null,warm:false};
  S.solid=(x,y,w2,d)=>{for(let i=x;i<x+w2;i++)for(let j=y;j<y+d;j++)S.block.add(i+','+j);};
  S.put=(x,y,w2,d,draw,solid=true)=>{if(solid)S.solid(x,y,w2,d);S.items.push({d:x+w2/2+y+d/2,draw});};
  S.box=(x,y,w2,d,h2,col,o={})=>S.put(x,y,w2,d,()=>box(x,y,o.z||0,w2,d,h2,col,o),o.solid!==false);
  S.building=(x,y,w2,d,h2,col,o={})=>{S.solid(x,y,w2,d);for(let i=x;i<x+w2;i++)for(let j=y;j<y+d;j++){const front=j===y+d-1,right=i===x+w2-1;
    S.items.push({d:i+j+1,draw:()=>{box(i,j,0,1,1,h2,col,{stroke:false,top:o.roof||dk(col,.35)});
     if(front){for(const z of [.55,1.5])if(z+.6<h2&&!(o.door&&o.door.face==='y'&&o.door.at===i&&z<1))poly(fY(j+1.001,i+.2,i+.8,z,z+.55),'#cfe6f2',dk(col,.4));}
     if(right){for(const z of [.55,1.5])if(z+.6<h2&&!(o.door&&o.door.face==='x'&&o.door.at===j&&z<1))poly(fX(i+1.001,j+.2,j+.8,z,z+.55),'#bcd7e6',dk(col,.4));}
     if(o.door&&o.door.face==='y'&&front&&o.door.at===i){poly(fY(j+1.002,i+.15,i+.85,0,1.25),o.door.col||'#6b4529',dk(col,.5));circle(...P(i+.75,j+1.003,.6),2,'#e2c26a');}
     if(o.door&&o.door.face==='x'&&right&&o.door.at===j){poly(fX(i+1.002,j+.15,j+.85,0,1.25),o.door.col||'#6b4529',dk(col,.5));}
    }});}
   if(o.sign){const [sx,sy]=P(x+w2/2,y+d,h2+.15);S.items.push({d:x+w2+y+d+.5,draw:()=>label(sx,sy,o.sign,{bg:o.signBg||'#fff7ea',size:12})});}};
  S.hot=(h)=>{S.hots.push(h);return h;};
  S.free=(x,y)=>x>=0&&y>=0&&x<S.w&&y<S.h&&!S.block.has(x+','+y);
  return S;}
 function interiorWalls(S,col,trim){S.walls=()=>{poly(fY(0,0,S.w,0,2.4),col,dk(col,.3));poly(fX(0,0,S.h,0,2.4),dk(col,.12),dk(col,.3));poly(fY(0,0,S.w,0,.12),trim);poly(fX(0,0,S.h,0,.12),dk(trim,.1));};}
 function tree(S,x,y,big){S.put(x,y,1,1,()=>{box(x+.4,y+.4,0,.2,.2,.9,'#7a5238');const [sx,sy]=P(x+.5,y+.5,1.3+(big?.3:0));const r=big?24:18;circle(sx-8,sy+6,r*.7,'#3f8f5a');circle(sx+8,sy+4,r*.7,'#4fa868');circle(sx,sy-6,r*.8,'#5fbf74');circle(sx-5,sy-10,r*.3,'#7fd38f');});}
 function bench(S,x,y){S.put(x,y,1,1,()=>{box(x+.1,y+.25,0,.8,.5,.35,'#b47d4c');box(x+.1,y+.2,.35,.8,.12,.35,'#9c6a45');});}

 function buildHome(g,L){const S=newScene('home',9,7,'Casa');S.ground=(x,y)=>(x+y)%2?'#c79a6a':'#bf9163';interiorWalls(S,'#e9dcc6','#8a6a4a');S.spawn={x:5,y:3};
  S.decor=()=>{poly(fX(.01,1.8,2.9,0,1.9),'#8a5d3e','#5a3b26');circle(...P(.02,2.7,.95),2.2,'#e2c26a');poly(fY(.01,6,7.1,0,1.9),'#6b4529','#4a2e1a');circle(...P(6.9,.02,.95),2.2,'#e2c26a');
   poly(fY(.01,2.2,4.6,1.2,2.0),'#2a2838','#111');poly(fY(.012,2.3,4.5,1.27,1.93),R&&R.tvOn?'#7fd0ff':'#233247');
   poly(fY(.01,6.9,8.4,1.0,1.9),'#cfe6f2','#8a6a4a');if(L.flags?.homeCozy){poly(fZ(.01,2,6,3,6),'#c8553d','#8c3a2a');poly(fZ(.012,2.3,5.7,3.3,5.7),'#e7a46d');}};
  S.box(2,0,3,1,.5,'#5a3b26');S.hot({id:'tv',x:2,y:0,w:3,d:1,h:2,label:'TV',stand:[3,1],use:()=>menu('TV',[{t:'Assistir um pouco (+1h)',fn:watchTV},{t:'Deixar pra lá'}])});
  S.box(2,3,3,1,.55,'#5e6ad2',{top:'#7b85e0'});S.box(2,3,3,.3,.95,'#4f5ac0',{solid:false});
  S.box(0,5,1,1,2.1,'#9c6a45');S.hot({id:'wardrobe',x:0,y:5,w:1,d:1,h:2.1,label:'Guarda-roupa',stand:[1,5],use:wardrobe});
  S.box(1,0,1,1,1.5,'#b47d4c');S.put(1,0,1,1,()=>{(L.collection||[]).slice(0,6).forEach((id,i)=>{const pz=PRIZES.find(p=>p.id===id);if(!pz)return;const [sx,sy]=P(1.2+(i%3)*.3,.5,1.5+Math.floor(i/3)*.01);circle(sx,sy-4-Math.floor(i/3)*10,5,pz.col,dk(pz.col,.4));});},false);
  S.hot({id:'shelf',x:1,y:0,w:1,d:1,h:1.5,label:'Coleção',stand:[1,1],use:()=>say('Coleção',(L.collection||[]).length?'Prêmios da garrinha: '+L.collection.map(id=>PRIZES.find(p=>p.id===id)?.name).join(', ')+'.':'A prateleira ainda está vazia. A garrinha da galeria está esperando você.')});
  if(L.flags?.homeCozy){S.box(7,5,1,1,.4,'#e9e6df');S.put(7,5,1,1,()=>{const [sx,sy]=P(7.5,5.5,.8);circle(sx-6,sy,9,'#3f8f5a');circle(sx+6,sy-2,9,'#4fa868');circle(sx,sy-10,10,'#5fbf74');},false);S.box(8,2,1,1,1.6,'#2d2a4a',{solid:true});}
  S.hot({id:'bedroom',x:0,y:2,w:.2,d:1,h:1.9,label:'Porta do quarto',stand:[0,2],use:bedroomDoor});
  S.hot({id:'front',x:6,y:0,w:1,d:.2,h:1.9,label:'Porta de entrada',stand:[6,0],use:()=>go('street',{x:3,y:4})});
  return S;}

 function buildStreet(g,L){const S=newScene('street',32,22,'Bairro');S.spawn={x:3,y:4};
  S.ground=(x,y)=>{if(y===5||y===6)return '#6b6f7e';if(y===4||y===7||y===19||(x===20&&y>7))return (x+y)%2?'#c9c3b6':'#d3cdc0';if(y===20)return '#6b6f7e';
   if(x>=12&&x<=16&&y>=11&&y<=15)return '#d9895c';if(x>=8&&x<=19&&y>=8&&y<=18)return (x*7+y*3)%5?'#cdbfa3':'#c4b596';return (x*3+y*5)%7?'#7fb069':'#77a862';};
  S.decor=()=>{for(let x=0;x<32;x+=2)poly(fZ(.01,x+.2,x+1.2,5.93,6.07),'#f2e3a6');poly(fZ(.012,12,17,13,13.08),'#fff');for(const [a,b,cc,d2] of [[12,17,11,11.05],[12,17,15.95,16],[12,12.05,11,16],[16.95,17,11,16]])poly(fZ(.012,a,b,cc,d2),'#fff8');};
  S.building(1,0,5,4,2.3,'#e9b7a0',{door:{face:'y',at:3},sign:'Sua casa',roof:'#a8604c'});
  S.building(7,0,4,4,2.0,'#b6d4c8',{roof:'#6a8f84'});S.building(12,0,4,4,2.6,'#f2d48f',{roof:'#b89040'});S.building(17,0,4,4,2.2,'#c9b6e4',{roof:'#8a74ac'});S.building(22,0,5,4,2.4,'#f0c4c4',{roof:'#b07a7a'});
  S.building(21,8,6,5,2.6,'#8c4a3c',{door:{face:'y',at:23,col:'#3a2418'},sign:'🍺 Bar da Praça',signBg:'#ffe1b0',roof:'#5a2c22'});
  S.building(21,15,2,3,1.8,'#f2a93b',{sign:'Padaria',roof:'#a8661c'});S.building(23,15,3,3,1.8,'#5aa7d0',{sign:'Banca',roof:'#3a6f8c'});
  S.building(27,13,5,6,2.8,'#d6d0e8',{door:{face:'y',at:29,col:'#7b5cd6'},sign:'🛍 Galeria do Bairro',signBg:'#e9e1fb',roof:'#8f86a8'});
  for(const [x,y,b] of [[8,8,1],[19,8,1],[8,18,1],[19,18,1],[10,10,0],[18,12,0],[9,14,0],[11,17,0],[17,17,0],[1,8,1],[4,12,1],[2,17,1],[29,8,0]])tree(S,x,y,b);
  for(const [x,y] of [[10,12],[10,15],[18,15],[13,9],[15,9]])bench(S,x,y);
  S.put(12,13,5,1,()=>{for(let i=0;i<=5;i++)box(12+i-.04,13,0,.08,.08,1.15,'#f6efe2',{stroke:false});poly([P(12,13,.7),P(17,13,.7),P(17,13,1.15),P(12,13,1.15)],'#ffffff55','#ffffffaa');},false);
  S.solid(12,13,1,1);S.solid(16,13,1,1);
  S.put(22,13,1,1,()=>{box(22.2,13.2,0,.6,.6,.7,'#e9e6df');box(21.9,12.9,.7,1.2,1.2,.05,'#c8553d');});S.put(25,13,1,1,()=>{box(25.2,13.2,0,.6,.6,.7,'#e9e6df');box(24.9,12.9,.7,1.2,1.2,.05,'#2f7f7a');});
  S.hot({id:'home',x:3,y:3,w:1,d:1,h:1.3,label:'Entrar em casa',stand:[3,4],use:()=>go('home',{x:6,y:1})});
  S.hot({id:'bar',x:23,y:12,w:1,d:1,h:1.3,label:'Bar da Praça',stand:[23,13],use:()=>go('bar',{x:1,y:6})});
  S.hot({id:'gallery',x:29,y:18,w:1,d:1,h:1.3,label:'Galeria do Bairro',stand:[29,19],use:()=>go('gallery',{x:1,y:6})});
  S.npcs.push(npc('duda','Duda',14,16.5,{shirt:'#2f9a6a',hair:'#5a3b26',skin:'#b9805a'}),npc('kid1','',13.5,12,{shirt:'#ffd84a',hair:'#2b2b2b',skin:'#d79a72',pants:'#3d6fa8'},{silent:true}),npc('kid2','',15.5,14.5,{shirt:'#e46d6d',hair:'#d9a441',skin:'#f1c9a5',pants:'#2d2a4a'},{silent:true}),
   npc('marina','Marina',6,7.5,{shirt:'#ff9fb2',hair:'#a33b2b',skin:'#edbd97'},{wander:true}),npc('antonio','Seu Antônio',11,19.5,{shirt:'#c9b6e4',hair:'#cfcfcf',skin:'#d79a72'},{wander:true}),npc('kaique','Kaique',17,4.5,{shirt:'#4fbf8a',hair:'#2b2b2b',skin:'#8a5a3a'},{wander:true}));
  return S;}

 function buildBar(g,L){const S=newScene('bar',10,8,'Bar da Praça');S.warm=true;S.ground=(x,y)=>(x+y)%2?'#6b3d2e':'#5f3628';interiorWalls(S,'#a0603c','#4a2a1c');S.spawn={x:1,y:6};
  S.decor=()=>{poly(fX(.01,5.6,6.7,0,1.9),'#3a2418','#1d120c');for(let i=0;i<7;i++){const x=1.2+i*.6;poly(fY(.01,x,x+.18,1.3,1.75),['#2f9a6a','#c8553d','#f2a93b','#5aa7d0'][i%4]);}box(1,0,6,.25,1.25,.06,'#5a3b26',{stroke:false});
   poly(fY(.01,7.4,9.2,1.2,2.0),'#2d2a4a');c.save();c.globalAlpha=.9;label(...P(8.3,.02,1.6),'SINUCA',{bg:'#ff6b6b',color:'#fff',size:10});c.restore();};
  S.box(1,2,6,1,1.1,'#7a4a30',{top:'#9c6a45'});S.solid(1,0,6,2);
  S.box(4,4,3,2,.8,'#2f7a4a',{top:'#3a9a5c',right:'#5a3b26',left:'#6b4529'});S.hot({id:'pool',x:4,y:4,w:3,d:2,h:.9,label:'Mesa de sinuca',stand:[5,6],use:poolTable});
  for(const [x,y] of [[1,4],[8,2],[1,6.2]]){if(y%1)continue;S.box(x,y,1,1,.75,'#9c6a45');}
  S.npcs.push(npc('ro','Rô',3.5,1.4,{shirt:'#f6efe2',hair:'#2b2b2b',skin:'#b9805a',pants:'#2d2a4a'}),npc('teo','Téo',8.5,5.5,{shirt:'#f2a93b',hair:'#3b2a2a',skin:'#d79a72'}));
  S.hot({id:'exit',x:0,y:6,w:.2,d:1,h:1.9,label:'Sair para a rua',stand:[0,6],use:()=>go('street',{x:23,y:13})});
  return S;}

 function buildGallery(g,L){const S=newScene('gallery',12,8,'Galeria do Bairro');S.ground=(x,y)=>(x+y)%2?'#e8e4ee':'#dcd6e6';interiorWalls(S,'#f4f1f8','#9a92b8');S.spawn={x:1,y:6};
  S.decor=()=>{poly(fX(.01,5.6,6.7,0,1.9),'#cfe6f2','#7b5cd6');label(...P(2.4,.02,2.1),'LOJA DA LIA',{bg:'#ff9fb2',size:10});label(...P(7.6,.02,2.1),'GADGETS DO ZÉ',{bg:'#9fd8ff',size:10});label(...P(.02,2.2,2.1),'CASA & CIA',{bg:'#b9f08f',size:10});};
  S.box(1,0,3,1,1.4,'#f6efe2');S.put(1,0,3,1,()=>{['#ef8a3c','#7b5cd6','#3d6fa8','#5e6ad2'].forEach((col,i)=>{const [sx,sy]=P(1.3+i*.6,.6,1.35);rrect(sx-6,sy-2,12,16,3,col);});},false);
  S.box(6,0,4,1,1.3,'#e9ecef');S.put(6,0,4,1,()=>{const items=['#2d2a4a','#7b5cd6','#f2a93b','#4fbf8a'];items.forEach((col,i)=>{const [sx,sy]=P(6.4+i*.85,.6,1.32);rrect(sx-7,sy-6,14,10,3,col);});if(R.productShelf){const [sx,sy]=P(8,.6,2.0);label(sx,sy,'★ '+R.productShelf,{bg:'#f2a93b',size:10});}},false);
  S.box(0,2,1,2,1.2,'#d8f0c4');S.box(10,3,1,1,1.9,'#ff6b9a',{top:'#ff9fb8'});S.put(10,3,1,1,()=>{poly(fX(11.002,3.15,3.85,.9,1.75),'#cfeefdcc','#fff');const [sx,sy]=P(11,3.5,1.85);label(sx,sy,'GARRINHA',{bg:'#ffe46b',size:9});},false);
  S.box(5,4,2,1,.5,'#b9a8f2',{top:'#d9ccff'});
  S.npcs.push(npc('lia','Lia',2.5,1.5,{shirt:'#ff9fb2',hair:'#2b2b2b',skin:'#8a5a3a'}),npc('ze','Seu Zé',8,1.5,{shirt:'#5aa7d0',hair:'#cfcfcf',skin:'#edbd97'}));
  S.hot({id:'claw',x:10,y:3,w:1,d:1,h:1.9,label:'Garrinha · R$ 5',stand:[9,3],use:clawStart});
  S.hot({id:'home',x:0,y:2,w:1,d:2,h:1.2,label:'Casa & Cia',stand:[1,3],use:homeShop});
  S.hot({id:'exit',x:0,y:6,w:.2,d:1,h:1.9,label:'Sair para a rua',stand:[0,6],use:()=>go('street',{x:29,y:19})});
  return S;}
 const BUILD={home:buildHome,street:buildStreet,bar:buildBar,gallery:buildGallery};

 /* ---------- pessoas ---------- */
 function npc(id,name,x,y,k,o={}){return {id,name,x,y,k,silent:!!o.silent,wander:!!o.wander,path:[],t:Math.random()*5,wait:1+Math.random()*3};}
 const LINES={
  duda:['Ei! Nunca te vi por aqui. Sou a Duda, jogo vôlei aqui quase todo fim de semana. Bora uma partida qualquer hora?','Voltou! Sabia que essa quadra foi pintada pelos moradores? Ficou torta, mas é nossa.','Você tem cara de quem trabalha demais. Aqui a regra é uma só: celular no banco durante o jogo.','Tô pensando em montar um torneio do bairro. Topa ajudar na organização? Brincadeira... ou não.'],
  teo:['E aí! Téo. Venho aqui pela sinuca, fico pela coxinha. Joga?','Dizem que a mesa é torta pro lado da janela. Eu digo que é desculpa de quem perde.','Faço entrega de bike. Vejo muita caixa de eletrônico passando por aí. Uma hora vejo a sua.','Já é freguês da casa. O Rô até guarda o taco bom pra você.'],
  ro:['Bem-vindo ao Bar da Praça! Aqui o suco é de verdade e a música é baixa. Senta aí.','Sábado à noite enche. Domingo é mais família.','Se precisar de um canto pra pensar, a mesa do fundo é a mais quieta.'],
  lia:['Oi! Loja da Lia: roupa boa e sem frescura. Dá uma olhada.','Essa jaqueta jeans é a que mais sai. Combina com quem anda muito.','Se trouxer amigo, faço desconto. Mentira, mas faço um café.'],
  ze:['Gadgets do Zé! Conserto, vendo e troco ideia.','Fone bom é aquele que a gente esquece que tá usando.','Se um dia fizer um produto bom, traz que eu boto na vitrine.'],
  street:['Bom dia!','Viu a partida na quadra? Tá pegada.','Dizem que a garrinha da galeria tá soltando pelúcia hoje.','A padaria fecha às oito, hein.','Esse bairro é pequeno, mas tem tudo.']};

 /* ---------- estado da visita ---------- */
 let root=null,cv=null,api=null,R=null,raf=0,last=0;
 const life=()=>api.get().life||{outfit:'basic',owned:['basic'],collection:[],friends:{},flags:{}};
 function save(extra={},spend=0){const L=life();const outing={week:R.week,day:R.day,min:Math.round(R.min),scene:R.scene.id,x:Math.round(R.p.x),y:Math.round(R.p.y)};try{api.act({type:'life',spend,patch:{outing,...extra}});return true;}catch(e){toast(e.message);return false;}}
 function spend(v,patch={}){if(api.get().cash<v){toast('Dinheiro insuficiente.');return false;}return save(patch,v);}
 function advance(m){R.min=Math.min(LIMIT,R.min+m);}
 function go(id,at){R.scene=BUILD[id](api.get(),life());const sp=at||R.scene.spawn;R.p={x:sp.x+.5,y:sp.y+.5,path:[]};R.fade=1;advance(2);save();hud();}
 function pal(){const o=OUTFITS[life().outfit]||OUTFITS.basic;return {shirt:o.shirt,trim:o.trim,hair:'#3b2a2a',skin:'#edbd97',pants:'#2d2a4a'};}

 /* ---------- caminho (A*) ---------- */
 function route(S,from,to){const key=(x,y)=>x+','+y,sx=Math.floor(from.x),sy=Math.floor(from.y),tx=to[0],ty=to[1];if(!S.free(tx,ty))return null;
  const open=[[sx,sy]],g={},f={},came={};g[key(sx,sy)]=0;const h=(x,y)=>Math.hypot(x-tx,y-ty);f[key(sx,sy)]=h(sx,sy);const seen=new Set();
  while(open.length){open.sort((a,b)=>f[key(...a)]-f[key(...b)]);const cur=open.shift(),ck=key(...cur);if(cur[0]===tx&&cur[1]===ty){const out=[];let k=ck;while(k){const [x,y]=k.split(',').map(Number);out.unshift({x:x+.5,y:y+.5});k=came[k];}return out.slice(1);}
   seen.add(ck);if(seen.size>2500)return null;
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=cur[0]+dx,ny=cur[1]+dy,nk=key(nx,ny);if(!S.free(nx,ny)||seen.has(nk))continue;if(dx&&dy&&(!S.free(cur[0]+dx,cur[1])||!S.free(cur[0],cur[1]+dy)))continue;
    const ng=g[ck]+(dx&&dy?1.414:1);if(g[nk]===undefined||ng<g[nk]){g[nk]=ng;f[nk]=ng+h(nx,ny);came[nk]=ck;if(!open.some(o=>o[0]===nx&&o[1]===ny))open.push([nx,ny]);}}}
  return null;}
 function walkTo(cell,then){const p=route(R.scene,R.p,cell);if(!p){toast('Não dá pra chegar ali.');return;}R.p.path=p;R.pending=then||null;}

 /* ---------- DOM ---------- */
 function ensureDom(){if(root)return;root=document.createElement('div');root.id='town';root.hidden=true;
  root.innerHTML='<canvas id="town-cv"></canvas><div class="tw-hud"><div class="tw-time"><b id="tw-day"></b><span id="tw-clock"></span></div><div class="tw-where" id="tw-where"></div><div class="tw-cash" id="tw-cash"></div><button id="tw-phone" class="tw-btn">📱 Celular</button><button id="tw-home" class="tw-btn">🏠 Voltar para casa</button></div><div id="tw-dialog" hidden></div><div id="tw-toast"></div><div id="tw-mini" hidden><div class="tw-mini-box"><div class="tw-mini-head"><b id="tw-mini-title"></b><span id="tw-mini-score"></span></div><canvas id="tw-mini-cv" width="760" height="420"></canvas><p id="tw-mini-help"></p><div id="tw-mini-actions"></div></div></div>';
  document.body.appendChild(root);cv=document.getElementById('town-cv');
  cv.addEventListener('pointerdown',onClick);cv.addEventListener('pointermove',e=>{if(!R)return;const h=pick(e);R.hover=h;cv.style.cursor=h?'pointer':'';});
  document.getElementById('tw-phone').onclick=()=>{if(!busy())phone();};document.getElementById('tw-home').onclick=()=>{if(busy())return;if(R.scene.id==='home'){toast('Você já está em casa.');return;}advance(30);go('home',{x:5,y:3});toast('Você volta para casa (+30 min).');};
 }
 const busy=()=>!R||R.dialog||R.mini;
 function hud(){if(!R)return;const g=api.get();document.getElementById('tw-day').textContent=R.day==='sat'?'Sábado':'Domingo';document.getElementById('tw-clock').textContent=hhmm(R.min);document.getElementById('tw-where').textContent=R.scene.name;document.getElementById('tw-cash').textContent=money(g.cash);document.getElementById('tw-home').hidden=R.scene.id==='home';}
 let toastT=0;function toast(t){const el=document.getElementById('tw-toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2600);}
 function dialog(name,text,opts){R.dialog=true;const el=document.getElementById('tw-dialog');el.hidden=false;
  el.innerHTML='<div class="tw-say">'+(name?'<b>'+esc(name)+'</b>':'')+'<p>'+text+'</p><div class="tw-opts">'+opts.map((o,i)=>'<button data-i="'+i+'" '+(o.disabled?'disabled':'')+'>'+esc(o.t)+'</button>').join('')+'</div></div>';
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.i];el.hidden=true;R.dialog=false;hud();o.fn&&o.fn();});}
 const say=(name,text,next)=>dialog(name,esc(text),[{t:'Ok',fn:next}]);
 const menu=(name,opts)=>dialog(name,'',opts);

 /* ---------- interações ---------- */
 function friend(id){return (life().friends||{})[id]||0;}
 function talk(n){const day=R.week+R.day,lines=n.id in LINES?LINES[n.id]:LINES.street;const k=friend(n.id),talkedToday=R.talked[n.id]===day;
  let text=n.id in LINES?lines[Math.min(k,lines.length-1)]:lines[Math.floor(Math.random()*lines.length)];
  if(n.id==='ze'&&R.productShelf)text+=' Olha, chegou o '+R.productShelf+' aqui na loja! É seu? Tá saindo bem.';
  R.talked[n.id]=day;if(!talkedToday&&n.id in LINES){advance(15);save({friends:{[n.id]:k+1}});}else advance(5);
  say(n.name,text);}
 function useNpc(n){if(n.silent){toast('Eles estão no meio de uma partida.');return;}
  const opts=[{t:'Conversar',fn:()=>talk(n)}];
  if(n.id==='duda')opts.push({t:'Jogar vôlei (≈45 min)',fn:()=>volley(n.name)});
  if(n.id==='teo')opts.push({t:'Jogar sinuca (≈40 min)',fn:()=>pool(n.name)});
  if(n.id==='ro')opts.push({t:'Pedir um suco · R$ 12',fn:()=>{if(spend(12)){advance(20);say('Rô','Suco de maracujá, bem gelado. Por conta da casa não dá, mas o sorriso é grátis.');}}},{t:'Pedir um refri · R$ 8',fn:()=>{if(spend(8)){advance(15);say('Rô','Aqui está. Dizem que combina com sinuca.');}}});
  if(n.id==='lia')opts.push({t:'Ver roupas',fn:clothes});
  if(n.id==='ze')opts.push({t:'Comprar refrigerante · R$ 7',fn:()=>{if(spend(7)){advance(5);toast('Refri gelado na mão.');}}});
  opts.push({t:'Tchau'});menu(n.name,opts);}
 function clothes(){const L=life(),opts=Object.entries(OUTFITS).filter(([id])=>id!=='basic').map(([id,o])=>{const own=(L.owned||[]).includes(id);return {t:(own?'Já é sua · ':'')+o.name+(own?'':' · '+money(o.price)),disabled:own,fn:()=>dialog('Lia','Levar <b>'+esc(o.name)+'</b> por '+money(o.price)+'?',[{t:'Comprar e vestir',fn:()=>{if(spend(o.price,{owned:[...(life().owned||['basic']),id],outfit:id})){advance(15);say('Lia','Ficou ótimo em você! Volta sempre.');}}},{t:'Agora não'}])};});
  opts.push({t:'Só olhando'});menu('Loja da Lia',opts);}
 function wardrobe(){const L=life();menu('Guarda-roupa',[...(L.owned||['basic']).map(id=>({t:(L.outfit===id?'✓ ':'')+OUTFITS[id].name,fn:()=>{save({outfit:id});advance(5);toast('Você trocou de roupa.');}})),{t:'Fechar'}]);}
 function homeShop(){const L=life();if(L.flags?.homeCozy){say('Casa & Cia','Sua sala já está com o kit aconchegante. Volte quando chegarem novidades!');return;}
  dialog('Casa & Cia','<b>Kit sala aconchegante</b>: tapete, planta e luminária, entregue e montado hoje. '+money(450)+'.',[{t:'Comprar o kit',fn:()=>{if(spend(450,{flags:{homeCozy:true}})){advance(15);say('Casa & Cia','Já mandamos pra sua casa. Vai lá ver!');}}},{t:'Agora não'}]);}
 const TV=['Passa um documentário sobre polvos. Você aprende que eles têm três corações.','Reprise de novela. Você já sabe o final e assiste mesmo assim.','Um programa de culinária. Dá fome.','Jogo de vôlei na TV. A Duda ia gostar.'];
 function watchTV(){R.tvOn=true;advance(60);save();say('TV',TV[Math.floor(Math.random()*TV.length)],()=>{R.tvOn=false;});}
 function bedroomDoor(){const L=life();if(R.day==='sat')menu('Porta do quarto',[{t:'Dormir (vai para domingo)',fn:()=>sleep(false)},{t:'Dormir e trabalhar no domingo (+1 foco)',fn:()=>sleep(true)},{t:'Ainda não'}]);
  else menu('Porta do quarto',[{t:'Dormir (encerra o fim de semana)',fn:()=>finish('rest')},{t:'Ainda não'}]);}
 function sleep(workSunday){if(workSunday){finish('work');return;}
  R.day='sun';R.min=START;R.talked={};go('home',{x:5,y:3});const L=life();
  if(L.flags?.momLunch==='yes'){R.min=15*60;save({flags:{momLunch:'done',momTalks:(L.flags.momTalks||0)+1}});
   say('Almoço com a mãe','Domingo de lasanha. Depois do café, sua mãe toma coragem para falar de um assunto que vinha adiando. A conversa é longa e boa. Vocês combinam de se falar mais. (Você volta para casa às 15h.)');}
  else toast('Bom dia! Domingo começou.');}
 function finish(choice){const L=life(),flags={};if(L.flags?.momLunch==='yes'){flags.momLunch=null;flags.momMissed=true;}
  try{api.act({type:'life',patch:{flags},endWeekend:choice});}catch(e){toast(e.message);return;}close();}
 function phone(){const L=life(),F=L.flags||{};
  if(F.momMissed){dialog('Mãe','Oi, meu bem. Domingo passado eu fiz lasanha e fiquei te esperando... Tudo bem, eu sei que a empresa toma tempo. Só me avisa da próxima vez, tá?',[{t:'Desculpa, mãe. Vou avisar.',fn:()=>{save({flags:{momMissed:false,momHurt:(F.momHurt||0)+1}});advance(10);}}]);return;}
  if(R.day==='sat'&&!F.momLunch){dialog('Mãe','Oi, meu bem! Tá comendo direito? Amanhã vou fazer aquele almoço de domingo. Vem?',[{t:'Vou sim!',fn:()=>{save({flags:{momLunch:'yes'}});advance(10);toast('Almoço com a mãe marcado para domingo.');}},{t:'Esse domingo vou trabalhar.',fn:()=>{save({flags:{momLunch:'no'}});advance(10);say('Mãe','Tudo bem, a gente remarca. Não esquece de descansar.');}},{t:'Ainda não sei.',fn:()=>advance(5)}]);return;}
  dialog('Mãe',F.momLunch==='yes'?'Te espero amanhã, hein! Vou fazer lasanha.':'Oi, meu bem! Só liguei pra ouvir sua voz. Se cuida.',[{t:'Beijo, mãe.',fn:()=>advance(5)}]);}
 function poolTable(){menu('Mesa de sinuca',[{t:'Jogar contra o Téo',fn:()=>pool('Téo')},{t:'Jogar contra um frequentador',fn:()=>pool('Frequentador')},{t:'Agora não'}]);}
 function clawStart(){dialog('Garrinha','Cada tentativa custa '+money(5)+'. Prêmios à vista: '+PRIZES.map(p=>p.name).join(', ')+'.',[{t:'Jogar · R$ 5',fn:()=>{if(spend(5)){advance(5);claw();}}},{t:'Agora não'}]);}

 /* ---------- clique no mundo ---------- */
 function screenOf(e){const r=cv.getBoundingClientRect(),k=R.view;return [(e.clientX-r.left)/k.s-k.ox,(e.clientY-r.top)/k.s-k.oy];}
 function pick(e){if(busy())return null;const [mx,my]=screenOf(e);
  for(const n of R.scene.npcs){const [sx,sy]=P(n.x,n.y);if(Math.abs(mx-sx)<14&&my>sy-52&&my<sy+4)return {npc:n};}
  let best=null;for(const h of R.scene.hots){const pts=[];for(const [a,b,z] of [[0,0,0],[h.w,0,0],[0,h.d,0],[h.w,h.d,0],[0,0,h.h],[h.w,0,h.h],[0,h.d,h.h],[h.w,h.d,h.h]])pts.push(P(h.x+a,h.y+b,z));
   const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);if(mx>=Math.min(...xs)-4&&mx<=Math.max(...xs)+4&&my>=Math.min(...ys)-4&&my<=Math.max(...ys)+4){const d=h.x+h.y;if(!best||d>best.d)best={hot:h,d};}}
  return best;}
 function onClick(e){if(busy())return;const h=pick(e);
  if(h?.npc){const n=h.npc,cells=[[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,-1]].map(([dx,dy])=>[Math.floor(n.x)+dx,Math.floor(n.y)+dy]).filter(([x,y])=>R.scene.free(x,y)).sort((a,b)=>Math.hypot(a[0]-R.p.x,a[1]-R.p.y)-Math.hypot(b[0]-R.p.x,b[1]-R.p.y));
   if(Math.hypot(n.x-R.p.x,n.y-R.p.y)<1.8){n.path=[];useNpc(n);return;}if(cells[0])walkTo(cells[0],()=>{n.path=[];useNpc(n);});return;}
  if(h?.hot){const st=h.hot.stand;if(Math.hypot(st[0]+.5-R.p.x,st[1]+.5-R.p.y)<.6){h.hot.use();return;}walkTo(st,()=>h.hot.use());return;}
  const [mx,my]=screenOf(e),[x,y]=inv(mx,my),cx=Math.floor(x),cy=Math.floor(y);if(R.scene.free(cx,cy))walkTo([cx,cy]);}

 /* ---------- laço ---------- */
 function update(dt){const S=R.scene;
  if(!busy()){R.min+=dt/0.6;if(R.min>=LIMIT){R.min=LIMIT;if(S.id!=='home'){go('home',{x:5,y:3});say('','Está ficando tarde. Melhor voltar pra casa. (Para dormir, use a porta do quarto.)');}else if(!R.lateWarned){R.lateWarned=true;toast('Já é tarde. Vá dormir pela porta do quarto.');}}}
  const p=R.p;if(p.path.length){const t=p.path[0],dx=t.x-p.x,dy=t.y-p.y,d=Math.hypot(dx,dy),step=4.2*dt;if(d<=step){p.x=t.x;p.y=t.y;p.path.shift();if(!p.path.length&&R.pending){const f=R.pending;R.pending=null;f();}}else{p.x+=dx/d*step;p.y+=dy/d*step;}p.walk=true;}else p.walk=false;
  for(const n of S.npcs){n.t+=dt;if(!n.wander)continue;if(n.path.length){const t=n.path[0],dx=t.x-n.x,dy=t.y-n.y,d=Math.hypot(dx,dy),step=1.6*dt;if(d<=step){n.x=t.x;n.y=t.y;n.path.shift();}else{n.x+=dx/d*step;n.y+=dy/d*step;}n.walking=true;}
   else{n.walking=false;n.wait-=dt;if(n.wait<=0){n.wait=2+Math.random()*4;const tx=Math.floor(n.x+(Math.random()-.5)*10),ty=Math.floor(n.y+(Math.random()-.5)*10);const r=S.free(tx,ty)&&route(S,n,[tx,ty]);if(r&&r.length<14)n.path=r;}}}
  R.fade=Math.max(0,R.fade-dt*3);if(Math.floor(R.min)%5===0)hud();}
 function draw(){const S=R.scene,dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);c.fillStyle=S.id==='street'?'#2a3a2e':S.warm?'#1f1410':'#1b1d31';c.fillRect(0,0,cv.width,cv.height);
  const s=Math.max(.62,Math.min(1.45,Math.min(W/760,H/520)))*(S.id==='street'?1:1.25);const [px,py]=P(R.p.x,R.p.y);
  let ox,oy;if(S.id==='street'){ox=W/2/s-px;oy=H/2/s-py+30;}else{const [cx,cy]=P(S.w/2,S.h/2);ox=W/2/s-cx;oy=H/2/s-cy+40;}
  R.view={s,ox,oy};c.setTransform(dpr*s,0,0,dpr*s,dpr*s*ox,dpr*s*oy);
  for(let x=0;x<S.w;x++)for(let y=0;y<S.h;y++)poly(fZ(0,x,x+1,y,y+1),S.ground(x,y),'#0000000f',.6);
  if(S.walls)S.walls();if(S.decor)S.decor();
  const items=[...S.items];const k=pal();items.push({d:R.p.x+R.p.y,draw:()=>{const [sx,sy]=P(R.p.x,R.p.y);person(sx,sy,k,R.t,R.p.walk);}});
  for(const n of S.npcs)items.push({d:n.x+n.y,draw:()=>{const [sx,sy]=P(n.x,n.y);person(sx,sy,n.k,n.t,n.walking);if(n.name&&R.hover?.npc===n)label(sx,sy-64,n.name,{border:'#7b5cd6'});}});
  if(S.id==='street'){const b=(R.t*1.3)%2,f=b<1?b:2-b,[ax,ay]=P(13.6+f*1.8,12.2+f*2.2,1.2+Math.sin(f*Math.PI)*1.6);items.push({d:30,draw:()=>circle(ax,ay,5,'#fff','#c8553d',1.5)});}
  items.sort((a,b)=>a.d-b.d).forEach(i=>i.draw());
  if(R.hover?.hot){const h=R.hover.hot,[sx,sy]=P(h.x+h.w/2,h.y+h.d/2,h.h+.3);label(sx,sy,h.label,{border:'#7b5cd6'});}
  if(R.p.path.length){const t=R.p.path[R.p.path.length-1],[sx,sy]=P(t.x,t.y);c.save();c.globalAlpha=.6;ellipse(sx,sy,10,5,'#ffffff');c.restore();}
  if(S.warm){c.setTransform(1,0,0,1,0,0);const gr=c.createRadialGradient(cv.width/2,cv.height*.45,10,cv.width/2,cv.height*.45,cv.width*.7);gr.addColorStop(0,'rgba(255,190,110,.18)');gr.addColorStop(1,'rgba(30,12,4,.35)');c.fillStyle=gr;c.fillRect(0,0,cv.width,cv.height);}
  const dusk=Math.max(0,Math.min(1,(R.min-17*60)/(4*60)));if(dusk>0&&S.id==='street'){c.setTransform(1,0,0,1,0,0);c.fillStyle='rgba(30,30,80,'+(dusk*.38)+')';c.fillRect(0,0,cv.width,cv.height);}
  if(R.fade>0){c.setTransform(1,0,0,1,0,0);c.fillStyle='rgba(15,16,32,'+R.fade+')';c.fillRect(0,0,cv.width,cv.height);}}
 function frame(now){if(!R)return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;R.t+=dt;if(!R.mini)update(dt);draw();raf=requestAnimationFrame(frame);}

 /* ---------- abrir e fechar ---------- */
 function open(a){api=a;ensureDom();const g=api.get(),L=g.life||{},o=L.outing,week=(g.weekly?.reports?.length)||0;
  R={week,day:'sat',min:START,talked:{},t:0,fade:1,hover:null,p:{x:5.5,y:3.5,path:[]},productShelf:(g.sold||0)>=100&&g.name?g.name:(g.history||[]).find(h=>(h.sold||0)>=100)?.name||null};
  if(o&&o.week===week){R.day=o.day;R.min=o.min;R.scene=BUILD[o.scene](g,L);R.p={x:o.x+.5,y:o.y+.5,path:[]};}else{R.scene=BUILD.home(g,L);R.p={x:5.5,y:3.5,path:[]};if(L.flags&&['done','no'].includes(L.flags.momLunch))try{api.act({type:'life',patch:{flags:{momLunch:null}}});}catch(e){}}
  root.hidden=false;document.body.classList.add('town-open');save();hud();last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);
  if(!o||o.week!==week)setTimeout(()=>say('Fim de semana','Você está em casa. Saia pela porta de entrada para explorar o bairro. Clique no chão para andar e em pessoas ou objetos para interagir. O relógio anda devagar enquanto você passeia e avança mais nas atividades.'),300);}
 function close(){cancelAnimationFrame(raf);R=null;if(root)root.hidden=true;document.body.classList.remove('town-open');api.onClose&&api.onClose();}

 /* ---------- minigames: base comum ---------- */
 let M=null;
 function miniOpen(title,help){R.mini=true;const el=document.getElementById('tw-mini');el.hidden=false;document.getElementById('tw-mini-title').textContent=title;document.getElementById('tw-mini-help').textContent=help;document.getElementById('tw-mini-actions').innerHTML='';
  const mc=document.getElementById('tw-mini-cv');const ctx=mc.getContext('2d');return {mc,ctx};}
 function miniPos(e){const mc=document.getElementById('tw-mini-cv'),r=mc.getBoundingClientRect();return [(e.clientX-r.left)/r.width*mc.width,(e.clientY-r.top)/r.height*mc.height];}
 function miniEnd(text,buttons){document.getElementById('tw-mini-help').textContent=text;document.getElementById('tw-mini-actions').innerHTML=buttons.map((b,i)=>'<button data-i="'+i+'">'+esc(b.t)+'</button>').join('');
  document.querySelectorAll('#tw-mini-actions button').forEach(btn=>btn.onclick=()=>buttons[+btn.dataset.i].fn());}
 function miniClose(){if(M){cancelAnimationFrame(M.raf);const mc=document.getElementById('tw-mini-cv');mc.onpointerdown=mc.onpointerup=mc.onpointermove=null;window.onkeydown=null;window.onkeyup=null;}M=null;document.getElementById('tw-mini').hidden=true;R.mini=false;hud();}
 function score(t){document.getElementById('tw-mini-score').textContent=t;}

 /* ---------- sinuca ---------- */
 function pool(opp){const {mc,ctx:x}=miniOpen('Sinuca contra '+opp,'Mire com o mouse, segure para dosar a força e solte para tacar. Você joga com as laranjas; encaçapar uma sua dá outra tacada.');
  const T={x:40,y:40,w:680,h:340},BR=10,pockets=[[T.x,T.y],[T.x+T.w/2,T.y-4],[T.x+T.w,T.y],[T.x,T.y+T.h],[T.x+T.w/2,T.y+T.h+4],[T.x+T.w,T.y+T.h]];
  const balls=[{x:200,y:210,vx:0,vy:0,k:'cue'}];[[0,0,'me'],[1,-.5,'op'],[1,.5,'me'],[2,-1,'op'],[2,0,'me'],[2,1,'op']].forEach(([i,j,k])=>balls.push({x:500+i*BR*1.8,y:210+j*BR*2.1,vx:0,vy:0,k}));
  const st={turn:'me',pot:{me:0,op:0},aim:[480,210],power:0,charging:false,shot:null,over:false,think:0,msg:'Sua vez'};M={raf:0,balls,st};const tok=M;
  const sc=()=>score('Você '+st.pot.me+' × '+st.pot.op+' '+opp);sc();
  function shoot(ang,pw){const cue=balls[0];cue.vx=Math.cos(ang)*pw*17;cue.vy=Math.sin(ang)*pw*17;st.shot={by:st.turn,potted:[]};}
  function physics(){let moving=false;for(const b of balls){if(b.out)continue;b.x+=b.vx;b.y+=b.vy;b.vx*=.988;b.vy*=.988;if(Math.hypot(b.vx,b.vy)<.04)b.vx=b.vy=0;else moving=true;
    if(b.x<T.x+BR){b.x=T.x+BR;b.vx=-b.vx*.85;}if(b.x>T.x+T.w-BR){b.x=T.x+T.w-BR;b.vx=-b.vx*.85;}if(b.y<T.y+BR){b.y=T.y+BR;b.vy=-b.vy*.85;}if(b.y>T.y+T.h-BR){b.y=T.y+T.h-BR;b.vy=-b.vy*.85;}
    for(const p of pockets)if(Math.hypot(b.x-p[0],b.y-p[1])<21){b.out=true;b.vx=b.vy=0;st.shot&&st.shot.potted.push(b.k);break;}}
   for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.out||b.out)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
    if(d>0&&d<2*BR){const nx=dx/d,ny=dy/d,o=(2*BR-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(rel>0){a.vx-=rel*nx;a.vy-=rel*ny;b.vx+=rel*nx;b.vy+=rel*ny;}}}
   return moving;}
  function settle(){const s=st.shot;st.shot=null;for(const k of s.potted)if(k==='me'||k==='op')st.pot[k]++;sc();
   if(st.pot.me>=3||st.pot.op>=3){st.over=true;const win=st.pot.me>=3;advance(40);save();miniEnd(win?'Você venceu! '+opp+' pede revanche com os olhos.':opp+' venceu desta vez.',[{t:'Revanche',fn:()=>{miniClose();pool(opp);}},{t:'Sair',fn:miniClose}]);return;}
   const cue=balls[0];const keep=s.potted.includes(s.by)&&!s.potted.includes('cue');
   if(s.potted.includes('cue')){cue.out=false;cue.x=200;cue.y=210;cue.vx=cue.vy=0;while(balls.some(b=>b!==cue&&!b.out&&Math.hypot(b.x-cue.x,b.y-cue.y)<2*BR+1))cue.y+=2*BR+2;}
   if(!keep)st.turn=st.turn==='me'?'op':'me';st.msg=st.turn==='me'?(keep?'Boa! Jogue de novo':s.potted.includes('cue')?opp+' encaçapou a branca. Sua vez':'Sua vez'):(s.potted.includes('cue')?'Você encaçapou a branca. Vez de '+opp:'Vez de '+opp);if(st.turn==='op')st.think=55;}
  function ai(){const cue=balls[0];let best=null;const norm=a=>{a=Math.abs(a)%(Math.PI*2);return a>Math.PI?Math.PI*2-a:a;};
   for(const b of balls)if(!b.out&&b.k==='op')for(const p of pockets){const dx=p[0]-b.x,dy=p[1]-b.y,d=Math.hypot(dx,dy),gx=b.x-dx/d*2*BR,gy=b.y-dy/d*2*BR,ax=gx-cue.x,ay=gy-cue.y,ad=Math.hypot(ax,ay),cut=norm(Math.atan2(ay,ax)-Math.atan2(dy,dx));
    if(cut>1.15)continue;const s=d+ad+cut*220;if(!best||s<best.s)best={s,ang:Math.atan2(ay,ax),dist:d+ad};}
   if(!best){const t=balls.find(b=>!b.out&&b.k==='op')||balls.find(b=>!b.out&&b!==cue);best={ang:Math.atan2(t.y-cue.y,t.x-cue.x),dist:300};}
   shoot(best.ang+(Math.random()-.5)*(opp==='Téo'?.025:.045),Math.min(1,.38+best.dist/750));}
  mc.onpointermove=e=>{st.aim=miniPos(e);};mc.onpointerdown=e=>{st.aim=miniPos(e);if(st.turn==='me'&&!st.shot&&!st.over){st.charging=true;st.power=0;}};
  mc.onpointerup=()=>{if(!st.charging)return;st.charging=false;const cue=balls[0];shoot(Math.atan2(st.aim[1]-cue.y,st.aim[0]-cue.x),Math.max(.08,st.power));};
  function loop(){if(st.charging)st.power=Math.min(1,st.power+.018);
   if(st.shot){const m=physics()||physics();if(!m)settle();}else if(st.turn==='op'&&!st.over){if(--st.think<=0)ai();}
   x.clearRect(0,0,760,420);x.fillStyle='#6b3d22';x.fillRect(14,14,732,392);x.fillStyle='#2f7a4a';x.fillRect(T.x,T.y,T.w,T.h);x.strokeStyle='#245e39';x.lineWidth=2;x.strokeRect(T.x,T.y,T.w,T.h);
   x.fillStyle='#ffffff22';x.fillRect(T.x+160,T.y,2,T.h);for(const p of pockets){x.beginPath();x.arc(p[0],p[1],19,0,Math.PI*2);x.fillStyle='#120a06';x.fill();}
   const cue=balls[0];if(st.turn==='me'&&!st.shot&&!st.over&&!cue.out){const a=Math.atan2(st.aim[1]-cue.y,st.aim[0]-cue.x);x.setLineDash([6,6]);x.strokeStyle='#ffffffaa';x.beginPath();x.moveTo(cue.x,cue.y);x.lineTo(cue.x+Math.cos(a)*220,cue.y+Math.sin(a)*220);x.stroke();x.setLineDash([]);
    const back=24+st.power*50;x.strokeStyle='#d9b77a';x.lineWidth=6;x.beginPath();x.moveTo(cue.x-Math.cos(a)*back,cue.y-Math.sin(a)*back);x.lineTo(cue.x-Math.cos(a)*(back+190),cue.y-Math.sin(a)*(back+190));x.stroke();x.lineWidth=2;}
   for(const b of balls){if(b.out)continue;x.beginPath();x.arc(b.x+2,b.y+3,BR,0,Math.PI*2);x.fillStyle='#0004';x.fill();x.beginPath();x.arc(b.x,b.y,BR,0,Math.PI*2);x.fillStyle=b.k==='cue'?'#fbfbf5':b.k==='me'?'#ef8a3c':'#3d6fa8';x.fill();
    if(b.k==='op'){x.fillStyle='#fff';x.fillRect(b.x-BR+2,b.y-3,BR*2-4,6);}x.beginPath();x.arc(b.x-3,b.y-3,3,0,Math.PI*2);x.fillStyle='#ffffff99';x.fill();}
   x.fillStyle='#fff';x.font='800 15px '+FONT;x.fillText(st.msg,24,34);if(st.charging){x.fillStyle='#0006';x.fillRect(560,20,160,12);x.fillStyle=st.power>.8?'#e46d6d':'#f2a93b';x.fillRect(560,20,160*st.power,12);}
   if(M===tok)M.raf=requestAnimationFrame(loop);}
  M.raf=requestAnimationFrame(loop);}

 /* ---------- vôlei ---------- */
 function volley(opp){const {mc,ctx:x}=miniOpen('Vôlei contra '+opp,'Clique na quadra para se mover. Clique quando a bola estiver perto de você para devolver. A marca no chão mostra onde ela vai cair. Quem fizer 5 pontos vence.');
  const G=.3,FLOOR=360,NET=380,NETTOP=215;const me={x:190,tx:190},op={x:570,miss:false},ball={x:190,y:240,vx:0,vy:0,live:false,last:null};
  const st={me:0,op:0,serve:'me',wait:70,msg:'Seu saque',over:false,rally:0};M={raf:0};const tok=M;const sc=()=>score('Você '+st.me+' × '+st.op+' '+opp);sc();
  function launch(fx,fy,tx){const vy=-(9.2+Math.random()*1.4),t=(-vy+Math.sqrt(vy*vy+2*G*(FLOOR-fy)))/G;ball.x=fx;ball.y=fy;ball.vx=(tx-fx)/t;ball.vy=vy;ball.live=true;}
  const landX=()=>{const t=(-ball.vy+Math.sqrt(ball.vy*ball.vy+2*G*(FLOOR-ball.y)))/G;return ball.x+ball.vx*t;};
  function point(who,why){ball.live=false;st[who]++;sc();st.rally=0;st.serve=who;st.wait=80;op.miss=false;
   if(st.me>=5||st.op>=5){st.over=true;const win=st.me>=5;advance(45);save();miniEnd(win?'Vitória! '+opp+' quer revanche.':opp+' venceu. Foi por pouco.',[{t:'Revanche',fn:()=>{miniClose();volley(opp);}},{t:'Sair',fn:miniClose}]);}
   st.msg=(who==='me'?'Ponto seu! ':'Ponto de '+opp+'. ')+why;}
  mc.onpointerdown=e=>{if(st.over)return;const [mx]=miniPos(e);
   if(ball.live&&ball.last!=='me'&&ball.x<NET&&Math.abs(ball.x-me.x)<48&&ball.y>FLOOR-140&&ball.y<FLOOR-15){st.rally++;ball.last='me';launch(ball.x,ball.y,470+Math.random()*250);st.msg='Boa!';return;}
   me.tx=Math.max(30,Math.min(NET-25,mx));};
  function loop(){if(!st.over){
    if(!ball.live){if(--st.wait<=0){if(st.serve==='me'){ball.last='me';launch(me.x,FLOOR-110,480+Math.random()*230);}else{ball.last='op';launch(op.x,FLOOR-110,60+Math.random()*260);}st.msg='';}}
    else{const px=ball.x;ball.x+=ball.vx;ball.y+=ball.vy;ball.vy+=G;
     if((px-NET)*(ball.x-NET)<=0&&ball.y>NETTOP){ball.vx=-ball.vx*.25;ball.x=px;}
     if(ball.y>=FLOOR){const lx=ball.x;if(lx<15||lx>745)point(ball.last==='me'?'op':'me','Bola fora.');else if(lx<NET)point('op','A bola caiu do seu lado.');else point('me','A bola caiu do lado de '+opp+'.');}}
    me.x+=Math.sign(me.tx-me.x)*Math.min(5,Math.abs(me.tx-me.x));
    let target=570;if(ball.live&&ball.vx>0)target=Math.max(NET+30,Math.min(730,landX()));if(ball.live&&ball.last==='op'&&ball.vx<0)target=570;op.x+=Math.sign(target-op.x)*Math.min(3.5,Math.abs(target-op.x));
    if(ball.live&&ball.last!=='op'&&!op.miss&&ball.x>NET&&Math.abs(ball.x-op.x)<40&&ball.y>FLOOR-125&&ball.y<FLOOR-20){if(Math.random()<Math.max(.6,.88-st.rally*.02)){ball.last='op';launch(ball.x,ball.y,50+Math.random()*290);st.rally++;}else op.miss=true;}}
   x.clearRect(0,0,760,420);const sky=x.createLinearGradient(0,0,0,420);sky.addColorStop(0,'#9fd3f5');sky.addColorStop(1,'#e8f4fb');x.fillStyle=sky;x.fillRect(0,0,760,420);
   x.fillStyle='#3f8f5a';for(let i=0;i<9;i++){x.beginPath();x.arc(40+i*90,FLOOR-40,46,0,Math.PI*2);x.fill();}x.fillStyle='#d9895c';x.fillRect(0,FLOOR,760,60);x.fillStyle='#fff';x.fillRect(15,FLOOR,730,3);
   x.fillStyle='#6b6f7e';x.fillRect(NET-3,NETTOP,6,FLOOR-NETTOP);x.fillStyle='#ffffff55';x.fillRect(NET-2,NETTOP,4,60);x.strokeStyle='#ffffffcc';for(let y=NETTOP;y<NETTOP+60;y+=8){x.beginPath();x.moveTo(NET-14,y);x.lineTo(NET+14,y);x.stroke();}
   if(ball.live){const lx=landX();x.fillStyle=lx<NET?'#e46d6daa':'#ffffff88';x.beginPath();x.ellipse(lx,FLOOR+3,16,5,0,0,Math.PI*2);x.fill();}
   const fig=(fx,col,hair)=>{x.fillStyle='#0003';x.beginPath();x.ellipse(fx,FLOOR+2,16,5,0,0,Math.PI*2);x.fill();x.fillStyle='#2d2a4a';x.fillRect(fx-8,FLOOR-34,6,34);x.fillRect(fx+2,FLOOR-34,6,34);x.fillStyle=col;x.fillRect(fx-11,FLOOR-74,22,42);x.beginPath();x.arc(fx,FLOOR-86,12,0,Math.PI*2);x.fillStyle='#edbd97';x.fill();x.beginPath();x.arc(fx,FLOOR-90,12,Math.PI,0);x.fillStyle=hair;x.fill();};
   fig(me.x,pal().shirt,'#3b2a2a');fig(op.x,'#2f9a6a','#5a3b26');
   if(ball.live||st.wait>0){x.beginPath();x.arc(ball.live?ball.x:(st.serve==='me'?me.x:op.x),ball.live?ball.y:FLOOR-110,10,0,Math.PI*2);x.fillStyle='#fff';x.fill();x.strokeStyle='#c8553d';x.lineWidth=2;x.stroke();}
   x.fillStyle='#241d33';x.font='800 16px '+FONT;x.fillText(st.msg,20,30);if(M===tok)M.raf=requestAnimationFrame(loop);}
  M.raf=requestAnimationFrame(loop);}

 /* ---------- garrinha ---------- */
 function claw(){const {mc,ctx:x}=miniOpen('Garrinha','Segure o botão do mouse (ou espaço) para levar a garra para a direita e solte para parar. Segure de novo para levar ao fundo e solte: a garra desce e tenta pegar.');
  const items=Array.from({length:7},(_,i)=>{const t=PRIZES[Math.floor(Math.random()*PRIZES.length)];return {t,x:230+i*55+Math.random()*25,z:Math.random()*2};}).sort((a,b)=>b.z-a.z);
  const st={phase:'x',hold:false,cx:170,cz:0,cy:70,got:null,slipAt:null,over:false,msg:'Segure para mover →'};M={raf:0,items,st};const tok=M;score('');
  const down=()=>{if(!st.over)st.hold=true;},up=()=>{if(!st.hold)return;st.hold=false;if(st.phase==='x'){st.phase='zwait';st.msg='Segure para mover ao fundo ↗';}else if(st.phase==='z')st.phase='down';};
  mc.onpointerdown=()=>{if(st.phase==='zwait')st.phase='z';down();};mc.onpointerup=up;window.onkeydown=e=>{if(e.code==='Space'){e.preventDefault();if(st.phase==='zwait')st.phase='z';down();}};window.onkeyup=e=>{if(e.code==='Space')up();};
  const yOf=z=>330-z*22,sOf=z=>1-z*.15;
  function loop(){if(st.phase==='x'&&st.hold)st.cx=Math.min(610,st.cx+2.6);if(st.phase==='z'&&st.hold)st.cz=Math.min(2.2,st.cz+.022);
   if(st.phase==='down'){st.cy+=3;const bottom=yOf(st.cz)-30;if(st.cy>=bottom){st.cy=bottom;let best=null;for(const it of items){const d=Math.hypot(it.x-st.cx,(it.z-st.cz)*42);if(d<it.t.tol&&(!best||d<best.d))best={it,d};}
     if(best){st.got=best.it;const slip=.18+best.d/best.it.t.tol*.45;st.slipAt=Math.random()<slip?.3+Math.random()*.6:null;}st.phase='up';}}
   else if(st.phase==='up'){st.cy-=3;if(st.got){st.got.x=st.cx;st.got.z=st.cz;}if(st.cy<=70){st.cy=70;st.phase='back';}}
   else if(st.phase==='back'){const k=(st.cx-150)/460;st.cx=Math.max(150,st.cx-2.6);st.cz=Math.max(0,st.cz-.02);if(st.got){st.got.x=st.cx;st.got.z=st.cz;if(st.slipAt!=null&&k<st.slipAt){st.got.drop=true;st.got=null;st.msg='Ih, escapou!';}}
    if(st.cx<=150&&st.cz<=0){st.phase='done';finishClaw();}}
   for(const it of items)if(it.drop){it.dy=(it.dy||0)+.5;it.fall=(it.fall||0)+it.dy;if(it.fall>yOf(it.z)-st.cy-10){it.drop=false;it.fall=0;it.dy=0;}}
   x.clearRect(0,0,760,420);x.fillStyle='#ff6b9a';x.fillRect(90,10,560,400);x.fillStyle='#cfeefd';x.fillRect(110,40,520,330);x.fillStyle='#b6d9ee';x.fillRect(110,290,520,80);
   x.fillStyle='#2d2a4a';x.fillRect(120,300,70,70);x.fillStyle='#fff';x.font='800 11px '+FONT;x.fillText('SAÍDA',132,292);
   for(const it of items){if(it===st.got)continue;const s=sOf(it.z),yy=yOf(it.z)-(it.drop?-(it.fall||0):0);x.beginPath();x.arc(it.x,yy-it.t.r*s,it.t.r*s,0,Math.PI*2);x.fillStyle=it.t.col;x.fill();x.strokeStyle='#0003';x.stroke();}
   const s=sOf(st.cz);x.strokeStyle='#6b6f7e';x.lineWidth=3;x.beginPath();x.moveTo(st.cx,40);x.lineTo(st.cx,st.cy);x.stroke();x.fillStyle='#9aa3b5';x.fillRect(st.cx-14*s,st.cy-8,28*s,10);
   const open=st.phase==='down'||st.phase==='x'||st.phase==='z'||st.phase==='zwait';x.lineWidth=4;x.beginPath();x.moveTo(st.cx-10*s,st.cy+2);x.lineTo(st.cx-(open?20:9)*s,st.cy+22*s);x.moveTo(st.cx+10*s,st.cy+2);x.lineTo(st.cx+(open?20:9)*s,st.cy+22*s);x.stroke();
   if(st.got){x.beginPath();x.arc(st.cx,st.cy+18*s+st.got.t.r*s*.6,st.got.t.r*s,0,Math.PI*2);x.fillStyle=st.got.t.col;x.fill();}
   x.fillStyle='#fff';x.fillRect(660,40,90,70);x.strokeStyle='#2d2a4a';x.lineWidth=1;x.strokeRect(660,40,90,70);x.fillStyle='#241d33';x.font='800 9px '+FONT;x.fillText('VISTA DE CIMA',664,36);
   for(const it of items){if(it===st.got)continue;x.beginPath();x.arc(660+(it.x-110)/520*90,105-it.z/2.2*60,3,0,Math.PI*2);x.fillStyle=it.t.col;x.fill();}
   x.strokeStyle='#e46d6d';x.lineWidth=2;x.beginPath();x.arc(660+(st.cx-110)/520*90,105-st.cz/2.2*60,5,0,Math.PI*2);x.stroke();
   x.fillStyle='#241d33';x.font='800 15px '+FONT;x.fillText(st.msg,120,32);if(M===tok)M.raf=requestAnimationFrame(loop);}
  function finishClaw(){st.over=true;const won=st.got;let text;if(won){items.splice(items.indexOf(won),1);st.got=null;}st.msg=won?'Pegou! Caiu na saída.':'Não foi desta vez.';
   if(won){const L=life(),dup=(L.collection||[]).includes(won.t.id);save({collection:[...(L.collection||[]),won.t.id]});text='Você pegou: '+won.t.name+'!'+(dup?' (repetido)':' Foi para a prateleira de casa.');}else text='Não foi desta vez.';
   miniEnd(text,[{t:'Tentar de novo · R$ 5',fn:()=>{if(api.get().cash<5){toast('Dinheiro insuficiente.');return;}miniClose();if(spend(5)){advance(5);claw();}}},{t:'Sair',fn:miniClose}]);}
  M.raf=requestAnimationFrame(loop);}

 /* gancho de teste: avança a visita sem depender do requestAnimationFrame */
 const debug={state:()=>R,step:(sec=1)=>{for(let i=0;i<sec*20&&R;i++){R.t+=.05;if(!R.mini)update(.05);}if(R)draw();},click:(cx,cy)=>{const k=R.view,r=cv.getBoundingClientRect();onClick({clientX:r.left+(cx+k.ox)*k.s,clientY:r.top+(cy+k.oy)*k.s});},P,mini:(kind,opp)=>{if(M)miniClose();({pool,volley,claw})[kind](opp||'Téo');},closeMini:()=>miniClose(),M:()=>M,go,bedroomDoor,phone};
 return {open,close,isOpen:()=>!!R,debug};
})();
if(typeof module!=='undefined')module.exports=Town;
