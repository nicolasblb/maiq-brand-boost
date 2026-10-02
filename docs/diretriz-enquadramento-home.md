# Diretriz — enquadramento das seções da Home (desktop e tablet)

**Status:** rascunho inicial (01/10/2026). As regras da seção 3 valem como base; as decisões da
seção 6 ainda estão abertas. Nenhuma seção foi reestruturada por esta diretriz ainda.
**Escopo:** página inicial (`PaginaInstitucional.tsx` e seções em `sections/` e `maiq/`), em
telas a partir de **761px de largura**. O **mobile (até 760px) fica fora**. O FAQ entra por
último, em ajuste individual.

Todo ajuste de altura, posição ou tamanho na Home, em desktop ou tablet, deve partir deste documento:
primeiro a ficha da seção (seção 5), depois o código.

---

## 1. Objetivo

No desktop e no tablet, cada seção da Home precisa **caber inteira na tela, com folga**, e
manter a **proporção entre os elementos** em qualquer tamanho de janela, sem saltos durante o
redimensionamento. O desafio está nas telas pequenas (notebooks com zoom de 125%, janelas
baixas, tablets). Nas telas grandes o resultado atual já é bom e deve ser preservado.

## 2. O que já tentamos e por que não bastou

| Tentativa | Como funcionava | Problema |
|---|---|---|
| Ajustes por peça | Degraus de `max-height` reduziam só o Venn (12 degraus), o vídeo, a fonte da Convicção ou o quadro da Perspectiva | Desproporção: uma peça encolhia, o resto ficava cheio. Os degraus só valiam acima de 931px de largura |
| Espaços em `vh` | Espaços internos com `clamp(…vh…)` | Encolhiam junto com as peças, de forma desigual |
| Zoom calculado em JS (`_fitZoom`, 01/10/2026) | Mede o conteúdo e aplica `zoom` na seção inteira | Proporcional, mas recalcula só depois que a janela para (debounce de 240 e 600ms): o conteúdo **salta**. Depende de medição e de corridas de tempo |

**Lição:** o encaixe tem que ser **declarativo (CSS)**, contínuo, e valer para a seção como um todo.

---

## 3. Regras base

### R1. Cada seção é um quadro do tamanho da tela
No desktop e no tablet, toda seção da pilha ocupa `100vh` de altura e 100% da largura. As
posições são planejadas dentro desse quadro. A pilha de rolagem (sticky, holds, margens
negativas) não muda de estrutura (ver R9).

### R2. Faixas: onde cada bloco começa e termina
- **Vertical:** em **% da altura do quadro**. Exemplo: título de `y=12%` a `y=20%`.
- **Horizontal:** em **% da largura do quadro**. Exemplo: bloco de conteúdo de `x=20%` a `x=80%`.
- As faixas somam 100% em cada eixo, margens incluídas, sem sobreposição (salvo decisão explícita).
- **Textos são medidos e especificados pelo desenho das letras** (decisão de 01/10/2026): do topo
  da letra mais alta ao fim da letra que mais desce. Nunca pela área da fonte (a faixa que o
  navegador reserva para a linha), que inclui folgas invisíveis acima das maiúsculas (acentos) e
  abaixo da linha de base (letras como "p", "g", "ç"). Exemplo: no título de 58px de "Nosso Modelo",
  a área da fonte tinha 13px (1,44% de 900) de folga acima e 13px abaixo. Como "Nosso Modelo" não
  tem letras descendo, o espaço até o subtítulo parecia 7,4% quando a tabela dizia 5%. Formas,
  barras e caixas (Venn, chips, vídeo) continuam medidas pela borda.
- As tabelas do Hero e a medição original de "Nosso Modelo" foram feitas pela área da fonte, antes
  dessa convenção. Ao revisá-las, remedir pelas letras.

### R3. Tamanhos: uma unidade só, tirada do menor eixo
Fontes, formas, vídeo, ícones e espaços internos **não** seguem um eixo sozinho. Se
seguissem, as pílulas se achatariam no desktop baixo e os títulos estourariam a largura no tablet.

Todos usam a **unidade de quadro** `--u`, definida sobre um **quadro de referência de 1440×900**:

```css
--u: min(calc(100vh / 900), calc(100vw / 1440));   /* 1u = 1px no quadro de referência */
font-size: calc(58 * var(--u));                     /* título de 58px na referência */
```

- Em 1440×900, 1u = 1px: a página fica idêntica ao projeto de referência.
- Em 1536×703, 1u = 0,78px: tudo em 78%, sem deformar.
- O elemento ocupa a faixa de R2 com o maior tamanho que caiba sem distorcer. Faixa e
  tamanho precisam ser coerentes: a ficha de cada seção confere isso nos tamanhos da R10.

### R4. Piso de legibilidade e teto de crescimento
- **Piso:** nenhum texto abaixo de **12px**; rótulos pequenos (letras espaçadas) no mínimo
  **11px**. Usar `max(12px, calc(N * var(--u)))`.
- **Teto:** acima do quadro de referência, os elementos param de crescer em **1u = 1px** (a
  definir, ver D3) e o conteúdo fica centralizado. Isso preserva o resultado atual em telas grandes.

### R5. Margens de segurança
- **Topo:** precisa livrar o header flutuante (altura fixa: 84px, ou 66px em telas de até
  700px de altura). Regra proposta: `max(108px, 12%)` (ver D1).
- **Base:** mínimo de **65px** até o último elemento visível. A medida é até o que o olho vê
  (texto, logos), não até a caixa.
- **Hero:** a camada seguinte invade 24px da base do Hero. A margem de base dele desconta esses 24px.

