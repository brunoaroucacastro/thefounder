# Fase 4 — Administrativo-financeiro, protótipo 0.8

Implementação autorizada em 31/10/2026. Valores e referências são fictícios, para gameplay. Mantém as quatro ações, prévia, aprovação e D20 compartilhado. Fase 5 de pessoas e Fase 6 de balanceamento não foram antecipadas.

## Interface e DRE

Caderno → Resultado, Fornecedores, Crédito ou Benchmarks. DRE mostra valores e percentuais da receita; sem receita, mostra “—”. Barras podem ser limitadas visualmente a 100%, mas o percentual textual continua mostrando custos superiores ao faturamento.

Juros entram no resultado operacional. Principal de empréstimos, crédito recebido e investimentos/ações são movimentos separados de caixa. Relatório reconcilia: caixa inicial + crédito recebido − ações + resultado + eventos − family/friends − amortização bancária automática. As amortizações extras pela agenda estão incluídas nas ações, sem descontar duas vezes.

## Benchmarks

- Uma ação de pesquisa custa R$ 500.
- Primeiro D20 escolhe entre custo variável, pessoas, marketing, aluguel ou juros. É sorteio de categoria, não teste com falha crítica, mesmo se o número for 1.
- Segundo D20 testa pesquisa, dificuldade 11. Modificador do melhor especialista em benchmarks, até +4. Natural 1 ou total até 10 não geram dados confiáveis.
- Total 20+ revela a referência exata. Abaixo disso, o intervalo contém a referência e fica mais estreito conforme a qualidade. A posição da referência dentro do intervalo varia; a média não é uma resposta garantida.
- Referências internas iniciais (% da receita): físicos 45/15/18/8/3; software/serviços 15/30/25/6/3, na ordem das categorias acima. Não são proporções que somam uma DRE nem recomendações reais universais; despesas variam com o modelo.
- Resultado é guardado com categoria, faixa, confiança e mês. O jogador vê cada pesquisa separadamente e compara com a própria DRE.

## Fornecedores

Dois contratos: Produto/operação (insumos ou infraestrutura que afetam custo variável) e Aluguel. Descontos não alteram nível, atributos, preço de venda ou qualidade.

Negociação consome uma ação, sem taxa monetária. Pode ser iniciada uma vez a cada seis meses por fornecedor. Um D20 com especialista em fornecedores (melhor nível, até +4) define o resultado:

- Natural 1: custo +5%, sem insistências.
- Total até 10: custo sobe de 1% a 5%, conforme o resultado.
- Total 11+: oferta de desconto de `total − 10`%, limitada a 10%.

O resultado do mês já usa o contrato anterior. Condições adversas entram a partir do mês seguinte. Uma oferta favorável não é aceita automaticamente; fica disponível na cena do dado e no painel para aceitar, recusar ou insistir.

### Insistências

- Até duas insistências fazem parte da ação original; não gastam slots adicionais.
- Cada uma usa o D20 central. É preciso alcançar o total da última oferta bem-sucedida para melhorar/manter a proposta.
- Primeira insistência malsucedida mantém a oferta; segunda malsucedida retira a oferta e preserva o contrato anterior.
- Natural 1 encerra de imediato e impõe +5% ao contrato do próximo período.
- Desconto é substitutivo, não cumulativo. Aceitar duas negociações de 10% em semestres diferentes não produz 20%.
- A oferta expira ao avançar mais um fechamento sem decidir. A revisão avisa sobre esse vencimento. O cooldown não é reiniciado pelas insistências.
- Respostas acontecem entre fechamentos, quando o resultado já está salvo, e afetam somente períodos seguintes. Não recalculam vendas/custos passados, nem executam o mês de novo.
- Resultados adicionais são salvos e inseridos na sequência visual após a rolagem corrente. IDs estáveis relacionam cada dado à sua consequência, inclusive com múltiplos dados por ação. Rever uma sequência não oferece escolhas que alterem a empresa.

## Bancos e propostas

