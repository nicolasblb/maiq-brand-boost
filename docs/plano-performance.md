# Plano de performance — carregamento da página institucional

**Status:** Etapa 1 (carregamento) e os itens N1/N2 (navegação) **implementados e verificados**
em 24/09/2026. N4 foi **removido** (não corrigido — será redesenhado no refino mobile). Etapas
2–5 e N3/N5 seguem só como diagnóstico, aguardando autorização.
**Data:** 22/09/2026. **Premissa:** nenhuma mudança na aparência ou no conteúdo.
**Atualizado em 24/09/2026:** seção *Desempenho durante a navegação* adicionada e, na mesma
data, Etapa 1 + N1 + N2 aplicados (ver "O que foi aplicado em 24/09" ao final do documento) e N4
removido a pedido do usuário.

> Existe um diagnóstico anterior em
> `.lovable/plan/por-que-a-página-está-pesada-diagnóstico-e-caminho-de-otimiz-2026-09-11.md` (11/09).
> **Boa parte dele já foi aplicada** e não vale repetir: o hero é escondido quando coberto
> (`maiq-anim-off` pausa as animações, `PaginaInstitucional.tsx:573`), os listeners de scroll
> passaram a um `requestAnimationFrame` agendado, há 7 `IntersectionObserver` pausando seções fora
> da tela, `prefers-reduced-motion` é respeitado em 6 pontos, a animação neural foi arquivada e
> "O Domínio" saiu da página. O canvas de partículas que era o vilão do texto antigo **não existe mais**.
>
> Por isso o gargalo de hoje é outro, e é de **carregamento**, não de taxa de quadros — que é
> exatamente o sintoma que você descreveu.

---

## O que foi medido

Build de produção e SSR local, nesta máquina:

| Métrica | Valor |
| --- | --- |
| JS + CSS servidos ao browser | **954 KB** brutos / ~248 KB gzip, em 11 arquivos |
| Chunk inicial `index-*.js` | 607 KB brutos / **174 KB gzip** |
| Chunk da home `routes-*.js` | 157 KB brutos / 40 KB gzip |
| CSS | 136 KB brutos / 26 KB gzip |
| HTML do SSR da home | **159 KB**, 1004 tags, 321 `<div>`, 340 atributos `style=` |
| Elementos animados no HTML inicial | **112** (`data-maiq-anim`), 18 `blur()`, 14 `mix-blend-mode` |
| Vídeos buscados no carregamento | **~2,83 MB** de MP4 (os dois temas, `preload="auto"`) |

---

## Causa raiz: o `PageLoader` espera o `window.load`

Este é o item que explica o sintoma em rede lenta, e é o de longe mais barato de corrigir.

[`PageLoader.tsx`](../src/components/maiq/PageLoader.tsx) põe um overlay **opaco, fixo, em
`z-index: 1000`**, que cobre a tela inteira, e trava a rolagem (`overflow: hidden` no
`documentElement`). Ele só libera quando **todas** estas três promessas resolvem:

```ts
const minimum   = 850ms                       // piso artificial
const pageReady = evento window 'load'        // TODOS os recursos da página
const fontsReady = document.fonts.ready       // Barlow (5 pesos) + Inter (variável)
await Promise.all([minimum, pageReady, fontsReady]);
```

…com um teto de segurança de **5 segundos**.

O problema: `window.load` espera os recursos da página — e a página dispara, no carregamento,
**dois `<video preload="auto">`** (tema claro e escuro, `ConvictionScene.tsx:190,205`), cerca de
**2,83 MB de MP4** para uma seção que fica bem abaixo da dobra. Em Chromium, elementos de mídia
seguram o evento `load` até terem dados suficientes; e, mesmo onde não segurassem, esses 2,83 MB
disputam banda com o JS e as fontes.

**Consequência:** numa rede lenta, o visitante encarrega um esqueleto cinza pelos **5 segundos
inteiros** do teto — enquanto o HTML do SSR, com a página completa, já estava ali desde o primeiro
byte, escondido atrás do overlay. O SSR está sendo desperdiçado.

Vale notar a inversão: **quanto pior a rede, mais o loader atrapalha.** Em banda larga ele custa
os 850ms do piso; em 3G ele custa 5s de tela morta sobre um conteúdo que já chegou.

---

## Opções, em ordem de retorno por esforço

