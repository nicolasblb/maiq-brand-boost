# Ajustes: rodapé, FAQ, ícones do Ciclo e vídeo da Convicção

## 1. Rodapé com "Contato" e "Legal"

- Duas colunas de links à direita do logo:
  - **Contato**: contato@maiq.app.br (abre o e-mail ao clicar).
  - **Legal**: "Política de privacidade" e "Termos de uso".
- Os três itens são clicáveis. As duas páginas legais ainda não têm conteúdo: crio as páginas `/politica-de-privacidade` e `/termos-de-uso` com o mesmo cabeçalho, rodapé e tipografia do site e um texto provisório curto, prontas para receber os textos definitivos que você enviará.
- Títulos das colunas no mesmo estilo discreto já usado no rodapé; links com estado de hover coerente com o restante da página, nos modos dia e noite.
- Remove o e-mail solto que hoje aparece no rodapé (passa a viver sob "Contato").

## 2. Altura do FAQ + rodapé

- Hoje o FAQ sozinho ocupa a tela inteira (altura mínima de 100% da tela) e o rodapé vem depois, criando sobra de espaço abaixo da última pergunta.
- Novo comportamento: FAQ e rodapé, juntos, ocupam pelo menos a altura da tela. O FAQ deixa de exigir a tela inteira e passa a crescer conforme o conteúdo; o espaçamento inferior é reduzido; se sobrar espaço, ele é distribuído no FAQ para que o rodapé encoste na base da tela.
- Em telas pequenas o conteúdo continua fluindo normalmente, sem cortes.

## 3. Ícones nas raias de "O Ciclo"

Ícones lineares (mesma espessura de traço do restante da página), alinhados à esquerda do texto, com o conjunto ícone + texto centralizado dentro da caixa da raia:

- **Estratégia** — alvo/mira (foco e direção).
- **Originação** — lupa (busca de oportunidades).
- **Execução** — engrenagens ou aperto de mãos (condução do negócio).
- **Efetivação** — selo/carimbo de confirmação (fechamento).

Detalhe: tamanho ~20px, cor herdada da raia (`--c-lane-fg`), espaçamento de 10px entre ícone e texto, aplicado tanto na versão das raias em HTML quanto na versão desenhada dentro do gráfico, para ficarem idênticas. Confirmo a escolha final dos quatro ícones visualmente antes de fechar.

## 4. Vídeo de "Nossa Convicção"

- **Pausar passa a congelar no ponto atual** e o play retoma exatamente dali. Hoje a troca de estado reaplica o tempo a partir do vídeo da outra versão de tema, o que joga a reprodução para um ponto anterior.
- **Reprodução em loop**: ao chegar ao fim, recomeça sozinho e continua rodando; o anel de progresso reinicia junto a cada volta.
- Continuam valendo: início automático quando a seção aparece, pausa ao sair da tela, saltos de ±5 segundos e troca de tema sem reiniciar o tempo.

## Detalhes técnicos

- `PaginaInstitucional.tsx`: reestruturar o `<footer>` com as colunas Contato/Legal; links legais usando `Link` do TanStack Router.
- Novas rotas `src/routes/politica-de-privacidade.tsx` e `src/routes/termos-de-uso.tsx`, cada uma com `head()` próprio (título, descrição, og/twitter).
- `src/maiq.css`: `.maiq-faq` deixa de usar `min-height:100vh`; o contêiner que agrupa FAQ + rodapé recebe `min-height:100svh` com `display:flex; flex-direction:column` e o FAQ com `flex:1`; reduzir `padding-bottom` do FAQ.
- `Ciclo.tsx`: ícones `lucide-react` (`Target`, `Search`, `Handshake`/`Cog`, `BadgeCheck`) nas raias HTML; nas raias em SVG, `<path>` equivalentes dentro de um `<g>` com `transform`, deslocando o `<text>` e trocando `textAnchor` para manter o conjunto centrado.
- `ConvictionScene.tsx`: `loop` nos dois `<video>`; remover o `onEnded` que zera o estado; no efeito de troca de tema, sincronizar sempre `active.currentTime = other.currentTime` sem reaplicar tempo quando só `playing` muda (separar o efeito de tema do efeito de play/pause para que pausar não dispare ressincronização).

## Validação

- Playwright em desktop e celular, modos dia e noite: links do rodapé, páginas legais abrindo, FAQ + rodapé cabendo na tela, ícones alinhados nas raias, pausa/retomada no mesmo ponto e loop do vídeo; sem erros de console.
