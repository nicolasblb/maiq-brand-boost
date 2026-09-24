# Roadmap

- [x] Remover a mensagem informativa do login e reequilibrar seu espaçamento vertical.
- [x] Criar o FAQ após “O Domínio” com cinco acordeões.
- [x] Preservar exclusivamente as fontes e a identidade visual existentes da Maiq.
- [x] Validar o login e o FAQ em desktop e celular, nos temas noturno e diurno.
- [x] Arquivar a animação neural para possível retomada e removê-la da experiência visível.
- [x] Trocar as pílulas da Plataforma por navegação textual com linha luminosa de 15 segundos.
- [x] Adicionar reprodução única, progresso, ampliar/reduzir e navegação entre funcionalidades.
- [x] Restaurar o cartão independente da Plataforma e implementar o temporizador contínuo cumulativo.
- [x] Refinar alinhamento, fades e áreas de pausa da navegação da Plataforma.
- [x] Corrigir e validar os temporizadores de mídia e de troca automática em 15 segundos.
- [x] Centralizar a navegação, integrar divisórias luminosas e reforçar os estados das funcionalidades.
- [x] Sincronizar o indicador circular com o progresso real da mídia, inclusive após pausar e retomar.
- [x] Refinar a pílula ativa, preencher as divisórias e unificar o relógio fluido das cinco mídias.
- [x] Tornar as divisórias opacas e substituir os fundos animados por degradês verticais nos dois temas.
- [x] Alinhar a tipografia e o botão do FAQ ao design Maiq e remover os textos introdutórios.
- [x] Reconstruir “Os Pilares” como “Nossa Convicção” — agora exibindo os vídeos originais “Valor na mesa” (claro/escuro, 20,5s) com play/pause, ±5s e troca de tema sem reiniciar.
- [x] Restaurar o subtítulo do FAQ: "Respostas às perguntas frequentes sobre a atuação do Maiq".
- [x] Remover a seção "O Domínio" da página institucional, preservando Dominio.tsx e as logos (logo-*.asset.json) para a futura página Sobre nós > Domínios.
- [x] Construir a seção “Nosso Time” com subtítulo e carrossel das empresas onde os especialistas tiveram experiência.
- [ ] Decidir destino da animação neural arquivada (src/components/maiq/archived/plat-neural-animation.ts.disabled): retomar ou excluir.
- [x] Rodapé com colunas Contato e Legal + páginas /politica-de-privacidade e /termos-de-uso (textos definitivos pendentes).
- [x] FAQ + rodapé ocupando a altura da tela, com espaçamento inferior reduzido.
- [x] Ícones nas raias de "O Ciclo" (Estratégia, Originação, Execução, Efetivação).
- [x] Vídeo de "Nossa Convicção": pausa no ponto atual, retoma dali e roda em loop.
- [ ] Receber e publicar os textos definitivos da Política de Privacidade e dos Termos de Uso.
- [x] Restaurar a barra luminosa anterior, manter o avanço estável e remover o brilho frontal adicional.
- [x] Corrigir o carregamento inicial com esqueleto visível e impedir a rolagem automática até “A Plataforma”.
- [x] Refinar o carregamento com a logo, reduzir o vídeo da Convicção, restaurar os brilhos da Plataforma e corrigir a transição entre blocos.
- [x] Atualizar os vídeos da Convicção, adicionar ampliar/reduzir e corrigir o corte da logo do menu em telas menores.
- [x] Brilho nos círculos do hover do Nosso modelo (estilo divisórios da Plataforma) + correção da geometria que não era medida (setupDna)
- [x] Quebras de linha nos sub-headers: Nosso modelo (antes de "potencializada") e Nossa Convicção (após "orgânica")
- [x] Texto da Convicção em 3 parágrafos com contêiner e fio lateral
- [x] Fade nas extremidades do fio lateral do texto da Convicção
- [x] "A Plataforma" vira "Nossa Plataforma" com header/sub-header centralizados
- [x] Funcionalidades reduzidas a 4 (IA para M&A, Teses de Investimento, Etapas do M&A, Virtual Data Room) com tópicos em lista no cartão e no modal
- [x] Centralizar o cabeçalho de “O Ciclo”, simplificar as raias, ampliar os pontilhados e habilitar rolagem horizontal limpa em telas menores.
- [x] Refinar “O Ciclo” com quebras de título, divisórias com fade e indicador arrastável de progresso horizontal.
- [x] Alinhar os pontilhados de “O Ciclo”, trocar o indicador por arraste direto e recortar o fluxo na divisória das raias.
- [x] Exibir a mão do fluxo apenas quando houver corte horizontal e reorganizar Convicção, Plataforma, Ciclo, Domínios e FAQ em camadas sucessivas de revelação.
- [x] Restaurar os números animados do Modelo, corrigir os recuos sob o menu, unificar o fundo de Ciclo/Domínios e revisar os destinos de Home.
- [x] Manter Plataforma e FAQ abaixo do menu e padronizar quinas, contorno e sombra dos blocos sobrepostos.
- [x] Restaurar o ponto luminoso da linha “Integrações” e atualizar o sub-header de “O M&A”.
- [x] Renomear “O M&A” para “Nossa Perspectiva” e centralizar os rótulos das raias com seus pontilhados.
- [x] Tornar os sub-headers responsivos e ajustar suas quebras de linha por seção.
- [x] Recalibrar os sub-headers para 40%, manter o Hero em 60% e estabilizar as quebras condicionais.
- [x] Corrigir “Nosso Modelo” e reequilibrar verticalmente as seções “Nossa Plataforma” e “Nosso Time”.
- [x] Refinar sub-headers e contornos com a nova paleta, simplificar “Sobre nós” e compactar “Nosso Time” como faixa.

## Nosso Time — carrossel de logos (22/09)
- [x] Logo Banco ABC: segunda logo "ABC PERSONAL" removida; apenas a logo quadrada, reenquadrada (`logo-abc-brasil.png`)
- [x] Logo Thomson Reuters: substituída pela nova marca horizontal enviada, recortada em transparência e reenquadrada (42px desktop / 35px mobile)
- [x] Janela do carrossel reduzida em 25% (`.maiq-team-marquee` width 75%)
- [x] Uniformizar o menu entre Home e Insights, remover Planos e corrigir os estados de hover.
- [x] Corrigir a quina superior do bloco Nossa Perspectiva + Nosso Time.
- [x] Substituir a Thomson Reuters pela nova marca horizontal enviada.
- [x] Restaurar a animação dos números na base de “Nosso Modelo”.
- [x] Fixar FAQ + rodapé em uma tela e adicionar rolagem local às perguntas.
- [x] Restaurar o odômetro do Nosso Modelo por dígito, reversível e orientado pela posição da seção na tela.
- [x] Destacar as subopções de Home, alinhar seus destinos ao topo e concluir o odômetro quando Nosso Modelo alcança o topo.

## Header responsivo e tema noturno sem Areia Nobre (22/09)
- [x] Adicionar breakpoint estrutural único em 1024px ao `SiteHeader`: abaixo dele, `<nav>`
      completo e a pílula CTA completa somem, substituídos por um gatilho de ícone único
      (menu compacto, `NavDropdown` estendido para abrir por clique) e o toggle de tema
      embutido — eliminando a sobreposição entre logo, menu e toggle entre 640–1024px.
- [x] Em ≤430px, "Entrar"/"Conta" e "Fale Conosco" saem da pílula CTA (que some) e entram
      como primeiros itens do menu compacto, com separador antes das seções.
