# Fase 6 — integração e primeira calibração — versão 0.10

> Registro histórico da versão 0.10. A versão 0.11 aumentou amigos/família para R$50 mil e banco para R$80 mil; consulte APORTES-INICIAIS.md para condições e simulações atuais.

## Entrega jogável

HTML independente em dist/The-Founder-Jogar.html, sem instalação ou servidor. Capital próprio inicial aumentado de R$12.000 para R$25.000 por solicitação do jogador; continua abaixo de amigos/família (R$35.000). Novas jornadas começam em garagem (R$500/mês, antes de inflação/negociação), com marketing total de R$500/mês. Ao contratar a terceira pessoa, o aluguel base passa a R$2.000 e a empresa permanece no escritório ampliado. Saves existentes mantêm sua economia anterior; a nova calibração exige Nova jornada. Schema continua 6; `balanceVersion:1` identifica a economia nova.

A aquisição foi recalibrada para 55% de leads sobre alcance (antes 10%), sem aumentar o público finito nem eliminar a saturação. Na nova economia, conversão base é 0,75 para recorrência e 1 para compra única; fator inicial de adoção 0,5. A disposição a pagar na compra única é 1,8× a de mensalidade equivalente. São parâmetros fictícios de gameplay, não benchmarks reais. Atributos, persona, preço, NPS, foco e estágio continuam reduzindo a conversão; preço acima da disposição a pagar zera demanda.

Resultados distinguem unidades vendidas, assinaturas cobradas, assinantes ativos e novos compradores. O HUD usa “Vendas / cobranças” para evitar chamar transações de pessoas únicas. Não se alega deduplicação de identidade humana entre dois produtos: compradores únicos continuam definidos por produto.

Criação de empresa passa a ser transacional: se salvar falhar, a empresa anterior é restaurada. Revisão indica incerteza dos treinos e reuniões. Foram mantidos agenda reversível, aprovação por token, RNG persistido, crédito sujeito a aceitação, divisão de leads entre produtos e limites de público.

## Simulações reproduzíveis

Comando: `node scripts/simulate.cjs`. Saídas: SIMULACOES-FASE-6.json (resumo e sementes) e SIMULACOES-FASE-6.csv (uma linha por partida). 1.920 partidas = 12 mercados atuais × 4 capitais × 10 sementes × 4 estratégias; horizonte 24 meses. Sementes: 123, 714, 2026, 4567, 8123, 14567, 98765, 414141, 123456789, 314159265. Sem habilidades acumuladas, sem simular leitura de pesquisas ou decisões humanas.

Estratégias:

- lean: MVP enxuto recorrente, idade/classe de maior participação, preço em 35% do intervalo entre custo e disposição a pagar; tenta recuperar nível abaixo de 4 quando há caixa. Sem crédito adicional ou contratações.
- oneoff: mesma política, compra única.
- overspend: produto recorrente, seleção/contratação sênior e saltos precoces para verba de R$5 mil/R$15 mil. O bônus da pessoa não é alinhado ao canal; é um teste de gasto excessivo, não uma estratégia otimizada.
- idle: nenhuma ação. Custos e eventos continuam; sobrevivência com muito caixa não significa sucesso.

O simulador usa regras reais, resolve até quatro ações, verifica conciliação de caixa em cada mês e serializa/migra o estado entre meses. As políticas conhecem a função de preço e as personas; os resultados não estimam a experiência de um iniciante sem essas informações. Dez sementes por combinação são uma amostra pequena, não uma garantia de balanceamento universal.

### Falência até o mês 24

Cada célula reúne 120 partidas (12 setores × 10 sementes).

| Estratégia | Próprio | Amigos | Banco | VC |
|---|---:|---:|---:|---:|
| Enxuta recorrente | 0% | 1,7% | 0% | 0% |
| Compra única | 1,7% | 20,8% | 0% | 0% |
| Gasto agressivo | 98,3% | 87,5% | 81,7% | 50% |
| Inação | 10% | 100% | 0% | 0% |

Antes da calibração, com capital próprio de R$12.000 e custos originais, próprio/amigos/banco quebravam em 100% dos testes enxutos. Depois da calibração e do aporte próprio aumentado para R$25.000, todas as partidas enxutas recorrentes desta amostra atravessaram 24 meses; 1,7% das de compra única quebraram. Isso não garante sucesso com outras decisões ou sementes. Lançamento com próprio passou a 100% na amostra. Para próprio recorrente, caixa final mediano R$62.625, P10 R$27.087 e P90 R$105.377; compra única: mediana R$31.944, P10 R$10.372 e P90 R$63.218. Inclui partidas encerradas antes de 24 meses. Gasto agressivo ainda levou a 98,3% de falência com capital próprio. Crédito/VC ociosos conseguem atravessar o horizonte apenas queimando caixa, sem receita. Os outros capitais não tiveram seu aporte alterado.

Os 12 mercados são os presentes no protótipo (DNVB, Wearables, Mobilidade elétrica, SaaS, Estúdio de jogos, App de IA, Rede de saúde, Rede de recarga, Mobilidade compartilhada, Fintech, Marketplace e Edtech). Esta etapa não substitui a lista pela revisão B2C ainda pendente de distribuição final de públicos. Isso está registrado como limitação, não como conclusão dessa revisão.

## Verificações e limite da validação

121 testes nomeados de regras/apresentação, mais integrações DOM simuladas. Novos testes cobrem 48 cenários reproduzíveis, conciliação, saturação, preços por classe, diferença compra/recorrência, garagem/expansão, save e rollback. Build verifica sintaxe e incorporação de oito estilos e treze scripts. Testes antigos continuam rodando para saves de fases anteriores.

A validação visual no navegador foi interrompida pelo controle de segurança do Computer Use: não foi possível determinar a URL atual com confiança suficiente. Nenhum contorno foi tentado. Assim, a entrega é um protótipo jogável testado em lógica e DOM simulado; a inspeção visual real continua pendente e a fase 6 não é declarada integralmente concluída.

Pendências de design: nova lista de mercados/públicos, ajuste de salários e retenção com feedback humano, teste visual em navegador e mais políticas/sementes. Cultura, branding e deposição pelo conselho permanecem no backlog anterior.