### R6. CSS primeiro, JS só onde já existe
- O encaixe é feito em CSS (unidades, `clamp`, `min`/`max`, grid/flex). Nada de código que
  mede a seção para decidir tamanho.
- Componentes que já medem a tela continuam medindo, mas **aceitam o tamanho que o CSS der**:
  o hover do Venn (`setupDna`) e o fluxo da Perspectiva (`Ciclo.tsx`, `layout()`).
- Medida tirada com `getBoundingClientRect` e gravada em estilo precisa estar na mesma
  escala do elemento que a recebe.

### R7. Rolagem contínua como saída de emergência
Abaixo de um limite de janela (ver D4), a Home deixa de ser uma pilha de quadros e vira rolagem
contínua (`data-maiq-layout="flat"`, o mesmo modo do celular deitado), com os elementos no tamanho
de referência. A troca é por **media query** (altura e proporção), não por medição. Tem de ser
reversível: ao crescer a janela, a pilha volta. A volta foi corrigida em 01/10/2026 e precisa
ser retestada a cada mudança.

### R8. Navegação pelo menu
O menu "Home" (`goToSection`) alinha o topo do quadro da seção ao topo da tela. Como cada
seção ocupa a tela inteira e cabe nela, o enquadramento sai certo por construção. A conferência
ao fim da rolagem (`sectionScrollTarget`) continua como proteção.

### R9. O que não mudar
- Estrutura da pilha: `position`, `z-index` e `min-height` de `maiq-scroll-stack`,
  `maiq-platform-base`, `maiq-primary-overlay`, `maiq-final-reveal-stage` e `maiq-*-hold`.
- Mobile (até 760px), tema e tokens de cor (`var(--p-*)`, nunca cor fixa) e textos.

### R10. Validação obrigatória a cada ajuste

| Tamanho | Por quê |
|---|---|
| 1920×1080 | tela grande (deve ficar como hoje) |
| 1440×900 | quadro de referência |
| 1536×703 | notebook 1080p com zoom de 125% (o mais crítico) |
| 1366×657 | notebook 1366×768 com barra do navegador |
| 1280×720 | notebook pequeno |
| 1024×768 | tablet deitado |
| 820×1180 | tablet em pé |
| altura < limite da D4 | entrada na rolagem contínua |

Em cada tamanho: os dois temas; navegação pelo menu para todas as seções (inclusive vindo de
/insights); redimensionamento contínuo da janela, sem saltos; varredura completa de rolagem nos
dois sentidos; margens da R5 medidas. Registrar o resultado no `roadmap.md`.

---

## 4. Modelo de ficha por seção

Cada seção ganha uma ficha (seção 5) antes de ser implementada.

```md
### <Seção>

**Faixas verticais** (% da altura do quadro)
| Elemento | Início | Fim | Observação |
|---|---|---|---|
| Margem superior | 0% | 12% | mínimo 108px (R5) |
| Título | 12% | 20% | |
| … | | | |
| Margem inferior | 92% | 100% | mínimo 65px até o visível |

**Faixas horizontais** (% da largura do quadro)
| Elemento | Início | Fim | Observação |
|---|---|---|---|
| Margem esquerda | 0% | 20% | |
| Bloco de conteúdo | 20% | 80% | |
| Margem direita | 80% | 100% | |

**Tamanhos de referência** (no quadro de 1440×900, em u)
| Elemento | Tamanho | Piso |
|---|---|---|
| Título | 58u | — |
| Texto | 17u | 12px |

**Comportamentos específicos:** hover, animações, vídeo, interação.
**Aprovação:** capturas em 1536×703, 1366×657, 1024×768 e 820×1180 → ok do usuário em dd/mm.
```

---

## 5. Fichas das seções

Ordem de trabalho (definida pelo usuário em 01/10/2026): **Hero (piloto)** → Nosso Modelo →
Nossa Convicção → Nossa Plataforma → Nossa Perspectiva → FAQ.

### Hero — piloto · *implementado em 01/10/2026 (aguardando teste do usuário)*

**Tabela aprovada pelo usuário (01/10/2026):** a medição abaixo com o bloco inteiro 0,8% mais baixo
(título 28,0–44,7%, divisória 47,7–47,9%, subtítulo 51,4–54,5%, divisória 58,1–58,3%, rótulo
62,0–63,6%, chips 66,0–70,0% e 71,1–75,1%, margem inferior 75,1–100%) e faixas de chips com a
largura do título (18,1–81,9%). Demais faixas horizontais sem mudança.

**Implementação** (`maiq.css`, bloco "Quadro proporcional"): tamanhos e posições em `u`; o
quadro de 1440×900u fica centralizado na tela; topo das letras do título em 252u (28%). Logo
grande em x=3,3% com 44u de altura. Hero fora do `_fitZoom`.

**Resultado medido** (topo das letras de cada elemento, % da altura):

| Tamanho | Título | Subtítulo | Rótulo | Chips 2 (fim) | Observação |
|---|---|---|---|---|---|
| 1440×900 | 28,0% | 51,4% | 62,0% | 75,1% | idêntico à tabela |
| 1536×703 | 28,0% | 51,4% | 62,1% | 75,7% | u = 0,78; rótulo e chips no piso de 12px empurram os chips 0,6% |
| 1366×657 | 28,0% | 51,4% | 62,2% | 75,9% | u = 0,73; idem |
| 1024×768 | 31,6% | 51,2% | 60,1% | 71,7% | u = 0,71 pela largura: quadro centralizado, sobra altura |
| 820×1180 | 40,4% | 50,6% | 55,4% | 61,6% | u = 0,57 pela largura: tudo pequeno e muita altura livre (D2) |
| 1920×1080 | 31,7% | 51,2% | 60,0% | 70,9% | teto (u = 1): tamanho de referência, centralizado |

