# DESIGN.md — Maiq (página institucional)

Sistema de design **em produção hoje**. É a fonte de verdade para qualquer proposta de UI
neste momento — inclusive para o agente `frontend-design` e para o comando `/design`.

Há um **rebrand em preparação**, com paleta e componentes diferentes dos daqui. Ele está
documentado na seção final e **não deve ser usado** enquanto não houver uma decisão explícita
de migração. Projetar com os dois sistemas misturados deixa o site com duas identidades
visuais coexistindo — pior do que não ter mudado nada.

---

## Dois sistemas de estilo coexistem no código — não misturar

- **shadcn/Tailwind**: tokens oklch em `src/styles.css` (`:root` / `.dark`), cores neutras
  (slate). Usado só pelos primitivos de `src/components/ui/` e pelo 404/error boundary do
  `__root.tsx`. Fora desse escopo, não usar.
- **Design system Maiq**: `src/maiq.css`, escopado em `[data-maiq-scope]`. É o que a página
  institucional, o Insights e as páginas legais usam. O resto deste documento trata dele.

Dentro do próprio `maiq.css` existem **duas camadas de tokens**, e isso importa saber:

1. Uma camada semântica "oficial" (`--bg-page`, `--text-primary`, `--action-primary-bg`…),
   herdada do design system original do commit inicial. Usada por `MaiqButton.tsx` e, desde a
   página `/sobre-nos` (ADR 0002), por `src/components/sobre-nos/*` e pelas classes
   `.maiq-about-*` de `maiq.css` — a rota nasceu de um handoff hi-fi que já usava esses tokens
   diretamente, e o valor deles foi corrigido nessa mesma rodada para não conflitar com a
   regra "sem verde no tema claro".
2. A camada `--p-*` (`--p-bg`, `--p-text`, `--p-muted`…), definida mais adiante no mesmo
   arquivo (bloco "estilos globais da página"). **É a que o resto do site usa** — Home,
   Insights, Faq, Ciclo, Convicção, o cabeçalho, o rodapé.

**Ao projetar qualquer coisa fora do `MaiqButton` e de `/sobre-nos`, use a camada `--p-*`.** É
a que o olho do usuário já vê em produção no restante do site.

---

## Paleta da marca (Guia da Marca, Ago/26)

| Nome | Hex |
| --- | --- |
| Verde Profundo | `#143937` |
| Areia Nobre | `#EAD9CC` |
| Menta Suave | `#9FD6D2` |
| Verde Botânico | `#308984` |
| Madeira de Lei | `#68462B` |

Rampas derivadas (`src/maiq.css:9-42`): `--green-100..950`, `--sand-50..500`, `--wood-300..700`.

## Dois temas, uma variável por cor

Tema **noturno** (padrão) e **diurno**, alternados por `data-theme="claro"` no elemento com
`data-maiq-scope` — nunca em `<html>`. **Toda cor visível vem de uma variável `--p-*`** com
fallback (`var(--p-text, #EAD9CC)`); o fallback só existe para antes do CSS carregar, não é
licença para usar hex direto. Cor fixa fora de `var(--p-*)` quebra o tema claro.

### Tokens `--p-*` — valores por tema (`src/maiq.css:242-291`)

| Token | Noturno | Diurno | Uso |
| --- | --- | --- | --- |
| `--p-bg` | `#0F2B2A` | `#EEE0D4` | fundo da página |
| `--p-hero-bg` | `#143937` | `#E0CBB8` | fundo do hero |
| `--p-card` | `#1F5956` | `#F9F1EA` | cartões, menus flutuantes |
| `--p-footer-bg` | `#09201F` | `#E0CBB8` | rodapé |
| `--p-bg-deep` | `#09201F` | `#E3CFBC` | fundos mais escuros/profundos |
| `--p-text` | `#FFFFFF` | `#342316` | texto primário, headings |
| `--p-text-2` | `#AFE3E0` | `#68462B` | corpo de texto secundário |
| `--p-muted` | `#9FD6D2` | `#8A6038` | metadado, label, texto discreto |
| `--p-subhead` | `#FFFFFF` | `#8A6038` | subtítulos de seção |
| `--p-hair` / `--p-hair-soft` / `--p-hair-strong` | rgba(159,214,210, .12–.22) | rgba(104,70,43, .10–.18) | fios/bordas |
| `--p-header-bg` | rgba(20,57,55,.72) | rgba(249,241,234,.80) | fundo do cabeçalho (com blur) |
| `--p-chip-text` | `#DFF4F3` | `#342316` | texto de chips |
| `--p-chip-bg` / `--p-chip-bg-strong` | rgba(159,214,210,.05) / rgba(159,214,210,.16) | rgba(255,253,248,.20) / rgba(104,70,43,.10) | fundo de chips |
| `--p-helix-hi` | rgba(255,255,255,.92) | rgba(52,35,22,.9) | destaque da hélice do Nosso Modelo |
| `--p-toggle-thumb` | rgba(255,255,255,.14) | rgba(52,35,22,.10) | thumb do toggle de tema |
| `--p-h1` | `#FFFFFF` | `var(--wood,#68462B)` | título grande |
| `--p-band-bg` / `--p-band-btn-fg` | `#FFFFFF` | `#143937` | faixa de destaque (banda de CTA) |
| `--p-band-fade` | rgba(255,255,255,0) | rgba(20,57,55,0) | fade da faixa de destaque |
| `--p-cta-bg` / `--p-cta-fg` | `#FFFFFF` / `#143937` | `#68462B` / `#F3E7DE` | botão de destaque (FAQ, CTA final) |
| `--p-cta-bg-hover` / `--p-cta-bg-active` | `#DFF4F3` / `#AFE3E0` | `#7A5334` / `#543619` | estados do botão de destaque |
| `--p-mark-1` / `--p-mark-2` | `#9FD6D2` / `#308984` | `#68462B` / `#BF8D65` | marcações, barras de métrica |
| `--p-tool-filter` | `brightness(0) invert(1)` | `brightness(0)` | filtro para logos monocromáticas |

