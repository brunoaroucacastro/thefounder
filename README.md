# The Founder

Jogo de gestão de empresas em pixel art. Protótipo 0.5 para PC/navegador.

## Jogar

Baixe `dist/The-Founder-Jogar.html` pelo botão de download do GitHub e abra no Chrome, Edge ou Firefox. O HTML contém todos os estilos e scripts; não precisa de instalação nem servidor. A página de código do GitHub não executa o jogo.

## O que já existe

- Escritório isométrico com objetos clicáveis e personagens.
- Criação do founder, aparência, nome da empresa e 12 modelos de negócio.
- Público potencial, demografia e renda apresentados separadamente.
- Quatro fontes de capital, desenvolvimento, marketing, equipe e fechamento mensal.
- Venda, falência, aprendizados e salvamento no navegador.
- Agenda de até quatro ações, com revisão, remoção, reordenação e aprovação antes de fechar o mês.
- D20 compartilhado e relatório persistido do fechamento. Risco por ação será detalhado nas próximas fases.

## Desenvolvimento

Com Node.js instalado, na raiz do repositório:

```
node tests/game.cjs
node scripts/build.cjs
```

`src/` contém os arquivos editáveis. `dist/` contém o jogo em arquivo único. `docs/` reúne o GDD e decisões. Os testes verificam a lógica com DOM simulado; não substituem testes visuais no navegador.

`src/rules.js` centraliza as regras da agenda, D20 e fechamento sem depender do DOM. `src/planner.js` conecta os painéis ao planejador. Saves antigos têm backup em `the-founder-v1-backup-before-agenda`; ações já realizadas no mês antigo continuam contando. Para manter seu save, substitua o HTML no mesmo local e use o mesmo navegador. Saves via arquivo local podem variar conforme o navegador.

## Limites desta versão

Mercados e percentuais são fictícios. A operação mensal ainda é compartilhada pelos negócios. Perfis têm descrições e prós/contras, mas seus bônus não estão ativos. Estoque específico, destituição por investidores, cultura e branding permanecem no backlog. A engine prevista no GDD é Unity; este protótipo usa HTML/JavaScript.

## Atualizações

Cada etapa terá um commit com título claro em português e uma entrada no CHANGELOG. O histórico anterior ao GitHub está documentado como retrospectiva, não como commits antigos reconstruídos.
