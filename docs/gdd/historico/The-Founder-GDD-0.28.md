# The Founder 0.28 — Campanhas e descoberta

## O que o jogador faz

Você cria um gadget para uma pessoa, escolhe como apresentá-lo, define estoque e preço, rola a estreia e observa as primeiras compras. Os reviews ajudam a decidir entre criar uma nova linha, melhorar o produto ou divulgar o atual.

Esta versão faz campanhas atraírem públicos de idades diferentes, dá reputação à empresa e permite que compradores satisfeitos recomendem o produto. As decisões continuam sendo apostas: a interface não revela pesos de persona, nota técnica de adequação ou uma previsão exata de compradores.

Custos, pontos usados, preço, vendas, estrelas e CAC realizado continuam visíveis. Após a campanha, aparecem pistas qualitativas sobre o público e o desgaste. Pessoas vindas por indicação recebem uma mensagem e um destaque na oficina. A partida 0.27 continua com backup automático.

## Alcance pago

O mercado de gadgets usa uma população fictícia de 100 mil pessoas para balanceamento, dividida em 15% / 25% / 45% / 15% nas idades 18–24 / 25–34 / 35–54 / 55+. Não é uma pesquisa do mercado brasileiro.

A verba é `(150 + 100 × pontos usados) × escala`. As escalas continuam 1, 2 ou 4. Praça determina o custo de contato: loja online R$2, feira R$2,50 e parceiros R$1,70. Custos de abertura e comissão continuam separados, como antes.

Para cada idade a:

```text
N_a = 100.000 × participação da idade no nicho
w_a = d_a × (0,25 + 0,75 × idade da persona_a)
      / soma dos quatro pesos brutos

G_a = 1 + 0,24 × soma[coeficiente da abordagem_a × pontos^0,9]
      + bônus de concentração

Bônus de concentração = 0,03 × (maior pontuação − 2)
                        × coeficiente da abordagem dominante_a
Somente quando a maior pontuação é maior que 2.

E_a = (verba / custo de contato + ajuda da prévia)
      × w_a × G_a × D20 × branding × boca a boca × desgaste

I_a = (N_a − pessoas já alcançadas_a) × [1 − exp(−E_a / N_a)]
```

A prévia adiantada do MVP acrescenta seis oportunidades de atenção antes dos multiplicadores, não seis vendas nem seis interessados garantidos.

Os quatro resultados são arredondados pelo método dos maiores restos, respeitando o limite de pessoas disponíveis em cada idade. As contagens são reservadas quando a campanha é rolada. Simular ou abrir um relatório não consome público nem altera o RNG do D20.

| Abordagem | 18–24 | 25–34 | 35–54 | 55+ |
|---|---:|---:|---:|---:|
| Criadores | 1,60 | 1,30 | 0,75 | 0,40 |
| Demonstração | 0,70 | 1,00 | 1,35 | 1,50 |
| Oferta | 1,20 | 1,45 | 1,15 | 0,90 |

O retorno dos pontos foi ajustado em relação à planilha de proposta: a raiz quadrada incentivava demais a mistura. O expoente 0,9, com um pequeno bônus de concentração, permite estratégias especializadas. A mistura continua podendo vencer conforme persona e desgaste. Os números de interessados da planilha anterior não representam os resultados desta calibração final.

O D20 mantém 0,35 / 0,65 / 1 / 1,45 / 1,80 para crítico / parcial / normal / ótimo / excepcional. Natural 1 continua crítico, independentemente dos modificadores do fundador. O preço continua sendo confirmado antes do D20.

## Quem chega

A campanha cria uma fila com a composição etária efetivamente calculada. Cada visitante recebe a idade da sua faixa; sua persona é sorteada entre as que incluem essa idade. A persona escolhida pelo jogador recebe peso de direcionamento 20, as outras peso 1, multiplicados pela participação daquela idade em cada persona. Isso mantém foco sem eliminar público adjacente.

Pesos de atributos, orçamento, disposição a pagar e chance individual de compra permanecem no modelo 0.27. A composição das pessoas muda; a fórmula de conversão para uma mesma pessoa, produto e preço não muda. Classes de renda continuam fora do modelo.

A interface dá observações como “Jovens adultos apareceram bastante nesta apresentação”. Não mostra composição percentual, tabela de coeficientes ou a combinação ótima. Os reviews continuam dando pistas sobre experiências individuais.

## Reputação da empresa

Branding começa em 1. Todas as avaliações históricas reconhecidas contam uma única vez, inclusive de produtos antigos ainda no catálogo.

```text
reputação = (soma das estrelas − 3 × n) / [2 × (n + 40)]
alvo = limitar(1 + 0,5 × reputação, 0,70, 1,50)
marca nova = marca anterior + 0,10 × (alvo − marca anterior)
```

A atualização acontece no fechamento se houve novos reviews. Reabrir relatório, carregar save ou fechar sem avaliações novas não faz a marca subir. A interface apresenta estados como “Marca pouco conhecida”, “Ganhando confiança”, “Marca respeitada” e “Reputação abalada”, sem o multiplicador numérico.

