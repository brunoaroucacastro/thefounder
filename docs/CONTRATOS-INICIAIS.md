# Contratos iniciais — versão 0.17

Novas jornadas: banco de R$80.000 amortizado em 12 fechamentos, do mês 1 ao 12. Mantida taxa fictícia de 2,5% ao mês sobre o saldo devedor. Sistema de principal constante: R$6.666,67 por mês, último principal ajustado aos centavos. Primeiro pagamento R$8.666,67 (principal + R$2.000 de juros), segundo R$8.500. Juros caem junto com o saldo. Principal fica separado de juros na DRE e conciliação. Amortização antecipada continua possível. Se faltar caixa, valem as regras de atraso bancário e score existentes.

Amigos/família: R$50.000 sem juros, sem pagamentos nos meses 1–5, devolução integral no fechamento do mês 6. A previsão de caixa inclui os R$50.000 ao planejar esse fechamento. Se faltar caixa, não há pagamento parcial: saldo permanece, confiança cai 15 e o valor integral volta a ser exigido no próximo fechamento.

Próprio R$25.000 e VC R$150.000 mantidos. Novas propostas negociadas com bancos mantêm os prazos e condições obtidos por D20; a mudança de 12 meses refere-se ao capital bancário inicial.

Contratos de partidas anteriores foram preservados, sem cobrança retroativa. A configuração inicial é idempotente e não cria dinheiro nem duplicações de contrato.

Verificação: oito testes específicos de contrato cobrem 12 pagamentos, juros decrescentes, quitação, antecipação, mês exato, atraso integral, reload e compatibilidade. Teste do HTML final cobre a seleção e o contrato salvo. Simulações históricas anteriores não representam essas novas condições; o simulador passa a inicializá-las.
