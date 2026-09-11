# Migração da página institucional Maiq (repositório mq-institucional-v2)

Trazer a nova identidade visual e a página institucional completa do repositório para este projeto, mantendo tudo editável aqui.

## O que será migrado

- **Identidade visual completa**: paleta Maiq (Verde Profundo, Areia Nobre, Menta, Verde Botânico, Madeira de Lei), escalas de cor, tipografia, espaçamentos, cantos, sombras e tempos de animação.
- **Tipografia**: Barlow como substituta da Grandview (a fonte da marca é licenciada e não está no repositório). Troca simples depois, quando você enviar os arquivos da Grandview.
- **Dois temas** (noturno padrão e diurno) com o botão de alternância, como no original.
- **Imagens**: os três logotipos Maiq e os seis logos de ferramentas.
- **A página inteira, na ordem original**: hero animado com logo que "voa" para o cabeçalho → nosso modelo / tese com dados → plataforma e ferramentas (com a cena animada do data room) → O Ciclo (diagrama do processo de M&A) → jornada → chamada em Areia Nobre → rodapé.
- **As duas animações completas**: a cena do data room (documentos entrando, duplicatas, consolidação) e o diagrama O Ciclo (círculos percorrendo os trechos, losangos alternando, halos).

## Etapas

1. **Base visual** — tokens de cor, tipografia e espaçamento no sistema de estilos do projeto, com os dois temas e a fonte Barlow. Imagens copiadas para o projeto.
2. **Estrutura da página** — a página institucional passa a ser a página inicial, dividida em seções editáveis uma a uma.
3. **Conteúdo e layout** — textos, dados, cards, navegação, rodapé e comportamento de rolagem/revelação de seções fiéis ao original.
4. **Animações** — cena do data room e diagrama O Ciclo portados com a mesma temporização e aparência.
5. **Verificação** — conferência visual da página inteira em desktop e celular, nos dois temas, comparando com o original.

## Detalhes técnicos

- O original é um arquivo `.dc.html` autocontido que roda sobre o runtime próprio `support.js`, com estilos inline e componentes carregados de um bundle global. Esse runtime não é portável para cá: a página será reescrita como componentes React em TanStack Start, preservando markup, estilos e comportamento.
- Tokens do design system (`_ds/tokens/*.css`) entram em `src/styles.css` como variáveis semânticas; o tema claro fica sob `[data-theme="claro"]`, como no original. Nada de cores fixas nos componentes.
- Componentes do bundle usados na página (Button, Card, SectionHeading, StatBlock, Overline, Logo etc.) serão recriados localmente em `src/components/maiq/`, com a mesma aparência.
- Cada seção vira um componente em `src/components/sections/`; a rota `/` passa a montá-las, com título e descrição próprios para busca e compartilhamento.
- O motor de animação por timeline (`animations-v3.jsx`), a cena (`vdr-scene.jsx`) e o embed (`vdr-embed.jsx`) são portados para TypeScript/React com efeitos de ciclo de vida, sem o painel de desenvolvimento (`tweaks-panel.jsx`).
- O diagrama O Ciclo é um SVG grande com caminhos, gradientes e lógica de percurso — vem como componente próprio, com a mesma geometria e temporização.
- Barlow carregada por `<link>` na raiz; `--font-core` aponta para ela com os mesmos fallbacks.
