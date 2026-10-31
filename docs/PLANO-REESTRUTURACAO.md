# Reestruturação — seis fases

Status em 31/10/2026: Fases 1–5 autorizadas e implementadas nos protótipos 0.5–0.9. Fase 6 implementada parcialmente na versão 0.10: integração, simulações e primeira calibração; validação visual real pendente. Base: feedbacks fornecidos pelo usuário. A execução seguirá uma fase por vez: proposta, aprovação, implementação, testes, partida do usuário e ajustes.

## Diagnóstico do protótipo

- `src/game.js` mistura estado global, regras, HTML e persistência. `spend(cost, fn)` desconta dinheiro e uma ação imediatamente, executa a função e salva. Não há planejamento reversível ou confirmação conjunta.
- `advance()` calcula aquisição, cancelamentos, receita e custos e avança o mês. Eventos e saídas usam `Math.random()` sem um motor compartilhado ou histórico completo de sorteios.
- `src/create.js` substitui funções existentes (`product`, `finance`, `advance`, `newCompany`). O fechamento financeiro adicional ocorre depois do fechamento base, o que dificulta garantir ordem, relatório e falência consistentes.
- `src/scene.js` substitui a interface e desenho. Manter escritório isométrico, fundador, aparência, objetos clicáveis e janelas; a refatoração deve preservar essa identidade visual.
- Produto é único, com preço pré-definido, qualidade escalar e melhoria garantida. Não há atributos, custo crescente, múltiplos produtos ou ciclo de vida.
- Marketing mantém três orçamentos recorrentes, calcula aquisição e retorno decrescente, mas não tem campanhas com histórico de eficiência, D20, bloqueio ou saturação real: o fator atual tem piso de 0,1.
- Financeiro tem DRE, crédito e amortização simples, sem negociação ou benchmarks. Motivação é global; contratação imediata; promoções são garantidas.
- Save em localStorage não tem versão/migrações. Mercados são índices de array: trocar a ordem pode alterar a identidade de uma empresa antiga.
- Testes atuais exercitam regras com DOM simulado; não comprovam layout, cliques reais, foco ou comportamento do navegador. O HTML independente é o formato de entrega a preservar.
- A seleção dos 12 setores revisados e a tabela estimada enviada foram implementadas na versão 0.12; veja MERCADOS-IMPLEMENTADOS.md. Não misturar essa pendência com aprovação automática de todos os números propostos.

## Arquitetura proposta

Separar arquivos de regras (sem DOM), dados de balanceamento, interface e persistência. Manter scripts locais empacotáveis em um único HTML.

- Estado versionado: empresa, produtos, campanhas, equipe, dívidas, calendário, conhecimento, plano do mês e resultados. IDs estáveis para mercados, pessoas e produtos.
- Registro de ações serializáveis: ID, tipo, área, alvo e parâmetros. Não salvar callbacks JavaScript.
- Planejador: adicionar/remover/reordenar até quatro ações, simular pré-requisitos e reservar orçamento sem alterar a empresa real.
- Resolvedor: validar o plano e executar na ordem aprovada, uma vez, com regras específicas por ação.
- D20 central: valor natural, lista de modificadores, total, dificuldade, desfecho e consequências. Sorteios reproduzíveis nos testes e histórico persistido para evitar reexecutar mês já resolvido.
- Fechamento único: ações → efeitos comerciais → receitas/custos/dívidas → motivação/saídas → calendário/eventos → falência/relatório → save. O posicionamento exato de obsolescência e inflação precisa ser fechado antes das fases correspondentes.
- Relatório recebe o mesmo estado efetivamente salvo. UI mostra agenda de quatro espaços e resultados por cartões, com detalhes opcionais do dado.
- Migração: backup antes de converter; versões conhecidas convertidas explicitamente; saves desconhecidos não sobrescritos silenciosamente. Mapear mercados antigos antes de reordenar categorias.

## Fase 1 — Agenda mensal e motor D20

