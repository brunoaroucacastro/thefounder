# 0.80 · Escritório e equipe (RH)

- Ao faturar R$100 mil no total, chega a proposta de uma sala comercial: 2 vagas, aluguel de R$2.500 por semana.
- Novo botão EQUIPE: buscar candidatos por área (R$1.500, 2 dias úteis, 2 candidatos), contratar, treinar e demitir.
- Níveis 1–5 (Júnior 60%, Pleno 35%, Sênior 5%), salário semanal por nível, motivação de 0 a 100 (cai 2 por semana; sobe com boas campanhas, contratações e treinos; cai com flops, demissões e treinos que falham).
- Produto: +1 no D20 de desenvolvimento, 4 peças na prancheta, desenvolvimento 15–35% mais rápido.
- Marketing: +1 carta jogada na campanha e +4% de pontuação por nível.
- Administrativo-financeiro: empréstimos com +20% de valor e 50% mais semanas, e compra programada de estoque (quando chegar a X, comprar Y).
- Conselhos: com chance por senioridade (10/20/40%), o especialista dá uma dica na sua etapa (persona, canal ou preço).
- Treino: custa R$1.500 × nível, chance de 75% a 40%; ao subir de nível, o salário sobe.
- Cenário de teste: dist/The-Founder-Cenario-NV8-Escritorio-0.80.html (gerado por scripts/build-scenario-nv8.cjs).

# 0.79 · Balanço com gráficos, preço por campanha e trocas com valor fixo

- Prancheta: toda oferta tem pelo menos uma peça Comum ou Incomum (as menores), de preferência uma que caiba no espaço livre.
- Trocar peças e trocar cartas de marketing agora têm preço fixo: 1/3 do custo de desenvolvimento do nível (NV4 R$1.350, NV5 R$1.800, NV6 R$2.400, NV7 R$3.300, NV8 R$4.400, NV9 R$6.000, NV10 R$8.000).
- Antes de cada nova campanha, o jogo pede para definir o preço.
- Balanço semanal com gráfico de barras das últimas 8 semanas: faturamento (padrão), lucro, clientes novos e novos seguidores, com variação contra a semana anterior.
- Custo zero não aparece mais como -R$ 0 em vermelho.

# 0.78 · Crescimento de público para escalar

- Degraus de distribuição achatados: ×1, ×2, ×3,5 e ×5 (antes ×1, ×2,5, ×6 e ×12), para o topo não explodir.
- A distribuição também destrava pelo nível do produto com nota média 4+: ×2 no NV6, ×3,5 no NV8 e ×5 no NV10. Vale o maior entre nível e segmentos validados.
- Cada nova versão renova a novidade da campanha, como um lançamento.
- Seguidores: retêm 50–80% dos compradores satisfeitos (antes 35–65%) e perdem 1% por semana (antes 2%).
- Ainda sem calibração por simulação.

# 0.77 · Detalhes de produto, marketing e dados

- Avançar até terminar agora aparece na barra de velocidade (selo ACELERANDO, 1×/2×/4× desmarcados); clicar numa velocidade cancela.
- A barra de tarefa mostra os dias para conclusão e quanto falta (ex.: 4,3 dias para conclusão, falta 86%).
- A campanha depois de melhorar o produto não pede mais para escolher outra persona.
- Avaliações das versões anteriores ficam guardadas: aparecem em Versões anteriores da linha, com nota média e comentários.
- Redistribuir (R$750) agora leva para a prancheta no mesmo nível, sem dado.
- Dificuldade do marketing sobe mais devagar: Iniciante nas 4 primeiras campanhas, Em crescimento até a 10ª, Experiente até a 18ª.
- Aprendizado de produto voltou a funcionar (procurava as personas antigas).
- As metas do dado aparecem antes de investir: teste do protótipo 11+, evolução com a meta e a chance.

# 0.76 · Evolução mais acessível e nova rolagem paga

- Metas da evolução 2 pontos menores: NV4→5 6+, 5→6 8+, 6→7 10+, 7→8 12+, 8→9 14+, 9→10 16+.
- Custos fixos e múltiplos de 3: R$5.400, R$7.200, R$9.900, R$13.200, R$18.000, R$24.000.
- Se a tentativa não passar, dá para rolar de novo por 1/3 do custo; cada nova rolagem dobra (ex.: 1.800, 3.600, 7.200…).

