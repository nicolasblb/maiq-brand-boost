# Ajustes na seção “O Ciclo”

## Resultado esperado

- Centralizar o título e o subtítulo da seção.
- Alterar o título para **“O M&A não termina na assinatura de um contrato”**.
- Alterar o subtítulo para **“É a partir da conclusão da transação que começa o trabalho de integração e captura de sinergias”**.
- Remover as caixas de fundo e suas bordas dos nomes das raias, mantendo apenas cada ícone e texto.
- Em telas menores, preservar o diagrama completo em uma área com rolagem horizontal, sem coluna fixa, fundo diferente ou linha divisória vertical.
- Aumentar em 30% os pontos das linhas pontilhadas horizontais, mantendo os fadeouts nas extremidades.

## Implementação

- Atualizar o cabeçalho e sua centralização no componente da seção.
- Simplificar os quatro rótulos das raias tanto na versão completa do gráfico quanto no comportamento para telas estreitas.
- Remover a coluna HTML fixa usada no recorte e ajustar o cálculo responsivo para exibir o SVG completo com rolagem horizontal quando necessário.
- Aumentar o tamanho dos traços pontilhados sem alterar os gradientes que produzem os fadeouts.

## Validação

- Conferir desktop e celular nos modos noite e dia.
- Confirmar rolagem horizontal funcional, ausência do fundo/divisória antiga, alinhamento dos ícones e textos e preservação da animação do fluxo.
- Verificar que não há sobreposições nem erros na página.