**Correção aplicada (22/09/2026):** o tema noturno usava Areia Nobre (`#EAD9CC` e derivados) em
headings, CTA e chips — misturando as duas paletas descritas na "Direção futura: rebrand"
abaixo. Os 14 tokens `--p-*` da tabela acima (mais os equivalentes na camada semântica
`--action-*`/`--text-primary`/`--highlight`/`--link`, usada só por `MaiqButton`) foram
corrigidos para usar branco/menta no escuro, conforme a regra que o rebrand já definia como
correta. **O tema claro não foi alterado.** `a{color:#EAD9CC}` (global, `maiq.css:241`) e as
constantes `sand`/`wood` de `VdrScene.tsx` (paleta do produto retratado na cena, não do site)
ficaram fora do escopo dessa correção.

Há dezenas de outras variáveis `--p-*` para os efeitos do hero (`--p-orb`, `--p-halo`,
`--p-flash`, `--p-vol-*`, `--p-net-*`) — específicas de cada seção animada; consulte
`src/maiq.css:242-291` diretamente ao trabalhar nelas.

**Pendência de acessibilidade conhecida:** `--p-muted` no tema claro (`#8A6038` sobre
`#EEE0D4`) mede 4,26:1 — abaixo do mínimo AA de 4,5:1 para texto normal. Afeta o cabeçalho,
metadados e a linha de versão das páginas legais. Registrado em `roadmap.md`; correção
adiada por decisão do usuário (22/09/2026). Não propor um uso *novo* de `--p-muted` em texto
pequeno sem citar essa pendência.

## Tipografia

- **Fonte:** Barlow (Google Fonts), substituindo a Grandview da marca (licenciada, ausente do
  repositório). Pesos 300–700. Alguns headings usam Inter.
- **Escala** (`--fs-*` / `--lh-*` / `--ls-*`, `src/maiq.css:59-84`):

| Token | Tamanho | Uso |
| --- | --- | --- |
| `--fs-display-1` | 72px | hero, display máximo |
| `--fs-display-2` | 56px | display secundário |
| `--fs-h1` | 40px | título de seção grande |
| `--fs-h2` | 32px | título de seção |
| `--fs-h3` | 24px | subtítulo de seção, `h2` de documento |
| `--fs-h4` | 20px | `h3` de documento |
| `--fs-body-lg` | 18px | corpo destacado |
| `--fs-body` | 16px | corpo padrão |
| `--fs-body-sm` | 14px | corpo secundário, nav |
| `--fs-caption` | 13px | legendas |
| `--fs-overline` | 12px, uppercase, `+0.14em` | etiqueta acima de título |
| `--fs-metric` | 56px | números grandes (odômetros) |

Medida de leitura: `--measure-narrow` 46ch, `--measure-body` 62ch, `--measure-wide` 78ch.

## Espaçamento, raio, elevação, movimento

- **Espaço:** escala `--space-0` (0) a `--space-14` (160px), `src/maiq.css:85-104`.
  `--container-max: 1200px`, `--container-narrow: 760px` (páginas legais usam este),
  `--section-y: 96px` / `--section-y-lg: 128px`.
- **Raio:** `--radius-xs` 3px … `--radius-xl` 24px, `--radius-pill` 999px.
- **Elevação:** dark-first — quase sem sombra; profundidade vem de hairlines e um pool
  ambiente sutil. `--shadow-1/2/3` crescentes, `--glow-focus` para foco de teclado.
- **Movimento:** durações `--dur-1` 120ms a `--dur-4` 560ms; `--ease-standard` para UI,
  `--ease-out` para superfícies. Sem bounce/spring.

## Componentes

