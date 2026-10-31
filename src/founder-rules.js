/* Stable founder IDs; one +1 and one -1, except the neutral first-time founder. */
const FounderRules=(()=>{
 const categories={campaign_scale:'Escalar campanhas',campaign_reduce:'Reduzir campanhas',campaign_optimize:'Otimizar campanhas',product_development:'Desenvolver e melhorar produtos',persona_research:'Pesquisar personas',benchmarks:'Pesquisar benchmarks',suppliers:'Negociar fornecedores',credit:'Solicitar crédito',training:'Treinar pessoas',meeting:'Conduzir reuniões'};
 const profiles=[
  {id:'aggressive',name:'Agressivo',icon:'⚡',description:'Busca crescimento rápido e enfrenta riscos.',plus:'campaign_scale',minus:'meeting',strength:'Impulsiona o crescimento.',weakness:'Pode pressionar demais a equipe.'},
  {id:'creative',name:'Criativo',icon:'✦',description:'Explora ideias e novas formas de resolver problemas.',plus:'persona_research',minus:'credit',strength:'Descobre necessidades pouco óbvias.',weakness:'Pode apresentar planos pouco convencionais aos bancos.'},
  {id:'analytical',name:'Analítico',icon:'▥',description:'Investiga dados antes de decidir.',plus:'benchmarks',minus:'campaign_scale',strength:'Interpreta referências financeiras.',weakness:'Hesita ao acelerar o crescimento.'},
  {id:'commercial',name:'Comercial',icon:'★',description:'Convence e transforma interesse em negócios.',plus:'suppliers',minus:'product_development',strength:'Negocia melhores condições.',weakness:'Pode prometer além da execução técnica.'},
  {id:'builder',name:'Construtor',icon:'⚒',description:'Transforma ideias em produtos que funcionam.',plus:'product_development',minus:'campaign_optimize',strength:'Executa e aprimora produtos.',weakness:'Pode deixar os anúncios em segundo plano.'},
  {id:'operator',name:'Operador',icon:'⚙',description:'Organiza processos e melhora a execução.',plus:'campaign_optimize',minus:'persona_research',strength:'Ajusta operações existentes com disciplina.',weakness:'Pode se prender ao processo e ouvir pouco o consumidor.'},
  {id:'connector',name:'Conector',icon:'∞',description:'Constrói relações e abre portas.',plus:'credit',minus:'training',strength:'Apresenta a empresa e transmite confiança aos bancos.',weakness:'Pode depender da rede em vez de desenvolver o time.'},
  {id:'visionary',name:'Visionário',icon:'☀',description:'Enxerga oportunidades e inspira uma direção.',plus:'campaign_scale',minus:'benchmarks',strength:'Mobiliza recursos para crescer.',weakness:'Pode subestimar os detalhes financeiros.'},
  {id:'resilient',name:'Resiliente',icon:'◆',description:'Aprende, adapta e continua após dificuldades.',plus:'training',minus:'suppliers',strength:'Ajuda pessoas a evoluir com a prática.',weakness:'Pode insistir demais nas próprias condições.'},
  {id:'impact',name:'Orientado a impacto',icon:'♥',description:'Busca resolver problemas das pessoas com propósito.',plus:'meeting',minus:'credit',strength:'Engaja a equipe em um propósito comum.',weakness:'Pode ter dificuldade em defender o retorno financeiro.'},
  {id:'first-time',name:'Empreendedor de primeira viagem',icon:'🌱',description:'Ainda não desenvolveu especialidades nem vícios de gestão.',plus:null,minus:null,strength:'Sem vícios: nenhuma penalidade.',weakness:'Sem especialidade: nenhum bônus.'}
 ];
 function get(s){const f=s.founder;if(!f)return profiles[10];if(f.profileId)return profiles.find(p=>p.id===f.profileId)||profiles[10];return Number.isInteger(f.profile)?profiles[f.profile]||profiles[10]:profiles[10];}
 function ensure(s){if(s.founder){const p=get(s);s.founder.profileId=p.id;}return s;}
 function modifiers(s,category){const p=get(s),value=category&&p.plus===category?1:category&&p.minus===category?-1:0;return value?[{label:'Founder · '+p.name+' · '+categories[category],value,source:'founder',profileId:p.id}]:[];}
 return {profiles,categories,get,ensure,modifiers};
})();
if(typeof module!=='undefined')module.exports=FounderRules;
