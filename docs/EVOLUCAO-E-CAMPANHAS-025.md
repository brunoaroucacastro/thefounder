# Evolução e novas campanhas — 0.25

## Revisão 0.25 — novas gerações e campanhas do mesmo produto

Após uma rodada de vendas, a oficina oferece duas decisões: investir numa evolução ou preparar outra campanha para o produto atual. O protótipo continua restrito à empresa de gadgets. Mantidos os 4Ps, estoque, descontos por volume, preço por contribuição e reviews.

### Evolução de nível 4 a 10

O MVP começa no nível 4. Cada melhoria bem-sucedida avança exatamente um nível e acrescenta um ponto ao atributo escolhido. O jogador escolhe o atributo e pode escrever o nome da nova geração antes de investir, como Aurora 2 ou Aurora Pro. A tela mostra dificuldade, custo, chance base sem bônus e progresso até o nível 10.

| Evolução | Investimento por tentativa | Total necessário no D20 | Chance base sem bônus |
|---|---:|---:|---:|
| 4 → 5 | R$4.000 | 8 | 65% |
| 5 → 6 | R$5.400 | 10 | 55% |
| 6 → 7 | R$7.290 | 12 | 45% |
| 7 → 8 | R$9.842 | 14 | 35% |
| 8 → 9 | R$13.286 | 16 | 25% |
| 9 → 10 | R$17.936 | 18 | 15% |

Parâmetros iniciais de balanceamento, sujeitos à partida do jogador. Custo = R$4.000 × 1,35 elevado ao número de níveis acima do 4, arredondado. O especialista do founder aplica o modificador de desenvolvimento já existente. Natural 1 sempre falha.

O investimento é pago ao iniciar, não ao abrir o plano. Nina trabalha na bancada e depois o jogador rola o D20. Falha gasta a tentativa, sem mudar nome, atributos, estoque ou nível. Não há perda de nível no crítico desta mecânica. Pode tentar de novo com novo investimento. Sucesso precisa ser concluído; recarregar não muda o dado nem aplica a melhoria outra vez.

Ao concluir, o nome escolhido e o ponto extra passam ao projeto da nova geração. Mais nível também acrescenta um pequeno ganho de conversão (+1,2 ponto percentual por nível acima de 4); preço, custo e aderência continuam podendo tornar a aposta ruim. A nova geração começa sem estoque. Unidades antigas vão para o catálogo com nome, atributos, qualidade, preço e custo próprios, e continuam vendendo pelo fluxo residual existente. Não são transformadas em unidades novas. O nível máximo é 10.

A nova geração prepara sua campanha de estreia, rola o dado de campanha, escolhe lote e preço e fabrica. O projeto leva o investimento da melhoria, sem cobrar outro MVP de R$8.000. Campanha, materiais e vitrine têm seus custos próprios. Relatórios separam os períodos das gerações, preservando caixa e sem lançar o investimento duas vezes.

### Novas campanhas para continuar vendendo

No fechamento, Nova campanha abre até quatro pontos de promoção e três tamanhos: Enxuta (1×), Reforçada (2×) e Grande aposta (4×). O orçamento é (R$150 + R$100 por ponto) × tamanho. O alcance base cresce pela raiz quadrada do tamanho; aumentar gasto não compra sucesso garantido.

Após pagar uma única vez, a equipe prepara a apresentação e o jogador rola outro D20. As faixas existentes de alcance continuam: crítico 0,35×; parcial 0,65×; normal 1×; vantagem 1,45×; excepcional 1,8×. O canal dominante define a categoria do modificador. A tela compara os interessados de um 12 e de um 18.

Concluir adiciona os novos interessados ao produto atual, sem repetir compradores atendidos, cobrar MVP ou fabricar estoque. O jogador retorna às vendas e pode repor o produto. Orçamento, dado e resultado ficam no histórico de campanhas. Se houver pouco estoque, a campanha pode desperdiçar demanda. Cada janela concluída mantém o custo operacional de R$900 já existente.

Neste modo, o botão anterior de gerar novas ondas gratuitas é substituído por campanhas pagas. É possível cancelar o plano antes do investimento; depois, a tentativa é um custo realizado, inclusive se o dado for ruim. O catálogo antigo mantém somente suas vendas residuais: campanha seletiva para qualquer item arquivado ainda não faz parte desta revisão.

### Save e validação

Save novo: `the-founder-evolution-v1`. Se o navegador disponibilizar o save 0.24 no mesmo armazenamento, uma cópia é importada com nível 4; a chave original `the-founder-d20-volume-v1` permanece intacta. Quando arquivos locais têm armazenamentos separados pelo navegador, a nova versão inicia uma partida própria.

Onze testes de regras cobrem custo, dificuldade, nível máximo, modificador, crítico, falha, estoque antigo, nome, nova geração, orçamento, alcance, conciliação e retomada. A integração executa o HTML independente em DOM/Canvas simulados, incluindo campanha paga, melhoria, lançamento da geração seguinte e importação sem alterar origem. As regras anteriores e o jogo completo também passam por regressão. Inspeção visual real no navegador e balanceamento por jogadores continuam pendentes.

Comandos novos: `node tests/evolution.cjs`, `node scripts/build-first-loop.cjs`, `node tests/evolution-ui.cjs`.

