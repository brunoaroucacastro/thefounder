# Os 4Ps — revisão 0.23

## Revisão 0.23 — produto, preço, praça e promoção

O MVP passa a ter custo fixo de R$8.000, inclusive quando o próximo projeto já foi preparado. A preparação reduz tempo, sem reduzir esse piso. Produção e campanha são compromissos separados. O caixa inicial permanece R$25 mil.

Personas mostram a dor e o contexto, sem revelar orçamento confortável. O MVP aceita de zero a quatro pontos, com contador explícito. Os eixos passam a usar linguagem cotidiana: Mais barato, Mais rápido, Dura mais, Mais caprichado, Fácil de reparar e Mais compatível. Os pares opostos e a aderência continuam. Cada ponto fora de economia aumenta materiais por unidade; economia reduz materiais até o piso de R$12. O custo variável não é o custo fixo de desenvolvimento. Materiais de estoque continuam pagos antes da venda; não são cobrados novamente ao vender.

### Os 4Ps

1. Produto: persona, radar de até quatro pontos e nome, sem preço nesta tela.
2. Preço: slider de margem bruta entre 10% e 80%. Preço = custo unitário ÷ (1 − margem). Exemplo: custo R$50 e margem 50% resultam em preço R$100, sobra bruta R$50. Não é markup. Essa sobra ainda precisa cobrir comissão, promoção, aluguel e desenvolvimento; não é lucro líquido.
3. Praça: loja online (abertura R$350, 5% de comissão, alcance base 180), feira de tecnologia (R$600, sem comissão, base 110) ou lojas parceiras (R$200, 20% de comissão, base 260). A comissão só sai em venda realizada.
4. Promoção: até quatro pontos próprios entre mostrar funcionando, espalhar a novidade e explicar o valor. Preparação custa R$150 mais R$100 por ponto. Alcance e conversão respondem a alavancas distintas. A feira favorece demonstrações; explicar o valor não aplica desconto automático.

Depois dos 4Ps aparece a criação, com desenho, descrição, atributos, preço, praça e investimento detalhado. É possível voltar e revisar antes de investir. A construção e a preparação acontecem no cenário. O D20 não participa deste MVP nem desta campanha: execução é direta e os resultados derivam das decisões, sem novos sorteios escondidos. A dinâmica do dado fica preservada nas versões anteriores para eventual reutilização futura.

### Tempo, continuidade e avaliações

O relógio aparece no topo: 60 segundos simulados representam um dia de trabalho; pausa e velocidade 1×/3× afetam projetos e vendas. O relógio continua na próxima criação. O tempo pausa no fechamento e nas oportunidades que exigem resposta. Ainda não é a simulação mensal completa do jogo original.

Durante as vendas há visitantes, estoque e bancada compartilhada. Uma janela concluída permite continuar vendendo o mesmo produto, repor e tentar recuperar o investimento sem pagar outro MVP. Cada fechamento cobra R$900 adicionais de operação; o histórico mantém uma entrada cumulativa por produto, sem duplicar lançamentos. O plano de promoção existente continua trazendo novas ondas de visitantes.

A cada dez unidades efetivamente vendidas por produto surge uma avaliação de 1 a 5 estrelas com feedback do comprador. A nota deriva de aderência e percepção de preço, sem dado oculto. Na oficina aparecem estrelas e um aviso; as avaliações recentes ficam num mural. Reviews são salvos junto da venda e não se repetem ao recarregar. Estoque anterior mantém sua contagem e também gera avaliações no catálogo. Estes dados ainda não desbloqueiam soluções automáticas nem alteram reputação: são a base para a próxima discussão.

Save separado: `the-founder-fourps-v1`; preservadas as partidas anteriores. Comandos novos: `node tests/fourps.cjs`, `node scripts/build-first-loop.cjs`, `node tests/fourps-ui.cjs`. Dez testes novos de regras cobrem custos, margens, comissões, tempo, reviews, continuidade e conciliação. A integração executa o HTML independente em DOM/Canvas simulados; inspeção visual real em navegador continua pendente. Regressões anteriores também são verificadas.

