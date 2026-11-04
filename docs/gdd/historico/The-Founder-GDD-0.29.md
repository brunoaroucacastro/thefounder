# The Founder 0.29 — Pesquisa, produto e lançamento

## O jogo

Um jogo de criar gadgets, entender pessoas e encontrar uma forma sustentável de vender. A oficina, os visitantes e os reviews mostram os resultados. O jogador não recebe os pesos das personas, os requisitos mínimos em números ou uma previsão exata da melhor campanha.

O loop é: escolher um gadget → pesquisar o mercado → escolher uma das duas personas encontradas → distribuir pontos do MVP → escolher praça e campanha → desenvolver e testar no D20 → escolher lote → conhecer CAC e custo total → escolher preço → rolar o alcance da campanha → fabricar e vender por uma janela limitada → analisar os reviews e decidir entre divulgar novamente, melhorar ou criar outro produto.

## Pesquisa de mercado e navegação

- A escolha do produto vem antes da pesquisa. Pesquisa de mercado custa R$1.000, leva tempo e entrega duas opções da base daquele gadget.
- Fones têm as dez personas pesquisadas pelo usuário. Mouse, teclado e caixa de som ainda usam suas três personas provisórias. As pesquisas mostram duas, sem sugerir que todos esses bancos já têm dez.
- Uma nova rodada custa outros R$1.000 e troca pelo menos uma opção, quando a base permite. O sorteio é persistido, sem consumir o RNG do D20 nem mudar ao recarregar.
- Os cartões mostram nome, faixa etária, rotina/dor e uma pista qualitativa da exigência mínima. A faixa textual da pesquisa é a informada para o perfil; o alcance continua usando os quatro grupos etários do mercado simulado.
- A persona reaparece na bancada de atributos e no planejamento da divulgação, com idade e necessidade.
- Antes de investir no MVP, é possível descartar o projeto e voltar ao catálogo. Pesquisas pagas não são reembolsadas e continuam nas despesas. O descarte não cria outra empresa nem apaga histórico ou caixa.

## Produto e exigências mínimas

Os seis atributos continuam Qualidade, Durabilidade, Desempenho, Praticidade, Versatilidade e Economia. Pesos por persona: 50%, 30%, 10%, 10%, 0% e 0%. MVP com até quatro pontos; evolução até 15, máximo cinco por atributo. Não existem penalidades automáticas de oposição entre eixos.

```text
Nota ponderada = soma(pontos × relevância)
Adequação bruta = nota ponderada / 4,5
Adequação efetiva = adequação bruta × atendimento do mínimo
```

Uma exigência por persona, em atributo com peso positivo. Para mínimo de dois: zero pontos aplica fator 0,65; um aplica 0,90; dois ou mais, 1. Para mínimo de um: zero aplica 0,65 e um ou mais, 1. Não se soma outra penalidade do mesmo requisito dentro da conversão ou do review.

| Persona de fone | Exigência interna |
|---|---|
| Clara, ambiente barulhento | Qualidade 1 |
| Luna, estudante | Desempenho 1 |
| Daniel, transporte | Durabilidade 2 |
| Ravi, exercícios | Durabilidade 2 |
| Leo, gamer | Qualidade 1 |
| Bia, chamadas e aparelhos | Praticidade 1 |
| Marina, viagens | Durabilidade 1 |
| Sofia, música | Desempenho 2 |
| Paulo, cansou de defeitos | Qualidade 1 |
| Ana, privacidade | Praticidade 2 |

Os perfis provisórios dos demais gadgets usam uma exigência de um ponto em atributo relevante. Os números são dados de design para o responsável pelo jogo; a interface dá pistas, sem revelar a tabela.

Adicionar atributo irrelevante é neutro para a nota e para a conversão, mantendo preço e contexto. Economia reduz fabricação sem reduzir a referência de valor. Retirar pontos relevantes pode reduzir a adequação. Se um novo projeto mais caro receber outro preço, o efeito de pricing é separado da nota.

## Valor percebido e conversão

A compra não depende mais do antigo orçamento fixo em reais da persona. A escala de valor acompanha a construção útil do gadget, a adequação, a execução e a reputação recente do produto.

