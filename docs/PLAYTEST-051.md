# Playtest 0.51 — Problemas identificados

Data: 04/11/2026 · Versão: 0.51 (quarto do fundador em vetor) · Status: **levantamento, nada corrigido ainda**

## Como o teste foi feito

- Partida nova jogada no navegador (Chrome, painel de ~800×700 px), em 4×, da escolha do gadget até o início das vendas.
- O restante da janela de vendas foi simulado pelo motor de regras (`tests/modern-support.cjs`), com preço R$ 105.
- **Não testado:** segundo ciclo (evoluir, outro produto), Estudar, oportunidades, reposição de estoque, telas maiores que 800 px.

### Partida jogada

| Etapa | Escolha / resultado |
|---|---|
| Gadget | Fone de ouvido (pesquisa R$ 1.000) |
| Persona | Ana · "Busca paz e privacidade", 25–34 |
| Atributos | Qualidade 2, Desempenho 1, Praticidade 1 → material R$ 58/un. |
| Marketing | Mix padrão (20/20/15/15/15/15) · previsão 665 interessados |
| Protótipo | R$ 8.000 · D20 = 7 (falha) → correção R$ 200 |
| Lote | 100 unidades · R$ 5.800 |
| Preço | Margem 45% → R$ 105,45 |
| Campanha | D20 = 2 · "532 interessados · base 356" |
| Vendas (simulado) | 91 vendidas, 9 em estoque, receita R$ 9.555 |
| Avaliações | 9 reviews, média 2,7★ — "Para meu uso, faltou mais qualidade." |
| Caixa | R$ 25.000 → R$ 16.940 (≈ −R$ 8 mil no primeiro produto) |

Tempo real até a primeira venda: **≈ 15 minutos**, quase todo de espera.

---

## Prioridade e severidade

- **P1** — bloqueia ou afasta o jogador; corrigir primeiro.
- **P2** — causa confusão ou decisão às cegas.
- **P3** — acabamento, coerência, polimento.

| # | Área | Problema | Prioridade | Esforço |
|---|---|---|---|---|
| R1 | Ritmo | Esperas longas sem decisão | P1 | Médio |
| V1 | Visual | Resumo de estoque ilegível nas vendas | P1 | Baixo |
| V2 | Visual | Layout quebra em telas ~800×700 | P1 | Médio |
| D1 | Decisão | Atributos sem pista do que a persona quer | P2 | Médio |
| D2 | Decisão | Preço só por margem, sem referência do cliente | P2 | Médio |
| D3 | Decisão | Resultado do D20 da campanha confuso | P2 | Baixo |
| D4 | Decisão | Lote sem demanda prevista nem faixas de desconto | P2 | Baixo |
| D5 | Decisão | Ordem real das etapas ≠ trilha mostrada | P2 | Baixo |
| D6 | Decisão | Gadget cobra R$ 1.000 sem confirmação | P2 | Baixo |
| D7 | Decisão | Opção "Trabalhar" no fim de semana é contraintuitiva | P2 | Baixo |
| B1 | Balanço | Primeiro produto dá prejuízo mesmo vendendo 91% | P2 | Discussão |
| V3 | Visual | Faixas de resumo com bege antigo | P3 | Baixo |
| V4 | Visual | Texto secundário grudado nos botões | P3 | Baixo |
| V5 | Visual | Balão de venda sobre a etiqueta CLIENTES | P3 | Baixo |
| V6 | Visual | Retratos de clientes ainda em pixel | P3 | Médio |
| N1 | Narrativa | Restos de "oficina/bancada" | P3 | Baixo |
| N2 | Narrativa | "Ir para casa" estando em casa | P3 | Baixo |
| N3 | Narrativa | Nina fala, mas não existe na cena | P3 | Decisão |
| N4 | Narrativa | Descrição do produto contradiz os atributos | P3 | Baixo |
| U1 | Interface | Guia repete o título do painel | P3 | Baixo |
| U2 | Interface | Balão da Nina dá instrução errada na abertura | P3 | Baixo |
| U3 | Interface | Etiqueta "CLIQUE NO COMPUTADOR" duplica "COMPUTADOR" | P3 | Baixo |
| U4 | Interface | Termos técnicos sem explicação ("ritmo reduzido", "foco") | P3 | Baixo |

