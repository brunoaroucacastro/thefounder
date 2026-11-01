# Produção e capacidade — 0.21

## Revisão 0.21 — produção e capacidade implementadas

A oficina agora opera com lotes pré-pagos de 12, 24 ou 48 fones. Materiais saem do caixa no início e só podem ser vendidos quando Nina termina a produção. Durante as vendas, reposição de 12/24 unidades compete com preparar o próximo projeto. As tarefas não gastam mais decisões estratégicas: disputam a única bancada e cobram seus custos. Visitantes continuam chegando enquanto Nina trabalha; sem estoque pronto, a compra é perdida.

Pesquisa preparatória custa R$350 e 12 segundos; reduz o próximo protótipo de R$1.000/10 segundos para R$500/4 segundos. Reposição leva 0,65 segundo por unidade. Lote inicial leva 0,25 segundo por unidade. O aluguel por ciclo passa a R$900. Mantidos R$25 mil iniciais, perfis, D20 e quatro decisões estratégicas. Estes parâmetros substituem os valores do experimento 0.20 abaixo.

Estoque não vendido permanece no catálogo. Ao iniciar outra criação, esses produtos continuam recebendo visitantes enquanto você escolhe e desenvolve o próximo. A demanda residual é limitada a um visitante a cada quatro segundos, com conversão derivada do produto original; não há novo dado por venda. O ciclo do catálogo para na tela de fechamento e nas pausas. A próxima criação mantém caixa e estoque real. Não há produção simultânea de dois projetos nem reposição livre de produtos antigos nesta revisão.

O destaque financeiro do fechamento é **variação do caixa**, incluindo a compra de todo o lote. Estoque restante é mostrado separadamente; o indicador não deve ser chamado de lucro contábil. Receitas do catálogo anterior são explicitadas. A decisão de lote é feita depois do dado de alcance, antes da produção; conhecer interessados não significa conhecer vendas garantidas.

Save próprio: `the-founder-operations-v1`. As partidas 0.20 e do jogo completo permanecem intactas. Para jogar a nova economia, abra o arquivo 0.21. Preparação usa os mesmos personagens e bancada, com barras ligadas às tarefas, caixas ligadas ao estoque e aviso de falta de produto.

Validação: dez testes novos de operação, treze de compatibilidade das regras anteriores, integração do HTML 0.21 e regressão do jogo completo. A integração usa DOM/Canvas simulados; inspeção visual num navegador real permanece pendente. Balanceamento e diversão precisam de avaliação humana.

Verificação: `node tests/operations.cjs`, `node tests/first-loop.cjs`, `node scripts/build-first-loop.cjs`, `node tests/first-loop-ui.cjs`.
