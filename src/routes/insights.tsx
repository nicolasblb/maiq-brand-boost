import { createFileRoute } from '@tanstack/react-router';

import Insights from '@/components/sections/Insights';

export const Route = createFileRoute('/insights')({
  head: () => ({
    meta: [
      { title: 'Artigos Autorais — Maiq' },
      {
        name: 'description',
        content:
          'Conteúdos profundos sobre Fusões e Aquisições: artigos autorais da Maiq sobre M&A como disciplina contínua.',
      },
      { property: 'og:title', content: 'Artigos Autorais — Maiq' },
      {
        property: 'og:description',
        content:
          'Conteúdos profundos sobre Fusões e Aquisições: artigos autorais da Maiq sobre M&A como disciplina contínua.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Insights,
});