---

## 1. Ritmo

### R1 · Esperas longas sem nenhuma decisão — P1
- **O que acontece:** em 4×, o protótipo (300 unidades de trabalho) leva ~5 min reais; a preparação da campanha, mais ~5 min; a pesquisa, ~10 s. Durante essas esperas não há nada para fazer além de olhar a barra.
- **Onde:** fases `building` e `campaignWork` (`src/first-loop/core.js`).
- **Impacto:** o jogador leva ~15 min para ver a primeira venda. É o ponto mais provável de abandono.
- **Opções:**
  1. Botão "Avançar até terminar" (pula o tempo, mantendo custos e fins de semana).
  2. Reduzir as durações (ex.: protótipo 2 dias, campanha 1 dia).
  3. Preencher a espera com microdecisões: responder o Nexus, pesquisar clientes, planejar o próximo produto.
- **Recomendação:** 1 agora (barato) + 3 ao longo do tempo.

---

## 2. Clareza das decisões

### D1 · Atributos sem pista do que a persona quer — P2
- **O que acontece:** a Ana diz "Quero relaxar e ter meu espaço". Os atributos são Qualidade, Durabilidade, Desempenho, Praticidade, Versatilidade, Economia. O "?" de cada um mostra só "Ainda não investigado para este produto e persona".
- **Impacto:** a escolha vira chute. As avaliações depois dizem "faltou qualidade", mas o jogador não tinha como saber.
- **Observação:** o design atual quer "descobertas sem dicas antecipadas" (0.35). Uma pista vaga mantém a descoberta.
- **Sugestão:** frase de pesquisa por persona ("parece valorizar som e conforto") e uma explicação curta do que cada atributo significa para aquele gadget.

### D2 · Preço definido só por margem — P2
- **O que acontece:** a tela de preço oferece 15/35/45% de margem sobre o custo (R$ 58). Não há referência do quanto o cliente pagaria.
- **Impacto:** o preço sai do custo, não do cliente; o jogador não aprende a relação preço × conversão.
- **Sugestão:** mostrar uma faixa de "preço que parece justo para a Ana" vinda da pesquisa, ou a conversão estimada para o preço escolhido.

### D3 · Resultado do D20 da campanha confuso — P2
- **O que acontece:** D20 = 2 (resultado baixo) mostrou "A estreia foi discreta" e "532 interessados · base 356". O número final é maior que a base, e a previsão anterior era 665.
- **Impacto:** o jogador não entende se foi bom ou ruim, nem o que "base" significa.
- **Sugestão:** comparar sempre com a previsão mostrada antes ("665 previstos → 532 alcançados, −20%") e usar uma única palavra para cada número.

### D4 · Lote sem demanda prevista nem faixas de desconto — P2
- **O que acontece:** a tela mostra quantidade, desconto, custo unitário e custo do lote. Os botões vão de ±1 a ±100.000 unidades com R$ 15 mil em caixa. Não aparecem a demanda prevista nem a partir de quantas unidades há desconto.
- **Sugestão:** mostrar "previsão de interessados" e as faixas de desconto; limitar os botões ao que o caixa permite.

### D5 · Ordem real das etapas diferente da trilha — P2
- **Trilha mostrada:** PRODUTO › CAMPANHA › PREÇO.
- **Ordem real:** produto › marketing › protótipo › D20 do protótipo › preparação da campanha › lote › preço › D20 da campanha › vendas.
- **Sugestão:** trilha com as etapas reais (agrupadas) e a etapa atual marcada; usar "Marketing" ou "Campanha", não os dois.

### D6 · Escolher o gadget cobra R$ 1.000 sem confirmação — P2
- O clique em "Fone de ouvido" já paga a pesquisa. Sugestão: confirmação inline ("Pesquisar fones · R$ 1.000 · Confirmar").

