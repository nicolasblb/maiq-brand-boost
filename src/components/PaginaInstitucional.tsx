import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sun, Moon, TriangleAlert } from 'lucide-react';
import Ciclo from '@/components/sections/Ciclo';
import VdrEmbed from '@/components/maiq/vdr/VdrEmbed';
import MaiqButton from '@/components/maiq/MaiqButton';
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
  { inset: 93, width: 213 },
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

export default function PaginaInstitucional() {
  const [theme, setTheme] = useState<'noite' | 'claro'>('noite');
  const themeRef = useRef<'noite' | 'claro'>('noite');

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
  const lRow2Ref = useRef<Any>(null);
  const lRow3Ref = useRef<Any>(null);
  const rRow1Ref = useRef<Any>(null);
  const rRow2Ref = useRef<Any>(null);
  const rRow3Ref = useRef<Any>(null);
  const lRailRef = useRef<Any>(null);
  const rRailRef = useRef<Any>(null);
  const lColRef = useRef<Any>(null);
  const rColRef = useRef<Any>(null);
  const lClipRef = useRef<Any>(null);
  const rClipRef = useRef<Any>(null);
  const lTextRef = useRef<Any>(null);
  const rTextRef = useRef<Any>(null);
  const platInnerRef = useRef<Any>(null);
  const platBgRef = useRef<Any>(null);
  const platColRef = useRef<Any>(null);

  // estado mutável compartilhado entre os efeitos (equivalente aos campos da classe original)
  const S = useRef<Any>({}).current;

  const helixBars = useMemo(() => buildHelix(), []);

  const refs = {
    scopeRef, logoDayRef, logoFooterDayRef, flyLogoDayRef, thumbRef, segSunRef, segMoonRef,
    dnaRowRef, vennBoxRef, scoreRowRef, chatRowRef, lRow1Ref, lRow2Ref, lRow3Ref,
    rRow1Ref, rRow2Ref, rRow3Ref, lColRef, rColRef, lClipRef, rClipRef, lTextRef, rTextRef,
    scoreTextRef, chatTextRef,
  };

  const setDnaDot = (el: Any, active: boolean, delay: number) => {
    const dot = el.querySelector('[data-maiq-dot]');
    if (!dot) return;
    dot.style.transition = `opacity 320ms ${DNA_EASE} ${delay}ms`;
    dot.style.opacity = active ? '1' : '0';
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
    if (active && g) {
      if (i === 0) {
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
      ? [scoreRowRef.current, lRow1Ref.current, lRow2Ref.current, lRow3Ref.current]
      : [chatRowRef.current, rRow1Ref.current, rRow2Ref.current, rRow3Ref.current];
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
    if (S._netSync) requestAnimationFrame(() => { if (S._netSync) S._netSync(); });
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

    setupOdometers();
    setupPlataforma();
    setupPlatNet();
    setupMarquee();
    S._paintLogo = setupLogoFlight();
    setupScroll();

    return () => {
      if (S._paintOdos) {
        window.removeEventListener('scroll', S._paintOdos);
        window.removeEventListener('resize', S._odoResize);
      }
      if (S._netStop) S._netStop();
      if (S._netIO) S._netIO.disconnect();
      if (S._netResize) window.removeEventListener('resize', S._netResize);
      if (S._platIO) S._platIO.disconnect();
      if (S._platRings) S._platRings.forEach((r: Any) => { if (r) r.removeEventListener('animationend', S._platEnd); });
      if (S._platHoverEls) S._platHoverEls.forEach((el: Any) => {
        el.removeEventListener('mouseenter', S._platEnter);
        el.removeEventListener('mouseleave', S._platLeave);
      });
      if (S._platAlign) window.removeEventListener('resize', S._platAlign);
      if (S._platTabs) S._platTabs.forEach((b: Any, i: number) => b.removeEventListener('click', S._platTabClicks[i]));
      if (S._raf) cancelAnimationFrame(S._raf);
      if (S._remeasure) window.removeEventListener('resize', S._remeasure);
      if (S._measureDna) window.removeEventListener('resize', S._measureDna);
      if (S._onScroll) { window.removeEventListener('scroll', S._onScroll); window.removeEventListener('resize', S._onScroll); }
      if (S._measureOv2) window.removeEventListener('resize', S._measureOv2);
      if (S._logoMode) window.removeEventListener('resize', S._logoMode);
      if (S._logoLoad) window.removeEventListener('load', S._logoLoad);
      if (S._fitHero) window.removeEventListener('resize', S._fitHero);
      if (S._fitNet) window.removeEventListener('resize', S._fitNet);

      if (S._wrap) {
        S._wrap.removeEventListener('mouseenter', S._enter);
        S._wrap.removeEventListener('mouseleave', S._leave);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Odômetro: números da seção "Nosso modelo" rolam de zero ao valor real
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
      const sec = el.closest('section') || el.parentElement;
      const finals = raw.split('').map(Number);
      return { el, sec, off: 0, finals, strips, digits, target, p: 0 };
    });
    S._paintOdos = () => {
      const vh = window.innerHeight;
      S._odos.forEach((o: Any) => {
        let n = o.sec, off = 0;
        while (n) { off += n.offsetTop; n = n.offsetParent; }
        const topV = off - window.scrollY;
        const band = vh * 0.2;
        o.p = Math.min(1, Math.max(0, (band - topV) / band));
        const e = o.p * o.p * (3 - 2 * o.p);
        for (let i = 0; i < o.digits; i++) {
          const pos = o.finals[i] * e;
          o.strips[i].style.transform = 'translate3d(0,' + (-pos * 100 / 12).toFixed(4) + '%,0)';
        }
      });
    };
    S._odoResize = () => S._paintOdos();
    S._paintOdos();
    window.addEventListener('scroll', S._paintOdos, { passive: true });
    window.addEventListener('resize', S._odoResize);
  }

  // Fundo neural da seção "A Plataforma"
  function setupPlatNet() {
    const cv = platBgRef.current, scope = scopeRef.current;
    if (!cv || !scope || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    const host = cv.parentElement;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LAYERS = [
      { count: 58, rMin: 0.7, rMax: 1.4, link: 126, op: 0.32, spd: 0.05, soft: 2.6 },
      { count: 34, rMin: 1.2, rMax: 2.1, link: 150, op: 0.55, spd: 0.095, soft: 1.5 },
      { count: 15, rMin: 2.0, rMax: 3.1, link: 184, op: 0.86, spd: 0.16, soft: 0 },
    ];
    let W = 0, H = 0, dpr = 1, layers: Any[] = [], neb: Any = null, seeds: Any[] = [];
    let ink = '145,163,152', nebRgb = '51,96,90', gop = 0.62, blend = 'lighter';
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const readTokens = () => {
      const cs = getComputedStyle(scope);
      ink = (cs.getPropertyValue('--p-net-ink') || '145,163,152').trim();
      nebRgb = (cs.getPropertyValue('--p-net-neb') || '51,96,90').trim();
      gop = parseFloat(cs.getPropertyValue('--p-net-op')) || 0.62;
      blend = (cs.getPropertyValue('--p-net-blend') || 'lighter').trim();
      buildNeb();
    };
    S._netSync = readTokens;

    const place = () => {
      const bandH = H / Math.max(1, Math.round(H / Math.max(520, window.innerHeight || 800)));
      S._netBand = bandH;
      const REL = [
        [0.84, 0.13, 3.2], [0.96, 0.28, 2.6], [0.71, 0.05, 1.8], [0.92, 0.46, 1.2],
        [0.04, 0.14, 0.32], [0.02, 0.74, 0.30], [0.92, 0.93, 0.26], [0.28, 0.97, 0.22],
      ];
      seeds = [];
      for (let b = 0; b * bandH < H - 1; b++) {
        const k = b === 0 ? 1 : 0.6;
        REL.forEach((r) => seeds.push({ x: W * r[0]!, y: b * bandH + bandH * r[1]!, w: r[2]! * k }));
      }
      const wsum = seeds.reduce((a, s) => a + s.w, 0);
      let run = 0;
      seeds.forEach((s) => { run += s.w / wsum; s.cum = run; });
      const scale = Math.max(0.45, Math.min(1.9, (W * H) / (1440 * 900)));
      layers = LAYERS.map((L) => {
        const n = Math.round(L.count * scale);
        const nodes: Any[] = [];
        let guard = 0;
        while (nodes.length < n && guard++ < n * 40) {
          let x, y, s: Any = null;
          if (Math.random() < 0.94) {
            const u = Math.random();
            s = seeds[seeds.length - 1];
            for (let k = 0; k < seeds.length; k++) { if (u <= seeds[k]!.cum) { s = seeds[k]; break; } }
            const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
            const sp = s.w > 1 ? 0.13 : 0.09;
            x = s.x + g() * W * sp;
            y = s.y + g() * bandH * (sp + 0.02);
          } else {
            x = rnd(0, W); y = rnd(0, H);
          }
          if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
          const cx = x / Math.max(1, W), cy = ((y % bandH) + bandH) % bandH / bandH;
          const card = Math.max(0, 1 - Math.hypot((cx - 0.5) / 0.34, (cy - 0.74) / 0.30));
          const head = Math.max(0, 1 - Math.hypot((cx - 0.22) / 0.30, (cy - 0.18) / 0.20));
          if (Math.random() < Math.max(card, head) * 0.72) continue;
          const core = s ? s.w > 1 : false;
          nodes.push({
            hx: x, hy: y, x, y, r: rnd(L.rMin, L.rMax), core,
            ax: rnd(7, 17) * L.spd * 9, ay: rnd(7, 17) * L.spd * 9,
            fx: rnd(0.6, 1.5), fy: rnd(0.6, 1.5), px: rnd(0, Math.PI * 2), py: rnd(0, Math.PI * 2),
            ph: rnd(0, 1e4), pulse: 0,
            life: core ? 1 : 0, lph: rnd(0, 1), lspd: rnd(0.045, 0.1),
          });
        }
        return { cfg: L, nodes };
      });
    };

    const buildNeb = () => {
      if (!W || !H) return;
      const w = Math.max(2, Math.round(W / 9)), h = Math.max(2, Math.round(H / 9));
      neb = document.createElement('canvas');
      neb.width = w; neb.height = h;
      const c = neb.getContext('2d');
      const blobs = [[0.85, 0.16, 0.60, 1], [0.97, 0.36, 0.46, 0.9], [0.66, 0.04, 0.40, 0.62], [0.05, 0.22, 0.42, 0.30], [0.55, 0.97, 0.40, 0.26], [0.02, 0.80, 0.32, 0.24]];
      const bh = Math.max(4, ((S._netBand || H) / 9));
      for (let bi = 0; bi * bh < h - 1; bi++) {
        const k = bi === 0 ? 1 : 0.6;
        blobs.forEach((b) => {
          const cxp = b[0]! * w, cyp = bi * bh + b[1]! * bh;
          const r = Math.max(w, bh) * b[2]!;
          const g = c.createRadialGradient(cxp, cyp, 0, cxp, cyp, r);
          g.addColorStop(0, 'rgba(' + nebRgb + ',' + (0.62 * b[3]! * k).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(' + nebRgb + ',0)');
          c.fillStyle = g;
          c.fillRect(0, 0, w, h);
        });
      }
    };

    const size = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, cv.clientWidth || Math.round(r.width));
      H = Math.max(1, cv.clientHeight || Math.round(r.height));
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      place(); buildNeb();
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      if (neb) {
        ctx.globalAlpha = gop * 0.95;
        ctx.globalCompositeOperation = blend;
        const dx = Math.sin(t / 41000) * W * 0.02, dy = Math.cos(t / 53000) * H * 0.02;
        ctx.drawImage(neb, dx - W * 0.03, dy - H * 0.03, W * 1.06, H * 1.06);
      }
      ctx.globalCompositeOperation = blend;
      layers.forEach((L: Any) => {
        const cfg = L.cfg, nodes = L.nodes, lk = cfg.link, cell = lk;
        const cols = Math.max(1, Math.ceil(W / cell)), rows = Math.max(1, Math.ceil(H / cell));
        const grid: Any[] = new Array(cols * rows);
        nodes.forEach((p: Any) => {
          const gx = Math.min(cols - 1, Math.max(0, (p.x / cell) | 0));
          const gy = Math.min(rows - 1, Math.max(0, (p.y / cell) | 0));
          const k = gy * cols + gx;
          (grid[k] || (grid[k] = [])).push(p);
        });
        ctx.lineWidth = cfg.soft > 1 ? 0.7 : 1;
        for (let gy = 0; gy < rows; gy++) {
          for (let gx = 0; gx < cols; gx++) {
            const a = grid[gy * cols + gx];
            if (!a) continue;
            for (let ny = gy; ny <= gy + 1; ny++) {
              for (let nx = gx - 1; nx <= gx + 1; nx++) {
                if (ny === gy && nx < gx) continue;
                if (nx < 0 || nx >= cols || ny >= rows) continue;
                const b = grid[ny * cols + nx];
                if (!b) continue;
                for (let i = 0; i < a.length; i++) {
                  for (let j = (a === b ? i + 1 : 0); j < b.length; j++) {
                    const p = a[i], q = b[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 > lk * lk) continue;
                    const f = 1 - Math.sqrt(d2) / lk;
                    ctx.globalAlpha = gop * cfg.op * f * f * 1.15 * Math.min(p.life, q.life);
                    ctx.strokeStyle = 'rgba(' + ink + ',1)';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
        nodes.forEach((p: Any) => {
          if (p.life <= 0.01) return;
          const x = p.x, y = p.y;
          const glow = p.pulse;
          const a = gop * cfg.op * (0.62 + 0.38 * Math.sin((t + p.ph) / 4200)) * (1 + glow * 1.7) * p.life;
          const r = p.r * (1 + glow * 0.5) + cfg.soft;
          const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(0.6, r));
          g.addColorStop(0, 'rgba(' + ink + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')');
          g.addColorStop(cfg.soft > 1 ? 0.35 : 0.62, 'rgba(' + ink + ',' + (Math.max(0, Math.min(1, a)) * 0.42).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(' + ink + ',0)');
          ctx.globalAlpha = 1;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.6, r), 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    let last = 0;
    const step = (now: number) => {
      S._netRaf = requestAnimationFrame(step);
      const dt = Math.min(48, now - (last || now));
      last = now;
      const s = now / 1000;
      const dxg = Math.sin(s * 0.026) * W * 0.014, dyg = Math.cos(s * 0.021) * H * 0.016;
      layers.forEach((L: Any, li: number) => {
        const k = 1 + li * 0.35;
        L.nodes.forEach((p: Any) => {
          p.x = p.hx + dxg * k + Math.sin(s * 0.07 * p.fx + p.px) * p.ax + Math.sin(s * 0.031 * p.fy + p.py) * p.ax * 0.4;
          p.y = p.hy + dyg * k + Math.cos(s * 0.062 * p.fy + p.py) * p.ay + Math.cos(s * 0.027 * p.fx + p.px) * p.ay * 0.4;
          if (!p.core) {
            p.lph = (p.lph + p.lspd * dt / 1000) % 1;
            const w = Math.sin(p.lph * Math.PI * 2);
            p.life = Math.max(0, w) * Math.max(0, w);
          }
          if (p.pulse > 0) p.pulse = Math.max(0, p.pulse - dt / 1400);
          else if (p.core && Math.random() < 0.00005 * dt) p.pulse = 1;
        });
      });
      draw(now);
    };

    const start = () => { if (reduce || S._netRaf) return; last = 0; S._netRaf = requestAnimationFrame(step); };
    const stop = () => { if (!S._netRaf) return; cancelAnimationFrame(S._netRaf); S._netRaf = null; };
    S._netStop = stop;

    const docTop = (el: Any) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const measureBlock = () => {
      const wrap = overlay2WrapRef.current, ov3 = overlay3Ref.current;
      const vh = window.innerHeight || 800;
      // O percurso começa no primeiro pixel revelado na base da tela e termina
      // quando a seção seguinte cobre o bloco por completo.
      S._netBlockStart = (wrap ? docTop(wrap) : docTop(host)) - vh;
      S._netBlockEnd = ov3 ? docTop(ov3) : docTop(host) + host.offsetHeight;
    };

    S._netResize = () => { size(); draw(performance.now()); measureBlock(); S._netPar && S._netPar(); };
    window.addEventListener('resize', S._netResize);

    if (!reduce) {
      // o fundo se move de forma constante durante todo o bloco Plataforma/Ciclo,
      // posicionado pela tela, sem ser afetado pelo efeito de reveal/conceal
      measureBlock();
      let parRaf = 0 as Any, parPending = 0;
      const applyPar = () => {
        parRaf = 0;
        cv.style.transform = 'translate3d(0,' + parPending.toFixed(1) + 'px,0)';
      };
      S._netPar = () => {
        const vh = window.innerHeight || 800;
        const s = S._netBlockStart == null ? 0 : S._netBlockStart;
        const e = S._netBlockEnd == null ? s + 1 : S._netBlockEnd;
        const p = Math.max(0, Math.min(1, (window.scrollY - s) / Math.max(1, e - s)));
        // O canvas fica preso à tela pelo próprio position:sticky (mesma
        // estratégia estável da saída do bloco). Aqui aplicamos apenas o
        // deslocamento suave de profundidade, sempre dentro de um rAF.
        parPending = -p * vh * 0.2;
        if (!parRaf) parRaf = requestAnimationFrame(applyPar);
      };


      S._netPar();
    }

    readTokens();
    size();
    draw(performance.now());
    if ('IntersectionObserver' in window) {
      S._netIO = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.02 });
      S._netIO.observe(host);
    } else {
      start();
    }
  }

  // Plataforma: cada funcionalidade fica 15s em tela
  function setupPlataforma() {
    const scope = scopeRef.current, col = platColRef.current;
    if (!scope || !col) return;
    const shapes: Any[] = Array.prototype.slice.call(scope.querySelectorAll('[data-maiq-plat-shape]'));
    const tabs: Any[] = Array.prototype.slice.call(scope.querySelectorAll('[data-maiq-plat-tab]'));
    const rings = tabs.map((b) => b.querySelector('[data-maiq-plat-ring]'));
    const blocks: Any[] = Array.prototype.slice.call(col.children);
    const N = blocks.length;
    const DUR = 15000;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    S._platIdx = 0;
    S._platHover = false;
    S._platVisible = true;

    const syncPlay = () => {
      const r = rings[S._platIdx];
      if (!r) return;
      r.style.animationPlayState = (S._platHover || !S._platVisible) ? 'paused' : 'running';
    };
    S._platSync = syncPlay;

    const arm = (idx: number) => {
      rings.forEach((r: Any) => {
        if (!r) return;
        r.style.animation = 'none';
        r.style.strokeDashoffset = '1';
      });
      const r = rings[idx];
      if (!r || reduce) return;
      void r.getBoundingClientRect();
      r.style.animation = 'maiqRingSweep ' + DUR + 'ms linear forwards';
      syncPlay();
    };

    const paint = (idx: number) => {
      S._platIdx = idx;
      blocks.forEach((b: Any, i: number) => { b.style.opacity = i === idx ? '1' : '0'; });
      shapes.forEach((s: Any, i: number) => { s.style.opacity = i === idx ? '1' : '0'; });
      tabs.forEach((b: Any, i: number) => {
        const on = i === idx;
        b.style.background = on ? 'var(--p-chip-bg-strong,rgba(233,224,209,.13))' : 'var(--p-chip-bg,rgba(233,224,209,.04))';
        b.style.color = on ? 'var(--p-text,#E9E0D1)' : 'var(--p-muted,#91A398)';
        b.style.borderColor = on ? 'var(--p-hair-strong,rgba(233,224,209,.32))' : 'var(--p-hair,rgba(233,224,209,.14))';
      });
      arm(idx);
      if (idx === 3) window.dispatchEvent(new Event('maiq-vdr-restart'));
    };

    S._platGo = (i: number) => paint(((i % N) + N) % N);

    S._platEnd = (e: Any) => {
      if (e.animationName !== 'maiqRingSweep') return;
      S._platGo(S._platIdx + 1);
    };
    rings.forEach((r: Any) => { if (r) r.addEventListener('animationend', S._platEnd); });
    S._platRings = rings;

    S._platTabClicks = tabs.map((b: Any, i: number) => {
      const fn = () => S._platGo(i);
      b.addEventListener('click', fn);
      return fn;
    });
    S._platTabs = tabs;

    S._platEnter = () => { S._platHover = true; syncPlay(); };
    S._platLeave = () => { S._platHover = false; syncPlay(); };
    const bar = scope.querySelector('[data-maiq-plat-bar]');
    const card = scope.querySelector('[data-maiq-plat-card]');
    S._platHoverEls = [bar, card].filter(Boolean);
    S._platHoverEls.forEach((el: Any) => {
      el.addEventListener('mouseenter', S._platEnter);
      el.addEventListener('mouseleave', S._platLeave);
    });

    const inner = platInnerRef.current;
    const align = () => {
      const h2 = scope.querySelector('[data-maiq-modelo-h2]');
      if (!inner || !h2 || window.innerWidth < 1024) return;
      const sec = h2.closest('section');
      if (!sec) return;
      const off = h2.getBoundingClientRect().top - sec.getBoundingClientRect().top;
      if (off > 0) inner.style.paddingTop = Math.round(off) + 'px';
    };
    S._platAlign = align;
    window.addEventListener('resize', align);
    align();

    paint(0);
    const host = inner && inner.parentElement;
    if (host && 'IntersectionObserver' in window) {
      S._platIO = new IntersectionObserver((es) => {
        es.forEach((e) => { S._platVisible = e.isIntersecting; });
        syncPlay();
      }, { threshold: 0.15 });
      S._platIO.observe(host);
    }
  }

  // a logo nasce grande no hero e viaja até o slot do header
  function setupLogoFlight() {
    const fly = flyLogoRef.current, slot = headerSlotRef.current,
      mark = headerLogoRef.current, ph = heroLogoSlotRef.current;
    if (!fly || !slot || !mark || !ph) return null;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dock = () => {
      slot.style.width = mark.getBoundingClientRect().width + 'px';
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

    // Plataforma + Ciclo ficam presos quando totalmente exibidos; a próxima seção passa por cima
    const net = netWrapRef.current;
    if (net) {
      S._fitNet = () => {
        net.style.top = Math.min(0, window.innerHeight - net.offsetHeight) + 'px';
      };
      S._fitNet();
      window.addEventListener('resize', S._fitNet);
    }



    const el = heroContentRef.current;
    if (!el || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    let queued = false;
    const paint = () => {
      queued = false;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)));
      const ease = p * p * (3 - 2 * p);
      el.style.transform = 'translate3d(0,' + (-52 * ease).toFixed(2) + 'px,0) scale(' + (1 - 0.03 * ease).toFixed(4) + ')';
      el.style.opacity = (1 - 0.72 * ease).toFixed(3);
      if (S._paintLogo) {
        S._paintLogo(Math.min(1, Math.max(0, (window.scrollY - vh * 0.6) / (vh * 0.3))));
      }
    };
    S._measureOv2 = () => {
      const wrap = overlay2WrapRef.current, ov2 = overlay2Ref.current, next = overlay3Ref.current;
      if (!wrap || !ov2 || !next) return;
      const vh = window.innerHeight;
      S._ov2Top = ov2.getBoundingClientRect().top + window.scrollY;
      S._netEntryStart = S._ov2Top - vh;
      S._netEntryEnd = S._ov2Top;
      S._netExitEnd = next.getBoundingClientRect().top + window.scrollY;
      S._netExitStart = S._netExitEnd - vh;
      S._netBlockStart = S._netEntryStart;
      S._netBlockEnd = S._netExitEnd;
    };
    S._measureOv2();
    window.addEventListener('resize', S._measureOv2);
    // a seção anterior "sai de cima" e revela a Plataforma, que fica presa ao topo
    S._paintOv2 = () => {
      const ov2 = overlay2Ref.current, wrap = overlay2WrapRef.current;
      const content = netContentRef.current;
      if (!ov2 || !wrap || S._ov2Top == null) return;
      const vh = window.innerHeight;
      ov2.style.transform = 'translate3d(0,0,0)';
      if (content) {
        // Os marcos são absolutos para a geometria não mudar quando o bloco
        // alterna entre fluxo normal e posição fixa durante a sobreposição.
        const reveal = Math.max(0, Math.min(1, (window.scrollY - S._netEntryStart) / Math.max(1, S._netEntryEnd - S._netEntryStart)));
        const conceal = Math.max(0, Math.min(1, (window.scrollY - S._netExitStart) / Math.max(1, S._netExitEnd - S._netExitStart)));
        // Entrada: v(t) = 0.2 + 0.8t. Saída: v(t) = 1 - 0.8t.
        // As integrais geram percursos simétricos de 0.6 viewport, mantendo
        // posição e velocidade contínuas nos encontros com o trecho central.
        // O elemento parte já dentro da faixa revelada: sua posição visual
        // percorre 0.6 viewport enquanto a velocidade cresce de 0.2x a 1x.
        const entryOffset = vh * (-0.4 + 0.8 * reveal - 0.4 * reveal * reveal);
        const exitOffset = vh * (conceal - 0.4 * conceal * conceal);
        const offset = entryOffset - exitOffset;
        content.style.transform = `translate3d(0,${offset.toFixed(2)}px,0)`;
      }
    };
    S._onScroll = () => {
      S._paintOv2();
      if (S._netPar) S._netPar();
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };
    window.addEventListener('scroll', S._onScroll, { passive: true });
    window.addEventListener('resize', S._onScroll);
    S._paintOv2();
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
      const need = r.span + (r.el.parentElement.clientWidth || 1200) * 2;
      while (r.el.scrollWidth < need) {
        r.base.forEach((n: Any) => r.el.appendChild(n.cloneNode(true)));
      }
      if (r.dir === 1) r.x = -r.span;
    });
    S._remeasure = () => rows.forEach(measure);
    window.addEventListener('resize', S._remeasure);

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
        [scoreRowRef.current, lRow1Ref.current, lRow2Ref.current, lRow3Ref.current], 180);
      side('right', rColRef.current, rClipRef.current, rTextRef.current, chatTextRef.current,
        [chatRowRef.current, rRow1Ref.current, rRow2Ref.current, rRow3Ref.current], 656);
      S._dnaGeom = geom;
    };
    S._measureDna();
    window.addEventListener('resize', S._measureDna);

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

  void refs; void iconSunRef; void iconMoonRef; void lRailRef; void rRailRef; void netWrapRef; void overlayRef;

  return (
    <div data-maiq-scope="" ref={scopeRef} style={{ fontFamily: "'Grandview','Barlow',Helvetica,Arial,sans-serif", background: "var(--p-bg,#0D2423)", color: "var(--p-text,#E9E0D1)", minHeight: "100vh", transition: "background 320ms cubic-bezier(.16,1,.3,1),color 320ms cubic-bezier(.16,1,.3,1)" }}>
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
        <div ref={headerSlotRef} style={{ position: "relative", display: "flex", alignItems: "center", height: "22px", width: "0", marginRight: "0", overflow: "hidden", top: "3px" }}>
          <div ref={headerLogoRef} style={{ position: "relative", display: "flex", flex: "none", opacity: "0" }}>
            <img src={logoBranco} alt="Maiq" style={{ height: "22px", width: "auto", display: "block" }} />
            <img ref={logoDayRef} src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "22px", width: "auto", display: "block", opacity: "0", transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
          </div>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: "28px", marginRight: "28px", fontSize: "14px", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
          <span style={{ cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="color:var(--p-text,#E9E0D1)">
            Home
          </span>
          <span style={{ cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="color:var(--p-text,#E9E0D1)">
            Demo
          </span>
          <span style={{ cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="color:var(--p-text,#E9E0D1)">
            Planos
          </span>
          <span style={{ cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="color:var(--p-text,#E9E0D1)">
            FAQ
          </span>
        </nav>
        <div style={{ "--action-primary-bg": "var(--p-cta-bg,#68462B)", "--action-primary-fg": "var(--p-cta-fg,#F1EBE0)", "--action-primary-bg-hover": "var(--p-cta-bg-hover,#7A5334)", "--action-primary-bg-active": "var(--p-cta-bg-active,#543619)", display: "flex" } as unknown as React.CSSProperties}>
          <MaiqButton size="md">Fale com um especialista</MaiqButton>
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
        <div style={{ position: "absolute", inset: "0", overflow: "hidden", filter: "blur(34px)", opacity: ".58" }}>
          <div data-maiq-anim="" style={{ position: "absolute", background: "radial-gradient(closest-side, var(--p-vol-accent,rgba(51,96,90,.72)) 0%, var(--p-vol-accent-2,rgba(51,96,90,.24)) 44%, var(--p-fade,rgba(20,55,55,0)) 72%)", left: "-6%", top: "-22%", width: "72%", height: "122%", animation: "maiqVolA 21.4s cubic-bezier(.4,0,.6,1) infinite", willChange: "transform" }}>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", background: "radial-gradient(closest-side, var(--p-vol-shadow,rgba(4,16,16,.78)) 0%, var(--p-vol-shadow-2,rgba(51,96,90,.22)) 44%, var(--p-fade,rgba(20,55,55,0)) 72%)", left: "42%", top: "16%", width: "70%", height: "116%", animation: "maiqVolB 23.8s cubic-bezier(.4,0,.6,1) infinite", willChange: "transform" }}>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", background: "radial-gradient(closest-side, var(--p-vol-mint,rgba(145,163,152,.22)) 0%, var(--p-vol-mint-2,rgba(145,163,152,.09)) 44%, var(--p-fade,rgba(20,55,55,0)) 72%)", left: "14%", top: "34%", width: "58%", height: "82%", animation: "maiqVolC 26.2s cubic-bezier(.4,0,.6,1) infinite", willChange: "transform" }}>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", background: "radial-gradient(closest-side, var(--p-vol-deep,rgba(6,22,21,.62)) 0%, var(--p-vol-deep-2,rgba(145,163,152,.08)) 44%, var(--p-fade,rgba(20,55,55,0)) 72%)", left: "58%", top: "-28%", width: "60%", height: "100%", animation: "maiqVolD 28.6s cubic-bezier(.4,0,.6,1) infinite", willChange: "transform" }}>
          </div>
        </div>
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
              Transformamos a capacidade de crescimento das médias empresas, combinando método, tecnologia e conhecimento multidisciplinar. Sistematizamos a expansão inorgânica do seu negócio.
            </p>
          </div>
        </div>
        <div style={{ position: "relative", margin: "clamp(30px,5vh,72px) auto 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(30px,5vh,72px)" }}>
          <div style={{ width: "68px", height: "1px", background: "linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(233,224,209,.14)) 22%,var(--p-hair,rgba(233,224,209,.14)) 78%,transparent 100%)" }}>
          </div>
          <div style={{ fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
            COMO AJUDAMOS CLIENTES E PARCEIROS
          </div>
        </div>
        <div ref={marqueeRef} style={{ position: "relative", margin: "clamp(18px,2.6vh,32px) auto 0", width: "70%", display: "flex", flexDirection: "column", gap: "14px", maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)" }}>
          <div style={{ overflow: "hidden" }}>
            <div ref={rowARef} style={{ display: "flex", gap: "14px", width: "max-content", willChange: "transform" }}>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Venda de empresa
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Aquisição de concorrente
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Captação de recursos
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Atração de investidores
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Coordenação de M&A
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Venda de empresa
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Aquisição de concorrente
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Captação de recursos
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Atração de investidores
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Coordenação de M&A
              </div>
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={rowBRef} style={{ display: "flex", gap: "14px", width: "max-content", willChange: "transform" }}>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Avaliação de empresas — valuation
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Fairness Opinion
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Estruturação de dívida
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Joint ventures
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Consolidação de mercado
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Avaliação de empresas — valuation
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Fairness Opinion
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Estruturação de dívida
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Joint ventures
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "46px", padding: "0 24px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Consolidação de mercado
              </div>
            </div>
            <div aria-hidden="true" data-maiq-plat-spacer="" style={{ marginTop: "auto" }}>
            </div>
          </div>
        </div>
      </section>
      <div ref={overlayRef} style={{ position: "relative", zIndex: "2", background: "var(--p-bg,#0D2423)", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderBottom: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "24px", overflow: "clip", boxShadow: "var(--p-overlay-shadow,0 -30px 60px -18px rgba(4,16,16,.62)), 0 30px 60px -18px rgba(4,16,16,.62)", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
        <div className="maiq-model-pilares-bg" style={{ position: "relative", zIndex: "2", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
        <section aria-label="Nosso modelo" style={{ position: "relative", zIndex: "1", minHeight: "100vh", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "clamp(104px,13vh,150px) 48px clamp(36px,4.5vh,64px)" }}>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,3vh,44px)" }}>
            <div>
              <h2 data-maiq-modelo-h2="" style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1.04", letterSpacing: "-.022em", fontWeight: "600", margin: "0" }}>
                Nosso modelo
              </h2>
              <p style={{ fontSize: "17px", lineHeight: "1.6", color: "var(--p-muted,#91A398)", margin: "14px 0 0", maxWidth: "56ch", textWrap: "pretty" }}>
                Não nos diferenciamos pela formação em finanças, tampouco pela digitalização convencional de processos.
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
                    <div style={{ fontSize: "13px", fontWeight: "500", marginTop: "8px" }}>
                      Metodologia proprietária
                    </div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: "var(--p-muted,#91A398)", marginTop: "2px" }}>
                      unknown unknowns
                    </div>
                  </div>
                  <div style={{ marginTop: "24px", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div ref={scoreRowRef} style={{ position: "relative", marginLeft: "25px", width: "251px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right", transitionDelay: "0ms" }}>
                      <span ref={scoreTextRef}>
                        Score de prontidão
                      </span>
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow1Ref} style={{ position: "relative", marginLeft: "31px", width: "246px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right" }}>
                      Roadmap de evolução
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow2Ref} style={{ position: "relative", marginLeft: "52px", width: "233px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right" }}>
                      10 dimensões avaliadas
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow3Ref} style={{ position: "relative", marginLeft: "93px", width: "213px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "right" }}>
                      Playbook de integração
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
                    <div style={{ fontSize: "13px", fontWeight: "500", marginTop: "8px" }}>
                      Arquitetura tecnológica
                    </div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: "var(--p-muted,#91A398)", marginTop: "2px" }}>
                      known unknowns
                    </div>
                  </div>
                  <div style={{ marginTop: "24px", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div ref={chatRowRef} style={{ position: "relative", marginRight: "25px", width: "251px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      <span ref={chatTextRef}>
                        Chat especialista
                      </span>
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow1Ref} style={{ position: "relative", marginRight: "31px", width: "246px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      Gestão à vista
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow2Ref} style={{ position: "relative", marginRight: "52px", width: "233px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      Análise holística
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#E9E0D1)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow3Ref} style={{ position: "relative", marginRight: "93px", width: "213px", padding: "13px 0", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "14px", color: "var(--p-text-2,#B7C4BC)", textAlign: "left" }}>
                      Monitoramento contínuo
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
              <img src={toolGpt} alt="OpenAI" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolClaude} alt="Claude" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolGemini} alt="Gemini" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolNotebooklm} alt="NotebookLM" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolPerplexity} alt="Perplexity" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
              <img src={toolN8n} alt="n8n" style={{ height: "24px", width: "auto", display: "block", opacity: ".42", filter: "var(--p-tool-filter,brightness(0) invert(1))", transition: "opacity 200ms cubic-bezier(.2,0,0,1)" }} data-hover-style="opacity:.9" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "clamp(24px,4vw,56px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }} data-maiq-odo="">
                  R$ 291
                  <span style={{ fontSize: ".54em", fontWeight: "600", letterSpacing: "-.01em", marginLeft: ".03em" }}>
                    M
                  </span>
                </div>
                <div style={{ height: "3px", background: "var(--p-mark-1,#91A398)" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
                  em deals assessorados
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }} data-maiq-odo="">
                  08
                </div>
                <div style={{ height: "3px", background: "var(--p-mark-2,#33605A)" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
                  conexões diretas com investidores
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }} data-maiq-odo="">
                  12
                </div>
                <div style={{ height: "3px", background: "var(--p-hair,rgba(233,224,209,.14))" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: "500", color: "var(--p-muted,#91A398)" }}>
                  parceiros de negócio
                </div>
              </div>
            </div>
          </div>
        </section>
        <section aria-label="Os Pilares" style={{ position: "relative", zIndex: "1", minHeight: "100vh", boxSizing: "border-box", display: "flex", alignItems: "stretch", padding: "clamp(104px,13vh,150px) 48px clamp(36px,4.5vh,64px)" }}>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,3vh,44px)" }}>
            <div>
              <h2 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1.04", letterSpacing: "-.022em", fontWeight: "600", margin: "0" }}>
                Os Pilares
              </h2>
              <p style={{ fontSize: "17px", lineHeight: "1.6", color: "var(--p-muted,#91A398)", margin: "14px 0 0", maxWidth: "56ch", textWrap: "pretty" }}>
                Seção em construção.
              </p>
            </div>
            <div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(24px,6vh,72px) 0" }}>
              <div aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "clamp(120px,14vw,168px)", height: "clamp(120px,14vw,168px)", borderRadius: "999px", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", background: "var(--p-chip-bg,rgba(233,224,209,.04))", color: "var(--p-muted,#91A398)" }}>
                <TriangleAlert strokeWidth={1.25} style={{ width: "52%", height: "52%" }} />
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
      <div ref={overlay2WrapRef} style={{ position: "relative", zIndex: "1" }}>
          <div ref={overlay2Ref} style={{ position: "relative", zIndex: "1", background: "var(--p-bg,#0D2423)", overflow: "clip", willChange: "transform", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
            <div ref={netWrapRef} style={{ position: "sticky", top: "0", zIndex: "0", overflow: "clip", background: "var(--p-bg,#0D2423)", transition: "background 320ms cubic-bezier(.16,1,.3,1)", willChange: "transform" }}>
              <canvas aria-hidden="true" ref={platBgRef} data-maiq-plat-bg="" style={{ position: "sticky", top: "0", left: "0", width: "100%", height: "calc(100vh + 26vh)", marginBottom: "calc(-100vh - 26vh)", display: "block", pointerEvents: "none", zIndex: "0", willChange: "transform" }}>
              </canvas>
              <div ref={netContentRef} data-maiq-net-content="" style={{ position: "relative", zIndex: "1", willChange: "transform" }}>
              <section aria-label="A Plataforma" style={{ position: "relative", zIndex: "1" }}>
                <div data-maiq-plat-pin="" style={{ position: "relative", minHeight: "100vh", boxSizing: "border-box", display: "flex", alignItems: "flex-start", padding: "0 48px" }}>
                  <div ref={platInnerRef} data-maiq-plat-inner="" style={{ position: "relative", zIndex: "1", width: "100%", maxWidth: "1200px", height: "100vh", boxSizing: "border-box", margin: "0 auto", display: "flex", flexDirection: "column", paddingTop: "clamp(104px,13vh,150px)" }}>
                    <div>
                      <h2 data-maiq-plat-h2="" style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1.04", letterSpacing: "-.022em", fontWeight: "600", margin: "0" }}>
                        A Plataforma
                      </h2>
                      <p style={{ fontSize: "17px", lineHeight: "1.6", color: "var(--p-muted,#91A398)", margin: "14px 0 0", maxWidth: "56ch", textWrap: "pretty" }}>
                        Disponibilizamos funcionalidades que potencializam seus recursos, unindo metodologia, gestão e inovação tecnológica.
                      </p>
                    </div>
                    <div data-maiq-plat-bar="" style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "clamp(8px,1vw,14px)" }}>
                      <div data-maiq-plat-tabs="" style={{ flex: "1 1 auto", minWidth: "0", display: "flex", alignItems: "center", gap: "clamp(6px,.8vw,12px)" }}>
                        <button type="button" data-maiq-plat-tab="" aria-label="Ver M&AI" style={{ position: "relative", flex: "1 1 0", minWidth: "0", height: "48px", padding: "0 clamp(12px,1.5vw,24px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", color: "var(--p-muted,#91A398)", font: "inherit", fontSize: "15px", fontWeight: "500", lineHeight: "1", whiteSpace: "nowrap", cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1),border-color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}>
                          <svg aria-hidden="true" style={{ position: "absolute", left: "1px", top: "1px", width: "calc(100% - 2px)", height: "calc(100% - 2px)", overflow: "visible", pointerEvents: "none" }}>
                            <rect data-maiq-plat-ring="" x="0" y="0" width="100%" height="100%" rx="23" ry="23" pathLength="1" fill="none" stroke="var(--p-ring,#CBD8D0)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="1 1" strokeDashoffset="1" style={{ filter: "drop-shadow(0 0 4px var(--p-ring-glow,rgba(203,216,208,.40)))" }} />
                          </svg>
                          <span style={{ position: "relative" }}>
                            M&AI
                          </span>
                        </button>
                        <button type="button" data-maiq-plat-tab="" aria-label="Ver QUARPX" style={{ position: "relative", flex: "1 1 0", minWidth: "0", height: "48px", padding: "0 clamp(12px,1.5vw,24px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", color: "var(--p-muted,#91A398)", font: "inherit", fontSize: "15px", fontWeight: "500", lineHeight: "1", whiteSpace: "nowrap", cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1),border-color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}>
                          <svg aria-hidden="true" style={{ position: "absolute", left: "1px", top: "1px", width: "calc(100% - 2px)", height: "calc(100% - 2px)", overflow: "visible", pointerEvents: "none" }}>
                            <rect data-maiq-plat-ring="" x="0" y="0" width="100%" height="100%" rx="23" ry="23" pathLength="1" fill="none" stroke="var(--p-ring,#CBD8D0)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="1 1" strokeDashoffset="1" style={{ filter: "drop-shadow(0 0 4px var(--p-ring-glow,rgba(203,216,208,.40)))" }} />
                          </svg>
                          <span style={{ position: "relative" }}>
                            QUARPX
                            <sup style={{ fontSize: ".55em", fontWeight: "500", top: "-.62em", position: "relative" }}>
                              ®
                            </sup>
                          </span>
                        </button>
                        <button type="button" data-maiq-plat-tab="" aria-label="Ver Teses" style={{ position: "relative", flex: "1 1 0", minWidth: "0", height: "48px", padding: "0 clamp(12px,1.5vw,24px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", color: "var(--p-muted,#91A398)", font: "inherit", fontSize: "15px", fontWeight: "500", lineHeight: "1", whiteSpace: "nowrap", cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1),border-color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}>
                          <svg aria-hidden="true" style={{ position: "absolute", left: "1px", top: "1px", width: "calc(100% - 2px)", height: "calc(100% - 2px)", overflow: "visible", pointerEvents: "none" }}>
                            <rect data-maiq-plat-ring="" x="0" y="0" width="100%" height="100%" rx="23" ry="23" pathLength="1" fill="none" stroke="var(--p-ring,#CBD8D0)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="1 1" strokeDashoffset="1" style={{ filter: "drop-shadow(0 0 4px var(--p-ring-glow,rgba(203,216,208,.40)))" }} />
                          </svg>
                          <span style={{ position: "relative" }}>
                            Teses
                          </span>
                        </button>
                        <button type="button" data-maiq-plat-tab="" aria-label="Ver Diligência" style={{ position: "relative", flex: "1 1 0", minWidth: "0", height: "48px", padding: "0 clamp(12px,1.5vw,24px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", color: "var(--p-muted,#91A398)", font: "inherit", fontSize: "15px", fontWeight: "500", lineHeight: "1", whiteSpace: "nowrap", cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1),border-color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}>
                          <svg aria-hidden="true" style={{ position: "absolute", left: "1px", top: "1px", width: "calc(100% - 2px)", height: "calc(100% - 2px)", overflow: "visible", pointerEvents: "none" }}>
                            <rect data-maiq-plat-ring="" x="0" y="0" width="100%" height="100%" rx="23" ry="23" pathLength="1" fill="none" stroke="var(--p-ring,#CBD8D0)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="1 1" strokeDashoffset="1" style={{ filter: "drop-shadow(0 0 4px var(--p-ring-glow,rgba(203,216,208,.40)))" }} />
                          </svg>
                          <span style={{ position: "relative" }}>
                            Diligência
                          </span>
                        </button>
                        <button type="button" data-maiq-plat-tab="" aria-label="Ver Conteúdo" style={{ position: "relative", flex: "1 1 0", minWidth: "0", height: "48px", padding: "0 clamp(12px,1.5vw,24px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(233,224,209,.04))", color: "var(--p-muted,#91A398)", font: "inherit", fontSize: "15px", fontWeight: "500", lineHeight: "1", whiteSpace: "nowrap", cursor: "pointer", transition: "color 200ms cubic-bezier(.2,0,0,1),border-color 200ms cubic-bezier(.2,0,0,1),background 200ms cubic-bezier(.2,0,0,1)" }}>
                          <svg aria-hidden="true" style={{ position: "absolute", left: "1px", top: "1px", width: "calc(100% - 2px)", height: "calc(100% - 2px)", overflow: "visible", pointerEvents: "none" }}>
                            <rect data-maiq-plat-ring="" x="0" y="0" width="100%" height="100%" rx="23" ry="23" pathLength="1" fill="none" stroke="var(--p-ring,#CBD8D0)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="1 1" strokeDashoffset="1" style={{ filter: "drop-shadow(0 0 4px var(--p-ring-glow,rgba(203,216,208,.40)))" }} />
                          </svg>
                          <span style={{ position: "relative" }}>
                            Conteúdo
                          </span>
                        </button>
                      </div>
                    </div>
                    <div data-maiq-plat-card="" style={{ marginTop: "auto", alignSelf: "center", display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", height: "min(46vh,529px)", width: "min(100%,calc(2 * min(46vh,529px)))", border: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "16px", overflow: "hidden", background: "var(--p-plat-veil,rgba(10,29,29,.46))" }}>
                      <div data-maiq-plat-anim="" style={{ position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
                        <div style={{ position: "absolute", inset: "0" }}>
                          <div data-maiq-plat-shape="" style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", opacity: "0" }}>
                            <div data-maiq-anim="" style={{ width: "44%", height: "44%", borderRadius: "50%", background: "var(--p-mark-2,#33605A)", animation: "maiqPlatPulse 5.2s cubic-bezier(.4,0,.6,1) infinite" }}>
                            </div>
                          </div>
                          <div data-maiq-plat-shape="" style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", opacity: "0" }}>
                            <div data-maiq-anim="" style={{ width: "40%", height: "40%", animation: "maiqPlatPulse 6.1s cubic-bezier(.4,0,.6,1) infinite" }}>
                              <div style={{ width: "100%", height: "100%", border: "1.5px solid var(--p-mark-1,#91A398)", transform: "rotate(45deg)" }}>
                              </div>
                            </div>
                          </div>
                          <div data-maiq-plat-shape="" style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", opacity: "0" }}>
                            <div data-maiq-anim="" style={{ position: "relative", width: "52%", height: "52%", animation: "maiqPlatPulseSoft 5.6s cubic-bezier(.4,0,.6,1) infinite" }}>
                              <div style={{ position: "absolute", inset: "0", border: "1.5px solid var(--p-mark-1,#91A398)", borderRadius: "50%" }}>
                              </div>
                              <div style={{ position: "absolute", inset: "17%", border: "1.5px solid var(--p-mark-2,#33605A)", borderRadius: "50%" }}>
                              </div>
                              <div style={{ position: "absolute", inset: "34%", borderRadius: "50%", background: "var(--p-mark-1,#91A398)" }}>
                              </div>
                            </div>
                          </div>
                          <div data-maiq-plat-shape="" style={{ position: "absolute", inset: "0", opacity: "0" }}>
                            <VdrEmbed />
                          </div>
                          <div data-maiq-plat-shape="" style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", opacity: "0" }}>
                            <div data-maiq-anim="" style={{ width: "46%", height: "46%", background: "var(--p-mark-2,#33605A)", clipPath: "polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)", animation: "maiqPlatPulse 5.9s cubic-bezier(.4,0,.6,1) infinite" }}>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-maiq-plat-right="" style={{ position: "relative", borderLeft: "1px solid var(--p-hair,rgba(233,224,209,.14))", padding: "clamp(24px,6%,52px)", display: "flex", alignItems: "center", boxSizing: "border-box" }}>
                        <div ref={platColRef} style={{ position: "relative", width: "100%", height: "100%" }}>
                          <div data-maiq-plat-block="" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px", opacity: "0", transition: "opacity 420ms cubic-bezier(.16,1,.3,1)" }}>
                            <h3 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(24px,2.2vw,32px)", lineHeight: "1.08", letterSpacing: "-.018em", fontWeight: "600", margin: "0" }}>
                              O chat para o próximo passo
                            </h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--p-muted,#91A398)", margin: "0", maxWidth: "42ch", textWrap: "pretty" }}>
                              Converse com uma IA treinada profundamente em frameworks e métodos para atender a sua necessidade. Escolha o tema, suas referências e você estará pronto para iniciar um debate que mudará o rumo da sua empresa.
                            </p>
                          </div>
                          <div data-maiq-plat-block="" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px", opacity: "0", transition: "opacity 420ms cubic-bezier(.16,1,.3,1)" }}>
                            <h3 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(24px,2.2vw,32px)", lineHeight: "1.08", letterSpacing: "-.018em", fontWeight: "600", margin: "0" }}>
                              Onde estamos na jornada do M&A?
                            </h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--p-muted,#91A398)", margin: "0", maxWidth: "42ch", textWrap: "pretty" }}>
                              Avalie a prontidão da sua empresa para uma transação de M&A bem sucedida. Acompanhe a evolução de cada competência por um painel intuitivo e monitore as ações priorizadas em cada estágio.
                            </p>
                          </div>
                          <div data-maiq-plat-block="" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px", opacity: "0", transition: "opacity 420ms cubic-bezier(.16,1,.3,1)" }}>
                            <h3 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(24px,2.2vw,32px)", lineHeight: "1.08", letterSpacing: "-.018em", fontWeight: "600", margin: "0" }}>
                              Construindo oportunidades
                            </h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--p-muted,#91A398)", margin: "0", maxWidth: "42ch", textWrap: "pretty" }}>
                              Elabore suas teses e planeje o crescimento inorgânico da sua empresa de forma assistida, organizada e segura. Explore as possibilidades do seu setor e garanta a melhor estratégia para o futuro.
                            </p>
                          </div>
                          <div data-maiq-plat-block="" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px", opacity: "0", transition: "opacity 420ms cubic-bezier(.16,1,.3,1)" }}>
                            <h3 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(24px,2.2vw,32px)", lineHeight: "1.08", letterSpacing: "-.018em", fontWeight: "600", margin: "0" }}>
                              Segurança e organização em poucos cliques
                            </h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--p-muted,#91A398)", margin: "0", maxWidth: "42ch", textWrap: "pretty" }}>
                              Tenha controle sobre sua documentação durante todo o processo de Due Dilligence. Centralize e compartilhe todos os documentos com acessos controlados, rastreabilidade e controle de versões.
                            </p>
                          </div>
                          <div data-maiq-plat-block="" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px", opacity: "0", transition: "opacity 420ms cubic-bezier(.16,1,.3,1)" }}>
                            <h3 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(24px,2.2vw,32px)", lineHeight: "1.08", letterSpacing: "-.018em", fontWeight: "600", margin: "0" }}>
                              Conhecimento como alma da transação
                            </h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--p-muted,#91A398)", margin: "0", maxWidth: "42ch", textWrap: "pretty" }}>
                              Mergulhe no universo de M&A com nossos conteúdos. Trazemos reflexões, cases, aspectos técnicos, notícias e outros temas para permitir que você esteja cada vez mais preparado para o próximo passo.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" data-maiq-plat-spacer="" style={{ marginTop: "auto" }}>
                    </div>
                  </div>
                </div>
              </section>
              <Ciclo />
              </div>
            </div>
            <div ref={overlay3Ref} style={{ position: "relative", zIndex: "2", background: "var(--p-bg,#0D2423)", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", borderRadius: "24px 24px 0 0", overflow: "clip", boxShadow: "var(--p-overlay-shadow,0 -30px 60px -18px rgba(4,16,16,.62))", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
            <section aria-label="O Conhecimento" style={{ minHeight: "100vh", boxSizing: "border-box", padding: "clamp(104px,13vh,150px) 48px clamp(36px,4.5vh,64px)" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h2 style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1.04", letterSpacing: "-.022em", fontWeight: "600", margin: "0" }}>
                  O Conhecimento
                </h2>
              </div>
            </section>
            <footer style={{ background: "var(--p-footer-bg,#0A1D1D)", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", padding: "64px 48px 32px", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", gap: "48px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", display: "inline-flex" }}>
                  <img src={logoBranco} alt="Maiq" style={{ height: "30px", width: "auto", display: "block" }} />
                  <img ref={logoFooterDayRef} src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "30px", width: "auto", display: "block", opacity: "0", transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
                </div>
                <div style={{ fontSize: "14px", color: "var(--p-muted,#91A398)" }}>
                  contato@maiq.app.br
                </div>
              </div>
              <div style={{ maxWidth: "1200px", margin: "48px auto 0", paddingTop: "24px", borderTop: "1px solid var(--p-hair,rgba(233,224,209,.14))", fontSize: "13px", color: "var(--p-muted,#91A398)" }}>
                © 2026 Maiq. Todos os direitos reservados.
              </div>
            </footer>
            </div>
          </div>
        </div>
      </div>


  );
}
