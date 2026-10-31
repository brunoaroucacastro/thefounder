/* Read-only interpretation of the canonical close. No rewards, writes or RNG. */
const MonthRecap=(()=>{
 const finite=n=>Number.isFinite(n)?n:0;
 function derive(state,h,{commitments=0}={}){
  const prior=(state.history||[]).filter(r=>r.month<h.month),previous=prior.at(-1),complete=prior.length===h.month-1,entries=h.entries||[],events=h.events||[],profit=finite(h.profit),revenue=finite(h.revenue),buyers=finite(h.newBuyers??h.newCustomers),cash=finite(h.cash),cashChange=Number.isFinite(h.startCash)&&Number.isFinite(h.cash)?h.cash-h.startCash:null,bankrupt=h.bankruptcyXP!==undefined||cash<0;
  const good=[],bad=[],milestones=[];const add=(list,icon,title,detail,value=null)=>list.push({icon,title,detail,value});
  if(entries.some(e=>['product_launch','launch'].includes(e.type)&&e.status!=='skipped'))milestones.push({icon:'🚀',title:'Produto no mercado!',detail:'O lançamento aconteceu neste mês.'});
  if(complete&&revenue>0&&prior.every(r=>!(r.revenue>0)))milestones.push({icon:'★',title:'Primeiro faturamento!',detail:'Seu negócio começou a vender.'});
  if(complete&&profit>0&&prior.every(r=>!(r.profit>0)))milestones.push({icon:'🌱',title:'Primeiro mês com lucro!',detail:'A receita superou os custos operacionais.'});
  if(profit>0)add(good,'◆','O negócio deu lucro','Receita acima dos custos operacionais.',profit);
  if(buyers>0)add(good,'♥',buyers+' novos compradores','Pessoas que compraram ou assinaram neste mês.');
  if(previous?.revenue>0&&revenue>previous.revenue)add(good,'↗','Faturamento em alta','Cresceu '+Math.round((revenue/previous.revenue-1)*100)+'% sobre o mês anterior.',revenue-previous.revenue);
  const actionTitles={product_develop:'Produto evoluiu',people_train:'Talento evoluiu',product_research:'A pesquisa trouxe uma pista',finance_benchmark:'Você encontrou uma referência',finance_supplier:'Uma oferta de fornecedor chegou',finance_credit:'Um banco fez uma proposta',people_hire:'A equipe cresceu',people_meeting:'A equipe ganhou ânimo',campaign:'Uma campanha foi ajustada',budget:'A verba foi ajustada'};
  for(const e of entries){if(e.die?.peopleDisplay?.tone==='neutral')continue;if(['failure','critical','skipped'].includes(e.status)){add(bad,e.status==='critical'?'⚡':'⚠',e.status==='skipped'?'Ação dependente não aconteceu':e.status==='critical'?'Uma tentativa teve falha crítica':['campaign','budget'].includes(e.type)?'A campanha perdeu eficiência':'Uma tentativa não funcionou',e.label+(e.status==='skipped'?' · Pulado · sem custo':e.note?' · '+e.note:''));}else if(e.status!=='planned'&&actionTitles[e.type])add(good,'✦',actionTitles[e.type],e.note||e.label);}
  for(const event of events){if(/pediu demissão/.test(event))bad.unshift({icon:'♥',title:'Uma pessoa deixou a equipe',detail:event,value:null});else if(/obsolescência|atrasad|em atraso/.test(event))add(bad,'⚠','Um compromisso precisa de cuidado',event);else if(/três candidatos disponíveis/.test(event))add(good,'✉','Novos talentos para conhecer',event);}
  if(profit<0)bad.unshift({icon:'↓',title:'O mês fechou no prejuízo',detail:'Os custos operacionais superaram a receita.',value:profit});
  if(cash<commitments&&!bankrupt)bad.unshift({icon:'◆',title:'O próximo mês pede atenção ao caixa',detail:'A reserva atual não cobre os compromissos previstos antes das vendas.',value:null});
  if(h.churn>0)add(bad,'↘',h.churn+' assinaturas canceladas','Acompanhe o produto e a capacidade de atendimento.');
  if(h.eventCash>0)add(good,'✉','Uma oportunidade trouxe dinheiro','Evento extraordinário; não é receita de vendas.',h.eventCash);else if(h.eventCash<0)add(bad,'⚡','Um imprevisto consumiu caixa','Evento extraordinário registrado no fechamento.',h.eventCash);
  const payments=finite(h.bankPrincipalPaid)+finite(h.friendsPaid);if(payments>0)add(good,'✓','Dívida devolvida','Valor pago de principal; separado do resultado operacional.',payments);
  const tone=bankrupt?'danger':profit>0&&cash>=commitments?'success':profit<0&&milestones.length===0?'warning':'mixed';
  const headline=bankrupt?'O caixa acabou. A experiência fica.':profit>0&&cash<commitments?'Lucro no negócio. Atenção ao caixa.':profit>0?'Seu negócio ganhou fôlego!':milestones.some(m=>m.icon==='🚀')?'Produto lançado. Hora de buscar retorno.':profit<0?'Este mês trouxe um desafio.':'Um novo capítulo está aberto.';
  let next={page:1,title:'Qual será seu próximo passo?',detail:'Revise seu produto e escolha a próxima aposta.'};
  if(bankrupt)next={page:5,title:'Leve os aprendizados com você',detail:'O mural reúne o que pode ajudar no próximo começo.'};
  else if(cash<commitments)next={page:4,title:'Prepare o caixa do próximo mês',detail:'Confira parcelas, juros e compromissos antes de investir.'};
  else if(state.people?.searches?.some(search=>search.status==='ready'))next={page:3,title:'Tem gente nova para conhecer',detail:'Seu processo seletivo trouxe candidatos. Compare os perfis antes de contratar.'};
  else if((h.productSales||[]).some(p=>p.nps<0))next={page:1,title:'Escute o que o produto está dizendo',detail:'Confira persona, atributos e preço: há sinais de insatisfação.'};
  else if(!state.launched)next={page:1,title:'Vamos colocar a ideia no mundo?',detail:'Confira o desenvolvimento e o que falta para lançar.'};
  else if(h.marketing>0&&h.acquisition?.roas!==null&&h.acquisition?.roas<1)next={page:2,title:'Teste um ajuste nas campanhas',detail:'A receita inicial atribuída ficou abaixo do gasto. Confira o retorno e a base recorrente.'};
  else if(h.churn>buyers)next={page:3,title:'Cuide de quem já chegou',detail:'Mais assinaturas saíram do que novos compradores chegaram. Confira também o produto.'};
  else if(profit<0)next={page:4,title:'Descubra o que pesou no mês',detail:'Olhe a DRE antes de aumentar compromissos.'};
  return {tone,headline,good,bad,milestones,profit,revenue,buyers,cash,cashChange,commitments,payments,bankrupt,next,growth:previous?.revenue>0?(revenue/previous.revenue-1)*100:null};
 }
 return {derive};
})();
if(typeof module!=='undefined')module.exports=MonthRecap;
