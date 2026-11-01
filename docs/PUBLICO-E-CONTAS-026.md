# Público vivo e contas do produto — 0.26

## Revisão 0.26 — público vivo, CAC e três caminhos

Esta entrega mantém apenas a empresa de gadgets e integra a correção financeira com o modelo de mercado discutido. Depois de cada ciclo há três escolhas explícitas: criar outro produto, otimizar o atual ou continuar vendendo com novas campanhas.

### Ordem das etapas e CAC

Produto e persona → atributos → praça e promoção → desenvolvimento e teste do produto → lote e preço → D20 da campanha → fabricação e vendas. Na estreia de uma nova geração, o preço também é confirmado antes do dado de campanha. Campanhas do produto já lançado usam o preço vigente, que pode ser revisto antes de investir e rolar novamente. O preço não pode ser escolhido depois de conhecer o resultado da nova campanha. Rolagens históricas de saves importados são preservadas.

CAC pago = gasto de aquisição acompanhado ÷ novos clientes adquiridos. Uma loja comprando quatro unidades conta como quatro unidades e um cliente; outra compra da mesma loja não cria outro cliente novo. O custo de marketing é pago uma vez e entra uma vez no resultado. Comissão da praça é custo por venda, apresentado separadamente. Abertura da praça, pesquisa e MVP permanecem custos fixos nesta simulação. A definição de CAC segue a distinção entre investimento e novos clientes: [Stripe](https://stripe.com/resources/more/cac-in-saas).

Antes das vendas, a tela mostra CAC e contribuição após aquisição estimados, com hipótese de uma unidade por novo cliente e execução normal da campanha. Preço, público, prova social e estoque alteram a previsão. Durante as vendas, mostra CAC realizado e contribuição realizada após marketing. Sem novos clientes, CAC é —, não zero. Para múltiplas unidades por cliente, a contribuição é calculada pela receita total menos CPV, comissão e gasto de marketing; não se subtrai um CAC inteiro de cada peça.

### Panorama por produto

O botão Produtos, no topo, abre a prateleira financeira e pausa a partida. Mostra unidades vendidas, total investido/pago, resultado acumulado incluindo MVP, receita, estoque e valor do estoque, saldo de caixa gerado, CAC e média de estrelas. Linhas agrupam as gerações; o detalhe permite comparar versões e abrir a conta. Média de estrelas é ponderada pela quantidade de avaliações.

Resultado = receita − custo das unidades vendidas − comissão − marketing − desenvolvimento, pesquisa, abertura e operação. Compras de estoque não vendido não são novamente lançadas como CPV. Saldo de caixa considera todo o estoque pago antecipadamente. Custos operacionais são atribuídos ao produto ativo; vendas residuais são atribuídas à versão antiga, com seus próprios custos e comissões. O panorama não executa ações nem recalcula rolagens.

### Compradores e reviews variados

Cada visitante tem identidade sintética, segmento de necessidade, idade, renda, pesos de atributos, orçamento pessoal e exigência. Campanhas amplas aumentam a diversidade de necessidades alcançadas. As distribuições de idade e renda são fictícias para gameplay; não representam estatística brasileira nem determinam universalmente preferências individuais. Renda altera faixas de orçamento, com variação pessoal; idade descreve o perfil.

A cada dez unidades vendidas, uma compra real daquele intervalo é selecionada para avaliação. A nota depende da aderência às necessidades individuais, execução, custo-benefício do preço realmente pago, exigência e uma pequena variação pessoal. O texto explica uma dor ou benefício específico e usa variantes de redação. O review guarda comprador, contexto, faixa de idade, classe de renda, preço pago, motivo e atributo associado. Uma mesma versão pode agradar a um comprador e frustrar outro.

A variação usa uma sequência determinística separada do D20; visitar relatórios não gera novas notas nem altera a próxima rolagem. Reviews são salvos com as vendas, não recriados na apresentação. Avaliações antigas de saves importados não são reescritas; as futuras compras passam a gerar avaliações individuais quando os dados da versão estão disponíveis.

### Conversão, preço e prova social

Para cada comprador: valor percebido W = orçamento pessoal × (0,8 + 0,4 × aderência) × (1 + 0,06 × níveis acima do 4) × execução. A execução do protótipo usa fatores 0,75 / 1 / 1,08 / 1,15 conforme o teste. O nível passa a atuar sobre esse valor percebido no novo modo de mercado.

Nota ajustada = (soma das estrelas + 30) ÷ (quantidade de reviews + 10). Confiança = 1 + 0,15 × (nota ajustada − 3). Sem reviews, confiança é neutra. Uma avaliação isolada tem influência pequena; muitas avaliações boas ou ruins pesam mais. A prova social nas vendas pertence à versão atual, enquanto o panorama pode agrupar a linha inteira.

Probabilidade de compra = 0,45 × (0,3 + 0,7 × aderência) × confiança × máximo(0, 1 − preço/W) × clareza da campanha. Clareza acrescenta 2,5% por ponto de demonstração e 1,5% por ponto de explicação do valor. Há limite de 90%, sem piso artificial que garanta compras a qualquer preço. O comprador reage ao preço, não à margem da empresa.

O resultado de cada compra usa a chance individual e variação determinística do visitante, sem novos D20 ocultos. Para cada segmento, demanda linear no preço produz o compromisso de lucro discutido; misturar segmentos, estoque limitado e reviews torna a curva agregada dependente do caso. A previsão usa uma amostra determinística de 24 perfis, sem revelar o preço ótimo nem garantir vendas.

### Atrair ou reconverter

Atrair novas pessoas usa o orçamento, pontos e D20 para ampliar alcance. Reconverter convida interessados identificados que ainda não compraram. Os mesmos IDs retornam; não são contados de novo como público novo. Na reconversão o D20 afeta a eficácia da apresentação, não a quantidade de avaliações ou os atributos do produto. Fatores de execução: crítico 0,7×; parcial 0,9×; normal 1,1×; vantagem 1,25×; excepcional 1,4× sobre a chance de compra, sem superar as barreiras de preço e aderência.

Cada campanha pode convidar até 60 × raiz do tamanho × (1 + 0,15 × pontos de demonstração), respeitando o público disponível. Interessados expiram após três dias simulados e podem receber no máximo duas reconversões. Pessoas muito desalinhadas saem do grupo. Falta de estoque é registrada separadamente de rejeição por preço ou produto. Uma campanha sem público elegível não pode começar; se o público esfriar depois do investimento, o gasto realizado permanece.

Otimizar continua usando D20 e níveis 4–10. A tela traz reviews recentes para orientar o atributo escolhido. A versão aprovada pode manter o preço anterior ou definir outro antes da nova campanha. Estoque antigo conserva projeto e preço, e as próximas compras dele continuam gerando reviews próprios.

### Persistência e verificação

Save novo: `the-founder-market-v1`. Quando acessíveis no mesmo armazenamento do navegador, partidas 0.25/0.24 são importadas por cópia. Dados antigos sem identificação de clientes não recebem CAC retroativo inventado: aparece — ou o CAC acompanhado desde a atualização. Totais financeiros recuperáveis continuam disponíveis. Arquivos locais podem ter armazenamentos separados conforme o navegador.

22 testes novos de regras (12 de público/reconversão e dez de contas) cobrem diversidade, comprador real do intervalo, preço pago, RNG separado, prova social, preço proibitivo, expiração, deduplicação, tentativas, caixa, CPV, margem, gerações e médias. A integração executa o HTML independente com sete scripts em DOM/Canvas simulados: preço antes da campanha, CAC, panorama com pausa, reviews persistidos, três caminhos, reconversão e migração. Regressões anteriores e teste de entrega do jogo completo também passaram. Inspeção visual real no navegador e avaliação de diversão por jogadores seguem pendentes.

Comandos: `node tests/market-audience.cjs`, `node tests/product-accounts.cjs`, `node scripts/build-first-loop.cjs`, `node tests/market-ui.cjs`.

