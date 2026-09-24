# 0003. "Nossa Plataforma" no mobile/tablet: estágio sticky de altura fixa em vez de altura de conteúdo

- Status: Proposto
- Data: 2026-09-23

## Contexto

Em larguras `≤1023px` o texto de cada funcionalidade (`.maiq-platform-copy`) fica
parcialmente (celular) ou totalmente (tablet) inacessível: a seção seguinte
("Nossa Perspectiva") entra por cima antes que o usuário consiga ler.

### Como a camada funciona hoje

Ordem visual real da Home (constante `SECOES` em `src/components/maiq/SiteHeader.tsx`):
`topo → modelo → fundacao (Convicção) → plataforma → ciclo → faq`. A lista de seções do
`CLAUDE.md` ("Nossa Plataforma" em 2º) descreve a ordem no DOM, não a ordem de leitura —
"Nossa Plataforma" é revelada **depois** de "Nosso Modelo" e "Nossa Convicção".

Dentro de `.maiq-scroll-stack` (`src/components/PaginaInstitucional.tsx:861-1042`):

1. `.maiq-platform-base` (`netWrapRef`) — `position:sticky`, `top:0` (fixado por JS),
   `z-index:0`, altura natural do conteúdo (`H`).
2. `.maiq-primary-overlay` (`overlayRef`) — `z-index:2`, `marginTop:-H`, portanto começa
   exatamente no topo da base e a cobre; contém "Nosso Modelo" + "Nossa Convicção".
3. `.maiq-platform-hold` (`platformHoldRef`) — espaçador de `height:H`.
4. `.maiq-final-reveal-stage` — "Nossa Perspectiva" + FAQ, mesma técnica.

`S._fitNet` (`PaginaInstitucional.tsx:474-487`) mede `net.offsetHeight` e escreve
`overlay.style.marginTop = -H` e `hold.style.height = H`. Roda no `mount` e em `resize`.

A consequência estrutural, já anotada em `src/maiq.css:758-760`: **a base é sticky ancorada
no topo e nunca rola dentro de si mesma**. A janela visível sobre ela é sempre no máximo
uma viewport (`0..100svh`). Conteúdo acima de `100svh` não fica "abaixo da dobra": fica
inalcançável para sempre. No desktop isso nunca aparece porque
`.maiq-platform-section{min-height:100svh}` e o cartão tem `height:min(46vh,529px)` —
`H ≈ 100svh` por construção.

### Por que quebra abaixo de 1024px

O `@media (max-width:1023px)` (`src/maiq.css:818-828`) inverte a invariante:
`.maiq-platform-section{min-height:0}`, `.maiq-platform-card{height:auto}`,
`grid-template-columns:1fr` e `.maiq-platform-media{aspect-ratio:1/1}`. A altura do
estágio passa a ser **dirigida pelo conteúdo**, e a altura da mídia passa a ser função da
**largura** da viewport — grandeza que não tem relação nenhuma com o espaço vertical
disponível.

Orçamento estimado (sem medição em navegador, só somando o CSS):

| | 768×1024 (tablet) | 390×844 (celular) |
| --- | --- | --- |
| `padding-top` da seção | 112 | 112 |
| título + subtítulo | ~73 | ~92 (subtítulo em 2 linhas) |
| `margin-top` do showcase | ~61 | 42 |
| abas + linha de progresso | ~70 | ~70 |
| `margin-top` do cartão | ~51 | 34 |
| mídia (`aspect-ratio:1/1`) | **720** | **350** |
| `.maiq-platform-copy` (`min-height`) | 290 | 320 |
| `padding-bottom` da seção | 96 | 96 |
| **total `H`** | **~1473** | **~1116** |
| viewport | 1024 | 844 |

No tablet o texto **começa** em ~1086px, ou seja, inteiramente fora da tela. No celular
sobram ~145px dos 320px do bloco de texto. Bate com o reportado.

### O que **não** é a causa

- Não há corte físico: `.maiq-platform-base{overflow:clip}` recorta na própria caixa, cuja
  altura é a do conteúdo — nada é cortado ali. Quem corta é a viewport.
- `.maiq-platform-hold` não tem altura fixa demais: `H` está **correto**. Ele reserva
  ~1473px de rolagem no tablet, o que só produz uma zona morta de ~450px em que nada se
  move; não é o que esconde o texto.
