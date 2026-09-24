import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';

import AuthLeadDialogs from '@/components/AuthLeadDialogs';
import SiteFooter from '@/components/maiq/SiteFooter';
import SiteHeader from '@/components/maiq/SiteHeader';
import { useMaiqTheme } from '@/hooks/use-maiq-theme';
import { useSupabaseUser } from '@/hooks/use-supabase-user';

/** Um bloco de conteúdo dentro de uma seção ou subseção legal. */
export type LegalBlock =
  | { kind: 'paragraph'; content: ReactNode }
  | { kind: 'list'; items: ReactNode[] }
  | { kind: 'table'; caption: string; columns: readonly string[]; rows: readonly (readonly string[])[] };

export type LegalSubsection = {
  title: string;
  blocks: LegalBlock[];
};

export type LegalSection = {
  title: string;
  blocks?: LegalBlock[];
  subsections?: LegalSubsection[];
};

type LegalPageProps = {
  title: string;
  version: string;
  effectiveDate: string;
  sections: LegalSection[];
};

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="maiq-legal-p">{block.content}</p>;
    case 'list':
      return (
        <ul className="maiq-legal-list">
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="maiq-legal-table-wrap">
          <table className="maiq-legal-table">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="maiq-legal-table-head">
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} data-label={block.columns[cellIndex] ?? ''}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

/**
 * Layout compartilhado das três páginas legais (privacidade, termos, cookies).
 * Cabeçalho e rodapé vêm dos componentes extraídos da Home; o tema é a mesma
 * fonte única (`useMaiqTheme`) usada por Home e Insights.
 */
export default function LegalPage({ title, version, effectiveDate, sections }: LegalPageProps) {
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

  const goHomeSection = (id: string) => {
    void navigate({ to: '/', state: { secao: id } });
  };

  return (
    <div
      data-maiq-scope=""
      data-theme={dia ? 'claro' : undefined}
      style={{
        fontFamily: "'Barlow',Helvetica,Arial,sans-serif",
        background: 'var(--p-bg,#0F2B2A)',
        color: 'var(--p-text,#EAD9CC)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
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

      <SiteHeader
        dia={dia}
        onToggleTheme={toggleTheme}
        user={user}
        onEntrarClick={() => setAuthOpen(true)}
        onFaleConoscoClick={() => setLeadOpen(true)}
        onSelectSection={goHomeSection}
      />

      <main className="maiq-legal-main" style={{ flex: '1 0 auto' }}>
        <div className="maiq-legal">
          <h1 className="maiq-legal-title">{title}</h1>
          <p className="maiq-legal-version">
            Versão {version} · {effectiveDate}
          </p>

          <hr className="maiq-legal-hr" />

          {sections.map((section, index) => {
            const number = index + 1;
            return (
              <section key={section.title} aria-labelledby={`secao-${number}`}>
                <h2 id={`secao-${number}`} className="maiq-legal-h2">
                  {number}. {section.title}
                </h2>
                {section.blocks?.map((block, blockIndex) => (
                  <LegalBlockView key={blockIndex} block={block} />
                ))}
                {section.subsections?.map((subsection, subIndex) => (
                  <div key={subsection.title}>
                    <h3 className="maiq-legal-h3">
                      {number}.{subIndex + 1} {subsection.title}
                    </h3>
                    {subsection.blocks.map((block, blockIndex) => (
                      <LegalBlockView key={blockIndex} block={block} />
                    ))}
                  </div>
                ))}
              </section>
            );
          })}

          <hr className="maiq-legal-hr" />
          <p className="maiq-legal-footnote">
            Versão: {version} | Data de vigência: {effectiveDate}
          </p>
        </div>
      </main>

      <SiteFooter dia={dia} />
    </div>
  );
}
