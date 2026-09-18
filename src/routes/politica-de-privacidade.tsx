import { createFileRoute, Link } from '@tanstack/react-router';

import LegalPage from '@/components/LegalPage';

export const Route = createFileRoute('/politica-de-privacidade')({
  head: () => ({
    meta: [
      { title: 'Política de Privacidade — Maiq' },
      {
        name: 'description',
        content:
          'Como a Maiq trata os dados pessoais compartilhados por empresas e visitantes em processos de M&A.',
      },
      { property: 'og:title', content: 'Política de Privacidade — Maiq' },
      {
        property: 'og:description',
        content:
          'Como a Maiq trata os dados pessoais compartilhados por empresas e visitantes em processos de M&A.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: PoliticaPage,
});

function PoliticaPage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="Setembro de 2026">
      <p>
        Esta página receberá em breve o texto completo da Política de Privacidade da Maiq, com as
        informações sobre coleta, uso, compartilhamento e guarda de dados pessoais.
      </p>
      <p>
        Enquanto isso, dúvidas sobre privacidade podem ser enviadas para{' '}
        <a href="mailto:contato@maiq.app.br">contato@maiq.app.br</a>.
      </p>
      <p>
        <Link to="/">Voltar para a página inicial</Link>
      </p>
    </LegalPage>
  );
}
