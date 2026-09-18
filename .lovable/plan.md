# Exibir “Valor na mesa” como vídeo na seção “Nossa Convicção”

## O que foi recebido
Dois vídeos H.264, 1920×1080, 30 fps, 20,5 segundos, cerca de 1,4 MB cada: uma versão clara e uma escura. É o formato de fallback previsto no plano anterior e garante fidelidade total à animação original.

## O que muda
- Substituir a reconstrução atual da cena (desenhada manualmente em código) pelo vídeo original.
- Exibir a versão escura no modo noite e a clara no modo dia, trocando no mesmo instante em que o tema muda, sem reiniciar o tempo da reprodução.
- Manter os textos e a composição editorial já aprovados acima da animação.

## Controles
- Mesmo botão circular de play/pause da seção “A Plataforma”, com o anel de progresso ao redor acompanhando o tempo real do vídeo.
- Botões de recuar 5 segundos e avançar 5 segundos, com rótulos acessíveis, limitados entre 0 e 20,5 segundos.
- A animação começa quando a seção aparece na tela, roda uma vez e para no fim; apertar play depois disso reinicia do começo.
- Sai da tela: pausa; volta: continua do mesmo ponto.
- Em preferência de movimento reduzido, inicia pausada.
- Sem som, sem barra de controles nativa do navegador.

## Enquadramento
- Área 16/9 responsiva, ocupando a largura disponível sem cortes nem distorção, em desktop e celular.
- Cantos, bordas e espaçamentos seguindo os tokens visuais já usados na seção.

## Detalhes técnicos
- Publicar os dois arquivos como assets de CDN (`lovable-assets`), com ponteiros `.asset.json` em `src/assets/`; os binários não entram no repositório.
- Reescrever `src/components/maiq/ConvictionScene.tsx`: dois elementos `<video>` (claro e escuro) pré-carregados, `muted`, `playsInline`, `preload="auto"`, sem `controls`; apenas o do tema ativo fica visível, e o outro é sincronizado por `currentTime` na troca de tema.
- Estado de reprodução derivado de `timeupdate`/`requestAnimationFrame` do vídeo ativo, alimentando o anel de progresso e os saltos de ±5 s.
- Detectar o tema pelo mesmo atributo já usado no restante da página; `IntersectionObserver` para pausar fora da tela.
- Remover de `src/maiq.css` os estilos da cena vetorial antiga (`.maiq-conviction-svg` e derivados), mantendo os estilos de layout, player e controles.
- `poster` a partir do primeiro quadro de cada versão para evitar área vazia no carregamento.

## Validação
- Comparar 0 s, 5 s, 10 s, 15 s e 20,5 s com os arquivos originais, nos dois temas.
- Testar play, pause, retomada, replay, ±5 s, troca de tema durante a reprodução e pausa fora da tela.
- Validar desktop e celular, desempenho e ausência de erros no console.
