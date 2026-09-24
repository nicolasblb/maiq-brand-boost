import { createFileRoute, redirect } from '@tanstack/react-router';

// URL antiga do site anterior (maiq.app.br/terms-of-use). Redireciona para a
// rota em português — decisão do Portão 1 (docs/spec-paginas-legais.md,
// item 9.11): redirect no próprio projeto, não 301 de servidor.
export const Route = createFileRoute('/terms-of-use')({
  beforeLoad: () => {
    throw redirect({ to: '/termos-de-uso' });
  },
});
