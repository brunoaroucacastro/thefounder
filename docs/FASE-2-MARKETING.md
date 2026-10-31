# Fase 2 — Marketing, protótipo 0.6

Implementação autorizada em 31/10/2026. Esta é uma primeira tabela de balanceamento, ajustável após partidas. Não altera a lista de setores ou aprova automaticamente as distribuições demográficas discutidas.

## Decisões jogáveis

- Cada canal mantém verba **mensal**, eficiência e histórico. Sem mexer, verba e eficiência continuam; não é preciso gastar ação para mantê-las.
- Por canal/mês, escolher um ajuste: escalar, reduzir ou otimizar. Remover da agenda permite substituir. A regra impede repetir otimizações no mesmo canal para pescar sorteios favoráveis e cabe nas quatro ações totais.
- Escalar/reduzir não tem taxa imediata: o orçamento efetivo é cobrado no fechamento. Otimizar custa R$ 500 pela tentativa, mesmo se falhar, e mantém a verba.
- É possível editar uma verba inteira de R$ 0 até R$ 1 milhão por mês. Atalhos −25%, +25% e pausar. É parâmetro de protótipo, não recomendação financeira real.
- Não existe certeza de ROAS alto: preço, produto, orçamento, eficiência, afinidade e saturação determinam a aquisição. Não há venda garantida pelo dado.

## D20 compartilhado

Usa `GameRules.rollD20`. Prévia não sorteia e não modifica eficiência. O sorteio só ocorre após aprovação e fica no save e no relatório.

| Resultado | Consequência |
|---|---|
| Natural 1 | Eficiência −30 pontos percentuais (respeitando o piso), aumento de verba cancelado; reduções são respeitadas. Bloqueia o canal durante o mês seguinte. |
| Total até 10 | Eficiência cai 3 pontos percentuais por ponto abaixo de 11, limitada a −30. |
| Total 11+ | Eficiência sobe 3 pontos percentuais por ponto acima de 10, limitada a +30. |

Eficiência entre 35% e 200%. Modificadores podem levar o total além de 20, mas não removem falha crítica natural.

- Melhor especialista do canal: +1 por nível, até +4. Não soma todos os funcionários.
- Afinidade: +2 para alta, −2 para baixa; média sem bônus.
- Saturação: `−floor(proporção explorada × 5)`.
- Escala agressiva: aumento acima de 25% recebe `−ceil((verba_nova/max(500,verba_atual) − 1 − 0,25) × 2)`, limitada a −8. Verba inicial de R$ 500 funciona como referência quando o canal está zerado.
- Redução sempre altera a verba pedida. O sorteio afeta a eficiência remanescente. Durante bloqueio, reduzir/pausar não sorteia nem prolonga bloqueio.

## Duração do bloqueio

Se a ação executada no mês 1 tiver crítico, o canal ainda roda com sua verba anterior e eficiência reduzida no mês 1; o mês 2 é bloqueado, sem gasto nem aquisição pelo canal. No mês 3 ele retorna automaticamente com sua verba configurada. A tela informa o compromisso que voltará; é possível reduzi-lo a zero durante o bloqueio. Novos aumentos e otimizações são impedidos no mês bloqueado.

## Afinidade e pessoas

Produtos físicos: Busca 1,0×, SEO 0,8×, Redes 1,4×. Software e serviços: Busca 1,15×, SEO 1,4×, Redes 0,8×. Esses fatores também definem o bônus/penalidade de afinidade do dado. A interface revela as afinidades nesta versão.

Na contratação de Marketing, escolher Busca/Ads, SEO ou Redes. O salário atual é preservado. Funcionários de Marketing antigos são migrados para Busca/Ads e a especialidade aparece no painel. Seleção com espera, treinamento e motivação individual permanecem na Fase 5.

## Público e aquisição

- Tamanho da persona = público do mercado × percentual da faixa etária selecionada, arredondado para baixo.
- Guardar alcance acumulado em quatro contadores, um por persona. Trocar de público não reseta os anteriores.
- Canais disputam **um único conjunto** de novas pessoas por persona. O alcance é distribuído proporcionalmente aos potenciais dos canais, com um componente orgânico de 200; o total nunca ultrapassa o público restante. Trata-se de deduplicação agregada simulada, não rastreamento de indivíduos.
- Potencial do canal: `floor(verba × 2 / (1 + verba/2000)^0,55 × eficiência × afinidade × maturidade)`.
- SEO ganha 3% de fator de maturidade por mês ativo, até 36%. Este fator não é dinheiro extra nem aquisição garantida.
- Interessados = 10% dos novos alcançados; conversão usa preço, qualidade e poder de compra já existentes. Arredondar clientes por canal e orgânicos separadamente.
- Ao explorar 100% da persona, não há novos alcançados nem novos clientes por alcance incremental. Verba pode continuar sendo gasta, mas incremento e ROAS de aquisição ficam em zero. Reativação de antigos interessados e ciclo por novo produto ficam para evolução futura.
- Migração começa os contadores em zero porque saves antigos não registravam alcance histórico deduplicado. Não inventar esse histórico a partir de impressões ou clientes.

## ROAS e contabilidade

Receita atribuída ao canal = novos clientes desse canal × preço no mês. ROAS = essa receita / gasto efetivo do canal. Sem gasto, mostrar “—”, nunca infinito. Usuários orgânicos e receita de clientes antigos não entram na atribuição; a soma das receitas atribuídas não pode exceder a receita do mês. ROAS não inclui margem, salários ou custo de otimização.

A receita atribuída é uma fatia da receita operacional, não um segundo depósito no caixa. O fechamento inclui custos das tentativas, verbas efetivamente cobradas (zero em bloqueios), demais custos e financiamentos uma única vez.

## Arquivos e validação

- `src/campaign-rules.js`: regras isoladas de campanhas, afinidade, aquisição e atribuição.
- `src/rules.js`: coordena campanhas com agenda, D20 e fechamento.
- `src/planner.js` e `src/campaign.css`: cartões visuais, controles e relatório.
- Save schema 3 preserva empresas, fila e IDs. Backup pré-campanhas em `the-founder-v1-backup-before-campaigns`. Planos antigos com mais de uma mudança no mesmo canal ficam visíveis para correção manual na revisão; não são removidos silenciosamente.
- `tests/marketing.cjs`: testes determinísticos de riscos, bloqueios, modificadores, limites, migração e contabilidade. Integração executa os scripts com DOM simulado. Verificação visual no navegador não foi executada nesta entrega.