### D7 · "Trabalhar" no fim de semana — P2
- Texto: "Trabalhar: +1 ação de foco · −5% de progresso". Trabalhar reduzir o progresso parece erro. "Foco" não é explicado em nenhum lugar visível.
- Sugestão: reescrever o efeito (ex.: "+1 foco na próxima semana, mas você chega cansado: −5% de velocidade").

### B1 · Primeiro produto dá prejuízo mesmo vendendo 91% — P2 (discussão)
- Receita R$ 9.555 contra custos fixos de R$ 10.250 (pesquisa, protótipo, operação), material R$ 5.460 e marketing R$ 1.365.
- Pode ser intencional (o primeiro produto paga o aprendizado), mas o jogo não comunica isso: o jogador vende quase tudo e vê o caixa cair R$ 8 mil.
- Sugestão: decidir se é intencional; se for, deixar explícito no resumo ("investimento inicial recuperado em X%").

---

## 3. Visual (resíduos do tema 0.51)

### V1 · Resumo de estoque ilegível na fase de vendas — P1
- Bloco "PRONTOS / EM PRODUÇÃO / RESTAM" com texto branco sobre bege claro. Classe `.stock-hud` / painel de vendas.

### V2 · Layout quebra em telas pequenas (~800×700) — P1
- A cena encolhe muito e as etiquetas ficam ilegíveis.
- A página ganha uma segunda barra de rolagem.
- A navegação inferior fica parcialmente cortada.
- Os botões de som e reiniciar somem da barra superior.

### V3 · Faixas de resumo com o bege antigo — P3
- Fechamento semanal (Receita/Despesas/Resultado), planejamento do lote e painel de vendas usam fundo `#e6d6ab` e bordas marrons do tema anterior.

### V4 · Texto secundário grudado nos botões — P3
- Ex.: "Corrigir · R$ 200+1 dia útil · usa 1 foco", "Lançar com a falhaSem espera…". O `<small>` dentro do botão perdeu a quebra/espaço.

### V5 · Balão "+R$" de venda sobre a etiqueta CLIENTES — P3
- Os dois ocupam o mesmo ponto acima do monitor.

### V6 · Retratos de clientes em pixel — P3
- Os cards de persona (`.client-mini`) ainda usam o boneco pixelado.

---

## 4. Narrativa e coerência com o quarto

### N1 · Restos de "oficina/bancada" — P3
- "Nina liga o protótipo.", "É hora de ver o que saiu da bancada.", guia "NA BANCADA", "Seu protótipo está tomando forma na bancada.", "Nina espalha as anotações na bancada."

### N2 · "Ir para casa" no fechamento semanal — P3
- O fundador já trabalha em casa. Sugestão: "Fechar a semana →" ou "Desligar o computador →".

### N3 · Nina fala, mas não existe na cena — P3 (decisão)
- Opções: (a) sócia remota que aparece em chamada de vídeo no monitor; (b) remover a personagem e trazer as falas para o próprio fundador; (c) colocá-la fisicamente no quarto.

### N4 · Descrição do produto contradiz os atributos — P3
- Com Qualidade 2 e Desempenho 1, o texto diz "Fone de ouvido caprichado com foco em desempenho".

---

## 5. Interface

### U1 · Guia repete o título do painel — P3
- Ex.: guia "Quem a gente vai ajudar?" e painel "Quem você quer ajudar?".

### U2 · Balão da Nina com instrução errada na abertura — P3
- Na tela inicial: "Escolha alguém. A gente constrói para essa pessoa." A ação certa é clicar no computador.

### U3 · Etiquetas duplicadas na abertura — P3
- "CLIQUE NO COMPUTADOR" aparece junto de "COMPUTADOR".

### U4 · Termos sem explicação — P3
- "Ritmo reduzido", "foco", "base", "conversão ×0.80", "CAC" aparecem sem ajuda contextual.

---

## Próximos passos sugeridos

1. **Rodada rápida (baixo esforço):** V1, V3, V4, V5, N1, N2, N4, U1–U3.
2. **Ritmo:** R1 (botão de avançar).
3. **Responsividade:** V2.
4. **Game design (conversar antes):** D1–D7, B1, N3.
5. **Novo playtest** cobrindo o segundo ciclo, reposição, oportunidades e Estudar.
