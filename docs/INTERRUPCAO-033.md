# 0.33 — Encerrar vendas e rever a estratégia

## Comportamento

Durante as vendas, ou durante a proposta de uma loja, **Encerrar vendas e rever estratégia** permite interromper a janela. Uma confirmação informa o efeito e o custo de operação antes de executar. Cancelar a confirmação mantém o jogo como estava.

O fechamento libera as três decisões existentes: melhorar o produto, criar outro ou continuar com uma nova campanha. Um atalho **Reajustar preço e preparar nova campanha** abre diretamente a precificação do produto atual, sem refazer pesquisa, MVP ou fabricação. Depois do preço o jogador prepara a apresentação e rola o dado da nova campanha.

## O que fica preservado

- Vendas feitas, receita, CAC já pago, avaliações e descobertas.
- Estoque pronto, pelo seu valor contábil real.
- Gastos de pesquisa, desenvolvimento, praça e fabricação já realizados.
- Lote em produção: continua sendo concluído, pois já foi pago. Mudar de produto ou versão ainda aguarda esse trabalho terminar; rever preço e preparar campanha da mesma versão continua disponível.
- Saves anteriores, com a mesma chave de persistência.

Interromper não concede novos atributos grátis nem muda as unidades antigas. Melhorar o produto continua exigindo o investimento e o teste de evolução existentes.

## Tempo e contabilidade

A referência de estrutura continua em R$900 por sete dias do jogo. Ao encerrar antes, cobra-se a fração correspondente ao tempo utilizado, com arredondamento em centavos: `900 × limitar(tempo da janela / 420 segundos simulados; 0; 1)`. Um dia custa R$128,57; sete dias completos custam R$900. O mesmo cálculo vale para um atendimento natural mais curto, como reconversão, evitando cobrar mais só porque o jogador esperou o último contato.

Essa é uma regra de encerramento proporcional à janela; não redefine R$900 como aluguel mensal nem aplica a hipótese anterior de R$210 por semana. Não há multa extra por cancelar. O custo entra uma vez no fechamento, inclusive ao carregar o save novamente.

## Contatos e aprendizado

A fila restante é encerrada. O total de contatos pendentes é registrado e retirado da fila cumulativa, para não reaparecer como visitantes fictícios na campanha seguinte. Interessados que realmente chegaram e ainda são elegíveis podem continuar no sistema de reconversão. O cancelamento não desfaz o desgaste e a cobertura que a campanha já comprometeu.

A investigação só usa evidências realmente registradas antes da interrupção. Encerrar sem visitas ou avaliações não revela conhecimento grátis. A proposta de loja não é aceita automaticamente quando o jogador encerra a janela.

## Validação

- Seis testes em `tests/stop-sales.cjs`: interromper preço errado e vender após correção; preservar contas; cobrança proporcional; proposta de loja; estoque em produção; pausa e falta de evidência.
- Integração em `tests/stop-sales-ui.cjs`: botão, confirmação cancelada e aceita, acesso às três decisões, reajuste, retomada após reload e nova campanha sem repetir MVP.
- Regressões de economia por unidade, aprendizado, interface comercial e investigação, suíte principal, build e release.
- UI exercitada em DOM/Canvas simulados. Não houve inspeção visual em navegador.
