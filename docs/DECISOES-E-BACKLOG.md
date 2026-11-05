# The Founder — decisões de design e backlog

Atualizado em 05/11/2026. Complemento ao GDD original. Este documento registra discussões; não implica implementação no protótipo.

## Processo de trabalho

Discutir e definir com o usuário antes de alterar o código. Apresentar duas ou três alternativas nas decisões de design, permitindo propostas abertas.

## Criação da empresa

Direção definida: primeiro escolher o perfil do founder; depois escolher entre produto físico, produto digital ou serviço. Cada tipo terá categorias próprias, ainda a definir.

Dez perfis apresentados e recebidos positivamente, a revisar posteriormente: Agressivo, Criativo, Analítico, Comercial, Construtor, Operador, Conector, Visionário, Resiliente e Orientado a Impacto. Traits e efeitos ainda não definidos. O significado de “antrópico” permanece a esclarecer; Orientado a Impacto é uma interpretação provisória.

## Capital inicial — diretrizes do usuário

Os valores absolutos e o balanceamento ainda não foram definidos.

| Origem | Volume inicial | Condições definidas |
|---|---|---|
| Próprio | Muito pequeno; menor das opções | Sem contrapartidas externas. |
| Family and friends | Maior que próprio, menor que banco | Empréstimo de confiança, sem juros, com carência inicial e posterior devolução parcelada. Atrasos afetam relacionamentos. Sem participação societária. |
| Venture capital | Maior das opções | Founder mantém 85% da empresa; investidores têm 15%. Cobrança por resultados rápidos. |
| Empréstimo bancário | Entre family and friends e VC | Pagamento de taxa mensal ao banco até quitar. Definir juros, amortização e vencimento. |

### Family and friends — modelo A aprovado em 31/10/2026

- Amigos e familiares emprestam dinheiro sem juros e sem receber participação societária.
- Há uma carência inicial; depois, o founder devolve o principal aos poucos.
- Atrasos geram conversas difíceis e perda de confiança, reduzindo a disposição dessas pessoas para apoiar a próxima empresa.
- A pressão é pessoal, com prazos mais flexíveis que os do banco.
- Ainda a definir: valor do aporte, duração da carência, parcelas, renegociação e intensidade das consequências de relacionamento.

As alternativas de participação societária e devolução vinculada ao lucro não foram escolhidas.

Questão de design: avaliar adequação do capital próprio mínimo aos diferentes tipos de negócio, preservando uma rota inicial viável para cada um.

## Backlog futuro

- [ ] Inflação dinâmica/macroeconomia. Na Fase 4, usar 3% fixos ao ano sobre custos variáveis e aluguel.

- [ ] Definição da cultura da empresa: escolhas, efeitos e relação com a equipe ainda a discutir.
- [ ] Branding: escopo e mecânicas ainda a discutir.
- [ ] Sistema de relacionamento com investidores: confiança, cobrança e consequências. Relação deteriorada pode permitir a destituição do founder. Definir governança que sustente isso mesmo com 85% de participação econômica; não tratar participação minoritária como poder automático de destituir.
- [ ] Retomar os dez perfis de founder e definir traits, vantagens e dificuldades.
- [ ] Definir categorias de produto físico, produto digital e serviço.
- [ ] Balancear valores, condições e consequências das quatro fontes de capital.

## Direção visual já escolhida

Escritório isométrico, pixel art vibrante e caricata, interação por objetos do cenário. Referências fornecidas: Game Dev Tycoon, News Tower e escritório em pixel art.

## Setores aprovados — revisão de 31/10/2026

Foco B2C, mantendo os dois lados. Esta seleção substitui a lista inicial de 12 arquétipos no planejamento; migração do jogo ainda pendente.

### Produtos físicos

1. Gadgets & tecnologia.
2. Moda & vestuário (brandwear).
3. Consumíveis, com alimentos e bebidas como exemplos.
4. Beleza & cosméticos — maquiagem, perfumes e cuidados com a pele.
5. Pet — produtos e acessórios para animais de estimação.
6. Home & Garden — utensílios domésticos, organização, decoração, vasos, ferramentas e produtos de jardinagem e cultivo.

Mecânicas e públicos específicos ainda a definir.

### Plataformas e serviços digitais

