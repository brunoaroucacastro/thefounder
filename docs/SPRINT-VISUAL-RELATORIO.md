# Sprint visual — relatório

Análise de todas as telas da versão 0.80, feita em 08/11/2026. Objetivo: o jogo deixar de parecer um site/SaaS e passar a parecer um jogo.

## 1. O que já funciona, e por quê

As cinco telas que você apontou como boas têm o mesmo segredo:

| Tela | Por que funciona |
|---|---|
| Prancheta do produto | Você **manipula objetos** (peças) em vez de ler sobre eles |
| Rolagem de dados | O resultado **acontece na sua frente**, com suspense |
| Tabuleiro de campanha | O efeito é **espacial**: dá para ver quem foi alcançado |
| Preço com barra | Você **sente** a decisão: empurra e vê o número reagir |
| Quarto | As coisas **acontecem no mundo**, não num painel |

Daqui saem as regras da sprint:

1. **Mostrar, não escrever.** Todo número importante vira objeto, medidor, pilha ou boneco.
2. **Toda escolha é um cartão.** O cartão tem ícone grande, cor da área e no máximo uma linha de texto.
3. **Ações com ícone.** Botão com frase longa vira ícone mais um verbo curto ("Repor", "Contratar").
4. **Cor com significado fixo.** Produto é roxo, marketing laranja, financeiro verde, pessoas azul, risco vermelho.
5. **Texto longo só sob demanda.** O que explica regra vai para o "?" ou para um tooltip.
6. **O mundo reage.** Estoque vira caixas no quarto, funcionário vira boneco na mesa, venda vira moeda pulando.

## 2. Inventário por tela

Nota visual de 1 (cara de site) a 5 (cara de jogo).

