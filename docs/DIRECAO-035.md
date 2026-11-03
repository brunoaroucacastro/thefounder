# 0.35 — Uma oficina de invenções

A tela anterior tentava explicar cada regra a cada passo. Isso disputava atenção com o cenário e resolvia parte da descoberta antes da experiência. A direção desta revisão é dar espaço à decisão, à reação das pessoas e ao produto criado.

## Linguagem e apresentação

- Uma pessoa, uma faixa etária visível e uma dor. A distribuição interna do público continua nas fórmulas, sem parecer que Leo tem quatro idades.
- Vitrines e ações descrevem uma situação concreta, sem revelar afinidade por idade. Símbolos começam em `?`; só conhecimentos conquistados aparecem como informação confirmada.
- Campanha apresenta cards com ilustração, uma frase, custo e seleção. Sem bônus de conjunto exposto, sem parágrafo sobre CAC. As mesmas regras de alcance, bônus, custos e conversão permanecem.
- Preço mantém produto, CAC, total, margem e retorno por unidade. Explicações de contabilidade ficam na consulta opcional.
- Ação de abandonar vira botão de projeto, ao lado da ação principal quando há rodapé. A confirmação ainda informa que pesquisa paga não é devolvida.
- D20 tem uma cena, uma reação e um efeito discreto. Exemplo de total 11: “Bom o suficiente para um protótipo. Ainda tem muito a melhorar.” O fator real fica em texto menor.
- Popup do dado com largura máxima de 470 px, sem rolagem interna e sem a ficha completa da persona. Régua e matemática extensas saem da cena. Rolagens e efeitos não foram alterados.

## Identidade visual

Oficina de invenções: roxo profundo na moldura, creme na bancada, verde para escolhas confirmadas e amarelo nas ações. Contornos firmes e sombras curtas dão volume aos controles; cards usam áreas próprias para arte e descrição. O cenário segue o trabalho real dos personagens. Sem introduzir painéis de indicadores adicionais.

O fechamento é um placar de lançamento: entrada animada, unidades em destaque, barras de visitas/interesse/vendas, nota do produto, conversão, contribuição e faturamento. Os valores vêm da janela real; não são recompensas monetárias adicionais. O quadro não chama contribuição de lucro. A nota é a média de avaliações da versão, não uma nota inventada para a campanha. É possível rever o placar; fechar não recalcula resultados nem repete a rolagem.

Para aprofundar a arte depois desta revisão, a proposta é substituir os símbolos dos cards por pequenos objetos pixelados da própria oficina, ampliar as reações dos personagens e diferenciar embalagem e aparência das gerações. Isso é direção futura, não funcionalidade alegada nesta entrega.

## Ajustes funcionais pedidos

Produção aceita qualquer inteiro positivo, com slider de 1 a 10.000 como atalho e campo numérico livre inclusive acima desse intervalo. Descontos continuam nos mesmos patamares e limitados a 10%; quantidades abaixo de 100 não ganham desconto. Quantidade inválida ou sem caixa continua sendo recusada. Vale também para reposição.

Após evolução bem-sucedida, a nova versão vai para `upgradeAttributes`: prancheta com orçamento do nível alcançado, teto de cinco por atributo e conhecimentos já guardados. Confirmar aplica o projeto e segue à campanha, sem outra cobrança de desenvolvimento nem novo D20. A tela anterior da tentativa de evolução deixa a distribuição para depois do resultado. Redistribuição sem subir nível continua com o custo já existente de R$750.

Saves mantêm a mesma chave, incluindo resultados fechados e a nova etapa de atributos. A lógica econômica da 0.34 foi preservada; testes de margem continuam produzindo os mesmos valores.

## Verificação

Teste de interface completo em DOM/Canvas simulado: criação, ausência de dicas antecipadas, D20 11, lote de 37, preço, lançamento, fechamento e reabertura persistente do placar. Teste de evolução 4→5 confirma retorno aos atributos, aplicação da nova distribuição e ausência de cobrança duplicada.

Também houve inspeção real no navegador local, a 1280×720, de persona, vitrine, cards de campanha, D20, quantidade e preço. Popup de produto medido em aproximadamente 470×288 px, sem rolagem interna. Contabilidade, dados e regressões são cobertos por testes automatizados; isso não equivale a uma avaliação subjetiva de diversão de todos os públicos.