- [x] Aplicar `box-shadow: var(--glow-focus)` em `:focus-visible` no gatilho do menu e nos
      dois toggles de tema (grande e compacto) — token já existia e não era usado em lugar
      nenhum.
- [x] Remover Areia Nobre do tema **noturno** (14 tokens `--p-*` + 9 tokens semânticos
      `--action-*`/`--text-primary`/`--highlight`/`--link` em `src/maiq.css`, bloco padrão
      `[data-maiq-scope]`): headings, CTA e chips agora usam branco/menta no escuro. Tema
      claro **não foi tocado** (byte a byte igual, incluindo a pendência de `--p-muted` abaixo).

## Ajustes pontuais de scroll e vôo da logo (23/09)
- [x] FAQ nascia com o primeiro item expandido (`useState(0)` em `Faq.tsx`) — agora nasce com
      tudo fechado (`useState(-1)`).
- [x] Passar o mouse sobre a lista do FAQ travava o scroll geral da página ao chegar no limite
      local: `.maiq-faq-list` tinha `overscroll-behavior:contain`; trocado para `auto`, que
      encadeia o scroll para a página quando o local se esgota.
- [x] Em "Nossa Perspectiva", quando o diagrama fica `overflow-x:auto`/`overflow-y:hidden`
      (não cabe na largura), o navegador redireciona sozinho o wheel vertical para scroll
      horizontal e não repassa para a página — travando o scroll geral com o mouse sobre a
      seção. Adicionado listener de `wheel` em `Ciclo.tsx` (só quando `data-scrollable="true"`)
      que deixa gestos horizontais tocarem o diagrama e repassa gestos verticais para a página.
- [x] Vôo da logo (hero → header) aparecia duplicado ("mmaiqc") durante boa parte do vôo, não
      só por uma fração de segundo — reproduzido e confirmado com Playwright (script + captura
      de tela em `scrollY` fixo). Causa real: posição/escala (`e`, interpolada de `pf`) e o
      crossfade de opacidade usavam a mesma curva de progresso `pf`; a logo voando só chegava
      **exatamente** sobre a posição do header quando `pf=1`, mas o crossfade de opacidade já
      começava em `pf=0.75` (antes, `pf=0.9`) — nesse intervalo as duas apareciam parcialmente
      opacas e ainda **deslocadas ~15-20px** uma da outra. A primeira tentativa (alongar a
      janela do crossfade) piorou o problema, pois manteve as duas visíveis por mais tempo sem
      corrigir o deslocamento. Corrigido de fato desacoplando as curvas: posição/escala agora
      usa uma progressão remapeada que termina de convergir em `pf=0.7` (antes do crossfade de
      opacidade começar), então quando a opacidade troca (`pf` 0.85→1) as duas já
      coincidem exatamente — dissolve limpo, sem deslocamento. Verificado via instrumentação
      (rect idêntico de `fly` e `mark` durante toda a janela de crossfade) e captura de tela.

## Páginas legais — Fase 3 (auditoria LGPD), achados pendentes (23/09)
Auditoria de `security` sobre as três páginas legais publicadas. Nenhuma correção aplicada —
decisões registradas abaixo, uma por uma, no Portão 2.

- [x] **Alto — Política de Privacidade não cobria a coleta de leads.** Corrigido em
      `politica-de-privacidade.tsx`: escopo da Introdução estendido a "visitantes e potenciais
      clientes"; nova linha na tabela de Finalidades/Base Legal ("Atendimento a solicitações de
      contato comercial (leads)" — Art. 7º, V, procedimento preliminar a contrato); novo critério
      de retenção para leads não convertidos (24 meses do último contato). Texto aprovado pelo
      usuário antes de aplicar. `tsc`/lint/build limpos.
- [ ] **Médio — Política de Cookies descreve "cookie de sessão" que não existe.** A sessão do
      Supabase fica em `localStorage` (`brokeredPreviewStorage`), não em cookie; o aviso
      "bloquear cookies impede o login" é factualmente incorreto. **Deixado para depois.**
- [ ] **Médio — Google Fonts não é citado em nenhum documento.** Recebe IP/user-agent de todo
      visitante (`fonts.googleapis.com`/`fonts.gstatic.com`, ver `__root.tsx`). Opções levantadas:
      nomear o fornecedor no texto, ou hospedar as fontes localmente (resolve na raiz e ajuda
      performance). **Deixado para depois — nenhuma das duas escolhida ainda.**
- [ ] **Médio — Contradição entre os dois documentos sobre Analytics.** A Política de
      Privacidade cita "Google Analytics ou similar" na lista de compartilhamento (seção 4);
      a de Cookies trata analytics como hipótese futura ainda não ativa. **Deixado para depois**
      (junto com as correções factuais simples abaixo).
- [ ] **Médio — Upsert de leads sobrescreve o histórico sem prazo de retenção declarado.**
      Cada novo contato do mesmo e-mail sobrescreve nome/telefone/mensagem anteriores
      (`leads.functions.ts`, `onConflict: 'normalized_email'`); nenhuma regra de expurgo para
      leads que nunca converteram. **Deixado para depois.**
- [ ] **Baixos — deixados para depois:** sem aviso/link para a política no modal "Fale Conosco";
      sem procedimento documentado para atender pedido de direitos sobre um lead; a seção de
      Segurança promete "autenticação multifator" que o login atual não tem; "aceite por
      navegação" é questão jurídica a sinalizar; redirects usam 307 em vez de 301 e falta
      `sitemap.xml`.

**Confirmado pela auditoria (não é achado):** o site não tem nenhum rastreamento real
(verificado via grep por Analytics/pixels/tags em `src/`, `public/`, `vite.config.ts`,
`package.json`) — a redação condicional da Política de Cookies para categorias futuras está
correta. RLS da `leads`, segredos fora do `.env` versionado e e-mail de contato consistentes
em todo o site também confirmados.

## Páginas legais — Fase 2 do /feature concluída (23/09)
- [x] `LegalPage.tsx` reescrito: recebe `sections` estruturadas (parágrafo, lista, tabela) em vez
      de `children` livre; usa `SiteHeader`/`SiteFooter`/`useMaiqTheme`, link "← Voltar" e o mesmo
      padrão de navegação com `state.secao` já usado pelo Insights para voltar a uma seção da Home.
- [x] `/politica-de-privacidade` e `/termos-de-uso`: conteúdo real e completo (11 e 12 seções),
      texto literal de `docs/conteudo-legal-atual.md` com os três ajustes editoriais decididos
      ("MAIQ"→"Maiq", foro padronizado para "Comarca do Rio de Janeiro - RJ", data 27/03/2026).
      Conferido item a item contra a fonte.
- [x] `/politica-de-cookies` — página nova, texto escrito nesta rodada: cookies em uso hoje
      (sessão Supabase, preferência de tema) e categorias futuras redigidas no condicional, sem
      banner de consentimento (decisão já registrada na spec).
- [x] Tabela "Finalidades e Base Legal": `<table>` real em `maiq.css`, vira cartões só por CSS
      abaixo de 640px (`thead` em `sr-only`, rótulos via `data-label`). Testado em 360px sem
      rolagem horizontal.
- [x] Redirects `/privacy-policy` → `/politica-de-privacidade` e `/terms-of-use` → `/termos-de-uso`
      via `redirect()` no `beforeLoad` (rota no próprio projeto, não 301 de servidor).
- [x] `SiteFooter`: link de cookies passou de `<a href>` para `<Link>`, agora que a rota existe.
- [x] Verificado: `tsc`, `lint` (arquivos tocados) e `build` limpos; smoke test via Playwright nas
      5 rotas (200 e redirects corretos) e captura de tela nos dois temas e em 360px.