```text
Referência de valor = máximo(12,
  custo básico da família
  + soma[custo positivo do atributo × pontos × reconhecimento])
Reconhecimento = mínimo(1, peso do atributo / 0,30)
```

Economia e descontos de lote não reduzem essa referência. Ela não inclui CAC nem uma taxa sobre o preço. Custo básico e custos dos atributos são as referências de projeto; não se trata de deixar uma alteração de preço de fornecedor produzir valor automaticamente.

```text
A = adequação efetiva
E = 0 / 0,5 / 0,8 / 1 para execução com falha / normal / ótima / excepcional
S = sinal de boca a boca entre −1 e 1, suavizado por volume e idade dos reviews

Tolerância = máximo(0,8, 1,25 + 1,50 A + 0,35 E + 0,35 S)
Conversão máxima = 0,10 + 0,75 A + 0,05 E
Preço relativo = preço final ao consumidor / referência de valor
Chance = conversão máxima × limitar(
  (tolerância − preço relativo) / (tolerância − 0,5), 0, 1)
```

Cada visitante passa pelo sorteio individual estável e precisa encontrar estoque e capacidade de aquisição disponível. Preço excessivo pode zerar compra; preço baixo aumenta aceitação até o teto, sem garantir vendas. Marketing, verba, abordagem, CAC e D20 da campanha não são multiplicadores dessa chance.

As campanhas mantêm a composição etária, alcance e desgaste da 0.28. Na reconversão, o D20 altera a quantidade de convites, não a vontade individual de comprar. Produto, preço e reviews podem ter mudado desde o contato anterior. Não há bonus direto de demonstração, oferta ou criador na conversão.

## CAC e precificação

O CAC contratado é definido antes do preço e apresentado em reais. Nesta calibração inicial, usa internamente 25% do custo unitário de produção considerado no planejamento: custo do lote na estreia, ou custo médio do estoque disponível para uma nova campanha. O percentual fica oculto ao jogador. O CAC é fixado para cada contrato; mudanças posteriores de preço não o alteram.

```text
Custo total planejado por venda = produto + CAC
Contribuição por unidade = preço − produto − CAC
MC = contribuição / preço
Preço pela margem = (produto + CAC) / (1 − MC)
```

Exemplo: custo R$40, CAC R$10, total R$50. Preço R$60 resulta em contribuição de R$10 e MC16,67%. Preço R$45 resulta em contribuição de −R$5 e MC−11,11%.

O jogador pode usar o controle de margem ou digitar qualquer preço positivo em centavos, inclusive com margem negativa. A faixa do slider é só um atalho; não limita a entrada livre. A contribuição ainda precisa cobrir desenvolvimento e operação. Não são mostrados pesos, preço ótimo ou uma quantidade de compradores prevista por fórmula.

## Reserva e cobrança da aquisição

Para o CAC ser conhecido e não ser cobrado duas vezes, a versão usa contratação por cliente:

- A verba da campanha fica reservada e sai temporariamente do caixa disponível.
- Ela alimenta o cálculo de alcance, não a probabilidade individual de compra.
- Cada novo cliente pago consome uma vez o CAC combinado dessa reserva. Não existe comissão percentual sobre a receita.
- Um pedido de quatro unidades do mesmo cliente consome um CAC, não quatro. A MC planejada por unidade pressupõe uma peça por cliente; pedidos maiores podem ter aquisição amortizada.
- Recomendações orgânicas não consomem CAC. Uma reconversão paga de um interessado vindo por indicação é aquisição paga daquela campanha.
- Se a reserva não cobre outro cliente, há um limite operacional de aquisição: isso aparece como campanha sem verba disponível, separado de uma recusa por produto ou preço. A chance individual não é modificada para disfarçar esse limite.
- O saldo não usado volta ao caixa quando a janela fecha. Reabrir o relatório não devolve nem cobra novamente.

É uma abstração de aquisição contratada por cliente, não um modelo de anúncios cobrados por clique com CAC realizado desconhecido. O panorama registra aquisição consumida como despesa. Reserva pendente é caixa indisponível e entra no total reservado, sem reduzir o lucro até ser consumida. Estoque comprado e CPV vendido continuam separados.

## Campanha com contexto

