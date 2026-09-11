import { createFileRoute } from '@tanstack/react-router';
import PaginaInstitucional from '@/components/PaginaInstitucional';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Maiq — M&A como disciplina contínua' },
      {
        name: 'description',
        content:
          'Método, plataforma e inteligência para originar, avaliar e integrar aquisições com disciplina — do primeiro contato à criação de valor.',
      },
      { property: 'og:title', content: 'Maiq — M&A como disciplina contínua' },
      {
        property: 'og:description',
        content:
          'Método, plataforma e inteligência para originar, avaliar e integrar aquisições com disciplina — do primeiro contato à criação de valor.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: PaginaInstitucional,
});
