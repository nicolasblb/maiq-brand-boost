import { createFileRoute } from '@tanstack/react-router';

import SobreNos from '@/components/sections/SobreNos';

export const Route = createFileRoute('/sobre-nos')({
  head: () => ({
    meta: [
      { title: 'Manifesto — Sobre nós | Maiq' },
      {
        name: 'description',
        content:
          'O manifesto da Maiq: M&A como disciplina contínua de gestão, combinando método, tecnologia e conhecimento multidisciplinar para médias empresas.',
      },
      { property: 'og:title', content: 'Manifesto — Sobre nós | Maiq' },
      {
        property: 'og:description',
        content:
          'O manifesto da Maiq: M&A como disciplina contínua de gestão, combinando método, tecnologia e conhecimento multidisciplinar para médias empresas.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: SobreNos,
});