- **Nota de execução:** o agente que implementou foi interrompido por limite de sessão durante a
  própria checagem final (depois de já ter concluído a implementação) — toda a verificação acima
  foi refeita de forma independente antes de considerar a fase encerrada.
- [ ] Falta a Fase 3 do `/feature` (`testing` + `security` em paralelo) antes do Portão 2.

## Mobile de "Nossa Perspectiva" — pendência aberta (23/09)
- [ ] O diagrama de raias (`sections/Ciclo.tsx`) não tem tratamento dedicado para mobile hoje —
      só o scroll horizontal do próprio SVG quando não cabe. Decisão (23/09): tratar depois, em
      rodada própria (provavelmente via `/design`, por ser uma decisão de UX nova). Direção
      ainda em aberto — usuário quer ver alternativas quando chegar a hora, não só a ideia
      inicial de "nomes das raias + ícone que abre o fluxo na diagonal".

## Acessibilidade — pendência aberta (22/09)
- [ ] **Contraste de `--p-muted` no tema claro reprova no AA.** `#8A6038` sobre `#EEE0D4` dá
      **4,26:1**, abaixo do mínimo de 4,5:1 para texto normal (verificado pela fórmula WCAG).
      Afeta todo o tema claro, não só as páginas legais: itens de menu do cabeçalho (14px),
      linha de versão das legais (15px), rótulos de métricas e demais usos de `--p-muted`.
      Decisão no Portão 1: tratar depois, numa revisão própria do tema claro.
      Candidato de correção: `#7A5432` (5,17:1), o tom mais próximo que passa.

## Página "Sobre nós", fim de "Nosso Time" e responsividade vertical (23/09)
`/feature` completo (ADR `docs/adr/0002-sobre-nos-nosso-time-e-responsividade-vertical.md`),
Fase 2 (`code-quality`) em 4 etapas sequenciais, cada uma verificada de forma independente
(tsc/eslint/build + Playwright, já que os agentes desta rodada não têm ferramenta de browser).
- [x] **Tokens semânticos corrigidos.** A camada `--bg-page/--text-*/--surface-*/--action-*` de
      `maiq.css` (até então só usada por `MaiqButton`) tinha valores divergentes do handoff
      "Página - Origem do nome Maiq"; corrigida para os valores reais do handoff (noturno segue
      Verde Profundo `#143737`; diurno usa tinta marrom `--text-primary:#342316`, sem verde) —
      registrado em `DESIGN.md` como segundo consumidor dessa camada.
- [x] **"Nosso Time" deixou de ser seção própria.** Removida da pilha de scroll (era
      `sections/DominiosPlaceholder.tsx`, dentro do overlay `.maiq-cycle-domains-overlay` — hoje
      esse overlay só contém `<Ciclo/>`) e do submenu "Home". O marquee de logos virou
      `maiq/TeamMarquee.tsx`, realocado para o fim de "Nossa Convicção" com um label centralizado
      ("Experiências de nossos especialistas que endossam este conceito"); mecanismo do marquee
      (IntersectionObserver + `data-active`) inalterado.
- [x] **Página `/sobre-nos` no ar**, com fidelidade literal ao protótipo do handoff (cards
      MA/AI/IQ como `role="tablist"`/`role="tab"`, seleção por hover — trade-off de acessibilidade
      consciente, decidido pelo usuário sobre a alternativa `role="group"`/`aria-pressed` sugerida
      por `frontend-design`). "Sobre nós" no menu virou link direto (`<Link to="/sobre-nos">`),
      nunca dropdown — decisão explícita para não incluir subopções por enquanto.
- [x] **Responsividade vertical** em telas baixas: novo padrão `@media (max-height:...)` para
      cabeçalho (700px), hero (760px), cartão da Plataforma (`min-height` fluido) e FAQ (750px) —
      corrige um bug real de conteúdo permanentemente inacessível abaixo de ~840px de altura no
      cartão da Plataforma (sticky, sem esse ajuste o rodapé do cartão nunca aparecia).
- [ ] Falta a Fase 3 do `/feature` (`testing` + `security`) — não retomada ainda nesta rodada.

## Ajustes pontuais pós-"Sobre Nós" (23/09)
Lote de correções pequenas apontadas pelo usuário depois de testar a rodada acima ao vivo.
Aplicadas direto (sem `/feature` — nenhuma delas mexe na pilha de scroll nem é estrutural).
- [x] **"Nosso Modelo" e "Nossa Convicção" cortavam conteúdo em telas baixas.** As duas seções
      não fazem parte da pilha sticky (ficam dentro de `.maiq-primary-overlay`, que rola em fluxo
      normal — só precisavam de mais respiro, não de correção estrutural). Novo
      `@media (max-height:860px)`: reduz padding/gap de "Nosso Modelo" e a faixa de logos de LLM,
      e em "Nossa Convicção" reduz padding/margens e força o vídeo a `height:42vh` — mas **só em
      janelas largas** (`and (min-width:801px)`); abaixo de 800px de largura o layout já empilhado
      usa `aspect-ratio:16/9` sobre a largura total, que é mais compacto do que qualquer altura
      fixa em vh, então a regra de vídeo não deve competir com ele no celular (testado: sem o
      guard de largura, o vídeo ficava *maior* no celular, não menor).
- [x] **Label do marquee de "Nosso Time" sem quebra controlada.** Aumentado
      `.maiq-team-band-label` para caber em uma linha em telas largas; abaixo de 640px de largura,
      um `<span className="maiq-subhead-break maiq-subhead-break-team">` força a quebra depois de
      "especialistas" (mesmo padrão dos outros subheads da página).
- [x] **Selo do topo do FAQ "flutuava" sobre um fundo diferente.** `.maiq-final-base` (base sticky
      do FAQ+rodapé) tinha `clip-path:inset(24px 0 0)` mas nenhum `background` próprio — os 24px
      cortados no topo revelavam o que estivesse atrás na pilha, uma cor às vezes diferente da do
      FAQ. Corrigido dando a ela o mesmo `background:var(--p-bg)` que `.maiq-primary-overlay` e
      `.maiq-cycle-domains-overlay` já tinham.
- [x] **Botão "← Voltar" removido das páginas legais** (`LegalPage.tsx`) — o menu suspenso já
      navega em todas as páginas, o botão era redundante. `.maiq-legal-back` removido de
      `maiq.css`; título ajustado para `margin:0` (era pensado para vir depois do botão).
- [x] **Textos da página "Sobre nós" ajustados**: "PRONÚNCIA"/"GÊNERO" eram exibidos em caixa alta
      por `text-transform:uppercase` em `.maiq-about-meta-overline` mesmo com o texto já em
      title-case no JSX — removido o uppercase (e reduzido o letter-spacing, calibrado para
      caixa alta, de `.14em` para `.06em`). "Gênero" virou "Gênero Gramatical"; "o hub Maiq" virou
      "O hub Maiq".
- [x] **Autoplay dos cards MA/AI/IQ não retomava depois do hover.** Pausa por hover agora é
      temporária (`hoverPausedRef`), retomando 1s depois que o mouse sai do card — só o hover nos
      cards conta para isso; clique continua pausando em definitivo (`pausedRef`), como antes.
- [x] **Ícone do Substack em Insights com a barra do topo desalinhada.** O path SVG da barra
      superior ia de x=0 a x=22.539, enquanto as outras duas barras vão de x=1.46 a x=22.539 —
      corrigido para o mesmo recuo à esquerda.
