import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import Ciclo from '@/components/sections/Ciclo';
import Conviccao from '@/components/sections/Conviccao';
import DominiosPlaceholder from '@/components/sections/DominiosPlaceholder';
// O Domínio removido da página institucional; componente e logos preservados
// (src/components/sections/Dominio.tsx e src/assets/logo-*.asset.json) para a
// futura página "Sobre nós > Domínios".
import Faq from '@/components/sections/Faq';
import PageLoader from '@/components/maiq/PageLoader';
import AuthLeadDialogs from '@/components/AuthLeadDialogs';
import PlatformShowcase from '@/components/maiq/PlatformShowcase';
import MaiqButton from '@/components/maiq/MaiqButton';
import { supabase } from '@/integrations/supabase/client';
import logoBranco from '@/assets/logo-maiq-branco.png';
import logoMadeira from '@/assets/logo-maiq-madeira.png';
import toolGpt from '@/assets/tool-gpt.webp';
import toolClaude from '@/assets/tool-claude.webp';
import toolGemini from '@/assets/tool-gemini.webp';
import toolNotebooklm from '@/assets/tool-notebooklm.webp';
import toolPerplexity from '@/assets/tool-perplexity.webp';
import toolN8n from '@/assets/tool-n8n.webp';

type Any = any;

const DNA_ROW_CFG = [
  { inset: 25, width: 251 },
  { inset: 31, width: 246 },
  { inset: 52, width: 233 },
];
const DNA_EASE = 'cubic-bezier(.33,0,.2,1)';
const DNA_DUR = 560;

function buildHelix() {
  const N = 26, STEP = 0.52, A = 78;
  const lanes: React.ReactNode[] = [];
  const MASK = 'radial-gradient(ellipse 96px 74px at 50% 50%, transparent 0%, transparent 50%, #000 100%)';
  for (let i = 0; i < N; i++) {
    const d = -((N - 1 - i) * STEP);
    const rung = React.createElement('div', {
      'data-maiq-anim': '', style: {
        position: 'absolute', top: 'calc(50% - .75px)', left: 'calc(50% - ' + A + 'px)',
        height: '1.5px', width: (A * 2) + 'px', background: 'var(--p-helix,rgba(145,163,152,.6))',
        transformOrigin: '50% 50%', animation: 'maiqRung 4.5s cubic-bezier(.4,0,.6,1) infinite',
        animationDelay: d.toFixed(3) + 's', willChange: 'transform,opacity',
      },
    });
    const node = (off: number, key: string) => React.createElement('div', {
      key, 'data-maiq-anim': '', style: {
        position: 'absolute', top: 'calc(50% - 3px)', left: 'calc(50% - 3px)',
        width: '6px', height: '6px', borderRadius: '50%',
        background: 'var(--p-helix-hi,rgba(233,224,209,.92))',
        animation: 'maiqStrand 9s cubic-bezier(.4,0,.6,1) infinite',
        animationDelay: (d - off * 2.5).toFixed(3) + 's', willChange: 'transform,opacity',
      },
    });
    lanes.push(React.createElement('div', { key: i, style: { flex: '1 0 0', position: 'relative', width: '100%' } },
      rung, node(0, 'a'), node(1.8, 'b')));
  }
  return React.createElement('div', {
    style: {
      position: 'absolute', left: 0, top: 0, width: '240px', height: '360px',
      display: 'flex', flexDirection: 'column', WebkitMaskImage: MASK, maskImage: MASK,
    },
  }, lanes);
}

function parseStyleText(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  let depth = 0, cur = '';
  const decls: string[] = [];
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { decls.push(cur); cur = ''; } else cur += ch;
  }
  decls.push(cur);
  decls.forEach((d) => {
    const i = d.indexOf(':');
    if (i < 0) return;
    out[d.slice(0, i).trim()] = d.slice(i + 1).trim();
  });
  return out;
}

const SECOES = [
  { id: 'topo', label: 'Início' },
  { id: 'modelo', label: 'Nosso Modelo' },
  { id: 'fundacao', label: 'Nossa Convicção' },
  { id: 'plataforma', label: 'Nossa Plataforma' },
  { id: 'ciclo', label: 'O M&A' },
  { id: 'dominios', label: 'Os Domínios' },
  { id: 'faq', label: 'FAQ' },
];

function NavDropdown(props: { label: string; items: { key: string; label: string }[]; onSelect?: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<Any>(null);
  const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 160); };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  const menuStyle: React.CSSProperties = { position: "absolute", top: "34px", left: "-14px", minWidth: "212px", padding: "8px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "16px", background: "var(--p-card,#1B4442)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "var(--p-header-shadow,0 10px 40px rgba(6,20,20,.35))", display: "flex", flexDirection: "column", gap: "2px" };
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
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", color: open ? "var(--p-text,#E9E0D1)" : "inherit", transition: "color 200ms cubic-bezier(.2,0,0,1)" }}
        data-hover-style="color:var(--p-text,#E9E0D1)"
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
              data-hover-style="color:var(--p-text,#E9E0D1);background:var(--p-chip-bg,rgba(233,224,209,.06))"
            >
              {it.label}
            </span>
          ))}
        </div>
      ) : null}
    </span>
  );
}

