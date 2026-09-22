import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';

declare module '@tanstack/react-router' {
  interface HistoryState {
    secao?: string;
  }
}

import type { User } from '@supabase/supabase-js';

import AuthLeadDialogs from '@/components/AuthLeadDialogs';
import MaiqButton from '@/components/maiq/MaiqButton';
import NavDropdown from '@/components/maiq/NavDropdown';
import { supabase } from '@/integrations/supabase/client';
import logoBranco from '@/assets/logo-maiq-branco.png';
import logoMadeira from '@/assets/logo-maiq-madeira.png';

const SECOES = [
  { id: 'topo', label: 'Início' },
  { id: 'modelo', label: 'Nosso Modelo' },
  { id: 'fundacao', label: 'Nossa Convicção' },
  { id: 'plataforma', label: 'Nossa Plataforma' },
  { id: 'ciclo', label: 'Nossa Perspectiva' },
  { id: 'dominios', label: 'Nosso Time' },
  { id: 'faq', label: 'FAQ' },
];

// Lista de artigos do Substack — adicione novas entradas aqui à medida que
// novos artigos forem publicados (titulo, data de publicação e link).
const ARTIGOS = [
  {
    titulo: 'M&A como disciplina contínua: por que a assinatura é só o começo',
    data: 'Set 12, 2026',
    url: '#',
  },
  {
    titulo: 'Valuation na prática: o que o múltiplo não conta',
    data: 'Ago 28, 2026',
    url: '#',
  },
  {
    titulo: 'Playbooks por etapa: como estruturar a diligência sem perder ritmo',
    data: 'Ago 05, 2026',
    url: '#',
  },
  {
    titulo: 'Virtual Data Room: prepare a casa antes da visita',
    data: 'Jul 17, 2026',
    url: '#',
  },
  {
    titulo: 'Integração pós-aquisição: onde o valor costuma ser perdido',
    data: 'Jun 30, 2026',
    url: '#',
  },
];

function SubstackIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.079v2.836zM1.46 10.5h21.079v10.5L12.15 15.9 1.46 21v-10.5zM0 0h22.539v2.836H0V0z" />
    </svg>
  );
}

