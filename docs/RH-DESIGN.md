# RH — design da contratação, motivação e evolução

Versão de trabalho, 16/11/2026. Produto e Marketing apenas; Financeiro fica para depois.

Legenda de status: **[feito]** já está no jogo · **[próximo]** pronto para implementar · **[sem alocação]** sem encaixe na mecânica atual.

## 1. Motivação

### Ritmo

| Evento | Variação |
|---|---|
| Fim de semana (natural) | **−8** (de 100 a 0 em ~12 semanas sem nada acontecer) |
| Semana com lucro / com prejuízo | +4 / −4 (todos) |
| Campanha excepcional · ótima · válida · fraca · flop | +15 · +10 · +3 · −5 · −15 (todos) |
| Contratação de colega | +5 (todos) |
| Demissão de colega | −15 (quem fica) |
| Empréstimo em atraso | −20 (todos) |
| Treino deu certo / falhou | +10 / −10 (a pessoa) |
| Pessoa da área entrega o trabalho (produto pronto, campanha pronta) | +5 (a pessoa) **[próximo]** |
| Hub social da cidade | **[futuro]** |

### Faixas e efeitos (buffs/debuffs)

| Faixa | Produto | Marketing |
|---|---|---|
| **Inspirado** 80–100 | Produto montado +5% · trabalho 20% mais rápido | Campanha +10% |
| Normal 40–79 | — | — |
| **Desanimado** 20–39 | Produto montado −5% · trabalho 20% mais lento | Campanha −10% |
| **Esgotado** 0–19 | Produto montado −10% · trabalho 40% mais lento · 25% de chance de pedir demissão no fim da semana | Campanha −20% · mesma chance de demissão |

O bônus do produto é "carimbado" na hora em que a montagem é concluída e vale até a próxima versão.

## 2. Buffs e debuffs (estilo Ragnarok) [feito na 1ª versão]

Quadradinhos com símbolo no topo da tela. Borda verde = buff, vermelha = debuff. Clicar mostra o nome, o efeito, a origem e a duração.

Primeiros buffs/debuffs:
- Motivação de cada pessoa (Inspirado, Desanimado, Esgotado).
- Fim de semana (Descansado / Focado), com dias restantes.
- Campanha desgastada (quanto ainda rende).
- Pagamento atrasado.
- Montagem do produto (100%+ ou incompleta).

## 3. Produto: pontuação por preenchimento [feito na 1ª versão]

- Preencher todas as casas livres da bancada = **100%**.
- Cada casa vazia = **−5%**.
- Profissional de produto inspirado = +5% (pode passar de 100%).
- A porcentagem multiplica o quanto o produto agrada à persona (a "afinidade" usada nas vendas).

## 4. Tempo como recurso [próximo]

- Desenvolvimento por nível do produto: NV4 = 2 dias, +0,5 dia por nível (NV10 = 5 dias). Campanha: 1 dia + 0,25 por fase de marketing.
- Cada pessoa da área reduz o tempo pela sua **Velocidade** (atributo que cresce com o nível). Duas pessoas de produto somam.
- Motivação acelera ou atrasa (ver faixas).

## 5. Perfis profissionais (habilidade fixa da contratação)

Todos da área têm o **bônus comum**, que cresce com o nível:
- Produto: trabalho mais rápido e +1 no D20 (Pleno+), +2 (Sênior+).
- Marketing: +3% de pontuação da campanha por nível.

Cada candidato vem com **uma** habilidade de perfil:

| # | Produto | Habilidade |
|---|---|---|
| P1 | Engenheiro de testes | +3 em todas as rolagens de D20 de produto |
| P2 | Caçador de raridades | Peças Rara e Épica aparecem com o dobro da frequência |
| P3 | Prototipista | Uma vez por montagem, escolhe qualquer peça Comum para o pool |
| P4 | Designer generalista | 4 peças por oferta em vez de 3 |
| P5 | Revisor | Retira 1 peça já encaixada por desenvolvimento |
| P6 | Arranjador | Pode mover as peças já encaixadas na bancada |
| P7 | Comprador | Troca de peças custa 50% menos |
| P8 | Coringa | 1 troca de peças grátis por desenvolvimento, quando quiser |
| P9 | Detalhista | 2 peças de casa única extras: não contam no limite nem somam pontos (servem para fechar 100%) |
| P10 | Visionário | Cada estrela coberta vale +2 em vez de +1 |
| P11 | Acelerado | Desenvolvimento 30% mais rápido |

