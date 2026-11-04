# The Founder — GDD consolidado

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
