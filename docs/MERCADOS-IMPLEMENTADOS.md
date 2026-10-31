> Atualização 0.13: idade e classe foram substituídas pelas tabelas de posicionamento de gameplay do jogador. Este documento registra a base histórica; consulte MERCADOS-POSICIONAMENTO.md para os valores em uso.

# Mercados iniciais — versão 0.12

Implementação da tabela anexada pelo jogador em 31/10/2026. Números aplicados exatamente como enviados: públicos arredondados em milhões, idade e classe somando 100% separadamente. Referência Brasil, pessoas de 18 anos ou mais, apenas classes A/B/C. São estimativas de modelagem, não estatísticas oficiais nem clientes garantidos. Os públicos dos setores se sobrepõem; não se somam as linhas. Não foi feita nova pesquisa nesta etapa.

| Mercado | Tipo | Público potencial | 18–24 | 25–34 | 35–54 | 55+ | A | B | C |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Gadgets & tecnologia | produto | 59 milhões | 17% | 27% | 39% | 17% | 8% | 41% | 51% |
| Moda & vestuário | produto | 102 milhões | 15% | 22% | 39% | 24% | 5% | 32% | 63% |
| Consumíveis | produto | 115 milhões | 13% | 20% | 38% | 29% | 4% | 30% | 66% |
| Beleza & cosméticos | produto | 81 milhões | 13% | 23% | 41% | 23% | 6% | 34% | 60% |
| Pet | produto | 52 milhões | 8% | 22% | 45% | 25% | 6% | 36% | 58% |
| Home & Garden | produto | 63 milhões | 5% | 20% | 46% | 29% | 7% | 39% | 54% |
| Fintechs | serviço | 68 milhões | 15% | 28% | 42% | 15% | 6% | 39% | 55% |
| Healthtechs | serviço | 59 milhões | 14% | 27% | 41% | 18% | 5% | 36% | 59% |
| Educação | serviço | 46 milhões | 22% | 28% | 38% | 12% | 5% | 45% | 50% |
| Redes sociais & conteúdo | serviço | 87 milhões | 18% | 26% | 40% | 16% | 4% | 35% | 61% |
| Softwares & aplicativos | serviço | 76 milhões | 20% | 28% | 38% | 14% | 6% | 38% | 56% |
| Mobilidade & delivery | serviço | 76 milhões | 18% | 28% | 40% | 14% | 6% | 38% | 56% |

## Aplicação no jogo

A criação mostra somente seis produtos físicos e seis serviços B2C. Cada seleção traz descrição curta. Idade e classe têm blocos separados. Software inclui aplicativos, SaaS B2C e jogos; redes sociais/conteúdo inclui entretenimento; mobilidade/delivery é uma categoria conjunta. Marketplace e demais setores antigos saíram da seleção.

Marketing usa o tamanho e a distribuição etária do setor. Produto cruza a parcela etária e de classe para dimensionar sua persona. O cruzamento assume independência entre idade e classe, pois a tabela não fornece distribuição conjunta; é uma simplificação do jogo. Qualidade/preço/atributos e a persona continuam afetando demanda. As faixas etárias não foram redistribuídas para criar três vencedores por faixa: nesta entrega vale a tabela enviada. A classe econômica é uma aproximação do Critério Brasil; não equivale a uma faixa salarial individual.

## Compatibilidade

`src/market-data.js` concentra o catálogo, IDs e descrições. Os doze slots históricos (0–11) continuam imutáveis para saves anteriores. Novos setores ocupam 12–23, mas somente estes doze aparecem para novas empresas. IDs são distintos, inclusive entre Fintech antiga e Fintech B2C nova. Assim, uma empresa antiga de DNVB não vira Gadgets, nem Marketplace vira software. Não há reset de caixa, produtos, agenda ou campanhas. Comece uma Nova jornada para escolher os mercados novos.

O simulador seleciona explicitamente os doze setores novos. Resultados atuais: SIMULACOES-MERCADOS-012.json/.csv. Os resultados de SIMULACOES-FASE-6.* continuam sendo históricos dos setores anteriores.

## Verificação

127 testes nomeados mais integrações: tabela exata, somas de percentuais, IDs, seleção sem setores antigos, público atingindo o motor, fundação/retomada e compatibilidade dos doze índices históricos. HTML independente com oito estilos e quatorze scripts. A validação visual real continua pendente; esta etapa usa testes de regras e DOM simulado.

## Simulação dos mercados implementados

1.920 partidas (12 setores novos × 4 capitais × 10 sementes × 4 estratégias), horizonte de 24 meses. Mesmas políticas documentadas na fase 6; tamanho/idade/classe agora vêm da tabela implementada.

| Estratégia | Falência próprio | Amigos/família | Banco | VC |
|---|---:|---:|---:|---:|
| Enxuta recorrente | 0,0% | 7,5% | 0,0% | 0,0% |
| Compra única | 1,7% | 19,2% | 0,0% | 0,0% |
| Gasto agressivo | 100,0% | 94,2% | 90,0% | 75,8% |
| Inação | 10,0% | 100,0% | 0,0% | 0,0% |

Resultados de políticas fixas e amostra limitada; não garantem sucesso de uma partida humana. Nenhuma regra adicional foi alterada para forçar os percentuais.
