# Nova sequência de sobreposições e ajuste do arraste em “O Ciclo”

## Resultado esperado

- Exibir o cursor de “mão” sobre o fluxo somente quando o diagrama estiver realmente cortado e a orientação “Clique e arraste para visualizar” estiver visível.
- Ao terminar “Nossa Convicção”, revelar “Nossa Plataforma” sem deslocamento do seu conteúdo, mantendo a seção parada e integralmente legível.
- Fazer “O M&A não termina na assinatura de um contrato” subir como um novo bloco sobreposto e cobrir “Nossa Plataforma”.
- Inserir “Os Domínios” logo após “O M&A…”, dentro desse mesmo bloco, com título e subtítulo centralizados; nesta primeira versão, o subtítulo será “Em construção”.
- Ao terminar “Os Domínios”, retirar o bloco sobreposto e revelar FAQ + rodapé parados ao fundo.

## Estrutura de rolagem

```text
Nosso modelo + Nossa Convicção (bloco atual)
                    ↓ revela
Nossa Plataforma (camada parada)
                    ↓ é coberta por
O M&A… + Os Domínios (novo bloco sobreposto)
                    ↓ sai e revela
FAQ + rodapé (camada final parada)
```

- Separar “Nossa Plataforma” e “O Ciclo” do contêiner fixo compartilhado atual.
- Criar três estágios independentes: Plataforma ao fundo, Ciclo + Domínios como sobreposição intermediária e FAQ + rodapé como base final.
- Remover o deslocamento vertical aplicado hoje ao conteúdo da Plataforma durante sua revelação; a transição será produzida pelo bloco que sai ou entra por cima.
- Calcular a posição fixa de cada camada pela sua altura real, para preservar todo o conteúdo em telas baixas ou estreitas sem cortes.
- Manter bordas, sombras, raios, fundos temáticos e comportamento nos modos dia e noite coerentes com os blocos atuais.

## Ajuste do fluxo arrastável

- Sincronizar um estado explícito de “fluxo cortado” com a mesma medição que controla a orientação de arraste.
- Aplicar os cursores de agarrar/arrastando apenas quando esse estado estiver ativo; sem conteúdo oculto, o cursor permanece normal e o arraste não é iniciado.
- Preservar o recorte junto à divisória das raias, o arraste direto, o teclado e a orientação central já existentes.

## Validação

- Conferir a ordem completa das transições em desktop e celular, nos modos dia e noite.
- Confirmar que Plataforma, Ciclo, Domínios, FAQ e rodapé ficam totalmente legíveis nos momentos de parada e revelação.
- Verificar que o cursor de mão e a orientação aparecem e desaparecem juntos conforme exista ou não conteúdo horizontal oculto.
- Testar arraste, navegação por teclado, abertura dos acordeões do FAQ e ausência de sobreposições, saltos ou espaços vazios durante o scroll.