export default function PaginaInstitucional() {
  const [theme, setTheme] = useState<'noite' | 'claro'>('noite');
  const [authOpen, setAuthOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const themeRef = useRef<'noite' | 'claro'>('noite');

  const goToSection = (id: string) => {
    if (id === 'topo') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = (document.querySelector('[data-maiq-sec="' + id + '"]') as HTMLElement | null)
      ?? (document.getElementById(id) as HTMLElement | null);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const menuClearance = window.innerWidth <= 1040 ? 128 : 112;
    window.scrollTo({ top: Math.max(0, top - menuClearance), behavior: 'smooth' });
  };


  const scopeRef = useRef<Any>(null);
  const logoDayRef = useRef<Any>(null);
  const headerSlotRef = useRef<Any>(null);
  const headerLogoRef = useRef<Any>(null);
  const flyLogoRef = useRef<Any>(null);
  const flyLogoDayRef = useRef<Any>(null);
  const heroLogoSlotRef = useRef<Any>(null);
  const logoFooterDayRef = useRef<Any>(null);
  const netWrapRef = useRef<Any>(null);
  const iconSunRef = useRef<Any>(null);
  const iconMoonRef = useRef<Any>(null);
  const tipRef = useRef<Any>(null);
  const thumbRef = useRef<Any>(null);
  const heroRef = useRef<Any>(null);
  const heroContentRef = useRef<Any>(null);
  const overlayRef = useRef<Any>(null);
  const overlay2Ref = useRef<Any>(null);
  const overlay2WrapRef = useRef<Any>(null);
  const overlay3Ref = useRef<Any>(null);
  const netContentRef = useRef<Any>(null);
  const platformHoldRef = useRef<Any>(null);
  const finalWrapRef = useRef<Any>(null);
  const finalHoldRef = useRef<Any>(null);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const segSunRef = useRef<Any>(null);
  const segMoonRef = useRef<Any>(null);
  const marqueeRef = useRef<Any>(null);
  const rowARef = useRef<Any>(null);
  const rowBRef = useRef<Any>(null);
  const dnaRowRef = useRef<Any>(null);
  const vennBoxRef = useRef<Any>(null);
  const scoreRowRef = useRef<Any>(null);
  const scoreTextRef = useRef<Any>(null);
  const chatRowRef = useRef<Any>(null);
  const chatTextRef = useRef<Any>(null);
  const lRow1Ref = useRef<Any>(null);
  const lRow3Ref = useRef<Any>(null);
  const rRow1Ref = useRef<Any>(null);
  const rRow2Ref = useRef<Any>(null);
  const lRailRef = useRef<Any>(null);
  const rRailRef = useRef<Any>(null);
  const lColRef = useRef<Any>(null);
  const rColRef = useRef<Any>(null);
  const lClipRef = useRef<Any>(null);
  const rClipRef = useRef<Any>(null);
  const lTextRef = useRef<Any>(null);
  const rTextRef = useRef<Any>(null);
  // estado mutável compartilhado entre os efeitos (equivalente aos campos da classe original)
  const S = useRef<Any>({}).current;

  const helixBars = useMemo(() => buildHelix(), []);

  const refs = {
    scopeRef, logoDayRef, logoFooterDayRef, flyLogoDayRef, thumbRef, segSunRef, segMoonRef,
    dnaRowRef, vennBoxRef, scoreRowRef, chatRowRef, lRow1Ref, lRow3Ref,
    rRow1Ref, rRow2Ref, lColRef, rColRef, lClipRef, rClipRef, lTextRef, rTextRef,
    scoreTextRef, chatTextRef,
  };

  const setDnaDot = (el: Any, active: boolean, delay: number) => {
    const dot = el.querySelector('[data-maiq-dot]');
    if (!dot) return;
    // Mesma linguagem luminosa dos divisórios da barra da Plataforma.
    dot.style.transition = `opacity 320ms ${DNA_EASE} ${delay}ms, background-color 320ms ${DNA_EASE} ${delay}ms, box-shadow 320ms ${DNA_EASE} ${delay}ms`;
    dot.style.opacity = active ? '1' : '0';
    dot.style.background = active ? 'var(--c-flow,#91A398)' : 'var(--p-text,#E9E0D1)';
    dot.style.boxShadow = active
      ? '0 0 4px 2px color-mix(in oklab,var(--c-flow) 72%,transparent),0 0 12px 5px color-mix(in oklab,var(--c-flow-core) 34%,transparent)'
      : 'none';
  };

  const setDnaRow = (el: Any, i: number, side: string, active: boolean) => {
    if (!el) return;
    const cfg = DNA_ROW_CFG[i]!;
    const g = S._dnaGeom && S._dnaGeom[side];
    const marginProp = side === 'left' ? 'marginLeft' : 'marginRight';
    const delay = i === 0 ? 0 : (active ? 90 + i * 55 : (4 - i) * 55);
    // Sem box-shadow: em alguns navegadores a sombra interna vaza como um
    // traço vertical nas laterais da linha durante o hover.
    el.style.transition = `margin ${DNA_DUR}ms ${DNA_EASE} ${delay}ms, width ${DNA_DUR}ms ${DNA_EASE} ${delay}ms, border-color 320ms ${DNA_EASE} ${delay}ms`;
    el.style.boxShadow = 'none';
    if (active) {
      if (i === 0 && g) {
        el.style[marginProp] = -g.rail + 'px';
        el.style.width = (cfg.width + cfg.inset + g.rail) + 'px';
      }
      el.style.borderTopColor = 'var(--p-hair-strong,rgba(233,224,209,.32))';
      setDnaDot(el, true, delay);
    } else {
      if (i === 0) {
        el.style[marginProp] = cfg.inset + 'px';
        el.style.width = cfg.width + 'px';
      }
      el.style.borderTopColor = 'var(--p-hair,rgba(233,224,209,.14))';
      setDnaDot(el, false, delay);
    }

  };

  const setDnaSide = (side: string, active: boolean) => {
    const isLeft = side === 'left';
    const text = isLeft ? lTextRef.current : rTextRef.current;
    const g = S._dnaGeom && S._dnaGeom[side];
    const rows = isLeft
      ? [scoreRowRef.current, lRow1Ref.current, lRow3Ref.current]
      : [chatRowRef.current, rRow1Ref.current, rRow2Ref.current];
    if (text) {
      const travel = g ? (g.rail + DNA_ROW_CFG[0]!.inset) : 312;
      text.style.opacity = active ? '1' : '0';
      text.style.transform = `translateX(${active ? 0 : travel * (isLeft ? 1 : -1)}px)`;
      text.style.transition = `opacity 300ms ${DNA_EASE}, transform ${DNA_DUR}ms ${DNA_EASE}`;
    }
    rows.forEach((el, i) => setDnaRow(el, i, side, active));
  };

  const handleDnaMove = (e: React.MouseEvent) => {
    if (!dnaRowRef.current) return;
    if (!S._dnaGeom && S._measureDna) S._measureDna();
    const rect = dnaRowRef.current.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    const side = rel < 0.5 ? 'left' : 'right';
    if (side !== S._dnaSide) {
      if (S._dnaSide) setDnaSide(S._dnaSide, false);
      setDnaSide(side, true);
      S._dnaSide = side;
    }
  };
  const handleDnaLeave = () => {
    if (S._dnaSide) { setDnaSide(S._dnaSide, false); S._dnaSide = null; }
  };

  const applyTheme = (next: 'noite' | 'claro') => {
    const scope = scopeRef.current;
    if (scope) {
      if (next === 'claro') scope.setAttribute('data-theme', 'claro');
      else scope.removeAttribute('data-theme');
    }
    document.body.style.background = next === 'claro' ? '#EDE6D9' : '#0D2423';
    [logoDayRef, logoFooterDayRef, flyLogoDayRef].forEach((r) => {
      if (r.current) r.current.style.opacity = next === 'claro' ? '1' : '0';
    });
    const dia = next === 'claro';
    if (thumbRef.current) thumbRef.current.style.transform = dia ? 'translateX(0)' : 'translateX(42px)';
    if (segSunRef.current) segSunRef.current.style.color = dia ? 'var(--p-text)' : 'var(--p-muted)';
    if (segMoonRef.current) segMoonRef.current.style.color = dia ? 'var(--p-muted)' : 'var(--p-text)';
  };

  const toggleTheme = () => {
    const next = themeRef.current === 'claro' ? 'noite' : 'claro';
    themeRef.current = next;
    setTheme(next);
    applyTheme(next);
    try { localStorage.setItem('maiq-theme', next); } catch { /* ignore */ }
  };
  const showTip = () => { if (tipRef.current) tipRef.current.style.opacity = '1'; };
  const hideTip = () => { if (tipRef.current) tipRef.current.style.opacity = '0'; };
  const tipLabel = theme === 'claro' ? 'Mudar para noite' : 'Mudar para dia';

  // hover declarativo (equivalente ao atributo style-hover do original)
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const els: Any[] = Array.prototype.slice.call(scope.querySelectorAll('[data-hover-style]'));
    const cleanups: Array<() => void> = [];
    els.forEach((el) => {
      const props = parseStyleText(el.getAttribute('data-hover-style') || '');
      const prev: Record<string, string> = {};
      const enter = () => {
        Object.keys(props).forEach((k) => {
          prev[k] = el.style.getPropertyValue(k);
          el.style.setProperty(k, props[k]!);
        });
      };
      const leave = () => {
        Object.keys(props).forEach((k) => {
          if (prev[k]) el.style.setProperty(k, prev[k]!);
          else el.style.removeProperty(k);
        });
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    // ---- tema inicial: preferência salva > horário do visitante (6h–18h = diurno)
    let saved: string | null = null;
    try { saved = localStorage.getItem('maiq-theme'); } catch { /* ignore */ }
    const h = new Date().getHours();
    const initial = (saved === 'claro' || saved === 'noite') ? saved : (h >= 6 && h < 18 ? 'claro' : 'noite');
    themeRef.current = initial as Any;
    setTheme(initial as Any);
    applyTheme(initial as Any);

    setupMarquee();
    S._paintLogo = setupLogoFlight();
    setupScroll();
    setupOffscreenPause();
    setupOdometers();
    setupDna();

    return () => {
      if (S._odoIO) S._odoIO.disconnect();
      if (S._odos) S._odos.forEach((o: Any) => { if (o.raf) cancelAnimationFrame(o.raf); });
      if (S._pauseIO) S._pauseIO.disconnect();
      if (S._raf) cancelAnimationFrame(S._raf);
      if (S._remeasure) window.removeEventListener('resize', S._remeasure);
      if (S._measureDna) window.removeEventListener('resize', S._measureDna);
      if (S._onScroll) { window.removeEventListener('scroll', S._onScroll); window.removeEventListener('resize', S._onScroll); }
      if (S._logoMode) window.removeEventListener('resize', S._logoMode);
      if (S._logoLoad) window.removeEventListener('load', S._logoLoad);
      if (S._fitHero) window.removeEventListener('resize', S._fitHero);
      if (S._fitNet) window.removeEventListener('resize', S._fitNet);
      if (S._fitFinal) window.removeEventListener('resize', S._fitFinal);

      if (S._wrap) {
        S._wrap.removeEventListener('mouseenter', S._enter);
        S._wrap.removeEventListener('mouseleave', S._leave);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pausa as animações CSS pesadas do hero quando saem da tela
  function setupOffscreenPause() {
    const scope = scopeRef.current;
    if (!scope || !('IntersectionObserver' in window)) return;
    const groups: Any[] = [];
    if (heroRef.current) groups.push(heroRef.current);
    if (!groups.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        (e.target as HTMLElement).classList.toggle('maiq-anim-off', !e.isIntersecting);
      });
    }, { rootMargin: '10% 0px' });
    groups.forEach((g) => io.observe(g));
    S._pauseIO = io;
  }

  // Odômetro: números da seção "O Modelo" rolam de zero ao valor real
  function setupOdometers() {
    const scope = scopeRef.current;
    if (!scope) return;
    const els: Any[] = Array.prototype.slice.call(scope.querySelectorAll('[data-maiq-odo]'));
    if (!els.length) return;
    S._odos = els.map((el) => {
      const raw = (el.textContent || '').replace(/[^0-9]/g, '');
      const digits = raw.length;
      const target = parseInt(raw, 10) || 0;
      const suffix = el.querySelector('span');
      const prefixTxt = (el.firstChild && el.firstChild.nodeType === 3)
        ? el.firstChild.textContent.replace(/[0-9].*$/, '') : '';
      el.textContent = '';
      if (prefixTxt) {
        const p = document.createElement('span');
        p.textContent = prefixTxt;
        el.appendChild(p);
      }
      const strips: Any[] = [];
      for (let i = 0; i < digits; i++) {
        const box = document.createElement('span');
        box.style.cssText = 'display:inline-block;width:1ch;height:1em;overflow:hidden;vertical-align:bottom;line-height:1';
        const col = document.createElement('span');
        col.style.cssText = 'display:block;will-change:transform';
        for (let d = 0; d < 12; d++) {
          const g = document.createElement('span');
          g.style.cssText = 'display:block;height:1em;line-height:1';
          g.textContent = String(d % 10);
          col.appendChild(g);
        }
        box.appendChild(col);
        el.appendChild(box);
        strips.push(col);
      }
      if (suffix) el.appendChild(suffix);
      const finals = raw.split('').map(Number);
      return { el, finals, strips, digits, target, p: 0 };
    });
    const paintOdo = (o: Any, p: number) => {
      if (Math.abs(p - o.p) < 0.001 && o.painted) return;
      o.p = p; o.painted = true;
      const e = p * p * (3 - 2 * p);
    const measureOdos = () => {
      S._odos.forEach((o: Any) => {
        if (!o.sec) return;
        const rect = o.sec.getBoundingClientRect();
        o.off = rect.top + window.scrollY;
      });
    };
      o.started = true;
      const startedAt = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - startedAt) / 1100);
        paintOdo(o, p);
        if (p < 1) o.raf = requestAnimationFrame(tick);
      };
      o.raf = requestAnimationFrame(tick);
    };
    S._odoIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const odo = S._odos.find((item: Any) => item.el === entry.target);
        if (odo) animateOdo(odo);
        S._odoIO.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    S._odos.forEach((o: Any) => {
      paintOdo(o, 0);
      S._odoIO.observe(o.el);
    });
  }

  // a logo nasce grande no hero e viaja até o slot do header
  function setupLogoFlight() {
    const fly = flyLogoRef.current, slot = headerSlotRef.current,
      mark = headerLogoRef.current, ph = heroLogoSlotRef.current;
    if (!fly || !slot || !mark || !ph) return null;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dock = () => {
      slot.style.width = Math.max(76, mark.getBoundingClientRect().width) + 'px';
      slot.style.overflow = 'visible';
      slot.style.marginRight = '28px';
      mark.style.opacity = '1';
      fly.style.display = 'none';
      ph.style.display = 'none';
    };
    S._logoMode = () => {
      S._logoDocked = reduce || window.innerWidth < 720;
      if (S._logoDocked) dock();
      else { ph.style.display = ''; fly.style.display = ''; }
    };
    S._logoMode();
    window.addEventListener('resize', S._logoMode);
    const paintLogo = (pf: number) => {
      if (S._logoDocked) return;
      const a = ph.getBoundingClientRect(), b = mark.getBoundingClientRect();
      if (!a.height || !b.height) return;
      const e = pf * pf * (3 - 2 * pf);
      const s = 1 + (b.height / a.height - 1) * e;
      const x = a.left + (b.left - a.left) * e, y = a.top + (b.top - a.top) * e;
      fly.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';
      fly.style.opacity = (pf < 0.9 ? 1 : Math.max(0, (1 - pf) / 0.1)).toFixed(3);
      slot.style.width = (b.width * e).toFixed(2) + 'px';
      slot.style.marginRight = (28 * e).toFixed(2) + 'px';
      mark.style.opacity = (pf < 0.9 ? 0 : (pf - 0.9) / 0.1).toFixed(3);
    };
    paintLogo(0);
    S._logoLoad = () => { S._logoMode(); paintLogo(0); };
    window.addEventListener('load', S._logoLoad);
    return paintLogo;
  }

  // o hero fica preso no topo; o conteúdo recua e desvanece
  function setupScroll() {
    const hero = heroRef.current;
    if (hero) {
      S._fitHero = () => {
        hero.style.top = Math.min(0, window.innerHeight - hero.offsetHeight) + 'px';
      };
      S._fitHero();
      window.addEventListener('resize', S._fitHero);
    }

    // A Plataforma fica parada ao fundo enquanto os blocos anterior e seguinte
    // passam por cima. A margem negativa sobrepõe a primeira seção sem reservar
    // duas vezes a altura da camada fixa.
    const net = netWrapRef.current;
    if (net) {
      S._fitNet = () => {
        net.style.top = Math.min(0, window.innerHeight - net.offsetHeight) + 'px';
        const primary = overlayRef.current;
        const hold = platformHoldRef.current;
        if (primary) primary.style.marginTop = `${-net.offsetHeight}px`;
        if (hold) hold.style.height = `${net.offsetHeight}px`;
      };
      S._fitNet();
      window.addEventListener('resize', S._fitNet);
    }



    // FAQ + rodapé formam a camada final parada. O bloco Ciclo + Domínios
    // ocupa a mesma posição visual e, ao sair, revela essa camada.
    const final = finalWrapRef.current;
    if (final) {
      S._fitFinal = () => {
        final.style.top = Math.min(0, window.innerHeight - final.offsetHeight) + 'px';
        const middle = overlay2Ref.current;
        const hold = finalHoldRef.current;
        if (middle) middle.style.marginTop = `${-final.offsetHeight}px`;
        if (hold) hold.style.height = `${final.offsetHeight}px`;
      };
      S._fitFinal();
      window.addEventListener('resize', S._fitFinal);
    }

    const el = heroContentRef.current;
    if (!el || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    let queued = false;
    const paint = () => {
      queued = false;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)));
      // Conteúdo do hero permanece estático enquanto a primeira seção o cobre;
      // apenas a animação da logo acompanha o scroll.
      void p;
      if (S._paintLogo) {
        S._paintLogo(Math.min(1, Math.max(0, (window.scrollY - vh * 0.6) / (vh * 0.3))));
      }
      // O hero é sticky: sem isso suas ~15 camadas desfocadas continuam sendo
      // compostas em toda a página, mesmo já cobertas pela seção seguinte.
      if (hero) {
        const covered = window.scrollY > vh * 1.08;
        if (covered !== S._heroCovered) {
          S._heroCovered = covered;
          hero.style.visibility = covered ? 'hidden' : '';
          hero.classList.toggle('maiq-anim-off', covered);
        }
      }
    };
    S._onScroll = () => {
      if (S._netPar) S._netPar();
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };
    window.addEventListener('scroll', S._onScroll, { passive: true });
    window.addEventListener('resize', S._onScroll);
    paint();
  }

  function setupMarquee() {
    const wrap = marqueeRef.current;
    const rows: Any[] = [
      { el: rowARef.current, dir: -1, px: 42, x: 0 },
      { el: rowBRef.current, dir: 1, px: 34, x: 0 },
    ].filter((r) => r.el);
    if (!rows.length) return;

    const measure = (r: Any) => {
      const gap = parseFloat(getComputedStyle(r.el).columnGap || '0') || 0;
      r.span = r.base.reduce((w: number, n: Any) => w + n.getBoundingClientRect().width + gap, 0);
    };
    rows.forEach((r) => {
      const kids = Array.from(r.el.children) as Any[];
      r.base = kids.slice(0, kids.length / 2);
      kids.slice(r.base.length).forEach((n) => n.remove());
      measure(r);
      if (!Number.isFinite(r.span) || r.span <= 0) return;
      const need = r.span + (r.el.parentElement.clientWidth || 1200) * 2;
      // A largura pode ser zero enquanto imagens/fontes ainda carregam. Um
      // while sem limite nessa condição bloqueia a aba inteira.
      for (let i = 0; i < 8 && r.el.scrollWidth < need; i++) {
        const frag = document.createDocumentFragment();
        r.base.forEach((n: Any) => frag.appendChild(n.cloneNode(true)));
        r.el.appendChild(frag);
      }
      if (r.dir === 1) r.x = -r.span;
    });
    S._remeasure = () => rows.forEach(measure);
    window.addEventListener('resize', S._remeasure);

    S._speed = 1;
    S._target = 1;
    if (wrap) {
      S._enter = () => { S._target = 0; };
      S._leave = () => { S._target = 1; };
      wrap.addEventListener('mouseenter', S._enter);
      wrap.addEventListener('mouseleave', S._leave);
      S._wrap = wrap;
    }

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      S._speed += (S._target - S._speed) * Math.min(dt / 0.32, 1);
      rows.forEach((r) => {
        if (!Number.isFinite(r.span) || r.span <= 0) return;
        r.x += r.dir * r.px * S._speed * dt;
        if (r.x <= -r.span) r.x += r.span;
        if (r.x >= 0) r.x -= r.span;
        r.el.style.transform = 'translate3d(' + r.x.toFixed(2) + 'px,0,0)';
      });
      S._raf = requestAnimationFrame(tick);
    };
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      S._raf = requestAnimationFrame(tick);
    }
  }

  // Geometria das linhas de hover do "Nosso modelo" (máscara arredondada,
  // deslocamento lateral e posição dos círculos luminosos).
  function setupDna() {
    S._measureDna = () => {
      const venn = vennBoxRef.current;
      if (!venn) return;
      const vr = venn.getBoundingClientRect();
      if (!vr.width) return;
      const scale = vr.width / 836;
      const arcAt = (y: number) => { const dy = y - 180; return 180 - Math.sqrt(Math.max(0, 32400 - dy * dy)); };
      const geom: Any = {};
      const side = (name: string, col: Any, clip: Any, textEl: Any, spanEl: Any, rowEls: Any[], capX: number) => {
        if (!col || !clip || !spanEl) return;
        const cr = col.getBoundingClientRect();
        if (!cr.width) return;
        const cx = (vr.left - cr.left) + capX * scale;
        const cy = (vr.top - cr.top) + 180 * scale;
        const mask = `radial-gradient(circle ${180 * scale}px at ${cx}px ${cy}px, rgba(0,0,0,0) 99.6%, #000 100%)`;
        col.style.webkitMaskImage = mask;
        col.style.maskImage = mask;
        const base = Math.round(spanEl.getBoundingClientRect().top - vr.top);
        clip.style.marginTop = base + 'px';
        const pEl = textEl && textEl.querySelector('p');
        if (pEl && pEl.firstChild && pEl.firstChild.length) {
          const rg = document.createRange();
          rg.setStart(pEl.firstChild, 0);
          rg.setEnd(pEl.firstChild, Math.min(8, pEl.firstChild.length));
          const delta = rg.getBoundingClientRect().top - spanEl.getBoundingClientRect().top;
          if (delta) clip.style.marginTop = Math.round(base - delta) + 'px';
        }
        const g = {
          tuck: Math.ceil(cr.width),
          rail: Math.round((name === 'left' ? (vr.left - cr.left) : (cr.right - vr.right)) / scale),
          arc: rowEls.map((el) => el ? Math.round(arcAt((el.getBoundingClientRect().top - vr.top) / scale)) : 0),
        };
        geom[name] = g;
        if (S._dnaSide !== name && textEl) textEl.style.transform = `translateX(${(g.rail + DNA_ROW_CFG[0]!.inset) * (name === 'left' ? 1 : -1)}px)`;
      };
      side('left', lColRef.current, lClipRef.current, lTextRef.current, scoreTextRef.current,
        [scoreRowRef.current, lRow1Ref.current, lRow3Ref.current], 180);
      side('right', rColRef.current, rClipRef.current, rTextRef.current, chatTextRef.current,
        [chatRowRef.current, rRow1Ref.current, rRow2Ref.current], 656);
      S._dnaGeom = geom;
    };
    S._measureDna();
    window.addEventListener('resize', S._measureDna);
  }

  void refs; void iconSunRef; void iconMoonRef; void lRailRef; void rRailRef; void overlay2WrapRef; void overlay3Ref; void netContentRef;

  return (
    <div data-maiq-scope="" ref={scopeRef} style={{ fontFamily: "'Grandview','Barlow',Helvetica,Arial,sans-serif", background: "var(--p-bg,#0D2423)", color: "var(--p-text,#E9E0D1)", minHeight: "100vh", transition: "background 320ms cubic-bezier(.16,1,.3,1),color 320ms cubic-bezier(.16,1,.3,1)" }}>
      <PageLoader />
      <AuthLeadDialogs
        theme={theme}
        authOpen={authOpen}
        leadOpen={leadOpen}
        user={user}
        onAuthOpenChange={setAuthOpen}
        onLeadOpenChange={setLeadOpen}
        onUserChange={setUser}
      />
      <div data-maiq-toggle="" style={{ position: "fixed", top: "30px", right: "32px", zIndex: "51", display: "flex" }}>
        <div onClick={toggleTheme} onMouseEnter={showTip} onMouseLeave={hideTip} style={{ position: "relative", display: "flex", alignItems: "center", height: "44px", padding: "5px", borderWidth: "1px", borderStyle: "solid", borderColor: "var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-header-bg,rgba(20,55,55,.72))", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "var(--p-header-shadow,0 10px 40px rgba(6,20,20,.35))", cursor: "pointer", transition: "border-color 200ms cubic-bezier(.2,0,0,1),background 320ms cubic-bezier(.16,1,.3,1)" }} data-hover-style="border-color:var(--p-hair-strong,rgba(233,224,209,.32))">
          <div ref={thumbRef} style={{ position: "absolute", top: "5px", left: "5px", width: "34px", height: "34px", borderRadius: "999px", background: "var(--p-toggle-thumb,rgba(233,224,209,.14))", transition: "transform 320ms cubic-bezier(.16,1,.3,1),background 320ms cubic-bezier(.16,1,.3,1)" }}>
          </div>
          <div ref={segSunRef} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", color: "var(--p-muted,#91A398)", transition: "color 320ms cubic-bezier(.16,1,.3,1)" }}>
            <Sun style={{ display: "block", width: 18, height: 18 }} strokeWidth={1.9} />
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "8px", height: "34px" }}>
            <div style={{ width: "1.5px", height: "17px", background: "var(--p-hair-strong,rgba(233,224,209,.32))" }}>
            </div>
          </div>
          <div ref={segMoonRef} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", color: "var(--p-muted,#91A398)", transition: "color 320ms cubic-bezier(.16,1,.3,1)" }}>
            <Moon style={{ display: "block", width: 17, height: 17 }} strokeWidth={1.9} />
          </div>
        </div>
        <div ref={tipRef} style={{ position: "absolute", top: "54px", right: "0", padding: "7px 12px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "6px", background: "var(--p-card,#1B4442)", color: "var(--p-text,#E9E0D1)", fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap", opacity: "0", pointerEvents: "none", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }}>
          {tipLabel}
        </div>
      </div>
      <header style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: "50", display: "flex", alignItems: "center", gap: "0", height: "64px", padding: "0 10px 0 26px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-header-bg,rgba(20,55,55,.72))", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "var(--p-header-shadow,0 10px 40px rgba(6,20,20,.35))", transition: "background 320ms cubic-bezier(.16,1,.3,1),border-color 320ms cubic-bezier(.16,1,.3,1)" }}>
        <div ref={headerSlotRef} style={{ position: "relative", display: "flex", alignItems: "center", height: "24px", width: "0", marginRight: "0", overflow: "hidden" }}>
          <div ref={headerLogoRef} style={{ position: "relative", display: "flex", flex: "none", opacity: "0" }}>
            <Link
              to="/"
              aria-label="Maiq — Página institucional"
              title="Maiq — Página institucional"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ display: "flex", cursor: "pointer", textDecoration: "none", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }}
              data-hover-style="opacity:0.82"
            >
              <img src={logoBranco} alt="Maiq" style={{ height: "22px", width: "auto", display: "block", objectFit: "contain" }} />
              <img ref={logoDayRef} src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "22px", width: "auto", display: "block", objectFit: "contain", opacity: "0", transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
            </Link>
          </div>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: "28px", marginRight: "28px", fontSize: "14px", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
          <NavDropdown
            label="Home"
            items={SECOES.map((s) => ({ key: s.id, label: s.label }))}
            onSelect={goToSection}
          />
          <NavDropdown
            label="Sobre nós"
            items={[
              { key: 'dominios', label: 'Domínios' },
              { key: 'marca', label: 'Marca' },
            ]}
            onSelect={(key) => { if (key === 'dominios') goToSection('dominios'); }}
          />
          <span style={{ cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="color:var(--p-text,#E9E0D1)">
            Insights
          </span>
          <span style={{ cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="color:var(--p-text,#E9E0D1)">
            Planos
          </span>
        </nav>
        <div style={{ display: "flex", alignItems: "center", height: "44px", padding: "4px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-cta-bg,#E9E0D1)", color: "var(--p-cta-fg,#143737)" }}>
          <MaiqButton
            size="md"
            variant="ghost"
            onClick={() => setAuthOpen(true)}
            style={{ "--action-ghost-fg": "var(--p-cta-fg,#143737)", "--action-ghost-bg-hover": "var(--p-cta-bg-hover,#F1EBE0)", color: "var(--p-cta-fg,#143737)" } as React.CSSProperties}
          >
            {user ? 'Conta' : 'Entrar'}
          </MaiqButton>
          <div style={{ width: "1px", height: "20px", background: "var(--p-cta-fg,#143737)", opacity: 0.2 }} />
          <MaiqButton
            size="md"
            variant="ghost"
            onClick={() => setLeadOpen(true)}
            style={{ "--action-ghost-fg": "var(--p-cta-fg,#143737)", "--action-ghost-bg-hover": "var(--p-cta-bg-hover,#F1EBE0)", color: "var(--p-cta-fg,#143737)" } as React.CSSProperties}
          >
            Fale Conosco
          </MaiqButton>
        </div>
      </header>
      <div ref={flyLogoRef} aria-hidden="true" style={{ position: "fixed", left: "0", top: "0", transformOrigin: "0 0", zIndex: "51", pointerEvents: "none", display: "flex", willChange: "transform,opacity" }}>
        <img src={logoBranco} alt="" style={{ height: "clamp(22px,3.4vw,44px)", width: "auto", display: "block" }} />
        <img ref={flyLogoDayRef} src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "clamp(22px,3.4vw,44px)", width: "auto", display: "block", opacity: "0", transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
      </div>
      <div ref={heroLogoSlotRef} aria-hidden="true" style={{ position: "fixed", left: "48px", top: "52px", transform: "translateY(-50%)", height: "clamp(22px,3.4vw,44px)", zIndex: "51", pointerEvents: "none", opacity: "0" }}>
        <img src={logoBranco} alt="" style={{ height: "clamp(22px,3.4vw,44px)", width: "auto", display: "block" }} />
      </div>
      <section ref={heroRef} style={{ background: "var(--p-hero-bg,#143737)", padding: "clamp(140px,12.5vh,160px) 48px clamp(44px,6.5vh,84px)", boxSizing: "border-box", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "sticky", top: "0", zIndex: "0", overflow: "hidden", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", overflow: "hidden", isolation: "isolate" }}>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathA 45s linear infinite", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExA 45s linear infinite" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyA 45s linear infinite" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyA 45s linear infinite", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleA 45s linear infinite", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "36vw", height: "36vw", margin: "-18vw 0 0 -18vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(145,163,152,.30)) 0%,var(--p-halo,rgba(145,163,152,.30)) 40%,var(--p-halo-2,rgba(145,163,152,.14)) 66%,var(--p-halo-0,rgba(145,163,152,0)) 88%)", animation: "maiqHaloA 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "26.25vw", height: "26.25vw", margin: "-13.125vw 0 0 -13.125vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(145,163,152,0)) 0%,var(--p-shade-0,rgba(145,163,152,0)) 30%,var(--p-shade,rgba(145,163,152,0)) 62%,var(--p-shade-0,rgba(145,163,152,0)) 92%)", animation: "maiqCoreA 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "15vw", height: "15vw", margin: "-7.5vw 0 0 -7.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(145,163,152,.54)) 0%,var(--p-orb-2,rgba(145,163,152,.20)) 44%,var(--p-orb-0,rgba(145,163,152,0)) 78%)", animation: "maiqCoreA 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "25vw", height: "25vw", margin: "-12.5vw 0 0 -12.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(22px)", background: "radial-gradient(closest-side,var(--p-flash,rgba(203,219,208,.95)) 0%,var(--p-flash-2,rgba(203,219,208,.34)) 38%,var(--p-orb-0,rgba(145,163,152,0)) 70%)", animation: "maiqFlash 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
            </div>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathB 45s linear infinite", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExB 45s linear infinite" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyB 45s linear infinite" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyB 45s linear infinite", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleB 45s linear infinite", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "34vw", height: "34vw", margin: "-17vw 0 0 -17vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(145,163,152,.30)) 0%,var(--p-halo,rgba(145,163,152,.30)) 40%,var(--p-halo-2,rgba(145,163,152,.14)) 66%,var(--p-halo-0,rgba(145,163,152,0)) 88%)", animation: "maiqHaloB 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "24.5vw", height: "24.5vw", margin: "-12.25vw 0 0 -12.25vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(145,163,152,0)) 0%,var(--p-shade-0,rgba(145,163,152,0)) 30%,var(--p-shade,rgba(145,163,152,0)) 62%,var(--p-shade-0,rgba(145,163,152,0)) 92%)", animation: "maiqCoreB 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "14vw", height: "14vw", margin: "-7vw 0 0 -7vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(145,163,152,.54)) 0%,var(--p-orb-2,rgba(145,163,152,.20)) 44%,var(--p-orb-0,rgba(145,163,152,0)) 78%)", animation: "maiqCoreB 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathA 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExA 45s linear infinite", animationDelay: "-22.5s" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyA 45s linear infinite", animationDelay: "-22.5s" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyA 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleA 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "32vw", height: "32vw", margin: "-16vw 0 0 -16vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(145,163,152,.30)) 0%,var(--p-halo,rgba(145,163,152,.30)) 40%,var(--p-halo-2,rgba(145,163,152,.14)) 66%,var(--p-halo-0,rgba(145,163,152,0)) 88%)", animation: "maiqHaloA 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "22.75vw", height: "22.75vw", margin: "-11.375vw 0 0 -11.375vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(145,163,152,0)) 0%,var(--p-shade-0,rgba(145,163,152,0)) 30%,var(--p-shade,rgba(145,163,152,0)) 62%,var(--p-shade-0,rgba(145,163,152,0)) 92%)", animation: "maiqCoreA 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "13vw", height: "13vw", margin: "-6.5vw 0 0 -6.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(145,163,152,.54)) 0%,var(--p-orb-2,rgba(145,163,152,.20)) 44%,var(--p-orb-0,rgba(145,163,152,0)) 78%)", animation: "maiqCoreA 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "25vw", height: "25vw", margin: "-12.5vw 0 0 -12.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(22px)", background: "radial-gradient(closest-side,var(--p-flash,rgba(203,219,208,.95)) 0%,var(--p-flash-2,rgba(203,219,208,.34)) 38%,var(--p-orb-0,rgba(145,163,152,0)) 70%)", animation: "maiqFlash 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
            </div>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathB 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExB 45s linear infinite", animationDelay: "-22.5s" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyB 45s linear infinite", animationDelay: "-22.5s" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyB 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleB 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "30vw", height: "30vw", margin: "-15vw 0 0 -15vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(145,163,152,.30)) 0%,var(--p-halo,rgba(145,163,152,.30)) 40%,var(--p-halo-2,rgba(145,163,152,.14)) 66%,var(--p-halo-0,rgba(145,163,152,0)) 88%)", animation: "maiqHaloB 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "21vw", height: "21vw", margin: "-10.5vw 0 0 -10.5vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(145,163,152,0)) 0%,var(--p-shade-0,rgba(145,163,152,0)) 30%,var(--p-shade,rgba(145,163,152,0)) 62%,var(--p-shade-0,rgba(145,163,152,0)) 92%)", animation: "maiqCoreB 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "12vw", height: "12vw", margin: "-6vw 0 0 -6vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(145,163,152,.54)) 0%,var(--p-orb-2,rgba(145,163,152,.20)) 44%,var(--p-orb-0,rgba(145,163,152,0)) 78%)", animation: "maiqCoreB 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", inset: "0", background: "radial-gradient(120% 110% at 62% 34%, var(--p-fade,rgba(4,16,16,0)) 44%, var(--p-vignette,rgba(4,16,16,.42)) 100%)" }}>
        </div>
        <div ref={heroContentRef} style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "clamp(30px,5vh,72px)", willChange: "transform,opacity" }}>
          <h1 style={{ fontFamily: "Inter, var(--font-core)", fontSize: "clamp(40px, 4.6vw, 68px)", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "600", margin: "0", maxWidth: "30ch", color: "var(--p-h1,#E9E0D1)", textWrap: "balance" }}>
            O hub de Fusões e Aquisições para Médias Empresas
          </h1>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(30px,5vh,72px)", width: "100%" }}>
            <div style={{ width: "clamp(120px,18vw,260px)", height: "1px", background: "linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(233,224,209,.14)) 18%,var(--p-hair,rgba(233,224,209,.14)) 82%,transparent 100%)" }}>
            </div>
            <p style={{ fontSize: "17px", lineHeight: "1.75", color: "var(--p-text-2,#B7C4BC)", margin: "0", maxWidth: "min(1080px,94%)", textWrap: "balance" }}>
              Combinamos método e tecnologia para sistematizar o processo de M&A
            </p>
          </div>
        </div>
        <div style={{ position: "relative", margin: "clamp(30px,5vh,72px) auto 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(30px,5vh,72px)" }}>
          <div style={{ width: "68px", height: "1px", background: "linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(233,224,209,.14)) 22%,var(--p-hair,rgba(233,224,209,.14)) 78%,transparent 100%)" }}>
          </div>
          <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
            Como ajudamos nossos clientes e parceiros
          </div>
        </div>
        <div ref={marqueeRef} style={{ position: "relative", margin: "clamp(16px,2.2vh,28px) auto 0", width: "80%", display: "flex", flexDirection: "column", gap: "10px", maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)" }}>
          <div style={{ overflow: "hidden" }}>
            <div ref={rowARef} style={{ display: "flex", gap: "10px", width: "max-content", willChange: "transform" }}>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Venda de empresa
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Aquisição de concorrente
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Captação de recursos
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Atração de investidores
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Coordenação de M&A
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Venda de empresa
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Aquisição de concorrente
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Captação de recursos
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Atração de investidores
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Coordenação de M&A
              </div>
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={rowBRef} style={{ display: "flex", gap: "10px", width: "max-content", willChange: "transform" }}>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Avaliação de empresas — valuation
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Fairness Opinion
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Estruturação de dívida
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Joint ventures
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Consolidação de mercado
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Avaliação de empresas — valuation
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Fairness Opinion
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Estruturação de dívida
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Joint ventures
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Consolidação de mercado
              </div>
            </div>
            <div aria-hidden="true" data-maiq-plat-spacer="" style={{ marginTop: "auto" }}>
            </div>
          </div>
        </div>
      </section>
      <div className="maiq-scroll-stack">
      <div ref={netWrapRef} className="maiq-platform-base">
        <div ref={netContentRef} data-maiq-net-content="" className="maiq-platform-ciclo-bg">
          <section data-maiq-sec="plataforma" aria-label="Nossa Plataforma" className="maiq-platform-section">
            <div className="maiq-platform-section-inner">
              <div className="maiq-platform-heading">
                <h2>Nossa Plataforma</h2>
                <p>Funcionalidades específicas a serviço do M&amp;A</p>
              </div>
              <PlatformShowcase />
            </div>
          </section>
        </div>
      </div>
      <div ref={overlayRef} className="maiq-primary-overlay">
        <div className="maiq-model-pilares-bg" style={{ position: "relative", zIndex: "2", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
        <section data-maiq-sec="modelo" aria-label="Nosso modelo" style={{ position: "relative", zIndex: "1", minHeight: "100vh", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "clamp(104px,13vh,150px) 48px clamp(36px,4.5vh,64px)" }}>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,3vh,44px)" }}>
            <div style={{ textAlign: "center" }}>
              <h2 data-maiq-modelo-h2="" style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1.04", letterSpacing: "-.022em", fontWeight: "600", margin: "0" }}>
                Nosso modelo
              </h2>
              <p style={{ fontSize: "17px", lineHeight: "1.6", color: "var(--p-muted,#91A398)", margin: "14px auto 0", maxWidth: "56ch", textWrap: "pretty" }}>
                Convergência entre método e tecnologia,
                <br />
                potencializada por experiência e ampla rede construída.
              </p>
            </div>
            <div ref={dnaRowRef} onMouseMove={handleDnaMove} onMouseLeave={handleDnaLeave} style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", padding: "0 clamp(24px,4vw,48px)", boxSizing: "border-box", display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "0" }}>
              <div data-maiq-side-text="" ref={lColRef} style={{ flex: "1 1 0", minWidth: "246px", maxWidth: "312px", marginRight: "-48px", position: "relative", display: "flex", justifyContent: "flex-end" }}>
                <div ref={lClipRef} style={{ maxWidth: "100%" }}>
                  <div ref={lTextRef} style={{ opacity: "0", transform: "translateX(312px)", transition: "opacity 260ms cubic-bezier(.4,0,1,1),transform 320ms cubic-bezier(.4,0,1,1)" }}>
                    <p style={{ margin: "0", paddingRight: "76px", fontSize: "15px", lineHeight: "1.6", color: "var(--p-text-2,#B7C4BC)", textAlign: "right", textWrap: "pretty" }}>
                      Conjugamos experiência de mercado de capitais, investimentos privados, bagagem em consultoria, auditoria e empreendedorismo.
                    </p>
                  </div>
                </div>
              </div>
              <div ref={vennBoxRef} data-maiq-venn="" style={{ position: "relative", width: "836px", height: "360px", flex: "0 0 auto" }}>
                <div aria-hidden="true" style={{ position: "absolute", left: "178px", top: "0", width: "360px", height: "360px", borderRadius: "50%", clipPath: "circle(50% at 50% 50%)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: "120px", top: "0", width: "360px", height: "360px", borderRadius: "50%", clipPath: "circle(50% at 50% 50%)", overflow: "hidden" }}>
                    {helixBars}
                  </div>
                </div>
                <div aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", width: "538px", height: "360px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "180px", background: "var(--p-chip-bg,rgba(233,224,209,.04))" }}>
                </div>
                <div aria-hidden="true" style={{ position: "absolute", left: "298px", top: "0", width: "538px", height: "360px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "180px", background: "var(--p-chip-bg,rgba(233,224,209,.04))" }}>
                </div>
                <div style={{ position: "absolute", left: "418px", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center", fontSize: "14px", lineHeight: "1.34", fontWeight: "600", letterSpacing: ".01em", color: "var(--p-text,#E9E0D1)", whiteSpace: "nowrap" }}>
                  <div>
                    Sistematização
                  </div>
                  <div>
                    do M&A
                  </div>
                </div>
                <div style={{ position: "absolute", left: "0", top: "0", width: "298px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                  <div style={{ marginLeft: "75px", width: "210px", textAlign: "right" }}>
                    <div style={{ fontSize: "26px", lineHeight: "1.1", fontWeight: "600", letterSpacing: "-.012em" }}>
                      QUARPX
                      <sup style={{ fontSize: ".5em", fontWeight: "500", top: "-.7em", position: "relative" }}>
                        ®
                      </sup>
                    </div>
                    <div style={{ fontSize: "15.6px", fontWeight: "500", marginTop: "8px" }}>
                      Metodologia proprietária
                    </div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: "var(--p-muted,#91A398)", marginTop: "2px" }}>
                      unknown unknowns
                    </div>
                  </div>
                  <div style={{ marginTop: "24px", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div ref={scoreRowRef} style={{ position: "relative", marginLeft: "25px", width: "251px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "16.8px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right", transitionDelay: "0ms" }}>
                      <span ref={scoreTextRef}>
                        Score de prontidão
                      </span>
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow1Ref} style={{ position: "relative", marginLeft: "31px", width: "246px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "16.8px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right" }}>
                      Roadmap de evolução
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow3Ref} style={{ position: "relative", marginLeft: "52px", width: "233px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "16.8px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right" }}>
                      Playbooks por etapa
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ position: "absolute", right: "0", top: "0", width: "298px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
                  <div style={{ marginRight: "75px", width: "210px", textAlign: "left" }}>
                    <div style={{ fontSize: "26px", lineHeight: "1.1", fontWeight: "600", letterSpacing: "-.012em" }}>
                      M&AI
                    </div>
                    <div style={{ fontSize: "15.6px", fontWeight: "500", marginTop: "8px" }}>
                      Arquitetura tecnológica
                    </div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: "var(--p-muted,#91A398)", marginTop: "2px" }}>
                      known unknowns
                    </div>
                  </div>
                  <div style={{ marginTop: "24px", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div ref={chatRowRef} style={{ position: "relative", marginRight: "25px", width: "251px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "16.8px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      <span ref={chatTextRef}>
                        Plataforma de dados
                      </span>
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow1Ref} style={{ position: "relative", marginRight: "31px", width: "246px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "16.8px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      Chat e agentes de IA
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow2Ref} style={{ position: "relative", marginRight: "52px", width: "233px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "16.8px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      Análise integral de contexto
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-maiq-side-text="" ref={rColRef} style={{ flex: "1 1 0", minWidth: "246px", maxWidth: "312px", marginLeft: "-48px", position: "relative", display: "flex", justifyContent: "flex-start" }}>
                <div ref={rClipRef} style={{ maxWidth: "100%" }}>
                  <div ref={rTextRef} style={{ opacity: "0", transform: "translateX(-312px)", transition: "opacity 260ms cubic-bezier(.4,0,1,1),transform 320ms cubic-bezier(.4,0,1,1)" }}>
                    <p style={{ margin: "0", paddingLeft: "76px", fontSize: "15px", lineHeight: "1.6", color: "var(--p-text-2,#B7C4BC)", textAlign: "left", textWrap: "pretty" }}>
                      Integramos as melhores tecnologias do mercado para transformar o processo de fusões e aquisições em um fluxo seguro e de decisão informada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: "60%", minWidth: "520px", maxWidth: "100%", margin: "0 auto", backgroundImage: "linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(233,224,209,.14)) 14%,var(--p-hair,rgba(233,224,209,.14)) 86%,transparent 100%),linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(233,224,209,.14)) 14%,var(--p-hair,rgba(233,224,209,.14)) 86%,transparent 100%)", backgroundSize: "100% 1px,100% 1px", backgroundPosition: "0 0,0 100%", backgroundRepeat: "no-repeat", padding: "22px clamp(8px,2vw,24px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(24px,4vw,48px)", flexWrap: "wrap" }}>
              <img src={toolGpt} alt="OpenAI" loading="lazy" decoding="async" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolClaude} alt="Claude" loading="lazy" decoding="async" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolGemini} alt="Gemini" loading="lazy" decoding="async" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolNotebooklm} alt="NotebookLM" loading="lazy" decoding="async" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolPerplexity} alt="Perplexity" loading="lazy" decoding="async" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolN8n} alt="n8n" loading="lazy" decoding="async" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "clamp(24px,4vw,56px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }} data-maiq-odo="">
                  32
                </div>
                <div style={{ height: "3px", background: "var(--p-mark-1,#91A398)" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
                  Investidores na nossa rede
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }} data-maiq-odo="">
                  R$ 291
                </div>
                <div style={{ height: "3px", background: "var(--p-mark-2,#33605A)" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
                  Milhões em transações realizadas
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }} data-maiq-odo="">
                  16
                </div>
                <div style={{ height: "3px", background: "var(--p-hair,rgba(233,224,209,.14))" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
                  Parceiros em nosso ecossistema
                </div>
              </div>
            </div>
          </div>
        </section>
        <Conviccao />
        </div>
      </div>
      <div ref={platformHoldRef} className="maiq-platform-hold" aria-hidden="true" />
      <div className="maiq-final-reveal-stage">
        <div ref={finalWrapRef} className="maiq-final-base">
          <div ref={overlay3Ref} className="maiq-final-content">
            <Faq onContact={() => setLeadOpen(true)} />
            <footer className="maiq-footer" style={{ background: "var(--p-footer-bg,#0A1D1D)", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", padding: "56px 48px 28px", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
              <div className="maiq-footer-top">
                <div style={{ position: "relative", display: "inline-flex" }}>
                  <img src={logoBranco} alt="Maiq" style={{ height: "30px", width: "auto", display: "block" }} />
                  <img ref={logoFooterDayRef} src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "30px", width: "auto", display: "block", opacity: "0", transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
                </div>
                <nav className="maiq-footer-cols" aria-label="Links do rodapé">
                  <div className="maiq-footer-col">
                    <p className="maiq-footer-col-title">Contato</p>
                    <a className="maiq-footer-link" href="mailto:contato@maiq.app.br">contato@maiq.app.br</a>
                  </div>
                  <div className="maiq-footer-col">
                    <p className="maiq-footer-col-title">Legal</p>
                    <Link className="maiq-footer-link" to="/politica-de-privacidade">Política de privacidade</Link>
                    <Link className="maiq-footer-link" to="/termos-de-uso">Termos de uso</Link>
                  </div>
                </nav>
              </div>
              <div style={{ maxWidth: "1200px", margin: "40px auto 0", paddingTop: "22px", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "13px", color: "var(--p-muted,#91A398)" }}>
                © 2026 Maiq. Todos os direitos reservados.
              </div>
            </footer>
          </div>
        </div>
        <div ref={overlay2Ref} className="maiq-cycle-domains-overlay">
          <div className="maiq-model-pilares-bg">
            <Ciclo />
            <DominiosPlaceholder />
          </div>
        </div>
        <div ref={finalHoldRef} className="maiq-final-hold" aria-hidden="true" />
      </div>
      </div>
      </div>


  );
}
