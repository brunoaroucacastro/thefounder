# 0.32 — Investigar o lançamento

O jogo passa a transformar experiências em descobertas persistentes. A ação é opcional no fechamento e preserva os três caminhos de continuação. Resultados comerciais não dependem do dado para ficar visíveis.

## Loop implementado

1. Encerrar uma campanha com evidência nova.
2. Escolher **Tirar uma lição 🎲**.
3. Investigar **Produto** ou **Campanha**.
4. Ver responsável, bônus, chance e alvo 11 antes da rolagem.
5. Sucesso revela uma carta; a informação reaparece na bancada, na evolução e nos cards de apresentação.
6. Falha preserva tudo e acumula intuição para outra experiência desse domínio.

## D20 e memória

- D20 + análise + intuição precisa chegar a 11.
- Natural 1 falha; natural 20 revela até duas descobertas que tenham evidência.
- Uma tentativa por campanha, compartilhada entre os assuntos. Reabrir apenas mostra o mesmo resultado.
- O resultado é persistido antes da animação. Trocar de pergunta, repetir clique ou recarregar não dá outra tentativa.
- Falha acrescenta +1 de intuição, até +2 por domínio. Sucesso consome a intuição daquele domínio.
- A empresa guarda conhecimentos entre campanhas, produtos e gerações. A saída de um analista não apaga o que já foi documentado.
- O responsável inicial é o founder, sem bônus de análise inventado. O sistema aceita analistas com qualificação 0–4 por domínio e seleção de responsável; somado à intuição, o teto é +6. A contratação e o treinamento de equipe ainda pertencem à etapa futura de pessoas. A integração e as probabilidades de 50%, 60%, 70% e 80% foram testadas.

## Produto

A evidência usa unidades realmente compradas pela persona e avaliações identificadas. É necessário ter dez compras da persona e um review relevante para aprender sobre um atributo usado. Duas reclamações de mínimo na mesma necessidade podem revelar `!`, inclusive quando o atributo não recebeu pontos. A investigação nunca revela automaticamente os seis pesos.

| Símbolo | Leitura |
|---|---|
| ? | Não investigado neste contexto |
| +++ | Central |
| ++ | Muito importante |
| + | Ajuda |
| · | Não é prioridade |
| ! | Necessidade básica ainda mal atendida |

As descobertas são indexadas por produto, persona e atributo. A informação de Sofia em fones não é confirmada automaticamente para outra pessoa ou outro gadget. Não há penalidade fictícia em atributo de peso zero: `·` não significa que somar o atributo reduz aderência.

## Campanha

São necessários vinte contatos pagos observados de uma faixa etária e pelo menos dois pontos no canal investigado. As dicas usam a régua `+++ / ++ / + / · / − / −− / −−−` para alcance relativo por idade no mercado de gadgets. Não são multiplicadores de conversão. Reconversão não gera conclusões sobre alcance novo, e referências orgânicas não contam como evidência de anúncio.

O banco registra apenas novidades e não recompensa uma descoberta já conhecida. A interface explica quando falta evidência ou quando aquele experimento já ensinou tudo que permite. Os conhecimentos aparecem nos próprios cards do canal, com a idade correspondente.

## Fluxo e apresentação

- D20 reutiliza a animação de rolagem, com alvo e bônus visíveis.
- Cards coloridos surgem no sucesso, com símbolo, contexto e uma frase.
- Oficina mostra o founder investigando e uma descoberta sinalizada.
- Marcadores aparecem nos atributos da bancada e da próxima versão. Personas conhecidas mostram um pequeno indicador de memória na seleção.
- Fatos da rodada aparecem na investigação, e fechar a cena devolve o fechamento completo.
- A ação não cobra nova verba, não aumenta atributos e não altera preço, alcance, conversão ou resultado comercial.
- Preferência de movimento reduzido é respeitada pela animação e pelos cards.

Preço continua como observação contextual no fechamento. Não foi acrescentado um símbolo de preço ótimo ou uma revelação automática da curva de lucro. A descoberta de sensibilidade a preço exige uma comparação de versões/condições que ainda será desenvolvida.

## Saves e validação

Saves 0.31 continuam funcionando, com backup `-before-learning`. Conhecimento começa vazio; não fabricamos evidência a partir de métricas históricas insuficientes. A próxima janela passa a registrar as observações necessárias. A chave de save permanece igual.

Novos testes: `tests/learning.cjs` e `tests/learning-ui.cjs`. Cobrem evidência real, requisitos, novidades, D20, crítico, intuição, contexto, persistência, nova linha/versão, qualificação e limites, migração e tentativas inválidas. O HTML é exercitado em DOM/Canvas simulados do lançamento até a investigação e o reaparecimento dos símbolos. Isso não equivale a validação visual em navegador.

As regras de CAC por unidade, estoque, alcance e custo fixo da 0.31 foram preservadas. A investigação não cria lucro artificial nem uma melhoria de produto grátis.
