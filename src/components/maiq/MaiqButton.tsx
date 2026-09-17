import React, { forwardRef, useState } from 'react';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';

const base: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  fontFamily: 'var(--font-core)',
  fontWeight: 'var(--fw-medium)' as unknown as number,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'var(--transition-ui)',
  whiteSpace: 'nowrap',
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { height: 34, padding: '0 16px', fontSize: 'var(--fs-body-sm)' },
  md: { height: 42, padding: '0 22px', fontSize: 'var(--fs-body-sm)' },
  lg: { height: 52, padding: '0 30px', fontSize: 'var(--fs-body)' },
};

const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--action-primary-bg)', color: 'var(--action-primary-fg)' },
  secondary: {
    background: 'var(--action-secondary-bg)',
    color: 'var(--action-secondary-fg)',
    borderColor: 'var(--action-secondary-border)',
  },
  ghost: { background: 'transparent', color: 'var(--action-ghost-fg)' },
  accent: { background: 'var(--action-accent-bg)', color: 'var(--action-accent-fg)' },
};

const hovers: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--action-primary-bg-hover)' },
  secondary: { background: 'var(--action-ghost-bg-hover)', borderColor: 'var(--text-primary)' },
  ghost: { background: 'var(--action-ghost-bg-hover)', color: 'var(--text-primary)' },
  accent: { background: 'var(--green-500)' },
};

const actives: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--action-primary-bg-active)' },
  secondary: {},
  ghost: {},
  accent: {},
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

const MaiqButton = forwardRef<HTMLButtonElement, Props>(function MaiqButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  style,
  children,
  ...rest
}: Props, ref) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const merged: React.CSSProperties = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    ...(active && !disabled ? actives[variant] : null),
    ...(fullWidth ? { width: '100%' } : null),
    ...(disabled ? { opacity: 0.45, cursor: 'not-allowed' } : null),
    ...style,
  };
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      style={merged}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {children}
    </button>
  );
});

export default MaiqButton;