| # | Tela | Nota | O que está ruim | Proposta | Prioridade |
|---|---|---|---|---|---|
| 1 | **Vendas (produto vendendo)** | 1 | Coluna de frases e números; "1002 unidades vendidas · R$ 168.336"; dois avisos em parágrafo; botões largos com texto | **Painel de loja ao vivo** (ver seção 3) | **Alta** |
| 2 | **Equipe / contratação** | 1 | Lista de botões "Buscar…"; candidatos em blocos de texto | **Escritório com mesas e cartas de candidato** (ver seção 3) | **Alta** |
| 3 | Planejar campanha (nova campanha) | 2 | Números soltos (distribuição ×, público exposto) e texto de instrução | Placar visual: medidores de força, novidade, distribuição e seguidores, com ícones | Alta |
| 4 | Cartas do tabuleiro de marketing | 3 | As cartas são botões com nome e descrição | Cartas de verdade: ilustração do canal (jornal, outdoor, TV, celular), mini-desenho do formato de alcance (área, linha, diagonal), cor por canal | Alta |
| 5 | Planejar lote | 2 | Duas fileiras de botões "+1 +10 +100 +1.000…"; três números lado a lado | Pilha de caixas que cresce com uma barra ou roda; selo de desconto que "carimba" ao passar das faixas; custo como pilha de moedas | Média |
| 6 | Catálogo (o que desenvolver) | 2 | Lista com ícone unicode pequeno e texto | Vitrine com 4 protótipos desenhados (fone, mouse, teclado, caixa), cadeado na bloqueada e etiqueta "R$1.000 · pesquisa" | Média |
| 7 | Escolha da persona | 3 | Cartões com mini boneco e três falas em texto corrido | Cartão de personagem: retrato maior, idade e rotina como ícones, falas em balão de quadrinho com negrito | Média |
| 8 | Resumo do produto (recap) | 2 | Faixa de números e três cartões de caminho com texto | Placar de fim de rodada: estrelas, lucro como pilha de moedas, três portas ou cartas (Evoluir, Nova campanha, Novo produto) | Média |
| 9 | Evoluir produto | 2 | Botões de modo, campo de texto, "NV 7 → 8" e parágrafos | Escada de níveis (NV4 a NV10) com o produto subindo, meta do dado em um selo D20 e custo em moedas | Média |
| 10 | Resultado do lançamento (popup) | 3 | Bom momento, mas com muito número | "Tela de estreia": confete por nota, contadores animados e medalha da campanha | Média |
| 11 | Balanço semanal | 3 | O gráfico ajudou; despesas e caixa seguem em tabela | Gastos em barras horizontais coloridas por área; caixa como cofre que enche ou esvazia; resumo em três medalhas (faturamento, lucro, clientes) | Média |
| 12 | Produtos (panorama) | 1 | Linha de planilha com dez números | Prateleira: cada produto e versão é uma caixa na estante com estrelas, vendas e lucro em ícones; clicar abre o detalhe | Média |
| 13 | Caixa e banco | 2 | Linhas "Disponível / Faturamento…"; ofertas de empréstimo em texto | Cofre com saldo e três contratos de banco como cartões (valor grande, prazo em ícones de calendário, juros em selo) | Média |
| 14 | Clientes (persona atual) | 3 | Mesmo cartão de texto da escolha | Ficha de personagem igual ao item 7, mais as "descobertas" como carimbos | Baixa |
| 15 | Aprendizados (livro) | 3 | Cartas de texto | Álbum de figurinhas: cada descoberta é uma figurinha colada; as faltantes aparecem em silhueta | Baixa |
| 16 | Bancada antes de construir | 3 | Atributos como chips de texto | Mostrar o radar e o protótipo montado; meta do teste num selo D20 | Baixa |
| 17 | Nexus | 4 | Já parece rede social | Pequenos ajustes: fotos ilustradas por canal (outdoor, telejornal) | Baixa |
| 18 | Fim de semana | 4 | Ilustração boa; opções em botões de texto | Três cartões com ícone (cama, laptop, livro) | Baixa |
| 19 | Barra de cima e navegação | 3 | Abas com texto e ícone unicode | Ícones SVG próprios; caixa com moeda animada quando entra dinheiro | Baixa |
| 20 | Avisos (toasts) | 2 | Caixas de texto no canto | Avisos com ícone e cor por tipo (venda, avaliação, equipe, alerta) e menos frequentes | Baixa |
| 21 | **Quarto → escritório** | 4 | Ao alugar a sala, nada muda no mundo | **Novo cenário de escritório**: mesas, funcionários desenhados trabalhando, caixas de estoque empilhadas | **Alta** |

## 3. As duas piores telas, redesenhadas

### Vendas: "loja ao vivo"

Hoje são 12 linhas de texto. Proposta em quatro blocos visuais:

```
┌───────────────────────────────────────────┐
│ [selo NV8]  Pulso Pro     ★★★★☆ 3,9 (100) │
├──────────────┬────────────────────────────┤
│  ESTOQUE     │  FUNIL DA SEMANA           │
│  ▣▣▣▣▣▣      │  👥 2.538 visitas           │
│  ▣▣▣▣ 498    │   ↓ ●●●●○○○○○○ 39,6%        │
│  (caixas)    │  🛒 1.002 compras           │
├──────────────┴────────────────────────────┤
│  CAMPANHA  🔋▮▮░░░░░░ 20% de força          │
│  "A campanha está fraca" → [📣 Nova]        │
├───────────────────────────────────────────┤
│  💬 balões de avaliação (3 últimos)         │
├───────────────────────────────────────────┤
│ [📦 Repor] [⏱ Programar] [📣 Campanha] [⏹] │
└───────────────────────────────────────────┘
```

- **Estoque em caixas:** uma caixa por 50 unidades, que somem conforme vende. Quando há produção, aparece um caminhãozinho chegando.
- **Funil em bolinhas:** a conversão vira 10 bolinhas, e cada venda pinta uma.
- **Força da campanha como bateria:** substitui o parágrafo sobre desgaste.
- **Lucro por venda:** "+R$115" flutuando a cada venda, no lugar da frase "cada venda rende cerca de…".
- **Ações:** quatro botões-ícone grandes. Repor e Programar abrem um popup próprio.

