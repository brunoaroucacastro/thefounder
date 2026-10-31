# Histórico de desenvolvimento

## 0.14 — Correção da entrega e da seleção inicial — 31/10/2026

- Criação itera apenas os 12 mercados atuais; um índice legado na seleção é normalizado para Gadgets.
- Versão 0.14 visível na criação para identificar a cópia aberta. Arquivo entregue com nome versionado.
- Corrigida substituição de versão no empacotador: 0.13 não vira 0.133.
- Teste do HTML final verifica os nomes exatos dos seis produtos e seis serviços, versão, percentuais e fundação.
- 129 testes anteriores passaram, mais o teste de entrega em DOM simulado. Sem nova alegação de inspeção visual real.


## 0.13 — Correção do posicionamento etário e econômico — 31/10/2026

- Aplicadas exatamente as novas tabelas do jogador, substituindo os percentuais de pesquisa usados na 0.12.
- Três mercados por idade dominante e quatro por classe; análises mantidas separadas.
- Justificativas de idade e classe em detalhes expansíveis; rótulo claro de posicionamento de gameplay.
- Públicos, identidade dos setores e aportes preservados. Correção vale para os 12 setores B2C existentes.
- Oito testes de mercados (129 no total), build independente e simulações atualizadas.


## 0.12 — Os 12 mercados B2C na criação de empresa — 31/10/2026

- Seis produtos físicos e seis serviços, conforme tabela enviada, substituem os antigos na seleção inicial.
- Públicos nacionais estimados e percentuais de idade/classe aplicados exatamente ao jogo; descrições curtas e blocos visuais separados.
- Catálogo central com IDs; índices antigos preservados para não transformar empresas salvas em outro setor.
- Simulador usa os novos mercados; seis testes específicos de tabela, criação, regras e compatibilidade.
- Aportes da versão 0.11 preservados. HTML independente atualizado.


## 0.11 — Aportes iniciais revisados — 31/10/2026

- Próprio R$25 mil, amigos/família R$50 mil, banco R$80 mil e VC R$150 mil para novas jornadas.
- Amigos/família: parcela R$2.500 por 20 meses após seis meses de carência. Banco: juros iniciais R$2.000/mês.
- Parcela salva por contrato; saves antigos conservam R$1.750/mês e seus saldos. DRE, revisão e simulações usam a mesma parcela.
- HTML independente regenerado e testes de contratação de capital atualizados.


## 0.10 — Versão jogável: integração e primeira calibração — 31/10/2026

- Capital próprio inicial aumentado para R$25.000, conforme feedback do jogador; abaixo dos R$35.000 de amigos/família.

- Garagem de R$500 e marketing inicial R$500/mês em novas jornadas; expansão a partir da terceira contratação. Saves anteriores preservam economia.
- Calibração de aquisição/compra única/recorrência com 1.920 partidas reproduzíveis em 48 cenários, quatro políticas e dez sementes.
- Receita distingue unidades vendidas, cobranças e assinantes; HUD deixa de chamar transações de clientes únicos.
- Criação transacional de empresa e revisão sinalizando treino/reunião com D20.
- Sete testes novos e integração de save/rollback; 121 testes nomeados mais integrações. Build independente.
- Fase 6 parcialmente validada: inspeção visual real interrompida pelo controle de segurança do navegador.


## 0.9 — Fase 5: Pessoas — 31/10/2026

- Seleção por área/especialidade; três candidatos no próximo mês, uma contratação por seleção, cancelamento e limite de 12 pessoas.
- Níveis 1–5, senioridades, salários distintos, treino D20 com dificuldade/custo crescentes e promoção com +20% de salário no próprio fechamento.
- Motivação individual limitada a 0–100; efeitos de contratação, desligamento, resultados, atividade e treinamento.
- Reunião D20 uma vez por mês, incluindo resultado 5; faixas de retenção sem sobreposição, uma verificação mensal para a pessoa menos motivada.
- Retratos pixel, estrelas, barras de clima, recrutamento visual e histórico de motivação.
- Produto separa especialidades de pesquisa/desenvolvimento; bônus D20 usa o melhor especialista.
- Save schema 6 com backup; ações antigas preservadas. 21 testes de pessoas e integração de recrutamento, save e D20. Inspeção visual no navegador ainda pendente.


## 0.8 — Fase 4: Administrativo-financeiro — 31/10/2026

