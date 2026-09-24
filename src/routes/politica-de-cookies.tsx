import { createFileRoute } from '@tanstack/react-router';

import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const Route = createFileRoute('/politica-de-cookies')({
  head: () => ({
    meta: [
      { title: 'Política de Cookies — Maiq' },
      {
        name: 'description',
        content:
          'Como a Maiq usa cookies e tecnologias similares hoje — sessão de autenticação e preferência de tema — e quais categorias poderão ser adotadas no futuro, mediante consentimento.',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Política de Cookies — Maiq' },
      {
        property: 'og:description',
        content: 'Cookies e tecnologias similares usados pela Maiq, hoje e no futuro.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://maiq.app.br/politica-de-cookies' }],
  }),
  component: CookiesPage,
});

// Texto escrito nesta rodada — não há origem no site atual (só uma menção,
// sem página correspondente, na seção 2.2 da Política de Privacidade). Ver
// docs/spec-paginas-legais.md, seção "/politica-de-cookies — página nova"
// para a estrutura decidida e o item 8.5/8.6 para o contexto das decisões.
const SECOES: LegalSection[] = [
  {
    title: 'O que são cookies',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Cookies são pequenos arquivos de texto armazenados pelo navegador ao visitar um site. Eles permitem, por exemplo, manter uma sessão autenticada ou lembrar uma preferência entre visitas. Tecnologias similares — como o armazenamento local do navegador (localStorage) — cumprem função parecida sem serem, tecnicamente, cookies.',
      },
    ],
  },
  {
    title: 'Cookies que utilizamos hoje',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'A Maiq utiliza hoje apenas os itens estritamente necessários ao funcionamento do site e da plataforma, que dispensam consentimento sob a LGPD (Art. 7º, IX, e Art. 11, II) por serem indispensáveis à prestação do serviço solicitado pelo próprio usuário:',
      },
      {
        kind: 'list',
        items: [
          'Cookie de sessão de autenticação (Supabase Auth): mantém você conectado após o login e identifica sua sessão nas chamadas ao servidor. Expira ao encerrar a sessão ou por inatividade prolongada.',
          'Preferência de tema (localStorage[\'maiq-theme\']): não é um cookie, mas convém declarar aqui — guarda se você prefere o tema noturno ou o diurno, para não perguntar de novo a cada visita.',
        ],
      },
      {
        kind: 'paragraph',
        content: 'Nenhum desses itens é usado para rastreamento, publicidade ou perfilamento de comportamento.',
      },
    ],
  },
  {
    title: 'Categorias que poderemos utilizar',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'As categorias abaixo não estão em uso hoje. Elas descrevem o que a Maiq poderia vir a adotar no futuro, e só entrariam em operação após a implementação de um banner de consentimento e mediante sua autorização prévia:',
      },
      {
        kind: 'list',
        items: [
          'Desempenho e análise (analytics): cookies que ajudariam a entender como o site é usado — páginas visitadas, tempo de permanência, origem do tráfego — para orientar melhorias. Seriam anonimizados ou pseudonimizados sempre que possível.',
          'Personalização: cookies que lembrariam preferências de navegação além do tema, para adaptar a experiência ao perfil do visitante.',
        ],
      },
      {
        kind: 'paragraph',
        content:
          'Caso qualquer uma dessas categorias seja ativada, esta página será atualizada para deixar de descrevê-las no futuro do pretérito, e o banner de consentimento passará a estar disponível em todas as páginas do site.',
      },
    ],
  },
  {
    title: 'Como gerenciar cookies',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'A maioria dos navegadores permite bloquear ou apagar cookies pelas configurações de privacidade. Consulte a documentação do seu navegador para instruções específicas.',
      },
      {
        kind: 'paragraph',
        content:
          'Atenção: bloquear o cookie de sessão de autenticação impede o login na área logada da Maiq, já que ele é indispensável para manter você conectado.',
      },
    ],
  },
  {
    title: 'Terceiros',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Hoje a Maiq não compartilha dados de navegação com terceiros por meio de cookies. Se isso mudar — por exemplo, com a adoção de uma ferramenta de analytics de terceiros —, esta seção será atualizada para nomear o fornecedor e descrever o tratamento.',
      },
    ],
  },
  {
    title: 'Alterações e contato',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Podemos atualizar esta Política de Cookies periodicamente, especialmente ao introduzir novas categorias de cookies. Recomendamos revisitar esta página de tempos em tempos.',
      },
      {
        kind: 'paragraph',
        content: (
          <>
            Dúvidas sobre esta política podem ser enviadas para{' '}
            <a href="mailto:contato@maiq.app.br">contato@maiq.app.br</a>.
          </>
        ),
      },
    ],
  },
];

function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies" version="1.0" effectiveDate="27 de março de 2026" sections={SECOES} />
  );
}
