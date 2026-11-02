# 0.30 — Correções de pedidos e evolução

## Correções

- A loja só faz uma oferta se tiver alguma aceitação do preço com 20% de desconto, usando o modelo de comprador e a persona do produto. A confirmação repete a validação, inclusive em propostas abertas em saves anteriores. Um preço fora da disposição a pagar não gera receita garantida. A loja continua sendo um evento de pedido especial, não uma amostra aleatória de quatro conversões.
- Antes de cobrar uma melhoria, o motor exige caixa para: investimento + campanha atual em escala 1 + fabricação de 100 unidades da nova distribuição + R$100 de lançamento. A bancada mostra esse total e desabilita o investimento se faltar dinheiro; Voltar mantém a versão anterior. O saldo para lançamento não é debitado nessa etapa: é uma checagem de viabilidade, não uma segunda cobrança.
- O plano é recalculado a cada redistribuição. Isso impede a brecha reproduzida sem mexer em preço, conversão, orçamento, CAC ou dificuldade dos dados. Escolhas posteriores de campanha/lote mais caros ainda precisam caber no caixa.
- Save e chave de persistência 0.29 mantidos. Propostas antigas caras podem ser recusadas. Partidas que já ativaram uma melhoria inviável antes desta atualização não têm rollback automático; esta correção impede novas entradas no problema.

## Diagnóstico das 36 vendas

Mesmo produto, preço R$83,33, persona Sofia, semente 3, 494 visitantes processados, campanha R$550 e CAC R$15. Pedidos especiais recusados.

| Execução do protótipo | Compraram | Aceitaram comprar, mas faltou reserva de aquisição | Demanda observada antes desse bloqueio |
|---|---:|---:|---:|
| Falho | 36 | 2 | 38 |
| Normal | 36 | 19 | 55 |
| Excelente | 36 | 34 | 70 |

O contador de aquisição só aumenta quando o comprador passou pelo teste de conversão, mas o saldo da reserva não cobriu seu CAC. Estes são resultados observados nessa execução, não probabilidades populacionais nem vendas garantidas em outra semente.

A conversão está operando: o produto excelente convenceu 70 compradores contra 38 do falho. O limite financeiro achata ambos em 36, pois `floor(550 / 15) = 36`. A previsão interna em uma amostra fixa de 24 perfis também mudou: 7,98%, 11,06% e 14,23%, respectivamente; não é a taxa realizada da rodada.

Isso é um problema de equilíbrio e de feedback. A verba já modifica o alcance e depois limita rigidamente os compradores. No intervalo testado, melhorar conversão aumenta o número de interessados impedidos de comprar, sem recompensar o jogador com mais vendas. Preço maior ainda importa: margem de 30% resultou em 15 vendas, abaixo do teto.

Próxima mudança recomendada: revisar em conjunto orçamento, alcance e financiamento do CAC para que a demanda incremental possa ser atendida e o jogador veja qual gargalo perdeu vendas. Não retirar o CAC nem adicionar bônus de marketing direto na conversão. Essa mudança de equilíbrio fica separada desta correção, para não esconder regressões.

## Validação

- 7 regressões em `tests/loopholes.cjs`: preço absurdo, proposta antiga, pedido legítimo, cenário normal, melhoria recusada sem cobrança, caixa exato para estreia e melhoria fracassada.
- 10 testes comerciais; integração do HTML 0.30 em DOM/Canvas simulados; suíte principal `tests/game.cjs`; build principal e teste de release.
- Pacote 0.30 independente, com dez scripts e um estilo incorporados.
- Nenhuma validação visual em navegador foi realizada.
