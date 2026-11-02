# Proposta — Descobertas de mercado com D20

**Estado: proposta para discussão. Não implementada na 0.31.**

## O que estudei em Game Dev Tycoon

Os textos oficiais descrevem a análise após o lançamento como uma ação que exige algum tempo e pode entregar pesquisa e descobertas. O tutorial informa que as descobertas reaparecem durante o desenvolvimento com sinais de importância; um ponto de interrogação marca conhecimento de um contexto parecido ainda não confirmado para aquela combinação. Há também opção de importar dicas já adquiridas em outra partida. Não localizei evidência de que o original use o D20 sugerido aqui: o dado é nossa adaptação.

O anúncio oficial da versão Steam apresenta relatórios pós-lançamento e experiência da empresa como mecanismos de feedback. Em um AMA, Patrick Klug explica que não devolver ao jogador o que aconteceu e por quê foi um problema do GDT antes dessa mecânica. O aprendizado aproveitável é a sequência **experimentar → observar → descobrir → decidir melhor**. O documento escrito não é a parte indispensável.

Fontes primárias consultadas:

- [Textos oficiais do jogo, incluindo tutorial de dicas, combinações e importação](https://github.com/greenheartgames/gdt-translations/blob/master/en-US.pot).
- [Anúncio oficial da versão Steam, no arquivo do blog](https://www.greenheartgames.com/blog/page/3/).
- [AMA dos criadores: explicação sobre feedback e game reports](https://www.reddit.com/r/Games/comments/160wqy0/ama_were_greenheart_games_developers_of_game_dev/).

## Minha recomendação

Uma ação opcional **Investigar o lançamento**. O jogador escolhe uma pergunta, vê o responsável e rola o D20. Um sucesso transforma uma evidência daquela experiência em um pequeno conhecimento persistente. Esse conhecimento aparece automaticamente no ponto de decisão correspondente, e não exige consultar uma página de relatórios.

Uma rodada ruim também pode produzir uma descoberta útil. Um lançamento lucrativo também pode não esclarecer uma nova relação. A descoberta não dá bônus de vendas por si: recompensa o jogador com informação para a próxima decisão.

## Separar fatos de conhecimento

Os fatos comerciais nunca ficam atrás do dado: chegaram pessoas, houve demanda, vendeu, faltou estoque, preço foi recusado, houve lucro/prejuízo. Se o dado esconder esses fatos, voltamos ao jogo confuso.

O D20 responde a outra pergunta: **a equipe conseguiu transformar essa experiência em uma conclusão que servirá na próxima criação?** Exemplo: reconhecer que Desempenho tem importância alta para Sofia em fones, em vez de apenas ver três compradores reclamando da execução.

## Como a cena funciona

1. A janela termina. O escritório continua visível e a equipe sinaliza que pode investigar.
2. Aparece um botão pequeno: **Tirar uma lição 🎲**. Pode ser ignorado; não bloqueia as três escolhas de continuação.
3. O jogador escolhe entre três perguntas visuais: **Produto**, **Campanha** ou **Preço**. Mostrar só domínios com evidência nova; demais ficam indisponíveis com uma frase curta explicando o que falta.
4. O D20 ocupa o centro, com dificuldade e bônus visíveis antes da rolagem.
5. Sucesso: uma carta curta vira, com uma frase e o símbolo descoberto. Uma linha animada aponta para o ícone da bancada/campanha onde a dica reaparecerá.
6. Falha: a equipe não concluiu. Os fatos e os feedbacks continuam disponíveis; não cria informação errada nem apaga conhecimento.
7. O jogador escolhe sua próxima ação normalmente.

Exemplo: **D20 9 + análise 3 = 12. Descoberta: “Sofia percebe bastante a diferença de Desempenho.” → Desempenho ++**.

## Regra do dado proposta

**D20 + capacidade de análise + intuição acumulada ≥ 11.**

| Bônus total | Chance de sucesso |
|---|---:|
| +0 | 50% |
| +2 | 60% |
| +4 | 70% |
| +6, teto proposto | 80% |

- Um líder recebe bônus conforme sua qualificação para a pergunta, inicialmente de 0 a 4. Não somar integralmente a equipe inteira.
- Futuramente um apoio relevante pode ajudar, dentro do teto total de +6. Traços do founder, se associados a essa categoria, continuariam na régua já combinada de +1/−1.
- Duas análises fracassadas em lançamentos com evidência nova podem acumular até +2 de intuição naquele domínio. Esse bônus é consumido quando a equipe conclui algo, para reduzir sequências frustrantes sem tornar a rolagem garantida.
- Natural 1: não conclui, sem inventar uma lição falsa.
- Natural 20: aprende uma descoberta e pode obter uma segunda se houver outra evidência qualificada. Nunca revelar algo que não estava sendo investigado.
- No máximo uma tentativa por campanha encerrada, compartilhada entre os domínios. Escolher Produto consome a tentativa daquela campanha; não permite depois tentar Campanha e Preço.
- O resultado é sorteado e salvo na ação, antes da animação. Recarregar ou clicar de novo mostra o mesmo resultado.

O limiar 11 é o teste padrão sugerido pelo usuário. Não começaria com uma tabela de dificuldades diferentes para todas as descobertas; isso colocaria complexidade antes de provar a diversão.

## Que informação pode ser descoberta

### Produto: importância dos atributos para uma persona naquele produto

Guardar **produto + persona + atributo**, e não uma regra universal sobre todos os gadgets. Sofia pode priorizar Qualidade em fones sem isso provar o que priorizará em outro produto.

| Símbolo | Leitura para o jogador | Correspondência interna inicial |
|---|---|---|
| ? | Ainda desconhecido | Sem descoberta |
| +++ | Central para esse público | Peso 50% |
| ++ | Muito importante | Peso 30% |
| + | Ajuda na experiência | Peso 10% |
| · | Não é uma prioridade desse público | Peso 0% |
| ! | Existe uma necessidade básica ainda mal atendida | Requisito percebido pelos feedbacks |

Os percentuais ficam neste documento, não precisam aparecer ao jogador. O símbolo `!` acompanha a dica, sem revelar automaticamente o valor mínimo exato.

**Não usaria `---` para um atributo de peso zero.** No nosso modelo, investir nele não reduz aderência nem conversão. Pode aumentar custo e consumir pontos, mas isso é um custo de oportunidade. Um sinal negativo poderia ensinar incorretamente que o atributo estraga o produto.

Uma descoberta revela uma relação por vez. Depois de alguns lançamentos, a bancada pode mostrar: Qualidade +++, Desempenho ++ e os outros ainda como ?. Não preencher o radar inteiro no primeiro sucesso.

### Campanha: adequação do canal à idade

Guardar **mercado + faixa etária + canal**. Exemplos: Criadores → 18–24 +++; Demonstração → 55+ +++; Criadores → 55+ ---.

Aqui faz sentido usar a régua completa `+++ / ++ / + / · / − / −− / −−−`: o sinal descreve alcance relativo naquela idade, não efeito na conversão nem existência de público zero. Os canais de coeficiente baixo ainda podem alcançar algumas pessoas.

Na campanha seguinte, as dicas aparecem nos próprios cards, associadas ao público, sem escolher automaticamente o canal pelo jogador. Quando a persona mistura idades, ele ainda precisa ponderar a composição.

### Preço: descoberta contextual e temporária

Evitar salvar “R$95 é o preço certo” como verdade permanente. Custo, atributos, versão, persona e prova social mudam o problema.

Uma descoberta pode registrar: **“Nesta versão, subir a margem reduziu bastante a procura”**, desde que haja dados comparáveis, ou **“Esse preço afastou o público que atingimos”**. Não revelar o vértice matemático ou uma margem ótima sem experimentação.

Quando só houve um preço, a equipe pode aprender uma rejeição ou aceitação observada, mas não inferir a curva inteira. Para falar de sensibilidade a preço, exigir duas janelas da mesma versão com preços diferentes e condições suficientemente comparáveis. Mudanças simultâneas de produto, público e campanha enfraquecem a conclusão.

## Evidência e prevenção de farming

Os números abaixo são hipóteses iniciais para testar, não leis já programadas:

- **Produto:** ao menos dez compras identificadas daquela persona e um review relevante; ou reclamações repetidas sobre a mesma necessidade. Só revelar relações de atributos usados/testados ou citados nos feedbacks. Zero vendas não prova que qualquer atributo aleatório seja irrelevante.
- **Campanha:** pelo menos vinte contatos de uma faixa etária alcançada por um canal que recebeu foco. Não aprender sobre um canal com zero pontos ou um público que não apareceu.
- **Preço:** rejeições identificadas daquele preço/público; para comparação de sensibilidade, duas janelas comparáveis. Uma rodada sem compradores ainda pode ensinar sobre preço, sem dar uma prioridade de produto que ninguém testou.
- Cada investigação seleciona apenas candidatos com evidência e ainda desconhecidos. Um sucesso não deve desperdiçar a recompensa repetindo a mesma dica.
- Não oferecer a rolagem quando já se sabe tudo que aqueles dados permitem concluir. Sugerir outra pergunta ou experimento.
- Uma nova campanha precisa trazer dados novos. Abrir/fechar telas e recarregar não concede novas tentativas.
- Uma campanha com preço absurdo não pode preencher o banco de atributos: ela só produziu evidência sobre rejeição daquele preço.

O sistema consulta as relações reais do jogo para garantir que uma descoberta confirmada seja verdadeira. Não transforma uma correlação enganosa em regra permanente. O dado decide se a equipe consegue descobrir; não decide qual é a realidade do mercado.

## O que persiste e como a equipe importa

O conhecimento confirmado é patrimônio da empresa e continua entre produtos, gerações e campanhas. Um funcionário qualificado melhora a chance de identificar e registrar uma conclusão; alguém que sai não apaga o que já foi documentado. Caso contrário o jogador lembraria da informação, mas o jogo fingiria que não, criando punição incômoda.

Com equipe implementada, investigar poderá ocupar uma pessoa durante algum tempo e disputar atenção com produção/pesquisa. A especialização cria valor além do modificador: designer interpreta produto; marketing interpreta canal/público; comercial interpreta preço. Não é necessário programar toda a equipe para validar a primeira versão desta mecânica.

Sugestão inicial: conhecimentos persistem dentro da mesma empresa. Importar para uma nova partida pode virar opção futura, como conveniência, sem obrigar um iniciante a começar com tudo revelado. Conhecimento parecido pode aparecer cinza e com `?`, nunca como confirmação em um contexto diferente.

## Limites para a primeira implementação

Eu começaria com **Produto e Campanha**, deixando Preço como observação contextual, sem dica de preço ótimo. Uma ação de investigação, uma rolagem e uma descoberta; símbolos na bancada e nos cards; memória persistente; ausência de informação falsa; tentativa protegida contra repetição.

O objetivo é o jogador pensar **“essa rodada não deu o lucro que eu queria, mas agora sei algo que vou usar”**, e querer criar a próxima versão. Isso complementa o loop de criar e vender, sem substituir o jogo por um relatório ou revelar todas as fórmulas.