- Verificado: `tsc`, `build` e Playwright (desktop e mobile largura, alturas 700/860/900/1000px,
  temas claro/escuro) sem regressão. Nota: o tema inicial observado nos testes (mesmo forçando
  `colorScheme:'dark'` no Playwright) veio sempre "claro", não "noturno" como descrito no
  `CLAUDE.md` — não investigado nesta rodada por estar fora do escopo pedido; sinalizar se for
  notado no site real.

## Scroll do menu e fundo do FAQ/Insights (23/09)
- [x] **Menu suspenso subia demais "Nossa Convicção" em telas baixas.** `goToSection()` sempre
      alinhava o topo da seção ao topo da tela; como "Nosso Modelo" e "Nossa Convicção" não têm
      altura mínima de 100vh (ficam com a altura do próprio conteúdo, mais compacto desde o ajuste
      acima), em telas baixas a seção passou a ficar mais baixa que a viewport — alinhar pelo topo
      sobrava um vão embaixo, revelando o início da seção seguinte antes da hora. Agora, quando a
      seção é mais baixa que a tela, `goToSection` alinha a **base** dela à base da tela (em vez do
      topo); o respiro sobra em cima, mostrando um pouco da seção anterior — natural num scroll.
      Não afeta seções mais altas que a tela (comportamento antigo mantido) nem Plataforma/FAQ
      (que já usam a lógica própria dos holds).
- [x] **Fundo do FAQ trocado por degradê**, igual ao de "Nossa Plataforma"
      (`.maiq-platform-ciclo-bg`: `var(--p-platform-block-edge)` → `var(--p-platform-block-center)`
      → `var(--p-platform-block-edge)`, vertical). Aplicado em `.maiq-final-base` e
      `.maiq-final-content` (antes, cor sólida `var(--p-bg)`).
- [x] **Mesmo degradê aplicado à página Insights** — reutiliza a classe `.maiq-platform-ciclo-bg`
      no wrapper (antes, cor sólida `var(--p-bg)` inline).
- Verificado: `tsc`, `build`, e Playwright nas alturas 700/860/1000px, mobile (390×844) e nos dois
  temas — base da seção tocando a base da tela em todos os casos testados, degradê consistente
  com "Nossa Plataforma" em Insights e FAQ, sem regressão no rodapé (mantém seu tom sólido
  próprio, `--p-footer-bg`).

## Revisão tablet/mobile — primeira leva de ajustes diretos (23/09)
Pedido do usuário: revisão geral de tablet/mobile + lista de 8 pontos. Os 4 abaixo eram bugs ou
ajustes pontuais sem decisão de design em aberto — aplicados direto. Os outros 4 (pílulas de
"Nosso Modelo" no mobile, vídeo em paisagem na "Nossa Convicção", redesenho de "Nossa Plataforma"
e de "Nossa Perspectiva" no mobile/tablet) envolvem decisão de UX e/ou tocam a pilha de scroll —
aguardando alinhamento antes de implementar (ver conversa).
- [x] **Faixa de logos de LLM cortada no mobile.** `.maiq-model-tools-row` tinha `min-width:520px`
      inline (pensado só para desktop) — abaixo de 640px de largura isso forçava a faixa a
      estourar a viewport, cortando as últimas logos. Agora `width:100%;min-width:0` nessa faixa,
      com `gap` menor para acomodar o wrap que já existia.
- [x] **Menu suspenso compacto: separador decorativo antes de "Sobre nós"/"Insights".** Novo
      `separatorVariant:"fade"` em `NavDropdown.tsx` (linha com gradiente `transparent→cor→
      transparent`, sem tocar o separador sólido já usado para o grupo Entrar/Fale Conosco) —
      aplicado depois do último item de seção (FAQ), sinalizando que os dois itens seguintes
      levam a páginas diferentes, não a uma seção da Home.
- [x] **FAQ, tablet e mobile: header/sub-header centralizados, sub-header em uma linha.** Abaixo
      de 800px de largura, `.maiq-faq-intro` ganha `text-align:center`; o `<br/>` fixo do
      sub-header (sempre 2 linhas antes) vira `<br className="maiq-faq-sub-break">`, oculto nessa
      faixa — corrigido também um espaço que ficava faltando entre as duas frases quando o `<br>`
      soma. Desktop mantém as 2 linhas de antes.
- [x] **CTA da FAQ: "Fale conosco" → "Envie sua dúvida"** (`Faq.tsx`, `.maiq-faq-contact`) — texto
      alterado em todas as resoluções, a pedido do usuário. Não afeta o "Fale Conosco" do cabeçalho
      (CTA global, deliberadamente fora do escopo deste pedido).
- **Investigado, não reproduzido:** usuário reportou o menu suspenso "quebrando" fora da Home
  (anexo mostrando `/termos-de-uso`). Comparação direta Home vs. Termos/Insights/Sobre nós em
  768/600/430px, com scroll e reabertura do menu: geometria do header e do painel idênticas em
  todas as páginas (mesmo componente `SiteHeader`/`NavDropdown`), `position:fixed` preservado após
  scroll em todas, nenhuma sobreposição além dos 20px de sobreposição decorativa que já existe
  (e é idêntica) na Home. Sem conseguir reproduzir, não haveria o que corrigir com segurança —
  pedido mais detalhe ao usuário (dispositivo/navegador ou a interação exata) antes de mexer.
- Verificado: `tsc`, `build`, Playwright em 390/768px, e regressão de desktop (FAQ) sem mudança.

## Revisão tablet/mobile — `/design` para os 4 pontos de UX (23/09)
Design (`frontend-design`) + arquitetura (`architecture`, focada só em "Nossa Plataforma")
rodaram em paralelo; usuário aprovou o consolidado. ADR da Plataforma:
`docs/adr/0003-nossa-plataforma-mobile-estagio-de-altura-fixa.md`.

**Stage 1 implementado e verificado** (não toca a pilha de scroll):
- [x] **"Nosso Modelo" no mobile (≤760px)**: Venn ilegível trocado por dois cartões
      (QUARPX®/M&A/AI) + chip conector "Sistematização do M&A", hélice de DNA mantida
      reduzida (decorativa). Entre 760-1330px nada muda (decisão do usuário: só mobile, não
      estender a tablets em retrato). Durante a verificação, troquei `M&amp;AI`/`Sistematização
      do M&amp;A` (entidade HTML escrita como texto literal em JSX) por `&` direto, por
      suposição de que JSX não decodificaria a entidade — **suposição errada, confirmada depois
      via `esbuild` real do projeto**: o compilador decodifica entidades HTML em texto JSX em
      tempo de build (`M&amp;A` e `M&A` geram o mesmo `"M&A"` no `children`), então o texto
      original já renderizava certo. A troca ficou (mais convencional, resultado idêntico), mas
      não era um bug — registro aqui só para não repetir o mesmo alarme falso depois.
- [x] **"Nossa Convicção", fullscreen em celular portrait**: vídeo passa a rotacionar 90° via
      CSS (não `screen.orientation.lock` — iOS Safari não suporta) quando o aparelho está
      fisicamente em retrato e a tela é estreita (`@media(max-width:800px) and
      (orientation:portrait)`); dica "Gire o aparelho" na primeira abertura por sessão
      (`sessionStorage`). Se já em paisagem física, ou em desktop, comportamento inalterado.
      Verificado via matriz de transformação computada (rotação exata + tradução centralizada
      corretas) e visualmente nos 3 casos.
- Verificado: `tsc`, `build`, varredura completa de scroll (topo ao fim, 390px e 1400px) sem
  overflow horizontal em nenhum ponto.