| # | Marketing | Habilidade |
|---|---|---|
| M1 | Negociador de mídia | 1 troca de cartas grátis por campanha, quando quiser |
| M2 | Comprador de mídia | Troca de cartas custa 50% menos |
| M3 | Panfleteiro | 5 cartas grátis "Panfleto" (alcança 1 casa) |
| M4 | Copywriter | Duplica uma carta da mão (1 vez por campanha) |
| M5 | Gestor de crise | Anula uma casa especial antes de jogar (Viralização, Cancelamento ou Promotor) |
| M6 | Otimizador | Escolhe uma carta da mão: o custo dela vira 1 |
| M7 | Incansável | +1 de energia fixo |
| M8 | Influente | A Indicação do promotor marca 3 casas em vez de 2 |
| M9 | Viralizador | Viralização alcança 5×5 em vez de 3×3 |
| M10 | Mira certeira | Cada persona alcançada vale +10% na campanha |

## 6. Personalidade (traço MBTI)

Cada pessoa tem um tipo. O traço é independente da área.

| Tipo | Nome | Traço no jogo | Efeito |
|---|---|---|---|
| ISTJ | Logístico | Constante | Perde metade da motivação semanal; ganha metade dos bônus de motivação |
| ISFJ | Defensor | Leal | Nunca pede demissão; quando Esgotado, o debuff dobra |
| INFJ | Advogado | Conselheiro | **[sem alocação]** (comentários pertinentes, depende do sistema de insights) |
| INTJ | Arquiteto | Lobo solitário | Bônus de área +20% quando é o único da equipe; −10% com colega |
| ISTP | Virtuoso | Mão na massa | Trabalho 15% mais rápido; motivação cai +2 por semana (detesta rotina) |
| ISFP | Aventureiro | Livre | **[sem alocação]** (expressão pessoal, encaixa no hub social) |
| INFP | Mediador | Idealista | **[sem alocação]** (valores pessoais, encaixa no hub social) |
| INTP | Lógico | Aprende rápido | +50% de EXP em treinamentos |
| ESTP | Empreendedor | Workaholic | Trabalho 20% mais rápido; perde o dobro de motivação |
| ESFP | Animador | Alto astral | Colegas +3 de motivação por semana |
| ENFP | Ativista | Empolgado | Eventos bons de motivação valem o dobro; os ruins também |
| ENTP | Inovador | Questionador | +10 de motivação em produto novo ou nova versão; −5 em recampanha |
| ESTJ | Executivo | Pontual | Trabalho 10% mais rápido; atraso de pagamento tira −30 em vez de −20 |
| ESFJ | Cônsul | Agregador | Enquanto ele estiver, flops e demissões tiram metade da motivação dos colegas |
| ENFJ | Protagonista | Estrela | Bônus de área ×1,5; salário +30% |
| ENTJ | Comandante | Puxa o ritmo | Enquanto Inspirado, os colegas ganham +3 de motivação por semana |

## 7. Níveis e evolução

- Níveis 1 a 10. Títulos: **Júnior (1–3), Pleno (4–6), Sênior (7–9), Especialista (10)**.
- A EXP vem principalmente do **treinamento**. O D20 do treino define **quanto** de EXP entra (nunca zero): EXP = 20 + D20 × 4 (24 a 100). Trabalho da área dá um pouco de EXP passiva.
- EXP para subir: 100 × nível atual.

Atributos que crescem a cada nível:

| Atributo | Efeito |
|---|---|
| Velocidade | Reduz o tempo de trabalho da área |
| Automotivação | Reduz a queda semanal de motivação |
| Inspiração | Motiva os colegas toda semana |
| Bônus de área | Aumenta o bônus comum |
| Insight | Chance de comentários úteis **[sem alocação]** |

**Habilidades especiais nos níveis 4, 7 e 10.** Nos níveis 4 e 7 a pessoa rola uma habilidade do pool da área (as da tabela de perfis que ela ainda não tem). O nível 10 rola do pool **lendário**:

| Área | Lendárias (nível 10) |
|---|---|
| Produto | **Obra-prima:** a montagem vale até 150% · **Duas chances:** rola 2 D20 e fica com o maior · **Linha de produção:** desenvolvimento pela metade do tempo |
| Marketing | **Viral total:** toda Viralização encadeia em 5×5 · **Agência própria:** +3 de energia · **Mão cheia:** começa com 2 Indicações |

## 8. Treinamentos

| Treino | Alvo | Efeito |
|---|---|---|
| Curso técnico | Individual ou grupo | Dá EXP (rolagem D20 define quanto; grupo dá 60% para cada) |
| Integração | Individual ou grupo | +20 de motivação (grupo: +12 para cada) |
| Mentoria | Individual | Rola uma habilidade especial nova; você escolhe trocar por uma que já tem ou manter as atuais |

## 9. Contratar na cidade [próximo, versão simples]

Moradores do bairro com profissão escondida. Com amizade alta, você vê o currículo e convida direto: sem custo de busca e sem espera. Sem mesa livre, vai para a agenda de contatos.

## 10. Fora por enquanto

- Potencial (A/B/C): descartado.
- Traço "indica pessoas da cidade": descartado.
- Financeiro: ver backlog.
