/* Persistent canvas world. Character destinations and poses come from actual work states. */
const PilotWorld=(()=>{
 const width=1200,height=570;
 function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
 function poly(c,points,color,edge){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=color;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=2;c.stroke();}}
 function line(c,x,y,x2,y2,color,w=2){c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=w;c.stroke();}
 function oval(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
 function text(c,t,x,y,color='#7d6957',size=11,align='left'){c.fillStyle=color;c.font='bold '+size+'px Consolas,monospace';c.textAlign=align;c.fillText(String(t),x,y);c.textAlign='left';}
 function headphones(c,x,y,scale,features=[],color='#e29b70',shine=false){c.save();c.translate(x,y);c.scale(scale,scale);oval(c,0,19,25,6,'#70594b25');c.lineWidth=7;c.strokeStyle='#715f68';c.beginPath();c.arc(0,0,20,Math.PI,Math.PI*2);c.stroke();c.lineWidth=3;c.strokeStyle=color;c.beginPath();c.arc(0,0,20,Math.PI,Math.PI*2);c.stroke();rect(c,-26,-4,12,26,'#6a5a62');rect(c,14,-4,12,26,'#6a5a62');rect(c,-24,-3,9,23,color);rect(c,15,-3,9,23,color);if(features.includes('comfort')){rect(c,-17,0,6,19,'#f4dfb1');rect(c,11,0,6,19,'#f4dfb1');}if(features.includes('mic')){line(c,21,17,13,27,'#6a5963',4);rect(c,5,25,12,5,'#7c6d78');}if(features.includes('battery')){rect(c,18,1,3,9,'#b9e29b');rect(c,-22,0,3,5,'#fae1a0');}if(features.includes('water')){poly(c,[[-21,8],[-24,14],[-18,14]],'#bce4e7');}if(shine){text(c,'✦',-37,-21,'#e3b663',15);text(c,'✦',31,1,'#f6d98a',11);}c.restore();}
 function person(c,x,y,shirt,hair,skin,t,pose='idle',face='normal'){
  c.save();c.translate(Math.round(x),Math.round(y));c.scale(1.55,1.55);oval(c,0,4,15,6,'#73574825');const walk=pose==='walk',work=pose==='work',b=walk?Math.sin(t*13)*2:Math.sin(t*2)*.5,leg=walk?Math.sin(t*13)*4:0;
  rect(c,-9,-10,7,13+leg,'#5b6075');rect(c,3,-10,7,13-leg,'#5b6075');rect(c,-11,1+leg,10,4,'#76646a');rect(c,2,1-leg,11,4,'#76646a');rect(c,-12,-29,25,23,'#655862');rect(c,-11,-28,23,20,shirt);rect(c,-7,-26,15,4,'#ffffff25');rect(c,-16,-24-(work?Math.sin(t*12)*5:0),5,15,skin);rect(c,12,-24+(work?Math.sin(t*12)*5:0),5,15,skin);
  const fy=-48+b;rect(c,-13,fy,26,23,'#66505b');rect(c,-12,fy+1,24,22,skin);rect(c,-14,fy-3,28,8,hair);rect(c,-14,fy+3,5,11,hair);rect(c,10,fy+3,4,7,hair);rect(c,-14,fy+11,3,7,skin);rect(c,12,fy+11,3,7,skin);
  const blink=Math.floor(t*2)%13===0;rect(c,-7,fy+11,3,blink?1:3,'#574650');rect(c,5,fy+11,3,blink?1:3,'#574650');rect(c,-11,fy+16,4,2,'#de9b8e');rect(c,8,fy+16,4,2,'#de9b8e');
  if(face==='happy'){rect(c,-3,fy+17,6,3,'#ac716f');rect(c,-2,fy+17,4,1,'#ffead1');}else if(face==='worry'){rect(c,-2,fy+18,5,1,'#ac716f');line(c,-8,fy+8,-4,fy+9,'#71505a',1);}else rect(c,-1,fy+18,3,1,'#b87f74');
  if(work){rect(c,15,-16+Math.sin(t*12)*5,4,12,'#bc9b70');rect(c,12,-17+Math.sin(t*12)*5,11,5,'#9eaeb0');}if(pose==='cheer'){rect(c,-18,-39,6,17,skin);rect(c,13,-40,6,17,skin);text(c,'✦',19,-48,'#e6b85e',12);}c.restore();
 }
 function desk(c,x,y,color='#e7b282'){rect(c,x-53,y+6,8,47,'#aa7c70');rect(c,x+47,y-2,8,47,'#97756e');poly(c,[[x-70,y],[x+4,y-34],[x+80,y],[x+4,y+35]],'#ac7b70');poly(c,[[x-70,y-7],[x+4,y-41],[x+80,y-7],[x+4,y+28]],color,'#c08b74');line(c,x-63,y-6,x+4,y+22,'#f8d1a0',3);}
 function plant(c,x,y,t){poly(c,[[x-13,y],[x+13,y],[x+9,y+24],[x-8,y+24]],'#d8a290');rect(c,x-15,y-2,30,7,'#edbfa0');line(c,x,y-39,x,y,'#6f9d7b',3);for(let i=0;i<5;i++){const dx=Math.sin(i*2)*17,dy=-19-i*6;oval(c,x+dx,y+dy+Math.sin(t+i),9,5,i%2?'#a1c88b':'#80b096');}}
 function targets(s){if(['building','repairing','testReady','testOutcome','testing'].includes(s.phase))return [{x:495,y:370},{x:595,y:300}];if(['campaign','campaignWork','campaignReady','campaignOutcome','campaignRolling'].includes(s.phase))return [{x:771,y:350},{x:870,y:340}];if(['launching','selling','opportunity','recap'].includes(s.phase))return [{x:730,y:438},{x:878,y:430}];if(s.phase==='design')return [{x:475,y:366},{x:592,y:310}];return [{x:335,y:423},{x:575,y:360}];}
 function actors(s,v,dt){const goal=targets(s);if(s.crew)goal[1]={x:595,y:300};v.actors??=goal.map(p=>({...p}));v.actors.forEach((p,i)=>{const dx=goal[i].x-p.x,dy=goal[i].y-p.y,d=Math.hypot(dx,dy),speed=190*dt*s.speed,ratio=d?Math.min(1,speed/d):0;p.x+=dx*ratio;p.y+=dy*ratio;p.moving=d>3;});}
 function render(c,s,t,v={}){
  c.clearRect(0,0,width,height);c.imageSmoothingEnabled=false;const phase=s.phase,working=['building','repairing'].includes(phase),filming=['campaignWork','campaignRolling'].includes(phase),packing=phase==='launching',selling=['selling','opportunity','recap'].includes(phase),celebrate=phase==='recap'&&s.summary?.profit>=0;
  // A sunny neighbourhood: small moving clouds, street and growing plants.
  for(let i=0;i<5;i++){let x=(i*291+t*5)%1500-140;oval(c,x,95+i%2*60,55,12,'#fff7dc60');oval(c,x+22,87+i%2*60,30,15,'#fff7dc60');}
  poly(c,[[100,409],[645,165],[1150,397],[610,566]],'#adc4a43b');poly(c,[[195,334],[640,137],[1083,332],[635,541]],'#a5a995');poly(c,[[195,322],[640,125],[1083,320],[635,529]],'#ca9e83');poly(c,[[210,320],[640,130],[1066,320],[635,515]],'#f0d3a0');
  for(let i=0;i<11;i++)line(c,222+i*39,326-i*17,640+i*38,506-i*17,'#d8b88d',1);
  poly(c,[[210,320],[210,170],[640,-20],[640,130]],'#a5c9bd');poly(c,[[640,-20],[1066,170],[1066,320],[640,130]],'#e7bda5');line(c,210,170,640,-20,'#d4dfbd',6);line(c,640,-20,1066,170,'#f7d7ad',6);line(c,210,320,640,130,'#89ad9d',7);line(c,640,130,1066,320,'#c7988c',7);
  // Window, trees, shelves and the company's sign.
  poly(c,[[278,172],[426,107],[426,218],[278,283]],'#8fae9e');poly(c,[[286,177],[418,119],[418,214],[286,272]],'#d7ece5');poly(c,[[286,235],[418,177],[418,214],[286,272]],'#acd1bc');for(let i=0;i<5;i++){oval(c,300+i*24,222-i*11,15,22,'#a8c79e');rect(c,299+i*24,228-i*11,3,18,'#b5af82');}line(c,350,147,350,244,'#f9edcd',5);line(c,284,224,420,164,'#f9edcd',5);poly(c,[[271,285],[429,215],[441,222],[282,293]],'#f6e5bb');
  poly(c,[[730,83],[892,155],[892,192],[730,120]],'#bc9380');poly(c,[[735,88],[887,156],[887,185],[735,117]],'#fff0c7');text(c,s.company.toUpperCase().slice(0,18),755,130,'#9a8265',16);
  poly(c,[[919,216],[1025,262],[1025,312],[919,266]],'#a58a82');for(let i=0;i<4;i++)rect(c,933+i*21,238+i*9,11,22,['#b3c9a3','#e2bb84','#c4b3cd','#a8c9c5'][i]);
  poly(c,[[441,374],[633,290],[822,375],[632,461]],'#8eb6aa');poly(c,[[456,374],[633,297],[805,375],[632,453]],'#b2d3bd');
  // Bench: real build progress assembles the product.
  desk(c,526,313);poly(c,[[491,304],[526,289],[560,303],[526,320]],'#d3e2ce');rect(c,480,279,17,19,'#eed7ad');rect(c,483,282,11,3,'#9cae94');rect(c,578,301,5,14,'#d19b83');rect(c,578,295,6,7,'#8aacc1');
  const hasProduct=!['intro','customer'].includes(phase),progress=working?s.job?.elapsed/s.job?.duration:1;
  if(['design','building','repairing','testReady','testOutcome','testing'].includes(phase)){if(working&&progress<.6){rect(c,510,291,17,8,'#7d7083');rect(c,538,302,15,9,'#d7aa85');line(c,519,289,536,282,'#8b7a83',4);if(progress>.3)rect(c,523,280,12,5,'#b3c793');}else headphones(c,530,287,.85,s.features,'#e4a079',s.polish||s.quality>=2);}
  if(working){for(let i=0;i<3;i++){const q=(t*2+i*.33)%1;text(c,i===1?'✦':'·',510+i*15,275-q*24,'#edce78',13);}rect(c,492,340,80,8,'#b68e74');rect(c,493,341,78*progress,6,'#b8d38e');}
  // Film corner: tripod, sample and lights move while the campaign is made.
  desk(c,818,302,'#e9c595');line(c,875,252,862,319,'#887a87',4);line(c,875,252,893,320,'#887a87',4);rect(c,856,239,37,24,'#796b82');rect(c,860,243,26,16,'#b3d5ca');rect(c,886,245,6,10,'#e7bc81');if(filming&&Math.floor(t*6)%2)rect(c,857,240,5,4,'#f2a58b');if(['campaign','campaignWork','campaignReady','campaignOutcome','campaignRolling'].includes(phase)&&!v.actors?.[0]?.moving)headphones(c,814,272,.65,s.features,'#ddad80',s.polish);
  rect(c,751,258,21,13,'#f5e2b6');rect(c,754,260,15,3,'#b1bfa0');if(filming){text(c,s.campaignId==='offer'?'%':s.campaignId==='creator'?'★':'▶',820,216+Math.sin(t*3)*3,'#dfa86e',26);text(c,'✦',859,221,'#f1cd7a',16);}
  // Shop front and packing station become active only at launch.
  desk(c,730,416,'#e8c490');if((selling||packing)&&!v.actors?.[0]?.moving){headphones(c,731,388,1.05,s.features,'#dfa174',s.polish||s.quality>=2);poly(c,[[687,442],[750,442],[750,464],[687,464]],'#fff0c8','#c5a17a');text(c,'R$ '+FirstLoop.netPrice(s),719,457,'#7c8f67',12,'center');}
  desk(c,887,395);for(let i=0;i<Math.min(18,Math.ceil((s.operations?s.stock:s.sold)/2));i++){let x=866+(i%3)*19,y=384-Math.floor(i/3)*15;rect(c,x,y,18,16,'#cba374');rect(c,x+1,y+1,16,4,'#e5c18c');rect(c,x+7,y+1,3,15,'#f6e6b5');}
  if(s.operations){text(c,'ESTOQUE '+s.stock,850,435,'#735f66',14);if(s.stock===0&&phase==='selling')text(c,'SEM ESTOQUE',825,360,'#b75f64',16);if(s.crew){text(c,s.crew.type==='produce'?'MONTANDO '+s.crew.quantity:'PRÓXIMO PROJETO',485,250,'#85734f',12);rect(c,485,256,110,7,'#ae9383');rect(c,485,256,110*s.crew.elapsed/s.crew.duration,7,'#8caf80');}const old=(s.portfolio||[]).filter(p=>p.stock>0);old.slice(-3).forEach((p,i)=>{headphones(c,944+i*25,277+i*11,.4,p.features,'#99b9a0');text(c,p.stock,944+i*25,300+i*11,'#745b64',10);});}if(packing)for(let i=0;i<3;i++)text(c,'□',865+i*18,370+Math.sin(t*4+i)*3,'#ceaa72',22);
  // The physical shelf remembers actual completed products.
  if(s.history.length){poly(c,[[436,94],[572,34],[572,76],[436,136]],'#c69976');s.history.slice(-4).forEach((p,i)=>{headphones(c,454+i*30,112-i*13,.38,p.features,['#d89678','#9fbfac','#b3a1c5','#dfc17e'][i],p.profit>0);});text(c,'SUAS CRIAÇÕES',463,137,'#b28b74',9);}
  plant(c,246,343,t);plant(c,1026,340,t+1);plant(c,610,175,t+2);
  // A worker's position and gesture correspond to the current job.
  const goal=targets(s);v.actors??=goal.map(p=>({...p}));const fp=v.actors[0],hp=v.actors[1],mood=celebrate?'happy':phase==='testOutcome'&&s.quality===0?'worry':'normal';
  person(c,hp.x,hp.y,'#83b7ad','#775e4a','#deb18c',t+1,hp.moving?'walk':working||packing||s.crew?'work':celebrate?'cheer':'idle',mood);
  person(c,fp.x,fp.y,s.founder.shirt||'#ed9564',s.founder.hair||'#674457',s.founder.skin||'#f2bd8b',t,fp.moving?'walk':working?'work':celebrate?'cheer':filming?'work':'idle',mood);
  if(fp.moving&&['campaign','campaignWork','launching'].includes(phase))headphones(c,fp.x+18,fp.y-28,.42,s.features,'#e4a079',false);
  text(c,s.founder.name||'Alex',fp.x,fp.y+22,'#917a64',10,'center');text(c,'Nina · produção',hp.x,hp.y+22,'#917a64',9,'center');
  // Audience members wait by the garage; they become the people you design for.
  if(['intro','customer','design'].includes(phase)){FirstLoop.clients.forEach((p,i)=>{const x=120+i*83,y=420+i%2*20;person(c,x,y,p.color,p.hair,'#ebba95',t+i,'idle',s.clientId===p.id?'happy':'normal');text(c,p.name,x,y+24,'#89755f',11,'center');if(phase==='customer')text(c,'?',x,y-92+Math.sin(t*3+i)*3,'#d9ae62',20,'center');if(s.clientId===p.id)oval(c,x,y+34,5,3,'#94b884');});}
  // Actual visitors advance with sales processing. No random decorative transactions.
  if(phase==='selling'&&s.sales&&s.sales.seen<s.leads){const u=clamp(s.sales.elapsed/.85,0,1),x=1030-(1030-788)*Math.min(1,u*2),y=458-Math.sin(u*Math.PI)*10,p=FirstLoop.client(s);person(c,x,y,[p.color,'#88b8a4','#c79595'][s.sales.seen%3],[p.hair,'#5e4852','#af835a'][s.sales.seen%3],'#e8b793',t,'walk',u>.7?'happy':'normal');text(c,(s.sales.seen+1)+' / '+s.leads,x,y+23,'#a18a68',9,'center');}
  if(phase==='opportunity'){person(c,974,445,'#af96bf','#60506a','#eac09a',t,'idle','happy');text(c,'4 fones?',974,351+Math.sin(t*3)*2,'#a58a6c',14,'center');}
  if(v.saleFlash>0){const u=1-v.saleFlash;text(c,'+'+(v.saleValue||0).toFixed(0),882,324-u*45,'#63936d',20,'center');text(c,'✓',740,340-u*25,'#99b77e',24,'center');}
  if(celebrate){text(c,'✦',fp.x-37,fp.y-98,'#e4bf68',21);text(c,'✦',hp.x+35,hp.y-75,'#a8c28c',15);}
 }
 function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
 return {width,height,render,actors,headphones,person};
})();
if(typeof module!=='undefined')module.exports=PilotWorld;
