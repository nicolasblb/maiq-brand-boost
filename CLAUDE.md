# CLAUDE.md — Página institucional Maiq

Contexto e convenções deste repositório. Leia antes de editar.

## O que é

Site institucional da **Maiq** (consultoria/plataforma de M&A para médias empresas), em
português do Brasil. Hoje o repositório contém **apenas o site público**. A área logada
vive em **outro projeto** — aqui existem só os pontos de entrada (login/recuperação de
senha via Supabase Auth) e a captura de leads.

O projeto nasceu no **Lovable** e continua sincronizado com ele (veja `AGENTS.md`):
não reescrever histórico publicado (nada de `push --force`, rebase/amend/squash em
commits já enviados), e manter a branch em estado funcional.

O histórico de decisões de produto está em `roadmap.md` (checklist, em português) e em
`.lovable/plan/*.md` (um arquivo por rodada de alterações, com data). Consulte-os antes
de "consertar" algo que pode ter sido uma decisão deliberada.

Material de referência (handoffs de design, o projeto Lovable antigo, mídias brutas) fica em
`referencias/`, **fora do git** — índice e quando consultar cada pasta em
`.claude/referencias.md`.

## Stack

- **TanStack Start** 1.x (SSR) + **TanStack Router** (file-based routing) + React 19
- **Vite 8** via `@lovable.dev/vite-tanstack-config` — o preset já inclui tanstackStart,
  viteReact, tailwindcss, tsConfigPaths, nitro, injeção de `VITE_*` e o alias `@`.
  **Não adicionar esses plugins manualmente** em `vite.config.ts` (quebra por duplicação).
