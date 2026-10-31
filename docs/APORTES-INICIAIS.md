# Aportes iniciais — versão 0.11

Aplicados a novas jornadas em 31/10/2026:

| Modalidade | Caixa inicial | Condição |
|---|---:|---|
| Próprio | R$25.000 | 100% da empresa, sem dívida |
| Amigos e família | R$50.000 | Sem juros; seis meses de carência; R$2.500 por mês do mês 7 ao 26 |
| Banco | R$80.000 | Dívida de R$80.000; juros iniciais de R$2.000/mês (2,5%); amortização voluntária |
| Venture capital | R$150.000 | Fundador mantém 85%; avaliação trimestral |

A parcela de amigos e família é salva na empresa. Compromissos previstos, fechamento e painel financeiro leem o mesmo valor. Saves anteriores mantêm caixa, dívida e parcelas originais; sem a propriedade de parcela, continuam usando R$1.750/mês. O aporte maior não deposita dinheiro extra numa partida em andamento. Comece uma Nova jornada para experimentar.

Os demais parâmetros da versão jogável 0.10 foram preservados. Os testes de interface agora usam relógio/semente fixos: uma saída aleatória da equipe não pode fazer um teste de outro recurso falhar esporadicamente. A aleatoriedade da partida real permanece inalterada.

As simulações em SIMULACOES-FASE-6.json e .csv foram atualizadas para estes aportes. O relatório FASE-6-INTEGRACAO-BALANCEAMENTO.md registra os números históricos da versão 0.10; a tabela atualizada está abaixo. Mesmas quatro políticas, 12 mercados, quatro capitais, dez sementes e horizonte de 24 meses, total 1.920 partidas. As limitações da amostra e a pendência da inspeção visual real continuam valendo.

## Falência observada até o mês 24

| Estratégia | Próprio | Amigos/família | Banco | VC |
|---|---:|---:|---:|---:|
| Enxuta recorrente | 0,0% | 3,3% | 0,0% | 0,0% |
| Compra única | 1,7% | 10,8% | 0,0% | 0,0% |
| Gasto agressivo | 98,3% | 84,2% | 80,0% | 50,0% |
| Inação | 10,0% | 100,0% | 0,0% | 0,0% |

121 testes nomeados mais integrações passaram. A parcela maior de amigos/família também aumenta o compromisso após a carência; aporte maior não elimina risco de caixa. Os percentuais descrevem apenas as políticas e sementes documentadas.
