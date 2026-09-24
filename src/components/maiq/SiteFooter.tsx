import { Link } from '@tanstack/react-router';

import logoBranco from '@/assets/logo-maiq-branco.png';
import logoMadeira from '@/assets/logo-maiq-madeira.png';

type SiteFooterProps = {
  dia: boolean;
};

// Extraído de PaginaInstitucional.tsx. Preserva a estrutura de irmãos
// (.maiq-footer-top + div) da qual maiq.css depende via seletor de irmão
// adjacente — não inserir um wrapper novo entre eles.
export default function SiteFooter({ dia }: SiteFooterProps) {
  return (
    <footer
      className="maiq-footer"
      style={{
        background: 'var(--p-footer-bg,#09201F)',
        borderTop: '1px solid var(--p-hair,rgba(234,217,204,.14))',
        padding: '36px 48px 18px',
        flexShrink: 0,
        transition: 'background 320ms cubic-bezier(.16,1,.3,1)',
      }}
    >
      <div className="maiq-footer-top">
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <img src={logoBranco} alt="Maiq" style={{ height: '30px', width: 'auto', display: 'block' }} />
          <img
            src={logoMadeira}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '30px',
              width: 'auto',
              display: 'block',
              opacity: dia ? 1 : 0,
              transition: 'opacity 320ms cubic-bezier(.16,1,.3,1)',
            }}
          />
        </div>
        <nav className="maiq-footer-cols" aria-label="Links do rodapé">
          <div className="maiq-footer-col">
            <p className="maiq-footer-col-title">Contato</p>
            <a className="maiq-footer-link" href="mailto:contato@maiq.app.br">
              contato@maiq.app.br
            </a>
          </div>
          <div className="maiq-footer-col">
            <p className="maiq-footer-col-title">Legal</p>
            <Link className="maiq-footer-link" to="/politica-de-privacidade">
              Política de privacidade
            </Link>
            <Link className="maiq-footer-link" to="/termos-de-uso">
              Termos de uso
            </Link>
            <Link className="maiq-footer-link" to="/politica-de-cookies">
              Política de cookies
            </Link>
          </div>
        </nav>
      </div>
      <div
        style={{
          maxWidth: '1200px',
          margin: '24px auto 0',
          paddingTop: '14px',
          borderTop: '1px solid var(--p-hair,rgba(234,217,204,.14))',
          fontSize: '13px',
          color: 'var(--p-muted,#9FD6D2)',
        }}
      >
        © 2026 Maiq. Todos os direitos reservados.
      </div>
    </footer>
  );
}
