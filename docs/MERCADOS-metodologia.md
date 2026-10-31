> Atualização 0.13: idade e classe foram substituídas pelas tabelas de posicionamento de gameplay do jogador. Este documento registra a base histórica; consulte MERCADOS-POSICIONAMENTO.md para os valores em uso.

# Mercados B2C — pesquisa e cenário inicial

Pesquisa em 31/10/2026. Base comparável principal: Brasil, 2024. Base aplicada na versão 0.12 conforme tabela arredondada enviada pelo jogador. Implementação e compatibilidade em MERCADOS-IMPLEMENTADOS.md.

## Como interpretar

Todos os resultados setoriais desta tabela são estimativas de modelagem, não estatísticas oficiais dos respectivos mercados. Quatro linhas usam indicadores observados como proxies; as demais usam hipóteses explícitas. Não são projeções estatísticas para 2026, clientes pagantes, previsão de vendas ou faturamento.

Universo: adultos 18+ das classes A, B e C no Brasil. As classes D/E estão excluídas para manter as três classes solicitadas, não foram renomeadas como C. O Critério Brasil da ABEP mede condição econômica por características domiciliares; não é apenas uma faixa salarial. B agrega B1/B2 e C agrega C1/C2.

Cada linha representa pessoas potencialmente interessadas/alcançáveis no setor. Idade soma 100%; classe soma 100%. São distribuições separadas, não cruzamentos idade × classe. Os mercados se sobrepõem e NÃO devem ser somados. Crianças não entram como clientes independentes nesta primeira versão.

## Bases publicadas

