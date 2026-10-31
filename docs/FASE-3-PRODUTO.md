# Fase 3 — Produto, protótipo 0.7

Implementação autorizada em 31/10/2026. Parâmetros abaixo são regras experimentais de jogo, não dados reais de mercado. A lista revisada dos doze setores e as extrapolações demográficas continuam documentadas separadamente; esta fase não altera silenciosamente a identidade de empresas existentes.

## Fluxo visual

Computador → catálogo → novo conceito → nome, persona e radar → tentativa de desenvolvimento → preço e cobrança ao lançar. Cada operação entra na agenda de quatro ações e pode ser removida/reordenada antes da aprovação. O painel mostra prévia otimista do desenvolvimento; a rolagem real só acontece ao executar o mês.

O catálogo comporta oito produtos não arquivados. Produtos têm IDs estáveis, nome, geração, família, persona, nível, atributos, tipo de cobrança, preço e histórico próprios. Nome é escapado ao renderizar, inclusive em relatórios e D20.

## Conceito e atributos

- Criar conceito usa uma ação e não tem custo monetário. Distribuir exatamente quatro pontos: Qualidade, Personalização, Originalidade e Recursos.
- Radar usa escala 0–10 por eixo, mas a soma é limitada ao nível. Não é possível maximizar todas as características.
- Tradeoffs: qualidade eleva custo e compete com preço acessível; personalização compete com padronização; originalidade com familiaridade; recursos com simplicidade. Os opostos aparecem no editor. Suas consequências surgem no custo, no orçamento limitado de pontos e na aderência aos desejos da persona.
- Atributos são zero enquanto o conceito não foi desenvolvido; o blueprint preserva a intenção. MVP bem-sucedido alcança nível 4. Melhorias acrescentam um ponto até nível 10 e permitem redistribuir os pontos.
- Perfis ideais fictícios por idade (pesos relativos nos quatro eixos): 18–24: 1/3/3/3; 25–34: 2/3/3/2; 35–54: 4/2/1/3; 55+: 7/1/1/1. Classe A acrescenta peso em qualidade/recursos; C diminui esses pesos e tem maior restrição de preço. O vetor exato não é mostrado ao jogador.

## Entrada viável e custos

| Projeto | Tentativa do MVP | Custo unitário | Disposição a pagar |
|---|---:|---|---|
| Enxuto | R$ 6 mil | 25% maior | Fator 0,85 |
| Completo | R$ 30 mil | Referência normal | Fator 1,0 |

O enxuto permite começar com R$ 12 mil de capital próprio, mas uma falha inicial pode exigir cortar verba ou buscar crédito. Não existe garantia de sobrevivência.

Depois do MVP, tentativa custa `base × 1,6^(max(0,nível−4))`, com base R$ 2.500 para enxuto e R$ 5.000 para completo. Tentativas consomem dinheiro e ação mesmo se falharem. O nível máximo não aceita novas melhorias.

O custo por unidade/ciclo é `baseSetorial × (1 + 0,14Q + 0,12P + 0,10O + 0,16R) × fatorEnxuto`. Bases experimentais: R$ 24 para produto físico e R$ 9 para software/serviço. Habilidade de negociação aplica desconto. Ainda não há estoque, lotes ou cadeia logística específica por setor.

## Desenvolvimento e pesquisa no D20

- MVP: dificuldade 6. Melhorias do nível 4 para 5: dificuldade 8, subindo dois pontos por nível até 18 para alcançar nível 10. Recuperar níveis abaixo de 4 usa dificuldade 8; nível zero recria MVP na dificuldade 6.
- Bônus do melhor profissional de Produto, limitado a +4; habilidade de produto +2; penalidade de foco −1 por produto adicional não arquivado, até −4. Não soma toda a equipe.
- Natural 1 sempre crítico: perde um nível e um ponto do maior atributo; piso zero. Falha normal mantém nível e atributos. Sucesso aplica a distribuição planejada.
- Se uma ação depender de um resultado que não ocorreu (ex.: lançar após MVP falho), ela é pulada sem cobrança. Cada ação executa numa cópia privada; exceções não deixam custos parciais escondidos.
- Pesquisa custa R$ 1.000 e uma ação. Dificuldade 10, com os modificadores de Produto. Sucesso revela uma prioridade de um atributo por vez, com confiança alta a partir de total 18. Falha não cria informação falsa nem revela a matriz inteira. Repetições podem revisitar a mesma pista.
- Pistas persistem na empresa e nos aprendizados do founder, identificadas por mercado/persona/atributo. Também aparecem em próximas empresas no mesmo mercado.
- Desenvolvimento e pesquisa utilizam o D20 animado existente, com a dificuldade real e consequência específicas.

## Preço, aderência e resultado

O primeiro preço fica vazio e deve ser escolhido ao lançar. A cobrança pode ser confirmada como compra única ou recorrência nesse momento. Depois de lançado, o preço pode ser reajustado com uma ação; trocar o modelo de cobrança exige outro produto/geração nesta versão.

Aderência compara a distribuição relativa dos atributos com a persona. Disposição a pagar depende de setor, classe, nível, aderência e escala do projeto. Não é exibida como preço recomendado.

