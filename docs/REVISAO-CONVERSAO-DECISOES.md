# Revisão de conversão — decisões em discussão

Registro em 02/11/2026. Documento de decisões para a próxima atualização consolidada. Não implica implementação no jogo 0.28.

## Processo

Revisar os pontos da análise crítica um a um com o usuário. Registrar as decisões agora e alterar o código apenas na atualização final. Não repetir varreduras massivas; preferir poucos casos representativos que revelem problemas de lógica e gameplay.

## Ponto 1 — aquisição, CAC e conversão — aprovado

Diretriz do usuário: “Pode calcular em % mas chame de CAC (valor fixo em R$). [...] campanha (CAC) deveria aumentar numero de interessados, mas nao influenciar conversão.”

- Apresentar o CAC em reais, não como percentual na interface. O cálculo interno poderá partir de um percentual, convertido em valor monetário.
- Investimento em campanha aumenta o número de interessados. Não aumenta diretamente a probabilidade individual de compra.
- Para a mesma pessoa, produto, preço e avaliações, mudar investimento, abordagem, taxa de aquisição ou resultado do D20 da campanha não dá um bônus direto de conversão.
- Retirar, na revisão final, os bônus diretos de demonstração e oferta da conversão. Rever também o bônus de eficácia das campanhas de reconversão: pagar para apresentar de novo não deve, por si só, convencer mais.
- Preservar o papel das abordagens e da demografia no alcance já aprovado. Uma campanha pode mudar quem chega, o que pode mudar a conversão agregada; isso não é um multiplicador de compra dado pela campanha.
- Custos de aquisição e valores pagos a intermediários não entram no valor percebido pelo comprador. Se a empresa mudar o preço para cobrir esses custos, a reação acontece ao novo preço, não ao custo interno.
- Na consolidação financeira, explicitar a composição e a base do CAC em reais, mantendo identificáveis verba total, interessados e clientes adquiridos. Não contar o mesmo gasto duas vezes. A fórmula financeira definitiva não foi alterada nesta rodada.

## Ponto 2 — atributos e nota sem penalidade implícita — aprovado

- A nota é a soma linear dos pontos de cada atributo multiplicados por sua relevância para a persona. A normalização usa uma referência máxima fixa, não o total de pontos distribuídos.
- Exemplo: cinco pontos em Qualidade com peso de 50% somam 2,5 na nota ponderada. Adicionar cinco pontos em Economia com peso zero mantém os 2,5. Não dilui nem reduz a nota.
- Adicionar pontos a um atributo com relevância zero não melhora a nota, mas também não deve diminuir a conversão por uma penalidade implícita desse atributo. Mantendo preço, pessoa e demais condições, a conversão permanece igual.
- Acrescentar pontos a um atributo com peso positivo nunca reduz a nota. Não há efeito negativo automático entre atributos.
- Se o jogador redistribuir pontos, retirando-os de um atributo relevante, a nota pode cair pelo que foi retirado. Exemplo: tirar um ponto de Qualidade de peso 50% para colocá-lo em Economia de peso zero reduz a soma ponderada em 0,5.
- Economia reduz o custo real de produção, sem reduzir automaticamente o valor percebido, a nota ou a chance de compra. Ela ainda contribui positivamente para a nota quando a persona lhe dá peso.
- Uma mudança posterior no preço pode afetar a conversão pela regra de pricing. Isso deve ser separado do efeito de adicionar pontos: recalcular preço a partir de um custo diferente não é uma penalidade direta do atributo. A regra financeira de pricing será consolidada depois.
- Invariantes para a implementação final: adicionar ponto de peso zero conserva a nota e a conversão ao mesmo preço; adicionar ponto relevante não reduz a nota; remover ponto relevante pode reduzir a nota. Não testar essa regra confundindo adição com redistribuição ou alteração de preço.

## Ponto 3 — CAC conhecido antes do preço e contribuição após aquisição — aprovado

Esta decisão detalha o ponto 1 e substitui, na revisão final, o cálculo de aquisição como comissão percentual sobre o preço de venda.

- Não apresentar nem modelar esse custo de aquisição como comissão sobre o preço de venda.
- Definir o CAC unitário em reais antes da precificação. Para a parametrização interna, ele pode ser calculado como percentual do custo unitário de produção: `CAC = custo unitário × percentual interno da campanha`.
- Exemplo aprovado: produto custa R$40; percentual interno de 25% resulta em CAC de R$10; custo unitário mais aquisição é R$50. O percentual é um exemplo de balanceamento, não uma regra universal fixada para toda campanha.
- O jogador vê **CAC: R$10**, não vê a fórmula ou o percentual interno que originou o valor. O CAC não depende do preço que o jogador escolher depois.
- A sequência é: conhecer custo do produto e CAC; mostrar o total unitário; escolher o preço; mostrar a contribuição após aquisição.
- Fórmulas de precificação: `contribuição por unidade = preço − custo unitário − CAC`; `margem de contribuição = contribuição por unidade / preço`. Para um preço derivado da margem: `preço = (custo unitário + CAC) / (1 − margem)`.
- Permitir escolher livremente o preço positivo, inclusive vender abaixo do custo total e operar com margem de contribuição negativa. Não obrigar venda acima do ponto de contribuição zero.
- Exemplo: com custo mais CAC de R$50, preço de R$60 gera contribuição de R$10, ou 16,67%; preço de R$45 gera contribuição de −R$5, ou −11,11%. Contribuição positiva ainda precisa recuperar desenvolvimento e demais despesas da empresa.
- Vender com contribuição negativa pode ser uma estratégia deliberada para ganhar compradores, avaliações e depois aumentar o preço. Essa possibilidade não é erro a bloquear automaticamente.
- Preservar o ponto 1: a campanha aumenta interessados, sem multiplicador direto de conversão. O preço escolhido é que pode mudar a probabilidade de compra.
- Na atualização consolidada, alinhar verba total da campanha, volume de interessados e cobrança desse CAC unitário, para não cobrar a aquisição duas vezes. O usuário definiu aqui a base de cálculo e a apresentação; o mecanismo de cobrança/geração de interessados deve respeitar essa definição, sem reintroduzir comissão nem trocar silenciosamente CAC planejado por um valor realizado diferente.

Precisão de nomenclatura para o design interno: R$40 de custo de produto divididos por R$10 de CAC representam relação custo/CAC de 4, não ROAS. ROAS usa receita atribuída à publicidade dividida pelo gasto publicitário e depende do preço de venda. A interface desta etapa mostra apenas CAC, como solicitado.

## Demais pontos

Custo/recompensa de evolução; concentração de atributos; relação de reviews com a nova precificação: aguardam discussão e decisão. A sugestão anterior de impor uma margem inicial de 5% a 15% não foi aprovada: prevalecem contribuição após CAC e liberdade de preço do ponto 3. As recomendações da análise crítica não são decisões automaticamente aprovadas.

## Implementação consolidada 0.29 — 02/11/2026

Pontos 1–3 e mínimos graduais implementados em nova partida de save separado. Uma exigência de um ou dois pontos por persona; fator 0,65 em zero, 0,90 com um quando exige dois e 1 no mínimo. Pesquisa de mercado R$1.000 com duas opções e idades, descarte, contexto de campanha, estoque/reposição e janela de sete dias adicionados conforme comentários posteriores. CAC contratado por cliente é consumido de uma reserva; saldo não usado volta ao fim. Alterações no custo/recompensa do último nível continuam pendentes. Ver GDD-029-MERCADO-E-PRODUTO.md.