- [PNADC 2024, tabela populacional reproduzida pelo Ministério da Previdência](https://www.gov.br/previdencia/pt-br/assuntos/previdencia-social/arquivos/aeps-2024/secao-xvi-demografia/capitulo-48-estatisticas-populacionais/48-1-populacao-residente-por-situacao-do-domicilio-e-sexo-segundo-os-grupos-de-idade-2016-2018): grupos quinquenais. Para 18–19 anos, usamos 2/5 do grupo 15–19, assumindo distribuição uniforme. Adultos aproximados: 160,95 milhões. É uma aproximação, não contagem publicada exata de 18+.
- [ABEP, Critério Brasil 2024](https://abep.org/wp-content/uploads/2024/09/01_cceb_2024.pdf): A 3,1%; B1 5,0%; B2 16,5%; C1 20,7%; C2 26,3%; DE 28,4%. Aplicar a distribuição domiciliar à população adulta é uma hipótese simplificadora, pois tamanho e idade dos domicílios variam entre classes. Isso produz uma base ABC aproximada de 115,24 milhões. Dentro de ABC, a referência normalizada é aproximadamente 4% A, 30% B e 66% C.
- [TIC Domicílios 2024, C2](https://cetic.br/pt/tics/domicilios/2024/individuos/C2/): uso recente da Internet por idade e classe.
- [TIC C5 — comunicação](https://cetic.br/pt/tics/domicilios/2024/individuos/C5/): redes sociais como referência para redes sociais & conteúdo. Não soma usuários de vídeo e música.
- [TIC C6 — informação e finanças](https://cetic.br/pt/tics/domicilios/2024/individuos/C6/): transações financeiras online como proxy para fintechs; busca de informação de saúde como proxy de interesse em healthtechs. O primeiro inclui bancos tradicionais; o segundo não comprova teleconsulta ou disposição a pagar.
- [TIC C8 — educação](https://cetic.br/pt/tics/domicilios/2024/individuos/C8/): autoestudo online como proxy de educação. Não equivale a matrícula paga.
- [TIC C7 — multimídia](https://cetic.br/pt/tics/domicilios/2024/individuos/C7/): jogos online e consumo audiovisual ajudam a contextualizar software/conteúdo, mas não medem a união de todos os apps.

## Evidências complementares e seus limites

[NIC.br, divulgação da TIC 2024](https://www.nic.br/noticia/releases/em-duas-decadas-proporcao-de-lares-urbanos-brasileiros-com-internet-passou-de-13-para-85-aponta-tic-domicilios-2024/) informa 73 milhões de compradores online. O [relatório completo](https://www.nic.br/media/docs/publicacoes/2/pt-br/20251027170648/tic_domicilios_2024_livro_eletronico.pdf) registra, entre compradores online, roupas/calçados/material esportivo 71%, produtos para casa/eletrodomésticos 53%, alimentos 45%, cosméticos/higiene 41% e eletrônicos 37%. Esses percentuais são penetração dentro dos compradores online; não são composição etária, nem incluem todas as compras físicas. Foram usados como referências de abrangência, não convertidos diretamente em totais dos setores.

[IBGE, PNS 2019](https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/2013-agencia-de-noticias/releases/28793-pns-2019-sete-em-cada-dez-pessoas-que-procuram-o-mesmo-servico-de-saude-vao-a-rede-publica) aponta 39,4 milhões de domicílios com cachorro ou gato. A estimativa Pet de adultos compradores é uma hipótese própria; não transforma cada pet ou lar em uma pessoa, nem soma cães e gatos sem deduplicação.

[Mobile Time/Opinion Box, dezembro de 2025](https://pesquisas.mobiletime.com.br/download/36216/) pesquisou 2.309 internautas com smartphone. 89% já haviam pedido refeição por aplicativo; 83% desses haviam pedido nos últimos 30 dias. Não representam 89% de todos os brasileiros. Mobilidade e delivery compartilham clientes, e não foi localizada uma união deduplicada no recorte deste jogo.

## Método reproduzível

1. Agrupar a população em 18–24, 25–34, 35–54 e 55+. A distribuição adulta ABC por idade é aproximada pela distribuição adulta total; não há cruzamento conjunto aplicado.
2. Tamanho: soma de `adultos × participação da classe × taxa de alcance/interesse da classe` para A, B e C.
3. Classe: normalizar as três parcelas do tamanho para somarem 100%.
4. Idade: normalizar `população da faixa × taxa da faixa` para somar 100%.
5. Nas quatro linhas proxy, a taxa de classe é uso de Internet C2 multiplicado pela atividade C5/C6/C8 na classe. As taxas etárias também combinam C2 com a atividade. A taxa 16–24 é aproximada para 18–24; 35–54 e 55+ são ponderadas pela população das faixas componentes.
6. As taxas de idade e classe são usadas como marginais separadas. Isso NÃO reconstrói microdados nem garante consistência estatística conjunta. Não multiplicar ambas novamente para reduzir o tamanho do mercado.
7. Inteiros percentuais são arredondados pelo método dos maiores restos. Tamanhos são arredondados ao milhão para não sugerir precisão excessiva.

### Hipóteses adotadas quando não há proxy compatível

Taxas de alcance/interesse abaixo são escolhas analíticas para um cenário inicial. Não foram medidas pelas fontes citadas. Nos digitais, multiplicar também pela conectividade C2. Nos físicos, são taxas anuais plausíveis propostas, não taxas observadas de compra.

| Setor | Taxas por idade 18–24 / 25–34 / 35–54 / 55+ | Taxas por classe A / B / C |
|---|---|---|
| Gadgets | 85 / 90 / 70 / 40% | 90 / 70 / 40% |
| Moda | 95 / 95 / 90 / 75% | 98 / 95 / 85% |
| Consumíveis | 100 / 100 / 100 / 100% | 100 / 100 / 100% |
| Beleza | 75 / 90 / 85 / 65% | 90 / 80 / 65% |
| Pet | 30 / 55 / 60 / 45% | 60 / 55 / 40% |
| Home & Garden | 25 / 65 / 80 / 65% | 85 / 70 / 45% |

Para Softwares/apps, as taxas de atividade nas faixas originais TIC (16–24 / 25–34 / 35–44 / 45–59 / 60+) são 85/85/70/55/35%; por classe 95/85/65%. Para Mobilidade/delivery: 85/90/80/65/35%; por classe 90/85/65%. Aplicam-se os fatores C2 e o reagrupamento descrito acima.

Consumíveis cobre alimentos/bebidas; Beleza cobre maquiagem, perfumes e cuidados pessoais; Home & Garden cobre decoração, utensílios e jardinagem; Pet cobre produtos para animais. Softwares e plataformas incluem usuários gratuitos, portanto o tamanho NÃO é uma base de pagantes.

## Uso recomendado no jogo

Tratar estes números como cenário inicial calibrável, com baixa confiança nos cruzamentos setoriais, especialmente Pet, Home & Garden e a união de apps/mobilidade. Validar com pesquisas específicas antes de chamar de retrato real do mercado. Os tamanhos são tetos nacionais, não a audiência disponível ao founder no primeiro mês. Segmento do produto, região, preço, canal e qualidade filtram o público alcançável.

Manter uma futura opção para incluir DE, especialmente relevante para alimentos, educação, fintechs e mobilidade. O recorte ABC é uma decisão de simplificação, não ausência de consumo nas demais classes.