### Etapa 1 — Destravar o primeiro paint · ~2h · ganho grande, risco baixo

**Status: aplicado e verificado em 24/09/2026.** Detalhe em "O que foi aplicado em 24/09" ao final
do documento.

Nenhum pixel muda depois que a página aparece. Muda **quando** ela aparece.

1. **Tirar o `window.load` do portão do loader.** Trocar por `requestAnimationFrame` duplo após a
   hidratação, ou por `document.fonts.ready` sozinho. O conteúdo já está no HTML do SSR — não há
   razão para esperar mídia abaixo da dobra.
2. **Baixar o teto de 5s para ~1,5s** e o piso de 850ms para ~300ms. O piso existe para o loader não
   "piscar"; 300ms cumprem esse papel.
3. **`preload="none"` nos dois vídeos** + carregar a fonte de vídeo só quando a seção "Nossa
   Convicção" se aproximar da tela (o `IntersectionObserver` já existe em `ConvictionScene.tsx`).
   O `poster` continua aparecendo de imediato. Economia: **~2,8 MB** no carregamento inicial.
4. **Montar só o vídeo do tema ativo**, em vez dos dois. Hoje os dois `<video>` existem sempre no
   DOM, para a troca de tema não reiniciar a reprodução — dá para preservar esse comportamento
   guardando o `currentTime` e montando o segundo vídeo apenas na primeira troca de tema.
5. **`preconnect` para `fonts.googleapis.com`.** Hoje `__root.tsx` só faz preconnect para
   `fonts.gstatic.com`; falta o host que serve o CSS, que é o primeiro da cadeia.

Estimativa: **–2,8 MB** e a página visível em vez de esqueleto por vários segundos.

### Etapa 2 — Enxugar o bundle inicial · ~3h · ganho médio-grande, risco baixo

6. **Tirar o Supabase do carregamento inicial.** O chunk de 174 KB gzip contém
   `SupabaseAuthClient`, `RealtimeClient` e `phoenix` (o WebSocket do Realtime) — confirmado por
   inspeção do build. Isso entra porque `PaginaInstitucional.tsx:17` importa `supabase` no topo do
   módulo, e o uso é só descobrir se o rótulo do botão é "Entrar" ou "Conta".
   **O Realtime nunca é usado neste site.** Caminhos: `await import()` do cliente dentro do
   `useEffect` de sessão, e importar `@supabase/auth-js` em vez do pacote guarda-chuva.
   Estimativa: **–50 a –80 KB gzip** do caminho crítico.
7. **Dividir a home em chunks sob demanda.** `Ciclo` (806 linhas), o VDR (~750) e `PlatformShowcase`
   entram todos no chunk da rota e executam na hidratação, mesmo o que está muito abaixo da dobra.
   `React.lazy` + montagem por `IntersectionObserver` — o `VdrEmbed` **já faz** isso para a cena
   interna (`VdrEmbed.tsx:37`), então é estender um padrão existente, não inventar um.

### Etapa 3 — Reduzir o peso do HTML e da hidratação · ~4h · ganho médio, risco médio

8. **Migrar os estilos inline para classes.** 340 atributos `style=` inflam o HTML do SSR para
   159 KB, não são cacheáveis, não são compartilhados entre elementos iguais e são reenviados em
   cada visita. Os chips da lista de serviços, por exemplo, repetem o mesmo objeto de estilo com
   ~12 propriedades seis vezes seguidas. Converter os repetidos para classes em `maiq.css`
   derrubaria o HTML de forma significativa.
   **Atenção:** isso interage com o runtime de hover `data-hover-style` (`parseStyleText`) — ver
   `CLAUDE.md`. É a mudança de maior risco visual da lista; fazer por seção, não de uma vez.
9. **`content-visibility: auto` nas seções abaixo da dobra**, com `contain-intrinsic-size` para não
   quebrar a rolagem. Tira do caminho de renderização inicial o layout e o paint do que não está
   visível. Barato e reversível — mas precisa de teste cuidadoso, porque a página depende de
   medições de posição (`getBoundingClientRect` em 19 pontos) para a pilha de revelação.

### Etapa 4 — Composição em GPU fraca · ~3h · ganho localizado, risco médio