- DRE com percentuais e conciliação de caixa; juros e principal separados.
- Pesquisa de benchmarks com categoria sorteada, D20 de qualidade e incerteza assimétrica.
- Fornecedores com oferta, até duas insistências interativas no D20, desconto até 10%, risco de +5% e intervalo de seis meses.
- Inflação anual fixa de 3% sobre custos variáveis/aluguel, sem cobrança retroativa.
- Bancos fictícios, propostas de taxa/carência/prazo, aceitação pela agenda, amortização automática e antecipada, score e bloqueio crítico.
- Financeiro com especialização; save schema 5 e backup. IDs de rolagem permitem múltiplos dados e respostas sem repetir o fechamento.
- 23 testes financeiros e integração do fluxo. Inspeção visual no navegador continua pendente.

## 0.7 — Fase 3: catálogo, atributos e ciclo de produtos — 31/10/2026

- Conceitos nomeados, persona por idade/classe, radar de atributos e escolhas com tradeoffs.
- MVP enxuto/completo, desenvolvimento e melhorias com D20 animado, custos/dificuldade crescentes até nível 10 e perda de nível em crítico.
- Pesquisa de persona com pistas persistentes, preço em aberto e compra única/recorrência escolhida no lançamento.
- Demanda por aderência/NPS/preço, custo variável por atributos, histórico de preços e margens reais.
- Catálogo com competição por leads, atribuição de marketing por produto e contabilidade separada por modelo de cobrança.
- Curva de adoção, abismo de 15%, obsolescência e novas gerações com família estável.
- Dependências que falharam são puladas sem custo. Save schema 4, backup e migração do produto antigo.
- 23 testes de produto e integração do fluxo visual, além das regressões. Layout ainda não inspecionado no navegador.

## 0.6.1 — D20 animado e resolução cinematográfica — 31/10/2026

- Cena própria para cada rolagem: D20 facetado animado, dificuldade/faixas, modificadores, total e consequência.
- Clique para rolar, avanço sequencial, pular animações e rever resultados do fechamento.
- Resultado econômico salvo antes da apresentação. Reabrir, pular e rever não sorteiam novamente nem cobram ações.
- Cursor persistido retoma a sequência ao escolher Continuar. Eventos usam suas próprias faixas, sem exibir dificuldade enganosa.
- Respeita preferência de movimento reduzido e cancela timers ao sair.
- Onze testes de apresentação com relógio controlado, além das regressões existentes. Layout ainda sem inspeção visual no navegador.

## 0.6 — Fase 2: campanhas, D20 e ROAS — 31/10/2026

- Escalar, reduzir e otimizar por canal, com verba mensal explícita e agenda reversível.
- Eficiência persistente, dados e modificadores, penalidade por saltos agressivos e bloqueio crítico no mês seguinte.
- Especialidades de Marketing e afinidades distintas de produtos físicos/serviços.
- Público finito compartilhado entre canais, saturação por persona e aquisição sem piso artificial.
- Receita atribuída e ROAS por canal, com receita antiga e orgânica separadas e sem duplicar o caixa.
- Interface de cartões, indicadores e funil; detalhes de riscos sob demanda.
- Save schema 3, migração e backup. Testes determinísticos e integração simulada; validação visual ainda pendente.

## 0.5 — Fase 1: agenda mensal e D20 — 31/10/2026

- Agenda visual com até quatro ações: adicionar, remover e reordenar antes de aprovar.
- Painéis mostram prévia; o cenário mantém a empresa real até executar o mês.
- Revisão sequencial de pré-requisitos, custos imediatos e compromissos mensais.
- Motor de regras separado da interface, ações serializáveis e IDs estáveis.
- D20 central com natural, modificadores, total e falha crítica natural 1; eventos existentes usam o motor. Riscos específicos de marketing/produto ficam para fases posteriores.
- Fechamento único inclui ações, operação, eventos, financiamento e falência antes de salvar e mostrar o resultado.
- Save versionado, backup de migração, agenda persistente e proteção contra confirmação repetida e abas desatualizadas.
- Testes de regras e integração com DOM simulado. Inspeção visual no navegador ainda pendente.

## 0.4 — Modelos de negócio e perfis explicados — 31/10/2026

- Doze arquétipos reformulados: DNVB, wearables, mobilidade elétrica, SaaS, jogos, IA, rede de saúde, recarga, mobilidade compartilhada, fintech, marketplace e edtech.
- Mesma régua de tamanho de público, idade e renda; gráficos separados.
- Descrição de empresas e explicação de prós/contras dos founders.
- Início do versionamento no GitHub, com testes, build e documentação.

## Etapas anteriores — retrospectiva

- 0.3.1: jogo em HTML único para evitar falta de CSS/JavaScript ao abrir arquivos separados.
- 0.3: tela inicial, criação do founder e empresa, modelos de negócio e capital.
- 0.2: escritório isométrico em pixel art e interação por objetos.
- 0.1: primeira simulação de produto, marketing, equipe, finanças e recomeço.