- Não é problema de `z-index` nem de isolamento.
- `S._fitNet` não está medindo errado. Recalcular mais vezes **não revela** o texto — o
  limite é a janela de uma viewport sobre um elemento sticky, não o valor medido.

### Fragilidades secundárias que só existem no layout dirigido por conteúdo

1. **Fontes com `display:swap`.** `_fitNet` roda no `mount`, com a fonte de fallback. Quando
   a Barlow entra, `H` muda e `marginTop`/`hold` ficam desatualizados → costura visível
   entre a overlay e a base. Não há re-medição no `document.fonts.ready` nem no `load`
   (o `PageLoader` até espera `fonts.ready`, mas não avisa ninguém).
2. **Troca de aba.** As 4 funcionalidades têm 2 ou 3 bullets. Hoje o `min-height` de
   290/320px absorve a diferença na maioria dos tamanhos, mas é coincidência, não garantia:
   em qualquer largura em que o texto ultrapasse o `min-height`, trocar de aba muda `H` sem
   que `_fitNet` rode.
3. **Barra de endereço do navegador móvel.** Hoje o `resize` recalcula `H` a cada
   recolhimento da barra, com salto na posição do `hold`.

Essas três desaparecem se `H` deixar de depender do conteúdo.

## Decisão

Restaurar, abaixo de 1024px, a mesma invariante que o desktop já respeita:
**o estágio sticky de "Nossa Plataforma" tem exatamente uma viewport de altura, e o conteúdo
é dimensionado para caber dentro dela.**

Concretamente:

1. `.maiq-platform-section` volta a ter `min-height:100svh` no `@media (max-width:1023px)`
   (remover o `min-height:0`), mantendo `box-sizing:border-box`.
2. O cartão deixa de ter altura dirigida por conteúdo. A mídia **não pode mais usar
   `aspect-ratio`** — passa a ter altura em unidade vertical (`clamp(..., Nsvh, ...)`), e o
   bloco de texto ocupa o restante.
3. Se, no pior caso razoável (tela mais baixa suportada × funcionalidade com mais texto), o
   texto ainda não couber, adotar o **padrão já usado pelo FAQ** (`src/maiq.css:316-380`):
   estágio de altura fixa com `overflow:hidden` e **um único** contêiner interno com
   `min-height:0; overflow-y:auto` — aqui, `.maiq-platform-copy`. É o precedente do projeto
   para "estágio sticky com mais conteúdo do que cabe", já validado em produção.
4. `S._fitNet` **não muda de mecanismo**. Como `H` volta a ser `100svh`, a medição no
   `mount` passa a ser estável: `svh` não muda com a barra de endereço, não muda com a troca
   de aba e não muda com o swap de fonte.
5. Como reforço barato e de baixo risco, re-executar `S._fitNet` (e `S._fitFinal`) uma vez
   quando `document.fonts.ready` resolver. É idempotente e cobre o caso de a altura medida
   no `mount` ainda refletir a fonte de fallback.

O desenho visual do cartão compacto (faixa de mídia + botão de tela cheia) é do agente
`frontend-design`; esta decisão fixa apenas a regra de medição e as restrições que o desenho
precisa respeitar.

### Restrições que o desenho precisa respeitar

- **Nada de `aspect-ratio` na faixa de mídia.** Foi a causa raiz. A altura da faixa precisa
  ser função da altura da viewport (`svh`), não da largura.
- **Orçamento vertical.** Descontando `padding` da seção (112+96), título/subtítulo, abas e
  margens, sobram ~385px para o cartão inteiro em 390×844 e ~600px em 768×1024. Reduzir o
  `padding` vertical da seção no mobile (ex.: 88/56) libera ~64px e é o ajuste mais barato —
  o topo precisa continuar abaixo do header flutuante (~76px: `top` 10-20px + `height` 56px).
- **O `min-height` de `.maiq-platform-copy` (290/320px) tem de sair** ou virar um valor
  muito menor: ele é parte do que estoura o orçamento e não tem função num layout de altura
  fixa.
- **Se houver scroll interno, só um.** Dois contêineres roláveis aninhados dentro de um
  estágio sticky em touch é o cenário que o projeto já evita.
