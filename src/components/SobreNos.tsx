import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';

import AuthLeadDialogs from '@/components/AuthLeadDialogs';
import SiteFooter from '@/components/maiq/SiteFooter';
import SiteHeader from '@/components/maiq/SiteHeader';
import FoundersNote from '@/components/sobre-nos/FoundersNote';
import NossaIdentidade from '@/components/sobre-nos/NossaIdentidade';
import { useMaiqTheme } from '@/hooks/use-maiq-theme';
import { useSupabaseUser } from '@/hooks/use-supabase-user';

/**
 * Página "Sobre nós": a identidade da marca (logo animada + cards MA/AI/IQ)
 * e a nota dos fundadores. Estática — sem `PageLoader` (exclusivo da Home) —
 * e a primeira página, além do `MaiqButton`, a consumir a camada de tokens
 * semântica de `maiq.css` (`--bg-page`, `--text-*`, `--surface-card`,
 * `--border-*`, `--highlight`, `--action-*`; ver DESIGN.md e ADR 0002).
 */
export default function SobreNos() {
  const { theme, dia, toggleTheme } = useMaiqTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const supabaseUser = useSupabaseUser();
  // AuthLeadDialogs atualiza o usuário de forma otimista (onUserChange) logo
  // após login/logout, antes que o listener do hook propague a mudança —
  // espelhar aqui evita um piscar da view "Conta" no dialog (ver Insights.tsx).
  const [user, setUser] = useState<User | null>(supabaseUser);
  useEffect(() => setUser(supabaseUser), [supabaseUser]);
  const navigate = useNavigate();
  // Fator do quadro proporcional (--uf, sem unidade), o mesmo da Home: "Nossa Identidade" é
  // desenhada em 1440×900 e reduzida por zoom (maiq.css). Só depende do tamanho da janela.
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const setUf = () => {
      const uf = Math.min(window.innerHeight / 900, window.innerWidth / 1440, 1);
      scopeRef.current?.style.setProperty('--uf', uf.toFixed(4));
    };
    setUf();
    window.addEventListener('resize', setUf);
    return () => window.removeEventListener('resize', setUf);
  }, []);

  const goHomeSection = (id: string) => {
    void navigate({ to: '/', state: { secao: id } });
  };

  return (
    <div
      ref={scopeRef}
      data-maiq-scope=""
      data-theme={dia ? 'claro' : undefined}
      style={{
        fontFamily: "'Barlow',Helvetica,Arial,sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
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

      <main className="maiq-about-main" style={{ flex: '1 0 auto' }}>
        <div className="maiq-about-identity-wrap">
          <div className="maiq-about-glow" aria-hidden="true" />
          <NossaIdentidade />
        </div>
        <FoundersNote />
      </main>

      <SiteFooter dia={dia} />
    </div>
  );
}