1. Fintechs.
2. Healthtechs.
3. Educação.
4. Redes sociais & conteúdo — inclui streaming e entretenimento.
5. Softwares & aplicativos — inclui jogos.
6. Mobilidade & delivery.

Marketplace removido da seleção por decisão do usuário.

Usar a mesma régua: tamanho do público, demografia e renda. Separar visualmente demografia e renda. Mostrar descrição curta por empresa e descrição, prós e contras por perfil de founder.

Outros setores físicos além dos seis listados não foram aprovados. A renomeação de Consumíveis para Alimentos & bebidas também não foi confirmada.


## Revisão de conversão — 02/11/2026

Decisão mais recente sobre aquisição: mostrar CAC em reais (cálculo interno pode partir de percentual). Campanhas aumentam interessados, sem bônus direto de conversão. Revisar os demais pontos com o usuário antes da atualização consolidada do código. Registro detalhado em REVISAO-CONVERSAO-DECISOES.md; prevalece sobre propostas anteriores conflitantes.


Ponto 2 aprovado: nota linear com normalização fixa. Adicionar pontos em atributo de peso zero não reduz nota nem conversão ao mesmo preço. Economia reduz custo sem penalidade implícita de valor percebido. Redistribuir retirando pontos relevantes pode reduzir a nota. Ver REVISAO-CONVERSAO-DECISOES.md. Código continua aguardando revisão consolidada.


Ponto 3 aprovado: CAC unitário em reais conhecido antes do preço, parametrizado internamente por percentual do custo do produto (exemplo: 25% de R40 = R10). Contribuição = preço menos custo do produto menos CAC. Preço livre e contribuição negativa permitidos. Não usar comissão sobre o preço de venda nem expor o percentual ao jogador. Alinhar cobrança e verba total na consolidação, sem duplicar aquisição. Ver REVISAO-CONVERSAO-DECISOES.md.


## Consolidação 0.29 — 02/11/2026

Implementados CAC antes do preço e contribuição após CAC, nova conversão sem bônus de campanha, mínimos graduais relevantes e feedbacks, pesquisa de mercado R$1.000 com duas personas e idade, descarte pré-MVP e lançamento com ciclo finito e reposição. Nova partida preserva o save anterior. Detalhes em GDD-029-MERCADO-E-PRODUTO.md. Último upgrade aguarda discussão; não foi rebalanceado.


## Backlog — minigames de marketing (05/11/2026)

Bruno aprovou duas mecânicas como boas candidatas: "ficaram bem maneiras". Elas ficam guardadas para desenvolvermos juntos depois. Ainda não estão no jogo. As outras três testadas (combos, decifrar canais e propostas) e a do mapa de boca a boca foram descartadas.

Protótipo jogável: amostras-marketing/laboratorio.html, com as duas abas.

### Central de oportunidades

Inspirada na mecânica de Dispatch. Oportunidades descritas só em texto aparecem com tempo para acabar, e o jogador manda a pessoa certa do time. Quem foi enviado fica ocupado por alguns segundos. Foi a primeira que divertiu no teste.

### Marketing Viral (tabuleiro)

Puzzle de 10×10 com 3 personas, 3 entusiastas e 3 detratores. O jogador recebe 5 cartas (Influenciador, Redes Sociais, Assessoria PR) e joga 3. Regras completas: docs/gdd/sistemas/GDD_Minigame_Marketing_Tabuleiro.pdf.

Decisões assumidas no protótipo, onde o GDD não fechava: célula já bloqueada não reage nem conta; dois detratores atingidos na mesma jogada disparam os dois; a célula do detrator fica bloqueada e não conta como alcance.

### A definir quando retomarmos

- Usar uma das duas, as duas ou uma mistura, e em que momento do jogo cada uma aparece.
- Com que frequência roda (por semana ou por campanha) e como isso conversa com as vendas sem prazo.
- Como o resultado vira interessados e vendas no jogo.
- Como as personas v2 e o mix de canais entram: no protótipo do tabuleiro, as personas são só estrelas, e os canais do jogo são 6 enquanto as cartas são 3.
- Como manter a descoberta de canais sem dicas, até existir a mecânica em que o time passa esses dados.
- Balanceamento: os números dos protótipos são provisórios.
- Enquanto isso, a tela atual de controles continua no jogo, com a previsão de interessados que muda ao vivo e revela o melhor mix.