Na horizontal, as faixas valem exatamente na referência e quando a largura é o eixo menor. Em
telas mais largas que 16:10 (ex.: 1536×703), os elementos ficam proporcionalmente mais estreitos
e centralizados (R3: o tamanho segue o menor eixo). Ex.: título em 26,6–73,4% em 1536×703.

**Medição original** (01/10/2026, antes do ajuste), com a página no topo, sem zoom aplicado. Textos medidos pela área das
letras (inclui o respiro da altura de linha), não pela caixa. Ordem de leitura de cima para
baixo; espaços e margens explícitos para as faixas somarem 100%.

**Faixas verticais** (% da altura da tela)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Margem superior | 0% – 27,2% | 27,2% | contém o header (2,2–9,3%) e a logo grande |
| Título | 27,2% – 43,9% | 16,7% | 2 linhas; 66px |
| Espaço | 43,9% – 46,9% | 3,0% | |
| Divisória longa | 46,9% – 47,1% | 0,2% | 1px |
| Espaço | 47,1% – 50,6% | 3,5% | |
| Subtítulo | 50,6% – 53,7% | 3,1% | 1 linha; 23px |
| Espaço | 53,7% – 57,3% | 3,6% | |
| Divisória curta | 57,3% – 57,5% | 0,2% | 1px |
| Espaço | 57,5% – 61,2% | 3,7% | |
| Rótulo | 61,2% – 62,8% | 1,6% | 12px, letras espaçadas |
| Espaço | 62,8% – 65,2% | 2,4% | |
| Faixa de chips 1 | 65,2% – 69,2% | 4,0% | chips de 36px, texto 15px |
| Espaço | 69,2% – 70,3% | 1,1% | 10px |
| Faixa de chips 2 | 70,3% – 74,3% | 4,0% | |
| Margem inferior | 74,3% – 100% | 25,7% | a seção seguinte cobre de 97,3% em diante (24px) |

**Faixas horizontais** (% da largura da tela)

| Elemento | 1440×900 | Largura | Observação |
|---|---|---|---|
| Header (flutuante) | 32,2% – 67,8% | 35,6% | fixo, largura pelo conteúdo |
| Logo grande | 3,3% – 13,6% | 10,3% | fixa no canto; voa para o header ao rolar |
| Título | 18,1% – 81,9% | 63,8% | largura máxima de 30 caracteres |
| Divisória longa | 41,0% – 59,0% | 18,0% | máx. 260px |
| Subtítulo | 25,4% – 74,6% | 49,2% | |
| Divisória curta | 41,0% – 59,0% | 18,0% | mesma largura da longa |
| Rótulo | 39,7% – 60,3% | 20,6% | |
| Faixas de chips | 12,7% – 87,3% | 74,6% | bordas esmaecidas; rolam em loop |

Outros tamanhos medidos (mesmo dia), para comparação:

| Elemento | 1536×703 (notebook com zoom de 125%) | 1024×768 (tablet deitado) | 820×1180 (tablet em pé) |
|---|---|---|---|
| Título | y 20,9% – 42,8% · x 19,3% – 80,7% · 68px | y 26,8% – 40,7% · x 18,1% – 81,9% · 47px | y 35,2% – 43,0% · x 16,1% – 83,9% · 40px |
| Divisória longa | y 46,6% – 46,8% | y 44,4% – 44,6% | y 45,5% |
| Subtítulo | y 51,3% – 55,3% · x 26,9% – 73,1% · 23px | y 48,7% – 51,3% · x 24,1% – 75,9% · 17px | y 48,3% – 49,8% · x 21,5% – 78,5% · 15px |
| Divisória curta | y 59,9% – 60,1% | y 55,7% – 55,8% | y 52,6% – 52,7% |
| Rótulo | y 64,9% – 66,9% | y 60,2% – 62,1% | y 55,5% – 56,7% |
| Faixa de chips 1 | y 69,5% – 74,6% · x 12,5% – 87,5% | y 64,5% – 69,2% · x 13,7% – 86,2% | y 59,1% – 62,1% · x 14,7% – 85,3% |
| Faixa de chips 2 | y 76,0% – 81,1% | y 70,5% – 75,2% | y 63,0% – 66,0% |
| Margem inferior | 81,1% – 100% | 75,2% – 100% | 66,0% – 100% |

### Nosso Modelo · *implementado em 01/10/2026 (aguardando teste do usuário)*

**Tabela aprovada pelo usuário (01/10/2026):** título 19,0–26,8%; subtítulo 31,8–35,0%; Venn
40,0–68,9%; números 73,9–79,4%; barras 80,8–81,1%; rótulos 82,8–84,8%; margem inferior 15,2%
(espaços de 5% entre título, subtítulo, Venn e números). Horizontal: colunas dos números em
15–35%, 40–60% e 65–85%; demais sem mudança. Decisões: o Venn **mantém a proporção** (fica com
41,6% de largura, 29,2–70,8%) e os rótulos **sobem para 15px** para preencher os 2,0%.

**Implementação:** o conteúdo interno (`.maiq-model-inner`) é escrito em px do quadro de
referência e reduzido inteiro por `zoom: var(--uf)`. `--uf` é o mesmo u, como número,
calculado só a partir do tamanho da janela, a cada resize, sem atraso. Escolhido porque o Venn
tem dezenas de medidas em px e o hover (`setupDna`) calcula sobre elas; o hover passou a ler o
zoom real da seção. Venn com `zoom: .8445`. Rótulos sem quebra de linha (com o piso de 12px, o
terceiro quebrava em 1366×657). Seção fora do `_fitZoom`.

