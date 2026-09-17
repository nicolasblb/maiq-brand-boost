# Refinar “A Plataforma” e “O Ciclo”

## Resultado esperado

- Retirar a rede neural animada do fundo compartilhado por “A Plataforma” e “O Ciclo”, deixando essas áreas com o fundo limpo dos temas Maiq.
- Preservar integralmente o código da rede neural em um arquivo isolado e documentado como recurso temporariamente desativado, pronto para ser retomado ou excluído após sua confirmação.
- Substituir as cinco pílulas de “A Plataforma” por uma navegação horizontal de texto acima de uma linha contínua, seguindo a referência enviada.
- Manter cada funcionalidade clicável e o ciclo automático atual de 15 segundos.
- Fazer o trecho correspondente à opção ativa percorrer a linha com um núcleo luminoso e halo suave, usando a mesma linguagem visual da animação de fluxo de “O Ciclo”.
- Preparar cada funcionalidade para receber seu próprio vídeo, com reprodução única, controle circular de reprodução e visualização ampliada.

## Comportamento da nova navegação

1. Os nomes **M&AI**, **QUARPX®**, **Teses**, **Diligência** e **Conteúdo** ficam distribuídos acima de uma única linha-base.
2. A opção ativa recebe maior contraste no texto; as demais permanecem discretas, mas clicáveis.
3. Durante os 15 segundos de exibição, uma linha luminosa progride pelo segmento da opção ativa.
4. Ao completar o segmento, o conteúdo avança para a próxima funcionalidade e o progresso reinicia nela.
5. Um clique troca imediatamente o conteúdo e reinicia o temporizador na opção escolhida.
6. O temporizador continua pausando enquanto o usuário mantém o ponteiro sobre a navegação ou o conteúdo, e quando a seção sai da tela.
7. Em telas estreitas, os nomes permanecem em uma única linha com rolagem horizontal discreta, evitando pílulas, quebras ou sobreposição.
8. Com redução de movimento ativada, não haverá varredura animada; apenas a opção ativa e seu segmento serão destacados.
9. O avanço entre funcionalidades permanece fixo em **15 segundos**, independentemente da duração do vídeo.

## Vídeos e controles

- Organizar as cinco funcionalidades em uma configuração única com nome, título, texto e mídia, facilitando substituir as animações provisórias pelos vídeos finais quando forem entregues.
- Adaptar a animação atual de Due Diligence ao mesmo contrato de reprodução dos futuros vídeos; as demais mídias existentes permanecem como provisórias até a entrega dos arquivos.
- Sempre que uma funcionalidade entrar em exibição, sua mídia começa do início e roda **uma única vez**, sem loop.
- No canto inferior esquerdo da mídia, incluir um botão de **play/pause** com um anel de progresso ao redor do ícone, sincronizado ao tempo da mídia — separado da linha de 15 segundos da navegação.
- Se a mídia já tiver terminado, pressionar play reinicia sua reprodução desde o começo; durante pausa, troca de aba ou saída da tela, nenhum tempo continua avançando em segundo plano.
- Incluir um botão de **maximizar** no canto oposto, abrindo uma visualização ampliada acessível sobre a página.
- Na visualização ampliada, mostrar a mídia, o nome da funcionalidade, título e texto, mantendo o play/pause com progresso e trocando maximizar por **reduzir/fechar**.
- Adicionar setas anterior/próxima no modo ampliado para navegar entre as cinco funcionalidades; a troca atualiza também a seleção e o conteúdo na página de fundo.
- Enquanto a visualização ampliada estiver aberta, pausar o avanço automático de 15 segundos para evitar trocas inesperadas; ao fechar, reiniciar a contagem da funcionalidade exibida.
- Permitir fechar com o botão de reduzir, tecla Escape e clique na área externa, com foco de teclado contido corretamente no modal.

## Preservação da rede neural

- Extrair o motor atual do canvas para um módulo próprio, sem carregá-lo nem executá-lo na página.
- Remover somente sua montagem, inicialização, observadores e referências da experiência visível.
- Registrar no contexto do projeto que esse módulo está **arquivado temporariamente para possível retomada** e não deve ser removido até nova decisão.
- Manter os tokens específicos necessários junto ao módulo preservado, sem deixar processamento ou elementos invisíveis ativos no navegador.

## Implementação

- Ajustar `PaginaInstitucional.tsx` para retirar o canvas e sua inicialização, simplificar o bloco compartilhado e trocar os controles da Plataforma.
- Criar um arquivo dedicado para guardar a implementação neural atual de forma reutilizável e claramente desativada.
- Atualizar `maiq.css` com os estilos da linha contínua, estados ativo/inativo, foco, rolagem móvel e animação do progresso luminoso.
- Reutilizar os papéis visuais de `--c-flow` e `--c-flow-core` empregados em “O Ciclo”, com equivalentes corretos nos temas noturno e diurno; o halo seguirá a mesma composição de brilho radial, adaptada para uma linha horizontal.
- Trocar o encerramento do temporizador do antigo contorno SVG pelo término da nova animação de progresso, preservando conteúdo, ordem e duração atuais.
- Evoluir o reprodutor da animação de Due Diligence para expor estado, duração, progresso, play, pause, reinício e término sem loop; usar a mesma interface para os vídeos futuros.
- Criar controles Maiq reutilizáveis para reprodução, progresso circular, maximizar/reduzir e navegação anterior/próxima, com rótulos acessíveis e sem introduzir novas fontes ou outra linguagem visual.
- Criar o modal ampliado dentro do tema ativo, preservando a proporção da mídia e reorganizando texto e controles para desktop e celular.

## Verificação

- Confirmar que nenhum canvas, laço de animação ou observador da rede neural é criado na página.
- Testar clique, avanço automático, pausa por interação e reinício do temporizador nas cinco funcionalidades.
- Testar reprodução única, pausa, retomada, replay após o término e progresso circular da mídia.
- Testar abertura, navegação por setas, redução/fechamento e sincronização entre modal e seção.
- Conferir alinhamento, legibilidade e ausência de sobreposição em desktop e celular.
- Validar os temas noturno e diurno e a preferência de redução de movimento.
- Confirmar que “O Ciclo” continua funcionando sem alterações visuais ou comportamentais.
- Verificar ausência de erros e registrar o recurso neural preservado no acompanhamento geral do projeto.