# 0.75 · Banco e empréstimos

- Nova seção Banco em Caixa: empréstimo Pequeno (R$10.000, 4 semanas, 8%), Médio (R$30.000, 8 semanas, 15%) e Grande (R$80.000, 12 semanas, 25%).
- Um empréstimo por vez. Médio libera depois de 1 produto com lucro, Grande depois de 3.
- A parcela sai do caixa no fim de cada semana; os juros aparecem como despesa no relatório.
- Se faltar caixa: multa de 10% somada à dívida. No segundo atraso, o banco vende o estoque com 50% de desconto (no máximo o custo do estoque) para cobrar.
- Na tela de lote, com empréstimo ativo, aparece quantas unidades por semana é preciso vender para cobrir a parcela.

# 0.74 · Caixa em tempo real

- O caixa na barra de cima sobe a cada venda, com um brilho verde, em vez de só atualizar quando a fase muda.

# 0.73 · Feedbacks de 07/11: clareza e economia

- Catálogo: deixa claro que você vai desenvolver o produto do zero, não comprar um pronto.
- Tutoriais curtos que abrem na primeira vez e ficam num botão ? : como desenvolver (prancheta), personas e necessidades, preço e margem de contribuição, campanha de marketing.
- Campanha: objetivo em destaque (alcançar todas as personas ★), passo 1º canal / 2º tabuleiro, cartas pulsando enquanto nenhuma está escolhida e aviso ao clicar no tabuleiro sem carta.
- Persona alcançada fica verde com brilho.
- Redes Sociais: 10 pessoas ao acaso em todo o tabuleiro.
- Economia: produto que atende a persona agora tem mais conversão e aceita preço maior; produto errado continua igual. Na simulação, o mesmo lote de 100 fones a R$110 vende em 19 dias (antes nem vendia) e a R$90 em 10 dias (antes 92).
- Descanso de fim de semana e céticos foram para o backlog.

# 0.72 · Nome do produto em popup

- O campo de nome saiu do topo da criação. Quando a montagem termina e o radar aparece, abre uma popup pequena no meio da tela pedindo só o nome.
- O nome é obrigatório (pelo menos 2 letras); depois de confirmado aparece no topo e fica definitivo ao sair da prancheta.

# 0.71 · MVP mais barato e evolução que encarece

- O MVP passa de R$8.000 para R$4.000.
- Cada evolução de nível custa mais que a anterior, sempre acima do MVP: NV4→5 R$5.400, 5→6 R$7.300, 6→7 R$9.850, 7→8 R$13.300, 8→9 R$17.950, 9→10 R$24.200.

# 0.70 · Peças de encaixe na prancheta

- Três peças novas de 2 casas separadas, Incomuns (+2): cantos opostos, e dois saltos de cavalo espelhados.
- Elas completam os buracos que a escada de 5 casas deixa no 3×3: a peça nova fecha o canto e sobra um dominó (ou a dupla diagonal) para o resto.
- Agora são 34 formas.

# 0.69 · Fim de semana com som

- Na sexta, a música vai sumindo aos poucos até o fim da semana.
- Quando a semana acaba, toca o Short UI Break e, em seguida, o bocejo.
- Na semana seguinte, a música recomeça do início.
- Crédito adicionado em docs/CREDITOS.md.

# 0.68 · Palavras-chave e ajuda dos atributos

- As falas das personas destacam em negrito o trecho que revela o que importa (ou não importa) para elas, nas 72 frases.
- Na prancheta, cada atributo tem um ? na bolinha: clicando, aparece uma descrição curta que vale para qualquer produto.

# 0.67 · Som do dado

- Ao rolar o D20 toca uma rolagem sorteada entre 9 cortadas do arquivo de dado, sem repetir a anterior.
- Crédito adicionado em docs/CREDITOS.md.

# 0.66 · Som

