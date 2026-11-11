/* Bairro do fim de semana (0.85) — vida fora da startup, em clima cozy.
   Casa, rua com praça, Bar da Praça e Galeria do Bairro em isométrico vetorial, com luz que muda ao longo do dia.
   Conversas com retrato, amizades, celular (mãe, convites e loja online), gato, planta, diário do dia e três minigames.
   Só altera a partida via api.act({type:'life'|'weekendSales', ...}); o resto é estado local da visita. */
const Town=(()=>{
 const TX=30,TY=15,TZ=34;
 const P=(x,y,z=0)=>[(x-y)*TX,(x+y)*TY-z*TZ];
 const inv=(sx,sy)=>{const a=sx/TX,b=sy/TY;return [(a+b)/2,(b-a)/2];};
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const mix=(a,b,t)=>'#'+rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*Math.max(0,Math.min(1,t))).toString(16).padStart(2,'0')).join('');
 const lit=(c,t)=>mix(c,'#fff4dc',t),dk=(c,t)=>mix(c,'#1d1530',t);
 const esc=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[ch]);
 const money=v=>'R$ '+Math.round(v).toLocaleString('pt-BR');
 const hhmm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(Math.floor(m%60)).padStart(2,'0');
 const FONT='"Nunito","Segoe UI",system-ui,sans-serif';
 const START=10*60,LIMIT=23*60,DAYLEN=LIMIT-START;
 const OUTFITS={basic:{name:'Camiseta lisa',shirt:'#5e6ad2',price:0},tee:{name:'Camiseta laranja',shirt:'#ef8a3c',price:60},hoodie:{name:'Moletom roxo',shirt:'#7b5cd6',price:120,hood:true},jacket:{name:'Jaqueta jeans',shirt:'#3d6fa8',trim:'#a8c6ea',price:180}};
 const PRIZES=[{id:'chaveiro',name:'Chaveiro de dado',col:'#f2a93b',r:10,tol:20},{id:'gato',name:'Pelúcia de gato',col:'#6b6478',r:16,tol:26},{id:'pato',name:'Patinho de borracha',col:'#ffd84a',r:13,tol:22},{id:'fone',name:'Mini fone',col:'#7b5cd6',r:13,tol:16},{id:'robo',name:'Robozinho',col:'#9aa3b5',r:14,tol:18}];

 /* ---------- luz do dia ---------- */
 const KEYS=[[600,{sky:['#8fd0f5','#e3f4fb'],tint:[255,255,255,0],night:0}],[930,{sky:['#8fd0f5','#e3f4fb'],tint:[255,255,255,0],night:0}],[1050,{sky:['#f6b878','#fde2c2'],tint:[255,160,70,.13],night:0}],[1140,{sky:['#7a6fb8','#f2a48a'],tint:[90,60,140,.24],night:.5}],[1230,{sky:['#1d2350','#3a3f7a'],tint:[20,25,70,.44],night:1}],[1400,{sky:['#141a3e','#2d3266'],tint:[15,18,55,.5],night:1}]];
 function light(min){let a=KEYS[0],b=KEYS[KEYS.length-1];for(let i=0;i<KEYS.length-1;i++)if(min>=KEYS[i][0]&&min<=KEYS[i+1][0]){a=KEYS[i];b=KEYS[i+1];break;}
  const t=b[0]===a[0]?0:(min-a[0])/(b[0]-a[0]),A=a[1],B=b[1];
  return {sky:[mix(A.sky[0],B.sky[0],t),mix(A.sky[1],B.sky[1],t)],tint:A.tint.map((v,i)=>v+(B.tint[i]-v)*t),night:A.night+(B.night-A.night)*t};}

 /* ---------- primitivas ---------- */
 let c;
 function path(pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
 function poly(pts,fill,stroke,lw=1){path(pts);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineJoin='round';c.stroke();}}
 const fY=(y,x0,x1,z0,z1)=>[P(x0,y,z0),P(x1,y,z0),P(x1,y,z1),P(x0,y,z1)];
 const fX=(x,y0,y1,z0,z1)=>[P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)];
 const fZ=(z,x0,x1,y0,y1)=>[P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];
 function box(x,y,z,w,d,h,col,o={}){const st=o.stroke===false?null:(o.line||dk(col,.45));
  poly(fY(y+d,x,x+w,z,z+h),o.left||lit(col,.04),st);poly(fX(x+w,y,y+d,z,z+h),o.right||dk(col,.2),st);poly(fZ(z+h,x,x+w,y,y+d),o.top||lit(col,.2),st);}
 function circle(x,y,r,fill,stroke,lw=1){c.beginPath();c.arc(x,y,Math.max(.1,r),0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function ellipse(x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
 function rrect(x,y,w,h,r,fill,stroke,lw=1.5){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function glow(x,y,r,col,a=1){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=a;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.restore();}
 function label(x,y,text,o={}){c.font=(o.weight||800)+' '+(o.size||11)+'px '+FONT;const w=c.measureText(text).width+16;c.save();c.globalAlpha=o.alpha??1;c.shadowColor='rgba(0,0,0,.2)';c.shadowOffsetY=2;rrect(x-w/2,y-11,w,22,11,o.bg||'#fff');c.shadowColor='transparent';if(o.border)rrect(x-w/2,y-11,w,22,11,null,o.border);c.fillStyle=o.color||'#241d33';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y+.5);c.restore();c.textAlign='left';c.textBaseline='alphabetic';}
 function emoji(x,y,ch,size=14,a=1){c.save();c.globalAlpha=a;c.font=size+'px "Segoe UI Emoji","Apple Color Emoji",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(ch,x,y);c.restore();}

 /* ---------- gente ---------- */
 // k: shirt, pants, skin, hair, style ('short'|'long'|'bun'|'cap'|'curly'|'bald'), trim, hood, apron
 function person(sx,sy,k,t,o={}){const walking=!!o.walking,face=o.face||1,s=o.scale||1.12;c.save();c.translate(sx,sy);c.scale(s*face,s);
  ellipse(0,0,11,4.5,'rgba(20,12,30,.22)');const sw=walking?Math.sin(t*11):0,bob=walking?Math.abs(Math.sin(t*11))*1.5:Math.sin(t*2.2)*.6;
  c.fillStyle=k.shoes||'#2a2233';c.fillRect(-6+sw*2,-3,5,3);c.fillRect(1-sw*2,-3,5,3);
  c.fillStyle=k.pants||'#2d2a4a';c.fillRect(-6+sw*1.6,-16-bob,5,14);c.fillRect(1-sw*1.6,-16-bob,5,14);
  c.translate(0,-bob);
  rrect(-8.5,-35,17,21,6,k.shirt||'#5e6ad2');if(k.trim){c.fillStyle=k.trim;c.fillRect(-1.5,-35,3,19);}if(k.apron){c.fillStyle=k.apron;c.fillRect(-6,-28,12,14);}
  if(k.hood){c.fillStyle=dk(k.shirt,.15);c.beginPath();c.arc(0,-36,8,Math.PI,0);c.fill();}
  const arm=(side,rot)=>{c.save();c.translate(side*8,-32);c.rotate(side*(.22+sw*.25*side)+rot);c.fillStyle=k.shirt||'#5e6ad2';rrect(-2.5,0,5,14,2.5,k.shirt||'#5e6ad2');c.fillStyle=k.skin||'#edbd97';c.beginPath();c.arc(0,15,2.6,0,Math.PI*2);c.fill();c.restore();};
  arm(-1,o.wave?-2.3+Math.sin(t*10)*.3:0);arm(1,0);
  // cabeça
  c.fillStyle=k.skin||'#edbd97';c.beginPath();c.arc(0,-44,8.2,0,Math.PI*2);c.fill();
  const hair=k.hair||'#3b2a2a',st=k.style||'short';c.fillStyle=hair;
  if(st==='long'){c.beginPath();c.arc(0,-45,9,Math.PI*.95,Math.PI*2.05);c.lineTo(9,-34);c.lineTo(5,-34);c.lineTo(5,-44);c.lineTo(-6,-44);c.lineTo(-7,-34);c.lineTo(-9.5,-34);c.closePath();c.fill();}
  else if(st==='bun'){c.beginPath();c.arc(0,-46,8.6,Math.PI,Math.PI*2);c.fill();c.beginPath();c.arc(-1,-55,4.5,0,Math.PI*2);c.fill();}
  else if(st==='curly'){for(let i=0;i<7;i++){c.beginPath();c.arc(-7+i*2.3,-50+Math.sin(i*1.7)*1.5,3.6,0,Math.PI*2);c.fill();}}
  else if(st==='cap'){c.fillStyle=k.cap||'#e46d6d';c.beginPath();c.arc(0,-46,8.6,Math.PI,Math.PI*2);c.fill();c.fillRect(2,-47,10,2.6);}
  else if(st!=='bald'){c.beginPath();c.arc(0,-45.5,8.6,Math.PI*1.02,Math.PI*1.98);c.lineTo(8,-42);c.lineTo(6,-46);c.lineTo(-6,-46);c.lineTo(-8,-42);c.closePath();c.fill();}
  else{c.fillStyle=lit(k.skin||'#edbd97',.25);c.beginPath();c.arc(-2,-49,3,0,Math.PI*2);c.fill();}
  // rosto (olha para o lado em que anda)
  const blink=(Math.sin(t*.9+(k.seed||0))>.985)?.4:2.1;c.fillStyle='#2a1f2e';rrect(1.2,-45,1.9,blink,1,'#2a1f2e');rrect(5,-45,1.9,blink,1,'#2a1f2e');
  c.fillStyle='rgba(240,120,120,.35)';c.beginPath();c.arc(1.2,-41,1.8,0,Math.PI*2);c.fill();c.beginPath();c.arc(7.2,-41,1.6,0,Math.PI*2);c.fill();
  c.strokeStyle='#7a3a3a';c.lineWidth=.9;c.beginPath();c.arc(4.4,-41.3,1.6,.2,Math.PI-.2);c.stroke();
  c.restore();}
 // retrato grande para o diálogo (desenhado num canvas próprio)
 function portrait(cv2,k,mood){const x=cv2.getContext('2d'),W=cv2.width,H=cv2.height;const prev=c;c=x;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,lit(k.shirt||'#7b5cd6',.7));g.addColorStop(1,lit(k.shirt||'#7b5cd6',.35));x.fillStyle=g;x.fillRect(0,0,W,H);
  x.save();x.translate(W/2-W*.06,H*1.02);x.scale(W/34,W/34);person(0,0,k,mood==='happy'?3.1:0,{scale:1});x.restore();
  if(mood==='happy'){x.font=Math.round(W*.2)+'px "Segoe UI Emoji",sans-serif';x.fillText('♥',W*.72,H*.28);}
  c=prev;}
 // desenho dos prêmios (no tabuleiro 2D da garrinha e na prateleira de casa)
 function prize(x,y,id,r,ctx){const prev=c;if(ctx)c=ctx;const p=PRIZES.find(q=>q.id===id)||PRIZES[0];
  if(id==='chaveiro'){rrect(x-r,y-r,r*2,r*2,r*.35,'#fff7ea','#c47d1f',1.4);for(const [a,b] of [[-.45,-.45],[.45,.45],[0,0],[-.45,.45],[.45,-.45]])circle(x+a*r,y+b*r,r*.14,'#c2453f');circle(x,y-r*1.25,r*.35,null,'#9aa3b5',1.6);}
  else if(id==='gato'){circle(x,y,r,p.col);c.fillStyle=p.col;c.beginPath();c.moveTo(x-r*.9,y-r*.3);c.lineTo(x-r*.75,y-r*1.25);c.lineTo(x-r*.2,y-r*.85);c.fill();c.beginPath();c.moveTo(x+r*.9,y-r*.3);c.lineTo(x+r*.75,y-r*1.25);c.lineTo(x+r*.2,y-r*.85);c.fill();
   circle(x-r*.35,y-r*.1,r*.12,'#fff');circle(x+r*.35,y-r*.1,r*.12,'#fff');circle(x,y+r*.18,r*.1,'#ff9fb2');}
  else if(id==='pato'){ellipse(x,y+r*.25,r*1.05,r*.7,p.col);circle(x+r*.35,y-r*.45,r*.55,p.col);c.fillStyle='#f2a93b';c.beginPath();c.moveTo(x+r*.8,y-r*.5);c.lineTo(x+r*1.3,y-r*.35);c.lineTo(x+r*.8,y-r*.25);c.fill();circle(x+r*.45,y-r*.6,r*.1,'#241d33');}
  else if(id==='fone'){c.strokeStyle='#3a2f63';c.lineWidth=r*.28;c.beginPath();c.arc(x,y,r*.85,Math.PI*1.05,Math.PI*1.95);c.stroke();rrect(x-r*1.05,y-r*.1,r*.55,r*.95,r*.2,p.col);rrect(x+r*.5,y-r*.1,r*.55,r*.95,r*.2,p.col);}
  else if(id==='robo'){rrect(x-r*.8,y-r*.7,r*1.6,r*1.4,r*.3,p.col,'#6b6f7e',1.2);circle(x-r*.35,y-r*.1,r*.2,'#7fe7ff');circle(x+r*.35,y-r*.1,r*.2,'#7fe7ff');c.fillStyle='#6b6f7e';c.fillRect(x-r*.05,y-r*1.2,r*.1,r*.5);circle(x,y-r*1.25,r*.16,'#e46d6d');}
  c=prev;}

 /* ---------- cenas ---------- */
 let R=null,api=null;
 function newScene(id,w,h,name){const S={id,w,h,name,items:[],hots:[],npcs:[],lamps:[],block:new Set(),ground:()=>'#b98a5f',walls:null,decor:null,over:null,indoor:true,warm:false};
  S.solid=(x,y,w2,d)=>{for(let i=Math.floor(x);i<x+w2;i++)for(let j=Math.floor(y);j<y+d;j++)S.block.add(i+','+j);};
  S.put=(x,y,w2,d,draw,solid=true,depth)=>{if(solid)S.solid(x,y,w2,d);S.items.push({d:depth??(x+w2/2+y+d/2),draw});};
  S.box=(x,y,w2,d,h2,col,o={})=>S.put(x,y,w2,d,()=>box(x,y,o.z||0,w2,d,h2,col,o),o.solid!==false);
  S.building=(x,y,w2,d,h2,col,o={})=>{S.solid(x,y,w2,d);for(let i=x;i<x+w2;i++)for(let j=y;j<y+d;j++){const front=j===y+d-1,right=i===x+w2-1;
    S.items.push({d:i+j+1,draw:()=>{box(i,j,0,1,1,h2,col,{stroke:false,top:o.roof||dk(col,.35)});const n=R.light.night,win=n>.35&&((i*7+j*3)%4!==0)?mix('#cfe6f2','#ffd77a',Math.min(1,(n-.35)*2.5)):'#cfe6f2';
     if(front){for(const z of [.55,1.5])if(z+.6<h2&&!(o.door&&o.door.face==='y'&&o.door.at===i&&z<1)){poly(fY(j+1.001,i+.2,i+.8,z,z+.55),win,dk(col,.4));poly(fY(j+1.002,i+.48,i+.52,z,z+.55),dk(col,.3));}}
     if(right){for(const z of [.55,1.5])if(z+.6<h2&&!(o.door&&o.door.face==='x'&&o.door.at===j&&z<1))poly(fX(i+1.001,j+.2,j+.8,z,z+.55),win==='#cfe6f2'?'#bcd7e6':win,dk(col,.4));}
     if(o.door&&o.door.face==='y'&&front&&o.door.at===i){poly(fY(j+1.002,i+.15,i+.85,0,1.25),o.door.col||'#6b4529',dk(col,.5));poly(fY(j+1.003,i+.25,i+.75,.75,1.15),n>.35?'#ffd77a':'#cfe6f2');circle(...P(i+.75,j+1.004,.6),2,'#e2c26a');}
     if(o.awning&&front){const a=o.awning;for(let k=0;k<4;k++)poly([P(i+k/4,j+1,1.35),P(i+(k+1)/4,j+1,1.35),P(i+(k+1)/4,j+1.45,1.05),P(i+k/4,j+1.45,1.05)],k%2?'#fff7ea':a);}
    }});}
   if(o.sign){const [sx,sy]=P(x+w2/2,y+d,h2+.18);S.items.push({d:x+w2+y+d+.5,draw:()=>{if(R.light.night>.4&&o.neon)glow(sx,sy,46,o.neon,.5);label(sx,sy,o.sign,{bg:o.signBg||'#fff7ea',size:12});}});}};
  S.hot=h=>{S.hots.push(h);return h;};
  S.free=(x,y)=>x>=0&&y>=0&&x<S.w&&y<S.h&&!S.block.has(x+','+y);
  return S;}
 function interiorWalls(S,col,trim,o={}){S.walls=()=>{poly(fY(0,0,S.w,0,2.4),col,dk(col,.3));poly(fX(0,0,S.h,0,2.4),dk(col,.1),dk(col,.3));
  if(o.paper){for(let x=.5;x<S.w;x+=.5)poly(fY(.003,x,x+.06,.12,2.4),o.paper);for(let y=.5;y<S.h;y+=.5)poly(fX(.003,y,y+.06,.12,2.4),dk(o.paper,.08));}
  poly(fY(.004,0,S.w,0,.14),trim);poly(fX(.004,0,S.h,0,.14),dk(trim,.1));poly(fY(.004,0,S.w,2.3,2.4),lit(trim,.3));poly(fX(.004,0,S.h,2.3,2.4),lit(trim,.2));};}
 function windowY(S,x0,x1,z0,z1,curtain){S.wins=(S.wins||[]).concat([{x0,x1,z0,z1}]);return ()=>{const L=R.light;poly(fY(.01,x0-.06,x1+.06,z0-.06,z1+.06),'#f6efe2','#8a6a4a');
   const g=c.createLinearGradient(0,P(x0,0,z1)[1],0,P(x0,0,z0)[1]);g.addColorStop(0,L.sky[0]);g.addColorStop(1,L.sky[1]);poly(fY(.012,x0,x1,z0,z1),g);
   if(L.night>.6){for(let i=0;i<5;i++){const [sx,sy]=P(x0+.2+i*(x1-x0-.4)/4,.013,z1-.15-(i%2)*.2);circle(sx,sy,1,'#fff');}}else{const [sx,sy]=P(x0+(x1-x0)*.7,.013,z1-.3);circle(sx,sy,6,L.night>.3?'#fff1d0':'#ffe9a8');}
   poly(fY(.014,(x0+x1)/2-.03,(x0+x1)/2+.03,z0,z1),'#f6efe2');if(curtain){poly(fY(.016,x0-.15,x0+.25,z0-.15,z1+.1),curtain);poly(fY(.016,x1-.25,x1+.15,z0-.15,z1+.1),curtain);}};}
 function tree(S,x,y,big){S.put(x,y,1,1,()=>{box(x+.42,y+.42,0,.16,.16,.95,'#7a5238',{stroke:false});const [sx,sy]=P(x+.5,y+.5,1.35+(big?.35:0)),r=big?25:19,sway=Math.sin(R.t*1.3+x)*1.2;
  circle(sx-9+sway,sy+6,r*.7,'#3f8f5a');circle(sx+9+sway,sy+4,r*.72,'#4fa868');circle(sx+sway,sy-7,r*.82,'#5fbf74');circle(sx-6+sway,sy-12,r*.32,'#86d696');if(big)circle(sx+10+sway,sy-4,r*.18,'#f2a93b');});}
 function bench(S,x,y,rot){S.put(x,y,1,1,()=>{box(x+.15,y+.3,0,.06,.4,.3,'#4b4f63',{stroke:false});box(x+.79,y+.3,0,.06,.4,.3,'#4b4f63',{stroke:false});box(x+.1,y+.25,.3,.8,.5,.07,'#b47d4c');box(x+.1,y+.2,.37,.8,.08,.38,'#9c6a45');});}
 function lampPost(S,x,y){S.put(x,y,1,1,()=>{box(x+.45,y+.45,0,.1,.1,2.2,'#3a3f52',{stroke:false});const [sx,sy]=P(x+.5,y+.5,2.25);circle(sx,sy,5,R.light.night>.3?'#fff1b8':'#e8e2d6','#3a3f52',1.2);});S.lamps.push({x:x+.5,y:y+.5,z:2.25,r:70,col:'rgba(255,214,140,.55)'});}
 function flowers(S,x,y,w,d){S.put(x,y,w,d,()=>{box(x,y,0,w,d,.18,'#8a6a4a',{top:'#6b8f4a'});let k=0;for(let i=0;i<w*3;i++)for(let j=0;j<d*3;j++){const [sx,sy]=P(x+(i+.5)/3,y+(j+.5)/3,.2);circle(sx,sy-2,2.3,['#ff9fb2','#ffe46b','#ffffff','#c9b6e4'][(k++)%4]);}},true);}

 /* ---------- quem está onde (rotina) ---------- */
 const PEOPLE={
  duda:{name:'Duda',k:{shirt:'#2f9a6a',hair:'#5a3b26',skin:'#b9805a',style:'bun',seed:1},col:'#2f9a6a',at:(m,d)=>m<18*60},
  teo:{name:'Téo',k:{shirt:'#f2a93b',hair:'#3b2a2a',skin:'#d79a72',style:'cap',cap:'#3d6fa8',seed:2},col:'#f2a93b',at:(m,d)=>m>=14*60},
  ro:{name:'Rô',k:{shirt:'#f6efe2',apron:'#c8553d',hair:'#2b2b2b',skin:'#b9805a',style:'curly',seed:3},col:'#c8553d',at:()=>true},
  lia:{name:'Lia',k:{shirt:'#ff9fb2',hair:'#2b2b2b',skin:'#8a5a3a',style:'long',seed:4},col:'#e46d8c',at:m=>m<20*60},
  ze:{name:'Seu Zé',k:{shirt:'#5aa7d0',hair:'#cfcfcf',skin:'#edbd97',style:'bald',seed:5},col:'#3d8bb5',at:m=>m<20*60},
  bene:{name:'Seu Bené',k:{shirt:'#ffffff',apron:'#e46d6d',hair:'#2b2b2b',skin:'#8a5a3a',style:'cap',cap:'#e46d6d',seed:6},col:'#e46d6d',at:m=>m>=11*60&&m<21*60},
  marina:{name:'Marina',k:{shirt:'#ff9fb2',hair:'#a33b2b',skin:'#edbd97',style:'long',seed:7},col:'#e46d8c',at:m=>m<19*60},
  antonio:{name:'Seu Antônio',k:{shirt:'#c9b6e4',hair:'#cfcfcf',skin:'#d79a72',style:'bald',seed:8},col:'#8a74ac',at:m=>m<14*60},
  kaique:{name:'Kaique',k:{shirt:'#4fbf8a',hair:'#2b2b2b',skin:'#8a5a3a',style:'curly',seed:9},col:'#2f9a6a',at:m=>m>=15*60},
  kid1:{name:'',k:{shirt:'#ffd84a',hair:'#2b2b2b',skin:'#d79a72',pants:'#3d6fa8',style:'short',seed:10},at:m=>m<19*60,silent:true},
  kid2:{name:'',k:{shirt:'#e46d6d',hair:'#d9a441',skin:'#f1c9a5',style:'bun',seed:11},at:m=>m<19*60,silent:true},
  freq1:{name:'Frequentador',k:{shirt:'#6c8fd1',hair:'#5a3b26',skin:'#edbd97',style:'short',seed:12},at:m=>m>=18*60},
  freq2:{name:'Frequentadora',k:{shirt:'#b47ad6',hair:'#d9a441',skin:'#d79a72',style:'long',seed:13},at:m=>m>=19*60}};
 function npc(id,x,y,o={}){const p=PEOPLE[id];return {id,name:p.name,k:p.k,x,y,hx:x,hy:y,wander:!!o.wander,planOnly:!!o.plan,sit:o.sit||null,face:o.face||1,path:[],t:Math.random()*5,wait:1+Math.random()*3,emote:null,emoteT:0};}
 const present=n=>{const p=PEOPLE[n.id];if(n.planOnly)return !!(R.plan&&R.plan.who===n.id&&R.plan.place===R.scene.id&&Math.abs(R.min-R.plan.at)<=75);if(R.plan&&R.plan.who===n.id&&Math.abs(R.min-R.plan.at)<=75)return R.plan.place===R.scene.id;return p.at(R.min,R.day);};

 /* ---------- casa ---------- */
 function buildHome(g,L){const S=newScene('home',10,8,'Casa');S.ground=(x,y)=>x<=1&&y>=4?((x+y)%2?'#e9e4da':'#ddd6c8'):((x+y)%2?'#c79a6a':'#bf9163');interiorWalls(S,'#efe2cc','#8a6a4a',{paper:'#e8d8bc'});
  const win=windowY(S,4.2,6.6,1.0,2.0,'#c8553d');
  S.decor=()=>{win();
   // porta do quarto (parede esquerda) e porta de entrada (direita)
   poly(fX(.01,1.2,2.2,0,1.95),'#8a5d3e','#5a3b26');poly(fX(.012,1.32,2.08,1.05,1.8),'#9c6a45');circle(...P(.02,2.05,.95),2.3,'#e2c26a');
   poly(fY(.01,7.6,8.6,0,1.95),'#6b4529','#4a2e1a');poly(fY(.012,7.72,8.48,1.2,1.8),'#cfe6f2');circle(...P(8.45,.02,.95),2.3,'#e2c26a');
   // quadros e relógio
   poly(fY(.01,3.4,4.0,1.3,1.75),'#f2a93b','#8a6a4a');poly(fY(.012,3.47,3.93,1.37,1.68),'#5aa7d0');poly(fX(.01,3.4,4.1,1.4,1.9),'#fff7ea','#8a6a4a');poly(fX(.012,3.5,4.0,1.47,1.82),'#ff9fb2');
   const [cx,cy]=P(.012,6.2,1.7);ellipse(cx,cy,8,9,'#fff7ea');c.strokeStyle='#241d33';c.lineWidth=1.2;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx,cy-6);c.moveTo(cx,cy);const hh=(R.min/60%12)/12*Math.PI*2;c.lineTo(cx+Math.sin(hh)*4,cy-Math.cos(hh)*4);c.stroke();
   // tapete
   poly(fZ(.005,1,4.6,1.4,3.6),L.flags?.homeCozy?'#c8553d':'#7b85a8','#00000022');poly(fZ(.007,1.25,4.35,1.65,3.35),L.flags?.homeCozy?'#e7a46d':'#9aa3c8');
   if(L.flags?.homeCozy){for(let i=0;i<9;i++){const [sx,sy]=P(.5+i*1.05,.02,2.2-Math.sin(i/8*Math.PI)*.15);circle(sx,sy,2.6,['#ffd66b','#ff8f6b','#9be38b','#7fd0ff'][i%4]);}}};
  // TV e rack
  S.box(1,0,2,1,.45,'#5a3b26');S.put(1,0,2,1,()=>{poly(fY(.4,1.15,2.85,.5,1.35),'#1c1b26','#000');poly(fY(.402,1.22,2.78,.56,1.29),R.tvOn?mix('#7fd0ff','#ffd77a',(Math.sin(R.t*3)+1)/2):'#26314a');if(R.tvOn)glow(...P(2,.6,.9),60,'rgba(127,208,255,.35)');},false,2.2);
  S.hot({id:'tv',x:1,y:0,w:2,d:1,h:1.4,label:'TV',stand:[2,1],use:()=>menu('TV',[{t:'📺 Assistir um pouco (+1h)',fn:watchTV},{t:'Deixar pra lá'}])});
  // estante com a coleção da garrinha
  S.box(0,2.6,.7,1.2,1.85,'#9c6a45');S.put(0,2.6,.7,1.2,()=>{for(const z of [.6,1.2])box(.03,2.65,z,.64,1.1,.05,'#b47d4c',{stroke:false});(L.collection||[]).slice(0,8).forEach((id,i)=>{const [sx,sy]=P(.6,2.85+(i%4)*.25,.68+Math.floor(i/4)*.6);prize(sx,sy-6,id,5.5);});
   if(!(L.collection||[]).length){box(.2,2.8,.65,.4,.2,.3,'#5e6ad2',{stroke:false});box(.2,3.05,.65,.4,.15,.25,'#e46d6d',{stroke:false});box(.2,3.3,1.25,.4,.3,.22,'#f2a93b',{stroke:false});}},false,4.2);
  S.hot({id:'shelf',x:0,y:2.6,w:.7,d:1.2,h:1.85,label:'Coleção',stand:[1,2],use:()=>say('Coleção',(L.collection||[]).length?'Prêmios da garrinha: '+[...new Set(L.collection)].map(id=>{const n=L.collection.filter(x=>x===id).length;return PRIZES.find(p=>p.id===id)?.name+(n>1?' ×'+n:'');}).join(', ')+'.':'A prateleira ainda está vazia. A garrinha da galeria está esperando você.')});
  // planta que cresce com os cuidados
  const pl=L.plant||{water:0},stage=Math.min(4,Math.floor((pl.water||0)/2));S.put(6,0,1,1,()=>box(6.25,.25,0,.5,.5,.42,'#e9b7a0',{top:'#7a5238'}),true,1.1);
  S.put(6,0,1,1,()=>{const [sx,sy]=P(6.5,.5,.5),s=.6+stage*.22,sway=Math.sin(R.t*1.1)*.6;for(const [dx,dy,col] of [[-7,-10,'#3f8f5a'],[7,-12,'#4fa868'],[0,-18,'#5fbf74'],[-4,-22,'#4fa868'],[5,-24,'#3f8f5a']]){c.fillStyle=col;c.beginPath();c.ellipse(sx+dx*s+sway,sy+dy*s,5*s,9*s,dx/12,0,Math.PI*2);c.fill();}
   if(stage>=3)circle(sx+4*s,sy-28*s,4,'#ff9fb2');if(stage>=4)circle(sx-6*s,sy-24*s,3.5,'#ffe46b');},false,1.2);
  S.hot({id:'plant',x:6,y:0,w:1,d:1,h:1.2,label:'Planta',stand:[6,1],use:waterPlant});
  // guarda-roupa
  S.box(9,0,1,1,2.1,'#9c6a45');S.put(9,0,1,1,()=>{poly(fY(1.002,9.08,9.48,.1,2.0),'#a8744c','#6b4529');poly(fY(1.002,9.52,9.92,.1,2.0),'#a8744c','#6b4529');circle(...P(9.45,1.003,1),1.8,'#e2c26a');circle(...P(9.55,1.003,1),1.8,'#e2c26a');},false,10.6);
  S.hot({id:'wardrobe',x:9,y:0,w:1,d:1,h:2.1,label:'Guarda-roupa',stand:[9,1],use:wardrobe});
  // sofá voltado para a TV
  S.put(1,3,3,1,()=>{box(1,3.05,0,3,.9,.42,'#5e6ad2',{top:'#7b85e0'});box(1,3.65,.42,3,.3,.62,'#4f5ac0');box(.85,3.05,0,.2,.9,.72,'#4f5ac0');box(3.95,3.05,0,.2,.9,.72,'#4f5ac0');
   for(let i=0;i<3;i++)box(1.1+i*.97,3.15,.42,.85,.5,.12,'#8f97e8',{stroke:false});if(L.flags?.homeCozy){box(2.3,3.3,.54,.5,.3,.3,'#f2a93b',{stroke:false});}});
  S.hot({id:'sofa',x:1,y:3,w:3,d:1,h:.9,label:'Sofá',stand:[2,2],use:()=>menu('Sofá',[{t:'🛋 Cochilar um pouco (+1h)',fn:()=>{advance(60);diary('🛋','Cochilou no sofá.');say('','Você cochila no sofá. Acorda com a marca da almofada no rosto.');}},{t:'Deixar pra lá'}])});
  // mesa de centro com caneca fumegante
  S.put(2,2,1,1,()=>{box(2.1,2.2,0,.8,.6,.32,'#9c6a45');const [sx,sy]=P(2.4,2.5,.36);rrect(sx-3,sy-7,6,7,1.5,'#e46d6d');if(R.coffee>0){for(let i=0;i<3;i++){const tt=(R.t*.8+i/3)%1;c.save();c.globalAlpha=(1-tt)*.5;circle(sx+Math.sin(tt*6+i)*2,sy-9-tt*14,2+tt*2,'#fff');c.restore();}}});
  // cozinha: bancada com fogão, geladeira e cafeteira
  S.box(0,4,1,2,.9,'#e9e6df',{top:'#cfc7b7'});S.put(0,4,1,2,()=>{for(const yy of [4.3,4.75])poly(ellipseZ(.5,yy,.91,.16,.12),'#3a3f52');const [sx,sy]=P(.5,5.5,.92);rrect(sx-4,sy-10,8,10,2,'#2d2a4a');if(R.coffee>0)glow(sx,sy-5,10,'rgba(255,180,90,.6)');},false,5.2);
  S.box(0,6,1,1,2.0,'#f6f7f9',{line:'#9aa3b5'});S.put(0,6,1,1,()=>{poly(fX(1.002,6.1,6.9,1.3,1.32),'#9aa3b5');box(1.0,6.75,1.4,.04,.06,.4,'#9aa3b5',{stroke:false});},false,7.2);
  S.hot({id:'kitchen',x:0,y:4,w:1,d:2,h:1,label:'Cozinha',stand:[1,5],use:()=>menu('Cozinha',[{t:'☕ Passar um café (+15 min)',fn:()=>{R.coffee=240;advance(15);diary('☕','Passou um café.');say('','O cheiro de café toma a casa. Você leva a caneca para a mesinha da sala.');}},{t:'🍳 Fazer um lanche (+30 min)',fn:()=>{advance(30);diary('🍳','Fez um sanduíche caprichado.');say('','Pão na chapa, queijo derretendo. Simples e perfeito.');}},{t:'Agora não'}])});
  // luminária de chão e cantinho do gato
  S.put(5,2,1,1,()=>{box(5.45,2.45,0,.1,.1,1.6,'#3a3f52',{stroke:false});const [sx,sy]=P(5.5,2.5,1.75);c.fillStyle='#f2a93b';c.beginPath();c.moveTo(sx-9,sy+6);c.lineTo(sx+9,sy+6);c.lineTo(sx+5,sy-6);c.lineTo(sx-5,sy-6);c.fill();});S.lamps.push({x:5.5,y:2.5,z:1.6,r:90,col:'rgba(255,190,110,.6)',indoor:true});
  S.put(7,4,1,1,()=>{const [sx,sy]=P(7.5,4.5,.05);ellipse(sx,sy,20,9,'#c8553d');ellipse(sx,sy-2,15,6,'#e7a46d');},false,8.6);
  if(L.flags?.homeCozy){S.box(7,1,1,1,.5,'#b47ad6',{top:'#c9a2e6'});S.box(7,1.75,1,.25,1.0,'#9c66c6',{solid:false});S.put(8,6,1,1,()=>{const [sx,sy]=P(8.5,6.5,.5);box(8.3,6.3,0,.4,.4,.45,'#e9e6df');for(const [dx,dy,col] of [[-6,-8,'#3f8f5a'],[6,-10,'#4fa868'],[0,-16,'#5fbf74']]){c.fillStyle=col;c.beginPath();c.ellipse(sx+dx,sy+dy,6,10,dx/12,0,Math.PI*2);c.fill();}});}
  S.put(8,6,1,1,()=>{box(8.1,6.35,0,.3,.3,.45,'#9c6a45',{stroke:false});box(8.1,6.3,.45,.3,.08,.45,'#9c6a45',{stroke:false});box(8.45,6.45,0,.1,.1,.72,'#5a3b26',{stroke:false});poly(ellipseZ(8.5,6.5,.74,.42,.42),'#c98f5a','#7a5238');const [sx,sy]=P(8.5,6.5,.76);ellipse(sx,sy-2,7,3.5,'#fff7ea');circle(sx-2,sy-4,2.2,'#e46d6d');circle(sx+2,sy-4,2.2,'#ffe46b');});
  S.hot({id:'bedroom',x:0,y:1,w:.2,d:1.2,h:1.95,label:'Porta do quarto',stand:[0,1],use:bedroomDoor});
  S.hot({id:'front',x:7.6,y:0,w:1,d:.2,h:1.95,label:'Sair para a rua',stand:[8,0],use:()=>go('street',{x:3,y:4})});
  S.cat={x:7.5,y:4.5,tx:7.5,ty:4.5,state:'sleep',t:0,face:1};
  S.spawn=g.office?{x:8,y:1}:{x:1,y:1};
  return S;}
 function ellipseZ(x,y,z,rx,ry){const p=[];for(let i=0;i<16;i++){const t=i/16*Math.PI*2;p.push(P(x+Math.cos(t)*rx,y+Math.sin(t)*ry,z));}return p;}

 /* ---------- rua ---------- */
 function buildStreet(g,L){const S=newScene('street',32,22,'Bairro');S.indoor=false;S.spawn={x:3,y:4};
  S.ground=(x,y)=>{if(y===5||y===6)return '#6b6f7e';if(y===20&&x>=8)return '#6b6f7e';if(y===4||y===7||(y===19&&x>=8)||(x===20&&y>7&&y<19))return (x+y)%2?'#c9c3b6':'#d3cdc0';
   if(x>=12&&x<=16&&y>=11&&y<=15)return '#d9895c';if(x>=8&&x<=19&&y>=8&&y<=18)return (x*7+y*3)%5?'#d6c8ab':'#cdbd9d';return (x*3+y*5)%7?'#86b96f':'#7fb069';};
  S.decor=()=>{for(let x=0;x<32;x+=2)poly(fZ(.01,x+.2,x+1.2,5.93,6.07),'#f2e3a6');for(let x=9;x<32;x+=2)poly(fZ(.01,x+.2,x+1.2,20.45,20.55),'#f2e3a6');
   poly(fZ(.012,12,17,13,13.07),'#fff');for(const [a,b,cc,d2] of [[12,17,11,11.06],[12,17,15.94,16],[12,12.06,11,16],[16.94,17,11,16]])poly(fZ(.012,a,b,cc,d2),'#ffffffbb');
   // faixa de pedestres
   for(let i=0;i<5;i++)poly(fZ(.011,9.1+i*.38,9.32+i*.38,5,7),'#f6f7f9');};
  // casas e comércio
  S.building(1,0,5,4,2.3,'#e9b7a0',{door:{face:'y',at:3},sign:'🏠 Sua casa',roof:'#a8604c'});
  S.building(7,0,4,4,2.0,'#b6d4c8',{roof:'#6a8f84'});S.building(12,0,4,4,2.6,'#f2d48f',{roof:'#b89040'});S.building(17,0,4,4,2.2,'#c9b6e4',{roof:'#8a74ac'});S.building(22,0,5,4,2.4,'#f0c4c4',{roof:'#b07a7a'});S.building(28,0,4,4,2.0,'#cfe0f0',{roof:'#7f97ae'});
  S.building(21,8,6,5,2.6,'#8c4a3c',{door:{face:'y',at:23,col:'#3a2418'},sign:'🍺 Bar da Praça',signBg:'#ffe1b0',neon:'rgba(255,170,80,.9)',roof:'#5a2c22',awning:'#c8553d'});
  S.building(21,15,2,3,1.8,'#f2a93b',{sign:'🥖 Padaria',roof:'#a8661c',awning:'#e46d6d'});S.building(23,15,3,3,1.8,'#5aa7d0',{sign:'📰 Banca',roof:'#3a6f8c',awning:'#2f7f7a'});
  S.building(27,13,5,6,2.8,'#d6d0e8',{door:{face:'y',at:29,col:'#7b5cd6'},sign:'🛍 Galeria do Bairro',signBg:'#e9e1fb',neon:'rgba(180,140,255,.9)',roof:'#8f86a8'});
  for(const [x,y,b] of [[8,8,1],[19,8,1],[8,18,1],[19,18,1],[10,10,0],[18,12,0],[9,14,0],[11,17,0],[17,17,0],[1,8,1],[4,12,1],[2,17,1],[29,8,0],[5,15,0],[1,20,0],[14,20,0]])tree(S,x,y,b);
  for(const [x,y] of [[10,12],[10,15],[18,15],[13,9],[15,9]])bench(S,x,y);
  flowers(S,12,10,2,1);flowers(S,15,10,2,1);flowers(S,12,16,2,1);flowers(S,15,16,2,1);
  for(const [x,y] of [[0,7],[6,7],[11,4],[17,4],[23,4],[29,4],[8,11],[19,15],[20,13],[25,19],[13,19]])lampPost(S,x,y);
  // rede da quadra
  S.put(12,13,5,1,()=>{box(11.96,12.96,0,.08,.08,1.15,'#f6efe2',{stroke:false});box(16.96,12.96,0,.08,.08,1.15,'#f6efe2',{stroke:false});poly([P(12,13,.72),P(17,13,.72),P(17,13,1.12),P(12,13,1.12)],'rgba(255,255,255,.28)','#ffffffcc');for(let i=1;i<10;i++)poly(fY(13,12+i*.5,12+i*.5+.02,.72,1.12),'#ffffff88');},false);
  S.solid(12,13,1,1);S.solid(16,13,1,1);
  // mesas do bar na calçada, bicicletas e carrinho de pipoca
  for(const [x,col] of [[22,'#c8553d'],[25,'#2f7f7a']])S.put(x,13,1,1,()=>{box(x+.4,13.4,0,.2,.2,.7,'#4b4f63',{stroke:false});const pts=ellipseZ(x+.5,13.5,.72,.42,.42);poly(pts,'#e9e6df',dk('#e9e6df',.3));box(x+.47,13.47,.72,.06,.06,.9,'#9aa3b5',{stroke:false});poly(ellipseZ(x+.5,13.5,1.6,.75,.75),col,dk(col,.3));});
  S.put(26,14,1,1,()=>{for(const k of [0,1]){const [sx,sy]=P(26.3+k*.35,14.5,0);c.strokeStyle=['#e46d6d','#3d8bf5'][k];c.lineWidth=2;circle(sx-7,sy-7,6,null,c.strokeStyle,2);circle(sx+7,sy-3,6,null,c.strokeStyle,2);c.beginPath();c.moveTo(sx-7,sy-7);c.lineTo(sx,sy-14);c.lineTo(sx+7,sy-3);c.stroke();}});
  S.put(11,9,1,1,()=>{box(11.1,9.2,0,.8,.55,.65,'#e46d6d',{top:'#fff7ea'});box(11.15,9.25,.65,.7,.45,.3,'#fff7ea',{stroke:false});const [sx,sy]=P(11.5,9.45,1.2);for(let i=0;i<6;i++)circle(sx-6+i*2.4,sy-1-(i%2)*2,2.2,'#fff3c4');poly(ellipseZ(11.5,9.5,1.55,.6,.6),'#e46d6d','#9c3b3b');label(...P(11.5,9.5,1.95),'Pipoca',{size:9,bg:'#fff3c4'});});
  // casa: caixa de correio
  S.put(6,3,1,1,()=>{box(6.45,3.45,0,.1,.1,.6,'#6b6f7e',{stroke:false});box(6.3,3.35,.6,.4,.3,.25,'#3d8bf5');},true);
  // portas
  S.hot({id:'home',x:3,y:3,w:1,d:1,h:1.3,label:'Entrar em casa',stand:[3,4],use:()=>go('home',{x:8,y:1})});
  S.hot({id:'bar',x:23,y:12,w:1,d:1,h:1.3,label:'Bar da Praça',stand:[23,13],use:()=>go('bar',{x:1,y:7})});
  S.hot({id:'gallery',x:29,y:18,w:1,d:1,h:1.3,label:'Galeria do Bairro',stand:[29,19],use:()=>{if(R.min>=20*60){say('','A galeria fechou às 20h. Abre amanhã às 10h.');return;}go('gallery',{x:1,y:7});}});
  S.hot({id:'popcorn',x:11,y:9,w:1,d:1,h:1.6,label:'Pipoca · R$ 6',stand:[11,10],use:()=>{if(!present({id:'bene'})){say('','O carrinho está fechado agora.');return;}buyPopcorn();}});
  S.npcs.push(npc('duda',14,16.5,{face:-1}),npc('kid1',13.5,12),npc('kid2',15.5,14.5,{face:-1}),npc('bene',11.5,10.5),npc('marina',6,7.5,{wander:true}),npc('antonio',13.5,9.8,{sit:true}),npc('kaique',17,4.5,{wander:true}),npc('teo',22.5,14.2,{plan:true}));
  S.pigeons=Array.from({length:6},(_,i)=>({x:12+Math.random()*4,y:8.5+Math.random()*1.2,hx:0,hy:0,fly:0,vx:0,vy:0,peck:Math.random()*5}));S.pigeons.forEach(p=>{p.hx=p.x;p.hy=p.y;});
  S.cars=[{x:-3,y:5.5,dir:1,col:'#e46d6d'},{x:34,y:6.4,dir:-1,col:'#3d8bf5'}];
  return S;}

 /* ---------- bar ---------- */
 function buildBar(g,L){const S=newScene('bar',11,9,'Bar da Praça');S.warm=true;S.ground=(x,y)=>(x+y)%2?'#6e4030':'#623828';interiorWalls(S,'#a8653f','#4a2a1c',{paper:'#9c5c38'});
  S.decor=()=>{// porta, prateleira de garrafas, lousa e alvo de dardos
   poly(fX(.01,6.6,7.7,0,1.95),'#3a2418','#1d120c');poly(fX(.012,6.75,7.55,1.15,1.75),'#ffd77a');
   box(1,0,.9,6,.25,.05,'#5a3b26',{stroke:false});box(1,0,1.5,6,.25,.05,'#5a3b26',{stroke:false});
   for(let i=0;i<14;i++){const x=1.15+i*.42,z=i%2?1.55:.95,col=['#2f9a6a','#c8553d','#f2a93b','#5aa7d0','#7a8b3a'][i%5];poly(fY(.08,x,x+.14,z,z+.38),col,dk(col,.4));poly(fY(.081,x+.04,x+.1,z+.38,z+.5),dk(col,.2));}
   poly(fY(.01,7.6,9.4,1.0,1.9),'#2d3a2e','#8a6a4a',2);c.fillStyle='#f6efe2';c.font='700 9px '+FONT;const [mx,my]=P(7.8,.02,1.75);c.save();c.translate(mx,my);c.transform(1,.5,0,1,0,0);c.fillText('CARDÁPIO',4,4);c.fillText('Suco ....... 12',4,16);c.fillText('Refri ........ 8',4,27);c.fillText('Coxinha ... 7',4,38);c.restore();
   const [dx,dy]=P(.012,3.6,1.5);for(const [r,col] of [[13,'#2d2a4a'],[10,'#f6efe2'],[7,'#c8553d'],[4,'#f6efe2'],[1.6,'#c8553d']]){c.save();c.translate(dx,dy);c.scale(.6,1);circle(0,0,r,col);c.restore();}
   glow(...P(3.5,1.4,2.0),110,'rgba(255,170,90,.18)');};
  S.box(1,2,6,1,1.1,'#7a4a30',{top:'#9c6a45'});S.solid(1,0,6,2);
  S.put(1,2,6,1,()=>{for(const x of [2.2,3.2])box(x,2.1,1.1,.1,.1,.35,'#c9ccd6',{stroke:false});const [sx,sy]=P(5.5,2.4,1.12);rrect(sx-4,sy-9,8,9,2,'#f2a93b');},false,9.5);
  for(const x of [2,4,6])S.put(x,3,1,1,()=>{box(x+.45,3.45,0,.1,.1,.7,'#4b4f63',{stroke:false});poly(ellipseZ(x+.5,3.5,.72,.26,.26),'#c8553d','#7a2a1c');});
  // jukebox
  S.box(10,0,1,1,1.65,'#7b5cd6',{top:'#ffcf8a'});S.put(10,0,1,1,()=>{const h=(Math.sin(R.t*2)+1)/2;poly(fY(1.002,10.15,10.85,.9,1.5),mix('#ff9fb8','#ffe46b',h));poly(fY(1.003,10.25,10.75,.25,.75),'#2d2a4a');for(let i=0;i<5;i++)poly(fY(1.004,10.3+i*.09,10.35+i*.09,.3,.7),mix('#9fd8ff','#ff9fb8',(i/5+h)%1));glow(...P(10.5,1,1.2),55,'rgba(255,140,200,.35)');},false,11.6);
  S.hot({id:'jukebox',x:10,y:0,w:1,d:1,h:1.65,label:'Jukebox',stand:[10,1],use:()=>{R.song=(R.song+1)%4;const songs=['um samba antigo','uma bossa nova tranquila','um rock de garagem','um pagode de domingo'];toast('🎵 Tocando '+songs[R.song]+'.');diary('🎵','Escolheu '+songs[R.song]+' na jukebox.');}});
  // mesa de sinuca com bolas e luminária
  S.put(4,5,3,2,()=>{box(4.1,5.1,0,.25,.25,.75,'#5a3b26',{stroke:false});box(6.65,5.1,0,.25,.25,.75,'#5a3b26',{stroke:false});box(4.1,6.65,0,.25,.25,.75,'#5a3b26',{stroke:false});box(6.65,6.65,0,.25,.25,.75,'#5a3b26',{stroke:false});
   box(4,5,.75,3,2,.12,'#6b3d22',{top:'#7a4a2a'});poly(fZ(.875,4.15,6.85,5.15,6.85),'#2f7a4a');for(const [a,b] of [[4.2,5.2],[5.5,5.15],[6.8,5.2],[4.2,6.8],[5.5,6.85],[6.8,6.8]])poly(ellipseZ(a,b,.88,.09,.09),'#120a06');
   [[5.9,5.8,'#ef8a3c'],[6.05,5.95,'#3d6fa8'],[6.05,5.65,'#ef8a3c'],[6.2,5.8,'#3d6fa8'],[4.8,6.1,'#fbfbf5']].forEach(([a,b,col])=>{const [sx,sy]=P(a,b,.9);circle(sx,sy-2,3.2,col);});
   box(5.48,5.98,2.4,.04,.04,1.2,'#2d2a4a',{stroke:false});box(5.4,5.9,2.4,.2,.2,.05,'#2d2a4a',{stroke:false});const [lx,ly]=P(5.5,6,2.35);c.fillStyle='#2f7f7a';c.beginPath();c.moveTo(lx-14,ly+8);c.lineTo(lx+14,ly+8);c.lineTo(lx+7,ly-3);c.lineTo(lx-7,ly-3);c.fill();});
  S.lamps.push({x:5.5,y:6,z:1.6,r:110,col:'rgba(255,220,150,.5)',indoor:true});
  S.hot({id:'pool',x:4,y:5,w:3,d:2,h:.95,label:'Mesa de sinuca',stand:[5,7],use:poolTable});
  // mesinhas com cadeiras
  for(const [x,y] of [[8,4],[8,7],[1,6]])S.put(x,y,1,1,()=>{box(x+.42,y+.42,0,.16,.16,.7,'#4b4f63',{stroke:false});poly(ellipseZ(x+.5,y+.5,.72,.4,.4),'#9c6a45','#5a3b26');const [sx,sy]=P(x+.5,y+.5,.76);rrect(sx-2,sy-6,4,6,1,'#ffe46b');});
  S.lamps.push({x:8.5,y:4.5,z:1.6,r:80,col:'rgba(255,200,130,.45)',indoor:true},{x:2,y:2.6,z:1.8,r:90,col:'rgba(255,200,130,.4)',indoor:true});
  S.npcs.push(npc('ro',3.5,1.3),npc('teo',8.5,5.7,{face:-1}),npc('freq1',7.5,7.5,{face:1}),npc('freq2',9.3,4.5,{face:-1}),npc('duda',2.2,4.2,{plan:true}));
  S.hot({id:'exit',x:0,y:6.6,w:.2,d:1.1,h:1.95,label:'Sair para a rua',stand:[0,7],use:()=>go('street',{x:23,y:13})});
  return S;}

 /* ---------- galeria ---------- */
 function buildGallery(g,L){const S=newScene('gallery',13,9,'Galeria do Bairro');S.ground=(x,y)=>(x+y)%2?'#efebf4':'#e2dcea';interiorWalls(S,'#f7f4fa','#9a92b8',{paper:'#efe9f6'});
  S.decor=()=>{poly(fX(.01,6.6,7.7,0,1.95),'#cfe6f2','#7b5cd6');
   // fachadas internas das lojas
   for(const [x0,x1,col,txt] of [[.8,4.6,'#ff9fb2','LOJA DA LIA'],[5.8,10.4,'#9fd8ff','GADGETS DO ZÉ']]){poly(fY(.01,x0,x1,1.75,2.25),col,dk(col,.3));for(let k=0;k<(x1-x0)*3;k++)poly([P(x0+k/3,.01,1.75),P(x0+(k+1)/3,.01,1.75),P(x0+(k+1)/3,.35,1.55),P(x0+k/3,.35,1.55)],k%2?'#fff':col);
    const [sx,sy]=P((x0+x1)/2,.02,2.05);label(sx,sy,txt,{bg:'#fff',size:10});}
   poly(fX(.01,2,5.2,1.7,2.2),'#b9f08f','#6b8f4a');label(...P(.02,3.6,1.95),'CASA & CIA',{bg:'#fff',size:10});
   // vasos e luzes de vitrine
   glow(...P(2.6,1,1.5),70,'rgba(255,200,230,.25)');glow(...P(8,1,1.5),80,'rgba(160,220,255,.25)');};
  // arara de roupas da Lia
  S.put(1,1,3,1,()=>{box(1.1,1.4,0,.08,.08,1.45,'#9aa3b5',{stroke:false});box(3.82,1.4,0,.08,.08,1.45,'#9aa3b5',{stroke:false});box(1.1,1.4,1.42,2.8,.08,.05,'#9aa3b5',{stroke:false});
   Object.values(OUTFITS).forEach((o,i)=>{const [sx,sy]=P(1.5+i*.65,1.45,1.38);rrect(sx-7,sy,14,18,4,o.shirt);if(o.trim){c.fillStyle=o.trim;c.fillRect(sx-1,sy,2,16);}c.strokeStyle='#6b6f7e';c.beginPath();c.arc(sx,sy-1,3,Math.PI,0);c.stroke();});});
  // manequim
  S.put(4,1,1,1,()=>{const [sx,sy]=P(4.5,1.5);box(4.35,1.35,0,.3,.3,.08,'#9aa3b5');person(sx,sy,{shirt:'#3d6fa8',trim:'#a8c6ea',skin:'#f6efe2',hair:'#f6efe2',style:'bald',pants:'#4b4f63'},0,{face:-1});});
  // balcão de vidro do Zé com gadgets
  S.box(6,1,4,1,.95,'#e9ecef',{top:'#cfeefd'});S.solid(6,0,4,1);
  S.put(6,1,4,1,()=>{const icons=[['fone','#7b5cd6'],['robo','#9aa3b5'],['pato','#ffd84a'],['chaveiro','#f2a93b']];icons.forEach(([id],i)=>{const [sx,sy]=P(6.5+i*.95,1.45,.97);prize(sx,sy-6,id,6);});
   if(R.productShelf){const [sx,sy]=P(8,.5,1.7);glow(sx,sy,40,'rgba(255,220,120,.5)');label(sx,sy,'★ '+R.productShelf,{bg:'#f2a93b',size:10});}},false,9);
  // prateleira Casa & Cia
  S.box(0,2,1,3,1.3,'#d8f0c4',{top:'#eafbe0'});S.put(0,2,1,3,()=>{const [a,b]=P(.5,2.6,1.32);rrect(a-5,b-12,10,12,3,'#f2a93b');const [e,f]=P(.5,3.6,1.32);c.fillStyle='#4fa868';c.beginPath();c.ellipse(e,f-10,6,10,0,0,Math.PI*2);c.fill();const [h,i]=P(.5,4.5,1.32);rrect(h-7,i-6,14,6,3,'#c8553d');},false,4.5);
  // garrinha iluminada
  S.put(11,3,1,1,()=>{box(11,3,0,1,1,.8,'#ff6b9a',{top:'#ff9fb8'});poly(fY(4.001,11.1,11.9,.15,.65),'#d84a7c');poly(fY(4.002,11.65,11.8,.3,.45),'#2d2a4a');
   for(const [a,b,id] of [[11.3,3.4,'pato'],[11.6,3.7,'gato'],[11.4,3.75,'robo'],[11.75,3.3,'fone']]){const [sx,sy]=P(a,b,.85);prize(sx,sy-4,id,5);}
   poly(fY(4,11,12,.8,1.75),'rgba(207,238,253,.45)','#fff');poly(fX(12,3,4,.8,1.75),'rgba(190,225,245,.45)','#fff');box(11,3,1.75,1,1,.25,'#ff6b9a',{top:'#ffe46b'});
   for(let i=0;i<6;i++){const on=Math.floor(R.t*4+i)%2;const [sx,sy]=P(11+i/5,4.001,1.88);circle(sx,sy,2,on?'#fff7a8':'#c84a7c');}
   const [lx,ly]=P(11.5,3.5,1.6);c.strokeStyle='#9aa3b5';c.lineWidth=1.5;c.beginPath();c.moveTo(lx,ly-6);c.lineTo(lx,ly+2);c.stroke();});S.solid(11,3,1,1);
  S.lamps.push({x:11.5,y:3.5,z:1.8,r:70,col:'rgba(255,140,190,.45)',indoor:true});
  // banco central com vasos
  S.box(5,5,2,1,.38,'#b9a8f2',{top:'#d9ccff'});for(const x of [4,7])S.put(x,5,1,1,()=>{box(x+.25,5.25,0,.5,.5,.45,'#e9e6df');const [sx,sy]=P(x+.5,5.5,.5);for(const [dx,dy,col] of [[-5,-8,'#3f8f5a'],[5,-9,'#4fa868'],[0,-14,'#5fbf74']]){c.fillStyle=col;c.beginPath();c.ellipse(sx+dx,sy+dy,5,9,dx/12,0,Math.PI*2);c.fill();}});
  S.npcs.push(npc('lia',2.5,2.2),npc('ze',8,.55),npc('marina',9.5,6.5,{wander:true}));
  S.hot({id:'claw',x:11,y:3,w:1,d:1,h:2,label:'Garrinha · R$ 5',stand:[10,3],use:clawStart});
  S.hot({id:'home',x:0,y:2,w:1,d:3,h:1.3,label:'Casa & Cia',stand:[1,3],use:homeShop});
  S.hot({id:'exit',x:0,y:6.6,w:.2,d:1.1,h:1.95,label:'Sair para a rua',stand:[0,7],use:()=>go('street',{x:29,y:19})});
  return S;}
 const BUILD={home:buildHome,street:buildStreet,bar:buildBar,gallery:buildGallery};

 /* ---------- estado e gravação ---------- */
 let root=null,cv=null,raf=0,last=0;
 const life=()=>api.get().life||{outfit:'basic',owned:['basic'],collection:[],friends:{},flags:{}};
 function save(extra={},spend=0){const outing={week:R.week,day:R.day,min:Math.round(R.min),scene:R.scene.id,x:Math.floor(R.p.x),y:Math.floor(R.p.y),plan:R.plan||null,log:R.log.slice(-30),dayLog:R.dayLog};try{api.act({type:'life',spend,patch:{outing,...extra}});return true;}catch(e){toast(e.message);return false;}}
 function spend(v,patch={}){if(api.get().cash<v){toast('Dinheiro insuficiente.');return false;}if(save(patch,v)){R.spentToday=(R.spentToday||0)+v;hud();return true;}return false;}
 function advance(m){const before=R.min;R.min=Math.min(LIMIT,R.min+m);storeTick(R.min-before);}
 function diary(icon,text){R.dayLog.push({icon,text});}
 function go(id,at){if(R.scene.id==='street'&&id!=='street')R.lastStreet={x:R.p.x,y:R.p.y};R.scene=BUILD[id](api.get(),life());const sp=at||R.scene.spawn;R.p={x:sp.x+.5,y:sp.y+.5,path:[],face:1};R.fade=1;R.particles=[];advance(2);save();hud();Amb.scene(id);
  if(!R.seen[id]){R.seen[id]=1;const first={street:'Primeira volta no bairro.',bar:'Conheceu o Bar da Praça.',gallery:'Conheceu a Galeria do Bairro.'}[id];if(first)diary('📍',first);}}
 function pal(){const o=OUTFITS[life().outfit]||OUTFITS.basic;return {shirt:o.shirt,trim:o.trim,hood:o.hood,hair:'#3b2a2a',skin:'#edbd97',pants:'#2d2a4a',style:'short',seed:0};}
 const friend=id=>(life().friends||{})[id]||0;

 /* ---------- loja online durante o fim de semana ---------- */
 function storeTick(townMin){const g=api.get();if(g.phase!=='selling'||!(townMin>0))return;R.simAcc=(R.simAcc||0)+townMin*120/(DAYLEN*2);const n=Math.floor(R.simAcc);if(n<1)return;R.simAcc-=n;
  const sold0=g.sold,cash0=g.cash;let next;try{next=api.act({type:'weekendSales',minutes:n});}catch(e){return;}const units=next.sold-sold0,cash=next.cash-cash0;
  if(units>0){R.sales.units+=units;R.sales.cash+=cash;R.daySales.units+=units;R.daySales.cash+=cash;R.phoneBadge=true;toast('📦 Loja online: '+units+' venda'+(units>1?'s':'')+' · +'+money(cash));Amb.coin();hud();}}

 /* ---------- caminho (A*) ---------- */
 function route(S,from,to){const key=(x,y)=>x+','+y,sx=Math.floor(from.x),sy=Math.floor(from.y),tx=to[0],ty=to[1];if(!S.free(tx,ty))return null;
  const open=[[sx,sy]],gs={},fs={},came={};gs[key(sx,sy)]=0;const h=(x,y)=>Math.hypot(x-tx,y-ty);fs[key(sx,sy)]=h(sx,sy);const seen=new Set();
  while(open.length){let bi=0;for(let i=1;i<open.length;i++)if(fs[key(...open[i])]<fs[key(...open[bi])])bi=i;const cur=open.splice(bi,1)[0],ck=key(...cur);
   if(cur[0]===tx&&cur[1]===ty){const out=[];let k=ck;while(k){const [x,y]=k.split(',').map(Number);out.unshift({x:x+.5,y:y+.5});k=came[k];}return out.slice(1);}
   seen.add(ck);if(seen.size>3000)return null;
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=cur[0]+dx,ny=cur[1]+dy,nk=key(nx,ny);if(!S.free(nx,ny)||seen.has(nk))continue;if(dx&&dy&&(!S.free(cur[0]+dx,cur[1])||!S.free(cur[0],cur[1]+dy)))continue;
    const ng=gs[ck]+(dx&&dy?1.414:1);if(gs[nk]===undefined||ng<gs[nk]){gs[nk]=ng;fs[nk]=ng+h(nx,ny);came[nk]=ck;if(!open.some(o=>o[0]===nx&&o[1]===ny))open.push([nx,ny]);}}}
  return null;}
 function walkTo(cell,then){const p=route(R.scene,R.p,cell);if(!p){toast('Não dá pra chegar ali.');return;}R.p.path=p;R.pending=then||null;}

 /* ---------- som ambiente gerado na hora ---------- */
 const Amb=(()=>{let ctx=null,master=null,noise=null,bed=null,bedGain=null,timer=0,where='home';
  const on=()=>{try{return JSON.parse(localStorage.getItem('the-founder-audio')||'{}').sfx!==false;}catch(e){return true;}};
  function init(){if(ctx||!on())return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.5;master.connect(ctx.destination);
   const len=ctx.sampleRate*2,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);let b=0;for(let i=0;i<len;i++){b=(b+.02*(Math.random()*2-1))/1.02;d[i]=b*3.5;}noise=buf;}catch(e){ctx=null;}}
  function startBed(){if(!ctx)return;stopBed();const src=ctx.createBufferSource();src.buffer=noise;src.loop=true;const f=ctx.createBiquadFilter();f.type=where==='bar'?'bandpass':'lowpass';f.frequency.value=where==='bar'?420:where==='street'?900:300;f.Q.value=where==='bar'?.8:.3;
   bedGain=ctx.createGain();bedGain.gain.value=where==='bar'?.22:where==='street'?.08:where==='gallery'?.05:.03;src.connect(f).connect(bedGain).connect(master);src.start();bed=src;}
  function stopBed(){try{bed&&bed.stop();}catch(e){}bed=null;}
  function chirp(){const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';const f0=2400+Math.random()*1600;o.frequency.setValueAtTime(f0,t);for(let i=0;i<3;i++){o.frequency.linearRampToValueAtTime(f0*(1.25-i*.05),t+.04+i*.09);o.frequency.linearRampToValueAtTime(f0,t+.08+i*.09);}
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.02);g.gain.linearRampToValueAtTime(0,t+.32);o.connect(g).connect(master);o.start(t);o.stop(t+.35);}
  function cricket(){const t=ctx.currentTime;for(let i=0;i<4;i++){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=4400;g.gain.setValueAtTime(0,t+i*.06);g.gain.linearRampToValueAtTime(.025,t+i*.06+.01);g.gain.linearRampToValueAtTime(0,t+i*.06+.04);o.connect(g).connect(master);o.start(t+i*.06);o.stop(t+i*.06+.05);}}
  function clack(){const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=1800;g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);o.connect(g).connect(master);o.start(t);o.stop(t+.07);}
  function tone(f,d,v=.05,type='sine',delay=0){if(!ctx)return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(master);o.start(t);o.stop(t+d+.02);}
  return {start(){init();if(ctx&&ctx.state==='suspended')ctx.resume();startBed();},stop(){stopBed();},scene(w){where=w;if(ctx)startBed();},
   tick(dt,night){if(!ctx||!on())return;timer-=dt;if(timer>0)return;timer=1.2+Math.random()*2.6;if(where==='street'){if(night>.6)cricket();else if(Math.random()<.7)chirp();}else if(where==='bar'&&Math.random()<.35)clack();else if(where==='home'&&Math.random()<.15&&R.tvOn)tone(300+Math.random()*200,.2,.02);},
   coin(){tone(988,.12,.05,'square');tone(1319,.25,.05,'square',.09);},purr(){if(!ctx)return;for(let i=0;i<6;i++)tone(48+Math.random()*6,.18,.08,'sawtooth',i*.2);},step(){if(!ctx)return;tone(180+Math.random()*60,.05,.012,'triangle');},
   pop(){tone(660,.08,.05);tone(880,.12,.05,'sine',.07);},heart(){tone(784,.1,.05);tone(1047,.2,.05,'sine',.1);}};})();

 /* ---------- interface ---------- */
 function ensureDom(){if(root)return;root=document.createElement('div');root.id='town';root.hidden=true;
  root.innerHTML='<canvas id="town-cv"></canvas><div class="tw-hud"><div class="tw-time"><i id="tw-sun"></i><b id="tw-day"></b><span id="tw-clock"></span></div><div class="tw-where" id="tw-where"></div><div class="tw-cash" id="tw-cash"></div><span class="tw-sp"></span><button id="tw-phone" class="tw-btn">📱 Celular<i id="tw-badge" hidden></i></button><button id="tw-home" class="tw-btn tw-btn2">🏠 Voltar para casa</button></div><div id="tw-dialog" hidden></div><div id="tw-toast"></div><div id="tw-phone-ui" hidden></div><div id="tw-diary" hidden></div><div id="tw-mini" hidden><div class="tw-mini-box"><div class="tw-mini-head"><b id="tw-mini-title"></b><span id="tw-mini-score"></span></div><canvas id="tw-mini-cv" width="760" height="420"></canvas><p id="tw-mini-help"></p><div id="tw-mini-actions"></div></div></div>';
  document.body.appendChild(root);cv=document.getElementById('town-cv');
  cv.addEventListener('pointerdown',onClick);cv.addEventListener('pointermove',e=>{if(!R)return;const h=pick(e);R.hover=h;cv.style.cursor=h?'pointer':'';});
  document.getElementById('tw-phone').onclick=()=>{if(!busy())openPhone();};
  document.getElementById('tw-home').onclick=()=>{if(busy())return;if(R.scene.id==='home'){toast('Você já está em casa.');return;}advance(30);go('home',{x:8,y:1});toast('Você volta para casa (+30 min).');};}
 const busy=()=>!R||R.dialog||R.mini||R.phone||R.diaryOpen;
 function hud(){if(!R)return;const g=api.get(),L=R.light||light(R.min);document.getElementById('tw-day').textContent=R.day==='sat'?'Sábado':'Domingo';document.getElementById('tw-clock').textContent=hhmm(R.min);
  document.getElementById('tw-sun').textContent=R.min<17*60?'☀️':R.min<19*60?'🌇':'🌙';document.getElementById('tw-where').textContent=R.scene.name;document.getElementById('tw-cash').textContent=money(g.cash);
  document.getElementById('tw-home').hidden=R.scene.id==='home';document.getElementById('tw-badge').hidden=!R.phoneBadge;}
 let toastT=0;function toast(t){const el=document.getElementById('tw-toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2800);}
 // diálogo com retrato, corações e texto que vai aparecendo
 let typeT=0;
 function dialog(who,text,opts,o={}){R.dialog=true;const el=document.getElementById('tw-dialog');el.hidden=false;const p=who&&PEOPLE[who],name=o.name||(p?p.name:who)||'',hearts=p&&!PEOPLE[who].silent&&who!=='mom'?friend(who):null;
  el.innerHTML='<div class="tw-say'+(p||o.k?' has-pic':'')+'">'+(p||o.k?'<canvas class="tw-pic" width="180" height="180"></canvas>':'')+'<div class="tw-body">'+(name?'<b class="tw-name" style="background:'+(o.col||p?.col||'#7b5cd6')+'">'+esc(name)+'</b>':'')+(hearts!==null?'<span class="tw-hearts">'+[0,1,2,3,4].map(i=>'<i class="'+(i<Math.min(5,hearts)?'on':'')+'">♥</i>').join('')+'</span>':'')+
   '<p class="tw-text"></p><div class="tw-opts">'+opts.map((op,i)=>'<button data-i="'+i+'" '+(op.disabled?'disabled':'')+'>'+esc(op.t)+'</button>').join('')+'</div></div></div>';
  if(p||o.k)portrait(el.querySelector('.tw-pic'),o.k||p.k,o.mood);
  const tx=el.querySelector('.tw-text'),full=text;let i=0;clearInterval(typeT);tx.innerHTML='';const optsEl=el.querySelector('.tw-opts');optsEl.style.visibility=full?'hidden':'visible';
  const done=()=>{clearInterval(typeT);tx.innerHTML=full;optsEl.style.visibility='visible';};
  if(full){typeT=setInterval(()=>{i+=2;tx.innerHTML=esc(full.replace(/<[^>]+>/g,'').slice(0,i));if(i%6===0)Amb.step();if(i>=full.replace(/<[^>]+>/g,'').length)done();},22);el.querySelector('.tw-say').onclick=e=>{if(e.target.tagName!=='BUTTON')done();};}
  el.querySelectorAll('.tw-opts button').forEach(b=>b.onclick=ev=>{ev.stopPropagation();const op=opts[+b.dataset.i];clearInterval(typeT);el.hidden=true;R.dialog=false;hud();op.fn&&op.fn();});}
 const say=(who,text,next,o)=>dialog(who,esc(text),[{t:'Ok',fn:next}],o);
 const menu=(who,opts,text='',o)=>dialog(who,text,opts,o);
 function emote(n,ch){n.emote=ch;n.emoteT=2.2;}

 /* ---------- conversas ---------- */
 const LINES={
  duda:['Ei! Nunca te vi por aqui. Sou a Duda, jogo vôlei aqui quase todo fim de semana. Bora uma partida qualquer hora?','Voltou! Sabia que essa quadra foi pintada pelos moradores? Ficou torta, mas é nossa.','Você tem cara de quem trabalha demais. Aqui a regra é uma só: celular no banco durante o jogo.','Tô pensando em montar um torneio do bairro. Topa ajudar na organização? Brincadeira... ou não.','Sabe que eu gosto desses sábados com você por aqui? O bairro fica mais animado.'],
  teo:['E aí! Téo. Venho aqui pela sinuca, fico pela coxinha. Joga?','Dizem que a mesa é torta pro lado da janela. Eu digo que é desculpa de quem perde.','Faço entrega de bike. Vejo muita caixa de eletrônico passando por aí. Uma hora vejo a sua.','Já é freguês da casa. O Rô até guarda o taco bom pra você.','Se um dia sua empresa precisar de entregador de confiança, já sabe quem chamar.'],
  ro:['Bem-vindo ao Bar da Praça! Aqui o suco é de verdade e a música é baixa. Senta aí.','Sábado à noite enche. Domingo é mais família.','Se precisar de um canto pra pensar, a mesa do fundo é a mais quieta.','O segredo da coxinha? Paciência. Que nem negócio, imagino.'],
  lia:['Oi! Loja da Lia: roupa boa e sem frescura. Dá uma olhada.','Essa jaqueta jeans é a que mais sai. Combina com quem anda muito.','Se trouxer amigo, faço desconto. Mentira, mas faço um café.','Comecei vendendo camiseta na feira. Hoje tenho loja. Devagar a gente chega.'],
  ze:['Gadgets do Zé! Conserto, vendo e troco ideia.','Fone bom é aquele que a gente esquece que tá usando.','Se um dia fizer um produto bom, traz que eu boto na vitrine.','Cliente volta por dois motivos: o produto não quebra e alguém lembrou o nome dele.'],
  bene:['Pipoca quentinha! Doce ou salgada? Tô nessa praça faz vinte anos.','Já vi muita criança dessa praça virar gente grande. Você tem cara de quem vai longe.'],
  marina:['Oi, vizinho! Mudou faz pouco? Seja bem-vindo.','Domingo de manhã tem feirinha aqui perto. A pastelaria é imperdível.'],
  antonio:['Bom dia! Esses pombos já me conhecem. Trago milho toda manhã.','No meu tempo a praça era só terra. Hoje tem até quadra. O bairro cresce junto com a gente.'],
  kaique:['E aí! Tô treinando um flip novo no skate. Ainda não sai, mas sai.','À noite a praça fica bonita com as luzinhas, né?'],
  freq1:['Esse bar tem o melhor clima da cidade. Não conta pra ninguém.'],freq2:['A jukebox só tem música boa. O Rô escolhe a dedo.']};
 function talk(n){const day=R.week+R.day,k=friend(n.id),lines=LINES[n.id]||['Oi!'],today=R.talked[n.id]===day;let text=lines[Math.min(k,lines.length-1)];
  if(n.id==='ze'&&R.productShelf)text+=' E olha: o '+R.productShelf+' tá aqui na vitrine. Os clientes perguntam por ele!';
  if(n.id==='marina'||n.id==='antonio'||n.id==='kaique'||n.id.startsWith('freq'))text=lines[Math.floor(Math.random()*lines.length)];
  R.talked[n.id]=day;const main=['duda','teo','ro','lia','ze','bene'].includes(n.id);
  if(!today&&main){advance(15);save({friends:{[n.id]:k+1}});emote(n,'♥');Amb.heart();diary('💬',k?'Conversou com '+PEOPLE[n.id].name+'.':'Conheceu '+PEOPLE[n.id].name+'.');}else{advance(5);emote(n,'♪');}
  say(n.id,text,null,{mood:!today&&main?'happy':null});}
 function useNpc(n){const p=PEOPLE[n.id];if(p.silent){emote(n,'🏐');toast('Eles estão no meio de uma partida.');return;}
  n.face=R.p.x-R.p.y<n.x-n.y?-1:1;const opts=[{t:'💬 Conversar',fn:()=>talk(n)}],planHere=R.plan&&R.plan.who===n.id&&R.plan.place===R.scene.id;
  if(planHere){opts.unshift({t:'⭐ '+(R.plan.game==='volley'?'Jogar o vôlei combinado':R.plan.game==='pool'?'Jogar a sinuca combinada':'Curtir o programa combinado'),fn:()=>keepPlan(n)});}
  if(n.id==='duda')opts.push({t:'🏐 Jogar vôlei (≈45 min)',fn:()=>volley('Duda')});
  if(n.id==='teo')opts.push({t:'🎱 Jogar sinuca (≈40 min)',fn:()=>pool('Téo')});
  if(n.id==='ro')opts.push({t:'🧃 Pedir um suco · R$ 12',fn:()=>order(12,'Suco de maracujá bem gelado. Faz bem pra cabeça.','Tomou um suco de maracujá no bar.')},{t:'🥤 Pedir um refri · R$ 8',fn:()=>order(8,'Aqui está. Dizem que combina com sinuca.','Tomou um refri no bar.')},{t:'🍗 Pedir uma coxinha · R$ 7',fn:()=>order(7,'Saindo do óleo! Cuidado que tá quente.','Comeu a coxinha famosa do Rô.')});
  if(n.id==='lia')opts.push({t:'👕 Ver roupas',fn:clothes});
  if(n.id==='ze')opts.push({t:'🥤 Comprar refrigerante · R$ 7',fn:()=>{if(spend(7)){advance(5);toast('Refri gelado na mão.');}}});
  if(n.id==='bene')opts.push({t:'🍿 Comprar pipoca · R$ 6',fn:buyPopcorn});
  opts.push({t:'Tchau'});const greet=planHere?'Chegou! Bora?':friend(n.id)>=3?'Opa! Que bom te ver de novo.':'';menu(n.id,opts,esc(greet));}
 function order(v,line,log){if(spend(v)){advance(20);diary('🍽',log);say('ro',line);}}
 function buyPopcorn(){if(spend(6)){advance(10);diary('🍿','Comeu pipoca na praça.');say('bene','Pipoca doce, do jeito que a vovó fazia. Senta num banco e aproveita a tarde!');}}
 function clothes(){const L=life(),opts=Object.entries(OUTFITS).filter(([id])=>id!=='basic').map(([id,o])=>{const own=(L.owned||[]).includes(id);return {t:(own?'✓ Já é sua · ':'')+o.name+(own?'':' · '+money(o.price)),disabled:own,fn:()=>dialog('lia','Levar <b>'+esc(o.name)+'</b> por '+money(o.price)+'?',[{t:'Comprar e vestir',fn:()=>{if(spend(o.price,{owned:[...(life().owned||['basic']),id],outfit:id})){advance(15);diary('🛍','Comprou '+o.name+'.');say('lia','Ficou ótimo em você! Volta sempre.',null,{mood:'happy'});}}},{t:'Agora não'}])};});
  opts.push({t:'Só olhando'});menu('lia',opts,'Olha o que chegou essa semana:');}
 function wardrobe(){const L=life();menu('',[...(L.owned||['basic']).map(id=>({t:(L.outfit===id?'✓ ':'')+OUTFITS[id].name,fn:()=>{save({outfit:id});advance(5);toast('Você trocou de roupa.');}})),{t:'Fechar'}],'Guarda-roupa',{name:'Guarda-roupa'});}
 function homeShop(){const L=life();if(L.flags?.homeCozy){say('','Sua sala já está com o kit aconchegante. Volte quando chegarem novidades!',null,{name:'Casa & Cia'});return;}
  dialog('','<b>Kit sala aconchegante</b>: tapete novo, poltrona, almofada, planta e varal de luzinhas, entregue e montado hoje. '+money(450)+'.',[{t:'Comprar o kit',fn:()=>{if(spend(450,{flags:{homeCozy:true}})){advance(15);diary('🏡','Comprou o kit sala aconchegante.');say('','Já mandamos pra sua casa. Vai lá ver!',null,{name:'Casa & Cia'});}}},{t:'Agora não'}],{name:'Casa & Cia',col:'#4fa868'});}
 const TV=['Passa um documentário sobre polvos. Você aprende que eles têm três corações.','Reprise de novela. Você já sabe o final e assiste mesmo assim.','Um programa de culinária. Dá fome.','Jogo de vôlei na TV. A Duda ia gostar.','Um desenho animado antigo. Você ri sozinho na sala.'];
 function watchTV(){R.tvOn=true;advance(60);diary('📺','Viu TV na sala.');save();say('',TV[Math.floor(Math.random()*TV.length)],()=>{R.tvOn=false;},{name:'TV'});}
 function waterPlant(){const L=life(),pl=L.plant||{water:0,last:''},key=R.week+R.day;if(pl.last===key){say('','A terra ainda está úmida. Amanhã ela agradece de novo.',null,{name:'Planta'});return;}
  const water=(pl.water||0)+1,stage=Math.floor(water/2),grew=stage>Math.floor((pl.water||0)/2);save({plant:{water,last:key}});advance(5);diary('🪴',grew?'Regou a planta. Ela cresceu!':'Regou a planta.');
  R.scene=BUILD.home(api.get(),life());R.scene.cat=R.cat||R.scene.cat;say('',grew?'Você rega a planta e repara: tem folha nova! Ela está crescendo.':'Você rega a planta. As folhas parecem mais felizes.',null,{name:'Planta'});}
 function petCat(){const c2=R.scene.cat;c2.state='happy';c2.t=0;Amb.purr();advance(5);R.petted=(R.petted||0)+1;if(R.petted===1)diary('🐈','Fez carinho no Biscoito.');R.particles.push(...[0,1,2].map(i=>({kind:'heart',x:c2.x,y:c2.y,z:.6,vz:.6+i*.15,life:1.6,dx:(i-1)*.15})));toast(['Biscoito ronrona alto.','Biscoito se espreguiça e pede mais.','Biscoito te olha com os olhos meio fechados.'][R.petted%3]);}
 function bedroomDoor(){if(R.day==='sat')menu('',[{t:'😴 Dormir (vai para domingo)',fn:()=>sleep(false)},{t:'💼 Dormir e trabalhar no domingo (+1 foco)',fn:()=>sleep(true)},{t:'Ainda não'}],'Hora de descansar?',{name:'Porta do quarto'});
  else menu('',[{t:'😴 Dormir (encerra o fim de semana)',fn:()=>sleep(false)},{t:'Ainda não'}],'Amanhã a semana recomeça.',{name:'Porta do quarto'});}

 /* ---------- celular: contatos, convites e loja online ---------- */
 function contacts(){const F=life().friends||{};return [{id:'mom',name:'Mãe',col:'#e46d8c'},...['duda','teo','lia','ze','ro'].filter(id=>(F[id]||0)>=1).map(id=>({id,name:PEOPLE[id].name,col:PEOPLE[id].col}))];}
 function openPhone(tab='contatos'){R.phone=true;R.phoneBadge=false;hud();const el=document.getElementById('tw-phone-ui'),g=api.get(),F=life().friends||{};el.hidden=false;
  let body='';
  if(tab==='contatos')body=contacts().map(cn=>'<button class="ph-row" data-c="'+cn.id+'"><span class="ph-av" style="background:'+cn.col+'">'+esc(cn.name[0])+'</span><span><b>'+esc(cn.name)+'</b><small>'+(cn.id==='mom'?'Família':'♥'.repeat(Math.min(5,F[cn.id]||0)))+'</small></span><em>'+(cn.id==='mom'?'Ligar':'Convidar')+'</em></button>').join('')+(contacts().length===1?'<p class="ph-empty">Converse com as pessoas do bairro para salvar o número delas.</p>':'')+(R.plan?'<div class="ph-plan">📅 Combinado: <b>'+esc(PEOPLE[R.plan.who].name)+'</b> · '+esc(R.plan.label)+' às '+hhmm(R.plan.at)+'</div>':'');
  else{const ws=g.weekly?.weekendSales,units=ws&&ws.week===R.week?ws.units:0,rev=ws&&ws.week===R.week?ws.revenue:0;
   body='<div class="ph-shop"><small>LOJA ONLINE · '+esc(g.name||'sua empresa')+'</small><b>'+units+' venda'+(units===1?'':'s')+'</b><span>neste fim de semana · '+money(rev)+'</span><div class="ph-bars">'+[R.daySales.units,R.sales.units].map((v,i)=>'<i style="height:'+Math.min(100,v*8+6)+'%"><em>'+(i?'fim de semana':'hoje')+'</em></i>').join('')+'</div>'+(g.phase==='selling'?'<p>A loja continua aberta enquanto você passeia. Estoque: '+(g.stock||0)+' un.</p>':'<p>Nada à venda no momento. As vendas voltam quando houver um produto na loja.</p>')+'</div>';}
  el.innerHTML='<div class="ph"><div class="ph-top"><span>'+hhmm(R.min)+'</span><span>📶 🔋</span></div><div class="ph-tabs"><button data-tab="contatos" class="'+(tab==='contatos'?'on':'')+'">👥 Contatos</button><button data-tab="loja" class="'+(tab==='loja'?'on':'')+'">📦 Loja</button></div><div class="ph-body">'+body+'</div><button class="ph-close">Guardar o celular</button></div>';
  el.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>openPhone(b.dataset.tab));el.querySelector('.ph-close').onclick=closePhone;
  el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const id=b.dataset.c;closePhone();if(id==='mom')callMom();else invite(id);});}
 function closePhone(){R.phone=false;document.getElementById('tw-phone-ui').hidden=true;hud();}
 const INVITES={duda:[{game:'volley',place:'street',label:'vôlei na praça',until:18*60},{game:'hang',place:'bar',label:'um suco no bar',from:18*60}],teo:[{game:'pool',place:'bar',label:'sinuca no bar',from:14*60},{game:'hang',place:'street',label:'pipoca na praça',from:14*60,until:21*60}],
  lia:[{game:'hang',place:'street',label:'pipoca na praça',until:20*60}],ze:[{game:'hang',place:'bar',label:'um café no bar',until:20*60}],ro:[{game:'hang',place:'bar',label:'uma prosa no balcão'}]};
 function invite(id){if(R.plan){say('','Você já combinou '+R.plan.label+' com '+PEOPLE[R.plan.who].name+' às '+hhmm(R.plan.at)+'.',null,{name:'Celular'});return;}
  const slots=[];for(const o of INVITES[id]||[])for(const at of [Math.ceil((R.min+60)/30)*30,Math.ceil((R.min+120)/30)*30])if(at<=22*60&&(!o.from||at>=o.from)&&(!o.until||at<=o.until))slots.push({...o,at});
  if(!slots.length){say(id,'Hoje já não dá mais, foi mal! Me chama amanhã?');advance(5);return;}
  menu(id,[...slots.slice(0,4).map(s=>({t:'📅 '+s.label[0].toUpperCase()+s.label.slice(1)+' às '+hhmm(s.at),fn:()=>{R.plan={who:id,...s};save();advance(5);Amb.pop();say(id,'Fechado! Te encontro '+(s.place==='bar'?'no bar':'na praça')+' às '+hhmm(s.at)+'.',null,{mood:'happy'});}})),{t:'Deixa pra outra hora'}],'Oi! O que você tá pensando?');}
 function keepPlan(n){const pl=R.plan;R.plan=null;const k=friend(n.id);save({friends:{[n.id]:k+2}});diary('⭐','Cumpriu o combinado: '+pl.label+' com '+PEOPLE[n.id].name+'.');emote(n,'♥');Amb.heart();
  if(pl.game==='volley')volley(PEOPLE[n.id].name);else if(pl.game==='pool')pool(PEOPLE[n.id].name);else{advance(45);say(n.id,{duda:'Ah, que delícia esse fim de tarde. Valeu por ter vindo, viu? A gente devia fazer isso mais vezes.',teo:'Pipoca e praça. Programa de rico, só que barato. Valeu, parceiro!',lia:'Obrigada pelo convite! Faz tempo que eu não parava pra ver o movimento.',ze:'Bom papo, café honesto. Assim que se faz amizade.',ro:'Do lado de cá do balcão a conversa é outra, né? Volta sempre.'}[n.id]||'Valeu!',null,{mood:'happy'});}}
 function checkPlan(){if(!R.plan)return;if(R.min>R.plan.at+75){const pl=R.plan;R.plan=null;const k=friend(pl.who);save({friends:{[pl.who]:Math.max(0,k-1)},flags:{['stood_'+pl.who]:true}});diary('😕','Faltou ao combinado com '+PEOPLE[pl.who].name+'.');
   R.phoneBadge=true;hud();toast('📱 '+PEOPLE[pl.who].name+': "Te esperei... tudo bem, fica pra próxima."');}
  else if(!R.plan.warned&&R.min>=R.plan.at-30){R.plan.warned=true;toast('📅 Daqui a pouco: '+R.plan.label+' com '+PEOPLE[R.plan.who].name+' às '+hhmm(R.plan.at)+'.');}}
 function callMom(){const L=life(),F=L.flags||{};advance(10);
  if(F.momMissed){dialog('','Oi, meu bem. Domingo passado eu fiz lasanha e fiquei te esperando... Tudo bem, eu sei que a empresa toma tempo. Só me avisa da próxima vez, tá?',[{t:'Desculpa, mãe. Vou avisar.',fn:()=>save({flags:{momMissed:false,momHurt:(F.momHurt||0)+1}})}],{name:'Mãe',col:'#e46d8c',k:MOM});return;}
  if(R.day==='sat'&&!F.momLunch){dialog('','Oi, meu bem! Tá comendo direito? Amanhã vou fazer aquele almoço de domingo. Vem?',[{t:'Vou sim!',fn:()=>{save({flags:{momLunch:'yes'}});diary('📞','Combinou o almoço de domingo com a mãe.');toast('Almoço com a mãe marcado para domingo.');}},{t:'Esse domingo vou trabalhar.',fn:()=>{save({flags:{momLunch:'no'}});say('','Tudo bem, a gente remarca. Não esquece de descansar.',null,{name:'Mãe',col:'#e46d8c',k:MOM});}},{t:'Ainda não sei.'}],{name:'Mãe',col:'#e46d8c',k:MOM});return;}
  const lines=F.momLunch==='yes'?['Te espero amanhã, hein! Vou fazer lasanha.']:['Oi, meu bem! Só liguei pra ouvir sua voz. Se cuida.','Vi uma reportagem sobre empresas novas e lembrei de você. Tô orgulhosa, sabia?','Sua tia mandou beijo. Disse que viu seu produto na internet!'];
  dialog('',lines[Math.floor(Math.random()*lines.length)],[{t:'Beijo, mãe.',fn:()=>diary('📞','Ligou para a mãe.')}],{name:'Mãe',col:'#e46d8c',k:MOM});}
 const MOM={shirt:'#e46d8c',hair:'#7a5a4a',skin:'#d79a72',style:'bun',seed:20};

 /* ---------- dormir e diário ---------- */
 function sleep(workSunday){showDiary(()=>{if(workSunday){finish('work');return;}
   if(R.day==='sat'){R.day='sun';R.min=START;R.talked={};R.dayLog=[];R.daySales={units:0,cash:0};R.spentToday=0;R.lateWarned=false;go('home',{x:1,y:1});const L=life();
    if(L.flags?.momLunch==='yes'){R.min=15*60;save({flags:{momLunch:'done',momTalks:(L.flags.momTalks||0)+1}});diary('🍝','Almoçou com a mãe.');
     dialog('','Domingo de lasanha. Depois do café, sua mãe toma coragem para falar de um assunto que vinha adiando. A conversa é longa e boa. No fim ela segura sua mão e diz que tem orgulho de você, mas que sente sua falta. Vocês combinam de se falar mais. (Você volta para casa às 15h.)',[{t:'Ok'}],{name:'Almoço com a mãe',col:'#e46d8c',k:MOM,mood:'happy'});}
    else toast('☀️ Bom dia! Domingo começou.');}
   else finish('rest');});}
 function showDiary(next){R.diaryOpen=true;const el=document.getElementById('tw-diary'),log=R.dayLog,ds=R.daySales;el.hidden=false;
  const lines=log.length?log.map(l=>'<li><span>'+l.icon+'</span>'+esc(l.text)+'</li>').join(''):'<li><span>🌿</span>Um dia tranquilo, sem pressa.</li>';
  const close=R.day==='sat'?['Que sábado bom.','Amanhã tem mais.','O bairro está ficando com cara de casa.'][log.length%3]:['Fim de semana bem vivido.','Segunda-feira, pode vir.','Recarregado para a semana.'][log.length%3];
  el.innerHTML='<div class="dy"><small>DIÁRIO</small><h3>'+(R.day==='sat'?'Sábado':'Domingo')+'</h3><ul>'+lines+'</ul>'+(ds.units?'<p class="dy-sales">📦 Enquanto isso, a loja online vendeu <b>'+ds.units+'</b> unidade'+(ds.units>1?'s':'')+' (+'+money(ds.cash)+').</p>':'')+(R.spentToday?'<p class="dy-spent">💸 Gastos do dia: '+money(R.spentToday)+'</p>':'')+'<p class="dy-end">'+close+'</p><button>Dormir 😴</button></div>';
  el.querySelector('button').onclick=()=>{el.hidden=true;R.diaryOpen=false;next();};}
 function finish(choice){const L=life(),flags={};if(L.flags?.momLunch==='yes'){flags.momLunch=null;flags.momMissed=true;}
  try{api.act({type:'life',patch:{flags},endWeekend:choice});}catch(e){toast(e.message);return;}close();}
 function poolTable(){const opts=[{t:'🎱 Jogar contra um frequentador',fn:()=>pool('Frequentador')},{t:'Agora não'}];const teo=R.scene.npcs.find(n=>n.id==='teo');if(teo&&present(teo))opts.unshift({t:'🎱 Jogar contra o Téo',fn:()=>pool('Téo')});menu('',opts,'A mesa está livre. O giz está no canto.',{name:'Mesa de sinuca'});}
 function clawStart(){dialog('','Cada tentativa custa '+money(5)+'. Hoje na máquina: '+PRIZES.map(p=>p.name).join(', ')+'.',[{t:'🕹 Jogar · R$ 5',fn:()=>{if(spend(5)){advance(5);claw();}}},{t:'Agora não'}],{name:'Garrinha',col:'#ff6b9a'});}

 /* ---------- clique no mundo ---------- */
 function screenOf(e){const r=cv.getBoundingClientRect(),k=R.view;return [(e.clientX-r.left)/k.s-k.ox,(e.clientY-r.top)/k.s-k.oy];}
 function pick(e){if(busy())return null;const [mx,my]=screenOf(e);
  for(const n of R.scene.npcs){if(!present(n))continue;const [sx,sy]=P(n.x,n.y);if(Math.abs(mx-sx)<15&&my>sy-60&&my<sy+5)return {npc:n};}
  const cat=R.scene.cat;if(cat){const [sx,sy]=P(cat.x,cat.y);if(Math.abs(mx-sx)<16&&Math.abs(my-sy+6)<12)return {cat};}
  let best=null;for(const h of R.scene.hots){const pts=[];for(const [a,b,z] of [[0,0,0],[h.w,0,0],[0,h.d,0],[h.w,h.d,0],[0,0,h.h],[h.w,0,h.h],[0,h.d,h.h],[h.w,h.d,h.h]])pts.push(P(h.x+a,h.y+b,z));
   const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);if(mx>=Math.min(...xs)-4&&mx<=Math.max(...xs)+4&&my>=Math.min(...ys)-4&&my<=Math.max(...ys)+4){const d=h.x+h.y;if(!best||d>best.d)best={hot:h,d};}}
  return best;}
 function near(x,y){return [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].map(([dx,dy])=>[Math.floor(x)+dx,Math.floor(y)+dy]).filter(([a,b])=>R.scene.free(a,b)).sort((a,b)=>Math.hypot(a[0]+.5-R.p.x,a[1]+.5-R.p.y)-Math.hypot(b[0]+.5-R.p.x,b[1]+.5-R.p.y))[0];}
 function onClick(e){if(busy())return;Amb.start();const h=pick(e);
  if(h?.npc){const n=h.npc;n.path=[];if(Math.hypot(n.x-R.p.x,n.y-R.p.y)<1.8){useNpc(n);return;}const cell=near(n.x,n.y);if(cell)walkTo(cell,()=>useNpc(n));return;}
  if(h?.cat){const ct=h.cat;if(Math.hypot(ct.x-R.p.x,ct.y-R.p.y)<1.6){petCat();return;}const cell=near(ct.x,ct.y);if(cell)walkTo(cell,petCat);return;}
  if(h?.hot){const st=h.hot.stand;if(Math.hypot(st[0]+.5-R.p.x,st[1]+.5-R.p.y)<.6){h.hot.use();return;}walkTo(st,()=>h.hot.use());return;}
  const [mx,my]=screenOf(e),[x,y]=inv(mx,my),cx=Math.floor(x),cy=Math.floor(y);if(R.scene.free(cx,cy)){walkTo([cx,cy]);R.particles.push({kind:'ring',x:cx+.5,y:cy+.5,z:0,life:.6});}}

 /* ---------- laço do mundo ---------- */
 function update(dt){const S=R.scene;R.light=light(R.min);
  if(!busy()){const before=R.min;R.min+=dt/0.6;storeTick(R.min-before);checkPlan();
   if(R.min>=LIMIT){R.min=LIMIT;if(S.id!=='home'){go('home',{x:8,y:1});diary('🌙','Voltou tarde para casa.');say('','Está ficando tarde. Melhor voltar pra casa. (Para dormir, use a porta do quarto.)');}else if(!R.lateWarned){R.lateWarned=true;toast('🌙 Já é tarde. Vá dormir pela porta do quarto.');}}}
  if(R.coffee>0)R.coffee-=dt*8;
  const p=R.p;if(p.path.length){const t=p.path[0],dx=t.x-p.x,dy=t.y-p.y,d=Math.hypot(dx,dy),step=4.2*dt;if(Math.abs(dx-dy)>.01)p.face=(dx-dy)>0?1:-1;
   R.stepT=(R.stepT||0)+dt;if(R.stepT>.3){R.stepT=0;Amb.step();}
   if(d<=step){p.x=t.x;p.y=t.y;p.path.shift();if(!p.path.length&&R.pending){const f=R.pending;R.pending=null;f();}}else{p.x+=dx/d*step;p.y+=dy/d*step;}p.walk=true;}else p.walk=false;
  for(const n of S.npcs){n.t+=dt;if(n.emoteT>0)n.emoteT-=dt;if(!n.wander||!present(n))continue;if(n.path.length){const t=n.path[0],dx=t.x-n.x,dy=t.y-n.y,d=Math.hypot(dx,dy),step=1.5*dt;if(Math.abs(dx-dy)>.01)n.face=(dx-dy)>0?1:-1;if(d<=step){n.x=t.x;n.y=t.y;n.path.shift();}else{n.x+=dx/d*step;n.y+=dy/d*step;}n.walking=true;}
   else{n.walking=false;n.wait-=dt;if(n.wait<=0){n.wait=2+Math.random()*4;const tx=Math.floor(n.hx+(Math.random()-.5)*10),ty=Math.floor(n.hy+(Math.random()-.5)*8);const r=S.free(tx,ty)&&route(S,n,[tx,ty]);if(r&&r.length<14)n.path=r;}}}
  // gato: dorme, acorda, passeia e volta para a caminha
  const ct=S.cat;if(ct){ct.t+=dt;if(ct.state==='happy'&&ct.t>2.5){ct.state='sit';ct.t=0;}
   if(ct.state==='sleep'&&ct.t>14+Math.random()*8){ct.state='walk';ct.t=0;const opts=[[2.5,2.5],[4.5,2.8],[6.5,5.5],[7.5,4.5],[3,6.5]];const o=opts[Math.floor(Math.random()*opts.length)];ct.tx=o[0];ct.ty=o[1];}
   if(ct.state==='walk'){const dx=ct.tx-ct.x,dy=ct.ty-ct.y,d=Math.hypot(dx,dy);if(Math.abs(dx-dy)>.01)ct.face=(dx-dy)>0?1:-1;if(d<.05){ct.state=Math.abs(ct.x-7.5)<.1&&Math.abs(ct.y-4.5)<.1?'sleep':'sit';ct.t=0;}else{ct.x+=dx/d*Math.min(d,1.1*dt);ct.y+=dy/d*Math.min(d,1.1*dt);}}
   if(ct.state==='sit'&&ct.t>9){ct.state='walk';ct.tx=7.5;ct.ty=4.5;ct.t=0;}}
  // pombos que levantam voo quando você chega perto
  if(S.pigeons)for(const pg of S.pigeons){if(pg.fly>0){pg.fly-=dt;pg.x+=pg.vx*dt;pg.y+=pg.vy*dt;pg.z=(pg.z||0)+dt*2.2;if(pg.fly<=0){pg.x=pg.hx;pg.y=pg.hy;pg.z=0;pg.back=6+Math.random()*6;}}
   else if(pg.back>0)pg.back-=dt;else{pg.peck+=dt;if(Math.hypot(pg.x-p.x,pg.y-p.y)<1.6){pg.fly=2.2;const a=Math.random()*Math.PI*2;pg.vx=Math.cos(a)*3;pg.vy=Math.sin(a)*3;Amb.pop();}}}
  if(S.cars)for(const car of S.cars){car.x+=car.dir*dt*2.6;if(car.x>36)car.x=-4-Math.random()*20;if(car.x<-4)car.x=36+Math.random()*20;}
  // partículas: folhas, notas, corações, vapor e anéis de clique
  if(!S.indoor&&Math.random()<dt*.9&&R.light.night<.6){const tr=S.items.length;R.particles.push({kind:'leaf',x:8+Math.random()*12,y:8+Math.random()*10,z:2.2,vz:-.35,life:6,dx:.25,rot:Math.random()*6,col:['#86d696','#f2a93b','#5fbf74'][Math.floor(Math.random()*3)]});}
  if(S.id==='bar'&&Math.random()<dt*1.4)R.particles.push({kind:'note',x:10.5,y:1,z:1.8,vz:.5,life:2,dx:(Math.random()-.5)*.3});
  for(const q of R.particles){q.life-=dt;q.z+=(q.vz||0)*dt;q.x+=(q.dx||0)*dt;if(q.kind==='leaf')q.rot+=dt*2;}R.particles=R.particles.filter(q=>q.life>0&&q.z>-.1);
  Amb.tick(dt,R.light.night);R.fade=Math.max(0,R.fade-dt*3);R.hudT=(R.hudT||0)+dt;if(R.hudT>.5){R.hudT=0;hud();}}

 function drawCat(ct){const [sx,sy]=P(ct.x,ct.y);c.save();c.translate(sx,sy);c.scale(ct.face||1,1);ellipse(0,1,13,4,'rgba(20,12,30,.2)');const k='#f2a93b',d=dk(k,.25);
  if(ct.state==='sleep'){const b=1+Math.sin(R.t*2)*.04;c.save();c.scale(1,b);ellipse(0,-7,13,8,k);c.restore();circle(-9,-8,6,k);c.fillStyle=k;c.beginPath();c.moveTo(-14,-11);c.lineTo(-13,-17);c.lineTo(-9,-13);c.fill();c.strokeStyle=d;c.lineWidth=1;c.beginPath();c.arc(-10,-8,2,.2,Math.PI-.2);c.stroke();
   for(let i=0;i<3;i++){c.fillStyle=d;c.fillRect(-2+i*4,-13,1.5,5);}c.strokeStyle=k;c.lineWidth=3;c.beginPath();c.moveTo(11,-5);c.quadraticCurveTo(16,0,8,1);c.stroke();emoji(4,-24-((R.t*8)%10),'💤',10,.7);}
  else{const walk=ct.state==='walk',lg=walk?Math.sin(R.t*12)*2:0;c.fillStyle=k;c.fillRect(-8+lg,-6,3,6);c.fillRect(5-lg,-6,3,6);ellipse(0,-9,11,6,k);circle(-9,-15,6.5,k);c.beginPath();c.moveTo(-14,-18);c.lineTo(-13,-25);c.lineTo(-9,-20);c.fill();c.beginPath();c.moveTo(-6,-20);c.lineTo(-4,-26);c.lineTo(-3,-19);c.fill();
   circle(-11,-16,1.2,'#2a1f2e');circle(-7,-16,1.2,'#2a1f2e');c.strokeStyle=k;c.lineWidth=3;c.beginPath();c.moveTo(10,-10);c.quadraticCurveTo(16,-16+Math.sin(R.t*3)*3,12,-22);c.stroke();}
  c.restore();}
 function drawPigeon(pg){const [sx,sy]=P(pg.x,pg.y,pg.z||0);if(pg.back>0&&!pg.fly)return;const peck=pg.fly>0?0:Math.max(0,Math.sin(pg.peck*3))*2;
  if(!pg.fly)ellipse(sx,sy+1,5,2,'rgba(20,12,30,.18)');ellipse(sx,sy-4,5,3.5,'#9aa0b0');circle(sx-4,sy-7+peck,2.6,'#7d8394');c.fillStyle='#f2a93b';c.fillRect(sx-7.5,sy-7+peck,2,1.2);
  if(pg.fly>0){const w=Math.sin(R.t*30)*5;c.strokeStyle='#9aa0b0';c.lineWidth=2;c.beginPath();c.moveTo(sx-5,sy-5);c.lineTo(sx-1,sy-9-w);c.lineTo(sx+3,sy-5);c.stroke();}}
 function drawCar(car){const [sx,sy]=P(car.x,car.y,0);c.save();ellipse(sx,sy+2,26,8,'rgba(20,12,30,.22)');box(car.x-.9,car.y-.35,0,1.8,.7,.45,car.col,{stroke:false});box(car.x-.45,car.y-.3,.45,.9,.6,.32,lit(car.col,.15),{stroke:false});
  poly(fY(car.y+.301,car.x-.4,car.x+.4,.5,.74),'#cfe6f2');if(R.light.night>.4){glow(...P(car.x+car.dir*.95,car.y,.25),30,'rgba(255,240,180,.7)');}c.restore();}
 function draw(){const S=R.scene,L=R.light||light(R.min),dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);
  if(S.indoor){const g=c.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,S.warm?'#2a1810':'#1f2138');g.addColorStop(1,S.warm?'#140b07':'#141526');c.fillStyle=g;}else{const g=c.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,L.sky[0]);g.addColorStop(1,L.sky[1]);c.fillStyle=g;}
  c.fillRect(0,0,cv.width,cv.height);
  const s=Math.max(.62,Math.min(1.5,Math.min(W/760,H/520)))*(S.indoor?1.22:1);const [px,py]=P(R.p.x,R.p.y);let ox,oy;
  if(!S.indoor){const minX=P(0,S.h)[0],maxX=P(S.w,0)[0],minY=-60,maxY=P(S.w,S.h)[1];ox=Math.min(-minX+40,Math.max(W/s-maxX-40,W/2/s-px));oy=Math.min(-minY+60,Math.max(H/s-maxY-30,H/2/s-py+30));}
  else{const [cx,cy]=P(S.w/2,S.h/2);ox=W/2/s-cx;oy=H/2/s-cy+40;}
  R.view={s,ox,oy};c.setTransform(dpr*s,0,0,dpr*s,dpr*s*ox,dpr*s*oy);
  if(!S.indoor&&L.night<.5){c.save();c.globalAlpha=.8;for(let i=0;i<4;i++){const cx=((R.t*6+i*260)%1400)-400,cy=-160+i*40;ellipse(cx,cy,60,16,'#ffffffcc');ellipse(cx+30,cy-8,40,14,'#ffffffcc');}c.restore();}
  for(let x=0;x<S.w;x++)for(let y=0;y<S.h;y++)poly(fZ(0,x,x+1,y,y+1),S.ground(x,y),'rgba(0,0,0,.05)',.6);
  if(S.walls)S.walls();if(S.decor)S.decor();
  const items=[...S.items],k=pal();
  items.push({d:R.p.x+R.p.y,draw:()=>{const [sx,sy]=P(R.p.x,R.p.y);person(sx,sy,k,R.t,{walking:R.p.walk,face:R.p.face});}});
  for(const n of S.npcs){if(!present(n))continue;items.push({d:n.x+n.y,draw:()=>{const [sx,sy]=P(n.x,n.y);person(sx,sy,n.k,n.t,{walking:n.walking,face:n.face});
   if(n.emoteT>0)emoji(sx,sy-74-(2.2-n.emoteT)*8,n.emote,15,Math.min(1,n.emoteT));
   else if(R.plan&&R.plan.who===n.id&&R.plan.place===S.id)emoji(sx,sy-74+Math.sin(R.t*4)*2,'⭐',14);
   if(R.hover?.npc===n&&n.name)label(sx,sy-90,n.name,{border:PEOPLE[n.id].col||'#7b5cd6'});}});}
  if(S.cat)items.push({d:S.cat.x+S.cat.y,draw:()=>{drawCat(S.cat);if(R.hover?.cat){const [sx,sy]=P(S.cat.x,S.cat.y);label(sx,sy-38,'Biscoito',{border:'#f2a93b'});}}});
  if(S.pigeons)for(const pg of S.pigeons)items.push({d:pg.x+pg.y+(pg.z||0)*3,draw:()=>drawPigeon(pg)});
  if(S.cars)for(const car of S.cars)items.push({d:car.x+car.y+.5,draw:()=>drawCar(car)});
  if(S.id==='street'){const b=(R.t*1.3)%2,f=b<1?b:2-b,[ax,ay]=P(13.6+f*1.8,12.2+f*2.2,1.2+Math.sin(f*Math.PI)*1.6);if(R.min<19*60)items.push({d:28,draw:()=>circle(ax,ay,5,'#fff','#c8553d',1.5)});}
  items.sort((a,b)=>a.d-b.d).forEach(i=>i.draw());
  // varal de luzinhas da praça
  if(S.id==='street'){const ropes=[[[8.5,8.5],[19.5,8.5]],[[8.5,18.5],[19.5,18.5]],[[8.5,8.5],[8.5,18.5]],[[19.5,8.5],[19.5,18.5]]];for(const [[a,b],[e,f]] of ropes){c.strokeStyle='#3a2f2a';c.lineWidth=1;c.beginPath();for(let i=0;i<=20;i++){const t=i/20,[sx,sy]=P(a+(e-a)*t,b+(f-b)*t,2.3-Math.sin(t*Math.PI*3)**2*.25);i?c.lineTo(sx,sy):c.moveTo(sx,sy);}c.stroke();
    for(let i=1;i<20;i+=2){const t=i/20,[sx,sy]=P(a+(e-a)*t,b+(f-b)*t,2.3-Math.sin(t*Math.PI*3)**2*.25),col=['#ffd66b','#ff8f6b','#9be38b','#7fd0ff'][i%4];circle(sx,sy+3,2.6,col);if(L.night>.3)glow(sx,sy+3,14,'rgba(255,220,140,.8)',L.night*.8);}}}
  for(const q of R.particles){const [sx,sy]=P(q.x,q.y,q.z);const a=Math.min(1,q.life);if(q.kind==='leaf'){c.save();c.globalAlpha=a;c.translate(sx+Math.sin(q.rot)*6,sy);c.rotate(q.rot);ellipse(0,0,3.5,1.8,q.col);c.restore();}
   else if(q.kind==='note')emoji(sx+Math.sin(q.life*5)*4,sy,'♪',13,a);else if(q.kind==='heart')emoji(sx,sy,'❤️',12,a);else if(q.kind==='ring'){c.save();c.globalAlpha=a;c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.ellipse(sx,sy,14*(1.4-q.life),7*(1.4-q.life),0,0,Math.PI*2);c.stroke();c.restore();}}
  if(R.hover?.hot){const h=R.hover.hot,[sx,sy]=P(h.x+h.w/2,h.y+h.d/2,h.h+.35);label(sx,sy,h.label,{border:'#7b5cd6'});}
  if(R.p.path.length){const t=R.p.path[R.p.path.length-1],[sx,sy]=P(t.x,t.y);c.save();c.globalAlpha=.5+Math.sin(R.t*8)*.2;c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.ellipse(sx,sy,9,4.5,0,0,Math.PI*2);c.stroke();c.restore();}
  // luz do horário e luzes que acendem
  c.setTransform(1,0,0,1,0,0);const nightIn=S.indoor?L.night*.45:L.night;const tint=L.tint;if(tint[3]>0&&!S.warm){c.fillStyle='rgba('+tint.slice(0,3).map(Math.round).join(',')+','+(S.indoor?tint[3]*.45:tint[3])+')';c.fillRect(0,0,cv.width,cv.height);}
  c.setTransform(dpr*s,0,0,dpr*s,dpr*s*ox,dpr*s*oy);
  for(const lp of S.lamps){const a=lp.indoor?.55+nightIn:Math.max(0,(L.night-.25)*1.4);if(a<=0)continue;const [sx,sy]=P(lp.x,lp.y,lp.z);glow(sx,sy,lp.r,lp.col,Math.min(1,a));if(!lp.indoor){const [gx,gy]=P(lp.x,lp.y,0);c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(.5,a*.4);ellipse(gx,gy,lp.r*.5,lp.r*.25,'rgba(255,170,80,.35)');c.restore();}}
  if(S.warm){c.setTransform(1,0,0,1,0,0);const gr=c.createRadialGradient(cv.width/2,cv.height*.45,10,cv.width/2,cv.height*.45,cv.width*.7);gr.addColorStop(0,'rgba(255,190,110,.12)');gr.addColorStop(1,'rgba(30,12,4,.35)');c.fillStyle=gr;c.fillRect(0,0,cv.width,cv.height);}
  c.setTransform(1,0,0,1,0,0);const vg=c.createRadialGradient(cv.width/2,cv.height/2,cv.height*.35,cv.width/2,cv.height/2,cv.width*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,8,25,.28)');c.fillStyle=vg;c.fillRect(0,0,cv.width,cv.height);
  if(R.fade>0){c.fillStyle='rgba(15,16,32,'+R.fade+')';c.fillRect(0,0,cv.width,cv.height);}}
 function frame(now){if(!R)return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;R.t+=dt;if(!R.mini)update(dt);draw();raf=requestAnimationFrame(frame);}

 /* ---------- abrir e fechar ---------- */
 function open(a){api=a;ensureDom();const g=api.get(),L=g.life||{},o=L.outing,week=(g.weekly?.reports?.length)||0;
  R={week,day:'sat',min:START,talked:{},t:0,fade:1,hover:null,particles:[],seen:{},plan:null,log:[],dayLog:[],sales:{units:0,cash:0},daySales:{units:0,cash:0},song:0,coffee:0,
   productShelf:(g.sold||0)>=100&&g.name?g.name:(g.history||[]).find(h=>(h.sold||0)>=100)?.name||null};R.light=light(R.min);
  if(o&&o.week===week){R.day=o.day;R.min=o.min;R.plan=o.plan||null;R.dayLog=o.dayLog||[];R.scene=BUILD[o.scene](g,L);R.p={x:o.x+.5,y:o.y+.5,path:[],face:1};}
  else{R.scene=BUILD.home(g,L);const sp=R.scene.spawn;R.p={x:sp.x+.5,y:sp.y+.5,path:[],face:1};if(L.flags&&['done','no'].includes(L.flags.momLunch))try{api.act({type:'life',patch:{flags:{momLunch:null}}});}catch(e){}}
  R.light=light(R.min);root.hidden=false;document.body.classList.add('town-open');save();hud();last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);Amb.start();Amb.scene(R.scene.id);
  if(!o||o.week!==week)setTimeout(()=>say('',g.office?'Sexta à noite você deixa o escritório e volta para casa. O fim de semana é seu: saia pela porta da direita para explorar o bairro. Clique no chão para andar e em pessoas, no gato ou em objetos para interagir.':'Você fecha o notebook e sai do quarto-escritório. O fim de semana é seu: saia pela porta da direita para explorar o bairro. Clique no chão para andar e em pessoas, no gato ou em objetos para interagir.',null,{name:'Fim de semana'}),300);}
 function close(){cancelAnimationFrame(raf);Amb.stop();R=null;if(root)root.hidden=true;document.body.classList.remove('town-open');api.onClose&&api.onClose();}

 /* ---------- minigames: base comum ---------- */
 let M=null;
 function miniOpen(title,help){R.mini=true;const el=document.getElementById('tw-mini');el.hidden=false;document.getElementById('tw-mini-title').textContent=title;document.getElementById('tw-mini-help').textContent=help;document.getElementById('tw-mini-actions').innerHTML='';
  const mc=document.getElementById('tw-mini-cv');return {mc,ctx:mc.getContext('2d')};}
 function miniPos(e){const mc=document.getElementById('tw-mini-cv'),r=mc.getBoundingClientRect();return [(e.clientX-r.left)/r.width*mc.width,(e.clientY-r.top)/r.height*mc.height];}
 function miniEnd(text,buttons){document.getElementById('tw-mini-help').textContent=text;document.getElementById('tw-mini-actions').innerHTML=buttons.map((b,i)=>'<button data-i="'+i+'">'+esc(b.t)+'</button>').join('');
  document.querySelectorAll('#tw-mini-actions button').forEach(btn=>btn.onclick=()=>buttons[+btn.dataset.i].fn());}
 function miniClose(){if(M){cancelAnimationFrame(M.raf);const mc=document.getElementById('tw-mini-cv');mc.onpointerdown=mc.onpointerup=mc.onpointermove=null;window.onkeydown=null;window.onkeyup=null;}M=null;document.getElementById('tw-mini').hidden=true;R.mini=false;hud();}
 function score(t){document.getElementById('tw-mini-score').textContent=t;}
 function results(game,opp,win){const who=opp==='Duda'?'duda':opp==='Téo'?'teo':null;diary(game==='pool'?'🎱':'🏐',(win?'Ganhou ':'Perdeu ')+(game==='pool'?'na sinuca':'no vôlei')+' contra '+opp+'.');if(who&&win)save({friends:{[who]:friend(who)+1}});else save();}

 /* ---------- sinuca ---------- */
 function pool(opp){const {mc,ctx:x}=miniOpen('🎱 Sinuca contra '+opp,'Mire com o mouse: a bola fantasma mostra onde a branca vai bater e a linha mostra para onde a bola vai. Segure para dosar a força e solte para tacar. Você joga com as laranjas.');
  const T={x:40,y:40,w:680,h:340},BR=10,pockets=[[T.x,T.y],[T.x+T.w/2,T.y-4],[T.x+T.w,T.y],[T.x,T.y+T.h],[T.x+T.w/2,T.y+T.h+4],[T.x+T.w,T.y+T.h]];
  const balls=[{x:200,y:210,vx:0,vy:0,k:'cue'}];[[0,0,'me'],[1,-.5,'op'],[1,.5,'me'],[2,-1,'op'],[2,0,'me'],[2,1,'op']].forEach(([i,j,k])=>balls.push({x:500+i*BR*1.8,y:210+j*BR*2.1,vx:0,vy:0,k}));
  const st={turn:'me',pot:{me:0,op:0},aim:[480,210],power:0,charging:false,shot:null,over:false,think:0,msg:'Sua vez',flash:0};M={raf:0,balls,st};const tok=M;
  const sc=()=>score('Você '+st.pot.me+' × '+st.pot.op+' '+opp);sc();
  function shoot(ang,pw){const cue=balls[0];cue.vx=Math.cos(ang)*pw*17;cue.vy=Math.sin(ang)*pw*17;st.shot={by:st.turn,potted:[]};Amb.step();}
  function physics(){let moving=false;for(const b of balls){if(b.out)continue;b.x+=b.vx;b.y+=b.vy;b.vx*=.988;b.vy*=.988;if(Math.hypot(b.vx,b.vy)<.04)b.vx=b.vy=0;else moving=true;
    if(b.x<T.x+BR){b.x=T.x+BR;b.vx=-b.vx*.85;}if(b.x>T.x+T.w-BR){b.x=T.x+T.w-BR;b.vx=-b.vx*.85;}if(b.y<T.y+BR){b.y=T.y+BR;b.vy=-b.vy*.85;}if(b.y>T.y+T.h-BR){b.y=T.y+T.h-BR;b.vy=-b.vy*.85;}
    for(const p of pockets)if(Math.hypot(b.x-p[0],b.y-p[1])<21){b.out=true;b.vx=b.vy=0;st.shot&&st.shot.potted.push(b.k);Amb.pop();break;}}
   for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.out||b.out)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
    if(d>0&&d<2*BR){const nx=dx/d,ny=dy/d,o=(2*BR-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(rel>0){a.vx-=rel*nx;a.vy-=rel*ny;b.vx+=rel*nx;b.vy+=rel*ny;if(rel>2)Amb.step();}}}
   return moving;}
  function settle(){const s=st.shot;st.shot=null;for(const k of s.potted)if(k==='me'||k==='op')st.pot[k]++;sc();
   if(st.pot.me>=3||st.pot.op>=3){st.over=true;const win=st.pot.me>=3;advance(40);results('pool',opp,win);miniEnd(win?'Você venceu! '+opp+' pede revanche com os olhos.':opp+' venceu desta vez. Na próxima a mesa é sua.',[{t:'🔁 Revanche',fn:()=>{miniClose();pool(opp);}},{t:'Sair',fn:miniClose}]);return;}
   const cue=balls[0],keep=s.potted.includes(s.by)&&!s.potted.includes('cue');
   if(s.potted.includes('cue')){cue.out=false;cue.x=200;cue.y=210;cue.vx=cue.vy=0;while(balls.some(b=>b!==cue&&!b.out&&Math.hypot(b.x-cue.x,b.y-cue.y)<2*BR+1))cue.y+=2*BR+2;}
   if(!keep)st.turn=st.turn==='me'?'op':'me';st.flash=1;
   st.msg=st.turn==='me'?(keep?'Boa! Jogue de novo':s.potted.includes('cue')?opp+' encaçapou a branca. Sua vez':'Sua vez'):(s.potted.includes('cue')?'Você encaçapou a branca. Vez de '+opp:'Vez de '+opp);if(st.turn==='op')st.think=55;}
  function ai(){const cue=balls[0];let best=null;const norm=a=>{a=Math.abs(a)%(Math.PI*2);return a>Math.PI?Math.PI*2-a:a;};
   for(const b of balls)if(!b.out&&b.k==='op')for(const p of pockets){const dx=p[0]-b.x,dy=p[1]-b.y,d=Math.hypot(dx,dy),gx=b.x-dx/d*2*BR,gy=b.y-dy/d*2*BR,ax=gx-cue.x,ay=gy-cue.y,ad=Math.hypot(ax,ay),cut=norm(Math.atan2(ay,ax)-Math.atan2(dy,dx));
    if(cut>1.15)continue;const s=d+ad+cut*220;if(!best||s<best.s)best={s,ang:Math.atan2(ay,ax),dist:d+ad};}
   if(!best){const t=balls.find(b=>!b.out&&b.k==='op')||balls.find(b=>!b.out&&b!==cue);best={ang:Math.atan2(t.y-cue.y,t.x-cue.x),dist:300};}
   shoot(best.ang+(Math.random()-.5)*(opp==='Téo'?.025:.045),Math.min(1,.38+best.dist/750));}
  // mira: primeira bola atingida pela trajetória da branca
  function aimHit(a){const cue=balls[0],dx=Math.cos(a),dy=Math.sin(a);let best=null;for(const b of balls){if(b===cue||b.out)continue;const fx=cue.x-b.x,fy=cue.y-b.y,B=fx*dx+fy*dy,C=fx*fx+fy*fy-4*BR*BR,D=B*B-C;if(D<0)continue;const t=-B-Math.sqrt(D);if(t>0&&(!best||t<best.t))best={t,b};}
   if(!best)return null;const gx=cue.x+dx*best.t,gy=cue.y+dy*best.t,nx=best.b.x-gx,ny=best.b.y-gy,nd=Math.hypot(nx,ny);return {gx,gy,b:best.b,ox:nx/nd,oy:ny/nd};}
  mc.onpointermove=e=>{st.aim=miniPos(e);};mc.onpointerdown=e=>{st.aim=miniPos(e);if(st.turn==='me'&&!st.shot&&!st.over){st.charging=true;st.power=0;}};
  mc.onpointerup=()=>{if(!st.charging)return;st.charging=false;const cue=balls[0];shoot(Math.atan2(st.aim[1]-cue.y,st.aim[0]-cue.x),Math.max(.08,st.power));};
  function loop(){if(st.charging)st.power=Math.min(1,st.power+.018);if(st.flash>0)st.flash-=.02;
   if(st.shot){const m=physics()||physics();if(!m)settle();}else if(st.turn==='op'&&!st.over){if(--st.think<=0)ai();}
   x.clearRect(0,0,760,420);const bg=x.createRadialGradient(380,210,40,380,210,460);bg.addColorStop(0,'#5a3424');bg.addColorStop(1,'#2a160e');x.fillStyle=bg;x.fillRect(0,0,760,420);
   x.fillStyle='#7a4a2a';x.beginPath();x.roundRect?x.roundRect(14,14,732,392,22):x.rect(14,14,732,392);x.fill();x.fillStyle='#8c5a34';x.fillRect(24,24,712,372);
   for(const [dx,dy] of [[120,0],[240,0],[480,0],[600,0]]){x.fillStyle='#f2e3a6';x.beginPath();x.arc(40+dx,30,2.5,0,Math.PI*2);x.fill();x.beginPath();x.arc(40+dx,390,2.5,0,Math.PI*2);x.fill();}
   const felt=x.createRadialGradient(380,210,30,380,210,420);felt.addColorStop(0,'#3a9a5c');felt.addColorStop(1,'#26703f');x.fillStyle=felt;x.fillRect(T.x,T.y,T.w,T.h);
   x.fillStyle='#ffffff18';x.fillRect(T.x+160,T.y,2,T.h);x.beginPath();x.arc(T.x+160,T.y+T.h/2,50,Math.PI/2,Math.PI*1.5);x.strokeStyle='#ffffff18';x.lineWidth=2;x.stroke();
   for(const p of pockets){x.beginPath();x.arc(p[0],p[1],19,0,Math.PI*2);x.fillStyle='#120a06';x.fill();x.strokeStyle='#5a3b26';x.lineWidth=3;x.stroke();}
   const cue=balls[0],my=st.turn==='me'&&!st.shot&&!st.over&&!cue.out;
   if(my){const a=Math.atan2(st.aim[1]-cue.y,st.aim[0]-cue.x),h=aimHit(a);x.setLineDash([5,6]);x.strokeStyle='#ffffffb0';x.lineWidth=1.5;x.beginPath();x.moveTo(cue.x,cue.y);x.lineTo(h?h.gx:cue.x+Math.cos(a)*400,h?h.gy:cue.y+Math.sin(a)*400);x.stroke();x.setLineDash([]);
    if(h){x.beginPath();x.arc(h.gx,h.gy,BR,0,Math.PI*2);x.strokeStyle='#ffffffcc';x.stroke();x.strokeStyle=h.b.k==='me'?'#ffcf8a':'#9fc3ff';x.lineWidth=2.5;x.beginPath();x.moveTo(h.b.x,h.b.y);x.lineTo(h.b.x+h.ox*90,h.b.y+h.oy*90);x.stroke();}
    const back=24+st.power*55;x.strokeStyle='#e8c98e';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(cue.x-Math.cos(a)*back,cue.y-Math.sin(a)*back);x.lineTo(cue.x-Math.cos(a)*(back+210),cue.y-Math.sin(a)*(back+210));x.stroke();
    x.strokeStyle='#3d6fa8';x.lineWidth=7;x.beginPath();x.moveTo(cue.x-Math.cos(a)*back,cue.y-Math.sin(a)*back);x.lineTo(cue.x-Math.cos(a)*(back+8),cue.y-Math.sin(a)*(back+8));x.stroke();x.lineCap='butt';}
   for(const b of balls){if(b.out)continue;x.beginPath();x.arc(b.x+2,b.y+3,BR,0,Math.PI*2);x.fillStyle='#0005';x.fill();x.beginPath();x.arc(b.x,b.y,BR,0,Math.PI*2);x.fillStyle=b.k==='cue'?'#fbfbf5':b.k==='me'?'#ef8a3c':'#3d6fa8';x.fill();
    if(b.k==='op'){x.save();x.beginPath();x.arc(b.x,b.y,BR,0,Math.PI*2);x.clip();x.fillStyle='#fff';x.fillRect(b.x-BR,b.y-3.5,BR*2,7);x.restore();}x.beginPath();x.arc(b.x-3,b.y-3,3,0,Math.PI*2);x.fillStyle='#ffffffaa';x.fill();}
   // trilho dos encaçapados
   for(let i=0;i<st.pot.me;i++){x.beginPath();x.arc(60+i*24,404,8,0,Math.PI*2);x.fillStyle='#ef8a3c';x.fill();}for(let i=0;i<st.pot.op;i++){x.beginPath();x.arc(700-i*24,404,8,0,Math.PI*2);x.fillStyle='#3d6fa8';x.fill();}
   x.fillStyle=st.flash>0?'#ffe46b':'#fff';x.font='800 15px '+FONT;x.fillText(st.msg,30,32);if(st.charging){x.fillStyle='#0006';x.fillRect(560,18,170,12);const pg=x.createLinearGradient(560,0,730,0);pg.addColorStop(0,'#4fbf8a');pg.addColorStop(.6,'#f2a93b');pg.addColorStop(1,'#e46d6d');x.fillStyle=pg;x.fillRect(560,18,170*st.power,12);}
   if(M===tok)M.raf=requestAnimationFrame(loop);}
  M.raf=requestAnimationFrame(loop);}

 /* ---------- vôlei ---------- */
 function volley(opp){const {mc,ctx:x}=miniOpen('🏐 Vôlei contra '+opp,'Clique na quadra para se mover. Clique quando a bola estiver perto de você para devolver. A marca no chão mostra onde ela vai cair. Quem fizer 5 pontos vence.');
  const G=.3,FLOOR=360,NET=380,NETTOP=215;const me={x:190,tx:190,hit:0},op={x:570,miss:false,hit:0},ball={x:190,y:240,vx:0,vy:0,live:false,last:null,spin:0};
  const st={me:0,op:0,serve:'me',wait:70,msg:'Seu saque',over:false,rally:0,pop:0};M={raf:0};const tok=M;const sc=()=>score('Você '+st.me+' × '+st.op+' '+opp);sc();const L=light(R.min);
  const opK=opp==='Duda'?PEOPLE.duda.k:{shirt:'#6c8fd1',hair:'#5a3b26',skin:'#edbd97',style:'short'};
  function launch(fx,fy,tx){const vy=-(9.2+Math.random()*1.4),t=(-vy+Math.sqrt(vy*vy+2*G*(FLOOR-fy)))/G;ball.x=fx;ball.y=fy;ball.vx=(tx-fx)/t;ball.vy=vy;ball.live=true;Amb.pop();}
  const landX=()=>{const t=(-ball.vy+Math.sqrt(ball.vy*ball.vy+2*G*(FLOOR-ball.y)))/G;return ball.x+ball.vx*t;};
  function point(who,why){ball.live=false;st[who]++;sc();st.rally=0;st.serve=who;st.wait=80;op.miss=false;st.pop=1;
   if(st.me>=5||st.op>=5){st.over=true;const win=st.me>=5;advance(45);results('volley',opp,win);miniEnd(win?'Vitória! '+opp+' quer revanche.':opp+' venceu. Foi por pouco!',[{t:'🔁 Revanche',fn:()=>{miniClose();volley(opp);}},{t:'Sair',fn:miniClose}]);}
   st.msg=(who==='me'?'Ponto seu! ':'Ponto de '+opp+'. ')+why;}
  mc.onpointerdown=e=>{if(st.over)return;const [mx]=miniPos(e);
   if(ball.live&&ball.last!=='me'&&ball.x<NET&&Math.abs(ball.x-me.x)<50&&ball.y>FLOOR-145&&ball.y<FLOOR-12){st.rally++;ball.last='me';me.hit=1;launch(ball.x,ball.y,470+Math.random()*250);st.msg=st.rally>4?'Que rali!':'Boa!';return;}
   me.tx=Math.max(30,Math.min(NET-25,mx));};
  const fig=(fx,k,hit,face)=>{x.save();x.translate(fx,FLOOR);x.scale(2.1*face,2.1);const prev=c;c=x;person(0,0,k,R.t,{walking:false,face:1,scale:1,wave:hit>0});c=prev;x.restore();};
  function loop(){if(!st.over){
    if(!ball.live){if(--st.wait<=0){if(st.serve==='me'){ball.last='me';me.hit=1;launch(me.x,FLOOR-110,480+Math.random()*230);}else{ball.last='op';op.hit=1;launch(op.x,FLOOR-110,60+Math.random()*260);}st.msg='';}}
    else{const px=ball.x;ball.x+=ball.vx;ball.y+=ball.vy;ball.vy+=G;ball.spin+=ball.vx*.05;
     if((px-NET)*(ball.x-NET)<=0&&ball.y>NETTOP){ball.vx=-ball.vx*.25;ball.x=px;}
     if(ball.y>=FLOOR){const lx=ball.x;if(lx<15||lx>745)point(ball.last==='me'?'op':'me','Bola fora.');else if(lx<NET)point('op','A bola caiu do seu lado.');else point('me','A bola caiu do lado de '+opp+'.');}}
    me.x+=Math.sign(me.tx-me.x)*Math.min(5,Math.abs(me.tx-me.x));me.hit=Math.max(0,me.hit-.04);op.hit=Math.max(0,op.hit-.04);st.pop=Math.max(0,st.pop-.02);
    let target=570;if(ball.live&&ball.vx>0)target=Math.max(NET+30,Math.min(730,landX()));op.x+=Math.sign(target-op.x)*Math.min(3.5,Math.abs(target-op.x));
    if(ball.live&&ball.last!=='op'&&!op.miss&&ball.x>NET&&Math.abs(ball.x-op.x)<40&&ball.y>FLOOR-125&&ball.y<FLOOR-20){if(Math.random()<Math.max(.6,.88-st.rally*.02)){ball.last='op';op.hit=1;launch(ball.x,ball.y,50+Math.random()*290);st.rally++;}else op.miss=true;}}
   x.clearRect(0,0,760,420);const sky=x.createLinearGradient(0,0,0,420);sky.addColorStop(0,L.sky[0]);sky.addColorStop(1,L.sky[1]);x.fillStyle=sky;x.fillRect(0,0,760,420);
   x.fillStyle=L.night>.5?'#ffffffcc':'#fff6';for(let i=0;i<4;i++){const cx=(R.t*8+i*230)%900-60;x.beginPath();x.ellipse(cx,60+i*18,50,12,0,0,Math.PI*2);x.fill();}
   for(let i=0;i<11;i++){x.fillStyle=i%2?'#3f8f5a':'#4fa868';x.beginPath();x.arc(i*80-10,FLOOR-38+(i%3)*6,48,0,Math.PI*2);x.fill();}
   const sand=x.createLinearGradient(0,FLOOR,0,420);sand.addColorStop(0,'#e3a06f');sand.addColorStop(1,'#c98552');x.fillStyle=sand;x.fillRect(0,FLOOR,760,60);x.fillStyle='#fff';x.fillRect(15,FLOOR,730,3);x.fillRect(15,FLOOR,3,10);x.fillRect(742,FLOOR,3,10);
   x.fillStyle='#6b6f7e';x.fillRect(NET-3,NETTOP,6,FLOOR-NETTOP);x.strokeStyle='#ffffffcc';x.lineWidth=1;for(let y=NETTOP;y<=NETTOP+60;y+=10){x.beginPath();x.moveTo(NET-16,y);x.lineTo(NET+16,y);x.stroke();}for(let xx=NET-16;xx<=NET+16;xx+=8){x.beginPath();x.moveTo(xx,NETTOP);x.lineTo(xx,NETTOP+60);x.stroke();}x.fillStyle='#fff';x.fillRect(NET-17,NETTOP-2,34,4);
   if(ball.live){const lx=landX();x.fillStyle=lx<NET?'rgba(228,109,109,.7)':'rgba(255,255,255,.55)';x.beginPath();x.ellipse(lx,FLOOR+4,18,5,0,0,Math.PI*2);x.fill();x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(ball.x,FLOOR+3,10*(1-Math.min(.6,(FLOOR-ball.y)/400)),3,0,0,Math.PI*2);x.fill();}
   fig(me.x,pal(),me.hit,1);fig(op.x,opK,op.hit,-1);
   const bx=ball.live?ball.x:(st.serve==='me'?me.x:op.x),by=ball.live?ball.y:FLOOR-110;if(ball.live||st.wait>0){x.save();x.translate(bx,by);x.rotate(ball.spin);x.beginPath();x.arc(0,0,11,0,Math.PI*2);x.fillStyle='#fff';x.fill();x.strokeStyle='#f2a93b';x.lineWidth=2.5;x.beginPath();x.arc(0,0,11,-.6,.9);x.stroke();x.strokeStyle='#3d8bf5';x.beginPath();x.arc(0,0,11,2.2,3.6);x.stroke();x.restore();}
   x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.roundRect?x.roundRect(14,12,300,30,15):x.rect(14,12,300,30);x.fill();x.fillStyle='#241d33';x.font='800 15px '+FONT;x.fillText(st.msg||(st.serve==='me'&&!ball.live?'Seu saque':' '),28,33);
   if(st.pop>0){x.save();x.globalAlpha=st.pop;x.font='900 '+(40+st.pop*20)+'px '+FONT;x.textAlign='center';x.fillStyle='#fff';x.strokeStyle='#241d33';x.lineWidth=4;const t=st.me+' × '+st.op;x.strokeText(t,380,140);x.fillText(t,380,140);x.restore();}
   if(M===tok)M.raf=requestAnimationFrame(loop);}
  M.raf=requestAnimationFrame(loop);}

 /* ---------- garrinha ---------- */
 function claw(){const {mc,ctx:x}=miniOpen('🕹 Garrinha','Segure o botão do mouse (ou espaço) para levar a garra para a direita e solte para parar. Segure de novo para levar ao fundo e solte: a garra desce e tenta pegar. Use a vista de cima para acertar a profundidade.');
  const items=Array.from({length:8},(_,i)=>{const t=PRIZES[Math.floor(Math.random()*PRIZES.length)];return {t,x:230+i*48+Math.random()*20,z:Math.random()*2};}).sort((a,b)=>b.z-a.z);
  const st={phase:'x',hold:false,cx:170,cz:0,cy:70,got:null,slipAt:null,over:false,msg:'Segure para mover →',lights:0};M={raf:0,items,st};const tok=M;score('');
  const down=()=>{if(!st.over)st.hold=true;},up=()=>{if(!st.hold)return;st.hold=false;if(st.phase==='x'){st.phase='zwait';st.msg='Segure para mover ao fundo ↗';}else if(st.phase==='z'){st.phase='down';st.msg='Descendo...';}};
  mc.onpointerdown=()=>{if(st.phase==='zwait')st.phase='z';down();};mc.onpointerup=up;window.onkeydown=e=>{if(e.code==='Space'){e.preventDefault();if(st.phase==='zwait')st.phase='z';down();}};window.onkeyup=e=>{if(e.code==='Space')up();};
  const yOf=z=>334-z*22,sOf=z=>1-z*.15;
  function loop(){st.lights+=.08;if(st.phase==='x'&&st.hold)st.cx=Math.min(610,st.cx+2.6);if(st.phase==='z'&&st.hold)st.cz=Math.min(2.2,st.cz+.022);
   if(st.phase==='down'){st.cy+=3;const bottom=yOf(st.cz)-30;if(st.cy>=bottom){st.cy=bottom;let best=null;for(const it of items){const d=Math.hypot(it.x-st.cx,(it.z-st.cz)*42);if(d<it.t.tol&&(!best||d<best.d))best={it,d};}
     if(best){st.got=best.it;const slip=.18+best.d/best.it.t.tol*.45;st.slipAt=Math.random()<slip?.3+Math.random()*.6:null;st.msg='Pegou alguma coisa...';}else st.msg='Nada...';st.phase='up';}}
   else if(st.phase==='up'){st.cy-=3;if(st.got){st.got.x=st.cx;st.got.z=st.cz;}if(st.cy<=70){st.cy=70;st.phase='back';}}
   else if(st.phase==='back'){const k=(st.cx-150)/460;st.cx=Math.max(150,st.cx-2.6);st.cz=Math.max(0,st.cz-.02);if(st.got){st.got.x=st.cx;st.got.z=st.cz;if(st.slipAt!=null&&k<st.slipAt){st.got.drop=true;st.got=null;st.msg='Ih, escapou!';Amb.pop();}}
    if(st.cx<=150&&st.cz<=0){st.phase='done';finishClaw();}}
   for(const it of items)if(it.drop){it.dy=(it.dy||0)+.5;it.fall=(it.fall||0)+it.dy;if(it.fall>yOf(it.z)-st.cy-10){it.drop=false;it.fall=0;it.dy=0;}}
   x.clearRect(0,0,760,420);const bg=x.createLinearGradient(0,0,0,420);bg.addColorStop(0,'#2d2350');bg.addColorStop(1,'#1b1530');x.fillStyle=bg;x.fillRect(0,0,760,420);
   x.fillStyle='#ff6b9a';x.fillRect(90,10,560,400);x.fillStyle='#d84a7c';x.fillRect(90,380,560,30);
   for(let i=0;i<22;i++){const on=Math.floor(st.lights+i)%2;x.fillStyle=on?'#fff7a8':'#c84a7c';x.beginPath();x.arc(104+i*25.5,22,4,0,Math.PI*2);x.fill();}
   const glass=x.createLinearGradient(0,40,0,370);glass.addColorStop(0,'#e8f7ff');glass.addColorStop(1,'#bfe3f5');x.fillStyle=glass;x.fillRect(110,40,520,330);x.fillStyle='#a8d4ea';x.fillRect(110,300,520,70);
   x.fillStyle='#2d2a4a';x.fillRect(120,304,72,66);x.fillStyle='#fff';x.font='800 11px '+FONT;x.fillText('SAÍDA ↓',128,296);
   for(const it of items){if(it===st.got)continue;const s=sOf(it.z),yy=yOf(it.z)+(it.drop?(it.fall||0):0);x.fillStyle='rgba(0,0,0,.15)';x.beginPath();x.ellipse(it.x,yOf(it.z)+2,it.t.r*s,4*s,0,0,Math.PI*2);x.fill();prize(it.x,yy-it.t.r*s,it.t.id,it.t.r*s,x);}
   const s=sOf(st.cz);x.strokeStyle='#6b6f7e';x.lineWidth=3;x.beginPath();x.moveTo(st.cx,40);x.lineTo(st.cx,st.cy);x.stroke();x.fillStyle='#9aa3b5';x.fillRect(st.cx-14*s,st.cy-8,28*s,10);x.fillStyle='#6b6f7e';x.fillRect(110,36,520,6);x.fillRect(st.cx-12,32,24,10);
   const open=['down','x','z','zwait'].includes(st.phase);x.lineWidth=4;x.strokeStyle='#9aa3b5';x.beginPath();x.moveTo(st.cx-10*s,st.cy+2);x.lineTo(st.cx-(open?20:9)*s,st.cy+22*s);x.moveTo(st.cx+10*s,st.cy+2);x.lineTo(st.cx+(open?20:9)*s,st.cy+22*s);x.stroke();
   if(st.got)prize(st.cx,st.cy+18*s+st.got.t.r*s*.6,st.got.t.id,st.got.t.r*s,x);
   x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.moveTo(130,40);x.lineTo(190,40);x.lineTo(150,300);x.lineTo(110,300);x.fill();
   x.fillStyle='#fff';x.fillRect(660,50,92,74);x.strokeStyle='#2d2a4a';x.lineWidth=1;x.strokeRect(660,50,92,74);x.fillStyle='#fff';x.font='800 9px '+FONT;x.fillText('VISTA DE CIMA',664,44);
   for(const it of items){if(it===st.got)continue;x.beginPath();x.arc(662+(it.x-110)/520*88,120-it.z/2.2*66,3.4,0,Math.PI*2);x.fillStyle=it.t.col;x.fill();}
   x.strokeStyle='#e46d6d';x.lineWidth=2;x.beginPath();x.arc(662+(st.cx-110)/520*88,120-st.cz/2.2*66,6,0,Math.PI*2);x.stroke();
   x.fillStyle='#fff';x.font='800 15px '+FONT;x.fillText(st.msg,120,32+0);if(M===tok)M.raf=requestAnimationFrame(loop);}
  function finishClaw(){st.over=true;const won=st.got;let text;if(won){items.splice(items.indexOf(won),1);st.got=null;}st.msg=won?'Pegou! Caiu na saída.':'Não foi desta vez.';
   if(won){const L=life(),dup=(L.collection||[]).includes(won.t.id);save({collection:[...(L.collection||[]),won.t.id]});diary('🧸','Ganhou '+won.t.name+' na garrinha'+(dup?' (repetido)':'')+'!');Amb.heart();text='Você pegou: '+won.t.name+'!'+(dup?' (repetido)':' Vai para a estante da sala.');}else text='Não foi desta vez. A garra parecia tão perto...';
   miniEnd(text,[{t:'🕹 Tentar de novo · R$ 5',fn:()=>{if(api.get().cash<5){toast('Dinheiro insuficiente.');return;}miniClose();if(spend(5)){advance(5);claw();}}},{t:'Sair',fn:miniClose}]);}
  M.raf=requestAnimationFrame(loop);}

 /* gancho de teste: avança a visita sem depender do requestAnimationFrame */
 const debug={state:()=>R,step:(sec=1)=>{for(let i=0;i<sec*20&&R;i++){R.t+=.05;if(!R.mini)update(.05);}if(R)draw();},click:(cx,cy)=>{const k=R.view,r=cv.getBoundingClientRect();onClick({clientX:r.left+(cx+k.ox)*k.s,clientY:r.top+(cy+k.oy)*k.s});},P,
  mini:(kind,opp)=>{if(M)miniClose();({pool,volley,claw})[kind](opp||'Téo');},closeMini:()=>miniClose(),M:()=>M,go,bedroomDoor,phone:callMom,openPhone,invite,petCat,waterPlant,setMin:m=>{R.min=m;R.light=light(m);}};
 return {open,close,isOpen:()=>!!R,debug};
})();
if(typeof module!=='undefined')module.exports=Town;
