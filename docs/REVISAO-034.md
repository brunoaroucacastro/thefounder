# Revisão 0.34 — ritmo e retorno para reinvestir

A margem continua sendo (preço − custo unitário − CAC) / preço. A mudança aumenta a disposição a pagar por um produto alinhado: referência de valor ×1,15, tolerância base 1,40 e coeficiente de aderência 2,00. O preço sugerido parte de MC de 35%, com atalhos 15/35/45%. Preço livre, inclusive abaixo do custo; preço excessivo ainda pode zerar vendas. Campanha e vitrine alteram alcance, não a conversão diretamente.

Teste controlado, mesmo produto e campanha, 679 interessados, lote 100:

| MC | Vendidos | Contribuição | Resultado da janela |
|---|---:|---:|---:|
| 10% | 100 | R$833 | −R$417 |
| 35% | 87 | R$3.513,06 | R$2.263,06 |
| 45% | 44 | R$2.699,84 | R$1.449,84 |
| 60% | 0 | R$0 | −R$1.250 |

Resultado desconta campanha de R$350 e estrutura de R$900. O MVP permanece investimento separado; 100 peças não precisam amortizá-lo. Os resultados variam por persona, produto, execução e público. Dados em MARGENS-034.json e CENARIOS-034.json.

Vendas rodam 8× mais rápido e produção 4×. Sete dias simulados levam aproximadamente 53 segundos em 1× e 18 em 3×, sem fabricar vendas nem alterar dias simulados. Produzir e lançar é uma transação única; o D20 apresenta o resultado e a produção começa após confirmação. Recarregar não cobra novamente.

## Decisões e D20

- Vitrines sem abertura paga, com afinidade distinta nas quatro faixas 18–24/25–34/35–54/55+.
- Ações opcionais: demonstração R$350, criadores R$600, oferta R$250. Todas juntas dão bônus de 8% no alcance, além dos efeitos por idade. Gastos fixos separados do CAC por unidade vendida.
- D20 central explica motivo, modificadores e efeito real. Total 17+ dá três estrelas de execução; 20 natural acrescenta efeito crítico. Execução não se confunde com reviews de cinco estrelas.
- Aleatoriedade criptográfica do navegador, com gerador persistente alternativo. Resultado salvo antes da animação; testes podem injetar valores.
- Aprendizados com símbolos persistentes e caderno no cabeçalho, incluindo afinidade da vitrine. Ganchos de equipe preservados; contratação não adicionada.

## Fluxo e contabilidade

Persona e quatro faixas permanecem nas decisões seguintes. Radar conecta atributos investidos, inclusive triângulos. Conversão e estoque visíveis; reposição com orçamento explícito. Interrupção usa confirmação dentro do jogo e preserva estoque. Removido o custo arbitrário de preparação do fluxo moderno.

Otimização permite evoluir com D20 ou redistribuir o mesmo orçamento de pontos por R$750, sem aumentar nível. Desmantelar recupera 80% do valor do estoque em crédito de matérias-primas, nunca dinheiro; 20% vira perda. Crédito reduz próximo desembolso sem reduzir artificialmente o custo contábil das unidades. Estoque de versões antigas também pode ser recuperado.

Resumo distingue faturamento, contribuição após custo das unidades e CAC, campanha fixa, estrutura, perda de estoque, resultado da janela e resultado acumulado da linha após desenvolvimento. Caixa que cresce com estoque comprado antes não prova lucro total.

## Validação e compatibilidade

Testes de regras, contabilidade, migração e integração de HTML com DOM/Canvas simulados. Sem inspeção visual em navegador real. Cenários limitados, sem milhões de sorteios. Testes legados preservam regras anteriores explicitamente; modern, modern-ui, flow-feedback, feedback-ui e arcade-economy exercitam 0.34. Saves mantêm a chave, com backup na migração e sem taxas retroativas.