- Música de fundo em loop (And So It Begins, de Artificial.Music).
- Menu de som no botão ♫ da barra de cima: liga e desliga a música e os efeitos, com volume separado para cada um. A escolha fica salva no navegador.
- Efeitos: moeda a cada venda, notificação ao encaixar peça ou jogar carta de marketing, bocejo no fim da semana, teclado de vez em quando durante um trabalho, clique em elementos.
- Dado: 20 natural toca o sucesso máximo, acima de 10 toca o sucesso, de 2 a 10 toca o erro e 1 natural toca a falha máxima. No tabuleiro de marketing vale a nota da campanha.
- Créditos dos sons em docs/CREDITOS.md. Os arquivos ficam em dist/audio, ao lado do HTML.

# 0.65 · Nome definitivo, custos em vermelho e Nexus social

- O produto não tem mais nome genérico: é preciso dar um nome antes de sair da prancheta, e depois ele fica travado.
- Nos balanços, custos aparecem em vermelho e com sinal negativo; resultados negativos também.
- Os canais da campanha geram posts no Nexus: jornal (PR), telejornal (TV), influenciadora, outdoor, blog de comparativos (SEO), newsletter, anúncio patrocinado e artigo da marca.
- Nexus com cara de rede social: perfil da empresa com seguidores e curtidas, abas Tudo/Imprensa/Clientes/Sua marca, selo de verificado e manchetes.

# 0.64 · Pistas do que não importa mais claras

- O comentário que aponta o atributo sem importância agora começa sempre com “Não me importo…”, nas 24 personas, para não ser confundido com uma exigência.
- Planilha docs/PERSONAS-E-AVALIACOES-v2.xlsx atualizada.

# 0.63 · Montagem do produto em janela grande

- Corrige a grade do produto, que aparecia encolhida a ponto de sumir.
- Montar e melhorar o produto agora abre numa janela grande no meio da tela, com a grade à esquerda e as escolhas à direita.
- Girar vale para as 3 formas de uma vez e fica ao lado de Trocar peças.

# 0.62 · Campanha com mais canais e fases

- O tabuleiro agora tem 8 canais com padrões próprios: Influenciador, Assessoria PR, Out of Home, SEO, Redes Sociais, E-mail, Conteúdo e Televisão.
- Redes Sociais passa a ter região escolhida; E-mail só alcança vizinhos de quem já foi atingido; Conteúdo cresce na jogada seguinte.
- Quatro fases pela experiência da empresa em campanhas, de 6×6 a 12×12, com Céticos, Concorrentes e Comunidades.
- A pontuação usa percentual do público e multiplicador de personas, e os canais preferidos da persona influenciam o resultado, com relatório por canal no fim.
- Trocar cartas custa R$ 1.000 e dobra a cada troca na campanha.
- A campanha perde força ao renovar sozinha; uma nova campanha renova o alcance.

# 0.61 · Escolher peças ao melhorar o produto

- Ao melhorar o produto, as peças da versão anterior voltam, e o jogador escolhe quais manter. Esta é a única hora em que peças podem sair.
- O limite passa a contar o total de peças, de 3 na V1 a 9 na V7.
- Casas inutilizáveis surgem só na parte nova da grade, para nenhuma peça mantida se perder.

# 0.60 · Prancheta com peças sorteadas

- Em partidas novas, o produto é montado escolhendo 1 de 3 formas sorteadas, em qualquer atributo. Colocou, ficou; ao escolher, as 3 são trocadas.
- 31 formas em quatro raridades, inclusive separadas. Mais complexa vale mais e é mais rara.
- Limite de peças e grade por versão, de 3 peças em 3×3 a 7 peças em 6×6, com estrelas, cantos perdidos e o conflito entre Qualidade e Economia nas versões avançadas.
- Trocar peças custa R$ 1.000 e dobra a cada troca na montagem.
- Radar e régua de pontuação aparecem no fim da montagem. Oferta salva na partida, sem reroll ao recarregar.

# 0.59 · Campanha no tabuleiro

- Em partidas novas, a campanha é jogada no tabuleiro Marketing Viral antes de abrir as vendas, no lugar do mix de canais e do D20 da campanha.
- A pontuação define a força: de flop a muito bem direcionada, mudando o número de interessados.
- O D20 do protótipo e o da melhoria continuam.

# 0.58 · Quebra-cabeça de decisões