**Resultado medido:** 1440×900, 1536×703 e 1366×657 com todas as faixas a até 0,1% da tabela.
Telas em que a largura limita (1024×768, 820×1180) e a tela grande (1920×1080, no teto) ficam
com o quadro centralizado. Ponto em aberto: com o Venn menor, os textos internos dele ficam com
~8–10px em 1366×657–1536×703 (11px na referência).

**Ajuste visual (01/10/2026, pedido do usuário):** o espaço entre título e subtítulo media 5% pela
área da fonte, mas o olho via 7,4%. Ajustado para **5% entre as letras**. O Venn, os números e os
rótulos subiram junto, para manter 5% visuais também entre subtítulo e Venn e entre Venn e números.
Faixas resultantes, medidas pelas letras (iguais em 1440×900, 1536×703 e 1366×657, ±0,1%):

| Elemento | Faixa visual | Altura |
|---|---|---|
| Margem superior | 0% – 20,4% | 20,4% |
| Título (letras) | 20,4% – 25,3% | 4,9% |
| Espaço | 25,3% – 30,3% | 5,0% |
| Subtítulo (letras) | 30,3% – 32,6% | 2,3% |
| Espaço | 32,6% – 37,6% | 5,0% |
| Venn | 37,6% – 66,5% | 28,9% |
| Espaço | 66,5% – 71,5% | 5,0% |
| Números (caixa de 49px; os algarismos ocupam menos) | 71,5% – 77,0% | 5,5% |
| Espaço | 77,0% – 78,4% | 1,4% |
| Barras | 78,4% – 78,8% | 0,3% |
| Espaço | 78,8% – 80,9% | 2,1% |
| Rótulos (letras) | 80,9% – 82,1% | 1,2% |
| Margem inferior | 82,1% – 100% | 17,9% |

**Medição original** (01/10/2026, antes do ajuste):

Medido em 01/10/2026 em 1440×900, seção alinhada ao topo da tela (como pelo menu), sem zoom.
Textos medidos pela área das letras; números pela caixa (altura de linha 1). O header flutuante
ocupa 2,2–9,3% (sobre a margem superior).

**Faixas verticais** (% da altura da tela)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Margem superior | 0% – 19,2% | 19,2% | contém o header |
| Título | 19,2% – 27,0% | 7,8% | 58px |
| Espaço | 27,0% – 28,0% | 1,0% | |
| Subtítulo | 28,0% – 31,2% | 3,2% | 1 linha; 23px |
| Espaço | 31,2% – 35,7% | 4,5% | |
| Venn (pílulas) | 35,7% – 69,9% | 34,2% | 710×308px; os textos laterais do hover ficam em 51,9–64,5% |
| Espaço | 69,9% – 74,3% | 4,4% | |
| Números | 74,3% – 79,8% | 5,5% | 49px ("R$" e "M" com metade) |
| Espaço | 79,8% – 81,2% | 1,4% | |
| Barras | 81,2% – 81,5% | 0,3% | 3px |
| Espaço | 81,5% – 83,2% | 1,7% | |
| Rótulos dos números | 83,2% – 84,8% | 1,6% | 12px, letras espaçadas |
| Margem inferior | 84,8% – 100% | 15,2% | |

**Faixas horizontais** (% da largura da tela)

| Elemento | 1440×900 | Largura | Observação |
|---|---|---|---|
| Título | 36,5% – 63,5% | 27,0% | |
| Subtítulo | 16,5% – 83,5% | 67,0% | |
| Venn (pílulas) | 25,3% – 74,7% | 49,4% | conteúdo interno reduz junto, como um bloco |
| Texto lateral esquerdo (hover) | 7,4% – 23,4% | 16,0% | só aparece com tela de 1330px ou mais |
| Texto lateral direito (hover) | 76,6% – 92,8% | 16,2% | idem |
| Bloco de números | 8,3% – 91,7% | 83,4% | 3 colunas; barras na largura de cada coluna |
| Coluna 1 (32) | 8,3% – 33,5% | 25,2% | |
| Coluna 2 (R$ 291 M) | 37,4% – 62,6% | 25,2% | |
| Coluna 3 (16) | 66,5% – 91,7% | 25,2% | |

### Nossa Convicção · *implementada em 01/10/2026 (aguardando teste do usuário)*

**Revisão de 01/10/2026 — CTA "Mais Detalhes" (para /sobre-nos) abaixo do texto.** Proposta minha, aguardando
validação visual. Com 17px, texto + CTA somariam 43% de altura (o vídeo tem 36%); o texto passou a 16px
(entrelinha 1,55, espaço entre parágrafos 12px, mesmas quebras 3/4/3). Medido em 1440×900: parágrafos
38,3–45,4% · 47,9–57,7% · 60,2–67,3%; CTA 70,4–75,1% (x 15,6–26,2%, 42px); vídeo 38,3–74,3% (topo
alinhado à 1ª linha do texto, centralizado na coluna); linha decorativa 36,6–76,0%; rótulo 80,0–81,4%;
logos 82,9–86,9%; margem inferior 13,1%. A linha decorativa (1px) passou a compensar o zoom
(`calc(1px / var(--uf))`): sem isso ficava com menos de 1px na tela e sumia em alguns tamanhos.

