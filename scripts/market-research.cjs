// Cenário exploratório, NÃO estimativa estatística representativa.
const fs=require('fs');
const ages=[14809725*2/5+15811371,16356275+16117932,16478227+16542391+14814287+12969030,11880999+10420090+8360431+15271635];
const adult=ages.reduce((a,b)=>a+b,0), classes=[.031,.215,.470], online=[.96,.97,.87];
const weights=[16478227+16542391,14814287+12969030,11880999,10420090+8360431+15271635];
function ageDigital(activity){let internet=[.95,.92,.91,.84,.59];let p=activity.map((v,i)=>v*internet[i]);return [p[0],p[1],(p[2]*weights[0]+p[3]*weights[1])/(weights[0]+weights[1]),(p[3]*weights[2]+p[4]*weights[3])/(weights[2]+weights[3])];}
function pct(v){let sum=v.reduce((a,b)=>a+b,0),raw=v.map(x=>x/sum*100),out=raw.map(Math.floor);let rank=raw.map((x,i)=>({i,rest:x-out[i]})).sort((a,b)=>b.rest-a.rest);for(let i=0,n=100-out.reduce((a,b)=>a+b,0);i<n;i++)out[rank[i].i]++;return out;}
const rows=[
['Gadgets & tecnologia',[.85,.9,.7,.4],[.9,.7,.4],'Hipótese','Dispositivos e acessórios; intenção anual, não posse de smartphone.'],
['Moda & vestuário',[.95,.95,.9,.75],[.98,.95,.85],'Hipótese','Roupas, calçados e acessórios; compra física ou online.'],
['Consumíveis',[1,1,1,1],[1,1,1],'Hipótese','Alimentos e bebidas; teto amplo de compradores adultos.'],
['Beleza & cosméticos',[.75,.9,.85,.65],[.9,.8,.65],'Hipótese','Maquiagem, perfumes e cuidados pessoais; não só higiene básica.'],
['Pet',[.3,.55,.6,.45],[.6,.55,.4],'Hipótese','Adultos compradores de produtos pet; não número de pets ou lares.'],
['Home & Garden',[.25,.65,.8,.65],[.85,.7,.45],'Hipótese','Utensílios, decoração e jardinagem; não toda a indústria de construção.'],
['Fintechs',ageDigital([.62,.76,.69,.57,.32]),[.80,.80,.57].map((x,i)=>x*online[i]),'Proxy TIC C6','Atividade financeira online como aproximação; inclui bancos tradicionais.'],
['Healthtechs',ageDigital([.49,.66,.59,.51,.37]),[.63,.64,.53].map((x,i)=>x*online[i]),'Proxy TIC C6','Busca de saúde online indica interesse; não comprova uso/pagamento por consulta.'],
['Educação',ageDigital([.51,.46,.37,.30,.15]),[.48,.62,.35].map((x,i)=>x*online[i]),'Proxy TIC C8','Autoestudo online; não representa apenas matrículas pagas.'],
['Redes sociais & conteúdo',ageDigital([.92,.93,.87,.74,.50]),[.71,.92,.80].map((x,i)=>x*online[i]),'Proxy TIC C5','Redes sociais como referência da categoria; não soma usuários de streaming.'],
['Softwares & aplicativos',ageDigital([.85,.85,.70,.55,.35]),[.95,.85,.65].map((x,i)=>x*online[i]),'Hipótese','Apps utilitários e jogos, gratuitos ou pagos; união não observada nas fontes.'],
['Mobilidade & delivery',ageDigital([.85,.90,.80,.65,.35]),[.90,.85,.65].map((x,i)=>x*online[i]),'Hipótese','Potencial de uso de pelo menos uma modalidade; sem somar públicos sobrepostos.']
];
const result=rows.map(([name,ageRate,classRate,evidence,scope])=>{let counts=classes.map((x,i)=>adult*x*classRate[i]);return {name,ageRate,classRate,age:pct(ages.map((x,i)=>x*ageRate[i])),income:pct(counts),people:Math.round(counts.reduce((a,b)=>a+b,0)),evidence,scope};});
for(const r of result){if(r.age.reduce((a,b)=>a+b)!==100||r.income.reduce((a,b)=>a+b)!==100)throw Error('Percentuais inválidos');}
let table='| Mercado | Público estimado ABC 18+ | 18–24 | 25–34 | 35–54 | 55+ | A | B | C | Base |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---|\n'+result.map(r=>`| ${r.name} | ${Math.round(r.people/1e6)} milhões | ${[...r.age,...r.income].map(x=>x+'%').join(' | ')} | ${r.evidence} |`).join('\n');
fs.writeFileSync('docs/MERCADOS-base.json',JSON.stringify({status:'Base de pesquisa histórica; idade/classe substituídas por posicionamento de gameplay na 0.13. Públicos mantidos.',date:'2026-10-31',populationYear:2024,adultPopulationApprox:adult,classShares:classes,agePopulationApprox:ages,rows:result},null,2));
fs.writeFileSync('docs/MERCADOS-tabela.md',table+'\n');console.log(table);console.log('Adultos aproximados:',adult,'ABC aproximado:',adult*.716);
