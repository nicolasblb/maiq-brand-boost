import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import type { User } from '@supabase/supabase-js';
import { AlertCircle, ArrowLeft, Building2, CheckCircle2, LockKeyhole, LogOut, Mail, Phone, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import MaiqButton from '@/components/maiq/MaiqButton';
import { supabase } from '@/integrations/supabase/client';
import { submitLead, type LeadInput } from '@/lib/leads.functions';

type Theme = 'noite' | 'claro';
type AuthMode = 'login' | 'recover' | 'account';
type LeadMode = 'form' | 'success';

type AuthLeadDialogsProps = {
  theme: Theme;
  authOpen: boolean;
  leadOpen: boolean;
  user: User | null;
  onAuthOpenChange: (open: boolean) => void;
  onLeadOpenChange: (open: boolean) => void;
  onUserChange: (user: User | null) => void;
};

type AuthForm = {
  email: string;
  password: string;
};

type LeadForm = LeadInput;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{8,40}$/;

const fieldStyle: CSSProperties = {
  width: '100%',
  height: '46px',
  border: '1px solid var(--p-hair,rgba(233,224,209,.14))',
  borderRadius: 'var(--radius-md)',
  background: 'var(--p-chip-bg,rgba(233,224,209,.04))',
  color: 'var(--p-text,#E9E0D1)',
  font: 'inherit',
  outline: 'none',
  padding: '0 14px',
  transition: 'border-color 200ms cubic-bezier(.2,0,0,1), background 200ms cubic-bezier(.2,0,0,1)',
};

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'var(--p-text-2,#B7C4BC)',
  fontSize: '13px',
  fontWeight: 500,
};

const secondaryButtonStyle = {
  '--action-ghost-fg': 'var(--p-text-2,#B7C4BC)',
  '--action-ghost-bg-hover': 'var(--p-chip-bg-strong,rgba(233,224,209,.13))',
  color: 'var(--p-text-2,#B7C4BC)',
} as CSSProperties;

const primaryButtonStyle = {
  '--action-primary-bg': 'var(--p-cta-bg,#E9E0D1)',
  '--action-primary-fg': 'var(--p-cta-fg,#143737)',
  '--action-primary-bg-hover': 'var(--p-cta-bg-hover,#F1EBE0)',
  '--action-primary-bg-active': 'var(--p-cta-bg-active,#DCD0BC)',
} as CSSProperties;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function validateLead(form: LeadForm) {
  const email = normalizeEmail(form.email);
  const phone = form.phone?.trim() ?? '';
  if (form.name.trim().length < 2) return 'Informe seu nome.';
  if (!EMAIL_RE.test(email)) return 'Informe um email válido.';
  if (phone && !PHONE_RE.test(phone)) return 'Informe um telefone válido.';
  if (form.company.trim().length < 2) return 'Informe sua empresa.';
  return null;
}

function ModalFrame({
  open,
  theme,
  title,
  children,
  onClose,
}: {
  open: boolean;
  theme: Theme;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      data-maiq-scope=""
      data-theme={theme === 'claro' ? 'claro' : undefined}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--p-modal-scrim,rgba(4,16,16,.68))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: 'min(100%, 520px)',
          maxHeight: 'min(86vh, 760px)',
          overflow: 'auto',
          border: '1px solid var(--p-hair,rgba(233,224,209,.14))',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--p-card,#1B4442)',
          color: 'var(--p-text,#E9E0D1)',
          boxShadow: 'var(--shadow-3)',
        }}
      >
        {children}
      </section>
    </div>
  );
}

function DialogHeader({ title, eyebrow, children }: { title: string; eyebrow: string; children?: ReactNode }) {
  return (
    <div style={{ padding: '28px 28px 0' }}>
      <p style={{ margin: 0, color: 'var(--p-muted,#91A398)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em' }}>
        {eyebrow}
      </p>
      <h2 style={{ margin: '10px 0 0', color: 'var(--p-text,#E9E0D1)', fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: 0 }}>
        {title}
      </h2>
      {children ? <div style={{ marginTop: '12px', color: 'var(--p-text-2,#B7C4BC)', fontSize: '15px', lineHeight: 1.55 }}>{children}</div> : null}
    </div>
  );
}

function TextInput({
  id,
  label,
  icon,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; icon: ReactNode; error?: boolean }) {
  return (
    <label htmlFor={id} style={{ display: 'grid', gap: '8px' }}>
      <span style={labelStyle}>{icon}{label}</span>
      <input
        id={id}
        style={{ ...fieldStyle, borderColor: error ? 'var(--state-critical,#9E4A31)' : 'var(--p-hair,rgba(233,224,209,.14))' }}
        {...props}
      />
    </label>
  );
}