**Stage 2 — "Nossa Plataforma" (bug estrutural + redesenho) implementado e verificado**
(ADR `docs/adr/0003-nossa-plataforma-mobile-estagio-de-altura-fixa.md`):
- [x] Restaurada a invariante `min-height:100svh` do estágio sticky abaixo de 1024px (tinha
      virado `min-height:0`, dirigido por conteúdo — causa raiz do corte). Cartão virou bloco
      de altura fixa (`clamp(...,52svh,...)`/`clamp(...,50svh,...)` em ≤600px) com texto
      **acima** (ordem do DOM invertida, `.maiq-platform-copy` antes de `.maiq-platform-media`;
      desktop preservado via `grid-template-areas`) e faixa de mídia compacta abaixo
      (`clamp(96px,20svh,160px)`, nunca `aspect-ratio`/`vw` — essa era a causa raiz da mídia
      crescer com a largura em vez do espaço vertical). Se o texto de alguma funcionalidade
      ainda não couber (2 das 4 funcionalidades, por poucos px), scroll interno único no bloco
      de texto — mesmo padrão já usado pelo FAQ.
- [x] Fullscreen do modal em celular portrait: mesma técnica de rotação CSS do Stage 1,
      mantendo a grade de duas colunas do desktop (mídia + texto lado a lado) em vez do
      empilhado. Corrigido durante a verificação: a dica "Gire o aparelho" tinha sido colocada
      **dentro** do elemento rotacionado (giraria junto, ilegível) — movida para fora, como
      irmã do layout rotacionado (mesmo padrão do Stage 1), confirmado via matriz de
      transformação computada (layout com `matrix(0,1,-1,0,...)`, dica só com `translateX`).
- [x] Reforço aprovado: `_fitNet`/`_fitFinal` são re-executados uma vez quando
      `document.fonts.ready` resolve, corrigindo a costura potencial da troca de fonte Barlow.
- Verificado: `tsc`, `build`, e matriz completa de Playwright — 390×844, 768×1024, 820×1180,
  1024×768 (paisagem), 1280×800, nos dois temas: base da Plataforma ocupando exatamente uma
  tela em todos os tamanhos (sem sobra), texto das 4 funcionalidades acessível (direto ou via
  scroll interno), sem costura na transição Convicção→Plataforma→Perspectiva, fullscreen
  rotacionado funcionando (portrait) e inalterado (desktop/paisagem já física).

**Stage 3 — "Nossa Perspectiva" no mobile, implementado e verificado**:
- [x] Abaixo de 760px, o diagrama (antes: SVG grande com scroll horizontal, curto demais para
      ser útil) vira um quadro 2×2 estático com as 4 raias (ícone+label), borda com um traço
      luminoso animado percorrendo o perímetro (`var(--c-flow)`/`var(--c-flow-core)`, dual-tema,
      mesma cor do ponto que já percorre o fluxo no desktop) e um botão único "Ver fluxo
      completo". Entre 760px e a largura normal, nada muda (raias+scroll horizontal de sempre).
- [x] Fullscreen (modal) reaproveita a definição do SVG completo (extraída para
      `CycleDiagramSvg`/`CycleLaneLabels`/`computeCycleFit`/`attachCycleScrollControls`, usadas
      tanto no quadro normal quanto no modal — sem duplicar a lógica), com a mesma rotação CSS
      em portrait estreito dos Stages 1-2. Corrigido durante a verificação: a dica de rotação
      não foi usada aqui (o usuário não pediu para esta seção), mas o botão de fechar do modal
      já nasceu correto — como irmão do elemento rotacionado, não dentro dele (aprendido do
      bug corrigido no Stage 2); confirmado via matriz de transformação (mídia rotacionada,
      botão de fechar com `transform:none`).
- [x] Verificado o ponto de maior risco: "Nossa Perspectiva" fica dentro da pilha frágil
      (`.maiq-cycle-domains-overlay`/`_fitFinal`) — o quadro compacto poderia, em tese, encolher
      a seção abaixo da invariante `≥100svh` que separa essa camada da base do FAQ. Medido
      diretamente: a seção já tem `minHeight:'100vh'` inline (pré-existente, não tocado), então
      a invariante se mantém por construção — confirmado com folga de exatos 2px em 390×844,
      375×667 e 768×1024.
- **Nota corrigida do Stage 1** (registrada acima, no bloco do Stage 1): a suposição de que
  `&amp;` como texto em JSX não seria decodificado estava errada — confirmado via `esbuild` do
  próprio projeto que o compilador decodifica entidades HTML em texto JSX. As trocas por `&`
  direto (feitas em `Ciclo.tsx`, `PaginaInstitucional.tsx` e `Conviccao.tsx` durante a
  verificação deste stage, encontrando o mesmo padrão em texto não relacionado ao trabalho
  atual) são cosméticas, não correções de bug — o texto já renderizava certo antes.
- Verificado: `tsc`, `build`, varredura completa de scroll (13 frames, 390px e 1400px, ambos os
  temas) sem overflow horizontal, pouso correto de `goToSection('faq')` em todos os casos, e
  inspeção visual da transição Plataforma→Perspectiva→FAQ sem vão nem sobreposição prematura.

**As 4 frentes do `/design` de tablet/mobile estão concluídas e verificadas.** Pendências
remanescentes fora deste escopo: revisão fina do scroll interno em "Nossa Plataforma" (2 das 4
funcionalidades passam ~2-40px do espaço disponível e depende do scroll interno — funciona, mas
vale um polimento visual futuro), e a animação dos pontos luminosos não foi replicada dentro do
modal de "Nossa Perspectiva" (diagrama completo, mas estático) — ambos registrados como
possíveis refinamentos futuros, não bugs.

## Performance — diagnóstico de navegação e Etapa 1 aplicada (24/09/2026)

A pedido do usuário, levantamento de dois riscos de performance além do carregamento já
documentado em `docs/plano-performance.md`: (1) se vídeos MP4 são o formato certo para Convicção
e Plataforma, e se o fluxo SVG de "Nossa Perspectiva" deveria virar vídeo — não, MP4 está certo
para os vídeos (o problema real é a estratégia de carregamento, não o formato) e o SVG interativo
do fluxo já é a opção mais leve possível, trocar por vídeo perderia a interatividade (arrastar as
raias) sem ganho de peso. (2) Top 5 elementos/lógicas de maior risco de carregamento, revisando o
código atual: `PageLoader` esperando `window.load` + vídeos com `preload="auto"` (~2,83MB, causa
raiz já documentada), ausência de code-splitting (`Ciclo.tsx` cresceu para 991 linhas sem nenhum
`React.lazy` no projeto), Supabase Auth+Realtime no bundle inicial só para rotular um botão, HTML
inflado por 340 estilos inline + `blur`/`mix-blend-mode`/`backdrop-filter`, e um achado novo desta
rodada: o brilho animado do quadro 2×2 mobile (`maiq-cycle-quad-glow`, do Stage 3 acima) rodava em
loop infinito sem pausar fora da tela nem respeitar `prefers-reduced-motion`, diferente dos outros
7 pontos animados do site.

Depois, a pedido do usuário, investigação de causas de **travamento durante a navegação**
(scroll, arraste, abertura de tela cheia) — distinto do peso de carregamento. 5 achados novos
documentados em `docs/plano-performance.md` (seção "Desempenho durante a navegação"): arraste do
diagrama de "Nossa Perspectiva" gravando `scrollLeft` sem agrupar por quadro (N1); `backdrop-filter`
do overlay somado à rotação do modal no instante de abrir tela cheia (N2); barra de progresso de
"Nossa Plataforma" animando em loop com `filter`+`mix-blend-mode` (N3, não aplicado); o brilho do
quadro 2×2 sem pausa (N4); `_fitNet`/`_fitFinal` recalculando a pilha de revelação a cada `resize`
sem debounce (N5, não aplicado).

