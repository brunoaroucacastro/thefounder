/* Som do jogo (0.66): música em loop, efeitos e menu de áudio. Créditos em docs/CREDITOS.md. */
const Sfx=(()=>{
 const base='audio/',files={music:'artificial-music-and-so-it-begins.mp3',coin:'freesound_community-money-collect-1-101476.mp3',place:'universfield-new-notification-040-493469.mp3',week:'dragon-studio-male-yawn-effect-376879.mp3',good:'soundshelfstudio-ui-success-chime-513565.mp3',crit:'updatepelgo-success-221935.mp3',bad:'lesiakower-error-mistake-sound-effect-incorrect-answer-437420.mp3',fail:'soundshelfstudio-ui-drop-error-521939.mp3',click1:'universfield-computer-mouse-click-352734.mp3',click2:'matthewvakaliuk73627-mouse-click-290204.mp3',typing:'dragon-studio-typing-keyboard-asmr-356116.mp3'};for(let i=1;i<=9;i++)files['dice'+i]='u_ngsgp0r6zb-dice-roll-201898-'+i+'.wav';
 const level={coin:.45,place:.6,week:.7,good:.6,crit:.7,bad:.55,fail:.6,click1:.35,click2:.35,typing:.25};for(let i=1;i<=9;i++)level['dice'+i]=.8;let lastDice=0;
 const KEY='the-founder-audio';let cfg={music:true,musicVol:.35,sfx:true,sfxVol:.7};
 try{Object.assign(cfg,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cfg));}catch{}};
 const cache={},last={},once=new Set();let music=null,started=false,clickAlt=0,typingNode=null;
 function el(name){if(!cache[name]){const a=new Audio(base+files[name]);a.preload='auto';cache[name]=a;}return cache[name];}
 function play(name,{gap=60}={}){if(!name||!files[name]||!cfg.sfx)return;const now=performance.now();if(now-(last[name]||0)<gap)return;last[name]=now;try{const a=el(name).cloneNode();a.volume=Math.min(1,(level[name]??.6)*cfg.sfxVol);a.play().catch(()=>{});}catch{}}
 function applyMusic(){if(!music){music=new Audio(base+files.music);music.loop=true;}music.volume=cfg.musicVol;if(cfg.music&&started)music.play().catch(()=>{});else music.pause();}
 function start(){if(started)return;started=true;applyMusic();}
 function typing(){if(!cfg.sfx||typingNode)return;try{const a=el('typing').cloneNode();a.volume=level.typing*cfg.sfxVol;a.currentTime=Math.random()*4;typingNode=a;a.play().catch(()=>{});setTimeout(()=>{a.pause();typingNode=null;},900+Math.random()*900);}catch{typingNode=null;}}
 const clickable='button,a,input,select,summary,label,[data-action],[data-choice],[role="button"],canvas,.choice';
 function bindClicks(){document.addEventListener('pointerdown',e=>{start();if(e.target.closest?.('#audio-menu input'))return;const t=e.target.closest?.(clickable);if(t&&!t.disabled){clickAlt^=1;play(clickAlt?'click1':'click2',{gap:40});}},true);}
 function menu(anchor){let m=document.getElementById('audio-menu');if(m){m.remove();return;}m=document.createElement('div');m.id='audio-menu';m.setAttribute('role','dialog');m.setAttribute('aria-label','Som');
  m.innerHTML='<b>Som</b><label><input type="checkbox" data-k="music" '+(cfg.music?'checked':'')+'> Música</label><label class="vol">Volume da música <input type="range" min="0" max="100" data-k="musicVol" value="'+Math.round(cfg.musicVol*100)+'"></label><label><input type="checkbox" data-k="sfx" '+(cfg.sfx?'checked':'')+'> Efeitos sonoros</label><label class="vol">Volume dos efeitos <input type="range" min="0" max="100" data-k="sfxVol" value="'+Math.round(cfg.sfxVol*100)+'"></label>';
  m.addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;cfg[k]=e.target.type==='checkbox'?e.target.checked:e.target.value/100;save();applyMusic();if(k==='sfxVol'||k==='sfx')play('good',{gap:250});});
  const r=anchor.getBoundingClientRect();m.style.top=(r.bottom+8)+'px';m.style.right=Math.max(8,innerWidth-r.right)+'px';document.body.appendChild(m);
  setTimeout(()=>document.addEventListener('pointerdown',function off(e){if(!m.contains(e.target)&&e.target!==anchor){m.remove();document.removeEventListener('pointerdown',off,true);}},true));}
 function roll(){let k;do k=1+Math.floor(Math.random()*9);while(k===lastDice);lastDice=k;play('dice'+k,{gap:0});}
 function dice(r){if(!r)return;play(r.natural===20?'crit':r.natural===1?'fail':r.natural>10?'good':'bad');}
 function grade(gr){play({exceptional:'crit',great:'good',normal:'good',partial:'bad',critical:'fail'}[gr]);}
 function onceFor(key){if(once.has(key))return false;once.add(key);return true;}
 if(typeof document!=='undefined')bindClicks();
 return{play,roll,typing,menu,dice,grade,onceFor,start,get on(){return cfg.music||cfg.sfx;}};})();
