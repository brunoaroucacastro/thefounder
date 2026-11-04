# The Founder — GDD consolidado

## Revisão 0.22 — catálogo de gadgets, personas e radar

O cenário de teste fica restrito à empresa de gadgets. O novo fluxo é: escolher a família do produto → executar pesquisa obrigatória de persona → escolher uma entre três pessoas → distribuir quatro pontos → revelar o conceito → construir, testar, divulgar, produzir e vender.

Fone de ouvido, mouse e teclado começam desbloqueados. Após concluir dois produtos, é possível pesquisar caixa de som por R$1.200; a pesquisa leva oito segundos e desbloqueia a família permanentemente nesta empresa. É uma primeira prova da progressão por pesquisa; o catálogo poderá ser ampliado depois.

Cada nova criação exige pesquisa de persona de cinco segundos e R$150, sem gastar uma das quatro decisões estratégicas. Ela revela três perfis: Bia, Ravi e Luna. São as mesmas três pessoas por enquanto, com contextos, dores e prioridades próprios para cada gadget. O banco de personas poderá crescer no futuro. Não existe dado oculto nesta pesquisa.

O radar possui seis eixos, ordenados para formar estes pares opostos: custo × qualidade; velocidade × sustentabilidade; confiabilidade × flexibilidade. São quatro pontos inteiros no total; é permitido concentrar todos num atributo ou distribuir entre vários. Pode retirar pontos antes da construção. Para revelar o conceito, é necessário usar os quatro.

Custo significa foco em economia e acesso; mais pontos reduzem o custo material. Velocidade significa desempenho do gadget. Qualidade refina a experiência; confiabilidade favorece consistência; flexibilidade favorece adaptação; sustentabilidade favorece reparo e menor impacto. Os pesos dos materiais variam por atributo e família.

Aderência considera as prioridades da persona. Cada atributo contribui pela raiz quadrada dos pontos investidos, menos 35% da raiz dos pontos no atributo oposto; a soma ponderada é normalizada e limitada. Assim, concentrar e diversificar têm efeitos diferentes e investir em opostos dilui a especialização. O radar mostra investimento, não uma promessa de pontuação de teste. Aderência influencia conversão real, junto de preço e execução pelo D20. O dado continua medindo execução do protótipo; os pontos definem sua proposta. Nenhuma combinação garante sucesso comercial.

A revelação mostra o gadget, nome, descrição derivada dos atributos, persona escolhida e custo por unidade. Pode voltar e redistribuir antes de construir. A descrição identifica a especialização e sua principal contrapartida. Tipo, pontos e descrição permanecem no histórico. Mouse, teclado, fone e caixa de som têm representações próprias na oficina e na prateleira.

Produção pré-paga, estoque, capacidade de Nina e vendas do catálogo anterior continuam ativos. Pesquisa preparatória do próximo projeto continua separada da pesquisa obrigatória de persona. Salva em `the-founder-gadgets-v1`, preservando partidas anteriores.

Verificação: nove testes de gadgets, incluindo as 126 distribuições possíveis nos três produtos iniciais, comparação de vendas com mesmos dados e desbloqueio; integração do HTML independente com pesquisa, radar, conceito, venda de mouse e criação seguinte de teclado; regressões da operação e do jogo completo. A interface foi executada em DOM/Canvas simulados. Inspeção visual real em navegador e avaliação humana de diversão permanecem pendentes.


## Revisão 0.21 — produção e capacidade implementadas

A oficina agora opera com lotes pré-pagos de 12, 24 ou 48 fones. Materiais saem do caixa no início e só podem ser vendidos quando Nina termina a produção. Durante as vendas, reposição de 12/24 unidades compete com preparar o próximo projeto. As tarefas não gastam mais decisões estratégicas: disputam a única bancada e cobram seus custos. Visitantes continuam chegando enquanto Nina trabalha; sem estoque pronto, a compra é perdida.

