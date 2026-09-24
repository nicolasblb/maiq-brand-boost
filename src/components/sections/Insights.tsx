import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

declare module '@tanstack/react-router' {
  interface HistoryState {
    secao?: string;
  }
}

import type { User } from '@supabase/supabase-js';

import AuthLeadDialogs from '@/components/AuthLeadDialogs';
import SiteFooter from '@/components/maiq/SiteFooter';
import SiteHeader from '@/components/maiq/SiteHeader';
import { useMaiqTheme } from '@/hooks/use-maiq-theme';
import { useSupabaseUser } from '@/hooks/use-supabase-user';

// Lista de artigos do Substack — adicione novas entradas aqui à medida que
// novos artigos forem publicados (titulo, data de publicação e link).
const ARTIGOS = [
  {
    titulo: 'O vácuo na liderança',
    data: 'Out 24, 2025',
    url: 'https://enzorbrodrigues.substack.com/p/o-vacuo-na-lideranca',
  },
  {
    titulo: 'Governança "para inglês ver"',
    data: 'Out 01, 2025',
    url: 'https://enzorbrodrigues.substack.com/p/governanca-para-ingles-ver',
  },
  {
    titulo: 'Não teremos mais IPO no Brasil',
    data: 'Set 18, 2025',
    url: 'https://enzorbrodrigues.substack.com/p/nao-teremos-mais-ipo-no-brasil',
  },
  {
    titulo: 'O que Peter Thiel nos ensina sobre M&A?',
    data: 'Set 09, 2025',
    url: 'https://enzorbrodrigues.substack.com/p/o-que-peter-thiel-nos-ensina-sobre',
  },
  {
    titulo: 'Por que os M&As falham?',
    data: 'Set 01, 2025',
    url: 'https://enzorbrodrigues.substack.com/p/por-que-a-maioria-dos-m-and-as-falha',
  },
];

function SubstackIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.079v2.836zM1.46 10.5h21.079v10.5L12.15 15.9 1.46 21v-10.5zM22.539 0H1.46v2.836h21.079V0z" />
    </svg>
  );
}

export default function Insights() {
  const { theme, dia, toggleTheme } = useMaiqTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const supabaseUser = useSupabaseUser();
  // AuthLeadDialogs atualiza o usuário de forma otimista (onUserChange) logo
  // após login/logout, antes que o listener do hook propague a mudança —
  // espelhar aqui evita um piscar da view "Conta" no dialog.
  const [user, setUser] = useState<User | null>(supabaseUser);
  useEffect(() => setUser(supabaseUser), [supabaseUser]);

  const navigate = useNavigate();

  const goHomeSection = (id: string) => {
    void navigate({ to: '/', state: { secao: id } });
  };

  return (
    <div
      data-maiq-scope=""
      data-theme={dia ? 'claro' : undefined}
      className="maiq-platform-ciclo-bg"
      style={{
        fontFamily: "'Barlow',Helvetica,Arial,sans-serif",
        color: 'var(--p-text,#EAD9CC)',
        minHeight: '100vh',
        transition: 'color 320ms cubic-bezier(.16,1,.3,1)',
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

      <SiteHeader
        dia={dia}
        onToggleTheme={toggleTheme}
        user={user}
        onEntrarClick={() => setAuthOpen(true)}
        onFaleConoscoClick={() => setLeadOpen(true)}
        onSelectSection={goHomeSection}
      />

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

      <SiteFooter dia={dia} />
    </div>
  );
}