- Em partidas novas, criar e melhorar o produto usa o quebra-cabeça no lugar dos pontos: peças de decisão num espaço limitado, com vizinhos que ajudam ou atrapalham.
- O espaço cresce com o nível do produto (de 4×3 a 7×6). As regras valem para todo produto; só os nomes das peças mudam.
- O que a persona quer continua escondido: a dedução vem dos comentários e das avaliações.
- Protótipos em amostras-produto/laboratorio.html.

# 0.57 · Feedbacks do playtest

- Corrige bug: melhorar o produto ou criar outro perdia as personas e os canais v2, derrubando a conversão de algumas personas.
- Corrige bug: saves com personas v2 eram recusados na fase de vendas ao carregar.
- Vendas sem prazo: a campanha renova sozinha até o estoque acabar ou o jogador encerrar; sai a contagem de dias restantes.
- Faltam N vendas agora atualiza ao vivo.
- Desenvolvimento mais curto (protótipo 2 dias, campanha 1 dia) e mensagens do que está sendo feito em cada etapa.
- Produto pode ser renomeado a qualquer momento.
- Tela do protótipo sem texto espremido; lote com faixas de desconto clicáveis; sai a dica de preço da pesquisa.

# 0.56 · Modo de testes sem depender do navegador

- Corrige o aviso Salvamento indisponível, que travava o jogo ao abrir em locais sem armazenamento, como o painel do app.
- No modo de testes a partida fica só na memória: funciona em qualquer lugar, com várias abas ao mesmo tempo, e não apaga saves antigos.

# 0.55 · Modo de testes

- Temporário: toda vez que o jogo é aberto ou recarregado, a partida começa do zero e o save anterior é apagado. Para desligar, use START_FRESH = false em src/first-loop/play.js.

# 0.54 · Legendas dos canais

- Marketing explica o que é cada canal, sem dizer para qual público ele funciona.
- Comparar campanhas mostra quanto o mix rendeu, na escala de ×0,80 a ×1,50.
- Decisão de design: as personas não dão pistas de canal; o jogador descobre comparando resultados.

# 0.53 · Personas, canais e avaliações v2

- 24 personas novas (6 por produto) com pesos 35/25/20/10/10/0 equilibrados: cada atributo é o principal de exatamente uma persona; cada uma tem um atributo que não importa.
- Idades equilibradas (25% por faixa em cada produto), com mais público 55+. O mínimo exigido é o atributo principal de cada persona, inclusive Versatilidade.
- Pesquisa mostra a fala da persona e três comentários que dão pistas dos atributos, sem citar nomes.
- Canais novos: SEO, Redes Sociais (Influenciadores), E-mail Marketing, Out of Home, PR e Produção de Conteúdo. Cada persona tem um mix ideal; a eficiência do marketing é a sobreposição entre o seu mix e o dela.
- 161 frases de avaliação, sem repetição e quase sem citar o atributo pelo nome.
- Vale para partidas novas; saves anteriores mantêm as personas e os canais antigos.
- Fonte: docs/PERSONAS-E-AVALIACOES-v2.xlsx. Teste: node tests/personas-v2.cjs.

# 0.52 · Correções do playtest

- Botão ⏩ Avançar até terminar nas esperas de pesquisa, protótipo, campanha e montagem (cerca de 8× mais rápido; para no fechamento da semana).
- Escolher o gadget pede confirmação antes de cobrar a pesquisa.
- Etiqueta de preço mostra a faixa de valor percebido pela persona; lote mostra interessados previstos, caixa e faixas de desconto.
- Resultado do D20 da campanha explica o alcance: base × mix × dado.
- Trilha de criação com as etapas reais; texto do fim de semana reescrito; fechamento usa Fechar a semana.
- Vendas e resumo mostram quantas vendas faltam para pagar o investimento e o lucro por venda depois disso.
- Nina passa a ser a sócia com oficina própria e aparece em chamada no monitor enquanto trabalha.
- Tema: resumo de estoque legível, blocos claros no lugar do bege antigo, texto secundário dos botões em linha própria, layout compacto em telas pequenas.
- Planilhas em docs/: PLAYTEST-051.xlsx (status dos problemas) e PERSONAS-E-AVALIACOES.xlsx (personas, canais e avaliações para revisão).

# 0.51 · Quarto do fundador em ilustração vetorial

