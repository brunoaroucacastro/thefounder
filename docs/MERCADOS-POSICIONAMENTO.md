# Posicionamento dos mercados — versão 0.13

Correção solicitada pelo jogador em 31/10/2026. Esta tabela SUBSTITUI a distribuição etária e econômica da versão 0.12. Os percentuais são escolhas de posicionamento para gameplay, não resultados da pesquisa populacional. Foram mantidos nomes, tamanhos de público, IDs, aportes e demais regras.

| Mercado | Público mantido | 18–24 | 25–34 | 35–54 | 55+ | A | B | C |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Gadgets & tecnologia | 59 milhões | 15% | 25% | 45% | 15% | 55% | 30% | 15% |
| Moda & vestuário | 102 milhões | 25% | 45% | 20% | 10% | 20% | 55% | 25% |
| Consumíveis | 115 milhões | 10% | 20% | 30% | 40% | 10% | 25% | 65% |
| Beleza & cosméticos | 81 milhões | 20% | 45% | 25% | 10% | 50% | 35% | 15% |
| Pet | 52 milhões | 10% | 25% | 45% | 20% | 45% | 35% | 20% |
| Home & Garden | 63 milhões | 10% | 45% | 30% | 15% | 25% | 55% | 20% |
| Fintechs | 68 milhões | 10% | 20% | 30% | 40% | 25% | 50% | 25% |
| Healthtechs | 59 milhões | 5% | 15% | 25% | 55% | 50% | 35% | 15% |
| Educação | 46 milhões | 50% | 25% | 15% | 10% | 15% | 55% | 30% |
| Redes sociais & conteúdo | 87 milhões | 45% | 30% | 15% | 10% | 10% | 30% | 60% |
| Softwares & aplicativos | 76 milhões | 45% | 25% | 20% | 10% | 15% | 30% | 55% |
| Mobilidade & delivery | 76 milhões | 20% | 25% | 45% | 10% | 15% | 35% | 50% |

## Lógicas de posicionamento

| Mercado | Idade | Classe |
|---|---|---|
| Gadgets & tecnologia | Poder de compra consolidado e busca por produtividade, conveniência e equipamentos melhores. | Tecnologia premium, inovação e troca por modelos superiores. |
| Moda & vestuário | Renda própria, vida social e construção da imagem pessoal e profissional. | Marca desejada, com qualidade e preço acessível à renda intermediária. |
| Consumíveis | Abastecimento recorrente, alimentação cotidiana e fidelidade a marcas conhecidas. | Necessidade cotidiana, preço por unidade e forte sensibilidade a promoções. |
| Beleza & cosméticos | Autocuidado, experimentação e disposição para construir uma rotina de produtos. | Marca aspiracional, formulações diferenciadas e experiência premium. |
| Pet | Rotina doméstica estabelecida e orçamento recorrente para cuidar dos animais. | Alimentação e acessórios premium, bem-estar e maior gasto por animal. |
| Home & Garden | Primeira casa, mudança, casamento e chegada dos filhos. | Melhorar a casa buscando equilíbrio entre estética, utilidade e preço. |
| Fintechs | Organizar patrimônio, aposentadoria, pagamentos e segurança financeira. | Organização financeira e construção de patrimônio com serviços acessíveis. |
| Healthtechs | Acompanhamento contínuo de saúde, consultas, prevenção e gestão de tratamentos. | Acompanhamento particular, personalização e conveniência no atendimento. |
| Educação | Formação, entrada no mercado de trabalho e construção de carreira. | Investimento em qualificação com expectativa de crescimento profissional. |
| Redes sociais & conteúdo | Descoberta, pertencimento, entretenimento e criação de identidade. | Acesso gratuito ou barato, com monetização principalmente por publicidade. |
| Softwares & aplicativos | Jogos, criatividade e experimentação de novos apps. | Apps mobile e jogos gratuitos, com compras opcionais ou planos de entrada. |
| Mobilidade & delivery | Trabalho, filhos e pouco tempo disponível: pagar para ganhar conveniência. | Economia, cupons, transporte compartilhado e opções de baixo custo. |

## Implementação e compatibilidade

- Três mercados têm maior peso em cada faixa etária e quatro em cada classe. As duas distribuições são analisadas separadamente, não como uma única classificação.
- Os números são usados pelo marketing e pelo dimensionamento da persona do produto, além da criação de empresa. O cruzamento de idade/classe ainda assume independência por simplificação.
- Tamanho do público continua sendo a estimativa anterior de Brasil, ABC e 18+, não clientes garantidos. Linhas não podem ser somadas.
- A criação identifica os percentuais como posicionamento de gameplay e mostra as duas justificativas em detalhes expansíveis separados.
- Os doze índices legados originais (0–11) permanecem intactos. Para os doze setores B2C (12–23), a correção de percentuais se aplica também ao carregar uma partida já criada na versão 0.12. Setor, caixa, dívidas, equipe, produtos e agenda não são reiniciados.
- O campo de versão do catálogo marca a versão usada ao fundar a empresa; novas empresas registram versão 3. Não se cria outro conjunto de setores nem se reutilizam IDs de empresas diferentes.

## Validação

129 testes nomeados mais integrações passaram. Tabela exata, soma 100%, equilíbrio 3/3/3/3 e 4/4/4, textos separados, persistência, tamanho de público e regras anteriores verificados. Oito estilos/quatorze scripts incorporados no HTML independente, com sintaxe validada. Inspeção visual real continua pendente; não é alegada por testes DOM simulados. Resultados das 1.920 simulações atualizadas em SIMULACOES-POSICIONAMENTO-013.json e .csv; arquivos das versões anteriores continuam históricos.
