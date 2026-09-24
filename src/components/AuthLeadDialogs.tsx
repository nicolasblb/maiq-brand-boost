import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import type { User } from '@supabase/supabase-js';
import { AlertCircle, ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, LockKeyhole, LogOut, Mail, MessageSquareText, Phone, UserRound } from 'lucide-react';
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
type AuthField = keyof AuthForm;
type LeadField = 'name' | 'email' | 'phone' | 'company' | 'message';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d\s.-]{8,40}$/;

const fieldStyle: CSSProperties = {
  width: '100%',
  height: '46px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--p-hair,rgba(234,217,204,.14))',
  borderRadius: 'var(--radius-md)',
  background: 'var(--p-chip-bg,rgba(234,217,204,.04))',
  color: 'var(--p-text,#EAD9CC)',
  font: 'inherit',
  outline: 'none',
  padding: '0 14px',
  transition: 'border-color 200ms cubic-bezier(.2,0,0,1), background 200ms cubic-bezier(.2,0,0,1)',
};

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'var(--p-text-2,#AFE3E0)',
  fontSize: '13px',
  fontWeight: 500,
};

const secondaryButtonStyle = {
  '--action-ghost-fg': 'var(--p-text-2,#AFE3E0)',
  '--action-ghost-bg-hover': 'var(--p-chip-bg-strong,rgba(234,217,204,.13))',
  color: 'var(--p-text-2,#AFE3E0)',
} as CSSProperties;

const primaryButtonStyle = {
  '--action-primary-bg': 'var(--p-cta-bg,#EAD9CC)',
  '--action-primary-fg': 'var(--p-cta-fg,#143937)',
  '--action-primary-bg-hover': 'var(--p-cta-bg-hover,#F3E7DE)',
  '--action-primary-bg-active': 'var(--p-cta-bg-active,#DEC7B2)',
} as CSSProperties;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function validateLead(form: LeadForm) {
  const email = normalizeEmail(form.email);
  const phone = form.phone?.trim() ?? '';
  const errors: Partial<Record<LeadField, string>> = {};
  if (form.name.trim().length < 2) errors.name = 'Informe seu nome.';
  if (!EMAIL_RE.test(email)) errors.email = 'Informe um email válido.';
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Informe um telefone válido.';
  if (form.company.trim().length < 2) errors.company = 'Informe sua empresa.';
  if ((form.message?.trim().length ?? 0) > 2000) errors.message = 'A mensagem deve ter até 2.000 caracteres.';
  return errors;
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
        background: 'var(--p-modal-scrim,rgba(5,18,17,.68))',
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
          overflow: 'hidden',
          border: '1px solid var(--p-hair,rgba(234,217,204,.14))',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--p-card,#1F5956)',
          color: 'var(--p-text,#EAD9CC)',
          boxShadow: 'var(--shadow-3)',
        }}
      >
        {children}
      </section>
    </div>
  );
}

function DialogHeader({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div style={{ padding: '28px 28px 0' }}>
      {eyebrow ? <p style={{ margin: 0, color: 'var(--p-muted,#9FD6D2)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em' }}>{eyebrow}</p> : null}
      <h2 style={{ margin: eyebrow ? '10px 0 0' : 0, color: 'var(--p-text,#EAD9CC)', fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: 0 }}>
        {title}
      </h2>
      {children ? <div style={{ marginTop: '12px', color: 'var(--p-text-2,#AFE3E0)', fontSize: '15px', lineHeight: 1.55 }}>{children}</div> : null}
    </div>
  );
}

function TextInput({
  id,
  label,
  icon,
  error,
  trailingAction,
  required,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; icon: ReactNode; error?: boolean | undefined; trailingAction?: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <label htmlFor={id} style={labelStyle}>
        {icon}<span>{label}{required ? <span aria-hidden="true" style={{ color: 'var(--p-required,var(--state-attention,#A6822F))' }}> *</span> : null}</span>
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          required={required}
          aria-invalid={error || undefined}
          style={{ ...fieldStyle, paddingRight: trailingAction ? '52px' : '14px', borderColor: error ? 'var(--state-critical,#9E4A31)' : 'var(--p-hair,rgba(234,217,204,.14))', background: error ? 'color-mix(in srgb, var(--state-critical,#9E4A31) 13%, var(--p-chip-bg,transparent))' : 'var(--p-chip-bg,rgba(234,217,204,.04))' }}
          {...props}
        />
        {trailingAction ? <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)' }}>{trailingAction}</div> : null}
      </div>
    </div>
  );
}

