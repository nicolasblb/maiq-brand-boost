# Tela cheia orientada naturalmente em mobile e tablet

## Resultado esperado
- Em celular e tablet na vertical, os três conteúdos abrem ocupando a tela no enquadramento vertical, sem rotação artificial.
- Uma indicação discreta com ícone e “Gire o aparelho” permanece visível enquanto a tela cheia estiver aberta na vertical.
- Ao girar fisicamente o aparelho para a horizontal, a composição responde à nova orientação e passa ao enquadramento horizontal já existente.
- Ao voltar para a vertical, retorna imediatamente ao enquadramento vertical, sem fechar a tela cheia nem reiniciar vídeos ou animações.
- Desktop permanece inalterado.

## Ajustes por seção

### Nossa Convicção
- Remover a rotação de 90° no modo retrato.
- Manter o vídeo 16:9 inteiro e centralizado dentro da tela vertical, com controles acessíveis e sem cortes.
- Preservar tempo, play/pause, saltos de 5 segundos e troca de tema durante mudanças de orientação.

### Nossa Plataforma
- Em retrato, usar a composição vertical: vídeo inteiro na área superior e conteúdo textual abaixo, com rolagem apenas no texto quando necessário.
- Em paisagem, manter vídeo e conteúdo lado a lado, aproveitando toda a largura disponível.
- Preservar reprodução, progresso, troca entre funcionalidades e retorno ao cartão sem saltos.

### Nossa Perspectiva
- Em retrato, mostrar o fluxo completo sem girar a interface; dimensionar o diagrama pela área vertical e manter arraste horizontal quando a escala mínima exigir.
- Em paisagem, manter o fluxo na composição horizontal de borda a borda.
- Adicionar a mesma indicação permanente de rotação usada nas duas seções de vídeo.

## Padronização visual e comportamento
- Unificar o ícone, texto, posição, contraste e espaçamento da indicação nos três modos de tela cheia.
- Exibir a indicação somente em mobile/tablet na vertical; ocultá-la imediatamente em paisagem e em desktop.
- Respeitar áreas seguras do navegador e do aparelho, sem sobrepor controles, botão de fechar ou conteúdo.
- Substituir a lógica atual de dica temporária/uma vez por sessão por presença contínua condicionada à orientação.

## Detalhes técnicos
- Revisar os componentes de Convicção, Plataforma e Perspectiva e suas regras responsivas em `src/maiq.css`.
- Remover as transformações `rotate(90deg)` aplicadas aos modais em retrato e adotar layouts específicos para retrato até o limite de tablet.
- Usar media queries de orientação para a recomposição automática, sem `screen.orientation.lock()` e sem bloquear a rotação do navegador.
- Recalcular o encaixe do fluxo quando a viewport mudar de orientação, aproveitando o listener de redimensionamento existente.
- Registrar o ajuste concluído no roadmap do projeto.

## Validação
- Testar celular e tablet em retrato e paisagem, inclusive girando com cada tela cheia já aberta.
- Validar os três conteúdos nos temas noite e dia.
- Conferir ausência de cortes, linhas finas nas bordas, sobreposição da indicação e conteúdo inacessível.
- Exercitar controles dos vídeos, navegação da Plataforma, arraste do fluxo e fechamento/reabertura.
- Fazer uma passagem final em desktop para confirmar que o comportamento atual não mudou, além de verificar erros visuais e de execução.
