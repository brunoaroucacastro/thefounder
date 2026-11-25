/* Bairro do fim de semana (0.85): vida fora da startup, em clima cozy.
   Casa, rua com praça, Bar da Praça e Galeria do Bairro em isométrico vetorial, com luz que muda ao longo do dia.
   Conversas com retrato, amizades, celular (mãe, convites e loja online), gato, planta, diário do dia e três minigames.
   Só altera a partida via api.act({type:'life'|'weekendSales', ...}); o resto é estado local da visita. */
const Town=(()=>{
 const TX=30,TY=15,TZ=34;
 const P=(x,y,z=0)=>[x*16,y*16-z*12];
 const inv=(sx,sy)=>[sx/16,sy/16];
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
 const KEYS=[[600,{sky:['#8fd0f5','#e3f4fb'],tint:[255,255,255,0],night:0}],[930,{sky:['#8fd0f5','#e3f4fb'],tint:[255,255,255,0],night:0}],[1000,{sky:['#a3d0ec','#fbecd0'],tint:[255,214,150,.06],night:0}],[1060,{sky:['#f4a970','#fddcb8'],tint:[255,160,70,.14],night:0}],[1140,{sky:['#6f62b0','#f09a86'],tint:[90,60,140,.24],night:.5}],[1230,{sky:['#1d2350','#3a3f7a'],tint:[20,25,70,.44],night:1}],[1400,{sky:['#141a3e','#2d3266'],tint:[15,18,55,.5],night:1}]];
 function light(min){let a=KEYS[0],b=KEYS[KEYS.length-1];for(let i=0;i<KEYS.length-1;i++)if(min>=KEYS[i][0]&&min<=KEYS[i+1][0]){a=KEYS[i];b=KEYS[i+1];break;}
  const t=b[0]===a[0]?0:(min-a[0])/(b[0]-a[0]),A=a[1],B=b[1];
  return {sky:[mix(A.sky[0],B.sky[0],t),mix(A.sky[1],B.sky[1],t)],tint:A.tint.map((v,i)=>v+(B.tint[i]-v)*t),night:A.night+(B.night-A.night)*t,dusk:Math.max(0,1-Math.abs(min-1080)/170)};}

 /* ---------- primitivas ---------- */
 let c;
 function path(pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
 function poly(pts,fill,stroke,lw=1){path(pts);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineJoin='round';c.stroke();}}
 const fY=(y,x0,x1,z0,z1)=>[P(x0,y,z0),P(x1,y,z0),P(x1,y,z1),P(x0,y,z1)];
 const fX=(x,y0,y1,z0,z1)=>[P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)];
 const fZ=(z,x0,x1,y0,y1)=>[P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];
 function box(x,y,z,w,d,h,col,o={}){const st=o.stroke===false?null:(o.line||dk(col,.45));
  poly(fY(y+d,x,x+w,z,z+h),o.left||lit(col,.04),st);poly(fX(x+w,y,y+d,z,z+h),o.right||dk(col,.2),st);poly(fZ(z+h,x,x+w,y,y+d),o.top||lit(col,.2),st);
  if(st&&o.hi!==false&&h>.03)line([P(x,y+d,z+h),P(x+w,y+d,z+h),P(x+w,y,z+h)],'rgba(255,250,235,.34)',1);}
 // traço solto, sombra de contato no chão (em coordenadas do mundo) e elipse com contorno
 function line(pts,col,lw=1){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';c.stroke();}
 function shade(x,y,r,a=.16){const [sx,sy]=P(x,y),rr=r*TX*1.42;c.save();c.translate(sx,sy);c.scale(1,.5);const g=c.createRadialGradient(0,0,0,0,0,rr);g.addColorStop(0,'rgba(24,14,40,'+a+')');g.addColorStop(.55,'rgba(24,14,40,'+a*.6+')');g.addColorStop(1,'rgba(24,14,40,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,rr,0,Math.PI*2);c.fill();c.restore();}
 function oval(x,y,rx,ry,fill,stroke,lw=1,rot=0){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function circle(x,y,r,fill,stroke,lw=1){c.beginPath();c.arc(x,y,Math.max(.1,r),0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function ellipse(x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
 function rrect(x,y,w,h,r,fill,stroke,lw=1.5){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function glow(x,y,r,col,a=1){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=a;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.restore();}
 function label(x,y,text,o={}){c.font=(o.weight||800)+' '+(o.size||11)+'px '+FONT;const w=c.measureText(text).width+16;c.save();c.globalAlpha=o.alpha??1;c.shadowColor='rgba(0,0,0,.2)';c.shadowOffsetY=2;rrect(x-w/2,y-11,w,22,11,o.bg||'#fff');c.shadowColor='transparent';if(o.border)rrect(x-w/2,y-11,w,22,11,null,o.border);c.fillStyle=o.color||'#241d33';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y+.5);c.restore();c.textAlign='left';c.textBaseline='alphabetic';}
 function emoji(x,y,ch,size=14,a=1){c.save();c.globalAlpha=a;c.font=size+'px "Segoe UI Emoji","Apple Color Emoji",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(ch,x,y);c.restore();}

 /* ---------- gente ---------- */
 // k: shirt, pants, skin, hair, style ('short'|'long'|'bun'|'cap'|'curly'|'bald'), trim, hood, apron
 function person(sx,sy,k,t,o={}){const walking=!!o.walking,face=o.face||1,s=o.scale||1.12;c.save();c.translate(sx,sy);c.scale(s*face,s);
  const shirt=k.shirt||'#5e6ad2',skin=k.skin||'#edbd97',pants=k.pants||'#2d2a4a',ink=dk(shirt,.5),sk=dk(skin,.4),hair=k.hair||'#3b2a2a',hd=dk(hair,.4),st=k.style||'short';
  ellipse(0,0,12,4.8,'rgba(20,12,30,.14)');ellipse(0,0,8,3.1,'rgba(20,12,30,.18)');const sw=walking?Math.sin(t*11):0,bob=walking?Math.abs(Math.sin(t*11))*1.5:Math.sin(t*2.2)*.6;
  // pernas e tênis arredondados
  for(const [lx,dir] of [[-6,1],[1,-1]]){const ox=sw*1.8*dir,lift=walking?Math.max(0,sw*dir)*2.2:0;rrect(lx+ox,-17-bob,5,15+bob-lift,2,pants,dk(pants,.45),.8);rrect(lx+ox-.5,-3.8-lift,6.8,4,1.9,k.shoes||'#2a2233');c.fillStyle='rgba(255,255,255,.55)';c.fillRect(lx+ox+.2,-1.1-lift,5.6,.9);}
  c.translate(0,-bob);
  const arm=(side,rot,shadeArm)=>{c.save();c.translate(side*8,-32);c.rotate(side*(.22+sw*.25*side)+rot);rrect(-2.6,0,5.2,14,2.6,shadeArm?dk(shirt,.14):shirt,ink,.8);circle(0,15,2.7,skin,sk,.7);c.restore();};
  arm(-1,o.wave?-2.3+Math.sin(t*10)*.3:0,true);
  // tronco com sombra lateral, brilho e barra
  rrect(-8.5,-35,17,21.5,6.5,shirt);c.save();rrect(-8.5,-35,17,21.5,6.5);c.clip();c.fillStyle=dk(shirt,.15);c.fillRect(-8.5,-35,4,22);c.fillStyle='rgba(255,255,255,.16)';c.fillRect(3.6,-33.5,2.6,11);c.fillStyle=dk(shirt,.22);c.fillRect(-9,-16.3,18,3);
  if(k.trim){c.fillStyle=k.trim;c.fillRect(-1.5,-35,3,19);}c.restore();rrect(-8.5,-35,17,21.5,6.5,null,ink,.9);
  if(k.apron){rrect(-6,-28,12,14.5,2,k.apron,dk(k.apron,.35),.7);c.fillStyle=dk(k.apron,.2);c.fillRect(-4,-23,8,1.1);line([[-5,-28],[-3.5,-34.5]],dk(k.apron,.1),1.4);line([[5,-28],[3.5,-34.5]],dk(k.apron,.1),1.4);}
  if(k.hood){c.beginPath();c.arc(0,-35.5,8.2,Math.PI,0);c.closePath();c.fillStyle=dk(shirt,.16);c.fill();c.strokeStyle=ink;c.lineWidth=.8;c.stroke();}
  arm(1,0,false);
  // pescoço e cabeça
  c.fillStyle=dk(skin,.14);c.fillRect(-2.4,-38,4.8,4);if(st!=='long')circle(-7.7,-43.2,2.1,skin,sk,.7);
  circle(0,-44,8.2,skin,sk,.9);
  c.fillStyle=hair;c.strokeStyle=hd;c.lineWidth=.8;
  if(st==='long'){c.beginPath();c.arc(0,-45,9,Math.PI*.95,Math.PI*2.05);c.lineTo(9,-34);c.quadraticCurveTo(7,-32.5,5,-34);c.lineTo(5,-44);c.lineTo(-6,-44);c.lineTo(-7,-34);c.quadraticCurveTo(-8.5,-32.5,-9.5,-34);c.closePath();c.fill();c.stroke();}
  else if(st==='bun'){c.beginPath();c.arc(-1,-55,4.5,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(0,-46,8.6,Math.PI,Math.PI*2);c.closePath();c.fill();c.stroke();}
  else if(st==='curly'){for(let i=0;i<7;i++){c.beginPath();c.arc(-7+i*2.3,-50+Math.sin(i*1.7)*1.5,3.8,0,Math.PI*2);c.fill();c.stroke();}for(let i=0;i<7;i++){c.beginPath();c.arc(-7+i*2.3,-49.4+Math.sin(i*1.7)*1.5,3.2,0,Math.PI*2);c.fill();}c.fillStyle=lit(hair,.2);for(let i=1;i<6;i+=2){c.beginPath();c.arc(-6.4+i*2.3,-51.5,1.1,0,Math.PI*2);c.fill();}}
  else if(st==='cap'){const cap=k.cap||'#e46d6d';c.fillStyle=hair;c.fillRect(-8,-45.5,5,3.4);c.fillStyle=cap;c.strokeStyle=dk(cap,.45);c.beginPath();c.arc(0,-46,8.7,Math.PI,Math.PI*2);c.closePath();c.fill();c.stroke();rrect(1.5,-47.4,11,3,1.5,dk(cap,.12),dk(cap,.45),.7);circle(0,-54.6,1.2,lit(cap,.3));}
  else if(st!=='bald'){c.beginPath();c.arc(0,-45.5,8.7,Math.PI*1.02,Math.PI*1.98);c.lineTo(8,-42);c.lineTo(6,-46.5);c.quadraticCurveTo(0,-48.5,-6,-46);c.lineTo(-8,-42);c.closePath();c.fill();c.stroke();}
  else{c.beginPath();c.arc(-5.6,-43.6,3.2,Math.PI*.55,Math.PI*1.6);c.fill();c.fillStyle=lit(skin,.3);c.beginPath();c.ellipse(-1.5,-49.2,3.2,1.8,-.3,0,Math.PI*2);c.fill();}
  if(st==='short'||st==='long'||st==='bun'){c.strokeStyle=lit(hair,.24);c.lineWidth=1.3;c.lineCap='round';c.beginPath();c.arc(.5,-46,6,Math.PI*1.25,Math.PI*1.6);c.stroke();c.lineCap='butt';}
  // rosto (olha para o lado em que anda)
  const blink=(Math.sin(t*.9+(k.seed||0))>.985)?.4:2.3;rrect(1.2,-45.2,2,blink,1,'#2a1f2e');rrect(5,-45.2,2,blink,1,'#2a1f2e');
  if(blink>1){c.fillStyle='#fff';c.fillRect(2.1,-44.8,.8,.8);c.fillRect(5.9,-44.8,.8,.8);}
  c.fillStyle='rgba(240,120,120,.38)';c.beginPath();c.arc(1.2,-41,1.8,0,Math.PI*2);c.fill();c.beginPath();c.arc(7.2,-41,1.6,0,Math.PI*2);c.fill();
  c.strokeStyle='#7a3a3a';c.lineWidth=.9;c.lineCap='round';c.beginPath();c.arc(4.4,-41.3,1.6,.2,Math.PI-.2);c.stroke();c.lineCap='butt';
  c.restore();}
 // retrato grande para o diálogo, em pixel art: o mesmo sprite do bairro visto de perto (20×20 pixels de arte ampliados)
 function portrait(cv2,k,mood){const x=cv2.getContext('2d'),W=cv2.width,H=cv2.height,S2=Math.max(1,Math.floor(Math.min(W,H)/20)),[pc,pg]=mkc(20,20),bg=lit(k.shirt||'#7b5cd6',.62);
  F(0,0,20,20,bg,pg);for(let y=0;y<20;y+=4)for(let xx=(y/4)%2*2;xx<20;xx+=4)F(xx,y,1,1,lit(bg,.35),pg);F(0,17,20,3,lit(k.shirt||'#7b5cd6',.35),pg);
  pg.drawImage(charSprite(k,'down',0),1,2);if(mood==='happy')for(const [a2,b,w] of [[14,2,1],[16,2,1],[13,3,5],[14,4,3],[15,5,1]])F(a2,b,w,1,'#e46d8c',pg);
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);x.imageSmoothingEnabled=false;x.drawImage(pc,0,0,20*S2,20*S2);}
 // desenho dos prêmios (no tabuleiro 2D da garrinha e na prateleira de casa)
 function prize(x,y,id,r,ctx){const prev=c;if(ctx)c=ctx;const p=PRIZES.find(q=>q.id===id)||PRIZES[0];
  if(id==='chaveiro'){rrect(x-r,y-r,r*2,r*2,r*.35,'#fff7ea','#c47d1f',1.4);for(const [a,b] of [[-.45,-.45],[.45,.45],[0,0],[-.45,.45],[.45,-.45]])circle(x+a*r,y+b*r,r*.14,'#c2453f');circle(x,y-r*1.25,r*.35,null,'#9aa3b5',1.6);}
  else if(id==='gato'){circle(x,y,r,p.col);c.fillStyle=p.col;c.beginPath();c.moveTo(x-r*.9,y-r*.3);c.lineTo(x-r*.75,y-r*1.25);c.lineTo(x-r*.2,y-r*.85);c.fill();c.beginPath();c.moveTo(x+r*.9,y-r*.3);c.lineTo(x+r*.75,y-r*1.25);c.lineTo(x+r*.2,y-r*.85);c.fill();
   circle(x-r*.35,y-r*.1,r*.12,'#fff');circle(x+r*.35,y-r*.1,r*.12,'#fff');circle(x,y+r*.18,r*.1,'#ff9fb2');}
  else if(id==='pato'){ellipse(x,y+r*.25,r*1.05,r*.7,p.col);circle(x+r*.35,y-r*.45,r*.55,p.col);c.fillStyle='#f2a93b';c.beginPath();c.moveTo(x+r*.8,y-r*.5);c.lineTo(x+r*1.3,y-r*.35);c.lineTo(x+r*.8,y-r*.25);c.fill();circle(x+r*.45,y-r*.6,r*.1,'#241d33');}
  else if(id==='fone'){c.strokeStyle='#3a2f63';c.lineWidth=r*.28;c.beginPath();c.arc(x,y,r*.85,Math.PI*1.05,Math.PI*1.95);c.stroke();rrect(x-r*1.05,y-r*.1,r*.55,r*.95,r*.2,p.col);rrect(x+r*.5,y-r*.1,r*.55,r*.95,r*.2,p.col);}
  else if(id==='robo'){rrect(x-r*.8,y-r*.7,r*1.6,r*1.4,r*.3,p.col,'#6b6f7e',1.2);circle(x-r*.35,y-r*.1,r*.2,'#7fe7ff');circle(x+r*.35,y-r*.1,r*.2,'#7fe7ff');c.fillStyle='#6b6f7e';c.fillRect(x-r*.05,y-r*1.2,r*.1,r*.5);circle(x,y-r*1.25,r*.16,'#e46d6d');}
  if(id==='gato'||id==='pato'){c.strokeStyle=dk(p.col,.35);c.lineWidth=Math.max(.6,r*.08);c.beginPath();c.arc(x,id==='pato'?y+r*.25:y,id==='pato'?r*.9:r,Math.PI*.1,Math.PI*.9);c.stroke();}
  circle(x-r*.38,y-r*.42,r*.17,'rgba(255,255,255,.6)');
  c=prev;}

 /* ---------- cenas ---------- */
 let R=null,api=null;
 /* ---------- pixel art 2D (0.86): vista de cima em 3/4, tiles de 16 pixels de arte ----------
    As coordenadas do mundo continuam em tiles, as mesmas de antes (rotas, portas e pontos clicáveis não mudam).
    P converte para pixels de arte; a altura (z) sobe na tela. Tudo é desenhado numa tela pequena e ampliado sem suavizar. */
 const TT=16,ZH=12,WALL=40;
 let g=null,LOW=null,DARK=null;
 const mkc=(w,h)=>{const k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');x.imageSmoothingEnabled=false;return [k,x];};
 const hsh=(x,y,s=0)=>{let h=(x*374761393+y*668265263+s*1442695041)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;};
 function F(x,y,w,h,col,ctx=g){if(!(w>0&&h>0))return;const x0=Math.round(x),y0=Math.round(y),x1=Math.round(x+w),y1=Math.round(y+h);if(x1<=x0||y1<=y0)return;ctx.fillStyle=col;ctx.fillRect(x0,y0,x1-x0,y1-y0);}
 function O(cx,cy,rx,ry,col,ctx=g){ctx.fillStyle=col;cx=Math.round(cx);cy=Math.round(cy);rx=Math.round(rx);ry=Math.round(ry);for(let dy=-ry;dy<=ry;dy++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(dy/(ry+.5))**2)));ctx.fillRect(cx-w,cy+dy,w*2+1,1);}}
 function outl(k,col){const x=k.getContext('2d'),w=k.width,h=k.height,d=x.getImageData(0,0,w,h),a=d.data,s=new Uint8Array(w*h),q=rgb(col);
  for(let i=0;i<w*h;i++)s[i]=a[i*4+3]>140?1:0;
  for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){const i=y*w+xx;if(s[i])continue;if((xx>0&&s[i-1])||(xx<w-1&&s[i+1])||(y>0&&s[i-w])||(y<h-1&&s[i+w])){a[i*4]=q[0];a[i*4+1]=q[1];a[i*4+2]=q[2];a[i*4+3]=255;}}
  x.putImageData(d,0,0);}
 const MEMO={};
 function memo(key,w,h,paint,line){let m=MEMO[key];if(m)return m;const [k,x]=mkc(w+2,h+2);x.translate(1,1);paint(x);if(line!==false)outl(k,line||'#33263a');return (MEMO[key]=k);}
 // caixa vista de cima em 3/4: tampo e frente
 function B(x,y,z,w,d,h,col,o={},ctx=g){const x0=x*TT,x1=(x+w)*TT,top=y*TT-(z+h)*ZH,mid=(y+d)*TT-(z+h)*ZH,bot=(y+d)*TT-z*ZH,tp=o.top||lit(col,.18);
  F(x0,top,x1-x0,mid-top,tp,ctx);F(x0,mid,x1-x0,bot-mid,o.front||col,ctx);
  if(o.edge!==false){F(x0,mid,x1-x0,1,lit(tp,.25),ctx);F(x0,bot-1,x1-x0,1,dk(o.front||col,.3),ctx);F(x0,top,1,bot-top,dk(col,.3),ctx);F(x1-1,top,1,bot-top,dk(col,.35),ctx);F(x0,top,x1-x0,1,dk(tp,.25),ctx);}}
 const modeOf=L=>L.night>.55?'noite':(L.dusk>.35||L.tint[3]>.1)?'tarde':'dia';
 const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];

 /* ---------- chão ---------- */
 function tile(x2,type,x,y){const px=x*TT,py=y*TT,h=k=>hsh(x,y,k),rx=k=>Math.floor(h(k)*16),R2=(a,b,w,hh,col)=>F(a,b,w,hh,col,x2);
  if(type==='grass'){R2(px,py,TT,TT,'#6aa457');for(let k=0;k<7;k++)R2(px+rx(k),py+rx(k+20),1+(k%2),1,'#5c964b');
   for(let k=0;k<4;k++){const a=Math.min(14,rx(k+40)),b=Math.min(13,rx(k+60));R2(px+a,py+b,1,2,'#86c06a');R2(px+a+1,py+b+1,1,1,'#86c06a');}
   if(h(99)<.1){const a=3+Math.floor(h(98)*10),b=3+Math.floor(h(97)*10),c2=['#fff6e8','#ffd85e','#ff9fb6'][Math.floor(h(96)*3)];R2(px+a,py+b-1,1,1,c2);R2(px+a-1,py+b,3,1,c2);R2(px+a,py+b+1,1,1,c2);R2(px+a,py+b,1,1,'#f2a93b');}}
  else if(type==='stone'){R2(px,py,TT,TT,'#cdbf9f');for(const yy of [0,8]){R2(px,py+yy,TT,1,'#ad9e80');R2(px,py+yy+1,TT,1,'#ddd1b5');R2(px+(yy?8:0),py+yy,1,8,'#ad9e80');}for(let k=0;k<3;k++)R2(px+rx(k),py+rx(k+9),1,1,'#bcae8f');}
  else if(type==='road'){R2(px,py,TT,TT,'#5e6070');for(let k=0;k<7;k++)R2(px+rx(k),py+rx(k+9),1,1,k%2?'#6b6d7e':'#535565');}
  else if(type==='plaza'){R2(px,py,TT,TT,'#b98f66');for(let r=0;r<4;r++){const yy=py+r*4,o=(r+y)%2?4:0;for(let c2=-1;c2<2;c2++){const x0=Math.max(px,px+o+c2*8),x1=Math.min(px+16,px+o+c2*8+7),tone=hsh(x*4+c2,y*4+r,3)<.5?'#d8b48a':'#cfa87d';R2(x0,yy,x1-x0,3,tone);R2(x0,yy,x1-x0,1,lit(tone,.18));}}}
  else if(type==='clay'){R2(px,py,TT,TT,'#d9895c');for(let k=0;k<8;k++)R2(px+rx(k),py+rx(k+9),1,1,k%3?'#c97a4f':'#e8a274');}
  else if(type==='wood'||type==='darkwood'){const base=type==='wood'?'#b47e4e':'#7a4a33',alt=dk(base,.06),seam=dk(base,.3),hl=lit(base,.12);R2(px,py,TT,TT,base);
   for(let r=0;r<4;r++){const yy=py+r*4;R2(px,yy,TT,3,hsh(x,y*4+r,4)<.5?base:alt);R2(px,yy,TT,1,hl);R2(px,yy+3,TT,1,seam);R2(px+((Math.floor(hsh(x,y*4+r,5)*3))*5+((y*4+r)%2)*3)%16,yy,1,3,seam);}}
  else if(type==='kitchen'){R2(px,py,TT,TT,(x+y)%2?'#ece6da':'#ddd5c6');R2(px,py,TT,1,'#c9bfae');R2(px,py,1,TT,'#c9bfae');}
  else if(type==='check'){R2(px,py,TT,TT,(x+y)%2?'#efebf4':'#ddd6e8');R2(px+1,py+1,5,1,'#ffffff');}
  else R2(px,py,TT,TT,'#17141f');}
 function groundLayer(S,m){const key=S.id+m;if(S._gk===key)return S._gl;
  const [k,x2]=mkc(S.w*TT+64,S.h*TT+WALL+64);x2.translate(32,WALL+32);
  F(-32,-WALL-32,S.w*TT+64,S.h*TT+WALL+64,S.indoor?(S.warm?'#1a0f0b':'#17141f'):'#5b8f4f',x2);
  if(!S.indoor)for(let y=-2;y<S.h+2;y++)for(let x=-2;x<S.w+2;x++)tile(x2,(x<0||y<0||x>=S.w||y>=S.h)?'grass':S.tile(x,y),x,y);
  else for(let y=0;y<S.h;y++)for(let x=0;x<S.w;x++)tile(x2,S.tile(x,y),x,y);
  for(const s of S.shades||[])O(s[0],s[1],s[2],s[3],'rgba(28,30,40,'+s[4]+')',x2);
  if(S.decor){const pg=g;g=x2;S.decor(m);g=pg;}
  if(S.wall){const pg=g;g=x2;S.wall(m);g=pg;}
  S._gk=key;S._gl=k;return k;}
 // parede do fundo dos interiores (acima da linha y=0), laterais finas e a parede da frente
 function interior(S,col,trim,o={}){S.wall=m=>{const w=S.w*TT;
  F(0,-WALL,w,WALL,col);for(let x=4;x<w;x+=8)for(let y=-WALL+4;y<-14;y+=7)F(x+((y/7)&1)*4,y,1,1,dk(col,.1));
  if(o.wains){F(0,-14,w,14,o.wains);for(let x=3;x<w;x+=8)F(x,-13,1,11,dk(o.wains,.22));F(0,-15,w,2,lit(o.wains,.25));}
  F(0,-3,w,3,trim);F(0,-WALL-3,w,3,dk(trim,.25));
  F(-6,-WALL-3,6,S.h*TT+WALL+9,dk(trim,.15));F(w,-WALL-3,6,S.h*TT+WALL+9,dk(trim,.15));F(0,S.h*TT,w,6,dk(trim,.15));
  F(-6,-WALL-3,6,2,lit(trim,.2));F(w,-WALL-3,6,2,lit(trim,.2));
  F(0,0,w,3,'rgba(30,18,30,.22)');F(0,0,3,S.h*TT,'rgba(30,18,30,.18)');
  for(const d of S.sideDoors||[]){F(-6,d.y*TT,6,d.d*TT,d.col||'#6b4529');F(-6,d.y*TT,6,1,lit(d.col||'#6b4529',.3));F(-2,d.y*TT+d.d*TT*.5,2,2,'#e2c26a');F(0,d.y*TT+1,5,d.d*TT-2,'rgba(140,110,80,.35)');}
  if(o.extra)o.extra(m);};}
 function wallWindow(x0,x1,m,curtain){const a=x0*TT,b=x1*TT,top=-WALL+6,h=22;
  F(a-2,top-2,b-a+4,h+4,'#f3ead7');const sky=m==='noite'?['#1d2350','#3a3f7a']:m==='tarde'?['#7a6fb8','#f2a48a']:['#8fd0f5','#e3f4fb'];
  for(let i=0;i<h;i++)F(a,top+i,b-a,1,mix(sky[0],sky[1],i/(h-1)));
  if(m==='noite'){F(b-10,top+3,3,3,'#fff6d8');for(const [p,q] of [[4,2],[10,6],[16,3]])F(a+p,top+q,1,1,'#fff');}else F(b-12,top+(m==='tarde'?12:4),4,4,m==='tarde'?'#ffb36b':'#fff1b0');
  for(let i=0;i<b-a;i+=3)F(a+i,top+h-5+((i*7)%4),3,5-((i*7)%4),m==='noite'?'#2b2550':'#6a78a8');
  F((a+b)/2-1,top,2,h,'#f3ead7');F(a,top+h/2,b-a,1,'#f3ead7');F(a-4,top+h+1,b-a+8,3,'#d8c9ad');
  if(curtain){for(const cx of [a-8,b+1]){F(cx,top-3,7,h+8,curtain);for(let k=1;k<7;k+=2)F(cx+k,top-3,1,h+8,dk(curtain,.2));}F(a-10,top-5,b-a+20,2,'#5a3b26');}}
 function frameOnWall(x,w,h,col,inner){F(x*TT,-WALL+8,w,h,'#8a6a4a');F(x*TT+1,-WALL+9,w-2,h-2,col);if(inner)inner(x*TT+1,-WALL+9);}

 function newScene(id,w,h,name){const S={id,w,h,name,items:[],hots:[],npcs:[],lamps:[],signs:[],shades:[],block:new Set(),tile:()=>'grass',decor:null,wall:null,indoor:true,warm:false};
  S.solid=(x,y,w2,d)=>{for(let i=Math.floor(x);i<x+w2;i++)for(let j=Math.floor(y);j<y+d;j++)S.block.add(i+','+j);};
  S.put=(x,y,w2,d,draw,solid=true,sort)=>{if(solid)S.solid(x,y,w2,d);S.items.push({sy:(sort??(y+d))*TT,draw});};
  S.box=(x,y,w2,d,h2,col,o={})=>{if(!o.z&&o.solid!==false)S.shades.push([(x+w2/2)*TT,(y+d)*TT,w2*8+2,3,.18]);S.put(x,y,w2,d,()=>B(x,y,o.z||0,w2,d,h2,col,o),o.solid!==false);};
  S.building=(x,y,w2,d,h2,col,o={})=>{S.solid(x,y,w2,d);const roof=o.roof||dk(col,.35),cw=w2*TT,rH=(d-2)*TT,top=8,fy=top+rH,brick=col==='#8c4a3c',glass=/Galeria/.test(o.sign||''),door=o.door&&o.door.face==='y'?o.door.at-x:null,dcol=o.door?.col||'#6b4529',chim=(x*13+y*7)%3;
   S.shades.push([(x+w2/2)*TT,(y+d)*TT+1,w2*8+3,4,.22]);
   for(let i=0;i<w2;i++)if(i!==door&&!glass)S.lamps.push({x:x+i+.5,y:y+d+.25,z:0,r:22,win:true,col:'rgba(255,190,90,.18)',k:(x*3+i*5)%4!==1});
   if(glass)for(let i=0;i<w2;i++)if(i!==door)S.lamps.push({x:x+i+.5,y:y+d+.3,z:0,r:26,win:true,col:'rgba(255,150,220,.2)',k:true});
   if(door!=null)S.lamps.push({x:x+door+.5,y:y+d+.4,z:0,r:30,win:true,col:'rgba(255,190,100,.22)',k:true});
   if(o.sign)S.signs.push({x:(x+w2/2)*TT,y:(y+d-2)*TT-6,text:o.sign,bg:o.signBg});
   const paint=(x2,m)=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
    // telhado em fiadas de telhas
    R2(0,top,cw,rH,dk(roof,.3));
    for(let r=0;r*4<rH;r++){const yy=top+r*4,tone=r<2?lit(roof,.14):r%3===0?dk(roof,.05):roof;for(let xx=-(r%2)*4;xx<cw;xx+=8){const x0=Math.max(0,xx+1),x1=Math.min(cw,xx+8);R2(x0,yy,x1-x0,3,tone);R2(x0,yy+2,x1-x0,1,dk(tone,.12));if(xx+2>=0)R2(xx+2,yy,2,1,lit(tone,.2));}}
    R2(0,top,cw,2,dk(roof,.4));R2(0,top+2,cw,1,lit(roof,.3));R2(0,top,1,rH,dk(roof,.45));R2(cw-1,top,1,rH,dk(roof,.45));
    if(chim===0&&cw>40){const cx=cw-22;R2(cx,0,9,top+9,'#9a7464');R2(cx,0,9,2,'#6e5246');R2(cx+6,2,3,top+7,'#7d5d50');}
    else if(chim===1&&cw>40){R2(8,top+3,12,6,'#cfd4da');R2(8,top+3,12,1,'#ffffff');R2(8,top+8,12,1,'#9aa3b5');}
    R2(0,fy-2,cw,2,dk(roof,.5));
    // fachada
    R2(0,fy,cw,32,col);
    if(brick){for(let r=0;r<8;r++){R2(0,fy+r*4+3,cw,1,dk(col,.22));for(let xx=(r%2)*4;xx<cw;xx+=8)R2(xx,fy+r*4,1,3,dk(col,.22));}}
    else if(!glass)for(let yy=fy+3;yy<fy+30;yy+=4){R2(0,yy,cw,1,dk(col,.1));R2(0,yy+1,cw,1,lit(col,.12));}
    R2(0,fy,cw,3,dk(col,.25));R2(0,fy,1,32,dk(col,.3));R2(cw-1,fy,1,32,dk(col,.3));R2(0,fy+29,cw,3,dk(col,.35));
    const night=m==='noite';
    if(glass){for(let i=0;i<w2;i++){if(i===door)continue;const xx=i*TT+1;R2(xx,fy+6,14,20,'#f3ead7');R2(xx+1,fy+7,12,18,night?'#f6c6e8':m==='tarde'?'#eab091':'#a9d8ec');if(!night){R2(xx+2,fy+8,4,1,'#ffffffaa');R2(xx+2,fy+9,1,4,'#ffffffaa');}R2(xx+3,fy+20,8,5,['#ff9fb2','#7b5cd6','#f2a93b','#5aa7d0'][i%4]);}}
    else for(let i=0;i<w2;i++){if(i===door)continue;const xx=i*TT+3,yy=fy+8,on=(x*3+i*5)%4!==1,gl=night?(on?'#ffd77a':'#2c3358'):m==='tarde'?'#eaa47c':'#8cc4e0';
     R2(xx-1,yy-1,12,13,'#f3ead7');R2(xx,yy,10,11,gl);if(night&&on)R2(xx,yy+7,10,4,'#f2b84f');else{const hl=m==='tarde'?'#ffd8b4':'#d6f0fb';R2(xx+1,yy+1,3,1,hl);R2(xx+1,yy+2,1,2,hl);}
     R2(xx+5,yy,1,11,'#f3ead7');R2(xx,yy+5,10,1,'#f3ead7');R2(xx-2,yy+12,14,2,'#cbbd9f');
     if(!o.awning&&(i===0||i===w2-1)&&!brick){R2(xx-1,yy+14,12,3,'#8a5d3e');for(let k=0;k<4;k++)R2(xx+k*3,yy+12,2,2,['#ff9fb2','#ffd85e','#fff6e8'][k%3]);}}
    if(door!=null){const xx=door*TT+3;R2(xx-1,fy+8,12,24,'#f3ead7');R2(xx,fy+9,10,23,dcol);R2(xx+2,fy+11,6,6,night?'#ffd77a':'#9fcfe3');R2(xx+2,fy+20,6,1,dk(dcol,.25));R2(xx+2,fy+24,6,1,dk(dcol,.25));R2(xx+7,fy+21,2,2,'#e2c26a');R2(xx-3,fy+30,16,2,'#a89a84');}
    if(o.awning){const a=o.awning,b='#fff6e8';for(let xx=0;xx<cw;xx+=4){const c2=(xx/4)%2?b:a;R2(xx,fy-1,4,6,c2);R2(xx+1,fy+5,2,2,c2);R2(xx,fy-1,4,1,lit(c2,.25));}R2(0,fy+7,cw,2,'rgba(30,20,40,.25)');}};
   S.items.push({sy:(y+d)*TT,draw:()=>{const m=modeOf(R.light),k=memo('b'+S.id+x+','+y+m,cw,d*TT+top,x2=>paint(x2,m),dk(roof,.55));g.drawImage(k,x*TT-1,y*TT-top-1);}});};
  S.hot=h=>{S.hots.push(h);return h;};
  S.free=(x,y)=>x>=0&&y>=0&&x<S.w&&y<S.h&&!S.block.has(x+','+y);
  return S;}
 function tree(S,x,y,big){S.shades.push([(x+.6)*TT,(y+.85)*TT,big?13:11,4,.3]);S.put(x,y,1,1,()=>{const f=Math.floor(R.t*1.2+x*.37+y*.61)%2,k=memo('tree'+(big?1:0)+f,32,46,x2=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
   R2(13,28,6,16,'#7a5232');R2(17,28,2,16,'#5e3e26');R2(11,42,10,3,'#6b4729');R2(14,33,1,4,'#94683f');
   for(const [a,b,r] of [[10,19,9],[22,19,9],[16,12,11],[16,21,8]])O(a+f,b,r,r,'#36693e',x2);
   for(const [a,b,r] of [[11,16,7],[21,15,7],[16,10,9]])O(a+f,b,r,r,'#4f9450',x2);
   for(const [a,b,r] of [[14,8,5],[20,12,4],[9,14,3]])O(a+f,b,r,r,'#6cb35d',x2);
   R2(13+f,5,3,1,'#93cf75');R2(19+f,9,2,1,'#93cf75');R2(8+f,12,2,1,'#93cf75');
   if(big)for(const [a,b] of [[9,19],[22,17],[17,22],[13,13]]){R2(a+f,b,2,2,'#f2a93b');R2(a+f,b,1,1,'#ffd27a');}});g.drawImage(k,x*TT-9,(y+1)*TT-47);});}
 function bench(S,x,y){S.shades.push([(x+.5)*TT,(y+.85)*TT,9,2,.22]);S.put(x,y,1,1,()=>{const k=memo('bench',18,20,x2=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
   R2(2,14,2,6,'#4b4f63');R2(14,14,2,6,'#4b4f63');R2(2,1,2,9,'#4b4f63');R2(14,1,2,9,'#4b4f63');R2(0,2,18,3,'#9c6a45');R2(0,6,18,3,'#9c6a45');R2(0,2,18,1,'#b8845a');R2(0,6,18,1,'#b8845a');
   R2(0,10,18,3,'#b47d4c');R2(0,13,18,2,'#9c6a45');R2(0,10,18,1,'#cf9a67');});g.drawImage(k,x*TT-2,(y+1)*TT-21);});}
 function lampPost(S,x,y){S.shades.push([(x+.5)*TT,(y+.85)*TT,4,2,.3]);S.put(x,y,1,1,()=>{const m=modeOf(R.light),k=memo('lamp'+m,10,40,x2=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
   R2(4,8,2,30,'#3b3f52');R2(5,8,1,30,'#555a70');R2(2,36,6,4,'#2f3344');R2(1,1,8,1,'#2f3344');R2(3,0,4,1,'#2f3344');R2(2,2,6,6,m==='noite'?'#fff1b0':m==='tarde'?'#f6e2b6':'#e9e4d2');R2(2,8,6,1,'#2f3344');R2(3,3,1,3,'#ffffff');});g.drawImage(k,x*TT+2,(y+1)*TT-42);});
  S.lamps.push({x:x+.5,y:y+.5,z:2.6,r:70,col:'rgba(255,214,140,.55)'});}
 function flowers(S,x,y,w,d){S.put(x,y,w,d,()=>{const k=memo('flw'+w+'x'+d,w*TT,d*TT+6,x2=>{const R2=(a,b,ww,hh,c2)=>F(a,b,ww,hh,c2,x2),W2=w*TT,H2=d*TT;
   R2(0,4,W2,H2-6,'#5c4030');R2(0,H2-2,W2,6,'#8a6a4a');R2(0,H2-2,W2,1,'#a3825c');R2(0,4,W2,1,'#a3825c');
   for(let i=0;i<w*4;i++)for(let j=0;j<d*2;j++){const fx=2+i*4-(i%2),fy=3+j*(H2-8)/(d*2)+(i%3)*2,c2=['#ff9fb2','#ffd85e','#fff6e8','#c9b6e4'][(i+j)%4];R2(fx-1,fy+2,4,2,'#4f9450');R2(fx,fy-1,2,1,c2);R2(fx-1,fy,4,2,c2);R2(fx,fy+2,2,1,c2);R2(fx,fy,2,1,'#f2a93b');}});g.drawImage(k,x*TT-1,y*TT-5);},true);}

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
 function buildHome(g0,L){const S=newScene('home',10,8,'Casa');S.tile=(x,y)=>x<=1&&y>=4?'kitchen':'wood';
  S.sideDoors=[{y:1.2,d:1,col:'#8a5d3e'}];
  interior(S,'#efe2cc','#8a6a4a',{wains:'#7d9b88',extra:m=>{
   wallWindow(4.2,6.6,m,'#c8553d');
   frameOnWall(3.3,12,10,'#5aa7d0',(a,b)=>{F(a,b+5,10,3,'#3f8f5a');F(a+6,b+1,3,3,'#ffe46b');});
   frameOnWall(2.3,9,12,'#ff9fb2',(a,b)=>F(a+2,b+3,3,4,'#fff6e8'));
   // relógio com a hora do passeio
   {const cx=1.1*TT,cy=-WALL+14;O(cx,cy,6,6,'#7a5a40');O(cx,cy,5,5,'#fffaf0');const hh=(R.min/60%12)/12*Math.PI*2;F(cx,cy-4,1,4,'#2a2133');F(cx+Math.round(Math.sin(hh)*2),cy-Math.round(Math.cos(hh)*2),1,1,'#c8553d');}
   // porta da rua na parede do fundo
   {const a=7.6*TT,top=-30;F(a-1,top-1,18,31,'#f3ead7');F(a,top,16,30,'#6b4529');F(a+3,top+3,10,8,m==='noite'?'#ffd77a':'#cfe6f2');F(a+12,top+16,2,2,'#e2c26a');}
   // azulejos e temperos sobre a bancada
   F(0,-14,1*TT,11,'#f7f2e8');for(let x=0;x<TT;x+=4)F(x,-14,1,11,'#d9cfbd');
   F(1,-22,14,2,'#9c6a45');[['#e46d6d',2],['#f2c14e',5],['#4fa868',8],['#5aa7d0',11]].forEach(([c2,x])=>F(x,-26,2,4,c2));}});
  S.decor=()=>{// tapete da sala e capacho
   const cozy=L.flags?.homeCozy,a=cozy?'#c8553d':'#7b85a8',b=cozy?'#e7a46d':'#9aa3c8';
   F(1*TT,1.4*TT,3.6*TT,2.2*TT,a);F(1*TT+3,1.4*TT+3,3.6*TT-6,2.2*TT-6,b);F(1*TT+6,1.4*TT+6,3.6*TT-12,2.2*TT-12,a);
   for(let i=0;i<4;i++)F(1*TT+10+i*13,1.4*TT+9,6,2.2*TT-18,lit(b,.25));
   for(let yy=1.4*TT+1;yy<3.6*TT-1;yy+=2){F(1*TT-2,yy,2,1,'#f2e3c8');F(4.6*TT,yy,2,1,'#f2e3c8');}
   F(7.5*TT,0,18,6,'#8a6a4a');for(let i=0;i<3;i++)F(7.5*TT+2,1+i*2,14,1,'#a3825c');
   // caminha do gato
   O(7.5*TT,4.5*TT+4,11,6,'#c8553d');O(7.5*TT,4.5*TT+3,8,4,'#e7a46d');};
  // TV e rack
  S.box(1,0,2,1,.45,'#5a3b26',{top:'#7a5238'});S.put(1,0,2,1,()=>{const x0=1.12*TT,y0=-0.45*ZH-18;F(x0,y0,30,18,'#1c1b26');F(x0+2,y0+2,26,13,R.tvOn?mix('#7fd0ff','#ffd77a',(Math.sin(R.t*3)+1)/2):'#26314a');if(!R.tvOn)F(x0+3,y0+3,6,1,'#3d4a68');F(x0+13,y0+18,4,2,'#1c1b26');},false,1.05);
  S.hot({id:'tv',x:1,y:0,w:2,d:1,h:1.4,label:'TV',stand:[2,1],use:()=>menu('TV',[{t:'📺 Assistir um pouco (+1h)',fn:watchTV},{t:'Deixar pra lá'}])});
  // estante com a coleção da garrinha
  S.box(0,2.6,.7,1.2,1.85,'#9c6a45',{top:'#b47d4c'});S.put(0,2.6,.7,1.2,()=>{const col=L.collection||[],top=2.6*TT-1.85*ZH;
   for(let i=0;i<Math.min(8,col.length);i++){const px=2+(i%2)*5,py=top+3+Math.floor(i/2)*5;prizePx(g,px+2,py+2,col[i],2);}
   if(!col.length){F(2,top+3,4,6,'#5e6ad2');F(6,top+5,3,4,'#e46d6d');F(3,top+12,6,4,'#f2a93b');}},false,3.81);
  S.hot({id:'shelf',x:0,y:2.6,w:.7,d:1.2,h:1.85,label:'Coleção',stand:[1,2],use:()=>say('Coleção',(L.collection||[]).length?'Prêmios da garrinha: '+[...new Set(L.collection)].map(id=>{const n=L.collection.filter(x=>x===id).length;return PRIZES.find(p=>p.id===id)?.name+(n>1?' ×'+n:'');}).join(', ')+'.':'A prateleira ainda está vazia. A garrinha da galeria está esperando você.')});
  // planta que cresce com os cuidados
  const pl=L.plant||{water:0},stage=Math.min(4,Math.floor((pl.water||0)/2));
  S.put(6,0,1,1,()=>{const k=memo('plant'+stage,16,30,x2=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
    R2(3,20,10,9,'#c9705a');R2(2,19,12,3,'#d98a72');R2(4,19,8,1,'#5a3b26');R2(11,22,2,7,'#b05e4a');
    const Ls=[[8,16,'#3f8f5a'],[5,14,'#4f9450'],[11,13,'#3f8f5a'],[8,10,'#5fbf74'],[4,9,'#4f9450'],[12,8,'#4f9450'],[8,5,'#5fbf74'],[6,3,'#4f9450']];
    Ls.slice(0,4+stage).forEach(([x,y,c2])=>{R2(x-1,y-2,2,5,c2);R2(x-2,y-1,4,3,c2);R2(x,y-2,1,2,lit(c2,.3));R2(x,y+2,1,3,'#3f7a45');});
    if(stage>=3){R2(11,4,3,3,'#ff9fb2');R2(12,5,1,1,'#ffe46b');}if(stage>=4){R2(3,6,3,3,'#ffe46b');R2(4,7,1,1,'#f2a93b');}});g.drawImage(k,6*TT-1,TT-31);},true,1);
  S.hot({id:'plant',x:6,y:0,w:1,d:1,h:1.2,label:'Planta',stand:[6,1],use:waterPlant});
  // guarda-roupa
  S.box(9,0,1,1,2.1,'#9c6a45',{top:'#b47d4c'});S.put(9,0,1,1,()=>{const top=TT-2.1*ZH+TT-ZH*0;F(9*TT+2,TT-2.1*ZH+2+0,5,2.1*ZH-4,'#a8744c');F(9*TT+9,TT-2.1*ZH+2,5,2.1*ZH-4,'#a8744c');F(9*TT+7,TT-ZH,1,2,'#e2c26a');F(9*TT+9,TT-ZH,1,2,'#e2c26a');void top;},false,1.01);
  S.hot({id:'wardrobe',x:9,y:0,w:1,d:1,h:2.1,label:'Guarda-roupa',stand:[9,1],use:wardrobe});
  // sofá voltado para a TV
  S.put(1,3,3,1,()=>{B(.85,3.05,0,.2,.9,.72,'#4f5ac0',{top:'#5e6ad2'});B(3.95,3.05,0,.2,.9,.72,'#4f5ac0',{top:'#5e6ad2'});B(1,3.05,0,3,.6,.42,'#5e6ad2',{top:'#7b85e0'});
   for(let i=0;i<3;i++)B(1.1+i*.97,3.1,.42,.85,.45,.1,'#8f97e8',{top:'#a3aaf0',edge:false});B(1,3.65,0,3,.3,1.04,'#4f5ac0',{top:'#6a76df'});if(L.flags?.homeCozy)B(2.3,3.45,1.04,.5,.15,.3,'#f2a93b');});
  S.hot({id:'sofa',x:1,y:3,w:3,d:1,h:.9,label:'Sofá',stand:[2,2],use:()=>menu('Sofá',[{t:'🛋 Cochilar um pouco (+1h)',fn:()=>{advance(60);diary('🛋','Cochilou no sofá.');say('','Você cochila no sofá. Acorda com a marca da almofada no rosto.');}},{t:'Deixar pra lá'}])});
  // mesa de centro com caneca fumegante
  S.put(2,2,1,1,()=>{B(2.1,2.2,0,.8,.6,.32,'#9c6a45',{top:'#b47d4c'});const sx=2.45*TT,sy=2.5*TT-.32*ZH;F(sx-2,sy-5,4,5,'#e46d6d');F(sx+2,sy-4,1,2,'#e46d6d');F(sx-1,sy-5,2,1,'#4a2a1c');
   if(R.coffee>0)for(let i=0;i<3;i++){const tt=(R.t*.8+i/3)%1;g.globalAlpha=(1-tt)*.7;F(sx+Math.round(Math.sin(tt*6+i)*2),sy-8-Math.round(tt*10),1,2,'#ffffff');g.globalAlpha=1;}});
  // cozinha: bancada com fogão, geladeira e cafeteira
  S.box(0,4,1,2,.9,'#e9e6df',{top:'#cfc7b7'});S.put(0,4,1,2,()=>{const t=4*TT-.9*ZH;for(const yy of [4,12])F(4,t+yy,8,5,'#3a3f52');for(const yy of [4,12])F(6,t+yy+1,4,3,'#555a70');
   F(5,t+20,7,9,'#2d2a4a');F(6,t+23,5,5,'#7a4a2a');if(R.coffee>0){F(7,t+21,3,1,'#ffb36b');}for(let k=0;k<3;k++)F(TT-1,4*TT+k*7+2,1,5,'#c3b59f');},false,6.01);
  S.box(0,6,1,1,2.0,'#f6f7f9',{top:'#ffffff',front:'#eef0f2'});S.put(0,6,1,1,()=>{const t=7*TT-2*ZH;F(2,t+10,12,1,'#b9c0c9');F(3,t+3,1,5,'#9aa3b5');F(3,t+13,1,7,'#9aa3b5');F(7,t+14,2,2,'#e46d6d');F(10,t+16,2,2,'#ffd85e');},false,7.01);
  S.hot({id:'kitchen',x:0,y:4,w:1,d:2,h:1,label:'Cozinha',stand:[1,5],use:()=>menu('Cozinha',[{t:'☕ Passar um café (+15 min)',fn:()=>{R.coffee=240;advance(15);diary('☕','Passou um café.');say('','O cheiro de café toma a casa. Você leva a caneca para a mesinha da sala.');}},{t:'🍳 Fazer um lanche (+30 min)',fn:()=>{advance(30);diary('🍳','Fez um sanduíche caprichado.');say('','Pão na chapa, queijo derretendo. Simples e perfeito.');}},{t:'Agora não'}])});
  // luminária de chão
  S.put(5,2,1,1,()=>{const m=modeOf(R.light),x0=5.5*TT,b=2.5*TT;O(x0,b+1,4,1,'#3a3f52');F(x0-1,b-24,2,25,'#3a3f52');for(let i=0;i<8;i++)F(x0-3-(i>>1),b-34+i,6+(i>>1)*2,1,i<7?(m==='noite'?'#ffd27a':'#f2a93b'):'#c97f22');});
  S.shades.push([5.5*TT,2.5*TT+2,5,2,.25]);S.lamps.push({x:5.5,y:2.5,z:1.6,r:90,col:'rgba(255,190,110,.6)',indoor:true});
  if(L.flags?.homeCozy){S.box(7,1,1,1,.5,'#b47ad6',{top:'#c9a2e6'});S.box(7,1.75,1,.25,1.0,'#9c66c6',{solid:false});
   S.put(8,6,1,1,()=>{B(8.3,6.3,0,.4,.4,.45,'#e9e6df');const sx=8.5*TT,sy=6.5*TT-10;for(const [dx,dy,c2] of [[-4,-4,'#3f8f5a'],[4,-5,'#4fa868'],[0,-9,'#5fbf74']]){F(sx+dx-2,sy+dy-4,4,7,c2);F(sx+dx-1,sy+dy-5,2,1,c2);}});}
  // mesa redonda com frutas
  S.put(8,6,1,1,()=>{B(8.1,6.35,0,.3,.3,.45,'#9c6a45');F(8.47*TT,6.5*TT-8,2,8,'#5a3b26');O(8.5*TT,6.5*TT-10,7,3,'#c98f5a');O(8.5*TT,6.5*TT-11,6,2,'#d9a06a');F(8.5*TT-5,6.5*TT-19,10,7,'#2d2a4a');F(8.5*TT-4,6.5*TT-18,8,5,'#7fd0ff');F(8.5*TT-6,6.5*TT-12,12,2,'#9aa3b5');F(8.5*TT+3,6.5*TT-13,3,2,'#ffe46b');});
  S.hot({id:'study',x:8,y:6,w:1,d:1,h:1,label:'Estudar os resultados',stand:[7,6],use:studyWeekend});
  S.hot({id:'bedroom',x:0,y:1,w:.2,d:1.2,h:1.95,label:'Porta do quarto',stand:[0,1],use:bedroomDoor});
  S.hot({id:'front',x:7.6,y:0,w:1,d:.2,h:1.95,label:'Sair para a rua',stand:[8,0],use:()=>go('street',{x:3,y:4})});
  S.cat={x:7.5,y:4.5,tx:7.5,ty:4.5,state:'sleep',t:0,face:1};
  S.spawn=g0.office?{x:8,y:1}:{x:1,y:1};
  return S;}

 /* ---------- rua ---------- */
 function buildStreet(g0,L){const S=newScene('street',32,22,'Bairro');S.indoor=false;S.spawn={x:3,y:4};
  S.tile=(x,y)=>{if(y===5||y===6||(y===20&&x>=8))return 'road';if(y===4||y===7||(y===19&&x>=8)||(x===20&&y>7&&y<19))return 'stone';if(x>=12&&x<=16&&y>=11&&y<=15)return 'clay';if(x>=8&&x<=19&&y>=8&&y<=18)return 'plaza';return 'grass';};
  S.decor=()=>{for(let x=0;x<32;x+=2)F(x*TT+3,6*TT-1,10,2,'#e9d58a');for(let x=8;x<32;x+=2)F(x*TT+3,20*TT+7,10,2,'#e9d58a');
   F(0,4*TT+14,32*TT,2,'#958a74');F(0,7*TT,32*TT,2,'#958a74');F(8*TT,19*TT+14,24*TT,2,'#958a74');F(8*TT,21*TT,24*TT,2,'#958a74');
   for(let i=0;i<5;i++)F(9*TT+2+i*7,5*TT+1,4,30,'#ecebe2');
   F(12*TT,11*TT,5*TT,1,'#fffaf0');F(12*TT,16*TT-1,5*TT,1,'#fffaf0');F(12*TT,11*TT,1,5*TT,'#fffaf0');F(17*TT-1,11*TT,1,5*TT,'#fffaf0');
   F(8*TT-1,8*TT,1,11*TT,'#a8825e');F(20*TT,8*TT,1,11*TT,'#a8825e');};
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
  S.put(12,13,5,1,()=>{const y0=13.5*TT;for(const px of [12.5*TT,16.5*TT]){F(px-1,y0-16,2,17,'#cfd4da');F(px,y0-16,1,17,'#9aa3b5');}
   for(let x=12.5*TT+1;x<16.5*TT-1;x+=3)F(x,y0-13,1,9,'rgba(255,255,255,.55)');for(let yy=y0-13;yy<y0-4;yy+=3)F(12.5*TT+1,yy,64-2,1,'rgba(255,255,255,.5)');F(12.5*TT+1,y0-14,62,2,'#fffaf0');F(12.5*TT+1,y0-4,62,1,'#e46d6d');},false,13.95);
  S.solid(12,13,1,1);S.solid(16,13,1,1);
  // mesas do bar na calçada, bicicletas e carrinho de pipoca
  for(const [x,col] of [[22,'#c8553d'],[25,'#2f7f7a']]){S.shades.push([(x+.5)*TT,13.8*TT,10,3,.25]);S.put(x,13,1,1,()=>{const k=memo('umb'+col,28,34,x2=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
    R2(13,8,2,24,'#9aa3b5');R2(7,22,14,3,'#e9e6df');R2(7,22,14,1,'#ffffff');R2(12,25,4,7,'#4b4f63');O(14,7,13,5,col,x2);for(let i=-12;i<=12;i+=6)R2(14+i,3,3,8,lit(col,.35));O(14,5,9,2,lit(col,.15),x2);R2(2,11,25,1,dk(col,.35));R2(9,19,2,3,'#ffe46b');R2(17,19,2,3,'#f6efe2');});g.drawImage(k,x*TT-7,14*TT-35);});}
  S.put(26,14,1,1,()=>{for(const k2 of [0,1]){const c2=['#e46d6d','#3d8bf5'][k2],bx=26*TT+1+k2*7,by=15*TT-3-k2*3;for(const wx of [0,9]){O(bx+wx+2,by,3,3,'#2f3344');O(bx+wx+2,by,2,2,'#9aa3b5');}F(bx+2,by-4,10,1,c2);F(bx+6,by-7,1,4,c2);F(bx+5,by-8,3,1,'#2f3344');F(bx+11,by-6,2,1,'#2f3344');}});
  S.shades.push([11.5*TT,9.85*TT,9,3,.3]);
  S.put(11,9,1,1,()=>{const k=memo('pipoca',22,34,x2=>{const R2=(a,b,w,hh,c2)=>F(a,b,w,hh,c2,x2);
    R2(3,18,16,10,'#e05a5a');R2(3,18,16,2,'#f08a7a');R2(3,25,16,1,'#b03c3c');R2(4,28,4,4,'#3b3f52');R2(14,28,4,4,'#3b3f52');R2(5,29,2,2,'#9aa3b5');R2(15,29,2,2,'#9aa3b5');
    R2(5,8,12,10,'#fdf6e3');for(let i=0;i<9;i++)R2(6+(i*5)%10,12+(i%3)*2,2,2,i%2?'#fff3c4':'#f2d27a');R2(10,5,2,3,'#9aa3b5');for(let x=0;x<22;x+=4)R2(x,1,4,5,(x/4)%2?'#fff6e8':'#e05a5a');R2(0,6,22,1,'#b03c3c');});
   g.drawImage(k,11*TT-4,10*TT-35);R.labels.push({x:11.5*TT,y:10*TT-40,text:'Pipoca',o:{size:9,bg:'#fff3c4'}});});
  // casa: caixa de correio
  S.put(6,3,1,1,()=>{F(6.45*TT,4*TT-10,2,10,'#6b6f7e');B(6.3,3.6,.6,.4,.3,.25,'#3d8bf5');F(6.3*TT+5,3.6*TT-.85*ZH+1,2,2,'#e46d6d');},true);
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
 const PXF={B:['XX.','X.X','XX.','X.X','XX.'],A:['.X.','X.X','XXX','X.X','X.X'],R:['XX.','X.X','XX.','X.X','X.X']};
 function buildBar(g0,L){const S=newScene('bar',11,9,'Bar da Praça');S.warm=true;S.tile=()=>'darkwood';S.sideDoors=[{y:6.6,d:1.1,col:'#3a2418'}];
  interior(S,'#a8653f','#4a2a1c',{wains:'#74432b',extra:m=>{
   // prateleiras de garrafas
   for(const yy of [-30,-19]){F(1*TT,yy+8,6*TT,2,'#5a3b26');for(let i=0;i<14;i++){const x=1*TT+3+i*7,c2=['#2f9a6a','#c8553d','#f2a93b','#5aa7d0','#7a8b3a'][(i+(yy>-25?2:0))%5];F(x,yy,3,8,c2);F(x+1,yy-2,1,2,dk(c2,.2));F(x,yy+1,1,3,lit(c2,.3));}}
   // lousa do cardápio
   F(7.6*TT,-34,30,22,'#8a6a4a');F(7.6*TT+2,-32,26,18,'#2d3a2e');for(let i=0;i<4;i++)F(7.6*TT+5,-29+i*4,i?14+(i*5)%8:18,1,i?'#d9d2c0':'#f6efe2');
   // alvo de dardos
   for(const [r,c2] of [[7,'#2d2a4a'],[5,'#f6efe2'],[3,'#c8553d'],[1,'#f6efe2']])O(.4*TT+2,-24,r,r,c2);
   // letreiro de neon (pisca de vez em quando)
   {const fl=Math.sin(R.t*1.3)>.93&&Math.floor(R.t*20)%2?'#b0607f':'#ffd0e6';let x=9.6*TT;for(const ch of 'BAR'){PXF[ch].forEach((row,j)=>[...row].forEach((q,i)=>{if(q==='X')F(x+i*2,-36+j*2,2,2,fl);}));x+=8;}}}});
  S.lamps.push({x:10.3,y:.2,z:2.6,r:40,col:'rgba(255,110,180,.25)',indoor:true});
  S.decor=()=>{F(0.2*TT,6.6*TT+2,8,1.1*TT-4,'#7a4a30');};
  S.box(1,2,6,1,1.1,'#7a4a30',{top:'#9c6a45'});S.solid(1,0,6,2);
  S.put(1,2,6,1,()=>{const t=2*TT-1.1*ZH;for(const x of [2.2,3.2]){F(x*TT,t-6,2,6,'#c9ccd6');F(x*TT-1,t-7,4,1,'#9aa3b5');}F(5.5*TT-3,t-8,6,8,'#f2a93b');F(5.5*TT-2,t-7,2,3,'#ffd27a');F(3.9*TT,t-4,5,4,'#e9e6df');},false,3);
  for(const x of [2,4,6])S.put(x,3,1,1,()=>{F((x+.47)*TT,3.5*TT-8,2,8,'#4b4f63');O((x+.5)*TT,3.5*TT-9,4,2,'#c8553d');O((x+.5)*TT,3.5*TT-10,3,1,'#e07060');});
  // jukebox
  S.box(10,0,1,1,1.65,'#7b5cd6',{top:'#ffcf8a'});S.put(10,0,1,1,()=>{const h=(Math.sin(R.t*2)+1)/2,t=TT-1.65*ZH;F(10*TT+2,t+2,12,7,mix('#ff9fb8','#ffe46b',h));F(10*TT+3,t+11,10,6,'#2d2a4a');for(let i=0;i<5;i++)F(10*TT+4+i*2,t+12,1,4,mix('#9fd8ff','#ff9fb8',(i/5+h)%1));},false,1.01);
  S.hot({id:'jukebox',x:10,y:0,w:1,d:1,h:1.65,label:'Jukebox',stand:[10,1],use:()=>{R.song=(R.song+1)%4;const songs=['um samba antigo','uma bossa nova tranquila','um rock de garagem','um pagode de domingo'];toast('🎵 Tocando '+songs[R.song]+'.');diary('🎵','Escolheu '+songs[R.song]+' na jukebox.');}});
  S.lamps.push({x:10.5,y:1,z:1.2,r:44,col:'rgba(255,140,200,.3)',indoor:true});
  // mesa de sinuca com bolas e luminária
  S.shades.push([5.5*TT,7*TT,26,4,.3]);
  S.put(4,5,3,2,()=>{for(const [a,b] of [[4.1,5.6],[6.65,5.6],[4.1,6.65],[6.65,6.65]])F(a*TT,b*TT-.75*ZH+4,4,.75*ZH-4+5,'#5a3b26');
   B(4,5,.75,3,2,.12,'#6b3d22',{top:'#7a4a2a'});const tz=.87*ZH;F(4.2*TT,5.2*TT-tz,2.6*TT,1.6*TT,'#2f7a4a');F(4.2*TT,5.2*TT-tz,2.6*TT,1,'#3d9a5e');
   for(const [a,b] of [[4.2,5.2],[5.5,5.15],[6.8,5.2],[4.2,6.8],[5.5,6.85],[6.8,6.8]])O(a*TT,b*TT-tz,2,1,'#120a06');
   [[5.9,5.8,'#ef8a3c'],[6.05,5.95,'#3d6fa8'],[6.05,5.65,'#ef8a3c'],[6.2,5.8,'#3d6fa8'],[4.8,6.1,'#fbfbf5']].forEach(([a,b,c2])=>{F(a*TT-1,b*TT-tz-1,3,3,c2);F(a*TT-1,b*TT-tz-1,1,1,'#ffffff');});
   F(5.5*TT,3.4*TT,1,1.4*TT,'#2d2a4a');F(5.5*TT-8,4.8*TT,17,4,'#2f7f7a');F(5.5*TT-6,4.8*TT+4,13,1,'#fff1b0');},true,7);
  S.lamps.push({x:5.5,y:6,z:1.6,r:110,col:'rgba(255,220,150,.5)',indoor:true});
  S.hot({id:'pool',x:4,y:5,w:3,d:2,h:.95,label:'Mesa de sinuca',stand:[5,7],use:poolTable});
  // mesinhas com cadeiras
  for(const [x,y] of [[8,4],[8,7],[1,6]])S.put(x,y,1,1,()=>{F((x+.45)*TT,(y+.5)*TT-9,2,9,'#4b4f63');O((x+.5)*TT,(y+.5)*TT-10,7,3,'#9c6a45');O((x+.5)*TT,(y+.5)*TT-11,6,2,'#b47d4c');F((x+.5)*TT-1,(y+.5)*TT-15,3,4,'#ffe46b');});
  S.lamps.push({x:8.5,y:4.5,z:1.6,r:80,col:'rgba(255,200,130,.45)',indoor:true},{x:2,y:2.6,z:1.8,r:90,col:'rgba(255,200,130,.4)',indoor:true});
  S.npcs.push(npc('ro',3.5,1.3),npc('teo',8.5,5.7,{face:-1}),npc('freq1',7.5,7.5,{face:1}),npc('freq2',9.3,4.5,{face:-1}),npc('duda',2.2,4.2,{plan:true}));
  S.hot({id:'exit',x:0,y:6.6,w:.2,d:1.1,h:1.95,label:'Sair para a rua',stand:[0,7],use:()=>go('street',{x:23,y:13})});
  return S;}

 /* ---------- galeria ---------- */
 function buildGallery(g0,L){const S=newScene('gallery',13,9,'Galeria do Bairro');S.tile=()=>'check';S.sideDoors=[{y:6.6,d:1.1,col:'#7b5cd6'}];
  interior(S,'#f7f4fa','#9a92b8',{extra:m=>{
   for(const [x0,x1,c2] of [[.8,4.6,'#ff9fb2'],[5.8,10.4,'#9fd8ff']]){const a=x0*TT,b=x1*TT;F(a,-30,b-a,26,'rgba(207,238,253,.7)');F(a,-30,b-a,1,dk(c2,.3));for(let q=a+20;q<b-6;q+=20)F(q,-30,1,26,dk(c2,.25));F(a+2,-28,6,1,'#ffffff');F(a+2,-27,1,6,'#ffffff');
    for(let xx=a;xx<b;xx+=4)F(xx,-38,4,7,(xx/4)%2?'#ffffff':c2);for(let xx=a;xx<b;xx+=4)F(xx+1,-31,2,2,(xx/4)%2?'#ffffff':c2);}
   F(0,-22,TT,8,'#b9f08f');}});
  S.decor=()=>{F(0.2*TT,6.6*TT+2,8,1.1*TT-4,'#cfc6e8');g.fillStyle='rgba(255,255,255,.22)';for(const [a,b] of [[5,6.3],[9.6,10.1]]){for(let y=0;y<S.h*TT;y++){const s=y*.32;g.fillRect(Math.round(a*TT-s),y,Math.round((b-a)*TT),1);}}};
  S.signs.push({x:2.7*TT,y:-40,text:'LOJA DA LIA',bg:'#fff'},{x:8.1*TT,y:-40,text:'GADGETS DO ZÉ',bg:'#fff'},{x:.5*TT,y:1.2*TT,text:'CASA & CIA',bg:'#fff'});
  // arara de roupas da Lia
  S.put(1,1,3,1,()=>{F(1.1*TT,2*TT-24,2,24,'#9aa3b5');F(3.85*TT,2*TT-24,2,24,'#9aa3b5');F(1.1*TT,2*TT-24,2.8*TT,2,'#9aa3b5');
   Object.values(OUTFITS).forEach((o,i)=>{const sx=1.5*TT+i*10,sy=2*TT-21;F(sx-4,sy,9,12,o.shirt);F(sx-4,sy,9,1,lit(o.shirt,.3));if(o.trim)F(sx,sy,1,11,o.trim);F(sx,sy-2,1,2,'#6b6f7e');});});
  // manequim
  S.put(4,1,1,1,()=>{F(4.35*TT,2*TT-2,5,2,'#9aa3b5');drawPerson({shirt:'#3d6fa8',trim:'#a8c6ea',skin:'#f6efe2',hair:'#f6efe2',style:'bald',pants:'#4b4f63'},4.5,1.9,'down',0);});
  // balcão de vidro do Zé com gadgets
  S.box(6,1,4,1,.95,'#e9ecef',{top:'#cfeefd'});S.solid(6,0,4,1);
  S.put(6,1,4,1,()=>{const t=2*TT-.95*ZH;['fone','robo','pato','chaveiro'].forEach((id,i)=>prizePx(g,6.5*TT+i*15,t+2+(i%2),id,3));
   if(R.productShelf)R.labels.push({x:8*TT,y:t-14,text:'★ '+R.productShelf,o:{bg:'#f2a93b',size:10}});},false,2.01);
  // prateleira Casa & Cia
  S.box(0,2,1,3,1.3,'#d8f0c4',{top:'#eafbe0'});S.put(0,2,1,3,()=>{const t=2*TT-1.3*ZH;F(4,t+6,8,9,'#f2a93b');F(5,t+20,6,10,'#4fa868');F(6,t+18,4,3,'#5fbf74');F(3,t+34,10,5,'#c8553d');},false,5.01);
  // garrinha iluminada
  S.shades.push([11.5*TT,4*TT+1,9,3,.3]);
  S.put(11,3,1,1,()=>{B(11,3,0,1,1,.8,'#ff6b9a',{top:'#ff9fb8'});const t=4*TT-.8*ZH;F(11*TT+3,t+2,10,6,'#d84a7c');F(11*TT+11,t+3,2,3,'#2d2a4a');
   const top=3*TT-1.75*ZH;F(11*TT,top,TT,(1.75-.8)*ZH+TT,'rgba(207,238,253,.55)');for(const [a,b,id] of [[3,10,'pato'],[9,13,'gato'],[5,15,'robo'],[12,9,'fone']])prizePx(g,11*TT+a,top+b+6,id,2);
   F(11*TT,top-3,TT,4,'#ff6b9a');F(11*TT,top-3,TT,1,'#ffe46b');for(let i=0;i<5;i++)F(11*TT+1+i*3,top-2,2,2,Math.floor(R.t*4+i)%2?'#fff7a8':'#c84a7c');F(11*TT+7,top+1,1,6,'#9aa3b5');F(11*TT+5,top+7,5,2,'#9aa3b5');});S.solid(11,3,1,1);
  S.lamps.push({x:11.5,y:3.5,z:1.8,r:70,col:'rgba(255,140,190,.45)',indoor:true});
  // banco central com vasos
  S.box(5,5,2,1,.38,'#b9a8f2',{top:'#d9ccff'});for(const x of [4,7])S.put(x,5,1,1,()=>{B(x+.25,5.25,0,.5,.5,.45,'#e9e6df');const sx=(x+.5)*TT,sy=5.75*TT-.45*ZH;for(const [dx,dy,c2] of [[-4,-4,'#3f8f5a'],[4,-5,'#4fa868'],[0,-9,'#5fbf74']]){F(sx+dx-2,sy+dy-4,4,7,c2);F(sx+dx-1,sy+dy-5,2,1,lit(c2,.2));}});
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
  root.innerHTML='<canvas id="town-cv"></canvas><div class="tw-hud"><div class="tw-brand">THE FOUNDER</div><div class="tw-time"><i id="tw-sun"></i><b id="tw-day"></b><span id="tw-clock"></span></div><div class="tw-where" id="tw-where"></div><div class="tw-cash" id="tw-cash"></div><span class="tw-sp"></span><button id="tw-phone" class="tw-btn">📱 Celular<i id="tw-badge" hidden></i></button><button id="tw-home" class="tw-btn tw-btn2">🏠 Ir para o quarto</button><button id="tw-end" class="tw-btn tw-end">💼 Encerrar fim de semana</button></div><div id="tw-dialog" hidden></div><div id="tw-toast"></div><div id="tw-phone-ui" hidden></div><div id="tw-diary" hidden></div><div id="tw-mini" hidden><div class="tw-mini-box"><div class="tw-mini-head"><b id="tw-mini-title"></b><span id="tw-mini-score"></span></div><canvas id="tw-mini-cv" width="760" height="420"></canvas><p id="tw-mini-help"></p><div id="tw-mini-actions"></div></div></div>';
  document.body.appendChild(root);cv=document.getElementById('town-cv');
  cv.addEventListener('pointerdown',onClick);cv.addEventListener('pointermove',e=>{if(!R)return;const h=pick(e);R.hover=h;cv.style.cursor=h?'pointer':'';});
  document.getElementById('tw-phone').onclick=()=>{if(!busy())openPhone();};
  document.getElementById('tw-end').onclick=()=>{if(busy())return;dialog('','Encerrar o fim de semana e voltar ao trabalho na segunda-feira?',[{t:'💼 Voltar ao trabalho',fn:()=>finish('rest')},{t:'Ainda não'}],{name:'Fim de semana',col:'#2f9a6a'});};document.getElementById('tw-home').onclick=()=>{if(busy())return;if(R.scene.id==='home'){toast('Você já está em casa.');return;}advance(30);go('home',{x:8,y:1});toast('Você volta para casa (+30 min).');};}
 const busy=()=>!R||R.dialog||R.mini||R.phone||R.diaryOpen;
 function hud(){if(!R)return;const g=api.get(),L=R.light||light(R.min);{const wk=g.weekly?.reports?.length||1,di=R.day==='sat'?5:6;document.getElementById('tw-day').innerHTML='SEMANA '+wk+' <span class="tw-strip">'+['S','T','Q','Q','S','S','D'].map((l,k)=>'<i class="'+(k===di?'on':'')+(k>4?' fds':'')+'">'+l+'</i>').join('')+'</span> '+(R.day==='sat'?'SÁB':'DOM')+' '+(window.TheFounderDate?window.TheFounderDate(wk,di):'');}document.getElementById('tw-clock').textContent=hhmm(R.min);
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
  kaique:['E aí! Tô treinando um flip novo no skate. Ainda não sai, mas sai.','Gravo vídeo de skate pra internet. Já são 40 mil seguidores, acredita?','À noite a praça fica bonita com as luzinhas, né?'],
  freq1:['Esse bar tem o melhor clima da cidade. Não conta pra ninguém.'],freq2:['A jukebox só tem música boa. O Rô escolhe a dedo.']};
 function talk(n){const day=R.week+R.day,k=friend(n.id),lines=LINES[n.id]||['Oi!'],today=R.talked[n.id]===day;let text=lines[Math.min(k,lines.length-1)];
  if(n.id==='ze'&&R.productShelf)text+=' E olha: o '+R.productShelf+' tá aqui na vitrine. Os clientes perguntam por ele!';
  if(n.id==='marina'||n.id==='antonio'||n.id==='kaique'||n.id.startsWith('freq'))text=lines[Math.floor(Math.random()*lines.length)];
  R.talked[n.id]=day;const main=['duda','teo','ro','lia','ze','bene','marina','antonio','kaique','freq1','freq2'].includes(n.id);
  if(!today&&main){advance(15);save({friends:{[n.id]:k+1}});emote(n,'♥');Amb.heart();diary('💬',k?'Conversou com '+PEOPLE[n.id].name+'.':'Conheceu '+PEOPLE[n.id].name+'.');}else{advance(5);emote(n,'♪');}
  say(n.id,text,null,{mood:!today&&main?'happy':null});}
 function progTown(who,what,cost,line){if(cost&&api.get().cash<cost){toast('Dinheiro insuficiente.');return;}try{api.act({type:'life',spend:cost,prog:what,patch:{}});if(cost)R.spentToday=(R.spentToday||0)+cost;hud();say(who,line||api.get().prog?.town?.line||'Nada de novo por aqui.');}catch(e){toast(e.message);}}
 function useNpc(n){const p=PEOPLE[n.id];if(p.silent){emote(n,'🏐');toast('Eles estão no meio de uma partida.');return;}
  n.face=R.p.x-R.p.y<n.x-n.y?-1:1;const opts=[{t:'💬 Conversar',fn:()=>talk(n)}],planHere=R.plan&&R.plan.who===n.id&&R.plan.place===R.scene.id;
  if(planHere){opts.unshift({t:'⭐ '+(R.plan.game==='volley'?'Jogar o vôlei combinado':R.plan.game==='pool'?'Jogar a sinuca combinada':'Curtir o programa combinado'),fn:()=>keepPlan(n)});}
  if(n.id==='duda')opts.push({t:'🏐 Jogar vôlei (≈45 min)',fn:()=>volley('Duda')});
  if(n.id==='teo')opts.push({t:'🎱 Jogar sinuca (≈40 min)',fn:()=>pool('Téo')});
  if(n.id==='ro')opts.push({t:'🧃 Pedir um suco · R$ 12',fn:()=>order(12,'Suco de maracujá bem gelado. Faz bem pra cabeça.','Tomou um suco de maracujá no bar.')},{t:'🥤 Pedir um refri · R$ 8',fn:()=>order(8,'Aqui está. Dizem que combina com sinuca.','Tomou um refri no bar.')},{t:'🍗 Pedir uma coxinha · R$ 7',fn:()=>order(7,'Saindo do óleo! Cuidado que tá quente.','Comeu a coxinha famosa do Rô.')});
  if(n.id==='lia')opts.push({t:'👕 Ver roupas',fn:clothes});
  if(n.id==='ze')opts.push({t:'🥤 Comprar refrigerante · R$ 7',fn:()=>{if(spend(7)){advance(5);toast('Refri gelado na mão.');}}});
  if(n.id==='bene')opts.push({t:'🍿 Comprar pipoca · R$ 6',fn:buyPopcorn});
  if(n.id==='ze'&&api.get().prog){if(friend('ze')>=1)opts.push({t:'🗞 Perguntar sobre a concorrência',fn:()=>progTown('ze','zeGossip',0,null)});opts.push({t:'🧩 Comprar uma peça para a bancada · R$ 1.500',fn:()=>progTown('ze','zeBuy',1500,'Chegou essa semana. Leva que é boa, eu mesmo testei.')});if(friend('ze')>=2&&!api.get().prog.town?.zeGift)opts.push({t:'🎁 Perguntar se sobrou alguma peça',fn:()=>progTown('ze','zeGift',0,'Sobrou essa aqui, ó. Separei pra você. Amigo é amigo.')});}
  if(n.id==='kaique'&&api.get().prog&&friend('kaique')>=2)opts.push({t:'📱 Pedir um vídeo sobre a sua marca',fn:()=>progTown('kaique','kaique',0,'Fechou! Gravo andando de skate com o seu produto. Meus 40 mil seguidores vão ver.')});
  const tal=TALENT_NPC.includes(n.id)?talentOpts(n):[];opts.push(...tal);opts.push({t:'Tchau'});const greet=planHere?'Chegou! Bora?':friend(n.id)>=3?'Opa! Que bom te ver de novo.':'';menu(n.id,opts,esc(greet));}
 // talentos do bairro: com amizade 2 dá para ver o currículo, com 3 dá para convidar para a empresa
 const TALENT_NPC=['marina','antonio','kaique','freq1','freq2'];
 function talentOpts(n){const k=friend(n.id),g=api.get(),c=g.team?.talents?.[n.id],hired=(g.team?.staff||[]).some(p=>p.town===n.id)||(g.team?.agenda||[]).some(p=>p.town===n.id),o=[];if(hired)return o;
  if(k>=2)o.push({t:'📄 Perguntar sobre o trabalho',fn:()=>showResume(n)});
  if(k>=3)o.push({t:'🤝 Convidar para a empresa',fn:()=>invite(n)});return o;}
 function showResume(n){let next;try{next=api.act({type:'hrTownMeet',id:n.id});}catch(e){toast(e.message);return;}const c=next.team.talents[n.id];advance(10);if(!R.seen['cv-'+n.id]){R.seen['cv-'+n.id]=1;diary('📄','Descobriu que '+c.name+' é '+c.job+'.');}
  dialog(n.id,'<b>'+esc(c.name)+'</b> · '+esc(c.job)+'<br>'+esc(c.title)+' · nível '+c.level+' · pretende '+money(c.salary)+'/semana<br><br><b>'+esc(c.pName)+'</b>: '+esc(c.pDesc)+'<br><b>'+esc(c.tName)+'</b>. '+esc(c.tDesc)+(friend(n.id)<3?'<br><br><i>Mais uma conversa e dá para fazer o convite.</i>':''),[{t:'Legal!'}]);}
 function invite(n){let next;try{next=api.act({type:'hrTownInvite',id:n.id});}catch(e){toast(e.message);return;}const r=next.team.lastTown;advance(20);diary('🤝','Convidou '+PEOPLE[n.id].name+' para a empresa.');emote(n,'♥');Amb.heart();
  say(n.id,r?.result==='hired'?'Fechado! Segunda-feira eu tô lá no escritório.':'Topo sim! Quando tiver uma mesa livre, me chama. Fico na sua agenda.',null,{mood:'happy'});}
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
 // estudar os resultados da empresa: uma vez por fim de semana, sem dado
 function studyWeekend(){let next;try{next=api.act({type:'weekendStudy'});}catch(e){say('',e.message);return;}advance(60);
  const rec=next.learning?.attempts?.[next.learningWindow?.id],card=rec?.cards?.[0];diary('📚','Estudou os resultados da empresa.');
  say('Estudo',card?'Você revisa as vendas e as avaliações com calma. Descoberta: '+card.title+' '+card.symbol+'. '+(card.text||''):'Você revisa os números com calma.',null,{name:'Estudo de fim de semana',col:'#7b5cd6'});}
 function petCat(){const c2=R.scene.cat;c2.state='happy';c2.t=0;Amb.purr();advance(5);R.petted=(R.petted||0)+1;if(R.petted===1)diary('🐈','Fez carinho no Biscoito.');R.particles.push(...[0,1,2].map(i=>({kind:'heart',x:c2.x,y:c2.y,z:.6,vz:.6+i*.15,life:1.6,dx:(i-1)*.15})));toast(['Biscoito ronrona alto.','Biscoito se espreguiça e pede mais.','Biscoito te olha com os olhos meio fechados.'][R.petted%3]);}
 function bedroomDoor(){if(R.day==='sat')menu('',[{t:'😴 Dormir (vai para domingo)',fn:()=>sleep(false)},{t:'Ainda não'}],'Hora de descansar?',{name:'Porta do quarto'});
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
  if(R.day==='sat'&&!F.momLunch){dialog('','Oi, meu bem! Tá comendo direito? Amanhã vou fazer aquele almoço de domingo. Vem?',[{t:'Vou sim!',fn:()=>{save({flags:{momLunch:'yes'}});diary('📞','Combinou o almoço de domingo com a mãe.');toast('Almoço com a mãe marcado para domingo.');}},{t:'Esse domingo não vai dar.',fn:()=>{save({flags:{momLunch:'no'}});say('','Tudo bem, a gente remarca. Não esquece de descansar.',null,{name:'Mãe',col:'#e46d8c',k:MOM});}},{t:'Ainda não sei.'}],{name:'Mãe',col:'#e46d8c',k:MOM});return;}
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
 function clawStart(){const items=clawItems();if(!items.length){dialog('','A máquina está vazia: você já pegou tudo. Os prêmios novos chegam no próximo fim de semana.',[{t:'Ok'}],{name:'Garrinha',col:'#ff6b9a'});return;}
  const names=[...new Set(items.map(i=>i.t.name))];dialog('','Cada tentativa custa '+money(5)+'. Na máquina neste fim de semana: '+names.join(', ')+'.',[{t:'🕹 Jogar · R$ 5',fn:()=>{if(spend(5)){advance(5);claw();}}},{t:'Agora não'}],{name:'Garrinha',col:'#ff6b9a'});}

 /* ---------- clique no mundo ---------- */
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

 /* ---------- gente em pixel art (16×24, 4 direções, 3 quadros de passo) ---------- */
 function paintChar(x2,k,dir,f){const P2=(x,y,w,h,col)=>F(x+1,y+1,w,h,col,x2);
  const skin=k.skin||'#edbd97',skD=dk(skin,.2),hair=k.hair||'#3b2a2a',hairL=lit(hair,.25),shirt=k.shirt||'#5e6ad2',shD=dk(shirt,.2),pants=k.pants||'#2f3550',shoes=k.shoes||'#3a2f3f',st=k.style||'short',eye='#2a1f2e',blush=mix(skin,'#ff6f7f',.4);
  if(dir!=='left'){const L2=f===1?1:0,R3=f===2?1:0,up=dir==='up';
   P2(5,17,7,2,pants);P2(5,18,3,4-L2,pants);P2(9,18,3,4-R3,pants);P2(5,22-L2,3,2,shoes);P2(9,22-R3,3,2,shoes);P2(5,23-L2,3,1,dk(shoes,.3));P2(9,23-R3,3,1,dk(shoes,.3));
   const a=f===1?1:f===2?-1:0;
   P2(2,11+(a>0?1:0),2,5,up?shD:shirt);P2(2,16+(a>0?1:0),2,2,skin);P2(13,11+(a<0?1:0),2,5,shD);P2(13,16+(a<0?1:0),2,2,skin);
   P2(4,11,9,7,shirt);P2(11,11,2,7,shD);P2(4,17,9,1,shD);
   if(k.trim&&!up)P2(8,11,1,7,k.trim);
   if(k.hood){if(up)P2(5,9,7,3,dk(shirt,.12));else{P2(4,10,2,2,dk(shirt,.12));P2(11,10,2,2,dk(shirt,.12));}}
   if(k.apron&&!up){P2(5,13,7,5,k.apron);P2(5,13,7,1,lit(k.apron,.2));P2(6,11,1,2,k.apron);P2(10,11,1,2,k.apron);}
   if(!up)P2(7,10,3,1,skD);
   P2(5,2,7,1,skin);P2(4,3,9,7,skin);P2(5,10,7,1,skD);if(st!=='long'){P2(3,6,1,2,skin);P2(13,6,1,2,skin);}
   if(!up){P2(6,6,1,2,eye);P2(10,6,1,2,eye);P2(5,8,1,1,blush);P2(11,8,1,1,blush);P2(8,9,1,1,dk(skin,.45));}
   if(st==='short'){P2(5,1,7,1,hair);P2(4,2,9,up?7:3,hair);P2(3,3,1,up?4:3,hair);P2(13,3,1,up?4:3,hair);if(!up){P2(4,5,2,1,hair);P2(10,5,2,1,hair);}P2(6,2,3,1,hairL);}
   else if(st==='bun'){P2(7,-1,3,1,hair);P2(6,0,5,1,hair);P2(5,1,7,1,hair);P2(4,2,9,up?7:3,hair);P2(3,3,1,3,hair);P2(13,3,1,3,hair);if(!up)P2(4,5,1,1,hair);P2(7,0,2,1,hairL);if(up)P2(6,3,5,3,dk(hair,.15));}
   else if(st==='cap'){const cap=k.cap||'#e46d6d';P2(3,4,1,3,hair);P2(13,4,1,3,hair);if(up)P2(4,5,9,4,hair);P2(5,1,7,1,cap);P2(4,2,9,3,cap);P2(6,2,3,1,lit(cap,.3));if(!up)P2(4,5,9,1,dk(cap,.3));else P2(6,5,5,1,dk(cap,.3));}
   else if(st==='curly'){P2(5,0,2,1,hair);P2(8,0,2,1,hair);P2(11,1,1,1,hair);P2(4,1,9,1,hair);P2(3,2,11,up?7:3,hair);if(!up){P2(3,5,1,3,hair);P2(13,5,1,3,hair);P2(4,5,1,1,hair);P2(12,5,1,1,hair);}P2(5,1,1,1,hairL);P2(9,2,1,1,hairL);P2(6,3,1,1,hairL);}
   else if(st==='long'){P2(5,1,7,1,hair);P2(4,2,9,up?9:3,hair);P2(3,3,2,10,hair);P2(12,3,2,10,hair);if(!up)P2(5,5,2,1,hair);P2(6,2,3,1,hairL);}
   else{P2(3,5,1,3,hair);P2(13,5,1,3,hair);P2(6,3,3,1,lit(skin,.35));if(up)P2(4,6,9,2,hair);}
   return;}
  if(f===0){P2(6,17,5,5,pants);P2(5,22,6,2,shoes);}
  else{const fw=f===1;P2(6,17,5,2,pants);P2(fw?4:8,18,3,4,pants);P2(fw?8:5,18,3,3,dk(pants,.15));P2(fw?3:8,22,4,2,shoes);P2(fw?8:4,21,4,2,dk(shoes,.2));}
  P2(5,11,7,7,shirt);P2(10,11,2,7,shD);P2(5,17,7,1,shD);if(k.apron)P2(5,13,2,5,k.apron);if(k.hood)P2(9,9,3,3,dk(shirt,.12));
  const sw=f===1?-1:f===2?1:0;P2(7+sw,12,2,5,shD);P2(7+sw,17,2,2,skin);
  P2(5,2,7,1,skin);P2(4,3,8,7,skin);P2(5,10,6,1,skD);P2(3,7,1,1,skin);P2(5,6,1,2,eye);P2(5,8,1,1,blush);P2(4,9,1,1,dk(skin,.45));if(st!=='long')P2(9,6,1,2,skD);
  if(st==='short'){P2(5,1,7,1,hair);P2(4,2,8,3,hair);P2(9,2,3,7,hair);P2(12,3,1,4,hair);P2(4,5,1,1,hair);P2(6,2,3,1,hairL);}
  else if(st==='bun'){P2(10,-1,3,2,hair);P2(5,1,7,1,hair);P2(4,2,8,3,hair);P2(9,2,3,7,hair);P2(12,3,1,3,hair);P2(10,-1,1,1,hairL);}
  else if(st==='cap'){const cap=k.cap||'#e46d6d';P2(9,4,3,5,hair);P2(5,1,7,1,cap);P2(4,2,8,3,cap);P2(1,4,5,1,dk(cap,.3));P2(6,2,2,1,lit(cap,.3));}
  else if(st==='curly'){P2(5,0,2,1,hair);P2(8,0,3,1,hair);P2(4,1,9,1,hair);P2(3,2,10,3,hair);P2(9,5,4,4,hair);P2(4,5,1,1,hair);P2(6,2,1,1,hairL);P2(10,3,1,1,hairL);}
  else if(st==='long'){P2(5,1,7,1,hair);P2(4,2,8,3,hair);P2(9,2,4,11,hair);P2(4,5,1,1,hair);P2(6,2,3,1,hairL);}
  else{P2(10,5,2,3,hair);P2(6,3,2,1,lit(skin,.35));}}
 function charSprite(k,dir,f){const key='ch'+[k.shirt,k.trim,k.hood,k.hair,k.skin,k.pants,k.style,k.cap,k.apron].join('|')+dir+f;if(MEMO[key])return MEMO[key];
  if(dir==='right'){const src=charSprite(k,'left',f),[c2,x2]=mkc(src.width,src.height);x2.translate(src.width,0);x2.scale(-1,1);x2.drawImage(src,0,0);return (MEMO[key]=c2);}
  const [c2,x2]=mkc(18,26);paintChar(x2,k,dir,f);outl(c2,'#2a2133');return (MEMO[key]=c2);}
 function drawPerson(k,x,y,dir,f,sit){const [sx,sy]=P(x,y);O(sx,sy-1,6,2,'rgba(32,22,44,.3)');g.drawImage(charSprite(k,dir,f),Math.round(sx)-9,Math.round(sy)-25+(sit?3:0));}
 // direção a partir do último movimento; parado, olha para você quando está perto
 function facing(e,x,y,idle){const dx=x-(e._lx??x),dy=y-(e._ly??y);e._lx=x;e._ly=y;
  if(Math.abs(dx)+Math.abs(dy)>.0005)e._dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  else if(idle){const px=R.p.x-x,py=R.p.y-y;if(Math.hypot(px,py)<1.9)e._dir=Math.abs(px)>Math.abs(py)?(px>0?'right':'left'):(py>0?'down':'up');}
  return e._dir||'down';}

 /* ---------- gato, pombos e carros ---------- */
 function catSprite(state,f){const key='cat'+state+f;if(MEMO[key])return MEMO[key];const [c2,x2]=mkc(20,18),Og='#f2a93b',D='#c97a25',Wt='#fff3dc',R2=(a,b,w,h,col)=>F(a,b,w,h,col,x2);
  if(state==='sleep'){O(11,12-f,7,3+f,Og,x2);R2(3,13,14,2,Og);R2(4,14,10,1,lit(Og,.2));for(const x of [9,12,15])R2(x,9-f,1,3,D);O(5,11,3,3,Og,x2);R2(3,7,1,2,Og);R2(4,8,1,1,Og);R2(6,7,1,2,Og);R2(5,8,1,1,Og);R2(3,11,2,1,'#5a3414');R2(4,13,3,1,Wt);}
  else{O(10,12,5,4,Og,x2);O(8,12,2,3,Wt,x2);R2(13,8-f,2,5,Og);R2(14,6-f,2,3,Og);O(8,6,4,4,Og,x2);R2(4,1,2,3,Og);R2(10,1,2,3,Og);R2(5,2,1,1,'#ff9fb2');R2(10,2,1,1,'#ff9fb2');
   R2(6,5,1,2,'#2a1f2e');R2(10,5,1,2,'#2a1f2e');R2(8,7,1,1,'#e46d8c');R2(6,15,2,2,Wt);R2(9,15,2,2,Wt);for(const x of [11,13])R2(x,10,1,3,D);}
  outl(c2,'#5a3414');return (MEMO[key]=c2);}
 function drawCat(ct){const [sx,sy]=P(ct.x,ct.y),sleep=ct.state==='sleep',f=sleep?Math.floor(R.t*1.1)%2:(ct.state==='walk'?Math.floor(R.t*6)%2:Math.floor(R.t*2)%2),img=catSprite(sleep?'sleep':'awake',f);
  O(sx,sy,8,2,'rgba(32,22,44,.25)');const flip=ct.state==='walk'&&ct.tx<ct.x;g.save();g.translate(Math.round(sx),Math.round(sy)-16);if(flip){g.scale(-1,1);}g.drawImage(img,-10,0);g.restore();
  if(sleep){R.labels.push({emoji:'💤',x:sx+6,y:sy-20-((R.t*8)%10),size:10,a:.75});}}
 function drawPigeon(pg){if(pg.back>0&&!pg.fly)return;const [sx0,sy0]=P(pg.x,pg.y,pg.z||0),sx=Math.round(sx0),sy=Math.round(sy0),peck=pg.fly>0?0:(Math.floor(pg.peck*3)%4===0?1:0);
  if(!pg.fly)F(sx-3,Math.round(P(pg.x,pg.y)[1]),6,1,'rgba(30,20,40,.3)');
  F(sx-3,sy-4,6,3,'#9aa0b0');F(sx-2,sy-5,4,1,'#b4bac8');F(sx+2,sy-4,2,1,'#7d8394');F(sx-4,sy-6+peck,2,2,'#6d7385');F(sx-5,sy-5+peck,1,1,'#f2a93b');F(sx-3,sy-3+peck,1,1,'#6fae9a');
  if(pg.fly>0){const w=Math.floor(R.t*16)%2;F(sx-2,sy-7-w*2,5,2,'#b4bac8');}else{F(sx-1,sy-1,1,1,'#e08a5a');F(sx+1,sy-1,1,1,'#e08a5a');}}
 function drawCar(car){const [sx0,sy0]=P(car.x,car.y),sx=Math.round(sx0),sy=Math.round(sy0)+4,c2=car.col,d=car.dir;
  F(sx-15,sy-1,30,3,'rgba(30,20,40,.3)');for(const wx of [-10,7]){F(sx+wx,sy-4,5,5,'#22202c');F(sx+wx+1,sy-3,3,3,'#6d7385');}
  F(sx-15,sy-12,30,9,c2);F(sx-15,sy-12,30,1,lit(c2,.3));F(sx-15,sy-5,30,2,dk(c2,.25));
  F(sx-8,sy-19,17,7,dk(c2,.08));F(sx-7,sy-21,15,3,lit(c2,.2));F(sx-6,sy-17,6,4,'#cfe6f2');F(sx+1,sy-17,6,4,'#cfe6f2');F(sx-6,sy-17,2,1,'#ffffff');
  const fx=d>0?sx+13:sx-15,bx=d>0?sx-15:sx+13;F(fx,sy-10,2,3,R.light.night>.4?'#fff7c9':'#fff1d0');F(bx,sy-10,2,3,'#e4574f');}

 /* ---------- quadro ---------- */
 function screenOf(e){const r=cv.getBoundingClientRect(),k=R.view;return [(e.clientX-r.left)/k.s-k.ox,(e.clientY-r.top)/k.s-k.oy];}
 function pick(e){if(busy())return null;const [mx,my]=screenOf(e);
  for(const n of R.scene.npcs){if(!present(n))continue;const [sx,sy]=P(n.x,n.y);if(Math.abs(mx-sx)<9&&my>sy-27&&my<sy+3)return {npc:n};}
  const cat=R.scene.cat;if(cat){const [sx,sy]=P(cat.x,cat.y);if(Math.abs(mx-sx)<11&&my>sy-16&&my<sy+3)return {cat};}
  let best=null;for(const h of R.scene.hots){let x0=h.x*TT,x1=(h.x+h.w)*TT;if(x1-x0<12){x0-=6;x1+=6;}const y0=h.y*TT-h.h*ZH-2,y1=(h.y+h.d)*TT+2;
   if(mx>=x0-2&&mx<=x1+2&&my>=y0&&my<=y1){const d=h.y+h.d;if(!best||d>best.d)best={hot:h,d};}}
  return best;}
 function lightPass(S,L,lw,lh,cx,cy){
  const tint=L.tint,nightA=S.warm?.22+L.night*.18:L.night*(S.indoor?.42:.64);
  if(tint[3]>0&&!S.warm){g.globalCompositeOperation='multiply';g.fillStyle=mix('#ffffff','#'+tint.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''),Math.min(.55,tint[3]*(S.indoor?.6:1.25)));g.fillRect(0,0,lw,lh);g.globalCompositeOperation='source-over';}
  if(S.warm){g.globalCompositeOperation='multiply';g.fillStyle='#f6d6b4';g.fillRect(0,0,lw,lh);g.globalCompositeOperation='source-over';}
  if(nightA<=.02)return;
  if(!DARK||DARK[0].width!==lw||DARK[0].height!==lh)DARK=mkc(lw,lh);const [dc,dg]=DARK;
  dg.globalCompositeOperation='source-over';dg.clearRect(0,0,lw,lh);dg.fillStyle='rgba(14,18,56,'+nightA+')';dg.fillRect(0,0,lw,lh);dg.globalCompositeOperation='destination-out';
  const on=[];for(const lp of S.lamps){if(lp.win&&(!lp.k||L.night<.35))continue;if(!lp.indoor&&!lp.win&&L.night<.25)continue;const [x,y]=P(lp.x,lp.y,lp.win?0:Math.min(lp.z,.4)),r=Math.round(lp.r*(lp.win?1:.62));on.push([Math.round(x-cx),Math.round(y-cy),r,lp.win?lp.col:(lp.indoor?'rgba(255,170,90,.12)':'rgba(255,165,70,.13)')]);}
  for(const [x,y,r] of on)for(const [k,a] of [[1,.22],[.68,.3],[.4,.42]])O(x,y,Math.max(2,Math.round(r*k)),Math.max(2,Math.round(r*k*.7)),'rgba(0,0,0,'+a+')',dg);
  g.drawImage(dc,0,0);g.globalCompositeOperation='lighter';
  for(const [x,y,r,col] of on)O(x,y,Math.round(r*.5),Math.round(r*.34),col||'rgba(255,150,60,.14)');
  g.globalCompositeOperation='source-over';}
 function draw(){const S=R.scene,L=R.light||light(R.min),dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
  const real=cv.getContext('2d'),want=S.indoor?[15,11.5]:[22,13],A=Math.max(2,Math.floor(Math.min(cv.width/(want[0]*TT),cv.height/(want[1]*TT)))),lw=Math.ceil(cv.width/A),lh=Math.ceil(cv.height/A);
  if(!LOW||LOW[0].width!==lw||LOW[0].height!==lh)LOW=mkc(lw,lh);g=LOW[1];R.labels=[];const m=modeOf(L);
  // câmera: segue você na rua; dentro de casa, enquadra o cômodo
  const [px,py]=P(R.p.x,R.p.y),mw=S.w*TT,mh=S.h*TT;let cx,cy;
  if(S.indoor){cx=Math.round((mw-lw)/2);cy=Math.round((mh-WALL-lh)/2);}
  else{cx=mw<=lw?Math.round((mw-lw)/2):Math.round(Math.max(-8,Math.min(mw-lw+8,px-lw/2)));cy=mh<=lh?Math.round((mh-lh)/2):Math.round(Math.max(-28,Math.min(mh-lh+8,py-14-lh/2)));}
  R.view={s:A/dpr,ox:-cx,oy:-cy};
  g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.fillStyle=S.indoor?(S.warm?'#1a0f0b':'#17141f'):'#5b8f4f';g.fillRect(0,0,lw,lh);
  g.drawImage(groundLayer(S,m),-32-cx,-WALL-32-cy);
  g.translate(-cx,-cy);
  const items=S.items.slice(),k=pal(),pw=R.p.walk,fr=pw?[1,0,2,0][Math.floor(R.t*8)%4]:0;
  items.push({sy:R.p.y*TT+1,draw:()=>drawPerson(k,R.p.x,R.p.y,facing(R.p,R.p.x,R.p.y,false),fr)});
  for(const n of S.npcs){if(!present(n))continue;items.push({sy:n.y*TT,draw:()=>{const d=facing(n,n.x,n.y,true),f2=n.walking?[1,0,2,0][Math.floor(n.t*7)%4]:0;drawPerson(n.k,n.x,n.y,n.sit?'down':d,f2,!!n.sit);const [sx,sy]=P(n.x,n.y);
   if(n.emoteT>0)R.labels.push({emoji:n.emote,x:sx,y:sy-30-(2.2-n.emoteT)*6,size:15,a:Math.min(1,n.emoteT)});
   else if(R.plan&&R.plan.who===n.id&&R.plan.place===S.id)R.labels.push({emoji:'⭐',x:sx,y:sy-32+Math.sin(R.t*4)*2,size:14,a:1});
   if(R.hover?.npc===n&&n.name)R.labels.push({x:sx,y:sy-40,text:n.name,o:{border:PEOPLE[n.id].col||'#7b5cd6'}});}});}
  if(S.cat)items.push({sy:S.cat.y*TT,draw:()=>{drawCat(S.cat);if(R.hover?.cat){const [sx,sy]=P(S.cat.x,S.cat.y);R.labels.push({x:sx,y:sy-26,text:'Biscoito',o:{border:'#f2a93b'}});}}});
  if(S.pigeons)for(const pg of S.pigeons)items.push({sy:pg.y*TT,draw:()=>drawPigeon(pg)});
  if(S.cars)for(const car of S.cars)items.push({sy:car.y*TT+4,draw:()=>drawCar(car)});
  // bola de vôlei das crianças por cima da rede
  if(S.id==='street'&&R.min<19*60){const b=(R.t*.9)%2,f=b<1?b:2-b,bx=(13.5+f*2)*TT,gy=(12+f*2.5)*TT,hz=Math.round(Math.sin(f*Math.PI)*26+12);items.push({sy:gy+1,draw:()=>{F(bx-2,gy,5,1,'rgba(30,20,40,.3)');F(bx-2,gy-hz-1,5,3,'#fffaf0');F(bx-1,gy-hz-2,3,5,'#fffaf0');F(bx,gy-hz-1,2,1,'#f2a93b');F(bx-1,gy-hz+1,2,1,'#3d8bf5');}});}
  items.sort((a,b)=>a.sy-b.sy).forEach(i=>i.draw());
  // varal de luzinhas da praça
  if(S.id==='street'){const ropes=[[[8.5,8.5],[19.5,8.5]],[[8.5,18.5],[19.5,18.5]],[[8.5,8.5],[8.5,18.5]],[[19.5,8.5],[19.5,18.5]]];
   for(const [[a,b],[e,f]] of ropes)for(let i=0;i<=60;i++){const t=i/60,[sx,sy]=P(a+(e-a)*t,b+(f-b)*t,2.4-Math.sin(t*Math.PI*3)**2*.3);F(sx,sy,1,1,'#3a2f2a');if(i%6===3){const col=['#ffd66b','#ff8f6b','#9be38b','#7fd0ff'][(i/6|0)%4];F(sx-1,sy+1,2,2,L.night>.3&&Math.sin(R.t*2.6-i)>-.6?lit(col,.3):col);}}}
  for(const q of R.particles){const [sx,sy]=P(q.x,q.y,q.z);const a=Math.min(1,q.life);
   if(q.kind==='leaf'){g.globalAlpha=a;F(sx+Math.round(Math.sin(q.rot)*3),sy,2,1,q.col);g.globalAlpha=1;}
   else if(q.kind==='note')R.labels.push({emoji:'♪',x:sx+Math.sin(q.life*5)*4,y:sy,size:13,a});
   else if(q.kind==='heart')R.labels.push({emoji:'❤️',x:sx,y:sy,size:12,a});
   else if(q.kind==='ring'){const r=Math.round(8*(1.4-q.life));g.globalAlpha=a;F(sx-r,sy,1,1,'#fff');F(sx+r,sy,1,1,'#fff');F(sx-1,sy-Math.round(r/2),3,1,'#fff');F(sx-1,sy+Math.round(r/2),3,1,'#fff');g.globalAlpha=1;}}
  if(R.p.path.length){const t=R.p.path[R.p.path.length-1],x0=Math.floor(t.x)*TT,y0=Math.floor(t.y)*TT,col=Math.floor(R.t*8)%2?'#fff6c0':'#f2a93b';for(const [a,b,sx2,sy2] of [[x0,y0,1,1],[x0+15,y0,-1,1],[x0,y0+15,1,-1],[x0+15,y0+15,-1,-1]]){F(Math.min(a,a+sx2*3),b,4,1,col);F(a,Math.min(b,b+sy2*3),1,4,col);}}
  if(R.hover?.hot){const h=R.hover.hot;R.labels.push({x:(h.x+h.w/2)*TT,y:h.y*TT-h.h*ZH-8,text:h.label,o:{border:'#7b5cd6'}});}
  for(const s of S.signs)R.labels.push({x:s.x,y:s.y,text:s.text,o:{bg:s.bg||'#fff7ea',size:11}});
  g.setTransform(1,0,0,1,0,0);lightPass(S,L,lw,lh,cx,cy);
  if(R.fade>0){g.fillStyle='rgba(15,16,32,'+R.fade+')';g.fillRect(0,0,lw,lh);}
  // amplia a arte sem suavizar e escreve os textos nítidos por cima
  real.setTransform(1,0,0,1,0,0);real.imageSmoothingEnabled=false;real.drawImage(LOW[0],0,0,lw*A,lh*A);
  const prev=c;c=real;for(const l of R.labels){const X=(l.x-cx)*A,Y=(l.y-cy)*A;c.setTransform(dpr,0,0,dpr,X,Y);if(l.emoji)emoji(0,0,l.emoji,l.size,l.a);else label(0,0,l.text,l.o||{});}c.setTransform(1,0,0,1,0,0);c=prev;}
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
 const MQS={};
 function mq(x,k=3){const W2=Math.ceil(760/k),H2=Math.ceil(420/k),MQ=MQS[k]||(MQS[k]=mkc(W2,H2)),q=MQ[1];q.setTransform(1,0,0,1,0,0);q.globalAlpha=1;q.globalCompositeOperation='source-over';
  const f=(a,b,w,h,col)=>F(a/k,b/k,w/k,h/k,col,q),o=(a,b,r,col,ry)=>O(a/k,b/k,Math.max(1,r/k),Math.max(1,(ry??r)/k),col,q),
   ln=(a,b,c2,d,col,th=3)=>{const n=Math.max(1,Math.ceil(Math.hypot(c2-a,d-b)/2));for(let i=0;i<=n;i++)f(a+(c2-a)*i/n-th/2,b+(d-b)*i/n-th/2,th,th,col);},
   show=()=>{x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=false;x.clearRect(0,0,760,420);x.drawImage(MQ[0],0,0,W2*k,H2*k);};
  return {f,o,ln,show,q};}
 function prizePx(q,cx,cy,id,r){cx=Math.round(cx);cy=Math.round(cy);r=Math.max(2,Math.round(r));const p=PRIZES.find(z=>z.id===id)||PRIZES[0],R2=(a,b,w,h,col)=>F(a,b,w,h,col,q);
  if(id==='chaveiro'){R2(cx-r,cy-r,2*r,2*r,'#c47d1f');R2(cx-r+1,cy-r+1,2*r-2,2*r-2,'#fff7ea');R2(cx-1,cy-1,2,2,'#c2453f');R2(cx-r+2,cy-r+2,1,1,'#c2453f');R2(cx+r-3,cy+r-3,1,1,'#c2453f');R2(cx-1,cy-r-2,2,2,'#9aa3b5');}
  else if(id==='gato'){O(cx,cy,r,r,dk(p.col,.3),q);O(cx,cy,r-1,r-1,p.col,q);R2(cx-r,cy-r-1,2,3,p.col);R2(cx+r-2,cy-r-1,2,3,p.col);R2(cx-2,cy-1,1,1,'#fff');R2(cx+1,cy-1,1,1,'#fff');R2(cx,cy+1,1,1,'#ff9fb2');}
  else if(id==='pato'){O(cx,cy+1,r,Math.max(1,r-1),p.col,q);O(cx+1,cy-r+1,Math.max(1,r-2),Math.max(1,r-2),p.col,q);R2(cx+r-1,cy-r+1,2,1,'#f2a93b');R2(cx+1,cy-r,1,1,'#241d33');R2(cx-r,cy+r-1,2*r,1,dk(p.col,.3));}
  else if(id==='fone'){R2(cx-r,cy-r,2*r,2,'#3a2f63');R2(cx-r,cy-r,2,r+1,'#3a2f63');R2(cx+r-2,cy-r,2,r+1,'#3a2f63');R2(cx-r-1,cy,3,r,p.col);R2(cx+r-2,cy,3,r,p.col);}
  else{R2(cx-r,cy-r+1,2*r,2*r-1,dk(p.col,.3));R2(cx-r+1,cy-r+2,2*r-2,2*r-3,p.col);R2(cx-r+2,cy-1,2,2,'#7fe7ff');R2(cx+r-4,cy-1,2,2,'#7fe7ff');R2(cx,cy-r-2,1,3,'#6b6f7e');R2(cx,cy-r-3,1,1,'#e46d6d');}}
 function prizeSidePx(q,cx,cy,id,r){cx=Math.round(cx);cy=Math.round(cy);r=Math.max(2,Math.round(r));const p=PRIZES.find(z=>z.id===id)||PRIZES[0],R2=(a,b,w,h,col)=>F(a,b,w,h,col,q),w=Math.max(2,Math.round(r*.6));
  if(id==='chaveiro'){R2(cx-w,cy-r,2*w,2*r,'#c47d1f');R2(cx-w+1,cy-r+1,2*w-2,2*r-2,'#fff7ea');R2(cx-1,cy-1,2,2,'#c2453f');R2(cx-1,cy-r-3,2,3,'#9aa3b5');}
  else if(id==='gato'){O(cx+1,cy+1,r,Math.max(2,r-2),dk(p.col,.3),q);O(cx+1,cy+1,r-1,Math.max(1,r-3),p.col,q);const hr=Math.max(2,Math.round(r*.55));O(cx-r+hr,cy-r+hr,hr,hr,p.col,q);R2(cx-r+hr-1,cy-r-1,2,3,p.col);R2(cx-r+1,cy-r+hr-1,1,1,'#fff');R2(cx+r,cy-2,2,Math.max(2,r-1),p.col);}
  else if(id==='pato'){O(cx+1,cy+1,r,Math.max(1,r-1),p.col,q);const hr=Math.max(2,r-3);O(cx-r+hr,cy-r+2,hr,hr,p.col,q);R2(cx-r-1,cy-r+2,3,2,'#f2a93b');R2(cx-r+hr-1,cy-r+1,1,1,'#241d33');R2(cx-r,cy+r-1,2*r,1,dk(p.col,.3));R2(cx+r-1,cy-1,2,2,dk(p.col,.15));}
  else if(id==='fone'){O(cx,cy+1,Math.max(2,r-1),Math.max(2,r-1),p.col,q);O(cx,cy+1,Math.max(1,r-3),Math.max(1,r-3),dk(p.col,.25),q);R2(cx-1,cy-r,2,3,'#3a2f63');R2(cx-r+2,cy-r-1,2*r-4,2,'#3a2f63');}
  else{R2(cx-w,cy-r+1,2*w,2*r-1,dk(p.col,.3));R2(cx-w+1,cy-r+2,2*w-2,2*r-3,p.col);R2(cx-w+1,cy-1,2,2,'#7fe7ff');R2(cx,cy-r-2,1,3,'#6b6f7e');R2(cx,cy-r-3,1,1,'#e46d6d');R2(cx+w,cy-2,1,4,'#6b6f7e');}}
 function miniOpen(title,help){R.mini=true;const el=document.getElementById('tw-mini');el.hidden=false;document.getElementById('tw-mini-title').textContent=title;document.getElementById('tw-mini-help').textContent=help;document.getElementById('tw-mini-actions').innerHTML='';
  const mc=document.getElementById('tw-mini-cv');return {mc,ctx:mc.getContext('2d')};}
 function miniPos(e){const mc=document.getElementById('tw-mini-cv'),r=mc.getBoundingClientRect();return [(e.clientX-r.left)/r.width*mc.width,(e.clientY-r.top)/r.height*mc.height];}
 function miniEnd(text,buttons){document.getElementById('tw-mini-help').textContent=text;document.getElementById('tw-mini-actions').innerHTML=buttons.map((b,i)=>'<button data-i="'+i+'">'+esc(b.t)+'</button>').join('');
  document.querySelectorAll('#tw-mini-actions button').forEach(btn=>btn.onclick=()=>buttons[+btn.dataset.i].fn());}
 function miniClose(){if(M){cancelAnimationFrame(M.raf);const mc=document.getElementById('tw-mini-cv');mc.onpointerdown=mc.onpointerup=mc.onpointermove=null;window.onkeydown=null;window.onkeyup=null;}M=null;document.getElementById('tw-mini').hidden=true;R.mini=false;hud();}
 function score(t){document.getElementById('tw-mini-score').textContent=t;}
 function results(game,opp,win){const who=opp==='Duda'?'duda':opp==='Téo'?'teo':null;diary(game==='pool'?'🎱':'🏐',(win?'Ganhou ':'Perdeu ')+(game==='pool'?'na sinuca':'no vôlei')+' contra '+opp+'.');if(who&&win)save({friends:{[who]:friend(who)+1}});else save();}

 /* ---------- sinuca mata-mata ----------
    Mesa em pé com 4 bolas azuis em cima e 4 vermelhas embaixo, encostadas nas tabelas, e a branca no centro.
    A cor de cada jogador sai da primeira bola que ele encaçapar. Encaçapou a sua, joga de novo.
    Falta (não acertar nada, bater primeiro na do adversário ou matar a branca): o adversário tira uma bola dele da mesa.
    Vence quem tirar as 4 bolas da própria cor primeiro. O efeito escolhido na branca muda o que ela faz depois da batida. */
 // Níveis da sinuca. Fácil = o adversário de antes. Médio e difícil escolhem tacadas mais retas, jogam de segurança quando
 // não há tacada boa e miram melhor, mas o erro de mira nunca é zero: no difícil um corte longo ainda falha com frequência.
 // Fácil: mira solta e escolhe mal. Médio: o adversário original (que já ganhava bastante). Difícil: escolhe bem, mira melhor, mas erra.
 // Tabela (sair da sinuca): erro normal com desvio 'bank'; quanto maior, mais vezes ele não acerta a bola dele.
 const POOL_LEVELS={facil:{name:'Fácil',err:()=>gauss()*.058,bank:.2,cut:1.3,cw:90,safe:false,loose:true,pick:220,soft:true,dumb:.08},
  medio:{name:'Médio',err:()=>gauss()*.03,bank:.085,cut:1.15,cw:180,safe:false,loose:true},
  dificil:{name:'Difícil',err:()=>gauss()*.0042,bank:.04,cut:1.05,cw:260,safe:true,sim:true}};
 let poolLevel='facil';
 function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
 function pool(opp){const {mc,ctx:x}=miniOpen('🎱 Sinuca mata-mata contra '+opp,'Mire com o mouse e segure para dar força. No disco à direita, escolha onde o taco bate na branca: em cima ela segue, no meio para, embaixo volta, dos lados faz curva. Encaçapou a sua cor, joga de novo. Errou a bola ou bateu primeiro na do adversário: ele escolhe uma bola dele para tirar da mesa.');
  const T={x:300,y:36,w:170,h:340},BR=8,PR=13,cx=T.x+T.w/2,cy=T.y+T.h/2,SPIN={x:632,y:150,r:58};
  const pockets=[[T.x,T.y],[T.x+T.w,T.y],[T.x-2,cy],[T.x+T.w+2,cy],[T.x,T.y+T.h],[T.x+T.w,T.y+T.h]];
  const balls=[{x:cx,y:cy,vx:0,vy:0,k:'cue'}];
  for(const [px,py,k] of [[cx-9,T.y+BR+1,'blue'],[cx+9,T.y+BR+1,'blue'],[T.x+BR+1,T.y+T.h*.21,'blue'],[T.x+T.w-BR-1,T.y+T.h*.21,'blue'],[cx-9,T.y+T.h-BR-1,'red'],[cx+9,T.y+T.h-BR-1,'red'],[T.x+BR+1,T.y+T.h*.79,'red'],[T.x+T.w-BR-1,T.y+T.h*.79,'red']])balls.push({x:px,y:py,hx:px,hy:py,vx:0,vy:0,k});
  R.poolSeries??={};const series=R.poolSeries[opp]??={me:0,op:0};
  const st={turn:'coin',coin:{pick:null,result:null,t:0},coinShow:0,color:{me:null,op:null},aim:[cx,T.y+40],power:0,charging:false,spinDrag:false,spin:{x:0,y:0},shot:null,over:false,think:0,msg:'Cara ou coroa? Quem ganhar começa',flash:0,choose:null};M={raf:0,balls,st};const tok=M;
  const other=p=>p==='me'?'op':'me',left=c=>balls.filter(b=>!b.out&&b.k===c).length,name=p=>p==='me'?'Você':opp,COL={blue:'#3d6fd0',red:'#d8453f'};
  const tally=p=>st.color[p]?4-left(st.color[p]):0;
  const sc=()=>score('Você '+tally('me')+' × '+tally('op')+' '+opp);sc();
  function pickCoin(c){if(st.coin.pick)return;st.coin.pick=c;st.coin.result=Math.random()<.5?'cara':'coroa';st.coin.t=0;st.msg='Você pediu '+c+'. Girando a moeda...';Amb.pop();bar();}
  const bar=()=>{if(st.over)return;miniEnd(document.getElementById('tw-mini-help').textContent,[...(st.turn==='coin'&&!st.coin.pick?[{t:'🪙 Cara',fn:()=>pickCoin('cara')},{t:'🪙 Coroa',fn:()=>pickCoin('coroa')}]:[]),...Object.entries(POOL_LEVELS).map(([k,l])=>({t:(poolLevel===k?'● ':'○ ')+l.name,fn:()=>{poolLevel=k;bar();}})),{t:'🏳 Desistir',fn:()=>{if(st.over)return;st.gaveUp=true;end(false);}}]);};bar();
  function shoot(ang,pw,spin){const cue=balls[0],v=(.045+.955*Math.pow(Math.max(0,Math.min(1,pw)),1.35))*15;cue.vx=Math.cos(ang)*v;cue.vy=Math.sin(ang)*v;cue.spin={x:spin.x,y:spin.y,hit:false};const mine=st.color[st.turn];st.shot={by:st.turn,first:null,potted:[],pottedBalls:[],leftAtStart:mine?left(mine):null};Amb.step();}
  // 0.86: a física anda em passos pequenos (no máximo 2,5 px por passo), para as batidas saírem no ângulo certo mesmo com tacada forte
  function physics(){let moving=false,vm=0;
   for(const b of balls){if(b.out)continue;
    // efeito lateral: a branca faz curva enquanto rola
    if(b.spin&&b.spin.x){const sp=Math.hypot(b.vx,b.vy);if(sp>.3){const c=b.spin.x*.03*Math.min(1,sp/5),nx=-b.vy/sp,ny=b.vx/sp;b.vx+=nx*c;b.vy+=ny*c;}b.spin.x*=.992;}
    vm=Math.max(vm,Math.hypot(b.vx,b.vy));}
   const n=Math.max(1,Math.ceil(vm/2.5));
   for(let step=0;step<n;step++){
   for(const b of balls){if(b.out)continue;b.x+=b.vx/n;b.y+=b.vy/n;
    const side=b.spin?.x||0;
    if(b.x<T.x+BR){b.x=T.x+BR;b.vx=-b.vx*.85;b.vy+=side*1.4;}if(b.x>T.x+T.w-BR){b.x=T.x+T.w-BR;b.vx=-b.vx*.85;b.vy-=side*1.4;}
    if(b.y<T.y+BR){b.y=T.y+BR;b.vy=-b.vy*.85;b.vx-=side*1.4;}if(b.y>T.y+T.h-BR){b.y=T.y+T.h-BR;b.vy=-b.vy*.85;b.vx+=side*1.4;}
    if(side&&(b.x===T.x+BR||b.x===T.x+T.w-BR||b.y===T.y+BR||b.y===T.y+T.h-BR))b.spin.x*=.5;
    for(const p of pockets)if(pocketed(b,p)){b.out=true;b.vx=b.vy=0;if(st.shot){st.shot.potted.push(b.k);st.shot.pottedBalls.push(b);}Amb.pop();break;}}
   for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.out||b.out)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
    if(d>0&&d<2*BR){const nx=dx/d,ny=dy/d,o=(2*BR-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
     if(rel>0){const cue=a.k==='cue'?a:b.k==='cue'?b:null,sp=cue?Math.hypot(cue.vx,cue.vy):0,dir=cue&&sp?[cue.vx/sp,cue.vy/sp]:null;
      a.vx-=rel*nx;a.vy-=rel*ny;b.vx+=rel*nx;b.vy+=rel*ny;if(rel>2)Amb.step();
      if(cue&&st.shot&&!st.shot.first)st.shot.first=(cue===a?b:a).k;
      // efeito alto/baixo: na primeira batida a branca segue (em cima), para (centro) ou volta (embaixo)
      if(cue&&dir&&cue.spin&&!cue.spin.hit){cue.spin.hit=true;const k=cue.spin.y*rel*.75;cue.vx+=dir[0]*k;cue.vy+=dir[1]*k;}}}}
   }
   for(const b of balls){if(b.out)continue;b.vx*=.987;b.vy*=.987;{const sp=Math.hypot(b.vx,b.vy);if(sp>0){const k=Math.max(0,sp-.011)/sp;b.vx*=k;b.vy*=k;}}if(Math.hypot(b.vx,b.vy)<.04){b.vx=b.vy=0;if(b.spin)b.spin.x=0;}else moving=true;}
   return moving;}
  // caçapa: bola rolando devagar perto da boca cai com mais facilidade (a boca 'cresce' até 6 px quando ela está quase parando);
  // a branca, rápida, passa raspando pela beirada
  // hitbox: o ponto da caçapa fica fora da área em que a bola rola, então o raio de captura é maior no canto (19) e no meio (16)
  const MOUTH=[19,19,16,16,19,19];
  function pocketed(b,p){const base=MOUTH[pockets.indexOf(p)]||PR,d=Math.hypot(b.x-p[0],b.y-p[1]),sp=Math.hypot(b.vx,b.vy),reach=base+6*Math.max(0,Math.min(1,(2.6-sp)/2.6));if(d>=reach)return false;return !(b.k==='cue'&&d>base*.6&&sp>3.5);}
  function respot(ball){ball.out=false;ball.vx=ball.vy=0;ball.x=ball.hx;ball.y=ball.hy;const free=()=>!balls.some(b=>b!==ball&&!b.out&&Math.hypot(b.x-ball.x,b.y-ball.y)<2*BR+1);
   for(let r=0;r<120&&!free();r+=4)for(let a=0;a<12&&!free();a++){ball.x=Math.max(T.x+BR,Math.min(T.x+T.w-BR,ball.hx+Math.cos(a/12*Math.PI*2)*r));ball.y=Math.max(T.y+BR,Math.min(T.y+T.h-BR,ball.hy+Math.sin(a/12*Math.PI*2)*r));}}
  function respotCue(){const cue=balls[0];cue.out=false;cue.x=cx;cue.y=cy;cue.vx=cue.vy=0;cue.spin=null;let n=0;while(balls.some(b=>b!==cue&&!b.out&&Math.hypot(b.x-cue.x,b.y-cue.y)<2*BR+1)&&n<40){cue.y+=(n%2?-1:1)*(2*BR+2)*(1+(n>>1));n++;}}
  function end(win){st.over=true;st.choose=null;if(win)series.me++;else series.op++;advance(40);results('pool',opp,win);const sui=/matou a branca na última/.test(st.msg);
   miniEnd(st.gaveUp?'Você desistiu. '+opp+' leva essa.':sui?(win?opp+' matou a branca na última bola e perdeu. Vitória sua!':'Você matou a branca na última bola e perdeu a partida.'):win?'Você matou as quatro! '+opp+' pede revanche.':opp+' matou as dele primeiro. Na próxima a mesa é sua.',[{t:'🔁 Revanche',fn:()=>{miniClose();pool(opp);}},{t:'Sair',fn:miniClose}]);}
  function checkWin(){for(const p of ['me','op'])if(st.color[p]&&!left(st.color[p])){end(p==='me');return true;}return false;}
  function removeOne(p,ball){const open=!st.color[p];if(open){st.color[p]=ball.k;st.color[other(p)]=ball.k==='blue'?'red':'blue';}ball.out=true;sc();st.flash=1;Amb.pop();st.choose=null;if(checkWin())return;
   const cor=ball.k==='blue'?'azul':'vermelha';st.msg=open?(p==='me'?'Você tirou uma '+cor+': sua cor é '+cor+'. Sua vez':opp+' tirou uma '+cor+' e ficou com essa cor. Vez de '+opp):p==='me'?'Você tirou uma bola sua. Sua vez':opp+' tirou uma bola dele. Vez de '+opp;if(st.turn==='op')st.think=55;}
  function aiRemove(){const pd=b=>Math.min(...pockets.map(p=>Math.hypot(p[0]-b.x,p[1]-b.y)));
   // mesa aberta: fica com a cor cujas bolas estão mais perto das caçapas
   let col=st.color.op;if(!col){const avg=c=>{const l=balls.filter(b=>!b.out&&b.k===c);return l.length?l.reduce((a,b)=>a+pd(b),0)/l.length:1e9;};col=avg('blue')<=avg('red')?'blue':'red';}
   const mine=balls.filter(b=>!b.out&&b.k===col);if(!mine.length)return;
   // tira a bola mais difícil de matar: a mais longe de qualquer caçapa
   const hard=mine.map(b=>({b,d:Math.min(...pockets.map(p=>Math.hypot(p[0]-b.x,p[1]-b.y)))})).sort((a,c)=>c.d-a.d)[0].b;removeOne('op',hard);}
  function settle(){const s=st.shot;st.shot=null;const me=s.by,them=other(me),colored=s.potted.filter(k=>k!=='cue');
   let foul=s.potted.includes('cue')?'matou a branca':!s.first?'não acertou nenhuma bola':st.color[me]&&s.first!==st.color[me]?'bateu primeiro na bola do adversário':null;
   if(!foul&&!st.color[me]&&colored.length){st.color[me]=colored[0];st.color[them]=colored[0]==='blue'?'red':'blue';}
   // suicídio: na última bola, matar a branca perde a partida na hora
   if(s.potted.includes('cue')&&st.color[me]&&(s.leftAtStart===1||!left(st.color[me]))){respotCue();for(const b of s.pottedBalls)if(b.k===st.color[me])respot(b);sc();st.msg=name(me)+' matou a branca na última bola.';end(me!=='me');return;}
   // falta: a bola da própria cor que caiu nesta tacada não vale e volta para a mesa
   let back=0;if(foul&&st.color[me])for(const b of s.pottedBalls)if(b.k===st.color[me]){respot(b);back++;}
   if(s.potted.includes('cue'))respotCue();sc();
   if(checkWin())return;
   const keep=!foul&&st.color[me]&&colored.includes(st.color[me]);
   st.turn=keep?me:them;st.flash=1;
   if(foul){st.msg=name(me)+' '+foul+'. '+(back?(back>1?'As bolas voltam para a mesa. ':'A bola volta para a mesa. '):'');if(!st.color[them]){if(them==='me'){st.choose='me';st.msg+='Mesa aberta: escolha qualquer bola para tirar. A cor dela vira a sua';}else{st.msg+=opp+' escolhe uma bola para tirar (e a cor dele)';st.think=40;st.choose='op';}}
    else if(left(st.color[them])){if(them==='me'){st.choose='me';st.msg+='Escolha uma bola sua para tirar da mesa';}else{st.msg+=opp+' escolhe uma bola dele para tirar';st.think=40;st.choose='op';}}else st.msg+=them==='me'?'Sua vez':'Vez de '+opp;}
   else st.msg=keep?(me==='me'?'Boa! Joga de novo':opp+' matou e joga de novo'):(st.turn==='me'?'Sua vez':'Vez de '+opp);
   if(st.turn==='op'&&!st.choose)st.think=55;}
  // simulação de uma tacada numa cópia da mesa (sem som); devolve o que caiu, a primeira bola tocada e quantas bolas suas ficam à vista da branca
  function trial(ang,pw,spin){const snap=balls.map(b=>({x:b.x,y:b.y,vx:b.vx,vy:b.vy,out:b.out,spin:b.spin?{...b.spin}:null})),shot=st.shot,pop=Amb.pop,stp=Amb.step;Amb.pop=Amb.step=()=>{};
   const cue=balls[0],v=(.045+.955*Math.pow(Math.max(0,Math.min(1,pw)),1.35))*15;cue.vx=Math.cos(ang)*v;cue.vy=Math.sin(ang)*v;cue.spin={x:spin.x,y:spin.y,hit:false};st.shot={by:'op',first:null,potted:[],pottedBalls:[]};
   for(let i=0;i<3000&&physics();i++);
   const mine=st.color.me,r={first:st.shot.first,potted:st.shot.potted.slice(),open:0};
   if(!cue.out)for(const b of balls)if(!b.out&&b!==cue&&(!mine||b.k===mine)){const h=aimHit(Math.atan2(b.y-cue.y,b.x-cue.x));if(h&&h.b===b)r.open++;}
   balls.forEach((b,i)=>Object.assign(b,snap[i]));st.shot=shot;Amb.pop=pop;Amb.step=stp;return r;}
  function aiSim(lv){const cue=balls[0],want=st.color.op,norm=a=>{a=Math.abs(a)%(Math.PI*2);return a>Math.PI?Math.PI*2-a:a;},own=k=>k!=='cue'&&(!want||k===want),pots=[];
   for(const b of balls)if(!b.out&&own(b.k))for(const p0 of pockets){const p=[Math.max(T.x+BR,Math.min(T.x+T.w-BR,p0[0])),Math.max(T.y+BR,Math.min(T.y+T.h-BR,p0[1]))],dx=p[0]-b.x,dy=p[1]-b.y,d=Math.hypot(dx,dy),gx=b.x-dx/d*2*BR,gy=b.y-dy/d*2*BR,ax=gx-cue.x,ay=gy-cue.y,ad=Math.hypot(ax,ay),cut=norm(Math.atan2(ay,ax)-Math.atan2(dy,dx));
    if(cut>lv.cut)continue;pots.push({s:d+ad+cut*lv.cw,ang:Math.atan2(ay,ax),pw:Math.min(1,(.4+(d+ad)/400)/Math.max(.55,Math.cos(cut))),cut});}
   pots.sort((a,b)=>a.s-b.s);let pot=null;
   for(const c of pots.slice(0,7)){const r=trial(c.ang,c.pw,{x:0,y:-.1});if(r.potted.includes('cue')||!r.first||!own(r.first))continue;if(r.potted.some(k=>own(k))){pot=c;break;}}
   // segurança que encurrala: encosta numa bola dele de um jeito que deixe as suas escondidas da branca
   const wantSafety=!pot||(pot.cut>.55&&Math.random()<.4);let safe=null;
   if(wantSafety){for(const t of balls){if(t.out||!own(t.k))continue;const base=Math.atan2(t.y-cue.y,t.x-cue.x);
     for(const off of [-.22,-.12,-.05,0,.05,.12,.22])for(const pw of [.22,.38]){const r=trial(base+off,pw,{x:0,y:0});if(r.potted.includes('cue')||!r.first||!own(r.first))continue;
      const sc3=r.open*100-(r.potted.some(k=>own(k))?60:0)+Math.random()*10;if(!safe||sc3<safe.s)safe={s:sc3,ang:base+off,pw,open:r.open};}}}
   if(safe&&(!pot||safe.open===0)){st.msg=safe.open===0?opp+' joga para te deixar sinucado...':opp+' joga de segurança';shoot(safe.ang+lv.err(opp),safe.pw,{x:0,y:0});return true;}
   if(pot){shoot(pot.ang+lv.err(opp),pot.pw,{x:0,y:-.1});return true;}
   return false;}
  function ai(){const cue=balls[0],want=st.color.op,lv=POOL_LEVELS[poolLevel];let best=null;if(lv.sim&&aiSim(lv))return;const norm=a=>{a=Math.abs(a)%(Math.PI*2);return a>Math.PI?Math.PI*2-a:a;};
   for(const b of balls)if(!b.out&&b.k!=='cue'&&(!want||b.k===want))for(const p0 of pockets){const p=[Math.max(T.x+BR,Math.min(T.x+T.w-BR,p0[0])),Math.max(T.y+BR,Math.min(T.y+T.h-BR,p0[1]))],dx=p[0]-b.x,dy=p[1]-b.y,d=Math.hypot(dx,dy),gx=b.x-dx/d*2*BR,gy=b.y-dy/d*2*BR,ax=gx-cue.x,ay=gy-cue.y,ad=Math.hypot(ax,ay),cut=norm(Math.atan2(ay,ax)-Math.atan2(dy,dx));
    if(cut>lv.cut)continue;const h=aimHit(Math.atan2(ay,ax));if(!h||h.b!==b||!clear(b.x,b.y,p[0],p[1],b))continue; // caminho livre até a bola e até a caçapa
    const sc2=d+ad+cut*lv.cw+(lv.pick?Math.random()*lv.pick:0);if(!best||sc2<best.s)best={s:sc2,ang:Math.atan2(ay,ax),dist:d+ad,cut};}
   const targets=balls.filter(b=>!b.out&&b.k!=='cue'&&(!want||b.k===want));
   // fácil: às vezes nem mira na caçapa, só bate numa bola dele
   if(lv.dumb&&Math.random()<lv.dumb&&targets.length){const t=targets[Math.floor(Math.random()*targets.length)];best={ang:Math.atan2(t.y-cue.y,t.x-cue.x),dist:Math.hypot(t.x-cue.x,t.y-cue.y)};}
   // sem tacada para encaçapar: pelo menos acertar uma bola dele direto
   if(!best)for(const t of targets){const a=Math.atan2(t.y-cue.y,t.x-cue.x),h=aimHit(a);if(h&&h.b===t){const d=Math.hypot(t.x-cue.x,t.y-cue.y);if(!best||d<best.dist)best={ang:a,dist:d,safety:lv.safe};}}
   // sinucado: tenta de tabela (espelha a bola na tabela e mira no reflexo); pode acertar, pode errar
   if(!best){let bank=null;const rails=[['x',T.x+BR],['x',T.x+T.w-BR],['y',T.y+BR],['y',T.y+T.h-BR]];
    for(const t of targets)for(const [ax2,L] of rails){const mx=ax2==='x'?2*L-t.x:t.x,my=ax2==='y'?2*L-t.y:t.y,k=ax2==='x'?(L-cue.x)/(mx-cue.x):(L-cue.y)/(my-cue.y);if(!(k>0&&k<1))continue;
     const rx=cue.x+(mx-cue.x)*k,ry=cue.y+(my-cue.y)*k;if(rx<T.x||rx>T.x+T.w||ry<T.y||ry>T.y+T.h||pockets.some(p=>Math.hypot(p[0]-rx,p[1]-ry)<PR+10))continue;
     if(!clear(cue.x,cue.y,rx,ry,null)||!clear(rx,ry,t.x,t.y,t))continue;const d=Math.hypot(mx-cue.x,my-cue.y);if(!bank||d<bank.dist)bank={ang:Math.atan2(my-cue.y,mx-cue.x),dist:d};}
    if(bank){st.msg=opp+' está sinucado e tenta de tabela...';shoot(bank.ang+gauss()*lv.bank,Math.min(1,.4+bank.dist/560),{x:0,y:0});return;}}
   if(!best){const t=targets[0]||balls.find(b=>!b.out&&b!==cue);best={ang:Math.atan2(t.y-cue.y,t.x-cue.x),dist:200};}
   if(best.safety){shoot(best.ang+lv.err(opp),Math.min(.6,.18+best.dist/900),{x:0,y:0});return;} // segurança: só encosta na bola dele
   shoot(best.ang+lv.err(opp),lv.soft?Math.max(.15,Math.min(.55,(.2+best.dist/650)*(1+gauss()*.18))):lv.loose?Math.min(1,.32+best.dist/520):Math.min(1,(.4+best.dist/400)/Math.max(.55,Math.cos(best.cut||0))),lv.loose?{x:0,y:(Math.random()-.4)*.5}:{x:0,y:-.1});}
  // nenhuma bola (além da ignorada e da branca) no caminho entre dois pontos
  function clear(ax,ay,bx,by,ignore){const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1;for(const b of balls){if(b.out||b===ignore||b===balls[0])continue;const t=Math.max(0,Math.min(1,((b.x-ax)*dx+(b.y-ay)*dy)/L2));if(Math.hypot(ax+dx*t-b.x,ay+dy*t-b.y)<2*BR)return false;}return true;}
  const inSpin=(px,py)=>Math.hypot(px-SPIN.x,py-SPIN.y)<=SPIN.r+6;
  function setSpin(px,py){let sx=(px-SPIN.x)/SPIN.r,sy=(py-SPIN.y)/SPIN.r;const m=Math.hypot(sx,sy);if(m>.85){sx*=.85/m;sy*=.85/m;}st.spin={x:Math.round(sx*20)/20,y:Math.round(-sy*20)/20};}
  function aimHit(a){const cue=balls[0],dx=Math.cos(a),dy=Math.sin(a);let best=null;for(const b of balls){if(b===cue||b.out)continue;const fx=cue.x-b.x,fy=cue.y-b.y,B=fx*dx+fy*dy,C=fx*fx+fy*fy-4*BR*BR,D=B*B-C;if(D<0)continue;const t=-B-Math.sqrt(D);if(t>0&&(!best||t<best.t))best={t,b};}
   if(!best)return null;const gx=cue.x+dx*best.t,gy=cue.y+dy*best.t,nx=best.b.x-gx,ny=best.b.y-gy,nd=Math.hypot(nx,ny);return {gx,gy,b:best.b,ox:nx/nd,oy:ny/nd};}
  mc.onpointermove=e=>{const [px,py]=miniPos(e);if(st.spinDrag){setSpin(px,py);return;}st.aim=[px,py];};
  mc.onpointerdown=e=>{const [px,py]=miniPos(e);if(st.over||st.turn==='coin')return;
   if(inSpin(px,py)){st.spinDrag=true;setSpin(px,py);return;}
   if(st.choose==='me'){const pick=balls.filter(b=>!b.out&&b.k!=='cue'&&(!st.color.me||b.k===st.color.me)).sort((a,b)=>Math.hypot(a.x-px,a.y-py)-Math.hypot(b.x-px,b.y-py))[0];if(pick&&Math.hypot(pick.x-px,pick.y-py)<22)removeOne('me',pick);return;}
   st.aim=[px,py];if(st.turn==='me'&&!st.shot){st.charging=true;st.power=0;}};
  mc.onpointerup=()=>{if(st.spinDrag){st.spinDrag=false;return;}if(!st.charging)return;st.charging=false;const cue=balls[0];shoot(Math.atan2(st.aim[1]-cue.y,st.aim[0]-cue.x),st.power,st.spin);};
  function tick(){if(st.turn==='coin'){if(st.coin.pick&&++st.coin.t===80){const win=st.coin.pick===st.coin.result;st.msg='Deu '+st.coin.result+'! '+(win?'Você começa · a mesa está aberta':opp+' começa · a mesa está aberta');st.flash=1;st.coinShow=90;st.turn=win?'me':'op';if(!win)st.think=60;Amb.pop();}return;}
   if(st.shot){const m=physics()||physics();if(!m)settle();}else if(st.turn==='op'&&!st.over){if(--st.think<=0){if(st.choose==='op')aiRemove();else ai();}}}
  M.tick=tick; // gancho de teste: avança a lógica sem desenhar
  function loop(){if(st.charging)st.power=Math.min(1,st.power+.018);if(st.flash>0)st.flash-=.02;
   tick();
   // desenho em pixel art (1 pixel de arte = 2 da mesa)
   const {f,o,ln,show}=mq(x,2),felt='#2f8651',t=R.t;
   f(0,0,760,420,'#3a2116');for(let y=0;y<420;y+=24){f(0,y,760,2,'#2c180f');for(let k=0;k<760;k+=96)f(k+((y/24)%2)*48,y,2,24,'#2c180f');}
   // quadro de giz com o placar riscado
   f(24,30,236,206,'#7a4a2a');f(30,36,224,194,'#2c4a3a');for(let i=0;i<40;i++)f(36+((i*97)%210),42+((i*61)%180),2,2,'#35574a');
   const chalk='#f2efe2';
   [['me',78],['op',150]].forEach(([p,yy])=>{if(st.color[p])o(48,yy-4,7,COL[st.color[p]]);for(let i=0;i<tally(p);i++){ln(150+i*14,yy-16,152+i*14,yy+6,chalk,3);}
    for(let i=0;i<Math.min(9,series[p]);i++){ln(150+i*10,yy+22,151+i*10,yy+34,'#d9d4c2',2);}});
   f(40,110,204,2,'#7f9c8c');f(30,226,224,4,'#5a3b26');f(70,222,18,4,'#f2efe2');f(96,223,10,3,'#e8b4c0');
   // mensagem
   if(st.msg){f(24,252,236,52,st.flash>0?'#5a3b26':'#2a1a10');f(24,252,236,2,'#7a4a2a');}
   // mesa em pé
   f(T.x-24,T.y-24,T.w+48,T.h+48,'#150b06');f(T.x-22,T.y-22,T.w+44,T.h+44,'#8a5530');f(T.x-22,T.y-22,T.w+44,4,'#a8703f');f(T.x-22,T.y+T.h+18,T.w+44,4,'#5c3520');
   for(const p of [.25,.5,.75]){f(T.x+T.w*p-2,T.y-16,4,4,'#f4e6b0');f(T.x+T.w*p-2,T.y+T.h+12,4,4,'#f4e6b0');}for(const p of [.125,.375,.625,.875]){f(T.x-16,T.y+T.h*p-2,4,4,'#f4e6b0');f(T.x+T.w+12,T.y+T.h*p-2,4,4,'#f4e6b0');}
   f(T.x-8,T.y-8,T.w+16,T.h+16,'#1d5632');f(T.x,T.y,T.w,T.h,felt);f(T.x+20,T.y+30,T.w-40,T.h-60,'#33905a');f(T.x+50,T.y+90,T.w-100,T.h-180,'#389a60');
   for(let i=0;i<50;i++)f(T.x+((i*131)%T.w),T.y+((i*71)%T.h),2,2,i%2?'#2a7a4a':'#3c9e64');f(T.x,T.y,T.w,4,'#25703f');f(T.x,T.y,4,T.h,'#25703f');
   f(T.x,cy-1,T.w,2,'#55b47a');
   for(const p of pockets){o(p[0],p[1],PR+5,'#c79a56');o(p[0],p[1],PR+2,'#5a3b1c');o(p[0],p[1],PR,'#0e0805');}
   const cue=balls[0],my=st.turn==='me'&&!st.shot&&!st.over&&!st.choose&&!cue.out;
   if(my){const a=Math.atan2(st.aim[1]-cue.y,st.aim[0]-cue.x),h=aimHit(a),len=h?Math.hypot(h.gx-cue.x,h.gy-cue.y):300;
    // mira curta: só 6 pontinhos; o círculo de contato aparece apenas se a bola estiver dentro desse alcance
    const REACH=14+10*5;for(let k=14,n=0;k<len&&n<6;k+=10,n++)f(cue.x+Math.cos(a)*k-1,cue.y+Math.sin(a)*k-1,2,2,'#e9fff0');
    if(h&&len<=REACH){for(let k=0;k<16;k++){const b=k/16*Math.PI*2;f(h.gx+Math.cos(b)*BR-1,h.gy+Math.sin(b)*BR-1,2,2,'#ffffff');}}
    const back=20+st.power*45,dx=-Math.cos(a),dy=-Math.sin(a);
    for(let k=0;k<170;k+=2){const px=cue.x+dx*(back+k),py=cue.y+dy*(back+k),col=k<3?'#3d8bd0':k<8?'#fbfbf5':k<95?'#e3c08a':k<98?'#e2c26a':'#4a2618';f(px+3,py+5,3,3,'rgba(0,0,0,.25)');f(px-1,py-1,k>98?4:3,k>98?4:3,col);}}
   for(const b of balls){if(b.out)continue;const col=b.k==='cue'?'#fbfbf5':COL[b.k];o(b.x+2,b.y+3,BR,'rgba(0,0,0,.4)');o(b.x,b.y,BR,dk(col,.45));o(b.x-1,b.y-1,BR-2,col);f(b.x-4,b.y-5,2,2,'#ffffff');
    if(st.choose==='me'&&b.k!=='cue'&&(!st.color.me||b.k===st.color.me)){const pulse=Math.floor(t*6)%2;for(let k=0;k<16;k++){const a=k/16*Math.PI*2;f(b.x+Math.cos(a)*(BR+4+pulse)-1,b.y+Math.sin(a)*(BR+4+pulse)-1,2,2,'#ffe46b');}}}
   // disco de efeito: onde o taco bate na branca
   o(SPIN.x,SPIN.y,SPIN.r+6,'#1a0e08');o(SPIN.x,SPIN.y,SPIN.r+3,'#5a3b26');o(SPIN.x,SPIN.y,SPIN.r,'#f6f2e8');o(SPIN.x-14,SPIN.y-16,SPIN.r*.55,'#fffdf8');
   f(SPIN.x-SPIN.r,SPIN.y-1,SPIN.r*2,2,'#d8d2c4');f(SPIN.x-1,SPIN.y-SPIN.r,2,SPIN.r*2,'#d8d2c4');
   const dxs=SPIN.x+st.spin.x*SPIN.r,dys=SPIN.y-st.spin.y*SPIN.r;o(dxs,dys,8,'#7a1f1a');o(dxs,dys,6,'#e2453f');f(dxs-3,dys-4,2,2,'#ffb0a0');
   if(st.charging){f(560,240,144,16,'#1a0e08');for(let k=0;k<Math.floor(140*st.power/6);k++)f(562+k*6,242,5,12,k<10?'#4fbf8a':k<17?'#f2a93b':'#e46d6d');}
   show();
   // textos nítidos por cima
   x.fillStyle='#f2efe2';x.font='800 15px '+FONT;x.fillText('VOCÊ',62,80);x.fillText(opp.toUpperCase(),62,152);x.font='700 10px '+FONT;x.fillStyle='#b9c9bc';x.fillText('bolas',62,94);x.fillText('bolas',62,166);x.fillText('partidas',62,108);x.fillText('partidas',62,180);
   x.font='800 13px '+FONT;x.fillStyle=st.flash>0?'#ffe46b':'#fff';const words=st.msg.split(' ');let line='',ly=272;for(const w2 of words){if(x.measureText(line+w2).width>214){x.fillText(line,36,ly);line='';ly+=17;}line+=w2+' ';}x.fillText(line,36,ly);
   x.fillStyle='#f2efe2';x.font='800 12px '+FONT;x.textAlign='center';x.fillText('EFEITO NA BRANCA',SPIN.x,72);x.font='700 11px '+FONT;x.fillStyle='#e8dcc0';
   x.fillText('segue ▲',SPIN.x,SPIN.y-SPIN.r-12+4);x.fillText('volta ▼',SPIN.x,SPIN.y+SPIN.r+22);x.fillText('◀ curva',SPIN.x-SPIN.r-38,SPIN.y+4);x.fillText('curva ▶',SPIN.x+SPIN.r+38,SPIN.y+4);
   const sy2=st.spin.y,sx2=st.spin.x;x.fillStyle='#fff';x.font='800 12px '+FONT;x.fillText(Math.abs(sy2)<.15&&Math.abs(sx2)<.15?'centro: a branca para':sy2>=.15?'em cima: a branca segue':sy2<=-.15?'embaixo: a branca volta':'',SPIN.x,SPIN.y+SPIN.r+42);if(Math.abs(sx2)>=.15)x.fillText(sx2>0?'com curva para a direita':'com curva para a esquerda',SPIN.x,SPIN.y+SPIN.r+58);
   if(st.charging){x.fillText('FORÇA',SPIN.x,236);}x.textAlign='left';
   if(st.coin.pick&&(st.turn==='coin'||st.coinShow>0)){if(st.coinShow>0)st.coinShow--;const t=st.coin.t,spin=st.turn==='coin',w=spin?Math.max(2,Math.abs(Math.cos(t*.32))*24):24,yy=cy-(spin?Math.sin(Math.min(1,t/80)*Math.PI)*70:0),face=spin?(Math.cos(t*.32)>0?'cara':'coroa'):st.coin.result;
    x.save();x.globalAlpha=st.turn==='coin'?1:Math.min(1,st.coinShow/30);x.fillStyle='#8a6a1c';x.beginPath();x.ellipse(cx,yy+3,w,24,0,0,Math.PI*2);x.fill();x.fillStyle=face==='cara'?'#f2c94c':'#e0b13a';x.beginPath();x.ellipse(cx,yy,w,24,0,0,Math.PI*2);x.fill();
    if(w>12){x.fillStyle='#8a6a1c';x.font='900 18px '+FONT;x.textAlign='center';x.fillText(face==='cara'?'☺':'♛',cx,yy+6);}if(!spin){x.font='900 16px '+FONT;x.fillStyle='#fff';x.strokeStyle='#241d33';x.lineWidth=4;x.textAlign='center';const tt=st.coin.result.toUpperCase();x.strokeText(tt,cx,yy+46);x.fillText(tt,cx,yy+46);}x.restore();x.textAlign='left';}
   if(M===tok)M.raf=requestAnimationFrame(loop);}
  M.raf=requestAnimationFrame(loop);}

 /* ---------- vôlei em duplas (0.86) ----------
    Visto de lado, de mais longe. Você anda com as setas e o toque é automático, conforme onde você está em relação à bola:
    bem embaixo dela você levanta, um pouco atrás você devolve para o outro lado, à frente dela a bola vai para trás.
    Bola levantada pelo seu time pode ser cortada: segure o pulo perto dela e solte quando a linha vermelha apontar para a quadra deles.
    Ninguém toca duas vezes seguidas. Dois do mesmo time embaixo da bola: ela sai para qualquer lado. "Minha!" e "Sua!" combinam quem vai. */
 function volley(opp){const {mc,ctx:x}=miniOpen('🏐 Vôlei em duplas contra '+opp,'Setas ← → andam. O toque é automático: bem embaixo da bola você levanta, um pouco atrás dela você devolve, e se estiver à frente dela ela vai para trás. Bola levantada pelo seu time: chegue perto, segure ESPAÇO (ou PULO) e solte quando a linha vermelha apontar para a quadra deles. Colado na rede, o pulo levanta os braços e bloqueia. Ninguém toca duas vezes seguidas. Seta ↑ grita "Minha!", seta ↓ grita "Sua!". No saque, aperte ESPAÇO para jogar a bola e de novo com a bolinha no azul (se ela voltar para a mão, errou). SHIFT troca quem fica na frente e quem fica atrás. Quem fizer 5 pontos vence.');
  const G=.26,FLOOR=360,NET=380,NETTOP=FLOOR-96,CL=30,CR=730,BTOP=FLOOR-92,BBOT=FLOOR-24,REACH=50,UNDER=21,SPK=11,JUMP=80;
  const opK=opp==='Duda'?PEOPLE.duda.k:{shirt:'#6c8fd1',trim:'#4a6bb0',hair:'#5a3b26',skin:'#edbd97',pants:'#2d2a4a',style:'short'};
  const mk=(id,team,name,k,home,front,back)=>({id,team,name,k,x:home,home,front,back,hit:0,jump:0,jmax:1,blockIn:-1,err:0,plan:null,walk:0,moving:false});
  const me=mk('me',0,'Você',pal(),120,290,120),mate=mk('mate',0,'Lia',{shirt:'#4fbf8a',trim:'#2f8a5e',hair:'#2a1a12',skin:'#c98e6a',pants:'#2d2a4a',style:'long'},290,290,120),
   op=mk('op',1,opp,opK,640,470,640),op2=mk('op2',1,'Caio',{shirt:'#f2a93b',trim:'#b8761f',hair:'#3b2a2a',skin:'#a86b4a',pants:'#3a3560',style:'curly'},470,470,640),P=[me,mate,op,op2];
  const ball={x:0,y:0,vx:0,vy:0,live:false,last:null,team:0,set:false,spin:0,spiked:0};
  const st={pts:[0,0],serve:0,wait:60,msg:'',msgT:0,aim:null,toss:null,wantSpike:false,over:false,pop:0,call:null,bubbles:[],charge:null,keys:{},acc:0,rally:0};
  M={raf:0,st,ball,P};const tok=M;const sc=()=>score('Você e Lia '+st.pts[0]+' × '+st.pts[1]+' '+opp+' e Caio');sc();const L=light(R.min);
  const rnd=(a,b)=>a+Math.random()*(b-a),dirOf=p=>p.team?-1:1,sideOf=xx=>xx<NET?0:1,byId=id=>P.find(p=>p.id===id);
  const own=t=>t?[NET+34,CR-24]:[CL+24,NET-34],theirs=t=>own(1-t);
  const msg=(t,d=120)=>{st.msg=t;st.msgT=d;},hop=(p,n,arms)=>{p.jump=n;p.jmax=n;p.arms=!!arms;};
  const shout=(p,t)=>{st.bubbles=st.bubbles.filter(b=>b.p!==p);st.bubbles.push({p,t,life:75});};
  const tTo=h=>ball.y>=h?0:(-ball.vy+Math.sqrt(ball.vy*ball.vy+2*G*(h-ball.y)))/G;
  const contactX=()=>ball.x+ball.vx*tTo(FLOOR-56),landX=()=>ball.x+ball.vx*tTo(FLOOR);
  function launch(fx,fy,tx,apex){const top=Math.min(apex,fy-10),vy=-Math.sqrt(2*G*(fy-top)),t=(-vy+Math.sqrt(vy*vy+2*G*(FLOOR-fy)))/G;ball.x=fx;ball.y=fy;ball.vx=(tx-fx)/t;ball.vy=vy;ball.live=true;ball.spiked=0;ball.netted=false;ball.serve=false;ball.forceNet=false;ball.shared=false;Amb.pop();}
  // bola nova no ar: a IA erra um pouco a posição; se vem para o seu lado, a Lia às vezes (1 em 5) diz de quem é
  function newBall(){for(const p of P){p.err=p.team?rnd(-15,15):rnd(-9,9);p.plan=null;}
   if(ball.team===0&&sideOf(landX())===1&&Math.random()<.55){const cx=contactX(),g=Math.abs(cx-op.x)<=Math.abs(cx-op2.x)?op:op2;shout(g,'Minha!');}
   if(ball.team===0){st.call=null;return;}
   if(sideOf(landX())===0){st.call=null;if(Math.random()<.2){const cx=contactX(),mine=Math.abs(cx-mate.x)<Math.abs(cx-me.x);shout(mate,mine?'Minha!':'Sua!');st.call={who:mine?'mate':'me',by:'mate'};}}}
  function touch(p,kind){const f=dirOf(p),fy=Math.min(ball.y,FLOOR-40);
   if(kind==='set'){const [a,b]=own(p.team);launch(ball.x,fy,Math.max(a,Math.min(b,ball.x+f*rnd(50,75))),FLOOR-270);}
   else if(kind==='pass'){const [a,b]=theirs(p.team);launch(ball.x,fy,rnd(a,b),FLOOR-220);}
   else if(kind==='back')launch(ball.x,fy,ball.x-f*rnd(90,260),FLOOR-205);
   else launch(ball.x,fy,rnd(CL-90,CR+90),FLOOR-rnd(150,280));
   ball.set=kind==='set';ball.last=p.id;ball.team=p.team;p.hit=1;st.rally++;newBall();
   if(p===me)msg(kind==='set'?'Levantou!':kind==='pass'?'Devolveu.':kind==='back'?'Foi para trás...':'',70);}
  const goingOut=()=>{const lx=landX();return lx<CL-4||lx>CR+4;}; // a IA deixa sair a bola que vai para fora
  const kindFor=p=>{const rel=(ball.x-p.x)*dirOf(p);return Math.abs(rel)<=UNDER?'set':rel>0?'pass':'back';};
  function contacts(){if(!(ball.vy>0&&ball.y>=BTOP&&ball.y<=BBOT))return;
   const near=P.filter(p=>Math.abs(ball.x-p.x)<=REACH&&p.jump<=0&&!(ball.spiked&&ball.noDig&&p!==me&&p.team!==ball.team)&&!(p!==me&&p.team!==ball.team&&goingOut())&&!(ball.serve&&p.team===ball.team));if(!near.length)return; // corte forte: a IA às vezes não consegue defender
   const side=sideOf(ball.x),fresh=near.filter(p=>p.id!==ball.last||ball.shared).sort((a,b)=>(b.team===side)-(a.team===side));
   if(!fresh.length){if(st.msg!=='Não pode tocar novamente')msg('Não pode tocar novamente',80);return;} // quem tocou por último não toca de novo: a bola passa direto
   const same=fresh.filter(p=>p.team===fresh[0].team);
   if(same.length>1){touch(same[Math.floor(Math.random()*2)],'wild');ball.shared=true; // dividida: os dois podem tocar de novo
    shout(same[0]===me?same[1]:same[0],'Opa!');msg('Os dois foram na mesma bola!',110);return;}
   touch(fresh[0],kindFor(fresh[0]));}
  // corte
  const spikeable=p=>ball.live&&ball.set&&ball.team===p.team&&ball.last!==p.id&&sideOf(ball.x)===p.team&&Math.abs(ball.x-p.x)<68&&ball.y>FLOOR-205&&ball.y<FLOOR-104;
  function sim(a,f,pts){let xx=ball.x,yy=ball.y,vx=Math.cos(a)*SPK*f,vy=Math.sin(a)*SPK;for(let i=0;i<300;i++){const px=xx;xx+=vx;yy+=vy;vy+=G;if(pts)pts.push([xx,yy]);if((px-NET)*(xx-NET)<=0&&yy>NETTOP)return {net:true};if(yy>=FLOOR)return {land:xx};}return {};}
  function spike(p,a){const f=dirOf(p);ball.vx=Math.cos(a)*SPK*f;ball.vy=Math.sin(a)*SPK;ball.last=p.id;ball.team=p.team;ball.set=false;ball.spiked=1;ball.noDig=Math.random()<.55;ball.netted=false;ball.shared=false;p.hit=1;hop(p,26);st.rally++;Amb.pop();newBall();const tNet=Math.abs((NET-ball.x)/(ball.vx||1e-3));for(const q of P)if(q.team!==p.team&&q!==me&&Math.abs(q.x-NET)<70&&Math.random()<.2)q.blockIn=Math.max(0,Math.round(tNet-13));}
  function aiSpike(p){const f=dirOf(p),good=[];for(let a=-.7;a<=.5;a+=.03){const r=sim(a,f);if(r.land!=null&&sideOf(r.land)!==p.team&&r.land>CL+10&&r.land<CR-10)good.push(a);}
   spike(p,(good.length?good[Math.floor(Math.random()*good.length)]:.05)+rnd(-.06,.06));}
  function release(){const c=st.charge;if(!c)return;st.charge=null;hop(me,18);if(ball.live&&Math.abs(ball.x-me.x)<76&&ball.y<FLOOR-48){spike(me,c.a);msg('Corte!',80);}else msg('Errou o tempo do corte.',100);}
  function point(team,why){if(!ball.live)return;ball.live=false;st.charge=null;st.pts[team]++;sc();st.serve=team;st.wait=110;st.pop=1;st.call=null;st.rally=0;msg((team===0?'Ponto de vocês! ':'Ponto deles. ')+why,999);
   if(st.pts[0]>=5||st.pts[1]>=5){st.over=true;const win=st.pts[0]>=5;advance(45);results('volley',opp,win);miniEnd(win?'Vitória! '+opp+' e Caio pedem revanche.':opp+' e Caio venceram. Foi por pouco!',[{t:'🔁 Revanche',fn:()=>{miniClose();volley(opp);}},{t:'Sair',fn:miniClose}]);}}
  // saque: você para a bolinha na barra (verde = saque forte, amarelo = normal, vermelho = erra); depois joga a bola para o alto e bate
  const zone=v=>v>=.85?'yellow':v>=.7?'blue':v>=.5?'yellow':'red',TOSS={vy:-6,g:.12},HAND=FLOOR-96,TOP=HAND-TOSS.vy*TOSS.vy/(2*TOSS.g);
  function serveStart(){if(st.serve===0){st.aim={t:0};msg('Seu saque: aperte ESPAÇO (ou PULO) para jogar a bola para cima',999);}else{const r=Math.random();st.toss={s:op,q:r<.25?'blue':r<.9?'yellow':'red',y:HAND,vy:-6.5,g:.26};msg('',1);}}
  const tossV=()=>st.toss?Math.max(0,Math.min(1,(HAND-st.toss.y)/(HAND-TOP))):0;
  function tossUp(){st.aim=null;st.toss={s:me,q:null,y:HAND,vy:TOSS.vy,g:TOSS.g};msg('Bata com a bolinha no azul!',999);}
  function serveHit(){const q=zone(tossV());st.toss.q=q;msg(q==='blue'?'Saque perfeito!':q==='yellow'?'Saque ok.':'Ih, errou o saque...',90);serve();}
  function serve(){const T2=st.toss,s=T2.s,f=dirOf(s),[a,b]=theirs(s.team),fx=s.x+f*14,fy=T2.y;st.toss=null;hop(s,18);s.hit=1;
   if(T2.q==='blue'){const deep=s.team?[CL+30,CL+150]:[CR-150,CR-30];launch(fx,fy,rnd(deep[0],deep[1]),FLOOR-190);ball.spiked=1;ball.noDig=Math.random()<.4;}
   else if(T2.q==='yellow')launch(fx,fy,s.team?rnd(CL+24,NET-80):rnd(NET+80,CR-24),FLOOR-245);
   else if(Math.random()<.5){launch(fx,fy,NET+f*rnd(20,60),FLOOR-200);ball.forceNet=true;} // na rede
   else launch(fx,fy,s.team?CL-rnd(40,120):CR+rnd(40,120),FLOOR-230); // fora
   ball.last=s.id;ball.team=s.team;ball.set=false;ball.serve=true;newBall();}
  // IA: a Lia e a dupla adversária
  function ai(p){if(p.jump>0){p.moving=false;return;}const f=dirOf(p);let tx=p.home;
   if(ball.live){const cx=contactX();
    if(sideOf(cx)===p.team){const lastMate=!!ball.last&&byId(ball.last).team===p.team;let goer;
     if(lastMate)goer=P.find(q=>q.team===p.team&&q.id!==ball.last);
     else if(p.team===0)goer=st.call?(st.call.who==='me'?me:mate):(Math.abs(cx-mate.x)<Math.abs(cx-me.x)+40?mate:me);
     else goer=Math.abs(cx-op.x)<=Math.abs(cx-op2.x)?op:op2;
     if(goer===p){const up=ball.set&&lastMate;if(up&&!p.plan)p.plan=Math.random()<.75?'spike':'pass';
      tx=cx-(up?(p.plan==='spike'?14:28):0)*f+p.err;
      if(up&&p.plan==='spike'&&spikeable(p)&&ball.vy>0&&ball.y>FLOOR-200){aiSpike(p);return;}}
     else{tx=Math.abs(cx-p.front)>Math.abs(cx-p.back)?p.front:p.back;if(Math.abs(tx-cx)<REACH+26)tx=cx+(tx>=cx?1:-1)*(REACH+26);}}}
   if(ball.live&&ball.set&&ball.team!==p.team&&sideOf(ball.x)!==p.team){const mates=P.filter(q=>q.team===p.team),front=p.team===0?(Math.abs(me.x-NET)<70?null:mate):mates.sort((a,b)=>Math.abs(a.home-NET)-Math.abs(b.home-NET))[0];if(front===p)tx=NET-dirOf(p)*30;} // vai para a rede bloquear
   const [lo,hi]=p.team?[NET+16,CR+40]:[CL-40,NET-16];tx=Math.max(lo,Math.min(hi,tx));const d=Math.max(-3.1,Math.min(3.1,tx-p.x));p.x+=d;p.moving=Math.abs(d)>.3;p.walk+=Math.abs(d);}
  const jhOf=p=>p===me&&st.charge?JUMP+6:p.jump>0?Math.sin(Math.PI*Math.min(1,p.jump/p.jmax))*JUMP:0;
  function block(){for(const p of P){if(p.team===ball.team||p.jump<=0||!p.arms||jhOf(p)<JUMP*.45||(p===me&&st.charge)||Math.abs(p.x-NET)>62||Math.abs(ball.x-NET)>28)continue;const top=FLOOR-80-jhOf(p)-56;
    if(ball.y>top&&ball.y<FLOOR-36){const back=ball.team===0?-1:1;ball.x=NET+back*16;ball.vx=back*Math.max(1.6,Math.abs(ball.vx)*.45);ball.vy=Math.abs(ball.vy)*.2+.5;ball.last=p.id;ball.team=p.team;ball.set=false;ball.spiked=0;p.hit=1;Amb.pop();newBall();msg(p===me?'Bloqueio!':p.name+' bloqueou!',90);return true;}}return false;}
  function airHit(){for(const p of P){if(p.jump<=0||(p===me&&st.charge)||sideOf(ball.x)!==p.team||(ball.last===p.id&&!ball.shared)||Math.abs(ball.x-p.x)>REACH)continue;const hand=FLOOR-80-jhOf(p)-24;
    if(ball.y>hand-30&&ball.y<hand+26){const f=dirOf(p),good=[];for(let a=-.5;a<=.6;a+=.04){const r=sim(a,f);if(r.land!=null&&sideOf(r.land)!==p.team&&r.land>CL+10&&r.land<CR-10)good.push(a);}
     spike(p,(good.length?good[Math.floor(good.length/2)]:.1)+rnd(-.12,.12));ball.spiked=0;msg(p===me?'Bateu no ar!':'',70);return true;}}return false;}
  function step(){if(!ball.live)return;const px=ball.x;ball.x+=ball.vx;ball.y+=ball.vy;ball.vy+=G;ball.spin+=ball.vx*.05;if(block()||airHit())return;
   if((px-NET)*(ball.x-NET)<=0&&(ball.y>NETTOP||ball.forceNet)){ball.vx=-ball.vx*.25;ball.x=px;ball.set=false;ball.netted=true;if(ball.serve){point(1-ball.team,'Saque na rede.');return;}}
   if(st.charge&&ball.y>FLOOR-56)release();
   if(ball.y>=FLOOR){ball.y=FLOOR;const lx=ball.x;if(lx<CL||lx>CR)point(1-ball.team,'Bola fora.');else{const s=sideOf(lx);point(1-s,s===0?'A bola caiu do lado de vocês.':'A bola caiu do lado deles.');}return;}
   contacts();}
  // controles: setas e espaço no teclado, ou os botões na areia
  const press=k=>{if(st.over)return;if(k==='l'||k==='r')st.keys[k]=true;else if(k==='t'){const h=me.home;me.home=mate.home;mate.home=h;shout(me,'Troca!');}else if(k==='u'){shout(me,'Minha!');st.call={who:'me',by:'me'};}else if(k==='d'){shout(me,'Sua!');st.call={who:'mate',by:'me'};}
   else if(k==='j'){st.keys.j=true;if(st.aim){tossUp();return;}if(st.toss&&st.toss.s===me){serveHit();return;}if(st.charge||me.jump>0||!ball.live)return;
    if(spikeable(me)){st.charge={a:-.04};hop(me,1);}
    else if(ball.set&&ball.team===0&&ball.last!==me.id&&sideOf(ball.x)===0)st.wantSpike=true; // segurou cedo: o corte começa quando a bola chegar
    else{if(me.cool>0)return;hop(me,32,Math.abs(me.x-NET)<46);me.cool=58;}}};
  const lift=k=>{st.keys[k]=false;if(k==='j'){st.wantSpike=false;release();}};
  const KEY={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'u',ArrowDown:'d',Space:'j',ShiftLeft:'t',ShiftRight:'t'};
  window.onkeydown=e=>{const k=KEY[e.code];if(!k)return;e.preventDefault();if(!e.repeat)press(k);};window.onkeyup=e=>{const k=KEY[e.code];if(k)lift(k);};
  const BTN=[{k:'l',x:14,y:372,w:46,h:38},{k:'r',x:66,y:372,w:46,h:38},{k:'t',x:126,y:372,w:110,h:38,t:'TROCA',s:'SHIFT'},{k:'j',x:630,y:372,w:116,h:38,t:'PULO'}];
  let held=null;mc.onpointerdown=e=>{const [px,py]=miniPos(e),b=BTN.find(b=>px>=b.x&&px<=b.x+b.w&&py>=b.y&&py<=b.y+b.h);if(b){held=b.k;press(b.k);}};mc.onpointerup=()=>{if(held)lift(held);held=null;};
  function update(){if(!st.over){
    if(ball.live){st.acc+=st.charge?.25:1;while(st.acc>=1&&ball.live){st.acc--;step();}st.acc=Math.min(st.acc,1); // segurando o corte, o tempo desacelera
     if(!st.charge&&me.jump<=0){const d=((st.keys.r?1:0)-(st.keys.l?1:0))*3.7;me.x=Math.max(CL-40,Math.min(NET-16,me.x+d));me.moving=d!==0;me.walk+=Math.abs(d);}else me.moving=false;
     if(st.wantSpike&&st.keys.j&&!st.charge&&ball.vy>0&&spikeable(me)){st.wantSpike=false;st.charge={a:-.04};hop(me,1);}
     if(st.charge)st.charge.a=Math.min(.95,st.charge.a+.009);
     for(const p of P)if(p!==me)ai(p);
     if(st.crowd>0)st.crowd--;else{const cx=contactX(),t=sideOf(cx);const pair=P.filter(q=>q.team===t);if(ball.vy>0&&Math.abs(pair[0].x-pair[1].x)<34&&Math.abs(pair[0].x-cx)<80){const near=Math.abs(pair[0].x-cx)<=Math.abs(pair[1].x-cx)?pair[0]:pair[1];shout(near,'Sai!');st.crowd=90;}}}
    else if(!st.over){for(const p of P){const srv=(st.serve===0&&p===me)||(st.serve===1&&p===op),tx=srv?(p.team?CR-4:CL+4):p.home,d=Math.max(-4,Math.min(4,tx-p.x));p.x+=d;p.moving=Math.abs(d)>.3;p.walk+=Math.abs(d);}if(st.wait>0){if(--st.wait<=0)serveStart();}
     else if(st.aim){if(++st.aim.t>360)tossUp();} // 6 s sem apertar: joga a bola sozinho
     else if(st.toss){const t=st.toss;t.y+=t.vy;t.vy+=t.g;
      if(t.s!==me){if(t.vy>=0)serve();}
      else if(t.vy>0&&t.y>=HAND){st.toss=null;ball.live=true;ball.team=0;point(1,'A bola voltou para a mão: errou o saque.');}}}
    for(const p of P){if(p.cool>0)p.cool--;if(p.blockIn>=0&&p.blockIn--===0)hop(p,30,true);p.hit=Math.max(0,p.hit-.05);if(p.jump>0&&!(p===me&&st.charge))p.jump--;}
    st.pop=Math.max(0,st.pop-.02);if(st.msgT>0&&--st.msgT<=0)st.msg='';for(const b of st.bubbles)b.life--;st.bubbles=st.bubbles.filter(b=>b.life>0);}}
  M.update=update; // gancho de teste: avança a lógica sem desenhar
  function loop(){update();
   // desenho em pixel art, com a quadra vista de mais longe (1 pixel de arte = 4 da tela)
   const {f,o,ln,show,q}=mq(x,3),N=L.night;
   for(let i=0;i<15;i++)f(0,i*24,762,24,mix(L.sky[0],L.sky[1],i/14));
   if(N>.3)for(let i=0;i<40;i++)if(Math.sin(R.t*.8+i*1.7)>-.3)f(((i*.61803)%1)*760,((i*.754877)%1)*200,4,4,'#ffffff');
   if(N<.7){const k=Math.max(0,Math.min(1,(R.min-600)/570)),sx=110+540*k,sy=50+150*k*k;o(sx,sy,28,mix('#fff6c9','#ffb36b',k)+'55');o(sx,sy,20,mix('#fff6c9','#ffb36b',k));}
   else{o(620,60,18,'#fff6d8');o(614,56,4,'#ece0bd');}
   const cc=N>.5?'#9aa0c8':mix('#ffffff','#ffd9bd',L.dusk||0);for(let i=0;i<4;i++){const cx=(R.t*8+i*230)%900-60,cy=48+i*16;f(cx-40,cy-6,80,12,cc);f(cx-20,cy-14,40,8,cc);}
   [[-10,70,'#e9b7a0','#a8604c'],[92,56,'#b6d4c8','#6a8f84'],[190,86,'#f2d48f','#b89040'],[296,62,'#c9b6e4','#8a74ac'],[398,78,'#f0c4c4','#b07a7a'],[502,58,'#cfe0f0','#7f97ae'],[602,82,'#e9b7a0','#a8604c'],[700,64,'#b6d4c8','#6a8f84']].forEach(([hx,hh,col,roof],i)=>{const top=FLOOR-60-hh;
    f(hx,top,98,hh+60,col);f(hx+80,top,18,hh+60,dk(col,.12));f(hx-4,top-8,106,12,roof);
    for(let r=0;r<Math.floor(hh/32);r++)for(let qq=0;qq<3;qq++){const on=N>.4&&(i*3+r*5+qq*7)%4!==0;f(hx+10+qq*28,top+12+r*32,16,16,'#f3ead7');f(hx+14+qq*28,top+16+r*32,8,8,on?'#ffd77a':mix('#9fd0ea','#4a5583',N));}});
   for(let i=0;i<11;i++){const tx=i*80-10,ty=FLOOR-34+(i%3)*4;o(tx,ty+3,44,'#2c6a46');o(tx,ty,40,i%2?'#3f8f5a':'#4fa868');o(tx-12,ty-14,20,i%2?'#4fa868':'#5fbf74');}
   for(let i=1;i<30;i++){const t=i/30,yy=130+Math.sin(t*Math.PI*4)**2*-16+16;f(t*760-4,yy,8,8,['#ffd66b','#ff8f6b','#9be38b','#7fd0ff'][i%4]);}
   if(N>0)f(0,0,762,FLOOR,'rgba(20,25,70,'+(.35*N)+')');
   f(0,FLOOR,762,70,'#e3a874');f(0,FLOOR,762,8,'#c98552');for(let i=0;i<70;i++)f(((i*.61803)%1)*760,FLOOR+12+((i*.754877)%1)*50,4,4,i%3?'#f1c497':'#c98552');
   f(CL,FLOOR,CR-CL,4,'#fff');f(CL,FLOOR,4,12,'#fff');f(CR-4,FLOOR,4,12,'#fff');
   o(NET,FLOOR+6,30,'rgba(30,20,40,.25)',6);f(NET-4,NETTOP-16,8,FLOOR-NETTOP+16,'#8d93a3');f(NET-4,NETTOP-20,8,8,'#f2a93b');
   for(let y=NETTOP;y<=NETTOP+64;y+=8)f(NET-16,y,32,4,'#ffffffaa');for(let xx=NET-16;xx<=NET+16;xx+=8)f(xx,NETTOP,4,64,'#ffffff88');f(NET-18,NETTOP-4,36,8,'#ffffff');f(NET-18,NETTOP+64,36,4,'#e46d6d');
   if(ball.live){const lx=landX();o(lx,FLOOR+6,20,sideOf(lx)===0?'#e46d6dbb':'#ffffff99',5);o(ball.x,FLOOR+5,Math.max(5,11*(1-Math.min(.6,(FLOOR-ball.y)/400))),'rgba(0,0,0,.22)',4);}
   if(st.charge){const pts=[[ball.x,ball.y]];sim(st.charge.a,1,pts);for(let i=1;i<pts.length;i++)ln(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],'#e43b3b',4);}
   for(const p of P){const jh=jhOf(p);o(p.x,FLOOR+4,22,'rgba(30,20,40,.25)',6);
    const fr=p.hit>0||jh>0?1:p.moving?1+Math.floor(p.walk/14)%2:0;q.drawImage(charSprite(p.k,p.team?'left':'right',fr),Math.round(p.x/3)-9,Math.round((FLOOR-jh)/3)-26);
    if(jh>4&&p.arms){const sk=p.k.skin||'#edbd97',top2=FLOOR-jh-72;f(p.x-11,top2-24,5,26,'#2a2133');f(p.x+6,top2-24,5,26,'#2a2133');f(p.x-10,top2-23,3,24,sk);f(p.x+7,top2-23,3,24,sk);}}
   const srv=st.serve?op:me,bx=ball.live?ball.x:srv.x+dirOf(srv)*14,by=ball.live?ball.y:st.toss?st.toss.y:FLOOR-96;
   if(st.aim||(st.toss&&st.toss.s===me)){const X0=me.x+34,Y0=FLOOR-178,H=110,v=tossV();f(X0-4,Y0-4,20,H+8,'#241d33');f(X0,Y0+H*.5,12,H*.5,'#e46d6d');f(X0,Y0+H*.3,12,H*.2,'#ffd84a');f(X0,Y0+H*.15,12,H*.15,'#3d8bf5');f(X0,Y0,12,H*.15,'#ffd84a');o(X0+6,Y0+H*(1-v),9,'#241d33');o(X0+6,Y0+H*(1-v),7,'#fffdf5');}
   if(ball.live||st.wait>0||st.aim||st.toss){if(ball.spiked&&ball.live)for(let i=1;i<4;i++)o(bx-ball.vx*i*1.6,by-ball.vy*i*1.6,10-i*2,'#ffffff66');
    o(bx,by,12,'#3a2f4a');o(bx,by,10,'#fffdf5');const sp=Math.floor(ball.spin*2)%4;f(bx-8+((sp&1)*4),by-6,8,4,'#f2a93b');f(bx,by+(sp&2?0:2),8,4,'#3d8bf5');}
   const m=st.msg;x.font='800 15px '+FONT;if(m){const w=x.measureText(m).width;f(14,12,w+30,30,'#fff7ea');f(14,39,w+30,3,'#d9c4a3');}
   show();x.textBaseline='alphabetic';x.fillStyle='#241d33';x.font='800 15px '+FONT;if(m)x.fillText(m,28,33);
   // balões de "Minha!" e "Sua!"
   x.font='900 14px '+FONT;x.textAlign='center';for(const b of st.bubbles){const w=x.measureText(b.t).width+16,bx2=b.p.x,by2=FLOOR-128;x.globalAlpha=Math.min(1,b.life/15);x.fillStyle='#241d33';x.fillRect(bx2-w/2-2,by2-20,w+4,26);x.fillStyle='#fffdf5';x.fillRect(bx2-w/2,by2-18,w,22);x.fillRect(bx2-3,by2+4,6,6);x.fillStyle='#241d33';x.fillText(b.t,bx2,by2-2);x.globalAlpha=1;}
   // botões na areia
   const ready=spikeable(me)&&!st.charge;for(const b of BTN){const on=!!st.keys[b.k]||(b.k==='j'&&st.charge),hot=b.k==='j'&&ready;x.fillStyle='#241d33';x.fillRect(b.x,b.y,b.w,b.h);x.fillStyle=on?'#c98552':hot?'#ffd84a':'#fff7ea';x.fillRect(b.x+3,b.y+3,b.w-6,b.h-6);x.fillStyle='#241d33';
    if(b.t){x.font='900 14px '+FONT;const tx=b.x+b.w/2+(b.a?8:0);x.fillText(b.t,tx,b.y+b.h/2+(b.s?1:5));if(b.s){x.font='800 9px '+FONT;x.fillText(b.s,tx,b.y+b.h-5);x.font='900 14px '+FONT;}
     if(b.a){const ax=b.x+16,ay=b.y+b.h/2,d=b.a==='u'?-1:1;x.beginPath();x.moveTo(ax,ay+d*8);x.lineTo(ax-8,ay-d*6);x.lineTo(ax+8,ay-d*6);x.closePath();x.fill();}}else{const cx=b.x+b.w/2,cy=b.y+b.h/2,d=b.k==='l'?-1:1;x.beginPath();x.moveTo(cx+d*9,cy);x.lineTo(cx-d*7,cy-9);x.lineTo(cx-d*7,cy+9);x.closePath();x.fill();}}
   x.textAlign='left';
   if(st.pop>0){x.save();x.globalAlpha=st.pop;x.font='900 '+(40+st.pop*20)+'px '+FONT;x.textAlign='center';x.fillStyle='#fff';x.strokeStyle='#241d33';x.lineWidth=4;const t=st.pts[0]+' × '+st.pts[1];x.strokeText(t,380,140);x.fillText(t,380,140);x.restore();}
   if(M===tok)M.raf=requestAnimationFrame(loop);}
  M.raf=requestAnimationFrame(loop);}

 /* ---------- garrinha (0.86) ----------
    Vista de frente e de lado. As setas movem a garra com um leve deslize (dá para passar do ponto), e ela balança quando anda,
    levando uns segundos para parar. PEGAR desce a garra; se ninguém apertar em 30 segundos, ela desce sozinha.
    Os prêmios ficam na máquina o fim de semana inteiro, onde caíram; só mudam no fim de semana seguinte. */
 const prizeOf=id=>PRIZES.find(p=>p.id===id)||PRIZES[0];
 function clawItems(){const c=(life().flags||{}).claw;if(c&&c.week===R.week&&Array.isArray(c.items))return c.items.map(it=>({...it,t:prizeOf(it.id),h:0}));
  const items=Array.from({length:9},(_,i)=>({id:PRIZES[Math.floor(Math.random()*PRIZES.length)].id,x:+(.27+i*.08+Math.random()*.03).toFixed(3),z:+(.1+Math.random()*.8).toFixed(3)}));
  save({flags:{claw:{week:R.week,items}}});return items.map(it=>({...it,t:prizeOf(it.id),h:0}));}
 function claw(){const {mc,ctx:x}=miniOpen('🕹 Garrinha','Use as setas (na tela ou no teclado) para mover a garra: para os lados, para o fundo e para a frente. Ela desliza um pouco e balança quando anda, então espere parar. Aperte PEGAR (ou espaço) para descer. Em 30 segundos ela desce sozinha.');
  document.getElementById('tw-mini-help').textContent='';
  const items=clawItems();
  const FX0=40,FW=348,SX0=470,SW=150,RAIL=48,REST=44;
  // eixos com origem na saída: X = largura (0 a 1), Y = profundidade (0 a 1; no código, Z).
  // Frente: anda com X; Y só sobe o objeto até a linha auxiliar de piso e diminui o tamanho em até 20%.
  // Lado (olhando pela direita): anda com Y; X só sobe o objeto até a linha de piso, e quanto menor o X, menor o objeto (até 20%).
  const AUX=214,BOTTOM=294,gF=y=>BOTTOM-y*(BOTTOM-AUX),sF=y=>1-.35*y,gS=xx=>BOTTOM-(1-xx)*(BOTTOM-AUX),sS=xx=>.65+.35*xx;
  const st={phase:'move',open:1,closeT:0,slipUp:null,X:.06,Z:.08,vx:0,vz:0,ax:0,az:0,wx:0,wz:0,drop:0,keys:{},t0:performance.now(),left:30,got:null,slipAt:null,startX:0,over:false,won:null,msg:'Mova a garra e aperte PEGAR',lights:0};
  M={raf:0,items,st};const tok=M;score('');
  const J=[262,364],BT={l:[226,364],r:[298,364],u:[262,330],d:[262,398]},BS=28,GO=[352,364];
  const hitBtn=(px,py)=>{for(const [k,[bx,by]] of Object.entries(BT))if(Math.abs(px-bx)<=BS/2&&Math.abs(py-by)<=BS/2)return k;return Math.hypot(px-GO[0],py-GO[1])<=28?'go':null;};
  function grab(){if(st.phase!=='move'||st.over)return;st.phase='down';st.keys={};st.msg='Descendo...';}
  mc.onpointerdown=e=>{const [px,py]=miniPos(e),b=hitBtn(px,py);if(b==='go')grab();else if(b)st.keys[b]=true;};mc.onpointerup=()=>{st.keys={};};
  const KEY={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'u',ArrowDown:'d'};
  window.onkeydown=e=>{if(KEY[e.code]){e.preventDefault();st.keys[KEY[e.code]]=true;}else if(e.code==='Space'||e.code==='Enter'){e.preventDefault();grab();}};window.onkeyup=e=>{if(KEY[e.code])st.keys[KEY[e.code]]=false;};
  // pêndulo: a garra atrasa quando o carrinho acelera e balança até parar
  function sway(dvx,dvz){st.wx+=-.02*st.ax-dvx*11;st.wz+=-.02*st.az-dvz*7;st.wx*=.985;st.wz*=.985;st.ax+=st.wx;st.az+=st.wz;}
  function carriage(ix,iz){const pvx=st.vx,pvz=st.vz;
   st.vx=ix?Math.max(-.0065,Math.min(.0065,st.vx+ix*.00045)):st.vx*.89;st.vz=iz?Math.max(-.01,Math.min(.01,st.vz+iz*.0008)):st.vz*.89;
   if(Math.abs(st.vx)<2e-5)st.vx=0;if(Math.abs(st.vz)<2e-5)st.vz=0;st.X+=st.vx;st.Z+=st.vz;
   if(st.X<0||st.X>1){st.X=Math.max(0,Math.min(1,st.X));st.vx=0;}if(st.Z<0||st.Z>1){st.Z=Math.max(0,Math.min(1,st.Z));st.vz=0;}sway(st.vx-pvx,st.vz-pvz);}
  const ropeF=()=>REST+st.drop*(gF(st.Z)-34-RAIL-REST),ropeS=()=>REST+st.drop*(gS(st.X)-34-RAIL-REST);
  const grabPt=()=>[st.X+Math.sin(st.ax)*ropeF()/FW,st.Z+Math.sin(st.az)*ropeS()/SW];
  const inChute=it=>it.x<.15&&it.z<.3;
  function update(){st.lights+=.08;
   if(st.phase==='move'){carriage((st.keys.r?1:0)-(st.keys.l?1:0),(st.keys.u?1:0)-(st.keys.d?1:0));st.left=Math.max(0,30-(performance.now()-st.t0)/1000);if(st.left<=0){grab();st.msg='Acabou o tempo! Descendo...';}}
   else if(st.phase==='down'){carriage(0,0);st.drop=Math.min(1,st.drop+.012);
    if(st.drop>=1){const [gx,gz]=grabPt();let best=null;for(const it of items){if(it.h>0)continue;const d=Math.hypot((it.x-gx)*520,(it.z-gz)*236);if(d<it.t.tol&&(!best||d<best.d))best={it,d};}
     // quando falha, a garra ainda levanta o prêmio: ele escorrega lá em cima ou no caminho
     st.slipUp=null;st.slipAt=null;
     if(best){st.got=best.it;const edge=best.d/best.it.t.tol,ok=.27-.08*edge,r=Math.random();
      if(r>=ok){if(Math.random()<.4)st.slipUp=.05+Math.random()*.3;else st.slipAt=.08+Math.random()*.87;}st.msg='Fechando...';}else st.msg='Fechando... nada.';st.phase='close';st.closeT=0;}}
   else if(st.phase==='close'){carriage(0,0);st.closeT++;st.open=Math.max(st.got?.35:0,1-st.closeT/26);if(st.closeT>=34){st.phase='up';if(st.got)st.msg='Subindo...';}}
   else if(st.phase==='up'){carriage(0,0);st.drop=Math.max(0,st.drop-.014);
    if(st.got&&st.slipUp!=null&&st.drop<st.slipUp){const [gx,gz]=grabPt(),it=st.got;it.x=Math.max(.02,Math.min(.98,gx));it.z=Math.max(.02,Math.min(.98,gz));it.h=Math.max(.05,1-st.drop)*.85;it.vh=0;st.got=null;st.msg='Escorregou da garra!';Amb.pop();}
    if(st.drop<=0){st.phase='back';st.startX=st.X;}}
   else if(st.phase==='back'){const pvx=st.vx,pvz=st.vz;st.vx=Math.max(-.006,Math.min(.006,(.06-st.X)*.06));st.vz=Math.max(-.009,Math.min(.009,(.06-st.Z)*.08));st.X+=st.vx;st.Z+=st.vz;sway(st.vx-pvx,st.vz-pvz);
    if(st.got&&st.slipAt!=null){const k=(st.X-.06)/Math.max(.001,st.startX-.06);if(k<st.slipAt){const [gx,gz]=grabPt(),it=st.got;it.x=Math.max(.02,Math.min(.98,gx));it.z=Math.max(.02,Math.min(.98,gz));it.h=.9;it.vh=0;st.got=null;st.msg='Ih, escapou!';Amb.pop();}}
    if(Math.abs(st.X-.06)<.004&&Math.abs(st.Z-.06)<.004){st.phase='done';st.open=1;if(st.got){const it=st.got;it.x=.07;it.z=.12;st.won=it;st.got=null;}setTimeout(finishClaw,350);}}
   for(const it of items)if(it.h>0){it.vh=(it.vh||0)+.004;it.h=Math.max(0,it.h-it.vh);
    // caiu perto da boca da saída: às vezes quica e entra, como na vida real
    if(it.h===0&&!inChute(it)&&it.x<.26&&it.z<.42&&Math.random()<.5){it.x=.07;it.z=.12;}
    if(it.h===0&&inChute(it)&&!st.won&&!st.over){st.won=it;st.msg='Caiu na saída!';}}
  }
  M.update=update; // gancho de teste: avança a lógica sem desenhar
  function loop(){update();
   // desenho
   const K=2,{f,o,ln,show,q}=mq(x,K),now=st.phase==='move'?st.keys:{};
   f(0,0,762,420,'#241c40');for(let i=0;i<60;i++)f(((i*.61803)%1)*760,((i*.754877)%1)*420,3,3,i%3?'#2f2654':'#3a2f66');
   // gabinete: letreiro com luzes, vidro, piso de pelúcia e o corpo de baixo
   const cabinet=(x0,w)=>{f(x0+6,12,w,404,'#1a1430');f(x0-6,4,w+12,412,'#e2508a');f(x0,8,w,404,'#ff6b9a');f(x0,8,6,404,'#ff86ae');f(x0+w-6,8,6,404,'#c93f73');
    f(x0,8,w,26,'#d84a7c');const n=Math.floor(w/26);for(let i=0;i<n;i++){const on=Math.floor(st.lights+i)%2,bx=x0+14+i*26;if(on)f(bx-6,15,12,12,'#ffe8a8aa');f(bx-3,18,6,6,on?'#fff7a8':'#b03a68');}
    f(x0+10,40,w-20,BOTTOM+12-40,'#dff3fc');for(let i=0;i<9;i++)f(x0+10,40+i*30,w-20,30,mix('#eaf8ff','#c4e6f6',i/8));
    f(x0+10,AUX-6,w-20,BOTTOM+18-AUX,'#a9d3ea');for(let i=0;i<Math.floor(w/10);i++)f(x0+16+((i*.61803)%1)*(w-36),AUX+4+((i*.754877)%1)*(BOTTOM-AUX),4,4,['#ffb3c7','#fff2a8','#b6f0c2','#c9b6e4'][i%4]);
    f(x0+10,RAIL-7,w-20,7,'#9aa3b5');f(x0+10,RAIL-7,w-20,2,'#d6dae2');
    f(x0,BOTTOM+14,w,402-BOTTOM,'#c93f73');f(x0,BOTTOM+14,w,5,'#e86a98');};
   cabinet(FX0-12,FW+24);cabinet(SX0-12,SW+24);
   for(const [x0,w] of [[FX0,FW],[SX0,SW]])for(let xx=x0;xx<x0+w;xx+=12)f(xx,AUX,7,2,'#5a86ad'); // linha auxiliar de piso
   // saída: na frente é a caixa no canto da frente à esquerda; de lado ela fica no fundo, logo acima da linha de piso (é um furo)
   f(FX0-2,gF(.3)-30,.15*FW+4,BOTTOM+12-gF(.3)+30,'#1d1934');f(FX0-2,gF(.3)-30,.15*FW+4,4,'#3a3560');
   f(SX0-2,AUX-16,.3*SW+4,16,'#1d1934');f(SX0-2,AUX-16,.3*SW+4,3,'#3a3560');
   const PR2=r=>r*1.15,itemAt=(it,px,gy,s,side)=>{const R2=PR2(it.t.r)*s,y=gy-it.h*(gy-RAIL-40);o(px,gy+2,R2,'rgba(0,0,0,.15)',4*s);(side?prizeSidePx:prizePx)(q,px/K,(y-R2)/K,it.t.id,R2/K);};
   const clawAt=(cx,ang,rope,s0,carry,side)=>{const s=s0*1.15,hx=cx+Math.sin(ang)*rope,hy=RAIL+4+Math.cos(ang)*rope,sp=8+10*st.open;
    f(cx-14*s,RAIL-12,28*s,13,'#4b4f63');f(cx-3*s,RAIL-8,6*s,6,'#ffe46b');ln(cx,RAIL+1,hx,hy-8,'#6b6f7e',3*s);f(hx-12*s,hy-9*s,24*s,11*s,'#b9bfcd');f(hx-12*s,hy-9*s,24*s,3*s,'#e3e6ee');
    for(const dir of [-1,1]){ln(hx+dir*8*s,hy+2*s,hx+dir*(sp+4)*s,hy+11*s,'#5d6272',5*s);ln(hx+dir*(sp+4)*s,hy+11*s,hx+dir*sp*s,hy+21*s,'#5d6272',5*s);ln(hx+dir*sp*s,hy+21*s,hx+dir*(sp-6)*s,hy+24*s,'#c9ccd6',4*s);}
    if(carry){const R2=PR2(carry.t.r)*s0;(side?prizeSidePx:prizePx)(q,hx/K,(hy+18*s+R2*.4)/K,carry.t.id,R2/K);}};
   // vista de frente: os do fundo (Y maior) primeiro
   for(const it of [...items].sort((a,b)=>b.z-a.z))if(it!==st.got&&it!==st.won)itemAt(it,FX0+it.x*FW,gF(it.z),sF(it.z));
   clawAt(FX0+st.X*FW,st.ax,ropeF(),sF(st.Z),st.got);
   // vista de lado (olhando pela direita): os de X menor ficam mais longe, então vêm primeiro
   for(const it of [...items].sort((a,b)=>a.x-b.x))if(it!==st.got&&it!==st.won)itemAt(it,SX0+it.z*SW,gS(it.x),sS(it.x),true);
   clawAt(SX0+st.Z*SW,st.az,ropeS(),sS(st.X),st.got,true);
   for(const x0 of [FX0-2,SX0-2])for(let y=44;y<AUX-8;y+=3){const k=(y-44)/(AUX-52);f(x0+14-k*10,y,24-k*8,3,'#ffffff33');}
   // painel de controle da máquina (só na frente): moedeiro, relógio, joystick com as setinhas e o botão
   f(FX0-2,BOTTOM+26,FW+4,402-BOTTOM-26,'#8c2a55');f(FX0-2,BOTTOM+26,FW+4,3,'#a8406c');
   f(56,330,22,32,'#2d2a4a');f(65,334,4,24,'#ffe46b');
   const sec=Math.ceil(st.left);f(112,330,74,36,'#120d24');f(112,330,74,3,'#2d2350');
   const tri=(cx,cy,d,col)=>{for(let i=0;i<=9;i+=3){const w=i*2+3;if(d==='u')f(cx-w/2,cy-5+i,w,3,col);else if(d==='d')f(cx-w/2,cy+5-i,w,3,col);else if(d==='l')f(cx-5+i,cy-w/2,3,w,col);else f(cx+5-i,cy-w/2,3,w,col);}};
   for(const [k,[bx,by]] of Object.entries(BT)){const on=!!now[k];f(bx-BS/2,by-BS/2+3,BS,BS,'#120d24');f(bx-BS/2,by-BS/2+(on?3:0),BS,BS,on?'#c9b6e4':'#efe8ff');tri(bx,by+(on?3:0),k,'#2d2350');}
   const jx=((now.r?1:0)-(now.l?1:0))*7,jy=((now.d?1:0)-(now.u?1:0))*7;o(J[0],J[1]+2,15,'#120d24');o(J[0],J[1],14,'#2d2a4a');ln(J[0],J[1],J[0]+jx,J[1]+jy-5,'#9aa3b5',5);o(J[0]+jx,J[1]+jy-6,8,'#e46d6d');f(J[0]+jx-4,J[1]+jy-10,3,3,'#ffffff');
   const ok=st.phase==='move';o(GO[0],GO[1]+4,28,'#120d24');o(GO[0],GO[1],28,ok?'#b03a68':'#4a3f60');o(GO[0],GO[1]-3,23,ok?'#ffd84a':'#6b6080');
   show();x.textAlign='center';
   x.fillStyle=ok&&sec<=10?'#ff6b6b':'#ffe46b';x.font='900 24px '+FONT;x.fillText(ok?String(sec):'-',149,357);
   x.textAlign='left';
   if(M===tok)M.raf=requestAnimationFrame(loop);}
  function finishClaw(){if(st.over)return;st.over=true;const won=st.won;if(won)items.splice(items.indexOf(won),1);st.msg=won?'Pegou! Caiu na saída.':'Não foi desta vez.';
   const keep={claw:{week:R.week,items:items.map(it=>({id:it.id,x:+it.x.toFixed(3),z:+it.z.toFixed(3)}))}};let text;
   if(won){const L=life(),dup=(L.collection||[]).includes(won.t.id);save({collection:[...(L.collection||[]),won.t.id],flags:keep});diary('🧸','Ganhou '+won.t.name+' na garrinha'+(dup?' (repetido)':'')+'!');Amb.heart();text='Você pegou: '+won.t.name+'!'+(dup?' (repetido)':' Vai para a estante da sala.');}
   else{save({flags:keep});text='Não foi desta vez. Os prêmios ficam onde estão até o próximo fim de semana.';}
   const again=()=>{if(api.get().cash<5){toast('Dinheiro insuficiente.');return;}miniClose();if(spend(5)){advance(5);claw();}};
   miniEnd(text,[...(items.length?[{t:'🕹 Tentar de novo · R$ 5 (espaço)',fn:again}]:[]),{t:'Sair',fn:miniClose}]);
   if(items.length)window.onkeydown=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();again();}};}
  M.raf=requestAnimationFrame(loop);}

 /* gancho de teste: avança a visita sem depender do requestAnimationFrame */
 const debug={state:()=>R,step:(sec=1)=>{for(let i=0;i<sec*20&&R;i++){R.t+=.05;if(!R.mini)update(.05);}if(R)draw();},click:(cx,cy)=>{const k=R.view,r=cv.getBoundingClientRect();onClick({clientX:r.left+(cx+k.ox)*k.s,clientY:r.top+(cy+k.oy)*k.s});},P,
  poolLevel:k=>{if(k)poolLevel=k;return poolLevel;},poolLevels:()=>POOL_LEVELS,mini:(kind,opp)=>{if(M)miniClose();({pool,volley,claw})[kind](opp||'Téo');},closeMini:()=>miniClose(),M:()=>M,go,bedroomDoor,phone:callMom,openPhone,invite,petCat,waterPlant,setMin:m=>{R.min=m;R.light=light(m);}};
 return {open,close,isOpen:()=>!!R,debug};
})();
if(typeof module!=='undefined')module.exports=Town;