export default function AuthLeadDialogs({
  theme,
  authOpen,
  leadOpen,
  user,
  onAuthOpenChange,
  onLeadOpenChange,
  onUserChange,
}: AuthLeadDialogsProps) {
  const queryClient = useQueryClient();
  const submitLeadFn = useServerFn(submitLead);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authForm, setAuthForm] = useState<AuthForm>({ email: '', password: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);
  const [leadMode, setLeadMode] = useState<LeadMode>('form');
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', email: '', phone: '', company: '' });
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);

  const signedInEmail = useMemo(() => user?.email ?? '', [user?.email]);

  useEffect(() => {
    if (authOpen) {
      setAuthMode(user ? 'account' : 'login');
      setAuthError(null);
      setRecoverSent(false);
    }
  }, [authOpen, user]);

  useEffect(() => {
    if (leadOpen) {
      setLeadMode('form');
      setLeadError(null);
      setLeadForm((current) => ({ ...current, email: signedInEmail || current.email }));
    }
  }, [leadOpen, signedInEmail]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const email = normalizeEmail(authForm.email);
    if (!EMAIL_RE.test(email)) {
      setAuthError('Informe um email válido.');
      return;
    }
    if (authForm.password.length < 6) {
      setAuthError('Informe sua senha.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: authForm.password });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message.includes('Invalid login credentials') ? 'Email ou senha incorretos.' : 'Não foi possível entrar agora.');
      return;
    }
    onUserChange(data.user);
    setAuthMode('account');
    toast.success('Login realizado com sucesso.');
  };

  const handleRecover = async (event: FormEvent) => {
    event.preventDefault();
    const email = normalizeEmail(authForm.email);
    if (!EMAIL_RE.test(email)) {
      setAuthError('Informe o email cadastrado.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setAuthLoading(false);
    if (error) {
      setAuthError('Não foi possível enviar a recuperação agora.');
      return;
    }
    setRecoverSent(true);
    toast.success('Enviamos as instruções de recuperação.');
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    setAuthLoading(false);
    if (error) {
      setAuthError('Não foi possível sair agora.');
      return;
    }
    onUserChange(null);
    onAuthOpenChange(false);
    toast.success('Sessão encerrada.');
  };

  const handleLeadSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateLead(leadForm);
    if (validationError) {
      setLeadError(validationError);
      return;
    }

    setLeadLoading(true);
    setLeadError(null);
    const phone = leadForm.phone?.trim() ?? '';
    try {
      await submitLeadFn({
        data: {
          name: leadForm.name.trim(),
          email: normalizeEmail(leadForm.email),
          company: leadForm.company.trim(),
          ...(phone ? { phone } : {}),
        },
      });
      setLeadMode('success');
      toast.success('Contato registrado com sucesso.');
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : 'Não foi possível registrar seu contato agora.');
    } finally {
      setLeadLoading(false);
    }
  };

  const closeAuth = () => onAuthOpenChange(false);
  const closeLead = () => onLeadOpenChange(false);

  return (
    <>
      <ModalFrame open={authOpen} theme={theme} title="Entrar na Maiq" onClose={closeAuth}>
        {authMode === 'account' && user ? (
          <div>
            <DialogHeader eyebrow="Área logada" title="Seu acesso está reservado.">
              <p style={{ margin: 0 }}>A área logada da Maiq está em preparação. Você já está conectado como {signedInEmail}.</p>
            </DialogHeader>
            <div style={{ padding: '24px 28px 28px', display: 'grid', gap: '14px' }}>
              {authError ? <Message tone="critical">{authError}</Message> : null}
              <MaiqButton type="button" size="lg" variant="primary" fullWidth style={primaryButtonStyle} disabled={authLoading}>
                Em breve
              </MaiqButton>
              <MaiqButton size="md" variant="ghost" fullWidth style={secondaryButtonStyle} onClick={handleSignOut} disabled={authLoading}>
                <LogOut size={17} /> Sair
              </MaiqButton>
            </div>
          </div>
        ) : authMode === 'recover' ? (
          <form onSubmit={handleRecover} noValidate>
            <DialogHeader eyebrow="Recuperação" title="Redefina sua senha.">
              <p style={{ margin: 0 }}>Enviaremos um link seguro para o email cadastrado.</p>
            </DialogHeader>
            <div style={{ padding: '24px 28px 28px', display: 'grid', gap: '16px' }}>
              <TextInput id="recover-email" label="Email" icon={<Mail size={16} />} type="email" autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} />
              {recoverSent ? <Message tone="success">Confira sua caixa de entrada para continuar.</Message> : null}
              {authError ? <Message tone="critical">{authError}</Message> : null}
              <MaiqButton type="submit" size="lg" variant="primary" fullWidth style={primaryButtonStyle} disabled={authLoading}>
                {authLoading ? 'Enviando...' : 'Enviar link'}
              </MaiqButton>
              <MaiqButton type="button" size="md" variant="ghost" fullWidth style={secondaryButtonStyle} onClick={() => { setAuthMode('login'); setAuthError(null); }}>
                <ArrowLeft size={17} /> Voltar para login
              </MaiqButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} noValidate>
            <DialogHeader eyebrow="Acesso" title="Entre na área Maiq.">
              <p style={{ margin: 0 }}>A área logada será liberada em breve para usuários autorizados.</p>
            </DialogHeader>
            <div style={{ padding: '24px 28px 28px', display: 'grid', gap: '16px' }}>
              <TextInput id="login-email" label="Email" icon={<Mail size={16} />} type="email" autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} />
              <TextInput id="login-password" label="Senha" icon={<LockKeyhole size={16} />} type="password" autoComplete="current-password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} />
              {authError ? <Message tone="critical">{authError}</Message> : null}
              <MaiqButton type="submit" size="lg" variant="primary" fullWidth style={primaryButtonStyle} disabled={authLoading}>
                {authLoading ? 'Entrando...' : 'Entrar'}
              </MaiqButton>
              <MaiqButton type="button" size="md" variant="ghost" fullWidth style={secondaryButtonStyle} onClick={() => { setAuthMode('recover'); setAuthError(null); }}>
                Esqueci minha senha
              </MaiqButton>
            </div>
          </form>
        )}
      </ModalFrame>

      <ModalFrame open={leadOpen} theme={theme} title="Fale Conosco" onClose={closeLead}>
        {leadMode === 'success' ? (
          <div>
            <DialogHeader eyebrow="Contato recebido" title="Vamos falar com você.">
              <p style={{ margin: 0 }}>Seu cadastro foi registrado. O time Maiq entrará em contato pelos dados enviados.</p>
            </DialogHeader>
            <div style={{ padding: '24px 28px 28px' }}>
              <MaiqButton type="button" size="lg" variant="primary" fullWidth style={primaryButtonStyle} onClick={closeLead}>
                Fechar
              </MaiqButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} noValidate>
            <DialogHeader eyebrow="Contato" title="Converse com a Maiq.">
              <p style={{ margin: 0 }}>Preencha seus dados para iniciarmos uma conversa sobre crescimento inorgânico.</p>
            </DialogHeader>
            <div style={{ padding: '24px 28px 28px', display: 'grid', gap: '16px' }}>
              <TextInput id="lead-name" label="Nome" icon={<UserRound size={16} />} type="text" autoComplete="name" value={leadForm.name} onChange={(event) => setLeadForm((current) => ({ ...current, name: event.target.value }))} />
              <TextInput id="lead-email" label="Email" icon={<Mail size={16} />} type="email" autoComplete="email" value={leadForm.email} onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))} />
              <TextInput id="lead-phone" label="Telefone" icon={<Phone size={16} />} type="tel" autoComplete="tel" value={leadForm.phone ?? ''} onChange={(event) => setLeadForm((current) => ({ ...current, phone: event.target.value }))} />
              <TextInput id="lead-company" label="Empresa" icon={<Building2 size={16} />} type="text" autoComplete="organization" value={leadForm.company} onChange={(event) => setLeadForm((current) => ({ ...current, company: event.target.value }))} />
              {leadError ? <Message tone="critical">{leadError}</Message> : null}
              <MaiqButton type="submit" size="lg" variant="primary" fullWidth style={primaryButtonStyle} disabled={leadLoading}>
                {leadLoading ? 'Registrando...' : 'Enviar contato'}
              </MaiqButton>
            </div>
          </form>
        )}
      </ModalFrame>
    </>
  );
}

function Message({ tone, children }: { tone: 'success' | 'critical'; children: ReactNode }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        border: '1px solid var(--p-hair,rgba(233,224,209,.14))',
        borderRadius: 'var(--radius-md)',
        background: 'var(--p-chip-bg,rgba(233,224,209,.04))',
        color: tone === 'success' ? 'var(--state-positive,#4E8F6E)' : 'var(--state-critical,#9E4A31)',
        padding: '12px 14px',
        fontSize: '14px',
        lineHeight: 1.45,
      }}
    >
      <Icon size={17} style={{ marginTop: '1px', flex: '0 0 auto' }} />
      <span>{children}</span>
    </div>
  );
}