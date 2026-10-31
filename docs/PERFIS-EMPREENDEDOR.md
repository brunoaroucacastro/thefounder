# Perfis de empreendedor — versão 0.15

Primeira distribuição implementada após autorização do jogador. Cada perfil tem exatamente uma categoria com +1 e outra com −1. Empreendedor de primeira viagem é 0/0 e a opção inicial da criação. Os dez índices anteriores foram preservados; o novo perfil ocupa o índice 10.

| Perfil | +1 | −1 |
|---|---|---|
| Agressivo | Escalar campanhas | Conduzir reuniões |
| Criativo | Pesquisar personas | Solicitar crédito |
| Analítico | Pesquisar benchmarks | Escalar campanhas |
| Comercial | Negociar fornecedores | Desenvolver e melhorar produtos |
| Construtor | Desenvolver e melhorar produtos | Otimizar campanhas |
| Operador | Otimizar campanhas | Pesquisar personas |
| Conector | Solicitar crédito | Treinar pessoas |
| Visionário | Escalar campanhas | Pesquisar benchmarks |
| Resiliente | Treinar pessoas | Negociar fornecedores |
| Orientado a impacto | Conduzir reuniões | Solicitar crédito |
| Empreendedor de primeira viagem | 0 · sem bônus | 0 · sem penalidade |

## Por que cada escolha?

- **Agressivo**: Impulsiona o crescimento. Pode pressionar demais a equipe.
- **Criativo**: Descobre necessidades pouco óbvias. Pode apresentar planos pouco convencionais aos bancos.
- **Analítico**: Interpreta referências financeiras. Hesita ao acelerar o crescimento.
- **Comercial**: Negocia melhores condições. Pode prometer além da execução técnica.
- **Construtor**: Executa e aprimora produtos. Pode deixar os anúncios em segundo plano.
- **Operador**: Ajusta operações existentes com disciplina. Pode se prender ao processo e ouvir pouco o consumidor.
- **Conector**: Apresenta a empresa e transmite confiança aos bancos. Pode depender da rede em vez de desenvolver o time.
- **Visionário**: Mobiliza recursos para crescer. Pode subestimar os detalhes financeiros.
- **Resiliente**: Ajuda pessoas a evoluir com a prática. Pode insistir demais nas próprias condições.
- **Orientado a impacto**: Engaja a equipe em um propósito comum. Pode ter dificuldade em defender o retorno financeiro.
- **Empreendedor de primeira viagem**: Sem vícios: nenhuma penalidade. Sem especialidade: nenhum bônus.

## Funcionamento

- O D20 central recebe uma categoria explícita de ação e acrescenta o modificador uma vez. O nome do perfil, categoria e valor aparecem nos chips do dado e ficam salvos no relatório. Não se decide o bônus interpretando o texto do rótulo.
- Soma com especialistas, afinidade, saturação, score e demais modificadores já existentes. Não cria outro sorteio, não muda o resultado natural e não consome outra ação.
- Desenvolvimento inclui MVP e melhorias. Fornecedores inclui primeira negociação e insistências, para produção/operação e aluguel. Campanhas escalar/otimizar abrangem os três canais; reduzir não recebe nenhum traço nesta distribuição.
- Pesquisa de persona e pesquisa de benchmark são categorias distintas. O sorteio da categoria de benchmark é neutro.
- Reunião passa a usar o total D20 + perfil para as faixas: 1–5 −5 motivação; 6–10 zero; 11–15 +5; 16+ +10. Natural 1 sempre causa −5.
- Eventos trimestrais, sorteio de benchmark e retenção individual não recebem modificadores de perfil. Retenção segue as faixas de motivação existentes. Ações sem dado continuam sem dado.
- Natural 1 continua crítico mesmo com +1. Os limites de descontos, eficiência, salários, níveis e motivação continuam valendo. Nenhum traço dá crédito, receita, desconto ou promoção automaticamente.

## Saves e interface

IDs estáveis são associados ao perfil já escolhido em saves antigos. O perfil anterior passa a atuar apenas em novas rolagens; resultados salvos não são recalculados. Save sem founder ou com perfil desconhecido recebe comportamento neutro. Criação mostra +1/−1 específicos ou 0/0; os textos de prós/contras foram alinhados aos efeitos efetivos. Nenhuma área ficou com bônus global implícito.

O arquivo jogável desta entrega é The-Founder-0.15-Jogar.html. O selo de versão permite identificar a cópia aberta. Os 12 mercados, os percentuais aprovados e os aportes de R$25/R$50/R$80/R$150 mil foram preservados.

## Verificação

142 testes nomeados mais integrações passaram: 13 novos testes de perfis cobrem todos os pares, neutralidade, migração, soma única, crítico, categorias reais de ações, fornecedor/insistência, crédito, treino e reuniões pelo total. Integração testa criação, efeitos visíveis no D20, save/reload e replay sem duplicação. O teste de entrega executa o HTML independente em DOM simulado e confere o módulo de perfis no pacote final. Oito estilos e quinze scripts incorporados, sintaxe validada. Isso não é uma inspeção visual real de navegador. As simulações históricas anteriores são neutras quanto a perfis; não se alega nova calibração estatística dos onze founders nesta entrega.
