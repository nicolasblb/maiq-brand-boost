# Refinar navegação e temporizadores de “A Plataforma”

## Resultado esperado

- Concentrar as cinco funcionalidades à esquerda, alinhadas ao título e ao texto introdutório, mantendo cada nome centralizado dentro de um espaço menor e uniforme.
- Preservar o cartão de mídia e texto centralizado como está.
- Aplicar fade suave nas duas extremidades da linha, inclusive no trecho luminoso.
- Remover o círculo na ponta do progresso e garantir que a linha e seu brilho apareçam inteiros, sem corte vertical.

## Interação e tempo

- Pausar a troca automática somente quando o ponteiro estiver sobre a mídia, o texto ou um botão de funcionalidade.
- Manter a troca automática em exatamente 15 segundos por funcionalidade, excluindo apenas períodos efetivamente pausados.
- Corrigir a reinicialização do progresso da mídia nas trocas manuais, preservando play, pause e replay.
- Manter o progresso da mídia independente do temporizador das funcionalidades.

## Detalhes técnicos

- Limitar a largura da faixa de funcionalidades no desktop e usar cinco colunas iguais; em telas estreitas, preservar a rolagem horizontal e a visibilidade da opção ativa.
- Mover os eventos de pausa do contêiner geral para a mídia, o texto e os botões.
- Substituir o cálculo incremental dos relógios por referências de início e tempo acumulado, evitando perda de tempo em recriações dos ciclos de animação.
- Aplicar uma máscara horizontal à linha completa e remover o elemento de núcleo circular.

## Verificação

- Medir o intervalo entre trocas automáticas e confirmar 15 segundos em sequência.
- Trocar manualmente entre todas as funcionalidades e confirmar que o progresso circular da mídia reinicia e continua.
- Confirmar pausa apenas nas três áreas previstas e continuidade nas demais áreas da seção.
- Revisar desktop e celular, temas claro e noturno, sem cortes ou sobreposições.