- **`MaiqButton`** (`src/components/maiq/MaiqButton.tsx`): variantes `primary` / `secondary`
  / `ghost` / `accent`, tamanhos `sm` / `md` / `lg`. Usa a camada semântica "oficial"
  (`--action-*`), assim como `/sobre-nos` (ver seção "Dois sistemas de estilo" acima). Hover e
  active geridos por estado React, não CSS puro.
- **`NavDropdown`** (`src/components/maiq/NavDropdown.tsx`): menu "Home▾" (`triggerVariant="link"`,
  padrão), abre em hover/foco, fecha com `Escape`, `role="menu"`. Também suporta
  `triggerVariant="icon"` + `openOnClick` + `align="right"` — usado pelo gatilho do menu
  compacto do `SiteHeader` abaixo de 1024px (ícone `Menu`/`X`, abre por clique, não hover).
- **`SiteHeader`** (`src/components/maiq/SiteHeader.tsx`): acima de 1024px, layout desktop
  completo (`NavDropdown` "Home▾" + "Sobre nós" + "Insights", CTA Entrar/Fale Conosco, toggle
  de tema como pílula separada). Abaixo de 1024px, `<nav>` e a pílula CTA completa somem,
  substituídos por um `NavDropdown` em modo ícone (menu compacto com as 7 seções + "Sobre
  nós" + "Insights") e um toggle de tema embutido (ícone único). Em ≤430px, "Entrar"/"Conta"
  e "Fale Conosco" entram como primeiros itens do menu compacto. Troca de layout é só CSS
  (`@media`, duas subárvores sempre no DOM) — sem JS de resize.
- **Cartões e chips:** estilo inline com `border: 1px solid var(--p-hair)`,
  `background: var(--p-chip-bg)`, `border-radius: 999px` para chips de texto curto.

## Convenção de hover em estilos inline

A página é escrita majoritariamente com `style={{...}}` inline (herança do `.dc.html`
original). Para hover fora do `MaiqButton`, existe um runtime próprio: o atributo
`data-hover-style="prop:valor;prop:valor"`, lido por `parseStyleText` e aplicado por um
`useEffect` em `PaginaInstitucional.tsx`. **Esse runtime varre só o escopo da Home** — um
`data-hover-style` em qualquer outra rota (Insights, legais) é inerte hoje. Para chrome
compartilhado entre rotas, o hover deve ir para uma classe CSS de verdade, não para esse
atributo.

## Regras ao propor

1. Nenhuma cor fora de `var(--p-*)` — nunca hex direto num componente.
2. Toda proposta cobre os dois temas explicitamente — o claro é o que mais falha.
3. Validar em desktop e celular, nos dois temas, antes de considerar pronto.
4. `--p-muted` a 14–15px no tema claro tem contraste insuficiente — evitar novo uso até a
   correção do token (ver pendência acima).
5. Não usar a camada semântica "oficial" (`--bg-page`, `--text-primary`…) fora do
   `MaiqButton` e de `/sobre-nos` — ela não é a fonte de verdade visual do resto do site hoje.

---

## Direção futura: rebrand (não usar ainda)

Existe um handoff de rebrand completo em
`referencias/rebranding-design-system/uploads/maiq_design_system_handoff/`, com `DESIGN_SYSTEM.md`
próprio, tokens (`tokens/*.css`), 29 componentes de referência e dois UI kits (site e
plataforma). Ele descreve a paleta e a nomenclatura de tokens atuais deste projeto como
"identidade antiga" a ser substituída.

**Decisão registrada com o usuário (22/09/2026): não migrar agora.** O trabalho em curso
(páginas legais, chrome compartilhado) segue com os tokens `--p-*` documentados acima, para
não deixar o site com duas identidades visuais coexistindo. O rebrand entra como uma
funcionalidade própria, com seu próprio plano de arquitetura e design, quando for priorizado.

Principais diferenças que essa migração trará, para referência:

| | Atual (`--p-*`) | Rebrand |
| --- | --- | --- |
| Verde Profundo | `#143937` | `#143737` |
| Menta Suave | `#9FD6D2` | `#AFE3E0` |
| Tema escuro | ~~mistura Areia Nobre no texto/CTA~~ já corrigido (22/09/2026, ver seção de tokens acima) | **proíbe** areia/madeira no escuro; usa branco/menta |
| Fundo claro | `#EEE0D4` | `#EAD9CC` |
| Nomenclatura | `--p-*`, escopado | `--bg-page`, `--text-primary`… semânticos, globais |
| Componentes | ad-hoc, inline | 29 componentes de referência (Button, Card, Dialog, TopBar…) |

Nota: o `text-muted` da paleta clara do rebrand mede 4,04:1 sobre seu próprio fundo — a
pendência de contraste **não é resolvida automaticamente** pela migração; precisará de
atenção própria quando o rebrand for planejado.