Entregar: carrinho com até quatro ações, adicionar/remover/substituir, revisão de custos e compromissos mensais, confirmação, resolução ordenada e resultados. Todas as decisões atuais que consomem ação passam pelo mesmo planejador. Criar D20 compartilhado com modificadores e falha crítica natural 1. Não aplicar risco aleatório indiscriminadamente a ações como alterar preço ou amortizar dívida; tabelas de risco virão nas fases específicas.

Propostas para aprovação: permitir fechar com 0–4 ações; adicionar/remover não cobra nem executa; ordenar explicitamente as ações; validar pré-requisitos sequenciais; mostrar orçamento disponível já comprometido. Parâmetros exatos de falha pertencem ao tipo da ação.

Aceite: quinta ação bloqueada; remover libera espaço/reserva; cancelar revisão preserva estado; salvar/reabrir preserva plano; aprovar não pode executar duas vezes; dependências inválidas não cobram; natural 1 continua crítico mesmo com bônus; mês com caixa comprometido tem resultado coerente com relatório. Regressões de crédito, venda, falência e retomada preservadas.

## Fase 2 — Marketing

Entregar: investir por mês, escalar/reduzir/otimizar por ação, afinidade de canais, eficiência persistente, D20, modificadores, ROAS, público alcançado acumulado e bloqueio crítico.

Aceite: reduzir orçamento muda compromisso mensal; saltos agressivos têm penalidade explícita; saturação limita incremento sem piso artificial; funcionário só ajuda sua especialidade; falha crítica bloqueia o período correto; receita atribuída não é contada duas vezes nem toda receita recorrente é atribuída automaticamente ao gasto atual. ROAS = receita atribuída / investimento; sem investimento aparece “—”.

Pendências: tabela D20 e escala de ganhos/perdas, início/duração do bloqueio, divulgação inicial da afinidade dos canais, atribuição com múltiplos produtos, deduplicação de público e interação de saturação com recompra. Reduzir verba não deve ser impedido por falha; risco pode afetar eficiência remanescente.

## Fase 3 — Produto

Entregar em incrementos internos: (a) nome, persona, modelo de venda e pesquisa; (b) atributos visuais e custos; (c) aprimoramento D20, falha crítica e obsolescência; (d) preço e demanda; (e) catálogo, continuações e ciclo de adoção.

Aceite: pontos limitados; atributo altera custo e aderência; pesquisa não revela tudo; desenvolvimento pode falhar sem criar produto; melhoria tem custo/dificuldade crescentes; custo variável muda com atributos; preço elevado pode zerar demanda; NPS/aderência prejudicam vendas e retenção; compra única não vira assinatura; envelhecimento ocorre no calendário correto; alcançar 15% usa compradores únicos, não vendas repetidas; produtos competem por recursos e público.

Pendências: quatro eixos opostos versus pontos independentes; significado de nível e atributo; tabela de custos/dificuldades; qual atributo perde ponto e como fica no MVP; limites por setor; parâmetros de elasticidade e adoção. Valor de R$30 mil para MVP é exemplo a balancear: capital próprio de R$12 mil hoje não o financia. Não impor esse bloqueio sem rota de entrada viável.

## Fase 4 — Administrativo-financeiro

Entregar: percentuais da DRE, pesquisa de um benchmark sorteado com incerteza, fornecedores/negociação, inflação fixa 3% anual, propostas bancárias com condições e score.

Aceite: percentuais sem divisão por zero; benchmark vem de referência setorial, não é recomendação universal; dado define qualidade do intervalo; valor real contido quando aplicável e sem centro obrigatório; fornecedor tem cooldown de seis meses; desconto não degrada qualidade; reajuste anual aplicado uma única vez; proposta de crédito aceita antes de gerar dívida; crítico de crédito bloqueia três meses; banco negado não deposita dinheiro.

Pendências: todas as tentativas de uma negociação usam uma ação ou cada tentativa custa uma? Escolher entre aceitar a oferta e insistir; definir perda de oferta e limite de +5%; descontos cumulativos ou substitutivos; críticos e prazo; parcelas, principal e juros por contrato. Inflação dinâmica fica no backlog.

