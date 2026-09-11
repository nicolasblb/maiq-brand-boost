# Seção "O Domínio"

Construir a seção "O Domínio" como uma seção full-height, editável e alinhada ao design system Maiq, apresentando os sócios, uma citação e um carrossel de logos de empresas.

## O que será construído

- Substituir o placeholder atual da seção "O Domínio" por um layout completo.
- Manter a seção como full-height (`min-height: 100vh`) e dentro do fluxo normal de rolagem, sem efeito especial de scroll (o overlay3 já cuida da transição vinda de "O Ciclo").
- Layout em duas colunas no desktop:
  - **Esquerda**: fotos emolduradas dos dois sócios, uma sobre a outra ou lado a lado, com nome e área de atuação.
  - **Direita**: citação em destaque entre aspas e, abaixo, o carrossel de logos com título "Experiência com múltiplos líderes de mercado".
- Em mobile: colunas empilhadas (fotos, depois citação, depois carrossel).

## Conteúdo

- **Sócio 1**: Enzo Braga Rodrigues / Business
- **Sócio 2**: Nicolas Bernard / Digital
- **Citação**: "A empresa que só cresce de forma orgânica pode estar limitando o próprio futuro."
- **Autor da citação**: Enzo Rodrigues
- **Título do carrossel**: Experiência com múltiplos líderes de mercado
- **Logos**: aproximadamente 6 logos monocromáticas e sem fundo (a enviar pelo chat).

## Assets

- As fotos dos sócios e as logos serão enviadas pelo usuário no chat.
- Após o envio, cada imagem será hospedada via `lovable-assets` e referenciada por arquivos `.asset.json` em `src/assets/`.
- Fallback visual: se uma foto ainda não estiver disponível, exibir um avatar com iniciais no mesmo estilo da moldura.

## Design e layout

- **Molduras das fotos**:
  - Forma retangular com cantos arredondados (`--radius-lg` ou `--radius-xl`).
  - Borda sutil (`1px solid var(--p-hair)`).
  - Fundo `var(--p-chip-bg)` enquanto a imagem carrega.
  - Proporção de retrato (ex.: 3:4 ou 4:5), com `object-fit: cover`.
  - Em desktop, as duas fotos podem ter leve sobreposição vertical (a segunda deslocada para baixo e para a direita) para criar profundidade, ou ficarem lado a lado dependendo do espaço.

- **Tipografia dos sócios**:
  - Nome em `var(--font-core)`, `var(--fs-h4)`, cor `var(--p-text)`.
  - Área de atuação em `var(--fs-caption)`, cor `var(--p-muted)`, tracking leve.

- **Bloco de citação**:
  - Aspas grandes e discretas em `var(--p-muted)` ou `var(--p-mark-1)`.
  - Frase em `var(--fs-h3)` ou `var(--fs-display-2)`, cor `var(--p-text)`, line-height confortável.
  - Autor em `var(--fs-body)`, cor `var(--p-text-2)`.

- **Carrossel de logos**:
  - Marquee contínuo, inspirado no marquee do hero.
  - Duas fileiras opcionais ou uma única fileira com as 6 logos duplicadas para loop suave.
  - Logos com altura fixa (ex.: 28px), opacidade reduzida (0.5) e brilho total no hover.
  - Filtro monocromático via `filter: grayscale(1) brightness(...)`, adaptado ao tema claro/escuro.
  - Máscara de fade nas laterais.

## Temas

- Todos os elementos usam tokens semânticos (`--p-text`, `--p-text-2`, `--p-muted`, `--p-hair`, `--p-chip-bg`, `--p-mark-1`, etc.) para funcionar corretamente nos modos noturno e diurno.
- Transições de cor seguem o padrão existente de 320ms com `cubic-bezier(.16,1,.3,1)`.

## Animações

- Reveal suave ao entrar na viewport:
  - Fotos e texto surgem com `opacity` e `translateY` leve.
  - Carrossel inicia movimento apenas quando a seção fica visível.
- Respeitar `prefers-reduced-motion`.

## Responsividade

- Desktop: grid de duas colunas (fotos ~45%, conteúdo ~55%) com gap de `clamp(32px,5vw,80px)`.
- Tablet: fotos menores, possível empilhamento parcial.
- Mobile: coluna única, fotos centralizadas, citação e carrossel em sequência.

## Integração técnica

- Editar `src/components/PaginaInstitucional.tsx`, substituindo o placeholder atual da seção "O Domínio".
- Criar componente interno ou local `DominioSection` dentro do mesmo arquivo para manter a organização.
- Adicionar imports das imagens via `.asset.json` quando disponíveis.
- Atualizar `src/routes/index.tsx` se necessário para manter metadados da página (não esperado).

## Verificação

- Typecheck com `bunx tsgo --noEmit`.
- Preview em desktop e mobile.
- Teste dos dois temas (claro/escuro).
- Verificação do carrossel contínuo e da responsividade.
