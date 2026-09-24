# 0002. Página "Sobre Nós", dissolução da seção "Nosso Time" e responsividade vertical da Home

- Status: Proposto
- Data: 2026-09-23

## Contexto

Três mudanças relacionadas entraram na mesma rodada de `/feature`. Elas se tocam em dois
pontos — o `SiteHeader` (que muda em ambos os escopos 1 e 2) e a geometria da Home (que
muda no escopo 2 e é auditada no escopo 3) — e por isso são decididas juntas.

### Escopo 1 — nova rota `/sobre-nos`

Existe um handoff de design fechado em
`referencias/identidade-origem-do-nome/design_handoff_identidade_maiq/README.md` (antiga pasta "Página - Origem do nome Maiq"): duas seções
("Nossa Identidade", com a wordmark animada por `mask` + `clip-path` e três cards MA/AI/IQ
em autoplay de 3600 ms; "Uma nota dos fundadores", com blockquote e assinaturas). O handoff
é hi-fi: cores, tipografia, espaçamento e motion são finais.

Duas decisões já foram tomadas pelo usuário e não são reabertas aqui: a rota é `/sobre-nos`
e a camada de tokens compartilhada de `src/maiq.css` passa a valer os valores do handoff
(`_ds/maiq-design-system-*/tokens/semantic.css`).

Essa camada de tokens (`--bg-page`, `--surface-card`, `--text-*`, `--border-*`,
`--action-*`, `--highlight`, `--state-*`) existe hoje em `src/maiq.css:154-234`, escopada em
`[data-maiq-scope]` e `[data-maiq-scope][data-theme="claro"]`. Ela é **paralela** ao
sistema `--p-*` que pinta a Home, e tem pouquíssimos consumidores. O ponto que motiva a
correção: no tema claro a nossa camada usa tinta **verde** (`--text-primary:#143937`,
`--text-secondary:#308984`, `--action-primary-bg:#143937`), enquanto o handoff usa tinta
**marrom** (`#342316` / `#4E3520` / `#342316`) — a mesma regra "sem verde no tema claro"
que o resto do site já segue.

O item "Sobre nós" do `SiteHeader` hoje é um `<span role="button">` que dispara
`onSobreNosClick`, uma prop implementada de forma idêntica em três chamadores
(`PaginaInstitucional.tsx:674`, `sections/Insights.tsx:102`, `LegalPage.tsx:132` — este
último serve as três páginas legais), todos rolando ou navegando até
`data-maiq-sec="dominios"`.

### Escopo 2 — "Nosso Time" deixa de ser seção

