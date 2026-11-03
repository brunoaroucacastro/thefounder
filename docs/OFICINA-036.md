# 0.36 — Oficina e criação do produto

Primeira etapa da direção visual aprovada. As imagens orientam composição, escala e paleta. Os seus números e rótulos ilustrativos não entram nas regras.

- **Oficina:** câmera ortográfica fixa, sala em corte, fundo azul-ardósia, paredes creme com faixa verde e piso de placas. Bancada, mesa administrativa, estantes e balcão compartilham uma projeção. Os objetos são desenhados separadamente e podem ser reutilizados na expansão futura.
- **Operação:** a bancada mostra o gadget e o progresso da montagem. A pesquisa aparece junto à mesa administrativa. As estantes usam estoque disponível e o balcão mostra os efeitos de vendas e avaliações reais. Personagens pequenos andam e trabalham; clientes entram pela porta e contornam o balcão.
- **Interface:** caixa, dia e velocidade na barra superior; Oficina, Produtos, Clientes e Caixa na inferior. As áreas de consulta reaproveitam os dados da partida. A ficha pequena no canto abre a decisão ou a tarefa atual.
- **Criação:** painel creme ao lado da sala, com sprite do gadget, persona, custo de materiais, pontos em quadrados e botões de ajuste. O gráfico de atributos permanece disponível ao expandir. A interface mostra a ordem existente: produto, vitrine, campanha, lote e preço.
- **Arte implementada:** camada lógica de 320 × 200, ampliada em passos inteiros com vizinho mais próximo quando cabe no espaço disponível. Títulos e navegação usam uma fonte de pixels original incorporada no HTML. Números e textos longos conservam uma fonte legível.

As regras e o formato do save permanecem os da 0.35. Nenhum novo sistema de expansão, funcionários ou finanças foi adicionado. O redesenho de cenas de resultado e o espaço ampliado das referências ficam para uma etapa posterior.

Validação: oficina e painel conferidos no navegador a 1280 × 720, com a cena a 3× na oficina e a 2× durante a criação. O painel da persona testada coube sem rolagem com o gráfico recolhido. A navegação de consulta preservou o projeto em andamento. Testes automatizados exercitam criação, orçamento de pontos, pesquisa, investimento, D20, lançamento, renderização sem mutação e carregamento de save 0.35. Os cenários de margem mantiveram os resultados anteriores.
