# Por que a página está pesada — diagnóstico e caminho de otimização

## O que está pesando (verificado no código)

1. **Fundo "rede neural" (canvas do bloco A Plataforma / O Ciclo)**
   - 3 camadas com 58 + 34 + 15 pontos, multiplicados por um fator de escala de até 1,9 (≈200 pontos em telas grandes).
   - A cada quadro: reconstrução da grade espacial, teste de ligação entre pares vizinhos e **um gradiente radial novo por ponto** (`createRadialGradient` dentro do laço de desenho).
   - O canvas cobre a altura inteira do bloco (duas seções), não apenas a tela, e é repetido em "bandas" — o custo cresce com a altura da página.
   - Desenha ainda uma "nebulosa" em modo de mistura `lighter`, que é caro para o compositor.

2. **Hero com muitas camadas desfocadas simultâneas**
   - Cerca de 15 camadas animadas em laço de 45s com `filter: blur(18–44px)` e `mix-blend-mode: plus-lighter`, várias em `36vw`/`26vw` de lado.
   - Continuam animando mesmo quando o hero já saiu da tela.

3. **Degradê de energia de "O Modelo / A Fundação"**
   - Dois pseudo-elementos grandes com `blur(44px)` e `blur(68px)` animando em laço infinito, sempre ativos.

4. **Cabeçalho e botão de tema com `backdrop-filter: blur(18px)`**
   - Elementos fixos com desfoque de fundo forçam recomposição de uma faixa da tela a cada rolagem.

5. **Vários laços de animação e ouvintes de rolagem em paralelo**
   - Laços independentes: rede neural, parallax do fundo, revelar/ocultar do bloco, odômetros, animação do "O Ciclo" (com `getPointAtLength` por partícula) e a linha do tempo do VDR.
   - Medições de posição no scroll (somatório de `offsetTop`, `getBoundingClientRect`) provocam recálculo de layout repetido.

6. **Seção "O Domínio"**
   - Carrossel clona nós no DOM para o efeito contínuo e aplica `filter` de cor em cada logo.
   - Fotos e logos em JPG/PNG sem `width`/`height`, sem `loading="lazy"` e sem variante moderna (AVIF/WebP).

7. **Página monolítica**
   - `PaginaInstitucional.tsx` com 1.569 linhas mais Ciclo (787) e VDR (~750) entram todos no primeiro carregamento; nada é dividido nem adiado.

## Caminho de otimização proposto (em ordem de ganho)

**Etapa 1 — barato e de grande impacto**
- Pausar por `IntersectionObserver` todas as animações fora da tela (hero, degradê de energia, Ciclo, VDR), como já é feito na rede neural.
- Unificar os ouvintes de rolagem em um único agendador com um só `requestAnimationFrame`, com as medições de posição em cache e recalculadas apenas em `resize`.
- Limitar o `devicePixelRatio` do canvas a 1 em telas grandes e reduzir a escala máxima de pontos de 1,9 para ~1,2.

**Etapa 2 — custo por quadro do canvas**
- Pré-renderizar o "brilho" do ponto uma única vez em um canvas fora de tela e apenas copiá-lo (`drawImage`) por ponto, eliminando centenas de gradientes por quadro.
- Restringir o canvas à altura de uma tela (posição fixa) em vez da altura do bloco inteiro.
- Reduzir o alcance das ligações para cortar o número de pares testados.

**Etapa 3 — custo de composição (desfoques)**
- Trocar os desfoques muito grandes por imagens/gradientes estáticos já suavizados, mantendo o movimento apenas em `transform` e `opacity`.
- Reduzir ou remover o `backdrop-filter` do cabeçalho em favor de um fundo semitransparente sólido.

**Etapa 4 — carregamento**
- Carregar VDR, "O Ciclo" e "O Domínio" sob demanda (divisão de código + montagem quando se aproximam da tela).
- Converter fotos e logos para WebP/AVIF, com `width`/`height`, `loading="lazy"` e `decoding="async"`.
- Trocar a clonagem de nós do carrossel por uma única duplicação com deslocamento em `transform`.

**Etapa 5 — modo leve**
- Detectar `prefers-reduced-motion`, `navigator.hardwareConcurrency` baixo e `saveData` para servir uma versão com menos pontos, sem desfoque pesado e sem parallax.

## Detalhes técnicos

Arquivos envolvidos: `src/components/PaginaInstitucional.tsx` (canvas, hero, parallax, cabeçalho), `src/maiq.css` (degradê animado, keyframes), `src/components/sections/Ciclo.tsx`, `src/components/sections/Dominio.tsx`, `src/components/maiq/vdr/*`.

Validação: perfil de desempenho no Playwright (tempo por quadro durante rolagem completa), contagem de elementos do DOM e ausência de erros de build/typecheck. Nenhuma mudança de conteúdo ou identidade visual — apenas custo de renderização.
