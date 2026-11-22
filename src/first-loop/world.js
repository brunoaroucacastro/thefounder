/* Quarto e escritório do fundador — pixel art 2D, vista de cima em 3/4 (0.86).
   Mesma API de antes: width, height, render, actors, hit, project, headphones, spots.
   A renderização só lê o estado do jogo; nunca altera regras nem a partida. */
const PilotWorld=(()=>{
 const width=760,height=520;
 const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
 const mix=(a,b,t)=>'#'+rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
 const lit=(c,t)=>mix(c,'#fff4dc',t),dk=(c,t)=>mix(c,'#1d1530',t);
 const hexOk=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
 const FONT='800 11px "Nunito","Segoe UI",system-ui,sans-serif';
 function path(c,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
 function grad(c,kind,args,stops,fallback){const g=kind==='r'?c.createRadialGradient&&c.createRadialGradient(...args):c.createLinearGradient&&c.createLinearGradient(...args);if(!g||!g.addColorStop)return fallback;stops.forEach(([o,col])=>g.addColorStop(o,col));return g;}
 function circle(c,x,y,r,fill,stroke,lw=1){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function ellipse(c,x,y,rx,ry,fill,stroke,lw=1){c.beginPath();c.ellipse?c.ellipse(x,y,rx,ry,0,0,Math.PI*2):c.arc(x,y,rx,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
 function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
 function stroke(c,pts,col,lw,cap='round'){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=col;c.lineWidth=lw;c.lineCap=cap;c.lineJoin='round';c.stroke();}
 function curve(c,a,q,b,col,lw){c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(q[0],q[1],b[0],b[1]);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.stroke();}
 const SEATS=[{x:1.7,y:5.15},{x:3.8,y:5.15}];
 /* ---------- pixel art 2D (0.86): vista de cima em 3/4 ----------
    A sala tem 8×8 tiles de 16 pixels de arte e a parede do fundo aparece acima da linha y=0.
    A arte é desenhada numa tela de 254×174 e ampliada 3× sem suavizar; P devolve coordenadas do canvas (760×520),
    então pontos clicáveis, marcadores e balões continuam usando a mesma projeção do desenho. */
 const AX=63,AY=46,K=3,AW=254,AH=174;
 const A=(x,y,z=0)=>[AX+x*16,AY+y*16-z*12];
 const P=(x,y,z=0)=>{const a=A(x,y,z);return [a[0]*K,a[1]*K];};
 const mk=(w,h)=>{const k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');x.imageSmoothingEnabled=false;return [k,x];};
 function F(g,x,y,w,h,col){if(!(w>0&&h>0))return;const x0=Math.round(x),y0=Math.round(y),x1=Math.round(x+w),y1=Math.round(y+h);if(x1<=x0||y1<=y0)return;g.fillStyle=col;g.fillRect(x0,y0,x1-x0,y1-y0);}
 function O(g,cx,cy,rx,ry,col){g.fillStyle=col;cx=Math.round(cx);cy=Math.round(cy);rx=Math.max(1,Math.round(rx));ry=Math.max(1,Math.round(ry));for(let dy=-ry;dy<=ry;dy++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(dy/(ry+.5))**2)));g.fillRect(cx-w,cy+dy,w*2+1,1);}}
 function outl(k,col){const x=k.getContext('2d'),w=k.width,h=k.height,d=x.getImageData(0,0,w,h),a=d.data,s=new Uint8Array(w*h),q=rgb(col);
  for(let i=0;i<w*h;i++)s[i]=a[i*4+3]>140?1:0;
  for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){const i=y*w+xx;if(s[i])continue;if((xx>0&&s[i-1])||(xx<w-1&&s[i+1])||(y>0&&s[i-w])||(y<h-1&&s[i+w])){a[i*4]=q[0];a[i*4+1]=q[1];a[i*4+2]=q[2];a[i*4+3]=255;}}
  x.putImageData(d,0,0);}
 // caixa em 3/4: tampo e frente, com bordas
 function B(g,x,y,z,w,d,h,col,o={}){const [x0,top]=A(x,y,z+h),x1=x0+w*16,mid=A(x,y+d,z+h)[1],bot=A(x,y+d,z)[1],tp=o.top||lit(col,.18),fr=o.front||col;
  F(g,x0,top,x1-x0,mid-top,tp);F(g,x0,mid,x1-x0,bot-mid,fr);
  if(o.edge!==false){F(g,x0,mid,x1-x0,1,lit(tp,.28));F(g,x0,bot-1,x1-x0,1,dk(fr,.32));F(g,x0,top,1,bot-top,dk(col,.3));F(g,x1-1,top,1,bot-top,dk(col,.36));F(g,x0,top,x1-x0,1,dk(tp,.25));}
  return {x0,x1,top,mid,bot};}
 const MEMO={};
 function memo(key,w,h,paint,line){let m=MEMO[key];if(m)return m;const [k,x]=mk(w+2,h+2);x.translate(1,1);paint(x);if(line!==false)outl(k,line||'#2a2133');return (MEMO[key]=k);}

 /* ---------- gente (16×24, 4 direções, 3 quadros) ---------- */
 function paintChar(x2,k,dir,f){const P2=(x,y,w,h,col)=>F(x2,x+1,y+1,w,h,col);
  const skin=k.skin,skD=dk(skin,.2),hair=k.hair,hairL=lit(hair,.25),shirt=k.shirt,shD=dk(shirt,.2),pants=k.pants||'#3d4a6b',shoes='#3a2f3f',st=k.style||'short',eye='#2a1f2e',blush=mix(skin,'#ff6f7f',.4);
  if(dir!=='left'){const L2=f===1?1:0,R3=f===2?1:0,up=dir==='up';
   P2(5,17,7,2,pants);P2(5,18,3,4-L2,pants);P2(9,18,3,4-R3,pants);P2(5,22-L2,3,2,shoes);P2(9,22-R3,3,2,shoes);
   const a=f===1?1:f===2?-1:0;P2(2,11+(a>0?1:0),2,5,up?shD:shirt);P2(2,16+(a>0?1:0),2,2,skin);P2(13,11+(a<0?1:0),2,5,shD);P2(13,16+(a<0?1:0),2,2,skin);
   P2(4,11,9,7,shirt);P2(11,11,2,7,shD);P2(4,17,9,1,shD);if(up)P2(5,9,7,3,dk(shirt,.12));else P2(7,10,3,1,skD);
   P2(5,2,7,1,skin);P2(4,3,9,7,skin);P2(5,10,7,1,skD);P2(3,6,1,2,skin);P2(13,6,1,2,skin);
   if(!up){P2(6,6,1,2,eye);P2(10,6,1,2,eye);P2(5,8,1,1,blush);P2(11,8,1,1,blush);P2(8,9,1,1,dk(skin,.45));}
   P2(5,1,7,1,hair);P2(4,2,9,up?7:3,hair);P2(3,3,1,up?4:3,hair);P2(13,3,1,up?4:3,hair);if(!up){P2(4,5,2,1,hair);P2(10,5,2,1,hair);}P2(6,2,3,1,hairL);return;}
  if(f===0){P2(6,17,5,5,pants);P2(5,22,6,2,shoes);}else{const fw=f===1;P2(6,17,5,2,pants);P2(fw?4:8,18,3,4,pants);P2(fw?8:5,18,3,3,dk(pants,.15));P2(fw?3:8,22,4,2,shoes);P2(fw?8:4,21,4,2,dk(shoes,.2));}
  P2(5,11,7,7,shirt);P2(10,11,2,7,shD);P2(5,17,7,1,shD);P2(9,9,3,3,dk(shirt,.12));const sw=f===1?-1:f===2?1:0;P2(7+sw,12,2,5,shD);P2(7+sw,17,2,2,skin);
  P2(5,2,7,1,skin);P2(4,3,8,7,skin);P2(5,10,6,1,skD);P2(3,7,1,1,skin);P2(5,6,1,2,eye);P2(5,8,1,1,blush);P2(4,9,1,1,dk(skin,.45));P2(9,6,1,2,skD);
  P2(5,1,7,1,hair);P2(4,2,8,3,hair);P2(9,2,3,7,hair);P2(12,3,1,4,hair);P2(4,5,1,1,hair);P2(6,2,3,1,hairL);}
 // o fundador usa o fone de ouvido laranja
 function phones(x2,dir){const P2=(x,y,w,h,col)=>F(x2,x+1,y+1,w,h,col);
  if(dir==='left'){P2(6,0,5,1,'#2d2a4a');P2(8,5,3,4,'#f2a93b');P2(8,5,3,1,'#ffd27a');return;}if(dir==='right'){P2(6,0,5,1,'#2d2a4a');P2(6,5,3,4,'#f2a93b');P2(6,5,3,1,'#ffd27a');return;}
  P2(4,0,9,1,'#2d2a4a');P2(2,5,2,4,'#f2a93b');P2(13,5,2,4,'#f2a93b');P2(2,5,2,1,'#ffd27a');P2(13,5,2,1,'#ffd27a');}
 function charSprite(k,dir,f,ph){const key='ch'+[k.shirt,k.hair,k.skin,k.pants].join('|')+dir+f+(ph?'p':'');if(MEMO[key])return MEMO[key];
  if(dir==='right'){const src=charSprite(k,'left',f,false),[c2,x2]=mk(18,26);x2.translate(18,0);x2.scale(-1,1);x2.drawImage(src,0,0);x2.setTransform(1,0,0,1,0,0);if(ph){phones(x2,'right');outl(c2,'#2a2133');}return (MEMO[key]=c2);}
  const [c2,x2]=mk(18,26);paintChar(x2,k,dir,f);if(ph)phones(x2,dir);outl(c2,'#2a2133');return (MEMO[key]=c2);}
 function person(g,k,x,y,dir,f,ph,lift=0){const [sx,sy]=A(x,y);O(g,sx,sy-1,6,2,'rgba(32,22,44,.3)');g.drawImage(charSprite(k,dir,f,ph),Math.round(sx)-9,Math.round(sy)-25-lift);}
 function chairBack(g,x,y,col){const [sx,sy]=A(x,y);F(g,sx-7,sy-12,14,9,col);F(g,sx-7,sy-12,14,1,lit(col,.25));F(g,sx-7,sy-4,14,1,dk(col,.35));F(g,sx-1,sy-3,2,3,'#3a3650');O(g,sx,sy+1,6,2,'#2d2a4a');}

 /* ---------- cena fixa ---------- */
 function floorWood(g){for(let j=0;j<32;j++){const y=AY+j*4;let x=0;let n=0;while(x<128){const len=Math.min(128-x,24+((j*7+n*13)%5)*6);const tone=((j*3+n)%3)===0?'#ab7a4e':((j*3+n)%3)===1?'#b9875a':'#b28152';F(g,AX+x,y,len,3,tone);F(g,AX+x,y,len,1,'#c7966a');F(g,AX+x,y+3,len,1,'#8a5e3c');F(g,AX+x+len-1,y,1,3,'#8a5e3c');x+=len;n++;}}}
 function floorTiles(g){for(let i=0;i<8;i++)for(let j=0;j<8;j++){const x=AX+i*16,y=AY+j*16;F(g,x,y,16,16,(i+j)%2?'#868fa0':'#7e8796');F(g,x,y,16,1,'#98a1b0');F(g,x,y,1,16,'#98a1b0');F(g,x+15,y,1,16,'#6c7484');F(g,x,y+15,16,1,'#6c7484');}}
 function shell(g,wall,wains,cap,office){
  // base da sala e paredes laterais finas
  F(g,AX-6,AY+128,140,8,dk(cap,.2));F(g,AX-6,AY+128,140,2,lit(cap,.15));
  F(g,AX,AY-40,128,40,wall);for(let x=4;x<128;x+=8)for(let y=AY-36;y<AY-16;y+=7)F(g,AX+x+((y>>1)&4),y,1,1,dk(wall,.07));
  if(wains){F(g,AX,AY-15,128,15,wains);for(let x=4;x<128;x+=8)F(g,AX+x,AY-13,1,11,dk(wains,.2));F(g,AX,AY-16,128,2,lit(wains,.3));}
  F(g,AX,AY-3,128,3,office?'#8d96a4':'#4b5f52');F(g,AX,AY-43,128,3,cap);
  F(g,AX-6,AY-43,6,179,cap);F(g,AX+128,AY-43,6,179,dk(cap,.15));F(g,AX-6,AY-43,6,2,lit(cap,.25));F(g,AX+128,AY-43,6,2,lit(cap,.25));
  F(g,AX,AY,128,3,'rgba(30,18,40,.25)');F(g,AX,AY,3,128,'rgba(30,18,40,.2)');}
 function windowWall(g,x0,x1,dusk){const a=AX+x0*16,b=AX+x1*16,top=AY-36,h=22;F(g,a-2,top-2,b-a+4,h+4,dusk?'#efe1c6':'#4b5263');
  for(let i=0;i<h;i++)F(g,a,top+i,b-a,1,dusk?mix(i<h*.55?'#3d3f7a':'#b8628a',i<h*.55?'#b8628a':'#f3a35c',(i%(h*.55))/(h*.55)):mix('#7ec4ef','#d9effa',i/h));
  for(let x=a;x<b;){const w=4+((x*7)%6),hh=4+((x*13)%9);F(g,x,top+h-hh,Math.min(w,b-x),hh,dusk?'#2b2550':'#7d91ae');for(let k=0;k<3;k++){const wx=x+1+((x+k*5)%Math.max(1,w-2)),wy=top+h-hh+2+k*3;if(wy<top+h-1&&((x+k)%3))F(g,wx,wy,1,1,dusk?'#ffd77a':'#c9dcf0');}x+=w+1;}
  if(dusk)O(g,b-7,top+5,2,2,'#fff1d0');F(g,(a+b)/2-1,top,2,h,dusk?'#efe1c6':'#4b5263');F(g,a,top+h/2-1,b-a,1,dusk?'#efe1c6':'#4b5263');F(g,a-3,top+h+1,b-a+6,2,dusk?'#d8c9ad':'#cfd4da');
  if(!dusk){F(g,a+2,top+2,6,1,'#ffffff');F(g,a+2,top+3,1,5,'#ffffff');}}
 function plantPot(g,x,y,big,pot){const [sx,sy]=A(x,y),s=big?1.2:1;F(g,sx-5*s,sy-9*s,10*s,9*s,pot);F(g,sx-6*s,sy-10*s,12*s,2,lit(pot,.2));F(g,sx+2*s,sy-8*s,2,8*s,dk(pot,.18));
  for(const [dx,dy,c] of [[-6,-16,'#3f8f5a'],[5,-17,'#4fa868'],[-2,-22,'#5fbf74'],[3,-26,'#4fa868'],[-5,-28,'#3f8f5a'],[0,-31,'#5fbf74']]){const lx=sx+dx*s,ly=sy+dy*s;F(g,lx-2,ly-4,4,9,c);F(g,lx-1,ly-5,2,1,c);F(g,lx,ly-4,1,4,lit(c,.3));}}
 function bedroom(g){floorWood(g);shell(g,'#d2bea2','#6e8c7c','#3a2f4a',false);windowWall(g,.7,2.6,true);
  for(const x of [AX+.7*16-8,AX+2.6*16+1]){F(g,x,AY-40,7,32,'#c4614f');for(let k=1;k<7;k+=2)F(g,x+k,AY-40,1,32,'#8e3f36');}F(g,AX+.7*16-10,AY-41,2.6*16-.7*16+20,2,'#5a4636');
  // relógio e mural de clientes de cortiça
  O(g,AX+3.05*16,AY-28,5,5,'#7d6a55');O(g,AX+3.05*16,AY-28,4,4,'#fffaf0');F(g,AX+3.05*16,AY-31,1,3,'#2d2a4a');F(g,AX+3.05*16,AY-28,2,1,'#2d2a4a');
  {const a=AX+3.6*16,b=AX+5.9*16,top=AY-38;F(g,a,top,b-a,16,'#8c6640');F(g,a+1,top+1,b-a-2,14,'#d9ad75');for(let i=0;i<14;i++)F(g,a+2+(i*7)%(b-a-4),top+2+(i*5)%12,1,1,'#c99a63');
   [['#ffe27a',2],['#8fd4ff',10],['#ff9fb2',18],['#b6f08a',26]].forEach(([c,dx],i)=>{F(g,a+dx,top+3+(i%2)*2,7,7,c);F(g,a+dx+1,top+5+(i%2)*2,5,1,dk(c,.4));F(g,a+dx+1,top+7+(i%2)*2,4,1,dk(c,.4));F(g,a+dx+3,top+3+(i%2)*2,1,1,'#e46d6d');});}
  // prateleira de livros sobre o criado-mudo
  F(g,AX+2,AY-20,22,2,'#8a5d3e');[['#6c8fd1',3,7],['#e46d6d',6,6],['#f2c14e',9,8],['#4fbf8a',12,5]].forEach(([c,x,h])=>F(g,AX+x,AY-20-h,3,h,c));
  // tapete listrado
  {const [x0,y0]=A(2.4,3),[x1,y1]=A(6.4,6.3);F(g,x0,y0,x1-x0,y1-y0,'#6b3d55');F(g,x0+2,y0+2,x1-x0-4,y1-y0-4,'#8c5170');F(g,x0+5,y0+5,x1-x0-10,y1-y0-10,'#6b3d55');for(let i=0;i<6;i++)F(g,x0+9+i*10,y0+7,5,y1-y0-14,i%2?'#d98f5c':'#e7c27a');for(let y=y0+1;y<y1-1;y+=2){F(g,x0-2,y,2,1,'#e7c27a');F(g,x1,y,2,1,'#e7c27a');}}
  plantPot(g,.45,.75,true,'#c0674e');
  // mesa com gaveteiro, teclado, caneca, caderno e luminária
  {const d=B(g,3.4,0,.72,3.1,1.35,.08,'#c98f5a');B(g,5.55,.1,0,.85,1.2,.72,'#b47d4c');for(const yy of [.42,.62])F(g,A(5.62,1.3,yy)[0],A(5.62,1.3,yy)[1],11,1,'#e8d3a6');
   F(g,A(3.5,1.3)[0],A(3.5,1.3,.72)[1],2,9,'#8a5d3e');void d;
   B(g,4.42,.82,.8,1,.28,.04,'#e8e2d6',{edge:false});for(let i=0;i<5;i++)F(g,A(4.46+i*.18,.86,.84)[0],A(4.46,.86,.84)[1],2,2,'#cfc7b7');
   B(g,3.72,.68,.8,.2,.2,.22,'#e46d6d');B(g,3.55,.12,.8,.55,.42,.05,'#5e6ad2');F(g,A(3.58,.15,.86)[0],A(3.58,.15,.86)[1],8,5,'#fff7ea');
   const [lx,ly]=A(6.1,.4,.8);O(g,lx,ly,3,1,'#2d2a4a');F(g,lx,ly-14,1,14,'#2d2a4a');F(g,lx-6,ly-15,7,1,'#2d2a4a');for(let i=0;i<5;i++)F(g,lx-9-i,ly-15+i,6+i*2,1,i<4?'#f2a93b':'#a8661c');}
  // estante de produtos
  B(g,6.75,0,0,1.2,.55,1.95,'#7a5238',{top:'#8a5d3e'});
  // criado-mudo com o cofrinho das contas
  {B(g,.05,3.95,0,.62,.62,.6,'#9c6a45');const [px,py]=A(.36,4.26,.6);O(g,px,py-4,5,3,'#f3a6b8');O(g,px+4,py-5,2,2,'#f3a6b8');F(g,px-2,py-8,3,1,'#b5677c');F(g,px+5,py-5,1,1,'#3a2030');F(g,px-3,py-1,1,2,'#b5677c');F(g,px+2,py-1,1,2,'#b5677c');}
  // cama
  {B(g,0,4.75,0,.16,2.3,1.15,'#8a5d3e');B(g,.16,4.75,0,2.95,2.3,.3,'#9c6a45');B(g,.2,4.82,.3,2.86,2.16,.24,'#f6efe2');B(g,1.12,4.72,.3,2.04,2.36,.32,'#4f8d9d',{top:'#62a6b5'});
   B(g,1.12,4.72,.62,2.04,.25,.02,'#e9e1d2',{edge:false});for(let i=0;i<3;i++)F(g,A(1.5+i*.55,4.9,.64)[0],A(1.5,4.95,.64)[1],3,32,'#58a0b0');
   B(g,.28,5.0,.54,.7,.85,.17,'#fffaf0');B(g,.28,5.95,.54,.7,.85,.17,'#f3dfe6');B(g,2.62,4.76,.62,.4,2.28,.07,'#e7c27a');B(g,2.9,4.75,0,.2,2.3,.55,'#8a5d3e');}
  // chinelos e livros no chão
  F(g,A(1.55,7.3)[0],A(1.55,7.3)[1],3,5,'#e7c27a');F(g,A(1.82,7.35)[0],A(1.82,7.35)[1],3,5,'#e7c27a');
  B(g,2.98,.3,0,.36,.27,.07,'#6c8fd1');B(g,3.0,.32,.07,.31,.24,.06,'#f2c14e');}
 function office(g){floorTiles(g);shell(g,'#eceeef',null,'#2d3446',true);
  {const [x0,y0]=A(2.6,2.7),[x1,y1]=A(6.4,6.4);F(g,x0,y0,x1-x0,y1-y0,'#5f6b80');F(g,x0+2,y0+2,x1-x0-4,y1-y0-4,'#68758b');F(g,x0+5,y0+5,x1-x0-10,1,'#7d899e');}
  windowWall(g,.35,2.35,false);
  // sol da janela no chão
  for(const [a,b] of [[.4,1.3],[1.4,2.3]]){const [x0,y0]=A(a,.1);for(let i=0;i<34;i++)F(g,x0+i*.6,y0+i,(b-a)*16,1,'rgba(255,244,214,'+(.32-i*.008)+')');}
  // quadro de desempenho, mural de clientes e TV da Nexus
  {const a=AX+2.6*16,top=AY-38;F(g,a,top,22,18,'#8a92a3');F(g,a+1,top+1,20,15,'#fbfbf8');[[4,'#5a8bd6'],[6,'#5a8bd6'],[5,'#5a8bd6'],[8,'#5a8bd6'],[10,'#2f9a6a']].forEach(([h,c],i)=>F(g,a+3+i*3,top+14-h,2,h,c));for(let i=0;i<4;i++)F(g,a+3+i*4,top+9-i*2,4,1,'#ef8a3c');F(g,a+15,top+3,4,4,'#ffe27a');}
  {const a=AX+4.15*16,top=AY-38;F(g,a,top,24,16,'#8c6640');F(g,a+1,top+1,22,14,'#d9ad75');[[2,'#ff9fb2'],[8,'#8fd4ff'],[14,'#b6f08a']].forEach(([dx,c],i)=>{F(g,a+dx,top+3+(i%2)*2,6,7,'#ffffff');F(g,a+dx+1,top+4+(i%2)*2,4,4,c);F(g,a+dx+2,top+5+(i%2)*2,2,2,'#edbd97');F(g,a+dx+2,top+3+(i%2)*2,1,1,'#e46d6d');});}
  {const a=AX+5.75*16,top=AY-37;F(g,a,top,18,13,'#1f2330');F(g,a+1,top+1,16,11,'#ffffff');F(g,a+1,top+1,16,2,'#7b5cd6');for(let i=0;i<3;i++){F(g,a+2,top+4+i*3,2,2,['#ff9fb2','#8fd4ff','#b6f08a'][i]);F(g,a+5,top+4+i*3,10-i*2,1,'#c9cde0');}}
  plantPot(g,.5,.85,true,'#e9e6df');plantPot(g,7.6,3.0,false,'#e9e6df');
  // cofre
  {const d=B(g,.08,1.2,0,.62,.62,.58,'#4f586c');O(g,(d.x0+d.x1)/2,(d.mid+d.bot)/2,3,3,'#e2c26a');O(g,(d.x0+d.x1)/2,(d.mid+d.bot)/2,1,1,'#8c6a20');F(g,d.x0+2,d.mid+2,1,d.bot-d.mid-4,'#c9ccd6');}
  // mesa do fundador
  {B(g,3.4,0,.72,3.1,1.35,.07,'#f4f2ee');F(g,A(3.48,1.3)[0],A(3.48,1.3,.72)[1],2,9,'#7a8091');B(g,5.55,.08,0,.85,1.2,.72,'#e4e1db');for(const yy of [.25,.52])F(g,A(5.62,1.28,yy)[0],A(5.62,1.28,yy)[1],11,1,'#a9a49a');
   B(g,4.42,.82,.79,1,.28,.04,'#e8e2d6',{edge:false});for(let i=0;i<5;i++)F(g,A(4.46+i*.18,.86,.83)[0],A(4.46,.86,.83)[1],2,2,'#cfc7b7');
   B(g,3.72,.68,.79,.2,.2,.2,'#7b5cd6');B(g,3.6,.15,.79,.6,.45,.05,'#2f9a6a');F(g,A(3.62,.17,.84)[0],A(3.62,.17,.84)[1],8,5,'#fff7ea');B(g,6.0,.25,.79,.24,.24,.18,'#e9e6df');F(g,A(6.06,.3,.97)[0],A(6.06,.3,.97)[1]-4,3,4,'#4fa868');}
  // estante branca de produtos, bebedouro e palete
  B(g,6.75,0,0,1.2,.55,1.95,'#e9ecef',{top:'#ffffff'});
  {const d=B(g,.12,7.3,0,.42,.42,.9,'#eef1f4');B(g,.18,7.36,.9,.3,.3,.42,'#8fd0f0',{top:'#b8e4f6'});F(g,d.x0+2,d.mid+3,3,2,'#7a8091');}
  B(g,6.12,4.08,0,1.66,1.78,.1,'#b48a5a');
  // capacho e porta na parede lateral
  {const [x0,y0]=A(.1,6.4);F(g,x0,y0,11,13,'#7b5cd6');F(g,x0+1,y0+1,9,11,'#8f74e0');F(g,AX-6,y0-2,6,17,'#a7774f');F(g,AX-6,y0-2,6,1,'#c99a6a');F(g,AX-3,y0+6,2,2,'#e2c26a');}}
 function deskModern(g,cx,cy,k,col){const x0=cx-.8,y0=cy-1.55;B(g,x0,y0,.72,1.6,.8,.06,col.top);for(const dx of [.05,1.5])F(g,A(x0+dx,y0+.75)[0],A(x0,y0+.8,.72)[1],2,9,col.leg);
  const [mx,my]=A(cx-.5,y0+.2,.78);F(g,mx,my-13,16,12,'#2a2838');F(g,mx+7,my-1,2,2,'#2a2838');F(g,mx+1,my-12,14,9,'#1c2a3c');B(g,cx-.35,y0+.45,.78,.6,.2,.03,'#e8e2d6',{edge:false});
  if(k%2)B(g,x0+.08,y0+.5,.78,.18,.18,.2,'#ef8a3c');else{B(g,x0+.1,y0+.5,.78,.2,.2,.16,'#e9e6df');F(g,A(x0+.14,y0+.55,.94)[0],A(x0,y0+.55,.94)[1]-4,3,4,'#4fa868');}}
 let cache=null;
 function staticLayer(isOffice){if(cache&&cache.office===isOffice)return cache.canvas;const [k,g]=mk(AW,AH);if(isOffice){office(g);deskModern(g,SEATS[0].x,SEATS[0].y,0,{top:'#f4f2ee',leg:'#7a8091'});deskModern(g,SEATS[1].x,SEATS[1].y,1,{top:'#f4f2ee',leg:'#7a8091'});}else bedroom(g);cache={canvas:k,office:isOffice};return k;}

 /* ---------- o que muda durante a partida ---------- */
 function screenPx(g,s,t,v){const [x0,y0]=A(4.05,.3,1.0),w=24,h=15,sale=(v.saleFlash||0)>.7,phase=s.phase;
  F(g,x0-1,y0-h-2,w+2,h+3,'#2a2838');F(g,x0+w/2-1,y0,3,3,'#2a2838');F(g,x0+w/2-3,y0+2,7,1,'#2a2838');
  const sx=x0,sy=y0-h-1;F(g,sx,sy,w,h,sale?'#bff7d8':'#173049');F(g,sx,sy,w,2,'#24486a');F(g,sx+1,sy,5,1,'#f2a93b');
  if(phase==='intro'){for(let i=0;i<4;i++)F(g,sx+3+i*5,sy+5,4,3,'#f2a93b');F(g,sx+6,sy+10,12,1,'#7fe7ff');}
  else if(RESEARCH.includes(phase)){for(let i=0;i<3;i++){F(g,sx+2,sy+3+i*4,2,2,['#ff9fb2','#8fd4ff','#b6f08a'][i]);F(g,sx+5,sy+3+i*4,Math.round(5+12*((Math.sin(t*2+i)+1)/2)),2,'#5a8bd6');}}
  else if(DESIGN.includes(phase)||s.job){for(let i=2;i<w;i+=3)F(g,sx+i,sy+2,1,h-2,'#24486a');F(g,sx+8,sy+4,8,2,'#7fe7ff');F(g,sx+7,sy+5,2,6,'#7fe7ff');F(g,sx+15,sy+5,2,6,'#7fe7ff');}
  else{[.35,.52,.45,.7,.62,.82].forEach((hh,i)=>{const v2=Math.min(1,hh*(.6+Math.min(1,(s.sold||0)/60)*.6)+(i===5?.1*Math.sin(t*3):0)),bh=Math.max(1,Math.round(v2*10));F(g,sx+2+i*4,sy+h-1-bh,3,bh,i===5?'#4fbf8a':'#5a8bd6');});}
  if(s.job&&!RESEARCH.includes(s.phase)||s.crew){F(g,sx+w-8,sy+h-7,7,6,'#2d2a4a');F(g,sx+w-6,sy+h-6,3,2,'#c98e6b');F(g,sx+w-7,sy+h-3,5,2,'#4fbf8a');}}
 function gadgetPx(g,x,y,kind){if(kind==='headphones'){F(g,x-3,y-4,7,1,'#2d2a4a');F(g,x-4,y-3,1,2,'#2d2a4a');F(g,x+4,y-3,1,2,'#2d2a4a');F(g,x-5,y-1,3,4,'#f2a93b');F(g,x+3,y-1,3,4,'#f2a93b');}
  else if(kind==='keyboard'){F(g,x-5,y-1,11,4,'#c9d2cf');for(let i=0;i<4;i++)F(g,x-4+i*3,y,2,1,'#7d8f99');F(g,x-3,y+2,6,1,'#7d8f99');}
  else if(kind==='mouse'){O(g,x,y,2,3,'#c9d2cf');F(g,x,y-3,1,2,'#f2a93b');}
  else{F(g,x-4,y-3,8,7,'#536e7b');O(g,x-2,y,1,1,'#b6c7c0');O(g,x+2,y,1,1,'#b6c7c0');}}
 function shelfPx(g,s){const by=stockOf(s),kinds=Object.keys(by).filter(k=>by[k]>0);const [x0]=A(6.75,0),rows=[A(0,.55,1.5)[1],A(0,.55,.95)[1],A(0,.55,.4)[1]];
  rows.forEach((ry,r)=>{F(g,x0+1,ry-1,17,1,dk(s.office?'#e9ecef':'#7a5238',.3));const kind=kinds[r];
   if(kind){const n=Math.min(3,Math.ceil(by[kind]/10));for(let i=0;i<n;i++)gadgetPx(g,x0+4+i*5,ry-4,kind);}
   else for(let i=0;i<4;i++)F(g,x0+2+i*4,ry-6+(i%2),3,6-(i%2),['#e46d6d','#6c8fd1','#f2c14e','#4fbf8a'][(i+r)%4]);});}
 function crate(g,x,y,z,w,d,h){const b=B(g,x,y,z,w,d,h,'#c99a63',{top:'#d9ad75'});const cx=(b.x0+b.x1)/2;F(g,cx-1,b.top,2,b.mid-b.top,'#e8d3a6');F(g,cx-1,b.mid,2,(b.bot-b.mid)*.5,'#e8d3a6');F(g,b.x1-6,b.mid+2,4,3,'#fff7ea');}
 function crates(g,s){let n=Math.min(5,Math.ceil((s.stock||0)/25));if(s.crew){const r=Math.max(0,Math.min(1,(s.crew.elapsed||0)/(s.crew.duration||1)));n=Math.max(n,Math.ceil(r*4));}
  const spots=[[6.25,4.15,0,.85,.85,.52],[7.1,4.85,0,.65,.7,.36],[6.38,4.3,.52,.6,.6,.36],[6.3,5.15,0,.7,.6,.4],[7.15,4.95,.36,.5,.5,.28]];
  spots.slice(0,n).sort((a,b)=>(a[1]+a[3]+a[2])-(b[1]+b[3]+b[2])).forEach(p=>crate(g,...p));}
 function catPx(g,t){const [sx,sy]=A(2.3,5.55,.66),k=memo('cat'+(Math.floor(t*1.1)%2),20,14,x2=>{const f=Math.floor(t*1.1)%2,C='#4a4458',L2='#6a6478';O(x2,11,9-f,7,3+f,C);F(x2,3,10,14,2,C);O(x2,5,8,3,3,C);F(x2,3,4,1,2,C);F(x2,6,4,1,2,C);F(x2,4,8,2,1,'#f2e8d8');F(x2,8,6-f,6,1,L2);},'#26222f');g.drawImage(k,Math.round(sx)-11,Math.round(sy)-13);}
 function garlandPx(g,t,lit2){for(let i=0;i<=64;i++){const tt=i/64,x=AX+2+tt*124,y=AY-41+Math.round(Math.sin(tt*Math.PI*3)**2*4);F(g,x,y,1,1,'#3a2f2a');if(i%5===2){const c=['#ffd66b','#ff8f6b','#9be38b','#7fd0ff'][(i/5|0)%4],on=lit2&&Math.sin(t*2.6-i*.37)>-.2;F(g,x-1,y+1,2,2,on?lit(c,.35):dk(c,.25));}}}
 let LOWW=null,DARKW=null;
 function lightsPx(g,s,t,v){if(s.office){const [mx,my]=A(4.8,.45,1.4);g.globalCompositeOperation='lighter';O(g,mx,my+6,14,8,'rgba(127,231,255,.08)');g.globalCompositeOperation='source-over';return;}
  if(!DARKW)DARKW=mk(AW,AH);const [dc,dg]=DARKW;dg.globalCompositeOperation='source-over';dg.clearRect(0,0,AW,AH);dg.fillStyle='rgba(42,32,88,.26)';dg.fillRect(AX-6,AY-43,140,179);dg.globalCompositeOperation='destination-out';
  const L=[[...A(5.75,.7,.75),46],[...A(4.8,.6,1.2),26]];for(const [x,y,r] of L)for(const [k,a] of [[1,.3],[.66,.45],[.38,.6]])O(dg,x,y,r*k,r*k*.7,'rgba(0,0,0,'+a+')');
  g.drawImage(dc,0,0);g.globalCompositeOperation='lighter';O(g,L[0][0],L[0][1],22,14,'rgba(255,170,80,.14)');O(g,L[1][0],L[1][1]+4,12,7,'rgba(127,231,255,.1)');
  if((v.saleFlash||0)>.7){const [x,y]=A(4.8,.45,1.4);O(g,x,y,26,18,'rgba(127,255,190,.18)');}g.globalCompositeOperation='source-over';}

 /* ---------- hora do dia: 60 unidades do dia útil = 8h às 18h ---------- */
 function hourOf(s){const w=s.weekly;if(w){if(w.stage!=='work')return 12;return 8+((w.minute||0)+Math.min(1,(w.elapsed||0)/.4))*10/60;}if(s.fourPs)return 8+(s.clock%60)/5;return 12;}
 const SKY=[[6,'#3a3a78','#e88a6a','#4a4a72',1],[7.5,'#f6a37a','#fcd9a8','#8a7f9e',.4],[9.5,'#7ec4ef','#d9effa','#7d91ae',0],[13.5,'#86c6ee','#e6f2e0','#7d91ae',0],[15.5,'#f0c06a','#fbe3ae','#9a8a7a',0],[16.8,'#b8628a','#f3a35c','#4a3d6a',.6],[18,'#2a2d63','#7a4d82','#26234a',1],[24,'#141838','#2a2d63','#1c1a3a',1]];
 function hx(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
 function skyAt(h){for(let i=0;i<SKY.length-1;i++){const [h0,t0,b0,c0,l0]=SKY[i],[h1,t1,b1,c1,l1]=SKY[i+1];if(h<=h1){const t=Math.max(0,Math.min(1,(h-h0)/(h1-h0)));return{top:hx(t0,t1,t),bot:hx(b0,b1,t),bld:hx(c0,c1,t),lit:l0+(l1-l0)*t};}}const L=SKY.at(-1);return{top:L[1],bot:L[2],bld:L[3],lit:L[4]};}
 // redesenha só o vidro da janela por cima da camada fixa, com o céu da hora atual
 function windowSky(g,x0,x1,frame,h){const a=AX+x0*16,b=AX+x1*16,top=AY-36,hh=22,S=skyAt(h);
  for(let i=0;i<hh;i++)F(g,a,top+i,b-a,1,mix(S.top,S.bot,i/hh));
  // sol ou lua
  if(h<17.5){const k=Math.max(0,Math.min(1,(h-7)/10)),sx=a+4+(b-a-10)*k,sy=top+14-Math.sin(k*Math.PI)*10;O(g,sx,sy,3,3,h<9||h>15.5?'#ffd38a':'#fff4c2');}else O(g,b-7,top+5,2,2,'#fff1d0');
  for(let x=a;x<b;){const w=4+((x*7)%6),bh=4+((x*13)%9);F(g,x,top+hh-bh,Math.min(w,b-x),bh,S.bld);for(let k=0;k<3;k++){const wx=x+1+((x+k*5)%Math.max(1,w-2)),wy=top+hh-bh+2+k*3;if(wy<top+hh-1&&((x+k)%3))F(g,wx,wy,1,1,S.lit>.5?'#ffd77a':'#c9dcf0');}x+=w+1;}
  F(g,(a+b)/2-1,top,2,hh,frame);F(g,a,top+hh/2-1,b-a,1,frame);if(S.lit<.3){F(g,a+2,top+2,6,1,'#ffffff');F(g,a+2,top+3,1,5,'#ffffff');}}
 // fim de expediente: nos dias úteis, perto das 18h a turma sai pela porta e volta logo depois (o dia vira e todos já estão de volta)
 function commute(s){const w=s.weekly;if(!w||w.stage!=='work'||w.effect?.weekend)return 0;const m=(w.minute||0)+Math.min(1,(w.elapsed||0)/.4);if(m>=52)return Math.min(1,(m-52)/7);if(m<6&&(w.days||0)>0)return Math.max(0,1-m/6);return 0;}
 const DOOR={x:.35,y:6.4},BEDSIDE={x:3.5,y:5.7};
 function render(c,s,t,v={}){
  if(typeof document==='undefined'||!document.createElement){markers(c,s,t,v);bubbles(c,s,t,v);return;}
  const isOffice=!!s.office;if(!LOWW)LOWW=mk(AW,AH);const g=LOWW[1];g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.clearRect(0,0,AW,AH);
  g.drawImage(staticLayer(isOffice),0,0);{const h=hourOf(s);if(isOffice)windowSky(g,.35,2.35,'#4b5263',h);else windowSky(g,.7,2.6,'#efe1c6',h);}
  screenPx(g,s,t,v);shelfPx(g,s);if(!isOffice)garlandPx(g,t,true);
  const a=(v.actors&&v.actors[0])||goal(s),sitting=!a.moving&&Math.hypot(a.x-DESK.x,a.y-DESK.y)<.05,typing=!!s.job||DESIGN.includes(s.phase)||RESEARCH.includes(s.phase)||s.phase==='selling',k=colors(s);
  const items=[{y:5.9,d:()=>crates(g,s)}];
  if(!isOffice)items.push({y:5.6,d:()=>catPx(g,t)});
  const cm=s.crew?0:commute(s);if(cm>0){const T=isOffice?DOOR:BEDSIDE,px=DESK.x+(T.x-DESK.x)*cm,py=DESK.y+(T.y-DESK.y)*cm,fr=cm<1?[1,0,2,0][Math.floor(t*8)%4]:0;items.push({y:2.1,d:()=>chairBack(g,DESK.x,DESK.y,'#4a4766')});if(cm<.97)items.push({y:py,d:()=>person(g,k,px,py,Math.abs(T.x-DESK.x)>Math.abs(T.y-DESK.y)?(T.x<DESK.x?'left':'right'):'down',fr,true)});else if(!isOffice)items.push({y:6,d:()=>{const [zx,zy]=A(1.4,5.2,1.2);const zz=Math.floor(t*2)%3;for(let i=0;i<=zz;i++){F(g,zx+i*4,zy-i*4,3,1,'#fffaf0');F(g,zx+i*4+2,zy-i*4+1,1,1,'#fffaf0');F(g,zx+i*4,zy-i*4+2,3,1,'#fffaf0');}}});}
  else if(sitting)items.push({y:2.1,d:()=>{const fr=typing?(Math.floor(t*10)%2?1:2):0;person(g,k,DESK.x,DESK.y,'up',fr,true,3);chairBack(g,DESK.x,DESK.y,'#4a4766');}});
  else{const dx=a.x-(a._px??a.x),dy=a.y-(a._py??a.y);a._px=a.x;a._py=a.y;if(Math.abs(dx)+Math.abs(dy)>.0005)a._dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
   const fr=a.moving?[1,0,2,0][Math.floor(t*8)%4]:s.crew?(Math.floor(t*4)%2?1:0):0;items.push({y:a.y,d:()=>{person(g,k,a.x,a.y,a.moving?(a._dir||'down'):(s.crew?'right':'down'),fr,true);}});items.push({y:2.1,d:()=>chairBack(g,DESK.x,DESK.y,'#4a4766')});}
  if(isOffice){const AREA={product:'#7b5cd6',marketing:'#ef8a3c',finance:'#2f9a6a'},HAIR=['#2b2b2b','#5a3b26','#d9a441','#a33b2b','#3b2a2a'],SKIN=['#edbd97','#d79a72','#b9805a','#f1c9a5'],staff=s.team?.staff||[];
   SEATS.forEach((seat,i)=>{const p=staff[i];items.push({y:seat.y,d:()=>{if(p){const h=[...String(p.name||'')].reduce((n,ch)=>n+ch.charCodeAt(0),0),kk={shirt:AREA[p.area]||'#7b5cd6',hair:HAIR[h%HAIR.length],skin:SKIN[h%SKIN.length],pants:'#3d4a6b'};
     const cmi=commute(s);if(cmi>0){const c2=Math.max(0,Math.min(1,cmi*1.15-i*.1)),px=seat.x+(DOOR.x-seat.x)*c2,py=seat.y+(DOOR.y-seat.y)*c2;if(c2<.97)person(g,kk,px,py,'left',[1,0,2,0][Math.floor(t*8+i)%4],false);}else person(g,kk,seat.x,seat.y,'up',Math.floor(t*9+i*3)%2?1:2,false,3);const [mx,my]=A(seat.x-.5,seat.y-1.35,.78);F(g,mx+1,my-12,14,9,i?'#3a2e1c':'#16384a');F(g,mx+2,my-11,10,1,i?'#ffcf8a':'#9fe3ff');F(g,mx+2,my-9,7,1,i?'#ffcf8a':'#9fe3ff');}
    chairBack(g,seat.x,seat.y,'#4a4766');}});});}
  items.sort((p,q)=>p.y-q.y).forEach(i=>i.d());
  lightsPx(g,s,t,v);
  c.save();c.imageSmoothingEnabled=false;c.clearRect(0,0,width,height);c.drawImage(LOWW[0],0,0,AW*K,AH*K);c.restore();
  markers(c,s,t,v);bubbles(c,s,t,v);}


 /* ---------- ícones de produto (usados pelos painéis) ---------- */
 // polígono fechado (usado pelo ícone do teclado)
 function poly(c,pts,fill,stroke,lw=1){c.beginPath();pts.forEach(([px,py],i)=>i?c.lineTo(px,py):c.moveTo(px,py));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
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
 function colors(s){const f=s.founder||{};return{shirt:hexOk(f.shirt)?f.shirt:'#e0a23a',hair:hexOk(f.hair)?f.hair:'#3b2a2a',skin:hexOk(f.skin)?f.skin:'#d79a72'};}
 const DESK={x:4.9,y:2.1},PACK={x:5.85,y:4.6};
 const DESIGN=['design','upgradeAttributes','upgradePlan','building','repairing','testReady','testOutcome','testing','upgradeWork','upgradeReady','upgradeOutcome','upgradeTesting'];
 const RESEARCH=['personaResearch','gadgetResearch'];
 const SELLING=['selling','opportunity','recap'];
 function goal(s){return s.crew?PACK:DESK;}
 function actors(s,v,dt){const g=goal(s);v.actors??=[{x:g.x,y:g.y}];const a=v.actors[0];if(!a||!isFinite(a.x)||!isFinite(a.y)||a.x>8||a.y>8){v.actors=[{x:g.x,y:g.y}];return;}
  const d=Math.hypot(g.x-a.x,g.y-a.y),step=Math.min(d,1.7*dt*(s.speed||1));if(d>.001){a.facing=(g.x-a.x)-(g.y-a.y)>=0?1:-1;a.x+=(g.x-a.x)/d*step;a.y+=(g.y-a.y)/d*step;}a.moving=d>.02;}
 function stockOf(s){const archived=(s.portfolio||[]).filter(p=>p&&p.stock>0);const by={};for(const kind of ['headphones','keyboard','mouse'])by[kind]=(s.productId===kind?s.stock||0:0)+archived.filter(p=>p.productId===kind).reduce((n,p)=>n+p.stock,0);return by;}

 /* ---------- marcadores e balões (nítidos, por cima da arte) ---------- */
 function pill(c,x,y,text,o={}){c.font=o.font||FONT;const w=(c.measureText&&c.measureText(text)?.width||text.length*7)+(o.pad??18),h=o.h||22;
  c.save();c.globalAlpha=o.alpha??1;c.shadowColor='rgba(0,0,0,.25)';c.shadowOffsetY=3;rrect(c,x-w/2,y-h/2,w,h,h/2);c.fillStyle=o.bg||'#fff7ea';c.fill();c.shadowColor='transparent';
  if(o.border){c.strokeStyle=o.border;c.lineWidth=1.5;c.stroke();}
  if(o.progress!=null){rrect(c,x-w/2+8,y+h/2-6,w-16,3,1.5);c.fillStyle='rgba(36,29,51,.15)';c.fill();rrect(c,x-w/2+8,y+h/2-6,(w-16)*Math.max(0,Math.min(1,o.progress)),3,1.5);c.fillStyle='#f2a93b';c.fill();}
  c.fillStyle=o.color||'#241d33';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y-(o.progress!=null?2:0)+.5);c.textAlign='left';c.textBaseline='alphabetic';c.restore();}
 const SPOTS={bench:{at:[4.8,.5,1.55],w:66,h:56,label:'COMPUTADOR',icon:'💻',tag:[4.8,.5,3.0]},products:{at:[7.35,.3,1.05],w:54,h:70,label:'PRODUTOS',icon:'🏆',tag:[7.35,.3,2.45]},cash:{at:[.36,4.26,.85],w:40,h:40,label:'FINANÇAS',icon:'🐷',tag:[.36,4.26,1.75]},clients:{at:[4.75,0,2.62],w:110,h:44,label:'CLIENTES',icon:'👥',tag:[4.75,0,3.6]}};
 const OFFICE_SPOTS={bench:SPOTS.bench,products:SPOTS.products,
  cash:{at:[.4,1.5,.32],w:44,h:46,label:'FINANÇAS',icon:'💰',tag:[.4,1.5,1.3]},
  history:{at:[3.3,0,2.45],w:66,h:54,label:'DESEMPENHO',icon:'📈',tag:[3.3,0,3.6]},
  nexus:{at:[6.3,0,2.5],w:54,h:42,label:'NEXUS',icon:'📱',tag:[6.3,0,3.55]},
  clients:{at:[4.9,0,2.62],w:70,h:48,label:'CLIENTES',icon:'👥',tag:[4.9,0,3.6]},
  stock:{at:[6.95,4.95,.45],w:84,h:72,label:'ESTOQUE',icon:'📦',tag:[6.95,4.95,1.6]},
  desk1:{at:[1.7,4.6,.9],w:84,h:84,label:'MESA 2',desk:0,tag:[1.7,4.3,2.6]},
  desk2:{at:[3.8,4.6,.9],w:84,h:84,label:'MESA 3',desk:1,tag:[3.8,4.3,2.6]}};
 function spotsFor(s){if(s.office)return OFFICE_SPOTS;if((s.stock||0)>0||s.crew)return {...SPOTS,stock:{at:[6.95,4.95,.45],w:84,h:72,label:'ESTOQUE',icon:'📦',tag:[6.95,4.95,1.6]}};return SPOTS;}
 function badge(c,x,y,icon,o={}){c.save();c.globalAlpha=o.alpha??.92;c.shadowColor='rgba(0,0,0,.28)';c.shadowOffsetY=2;circle(c,x,y,o.r||10,o.bg||'#ffffff');c.shadowColor='transparent';if(o.border)circle(c,x,y,o.r||10,null,o.border,1.6);
  c.font=(o.size||11)+'px "Segoe UI Emoji","Apple Color Emoji",sans-serif';c.fillStyle=o.color||'#241d33';c.textAlign='center';c.textBaseline='middle';c.fillText(icon,x,y+.5);c.textAlign='left';c.textBaseline='alphabetic';c.restore();}
 function markers(c,s,t,v={}){const list=spotsFor(s),hov=v.hover,staff=s.team?.staff||[],T=s.team||{};
  if(hov&&list[hov]){const o=list[hov],p=P(...o.at);c.save();c.globalCompositeOperation='screen';c.globalAlpha=.55;ellipse(c,p[0],p[1],o.w*.62,o.h*.62,grad(c,'r',[p[0],p[1],0,p[0],p[1],o.w*.62],[[0,'rgba(255,236,170,.75)'],[1,'rgba(255,236,170,0)']],'rgba(255,236,170,.3)'));c.restore();}
  for(const [key,sp] of Object.entries(list)){if(key==='bench'&&s.phase==='intro')continue;const p=P(...sp.tag),on=hov===key,bob=Math.sin(t*3+p[0])*2;
   if(sp.desk!=null){const person=staff[sp.desk],firstEmpty=staff.length;
    if(person){if(on)pill(c,p[0],p[1],person.name+' · '+'★'.repeat(person.level),{bg:'#fff',border:'#7b5cd6',font:'900 11px "Nunito","Segoe UI",sans-serif',h:24});}
    else if(sp.desk===firstEmpty&&T.candidates){pill(c,p[0],p[1]+bob,'📬 2 CANDIDATOS',{bg:'#f2a93b',border:'#a8661c',font:'900 11px "Nunito","Segoe UI",sans-serif',h:24});}
    else if(sp.desk===firstEmpty&&T.search){pill(c,p[0],p[1],'✉️ BUSCANDO…',{bg:'#fff',border:'#9aa3b5',font:'900 10px "Nunito","Segoe UI",sans-serif',h:22});}
    else{const r=on?15:13;c.save();c.shadowColor='rgba(0,0,0,.3)';c.shadowOffsetY=3;circle(c,p[0],p[1]+bob,r,'#7b5cd6');c.shadowColor='transparent';circle(c,p[0],p[1]+bob,r,null,'#ffffff',2.4);c.restore();
     stroke(c,[[p[0]-6,p[1]+bob],[p[0]+6,p[1]+bob]],'#fff',3.2);stroke(c,[[p[0],p[1]+bob-6],[p[0],p[1]+bob+6]],'#fff',3.2);if(on)pill(c,p[0],p[1]-28,'CONTRATAR',{bg:'#fff',border:'#7b5cd6',font:'900 11px "Nunito","Segoe UI",sans-serif',h:22});}
    continue;}
   if(on)pill(c,p[0],p[1]-2,sp.icon+' '+sp.label,{bg:'#ffffff',border:'#7b5cd6',font:'900 11px "Nunito","Segoe UI",sans-serif',h:24});
   else{const pul=(Math.sin(t*3.2+p[0]*.01)+1)/2;c.save();c.globalAlpha=.55*(1-pul);circle(c,p[0],p[1]+bob,17+pul*9,null,'#f2c230',3);c.restore();badge(c,p[0],p[1]+bob,sp.icon,{alpha:.97,r:17,size:19,border:'#2b2f3a'});}}
  if(s.phase==='intro'){const p=P(4.9,2.05,2.35),b=Math.sin(t*4)*3;pill(c,p[0],p[1]+b,'CLIQUE NO COMPUTADOR',{bg:'#f2a93b',border:'#a8661c'});}}
 function bubbles(c,s,t,v){
  const task=s.crew||s.job,research=RESEARCH.includes(s.phase);
  if(task){const rate=task===s.job?(s.weekly?.effect?.workRate||1):1,ratio=Math.max(0,Math.min(1,((task.elapsed||0)+(s.weekly?(s.weekly.elapsed||0)/.4*rate:0))/(task.duration||1)));const at=s.crew?P(6.6,4.6,1.6):P(4.9,2.05,2.75);
   const msg=research?'PESQUISA '+Math.floor(ratio*100)+'%':s.crew?'MONTAGEM '+Math.floor(ratio*(s.crew.quantity||0))+'/'+(s.crew.quantity||0):/ampaignWork/.test(s.phase||'')?'CAMPANHA '+Math.floor(ratio*100)+'%':'DESENVOLVENDO '+Math.floor(ratio*100)+'%';pill(c,at[0],at[1],msg,{progress:ratio,h:28});}
  if(s.phase==='selling'&&(s.stock||0)===0){const p=P(6.7,4.6,1.1);pill(c,p[0],p[1],'SEM ESTOQUE',{bg:'#e46d6d',color:'#fff',border:'#9c3b3b'});}
  if(s.phase==='opportunity'){const p=P(4.8,.4,2.05),b=Math.sin(t*5)*2;pill(c,p[0],p[1]+b,'💬 NOVA PROPOSTA',{bg:'#8fd4ff',border:'#3a7ea8'});}
  if((v.saleFlash||0)>0){const p=P(4.15,.6,1.85),k=1-v.saleFlash;pill(c,p[0],p[1]-k*44,'+ R$ '+Math.round(v.saleValue||0).toLocaleString('pt-BR'),{bg:'#4fbf8a',color:'#fff',border:'#2a7a54',alpha:Math.min(1,v.saleFlash*2.5),font:'900 13px "Segoe UI",system-ui,sans-serif'});}
  if((v.reviewFlash||0)>0){const n=Math.max(0,Math.min(5,Math.round(v.reviewStars||0))),p=P(4.2,1,2.25);pill(c,p[0],p[1]-(1-v.reviewFlash)*30,'★'.repeat(n)+'☆'.repeat(5-n),{color:'#c47d1f',alpha:Math.min(1,v.reviewFlash*2.5),font:'900 13px "Segoe UI",system-ui,sans-serif'});}
 }

 /* ---------- clique ---------- */
 function hit(s,x,y){let best=null,score=1e9;for(const [key,sp] of Object.entries(spotsFor(s))){if(key==='bench'&&s.phase==='intro'&&false)continue;const p=P(...sp.at),dx=Math.abs(x-p[0])/(sp.w/2),dy=Math.abs(y-p[1])/(sp.h/2);if(dx<=1&&dy<=1&&dx+dy<score){best=key;score=dx+dy;}}return best;}
 return {width,height,render,actors,headphones:gadget,project:P,hit,spots:SPOTS};
})();
if(typeof module!=='undefined')module.exports=PilotWorld;