export default function Insights() {
  const [theme, setTheme] = useState<'noite' | 'claro'>('noite');
  const [authOpen, setAuthOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tipOpen, setTipOpen] = useState(false);

  const navigate = useNavigate();
  const dia = theme === 'claro';

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.background = dia ? '#EEE0D4' : '#0F2B2A';
  }, [dia]);

  const toggleTheme = () => setTheme(dia ? 'noite' : 'claro');

  const goHomeSection = (id: string) => {
    void navigate({ to: '/', state: { secao: id } });
  };

  const ctaButtonStyle = {
    '--action-ghost-fg': 'var(--p-cta-fg,#143937)',
    '--action-ghost-bg-hover': 'var(--p-cta-bg-hover,#F3E7DE)',
    color: 'var(--p-cta-fg,#143937)',
  } as React.CSSProperties;

  return (
    <div
      data-maiq-scope=""
      data-theme={dia ? 'claro' : undefined}
      style={{
        fontFamily: "'Barlow',Helvetica,Arial,sans-serif",
        background: 'var(--p-bg,#0F2B2A)',
        color: 'var(--p-text,#EAD9CC)',
        minHeight: '100vh',
        transition: 'background 320ms cubic-bezier(.16,1,.3,1),color 320ms cubic-bezier(.16,1,.3,1)',
      }}
    >
      <AuthLeadDialogs
        theme={theme}
        authOpen={authOpen}
        leadOpen={leadOpen}
        user={user}
        onAuthOpenChange={setAuthOpen}
        onLeadOpenChange={setLeadOpen}
        onUserChange={setUser}
      />

      <div className="maiq-insights-toggle" style={{ position: 'fixed', top: '30px', right: '32px', zIndex: 51, display: 'flex' }}>
        <div
          onClick={toggleTheme}
          onMouseEnter={() => setTipOpen(true)}
          onMouseLeave={() => setTipOpen(false)}
          role="button"
          tabIndex={0}
          aria-label={dia ? 'Mudar para modo noite' : 'Mudar para modo dia'}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); } }}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center', height: '44px', padding: '5px',
            borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--p-hair,rgba(234,217,204,.14))',
            borderRadius: '999px', background: 'var(--p-header-bg,rgba(20,57,55,.72))',
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            boxShadow: 'var(--p-header-shadow,0 10px 40px rgba(6,22,21,.35))', cursor: 'pointer',
            transition: 'border-color 200ms cubic-bezier(.2,0,0,1),background 320ms cubic-bezier(.16,1,.3,1)',
          }}
          data-hover-style="border-color:var(--p-hair-strong,rgba(234,217,204,.32))"
        >
          <div style={{ position: 'absolute', top: '5px', left: '5px', width: '34px', height: '34px', borderRadius: '999px', background: 'var(--p-toggle-thumb,rgba(234,217,204,.14))', transform: dia ? 'translateX(0)' : 'translateX(42px)', transition: 'transform 320ms cubic-bezier(.16,1,.3,1),background 320ms cubic-bezier(.16,1,.3,1)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', color: dia ? 'var(--p-text,#EAD9CC)' : 'var(--p-muted,#9FD6D2)', transition: 'color 320ms cubic-bezier(.16,1,.3,1)' }}>
            <Sun style={{ display: 'block', width: 18, height: 18 }} strokeWidth={1.9} />
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '8px', height: '34px' }}>
            <div style={{ width: '1.5px', height: '17px', background: 'var(--p-hair-strong,rgba(234,217,204,.32))' }} />
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', color: dia ? 'var(--p-muted,#9FD6D2)' : 'var(--p-text,#EAD9CC)', transition: 'color 320ms cubic-bezier(.16,1,.3,1)' }}>
            <Moon style={{ display: 'block', width: 17, height: 17 }} strokeWidth={1.9} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: '54px', right: '0', padding: '7px 12px', border: '1px solid var(--p-hair,rgba(234,217,204,.14))', borderRadius: '6px', background: 'var(--p-card,#1F5956)', color: 'var(--p-text,#EAD9CC)', fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', opacity: tipOpen ? 1 : 0, pointerEvents: 'none', transition: 'opacity 200ms cubic-bezier(.2,0,0,1)' }}>
          {dia ? 'Modo dia' : 'Modo noite'}
        </div>
      </div>

      <header
        className="maiq-insights-header"
        style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 50,
          display: 'flex', alignItems: 'center', gap: '0', height: '64px', padding: '0 10px 0 26px',
          border: '1px solid var(--p-hair,rgba(234,217,204,.14))', borderRadius: '999px',
          background: 'var(--p-header-bg,rgba(20,57,55,.72))', backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: 'var(--p-header-shadow,0 10px 40px rgba(6,22,21,.35))',
          maxWidth: 'calc(100vw - 24px)',
          transition: 'background 320ms cubic-bezier(.16,1,.3,1),border-color 320ms cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '24px', marginRight: '26px', flex: 'none' }}>
          <Link
            to="/"
            aria-label="Maiq — Página institucional"
            title="Maiq — Página institucional"
            style={{ display: 'flex', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 200ms cubic-bezier(.2,0,0,1)' }}
            data-hover-style="opacity:0.82"
          >
            <img src={logoBranco} alt="Maiq" style={{ height: '22px', width: 'auto', display: 'block', objectFit: 'contain' }} />
            <img src={logoMadeira} alt="" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, height: '22px', width: 'auto', display: 'block', objectFit: 'contain', opacity: dia ? 1 : 0, transition: 'opacity 320ms cubic-bezier(.16,1,.3,1)' }} />
          </Link>
        </div>
        <nav className="maiq-insights-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px', marginRight: '28px', fontSize: '14px', fontWeight: 500, color: 'var(--p-muted,#9FD6D2)' }}>
          <NavDropdown
            label="Home"
            items={SECOES.map((s) => ({ key: s.id, label: s.label }))}
            onSelect={goHomeSection}
          />
          <span
            className="maiq-nav-item"
            style={{ cursor: 'pointer', transition: 'color 200ms cubic-bezier(.2,0,0,1)' }}
            data-hover-style="color:var(--p-text,#EAD9CC)"
            onClick={() => goHomeSection('dominios')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); goHomeSection('dominios'); } }}
          >
            Sobre nós
          </span>
          <Link
            to="/insights"
            className="maiq-nav-item"
            style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', transition: 'color 200ms cubic-bezier(.2,0,0,1)' }}
            data-hover-style="color:var(--p-text,#EAD9CC)"
          >
            Insights
          </Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', height: '44px', padding: '4px', border: '1px solid var(--p-hair,rgba(234,217,204,.14))', borderRadius: '999px', background: 'var(--p-cta-bg,#EAD9CC)', color: 'var(--p-cta-fg,#143937)' }}>
          <MaiqButton
            size="md"
            variant="ghost"
            onClick={() => setAuthOpen(true)}
            style={ctaButtonStyle}
          >
            {user ? 'Conta' : 'Entrar'}
          </MaiqButton>
          <div className="maiq-insights-cta-div" style={{ width: '1px', height: '20px', background: 'var(--p-cta-fg,#143937)', opacity: 0.2 }} />
          <span className="maiq-insights-cta-lead">
            <MaiqButton
              size="md"
              variant="ghost"
              onClick={() => setLeadOpen(true)}
              style={ctaButtonStyle}
            >
              Fale Conosco
            </MaiqButton>
          </span>
        </div>
      </header>

      <main className="maiq-insights-main">
        <header className="maiq-insights-head">
          <h2>Artigos Autorais</h2>
          <p className="maiq-section-subhead">
            Conteúdos profundos sobre Fusões e Aquisições
          </p>
        </header>

        <div className="maiq-insights-list">
          {ARTIGOS.map((artigo) => {
            const externo = /^https?:\/\//.test(artigo.url);
            return (
              <a
                key={artigo.titulo}
                className="maiq-insight-row"
                href={artigo.url}
                target={externo ? '_blank' : undefined}
                rel={externo ? 'noreferrer' : undefined}
              >
                <span className="maiq-insight-icon" aria-hidden="true">
                  <SubstackIcon />
                </span>
                <span className="maiq-insight-title">{artigo.titulo}</span>
                <span className="maiq-insight-date">{artigo.data}</span>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
