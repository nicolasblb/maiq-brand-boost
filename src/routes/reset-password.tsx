import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { CheckCircle2, LockKeyhole, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import MaiqButton from '@/components/maiq/MaiqButton';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/reset-password')({
  head: () => ({
    meta: [
      { title: 'Redefinir senha — Maiq' },
      {
        name: 'description',
        content: 'Crie uma nova senha para acessar sua área Maiq com segurança.',
      },
      { property: 'og:title', content: 'Redefinir senha — Maiq' },
      {
        property: 'og:description',
        content: 'Crie uma nova senha para acessar sua área Maiq com segurança.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: ResetPasswordPage,
});

const primaryButtonStyle = {
  '--action-primary-bg': 'var(--p-cta-bg,#EAD9CC)',
  '--action-primary-fg': 'var(--p-cta-fg,#143937)',
  '--action-primary-bg-hover': 'var(--p-cta-bg-hover,#F3E7DE)',
  '--action-primary-bg-active': 'var(--p-cta-bg-active,#DEC7B2)',
} as CSSProperties;

const fieldStyle: CSSProperties = {
  width: '100%',
  height: '46px',
  border: '1px solid var(--p-hair,rgba(234,217,204,.14))',
  borderRadius: 'var(--radius-md)',
  background: 'var(--p-chip-bg,rgba(234,217,204,.04))',
  color: 'var(--p-text,#EAD9CC)',
  font: 'inherit',
  outline: 'none',
  padding: '0 14px',
};

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkRecoverySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const hasRecoveryHash = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setReady(Boolean(data.session || hasRecoveryHash));
      setInvalid(!data.session && !hasRecoveryHash);
    };
    void checkRecoverySession();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError('Não foi possível atualizar sua senha. Abra o link novamente ou solicite uma nova recuperação.');
      return;
    }
    setSuccess(true);
    setPassword('');
    setConfirmPassword('');
    toast.success('Senha atualizada com sucesso.');
  };

  return (
    <main data-maiq-scope="" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px', background: 'var(--p-bg,#0F2B2A)', color: 'var(--p-text,#EAD9CC)', fontFamily: 'var(--font-core)' }}>
      <section style={{ width: 'min(100%, 520px)', border: '1px solid var(--p-hair,rgba(234,217,204,.14))', borderRadius: 'var(--radius-xl)', background: 'var(--p-card,#1F5956)', boxShadow: 'var(--shadow-3)', padding: '30px' }}>
        <p style={{ margin: 0, color: 'var(--p-muted,#9FD6D2)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em' }}>Segurança</p>
        <h1 style={{ margin: '10px 0 12px', fontSize: 'clamp(30px,5vw,42px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: 0 }}>Redefinir senha</h1>
        <p style={{ margin: 0, color: 'var(--p-text-2,#AFE3E0)', fontSize: '15px', lineHeight: 1.55 }}>Crie uma nova senha para continuar acessando a Maiq.</p>

        {invalid ? (
          <div style={{ marginTop: '24px' }}>
            <Message tone="critical">Este link não está mais válido. Solicite uma nova recuperação pelo formulário de login.</Message>
            <div style={{ marginTop: '18px' }}>
              <MaiqButton type="button" size="lg" variant="primary" fullWidth style={primaryButtonStyle} onClick={() => navigate({ to: '/' })}>Voltar para a página institucional</MaiqButton>
            </div>
          </div>
        ) : success ? (
          <div style={{ marginTop: '24px' }}>
            <Message tone="success">Sua senha foi atualizada. Você já pode voltar e entrar com a nova senha.</Message>
            <div style={{ marginTop: '18px' }}>
              <MaiqButton type="button" size="lg" variant="primary" fullWidth style={primaryButtonStyle} onClick={() => navigate({ to: '/' })}>Voltar para a página institucional</MaiqButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ marginTop: '24px', display: 'grid', gap: '16px', opacity: ready ? 1 : 0.6 }}>
            <label htmlFor="new-password" style={{ display: 'grid', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--p-text-2,#AFE3E0)', fontSize: '13px', fontWeight: 500 }}><LockKeyhole size={16} /> Nova senha</span>
              <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} disabled={!ready || loading} />
            </label>
            <label htmlFor="confirm-password" style={{ display: 'grid', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--p-text-2,#AFE3E0)', fontSize: '13px', fontWeight: 500 }}><LockKeyhole size={16} /> Confirmar senha</span>
              <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={fieldStyle} disabled={!ready || loading} />
            </label>
            {error ? <Message tone="critical">{error}</Message> : null}
            <MaiqButton type="submit" size="lg" variant="primary" fullWidth style={primaryButtonStyle} disabled={!ready || loading}>
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </MaiqButton>
          </form>
        )}
      </section>
    </main>
  );
}

function Message({ tone, children }: { tone: 'success' | 'critical'; children: ReactNode }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div role={tone === 'critical' ? 'alert' : 'status'} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', border: '1px solid var(--p-hair,rgba(234,217,204,.14))', borderRadius: 'var(--radius-md)', background: 'var(--p-chip-bg,rgba(234,217,204,.04))', color: tone === 'success' ? 'var(--state-positive,#4E8F6E)' : 'var(--state-critical,#9E4A31)', padding: '12px 14px', fontSize: '14px', lineHeight: 1.45 }}>
      <Icon size={17} style={{ marginTop: '1px', flex: '0 0 auto' }} />
      <span>{children}</span>
    </div>
  );
}