10. **Reduzir os desfoques simultâneos.** 18 `blur()` e 14 `mix-blend-mode` já no HTML inicial; as
    camadas do hero chegam a `36vw` de lado com `blur(18–44px)`. Em notebooks com vídeo integrado,
    cada uma é uma textura grande para o compositor. Onde o desfoque é estático, trocar por um
    gradiente já suavizado ou um PNG/WebP pré-desfocado, mantendo o movimento só em `transform`
    e `opacity`.
11. **`backdrop-filter: blur(18px)`** no cabeçalho fixo e no toggle de tema (8 ocorrências no
    projeto): força recomposição de uma faixa da tela a cada quadro de rolagem. Um fundo
    semitransparente sólido custa quase nada e a diferença visual é pequena — mas é uma mudança
    de aparência, então precisa da sua aprovação.

### Etapa 5 — Modo leve · ~2h · ganho grande nos piores aparelhos

12. Detectar `navigator.connection.saveData`, `navigator.hardwareConcurrency <= 4` e
    `prefers-reduced-motion`, e servir uma variante sem parallax, sem desfoques grandes e com o
    vídeo substituído pelo poster. `prefers-reduced-motion` já é respeitado em 6 pontos — aqui é
    generalizar o mecanismo, não criar um novo.

---

## O que eu recomendo

**Fazer a Etapa 1 primeiro e medir.** É ~2h de trabalho, não muda a aparência, e ataca
diretamente o sintoma que você relatou. Minha expectativa é que resolva a maior parte da queixa
sozinha — o resto é otimização de um site que já estará carregando rápido.

Depois da Etapa 1, medir de novo antes de decidir. As etapas 2 e 3 valem a pena; as 4 e 5 só se a
medição mostrar que ainda há problema, porque envolvem risco visual.

A Etapa 3 item 8 (estilos inline → classes) é a que mais pode dar errado visualmente. Se for feita,
que seja seção por seção, com conferência visual entre cada uma.

## Como validar

Nenhuma dessas mudanças deve alterar a página. A validação precisa provar isso:

- **Antes e depois, em número:** peso transferido no carregamento, Largest Contentful Paint e
  tempo até a página ficar visível, medidos no DevTools com throttling "Fast 3G" e "Slow 4G".
- **Conferência visual** em desktop e celular, nos dois temas — o padrão do projeto.
- A pilha de revelação por scroll é a parte frágil: rolar a página inteira de cima a baixo e de
  baixo para cima, conferindo a ordem de sobreposição das seções.
- `npm run lint` e `npm run build` limpos.

## Pendência que afeta a medição

~~Os assets `.asset.json` apontavam para o CDN do Lovable e não carregavam.~~ **Resolvido em
24/09/2026:** toda a mídia da página agora é local (`src/assets`) e mensurável. Peso real:
vídeos da Plataforma de 0,5 a 1,0 MB cada (só o da aba ativa no tema ativo é baixado, e só quando a
seção se aproxima da tela); vídeos da Convicção ~1,5 MB cada (`preload="none"`, um por tema);
logos do carrossel ~47 KB as 12, em prioridade baixa.

---

## Desempenho durante a navegação (scroll, arraste, abertura de tela cheia)

**Adicionado em 24/09/2026**, a pedido do usuário, depois da rodada de ajustes de tablet/mobile.
Tudo acima trata do **carregamento** (o que é baixado e quando). Os itens abaixo são de outra
natureza: picos de trabalho da thread principal **depois** que a página já está de pé — durante
um arraste, a abertura de um modal, ou uma animação em loop. É o que costuma aparecer como
"trava no rolamento" ou "engasgo ao abrir tela cheia" em aparelhos mais fracos, mesmo com a
página já carregada.

### N1 — Arraste do diagrama em "Nossa Perspectiva" grava `scrollLeft` sem agrupar por quadro

`attachCycleScrollControls` (`Ciclo.tsx:411-465`, compartilhado entre o diagrama normal e o
modal de tela cheia) escreve `sc.scrollLeft` **direto dentro do `pointermove`**, sem passar por
`requestAnimationFrame`:

```ts
const onPointerMove = (event: PointerEvent) => {
  if (!dragging) return;
  sc.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
};
```