**Aplicado nesta rodada:** Etapa 1 completa do plano de performance (destravar o `PageLoader` do
`window.load`, `preload="none"` nos vídeos da Convicção, montar só o vídeo do tema ativo até a
primeira troca real de tema, `preconnect` para `fonts.googleapis.com`) + N1 (arraste com
`requestAnimationFrame`) + N2 (`backdrop-filter` desligado quando o modal já cobre a tela
inteira — confirmado zero-risco visual, o overlay já ficava 100% coberto nesse estado). **N4 foi
removido** (não corrigido) a pedido do usuário — o brilho rotacional será substituído por uma
solução visual nova no refino da versão mobile.

Bug real encontrado e corrigido durante a implementação do item "montar só o vídeo do tema
ativo": a correção automática de tema (`useMaiqTheme`, heurística de horário/`localStorage`, que
roda logo após montar) dispara o mesmo evento de mudança de atributo que um clique real do
usuário no toggle de tema — os dois são indistinguíveis só pelo evento em si. Resolvido com uma
janela de carência de 600ms após montar. Verificado com Playwright em 3 cenários (heurística
resolvendo para "claro" sem interação do usuário, tema salvo igual ao padrão do SSR, e um clique
real no toggle) — confirmado que só o clique real monta o segundo vídeo.

Verificado: `tsc`, `eslint` e `npm run build` limpos; varredura completa de scroll (topo ao fim e
volta) em desktop e mobile, temas noite e claro, sem overflow nem erro além dos 404 já esperados
dos assets do Lovable CDN (pendência 1). Detalhe técnico completo, por item, em
`docs/plano-performance.md`.

## Revisão visual de "Nossa Perspectiva" — `/design` (24/09/2026)

A pedido do usuário, via `/design` (Fase 1 `frontend-design` → Portão aprovado pelo usuário →
Fase 2 `code-quality`): (1) removidos tons de Areia Nobre remanescentes nesta seção no tema
noturno — achado real: a correção de rebrand de 22/09/2026 (headings/CTA/chips não usam mais
areia no tema noturno, ver `CLAUDE.md` pendência 5) não pegou um terceiro conjunto de tokens
locais usado só aqui (`--c-lane-fg`, `--c-block-fg`, `--c-block-bg`, `--c-block-hair`, `--c-dot`,
`--c-sep`, `--c-frame-bg`, `--c-lane-hair`, mais `--c-band-fg`/`--c-pill-fg` como código morto),
todos derivados de `#EAD9CC`/`rgba(234,217,204,...)`. Remapeados para branco/menta
(`rgb(159,214,210)`), preservando as opacidades exatas — só o bloco do tema noturno; tema claro
intacto (já estava correto). (2) Quadro 2×2 mobile (abaixo de 760px) substituído por um losango
de 4 pílulas (uma por raia, em `<ol>` semântico) ligadas por um laço de linhas, com 2 pontos
luminosos em loop contínuo via CSS puro (`top`/`left` em `@keyframes`, defasagem fixa de 50%
entre os pontos via `animation-delay` negativo — sem sincronismo por JS) e pulso luminoso em cada
pílula no instante em que um ponto a atravessa (`animation-delay` calculado pela posição de cada
pílula no laço; matemática conferida e sincronismo confirmado via Playwright). Botão central "Ver
fluxo completo" trocado de `ghost` para `primary`, com mais destaque. (3) Dúvida do usuário sobre
manter a animação na tela cheia mobile: recomendação do agente de design foi um meio-termo — não
o motor completo do desktop (pesado demais empilhado com a rotação+scroll do modal), nem estático
(inverteria a expectativa de "resumo mais vivo que o completo") — só o traveler do laço de
fechamento (`CYCLE_CLOSE_PATH_D`, extraído como fonte única e reutilizado nas 3 ocorrências que
antes duplicavam a string), ligado via `offset-path` CSS puro só dentro do modal mobile, sem
`useEffect`/JS novo (liga/desliga sozinho com a montagem do `DialogPrimitive`). Usuário aprovou
essa recomendação.

Bug real encontrado e corrigido na verificação: a regra `@media (prefers-reduced-motion:reduce)`
tentava desligar o pulso das pílulas com `.maiq-cycle-quad-pill{animation:none}`, mas essa regra
tem especificidade **menor** que `.maiq-cycle-quad-pill[data-vertex="top"],...{animation:...}`
(que define a animação) — perdia o empate de especificidade independente da ordem no arquivo, e o
pulso continuava ativo mesmo com "reduzir movimento" ligado. Corrigido trocando o seletor da
regra de `reduced-motion` para `.maiq-cycle-quad-pill[data-vertex]` (mesma especificidade,
vence por ordem). Confirmado via Playwright (`getComputedStyle().animationName`) antes e depois
da correção.

Verificado: `tsc` e `eslint` limpos; `npm run build` não pôde ser confirmado nesta máquina (lock
de arquivo do Windows em `.output/public`, ambiental — provável sincronização do OneDrive na
pasta Desktop, não relacionado ao código; sinalizado para investigar se persistir). Testado via
Playwright: cores sem areia, os 2 pontos se movem e ficam em posições diferentes ao longo do
tempo, as 4 pílulas pulsam, botão central focável por teclado com `aria-label` mantido, tablet
(900px) e desktop (1400px) inalterados (quadro antigo/diagrama grande intactos), modal de tela
cheia mobile com o traveler ligado e a rotação CSS em portrait preservada, `prefers-reduced-motion`
desliga tudo corretamente após o fix, varredura completa de scroll nos dois temas sem overflow.

## "Nosso Modelo" mobile — volta às pílulas com interseção (24/09/2026)

A pedido do usuário, a partir de uma referência feita no Claude Design, implementado direto
(sem pipeline de agentes). Abaixo de 760px, os dois cartões empilhados + chip viraram duas
pílulas verticais sobrepostas, com a mesma borda (`--p-hair`) e o mesmo fundo translúcido
(`--p-chip-bg`) do Venn desktop — a interseção fica destacada só pela soma dos dois fundos. A
hélice de DNA voltou para dentro da interseção, girada 90° (barras em pé), recortada pela
interseção exata com a mesma técnica de recorte duplo do desktop (dois contêineres
`border-radius:999px; overflow:hidden` aninhados). Máscara da hélice ajustada para abrir um vão
horizontal para "Sistematização do M&A", que voltou a ser texto solto com fade (sem o chip
rígido). Textos centralizados nas pílulas. Tamanhos controlados por `--mm-h`/`--mm-o` em
`.maiq-model-mobile`. Removidas as classes antigas `.maiq-model-mobile-card`/`-divider`/`-chip`.

Verificado: `tsc`/`eslint` limpos (fora o `any` pré-existente); screenshots em 390px (dois temas)
e 320px; varredura completa de scroll em 390×844 (dois temas), 375×667 e 1400×900 sem overflow
nem erro; pouso pelo menu em "Nosso Modelo" correto; desktop inalterado (mesma altura de página).

## "Nossa Perspectiva" mobile — ciclo retangular com ponto luminoso (24/09/2026)

