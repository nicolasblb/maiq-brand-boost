import { createFileRoute, redirect } from '@tanstack/react-router';

// URL antiga do site anterior (maiq.app.br/privacy-policy). Redireciona para
// a rota em português — decisão do Portão 1 (docs/spec-paginas-legais.md,
// item 9.11): redirect no próprio projeto, não 301 de servidor.
export const Route = createFileRoute('/privacy-policy')({
  beforeLoad: () => {
    throw redirect({ to: '/politica-de-privacidade' });
  },
});