- A oficina em pixel foi substituída pelo quarto do fundador: cena isométrica vetorial com luz da janela, luminária, varal de luzes, gato e sombras suaves, nítida em qualquer resolução.
- Pontos clicáveis no próprio quarto: computador (criar e acompanhar), estante (produtos), cofrinho (caixa) e quadro de notas (clientes).
- O fundador trabalha sentado no computador e vai até as caixas para montar o lote; as caixas no chão e a estante mostram o estoque.
- A tela do monitor muda com a fase: pesquisa, projeto do produto e painel de vendas, com destaque a cada venda e avaliação.
- Interface com novo tema: tipografia sem serifa, cartões arredondados e a mesma paleta da cena. Regras, economia e saves não mudaram.

# Organização dos recursos visuais

- Ícones SVG versionados como arquivos de origem e incorporados ao gerar a versão offline.

# 0.49 · Nova arte da oficina

- Refeitos piso, paredes, janelas, balcão e detalhes de personagens. Sombras de contato e iluminação na mesma projeção isométrica.

# 0.48 · Recursos visuais da navegação

- Ícone Oficina: Office Chair de Delapouite, via Game-icons.net (CC BY 3.0), com fundo removido e cor adaptada. https://game-icons.net/1x1/delapouite/office-chair.html · https://creativecommons.org/licenses/by/3.0/
- Ícone Clientes: personagem blue.svg de GDQuest (CC0). https://github.com/GDQuest/game-sprites

## 0.47 — Audiência e saturação de gadgets

- Base da empresa, reputação, distribuição e renovação por produto e persona.
- Campanha unificada com escolha de público e previsão de alcance.

## 0.46 — Decisões e continuidade de vendas

- Prioridades independentes de marketing e mix normalizado.
- Lotes ajustáveis por passos, reposição após campanha e prorrogação de sete dias.
- Controles de venda estáveis, investigação de marketing e ritmo mais lento nas decisões.

## 0.45 — Tempo de planejamento do produto

- O calendário avança à metade da velocidade durante escolhas e ajustes de produto.

## 0.44 — Ritmo do dia útil

- Dia útil de 18 segundos em 1× e pausa durante o planejamento de marketing.
- Progresso e vendas processados ao longo do dia, com relógio de ponteiros.
- A reação ao D20 distingue falha crítica do multiplicador de marketing.

## 0.43 — Nexus e reputação

- Feed automático de lançamentos e experiências de compra, com perfis e novidades.
- Avaliações e posts sorteados independentemente a partir da mesma experiência.

## 0.42 — Fechamento financeiro semanal

- Receita, despesas e resultado com comparação semanal e caixa separado.
- Conciliação de recebimentos e pagamentos, alerta de caixa negativo e registros datados.
- Despesas recorrentes liquidadas antes da consolidação, com categorias de equipe e aluguel.

## 0.41 — Sprints semanais e fim de semana

- Cinco dias úteis por sprint, com pausa e velocidades 1×, 2× e 4×.
- Desenvolvimento e campanha avançam em dias úteis.
- Fechamento financeiro de sexta-feira, histórico e escolha de fim de semana.

## 0.40 — Marketing e tração

- Mix de seis canais com esforço total de 100% e saturação por persona e produto.
- Lançamento pelo e-commerce com histórico de alcance e campanhas sem cobrança.

## 0.39 — Planejamento do lote

- A tela de produção identifica a quantidade a fabricar para o estoque e o custo do lote.

## 0.38 — Radar na criação

- O radar volta a aparecer junto aos controles de atributos.

## 0.37 — Oficina com contornos mais definidos

- Cena renderizada na densidade da tela e prévia do produto com mais resolução.
- Sprites dos gadgets redesenhados e detalhes adicionais na bancada e nos personagens.

## 0.36 — Oficina isométrica e criação dentro do jogo

- Oficina em pixel art com projeção única, mobiliário reutilizável e personagens animados.
- Estoque, pesquisa, montagem e atendimento aparecem no cenário.
- Barras de jogo, fonte pixel incorporada e consultas a Produtos, Clientes e Caixa.
- Painel lateral de criação com sprite, persona e pontos de atributos.
- Regras, preços, economia e saves preservados; validação no navegador e testes de integração.