**Tabela aprovada pelo usuário (01/10/2026)**, pelas letras: título 20,4–25,3% · subtítulo
30,3–32,6% · vídeo 37,6–73,6% · rótulo 78,6–80,1% · logos 81,6–85,6% · margem inferior 14,4%.
Texto ao lado: linha 39,4–71,8%; parágrafos 40,9–48,7%, 51,7–62,6%, 65,6–70,4%. Horizontal:
linha 13,8%; texto 15,6–40,0%; vídeo 45–85% (576×324, fecha em 16:9); rótulo 40–60%; carrossel
20–80%. Decisões: título em 58px alinhado ao de "Nosso Modelo" (a cauda do "ç" desce ~1%);
rótulo centralizado em 40–60%, o que o faz quebrar em 2 linhas.

**Implementação:** mesmo modelo de "Nosso Modelo" (px do quadro de referência + `zoom: var(--uf)`).
Logos 14% menores (`zoom: .857` na faixa). Largura do rótulo em `em` (acompanha o piso de 12px e
mantém 2 linhas). Seção fora do `_fitZoom`.

**Resultado medido (1440×900):** título 20,4% (linha de base 25,3%; "ç" até 26,3%) · subtítulo
30,3–32,6% · vídeo 37,6–73,6% · parágrafos 41,0–48,8%, 51,9–62,7%, 65,7–70,5% · rótulo
78,6–82,4% (2 linhas) · logos 83,9–87,9% · margem inferior 12,1%. Desvios em relação à tabela:
(1) a coluna de texto ficou com 15,6–40,2% (+2,6px): com 40,0% o 1º parágrafo quebrava em 4
linhas; o espaço até o vídeo caiu de 5,0% para 4,8%. (2) O rótulo em 2 linhas ocupa 3,8% (e não
1,5%); as logos descem junto, mantendo 1,5% abaixo dele. 1536×703 e 1192×642 com as mesmas faixas
(±0,2%).

**Medição original** (convenção visual, antes do ajuste):

Medida em 01/10/2026 em 1440×900, seção alinhada ao topo da tela (como pelo menu), sem zoom.
Textos pelo desenho das letras (R2); vídeo, linha decorativa e logos pela borda.

**Faixas verticais** (% da altura da tela)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Margem superior | 0% – 15,7% | 15,7% | contém o header (2,2–9,3%) |
| Título | 15,7% – 21,6% | 5,9% | 58px; o "ç" desce abaixo da linha |
| Espaço | 21,6% – 23,5% | 1,9% | |
| Subtítulo | 23,5% – 25,9% | 2,4% | 1 linha; 23px |
| Espaço | 25,9% – 29,9% | 4,0% | |
| Corpo: vídeo (moldura) | 29,9% – 76,7% | 46,8% | 748×421px (16:9); o texto fica ao lado (tabela abaixo) |
| Espaço | 76,7% – 81,3% | 4,6% | |
| Rótulo do carrossel | 81,3% – 82,8% | 1,5% | 14px |
| Espaço | 82,8% – 85,6% | 2,8% | |
| Logos (desenho) | 85,6% – 90,3% | 4,7% | a faixa do carrossel (caixa de 64px) vai de 84,4% a 91,5% |
| Margem inferior | 90,3% – 100% | 9,7% | |

**Texto ao lado do vídeo** (dentro da faixa do corpo; centralizado em relação ao vídeo)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Linha decorativa | 37,0% – 69,5% | 32,5% | 1px, esmaecida nas pontas |
| Parágrafo 1 | 38,7% – 46,5% | 7,8% | 3 linhas; 17px; cor de destaque |
| Espaço | 46,5% – 49,5% | 3,0% | |
| Parágrafo 2 | 49,5% – 60,4% | 10,9% | 4 linhas; 17px |
| Espaço | 60,4% – 63,4% | 3,0% | |
| Parágrafo 3 | 63,4% – 68,2% | 4,8% | 2 linhas; 17px |

**Faixas horizontais** (% da largura da tela)

| Elemento | 1440×900 | Largura | Observação |
|---|---|---|---|
| Título | 35,6% – 64,4% | 28,9% | |
| Subtítulo | 22,0% – 78,0% | 56,1% | |
| Linha decorativa | 8,3% – 8,4% | 0,1% | 1px |
| Texto (parágrafos) | 10,1% – 34,6% | 24,4% | começa 26px depois da linha |
| Espaço texto → vídeo | 34,6% – 39,7% | 5,1% | |
| Vídeo (moldura) | 39,7% – 91,7% | 51,9% | controles e botão de tela cheia dentro da moldura |
| Rótulo do carrossel | 36,1% – 63,9% | 27,8% | |
| Faixa do carrossel | 18,8% – 81,3% | 62,5% | bordas esmaecidas (8% de cada lado); logos rolam em loop |
### Nossa Plataforma · *implementada em 01/10/2026 (aguardando teste do usuário)*

**Tabela do usuário (01/10/2026), só vertical:** título 20,4–24,8% · subtítulo 29,8–32,1% · abas
37,1–38,7% · linha 39,9–41,7% · cartão 43,2–85,0% · margem inferior 15%. Horizontais
redistribuídas por mim e validadas pelo usuário: cartão 18,2% mais baixo (376px) reduzindo com a
proporção mantida (19,9–80,1%, 865,6px); mídia na metade esquerda (19,9–50,0%); fontes do texto do
cartão, botões e distâncias aos cantos sem mudança; título, subtítulo, abas e linha só descem.

**Implementação:** mesmo modelo de "Nosso Modelo" (px do quadro de referência + `zoom: var(--uf)`);
fora do `_fitZoom`.