A etapa apresenta a persona novamente e explica as alternativas sem antecipar qual vence: criadores apresentam a novidade a uma comunidade; demonstração mostra a solução funcionando; oferta destaca a condição de compra sem mudar automaticamente o preço. A abordagem muda quem descobre o produto. O dado muda alcance e execução da apresentação.

## Reviews e aprendizado

Uma avaliação de um comprador real a cada dez unidades vendidas. O review usa a adequação efetiva, execução, preço efetivamente pago e variação individual. A expectativa agora é relativa ao valor do gadget, não ao orçamento antigo da persona.

```text
Expectativa = limitar(0,18 + 0,28 × preço pago / referência + exigência individual, 0,18, 0,90)
Atendimento = limitar(adequação efetiva / expectativa, 0, 1,35)
Benefício = limitar(1 − preço pago / preço limite sem boca a boca, −0,5, 1)
Estrelas = limitar(arredondar(1 + 2,2 × atendimento + 0,8 × benefício + variação), 1, 5)
```

Não se usa o próprio sucesso dos reviews para fazer os reviews seguintes elogiar automaticamente o produto. Uma exigência não atendida aparece em comentários de uso, sem revelar seu número. Um comprador pode considerar o preço bom e ainda apontar uma fraqueza; não se força uma nota ruim adicional após o requisito já afetar a experiência.

O boca a boca orgânico limitado e o branding da 0.28 permanecem: indicações dependem de compradores pagos e experiências positivas, sem cascata infinita. Subsidiar compras pode ajudar a ganhar avaliações, mas consome estoque, dinheiro e reserva. Não foi declarada uma estratégia ótima universal.

## Estoque e ciclo de vida

- O HUD destaca unidades prontas, unidades em produção e tempo restante da janela.
- É possível pedir reposição enquanto há estoque e compradores, ou preparar um lote entre rodadas. Nina trabalha enquanto o tempo corre.
- O lançamento abre depois da produção inicial. A janela dura **até sete dias do relógio do jogo**, ou até atender o público da rodada.
- O tempo não se estende automaticamente quando chegam indicações. Pausar congela o relógio.
- Ao terminar, os contatos não atendidos ficam identificados; a reserva restante é devolvida. Não há vendas perpétuas no fundo do cenário.
- O jogador escolhe nova campanha para o mesmo produto, melhoria/relançamento ou uma nova linha. Uma nova campanha abre outra janela.
- Estoque restante continua sendo um ativo guardado. Ao partir para outra linha, ele não continua vendendo automaticamente. Reativar linhas antigas pelo catálogo não faz parte desta etapa.
- Uma produção iniciada antes do fim pode terminar enquanto o resultado está aberto. Não se permite trocar de produto ou gerar outra versão com esse lote em trânsito, para não atribuir unidades ao projeto errado.

O caixa necessário para pelo menos cem unidades é conferido antes de pagar o MVP. Lotes escolhidos maiores também precisam caber no caixa antes de avançar para preço e dado. Isso evita prender o jogador num lançamento já pago sem conseguir fabricar a quantidade mínima.

## Compatibilidade e escopo

Nova economia usa a chave separada `the-founder-contract-v1` e exige uma partida nova. O arquivo 0.28 e o save anterior `the-founder-universal-v1` são preservados, sem reescrever seus contratos ou resultados. Não há migração automática de campanhas antigas para contratos de CAC.

O custo e a dificuldade do último upgrade não foram alterados: essa parte continua aguardando decisão do usuário. Cultura, demais modelos de empresa e outras funcionalidades de backlog também não foram adicionados por suposição.

## Validação

Dez testes de regras e poucos fluxos representativos: pesquisa/repetição/descarte, mínimos graduais, atributos irrelevantes, independência da campanha, preço negativo após CAC, reviews, reserva/refundo, CPV e caixa, reposição, fim da janela, nova campanha, pedido com quatro peças e lote em produção no encerramento.

Integração do HTML em DOM/Canvas simulado: duas personas com idade, lembrete na bancada, descartes, pesquisa paga, preço livre subsidiado, reserva conhecida, estoque, encerramento, segunda campanha e persistência sem tocar no save anterior. Regressões dos atributos, público, evolução, contas e jogo original passaram. Não houve varredura massiva de probabilidades.

O pacote independente incorpora dez scripts e um estilo. Não houve validação visual em navegador real nem playtest humano de diversão nesta etapa.