A partir de referência e especificação do Claude Design, implementado direto. O losango
anterior (2 pontos em `top/left` animados por CSS + pulso com `box-shadow`/`scale`) foi
substituído por `CycleFlowMobile` (`Ciclo.tsx`): 4 pílulas 136×48 nos cantos de um retângulo
342×360, caminho ligando os centros, **um** ponto luminoso em sentido horário (volta de 9s) e o
botão circular "Ver fluxo completo" no centro. O pulso começa quando o ponto toca a borda da
pílula (compensação de meia altura/largura), com ataque linear e decaimento exponencial só na
opacidade de um overlay. A borda do botão pulsa junto (máximo das 4 intensidades), e a última
pílula tocada recebe o estado ativo. Loop em `requestAnimationFrame` só com
`transform`/`opacity`, escrito direto no DOM (sem `setState` por quadro), rodando apenas
abaixo de 760px, com a seção visível e a aba ativa; parado com `prefers-reduced-motion`.
Geometria escalada por `--flow-k` (ResizeObserver) para caber em telas estreitas; o bloco usa
24px de respiro lateral (margem negativa só nele, sem mexer no padding da seção). Cores em
tokens novos `--c-fp-*` nos dois temas (noturno conforme a especificação; diurno derivado da
paleta madeira). Desvio consciente da especificação: sem painel de etapas abaixo do ciclo,
as pílulas ficam como itens de lista (não botões) e não há "fixar fase por toque".

**Bug real corrigido — scroll travando sobre a animação.** Não era a animação: o wheel estava
sendo entregue à `.maiq-faq-list` (contêiner rolável do FAQ), que fica **coberta** por "Nossa
Perspectiva" na pilha de revelação. A lista absorvia o scroll até chegar ao fim e só então a
página voltava a rolar. Confirmado registrando eventos de `scroll` (a lista rolava 0→168px
invisível). Correção em `PaginaInstitucional.tsx`: um guarda de scroll (agrupado por rAF) deixa
a lista com `pointer-events:none` enquanto a camada de cima ainda cobre o topo dela. Verificado
que a lista continua rolando normalmente quando o FAQ está visível (390×844 e 1400×700).

Verificado: `tsc`/`eslint` limpos (fora o `any` pré-existente); screenshots em 390px (dois
temas) e 320px; wheel sobre pílula, botão e margem rolando a página por igual; modal de tela
cheia abre/fecha pelo botão; foco por teclado visível; loop parado fora da tela, no desktop e
com reduzir movimento; varredura completa de scroll em 390×844 (dois temas), 375×667 e
1400×900 sem overflow nem erro.

## Ajustes mobile — fluxo completo, header, Convicção e Sobre nós (24/09/2026)

- [x] **Fluxo completo de "Nossa Perspectiva" só pelo botão no mobile.** Em pé já era assim
      (≤760px); deitado, a largura passa de 760px e o diagrama completo aparecia direto na
      página. A condição mobile (CSS e `CYCLE_MOBILE_QUERY` em `Ciclo.tsx`) passou a incluir
      celular deitado: `(max-width:760px), (orientation:landscape) and (max-height:500px) and
      (pointer:coarse)` — o `pointer:coarse` evita pegar janelas baixas de desktop. Deitado, o
      modal abre de borda a borda, sem rotação (já está na horizontal).
- [x] **Fluxo completo estático no mobile.** Removido o ponto do laço de fechamento que corria
      via `offset-path` dentro do modal (`withMobileCloser`, `.maiq-cycle-modal-closer`,
      `maiqCycleModalCloserOrbit`).
- [x] **Tema do fluxo completo.** O modal vive num portal fora do escopo da página e não recebia
      `data-theme`, então sempre abria no tema noite (os modais da Convicção e da Plataforma já
      repassavam o tema). Agora observa o `data-theme` do escopo e repassa.
- [x] **Menu suspenso quebrando fora da Home (bug real, finalmente reproduzido).** O header é
      `position:fixed` com `left:50%` e largura automática; nesse caso a largura "encolhida" é
      limitada a 50vw. Fora da Home o conteúdo (218px) passava desse limite (195px em 390px) e o
      botão do menu vazava da pílula. A Home escapava por outro caminho, por isso só ela
      funcionava. Correção: `width: max-content` no header (`SiteHeader.tsx`). Verificado sem
      vazamento em todas as 6 rotas, em iPhone 13, 360px, 1100px e 1440px. As tentativas
      anteriores de reproduzir não pegaram porque mediam a posição do menu, não o
      transbordamento da pílula.
- [x] **Divisória na "Nossa Convicção" (mobile).** Linha de 1px com fade nas pontas entre "Experiências
      de nossos especialistas…" e as logos (`.maiq-team-band-divider`, só ≤760px).
- [x] **Assinaturas em "Sobre nós" (mobile).** "Fundadores" centralizado em cima, as duas
      assinaturas lado a lado embaixo (grid de 2 colunas, só ≤760px). Desktop inalterado.

Verificado: `tsc`/`eslint` limpos; screenshots nos dois temas; varredura completa de scroll em
390×844 (dois temas), 375×667 e 1400×900 sem overflow nem erro.

## Mídias de produção — Plataforma, Convicção, logos e favicon (24/09/2026)

Origem: pasta `Midias origem/` enviada pelo usuário (hoje em `referencias/midias-origem/`, fora do git; as versões usadas
ficam em `src/assets` e `public/`). Decisões do usuário: o vídeo "Sala de Dados" **substitui e
exclui** a cena programada do VDR; no mobile o vídeo fica como **miniatura na faixa, e o toque abre
a tela cheia**; vídeos **no repositório**; **comprimir** antes de aplicar.

- [x] **Vídeos de "Nossa Plataforma"** (8 = 4 funcionalidades × 2 temas). Re-codificados com
      ffmpeg (H.264 CRF 22, 1080×1080 mantido, faststart): 32 MB → 5,3 MB (−83%), visualmente
      igual ao original no zoom 2×. A proposta inicial era 720×720, mas ela amolecia as linhas
      finas; 1080 com a mesma compressão ficou quase tão leve. Os vídeos têm 15s exatos, igual ao
      timer da aba, então o timer segue sendo a referência: o vídeo é posicionado no tempo dele ao
      montar (card ↔ modal), trocar de tema ou reiniciar. Exibição inteira (`object-fit:contain`)
      com o fundo da caixa na cor da borda dos vídeos (`--p-plat-video-bg`, um valor por tema),
      sem faixas visíveis. Placeholders CSS e `maiq/vdr/` excluídos.
- [x] **Carregamento sob demanda.** Só o vídeo da aba ativa no tema ativo, e só quando a seção
      está a menos de uma tela de distância. Achado na verificação: no tema claro o vídeo noturno
      era baixado primeiro, porque o `useMaiqTheme` aplica o tema salvo numa segunda renderização.
      Corrigido com um sinal determinístico: o hook agora expõe `ready`, e a home marca o escopo com
      `data-theme-ready`; o vídeo só monta depois disso (uma folga de 2 quadros não bastava, o tema
      chegava ~155ms depois).
- [x] **Mobile:** o vídeo aparece na faixa sob o texto; tocar nele abre o modal (≤1023px).
- [x] **Vídeos da Convicção** trocados pelos arquivos locais (só MP4; o WebM saiu), com capas
      geradas do primeiro quadro. Voltaram a aparecer no `npm run dev`.
- [x] **Logos do carrossel** com versão própria por tema (branca no noturno, original no diurno)
      no lugar do filtro CSS de inversão. Reduzidas a 3× a altura de exibição, em WebP:
      ~290 KB → 47 KB as 12. Sem `loading="lazy"`: dentro do marquee a logo só carregaria ao
      entrar na área visível, piscando vazia.
- [x] **Favicon** completo (`.ico` 16/32/48, PNGs, apple-touch-icon, ícones Android e manifesto)
      em `public/`, com as 5 tags no `<head>`; o `favicon.png` antigo foi removido.
