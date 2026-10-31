/* Campaign simulation. Receives the shared D20 roller; never owns a RNG. */
const CampaignRules=(()=>{
 const names=['Busca paga','Conteúdo & SEO','Redes sociais'],keys=['ads','seo','social'];
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const physical=['dnvb','wearables','electric-mobility','gadgets','fashion','consumables','beauty','pet','home-garden'];
 function ensure(s){s.campaigns??=s.budgets.map(()=>({efficiency:1,blockedMonth:null,reached:0,activeMonths:0,last:null}));s.audienceExposure??=[0,0,0,0];s.team.forEach(p=>{if(p.role==='Marketing')p.specialty??='ads';});return s;}
 function affinity(s){return physical.includes(s.marketId)?[1,.8,1.4]:[1.15,1.4,.8];}
 function audience(s,models){const m=models?.[s.business],target=s.target||0;return Math.max(0,Math.floor(m?m[4]*m[5][target]/100:100000));}
 function saturation(s,models){const size=audience(s,models);return size?clamp(s.audienceExposure[s.target||0]/size,0,1):1;}
 function blocked(s,i){return s.campaigns[i].blockedMonth===s.month+1;}
 function adjustment(s,a){const i=a.channel??a.index,old=s.budgets[i],mode=a.type==='budget'?(a.value>old?'scale':'reduce'):a.mode;return {i,old,mode,value:mode==='optimize'?old:a.value};}
 function validate(s,a,touched){ensure(s);const {i,old,mode,value}=adjustment(s,a);if(![0,1,2].includes(i)||!['scale','reduce','optimize'].includes(mode))throw Error('Campanha inválida.');if(touched?.has(i))throw Error('Escolha um ajuste por canal neste mês. Remova o anterior para substituir.');if(!Number.isInteger(value)||value<0||value>1000000)throw Error('Use um orçamento mensal inteiro entre R$ 0 e R$ 1 milhão.');if(mode==='scale'&&value<=old)throw Error('Escalar exige uma verba maior.');if(mode==='reduce'&&value>=old)throw Error('Reduzir exige uma verba menor.');if(mode==='optimize'&&old<=0)throw Error('Ative o canal antes de otimizar.');if(blocked(s,i)&&mode!=='reduce')throw Error('Canal bloqueado neste mês. Você ainda pode reduzir ou pausar a verba.');return {i,old,mode,value};}
 function modifiers(s,a,models){const {i,old,mode,value}=adjustment(s,a),mods=[];const specialist=Math.max(0,...s.team.filter(p=>p.role==='Marketing'&&p.specialty===keys[i]).map(p=>p.level));if(specialist)mods.push({label:'Especialista em '+names[i],value:Math.min(4,specialist)});const fit=affinity(s)[i];mods.push({label:'Afinidade do canal',value:fit>=1.3?2:fit<1?-2:0});const sat=Math.floor(saturation(s,models)*5);if(sat)mods.push({label:'Saturação do público',value:-sat});const growth=mode==='scale'?value/Math.max(500,old)-1:0,penalty=Math.min(8,Math.ceil(Math.max(0,growth-.25)*2));if(penalty)mods.push({label:'Escala agressiva',value:-penalty});return mods;}
 function apply(s,a,{preview=false,models,roll,touched}={}){
  const {i,old,mode,value}=validate(s,a,touched);touched?.add(i);const campaign=s.campaigns[i],before=campaign.efficiency;
  if(preview){s.budgets[i]=value;return {status:'planned',channel:i,mode,budget:value};}
  // Reducing financial exposure is guaranteed; the die affects remaining efficiency.
  if(blocked(s,i)){s.budgets[i]=value;return {status:'executed',channel:i,mode,budget:value,note:'Verba reduzida durante bloqueio; sem sorteio.'};}
  const die=roll(s,{label:mode+' · '+names[i],modifiers:modifiers(s,a,models),difficulty:11});
  let delta=die.critical?-.30:die.total<=10?-Math.min(.30,(11-die.total)*.03):Math.min(.30,(die.total-10)*.03);
  campaign.efficiency=clamp(before+delta,.35,2);
  if(die.critical){campaign.blockedMonth=s.month+2;s.budgets[i]=mode==='reduce'?value:old;}else s.budgets[i]=value;
  return {status:die.critical?'critical':die.outcome,channel:i,mode,budget:s.budgets[i],efficiencyBefore:before,efficiencyAfter:campaign.efficiency,die,note:die.critical?'Falha crítica: ajuste cancelado (reduções mantidas); canal bloqueado no próximo mês.':'Eficiência '+Math.round(before*100)+'% → '+Math.round(campaign.efficiency*100)+'%'};
 }
 function forecast(s){ensure(s);return s.budgets.reduce((n,b,i)=>n+(blocked(s,i)?0:b),0);}
 function acquire(s,{models,conversion}){
  ensure(s);const size=audience(s,models),target=s.target||0,seen=clamp(s.audienceExposure[target],0,size),remaining=Math.max(0,size-seen),fits=affinity(s);
  const rows=s.campaigns.map((c,i)=>{const spend=blocked(s,i)?0:s.budgets[i],maturity=i===1?1+Math.min(12,c.activeMonths)*.03:1;const potential=Math.floor(spend*2/Math.pow(1+spend/2000,.55)*c.efficiency*fits[i]*maturity);return {channel:i,name:names[i],spend,blocked:blocked(s,i),potential,efficiency:c.efficiency,affinity:fits[i]};});
  // One shared audience pool per persona. Allocate once across all paid channels
  // and organic traffic, rather than granting each channel its own full market.
  const organic=200,total=rows.reduce((n,r)=>n+r.potential,organic),unique=Math.min(remaining,total),scale=total?unique/total:0;
  let assigned=0;rows.forEach(r=>{r.reach=Math.floor(r.potential*scale);assigned+=r.reach;});
  const organicReach=unique-assigned;
  rows.forEach(r=>{r.leads=Math.floor(r.reach*.10);r.newCustomers=s.launched?Math.floor(r.leads*conversion):0;r.attributedRevenue=r.newCustomers*s.price;r.roas=r.spend>0?r.attributedRevenue/r.spend:null;const c=s.campaigns[r.channel];c.reached+=r.reach;if(r.spend>0)c.activeMonths++;c.last={...r,month:s.month+1};});
  const organicLeads=Math.floor(organicReach*.10),organicCustomers=s.launched?Math.floor(organicLeads*conversion):0;
  s.audienceExposure[target]=seen+unique;
  const spend=rows.reduce((n,r)=>n+r.spend,0),attributedRevenue=rows.reduce((n,r)=>n+r.attributedRevenue,0);
  return {channels:rows,reach:unique,leads:rows.reduce((n,r)=>n+r.leads,organicLeads),newCustomers:rows.reduce((n,r)=>n+r.newCustomers,organicCustomers),organicCustomers,spend,attributedRevenue,roas:spend?attributedRevenue/spend:null,audience:size,seen:s.audienceExposure[target],saturation:size?s.audienceExposure[target]/size:1};
 }
 return {names,keys,ensure,affinity,audience,saturation,blocked,adjustment,validate,modifiers,apply,forecast,acquire};
})();
if(typeof module!=='undefined')module.exports=CampaignRules;
