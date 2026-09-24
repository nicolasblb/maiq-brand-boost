# Especificação — páginas legais no layout novo

**Status:** especificação fechada. Decisões nos itens **8** (22/09, antes do planejamento) e **9**
(Portão 1, após o planejamento dos agentes). Aguardando autorização para executar a Fase A.
Nada foi implementado ainda.
**Conteúdo de origem:** [`docs/conteudo-legal-atual.md`](./conteudo-legal-atual.md) — texto
literal extraído de `maiq.app.br/privacy-policy` e `/terms-of-use` em 22/09/2026.

**São três páginas**, não duas: `/politica-de-privacidade`, `/termos-de-uso` e a nova
`/politica-de-cookies`.

**Arquivos que serão tocados:**
- `src/components/LegalPage.tsx` — reescrito
- `src/routes/politica-de-privacidade.tsx`, `src/routes/termos-de-uso.tsx` — conteúdo real
- `src/routes/politica-de-cookies.tsx` — **novo**
- `src/components/maiq/SiteHeader.tsx`, `SiteFooter.tsx` — **novos** (item 2)
- `src/hooks/use-maiq-theme.ts`, `src/hooks/use-supabase-user.ts` — **novos** (itens 2 e 9)
- `src/routes/privacy-policy.tsx`, `src/routes/terms-of-use.tsx` — **novos**, só redirect 301 (item 9)
- `src/components/PaginaInstitucional.tsx`, `src/components/sections/Insights.tsx` — passam a usar os componentes extraídos
- `src/maiq.css` — estilos de `.maiq-legal`

---

## 1. Diagnóstico: o que existe hoje

As duas rotas já existem e renderizam um **texto provisório de três parágrafos** dentro de
[`LegalPage.tsx`](../src/components/LegalPage.tsx) — um `<main>` simples com `data-maiq-scope`,
largura máxima de 760px, `h1`, linha de "Última atualização" e um grid de parágrafos.

Quatro problemas a corrigir junto com o conteúdo:

| # | Problema | Evidência |
| --- | --- | --- |
| 1 | **Sem cabeçalho e sem rodapé.** A página é um beco sem saída: a única volta é um link de texto solto no fim. | `LegalPage.tsx` renderiza apenas `<main>` |
| 2 | **Sem tema.** A página é sempre escura. Quem está no tema claro e clica no rodapé cai numa página escura. | `LegalPage.tsx` não lê `localStorage['maiq-theme']` nem aplica `data-theme` |
| 3 | **`.maiq-legal` é classe morta.** Aplicada no componente, zero regras em `maiq.css`. | `grep -c "maiq-legal" src/maiq.css` → `0` |
| 4 | **O tema diverge entre rotas.** Home grava e lê `localStorage['maiq-theme']`; Insights sempre abre em `noite`; as legais não têm tema. | `PaginaInstitucional.tsx:334,374` vs. `Insights.tsx:69` |

O problema 4 é maior que as páginas legais — ver item 2 abaixo.

---

## 2. Arquitetura — decidido: opção B

O cabeçalho já existe **duplicado** em dois lugares: `PaginaInstitucional.tsx:729` e
`Insights.tsx:165`. Dar cabeçalho às páginas legais cria a terceira cópia.

**Opção A — copiar o cabeçalho (rápido, ~1h).**
Replica o markup do Insights nas páginas legais. Entrega o resultado visual pedido sem
mexer em nada mais. Custo: quatro cópias do mesmo cabeçalho para manter em sincronia; o
roadmap já registra "Uniformizar o menu entre Home e Insights" como trabalho feito à mão uma vez.

**Opção B — extrair `SiteHeader` / `SiteFooter` / `useMaiqTheme` primeiro (~3h). Recomendada.**
Um componente de cabeçalho, um de rodapé e um hook de tema que lê e grava
`localStorage['maiq-theme']`, usados por Home, Insights e as duas legais. Resolve o problema 4
de uma vez e faz as páginas legais nascerem certas. Risco: mexe no cabeçalho da Home, que tem
comportamento próprio (o voo da logo do hero para o slot do header, `setupLogoFlight`) — a
extração precisa manter esse slot como ponto de extensão, não achatá-lo.

