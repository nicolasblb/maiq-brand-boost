import { createFileRoute } from '@tanstack/react-router';

import SobreNos from '@/components/SobreNos';

export const Route = createFileRoute('/sobre-nos')({
  head: () => ({
    meta: [
      { title: 'Sobre nós — Maiq' },
      {
        name: 'description',
        content:
          'A origem do nome Maiq: Mergers & Acquisitions, Artificial Intelligence e Intelligence Quotient. Conheça nossa identidade e a nota dos fundadores.',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Sobre nós — Maiq' },
      {
        property: 'og:description',
        content:
          'A origem do nome Maiq e a nota dos fundadores sobre o hub de fusões e aquisições para médias empresas.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://maiq.app.br/sobre-nos' }],
  }),
  component: SobreNos,
});