- [x] Limpeza: saíram os 12 `.asset.json` da Convicção, o do Thomson Reuters e os PNGs
      `logo-abc-brasil.png`/`logo-thomson-reuters-clean.png`. Ficaram só os de `Dominio.tsx`.

Verificado no Edge (o Chromium do Playwright não decodifica H.264): reprodução, troca de aba,
troca de tema mantendo o tempo, modal com o tema certo e retorno ao card, toque no iPhone,
Convicção, favicon (200 em todos). Varredura completa de scroll em 390×844 e 1400×900, nos dois
temas, sem overflow nem erro. `tsc` limpo; `eslint` limpo, exceto o `any` pré-existente
(`PaginaInstitucional.tsx:26`) e o conflito de aspas do prettier que já existia nesses arquivos.
`npm run build` segue sem verificação (lock EBUSY em `.output/public`).

Observação: a logo da Deloitte veio pequena (274×52) e pode ficar levemente suave em telas
retina; se houver versão maior, basta substituir.

## Organização do material de referência (24/09/2026)

- [x] Quatro pastas de referência da raiz centralizadas em `referencias/`, fora do git
      (`.gitignore`), com índice em `.claude/referencias.md` e ponteiro no `CLAUDE.md`:
      `site-lovable-antigo/` (era `maiq/`: projeto Lovable anterior, **com `.env` próprio**, que
      antes não estava protegido pelo `.gitignore` e entraria no commit), `rebranding-design-system/`,
      `identidade-origem-do-nome/` e `midias-origem/`. Caminhos atualizados no `CLAUDE.md`, no
      `DESIGN.md` e no ADR 0002.
- [x] `.gitignore` também passou a ignorar o estado local do Claude Code
      (`.claude/scheduled_tasks.lock`, `.claude/settings.local.json`).
- [x] **`npm run build` voltou a passar.** A trava EBUSY em `.output/public` vinha de um
      `wrangler dev` que ficou rodando desde uma tentativa anterior de subir o servidor de
      produção; encerrado o processo, o build fechou limpo e os vídeos, as logos e o favicon estão
      no pacote final (8 das 12 logos, com menos de 4 KB, ficam embutidas no JS pelo Vite).

## Ajustes de vídeo, Convicção e Plataforma (24/09/2026)

- [x] **Vídeos v2 da Convicção** (`referencias/midias-origem/…-v2.mp4`) no lugar dos anteriores,
      com os mesmos nomes em `src/assets/conviccao/` (imports inalterados). Só remontados com
      `faststart` (sem recodificar: já estavam em ~600 kbps); capas regeneradas.
- [x] **Tela cheia da Convicção começa tocando, do mesmo ponto.** Havia três falhas somadas:
      (1) o vídeo do modal nascia com `preload="none"` e o código esperava um `loadedmetadata` que
      nunca chegava, então ficava parado na capa; (2) o efeito de transferência de tempo também
      dependia de `playing`/`visible` e, a cada play, recolocava o vídeo no instante da abertura
      ("trecho aleatório"); (3) o conteúdo do modal é montado pelo portal do Radix uma renderização
      depois, quando o efeito já tinha rodado sem encontrar o vídeo. Correções: `preload="auto"`
      depois da primeira ampliação; transferência pendente (`pendingTransferRef`) consumida só
      quando o elemento de destino existe e tem metadados; refs de callback (`mountTick`) para os
      efeitos rodarem de novo quando um `<video>` monta; com o modal aberto o vídeo conta como
      visível. A troca de tema ganhou o mesmo esquema pendente: a primeira troca, que monta o vídeo
      do outro tema, recomeçava o vídeo do zero (regressão pega na verificação).
- [x] **Loop.** A Convicção já tinha `loop` e agora funciona também na tela cheia. Na Plataforma,
      o vídeo exibido passa a repetir quando a aba não avança sozinha (mouse sobre o card ou modal
      aberto): `<video loop>` nativo, e o progresso só dá a volta junto, sem seek. Custo: repetir um
      vídeo custa o mesmo que continuar tocando (arquivo já baixado, decodificador já ativo); o que
      poupa recurso é pausar fora da tela, e isso já acontece.
- [x] **Plataforma, preview ≤1023px:** o vídeo aparece como faixa central (`object-fit:cover`) em
      vez da miniatura ilegível. O modal continua mostrando o vídeo inteiro. O bloco descritivo
      fica centralizado no quadro (`width:min(100%,460px)`), com o texto alinhado à esquerda por
      causa dos marcadores. No celular ele já ocupava a largura toda, então lá não muda.
- [x] **Convicção, desktop:** faixa label + carrossel mais próxima do conteúdo (margem de 96px fixos
      → `clamp(40px,5.5vh,64px)`; as regras de altura curta seguem valendo). A divisória com
      fade, antes só no mobile, vale para todas as larguras (`min(560px,75%)`).
- [x] **Linha fina intermitente na tela cheia da Plataforma** (borda direita e inferior do vídeo,
      só em alguns tamanhos de tela). Causa provável: 1080 não é múltiplo de 16, então o H.264 é
      codificado com 1088 linhas e recortado, e em certas escalas a GPU amostra essa sobra nas
      bordas direita e inferior. Vídeos recodificados em **1072×1072** (múltiplo de 16) a partir dos
      originais: 4,9 MB os 8. Não dá para reproduzir no navegador headless (decodificação por
      software), então a confirmação fica com a conferência visual. Os vídeos da Convicção
      (1920×1080) têm a mesma característica, mas não houve relato de linha neles.

Verificado no Edge: card → tela cheia continua do mesmo ponto já tocando; pause/play no modal sem
salto; loop no card e no modal; retorno ao card; troca de tema no card e no modal mantendo o tempo;
Plataforma repetindo no modal por 18s sem pausar. Varredura completa de scroll (390×844 e
1400×900, dois temas) sem overflow nem erro. `tsc`, `eslint` (sem a regra de aspas do prettier) e
`npm run build` limpos.

## Ajustes finais — tela cheia da Convicção, hover de Insights, menu (24/09/2026)

- [x] **Tela cheia da Convicção no celular cortava as bordas.** O modal gira a área do vídeo 90° e
      a dimensiona pela tela (~19,5:9, não 16:9), e o vídeo usava `object-fit:cover`. Agora usa
      `contain` na tela cheia, com as sobras na cor da borda do vídeo (`--p-plat-video-bg`, que já
      bate com os vídeos da Convicção). Nos três modais girados (Convicção, Plataforma e
      Perspectiva), a largura da área girada passou de `100vh` para `100dvh` (com `100vh` como
      fallback): no celular, `100vh` inclui a barra do navegador e a faixa passava da tela.
      Verificado em iPhone 13, iPhone SE, Pixel 7 e iPhone deitado, nos dois temas.
- [x] **Hover de Insights em branco (fora da paleta do tema claro).** A causa era a regra global
      `a:hover{color:#FFFFFF}`, com cor fixa e mais específica que a da linha. Ela agora usa
      `var(--p-text)`: no noturno continua branca, e no diurno isso protege qualquer link sem hover
      próprio. As linhas de Insights destacam título e ícone com `--p-text-2` (menta no noturno,
      madeira no diurno). O fundo do hover no noturno trocou areia por menta (regra de 22/09).
- [x] **Menu compacto (<1024px): "Sobre nós" e "Insights" em negrito (600)**, para se distinguirem
      das seções da Home. É uma nova opção `pageLink` em `NavDropdown` e vale em todas as páginas,
      porque o menu vem do `SiteHeader` compartilhado. Verificado nas 6 rotas, em celular e tablet.

`tsc`, `eslint` (sem a regra de aspas do prettier) e `npm run build` limpos.