- **O modal de tela cheia é a válvula de escape** para o conteúdo que não couber na faixa —
  ele é `position:fixed` fora da pilha e não interfere em `_fitNet`.

## Alternativas consideradas

- **Só re-medir (`ResizeObserver` na base, recálculo na troca de aba).** Não resolve: o
  texto continua fora da viewport porque o elemento é sticky e não rola internamente. Corrige
  só as costuras secundárias. Adiciona um observer num caminho reconhecidamente frágil sem
  entregar a correção pedida. Rejeitada como solução principal (o item 5 acima aproveita a
  parte útil, num evento único em vez de contínuo).
- **Tirar "Nossa Plataforma" da pilha sticky abaixo de 1024px** (`position:static`,
  `marginTop:0`, `hold` com altura 0). Tecnicamente simples e elimina a classe inteira do
  bug. Mas inverte a ordem de leitura no mobile: em fluxo normal a Plataforma passaria a vir
  **antes** de "Nosso Modelo"/"Nossa Convicção", contrariando a narrativa e o submenu. Se
  fosse adotada, a pilha inteira precisaria virar fluxo normal no mobile, o que é um
  redesenho do capítulo de scroll, não uma correção. Rejeitada para esta rodada; é a saída
  natural caso o conteúdo, mesmo compacto, não caiba.
- **Dar scroll interno à base inteira** (`.maiq-platform-base{height:100svh;overflow-y:auto}`).
  Cria um scroll aninhado sobre toda a seção em touch: o dedo fica "preso" até esgotar o
  conteúdo interno. Pior UX que dar scroll só ao bloco de texto (opção 3 da decisão) e
  arrisca conflitar com o `touch-action` da cena do data room.
- **Encolher o conteúdo por `transform:scale()`.** Mantém tudo visível com uma linha de CSS,
  mas derruba a legibilidade abaixo do mínimo e confunde a medição (`offsetHeight` ignora o
  `transform`, então `_fitNet` reservaria a altura errada). Rejeitada.

## Consequências

- **Positivas:** o texto volta a ser legível em mobile/tablet; `H` volta a ser uma constante
  (`100svh`) em todas as larguras, o que remove três modos de falha latentes (swap de fonte,
  troca de aba, barra de endereço); a zona morta de ~450px de rolagem no tablet desaparece;
  o mecanismo de revelação e o `_fitNet` ficam idênticos em desktop e mobile, reduzindo a
  superfície de manutenção.
- **Negativas / riscos:** o conteúdo do cartão fica espremido em telas pequenas e baixas, e
  pode exigir scroll interno no bloco de texto; `100svh` é a viewport *pequena*, então com a
  barra de endereço recolhida pode sobrar uma faixa de alguns pixels do fundo da pilha
  abaixo da base — é o mesmo trade-off já aceito em `.maiq-final-content{height:100svh}`.
- **Impacto no comportamento visual / na pilha de revelação:** toca `min-height` de uma
  `div` da pilha — exatamente o que o `CLAUDE.md` marca como frágil. Mas é uma **reversão**
  para a regra que o desktop já usa, não uma regra nova. Validação obrigatória, nos dois
  temas, em 390×844, 430×932, 768×1024, 820×1180, 1024×768 (paisagem) e 1280×800/1440×900:
  (a) a base de "Nossa Plataforma" ocupa exatamente uma tela, sem faixa de fundo sobrando;
  (b) o texto das **4** funcionalidades é legível por inteiro, com autoplay rodando;
  (c) não há costura entre "Nossa Convicção" e "Nossa Plataforma" durante a revelação;
  (d) "Nossa Perspectiva" só cobre a Plataforma depois do `hold`;
  (e) o menu "Home → Nossa Plataforma" (`goToSection`, que usa `platformHoldRef`) para no
  lugar certo; (f) o mesmo para "FAQ", garantindo que `_fitFinal` não regrediu;
  (g) recarregar com cache frio (fonte em swap) e conferir que não sobra vão.
- **Impacto de custo:** nenhum. Mudança de CSS e, no máximo, um `document.fonts.ready.then()`
  já existente no ciclo de vida da página. Zero bytes de dependência nova, zero requisições,
  zero chamadas ao Supabase, nenhum efeito no worker. Marginalmente **positivo** no cliente:
  menos área de layout e menos recálculo de `H` durante o scroll móvel.
