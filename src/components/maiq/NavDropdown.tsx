import { Fragment, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

type NavDropdownItem = {
  key: string;
  label: string;
  /** Renderiza um separador logo abaixo deste item. */
  separatorAfter?: boolean;
  /** Estilo do separador: `"solid"` (padrão) é a linha cheia usada acima do
   * grupo "Entrar"/"Fale Conosco"; `"fade"` é uma linha decorativa com
   * fadeout nas pontas, usada para indicar troca de página (não de seção). */
  separatorVariant?: 'solid' | 'fade';
  /** Item (e seu separador, se houver) só aparece em `--mobile-auth`
   * (ver `@media(max-width:430px)` em maiq.css) — usado pelo menu compacto
   * do SiteHeader para "Entrar"/"Conta" e "Fale Conosco". */
  mobileOnly?: boolean;
  /** Item que leva a outra página (não a uma seção da Home) — ganha peso de
   * fonte maior para se distinguir das seções (ver .maiq-nav-dropdown-item--page). */
  pageLink?: boolean;
};

type NavDropdownProps = {
  items: NavDropdownItem[];
  onSelect?: (key: string) => void;
  /** Rótulo do gatilho padrão ("Home▾"). Ignorado quando `triggerVariant="icon"`. */
  label?: string;
  /** `"link"` (padrão) é o gatilho "Home▾" com hover. `"icon"` é o gatilho de
   * ícone único do menu compacto (<1024px), aberto por clique. */
  triggerVariant?: 'link' | 'icon';
  triggerIcon?: React.ReactNode;
  triggerAriaLabel?: string;
  triggerStyle?: React.CSSProperties;
  triggerClassName?: string;
  /** Painel abre por clique (touch-first) em vez de hover — usado pelo menu compacto. */
  openOnClick?: boolean;
  /** Lado a partir do qual o painel se alinha. */
  align?: 'left' | 'right';
};

export default function NavDropdown({
  items,
  onSelect,
  label,
  triggerVariant = 'link',
  triggerIcon,
  triggerAriaLabel,
  triggerStyle,
  triggerClassName,
  openOnClick = false,
  align = 'left',
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 160); };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: "34px",
    ...(align === 'right' ? { right: "-8px" } : { left: "-14px" }),
    minWidth: "212px",
    padding: "8px",
    border: "1px solid var(--p-hair,rgba(234,217,204,.14))",
    borderRadius: "16px",
    background: "var(--p-card,#1F5956)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "var(--p-header-shadow,0 10px 40px rgba(6,22,21,.35))",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    zIndex: "60",
  };

  const hoverHandlers = openOnClick
    ? {}
    : {
        onMouseEnter: () => { cancelClose(); setOpen(true); },
        onMouseLeave: scheduleClose,
      };

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      {...hoverHandlers}
      onFocus={() => { if (!openOnClick) { cancelClose(); setOpen(true); } }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={triggerAriaLabel}
        className={triggerClassName}
        onClick={openOnClick ? () => setOpen((o) => !o) : undefined}
        onKeyDown={openOnClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); } } : undefined}
        style={
          triggerVariant === 'icon'
            ? { display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...triggerStyle }
            : { display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", color: open ? "var(--p-text,#EAD9CC)" : "inherit", transition: "color 200ms cubic-bezier(.2,0,0,1)" }
        }
        data-hover-style={triggerVariant === 'icon' ? undefined : "color:var(--p-text,#EAD9CC)"}
      >
        {triggerVariant === 'icon' ? (
          triggerIcon ?? (open ? <X style={{ display: 'block', width: 20, height: 20 }} strokeWidth={1.9} /> : <Menu style={{ display: 'block', width: 20, height: 20 }} strokeWidth={1.9} />)
        ) : (
          <>
            {label}
            <ChevronDown
              strokeWidth={2}
              style={{ width: 15, height: 15, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 220ms cubic-bezier(.16,1,.3,1)" }}
            />
          </>
        )}
      </span>
      {open ? (
        <div role="menu" style={menuStyle}>
          {items.map((it) => (
            <Fragment key={it.key}>
              <span
                className={`maiq-nav-dropdown-item${it.mobileOnly ? ' maiq-nav-dropdown-item--mobile-auth' : ''}${it.pageLink ? ' maiq-nav-dropdown-item--page' : ''}`}
                role="menuitem"
                tabIndex={0}
                onClick={() => { setOpen(false); onSelect?.(it.key); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(false); onSelect?.(it.key); } }}
                style={{ padding: "9px 12px", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}
              >
                {it.label}
              </span>
              {it.separatorAfter ? (
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  className={`maiq-nav-dropdown-separator${it.mobileOnly ? ' maiq-nav-dropdown-separator--mobile-auth' : ''}${it.separatorVariant === 'fade' ? ' maiq-nav-dropdown-separator--fade' : ''}`}
                  style={
                    it.separatorVariant === 'fade'
                      ? { height: "1px", margin: "8px 0" }
                      : { height: "1px", margin: "6px 4px", background: "var(--p-hair,rgba(234,217,204,.14))" }
                  }
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}
    </span>
  );
}