- **Tailwind CSS 4** + **shadcn/ui** (`src/components/ui/`, estilo new-york, lucide)
- **Supabase** (auth + tabela `leads`), **Drizzle** só para as migrations em `drizzle/`
- TypeScript estrito: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noPropertyAccessFromIndexSignature` (por isso `import.meta.env['VITE_...']` com colchetes)

## Comandos

O lockfile do repo é `bun.lock`, mas **esta máquina só tem npm** (`node v24`, `npm 11`).
Usar npm aqui e não commitar `package-lock.json` sem combinar antes.

```sh
npm install
npm run dev       # servidor local (Vite dev / SSR)
npm run build
npm run lint
npm run format    # prettier
```

## Rotas (`src/routes/`, file-based)

| Arquivo | URL | Conteúdo |
| --- | --- | --- |
| `__root.tsx` | — | shell HTML (`lang="pt-BR"`), `<head>`, fontes Barlow+Inter, favicon, Toaster, QueryClientProvider, 404 e error boundary |
| `index.tsx` | `/` | `PaginaInstitucional` |
| `insights.tsx` | `/insights` | `sections/Insights` (artigos autorais) |
| `politica-de-privacidade.tsx` | `/politica-de-privacidade` | via `LegalPage`, conteúdo real (v1.0, 27/03/2026) |
| `termos-de-uso.tsx` | `/termos-de-uso` | idem |
| `politica-de-cookies.tsx` | `/politica-de-cookies` | via `LegalPage`, texto novo (sem página de origem) |
| `sobre-nos.tsx` | `/sobre-nos` | `SobreNos` — identidade da marca (MA/AI/IQ) + nota dos fundadores; destino do item "Sobre nós" do menu |
| `privacy-policy.tsx`, `terms-of-use.tsx` | `/privacy-policy`, `/terms-of-use` | só `redirect()` no `beforeLoad` para as rotas em português (URLs do site antigo) |
| `reset-password.tsx` | `/reset-password` | destino do e-mail de recuperação do Supabase |

`src/routeTree.gen.ts` é gerado — nunca editar à mão. Não criar `src/pages/` nem
`app/layout.tsx` (convenções de Next/Remix, não se aplicam aqui).

## A página inicial

`src/components/PaginaInstitucional.tsx` (~1200 linhas) é o componente central: header
fixo, hero, e a orquestração de rolagem. As seções em ordem de leitura:

1. **Hero** (sticky, `maiqPath*` — orbes animados de 45s)
2. **Nossa Plataforma** — `maiq/PlatformShowcase.tsx` (4 funcionalidades com timer de 15s,
   progresso, modal ampliar/reduzir; um vídeo MP4 por funcionalidade e por tema em
   `src/assets/plataforma/` — a antiga cena programada `maiq/vdr/` foi excluída em 24/09/2026)
3. **Nosso Modelo** — hélice de DNA, textos laterais em hover, odômetro de 3 números
4. **Nossa Convicção** — `sections/Conviccao.tsx` + `maiq/ConvictionScene.tsx` (vídeos
   "Valor na mesa", claro/escuro, play/pause, ±5s, troca de tema sem reiniciar); termina com
   `maiq/TeamMarquee.tsx` (label + marquee de logos de empresas), que **não é mais uma seção
   própria** ("Nosso Time" foi removida da pilha de scroll e do submenu — 23/09/2026)
5. **Nossa Perspectiva** — `sections/Ciclo.tsx` (SVG grande, raias arrastáveis; abaixo de
   760px vira um quadro 2×2 estático das 4 raias com botão de tela cheia — 23/09)
6. **FAQ** — `sections/Faq.tsx` (5 acordeões) + rodapé, fixos em uma tela

O menu "Home" (`maiq/NavDropdown.tsx`) navega por `data-maiq-sec="..."`, com ids
`topo | modelo | fundacao | plataforma | ciclo | faq` (constante `SECOES`, sem `dominios`
desde a remoção de "Nosso Time"). Atenção: os **ids não batem com os rótulos**
(`fundacao` = "Nossa Convicção", `ciclo` = "Nossa Perspectiva") — herança de nomes antigos.
"Sobre nós" **não é dropdown**: é um link direto para `/sobre-nos` (`SiteHeader.tsx`), tanto
no menu desktop quanto no compacto — decisão explícita de não ter subopções por enquanto.

`sections/Dominio.tsx` está **fora da página** de propósito: foi preservado para uma futura
seção de domínios dentro de "Sobre nós" (ainda não construída — a `/sobre-nos` atual só tem
identidade da marca + nota dos fundadores). Não remover. Idem
`maiq/archived/plat-neural-animation.ts.disabled` (decisão de retomar ou excluir ainda
pendente no roadmap).

### Rolagem em camadas

A página usa uma pilha de revelação (`maiq-scroll-stack`, `maiq-platform-base`,
`maiq-primary-overlay`, `maiq-final-reveal-stage`, `maiq-*-hold`) com refs e medição em
`useEffect`. Blocos `sticky` sobrepõem-se conforme o scroll, e `goToSection()` compensa o
header e as bases sticky. **Mexer em `position`, `z-index`, `min-height` ou padding dessas
divs quebra a sequência de revelação** — testar a página inteira depois de qualquer ajuste
estrutural.

## Estilo e tema

Convivem dois sistemas — não misturar:

- **shadcn/Tailwind**: tokens oklch em `src/styles.css` (`:root` / `.dark`). Usado só pelos
  componentes de `src/components/ui/` e pela página 404/error boundary.
- **Design system Maiq**: `src/maiq.css`, escopado em `[data-maiq-scope]` para não colidir.
  Tokens da marca (Verde Profundo `#143937`, Areia Nobre `#EAD9CC`, Menta `#9FD6D2`,
  Verde Botânico `#308984`, Madeira de Lei `#68462B`), escalas, tipografia, espaçamento,
  raios, elevação e motion — portados de `_ds/tokens/*.css` do projeto original.

**Tema**: dois temas, noturno (padrão) e diurno. A troca acontece por
`data-theme="claro"` no elemento com `data-maiq-scope` (adiciona/remove o atributo).
Todas as cores da página vêm de variáveis `--p-*` redefinidas nesse bloco. **Nunca usar cor
fixa em componente da página** — sempre `var(--p-algo, fallback)`, senão o tema claro quebra.

**Fonte**: Barlow (Google Fonts) substitui a Grandview da marca, que é licenciada e não está
no repositório. Alguns títulos usam Inter. Trocar é só mudar `--font-core` quando os
arquivos da Grandview chegarem.

**Hover em estilos inline**: a página é escrita com `style={{...}}` inline (herança do
`.dc.html` original). Para hover existe um runtime próprio: o atributo
`data-hover-style="prop:valor;prop:valor"` é lido por `parseStyleText` e aplicado por um
`useEffect` em `PaginaInstitucional.tsx`. Ao adicionar hover a um elemento inline, seguir
esse padrão em vez de criar classe nova.

## Assets

Duas formas convivem, e a diferença importa:

- **Arquivos reais** no repo (import normal, `import x from '@/assets/x.png'`): `logo-maiq-*.png`,
  `tool-*.webp`, assinaturas e, desde 24/09/2026, toda a mídia de produção da home:
  `plataforma/*.mp4` (8 vídeos, funcionalidade × tema), `conviccao/*` (vídeos + capas) e
  `logos/*-{noite,dia}.webp` (carrossel). Favicon completo em `public/`.
- **Origem da mídia:** `referencias/midias-origem/` (fora do git) guarda os arquivos
  brutos enviados pelo usuário. As versões em `src/assets` são **otimizadas**: vídeos da
  Plataforma re-codificados (H.264, CRF 22, 1072×1072 — múltiplo de 16, evita linha na borda —, faststart; ~4,9 MB os 8, contra 32 MB
  brutos) e logos reduzidas a 3× a altura de exibição, em WebP. Ao receber mídia nova, repetir o
  processo (ffmpeg via `ffmpeg-static` temporário no scratchpad — não é dependência do projeto)
  em vez de copiar o bruto.
- **`*.asset.json`** — ponteiros para o CDN do Lovable (`/__l5e/assets-v1/...`); usa-se `x.url`.
  Restam só os de `sections/Dominio.tsx` (fotos dos sócios e logos), que está fora da página.
  Não carregam no `npm run dev` — esperado.

## Supabase / dados

- `src/integrations/supabase/client.ts` — cliente do browser (gerado; não editar à mão).
  Igual para `client.server.ts`, `auth-middleware.ts`, `types.ts`.
- `src/lib/leads.functions.ts` — `submitLead`, server function com validação Zod e upsert
  em `leads` por `normalized_email`. A escrita é server-only (ver migration 0001).
- `src/components/AuthLeadDialogs.tsx` — modais de "Entrar"/"Conta" e "Fale Conosco".
  Login por `signInWithPassword`; recuperação redireciona para `/reset-password`.
- `.env` tem as chaves do Supabase. `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` são
  **públicas por definição** (o Vite as injeta no bundle). Está no `.gitignore` desde 22/09,
  junto de um `.env.example` sem valores. Nunca expor as chaves server-side em nenhuma saída.
- **`SUPABASE_SERVICE_ROLE_KEY` está ausente do `.env`** mas é exigida por `client.server.ts`,
  que o `submitLead` carrega — ou seja, o formulário "Fale Conosco" **falha em ambiente local**.
  Em produção o Lovable Cloud pode injetá-la; confirmar antes de publicar.

## Pendências abertas (22/09/2026)

1. ~~**Assets do Lovable não carregam.**~~ Resolvido para a página (24/09/2026): vídeos da
   Convicção, logos do carrossel e os novos vídeos da Plataforma agora são arquivos locais em
   `src/assets`. Só `sections/Dominio.tsx` (fora da página) ainda usa `*.asset.json`.
2. **Páginas legais — implementadas, falta a Fase 3 (Verificar) do `/feature`.** As três rotas
   (`/politica-de-privacidade`, `/termos-de-uso`, `/politica-de-cookies`) estão no ar com conteúdo
   real, `SiteHeader`/`SiteFooter`/`useMaiqTheme` compartilhados com Home e Insights, tabela da
   LGPD com fallback em cartões abaixo de 640px, e redirects de `/privacy-policy`/`/terms-of-use`
   (URLs do site antigo). Especificação em `docs/spec-paginas-legais.md`. Falta rodar `testing` e
   `security` (Fase 3) antes de fechar o `/feature`. O link "← Voltar" que existia no topo foi
   removido (23/09/2026) — o menu suspenso já cobre a navegação em todas as páginas.
3. **Performance de carregamento.** Diagnóstico e opções em `docs/plano-performance.md`.
   Causa raiz: o `PageLoader` espera o `window.load`, que espera ~2,8 MB de vídeo com
   `preload="auto"`. Aguardando autorização para executar.
4. **Contraste do tema claro reprova no AA.** `--p-muted` (`#8A6038`) sobre `--p-bg` (`#EEE0D4`)
   dá 4,26:1, abaixo de 4,5:1. Afeta todo o tema claro — menu, linhas de metadado, rótulos.
   Decisão registrada: tratar depois, em revisão própria. Candidato: `#7A5432` (5,17:1).
   Ver `roadmap.md`.
