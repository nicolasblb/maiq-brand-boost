import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

import MaiqButton from '@/components/maiq/MaiqButton';
import NavDropdown from '@/components/maiq/NavDropdown';
import logoBranco from '@/assets/logo-maiq-branco.png';
import logoMadeira from '@/assets/logo-maiq-madeira.png';

const SECOES = [
  { id: 'topo', label: 'Início' },
  { id: 'modelo', label: 'Nosso Modelo' },
  { id: 'fundacao', label: 'Nossa Convicção' },
  { id: 'plataforma', label: 'Nossa Plataforma' },
  { id: 'ciclo', label: 'Nossa Perspectiva' },
  { id: 'faq', label: 'FAQ' },
];

// Chaves reservadas do menu compacto (<1024px) que não são seções da Home —
// despachadas em handleCompactSelect em vez de onSelectSection.
const COMPACT_KEY_ENTRAR = 'entrar';
const COMPACT_KEY_FALE_CONOSCO = 'fale-conosco';
const COMPACT_KEY_SOBRE_NOS = 'sobre-nos';
const COMPACT_KEY_INSIGHTS = 'insights';

type SiteHeaderProps = {
  dia: boolean;
  onToggleTheme: () => void;
  user: User | null;
  onEntrarClick: () => void;
  onFaleConoscoClick: () => void;
  onSelectSection: (id: string) => void;
  /** Presente só na Home, que passa sua própria subárvore com os refs do
   * voo da logo (`setupLogoFlight`). Ausente → logo estática, como no
   * Insights e nas páginas legais. */
  logoSlot?: ReactNode;
};

const ctaButtonStyle = {
  '--action-ghost-fg': 'var(--p-cta-fg,#143937)',
  '--action-ghost-bg-hover': 'var(--p-cta-bg-hover,#F3E7DE)',
  color: 'var(--p-cta-fg,#143937)',
} as React.CSSProperties;

