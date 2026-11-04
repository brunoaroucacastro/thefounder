/* Quarto do fundador — cena vetorial isométrica (0.51).
   Mesma API da oficina anterior: width, height, render, actors, hit, project, headphones.
   A renderização só lê o estado do jogo; nunca altera regras nem a partida. */
const PilotWorld=(()=>{
 const width=760,height=520,OX=380,OY=130;
 const P=(x,y,z=0)=>[OX+(x-y)*40,OY+(x+y)*20-z*46];
 const fY=(y,x0,x1,z0,z1)=>[P(x0,y,z0),P(x1,y,z0),P(x1,y,z1),P(x0,y,z1)];
 const fX=(x,y0,y1,z0,z1)=>[P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)];
 const fZ=(z,x0,x1,y0,y1)=>[P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const mix=(a,b,t)=>'#'+rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
 const lit=(c,t)=>mix(c,'#fff4dc',t),dk=(c,t)=>mix(c,'#1d1530',t);
 const hexOk=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
 const FONT='800 11px "Nunito","Segoe UI",system-ui,sans-serif';

 /* ---------- primitivas ---------- */
 function path(c,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
 function poly(c,pts,fill,stroke,lw=1.1,alpha=1){path(c,pts);if(alpha!==1)c.globalAlpha=alpha;if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineJoin='round';c.stroke();}if(alpha!==1)c.globalAlpha=1;}
 function box(c,x,y,z,w,d,h,col,o={}){const st=o.stroke===false?null:dk(col,.5),lw=o.lw??1.1;
  poly(c,fY(y+d,x,x+w,z,z+h),o.left||lit(col,.04),st,lw);poly(c,fX(x+w,y,y+d,z,z+h),o.right||dk(col,.24),st,lw);poly(c,fZ(z+h,x,x+w,y,y+d),o.top||lit(col,.22),st,lw);}
 function ring(cx,cy,r,f,n=24){const p=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;p.push(f(cx+Math.cos(t)*r,cy+Math.sin(t)*r));}return p;}
 const ellZ=(x,y,z,rx,ry)=>{const p=[];for(let i=0;i<24;i++){const t=i/24*Math.PI*2;p.push(P(x+Math.cos(t)*rx,y+Math.sin(t)*ry,z));}return p;};
 function grad(c,kind,args,stops,fallback){const g=kind==='r'?c.createRadialGradient&&c.createRadialGradient(...args):c.createLinearGradient&&c.createLinearGradient(...args);if(!g||!g.addColorStop)return fallback;stops.forEach(([o,col])=>g.addColorStop(o,col));return g;}
 function circle(c,x,y,r,fill,stroke,lw=1){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function ellipse(c,x,y,rx,ry,fill,stroke,lw=1){c.beginPath();c.ellipse?c.ellipse(x,y,rx,ry,0,0,Math.PI*2):c.arc(x,y,rx,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
 function stroke(c,pts,col,lw,cap='round'){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=col;c.lineWidth=lw;c.lineCap=cap;c.lineJoin='round';c.stroke();}
 function curve(c,a,q,b,col,lw){c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(q[0],q[1],b[0],b[1]);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.stroke();}
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const ROOM=[P(-.18,8,2.6),P(-.18,-.18,2.6),P(8,-.18,2.6),P(8,-.18,-.35),P(8,8,-.35),P(-.18,8,-.35)];

 /* ---------- cena fixa ---------- */
 function room(c){
  box(c,-.18,-.18,-.35,8.18,8.18,.35,'#463a5c',{top:'#463a5c'});
  poly(c,fZ(0,0,8,0,8),'#b4825a');seed=7;
  for(let j=0;j<16;j++){let x=0;const y=j*.5,off=(j%3)*.7;while(x<8){const len=Math.min(8-x,x===0?off+.8:1.4+rnd()*1.3);poly(c,fZ(0,x,x+len,y,y+.5),mix('#b98a5f','#a4744f',rnd()*.9),'rgba(138,93,62,.55)',.7);x+=len;}}
  poly(c,fY(0,0,8,0,2.6),grad(c,'l',[...P(0,0,2.6),...P(8,0,0)],[[0,'#d9c6aa'],[1,'#c3ab8e']],'#d2bea2'));
  poly(c,fX(0,0,8,0,2.6),grad(c,'l',[...P(0,0,2.6),...P(0,8,0)],[[0,'#ad987f'],[1,'#8f7b67']],'#a08b74'));
  poly(c,fY(0,0,8,0,.9),'#6e8c7c');poly(c,fX(0,0,8,0,.9),'#56705f');
  for(let x=.25;x<8;x+=.25)stroke(c,[P(x,0,.12),P(x,0,.86)],'rgba(60,80,68,.35)',1);
  for(let y=.25;y<8;y+=.25)stroke(c,[P(0,y,.12),P(0,y,.86)],'rgba(40,56,46,.35)',1);
  poly(c,fY(0,0,8,.88,.95),'#f0e2c8');poly(c,fX(0,0,8,.88,.95),'#c8b89c');
  poly(c,fY(0,0,8,0,.12),'#4b5f52');poly(c,fX(0,0,8,0,.12),'#3c4d43');
  poly(c,[P(-.18,-.18,2.6),P(8,-.18,2.6),P(8,0,2.6),P(0,0,2.6),P(0,8,2.6),P(-.18,8,2.6)],'#3a2f4a');
  poly(c,fX(8,-.18,0,-.35,2.6),'#2f2640');poly(c,fY(8,-.18,0,-.35,2.6),'#3d3253');
 }
 function wallDecor(c){
  // janela com a cidade ao entardecer
  poly(c,fY(0,.9,2.9,1,2.2),'#efe1c6','#a8916f',1);
  poly(c,fY(0,1,2.8,1.08,2.12),grad(c,'l',[0,P(1,0,2.12)[1],0,P(1,0,1.08)[1]],[[0,'#3d3f7a'],[.55,'#b8628a'],[1,'#f3a35c']],'#b8628a'));
  seed=3;for(let x=1;x<2.8;){const w=.12+rnd()*.18,h=.12+rnd()*.36;poly(c,fY(0,x,Math.min(2.8,x+w),1.08,1.08+h),'#2b2550');
   for(let k=0;k<3;k++)if(rnd()>.45){const wx=x+.03+rnd()*(w-.07),wz=1.12+rnd()*(h-.08);poly(c,fY(0,wx,wx+.03,wz,wz+.035),'#ffd77a');}x+=w;}
  poly(c,ring(2.35,1.88,.09,(x,z)=>P(x,0,z),20),'#fff1d0');
  poly(c,fY(0,1.88,1.92,1.08,2.12),'#efe1c6');poly(c,fY(0,1,2.8,1.58,1.62),'#efe1c6');
  box(c,.82,0,.98,2.16,.16,.06,'#efe1c6');
  poly(c,[P(.62,.06,2.3),P(1.02,.06,2.3),P(.98,.06,1.4),P(1.06,.06,.9),P(.66,.06,.92),P(.7,.06,1.5)],'#c4614f','#8e3f36',1);
  poly(c,[P(2.78,.06,2.3),P(3.18,.06,2.3),P(3.14,.06,1.5),P(3.2,.06,.92),P(2.8,.06,.9),P(2.86,.06,1.4)],'#c4614f','#8e3f36',1);
  poly(c,fY(.06,.55,3.25,2.28,2.33),'#5a4636');
  // quadro de clientes (cortiça)
  poly(c,fY(0,3.75,5.9,1.92,2.42),'#c99a63','#8c6640',1.2);poly(c,fY(0,3.82,5.83,1.96,2.38),'#d9ad75');
  [['#ffe27a',3.95,2.05],['#8fd4ff',4.38,2.16],['#ff9fb2',4.85,2.02],['#b6f08a',5.3,2.12]].forEach(([col,x,z])=>{poly(c,fY(0,x,x+.32,z,z+.2),col,dk(col,.3),.6);
   for(let l=0;l<3;l++)poly(c,fY(0,x+.05,x+.27-l*.05,z+.15-l*.045,z+.16-l*.045),dk(col,.45));const pin=P(x+.16,0,z+.19);circle(c,pin[0],pin[1],1.8,'#e46d6d');});
  // pôster
  poly(c,fX(0,5.25,6.75,1.25,2.3),'#2d2a4a','#16142a',1.2);poly(c,fX(0,5.32,6.68,1.32,2.23),'#f2a93b');
  poly(c,ring(6,1.95,.22,(y,z)=>P(0,y,z)),'#fff3d6');poly(c,[P(0,5.75,1.45),P(0,6.25,1.45),P(0,6,1.85)],'#2d2a4a');poly(c,fX(0,5.5,6.5,1.38,1.43),'#2d2a4a');
  // relógio
  poly(c,ring(2.6,1.75,.26,(y,z)=>P(0,y,z)),'#efe1c6','#7d6a55',1.2);poly(c,ring(2.6,1.75,.2,(y,z)=>P(0,y,z)),'#fffaf0');
  const ck=P(0,2.6,1.75);stroke(c,[ck,P(0,2.6+.08,1.75+.08)],'#2d2a4a',2);stroke(c,[ck,P(0,2.6-.15,1.75+.05)],'#2d2a4a',1.3);
  // prateleira com livros
  box(c,0,2.0,1.15,.32,1.4,.06,'#8a5d3e');
  box(c,.04,2.1,1.21,.22,.22,.28,'#6c8fd1');box(c,.04,2.36,1.21,.22,.18,.22,'#e46d6d');box(c,.04,2.58,1.21,.22,.16,.33,'#f2c14e');box(c,.07,2.95,1.21,.16,.2,.16,'#cfc5b6',{lw:.8});
  // fio do varal
  stroke(c,garland(),'#3a2f2a',1.2);
 }
 function garland(){const g=[];for(let i=0;i<=24;i++){const t=i/24;g.push(P(.25+t*7.5,.02,2.47-Math.sin(t*Math.PI*3)**2*.12));}return g;}
 function shadows(c){c.save();if('filter' in c)c.filter='blur(5px)';c.globalAlpha=.38;c.fillStyle='#120c20';
  for(const p of [fZ(0,3.4,6.6,0,1.5),fZ(0,-.05,3.2,4.7,7.25),fZ(0,6.7,8,0,.75),ellZ(.45,.5,0,.35,.35),fZ(0,.0,.75,3.9,4.7)]){path(c,p);c.fill();}
  c.restore();if('filter' in c)c.filter='none';}
 function rug(c){
  c.save();c.globalAlpha=.9;poly(c,[P(1.1,0,1.08),P(2.9,0,1.08),P(3.5,2.6,0),P(1.7,2.6,0)],grad(c,'l',[0,P(2,0,1.08)[1],0,P(2.6,2.6,0)[1]],[[0,'rgba(255,176,112,.32)'],[1,'rgba(255,176,112,0)']],'rgba(255,176,112,.12)'));c.restore();
  poly(c,fZ(.005,2.4,6.4,3.0,6.3),'#6b3d55','#4a2a3c',1);poly(c,fZ(.006,2.55,6.25,3.15,6.15),'#8c5170');poly(c,fZ(.007,2.75,6.05,3.35,5.95),'#6b3d55');
  for(let i=0;i<6;i++){const x=3+i*.5;poly(c,fZ(.008,x,x+.22,3.6,5.7),i%2?'#d98f5c':'#e7c27a');}
 }
 function leaf(c,x,y,z,dx,dz,col){const a=P(x,y,z),b=P(x+dx,y,z+dz),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,nx=-(b[1]-a[1])*.35,ny=(b[0]-a[0])*.35;
  c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(mx+nx,my+ny,b[0],b[1]);c.quadraticCurveTo(mx-nx,my-ny,a[0],a[1]);c.fillStyle=col;c.fill();c.strokeStyle=dk(col,.45);c.lineWidth=.8;c.stroke();}
 function furniture(c){
  // planta
  box(c,.22,.28,0,.48,.48,.42,'#c0674e');box(c,.18,.24,.42,.56,.56,.06,'#d07a5e');
  [[-.4,.75,'#3f8f5a'],[.35,.85,'#4fa868'],[-.1,1.05,'#5fbf74'],[.5,.5,'#3f8f5a'],[-.55,.4,'#4fa868'],[.15,.95,'#3f8f5a']].forEach(([dx,dz,col])=>leaf(c,.46,.52,.48,dx,dz,col));
  // estante de produtos (moldura)
  box(c,6.75,0,0,1.2,.55,1.95,'#7a5238');
  for(const z of [.12,.72,1.32])poly(c,fY(.551,6.85,7.85,z,z+.52),'#4a3122');
  // mesa
  box(c,3.4,0,.72,3.1,1.35,.08,'#c98f5a');
  box(c,3.48,1.2,0,.08,.08,.72,'#8a5d3e');box(c,3.48,.05,0,.08,.08,.72,'#8a5d3e');
  box(c,5.55,.08,0,.85,1.2,.72,'#b47d4c');
  poly(c,fY(1.281,5.62,6.33,.42,.66),'#c98f5a','#7a5238',.8);poly(c,fY(1.281,5.62,6.33,.08,.36),'#c98f5a','#7a5238',.8);
  poly(c,fY(1.282,5.88,6.08,.52,.55),'#e8d3a6');poly(c,fY(1.282,5.88,6.08,.2,.23),'#e8d3a6');
  // monitor (moldura; a tela é dinâmica)
  box(c,4.66,.45,.8,.3,.22,.04,'#2a2838');box(c,4.76,.5,.84,.1,.08,.32,'#2a2838');box(c,4.05,.3,1.0,1.5,.1,.86,'#2a2838');
  // teclado, mouse, caneca e caderno
  box(c,4.42,.82,.8,1.0,.28,.04,'#e8e2d6',{lw:.8});for(let i=0;i<4;i++)poly(c,fZ(.845,4.48+i*.24,4.66+i*.24,.86,1.06),'#cfc7b7');
  box(c,5.6,.8,.8,.16,.18,.04,'#e8e2d6',{lw:.7});
  box(c,3.72,.68,.8,.2,.2,.2,'#e46d6d',{lw:.8});poly(c,ellZ(3.82,.78,1.0,.1,.1),'#4a2a1c');
  box(c,3.6,.15,.8,.6,.45,.05,'#5e6ad2',{lw:.8});box(c,3.62,.17,.85,.56,.41,.02,'#fff7ea',{lw:.6});
  // luminária
  poly(c,ellZ(6.1,.4,.8,.15,.15),'#2d2a4a');
  const la=P(6.1,.4,.82),lb=P(6.0,.4,1.45),lc=P(5.72,.45,1.62);stroke(c,[la,lb,lc],'#2d2a4a',3);
  poly(c,[[lc[0]-14,lc[1]+2],[lc[0]+4,lc[1]-12],[lc[0]+14,lc[1]+4],[lc[0]-4,lc[1]+16]],'#f2a93b','#a8661c',1);ellipse(c,lc[0]+1,lc[1]+10,7,3.5,'#fff3c4');
  // criado-mudo com o cofrinho das contas
  box(c,.05,3.95,0,.62,.62,.6,'#9c6a45');poly(c,fY(4.571,.12,.6,.3,.5),'#b47d4c','#7a5238',.8);poly(c,fY(4.572,.3,.42,.38,.41),'#e8d3a6');
  const pig=P(.36,4.26,.6);ellipse(c,pig[0],pig[1]-9,13,9,'#f3a6b8','#b5677c',1.1);circle(c,pig[0]+11,pig[1]-10,4.5,'#f3a6b8','#b5677c',1);
  poly(c,[[pig[0]-4,pig[1]-17],[pig[0],pig[1]-22],[pig[0]+2,pig[1]-16]],'#f3a6b8','#b5677c',1);stroke(c,[[pig[0]-3,pig[1]-16],[pig[0]+3,pig[1]-17]],'#7a3a4c',1.6);
  circle(c,pig[0]+5,pig[1]-12,1.2,'#3a2030');stroke(c,[[pig[0]-6,pig[1]-1],[pig[0]-6,pig[1]+2]],'#b5677c',2.4);stroke(c,[[pig[0]+5,pig[1]-1],[pig[0]+5,pig[1]+2]],'#b5677c',2.4);
  // cama
  box(c,0,4.75,0,.16,2.3,1.15,'#8a5d3e');box(c,.16,4.75,0,2.95,2.3,.3,'#9c6a45');box(c,.2,4.82,.3,2.86,2.16,.24,'#f6efe2');
  box(c,1.12,4.72,.3,2.04,2.36,.32,'#4f8d9d',{top:'#62a6b5'});
  poly(c,fZ(.621,1.12,3.16,4.72,5.0),'#e9e1d2','#a99f8f',.8);for(let i=0;i<3;i++)poly(c,fZ(.622,1.5+i*.55,1.7+i*.55,5.05,7.0),'#58a0b0');
  box(c,.28,5.0,.54,.7,.85,.17,'#fffaf0',{lw:.9});box(c,.28,5.95,.54,.7,.85,.17,'#f3dfe6',{lw:.9});
  box(c,2.9,4.75,0,.2,2.3,.55,'#8a5d3e');
 }
 let cache=null;
 function staticLayer(density){
  if(typeof document==='undefined'||!document.createElement)return null;
  if(cache&&cache.density===density)return cache.canvas;
  const canvas=document.createElement('canvas');if(!canvas||!canvas.getContext)return null;canvas.width=width*density;canvas.height=height*density;
  const c=canvas.getContext('2d');if(!c||!c.setTransform)return null;c.setTransform(density,0,0,density,0,0);
  room(c);wallDecor(c);shadows(c);rug(c);furniture(c);cache={density,canvas};return canvas;
 }

 /* ---------- ícones de produto ---------- */
 function gadget(c,x,y,kind='headphones',color='#c78451',scale=1){
  color=hexOk(color)?color:'#c78451';c.save();c.translate(x,y);c.scale(scale,scale);const ink='#2d2a4a';
  if(kind==='headphones'){
   c.beginPath();c.arc(0,-1,8,Math.PI*1.05,Math.PI*1.95);c.strokeStyle=ink;c.lineWidth=4.2;c.lineCap='round';c.stroke();c.strokeStyle=lit(color,.2);c.lineWidth=2.2;c.stroke();
   for(const s of [-1,1]){rrect(c,s*8-3.2,-3,6.4,9,2.6);c.fillStyle=color;c.fill();c.strokeStyle=ink;c.lineWidth=1.2;c.stroke();rrect(c,s*8-1.4+(s>0?-1:1),-1,2.8,5,1.2);c.fillStyle=lit(color,.45);c.fill();}
  }else if(kind==='keyboard'){
   poly(c,[[-11,-2],[5,-7],[12,0],[-4,5]],'#c9d2cf',ink,1.2);
   for(let r=0;r<3;r++)for(let i=0;i<6;i++){const px=-8+i*2.6+r*2.2,py=-1.6-i*.8+r*1.7;c.fillStyle=i===5&&r===1?color:'#7d8f99';c.fillRect(px,py,1.8,1.2);}
  }else if(kind==='mouse'){
   c.beginPath();c.ellipse?c.ellipse(0,0,5.5,8,-.35,0,Math.PI*2):c.arc(0,0,6,0,Math.PI*2);c.fillStyle='#c9d2cf';c.fill();c.strokeStyle=ink;c.lineWidth=1.2;c.stroke();
   stroke(c,[[-1.6,-7.2],[0.6,-1.5]],ink,1);rrect(c,-1.2,-5.5,2,3,1);c.fillStyle=color;c.fill();
  }else{
   rrect(c,-8,-9,16,15,3);c.fillStyle='#536e7b';c.fill();c.strokeStyle=ink;c.lineWidth=1.2;c.stroke();
   for(const a of [-3.5,3.5]){circle(c,a,-1.5,3,ink);circle(c,a,-1.5,1.6,'#b6c7c0');}
  }
  c.restore();
 }

 /* ---------- fundador ---------- */
 function colors(s){const f=s.founder||{};return{shirt:hexOk(f.shirt)?f.shirt:'#e0a23a',hair:hexOk(f.hair)?f.hair:'#3b2a2a',skin:hexOk(f.skin)?f.skin:'#d79a72'};}
 function seated(c,s,t,typing){const k=colors(s),sh=P(4.9,2.05,1.42),hip=P(4.9,2.1,.62),hoodD=dk(k.shirt,.25);
  const tap=typing?Math.round(Math.sin(t*20))*1.6:0;
  const arm=(from,to,dy)=>{curve(c,from,[(from[0]+to[0])/2+2,from[1]+16],[to[0],to[1]+dy],hoodD,9);circle(c,to[0],to[1]+dy,4.2,k.skin,dk(k.skin,.35),.8);};
  arm([sh[0]+6,sh[1]+2],P(4.58,1.0,.86),-tap);arm([sh[0]+14,sh[1]+5],P(5.18,.98,.86),tap);
  c.beginPath();c.moveTo(sh[0]-17,sh[1]+6);c.quadraticCurveTo(sh[0],sh[1]-6,sh[0]+17,sh[1]+4);c.lineTo(hip[0]+14,hip[1]);c.quadraticCurveTo(hip[0],hip[1]+6,hip[0]-14,hip[1]+2);c.closePath();
  c.fillStyle=k.shirt;c.fill();c.strokeStyle=dk(k.shirt,.45);c.lineWidth=1.2;c.stroke();
  c.beginPath();c.moveTo(sh[0]-12,sh[1]+2);c.quadraticCurveTo(sh[0]-1,sh[1]+14,sh[0]+11,sh[1]+1);c.fillStyle=hoodD;c.fill();
  const bob=Math.sin(t*1.9)*(typing?.6:1.4),hc=P(4.9,2.02,1.7);head(c,hc[0]+bob,hc[1],k,false);
 }
 function head(c,x,y,k,front,look=1){
  if(!front)ellipse(c,x+11,y+2,3,4,k.skin,dk(k.skin,.35),.8);
  circle(c,x,y,13,k.skin,dk(k.skin,.35),1);
  c.beginPath();
  if(front){c.moveTo(x-13,y+1);c.quadraticCurveTo(x-15,y-17,x+1,y-15);c.quadraticCurveTo(x+15,y-14,x+13,y+1);c.quadraticCurveTo(x+8,y-8,x-2,y-7);c.quadraticCurveTo(x-8,y-6,x-13,y+1);}
  else{c.moveTo(x-13,y+3);c.quadraticCurveTo(x-15,y-16,x+2,y-14);c.quadraticCurveTo(x+14,y-12,x+11,y-2);c.quadraticCurveTo(x+4,y-6,x+5,y+3);c.quadraticCurveTo(x-2,y+14,x-13,y+3);}
  c.closePath();c.fillStyle=k.hair;c.fill();c.strokeStyle=dk(k.hair,.4);c.lineWidth=1;c.stroke();
  if(front){circle(c,x-4*look+4*(look<0),y+1,1.6,'#241d33');circle(c,x+5*look-4*(look<0)+1,y+1,1.6,'#241d33');ellipse(c,x-7,y+6,2.6,1.5,'rgba(230,110,110,.35)');ellipse(c,x+8,y+6,2.6,1.5,'rgba(230,110,110,.35)');
   curve(c,[x-2,y+7],[x+1,y+9],[x+4,y+7],dk(k.skin,.5),1.2);}
  curve(c,[x-12,y-2],[x-2,y-22],[x+12,y-4],'#2d2a4a',3.2);
  ellipse(c,x+12,y+1,3.6,5.4,'#f2a93b','#2d2a4a',1.4);if(front)ellipse(c,x-12,y+1,3.6,5.4,'#f2a93b','#2d2a4a',1.4);
 }
 function standing(c,s,x,y,t,pose,facing){const k=colors(s),[sx,sy]=P(x,y);const walk=pose==='walk',work=pose==='work';
  const step=walk?Math.sin(t*10):0,arms=work?Math.sin(t*14)*3:walk?step*5:0;
  ellipse(c,sx,sy,14,5,'rgba(18,12,32,.3)');
  const leg=(dx,lift)=>{rrect(c,sx+dx-4,sy-30-lift,8,28,3);c.fillStyle='#3d4a6b';c.fill();rrect(c,sx+dx-5,sy-5-lift,10,6,3);c.fillStyle='#f6efe2';c.fill();c.strokeStyle='#2d2a4a';c.lineWidth=.8;c.stroke();};
  leg(-5,Math.max(0,step)*3);leg(5,Math.max(0,-step)*3);
  const armL=[sx-15,sy-56],armR=[sx+15,sy-56];
  stroke(c,[armL,[sx-17-(work?-4:0),sy-36+arms]],dk(k.shirt,.25),8);circle(c,sx-17+(work?4:0),sy-34+arms,4,k.skin);
  c.beginPath();c.moveTo(sx-16,sy-58);c.quadraticCurveTo(sx,sy-66,sx+16,sy-58);c.lineTo(sx+14,sy-28);c.quadraticCurveTo(sx,sy-24,sx-14,sy-28);c.closePath();
  c.fillStyle=k.shirt;c.fill();c.strokeStyle=dk(k.shirt,.45);c.lineWidth=1.2;c.stroke();
  stroke(c,[[sx-3,sy-56],[sx-2,sy-46]],'#f6efe2',1.6);stroke(c,[[sx+4,sy-56],[sx+3,sy-46]],'#f6efe2',1.6);
  stroke(c,[armR,[sx+17-(work?4:0),sy-36-arms]],dk(k.shirt,.25),8);circle(c,sx+17-(work?4:0),sy-34-arms,4,k.skin);
  head(c,sx,sy-74+(walk?Math.abs(step)*-1.5:0),k,true,facing);
 }
 function chair(c,part){if(part!=='back'){poly(c,ellZ(4.9,2.1,.02,.42,.42),'#2d2a4a');box(c,4.86,2.06,.05,.08,.08,.4,'#3a3650');box(c,4.48,1.72,.45,.84,.8,.09,'#4a4766');}
  if(part!=='seat'){box(c,4.48,2.42,.58,.84,.1,.66,'#4a4766');box(c,4.86,2.44,.5,.08,.06,.1,'#3a3650');}}

 /* ---------- elementos que dependem da partida ---------- */
 const DESK={x:4.9,y:2.1},PACK={x:5.85,y:4.6};
 const DESIGN=['design','upgradeAttributes','upgradePlan','building','repairing','testReady','testOutcome','testing','upgradeWork','upgradeReady','upgradeOutcome','upgradeTesting'];
 const RESEARCH=['personaResearch','gadgetResearch'];
 const SELLING=['selling','opportunity','recap'];
 function goal(s){return s.crew?PACK:DESK;}
 function actors(s,v,dt){const g=goal(s);v.actors??=[{x:g.x,y:g.y}];const a=v.actors[0];if(!a||!isFinite(a.x)||!isFinite(a.y)||a.x>8||a.y>8){v.actors=[{x:g.x,y:g.y}];return;}
  const d=Math.hypot(g.x-a.x,g.y-a.y),step=Math.min(d,1.7*dt*(s.speed||1));if(d>.001){a.facing=(g.x-a.x)-(g.y-a.y)>=0?1:-1;a.x+=(g.x-a.x)/d*step;a.y+=(g.y-a.y)/d*step;}a.moving=d>.02;}
 function screenArea(c,draw){const o=P(4.12,.401,1.8);c.save();c.transform(.4,.2,0,.46,o[0],o[1]);rrect(c,0,0,136,74,0);c.clip();draw();c.restore();}
 function monitor(c,s,t,v){const phase=s.phase,sale=(v.saleFlash||0)>.7;
  screenArea(c,()=>{c.fillStyle=sale?'#bff7d8':grad(c,'l',[0,0,136,74],[[0,'#1c3550'],[1,'#12233a']],'#173049');c.fillRect(0,0,136,74);
   c.fillStyle='rgba(255,255,255,.08)';c.fillRect(0,0,136,9);c.fillStyle='#f2a93b';c.fillRect(6,3,30,3);
   if(phase==='intro'){c.fillStyle='#f2a93b';c.font='900 17px "Segoe UI",system-ui,sans-serif';c.textAlign='center';c.fillText('THE FOUNDER',68,40);c.fillStyle='#7fe7ff';c.fillRect(38,50,60,3);c.textAlign='left';}
   else if(RESEARCH.includes(phase)){for(let i=0;i<3;i++){const y=12+i*20;circle(c,20,y+7,6,['#ff9fb2','#8fd4ff','#b6f08a'][i]);c.fillStyle='#5a8bd6';c.fillRect(34,y+3,80*(.4+.6*((Math.sin(t*2+i)+1)/2)),6);c.fillStyle='#3a5a80';c.fillRect(34,y+10,60,3);}}
   else if(DESIGN.includes(phase)||s.job){c.strokeStyle='rgba(127,231,255,.18)';c.lineWidth=1;for(let i=0;i<136;i+=10){c.beginPath();c.moveTo(i,9);c.lineTo(i,74);c.stroke();}for(let j=9;j<74;j+=10){c.beginPath();c.moveTo(0,j);c.lineTo(136,j);c.stroke();}
    gadget(c,68,44,s.productId||'headphones','#7fe7ff',2);}
   else{const bars=[.35,.52,.45,.7,.62,.82].map((h,i)=>Math.min(1,h*(.6+Math.min(1,(s.sold||0)/60)*.6)+(i===5?.1*Math.sin(t*3):0)));
    bars.forEach((h,i)=>{c.fillStyle=i===5?'#4fbf8a':'#5a8bd6';c.fillRect(12+i*20,70-h*56,13,h*56);});}
  });
  if(sale){const g=P(4.8,.45,1.4);c.save();c.globalAlpha=.5;circle(c,g[0],g[1],60,grad(c,'r',[g[0],g[1],0,g[0],g[1],60],[[0,'rgba(127,255,190,.8)'],[1,'rgba(127,255,190,0)']],'rgba(127,255,190,.2)'));c.restore();}
 }
 function stockOf(s){const archived=(s.portfolio||[]).filter(p=>p&&p.stock>0);const by={};for(const kind of ['headphones','keyboard','mouse'])by[kind]=(s.productId===kind?s.stock||0:0)+archived.filter(p=>p.productId===kind).reduce((n,p)=>n+p.stock,0);return by;}
 function shelf(c,s){const by=stockOf(s),kinds=Object.keys(by).filter(k=>by[k]>0);
  const rows=[[.72,kinds[0]],[1.32,kinds[1]||null],[.12,kinds[2]||null]];
  seed=11;[[.12,['#e46d6d','#6c8fd1','#f2c14e','#4fbf8a','#b47ad6']],[.72,['#f2a93b','#5e6ad2','#e46d6d']],[1.32,['#4fbf8a','#f2c14e']]].forEach(([z,cs])=>{let x=6.9;if(rows.find(r=>r[0]===z&&r[1]))return;
   cs.forEach(col=>{const w=.1+rnd()*.06,h=.32+rnd()*.17;box(c,x,.28,z,w,.26,h,col,{lw:.7});x+=w+.015;});});
  rows.forEach(([z,kind])=>{if(!kind)return;const n=Math.min(3,Math.ceil(by[kind]/10));for(let i=0;i<n;i++){const p=P(7.05+i*.3,.4,z+.22);gadget(c,p[0],p[1],kind,'#f2a93b',.75);}});
  if(!kinds.length){box(c,7.42,.2,.72,.36,.3,.26,'#2d2a4a');poly(c,fY(.501,7.47,7.73,.78,.92),'#7fe7ff');box(c,7.3,.2,1.32,.42,.3,.2,'#f6efe2');poly(c,fY(.501,7.35,7.67,1.37,1.47),'#f2a93b');}
 }
 function crate(c,x,y,z,w,d,h){box(c,x,y,z,w,d,h,'#c99a63');poly(c,fZ(z+h+.002,x+w/2-.05,x+w/2+.05,y,y+d),'#e8d3a6');poly(c,fY(y+d+.002,x+w/2-.05,x+w/2+.05,z+h*.55,z+h),'#e8d3a6');
  poly(c,fX(x+w+.002,y+d*.2,y+d*.55,z+h*.25,z+h*.55),'#fff7ea','#a8916f',.6);}
 function crates(c,s){let n=Math.min(5,Math.ceil((s.stock||0)/25));if(s.crew){const r=Math.max(0,Math.min(1,(s.crew.elapsed||0)/(s.crew.duration||1)));n=Math.max(n,Math.ceil(r*4));}
  const spots=[[6.25,4.15,0,.85,.85,.52],[7.1,4.85,0,.65,.7,.36],[6.38,4.3,.52,.6,.6,.36],[6.3,5.15,0,.7,.6,.4],[7.15,4.95,.36,.5,.5,.28]];
  spots.slice(0,n).sort((a,b)=>(a[0]+a[1]+a[2]*3)-(b[0]+b[1]+b[2]*3)).forEach(p=>crate(c,...p));}
 function cat(c,t){const cc=P(2.3,5.55,.66),b=1+Math.sin(t*2.2)*.035;c.save();c.translate(cc[0],cc[1]);c.scale(1,b);
  ellipse(c,0,-6,20,11,'#4a4458','#26222f',1.2);curve(c,[16,-2],[30,2],[22,-14],'#4a4458',5);circle(c,-15,-11,8.5,'#4a4458','#26222f',1.2);
  poly(c,[[-22,-15],[-24,-24],[-17,-20]],'#4a4458','#26222f',1);poly(c,[[-12,-18],[-10,-27],[-6,-19]],'#4a4458','#26222f',1);
  curve(c,[-19,-11],[-17,-9],[-15,-11],'#f2e8d8',1.1);curve(c,[-13,-11],[-11,-9],[-9,-11],'#f2e8d8',1.1);c.restore();}
 function lights(c,t,s){
  c.save();path(c,ROOM);c.clip();
  c.globalCompositeOperation='multiply';c.globalAlpha=.22;poly(c,ROOM,'#2a2058');c.globalAlpha=1;
  c.globalCompositeOperation='screen';
  const L=P(5.75,.7,.85);c.save();c.translate(L[0],L[1]);c.scale(1,.63);circle(c,0,0,150,grad(c,'r',[0,0,0,0,0,150],[[0,'rgba(255,197,107,.85)'],[.45,'rgba(255,159,69,.28)'],[1,'rgba(255,159,69,0)']],'rgba(255,170,90,.12)'));c.restore();
  const M=P(4.8,.45,1.4);c.globalAlpha=.45;circle(c,M[0],M[1]+10,70,grad(c,'r',[M[0],M[1]+10,0,M[0],M[1]+10,70],[[0,'rgba(127,231,255,.7)'],[1,'rgba(127,231,255,0)']],'rgba(127,231,255,.1)'));c.globalAlpha=1;
  garland().forEach((p,i)=>{if(i%2)return;const a=.55+.45*Math.sin(t*2.6-i*.37);c.globalAlpha=a;circle(c,p[0],p[1]+4,11,grad(c,'r',[p[0],p[1]+4,0,p[0],p[1]+4,11],[[0,'#fff1b8'],[.35,'rgba(255,207,106,.6)'],[1,'rgba(255,207,106,0)']],'rgba(255,207,106,.3)'));});
  c.restore();c.globalAlpha=1;c.globalCompositeOperation='source-over';
  garland().forEach((p,i)=>{if(i%2)return;const col=['#ffd66b','#ff8f6b','#9be38b','#7fd0ff'][i/2%4];circle(c,p[0],p[1]+4,3.2,col,dk(col,.4),.6);});
 }

 /* ---------- balões e marcadores ---------- */
 function pill(c,x,y,text,o={}){c.font=o.font||FONT;const w=(c.measureText&&c.measureText(text)?.width||text.length*7)+(o.pad??18),h=o.h||22;
  c.save();c.globalAlpha=o.alpha??1;c.shadowColor='rgba(0,0,0,.25)';c.shadowOffsetY=3;rrect(c,x-w/2,y-h/2,w,h,h/2);c.fillStyle=o.bg||'#fff7ea';c.fill();c.shadowColor='transparent';
  if(o.border){c.strokeStyle=o.border;c.lineWidth=1.5;c.stroke();}
  if(o.progress!=null){rrect(c,x-w/2+8,y+h/2-6,w-16,3,1.5);c.fillStyle='rgba(36,29,51,.15)';c.fill();rrect(c,x-w/2+8,y+h/2-6,(w-16)*Math.max(0,Math.min(1,o.progress)),3,1.5);c.fillStyle='#f2a93b';c.fill();}
  c.fillStyle=o.color||'#241d33';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y-(o.progress!=null?2:0)+.5);c.textAlign='left';c.textBaseline='alphabetic';c.restore();}
 const SPOTS={bench:{at:[4.8,.4,1.45],w:80,h:62,label:'COMPUTADOR',tag:[4.75,.3,1.97]},products:{at:[7.35,.3,1.05],w:52,h:70,label:'PRODUTOS',tag:[7.35,.3,2.3]},cash:{at:[.36,4.26,.85],w:38,h:34,label:'CONTAS',tag:[.36,4.26,1.35]},clients:{at:[4.82,0,2.17],w:86,h:24,label:'CLIENTES',tag:[4.82,0,2.58]}};
 function markers(c,s,t){for(const [key,sp] of Object.entries(SPOTS)){const p=P(...sp.tag);pill(c,p[0],p[1],sp.label,{alpha:.78,font:'800 9px "Segoe UI",system-ui,sans-serif',h:17,pad:14});}
  if(s.phase==='intro'){const p=P(4.9,2.05,2.35),b=Math.sin(t*4)*3;pill(c,p[0],p[1]+b,'CLIQUE NO COMPUTADOR',{bg:'#f2a93b',border:'#a8661c'});}}
 function bubbles(c,s,t,v){
  const task=s.crew||s.job,research=RESEARCH.includes(s.phase);
  if(task){const rate=task===s.job?(s.weekly?.effect?.workRate||1):1,ratio=Math.max(0,Math.min(1,((task.elapsed||0)+(s.weekly?(s.weekly.elapsed||0)/.4*rate:0))/(task.duration||1)));const at=s.crew?P(6.6,4.6,1.6):P(4.9,2.05,2.75);
   const msg=research?'PESQUISA '+Math.floor(ratio*100)+'%':s.crew?'MONTAGEM '+Math.floor(ratio*(s.crew.quantity||0))+'/'+(s.crew.quantity||0):'DESENVOLVENDO '+Math.floor(ratio*100)+'%';pill(c,at[0],at[1],msg,{progress:ratio,h:28});}
  if(s.phase==='selling'&&(s.stock||0)===0){const p=P(6.7,4.6,1.1);pill(c,p[0],p[1],'SEM ESTOQUE',{bg:'#e46d6d',color:'#fff',border:'#9c3b3b'});}
  if(s.phase==='opportunity'){const p=P(4.8,.4,2.05),b=Math.sin(t*5)*2;pill(c,p[0],p[1]+b,'💬 NOVA PROPOSTA',{bg:'#8fd4ff',border:'#3a7ea8'});}
  if((v.saleFlash||0)>0){const p=P(4.8,.4,1.95),k=1-v.saleFlash;pill(c,p[0],p[1]-k*44,'+ R$ '+Math.round(v.saleValue||0).toLocaleString('pt-BR'),{bg:'#4fbf8a',color:'#fff',border:'#2a7a54',alpha:Math.min(1,v.saleFlash*2.5),font:'900 13px "Segoe UI",system-ui,sans-serif'});}
  if((v.reviewFlash||0)>0){const n=Math.max(0,Math.min(5,Math.round(v.reviewStars||0))),p=P(4.2,1,2.25);pill(c,p[0],p[1]-(1-v.reviewFlash)*30,'★'.repeat(n)+'☆'.repeat(5-n),{color:'#c47d1f',alpha:Math.min(1,v.reviewFlash*2.5),font:'900 13px "Segoe UI",system-ui,sans-serif'});}
 }

 /* ---------- quadro ---------- */
 function render(c,s,t,v={}){
  if(c.imageSmoothingEnabled!==undefined)c.imageSmoothingEnabled=true;c.clearRect(0,0,width,height);
  const tr=c.getTransform&&c.getTransform(),density=Math.max(1,Math.round((tr&&tr.a)||2)),layer=staticLayer(density);
  if(layer){c.drawImage(layer,0,0,width,height);}else{room(c);wallDecor(c);shadows(c);rug(c);furniture(c);}
  monitor(c,s,t,v);shelf(c,s);cat(c,t);
  const a=(v.actors&&v.actors[0])||goal(s),sitting=!a.moving&&Math.hypot(a.x-DESK.x,a.y-DESK.y)<.05;
  const typing=!!s.job||DESIGN.includes(s.phase)||RESEARCH.includes(s.phase)||s.phase==='selling';
  const items=[{d:7.0,draw:()=>chair(c,sitting?'seat':'all')},{d:10.4,draw:()=>crates(c,s)}];
  if(sitting)items.push({d:7.01,draw:()=>{seated(c,s,t,typing);chair(c,'back');}});
  else items.push({d:a.x+a.y,draw:()=>standing(c,s,a.x,a.y,t,a.moving?'walk':s.crew?'work':'idle',a.moving?(a.facing||1):1)});
  items.sort((p,q)=>p.d-q.d).forEach(i=>i.draw());
  lights(c,t,s);markers(c,s,t);bubbles(c,s,t,v);
 }
 function hit(s,x,y){let best=null,score=1e9;for(const [key,sp] of Object.entries(SPOTS)){const p=P(...sp.at),dx=Math.abs(x-p[0])/(sp.w/2),dy=Math.abs(y-p[1])/(sp.h/2);if(dx<=1&&dy<=1&&dx+dy<score){best=key;score=dx+dy;}}return best;}
 return {width,height,render,actors,headphones:gadget,project:P,hit,spots:SPOTS};
})();
if(typeof module!=='undefined')module.exports=PilotWorld;