Três bancos fictícios:

| Banco | Taxa-base mensal | Dificuldade |
|---|---:|---:|
| Banco Raiz | 2,5% | 11 |
| Órbita Crédito | 2,2% | 13 |
| Banco Ponte | 3,0% | 10 |

Valores de consulta: R$ 10/20/40/80 mil. Limite de dívida da demo: R$ 200 mil. Uma consulta de crédito por mês; é preciso aceitar ou descartar oferta aberta antes de pedir outra.

Modificadores: melhor especialista em crédito até +4; geração de caixa +2 ou queda −2; empresa sem histórico −1; score pode somar ou subtrair até 2; dívida alta em relação à receita −2. Geração de caixa exclui entradas de novos empréstimos para evitar aparentar saúde só por captar dinheiro.

- Falha comum: proposta negada, score −5, nova consulta no mês seguinte.
- Natural 1: proposta negada, score −20 e bloqueio durante os três meses seguintes. Exemplo: crítico no mês 1 impede consultas nos meses 2, 3 e 4; mês 5 libera.
- Sucesso gera **oferta**, sem depósito. A taxa diminui 0,1 ponto percentual por ponto acima da dificuldade, com piso de 0,8% ao mês.
- Prazo: 12 parcelas, 18 com total 15+ e 24 com total 20+. Carência do principal: zero, um mês com total 15+ e dois com total 18+.
- Ofertas ficam disponíveis por três rodadas após serem recebidas. Descartar não movimenta dinheiro. Aceitar entra na agenda e usa outra ação; o crédito só entra ao executar a aceitação.

### Contratos e amortização

Juros mensais sobre saldo, inclusive durante a carência. Amortização em parcelas de principal constante, limitada ao saldo restante. Sem carência, a primeira amortização ocorre no fechamento da aceitação. Carência adia apenas o principal.

Principal automático é debitado após a operação e os demais compromissos existentes; não reduz lucro novamente. Quando caixa não cobre toda a parcela de principal, paga o disponível, registra atraso e reduz score em 10. Atraso se soma à próxima parcela. Pagamento integral melhora score em 1.

Amortização extra pela agenda abate a dívida inicial/legada primeiro e depois novos contratos por taxa decrescente, incluindo atrasos do contrato abatido. Não paga principal duas vezes. Contratos quitados deixam de gerar juros.

Dívida antiga não ganha vencimentos retroativos: mantém saldo legado com juros de 2,5% e amortização livre, como antes. Novos contratos seguem as condições negociadas.

## Inflação

3% fixos por ano sobre as bases de custo variável e aluguel. Primeiro reajuste ao final do mês 12, válido no 13; não altera retrospectivamente a DRE do mês 12. Não muda salários, verbas de campanha ou dívida automaticamente. Controle de ano aplicado impede reajuste duplicado ao reabrir o save. Migração não cobra inflação passada.

Inflação dinâmica/macroeconomia permanece no backlog.

## Pessoas e migração

Adiciona Ivo, Financeiro nível 1, salário R$ 3.800. Escolher especialidade: fornecedores, crédito ou benchmarks. O bônus só serve para a especialidade. Níveis/treino/processo seletivo serão aprofundados na Fase 5.

Save schema 5, backup `the-founder-v1-backup-before-finance`. Preserva dívida antiga, catálogo, campanhas e agenda. Contratos/propostas, score, fornecedores e benchmarks são persistidos. Resultados de insistências e seus cursores D20 são salvos juntos; falha de persistência reverte a resposta.

## Validação

23 testes financeiros determinísticos, além das regressões de fases anteriores. Integração verifica DRE, ofertas na cena D20, dois dados de pesquisa, inserção de insistência sem perder a ordem, replay sem escolhas, aceitação pela agenda, migração e rollback de gravação.

Não equivale a teste de layout em navegador. Custos, chances, benchmarks, limites e taxas permanecem experimentais até a Fase 6. Não há impostos, inadimplência judicial ou dinâmica macroeconômica nesta versão.
