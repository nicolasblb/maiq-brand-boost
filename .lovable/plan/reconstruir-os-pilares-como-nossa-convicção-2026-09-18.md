# Reconstruir “Os Pilares” como “Nossa Convicção”

## Objetivo
Substituir o conteúdo provisório da seção atual por uma apresentação editorial seguida da animação “Valor na mesa”, mantendo a linguagem visual Maiq e reproduzindo fielmente a referência enviada.

## Conteúdo e composição
- Alterar o título visível da seção de **“Os Pilares”** para **“Nossa Convicção”** e alinhar também seu nome no menu de seções.
- Reproduzir exatamente os textos do anexo:
  - Destaque: **“A empresa que só cresce de forma orgânica pode estar limitando o próprio futuro.”**
  - Corpo: **“Se feita da maneira correta, como disciplina contínua, um M&A pode criar valor incomparável e acelerar o caminho de uma companhia. Com uma combinação de negócios, uma média empresa pode incorporar competências que levariam décadas para serem construídas internamente. Para isso, organização e método para reduzir incertezas é fator fundamental.”**
- Manter essa hierarquia: título da seção, frase em destaque, texto explicativo e, abaixo, a animação completa.
- Usar exclusivamente a tipografia, os pesos, espaçamentos, raios, bordas e tokens semânticos já existentes no design Maiq; a imagem será apenas referência, não será exibida no site.
- Preservar a leitura ampla no desktop e reorganizar os elementos de forma legível no celular, sem cortar textos, gráficos ou controles.

## Animação “Valor na mesa”
- Converter o conteúdo dos ZIPs para um componente React nativo, sem incorporar o runtime exportado, os Reacts auxiliares ou a fonte externa dos arquivos.
- Preservar os três momentos visuais incluídos na timeline: comparação de crescimento, evolução anual/valor não capturado e dimensões do negócio.
- Manter a duração original de **20,5 segundos**, os dados, transições, movimentos de câmera e cálculos presentes em `Cena.dc.html`.
- Usar a versão **escura no modo noite** e a versão **clara no modo dia**, trocando as cores imediatamente quando o tema do site mudar, sem reiniciar a posição da animação.
- Adaptar o quadro original 1920×1080 proporcionalmente ao espaço disponível, preservando todo o conteúdo e evitando distorções ou recortes.

## Controles e reprodução
- Reutilizar a linguagem do controle de mídia da seção “A Plataforma”: botão circular de **play/pause** com progresso ao redor.
- Adicionar, ao lado, comandos iconográficos para **recuar 5 segundos** e **avançar 5 segundos**, com rótulos acessíveis e tooltips.
- Limitar os saltos entre 0 e 20,5 segundos, atualizando de forma sincronizada o quadro e o progresso circular.
- Iniciar a animação quando a seção entrar em exibição, reproduzi-la uma vez e parar no final; ao apertar play após o término, reiniciar desde o começo.
- Pausar o relógio quando a seção sair da tela e continuar do mesmo ponto ao retornar, sem afetar o estado escolhido pelo usuário.
- Em preferência de movimento reduzido, iniciar pausada e permitir navegação manual pelos controles.

## Estrutura técnica
- Criar um componente isolado para a seção e outro para a cena animada, mantendo a página principal enxuta.
- Centralizar o relógio da animação em uma única fonte de tempo via `requestAnimationFrame`, evitando saltos e divergência entre controles e quadros.
- Reaproveitar o componente de botão Maiq e os tokens de tema existentes; novos valores visuais entrarão como tokens semânticos, não como cores soltas no componente.
- Não copiar os arquivos auxiliares `support.js` e `vendor/react*.js`; eles servem apenas como referência da exportação.

## Validação
- Conferir a fidelidade textual palavra por palavra com o anexo.
- Testar início, pausa, retomada, replay e saltos de ±5 segundos, inclusive nos limites da timeline.
- Verificar a troca noite/dia durante a reprodução sem perda do tempo atual.
- Validar desktop e celular, incluindo ausência de cortes, sobreposições, erros no console e regressões de desempenho.
