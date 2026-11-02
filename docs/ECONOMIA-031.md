# 0.31 — Alcance e CAC por unidade

## Implementado

- CAC em reais definido por versão antes do preço: 25% do custo básico do produto, antes do desconto industrial do lote. A aquisição paga é liquidada por unidade vendida, inclusive quatro CACs no pedido especial de quatro unidades. Recomendações orgânicas não consomem CAC.
- Fim da reserva fixa de R$550: preparar campanha não cobra essa verba e não cria um limite de 36 aquisições. Falta de caixa real para liquidar uma venda ainda é registrada como restrição de caixa, separada da conversão.
- Desconto de fabricação melhora o custo industrial, sem reduzir automaticamente o CAC.
- Alcance por quatro idades, população disponível e pontos de apresentação; coeficiente base 0,004 e coeficientes por canal/idade da proposta testada. Marca, boca a boca, desgaste e saturação continuam funcionando.
- D20 da campanha entre 0,60 e 1,40. A conversão individual continua dependendo de produto, persona, preço e boca a boca, sem bônus direto de promoção.
- Chegadas distribuídas pela janela de sete dias conforme o volume: não há mais um limite comercial de aproximadamente 494 avaliações por rodada. Retarget recebe apresentação em até um dia, para não fazer os próprios interessados expirarem artificialmente na fila de sete dias.
- Retirada da escala monetária 1×/2×/4× das campanhas atuais. Sem verba fixa, esses controles dariam alcance extra gratuito; os quatro pontos, o D20, o público e o desgaste determinam o alcance.
- Fechamento separa os números da janela de venda e o resultado acumulado: contatos, demanda de compra, unidades vendidas, recusas por preço, demanda perdida por estoque, restrição de caixa para CAC e lucro operacional. Um pedido especial conta quatro unidades de demanda, não quatro visitantes.
- O panorama continua mostrando investimento, resultado acumulado e estoque como ativo. Histórico antigo sem unidades pagas suficientes não ganha um CAC unitário fictício.
- Preflight da melhoria preservado, agora sem exigir a antiga reserva de campanha; checa desenvolvimento, lote mínimo e abertura.

## Não alterado nesta etapa

O MVP continua em R$8.000, os pontos seguem os limites aprovados, o preço pode dar contribuição negativa e o custo fixo continua em R$900 por encerramento. O calendário do aluguel e a hipótese de R$210 por sete dias ficaram para uma decisão separada. O novo sistema de aprendizado com dado está descrito em `PROPOSTA-APRENDIZADO-D20.md`, sem implementação ainda.

## Saves

A chave de save continua a mesma. A interface salva um backup com sufixo `-before-unit-cac` antes de migrar uma partida comercial anterior. Reservas abertas devolvem somente o saldo ainda não consumido, uma única vez. Gastos, vendas e histórico anteriores são preservados; aquisição futura segue a regra por unidade. A janela que estava em andamento preserva seu prazo restante; novas janelas recebem uma linha de base separada. Os registros históricos acumulados são identificados quando não têm essa base.

## Validação

- Dez testes novos em `tests/unit-economy.cjs`: cobrança, orçamento zero, desconto/CAC, fluxo de caixa, margem, quatro unidades por pedido, preço absurdo, variação de execução, canal/idade, D20, nova janela, migração, melhoria, falta de estoque, reposição e retarget.
- Dez testes do contrato anterior e sete das brechas anteriores continuam como regressões explícitas das regras antigas, com `unitAcquisition:false`. A partida atual usa o modelo novo por padrão.
- Integração do HTML 0.31 em DOM/Canvas simulados, incluindo troca de campanha, backup e reload sem reembolso duplicado. Não houve validação visual em navegador.
- Seis cenários de ponta a ponta no motor atual, disponíveis em `ECONOMIA-031-CENARIOS.json`.
- Suíte principal `node tests/game.cjs`, build principal e teste de release preservados.

Na execução de comparação controlada, produto alinhado a R$95 vendeu 49 unidades e a execução excelente do mesmo projeto vendeu 76, com lucro operacional de R$80 e R$620 respectivamente. Produto desalinhado e preço excessivo venderam zero. Esses são resultados de uma semente, com reviews e boca a boca reais do motor; não são médias da planilha hipotética anterior nem uma promessa de rentabilidade.