function RequiredLegend() {
  return (
    <p className="maiq-required-legend"><span aria-hidden="true">*</span> Campos sinalizados são obrigatórios.</p>
  );
}

function MessageArea({ error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean | undefined }) {
  return <textarea aria-label="Descreva como podemos ajudar" aria-invalid={error || undefined} className="maiq-message-textarea maiq-form-scroll" style={{ ...fieldStyle, borderColor: error ? 'var(--state-critical,#9E4A31)' : 'var(--p-hair,rgba(234,217,204,.14))' }} {...props} />;
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
  const [authFieldErrors, setAuthFieldErrors] = useState<Partial<Record<AuthField, boolean>>>({});
  const [authLoading, setAuthLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);
  const [leadMode, setLeadMode] = useState<LeadMode>('form');
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', email: '', phone: '', company: '', message: '' });
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadFieldErrors, setLeadFieldErrors] = useState<Partial<Record<LeadField, string | undefined>>>({});
  const [leadLoading, setLeadLoading] = useState(false);

  const signedInEmail = useMemo(() => user?.email ?? '', [user?.email]);

  useEffect(() => {
    if (authOpen) {
      setAuthMode(user ? 'account' : 'login');
      setAuthError(null);
      setAuthFieldErrors({});
      setPasswordVisible(false);
      setRecoverSent(false);
    }
  }, [authOpen, user]);

  useEffect(() => {
    if (leadOpen) {
      setLeadMode('form');
      setLeadError(null);
      setLeadFieldErrors({});
      setLeadForm((current) => ({ ...current, email: signedInEmail || current.email }));
    }
  }, [leadOpen, signedInEmail]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const email = normalizeEmail(authForm.email);
    const fieldErrors: Partial<Record<AuthField, boolean>> = {
      email: !EMAIL_RE.test(email),
      password: authForm.password.length < 6,
    };
    if (fieldErrors.email || fieldErrors.password) {
      setAuthFieldErrors(fieldErrors);
      setAuthError(fieldErrors.email && fieldErrors.password ? 'Revise o email e a senha destacados.' : fieldErrors.email ? 'Informe um email válido.' : 'Informe sua senha.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthFieldErrors({});
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: authForm.password });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message.includes('Invalid login credentials') ? 'Email ou senha incorretos.' : 'Não foi possível entrar agora.');
      setAuthFieldErrors({ email: true, password: true });
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
    const validationErrors = validateLead(leadForm);
    if (Object.keys(validationErrors).length > 0) {
      setLeadFieldErrors(validationErrors);
      setLeadError('Revise os campos destacados antes de enviar.');
      return;
    }

    setLeadLoading(true);
    setLeadError(null);
    setLeadFieldErrors({});
    const phone = leadForm.phone?.trim() ?? '';
    try {
      await submitLeadFn({
        data: {
          name: leadForm.name.trim(),
          email: normalizeEmail(leadForm.email),
          company: leadForm.company.trim(),
          ...(leadForm.message?.trim() ? { message: leadForm.message.trim() } : {}),
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
  const requestRegistration = () => {
    onAuthOpenChange(false);
    onLeadOpenChange(true);
  };

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
              <RequiredLegend />
              <TextInput id="recover-email" label="Email" icon={<Mail size={16} />} required type="email" autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} />
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
            <DialogHeader title="Login" />
            <div style={{ padding: '28px 28px 32px', display: 'grid', gap: '16px' }}>
              <RequiredLegend />
              <TextInput id="login-email" label="Email" icon={<Mail size={16} />} required error={authFieldErrors.email} type="email" autoComplete="email" value={authForm.email} onChange={(event) => { setAuthForm((current) => ({ ...current, email: event.target.value })); setAuthFieldErrors((current) => ({ ...current, email: false })); }} />
              <TextInput id="login-password" label="Senha" icon={<LockKeyhole size={16} />} required error={authFieldErrors.password} type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" value={authForm.password} onChange={(event) => { setAuthForm((current) => ({ ...current, password: event.target.value })); setAuthFieldErrors((current) => ({ ...current, password: false })); }} trailingAction={<MaiqButton type="button" size="sm" variant="ghost" style={{ ...secondaryButtonStyle, width: '38px', padding: 0 }} aria-label={passwordVisible ? 'Ocultar senha' : 'Exibir senha'} title={passwordVisible ? 'Ocultar senha' : 'Exibir senha'} onClick={() => setPasswordVisible((current) => !current)}>{passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}</MaiqButton>} />
              {authError ? <Message tone="critical">{authError}</Message> : null}
              <MaiqButton type="submit" size="lg" variant="primary" fullWidth style={primaryButtonStyle} disabled={authLoading}>
                {authLoading ? 'Entrando...' : 'Entrar'}
              </MaiqButton>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px' }}>
                <MaiqButton type="button" size="md" variant="ghost" fullWidth style={{ ...secondaryButtonStyle, padding: '0 8px', whiteSpace: 'normal' }} onClick={() => { setAuthMode('recover'); setAuthError(null); }}>Esqueci minha senha</MaiqButton>
                <MaiqButton type="button" size="md" variant="ghost" fullWidth style={{ ...secondaryButtonStyle, padding: '0 8px', whiteSpace: 'normal' }} onClick={requestRegistration}>Solicitar cadastro</MaiqButton>
              </div>
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
          <form onSubmit={handleLeadSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', maxHeight: 'min(86vh, 760px)' }}>
            <DialogHeader title="Fale Conosco" />
            <div className="maiq-form-scroll" style={{ marginTop: '20px', padding: '0 28px', display: 'grid', gap: '16px', overflowY: 'auto', overscrollBehavior: 'contain' }}>
              <RequiredLegend />
              <TextInput id="lead-name" label="Nome" icon={<UserRound size={16} />} required error={Boolean(leadFieldErrors.name)} type="text" autoComplete="name" value={leadForm.name} onChange={(event) => { setLeadForm((current) => ({ ...current, name: event.target.value })); setLeadFieldErrors((current) => ({ ...current, name: undefined })); }} />
              <TextInput id="lead-email" label="Email" icon={<Mail size={16} />} required error={Boolean(leadFieldErrors.email)} type="email" autoComplete="email" value={leadForm.email} onChange={(event) => { setLeadForm((current) => ({ ...current, email: event.target.value })); setLeadFieldErrors((current) => ({ ...current, email: undefined })); }} />
              <TextInput id="lead-phone" label="Telefone" icon={<Phone size={16} />} error={Boolean(leadFieldErrors.phone)} type="tel" autoComplete="tel" value={leadForm.phone ?? ''} onChange={(event) => { setLeadForm((current) => ({ ...current, phone: event.target.value })); setLeadFieldErrors((current) => ({ ...current, phone: undefined })); }} />
              <TextInput id="lead-company" label="Empresa" icon={<Building2 size={16} />} required error={Boolean(leadFieldErrors.company)} type="text" autoComplete="organization" value={leadForm.company} onChange={(event) => { setLeadForm((current) => ({ ...current, company: event.target.value })); setLeadFieldErrors((current) => ({ ...current, company: undefined })); }} />
              <span style={labelStyle}><MessageSquareText size={16} />Descreva como podemos ajudar (opcional)</span>
              <MessageArea id="lead-message" error={Boolean(leadFieldErrors.message)} maxLength={2000} value={leadForm.message ?? ''} onChange={(event) => { setLeadForm((current) => ({ ...current, message: event.target.value })); setLeadFieldErrors((current) => ({ ...current, message: undefined })); }} />
              {leadError ? <Message tone="critical">{leadError}</Message> : null}
            </div>
            <div style={{ padding: '20px 28px 28px', flex: '0 0 auto' }}>
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
        border: tone === 'critical' ? '1px solid var(--state-critical,#9E4A31)' : '1px solid var(--p-hair,rgba(234,217,204,.14))',
        borderRadius: 'var(--radius-md)',
        background: tone === 'critical' ? 'color-mix(in srgb, var(--state-critical,#9E4A31) 22%, var(--p-card,#1F5956))' : 'var(--p-chip-bg,rgba(234,217,204,.04))',
        color: tone === 'success' ? 'var(--state-positive,#4E8F6E)' : 'var(--p-text,#EAD9CC)',
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