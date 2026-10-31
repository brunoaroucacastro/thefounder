# Menus e fechamento — versões 0.18 e 0.19

Direção escolhida pelo jogador: pixel art vibrante e acolhedora, com referência ao clima de Game Dev Tycoon.

## Menus

Navegação entre áreas dentro da própria janela, cabeçalho compacto com founder pixel, corpo com rolagem própria e mais altura. Barra de ferramentas duplicada some nas abas; agenda continua somente no escritório. Bloco Missão permanece removido. Produto mostra as ações principais antes dos gráficos. Funil de marketing, curva de adoção e explicações secundárias ficam expansíveis. Cores por área, paleta de creme/verde/azul/rosa, botões com feedback de clique e personagem piscando. Criador e escritório também recebem a paleta. Movimento reduzido desativa animações.

## Fechamento

D20 continua no fluxo. Depois dos dados, um resumo apresenta: resultado operacional, mudança no caixa, compradores, conquistas factuais e alertas. Lançamento, primeiro faturamento e primeiro lucro recebem destaque; os dois primeiros marcos financeiros exigem histórico completo para não inventar um primeiro resultado em save incompleto. Mês sem progresso não recebe conquista falsa. Um empréstimo que aumentou caixa não se transforma em lucro.

Alertas incluem prejuízo, insuficiência frente a compromissos previstos, falhas críticas, ações dependentes puladas, cancelamentos, saídas, obsolescência e atrasos. Reunião neutra não é tratada como fracasso. Receber uma oferta não significa ter desconto aplicado ou dinheiro depositado: os textos de ação preservam essa diferença.

A sugestão de próxima área é heurística e não garante estratégia ótima. A prioridade é falência/aprendizados, caixa comprometido, candidatos disponíveis, insatisfação com produto, lançamento pendente e demais sinais do mês. Compromissos usam uma projeção sem a agenda futura do jogador; o relatório anterior não é reinterpretado por novas ações planejadas.

O relatório completo antigo permanece em Ver números completos; replay dos dados é preservado. Som breve é opcional, depende de o áudio já estar ligado e toca uma vez por relatório/sessão. Falha de áudio não bloqueia resultados. Marcadores animados e pequenos destaques não mudam economia ou prêmios.

## Segurança do estado e verificação

MonthRecap.derive lê o relatório canônico e não modifica estado, RNG ou meta. Abrir, fechar, rever ou ir para outra área não executa o mês de novo. Os nove testes específicos verificam lucro/caixa, crédito, marcos, mês sem conquistas, falhas/saídas, reunião neutra, falência, pureza e navegação sem reexecução. Suite total: 159 testes nomeados mais integrações. O HTML independente incorpora dez estilos e dezoito scripts; teste de entrega executa o pacote real em DOM simulado.

A validação visual real em navegador continua pendente por bloqueio do controle de navegação relatado anteriormente. Não se afirma que DOM simulado valida aparência, ergonomia ou diversão. A direção visual é uma primeira revisão para feedback do jogador. As hipóteses de diversão e próximas propostas estão em ANALISE-GAMEPLAY.md e não foram implementadas automaticamente.
