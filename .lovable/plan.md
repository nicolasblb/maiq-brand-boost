# Corrigir “Nossa Convicção” com a mesma arquitetura da Diligência

## Diagnóstico confirmado
- A animação de **Diligência** não é um vídeo: ela é um componente React nativo, portado de um arquivo JSX próprio para animação.
- A seção “A Plataforma” mantém um único relógio externo e envia o tempo atual para a cena. Por isso play, pause, retomada e progresso permanecem sincronizados e fluidos.
- Os ZIPs de “Valor na mesa” usam outro formato: HTML declarativo proprietário (`.dc.html`), um interpretador (`support.js`) e uma versão antiga isolada de React. A implementação atual tentou traduzir esse formato manualmente; isso alterou geometria, camadas, valores e efeitos.

## Melhor caminho
- Solicitar a exportação da animação no **mesmo formato-fonte da Diligência: React/JSX ou TSX**, contendo:
  - o componente completo da cena;
  - os cálculos e valores originais;
  - a timeline baseada em um tempo recebido por propriedade;
  - eventuais imagens, fontes ou arquivos auxiliares usados pela cena;
  - uma versão por tema ou uma propriedade `theme` para alternar as cores.
- Se a ferramenta oferecer opções, preferir uma exportação “React component”, “JSX source” ou equivalente, sem empacotar React dentro do arquivo e sem barra de reprodução própria.
- Manter 1920×1080 como área de composição e 20,5 segundos como duração original.

## Integração
- Remover a reconstrução visual atual de `ConvictionScene` e portar o JSX original sem redesenhar seus elementos.
- Reutilizar exatamente o padrão da Diligência:
  - relógio externo único;
  - `time`, `playing` e sinal de reinício enviados à cena;
  - pausa fora da tela;
  - reprodução única e replay ao final;
  - progresso circular derivado do mesmo tempo;
  - saltos de ±5 segundos aplicados ao relógio central.
- Conservar os textos e a composição editorial já aprovados acima da animação.
- Alternar a paleta clara/escura sem reiniciar o tempo atual.
- Manter o enquadramento proporcional em desktop e celular, sem reinterpretar posições internas.

## Riscos e alternativas
- **React/JSX original — recomendado:** menor risco de divergência visual e melhor controle pelo site. O risco residual é alguma dependência não incluída na exportação ou uma fonte ausente; isso será identificado antes da integração.
- **MP4 por tema:** fidelidade visual absoluta e integração simples, mas perde nitidez vetorial, pode pesar mais e exige dois arquivos. Ainda permite play/pause, ±5s e progresso nativos do site.
- **HTML atual em iframe:** preserva o interpretador original, porém traz mais risco de carregamento, conflito com versões antigas, acessibilidade, comunicação dos controles e manutenção. Não é a opção recomendada para produção.
- **Lottie:** somente usar se a ferramenta confirmar que todos os efeitos e textos são preservados na exportação.

## Validação
- Comparar quadros-chave em 0s, 5s, 10s, 15s e 20,5s com a exportação original, nos dois temas.
- Conferir valores, alinhamentos, sobreposições e movimentos sem aproximações visuais.
- Testar play, pause, retomada, replay, ±5s, mudança de tema e pausa fora da tela.
- Validar desktop e celular, desempenho, ausência de erros e sincronização do progresso.

## Dependência para executar
Precisamos receber primeiro a exportação **React/JSX ou TSX original**, equivalente à usada na Diligência. Se essa opção não existir na ferramenta, o próximo formato recomendado é **MP4 H.264, 1920×1080, sem controles incorporados, um arquivo claro e outro escuro**.