Pesquisa preparatória custa R$350 e 12 segundos; reduz o próximo protótipo de R$1.000/10 segundos para R$500/4 segundos. Reposição leva 0,65 segundo por unidade. Lote inicial leva 0,25 segundo por unidade. O aluguel por ciclo passa a R$900. Mantidos R$25 mil iniciais, perfis, D20 e quatro decisões estratégicas. Estes parâmetros substituem os valores do experimento 0.20 abaixo.

Estoque não vendido permanece no catálogo. Ao iniciar outra criação, esses produtos continuam recebendo visitantes enquanto você escolhe e desenvolve o próximo. A demanda residual é limitada a um visitante a cada quatro segundos, com conversão derivada do produto original; não há novo dado por venda. O ciclo do catálogo para na tela de fechamento e nas pausas. A próxima criação mantém caixa e estoque real. Não há produção simultânea de dois projetos nem reposição livre de produtos antigos nesta revisão.

O destaque financeiro do fechamento é **variação do caixa**, incluindo a compra de todo o lote. Estoque restante é mostrado separadamente; o indicador não deve ser chamado de lucro contábil. Receitas do catálogo anterior são explicitadas. A decisão de lote é feita depois do dado de alcance, antes da produção; conhecer interessados não significa conhecer vendas garantidas.

Save próprio: `the-founder-operations-v1`. As partidas 0.20 e do jogo completo permanecem intactas. Para jogar a nova economia, abra o arquivo 0.21. Preparação usa os mesmos personagens e bancada, com barras ligadas às tarefas, caixas ligadas ao estoque e aviso de falta de produto.

Validação: dez testes novos de operação, treze de compatibilidade das regras anteriores, integração do HTML 0.21 e regressão do jogo completo. A integração usa DOM/Canvas simulados; inspeção visual num navegador real permanece pendente. Balanceamento e diversão precisam de avaliação humana.


Revisão 0.20 · documento de design vivo. Consolida o GDD original e as decisões posteriores. Distingue a visão do jogo do experimento disponível; não é uma lista de funcionalidades já entregues.

## O que é o jogo

Um jogo singleplayer de criação de produtos e construção de empresas. Você começa pequeno, escolhe para quem criar, combina características, coloca seu produto no mundo e vê pessoas reagirem. O dinheiro conquistado permite novos produtos, uma equipe melhor e uma empresa maior. Vender ou quebrar encerra uma trajetória e alimenta a próxima com aprendizado.

O prazer principal é criar algo, descobrir uma combinação boa e ver o mercado responder. Construir uma empresa viva sustenta essa experiência. Histórias, negociações e dilemas são complementos.

Plataforma pretendida: PC/Steam. Público inicial do GDD: jovens adultos de 21–30 anos. Referências: Game Dev Tycoon, News Tower, RollerCoaster Tycoon e Supermarket Simulator. Arte: 2D estilizada, pixel art colorida e acolhedora, escritório isométrico, personagens expressivos. Sem controle direto de caminhada: você decide, o time executa no cenário.

## Regras de experiência

- O cenário mostra o trabalho e suas consequências antes de exigir um relatório.
- Cada decisão tem uma troca compreensível: preço versus acesso, qualidade versus tempo, alcance versus margem.
- Uma escolha muda produto, comportamento, compradores ou caixa de maneira perceptível.
- Poucas decisões significativas por ciclo; uma etapa clara por vez.
- Dados criam tensão, com efeitos explícitos e espaço para reagir. Falhar deve sugerir outra tentativa.
- O fechamento celebra o que aconteceu e explica o que travou a empresa.
- Indicadores aprofundados ficam em segundo plano. O aprendizado vem da experiência de jogar.

## Loop principal

Escolher público → criar produto → executar e testar → escolher como divulgar → lançar → observar vendas e reagir → aprender → criar o próximo produto e expandir.

No horizonte longo: fundar → construir portfólio e operação → crescer → vender ou quebrar → recomeçar com conhecimento. Habilidades persistentes, concorrência, regulação e saídas empresariais permanecem parte da visão, sem expansão antes de validar o primeiro loop.

## Criação da empresa

