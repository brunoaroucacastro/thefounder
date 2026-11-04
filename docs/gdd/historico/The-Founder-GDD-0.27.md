# The Founder 0.27 — Produto e persona

Gadget → pesquisa obrigatória → persona → projeto → praça e promoção → D20 do MVP → lote e preço → D20 da campanha → vendas e reviews → nova linha, melhoria ou campanha.

## Produto
Seis atributos universais: Qualidade, Durabilidade, Desempenho, Praticidade, Versatilidade e Economia. MVP: até 4 pontos; níveis 4–10 liberam 4, 6, 8, 10, 12, 14 e 15 pontos. Teto de 5 por atributo. A melhoria permite redistribuir o projeto e renomear a versão. Se o D20 falhar, o investimento é gasto e o produto original permanece. Estoque antigo conserva seus atributos.

## Público
Dez personas de fone, três por página. Cada uma possui pesos 50%, 30%, 10%, 10%, 0%, 0%. Classes de renda não entram no novo modelo. Idade descreve o comprador, sem multiplicador econômico. Orçamento individual varia entre 80% e 120% da referência da persona. Outros gadgets mantêm três personas provisórias adaptadas aos novos atributos.

Adequação = soma(pontos × pesos) / 4,5. Nota técnica = adequação × 15. O melhor projeto usa 5 nos pesos 50% e 30%, e cinco pontos divididos nos dois pesos 10%. MVP especializado chega a 6,67/15. Essa nota não é a avaliação em estrelas.

## Preço e vendas
Disposição a pagar = orçamento individual × (0,45 + 1,55 × adequação) × execução do D20. Execução: 0,75 / 1 / 1,08 / 1,15. Não existe bônus adicional por nível. O jogador continua definindo o preço pela margem, antes do D20 da campanha.

Conversão = 0,45 × (0,3 + 0,7 × adequação) × prova social × máximo(0, 1 − preço/disposição) × clareza da campanha × reconversão. Limitada a 90%; sem vendas garantidas. Mais atributos podem elevar custos e valor percebido, sem garantir lucro.

## Reviews
Uma avaliação por dez vendas, escolhida de uma compra real. Expectativa = limitar(0,25 + 0,35 × preço pago/orçamento + exigência, 0,25, 0,9). Atendimento = limitar(adequação/expectativa, 0, 1,35). Benefício = limitar(1 − preço/disposição, −0,5, 1). Estrelas = arredondar e limitar(1 + 2,2 × atendimento + 0,8 × benefício + variação individual − penalidade de execução, 1, 5). Exigência varia ±0,08; experiência ±0,6. RNG estável, separado do D20. Preço e perfil do comprador ficam registrados.

MVP acessível pode agradar sem perfeição técnica. Preço elevado pode diminuir conversão e aumentar cobrança nos reviews. Reviews alimentam prova social suavizada por dez avaliações neutras anteriores. Repetir a leitura de um review não sorteia nova nota.

## Economia e continuidade
MVP custa R$8.000; desenvolvimento não precisa se pagar nas primeiras cem peças. CPV de fones = máximo(12, 30 + 9Q + 5D + 6Des + 4P + 4V − 5E). Desconto por lote, comissões, CAC e contabilidade por produto permanecem. Prejuízo inicial e estoque comprado são distintos. Viabilidade deve ser avaliada em escala, incluindo 1.000+ vendas reais, sem confundir interessados com compradores.

Save novo: the-founder-universal-v1. Não reinterpreta atributos de versões antigas; saves e arquivos anteriores permanecem intactos. Comece uma nova empresa nesta versão.

## Verificação
Testes de regras: pesos, limites, custo, nota técnica, disposição a pagar, conversão, avaliações determinísticas e melhoria. Integração em DOM/Canvas simulado: personas paginadas, criação, D20, preço, vendas, reviews, CAC, panorama, save/reload e campanha seguinte. Regressões do jogo original e público anterior. Não houve validação visual em navegador real nem playtest humano de diversão nesta etapa.
