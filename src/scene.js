// Pixel-art scene rendered at a fixed low resolution. All world interactions
// share coordinates with the drawing; DOM controls also provide keyboard access.
const scene={hover:-1,tick:0}, spots=[
 {x:235,y:221,r:43,label:'COMPUTADOR · PRODUTO',page:1},
 {x:354,y:178,r:35,label:'TELEFONE · MARKETING',page:2},
 {x:443,y:276,r:40,label:'EQUIPE · PESSOAS',page:3},
 {x:163,y:161,r:30,label:'CADERNO · FINANCEIRO',page:4},
 {x:367,y:109,r:32,label:'MURAL · APRENDIZADOS',page:5},
 {x:304,y:298,r:28,label:'CAFÉ · CONVERSAR',page:6}];
render=function(){
 const last=s.history.at(-1)||{profit:0};
 $('content').innerHTML=`<div class="world"><canvas id="office" width="640" height="400" aria-label="Escritório isométrico em pixel art. Use os botões abaixo para acessar os objetos pelo teclado."></canvas><div class="hud"><div class="hud-box hud-title"><small>THE FOUNDER / ${s.officeMode==='office'?'ESCRITÓRIO':'GARAGEM 01'}</small><b id="sceneCompany"></b></div><div class="hud-box"><small>CAIXA</small><b>${money(s.cash)}</b></div><div class="hud-box"><small>${s.catalogStarted?'VENDAS / COBRANÇAS':'CLIENTES'}</small><b>${s.catalogStarted?(last.productSales||[]).reduce((n,p)=>n+p.units,0):s.customers} ♙</b></div><div class="hud-box"><small>ÂNIMO</small><b>${s.motivation}% ♥</b></div><div class="hud-box"><small>ANO ${Math.floor(s.month/12)+1} · ${months[s.month%12].toUpperCase()}</small><b>${s.actions} / 4 ações</b></div><button class="primary" onclick="advance()" ${s.ended?'disabled':''}>Fechar mês ▶</button></div><div class="scene-tip" id="sceneTip">Clique nos objetos para cuidar do seu negócio</div><div class="bottom-hud"><div class="quest"><small>${s.ended?'✧ UM NOVO COMEÇO':!s.launched?'★ MISSÃO: TIRAR A IDEIA DO PAPEL':'★ MISSÃO: O PRIMEIRO MILHÃO'}</small><p>${s.ended?'Abra o mural para usar seus aprendizados e fundar outra empresa.':!s.launched?`Clique no computador. Crie um conceito, desenvolva o MVP e defina seu preço para lançar.`:`${money(s.totalRevenue)} / R$ 1 milhão faturado. Último resultado: ${money(last.profit)}.`}</p></div><div class="toolstrip">${['⌨ Produto','☎ Marketing','♙ Equipe','▤ Caixa','✧ Mural'].map((t,i)=>`<button onclick="tab=${i+1};render()" aria-label="Abrir ${tabs[i+1]}">${t}</button>`).join('')}<button onclick="help()">?</button><button id="sound" onclick="toggleSound()">${sound?'♫ ligado':'♫ mudo'}</button></div></div>${tab?`<section class="window-wrap"><div class="window-top"><h2>${icons[tab]} ${tabs[tab]}</h2><button onclick="tab=0;render()">✕ Voltar ao escritório</button></div>${[null,product,marketing,people,finance,learning][tab]()}</section>`:''}</div>`;
 $('sceneCompany').textContent=s.name;
 const canvas=$('office');canvas.addEventListener('mousemove',e=>{const p=worldPoint(e,canvas);scene.hover=spots.findIndex(o=>Math.hypot(p.x-o.x,p.y-o.y)<o.r);$('sceneTip').textContent=scene.hover<0?'Clique nos objetos para cuidar do seu negócio':spots[scene.hover].label+' · CLIQUE PARA INTERAGIR';canvas.style.cursor=scene.hover<0?'default':'pointer';});canvas.addEventListener('mouseleave',()=>scene.hover=-1);canvas.addEventListener('click',e=>{const p=worldPoint(e,canvas),o=spots.find(o=>Math.hypot(p.x-o.x,p.y-o.y)<o.r);if(!o)return;if(o.page===6){meeting();}else{tab=o.page;render();}});drawOffice();
};
function worldPoint(e,canvas){const b=canvas.getBoundingClientRect(),scale=Math.min(b.width/640,b.height/400),ox=(b.width-640*scale)/2,oy=(b.height-400*scale)/2;return {x:(e.clientX-b.left-ox)/scale,y:(e.clientY-b.top-oy)/scale};}
drawOffice=function(){const canvas=$('office');if(!canvas)return;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;scene.tick++;const f=scene.tick;
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)},poly=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()},line=(a,b,col,width=1)=>{c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()},txt=(t,x,y,col='#fff0ce',size=7)=>{c.font=`bold ${size}px monospace`;c.fillStyle=col;c.fillText(t,x,y)};
 c.clearRect(0,0,640,400);
 // Distant city, neon signs and a floating diorama foundation.
 for(let i=0;i<18;i++){let x=i*39-15,h=28+(i*37%75);rect(x,267-h,29,h,'#30293f');for(let j=0;j<3;j++)for(let k=0;k<4;k++)if((i+j+k)%3===0)rect(x+5+j*7,273-h+k*12,3,4,'#897086');}
 poly([[75,286],[327,360],[571,253],[327,177]],'#251f35');poly([[76,274],[326,348],[565,247],[317,175]],'#69506c');poly([[76,263],[326,337],[565,236],[315,163]],'#a66b74');
 const iso=(u,v)=>[319+(u-v)*26,158+(u+v)*12];
 for(let u=0;u<9;u++)for(let v=0;v<9;v++){let a=iso(u,v),b=iso(u+1,v),d=iso(u,v+1),e=iso(u+1,v+1);poly([a,b,e,d],(u+v)%2?'#ce9c87':'#d9aa8d');line(a,b,'#be8a7f');line(a,d,'#be8a7f');}
 poly([[85,266],[85,132],[319,24],[319,158]],'#736590');poly([[319,24],[553,132],[553,266],[319,158]],'#ac7897');
 // Staggered brickwork in a deliberately restricted palette.
 for(let y=0;y<7;y++)for(let x=0;x<9;x++){let px=88+x*25,py=137-x*11+y*17;line([px,py],[px+23,py-10],'#817098');line([px,py],[px,py+15],'#675b83');}
 line([85,132],[319,24],'#c8a4b2',4);line([319,24],[553,132],'#e7a7b1',4);line([85,265],[319,158],'#534761',5);line([319,158],[553,266],'#815975',5);
 // Large evening window, skyline, reflections.
 poly([[111,140],[184,106],[184,166],[111,200]],'#433e68');poly([[116,143],[179,114],[179,162],[116,191]],'#f9b885');poly([[116,172],[179,142],[179,162],[116,191]],'#b68cad');for(let i=0;i<5;i++)rect(120+i*11,164-i*5,7,20,'#79658d');line([148,129],[148,176],'#f5d2ad',3);line([114,169],[181,138],'#f5d2ad',3);poly([[105,199],[185,162],[193,166],[113,204]],'#dec4b1');
 // Noticeboard, shelves and garage shutter.
 poly([[349,66],[399,89],[399,132],[349,109]],'#5e4867');poly([[353,72],[395,92],[395,125],[353,106]],'#d79e76');rect(361,89,10,13,'#fff2b5');rect(378,100,11,8,'#92cab7');rect(368,104,7,7,'#e68c86');
 poly([[443,113],[516,146],[516,224],[443,191]],'#655b7c');for(let i=0;i<7;i++)line([446,119+i*10],[513,150+i*10],'#93839a',3);line([477,165],[493,172],'#ebc9ba',3);
 // Rug.
 poly([[220,228],[321,182],[453,243],[350,291]],'#4e827f');poly([[233,228],[321,189],[438,243],[350,283]],'#69a39a');
 function desk(x,y){rect(x-25,y+5,5,28,'#754967');rect(x+24,y-2,5,28,'#754967');poly([[x-36,y],[x+5,y-19],[x+40,y-3],[x-1,y+17]],'#65445e');poly([[x-36,y-4],[x+5,y-23],[x+40,y-7],[x-1,y+13]],'#efb273');line([x-33,y-3],[x,y+11],'#ffd496',2);rect(x-4,y-40,27,22,'#443b5d');rect(x-1,y-37,21,16,'#83d4b8');rect(x+2,y-34,12,2,'#d0f1b5');rect(x+2,y-29,16,2,'#479d99');rect(x+7,y-18,4,6,'#554864');poly([[x-8,y-9],[x+11,y-17],[x+23,y-11],[x+3,y-2]],'#fff0c1');rect(x+28,y-10,5,7,'#ba6680');}
 function person(x,y,color,hair,walking=false){let b=walking?Math.floor(Math.sin(f/4)*2):Math.floor(Math.sin(f/14));poly([[x-8,y+12],[x+2,y+8],[x+13,y+13],[x+2,y+18]],'#765d73');rect(x-5,y-2,5,13+b,'#423951');rect(x+3,y-2,5,13-b,'#423951');rect(x-7,y-17,17,18,color);rect(x-10,y-15,4,13,'#edb48a');rect(x+10,y-15,4,10,'#edb48a');rect(x-7,y-32+b,17,16,x===224?(s.founder?.skin||'#f2bd8b'):'#f2bd8b');rect(x-9,y-34+b,20,7,hair);rect(x-9,y-29+b,5,10,hair);rect(x+4,y-25+b,2,3,'#3d304e');rect(x+9,y-19+b,3,3,'#d78575');}
 // Founder, starter desk and sticky notes.
 desk(235,223);person(224,253,s.founder?.shirt||'#eb895a',s.founder?.hair||'#67435a');rect(205,244,17,17,'#594c6b');rect(210,259,5,12,'#443e57');
 // Phone table and a visible handset.
 poly([[328,181],[353,169],[379,181],[354,194]],'#e7ab70');rect(333,186,4,20,'#73516b');rect(370,184,4,20,'#73516b');rect(345,168,18,10,'#554263');rect(342,165,7,6,'#8c658b');rect(358,165,7,6,'#8c658b');rect(349,170,8,4,'#f4bc78');
 // Ledger on a small cabinet.
 poly([[141,173],[164,163],[188,174],[165,185]],'#f4c47f');poly([[141,173],[165,185],[165,210],[141,198]],'#a26c6a');poly([[165,185],[188,174],[188,199],[165,210]],'#875573');rect(156,155,17,13,'#573f61');rect(159,157,11,8,'#fff1b9');line([164,157],[164,164],'#c39692');
 // Coffee station.
 poly([[279,294],[304,283],[331,295],[305,307]],'#e7ae7d');rect(282,300,4,18,'#7e5367');rect(324,299,4,18,'#7e5367');rect(299,273,17,17,'#584463');rect(302,277,9,5,'#efb567');rect(292,285,6,8,'#fff3c6');if(f%40<30){rect(294,278-f%6,2,5,'#f4d8b5');rect(308,266-f%5,2,5,'#f4d8b5');}
 // Recruitment corner becomes populated as the team grows.
 desk(443,277);if(s.team.length){person(431,307,s.team[0].color,'#493450');txt(s.team[0].name.toUpperCase(),418,324,'#fff1c4');}else{rect(425,291,18,16,'#665272');txt('VAGA!',429,263,'#fff0a4');}
 for(let i=1;i<Math.min(s.team.length,8);i++){let t=f/90+i*2,x=335+Math.sin(t)*65+i%2*30,y=231+Math.cos(t)*18;person(Math.round(x),Math.round(y),s.team[i].color,i%2?'#e8a452':'#473952',true);}
 // Plants, discarded prototypes and warm pendant light.
 [[105,247],[524,251],[337,175]].forEach(([x,y])=>{rect(x-6,y-10,13,16,'#cf7e72');rect(x-8,y-12,17,5,'#f0ae82');rect(x,y-39,3,29,'#4c7e70');rect(x-12,y-33,14,8,'#75b57c');rect(x+3,y-40,12,8,'#94ca7f');rect(x-8,y-46,10,8,'#a4d985');});rect(390,314,20,13,'#ae7b72');rect(395,309,18,6,'#e3bb8f');line([319,24],[319,63],'#4f3b5b',2);poly([[301,68],[319,57],[337,68],[319,77]],'#ffda7d');rect(313,70,13,5,'#fff0ab');
 // Context markers are part of the world, not floating management cards.
 spots.forEach((o,i)=>{let bounce=Math.floor(Math.sin(f/10+i)*2),y=o.y-o.r-6+bounce;if(scene.hover===i){poly([[o.x-22,o.y+15],[o.x,o.y+25],[o.x+22,o.y+15],[o.x,o.y+5]],'#ffd97c');rect(o.x-8,y-9,17,16,'#fff1bc');txt('!',o.x-2,y+3,'#6d4569',13);}else{rect(o.x-5,y,11,10,'#483952');txt(i===5?'♥':'+',o.x-3,y+8,'#ffda7d',9);}});
 txt('ALUGA-SE O FUTURO',403,349,'#bd9baa',8);
};
help=function(){modal(`<small>THE FOUNDER · GARAGEM 01</small><h2>Sua empresa começa aqui.</h2><p><b>Computador:</b> desenvolva o MVP duas vezes e lance. Depois, melhore o produto e ajuste o preço.<br><b>Telefone:</b> escolha seus investimentos em marketing.<br><b>Mesa da equipe:</b> contrate, promova e converse com as pessoas.<br><b>Caderno:</b> acompanhe caixa, crédito e a oferta de venda.<br><b>Mural:</b> transforme experiência em habilidades.<br><b>Café:</b> reúna a equipe e recupere motivação.</p><p>Você tem <b>4 ações por mês</b>. Clique em <b>Fechar mês</b> para processar vendas e custos. O tempo só avança quando você decide. Os botões inferiores também abrem cada objeto.</p><button class="primary" onclick="closeModal()">Entrar na garagem ▶</button>`);};
if($('modal').open)help();
// The simulation's existing animation loop calls the new scene painter.
tab=0;render();
