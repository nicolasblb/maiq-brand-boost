# Refinar “A Plataforma”: composição original e temporizador contínuo

## Resultado esperado

- Restaurar, na exibição normal, a composição anterior do bloco de mídia e texto: cartão independente, com suas proporções, borda completa, cantos e espaçamento originais.
- Manter os novos controles de **play/pause**, progresso da mídia e **maximizar**, além do modal ampliado com navegação.
- Colocar os cinco nomes em uma faixa própria, separada do cartão de conteúdo e levemente alinhada à esquerda, conforme a referência.
- Transformar a linha em um temporizador contínuo e cumulativo ao longo das cinco funcionalidades.

## Estrutura visual

1. O título e a introdução de “A Plataforma” permanecem como estão.
2. Abaixo deles, criar uma faixa autônoma para **M&AI**, **QUARPX®**, **Teses**, **Diligência** e **Conteúdo**.
3. Os nomes ficam distribuídos sobre uma única linha, com início levemente deslocado para a esquerda e espaçamento equilibrado — sem pílulas e sem aparência centralizada em excesso.
4. Inserir um respiro claro entre essa faixa e o cartão de mídia/texto.
5. Restaurar o cartão anterior com largura limitada, duas metades equivalentes no desktop, borda nos quatro lados e cantos arredondados; no celular, preservar o empilhamento original entre mídia e texto.
6. Manter os controles de reprodução e ampliação sobre a mídia sem alterar a hierarquia do texto ou descaracterizar o cartão restaurado.

## Temporizador contínuo

- Usar uma única linha-base para representar o ciclo completo das cinco funcionalidades, dividida logicamente em cinco segmentos iguais de 15 segundos.
- Ao concluir **M&AI**, seu trecho permanece iluminado enquanto o progresso avança por **QUARPX®**; o mesmo comportamento cumulativo segue até **Conteúdo**.
- Ao final de **Conteúdo**, iniciar um novo ciclo: a linha retorna suavemente ao começo e M&AI volta a ser exibido.
- Ao clicar em qualquer nome, trocar imediatamente a mídia e o texto, mas animar o indicador da posição atual até o início do segmento escolhido, evitando saltos visuais bruscos tanto para frente quanto para trás.
- Depois do reposicionamento, começar a contagem de 15 segundos da funcionalidade selecionada e continuar o avanço cumulativo a partir dela.
- Manter a iluminação já percorrida como uma faixa contínua; o ponto de avanço recebe núcleo e halo suaves com os mesmos papéis visuais usados em “O Ciclo”.
- Preservar pausa quando a seção estiver fora da tela, durante interação do usuário e enquanto o modal estiver aberto.
- O temporizador da navegação continua independente do progresso circular da mídia.
- Com redução de movimento ativada, reposicionar sem transição e indicar claramente o progresso e a opção ativa.

## Comportamentos preservados

- Cada mídia inicia uma vez quando sua funcionalidade é selecionada, sem loop.
- Play após o término reinicia a mídia; play/pause e o anel circular continuam sincronizados à mídia.
- O modal mantém maximizar/reduzir, nome, título, texto, setas anterior/próxima, fechamento acessível e sincronização com a seleção da página.
- A animação neural permanece arquivada, inativa e preservada para possível retomada.
- “O Ciclo” não recebe alterações visuais nem funcionais.

## Revisão de acabamento

- Ajustar alinhamentos, respiros, alturas, bordas e contraste usando somente as fontes, cores e tokens existentes da Maiq.
- Garantir que a faixa de nomes e a linha não encostem nem compartilhem borda com o cartão.
- Em telas estreitas, manter os nomes em uma linha com rolagem horizontal discreta e sincronizar automaticamente a opção ativa na área visível.
- Conferir estados ativo, inativo, hover e foco nos temas noturno e diurno.

## Verificação

- Comparar o cartão normal com a composição anterior para confirmar proporções, cantos, borda e distribuição entre mídia e texto.
- Testar o avanço automático completo de M&AI até Conteúdo e o reinício do ciclo.
- Testar cliques para frente e para trás, confirmando o reposicionamento suave e a retomada correta dos 15 segundos.
- Testar play, pause, replay, maximização e navegação dentro do modal sem interferência entre os dois temporizadores.
- Validar desktop e celular, temas noturno e diurno, navegação por teclado e redução de movimento.
- Confirmar ausência de sobreposições, quebras visuais e erros na página.