Cada evento de ponteiro força um recálculo de layout do contêiner antes do próximo evento poder
ser processado — o padrão clássico de "layout thrashing" durante um arraste contínuo, mais
sensível em touch/trackpads de alta taxa de eventos. É diferente do scroll principal da página
(`S._onScroll`, `PaginaInstitucional.tsx:543-548`) e do odômetro (`paintOdos`, linha 396), que já
agrupam corretamente com uma flag `queued` + `requestAnimationFrame`. Aplicar o mesmo padrão aqui
resolve.

*Esforço: baixo (~30 min). Risco: baixo — só a forma de aplicar o valor, não o comportamento.*

**Status: aplicado e verificado em 24/09/2026.**

### N2 — Abrir um modal de tela cheia soma `backdrop-filter: blur` a uma rotação grande no mesmo instante

Os três modais de tela cheia (Convicção, Plataforma, Perspectiva) usam `backdrop-filter:
blur(12px)` no overlay (`.maiq-platform-modal-overlay`, `maiq.css:943`) e, em celular retrato, o
conteúdo interno gira via `transform: rotate(90deg)` num elemento de `width:100vh;
height:100vw` — potencialmente maior que a tela do aparelho. `backdrop-filter` é uma das
operações mais caras para o compositor (reamostra tudo atrás a cada quadro); somar isso à
entrada de um elemento grande girando é justamente o instante em que tocar no ícone de tela
cheia pode engasgar num aparelho mais fraco.
Correção possível: nesses três modais, em modo retrato/rotacionado, trocar o `backdrop-filter`
do overlay por um fundo sólido semitransparente sem blur — mantendo o blur nos outros usos do
site (cabeçalho etc.), que são estáticos e mais baratos.

*Esforço: baixo (~1h, CSS condicional). Risco: baixo-médio — muda a aparência do fundo do modal
nesse estado específico; precisa aprovação visual.*

**Status: aplicado e verificado em 24/09/2026.** Achado ao implementar: nesse estado o próprio
modal já é opaco e cobre a tela inteira (`inset:0`, sem raio de borda), então o overlay atrás
fica 100% coberto — o `backdrop-filter` não produzia nenhum efeito visível ali. A mudança é
zero-risco visual (confirmado: `backdrop-filter` continua `blur(12px)` fora desse estado, e vira
`none` só quando o modal já o esconde por completo).

### N3 — Barra de progresso de "Nossa Plataforma" anima em loop com `filter` + `mix-blend-mode`

`.maiq-platform-line-progress` (`maiq.css:912`) roda continuamente enquanto a seção está
visível, a cada troca das 4 abas (a cada 15s), combinando `filter: drop-shadow` (dois desfoques)
com `mix-blend-mode`. Diferente da maioria dos usos de `blur`/`mix-blend-mode` do site — em geral
estáticos —, este está sempre animando enquanto a seção aparece, mesmo fora de qualquer modal, só
na navegação normal. Em GPU integrada mais fraca é candidato real a perder quadros durante o
scroll pela seção.
Correção possível: manter o brilho só com `drop-shadow` (sem `mix-blend-mode`), ou aplicar o
`mix-blend-mode` a uma camada estática por trás e animar por cima só com `transform`/`opacity`.

*Esforço: médio (~1-2h, precisa validar visualmente o efeito sem o blend). Risco: médio — muda a
aparência do brilho da barra.*

### N4 — Brilho do quadro 2×2 mobile (Nossa Perspectiva) não pausa fora da tela

`.maiq-cycle-quad-glow` (`maiq.css:861-863`, desta última rodada) roda uma animação CSS infinita
com `drop-shadow` em 4 elementos SVG, sem os dois cuidados que os outros 7 pontos animados do
site já têm: pausar via `IntersectionObserver` quando sai da tela, e respeitar
`prefers-reduced-motion`. Isoladamente é pequeno, mas soma raster contínuo mesmo depois que o
visitante já rolou para outra seção — inconsistente com o padrão que o resto da página segue.

*Esforço: baixo (~30 min, reaproveita o padrão já usado nos outros 7 pontos). Risco: baixo.*

**Status: removido em 24/09/2026** (não corrigido) — decisão do usuário: o brilho rotacional vai
ser substituído por uma solução visual nova no refino da versão mobile, então não vale corrigir
o padrão de pausa agora. `.maiq-cycle-quad-glow` e o `@keyframes maiqCycleQuadSweep` saíram de
`maiq.css`, e o `<svg>` correspondente saiu de `Ciclo.tsx`. O quadro 2×2 (raias + botão de tela
cheia) continua igual, só sem o contorno animado.

