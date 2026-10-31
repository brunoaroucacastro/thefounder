# The Founder

Jogo de gestão de empresas em pixel art. Protótipo 0.9 para PC/navegador.

## Jogar

Baixe `dist/The-Founder-Jogar.html` pelo botão de download do GitHub e abra no Chrome, Edge ou Firefox. O HTML contém todos os estilos e scripts; não precisa de instalação nem servidor. A página de código do GitHub não executa o jogo.

## O que já existe

- Escritório isométrico com objetos clicáveis e personagens.
- Criação do founder, aparência, nome da empresa e 12 modelos de negócio.
- Público potencial, demografia e renda apresentados separadamente.
- Quatro fontes de capital, desenvolvimento, marketing, equipe e fechamento mensal.
- Venda, falência, aprendizados e salvamento no navegador.
- Agenda de até quatro ações, com revisão, remoção, reordenação e aprovação antes de fechar o mês.
- D20 compartilhado e relatório persistido do fechamento.
- Campanhas com escalar/reduzir/otimizar, eficiência, especialistas, bloqueios, saturação e ROAS. Regras em `docs/FASE-2-MARKETING.md`.
- D20 animado: clique para rolar, veja bônus/penalidades e resultado, avance pela sequência ou pule. O resultado salvo não muda ao rever ou reabrir.
- Catálogo de produtos nomeados, radar, persona, pesquisa, compra única/recorrência, desenvolvimento com D20, preço livre, adoção, obsolescência e gerações. Regras em `docs/FASE-3-PRODUTO.md`.
- Administrativo-financeiro: percentuais, benchmarks, negociação interativa, inflação, propostas bancárias e contratos. Regras em `docs/FASE-4-ADMINISTRATIVO-FINANCEIRO.md`.

## Desenvolvimento

Com Node.js instalado, na raiz do repositório:

```
node tests/game.cjs
node scripts/build.cjs
```

`src/` contém os arquivos editáveis. `dist/` contém o jogo em arquivo único. `docs/` reúne o GDD e decisões. Os testes verificam a lógica com DOM simulado; não substituem testes visuais no navegador.

`src/rules.js` centraliza as regras da agenda, D20 e fechamento sem depender do DOM. `src/planner.js` conecta os painéis ao planejador. Saves antigos têm backup em `the-founder-v1-backup-before-agenda`; ações já realizadas no mês antigo continuam contando. Para manter seu save, substitua o HTML no mesmo local e use o mesmo navegador. Saves via arquivo local podem variar conforme o navegador.

`src/campaign-rules.js` isola a simulação de marketing. A migração da Fase 1 para a Fase 2 preserva a empresa e cria backup em `the-founder-v1-backup-before-campaigns`. ROAS mostra apenas receita inicial dos novos clientes atribuídos; não é lucro nem previsão.

`src/dice.js` e `src/dice.css` apresentam as rolagens já salvas sem interferir nas regras ou no RNG. A sequência retoma ao escolher Continuar. Preferência de movimento reduzido é respeitada. A geometria, interface e cores são originais, inspiradas no ritual de rolagem de RPGs.

`src/product-rules.js` implementa a economia do catálogo e `src/product-ui.js` o editor. Schema 4 preserva o produto antigo como assinatura, preço e clientes; faz backup pré-produtos. Novas ações dependentes de desenvolvimento falho são puladas sem cobrança.

`src/finance-rules.js` e `src/finance-ui.js` implementam a Fase 4. Schema 5 preserva dívida antiga como legado e cria backup pré-financeiro. Ofertas de banco exigem aceitação explícita pela agenda; propostas de fornecedor podem ser aceitas ou renegociadas durante a apresentação D20. Todos os valores são fictícios de jogo.

## Limites desta versão

Mercados e percentuais são fictícios. A operação mensal ainda é compartilhada pelos negócios. Perfis têm descrições e prós/contras, mas seus bônus não estão ativos. Estoque específico, destituição por investidores, cultura e branding permanecem no backlog. A engine prevista no GDD é Unity; este protótipo usa HTML/JavaScript.

## Atualizações

Cada etapa terá um commit com título claro em português e uma entrada no CHANGELOG. O histórico anterior ao GitHub está documentado como retrospectiva, não como commits antigos reconstruídos.

Fase 5: recrutamento com três candidatos no mês seguinte, especialidades, treino/promoção D20 até nível 5, motivação individual, reunião mensal e retenção. Regras puras em src/people-rules.js; interface em src/people-ui.js. Limites e parâmetros em docs/FASE-5-PESSOAS.md.