Conversão cai conforme o preço se aproxima da disposição a pagar e é zero a partir dela. Também depende de aderência, nível, NPS e estágio de adoção. Assim, margem unitária maior não garante lucro maior: `resultado bruto = unidades × (preço − custo variável)`. O editor mostra custo e margem escolhida, e o histórico permite comparar preços e margens realizados, sem entregar o preço ótimo.

NPS vai de −100 a 100, incorporando aderência, nível e preço. NPS ruim reduz aquisição e aumenta cancelamentos; NPS −100 impede conversão. Não basta investir em marketing para superar um produto inviável.

## Catálogo, marketing e contabilidade

- Marketing mantém o foco em uma faixa etária por mês. É possível colocar uma ação para direcionar ao público do produto. O painel alerta quando há divergência de idade.
- O alcance do marketing é transformado em leads uma única vez. Os leads são particionados por classe e divididos entre produtos ativos da mesma persona. Não recebem cada um uma cópia integral do funil.
- Novos compradores de cada produto são limitados ao potencial da persona menos compradores únicos anteriores. Pessoas podem adquirir produtos diferentes em períodos diferentes; o modelo usa contadores agregados, não identidades individuais.
- Compra única: somente as unidades novas faturam e geram custo variável. Compradores anteriores não são cobrados novamente.
- Recorrência: clientes retidos + novos assinantes faturam e geram custo variável por ciclo. Churn acumula frações para que poucos assinantes restantes não fiquem imortais por arredondamento.
- ROAS usa novos compradores atribuídos ao canal multiplicados pelo preço de cada produto. Não inclui receita recorrente antiga ou orgânica e não deposita receita uma segunda vez no caixa.
- Relatório traz receita, custo, unidades/cobranças e NPS por produto. HUD mostra clientes atendidos/cobrados no mês quando há catálogo.

## Adoção e envelhecimento

Tamanho do mercado do produto = público setorial × percentual de idade × percentual de classe. É uma aproximação de gameplay que trata marginais como independentes. Não equivale a um cruzamento estatístico real.

| Compradores únicos / mercado | Estágio | Multiplicador de adoção |
|---|---|---:|
| Menos de 2,5% | Inovadores | 0,25 |
| 2,5% a menos de 15% | Early adopters | 0,45 |
| 15% a menos de 50% | Maioria inicial | 1,0 |
| 50% a menos de 84% | Maioria tardia | 0,55 |
| 84% a menos de 100% | Declínio | 0,12 |
| 100% | Fim do ciclo | 0 |

No pós-abismo, aderência abaixo de 0,55 ou NPS negativo aplica fator adicional 0,15. Renovação de assinatura não avança a curva. O painel desenha a curva com marcador do produto e a linha de 15%. Com a mesma quantidade de compradores, mercados menores avançam mais rápido.

A cada seis fechamentos desde o lançamento, incluindo o primeiro mês de vendas, o maior atributo perde um ponto; empates seguem a ordem do radar. Nível acompanha a perda, até zero. A redução acontece depois das vendas do período e afeta o seguinte. Não soma retroativamente perdas de meses anteriores ao save migrado.

## Continuações

Criar a próxima geração herda família, persona, modelo sugerido e uma distribuição inicial de blueprint. Continua exigindo conceito e desenvolvimento. O nome é editável. Ao lançar, a geração anterior é arquivada e suas assinaturas encerradas: o editor informa isso. Não migra assinantes nem inventa vendas antecipadas.

Lançar um produto abre uma nova mensagem de marketing para sua faixa etária e reinicia o contador de alcance daquela faixa. Não reinicia compradores únicos dos produtos antigos. Essa regra permite alcançar a audiência de novo para uma nova oferta; não basta pausar/religar a campanha. É uma aproximação a revisar no balanceamento.

## Migração e compatibilidade

Save schema 4 e backup `the-founder-v1-backup-before-products`. Produto antigo é convertido em assinatura de nome Flow, mantendo preço e assinantes, com nível aproximado a partir da qualidade anterior. Dados anteriores e relatórios são preservados. Decisões antigas já na fila mantêm IDs e seus custos antigos e são aplicadas ao produto legado; novos produtos usam as regras novas.

O motor antigo permanece como compatibilidade para estados sem catálogo e ações antigas. A interface nova não oferece o desenvolvimento escalar antigo. Os setores aprovados posteriormente ainda não foram trocados na seleção inicial, evitando mudar o setor de saves por índice durante esta fase.

## Validação e limites

Testes cobrem criação, orçamento de atributos, custos, riscos, dependências, compra única/recorrência, função lucro, NPS, pesquisa, obsolescência, adoção, competição por leads, ROAS de catálogo, gerações e migração. Integração cobre editor, nome escapado, preço vazio, agenda, D20 e retomada.

Continuam experimentais os custos, velocidades de adoção, elasticidade e efeitos de persona. Não há estoque físico, venda B2B, identidade individual de compradores, reativação de interessados ou promoção automática de assinantes para novas gerações. A calibração de estratégias e dificuldade completa pertence à Fase 6. Testes usam DOM simulado; inspeção visual em navegador continua pendente.