**Decidido: opção B.** Executar nesta ordem:

1. `useMaiqTheme` — hook que lê e grava `localStorage['maiq-theme']`, devolve `theme` e `toggle`,
   e aplica `data-theme` no elemento de escopo. Home já faz isso (`PaginaInstitucional.tsx:334,374`);
   é extrair, não inventar.
2. `SiteFooter` — o mais simples, sem estado. Extrair do rodapé da Home
   (`PaginaInstitucional.tsx:1149`). **Passa a ter três links em Legal**: Política de privacidade,
   Termos de uso, Política de cookies.
3. `SiteHeader` — extrair do Insights (`Insights.tsx:165`), que é a versão sem o voo da logo.
   Expor uma prop opcional `logoSlotRef` para a Home encaixar o `setupLogoFlight` — **o slot tem
   que continuar sendo ponto de extensão, não pode ser achatado**, senão a animação da logo do hero quebra.
4. Trocar Home e Insights para os componentes novos, conferindo visualmente cada uma.
5. Só então montar as três páginas legais.

Ao migrar o Insights, corrigir o bug do tema: hoje ele abre sempre em `noite` porque não lê o
`localStorage` (`Insights.tsx:69`).

---

## 3. Layout da página

Estrutura vertical, do topo para baixo:

```
┌─ cabeçalho fixo (pílula flutuante, idêntico ao de /insights) ──────┐
│  logo Maiq · Home▾ · Sobre nós · Insights · [Fale Conosco] [Entrar]│
│                                        [toggle tema ☀/☾]           │
└────────────────────────────────────────────────────────────────────┘

        ← Voltar                                    (link discreto)

        Política de Privacidade e Uso de Dados       (h1)
        Versão 1.0 · 27 de março de 2026             (linha de versão)

        ─────────────────────────────────────────    (fio de seção)

        1. Introdução                                (h2)
        parágrafos...

        2. Dados que coletamos                       (h2)
        2.1 Dados fornecidos diretamente             (h3)
        • lista
        ...

        ─────────────────────────────────────────
        Versão: 1.0 | Data de vigência: 27/03/2026   (rodapé do documento)

┌─ rodapé do site (o mesmo da home) ─────────────────────────────────┐
│  logo · Contato: contato@maiq.app.br                               │
│  Legal: Política de privacidade | Termos de uso | Política de cookies │
│  © 2026 Maiq. Todos os direitos reservados.                        │
└────────────────────────────────────────────────────────────────────┘
```

### Medidas e tokens

Tudo em variáveis `--p-*` do escopo `[data-maiq-scope]`. **Nenhuma cor fixa** — senão o tema
claro quebra (ver `CLAUDE.md`).

| Elemento | Especificação |
| --- | --- |
| Container do texto | `max-width: 760px`, centralizado. Mantém a medida atual, próxima de `--measure-body` (62ch) e boa para leitura longa |
| Padding do `<main>` | `clamp(120px, 14vh, 168px)` no topo (precisa limpar o cabeçalho fixo de 64px + respiro) `clamp(24px, 5vw, 48px)` nas laterais |
| `h1` | `clamp(34px, 4vw, 52px)`, peso 600, `line-height: 1.06`, cor `--p-h1` |
| Linha de versão | 15px, cor `--p-muted`, `margin-top: 12px` |
| `h2` (seções numeradas) | 24px (`--fs-h3`), peso 600, cor `--p-text`, `margin-top: 44px`, `margin-bottom: 14px` |
| `h3` (subseções 2.1, 3.2…) | 19px, peso 500, cor `--p-text`, `margin-top: 26px`, `margin-bottom: 10px` |
| Parágrafo | 17px, `line-height: 1.7`, cor `--p-text-2`, espaçamento de 16px entre parágrafos |
| Lista | `list-style: disc`, recuo de 22px, itens com 8px de espaçamento, mesma cor do parágrafo |
| Links inline (e-mails) | cor `--p-mark-1`, sublinhado com `text-underline-offset: 3px`; hover → `--p-text` |
| Fio entre blocos | `1px solid var(--p-hair)` |
| Fundo | `--p-bg` no `<main>`; rodapé em `--p-footer-bg`, como na home |