### N5 — `_fitNet`/`_fitFinal` recalculam a pilha de revelação a cada `resize`, sem debounce

`S._fitNet`/`S._fitFinal` (`PaginaInstitucional.tsx:488-517`) leem `offsetHeight` (forçam
layout) e escrevem `marginTop`/`height` em cascata em três elementos da pilha sticky, ligados a
`window.addEventListener('resize', ...)` sem debounce. Em iOS Safari, a barra de endereço
aparecendo/escondendo durante a rolagem dispara `resize` repetidamente — cada disparo aqui é um
recálculo de layout forçado bem no meio da parte mais frágil da página. Não há confirmação visual
de um "pulo" perceptível (precisaria medir em iOS real com o painel de Performance); é um padrão
de risco conhecido, então um debounce curto (~120–150 ms) é uma prevenção barata.

*Esforço: baixo (~20 min). Risco: qualquer mudança aqui exige a rotina de sempre do `CLAUDE.md` —
rolar a página inteira nos dois sentidos, nos dois temas, desktop e celular — por tocar a pilha
de revelação.*

### E os 5 itens já listados na conversa — também travam a navegação?

Só em parte, e vale separar:

- **Vídeos com `preload="auto"` e o `PageLoader`:** é carregamento, não navegação — não travam
  scroll depois de carregados. Único ponto de contato: se o vídeo ainda não tiver buffer
  suficiente quando o usuário abrir a tela cheia, a abertura pode parecer "travada" esperando o
  vídeo — motivo a mais para o `IntersectionObserver` pré-carregar antes do clique.
- **Ausência de code-splitting (Ciclo/VDR/Plataforma no bundle inicial):** o custo é parse +
  hidratação, concentrado nos primeiros segundos após o carregamento — pode fazer o scroll
  parecer "engasgado" logo de cara enquanto a thread principal ainda está ocupada, mas não é um
  problema contínuo depois disso.
- **Supabase no bundle inicial:** mesmo raciocínio — custo único de parse, não de scroll.
- **Estilos inline + `blur`/`mix-blend-mode`/`backdrop-filter` (itens 8, 10, 11 da Etapa 3/4):**
  **este é o que mais se conecta com a pergunta de hoje.** O `backdrop-filter: blur(18px)` do
  cabeçalho fixo, em especial, reamostra a faixa do topo da tela **a cada quadro de rolagem**,
  contínuo, o tempo todo — é o candidato mais direto a "trava no rolamento" entre os itens já
  documentados.
- **N4 (brilho do quadro 2×2):** é novo desta seção, não estava na lista anterior — ver acima.

---

### Como isso se encaixa nos próximos passos

- **Refino da exibição mobile:** N1, N2 e N4 são do material construído na última rodada
  (arraste do diagrama, tela cheia, quadro 2×2) — faz sentido resolver junto com qualquer ajuste
  visual pendente dessas telas, em vez de como rodada separada.
- **Carregar as mídias pendentes:** não muda esta seção — segue valendo a Etapa 1 acima.
- **Integrar à página com área logada:** reavaliar o **item 6** (tirar o Supabase do
  carregamento inicial) à luz disso antes de implementar. Hoje o cliente só decide o rótulo de um
  botão; se a integração fizer esse trecho passar a validar uma sessão real compartilhada com o
  site principal, o cliente deixa de ser peso descartável e a forma de importar precisa ser
  combinada com a arquitetura de autenticação do site principal — não decidida isoladamente
  aqui. **Recomendo esperar a decisão de integração antes de mexer no item 6.**
- **Publicar via Lovable AI:** qualquer validação desta seção (e da Etapa 1) deveria rodar no
  build publicado pelo Lovable, não só local — o ambiente de build/CDN pode mudar os números
  medidos em 22/09.

---

## O que foi aplicado em 24/09/2026

Etapa 1 completa (itens 1–5) + N1 + N2. N4 foi removido, não corrigido (ver status na seção
acima). Nada de aparência mudou — só quando/quanto é carregado e como o arraste/tela cheia
processam eventos.

### Etapa 1

