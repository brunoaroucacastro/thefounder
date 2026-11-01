# Criação de gadgets — 0.22

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

Comandos: `node tests/gadgets.cjs`, `node scripts/build-first-loop.cjs`, `node tests/gadgets-ui.cjs`.
