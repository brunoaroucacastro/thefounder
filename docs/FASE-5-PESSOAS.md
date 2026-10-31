# Fase 5 — Pessoas — protótipo 0.9

## Recrutamento

Abrir seleção consome uma ação e R$1.200 (R$600 com habilidade de pessoas). Escolhe-se uma área e uma especialidade. No fechamento, surgem três candidatos, disponíveis para a agenda do próximo mês. Não há contratação na mesma rodada da abertura. As opções são Júnior nível 1, Pleno nível 3 e Sênior nível 4, com salário base, 1,6× e 2,2×. A geração é determinística; não inventa rolagens fora do D20 central.

Bases mensais: Produto R$4.500; Marketing R$3.500; Suporte R$2.800; Financeiro R$3.800. Contratar usa uma ação, encerra as outras opções da seleção e inclui o salário neste fechamento. Até quatro seleções abertas, até 12 pessoas. Encerrar uma seleção usa uma ação e não cobra dinheiro. Candidatos permanecem até contratação ou encerramento.

Especialidades: Produto (desenvolvimento, pesquisa), Marketing (busca, SEO, redes sociais), Financeiro (fornecedores, crédito, benchmarks), Suporte (atendimento). D20 considera o melhor especialista, com teto +4; contratar juniores repetidos não soma bônus. Capacidade de atendimento cresce com o trabalho da equipe, como anteriormente.

## Treinamento e promoção

Uma tentativa por pessoa/mês. Custa R$1.000 × nível atual, com dificuldade 9 + 2 × nível (11,13,15,17). Nível máximo 5. A prévia supõe sucesso e reserva o salário promovido. No resultado real, sucesso aumenta um nível, salário em 20% e motivação em 10 pontos; falha/1 natural consomem o custo, mantêm nível/salário e reduzem motivação em 5. Salário novo é devido no próprio mês. Treinar ativa a área da pessoa, uma única vez, independentemente do resultado.

Senioridade visual: nível 1 Júnior; 2–3 Pleno; 4 Sênior; 5 Especialista. Desligamento custa um salário de rescisão e retira a pessoa antes dos custos e bônus operacionais desse mês; colegas perdem 5 de motivação.

## Motivação individual

Cada pessoa tem 0–100; o HUD antigo mostra a média (82 sem equipe). Migrar herda a antiga motivação global sem perder salário, identidade ou agenda. Novos funcionários iniciam em 82; colegas ganham 5 na contratação.

Após ações e resultado operacional, antes da retenção:

- Prejuízo OU receita abaixo de 80% do mês anterior: −5 uma única vez. Se ambas ocorrerem, não acumulam.
- Sem a penalidade anterior, receita acima de 120%: +5. Sem histórico positivo, não se calcula crescimento percentual.
- Área com ação executada: +5; sem atividade: −5, apenas uma vez por mês. Tentativas falhas contam como trabalho, ações puladas não. Suporte é ativo quando há clientes. Treinar ativa a área; recrutamento e reunião não ativam automaticamente todas as áreas.
- Reunião usa uma ação e ocorre no máximo uma vez por mês: naturais 1–5 −5, 6–10 zero, 11–15 +5, 16–20 +10 para todos. O resultado 5 foi incluído na primeira faixa. Sem modificadores nesta tabela.
- Elogio trimestral já existente conserva +8 para todos. A antiga perda global automática mensal e a antiga saída aleatória foram substituídas.

## Retenção

Uma rolagem D20 por empresa/mês para a pessoa menos motivada; empate usa ID estável. No máximo uma saída. Evita multiplicar verificações por contratar uma equipe maior. Usa motivação final após mudanças do período:

| Motivação | Sai com natural | Permanece |
|---|---|---|
| 0–9 | 1–16 | 17–20 |
| 10–34 | 1–12 | 13–20 |
| 35–75 | 1–6 | 7–20 |
| 76–100 | apenas 1 | 2–20 |

Saída ocorre após o fechamento: salário e bônus desse período foram utilizados, retirados a partir do próximo mês. Não gera rescisão nem aplica penalidade de demissão voluntária aos colegas. Relatório salva dado, faixa aplicada e mensagem. Rever/pular animações não repete rolagens, custos ou efeitos. A probabilidade e o impacto de salários ainda são parâmetros experimentais para a Fase 6; mesmo o caso mais motivado mantém 5% na verificação mensal.

## Compatibilidade e validação

Schema 6, backup `the-founder-v1-backup-before-people`; não cobra recrutamento retroativo. Hires antigos já serializados continuam executáveis e promoções/reuniões antigas são encaminhadas às novas regras. Novos controles de contratação abrem seleção. Níveis antigos acima de cinco são limitados a cinco sem reduzir salários.

`node tests/game.cjs`: regras anteriores, 21 testes novos de pessoas e integração DOM simulada (seleção tardia, contratação, agenda, migração/backup, D20 persistente e rollback se salvar falhar). `node scripts/build.cjs`: HTML independente, oito estilos e treze scripts, sintaxe validada. Testes DOM simulados não comprovam aparência ou cliques reais no navegador. Nenhuma calibração da Fase 6 é alegada nesta entrega.