### Tabela da seção 3 (Finalidades e Base Legal)

É a única tabela do conteúdo — três colunas: Finalidade · Base Legal (LGPD) · Artigo.

- Desktop: `<table>` real, largura 100%, cabeçalho em `--p-text` peso 600 com fio inferior
  `--p-hair-strong`, linhas separadas por `--p-hair-soft`, células com 12px vertical / 14px horizontal.
- **Mobile (< 640px):** não encolher a tabela. Converter para **lista de cartões** — um bloco por
  finalidade, com a finalidade como título e "Base legal" / "Artigo" como pares rótulo-valor.
  Alternativa aceitável: manter a tabela dentro de um `overflow-x: auto` com sombra de borda
  indicando o corte (o padrão já usado em "O Ciclo").

### Link "Voltar"

Acima do `h1`, seta `←` + texto, 15px, cor `--p-muted`, hover `--p-text`. Usar `<Link to="/">`
do TanStack Router (navegação client-side), **não** `<a href>`. O site atual usa um botão
ghost com ícone; aqui a versão em texto combina melhor com a sobriedade da marca.

---

## 4. Conteúdo

Usar o texto **literal** de [`conteudo-legal-atual.md`](./conteudo-legal-atual.md), sem reescrever.
Duas páginas:

**`/politica-de-privacidade`** — h1 "Política de Privacidade e Uso de Dados", 11 seções:
Introdução · Dados que coletamos (2.1, 2.2) · Finalidades e Base Legal *(tabela)* ·
Compartilhamento · Transferência Internacional · Retenção · Direitos do Titular ·
Segurança · Encarregado (DPO) · Alterações · Lei Aplicável e Foro.