5. **Rebrand em preparação — não iniciado.** Handoff completo em
   `referencias/rebranding-design-system/uploads/maiq_design_system_handoff/`, com paleta, nomenclatura
   de tokens e 29 componentes diferentes dos atuais. Decisão registrada (22/09/2026): tratar como
   funcionalidade futura própria, não migrar agora. `DESIGN.md` documenta o sistema atual em
   produção e tem uma seção dedicada a essa direção futura. **Uma regra específica do rebrand já
   foi adiantada (22/09/2026):** o tema noturno não usa mais Areia Nobre em headings/CTA/chips
   (agora branco/menta) — só esse ponto, o resto do rebrand segue não iniciado. Em 24/09/2026
   apareceu um resto dessa mesma regra em "Nossa Perspectiva" (`Ciclo.tsx`/`maiq.css`): um
   terceiro conjunto de tokens locais (`--c-lane-fg`, `--c-block-*`, `--c-dot`, `--c-sep`,
   `--c-frame-bg`) ainda usava areia no tema noturno, corrigido no mesmo padrão. Vale checar se
   outras seções isoladas guardam tokens locais parecidos que a correção de 22/09 não alcançou.
6. **Animação neural arquivada** (`maiq/archived/plat-neural-animation.ts.disabled`):
   retomar ou excluir — decisão pendente desde o roadmap.
7. ~~**Mobile de "Nossa Perspectiva" (Ciclo.tsx) — sem tratamento dedicado.**~~ Resolvido
   (23/09): abaixo de 760px vira um quadro 2×2 das 4 raias com botão de tela cheia. Ver item 10.
8. **Auditoria LGPD das páginas legais — achados pendentes (23/09).** O único achado alto
   (Política de Privacidade não cobria leads/prospects) já foi corrigido e aprovado. Restam 4
   médios (Cookies descreve cookie onde é `localStorage`; Google Fonts não citado em nenhum
   documento; contradição entre os dois documentos sobre Analytics; retenção do upsert de leads)
   e 5 baixos — todos deixados para depois. Detalhe e decisões item a item em `roadmap.md`.
9. **`/sobre-nos` — implementada, falta a Fase 3 (Verificar) do `/feature`.** ADR
   `docs/adr/0002-sobre-nos-nosso-time-e-responsividade-vertical.md`. Junto dessa rodada,
   "Nosso Time" deixou de ser seção própria (virou `maiq/TeamMarquee.tsx` no fim de "Nossa
   Convicção") e a página ganhou tratamento de responsividade vertical (`@media (max-height:...)`
   no cabeçalho, hero, cartão da Plataforma, "Nosso Modelo", "Nossa Convicção" e FAQ). Falta
   rodar `testing` e `security` (Fase 3) antes de fechar o `/feature`. Detalhe em `roadmap.md`.
10. **Revisão de tablet/mobile (23/09) — as 4 frentes de design concluídas.** "Nosso Modelo"
    (≤760px) trocou o Venn ilegível por dois cartões; "Nossa Convicção" e "Nossa Plataforma"
    ganharam fullscreen com rotação via CSS em celular portrait (não `orientation.lock` — iOS
    Safari não suporta); "Nossa Plataforma" também teve um bug estrutural real corrigido (a
    seção sticky abaixo de 1024px tinha perdido `min-height:100svh`, cortando o texto das 4
    funcionalidades — ver ADR `docs/adr/0003-nossa-plataforma-mobile-estagio-de-altura-fixa.md`);
    "Nossa Perspectiva" (≤760px) virou um quadro 2×2 com fullscreen. Detalhe completo, incluindo
    duas correções feitas durante a verificação (dica de rotação que giraria junto com o
    conteúdo; e uma falsa suspeita de bug de entidade HTML em JSX, descartada depois de testar
    o `esbuild` real do projeto), em `roadmap.md`.

## Convenções ao editar

- Todo texto visível é em **português do Brasil**. Manter o tom sóbrio da marca.
- Comentários no código estão em português; seguir o idioma do arquivo.
- Aspas simples e ponto e vírgula nos arquivos `maiq/` e `sections/` (ver `.prettierrc`);
  rodar `npm run format` se houver dúvida.
- Alterações visuais precisam ser validadas em **desktop e celular, nos dois temas** — é a
  regra recorrente do `roadmap.md`.
- Ao concluir um ajuste de produto, atualizar o checklist em `roadmap.md`.
