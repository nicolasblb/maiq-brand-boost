# 0001. Extrair o chrome compartilhado (useMaiqTheme, SiteFooter, SiteHeader)

- Status: Proposto
- Data: 2026-09-22

## Contexto

O cabeçalho do site existe hoje **duplicado**, em duas cópias divergentes:

- `src/components/PaginaInstitucional.tsx:729` — versão da Home, com o voo da logo do hero
  para o slot do header (`setupLogoFlight`, linha 467), tema aplicado de forma **imperativa**
  (`applyTheme`, linha 313, escrevendo em seis refs), sem classe CSS e sem regras responsivas.
- `src/components/sections/Insights.tsx:165` — versão sem voo, tema **declarativo**
  (`data-theme` no JSX), com classes `maiq-insights-*` que carregam as regras responsivas de
  640/430/360px em `src/maiq.css:886-899`.

Disso decorrem quatro problemas já registrados em `docs/spec-paginas-legais.md`:

1. O tema diverge entre rotas: a Home lê e grava `localStorage['maiq-theme']`
   (`PaginaInstitucional.tsx:334,374`), o Insights **sempre abre em `noite`**
   (`Insights.tsx:69`), e as páginas legais não têm tema algum.
2. As três páginas legais (duas existentes mais `/politica-de-cookies`) precisam do mesmo
   cabeçalho e do mesmo rodapé; copiá-lo criaria a terceira e a quarta cópia.
3. O rodapé só existe na Home (`PaginaInstitucional.tsx:1149`) e precisa passar a listar
   **três** links de Legal.
4. O runtime de hover por `data-hover-style` vive dentro de `PaginaInstitucional.tsx`
   (linhas 99 e 342) e varre apenas o escopo da Home. Os quatro atributos
   `data-hover-style` do Insights são **inertes hoje** — o que hover existe lá vem da classe
   CSS `.maiq-nav-item` (`maiq.css:865`). Um cabeçalho compartilhado não pode depender
   desse runtime, senão nasce com hover morto em `/insights` e nas legais.

Restrições do projeto (ver `CLAUDE.md`): TanStack Start com SSR (nada de `localStorage` fora
de efeito), TypeScript estrito, nenhuma cor fixa fora de `var(--p-*)`, e a pilha de revelação
por scroll da Home (`maiq-scroll-stack`, `maiq-platform-base`, `maiq-primary-overlay`,
`maiq-final-reveal-stage`, holds) é frágil a mudanças de estrutura.

A especificação já decidiu (item 2, "opção B") extrair antes de criar as páginas legais.
Este ADR registra **como** extrair, preservando o comportamento da Home.

## Decisão

Extrair quatro peças, nesta ordem, antes de qualquer trabalho de conteúdo legal:

1. **`src/hooks/use-maiq-theme.ts`** — fonte única do tema. Devolve `{ theme, dia, toggleTheme }`.
   Lê no primeiro efeito a preferência salva em `localStorage['maiq-theme']` e, na ausência
   dela, mantém a heurística que a Home já usa (6h–18h = diurno). Grava a cada troca. Aplica
   `document.body.style.background`. **Não** aplica `data-theme` no DOM: quem consome renderiza
   `data-theme={dia ? 'claro' : undefined}` no elemento `data-maiq-scope`, como o Insights já
   faz. Com isso o tema deixa de ser imperativo e o bug do Insights desaparece por construção.
2. **`src/hooks/use-supabase-user.ts`** — a mesma assinatura de `supabase.auth` duplicada em
   Home e Insights. Sem ele, as páginas legais criariam a terceira cópia; é a menor peça que
   evita isso. Acréscimo à spec, de natureza mecânica.
3. **`src/components/maiq/SiteFooter.tsx`** — extraído do rodapé da Home, sem estado, recebendo
   apenas `dia`. Passa a listar três links de Legal. **Preserva exatamente** a estrutura de
   classes e de irmãos atual (`.maiq-footer` > `.maiq-footer-top` + div de copyright), porque
   `maiq.css:497-503` depende de seletores descendentes e de um seletor de irmão adjacente
   (`.maiq-footer-top+div`) e porque a altura do rodapé alimenta a medição de
   `S._fitFinal` na pilha de revelação.
4. **`src/components/maiq/SiteHeader.tsx`** — extraído da versão do Insights (a sem voo),
   renderizando também o alternador de tema fixo. Interface:
   `{ dia, onToggleTheme, user, onEntrar, onFaleConosco, onSelectSection, logoSlot? }`.

O ponto sensível é o **voo da logo**. A decisão é expor o slot como
**`logoSlot?: ReactNode`**, não como um `ref` encaminhado:

- Sem `logoSlot`, o `SiteHeader` renderiza a logo estática de hoje (`Insights.tsx:180`) —
  é o que Insights e as três páginas legais usam.
- A Home passa o seu próprio subárvore de slot, com `headerSlotRef` e `headerLogoRef`
  intactos. Todo o markup que `setupLogoFlight` mede e muta (`slot.style.width`,
  `slot.style.marginRight`, `slot.style.overflow`, `mark.style.opacity`) continua sendo
  criado pelo render da Home, no mesmo arquivo em que a função vive.

