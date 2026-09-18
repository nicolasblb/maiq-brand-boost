import type { ReactNode } from 'react';

type LegalPageProps = {
  title: string;
  updatedAt?: string;
  children: ReactNode;
};

export default function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <main
      data-maiq-scope=""
      style={{
        minHeight: '100vh',
        background: 'var(--p-bg,#0D2423)',
        color: 'var(--p-text,#E9E0D1)',
        fontFamily: 'var(--font-core)',
        padding: 'clamp(64px,10vh,120px) clamp(24px,5vw,48px)',
      }}
    >
      <div className="maiq-legal" style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: 'var(--font-core)',
            fontSize: 'clamp(34px,4vw,52px)',
            fontWeight: 600,
            lineHeight: 1.06,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {updatedAt ? (
          <p style={{ marginTop: 12, color: 'var(--p-muted,#91A398)', fontSize: 15 }}>
            Última atualização: {updatedAt}
          </p>
        ) : null}
        <div style={{ marginTop: 32, display: 'grid', gap: 18, fontSize: 17, lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </main>
  );
}