**Resultado medido:** em 1440×900, 1536×703, 1192×642 e 1366×560, todas as faixas a até 0,1% da
tabela. Funcionalidade 1: título 51,5–58,6%, itens 61,3–76,9%. Diferença em relação ao previsto: com
o cartão mais estreito, os títulos das funcionalidades 3 e 4 passaram a ocupar 2 linhas (cabem com
folga). Ponto em aberto: abaixo da referência, abas e itens ficam abaixo do piso de 12px da R4
(1536×703: abas 11,7px, itens 12,5px; 1366×560: abas 9,3px, itens 10px).

**Medição original** (convenção visual, antes do ajuste):

Medida em 01/10/2026 em 1440×900, na posição em que o menu deixa a seção (seção fixa ao fundo,
mostrada por inteiro), sem zoom. Textos pelas letras (R2); abas, linha, cartão e botões pela borda.
O título "Nossa Plataforma" usa a fonte Barlow (o de "Nosso Modelo" usa Inter): em 58px as letras
ocupam 4,4% de altura, contra 4,9% no Modelo.

**Faixas verticais** (% da altura da tela)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Margem superior | 0% – 15,9% | 15,9% | contém o header (2,2–9,3%) |
| Título | 15,9% – 20,3% | 4,4% | 58px (Barlow); o "p" desce abaixo da linha |
| Espaço | 20,3% – 23,5% | 3,2% | |
| Subtítulo | 23,5% – 25,8% | 2,3% | 1 linha; 23px |
| Espaço | 25,8% – 31,5% | 5,7% | |
| Abas (textos) | 31,5% – 33,1% | 1,6% | 4 abas; 15px; a pílula da aba ativa vai de 30,4% a 33,8% |
| Espaço | 33,1% – 34,3% | 1,2% | |
| Linha temporizadora | 34,3% – 36,1% | 1,8% | caixa de 16px; o traço visível fica em ~35,1% (bolinhas de 6px) |
| Espaço | 36,1% – 39,2% | 3,1% | |
| Cartão | 39,2% – 90,3% | 51,1% | 460px; vídeo à esquerda, texto à direita (tabela abaixo) |
| Margem inferior | 90,3% – 100% | 9,7% | |

**Dentro do cartão** (o texto fica centralizado na vertical e muda a cada funcionalidade)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Mídia (vídeo) | 39,3% – 90,2% | 50,9% | metade esquerda do cartão; vídeo quadrado inteiro (sobras na cor da borda) |
| Botões (play e tela cheia) | 83,5% – 88,4% | 4,9% | cantos inferiores da mídia |
| Título da funcionalidade 1 | 52,2% – 59,3% | 7,1% | 2 linhas; 32px |
| Itens da funcionalidade 1 | 62,0% – 77,6% | 15,6% | 3 itens em 5 linhas; 16px |
| Funcionalidade 2 | título 54,3–61,4% · itens 64,1–75,5% | — | 2 + 4 linhas |
| Funcionalidade 3 | título 55,6–58,8% · itens 61,5–74,3% | — | 1 + 4 linhas |
| Funcionalidade 4 | título 57,6–60,9% · itens 63,6–72,2% | — | 1 + 3 linhas |

**Faixas horizontais** (% da largura da tela)

| Elemento | 1440×900 | Largura | Observação |
|---|---|---|---|
| Título | 34,3% – 65,7% | 31,3% | |
| Subtítulo | 34,2% – 65,8% | 31,6% | |
| Abas (textos) | 26,9% – 74,4% | 47,5% | pílulas: 26,1–33,3% · 37,3–49,1% · 52,5–61,0% · 65,4–75,2% |
| Linha temporizadora | 22,9% – 77,1% | 54,2% | pontas esmaecidas |
| Cartão | 13,3% – 86,7% | 73,5% | |
| Mídia (vídeo) | 13,3% – 50,0% | 36,7% | |
| Botões | 14,4% – 48,9% | 34,4% | play à esquerda, tela cheia à direita |
| Texto: título da funcionalidade | 52,3% – 83,9% | 31,7% | |
| Texto: itens | 53,5% – 77,0% | 23,5% | marcadores em 52,3%; largura máxima de 42 caracteres |
### Nossa Perspectiva · *implementada em 01/10/2026 (aguardando teste do usuário)*

**Tabela do usuário (01/10/2026), só vertical:** título 20,4–25,1% · subtítulo 30,1–32,5% · quadro
37,5–84,0% · margem inferior 16%. Medidas internas do quadro e horizontais mantêm a proporção.

**Implementação:** mesmo modelo de "Nosso Modelo" (px do quadro de referência + `zoom: var(--uf)`);
fora do `_fitZoom` (que fica sem seções até o FAQ). O quadro mantém o desenho de projeto (1200×459)
e recebe `zoom: .9118` como um bloco (418,5px de altura, 1094px de largura). Reduzir só a altura do
quadro faria o diagrama passar do modo inteiro para o recortado (coluna fixa das raias + arrastar),
porque o `computeCycleFit` decide pela largura disponível em px.

**Resultado medido:** em 1440×900, 1536×703, 1192×642 e 1366×560: título 20,4% (linha de base
25,2%) · subtítulo 30,1–32,5% · quadro 37,5–84,1%, x 12,0–88,0% · diagrama inteiro, sem arrastar.
Raias: 40,7–46,3% · 52,2–57,8% · 63,8–69,4% · 75,3–80,9%; separadores 49,3 · 60,8 · 72,3%; nomes
das raias 19,2–23,9%; colunas de pílulas 28,1–38,5 · 43,8–54,3 · 59,6–70,0 · 74,2–84,6%. Fontes na
referência: nomes 14,0px, pílulas 12,5px; abaixo dela ficam sob o piso de 12px da R4 (1536×703:
pílulas 9,8px) — mesmo ponto em aberto da Plataforma.