`sections/DominiosPlaceholder.tsx` (h2 "Nosso Time" + subtítulo + divisor + marquee de
logos, `data-maiq-sec="dominios"`) é hoje irmão de `<Ciclo />` dentro de `overlay2Ref` /
`.maiq-cycle-domains-overlay` (`PaginaInstitucional.tsx:1054-1058`). Decisão do usuário:
só o **marquee** sobrevive, com um rótulo centralizado acima ("Experiências de nossos
especialistas que endossam este conceito"), realocado para a base de `sections/Conviccao.tsx`
— que já divide o overlay `overlayRef` / `.maiq-primary-overlay` com "Nosso Modelo".
O id `dominios` sai do submenu "Home▾".

### Escopo 3 — responsividade vertical

Relato sem caso concreto: "algumas seções estáticas cortam conteúdo em telas de pouca
altura". As seções estáticas são os elementos `sticky`/`fixed` da pilha de revelação
(`maiq-scroll-stack`, `maiq-platform-base`, `maiq-primary-overlay`,
`maiq-final-reveal-stage`, os `*-hold`) mais o header fixo. Pedido: diagnóstico, não
implementação.

### Restrição transversal

`CLAUDE.md` é explícito: mexer em `position`, `z-index`, `min-height` ou padding das divs
da pilha de revelação quebra a sequência. As duas funções de medição são
`S._fitNet` e `S._fitFinal` (`PaginaInstitucional.tsx:479-507`).

## Decisão

### D1 — Corrigir a camada de tokens compartilhada de forma **seletiva**, não por substituição em bloco

A camada passa a valer os valores do handoff, **com três exceções explícitas** nos tokens
de estado, que o handoff redefine de um jeito incompatível com o uso que já existe no site:

| Token (tema noturno) | Handoff | Decisão | Por quê |
| --- | --- | --- | --- |
| `--state-critical` | `#FFFFFF` | **manter `#9E4A31`** | é a cor de erro de `AuthLeadDialogs.tsx:189,205,457` e `reset-password.tsx:142`; branco destrói a semântica de erro |
| `--state-attention` | `#8AD8D3` | **manter `#A6822F`** | é o fallback efetivo de `--p-required` (asterisco de campo obrigatório, `AuthLeadDialogs.tsx:182` e `maiq.css:304`); `--p-required` não está definido em lugar nenhum, então o fallback vale |
| `--state-positive` | `#3FA49E` | **manter `#4E8F6E`** | cor de sucesso dos mesmos dois arquivos; mudar é ruído sem ganho |

Todo o resto acompanha o handoff, incluindo os tokens hoje **sem consumidor algum**
(`--highlight`, `--border-focus`, `--bg-page*`, `--surface-*`, `--text-*`), que passam a
existir com os valores certos para a nova página. Acrescentam-se os tokens que faltam e
que o handoff define: `--surface-contrast`, `--text-on-contrast`, `--bg-gradient` e o bloco
`[data-surface="contraste"]` — **opcionalmente**, só se a implementação da nova página os
usar; se não usar, ficam de fora (não criar token morto).

O escopo dos seletores permanece o nosso (`[data-maiq-scope]` /
`[data-maiq-scope][data-theme="claro"]`), **não** o `:root` / `[data-theme="claro"]` do
handoff — trocar isso vazaria a paleta Maiq para os componentes shadcn de
`src/components/ui/`.

O impacto real no que já está no ar é pequeno e foi verificado consumidor a consumidor:

- `MaiqButton` é o único consumidor direto, e todas as suas instâncias em produção são
  `variant="ghost"` (`ConvictionScene`, `PlatformShowcase`, `Faq`) ou têm os `--action-*`
  sobrescritos inline pelo chamador (`AuthLeadDialogs.tsx:63-72`, `SiteHeader.tsx:43-44`,
  `reset-password.tsx:31-34`).
- A cor do texto dessas instâncias `ghost` é vencida por `!important` em
  `.maiq-media-icon-button` / `.maiq-platform-icon-nav` (`maiq.css:756`),
  `.maiq-platform-tab` (`:725`) e `.maiq-faq-trigger` (`:381`) — regra de folha de estilo
  com `!important` ganha de estilo inline sem `!important`.
- Sobra, portanto, **um** efeito visível: `--action-ghost-bg-hover` (fundo de hover das
  abas da Plataforma, `maiq.css:727`, e dos gatilhos do FAQ). Noturno:
  `rgba(255,255,255,.08)` → `rgba(175,227,224,.10)` (leve tom menta). Claro:
  `rgba(20,57,55,.06)` → `rgba(52,35,22,.06)` (verde → marrom, correto pela regra da marca).

### D2 — `SiteHeader` navega para `/sobre-nos` por conta própria; a prop `onSobreNosClick` é removida

O componente já importa `Link` e `useNavigate` e já resolve "Insights" sozinho
(`SiteHeader.tsx:283` no menu desktop, `:87` no menu compacto). "Sobre nós" passa a seguir
exatamente o mesmo padrão:

- menu desktop: o `<span role="button">` vira `<Link to="/sobre-nos" className="maiq-nav-item">`,
  ganhando semântica de link, foco nativo, `Ctrl`+clique e prefetch do router de graça;
- menu compacto: `case COMPACT_KEY_SOBRE_NOS` passa a `void navigate({ to: '/sobre-nos' })`;
- a prop `onSobreNosClick` sai do tipo `SiteHeaderProps` e dos **quatro** call sites
  (`PaginaInstitucional.tsx:674`, `Insights.tsx:102`, `LegalPage.tsx:132`).

A alternativa de manter a prop com valor padrão foi descartada: destino fixo não é
configuração, é comportamento do componente.

### D3 — `SECOES` perde `dominios`; a cópia morta em `PaginaInstitucional.tsx` é apagada

A lista `SECOES` existe **duas vezes**: `SiteHeader.tsx:11` (a viva, consumida pelo
`NavDropdown` e pelo menu compacto) e `PaginaInstitucional.tsx:117` (**código morto** — não
há nenhuma referência a ela no arquivo desde a extração do ADR 0001). A entrada
`{ id: 'dominios', label: 'Nosso Time' }` sai da lista viva; a cópia morta é apagada inteira.

Isso **não** afeta `goToSection()` nem as contas de offset: a função é genérica
(`document.querySelector('[data-maiq-sec="' + id + '"]')`, `PaginaInstitucional.tsx:140`)
e só tem tratamento especial para `plataforma` e `faq`, via `platformHoldRef` e
`finalHoldRef`. Para qualquer id sem elemento correspondente ela retorna sem fazer nada
(`if (!el) return`) — inclusive no caminho de deep link `navState.secao`, se algum
histórico de navegação ainda carregar `'dominios'`.

### D4 — "Nosso Time" vira um componente de faixa dentro de `Conviccao`

`sections/DominiosPlaceholder.tsx` é **renomeado** para um componente de faixa (sugestão:
`src/components/maiq/TeamMarquee.tsx`) que preserva **intacto** o mecanismo atual: CSS
contínuo (`animation: maiqTeamMarquee 25s linear infinite`), `animation-play-state` ligado
por `data-active`, e o `IntersectionObserver` que o alterna. Some: o `<section>` com
`data-maiq-sec="dominios"`, o `<h2>` "Nosso Time", o `.maiq-section-subhead` e o
`.maiq-team-divider`. Entra: um rótulo centralizado com o texto
"Experiências de nossos especialistas que endossam este conceito", que também passa a ser
o nome acessível da faixa (via `aria-labelledby` apontando para ele, no lugar do
`aria-label` repetido de hoje). O componente é renderizado como último filho de
`.maiq-conviction-inner`, dentro de `sections/Conviccao.tsx`.

No CSS, `.maiq-dominios-placeholder`, `.maiq-dominios-placeholder-inner`,
`.maiq-team-heading`, `.maiq-team-divider` e `.maiq-team-subhead-break` (`maiq.css:641-646`,
`:660`) são substituídos por uma única classe de faixa; todo o bloco `.maiq-team-marquee` /
`.maiq-team-logo*` (`:647-657`), o `@media(max-width:800px)` relevante (`:659`) e o
`prefers-reduced-motion` (`:661`) permanecem como estão.

### D5 — A matemática da pilha de revelação não é afetada pelo D4 (verificado)

Leitura direta de `PaginaInstitucional.tsx:479-507`:

```
S._fitNet:   net.style.top = '0px'
             overlayRef.marginTop     = -net.offsetHeight      // net  = .maiq-platform-base
             platformHoldRef.height   =  net.offsetHeight
S._fitFinal: final.style.top = '0px'
             overlay2Ref.marginTop    = -final.offsetHeight    // final = .maiq-final-base
             finalHoldRef.height      =  final.offsetHeight
```

Ambas leem **só** a altura da camada fixa (`net`, `final`). A altura dos overlays que
passam por cima nunca entra na conta — ela só define por quanto scroll o overlay cobre a
camada de baixo. Portanto:

- engordar `overlayRef` (marquee em `Conviccao`) apenas alonga o trecho em que "Nosso
  Modelo + Nossa Convicção" cobrem a Plataforma. Sem efeito nas medições;
- emagrecer `overlay2Ref` (saída de Domínios) apenas encurta o trecho em que "Nossa
  Perspectiva" cobre o FAQ. Sem efeito nas medições.

Há **uma** invariante a preservar, e ela é o único risco real deste escopo:
`overlay2Ref` recebe `margin-top: -final.offsetHeight` ≈ `-100svh` (porque
`.maiq-final-content{height:100svh}`, `maiq.css:638`). Se a altura de `overlay2Ref` cair
**abaixo** de `final.offsetHeight`, parte do FAQ aparece por baixo do Ciclo antes da hora.
Hoje `overlay2Ref` = Ciclo (`minHeight:100vh`, `Ciclo.tsx:450`) + Domínios (`42svh`)
≈ 142svh; depois da mudança fica ≈ 100vh, que é **igual ou maior** que 100svh em todo
navegador (`vh` ≥ `svh` por definição). A margem de folga passa de ~42svh para ~0 — a
invariante continua satisfeita, mas deixa de ter colchão. **Consequência prática: a partir
daqui, qualquer redução de altura de `Ciclo` (incluindo trocar `100vh` por `100svh`)
precisa ser tratada como mudança na pilha de revelação.** Registrado aqui para não ser
descoberto por acidente no escopo 3.

### D6 — Responsividade vertical: diagnóstico e estratégia por ponto

Auditoria de cada elemento `sticky`/`fixed` contra 650 / 700 / 760 px de altura de
viewport. Nenhuma correção é decidida agora — o que se decide é **onde está o problema e
qual a forma segura de atacá-lo**.

**(a) Header fixo — `SiteHeader.tsx:211` (`top:20px`, `height:64px`) e o alternador de tema
(`:98`, `top:30px; right:32px`).** Ocupa 20–84 px sempre; em 650 px isso é 13 % da tela. Não
há nenhuma regra `max-height` no projeto. Risco baixo (fora da pilha), ganho alto.
Estratégia: `@media (max-height:700px)` reduzindo `top` para ~10 px e `height` para 56 px
(o valor que o próprio header já usa abaixo de 1024 px de largura, `maiq.css:864`), com o
alternador acompanhando.

**(b) Hero — `PaginaInstitucional.tsx:700`.** Dois problemas distintos:
- `minHeight:100vh` (não `svh`). Em mobile com a barra de URL visível, a caixa do hero é
  mais alta que a área visível; `S._fitHero` então calcula
  `top = min(0, innerHeight − hero.offsetHeight)`, um valor **negativo**, e empurra o hero
  para cima — o topo (slot da logo) fica atrás do header. Estratégia: `100svh`, que zera a
  diferença no caso comum e deixa `_fitHero` como rede de segurança.
- `padding: clamp(140px,12.5vh,160px) 48px clamp(44px,6.5vh,84px)`. O termo `12.5vh` só
  alcança o piso de 140 px em telas de 1120 px de altura; **abaixo disso o clamp não
  encolhe nada** — o piso de 140 px é fixo justamente onde ele mais dói. Estratégia: baixar
  o piso para ~96 px, que ainda libera o header (84 px) com folga, e guardar a redução
  atrás de `@media (max-height:760px)` para não mexer no desktop.

**(c) Plataforma — `.maiq-platform-base` (`maiq.css:633`) + `.maiq-platform-section`
(`:716`) + `.maiq-platform-card` (`:735`). Este é o achado principal e é um corte
permanente, não um aperto.** Soma vertical mínima do conteúdo, a 700 px de altura e
largura de desktop:

| Parte | Altura |
| --- | --- |
| padding vertical `clamp(108px,13vh,140px)` × 2 (o piso vence) | 216 px |
| h2 `clamp(38px,4.2vw,58px)` × 1.04 + subhead + margem 14 px | ~103 px |
| abas (`.maiq-platform-tab` 44 px + `padding-bottom:16px`) | ~60 px |
| `margin-top` do cartão `clamp(38px,5vh,58px)` | 38 px |
| `.maiq-platform-card` — `height:min(46vh,529px)` seria 322 px, mas **`min-height:420px` vence** | 420 px |
| **total** | **~837 px** |

`.maiq-platform-base` é `position:sticky` com `top` fixado em `0px` por `_fitNet` e
`overflow:clip`. Um sticky ancorado no topo e mais alto que a viewport **nunca rola**: ele
gruda em 0 e assim fica. Os ~137 px que sobram no fim não estão "abaixo da dobra", estão
**inalcançáveis** — a base do cartão da Plataforma é cortada e não há scroll que a revele.
O comentário no código confirma que a âncora no topo foi escolhida de propósito ("bottom
alignment hid the heading beneath the floating navigation whenever this section exceeded
the viewport"): trocou-se um corte no topo por um corte embaixo, sem resolver o excesso.
O limiar é ~840 px de altura de viewport — ou seja, **a maioria dos notebooks com barra de
favoritos já está dentro da faixa afetada**.
Estratégia: atacar só o **conteúdo**, nunca `.maiq-platform-base`. Trocar o
`min-height:420px` do cartão por algo que ceda em telas baixas
(`min-height:clamp(300px,46vh,420px)` ou um `@media (max-height:820px)` dedicado) e baixar
o piso do padding da seção de 108 px para ~88 px na mesma media query. `_fitNet` remede em
`resize`, e uma media query de `max-height` **é** um resize — a medição acompanha sozinha.

**(d) FAQ + rodapé — `.maiq-final-base` (`maiq.css:637`) + `.maiq-final-content` (`:638`) +
`.maiq-faq` (`:316`) + `SiteFooter`.** `height:100svh` com `overflow:hidden` é um corte
duro, e `clip-path:inset(24px 0 0)` come mais 24 px do topo. Orçamento a 650 px:
650 − 24 (clip) − ~195 (rodapé com os três links de Legal) − 136 (piso do padding do FAQ,
`clamp(108px,13vh,132px)` + `clamp(28px,4vh,44px)`) ≈ **295 px** para o miolo. A coluna de
intro (h2 + subtítulo + CTA ≈ 177 px) cabe; a lista **não é cortada** porque
`.maiq-faq-list` tem `overflow-y:auto` (`:368`) — mas caem ~2,5 acordeões visíveis, e um
scroll aninhado dentro de um estágio sticky é uma armadilha de UX: a roda do mouse é
capturada pela lista e a revelação só avança quando ela chega ao fim. Abaixo de 800 px de
largura o grid vira uma coluna (`:434`) e sobra ~118 px para a lista — na prática, um item.
Este é o ponto **mais seguro** de corrigir: `final.offsetHeight` é `100svh` e não depende
dos paddings internos, então encolher o padding do FAQ e do rodapé sob
`@media (max-height:760px)` **não toca em `_fitFinal`**. (O ADR 0001 já havia registrado
que o terceiro link de Legal apertaria essa tela; aqui está a medida.)

**(e) Overlays em fluxo normal — `.maiq-primary-overlay` (Modelo + Convicção) e
`.maiq-cycle-domains-overlay` (Ciclo).** São `position:relative` com altura automática:
crescem, não cortam. O `overflow:clip` deles recorta apenas o que extrapola a caixa, e a
caixa acompanha o conteúdo. Não há corte vertical aqui — o custo é só página mais alta.
Ressalva do D5: `Ciclo` (`minHeight:100vh`) virou o piso da invariante de `overlay2Ref`;
não reduzir.

**(f) Modais — `.maiq-conviction-modal` (`maiq.css:604`) e `.maiq-platform-modal` (`:763`).**
`inset` + `margin:auto` + `aspect-ratio:16/9` + `max-height:calc(100vh - …)` competem entre
si em telas largas e baixas; comportamento depende do motor. Prioridade baixa, mas entra na
lista de verificação a 650 px.

**Forma de validação obrigatória para qualquer implementação do (b), (c) e (d):** a Home
inteira, de cima a baixo, nas alturas 650 / 700 / 760 / 900 px e nas larguras 360 / 430 /
800 / 1024 / 1440 / 1920 px, nos dois temas, conferindo especificamente que (1) a logo
voa do hero para o header sem salto, (2) a Plataforma revela e esconde nos mesmos pontos,
(3) "Nossa Perspectiva" ainda cobre o FAQ por inteiro antes de sair, e (4) o rodapé encosta
na base da tela no fim.

### D7 — Ordem de execução

1. **D1 (tokens)** — isolado, prerequisito da nova página, raio de alcance conhecido.
2. **D3 + D4 (Nosso Time)** — sozinhos em um passo, para que qualquer regressão na pilha de
   revelação seja atribuível sem ambiguidade.
3. **D2 + rota `/sobre-nos`** — aditivo; a rota existe antes de o menu apontar para ela, no
   mesmo passo, para a branch nunca ficar com link quebrado.
4. **D6 (responsividade vertical)** — por último, medido sobre a geometria final.

## Alternativas consideradas

- **Substituir a camada de tokens em bloco pelo `semantic.css` do handoff.** Mais simples
  de escrever e de auditar depois ("é o handoff, ponto"). Descartada porque levaria junto
  `--state-critical:#FFFFFF` — borda e texto de erro brancos nos formulários de
  `AuthLeadDialogs` e `/reset-password` — além de tornar menta o asterisco de campo
  obrigatório. Três exceções documentadas custam menos que um bug de semântica de erro.
- **Criar uma terceira camada de tokens só para `/sobre-nos`.** Evitaria qualquer risco no
  que está no ar. Descartada: o usuário decidiu corrigir a camada compartilhada, e um
  terceiro sistema de cor (além de `--p-*` e de shadcn) é exatamente o tipo de camada extra
  que este projeto não comporta.
- **Manter `onSobreNosClick` como prop, passando `() => navigate({ to: '/sobre-nos' })` nos
  quatro chamadores.** Diff menor no `SiteHeader`. Descartada: mantém quatro cópias da mesma
  linha e perde a semântica de `<a>` (foco, Ctrl+clique, prefetch, crawler).
- **Manter "Nosso Time" no submenu apontando para a nova posição em Convicção.** Descartada
  pelo usuário — e tecnicamente ruim: dois itens de menu levando ao mesmo alvo visual.
- **Deixar `DominiosPlaceholder.tsx` onde está e apenas escondê-lo com CSS.** Diff mínimo,
  zero risco na pilha. Descartada: deixaria markup morto dentro de `overlay2Ref`, com o
  `IntersectionObserver` ainda rodando, e não entrega o pedido (a faixa precisa estar em
  Convicção).
- **Reescrever a pilha de revelação com `scroll-driven animations` / `view-timeline` para
  resolver o escopo 3 de raiz.** Eliminaria as medições em `useEffect`. Descartada: suporte
  parcial, reescrita completa da parte mais frágil do projeto, e o pedido é diagnóstico.
- **Trocar `.maiq-final-content{height:100svh}` por `min-height` para o FAQ nunca cortar.**
  Descartada: `final.offsetHeight` alimenta `_fitFinal`; altura variável ali desestabiliza
  as duas medições do estágio final. Encolher paddings internos entrega o mesmo alívio sem
  tocar na medição.
- **Adicionar `ResizeObserver` a `_fitNet`/`_fitFinal`** para remedir quando o conteúdo
  muda sem `resize`. Tecnicamente correto e barato, mas é mudança funcional em código
  frágil sem problema reportado. Fica registrado como candidato, não como decisão.

## Consequências

- Positivas:
  - A camada de tokens compartilhada deixa de contradizer a regra "sem verde no tema claro"
    e passa a ser uma base confiável para páginas novas — a nova página nasce usando tokens,
    não hexadecimais soltos.
  - "Sobre nós" vira um link de verdade: indexável, focável, com prefetch do router; e some
    uma prop de quatro componentes.
  - Duas cópias divergentes de `SECOES` viram uma (a de `PaginaInstitucional.tsx` era
    código morto desde o ADR 0001).
  - A Home encolhe ~42svh de altura total de documento com a saída de Domínios de
    `overlay2Ref` — menos scroll para chegar ao FAQ.
  - O escopo 3 sai do "acho que corta" para um ponto medido e localizado: a base do cartão
    da Plataforma é inalcançável abaixo de ~840 px de altura de viewport.
- Negativas / riscos:
  - `--action-ghost-bg-hover` muda de tom nos dois temas (abas da Plataforma, gatilhos do
    FAQ, botões-ícone de mídia). É mudança visual, pequena mas real, e precisa de
    autorização.
  - A folga da invariante de `overlay2Ref` (altura ≥ `final.offsetHeight`) cai de ~42svh
    para ~0. Nada quebra hoje, mas a Home fica menos tolerante a futuras reduções de
    `Ciclo`.
  - O rótulo novo em `Conviccao` cria uma segunda voz na seção ("Nossa Convicção" + a faixa
    de logos): é decisão de design, e a hierarquia tipográfica do rótulo precisa vir do
    agente `frontend-design`, não ser inventada na implementação.
  - As correções do escopo 3 são todas por `@media (max-height:…)`, um mecanismo que o
    projeto ainda não usa em lugar nenhum — abre uma nova dimensão de teste (altura) na
    regra "validar em desktop e celular, nos dois temas".
- Impacto no comportamento visual / na pilha de revelação:
  - **D1, D2, D3:** nenhum. Tokens e menu não tocam em geometria.
  - **D4:** toca. `overlayRef` cresce (~+30 % de `.maiq-conviction`), `overlay2Ref` encolhe
    ~42svh. As medições de `_fitNet`/`_fitFinal` não leem essas alturas (verificado no D5),
    mas a **quina inferior arredondada** de `.maiq-cycle-domains-overlay` passa a ser
    fechada por `Ciclo` em vez de por Domínios — o roadmap registra um ajuste prévio de
    quina nesse mesmo bloco (item de 22/09), então é ponto de conferência obrigatório.
    Validação: percorrer a Home inteira nos dois temas e confirmar que a Plataforma some
    e reaparece nos mesmos pontos e que o FAQ só aparece depois que o Ciclo sai por inteiro.
  - **D6:** por definição, toca — mas a decisão restringe a intervenção ao **conteúdo**
    das camadas (padding, `min-height` de cartão, altura de tipografia), nunca a `position`,
    `z-index` ou `min-height` das divs `maiq-*` da pilha, e nunca à altura de
    `.maiq-final-content` e de `Ciclo`.
- Impacto de custo (peso do carregamento / Supabase / hospedagem):
  - **Peso.** Nenhuma dependência nova em nenhum dos três escopos. A rota `/sobre-nos` é
    code-split pelo router: estimativa de **6–10 KB gzip** de JS+CSS, carregados só por
    quem visita a página. A wordmark usada como máscara é
    `src/assets/logo-maiq-branco.png`, **byte a byte a mesma** do handoff (md5 confere) e já
    no bundle via `SiteHeader`/`SiteFooter` — custo zero. Entram dois PNGs novos de
    assinatura, **24,5 KB somados**, arquivos reais no repositório. A nova página **não**
    deve usar o `PageLoader` (ele é exclusivo da Home, `PaginaInstitucional.tsx:657`), o que
    a mantém fora do problema do `window.load` descrito em `docs/plano-performance.md`.
  - **Dependência do CDN do Lovable: não aumenta.** Nenhum `*.asset.json` novo. O escopo 2
    inclusive não muda nada aqui — as logos do marquee continuam sendo os mesmos cinco
    ponteiros de CDN que já existem, apenas renderizados em outro lugar da página
    (pendência 1 de `CLAUDE.md` segue valendo: elas não carregam hoje).
  - **Supabase.** Uma chamada `auth.getUser()` a mais por visita a `/sobre-nos`, vinda do
    `useSupabaseUser` do chrome compartilhado — o mesmo custo que `/insights` e as três
    páginas legais já pagam. Nenhuma consulta de dados nova, nenhuma escrita.
  - **Hospedagem (nitro / Workers).** Mais uma rota SSR; o HTML da nova página é estático e
    pequeno (duas seções de texto), ordens de grandeza abaixo dos 159 KB do SSR da Home.
    Sem efeito mensurável em cold start ou tamanho do worker.
  - **Tokens de contexto da implementação.** `PaginaInstitucional.tsx` tem ~1200 linhas de
    estilo inline denso. O escopo 2 toca nele em **três pontos conhecidos** (constante morta
    em 117, `onSobreNosClick` em 674, bloco de overlays em 1046-1060) e o escopo 3 em um
    (hero em 700). Trabalhar por faixa de linha e **não** rodar o formatador no arquivo
    inteiro — mesma regra do ADR 0001.