## Fase 5 — Pessoas

Entregar: processo seletivo com três candidatos no próximo mês; níveis 1–5, senioridade, salários, especialidades por ação/canal, treino D20 e promoção; motivação individual, desligamentos, rotatividade e reunião geral uma vez por mês.

Aceite: candidatos não aparecem no mesmo turno; bônus específico e sem multiplicação ilimitada por contratar juniores; treino pode falhar; níveis respeitam máximo; salário muda no momento definido; motivação individual limitada a 0–100; atividade da área contada uma vez/mês; reunião limitada; saídas retiram bônus no mês correto. Testar todos os limites de motivação.

Regras fornecidas: demissão −5; prejuízo ou queda >20% −5; crescimento >20% +5; contratação +5; área ativa +5/inativa −5; treino bem-sucedido +10/falho −5. Determinar a quem se aplica cada efeito e se prejuízo + queda acumulam.

Pendências: faixas se sobrepõem em 35 e 75, falta resultado 5 da reunião; saída de uma pessoa ou rolagem por funcionário? Um crítico mensal por pessoa gera risco anual alto de perder talentos mesmo motivados; preservar intenção, revisar probabilidade antes de implementar. Nível não deve somar bônus linear ilimitado de toda a equipe.

## Fase 6 — Integração e balanceamento

Entregar: simulações reproduzíveis, cenários dos 12 setores/4 capitais, testes de estratégia, calibração e validação visual em navegador.

Aceite: não existe dinheiro/ação duplicados por reload ou cliques repetidos; receitas distinguem usuários, compradores, unidades e assinantes; nenhum canal dá receita garantida infinita; nenhum preço domina todos os segmentos; rotas de capital próprio viáveis; salários/custos proporcionais aos benefícios; interfaces continuam compreensíveis e curtas. Relatar taxas observadas de falência, progresso e dispersão com sementes e premissas, sem exigir um único resultado por partida.

## Decisões transversais pendentes

1. Aprovar agenda de 0–4 ações, ordem e validação sequencial.
2. Proposta D20: natural 1 crítico; total pode exceder 20; tabelas limitam efeitos, não o dado. Natural 20 não dá sucesso especial automático salvo regra da ação.
3. Custos de tentativa: proposta cobrar ao executar tentativas válidas, mesmo se falharem; ação impossível por pré-requisito deve ser detectada na revisão. Definir consequência de dependência que falha durante resolução.
4. Separar fracasso de execução de erro estratégico: D20 alto pode executar bem um produto sem demanda. Pesquisas e pessoas reduzem incerteza, não garantem lucro.
5. A tabela estimada enviada foi aplicada na versão 0.12. Não apresentar extrapolação de gameplay como dado real.

## Estratégia de testes e riscos

Manter testes de caracterização existentes antes de extrair regras. Adicionar testes unitários com dados fixos para rolagens 1/5/10/11/15/16/20, modificadores, custos, limites e cooldowns; integração para fluxo de mês completo, finanças, saídas e múltiplos produtos; fixtures de saves antigos; testes de navegador para carrinho/revisão/retomada e escritório. Simulação para balancear apenas depois das regras funcionarem.

Riscos principais: funções sobrescritas em cadeia, estado global e ações com callbacks; cobrança dupla; resultados não persistidos; saves alterando de setor por índice; dupla atribuição de vendas; curvas sem possibilidade de demanda zero; custo de MVP inviável no capital próprio; rotatividade excessiva; interface sobrecarregada. Refatorar por fronteiras pequenas com comportamento anterior verificável.

## Próxima entrega

Testar a versão jogável 0.10 em partida. Simulações, calibração e limites em `FASE-6-INTEGRACAO-BALANCEAMENTO.md`; inspeção visual real e ajustes por feedback permanecem pendentes. Não avançar automaticamente para a próxima fase sem pedido do usuário.

Atualização 0.13: percentuais de idade/classe substituídos pelo posicionamento de gameplay enviado pelo jogador; públicos mantidos. Ver MERCADOS-POSICIONAMENTO.md.