**`/termos-de-uso`** — h1 **"Termos de Uso"** (decidido; o documento de origem diz "Termos de
Serviço"). 12 seções, **texto integral, sem adaptação**: Aceitação · Descrição dos Serviços ·
Cadastro e Contas (3.1, 3.2) · Planos, Preços e Pagamentos · Obrigações do Cliente ·
Confidencialidade · Propriedade Intelectual · Uso de IA · Limitação de Responsabilidade ·
Vigência, Suspensão e Rescisão · Alterações · Disposições Gerais.

> Decidido publicar como está. As seções 4 (planos, preços, cobrança mensal/anual, suspensão por
> inadimplência) descrevem uma oferta que o site institucional não apresenta hoje — cobrem a
> plataforma logada futura. **Não adaptar, não remover.**

### `/politica-de-cookies` — página nova, texto a escrever

Não há texto de origem: no site atual a "Política de Cookies" é apenas **mencionada** na seção 2.2
da Política de Privacidade, sem página correspondente.

Decidido escrever **já prevendo analytics**, com uma ressalva que evita prometer o que não existe:
as categorias não essenciais devem ser redigidas como **futuras**, deixando explícito que não estão
em uso hoje e que só serão ativadas mediante consentimento prévio por banner. Sem isso, o documento
descreveria um controle que o site não oferece.

Estrutura sugerida:

1. **O que são cookies** — definição curta.
2. **Cookies que utilizamos hoje** — apenas os estritamente necessários:
   sessão de autenticação do Supabase; preferência de tema (`localStorage['maiq-theme']`, que não é
   cookie, mas convém declarar). Dispensam consentimento sob a LGPD.
3. **Categorias que poderemos utilizar** — desempenho/analytics, personalização. Redigidas no
   futuro, com a nota de ativação mediante consentimento.
4. **Como gerenciar cookies** — instruções de bloqueio pelo navegador e aviso de que bloquear os
   necessários pode impedir o login.
5. **Terceiros** — quando houver; hoje, nenhum.
6. **Alterações e contato** — `contato@maiq.app.br`.

**Banner de consentimento: não portar agora** (decidido). Sem rastreamento, a LGPD não o exige para
cookies necessários. Quando o analytics entrar, banner e texto da categoria 3 entram juntos — e a
seção 3 desta página precisa sair do tempo futuro.

### Ajustes editoriais

- Marca: o texto de origem grafa **"MAIQ"** (caixa alta); padronizar para **"Maiq"**, como no resto do site.
- Foro: o original diverge — "Comarca de Rio de Janeiro" na Política, "Comarca do Rio de Janeiro"
  nos Termos. Padronizar para **"Comarca do Rio de Janeiro - RJ"**.
- Data: trocar o `updatedAt="Setembro de 2026"` (placeholder atual) por **27 de março de 2026**,
  a vigência real da versão 1.0.
- DPO (seção 9 da Política): **manter a redação provisória** e o e-mail genérico, como no site atual.

---

## 5. Metadados e SEO

As rotas de privacidade e termos já têm `head()` com título, description, og: e twitter:card —
**manter**, apenas ajustar a description para refletir o conteúdo real. A rota nova de cookies
precisa do bloco `head()` completo, no mesmo padrão. Acrescentar às três:

- `{ name: 'robots', content: 'index, follow' }` — páginas legais devem ser indexáveis.
- `<link rel="canonical">` para a URL definitiva, se o site antigo continuar no ar (evita
  conteúdo duplicado entre `maiq.app.br/privacy-policy` e a rota nova).

**Redirecionamentos:** o site atual usa `/privacy-policy` e `/terms-of-use`; o novo usa
`/politica-de-privacidade` e `/termos-de-uso`. Se o domínio for o mesmo, configurar 301 das
URLs antigas para as novas — há links externos e possivelmente contratos apontando para elas.

---

## 6. Acessibilidade e responsivo

- `<main>` como landmark, um único `h1` por página, hierarquia `h2` → `h3` sem pular nível.
- Numeração das seções faz parte do texto do heading ("1. Introdução"), o que já dá contexto
  ao leitor de tela — não usar `aria-label` redundante.
- Contraste mínimo AA nos dois temas. Atenção ao par `--p-text-2` sobre `--p-bg` no tema claro
  (`#68462B` sobre `#EEE0D4` ≈ 6.4:1, passa) e ao `--p-muted` da linha de versão
  (`#8A6038` sobre `#EEE0D4` ≈ 4.3:1, passa raspando em 15px — **verificar** antes de fechar).
- Largura de leitura preservada em telas grandes; sem rolagem horizontal em 360px.
- Testar nos dois temas e nas duas larguras, como manda o padrão do projeto.

---

## 7. Critérios de aceite

1. As **três** rotas renderizam o conteúdo completo, sem texto provisório.
2. Cabeçalho e rodapé presentes nas três, vindos de `SiteHeader` / `SiteFooter`.
3. Home e Insights continuam visualmente idênticas após passarem a usar os componentes extraídos —
   incluindo o voo da logo do hero para o header, na Home. **Exceção decidida no Portão 1:** o
   cabeçalho da Home passa a encolher em 640/430/360px, como o do Insights. É a única mudança
   visual esperada na Home.
4. O tema escolhido persiste ao navegar entre Home, Insights e as três legais, nos dois sentidos.
   O Insights deixa de abrir sempre em noturno.
5. O rodapé lista os três links de Legal, em todas as páginas.
6. A tabela da seção 3 da Política é legível em 360px sem rolagem horizontal da página.
7. Nenhuma cor fixa fora de `var(--p-*)`.
8. `npm run lint` e `npm run build` passam limpos.
9. Conferência visual em desktop e celular, nos temas noturno e diurno.

---

## 8. Decisões tomadas (22/09/2026)

| # | Questão | Decisão |
| --- | --- | --- |
| 1 | Título dos Termos | **"Termos de Uso"** — coerente com a rota e o link do rodapé |
| 2 | Foro divergente no original | Padronizar para **"Comarca do Rio de Janeiro - RJ"** |
| 3 | Termos descrevem SaaS com planos/preços que o site não oferece | **Publicar como está**, sem adaptar — cobrem a plataforma logada futura |
| 4 | Política de Cookies citada mas inexistente | **Criar a página** `/politica-de-cookies` |
| 5 | Conteúdo da página de cookies | **Já prever analytics**, com as categorias não essenciais redigidas como futuras |
| 6 | Banner de consentimento | **Não portar por ora** — entra junto com o analytics |
| 7 | DPO | **Manter a redação provisória** e `contato@maiq.app.br` |

### Contexto que sustentou as decisões

O site novo **não tem rastreamento algum** — verificado: nenhum Google Analytics, pixel, tag
manager ou script de terceiros em `src/` ou em `__root.tsx`. Os únicos cookies seriam os de sessão
do Supabase. O site antigo, em contraste, tem banner gravando `maiq_cookie_consent`,
`maiq_analytics_consent`, `maiq_ad_storage_consent` e `maiq_personalization_consent`.

É daí que vem a ressalva do item 5: sem essa redação no futuro, a página descreveria categorias de
cookies que não existem e prometeria um controle de consentimento que o site não oferece.

### Revisão jurídica

Nenhuma destas decisões é parecer jurídico — são decisões de produto e de redação. Os textos são da
versão 1.0 de 27/03/2026 e vão ao ar como estão, por escolha registrada. Se houver revisão de
advogado antes da publicação, ela deve olhar especialmente as seções 4 e 9 dos Termos (planos e
limitação de responsabilidade) e a nova página de cookies.

---

## 9. Decisões do Portão 1 (22/09/2026)

Tomadas após o planejamento dos agentes `architecture` e `frontend-design`. Complementam o item 8.

| # | Questão | Decisão |
| --- | --- | --- |
| 8 | Contraste de `--p-muted` no tema claro reprova no AA (4,26:1, verificado) | **Deixar para depois** — segue o token atual; registrado como pendência de acessibilidade |
| 9 | Cabeçalho da Home não tem regras responsivas | **Unificar** com o do Insights — a Home passa a encolher em telas estreitas |
| 10 | `/insights` não tem rodapé | **Incluir** o `SiteFooter` |
| 11 | 301 de `/privacy-policy` e `/terms-of-use` | **Rotas no próprio projeto**, com `redirect()` no `beforeLoad` |

### Refinamentos técnicos aprovados em bloco

Nenhum tem consequência visual; os dois primeiros são necessários para não quebrar o que existe.

1. **`logoSlot: ReactNode`** em vez de ref encaminhado — a Home passa a própria subárvore da logo,
   e o contrato da animação (`width:0`, `overflow:hidden`, filho com `opacity:0`) não vaza para um
   componente compartilhado por outras quatro rotas.
2. **Classes por parte** (`.maiq-site-header-logo`, `.maiq-site-nav`, `.maiq-site-header-cta`) no
   lugar dos seletores posicionais de `maiq.css:886-899`. **Necessário:** a regra atual
   `> div:first-child { margin-right:12px !important }` venceria a escrita inline de `paintLogo`
   e quebraria o voo da logo em telas estreitas.
3. **Hover do chrome em CSS**, não no runtime `data-hover-style`. **Necessário:** o runtime vive só
   em `PaginaInstitucional.tsx` e varre apenas o escopo da Home — os 4 `data-hover-style` do
   Insights são inertes hoje.
4. **Extrair `useSupabaseUser`** — quarta extração, além das três da spec original.
5. **Pílula de tema absorvida pelo `SiteHeader`** — hoje é markup irmão, duplicado.
6. **Tabela da LGPD:** `<table>` real no DOM em todas as larguras, virando cartões só por CSS
   abaixo de 640px, com `thead` em `sr-only` (nunca `display:none`).
7. **Preservar a estrutura de irmãos do rodapé** — o CSS usa `.maiq-footer-top+div`.
8. **Leitura de tema permanece dentro do efeito.** Ler `localStorage` de forma síncrona no
   `useState` eliminaria o flash, mas causaria mismatch de hidratação no SSR. O flash continua
   como hoje — sem regressão.

### Nota de execução

**Não rodar `npm run format`** sobre `PaginaInstitucional.tsx`: o arquivo tem 1186 linhas de estilo
inline denso e a reformatação geraria um diff irrevisável, escondendo a mudança real.

### Risco a reconferir

O terceiro link de Legal deixa o rodapé mais alto, e a altura do rodapé alimenta `S._fitFinal`
(`PaginaInstitucional.tsx:~537`), que define o `marginTop` do overlay e a altura do hold. A medição
se auto-ajusta em load e resize, mas o encaixe **"FAQ + rodapé em uma tela"** precisa ser conferido
em telas baixas (≤700px de altura) e nas larguras 640/430/360px.
