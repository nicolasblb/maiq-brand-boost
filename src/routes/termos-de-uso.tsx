import { createFileRoute, Link } from '@tanstack/react-router';

import LegalPage from '@/components/LegalPage';

export const Route = createFileRoute('/termos-de-uso')({
  head: () => ({
    meta: [
      { title: 'Termos de Uso — Maiq' },
      {
        name: 'description',
        content:
          'Condições de uso do site e da plataforma Maiq para empresas que conduzem processos de M&A.',
      },
      { property: 'og:title', content: 'Termos de Uso — Maiq' },
      {
        property: 'og:description',
        content:
          'Condições de uso do site e da plataforma Maiq para empresas que conduzem processos de M&A.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <LegalPage title="Termos de Uso" updatedAt="Setembro de 2026">
      <p>
        Esta página receberá em breve o texto completo dos Termos de Uso da Maiq, com as condições
        de acesso ao site, à plataforma e aos serviços relacionados a fusões e aquisições.
      </p>
      <p>
        Enquanto isso, dúvidas sobre os termos podem ser enviadas para{' '}
        <a href="mailto:contato@maiq.app.br">contato@maiq.app.br</a>.
      </p>
      <p>
        <Link to="/">Voltar para a página inicial</Link>
      </p>
    </LegalPage>
  );
}
