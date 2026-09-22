# Página de Insights (/insights)

Nova página com header completo do site, título 'Artigos Autorais', sub-header 'Conteúdos profundos sobre Fusões e Aquisições' e uma lista de artigos em formato de linhas (tabela), no padrão do print de referência: ícone da rede (Substack), título e data.

## O que será construído

1. **Rota nova** — `src/routes/insights.tsx`
   - URL `/insights`, com `head()` próprio (title 'Artigos Autorais — Maiq', description, og:title, og:description, og:type, twitter:card).

2. **Componente da página** — `src/components/sections/Insights.tsx`
   - Escopo `data-maiq-scope` com estado de tema dia/noite (padrão noite) e botão de alternância igual ao da home (tokens existentes em `maiq.css`).
   - Header completo replicando o da home: logo clicável (volta para `/`), menu suspenso 'Home' com as mesmas seções, itens 'Insights' (ativo), 'Planos', CTAs 'Entrar' e 'Fale Conosco' reabrindo os modais existentes (`AuthLeadDialogs`, que já aceita tema).
   - Header estático (sem animação de rolagem da logo, que é específica da home).
   - Menu 'Home': itens navegam para `/` levando o id da seção no estado da navegação; a home lerá esse estado ao carregar e usará o `goToSection` existente para rolar até a seção.
   - Conteúdo: header 'Artigos Autorais' e sub-header 'Conteúdos profundos sobre Fusões e Aquisições' seguindo o padrão visual dos demais (tamanhos, cor de areia nos sub-headers, quebras).
   - **Lista de artigos** em linhas de tabela como no print de referência:
     - Colunas: ícone do Substack (SVG inline monocromático, tingido pelo tema) | título do artigo | data de publicação.
     - Faixas alternadas sutilmente, divisórias finas em tom verde/menta escuro (noite) ou madeira (dia), hover destacando a linha e indicando link externo.
     - Cada linha abre o link do artigo em nova aba (`target="_blank"`).
   - **Dados em um único array `ARTIGOS`** no topo do componente (título, data, link) — fácil de crescer; hoje com 5 itens placeholder (títulos provisórios de M&A, datas ilustrativas, links '#') até você enviar os dados reais do Substack.

3. **Menu da home** — `src/components/PaginaInstitucional.tsx`
   - O item 'Insights' do menu passa de texto simples para link que direciona para `/insights` (estilo de hover mantido).

4. **Scroll a partir do menu** — `PaginaInstitucional.tsx`
   - Ao chegar em `/` com id de seção vindo do estado da navegação (quando o usuário usou o menu 'Home' a partir de Insights), rolar até a seção usando o `goToSection` existente.

## Decisões já confirmadas por você

- Artigos: placeholders agora, dados reais depois (basta colar título, data e link quando quiser).
- Header: completo (menu suspenso, dia/noite, Entrar/Fale Conosco).
- Formato: linhas em tabela (logo/rede, título, data).

## Validação

- Build OK e CSS servindo 200.
- Playwright em 1280×1800 e 390×844: navegação Home → Insights, tema dia/noite na nova página, modais Entrar/Fale Conosco abrindo, linhas com hover, menu 'Home' voltando para a home e rolando até a seção.