## 0.35 — Menos exposição, mais oficina

- Persona com faixa única; afinidades de canais e ações descobertas ao jogar.
- Cards legíveis, identidade roxa/creme e botões consistentes; explicações opcionais.
- D20 compacto com cenas e reações humanas, mantendo efeitos e aleatoriedade.
- Quantidade livre com slider e campo numérico; descontos preservados.
- Placar animado com vendas, gráfico, estrelas, conversão e contribuição reais.
- Evolução volta aos atributos do novo nível antes da campanha, sem cobrar de novo.
- Saves preservados; fluxo validado por testes e inspeção de navegador.

## 0.34 — Ritmo e retorno para reinvestir

- Economia mais generosa para produtos alinhados; MC sugerida de 35%, preço livre e preços excessivos ainda perdem vendas.
- Produção 4× e vendas 8×; lançamento único com D20 central e efeitos explícitos.
- Persona persistente, radar corrigido, conversão ao vivo e caderno de descobertas.
- Vitrines gratuitas por idade; campanha por ações opcionais com custos fixos separados do CAC.
- Interrupção corrigida, reposição clara, crédito de 80% por desmantelamento e redistribuição por R.
- Contabilidade separa contribuição, investimento e caixa; testes de conservação e migração.

## 0.33 — Interromper vendas e corrigir o rumo

- Botão para encerrar a janela e retornar às decisões, inclusive durante uma proposta de loja.
- Atalho de reajuste de preço para a próxima campanha, sem segundo MVP.
- Estoque, vendas e gastos preservados; contatos cancelados não viram visitas fantasmas.
- Estrutura proporcional ao tempo da janela, sem multa de cancelamento ou cobrança duplicada.
- Produção já paga continua e descobertas exigem evidência real.
- Seis novos testes de regras e integração do HTML; regressões preservadas.

## 0.32 — Descobertas com D20

- Investigação opcional de Produto ou Campanha após experiências com evidência suficiente.
- D20 com alvo 11, crítico, descobertas, intuição e tentativa única persistida antes da animação.
- Memória contextual da empresa, símbolos nos atributos e canais e indicação de personas conhecidas.
- Responsável e bônus de análise preparados para futura equipe; contratação não adicionada nesta etapa.
- Saves anteriores preservados com backup, sem inventar evidência histórica.
- Testes de regras e integração do HTML para descoberta, persistência e reutilização.

## 0.31 — Alcance e CAC por unidade

- CAC variável por unidade vendida, sem reserva fixa ou teto de 36 clientes; desconto industrial não reduz o CAC da versão.
- Alcance calibrado por quatro idades, D20 0,60–1,40 e chegadas que atendem a janela inteira.
- Fechamento separa demanda, preço, estoque, caixa e lucro operacional por rodada.
- Migração com backup, devolução única de saldo antigo e histórico preservado.
- Dez testes novos da economia, integração do HTML e cenários completos.
- Proposta de descobertas com D20 baseada em fontes primárias de Game Dev Tycoon; ainda sem implementar.

## 0.30 — Pedidos e evolução sem brechas

- Pedido de loja respeita a aceitação do preço com desconto; validação na oferta e na confirmação.
- Melhoria exige caixa para a tentativa, campanha atual e lote mínimo da próxima versão antes de cobrar. Cancelar o plano preserva a versão atual.
- Conversão, CAC e equilíbrio das campanhas preservados; diagnóstico do teto de aquisição registrado.
- Save 0.29 mantido. Regressões de exploração e progressão incluídas.

## 0.29 — Mercado, produto e lançamento

- Pesquisa de mercado por R$1.000 entrega duas personas sorteadas; nova rodada paga e idades visíveis.
- Persona reaparece na bancada e na campanha; descarte de projeto antes do MVP sem reembolso de pesquisa.
- Uma exigência relevante por persona, penalidade gradual oculta e aprendizado pelos reviews.
- Nova conversão por produto, preço relativo e boca a boca, sem bônus direto de marketing ou penalidade de Economia irrelevante.
- CAC contratado em reais, reserva e consumo por cliente; margem após CAC, preço digitável e contribuição negativa permitida.
- Estoque em destaque, reposição durante e entre rodadas e janela de lançamento de até sete dias.
- Saldo da reserva devolvido, estoque restante guardado e três caminhos após encerrar; sem renda automática do catálogo.
- Save separado preserva a 0.28. Dez testes focados, integração do HTML e regressões; sem varredura massiva.

