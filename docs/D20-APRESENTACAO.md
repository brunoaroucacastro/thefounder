# Apresentação do D20 — versão 0.6.1

Solicitação: tornar a rolagem um momento visual de jogo, inspirado no ritual de Baldur's Gate 3. Arte e interface próprias: dado facetado violeta com contornos dourados, cena escura, dificuldade e fichas de modificadores abaixo.

## Fluxo

1. O jogador aprova o mês. O motor resolve todas as ações uma única vez e persiste resultado e cursor da apresentação juntos.
2. Se houver D20, abre a primeira cena com ação, dificuldade (ou faixas de evento), bônus e penalidades. O resultado fica oculto.
3. Clicar no dado ou em Rolar D20 anima rotação, movimento e faces por 1,65 segundo. Faces intermediárias são decoração determinística; não consomem números aleatórios.
4. Revelar o número natural salvo, a soma dos modificadores, o total e a consequência efetiva. Natural 1 mantém a identificação de falha crítica.
5. Avançar para a próxima rolagem; ao terminar, abrir o fechamento ou a tela de falência. Sem rolagens, ir direto ao resumo.

## Persistência e controles

- `s.dicePlayback`: token do relatório, índice e estágio ready/revealed. Não muda o schema econômico.
- Reabrir durante a animação retorna à mesma rolagem ainda não revelada; reabrir após a revelação mantém o resultado visível. Retomada ao escolher Continuar na abertura.
- Pular animações e Escape encerram a apresentação e mostram o resumo. Nunca desfazem o mês, alteram RNG ou repetem cobranças.
- Rever dados rolando no fechamento reproduz a sequência apenas em memória, sem escrever no save.
- Timers são cancelados ao pular, avançar ou trocar a apresentação; callbacks antigos não podem revelar cenas de outra sequência.
- `prefers-reduced-motion` desativa movimento e revela sem espera longa.
- Eventos trimestrais e de equipe mostram faixas reais e consequências próprias. Um evento favorável não é chamado de falha apenas por ter total abaixo de 11.

## Validação

Onze testes de apresentação com temporizadores controlados: transição, clique duplo, revelação crítica, sequência, skip durante movimento, retomada antes/depois de revelar, replay sem escrita, movimento reduzido, faixas de eventos e falha de persistência. Executados com o harness de integração e DOM simulado. Não equivalem a uma inspeção visual em navegador.