Nome e aparência do founder, nome da empresa, perfil de empreendedor, mercado e capital inicial. As escolhas devem parecer criação de personagem, com prévia visual e descrições curtas.

Perfis: Agressivo, Criativo, Analítico, Comercial, Construtor, Operador, Conector, Visionário, Resiliente, Orientado a impacto e Empreendedor de primeira viagem. Cada especialização dá exatamente +1 em uma categoria de D20 e −1 em outra. Primeira viagem é neutro, 0/0. Distribuição vigente: `PERFIS-EMPREENDEDOR.md`.

| Capital | Caixa inicial | Contrapartida aprovada |
|---|---:|---|
| Próprio | R$25.000 | Sem dívida ou diluição |
| Amigos e família | R$50.000 | Devolução integral no fechamento do mês 6, sem juros |
| Banco | R$80.000 | Amortização em 12 meses e juros mensais sobre saldo devedor |
| Venture capital | R$150.000 | Founder fica com 85%; pressão por resultados |

Na implementação completa atual, banco inicial usa juros fictícios de 2,5% ao mês e principal constante. Sistema de relacionamento com investidores, possível destituição com governança coerente, cultura e branding estão no backlog. O protótipo 0.20 usa somente capital próprio.

## Mercados B2C

Produtos físicos: Gadgets & tecnologia; Moda & vestuário; Consumíveis; Beleza & cosméticos; Pet; Home & Garden.

Plataformas e serviços digitais: Fintechs; Healthtechs; Educação; Redes sociais & conteúdo; Softwares & aplicativos; Mobilidade & delivery. Conteúdo inclui entretenimento. Marketplace saiu da seleção.

Todos usam a mesma régua: tamanho de público potencial, distribuição etária e distribuição por classe A/B/C. Demografia e renda aparecem separadas. Cada mercado tem uma explicação curta. Os percentuais aprovados são posicionamento de gameplay, inspirados em pesquisa, sem pretensão de representar estatísticas populacionais atuais. Tamanho de público não significa compradores garantidos e não pode ser somado entre mercados.

| Mercado | Público estimado | 18–24 | 25–34 | 35–54 | 55+ | A | B | C |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Gadgets & tecnologia | 59 mi | 15% | 25% | 45% | 15% | 55% | 30% | 15% |
| Moda & vestuário | 102 mi | 25% | 45% | 20% | 10% | 20% | 55% | 25% |
| Consumíveis | 115 mi | 10% | 20% | 30% | 40% | 10% | 25% | 65% |
| Beleza & cosméticos | 81 mi | 20% | 45% | 25% | 10% | 50% | 35% | 15% |
| Pet | 52 mi | 10% | 25% | 45% | 20% | 45% | 35% | 20% |
| Home & Garden | 63 mi | 10% | 45% | 30% | 15% | 25% | 55% | 20% |
| Fintechs | 68 mi | 10% | 20% | 30% | 40% | 25% | 50% | 25% |
| Healthtechs | 59 mi | 5% | 15% | 25% | 55% | 50% | 35% | 15% |
| Educação | 46 mi | 50% | 25% | 15% | 10% | 15% | 55% | 30% |
| Redes sociais & conteúdo | 87 mi | 45% | 30% | 15% | 10% | 10% | 30% | 60% |
| Softwares & aplicativos | 76 mi | 45% | 25% | 20% | 10% | 15% | 30% | 55% |
| Mobilidade & delivery | 76 mi | 20% | 25% | 45% | 10% | 15% | 35% | 50% |

## Sistemas do jogo completo

**Produto:** necessidades do público, combinações de atributos, desenvolvimento, qualidade, preço e feedback. Pesquisas e indicadores entram quando ajudam a próxima escolha. Não devem bloquear o primeiro produto com uma sequência confusa de formulários.

**Marketing:** estratégias diferentes para demonstrar valor, gerar atenção e converter. Cada aposta mostra custo, alcance esperado e contrapartida. A experiência deve mostrar pessoas chegando e reagindo; canais e métricas detalham esse comportamento.

