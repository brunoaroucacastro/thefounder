/* Presentation only: every die and consequence already belongs to the saved
   close. Animation, skipping and replay never call GameRules or Math.random. */
let diceView=null,diceTimers=[],diceGeneration=0;
function stopDiceTimers(){diceGeneration++;diceTimers.forEach(clearTimeout);diceTimers=[];}
function persistDiceCursor(cursor){const previous=s.dicePlayback;s.dicePlayback=cursor;if(!save()){s.dicePlayback=previous;return false;}return true;}
function dieOutcome(report,index){
 const r=report.rolls[index],entries=report.entries.filter(e=>e.die),entry=entries[index];
 if(entry&&entry.die.label===r.label)return {tone:r.critical?'critical':r.total>=r.difficulty?'success':'failure',title:r.critical?'FALHA CRÍTICA':r.total>=r.difficulty?'SUCESSO':'FALHOU',effect:entry.note||'Ação resolvida.',target:'DIFICULDADE',targetValue:r.difficulty,rule:'Total 11+ melhora a eficiência',label:entry.label};
 if(r.label==='Evento do trimestre')return {tone:r.natural<=6?(r.critical?'critical':'failure'):'success',title:r.critical?'FALHA CRÍTICA':r.natural<=6?'IMPREVISTO':r.natural<=13?'OPORTUNIDADE':'BOAS NOTÍCIAS',effect:r.natural<=6?'Pane no servidor · −R$ 1.500':r.natural<=13?'Parceria extraordinária · +R$ 2.000':'Cliente elogiou a equipe · ânimo +8',target:'EVENTO',targetValue:'D20',rule:'1–6 imprevisto · 7–13 parceria · 14–20 elogio',label:'Um novo acontecimento'};
 if(r.label==='Risco de saída da equipe')return {tone:r.natural<=7?(r.critical?'critical':'failure'):'success',title:r.critical?'FALHA CRÍTICA':r.natural<=7?'PEDIDO DE DEMISSÃO':'EQUIPE PERMANECE',effect:r.natural<=7?(report.events.find(t=>t.includes('pediu demissão'))||'Uma pessoa deixou a equipe.'):'Ninguém deixou a equipe nesta verificação.',target:'PERMANÊNCIA',targetValue:'8+',rule:'1–7 saída · 8–20 permanece',label:'Clima da equipe'};
 return {tone:r.critical?'critical':r.outcome==='success'?'success':'failure',title:r.critical?'FALHA CRÍTICA':r.outcome==='success'?'SUCESSO':'FALHOU',effect:'Resultado registrado no fechamento.',target:'DIFICULDADE',targetValue:r.difficulty,rule:'1 natural é falha crítica',label:r.label};
}
function dieSvg(){return `<svg viewBox="0 0 260 280" class="icosahedron" aria-hidden="true"><defs><linearGradient id="dieFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b56ff1"/><stop offset=".5" stop-color="#68429d"/><stop offset="1" stop-color="#292346"/></linearGradient></defs><path d="M130 9 242 76 242 204 130 271 18 204 18 76Z" fill="url(#dieFill)" stroke="#efce91" stroke-width="3"/><path d="M130 9 78 94 182 94ZM18 76 78 94 18 204ZM242 76 182 94 242 204ZM78 94 130 190 182 94ZM18 204 130 190 130 271ZM242 204 130 190 130 271Z" fill="#fff" fill-opacity=".08" stroke="#e6bfa2" stroke-opacity=".7" stroke-width="1.5"/><path d="M18 76 130 9 242 76 182 94 130 190 78 94Z" fill="none" stroke="#e9c69c" stroke-width="1.5"/><path d="m78 94-60 110 112-14 112 14-60-110" fill="none" stroke="#e9c69c" stroke-width="1.5"/><path d="m130 9 0 36m-95 42 22 12m146 0 22-12m-95 146v25" stroke="#fff0ce" stroke-width="2" opacity=".7"/></svg>`;}
function openDice(report,{replay=false,index=0,stage='ready'}={}){
 if(!report?.rolls?.length){presentCloseSummary();return;}
 index=Math.max(0,Math.min(report.rolls.length-1,Number.isInteger(index)?index:0));stage=stage==='revealed'?'revealed':'ready';
 stopDiceTimers();diceView={report,replay,index,stage,rolling:false};drawDiceScene();
}
function presentMonthResult(){if(s.dicePlayback&&s.lastMonthReport?.rolls?.length)openDice(s.lastMonthReport,{index:s.dicePlayback.index,stage:s.dicePlayback.stage});else presentCloseSummary();}
function resumeDicePlayback(){if(s.dicePlayback)presentMonthResult();}
function replayDice(){if(s.lastMonthReport?.rolls?.length)openDice(s.lastMonthReport,{replay:true});}
function presentCloseSummary(){
 if(s.ended&&s.lastMonthReport?.bankruptcyXP!==undefined)modal(`<small>FIM DA JORNADA</small><h2>O caixa acabou. A experiência fica.</h2><p>Caixa final: ${money(s.cash)} · +${s.lastMonthReport.bankruptcyXP} pontos de aprendizado.</p><div class="actions"><button onclick="showMonthReport()">Ver fechamento</button><button class="primary" onclick="closeModal();tab=5;render()">Ver aprendizados →</button></div>`);else showMonthReport();
}
function drawDiceScene(){
 if(!diceView)return;const {report,index,stage,replay}=diceView,r=report.rolls[index],out=dieOutcome(report,index),revealed=stage==='revealed',sum=r.modifiers.reduce((n,m)=>n+m.value,0);
 $('modal').classList.add('dice-dialog');
 modal(`<section class="dice-scene ${revealed?'is-revealed '+out.tone:''}" id="diceStage"><div class="dice-topline"><span>${replay?'REVER ROLAGENS':'RESOLUÇÃO DO MÊS '+report.month}</span><button onclick="skipDice()">${replay?'Sair da revisão':'Pular animações'} ↗</button></div><div class="dice-progress">${report.rolls.map((_,i)=>`<i class="${i<index?'complete':i===index?'current':''}"></i>`).join('')}<span>${index+1} / ${report.rolls.length}</span></div><h2>${esc(out.label)}</h2><div class="dice-target"><small>${out.target}</small><b>${out.targetValue}</b></div><div class="die-space"><div class="die-orbit"></div><div class="die-halo"></div><button class="die-object" id="dieObject" onclick="rollDiceAnimation()" aria-label="Rolar dado de vinte lados" ${revealed?'disabled':''}>${dieSvg()}<span class="die-number" id="dieNumber">${revealed?r.natural:'?'}</span></button><span class="die-caption" id="dieCaption">${revealed?'DADO NATURAL':'CLIQUE NO DADO PARA ROLAR'}</span></div><div class="dice-formula"><div><small>D20</small><b id="naturalValue">${revealed?r.natural:'?'}</b></div><span>+</span><div><small>MODIFICADORES</small><b>${sum>=0?'+':''}${sum}</b></div><span>=</span><div class="formula-total"><small>TOTAL</small><b id="totalValue">${revealed?r.total:'—'}</b></div></div><div class="dice-modifiers">${r.modifiers.length?r.modifiers.map(m=>`<div class="modifier-chip ${m.value<0?'debuff':'buff'}"><b>${m.value>=0?'+':''}${m.value}</b><span>${esc(m.label)}</span></div>`).join(''):'<span class="no-modifiers">Sem modificadores nesta rolagem</span>'}</div><p class="dice-rule">${esc(out.rule)}${out.target==='DIFICULDADE'?' · 1 natural sempre é falha crítica.':''}</p><div class="dice-outcome" id="diceOutcome" aria-live="polite">${revealed?`<b>${out.title}</b><p>${esc(out.effect)}</p>`:'<span>A sorte ainda tem a palavra.</span>'}</div><div class="dice-controls">${revealed?`<button class="primary" id="nextDieButton" onclick="nextDie()">${index<report.rolls.length-1?'Próxima rolagem →':'Ver fechamento →'}</button>`:'<button class="primary" id="rollDiceButton" onclick="rollDiceAnimation()">Rolar D20</button>'}</div><small class="dice-save-note">${replay?'Revisão do resultado já registrado.':'Resultado salvo. Reabrir ou pular mantém a mesma rolagem.'}</small></section>`);
 const focusTarget=$(revealed?'nextDieButton':'rollDiceButton');focusTarget?.focus?.({preventScroll:true});
}
function rollDiceAnimation(){
 if(!diceView||diceView.rolling||diceView.stage==='revealed')return;diceView.rolling=true;
 const generation=diceGeneration,die=$('dieObject'),button=$('rollDiceButton');die.disabled=true;button.disabled=true;button.textContent='Rolando…';die.classList.add('rolling');$('dieCaption').textContent='ROLANDO O DESTINO…';
 const reduced=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=reduced?0:1650,frames=reduced?0:17;
 for(let i=0;i<frames;i++)diceTimers.push(setTimeout(()=>{if(generation!==diceGeneration||!diceView)return;$('dieNumber').textContent=1+(i*7+diceView.index*3)%20;},i*85));
 diceTimers.push(setTimeout(()=>revealDie(generation),duration));
}
function revealDie(generation=diceGeneration){
 if(!diceView||generation!==diceGeneration)return;
 const {report,index,replay}=diceView;
 if(!replay&&!persistDiceCursor({token:report.token,index,stage:'revealed'})){diceView.rolling=false;drawDiceScene();return;}
 stopDiceTimers();diceView.stage='revealed';diceView.rolling=false;drawDiceScene();
}
function nextDie(){if(!diceView||diceView.stage!=='revealed'||diceView.rolling)return;const {report,index,replay}=diceView;
 if(index===report.rolls.length-1){skipDice();return;}
 if(!replay&&!persistDiceCursor({token:report.token,index:index+1,stage:'ready'}))return;
 stopDiceTimers();diceView.index++;diceView.stage='ready';drawDiceScene();
}
function skipDice(){if(!diceView)return;if(!diceView.replay&&!persistDiceCursor(null))return;stopDiceTimers();diceView=null;$('modal').classList.remove('dice-dialog');presentCloseSummary();}
// Generic modals must never inherit the full-screen dice styling.
const diceBaseModal=modal;
modal=function(html){if(!html.includes('id="diceStage"'))$('modal').classList.remove('dice-dialog');diceBaseModal(html);};
$('modal').addEventListener('cancel',event=>{if(diceView){event.preventDefault();skipDice();}});
// A persisted cursor is presented only after the player chooses Continue.