## Boca a boca e desgaste

O relógio acompanha o jogo. A unidade interna equivale a cinco dias da oficina; boca a boca e pressão de divulgação têm meia-vida de dez dias. Pausar congela esse tempo.

Para cada review, `h = 2^(−idade_em_unidades / 2)`:

```text
n_efetivo = soma dos h
satisfação = soma[h × (estrelas − 3) / 2]
boca a boca = 1 + 0,30 × satisfação / (n_efetivo + 20)
```

Sem reviews, o fator é 1. Reviews ruins podem reduzir alcance; poucos reviews têm pouco peso. A empresa compartilha branding. Cobertura, desgaste e recomendações pertencem à linha de produto e permanecem entre gerações. Uma nova linha começa sua própria descoberta de público.

```text
pressão antes = pressão anterior × 2^(−tempo decorrido / 2)
fator da abordagem = 0,60 + 0,40 × exp(−pressão antes)
desgaste da campanha = média dos fatores ponderada pelos pontos atuais
pressão após = pressão antes + (verba / 550) × pontos da abordagem / 4
```

Trocar a abordagem evita usar apenas uma apresentação desgastada. O público já alcançado continua contado: esperar reduz fadiga, mas não transforma pessoas conhecidas em novos interessados.

## Recomendações orgânicas, com limites

Além de multiplicar o alcance pago, a satisfação pode gerar visitantes sem nova verba. Eles vêm das experiências dos compradores das campanhas pagas; não são um fluxo gratuito infinito.

```text
limite acumulado = piso(0,35 × clientes pagos únicos)
crédito disponível = limite acumulado − interessados orgânicos já gerados
entusiasmo = máximo(0, satisfação) / (n_efetivo + 5)

novos orgânicos = mínimo(
  crédito disponível,
  30 − orgânicos gerados nesta janela paga,
  piso(crédito disponível × entusiasmo)
)
```

Há ainda o limite de pessoas não alcançadas naquela idade. A origem etária vem das avaliações positivas recentes. Sem clientes pagos ou sem satisfação positiva, não surgem novas indicações.

As recomendações entram na fila enquanto as vendas acontecem. Vendas orgânicas não aumentam o limite de recomendações, impedindo uma cascata. Se houver crédito e estoque ao fim da janela, pode aparecer “Deixar as recomendações circularem”. Essa continuação não cobra outra campanha nem outro aluguel. Não há pedido extra garantido de quatro peças nessa janela orgânica.

Visitantes orgânicos também podem desistir, achar caro ou encontrar falta de estoque. A indicação não garante venda.

## Economia e origem das vendas

Vendas orgânicas entram normalmente na receita, comissão, CPV, estoque, caixa e avaliações. Elas ficam fora do denominador do CAC pago. Se um interessado orgânico recebe depois uma campanha paga de reconversão e compra, a aquisição é atribuída a essa campanha paga.

A UI mostra CAC realizado e contribuição usando CAC histórico, sem prever exatamente as compras futuras ao mover o preço. Custos e margem antes da aquisição continuam sendo contas conhecidas. O panorama por produto mantém seus totais e a distinção entre resultado e fluxo de caixa.

## Saves

Mantém a chave `the-founder-universal-v1`. Ao abrir uma partida 0.27, a UI salva o JSON anterior em `the-founder-universal-v1-before-reach` antes de habilitar o novo alcance. O backup não é sobrescrito. O arquivo 0.27 permanece disponível.

Dinheiro, produtos, estoque, avaliações e rolagens são preservados. Uma campanha já em andamento conserva sua quantidade de visitantes e a distribuição antiga até terminar; as próximas usam a nova descoberta. Não se inventa a cobertura etária das campanhas antigas. As métricas de cobertura e os créditos de indicação começam a ser registrados com a atualização. Reviews históricos são reconhecidos uma vez, sem uma alteração instantânea da marca.

## Verificação

- `node tests/game.cjs` e `node scripts/build.cjs`: regressão e pacote do jogo original.
- `node tests/release.cjs`: integração do pacote original.
- `node tests/reach.cjs`: 11 testes de alcance, idades, limites, marca, orgânico, CAC, save e evolução.
- `node tests/reach-ui.cjs`: duas campanhas completas em DOM/Canvas simulado, criação, preço, D20, vendas, reviews, descoberta sem previsão exata e migração com backup.
- `node tests/reach-simulation.cjs`: 1.400 combinações de campanha, persona e desgaste. Seis distribuições vencedoras distintas, incluindo concentração e mistura. Doze campanhas consecutivas preservaram limites de cobertura e orgânico. A aquisição de 10% nessa simulação é uma hipótese fixa para alimentar o teste de recomendações, não a conversão do jogo.
- Regressões de atributos universais, público, evolução e contabilidade passaram.

O pacote 0.28 é um HTML independente com nove scripts e um estilo incorporados. Não houve validação visual em navegador real nem playtest humano de diversão nesta etapa.