**Empresa:** contratar, desenvolver e motivar pessoas; ampliar espaço e capacidade. O trabalho deve ser reconhecível no cenário. Novas ferramentas entram gradualmente conforme a empresa cresce.

**Finanças:** caixa, receita, custos e lucro apresentados separadamente. Precificação e capacidade afetam vendas; dívidas e compromissos têm vencimentos claros. DRE simplificada acessível, sem transformar a partida numa rotina de relatórios.

**Tempo:** o jogador dispõe de poucas ações relevantes por mês. O experimento usa quatro decisões por lote; a integração futura entre lote, agenda e calendário mensal ainda precisa ser validada.

**D20:** rolagem visível com resultado natural, modificadores, faixa e efeito concreto. Os perfis afetam categorias explícitas. Resultado salvo não muda ao recarregar. Não se deve esconder uma sequência de sorteios atrás da animação.

## Protótipo jogável 0.20 — A primeira aposta

Experimento separado para validar o prazer do primeiro produto. Uma oficina, um tipo de produto (fone), três públicos e ciclos repetíveis. Não substitui a versão 0.19 nem lê ou altera seu save.

1. Conhecer Bia (chamadas), Ravi (treino) ou Luna (estudos).
2. Escolher duas características entre bateria, microfone, conforto e proteção contra suor, além de preço e nome. O fone muda visualmente.
3. Ver o time construir na bancada. Testar com D20 e entender a qualidade obtida.
4. Se algo falhar, corrigir com custo e uma decisão ou lançar com a limitação. Um ótimo resultado permite polir ou antecipar demonstração.
5. Escolher demonstração, criador ou oferta. Ver preparação, rolar a campanha e comparar alcance previsto com realizado.
6. Abrir a banca, observar visitantes e vendas, acompanhar caixa e reagir ao preço ou a uma oportunidade comercial.
7. Ver unidades, receita, lucro e causas do resultado; criar outro produto mantendo caixa e histórico na prateleira.

São quatro decisões por ciclo. Construir, divulgar e lançar usam uma cada; corrigir, aceitar a oportunidade ou reajustar preço disputam a margem restante. Clientes atendidos, qualidade e preço influenciam conversão; a campanha determina alcance. Vendas não recebem um dado oculto individual.

Faixas do teste: natural 1 é crítico; total até 10 é parcial; 11–15 entrega qualidade normal; 16–19 entrega qualidade superior; 20+ entrega qualidade excepcional. Na campanha, as faixas multiplicam o alcance por 0,35 / 0,65 / 1 / 1,45 / 1,8. A tela informa consequências concretas: um 12 e um 18 mudam resultados reais.

Valores do experimento: R$25 mil iniciais; projeto R$300; correção R$200 ou R$300 no crítico; divulgação R$200–350; abertura do lote R$100; aluguel por ciclo R$500; capacidade de 36 unidades. Materiais são cobrados nas unidades vendidas. Valores são parâmetros de teste, não compromissos finais de balanceamento.

Controles: mouse, botões acessíveis, pausa, velocidade 1×/3×, som opcional e salvamento automático local. HTML independente, sem instalação ou servidor. O protótipo usa Canvas/JavaScript; Unity continua sendo a intenção original para o produto comercial, ainda sem migração realizada.

## O que fica fora deste experimento

Escolha dos 12 mercados, edição completa do founder, contratação livre, banco/VC, calendário mensal completo, árvore de habilidades, concorrentes, venda da empresa e falência com reinício. Há sistemas anteriores na 0.19; isso não significa que já foram integrados à nova experiência.

Cultura, branding e relacionamento com investidores continuam registrados para depois. Música e arte de produção final, economia de longo prazo e adaptação dos outros mercados também estão pendentes. Preço comercial de US$14,90 é a hipótese original, sem validação atual.

## Como decidir o próximo passo

Validar jogando: a pessoa entende o público, vê o efeito de suas escolhas, entende 12 versus 18, sabe por que ganhou ou perdeu e quer criar o segundo produto? Só ampliar mercados e gestão depois desse sinal. Testes automatizados validam regras e persistência; diversão depende de avaliação humana.