## 0.28 — Campanhas e descoberta

- Alcance por quatro idades, verba, praça, persona, D20, marca, boca a boca, cobertura e desgaste.
- Pontos recalibrados para permitir concentração e mistura conforme o contexto.
- Recomendações orgânicas sem nova verba, com teto por clientes pagos e por janela; sem cascata.
- Pistas qualitativas após campanhas, sem pesos de persona, adequação numérica ou previsão exata de compradores.
- CAC pago separado das indicações, contabilidade preservada e migração 0.27 com backup.
- Testes de regras, duas campanhas em interface simulada e 1.400 combinações de balanceamento.

## 0.27 — Produto e persona

- Dez personas de fone; seis atributos universais, pesos fixos e sem classe de renda.
- MVP 4 pontos; evolução até 15, teto 5 por atributo, redistribuição por geração.
- Valor percebido, conversão e reviews relativos ao produto, preço e expectativas.
- Save separado, paginação das personas, testes de regras e integração.

# Histórico de desenvolvimento

## 0.26 — Público vivo, CAC e panorama por produto

- Preço antes do D20 da campanha, CAC estimado/realizado e contribuição após aquisição sem cobrança duplicada.
- Panorama opcional com vendas, investimento, resultado, caixa, estoque, CAC e estrelas por linha e versão.
- Três caminhos após o ciclo: novo produto, otimização e continuar vendendo.
- Aquisição e reconversão com interessados identificados, expiração e limite de convites.
- Conversão ligada a produto, preço e prova social; perfis de compradores e reviews variados por compra real, com RNG separado dos dados.
- 22 testes novos de regras, integração do HTML, migração por cópia e regressões anteriores.


## 0.25 — Evolução e novas campanhas do produto

- MVP nível4, evolução até10 com custos e dificuldades crescentes, +1 atributo e nome da nova geração.
- Tentativas falhas preservam produto e estoque; sucessos criam projeto novo e mantêm unidades antigas no catálogo.
- Novas campanhas pagas do produto atual, três tamanhos, pontos próprios e D20; substituídas ondas gratuitas.
- Dados e investimentos persistidos uma única vez; lançamento da nova geração cobra melhoria e campanha, sem outro MVP.
- Importação por cópia do save0.24, onze testes de regras e integração do HTML com regressões anteriores.


## 0.24 — D20 de volta e produção em volume

- Restabelecidos D20 do protótipo e da campanha com efeitos reais e resultados persistidos.
- Preço movido para depois do marketing e do lote; margem de contribuição inclui desconto de fabricação e comissão.
- Quantidade livre de 100 a 10.000 unidades, descontos de 0/2/4/6/8/10% e compra antecipada condicionada ao caixa.
- Reposição por volume com lotes, custo médio e baixa conciliados; reviews e continuidade preservados.
- Dez testes de regras e integração do HTML 0.24; save independente e regressões anteriores.


## 0.23 — Os 4Ps, MVP de R$8 mil e reviews reais

- Produto com até quatro pontos e linguagem simples; persona sem orçamento explícito.
- Desenvolvimento fixo de R$8.000 separado do custo variável e do estoque; preço numa etapa própria com margem bruta.
- Praça com alcance/comissão e promoção com até quatro pontos; construção direta sem D20 neste fluxo.
- Relógio contínuo, novas janelas para vender o mesmo produto e avaliações de 1–5 estrelas a cada dez unidades vendidas.
- Save próprio e dez testes de regras mais integração do HTML independente.


## 0.22 — Gadgets, pesquisa de persona e radar de atributos

- Catálogo inicial com fone, mouse e teclado; caixa de som pesquisável após duas criações.
- Pesquisa obrigatória revela três personas com dores próprias para cada tipo de gadget.
- Radar com seis eixos opostos e quatro pontos livres; atributos alteram custo material, aderência e vendas.
- Revelação do conceito com desenho, nome e descrição da proposta e contrapartida; histórico e prateleira preservam a família criada.
- Save independente; nove testes de gadgets, integração do pacote 0.22 e regressões anteriores.