1. **`PageLoader.tsx`** — trocado `window.load` (esperava todos os recursos, inclusive os
   vídeos abaixo da dobra) por dois `requestAnimationFrame` encadeados após a hidratação, mais
   `document.fonts.ready`. Piso de 850ms → **300ms**; teto de segurança de 5s → **1,5s**.
2. **`ConvictionScene.tsx`** — os 4 `<video>` (par escuro/claro, exibição normal + modal) foram
   de `preload="auto"` para **`preload="none"`**; o carregamento real só começa quando o
   `IntersectionObserver` já existente marca a seção como visível e a reprodução automática
   dispara `.play()` — o `poster` cobre a espera. Isso, sozinho, já elimina o download duplicado
   de ~2,8MB que era a causa raiz documentada.
3. **Vídeo do tema inativo não é mais montado por padrão** — só o `<video>` do tema atual existe
   no DOM até a primeira troca de tema **de verdade**. Achado durante a implementação: a própria
   correção automática de tema do `useMaiqTheme` (heurística de horário/`localStorage`, que roda
   logo após montar) dispara o mesmo evento de mudança de atributo que um clique real do
   usuário — indistinguível só pelo evento. Resolvido com uma janela de carência de 600ms após
   montar (a correção automática acontece em 1-2 ciclos de efeito, bem abaixo disso; um clique
   real do usuário só pode acontecer bem depois). Verificado com Playwright em 3 cenários:
   heurística resolvendo para "claro" sem interação, tema salvo igual ao padrão do SSR, e um
   clique real no botão de tema — só o terceiro monta o segundo vídeo.
4. Endurecido, no mesmo arquivo, o efeito que sincroniza o `currentTime` entre os dois vídeos ao
   trocar de tema: antes assumia que o vídeo alvo já tinha metadados carregados (verdade quando
   os dois vídeos sempre existiam com `preload="auto"`); agora espera `loadedmetadata` quando
   necessário, do mesmo jeito que o efeito de transferência para o modal já fazia.
5. **`__root.tsx`** — adicionado `preconnect` para `fonts.googleapis.com` (faltava; só havia para
   `fonts.gstatic.com`, que é o segundo salto da cadeia de fontes).

*Validação:* `tsc --noEmit` e `eslint` limpos nos arquivos tocados; `npm run build` sem erros.
Medido em modo dev (Vite não-bundlado, então o número absoluto não equivale a produção): loader
visível por ~2,6–3,7s isolando o tempo de carregamento de módulos do Vite, sempre dentro do teto
de 1,5s + 520ms de fade + variação de agendamento — de qualquer forma um teto **estruturalmente**
mais baixo que o anterior (5s + 850ms, e sujeito a esperar os vídeos). Recomendo medir de novo no
build publicado pelo Lovable antes de considerar encerrada a Etapa 1 (ver "próximos passos"
acima).

### N1 — arraste do diagrama agrupado por quadro

`attachCycleScrollControls` (`Ciclo.tsx`) agora grava a posição desejada numa variável e só
aplica em `scrollLeft` uma vez por `requestAnimationFrame`, em vez de a cada `pointermove`.
Testado em 900×800 (largura em que o diagrama é rolável): o arraste continua funcionando
normalmente (`scrollLeft` avançou de 0 para 280 num arraste de teste), agora sem escrever no
layout a cada evento de ponteiro.

### N2 — `backdrop-filter` desligado quando o modal já cobre a tela inteira

Nos três modais de tela cheia, dentro do `@media (max-width:800px) and (orientation:portrait)`
já existente, `.maiq-platform-modal-overlay` ganhou `backdrop-filter:none`. Verificado que o
blur permanece `blur(12px)` fora desse estado (desktop) e vira `none` só nele (celular
portrait) — sem qualquer diferença visível, porque o modal opaco já cobre o overlay por
completo nesse estado.

### N4 — brilho do quadro 2×2 removido

`.maiq-cycle-quad-glow`/`@keyframes maiqCycleQuadSweep` saíram de `maiq.css`, e o `<svg>`
correspondente saiu de `Ciclo.tsx`. Verificado: o quadro 2×2 continua exibindo as 4 raias
normalmente, sem o contorno animado.

### Verificação geral

Varredura completa de scroll (topo ao fim e volta) em desktop e mobile, temas noite e claro,
sem overflow horizontal nem erro de console além dos 404 já esperados dos assets do Lovable
CDN (pendência 1, não relacionada a esta rodada).
