# A primeira aposta — entrega 0.20

Abra `dist/The-Founder-Primeira-Aposta-0.20.html` no navegador, após baixar o arquivo. Funciona offline e não depende de servidor. A versão 0.19 continua disponível em `dist/The-Founder-Jogar.html`.

O novo experimento troca o primeiro ciclo de menus por uma oficina persistente: pessoas caminham até a bancada, montam um fone, preparam a divulgação e atendem visitantes. Escolha público, duas características e preço; teste, divulgue, lance e reaja. Decisões alteram qualidade, margem, alcance e vendas reais. Resultado do D20 permanece em tela até o jogador continuar.

O resumo mostra unidades, receita, lucro e causas; o próximo produto preserva caixa e histórico. Usa a chave de save independente `the-founder-first-loop-v1`; nunca escreve `the-founder-v1`. Rolagens são persistidas antes da apresentação; recarga e clique duplo não repetem recompensa. Abas antigas não sobrescrevem um save mais recente.

## Verificação

```
node tests/first-loop.cjs
node scripts/build-first-loop.cjs
node tests/first-loop-ui.cjs
```

13 testes de regras cobrem escolhas, extremos dos dados, vendas, custos, reajustes, oportunidade, retomada e ciclos seguintes. Integração executa os quatro scripts do HTML final em DOM/Canvas simulados, incluindo persistência e conflitos de abas. A regressão da versão completa (159 testes nomeados e integrações) e seu teste de entrega também passaram. Arte do Canvas foi inspecionada por renderização offline das operações de desenho; isso não equivale a inspeção visual num navegador real. A diversão ainda precisa ser avaliada jogando.

Escopo, regras e visão consolidada: `GDD-ATUAL.md`.
