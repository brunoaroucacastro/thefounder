# D20, contribuição e volume — 0.24

## Revisão 0.24 — D20 de volta, preço após marketing e fabricação em volume

Fluxo atual: produto e persona → até quatro pontos de produto → praça → pontos de promoção → conceito → desenvolvimento do MVP de R$8.000 → D20 do protótipo → decisão de corrigir/assumir limitação ou aproveitar vantagem → preparação e D20 da campanha → lote → preço pela margem de contribuição → fabricação e vendas. Os dados continuam salvos antes da animação; natural 1 é crítico e recarregar não permite rerrolar.

Um 12 entrega execução normal; um 18 melhora qualidade no produto e amplia alcance na campanha. Aderência vem dos atributos e da persona, execução vem do D20. Resultados baixos permitem reparo garantido sem repetir dado, ou lançamento com limitação. A vantagem pode virar acabamento ou seis interessados extras. O canal dominante dos pontos de promoção define a categoria de modificador do founder aplicada ao dado da campanha.

### Quantidade e desconto

O jogador escolhe qualquer quantidade inteira de 100 a 10.000, por campo numérico ou atalhos. A faixa se aplica a todas as unidades daquele lote, inclusive reposição.

| A partir de | Desconto por unidade |
|---:|---:|
| 100 | 0% |
| 300 | 2% |
| 1.000 | 4% |
| 3.000 | 6% |
| 5.000 | 8% |
| 10.000 | 10% |

Quantidade intermediária usa a última faixa atingida. Custo por unidade é arredondado aos centavos antes de multiplicar pelo lote. Exemplo: 734 unidades recebem 2%. O desconto não muda retroativamente o estoque anterior e não reduz o MVP, a comissão ou a promoção.

O lote é pago integralmente antes das vendas. Sem caixa, a produção não começa; a tela informa o valor faltante e permite rever a quantidade. Escolher 10.000 como objetivo não significa poder pagar esse lote com o capital inicial. O tempo de fabricação aumenta com o tamanho do lote, usando uma curva comprimida para o protótipo: 8 + 5 × log2(quantidade/100 + 1) segundos simulados.

Cada chegada soma o custo real do lote ao estoque. Vendas baixam unidades e custo médio ponderado; misturar reposições com descontos diferentes conserva o valor total. A última unidade absorve centavos de arredondamento. O custo médio e a contribuição do estoque atual aparecem durante as vendas.

### Preço e margem de contribuição

Preço vem depois da campanha e da seleção do lote, pois ambos praça e fabricação já estarão definidos. Contribuição por unidade = preço − custo unitário com desconto − comissão da praça.

O slider calcula preço = custo unitário com desconto ÷ (1 − taxa da praça − margem desejada). Por exemplo, custo R$50, comissão de 5% e margem de contribuição de 40% resultam em preço aproximado de R$90,91; comissão R$4,55 e contribuição R$36,36. Não é margem líquida: essa contribuição ainda paga MVP, promoção, abertura e aluguel. Não há outros custos variáveis simulados nesta revisão.

O limite do slider considera a comissão e reserva espaço positivo para o custo, evitando divisão por zero. Se o lote de reposição tiver outro desconto, o preço vigente permanece; a contribuição pode mudar e é mostrada pelo custo médio do estoque.

Tempo, reviews a cada dez unidades vendidas, continuidade das vendas e catálogo anterior permanecem. Reviews também consideram falhas conhecidas do protótipo. O save é independente: `the-founder-d20-volume-v1`, preservando versões anteriores.

Validação: dez testes novos de regras e integração do HTML final, com dois D20, reload, quantidade intermediária, desconto, preço após marketing, margem com comissão, lote de 300 e reviews. Compatibilidade das regras anteriores e regressão do jogo completo verificadas. A interface é executada em DOM/Canvas simulados; não se alega inspeção visual real no navegador.

Comandos: `node tests/bulk-dice.cjs`, `node scripts/build-first-loop.cjs`, `node tests/bulk-dice-ui.cjs`.
