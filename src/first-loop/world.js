/* Reusable pixel workshop: one orthographic projection, one 320×200 grid.
   Rendering only reads gameplay state. */
const PilotWorld=(()=>{
 const width=320,height=200,ink='#28343d',P=(x,y,z=0)=>[Math.round(147+(x-y)*13),Math.round(61+(x+y)*5.7-z)];
 const R=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w*2)/2,Math.round(h*2)/2);};
 function poly(c,pts,color,edge=ink){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(Math.round(p[0]*2)/2,Math.round(p[1]*2)/2):c.moveTo(Math.round(p[0]*2)/2,Math.round(p[1]*2)/2));c.closePath();c.fillStyle=color;c.fill();if(edge){c.lineWidth=1;c.strokeStyle=edge;c.stroke();}}
 function line(c,a,b,color=ink){c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.moveTo(Math.round(a[0]*2)/2,Math.round(a[1]*2)/2);c.lineTo(Math.round(b[0]*2)/2,Math.round(b[1]*2)/2);c.stroke();}
 function box(c,x,y,z,w,d,h,top='#cf9b62',left='#aa774c',right='#bd8756',edge=ink){poly(c,[P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)],left,edge);poly(c,[P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)],right,edge);poly(c,[P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)],top,edge);}
 function label(c,s,x,y,color='#f9e9c7',size=4,align='left'){c.fillStyle=color;c.font='bold '+size+'px monospace';c.textAlign=align;c.fillText(String(s),Math.round(x),Math.round(y));c.textAlign='left';}
 function room(c){
  poly(c,[P(0,0,-3),P(12,0,-3),P(12,10,-3),P(0,10,-3)],'#9b8f7c','#93836f');
  for(let x=0;x<12;x++)for(let y=0;y<10;y++){poly(c,[P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)],(x+y)%2?'#e5d3b3':'#eedfc4','#c7b99f');const [a,b]=P(x+.3,y+.35);R(c,a,b,1,1,'#b4a997');const [d,e]=P(x+.65,y+.8);R(c,d,e,1,1,'#c7bba6');}
  poly(c,[P(0,0),P(0,10),P(0,10,52),P(0,0,52)],'#e4c4a0','#b18466');poly(c,[P(0,0),P(12,0),P(12,0,52),P(0,0,52)],'#f2d9b3','#b18466');
  poly(c,[P(0,0),P(0,10),P(0,10,22),P(0,0,22)],'#6f8c70','#617b64');poly(c,[P(0,0),P(12,0),P(12,0,22),P(0,0,22)],'#829979','#617b64');line(c,P(0,10,52),P(0,0,52),'#c78f65');line(c,P(0,0,52),P(12,0,52),'#c78f65');
  for(const start of [3.6,8.4]){poly(c,[P(start,0,45),P(start+2.4,0,45),P(start+2.4,0,30),P(start,0,30)],'#a3c5c8');for(let i=1;i<4;i++)line(c,P(start+i*.6,0,45),P(start+i*.6,0,30));for(const z of [35,40])line(c,P(start,0,z),P(start+2.4,0,z));}
  const [cx,cy]=P(7.1,0,40);c.beginPath();c.arc(cx,cy,6,0,Math.PI*2);c.fillStyle='#f8e8c4';c.fill();c.strokeStyle=ink;c.lineWidth=1;c.stroke();line(c,[cx,cy],[cx-3,cy-2]);line(c,[cx,cy],[cx+2,cy-3]);
  poly(c,[P(0,3.5,37),P(0,6.7,37),P(0,6.7,16),P(0,3.5,16)],'#c58f58','#876849');for(let n=0;n<11;n++)for(let z=20;z<=34;z+=4){const p=P(0,3.7+n*.25,z);R(c,p[0],p[1],1,1,'#936f4e');}
  for(let n=0;n<6;n++){const a=P(0,3.9+n*.43,31-n%2*3),b=P(0,3.9+n*.43,21-n%2*3);line(c,a,b);R(c,b[0]-1,b[1]-4,3,5,n%2?'#cf7650':'#9daaad');}
  poly(c,[P(10.9,0,32),P(12,0,32),P(12,0),P(10.9,0)],'#273947');poly(c,[P(11.1,.03,29),P(11.85,.03,29),P(11.85,.03),P(11.1,.03)],'#a1b2a1');poly(c,[P(10.8,0,34),P(12.05,0,34),P(12.05,0,30),P(10.8,0,30)],'#75838a');
 }
 function gadget(c,x,y,kind='headphones',color='#c78451',scale=1){
  c.save();c.translate(x,y);c.scale(scale,scale);
  if(kind==='headphones'){
   poly(c,[[-9,1],[-9,-5],[-7,-9],[-4,-11],[4,-11],[7,-9],[9,-5],[9,1],[6,1],[6,-4],[4,-7],[2,-8],[-2,-8],[-4,-7],[-6,-4],[-6,1]],color);
   line(c,[-7,-6],[-4,-9],'#f2d09e');line(c,[-4,-9],[4,-9],'#f2d09e');
   for(const side of [-1,1]){
    const a=side*7;
    poly(c,[[a-3,-1],[a-1,-3],[a+2,-3],[a+4,-1],[a+4,5],[a+2,7],[a-1,7],[a-3,5]],color);
    R(c,a-1,-1,3,6,'#e5ba87');R(c,a+1,0,1,4,'#fff0cd');R(c,a-2,1,1,4,'#394650');
   }
  }else if(kind==='keyboard'){
   poly(c,[[-11,-3],[5,-6],[11,1],[-6,6]],'#6c8794');
   poly(c,[[-10,-3],[5,-5],[10,0],[-6,4]],'#bac8c4');
   for(let row=0;row<3;row++)for(let i=0;i<7;i++)R(c,-8+i*2+row,row*1.5-2-i*.24,1.3,1,ink);
   line(c,[-4,3],[2,2],'#ecdfbd');
  }else if(kind==='mouse'){
   poly(c,[[-5,0],[-5,-4],[-3,-7],[2,-8],[5,-5],[5,1],[3,5],[-2,5]],'#a7babb');
   line(c,[0,-7],[0,-2]);R(c,-.5,-5,1.5,2,color);line(c,[-3,0],[3,0],'#617885');
  }else{
   poly(c,[[-8,-6],[-5,-9],[8,-9],[8,5],[-8,5]],'#536e7b');
   R(c,-7,-5,14,9,'#8299a0');
   for(const a of [-4,3]){R(c,a-2,-4,5,7,ink);R(c,a-1,-3,3,5,'#b6c7c0');R(c,a,-2,1,3,'#546e79');}
  }
  c.restore();
 }
 function person(c,x,y,shirt='#bc784b',hair='#4c3830',skin='#e2ad7d',t=0,pose='idle',face='normal',nina=false){x=Math.round(x);y=Math.round(y);const work=pose==='work',walk=pose==='walk',step=walk?Math.round(Math.sin(t*13)):0;
  R(c,x-4,y-1,9,2,'#91836d');R(c,x-3,y-5,2,5+step,'#304c5d');R(c,x+1,y-5,2,5-step,'#304c5d');R(c,x-4,y,4,1,ink);R(c,x+1,y,4,1,ink);R(c,x-5,y-13,10,8,ink);R(c,x-4,y-12,8,7,nina?'#e8d7b2':shirt);if(nina){R(c,x-2,y-11,4,6,'#365669');R(c,x-3,y-12,1,3,'#365669');R(c,x+2,y-12,1,3,'#365669');}
  const hand=work?Math.round(Math.sin(t*12)):step;R(c,x-6,y-11+hand,2,6,skin);R(c,x+5,y-11-hand,2,6,skin);R(c,x-5,y-22,10,10,ink);R(c,x-4,y-21,8,9,skin);R(c,x-5,y-23,10,4,hair);R(c,x-6,y-21,2,5,hair);R(c,x+4,y-21,2,4,hair);R(c,x-4,y-22,8,1,'#72503c');if(nina){R(c,x+5,y-22,4,5,hair);R(c,x+7,y-20,3,3,hair);R(c,x+5,y-20,1,1,'#d5a45d');}
  if(Math.floor(t*2)%17!==0){R(c,x-3,y-17,1,2,ink);R(c,x+2,y-17,1,2,ink);}R(c,x-4,y-15,1.5,1,'#cb926e');R(c,x+3,y-15,1.5,1,'#cb926e');R(c,x-4,y-21,4,1,'#896048');R(c,x-3,y-9,2,1,'#d8be8d');R(c,x,y-14,2,1,face==='happy'?'#a85b42':'#ad7955');if(work){R(c,x+5,y-7-hand,1,5,'#bd8f4b');R(c,x+4,y-8-hand,3,1,'#788d96');}}
 function desk(c,x,y,w=2.6,d=1.25,bench=false){for(const [a,b]of [[x+.1,y+.1],[x+w-.2,y+.1],[x+.1,y+d-.2],[x+w-.2,y+d-.2]])box(c,a,b,0,.15,.15,12,'#99a5a4','#47575c','#5b6c70');box(c,x,y,11,w,d,2,'#cc995d','#96633e','#b4804d');line(c,P(x+.15,y+d,12),P(x+w-.1,y+d,12),'#e5b67e');line(c,P(x+.3,y+.25,13),P(x+w-.2,y+.25,13),'#b67f4f');line(c,P(x+.15,y+d-.22,13),P(x+w-.15,y+d-.22,13),'#e4b77f');if(bench){box(c,x+.4,y+.3,13,1.3,.65,.3,'#527e69','#355c50','#355c50');const [a,b]=P(x+.25,y+.18,15);line(c,[a,b],[a,b-10]);line(c,[a,b-10],[a+7,b-14]);poly(c,[[a+5,b-14],[a+10,b-14],[a+12,b-10],[a+5,b-10]],'#576b6e');box(c,x+2.2,y+.4,13,.45,.45,5,'#9da8a4','#65787d','#788a8d');}}
 function carton(c,x,y,z=0,w=.65,d=.6,h=5){box(c,x,y,z,w,d,h,'#d6b078','#a87a47','#bd935e');line(c,P(x+w*.5,y,z+h),P(x+w*.5,y+d,z+h),'#eed2a2');line(c,P(x+w*.5,y+d,z+h),P(x+w*.5,y+d,z),'#e0bb80');}
 function shelf(c,x,y,kind,stock){for(const z of [2,13,25]){box(c,x,y,z,2.15,.8,1,'#ab8353','#80633e','#8e6d44');if(z===2)for(let n=0;n<Math.min(3,Math.ceil(stock/20));n++)carton(c,x+.15+n*.65,y+.1,z+1,.55,.6,6);if(z===13)for(let n=0;n<Math.min(3,Math.ceil(stock/10));n++){const [a,b]=P(x+.4+n*.65,y+.4,z+2);gadget(c,a,b,kind,'#c98b59',.65);}if(z===25)for(let n=0;n<2;n++)carton(c,x+.15+n,y+.08,z+1,.85,.65,5);}for(const [a,b]of [[x,y],[x+2.15,y],[x,y+.8],[x+2.15,y+.8]])box(c,a,b,0,.1,.1,31,'#9aa7a7','#435761','#637983');}
 function plant(c,x,y){box(c,x,y,0,.5,.5,5,'#e5d3ae','#ad956f','#c0ab84');const [a,b]=P(x+.25,y+.25,5);line(c,[a,b],[a,b-11],'#3f6949');for(let n=0;n<3;n++){R(c,a-4+n,b-9+n*2,3,2,'#668650');R(c,a+1,b-11+n*3,4,2,'#7b9a59');R(c,a-5+n,b-12+n*3,3,3,'#668b51');R(c,a+2,b-13+n*3,3,3,'#92a665');}}
 function localProgress(c,x,y,text,value){const w=55;R(c,x-w/2,y-8,w,13,ink);R(c,x-w/2+1,y-7,w-2,11,'#fff0cd');label(c,text,x,y-3,ink,4,'center');R(c,x-w/2+3,y,w-6,3,'#b2aa91');R(c,x-w/2+3,y,Math.round((w-6)*Math.max(0,Math.min(1,value))),3,'#e69a38');}
 function targets(s){const research=['personaResearch','gadgetResearch'].includes(s.phase),selling=['selling','opportunity','recap'].includes(s.phase);return [P(selling?9.9:6.6,selling?3.5:7.6),P(2.8,5.65)];}
 function actors(s,v,dt){const goal=targets(s);v.actors??=goal.map(([x,y])=>({x,y}));if(v.actors.some(p=>p.x>width||p.y>height))v.actors=goal.map(([x,y])=>({x,y}));v.actors.forEach((p,i)=>{const key=goal[i].join(',');if(p.goal!==key){const selling=['selling','opportunity','recap'].includes(s.phase);p.path=i===0&&p.goal?(selling?[P(8.5,7.2),P(8.5,3.3),goal[i]]:[P(8.5,3.3),P(8.5,7.2),goal[i]]):[goal[i]];p.goal=key;}const [x,y]=p.path?.[0]||goal[i],d=Math.hypot(x-p.x,y-p.y),ratio=d?Math.min(1,36*dt*s.speed/d):0;p.x+=(x-p.x)*ratio;p.y+=(y-p.y)*ratio;p.moving=d>1;if(d<=1&&p.path?.length>1)p.path.shift();});}

 function render(c,s,t,v={}){c.imageSmoothingEnabled=false;c.clearRect(0,0,width,height);room(c);const [fx,fy]=P(10.6,0,39);R(c,fx+4,fy+1,3,8,'#546979');c.beginPath();c.arc(fx,fy,6,0,Math.PI*2);c.fillStyle='#76898d';c.fill();c.strokeStyle=ink;c.lineWidth=1;c.stroke();for(let i=0;i<3;i++){const a=t*4+i*Math.PI*2/3;line(c,[fx,fy],[fx+Math.cos(a)*5,fy+Math.sin(a)*5],'#c3c8b8');}
  const design=['design','upgradeAttributes','upgradePlan','building','repairing','testReady','testOutcome','testing','upgradeWork','upgradeReady','upgradeOutcome','upgradeTesting'].includes(s.phase),research=['personaResearch','gadgetResearch'].includes(s.phase),working=!!s.job||!!s.crew,selling=['selling','opportunity','recap'].includes(s.phase),objects=[],add=(depth,draw)=>objects.push({depth,draw}),archived=(s.portfolio||[]).filter(p=>p.stock>0);
  ['headphones','keyboard','mouse'].forEach((kind,i)=>{const stock=(s.productId===kind?s.stock:0)+archived.filter(p=>p.productId===kind).reduce((n,p)=>n+p.stock,0);add(4.5+i*2.5,()=>shelf(c,3+i*2.5,.5,kind,stock));});add(8.2,()=>plant(c,.8,7.8));
  add(9.4,()=>{const [x,y]=P(2.8,5.65);person(c,x,y,'#ded4ad','#48362e','#e2ae80',t,working&&!research?'work':'idle','normal',true);});
  add(10.4,()=>{desk(c,1.3,6.5,3.2,1.25,true);const [a,b]=P(2.6,7,16);gadget(c,a,b,s.productId||'headphones',s.attributes.quality>=2?'#d3a259':'#6695a2');const [x,y]=P(1.65,7.5,14);R(c,x,y,4,2,'#bdd1b6');line(c,[x+6,y],[x+10,y-3],'#c19454');});
  const goal=targets(s);v.actors??=goal.map(([x,y])=>({x,y}));const founder=v.actors[0],nina=v.actors[1];
  add(selling?12.4:14,()=>{person(c,founder.x,founder.y,s.founder.shirt||'#d49a52',s.founder.hair||'#4b362f',s.founder.skin||'#e6b081',t,founder.moving?'walk':selling?'idle':'work');});
  add(14.9,()=>{const [a,b]=P(6.8,9.7);R(c,a-4,b-6,8,3,'#455d69');R(c,a-3,b-12,7,5,'#71868a');R(c,a-3,b-13,7,1,ink);line(c,[a,b-3],[a,b+2]);line(c,[a-5,b+3],[a+5,b+3]);R(c,a-5,b+3,2,1,ink);R(c,a+4,b+3,2,1,ink);});add(15.3,()=>{desk(c,6,8,2.6,1.15);const [a,b]=P(7,8.4,15);R(c,a-5,b-7,12,8,ink);R(c,a-4,b-6,10,6,'#668493');poly(c,[[a-5,b+1],[a+6,b+1],[a+8,b+4],[a-7,b+4]],'#a1acaa');const [cx,cy]=P(6.3,8.6,14);R(c,cx,cy-4,3,4,'#f3e2bd');line(c,[cx+3,cy-3],[cx+4,cy-3]);box(c,7.9,8.5,13,.4,.45,2,'#657b95','#46576d','#546479');});
  add(12.5,()=>{box(c,9.1,3.9,0,2.3,1,13,'#cf9b64','#bc9865','#b38858');const [a,b]=P(9.5,4.3,15);R(c,a-4,b-5,8,5,'#71828a');R(c,a-3,b-4,6,3,'#b7c9b5');R(c,a-6,b,13,3,'#475b65');const [x,y]=P(10.8,4.3,16);if(s.stock>0||!s.sales)gadget(c,x,y,s.productId||'headphones','#d2a36b',.65);});
  add(14.8,()=>{const [a,b]=P(8.8,6.6);R(c,a-4,b-12,8,12,'#e5d8b8');R(c,a-3,b-18,6,7,'#a7ced0');R(c,a-4,b-13,8,2,'#668894');R(c,a-1,b-9,2,2,'#658997');R(c,a-1,b-5,2,1,ink);});
  if(s.phase==='selling'&&s.sales&&s.sales.seen<s.leads){const u=Math.max(0,Math.min(1,(s.sales.elapsed||0)/.85)),p=FirstLoop.client(s);for(let i=0;i<2;i++){const q=P(u<.65?11.85:11.85-(u-.65)/.35*1.3,u<.65?1+u/.65*4.5:5.5+i*.7);add(12.8+i,()=>person(c,q[0],q[1],i?'#e1b352':p?.color,p?.hair||'#453a35','#dfac7b',t+i,u<.85?'walk':'idle'));}}
  if(s.phase==='opportunity'){const [x,y]=P(11.1,5);add(16,()=>person(c,x,y,'#cd8b4e','#554236','#dfad80',t));}objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
  if(s.job||s.crew){const task=s.crew||s.job,p=research?P(6.6,7.2,36):P(2.9,6.1,37),ratio=Math.max(0,Math.min(1,task.elapsed/task.duration)),message=research?'PESQUISA '+Math.floor(ratio*100)+'%':s.crew?'MONTAGEM '+Math.floor(ratio*s.crew.quantity)+'/'+s.crew.quantity:'NA BANCADA '+Math.floor(ratio*100)+'%';localProgress(c,p[0],p[1],message,ratio);}
  if(design&&!working)poly(c,[P(1.25,6.45,13),P(4.55,6.45,13),P(4.55,7.8,13),P(1.25,7.8,13)],'#ffd35a20','#f2bd4b');
  if(v.saleFlash>0){const [x,y]=P(10.6,4.3,34+(1-v.saleFlash)*7);R(c,x-15,y-7,35,10,ink);R(c,x-14,y-6,33,8,'#edb747');label(c,'+ R$ '+Math.round(v.saleValue||0),x+2,y,ink,4,'center');}
  if(s.phase==='selling'&&s.stock===0){const [x,y]=P(10.7,4.3,30);localProgress(c,x,y,'SEM ESTOQUE',0);}if(v.reviewFlash>0){const [x,y]=P(9.8,4.1,40);R(c,x-13,y-7,27,10,'#fff0ca');label(c,(v.reviewStars||0)+'/5',x,y,ink,5,'center');}}
 function hit(s,x,y){return [['bench',P(2.8,7)],['products',P(7,.8)],['cash',P(7,8.6)],['clients',P(10.5,4.5)]].find(([,p])=>Math.abs(x-p[0])<22&&Math.abs(y-(p[1]-8))<16)?.[0]||null;}
 return {width,height,render,actors,headphones:gadget,person,project:P,hit};
})();
if(typeof module!=='undefined')module.exports=PilotWorld;