**Medição original** (convenção visual, antes do ajuste):

Medida em 01/10/2026 em 1440×900, com o topo da seção no topo da tela (posição do menu), sem zoom.
Textos pelas letras (R2); quadro, pílulas e separadores pela borda. Nessa largura o diagrama inteiro
cabe no quadro: a coluna fixa das raias e a dica "arraste" não aparecem (só surgem quando o
diagrama precisa de rolagem lateral). O diagrama é um SVG de 1400×525 desenhado a 81% (as raias e
as pílulas reduzem junto com a largura do quadro).

Subtítulo trocado pelo usuário em 01/10/2026, antes do ajuste: "Prontidão é chave. O M&A não termina
na assinatura de um contrato, deve ser uma disciplina contínua de gestão." Cabe em 1 linha a partir de
943px (antes eram 2 linhas forçadas); abaixo de 820px quebra depois de "contrato,". Medição refeita
com o texto novo (o bloco é centralizado na vertical, então título desce e quadro sobe 1,6%).

**Faixas verticais** (% da altura da tela)

| Elemento | 1440×900 | Altura | Observação |
|---|---|---|---|
| Margem superior | 0% – 19,9% | 19,9% | contém o header (2,2–9,3%) |
| Título | 19,9% – 24,6% | 4,7% | 58px (Inter); o "p" desce até 26,0% |
| Espaço | 24,6% – 27,9% | 3,3% | |
| Subtítulo | 27,9% – 30,3% | 2,4% | 1 linha; 23px; linha de base em 29,8% (o "g" desce até 30,3%) |
| Espaço | 30,3% – 34,8% | 4,5% | |
| Quadro do diagrama | 34,8% – 85,8% | 51,0% | 1200×459px |
| Raia 1 · Estratégia | 38,3% – 44,4% | 6,1% | pílula (55px); nome da raia 40,8–42,4% |
| Separador | 47,7% | — | pontilhado |
| Raia 2 · Originação | 50,9% – 57,0% | 6,1% | nome 53,4–55,0% |
| Separador | 60,3% | — | |
| Raia 3 · Execução | 63,6% – 69,7% | 6,1% | nome 66,0–67,7% |
| Separador | 73,0% | — | |
| Raia 4 · Efetivação | 76,2% – 82,3% | 6,1% | nome 78,6–80,2% |
| Margem inferior | 85,8% – 100% | 14,2% | |

**Faixas horizontais** (% da largura da tela)

| Elemento | 1440×900 | Largura | Observação |
|---|---|---|---|
| Título | 32,6% – 67,4% | 34,9% | |
| Subtítulo | 11,4% – 88,6% | 77,1% | |
| Quadro do diagrama | 8,3% – 91,7% | 83,3% | 1200px; mais largo que o conteúdo das outras seções |
| Nomes das raias | 16,2% – 21,4% | 5,2% | 15,4px na tela (19px no SVG) |
| Separadores | 12,6% – 88,9% | 76,3% | interrompidos entre a coluna de nomes e o fluxo |
| Coluna 1 de pílulas | 26,0% – 37,4% | 11,4% | Tese · Pipeline · Negociação |
| Coluna 2 | 43,3% – 54,7% | 11,4% | NBO; "Full Exit" (mais curta) em 47,1–56,2% |
| Coluna 3 | 60,6% – 72,0% | 11,4% | Due Diligence · Signing & Closing |
| Coluna 4 | 76,6% – 88,0% | 11,4% | PMI – Integração |
| Texto das pílulas | — | — | 13,8px na tela (17px no SVG) |
### FAQ · *a especificar (por último)*

---

### Pilha de rolagem (blocos de sobreposição) · *implementada em 01/10/2026 (aguardando teste do usuário)*

Vale para a pilha (modo `stacked`); a rolagem contínua não muda. Valores em % da altura da tela, em
`STACK_GAPS` (`setupScroll`, PaginaInstitucional.tsx), aplicados por `_fitNet`/`_fitFinal` com
`innerHeight`. As seções continuam enquadradas nos mesmos pontos: as margens ficam dentro dos cartões,
fora das seções.

| Parâmetro | Desktop e tablet (≥761px) | Celular (<761px) | Antes |
|---|---|---|---|
| Respiro do Hero (bloco 1 começa a aparecer após) | 5% de rolagem | 5% | 0 (3% visível já no carregamento) |
| Bloco 1: margem interna acima do Modelo | 5% | 15% | 0 |
| Bloco 1: espaço entre Modelo e Convicção (mesmo fundo contínuo) | 0 | 15% | 0 |
| Bloco 1: margem interna abaixo da Convicção | 15% | 25% | 0 |
| Pausa da Plataforma (espaço de rolagem entre os blocos) | 130% | 125% | 100% |
| Bloco 2: margem acima da Perspectiva | 10% | 15% | 0 |
| Bloco 2: margem abaixo da Perspectiva | 15% | 15% | 0 |
| Pausa do FAQ antes do rodapé (no celular o rodapé é um bloco de sobreposição) | — | 125% | 100% |

A pausa de 130% = 100% para revelar a Plataforma + 30% com ela inteira e parada (no celular, 25%; valores do celular revistos pelo usuário no mesmo dia). Os
24px fixos de sobreposição dos cantos arredondados continuam somados à parte. O menu "Nossa
Plataforma" para no meio dessa pausa (os dois blocos a 15% da tela). Medido em 1440×900: página de 6,0
para 6,8 telas; Modelo enquadrado em 1,10 tela; Plataforma inteira de 3,25 a 3,55; Perspectiva
enquadrada em 4,65; FAQ no fim (5,80).

