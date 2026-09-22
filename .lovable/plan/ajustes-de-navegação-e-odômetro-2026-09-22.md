# Ajustes de navegação e odômetro

## Objetivo
Corrigir o destaque das opções internas de “Home”, alinhar corretamente cada seção ao navegar pelo menu e concluir a animação dos números no momento em que “Nosso Modelo” alcança o topo útil da tela.

## Implementação
- Aplicar estados visuais próprios de hover e foco nas subopções do menu “Home”, preservando acessibilidade por teclado.
- Centralizar a lógica de posicionamento dos destinos da home, considerando a altura do menu fixo e a arquitetura de blocos sobrepostos.
- Definir o ponto de chegada individual de cada seção para que título, subtítulo e conteúdo fiquem distribuídos corretamente, sem ficarem encobertos pelo menu.
- Usar a mesma lógica ao voltar da página de Insights para uma seção da home.
- Recalibrar o odômetro reversível: iniciar conforme “Nosso Modelo” entra na tela e atingir 100% quando o topo da seção chega ao topo útil, logo abaixo do menu.

## Validação
- Conferir todas as subopções de “Home” na página principal e na página Insights.
- Validar os destinos e a animação reversível em computador e celular.
- Confirmar ausência de erros e funcionamento dos estados de hover, foco e navegação suave.