A alternativa de encaminhar refs (`logoSlotRef`, mencionada na spec) foi descartada porque
transformaria `SiteHeader` em portador de um contrato invisível (largura inicial 0,
`overflow:hidden`, `opacity:0` no filho): qualquer ajuste futuro de layout dentro do
`SiteHeader` quebraria a animação da Home silenciosamente. `logoSlot` como `ReactNode`
mantém a superfície de mutação inteira dentro de `PaginaInstitucional.tsx`.

Duas decisões acessórias que sustentam a extração:

- **Hover do chrome vai para CSS**, não para o runtime `data-hover-style`. As duas ou três
  regras de hover do cabeçalho e do alternador viram classes em `maiq.css`, no mesmo padrão
  de `.maiq-nav-item`. Assim o cabeçalho funciona igual nas cinco rotas sem depender de um
  efeito que só existe na Home. O runtime permanece onde está, para o resto da Home.
- **As regras responsivas do cabeçalho passam a usar classes próprias por parte**
  (`.maiq-site-header`, `.maiq-site-header-logo`, `.maiq-site-nav`, `.maiq-site-header-cta`),
  em vez dos seletores posicionais atuais (`> div:first-child`, `> div:last-child`). Os
  seletores posicionais aplicados à Home atingiriam o slot da logo com
  `margin-right:12px !important`, que vence a escrita inline de `paintLogo` — exatamente o
  tipo de acoplamento que a extração deve eliminar.

## Alternativas consideradas

- **Opção A da spec — copiar o cabeçalho para as páginas legais.** ~1h contra ~3h, mas
  fecharia o site com quatro cópias do mesmo cabeçalho e deixaria o bug de tema do Insights
  de pé. Já descartada na spec (item 2); registrada aqui por completude.
- **`logoSlotRef` encaminhado pelo `SiteHeader`.** Menos código na Home, mas coloca o
  contrato da animação dentro de um componente compartilhado que outras três rotas também
  usam. Descartada pelo risco de quebra silenciosa.
- **Um componente `SiteChrome` que envolva a página inteira** (tema + usuário + diálogos +
  header + footer + `children`). Reduziria a duplicação em Insights e nas legais a quase
  zero, mas a Home não caberia nele — o rodapé dela vive dentro da pilha de revelação, não
  no fim do documento. Uma abstração que serve três das cinco rotas e obriga a exceção na
  quarta não se paga neste tamanho de projeto.
- **Manter o tema imperativo e apenas compartilhá-lo por contexto.** Preservaria byte a byte
  o comportamento da Home, mas propagaria seis refs e uma função de pintura para rotas que
  não precisam de nenhuma delas.
- **Adotar uma biblioteca de tema (next-themes e similares).** Dependência nova para
  resolver um booleano gravado em `localStorage`. Descartada.

## Consequências

- Positivas:
  - Uma definição de cabeçalho, rodapé e tema para as cinco rotas; o bug do `/insights`
    abrindo sempre em noturno deixa de existir por construção, não por correção pontual.
  - `PaginaInstitucional.tsx` perde o markup do cabeçalho, do rodapé e seis refs de tema —
    o arquivo de 1186 linhas encolhe e a parte que sobra é a que de fato é única da Home.
  - As páginas legais nascem com chrome e tema corretos, sem código novo de cabeçalho.
  - O hover do chrome passa a funcionar em `/insights` e nas legais (hoje inerte lá).
- Negativas / riscos:
  - Mexe no cabeçalho da Home, que hospeda o voo da logo. É o risco central; mitigado pelo
    `logoSlot` e por um ponto de verificação obrigatório depois da migração da Home.
  - Unificar as regras responsivas muda o cabeçalho da Home em telas estreitas: hoje ele não
    encolhe (e provavelmente transborda em 360px), o Insights sim. Unificar é o caminho
    recomendado, mas é **mudança visual** e precisa de autorização explícita.
  - O terceiro link de Legal aumenta a altura do rodapé; como o rodapé da Home é medido por
    `S._fitFinal` e compõe a tela final junto com o FAQ, o encaixe "FAQ + rodapé em uma tela"
    precisa ser reconferido em telas baixas.
  - As páginas legais passam a importar `AuthLeadDialogs` e, com ele, o cliente Supabase —
    uma página de texto carrega o chunk de autenticação. Aceito: é o mesmo chunk já usado
    pelas outras rotas e os botões "Entrar"/"Fale Conosco" precisam funcionar.
- Impacto em dados/migração: nenhum. Não há schema, tabela, migration nem chamada de rede
  nova. A única persistência tocada é `localStorage['maiq-theme']`, cuja chave e cujos
  valores (`claro` | `noite`) permanecem inalterados — preferências já salvas continuam
  válidas.
- Impacto de custo:
  - **Tokens**: `PaginaInstitucional.tsx` tem 1186 linhas de estilos inline densos; lê-lo
    inteiro custa caro por rodada. A implementação deve trabalhar por faixas de linha
    conhecidas (cabeçalho 729-800, rodapé 1149-1176, tema 313-335, refs 165-232, voo 467-503)
    e **não** rodar o formatador sobre o arquivo inteiro, para não gerar um diff que torna a
    revisão impossível.
  - **Build/bundle**: sem dependência nova. O código do chrome sai de dois arquivos e passa a
    um; o bundle tende a diminuir marginalmente.
  - **Runtime/serviços**: nenhum custo recorrente. O `useSupabaseUser` mantém o mesmo número
    de chamadas `auth.getUser()` por página que já existe hoje (uma), e as páginas legais
    passam a fazer uma — troca consciente pela consistência do botão "Conta".