### Fora da Home — Sobre nós, "Nossa Identidade" · *quadro deitado implementado (01/10/2026)*

Mesmas regras (≥761px; abaixo disso o carrossel não muda). Teste pedido pelo usuário: só o quadro
deitado (desenho atual de 1440×900, Pronúncia/Gênero ao lado da logo) para toda tela ≥761px, reduzido
por `zoom: var(--uf)` (`--uf` definido em SobreNos.tsx); a seção ocupa a primeira tela e a nota dos
fundadores começa na dobra. O estágio "abaixo da logo" (≤1024px) fica neutralizado nessa faixa.
Proposta registrada, ainda não decidida: um segundo quadro "em pé" (820×1180) para telas com
largura ÷ altura < 1,22 — ponto em que os dois quadros têm o mesmo tamanho. Em tablet em pé o quadro
deitado vira uma faixa central pequena (820×1180: conteúdo entre 36% e 63%).

**Faixas (convenção visual, 1440×900), mantidas como estavam por decisão do usuário:** título 19,2–23,7%
(56px) · logo 33,4–45,9% (x 23,5–49,9%, 380×113px) · linha indicadora 48,2–48,5% · Pronúncia/Gênero:
rótulos 36,7–37,7%, valores 39,5–42,1% (32px), notas 44,1–45,5%, divisórias 35,7–46,2% (x 52,7–76,5%)
· cards 57,4–77,7% (x 11,7–88,3%, 352×183px cada; o ativo sobe 2px) · siglas 60,8–63,9% · nomes
66,6–68,7% · descrições 70,4–74,5% (2 linhas; a do MA tem 1).

A nota dos fundadores (seção seguinte, em fluxo normal, sem quadro) recebe a mesma redução por
`--uf` para os títulos das duas seções ficarem iguais; piso de 12px nos textos pequenos (parágrafos,
nomes, cargos). Em 1192×642: títulos 39,9px, parágrafos 13,6px.

## 6. Decisões em aberto

| # | Decisão | Proposta |
|---|---|---|
| D1 | Margens em px ou em %? | Topo `max(108px, 12%)`; base `max(65px, x%)`. Com 12% puro, em 1366×657 o topo daria 79px, menos que o header |
| D2 | Tablet em pé (820×1180) | A unidade sai da largura (1u ≈ 0,57px), e textos de 17px ficariam com ~10px, abaixo do piso. Opções: (a) aceitar o piso e deixar sobrar altura; (b) ficha própria para tablet em pé, com outra referência (ex.: 820×1180) |
| D3 | Teto de crescimento | Parar em 1u = 1px (tamanho de referência) ou permitir até ~1,15 em telas muito grandes |
| D4 | Limite da rolagem contínua | **Decidido (01/10/2026): só pela altura da janela, abaixo de 560px** (desktop/tablet). Antes era por medição: uma seção ainda no `_fitZoom` abaixo de 70% derrubava a Home inteira, e as seções já migradas voltavam ao tamanho antigo (ex.: 1192×642). Seções ainda não migradas podem reduzir abaixo de 70% até serem migradas |
| D5 | Destino do `_fitZoom` | Remover quando todas as seções estiverem nesta diretriz. Até lá convivem: seção já reestruturada fica fora do zoom |

## 7. Processo de cada ajuste

1. Você descreve a seção (faixas x/y e o que importa nela).
2. Eu fecho a ficha (seção 5), com tamanhos, pisos e conflitos encontrados.
3. Capturas simuladas nos tamanhos da R10, para aprovação **antes** de mexer no código.
4. Implementação só depois do ok.
5. Validação da R10 e registro no `roadmap.md`. Ficha marcada como *implementada* aqui.

## 8. Histórico
- **01/10/2026** — Pilha de rolagem: respiro do Hero, margens internas dos blocos e pausa maior da
  Plataforma (ficha "Pilha de rolagem").
- **01/10/2026** — Faixa 761–1023px: regras antigas de tablet/celular (Convicção empilhada, cartão da
  Plataforma em coluna, quebras de subtítulo, logos menores, fontes em vw) neutralizadas na pilha.
  Regra derivada: toda regra com max-width ≥761px que toque uma seção migrada precisa de
  contrapartida no bloco do quadro proporcional (conferir com a varredura de larguras).
- **01/10/2026** — Nossa Perspectiva implementada (subtítulo trocado pelo usuário antes do ajuste).
- **01/10/2026** — Nossa Plataforma implementada.
- **01/10/2026** — Nossa Convicção implementada.
- **01/10/2026** — D4 decidida: rolagem contínua só abaixo de 560px de altura.
- **01/10/2026** — Convenção de medida pelo desenho das letras (R2). Nosso Modelo: espaço
  título → subtítulo ajustado para 5% visuais.
- **01/10/2026** — Nosso Modelo implementado (quadro de referência em px + `zoom: var(--uf)`).
- **01/10/2026** — Hero implementado como piloto (quadro proporcional em `u`), a partir da
  tabela ajustada pelo usuário. Decisões provisórias para o piloto: D2 opção (a), D3 teto em 1u = 1px.
- **01/10/2026** — criação do documento, com regras base e decisões em aberto. Contexto: margens
  de 108/65px padronizadas e redução por `zoom` (`_fitZoom`) já no código, com resultado
  proporcional porém pouco fluido no redimensionamento.
