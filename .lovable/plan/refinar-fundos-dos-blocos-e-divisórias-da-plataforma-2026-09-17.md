# Refinar fundos dos blocos e divisórias da Plataforma

## Resultado esperado

- Tornar os círculos divisórios da linha da Plataforma totalmente sólidos e opacos, usando exatamente a mesma cor da borda em cada tema e preservando o alinhamento vertical com a linha.
- Remover o degradê transversal animado compartilhado por “Nosso modelo” e “Os Pilares”.
- Aplicar nesse bloco um degradê vertical estático: tom atual no topo, tom levemente mais claro no encontro entre as seções e retorno ao tom mais escuro na base.
- Aplicar em “A Plataforma” e “O Ciclo” a composição inversa: tom mais claro no topo e na base, com tom mais escuro no centro entre as seções.
- Definir os tons por tokens Maiq específicos para noite e dia, mantendo transições suaves na troca de tema.

## Implementação

- Substituir as camadas e animações diagonais de `.maiq-model-pilares-bg` por um único `linear-gradient(180deg, ...)`, sem pseudo-elementos animados.
- Adicionar uma classe ao contêiner conjunto de “A Plataforma” e “O Ciclo” e aplicar nele o gradiente vertical invertido.
- Introduzir tokens semânticos de fundo para as extremidades e o centro de cada bloco nas paletas noturna e diurna.
- Ajustar `.maiq-platform-line-divider` para usar um token de cor opaco na borda e no preenchimento, mantendo o centro do ponto coincidente com o eixo da linha.
- Remover do observador de desempenho a referência ao antigo degradê animado, que deixará de existir.

## Verificação

- Conferir os dois blocos nos temas noite e dia.
- Verificar as divisórias com ampliação visual para confirmar opacidade e alinhamento.
- Confirmar que não restou animação transversal nos fundos e que não há erros na página.