### Equipe: "escritório com mesas"

```
┌───────────── SALA COMERCIAL · R$2.500/sem ─────────────┐
│  [mesa 1]                     [mesa 2]                 │
│  🧑 Vítor  ★★☆☆☆               ┌ cadeira vazia ┐       │
│  💚 Financeiro                 │      ＋        │       │
│  😀 motivação ▮▮▮▮▯           │   Contratar   │       │
│  [🎓 Treinar 🎲 75%]           └───────────────┘       │
└────────────────────────────────────────────────────────┘
```

- **Vagas são mesas:** a vaga vazia é uma cadeira vazia com "＋". Clicar abre a escolha da área em três cartões: Produto (roxo, ícone de prancheta), Marketing (laranja, megafone) e Financeiro (verde, calculadora).
- **Busca visível:** enquanto a busca roda, aparece um envelope com contagem regressiva.
- **Candidatos como cartas viradas:** você vira as duas cartas. A borda mostra a senioridade: bronze para Júnior, prata para Pleno, ouro para Sênior. A carta traz retrato, estrelas de nível, salário em moedas e os bônus como ícones (D20 +1, 4 peças, relógio mais rápido).
- **Treino com dado de verdade:** um D20 com a meta à vista, como no resto do jogo, em vez de uma chance escondida.
- **Motivação:** um rostinho que muda (😀 😐 😟) mais a barra.

## 4. Base comum (fazer primeiro)

Para não redesenhar tela por tela do zero, vale criar um kit de peças reaproveitáveis:

| Peça | Uso |
|---|---|
| Cartão de jogo | Moldura, ícone grande, cor da área e borda de raridade. Serve para persona, canal, candidato, empréstimo, produto e caminho do recap |
| Medidor | Barra, bateria ou bolinhas para força, conversão, motivação e progresso |
| Selo | Círculo com número: nível, D20, nota, desconto |
| Retrato | Evolução do mini boneco atual, para personas e funcionários |
| Ícones SVG próprios | Substituem os unicode (♬ ▣ ▤ ♟): fone, mouse, teclado, caixa de som, moeda, caixa de estoque, megafone, calculadora, prancheta |
| Moeda e "+R$" flutuante | Toda entrada de dinheiro |
| Paleta por área | Produto, marketing, financeiro, pessoas, risco |

## 5. Plano da sprint

| Fase | Entrega | Telas |
|---|---|---|
| 0 | **Protótipos** das telas de Vendas e Equipe, separados do jogo (como no laboratório da prancheta) | 1, 2 |
| 1 | Kit visual da seção 4 | base |
| 2 | Vendas e Equipe no jogo, mais o cenário de escritório no mundo | 1, 2, 21 |
| 3 | Cartas de marketing, planejar campanha e planejar lote | 3, 4, 5 |
| 4 | Catálogo, persona, recap, evoluir e resultado do lançamento | 6, 7, 8, 9, 10 |
| 5 | Balanço, produtos, caixa e banco, clientes e aprendizados | 11–15 |
| 6 | Acabamento: bancada, Nexus, fim de semana, barra de cima e avisos | 16–20 |

Cada fase vira uma versão. As fases 2 e 3 são as que mais mudam a cara do jogo.

## 6. Decisões tomadas (08/11/2026)

- **Estilo:** manter o vetorial atual (o mesmo do quarto) para ícones, retratos e cartas.
- **Escritório:** ao alugar a sala, o cenário troca do quarto para uma sala comercial com 3 mesas de computador (você mais 2 funcionários).

## 7. Decisões em aberto (texto original)

1. **Começar pelos protótipos (fase 0)?** Eu montaria Vendas e Equipe como páginas separadas para você aprovar o visual antes de mexer no jogo.
2. **Estilo de arte:** manter o vetorial da "Amostra A" (o mesmo do quarto) para ícones, retratos e cartas?
3. **Escritório no mundo (item 21):** quando alugar a sala, o cenário troca do quarto para o escritório, ou o escritório vira uma segunda sala que dá para alternar?