// Extraído de sections/Insights.tsx (a versão do cabeçalho sem o voo da
// logo) — ver ADR 0001. Absorve também a pílula de troca de tema, que antes
// era markup irmão duplicado em Home e Insights.
export default function SiteHeader({
  dia,
  onToggleTheme,
  user,
  onEntrarClick,
  onFaleConoscoClick,
  onSelectSection,
  logoSlot,
}: SiteHeaderProps) {
  const [tipOpen, setTipOpen] = useState(false);
  const navigate = useNavigate();

  // Itens de "Entrar"/"Conta" e "Fale Conosco" só aparecem visualmente
  // em <=430px (ver .maiq-nav-dropdown-item--mobile-auth em maiq.css) —
  // sempre renderizados aqui para que a troca de layout seja só CSS.
  const compactMenuItems = [
    { key: COMPACT_KEY_ENTRAR, label: user ? 'Conta' : 'Entrar', mobileOnly: true },
    { key: COMPACT_KEY_FALE_CONOSCO, label: 'Fale Conosco', mobileOnly: true, separatorAfter: true },
    ...SECOES.map((s, i) =>
      i === SECOES.length - 1
        ? { key: s.id, label: s.label, separatorAfter: true, separatorVariant: 'fade' as const }
        : { key: s.id, label: s.label },
    ),
    { key: COMPACT_KEY_SOBRE_NOS, label: 'Sobre nós', pageLink: true },
    { key: COMPACT_KEY_INSIGHTS, label: 'Insights', pageLink: true },
  ];

  const handleCompactSelect = (key: string) => {
    switch (key) {
      case COMPACT_KEY_ENTRAR:
        onEntrarClick();
        return;
      case COMPACT_KEY_FALE_CONOSCO:
        onFaleConoscoClick();
        return;
      case COMPACT_KEY_SOBRE_NOS:
        void navigate({ to: '/sobre-nos' });
        return;
      case COMPACT_KEY_INSIGHTS:
        void navigate({ to: '/insights' });
        return;
      default:
        onSelectSection(key);
    }
  };

  return (
    <>
      <div
        className="maiq-site-theme-toggle-wrap"
        style={{ position: 'fixed', top: '30px', right: '32px', zIndex: 51, display: 'flex' }}
      >
        <div
          className="maiq-site-theme-toggle"
          onClick={onToggleTheme}
          onMouseEnter={() => setTipOpen(true)}
          onMouseLeave={() => setTipOpen(false)}
          role="button"
          tabIndex={0}
          aria-label={dia ? 'Mudar para modo noite' : 'Mudar para modo dia'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleTheme();
            }
          }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: '44px',
            padding: '5px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--p-hair,rgba(234,217,204,.14))',
            borderRadius: '999px',
            background: 'var(--p-header-bg,rgba(20,57,55,.72))',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: 'var(--p-header-shadow,0 10px 40px rgba(6,22,21,.35))',
            cursor: 'pointer',
            transition: 'border-color 200ms cubic-bezier(.2,0,0,1),background 320ms cubic-bezier(.16,1,.3,1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: '34px',
              height: '34px',
              borderRadius: '999px',
              background: 'var(--p-toggle-thumb,rgba(234,217,204,.14))',
              transform: dia ? 'translateX(0)' : 'translateX(42px)',
              transition: 'transform 320ms cubic-bezier(.16,1,.3,1),background 320ms cubic-bezier(.16,1,.3,1)',
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              color: dia ? 'var(--p-text,#EAD9CC)' : 'var(--p-muted,#9FD6D2)',
              transition: 'color 320ms cubic-bezier(.16,1,.3,1)',
            }}
          >
            <Sun style={{ display: 'block', width: 18, height: 18 }} strokeWidth={1.9} />
          </div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '8px',
              height: '34px',
            }}
          >
            <div style={{ width: '1.5px', height: '17px', background: 'var(--p-hair-strong,rgba(234,217,204,.32))' }} />
          </div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              color: dia ? 'var(--p-muted,#9FD6D2)' : 'var(--p-text,#EAD9CC)',
              transition: 'color 320ms cubic-bezier(.16,1,.3,1)',
            }}
          >
            <Moon style={{ display: 'block', width: 17, height: 17 }} strokeWidth={1.9} />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '54px',
            right: '0',
            padding: '7px 12px',
            border: '1px solid var(--p-hair,rgba(234,217,204,.14))',
            borderRadius: '6px',
            background: 'var(--p-card,#1F5956)',
            color: 'var(--p-text,#EAD9CC)',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            opacity: tipOpen ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 200ms cubic-bezier(.2,0,0,1)',
          }}
        >
          {dia ? 'Modo dia' : 'Modo noite'}
        </div>
      </div>

      <header
        className="maiq-site-header"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          height: '64px',
          padding: '0 10px 0 26px',
          border: '1px solid var(--p-hair,rgba(234,217,204,.14))',
          borderRadius: '999px',
          background: 'var(--p-header-bg,rgba(20,57,55,.72))',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: 'var(--p-header-shadow,0 10px 40px rgba(6,22,21,.35))',
          // Com left:50% e largura automática, a largura "encolhida" de um fixed
          // fica limitada a 50vw e o conteúdo vaza (o menu quebrava fora da Home).
          width: 'max-content',
          maxWidth: 'calc(100vw - 24px)',
          transition: 'background 320ms cubic-bezier(.16,1,.3,1),border-color 320ms cubic-bezier(.16,1,.3,1)',
        }}
      >
        {logoSlot ?? (
          <div
            className="maiq-site-header-logo"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '24px', marginRight: '26px', flex: 'none' }}
          >
            <Link
              to="/"
              aria-label="Maiq — Página institucional"
              title="Maiq — Página institucional"
              className="maiq-site-header-brand"
              style={{ display: 'flex', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 200ms cubic-bezier(.2,0,0,1)' }}
            >
              <img src={logoBranco} alt="Maiq" style={{ height: '22px', width: 'auto', display: 'block', objectFit: 'contain' }} />
              <img
                src={logoMadeira}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '22px',
                  width: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                  opacity: dia ? 1 : 0,
                  transition: 'opacity 320ms cubic-bezier(.16,1,.3,1)',
                }}
              />
            </Link>
          </div>
        )}
        <nav
          className="maiq-site-nav"
          style={{ display: 'flex', alignItems: 'center', gap: '28px', marginRight: '28px', fontSize: '14px', fontWeight: 500, color: 'var(--p-muted,#9FD6D2)' }}
        >
          <NavDropdown label="Home" items={SECOES.map((s) => ({ key: s.id, label: s.label }))} onSelect={onSelectSection} />
          <Link
            to="/sobre-nos"
            className="maiq-nav-item"
            style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', transition: 'color 200ms cubic-bezier(.2,0,0,1)' }}
          >
            Sobre nós
          </Link>
          <Link
            to="/insights"
            className="maiq-nav-item"
            style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', transition: 'color 200ms cubic-bezier(.2,0,0,1)' }}
          >
            Insights
          </Link>
        </nav>
        <div
          className="maiq-site-header-cta"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '44px',
            padding: '4px',
            border: '1px solid var(--p-hair,rgba(234,217,204,.14))',
            borderRadius: '999px',
            background: 'var(--p-cta-bg,#EAD9CC)',
            color: 'var(--p-cta-fg,#143937)',
          }}
        >
          <MaiqButton size="md" variant="ghost" onClick={onEntrarClick} style={ctaButtonStyle}>
            {user ? 'Conta' : 'Entrar'}
          </MaiqButton>
          <div className="maiq-site-header-cta-div" style={{ width: '1px', height: '20px', background: 'var(--p-cta-fg,#143937)', opacity: 0.2 }} />
          <span className="maiq-site-header-cta-lead">
            <MaiqButton size="md" variant="ghost" onClick={onFaleConoscoClick} style={ctaButtonStyle}>
              Fale Conosco
            </MaiqButton>
          </span>
        </div>
        <div className="maiq-site-header-compact">
          <button
            type="button"
            className="maiq-site-theme-toggle-compact"
            onClick={onToggleTheme}
            aria-label={dia ? 'Mudar para modo noite' : 'Mudar para modo dia'}
          >
            {dia ? (
              <Sun style={{ display: 'block', width: 18, height: 18 }} strokeWidth={1.9} />
            ) : (
              <Moon style={{ display: 'block', width: 17, height: 17 }} strokeWidth={1.9} />
            )}
          </button>
          <NavDropdown
            triggerVariant="icon"
            triggerAriaLabel="Abrir menu"
            triggerClassName="maiq-site-menu-trigger"
            openOnClick
            align="right"
            items={compactMenuItems}
            onSelect={handleCompactSelect}
          />
        </div>
      </header>
    </>
  );
}