## 0.21 — Produção em lotes e capacidade compartilhada

- Lotes pré-pagos de 12/24/48 unidades, estoque físico e compradores perdidos sem reposição.
- Nina divide a bancada entre reposição e preparação do próximo projeto; pesquisa reduz custo e duração da criação seguinte.
- Estoque do catálogo anterior continua vendendo enquanto outro produto é desenvolvido.
- Custos reequilibrados mantendo R$25 mil iniciais; fechamento destaca caixa e estoque encalhado separadamente.
- Save independente e dez testes de operação, com integração do HTML 0.21 e regressão anterior.


## 0.20 — A primeira aposta

- Novo experimento independente: oficina animada, público concreto, fone com duas características visíveis e preço.
- Construção, teste e preparação de campanha acontecem no cenário; D20 mostra faixas e efeitos reais de qualidade, alcance e vendas.
- Vendas por visitante, custos conciliados, reajuste em andamento e oportunidade comercial disputando a última decisão.
- Resumo causal e novo produto com caixa e histórico preservados; save isolado e proteção contra duplicação/conflito entre abas.
- GDD consolidado, 13 testes de regras e integração do HTML empacotado. Versão completa 0.19 preservada.


## 0.19 — Fechamento com consequências em destaque — 31/10/2026

- Resumo narrativo do mês com resultado operacional e mudança no caixa separados, novos compradores, conquistas e alertas.
- Destaques factuais para lançamento, primeiro faturamento e primeiro lucro, sem recompensas inventadas.
- Conquistas e problemas derivam do relatório salvo; apresentação não recalcula a economia nem rola dados.
- Sugestão contextual de próxima área; DRE completa, produtos, motivação, ROAS e replay continuam acessíveis.
- Som breve só quando o áudio já estiver ligado; animações respeitam movimento reduzido.
- Nove testes de fechamento, incluindo não duplicação, falência, neutralidade e lucro versus liquidez.
- Análise da gameplay registrada separadamente, com propostas ainda não implementadas.


## 0.18 — Menus mais claros e direção acolhedora — 31/10/2026

- Cabeçalho compacto por área, retrato pixel do founder e navegação direta entre menus.
- Janela ampliada com corpo rolável; barra inferior duplicada some enquanto a aba está aberta. Sem reintroduzir Missão ou agenda nas abas.
- Ações de produto sobem para o topo; funil de marketing e adoção ficam expansíveis.
- Paleta pastel vibrante, cores por área, botões com resposta de clique e animações que respeitam movimento reduzido.
- Escritório mais claro e marcadores mostram quantas ações foram planejadas na área.
- Testes de regras existentes e pacote final em DOM simulado passaram. Inspeção visual real pendente.


## 0.17 — Prazos do capital inicial — 31/10/2026

- Banco inicial: 12 pagamentos de principal + juros de 2,5% sobre o saldo, primeira cobrança no mês 1.
- Amigos/família: devolução integral no mês 6, sem parcelas anteriores.
- Previsão, fechamento e painel usam a mesma regra; contratos antigos preservados.
- Oito testes específicos e configuração inicial no simulador.


## 0.16 — Mais espaço nas telas de gestão — 31/10/2026

- Removido o bloco Missão do escritório e seus estilos.
- Agenda do mês aparece apenas no escritório; ocultada nas abas Produto, Marketing, Equipe, Caixa e Mural.
- Janelas ocupam o espaço antes reservado à agenda, inclusive em telas menores.
- Planejamento, contagem de ações e revisão do mês continuam disponíveis.


## 0.15 — Perfis de empreendedor com bônus e desvantagens — 31/10/2026

- Dez perfis recebem exatamente +1 e −1 em categorias de ação; novo Primeira viagem neutro (0/0), opção inicial.
- IDs estáveis preservam perfis dos saves; rolagens salvas continuam intactas.
- Modificador central por categoria, visível no dado, sem somar duas vezes. Reuniões usam o total e mantêm natural 1 crítico.
- Criação mostra efeitos efetivos e prós/contras correspondentes.
- Treze testes de regras e integração de criação/rolagem/save/replay; 142 testes nomeados mais integrações. Pacote final verificado em DOM simulado.


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
