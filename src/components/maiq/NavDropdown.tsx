import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type NavDropdownProps = {
  label: string;
  items: { key: string; label: string }[];
  onSelect?: (key: string) => void;
};

export default function NavDropdown(props: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 160); };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  const menuStyle: React.CSSProperties = { position: "absolute", top: "34px", left: "-14px", minWidth: "212px", padding: "8px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "16px", background: "var(--p-card,#1F5956)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "var(--p-header-shadow,0 10px 40px rgba(6,22,21,.35))", display: "flex", flexDirection: "column", gap: "2px", zIndex: "60" };
  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
      onFocus={() => { cancelClose(); setOpen(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", color: open ? "var(--p-text,#EAD9CC)" : "inherit", transition: "color 200ms cubic-bezier(.2,0,0,1)" }}
        data-hover-style="color:var(--p-text,#EAD9CC)"
      >
        {props.label}
        <ChevronDown
          strokeWidth={2}
          style={{ width: 15, height: 15, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 220ms cubic-bezier(.16,1,.3,1)" }}
        />
      </span>
      {open ? (
        <div role="menu" style={menuStyle}>
          {props.items.map((it) => (
            <span
              key={it.key}
              role="menuitem"
              tabIndex={0}
              onClick={() => { setOpen(false); props.onSelect?.(it.key); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(false); props.onSelect?.(it.key); } }}
              style={{ padding: "9px 12px", borderRadius: "10px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}
              data-hover-style="color:var(--p-text,#EAD9CC);background:var(--p-chip-bg,rgba(234,217,204,.06))"
            >
              {it.label}
            </span>
          ))}
        </div>
      ) : null}
    </span>
  );
}
