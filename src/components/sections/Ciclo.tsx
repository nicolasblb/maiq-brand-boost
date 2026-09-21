import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Cog, FileCheck, Search, Target } from 'lucide-react';

const LANES = [
  { label: 'Estratégia', top: '9.90%', Icon: Target, icon: 'target' as const },
  { label: 'Originação', top: '36.57%', Icon: Search, icon: 'search' as const },
  { label: 'Execução', top: '63.43%', Icon: Cog, icon: 'cog' as const },
  { label: 'Efetivação', top: '90.10%', Icon: FileCheck, icon: 'file-check' as const },
];

type LaneIconName = (typeof LANES)[number]['icon'];

function LaneSvgIcon({ name, x, y }: { name: LaneIconName; x: number; y: number }) {
  const scale = 20 / 24;
  return (
    <g
      transform={`translate(${x},${y}) scale(${scale})`}
      fill="none"
      stroke="var(--c-lane-fg)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'target' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </>
      )}
      {name === 'cog' && (
        <>
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4" />
        </>
      )}
      {name === 'file-check' && (
        <>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v5h5" />
          <path d="m9 15 2 2 4-4" />
        </>
      )}
    </g>
  );
}


type Step = {
  id: string;
  p: SVGPathElement;
  len: number;
  node: string | null;
  next: string[];
  k: number;
};

type Runner = {
  cfg: { v: number; hold: number };
  map: Record<string, Step>;
  first: string;
  cur: Step;
  next: string;
  trav: SVGGElement;
  start: string | null;
  idle: number;
  d: number;
  mode: 'hold' | 'run';
  until: number;
};

export default function Ciclo() {
  const cicloRef = useRef<HTMLElement | null>(null);
  const cicloScrollRef = useRef<HTMLDivElement | null>(null);
  const cicloSvgRef = useRef<SVGSVGElement | null>(null);
  const cicloFasesRef = useRef<HTMLDivElement | null>(null);
  const cicloDragHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sec = cicloRef.current;
    const svg = cicloSvgRef.current;
    const sc = cicloScrollRef.current;
    if (!sec || !svg || !sc) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const layer = svg.querySelector<SVGGElement>('[data-c-flowlayer]');
    const segs = Array.prototype.slice.call(svg.querySelectorAll('[data-c-seg]')) as SVGPathElement[];
    const fasesG = svg.querySelector<SVGGElement>('[data-c-fases]');
    const band = Array.prototype.slice.call(svg.querySelectorAll('[data-c-phase="band"]')) as SVGGElement[];
    const phases = [0, 1, 2, 3].map((i) =>
      Array.prototype.slice.call(svg.querySelectorAll('[data-c-phase="' + i + '"]'))
    ) as SVGGElement[][];

    // pulso de chegada: contornos clonados sobre a própria forma do nó
    const nodes: Record<string, HTMLElement[]> = {};
    Array.prototype.slice.call(svg.querySelectorAll('[data-c-node]')).forEach((g: Element) => {
      const base = g.querySelector('rect,polygon');
      if (!base) return;
      const mk = (w: number, peak: string) => {
        const c = base.cloneNode(false) as SVGElement;
        c.setAttribute('fill', 'none');
        c.setAttribute('stroke', 'var(--c-flow-core)');
        c.setAttribute('stroke-width', String(w));
        c.setAttribute('opacity', '0');
        c.style.setProperty('--pulse-peak', peak);
        // isola o repaint do pulso para não re-rasterizar textos vizinhos
        c.style.willChange = 'opacity';
        g.appendChild(c);
        return c as unknown as HTMLElement;
      };
      const key = g.getAttribute('data-c-node');
      if (key) nodes[key] = [mk(9, '.16'), mk(2.4, '.92')];
    });
    const pulse = (k: string) => {
      const set = nodes[k];
      if (!set) return;
      set.forEach((el) => {
        el.style.animation = 'none';
        el.getBoundingClientRect();
        el.style.animation = 'maiqNodePulse 900ms cubic-bezier(.2,0,0,1) 1';
      });
    };

    // Cada rota é um grafo de trechos: o círculo luminoso anda em velocidade
    // constante, encosta na forma, se apaga, a forma pulsa e ele reacende na
    // saída seguinte. Nos losangos a saída alterna entre as duas extremidades
    // opostas a cada passagem — e como há um único círculo por rota, nunca
    // saem dois ao mesmo tempo.
    const CFG: Record<string, { v: number; hold: number }> = {
      main: { v: 0.092, hold: 290 },
      cycle: { v: 0.112, hold: 340 },
    };
    const runners: Runner[] = [];
    Array.prototype.slice.call(svg.querySelectorAll('[data-c-route]')).forEach((rg: Element) => {
      const cfg = CFG[rg.getAttribute('data-c-route') || ''] || CFG['main']!;
      const map: Record<string, Step> = {};
      const order: Step[] = Array.prototype.slice.call(rg.querySelectorAll('[data-c-step]')).map((g: Element) => {
        const p = g.querySelector('path') as SVGPathElement;
        const st: Step = {
          id: g.getAttribute('data-step-id') || '',
          p,
          len: p.getTotalLength(),
          node: g.getAttribute('data-step-node') || null,
          next: (g.getAttribute('data-step-next') || '').split(',').filter(Boolean),
          k: 0,
        };
        map[st.id] = st;
        return st;
      });
      if (!order.length) return;
      const walk = order.reduce((a, st) => a + st.len, 0) / cfg.v;
      const seeds = (rg.getAttribute('data-route-seed') || '').split(',').filter(Boolean);
      const first = order[0]!;
      Array.prototype.slice.call(rg.querySelectorAll('[data-c-trav]')).forEach((t: SVGGElement, i: number) => {
        const seedId = seeds[i];
        const seed = seedId && map[seedId] ? seedId : first.id;
        runners.push({
          cfg,
          map,
          first: first.id,
          cur: map[seed]!,
          next: seed,
          trav: t,
          start: rg.getAttribute('data-route-start'),
          idle: Math.max(800, 7000 - walk - order.length * cfg.hold),
          d: 0,
          mode: 'hold',
          until: performance.now() + 300 + i * 1400 + Math.random() * 800,
        });
      });
    });

    const place = (r: Runner) => {
      const pt = r.cur.p.getPointAtLength(Math.min(r.d, r.cur.len));
      r.trav.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ')');
    };
    // o grupo em movimento ganha camada própria: sem isso o SVG inteiro é
    // re-rasterizado a cada quadro e textos/formas "vibram" pelo antialias
    Array.prototype.slice.call(svg.querySelectorAll('[data-c-trav]')).forEach((g: Element) => {
      (g as SVGGElement).style.willChange = 'transform';
    });
    const stepRun = (r: Runner, dt: number, now: number) => {
      if (!r.cur || !r.trav) return;
      if (r.mode === 'hold') {
        if (now < r.until) return;
        if (r.next === r.first && r.start) pulse(r.start);
        r.cur = r.map[r.next]!;
        r.d = 0;
        r.mode = 'run';
        place(r);
        r.trav.style.opacity = '1';
        return;
      }
      r.d += r.cfg.v * dt;
      if (r.d < r.cur.len) {
        place(r);
        return;
      }
      r.d = r.cur.len;
      place(r);
      const st = r.cur;
      if (st.node) pulse(st.node);
      const end = !st.next.length;
      r.next = end ? r.first : st.next[st.k++ % st.next.length]!;
      r.mode = 'hold';
      r.until = now + (end ? r.idle : r.cfg.hold);
      r.trav.style.opacity = '0';
    };

    let cicloRaf: number | null = null;
    let flowLast = 0;
    const tick = (now: number) => {
      cicloRaf = requestAnimationFrame(tick);
      const dt = Math.min(66, flowLast ? now - flowLast : 16);
      flowLast = now;
      runners.forEach((r) => stepRun(r, dt, now));
    };
    const setPlay = (on: boolean) => {
      if (on) {
        if (reduce || cicloRaf) return;
        flowLast = 0;
        cicloRaf = requestAnimationFrame(tick);
      } else if (cicloRaf) {
        cancelAnimationFrame(cicloRaf);
        cicloRaf = null;
      }
    };
    if (reduce) runners.forEach((r) => { if (r.trav) r.trav.style.display = 'none'; });
    let cicloVis = false;

    if (!reduce) {
      const hide = (g: SVGGElement | HTMLElement, dy: number) => {
        g.style.opacity = '0';
        g.style.transform = 'translateY(' + dy + 'px)';
        g.style.transition = 'opacity 460ms cubic-bezier(.16,1,.3,1),transform 460ms cubic-bezier(.16,1,.3,1)';
      };
      band.forEach((g) => hide(g, -8));
      if (fasesG) hide(fasesG, 0);
      phases.forEach((gs) => gs.forEach((g) => hide(g, 10)));
      segs.forEach((p) => {
        const l = p.getTotalLength();
        p.style.strokeDasharray = l.toFixed(1) + ' ' + l.toFixed(1);
        p.style.strokeDashoffset = l.toFixed(1);
        p.style.transition = 'stroke-dashoffset 640ms cubic-bezier(.2,0,0,1)';
      });
    }

    const cicloTimeouts: ReturnType<typeof setTimeout>[] = [];
    let revealed = reduce;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      const show = (g: SVGGElement | HTMLElement) => {
        g.style.opacity = '1';
        g.style.transform = 'translateY(0)';
      };
      band.forEach(show);
      if (fasesG) show(fasesG);
      phases.forEach((gs, i) => {
        cicloTimeouts.push(setTimeout(() => gs.forEach(show), 180 + i * 460));
      });
      cicloTimeouts.push(
        setTimeout(() => {
          segs.forEach((p, i) => {
            cicloTimeouts.push(setTimeout(() => { p.style.strokeDashoffset = '0'; }, i * 45));
          });
        }, 180 + 4 * 460)
      );
      cicloTimeouts.push(
        setTimeout(() => {
          if (layer) layer.style.opacity = '1';
          if (cicloVis) setPlay(true);
          const clear = (g: SVGGElement | HTMLElement) => {
            g.style.transition = 'none';
            g.style.transform = 'none';
          };
          if (fasesG) clear(fasesG);
          phases.forEach((gs) => gs.forEach(clear));
          band.forEach(clear);
        }, 180 + 4 * 460 + 700)
      );
    };

    // Piso de legibilidade: quando o diagrama completo não cabe, ele mantém
    // sua escala mínima e passa a rolar horizontalmente sem recortar as raias.
    const MIN_FULL = 1071;
    const MIN_CROP = 890;
    const AR = 525 / 1400;
    const ARC = 525 / 1163;
    const updateDragHint = () => {
      const hint = cicloDragHintRef.current;
      if (!hint) return;
      const maxScroll = sc.scrollWidth - sc.clientWidth;
      hint.style.display = maxScroll > 1 ? 'flex' : 'none';
    };
    const layout = () => {
      const fases = cicloFasesRef.current;
      const PAD = 32;
      const availW = Math.max(240, (sc.clientWidth || sec.clientWidth - 96) - PAD);
      const availH =
        Math.max(
          200,
          Math.round((window.innerHeight || 800) - (sec.getBoundingClientRect().height - sc.clientHeight) - 8)
        ) - PAD - Math.max(0, sc.offsetHeight - sc.clientHeight - 2);
      const fitW = Math.min(availW, Math.round(availH / AR));
      if (fitW >= MIN_FULL) {
        const h = Math.round(fitW * AR);
        svg.setAttribute('viewBox', '0 130 1400 525');
        sc.style.overflowX = 'hidden';
        sc.style.justifyContent = 'center';
        svg.style.flex = '0 0 auto';
        svg.style.width = fitW + 'px';
        svg.style.height = h + 'px';
        sc.style.minHeight = '0px';
        if (fasesG) fasesG.style.display = '';
        if (fases) fases.style.display = 'none';
      } else {
        const w = Math.max(MIN_CROP, Math.min(Math.max(1, availW), Math.round(availH / ARC)));
        const h = Math.round(w * ARC);
        svg.setAttribute('viewBox', '237 130 1163 525');
        sc.style.overflowX = 'auto';
        sc.style.justifyContent = 'flex-start';
        svg.style.flex = '0 0 auto';
        svg.style.width = w + 'px';
        svg.style.height = h + 'px';
        sc.style.minHeight = '0px';
        if (fasesG) fasesG.style.display = 'none';
        if (fases) {
          fases.style.display = 'block';
          fases.style.height = h + 'px';
        }
      }
      window.requestAnimationFrame(updateDragHint);
    };
    layout();
    window.addEventListener('resize', layout);
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (sc.scrollWidth <= sc.clientWidth || event.button !== 0) return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartScroll = sc.scrollLeft;
      sc.dataset['dragging'] = 'true';
      sc.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      sc.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      delete sc.dataset['dragging'];
      if (sc.hasPointerCapture(event.pointerId)) sc.releasePointerCapture(event.pointerId);
    };
    const onScrollKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const maxScroll = sc.scrollWidth - sc.clientWidth;
      if (event.key === 'Home') sc.scrollTo({ left: 0, behavior: 'smooth' });
      else if (event.key === 'End') sc.scrollTo({ left: maxScroll, behavior: 'smooth' });
      else sc.scrollBy({ left: event.key === 'ArrowRight' ? 120 : -120, behavior: 'smooth' });
    };
    sc.addEventListener('pointerdown', onPointerDown);
    sc.addEventListener('pointermove', onPointerMove);
    sc.addEventListener('pointerup', onPointerUp);
    sc.addEventListener('pointercancel', onPointerUp);
    sc.addEventListener('keydown', onScrollKeyDown);

    let cicloIO: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      cicloIO = new IntersectionObserver((es) => {
        es.forEach((e) => {
          cicloVis = e.isIntersecting;
          if (e.isIntersecting) {
            reveal();
            if (revealed && layer && layer.style.opacity === '1') setPlay(true);
          } else setPlay(false);
        });
      }, { threshold: 0.12 });
      cicloIO.observe(sec);
    }

    // rede de segurança geométrica: em contextos onde o IntersectionObserver
    // não entrega (aba oculta, impressão, iframes fora de composição) a seção
    // ainda revela e anima ao entrar em tela
    const probe = () => {
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const vis = r.bottom > vh * 0.12 && r.top < vh * 0.88;
      if (vis === cicloVis) return;
      cicloVis = vis;
      if (!vis) {
        setPlay(false);
        return;
      }
      reveal();
      if (layer && layer.style.opacity === '1') setPlay(true);
    };
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    probe();

    return () => {
      if (cicloRaf) cancelAnimationFrame(cicloRaf);
      window.removeEventListener('resize', layout);
      sc.removeEventListener('pointerdown', onPointerDown);
      sc.removeEventListener('pointermove', onPointerMove);
      sc.removeEventListener('pointerup', onPointerUp);
      sc.removeEventListener('pointercancel', onPointerUp);
      sc.removeEventListener('keydown', onScrollKeyDown);
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
      if (cicloIO) cicloIO.disconnect();
      cicloTimeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <section
      data-maiq-sec="ciclo"
      aria-label="O Ciclo"
      ref={cicloRef}
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(80px,11vh,132px) 48px clamp(56px,8vh,96px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(28px,4.5vh,52px)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'Inter,var(--font-core)',
              fontSize: 'clamp(38px,4.2vw,58px)',
              lineHeight: 1.04,
              letterSpacing: '-.022em',
              fontWeight: 600,
              margin: 0,
            }}
          >
            O M&amp;A não termina na assinatura
            <br />
            de um contrato
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--p-muted,#91A398)',
              margin: '14px auto 0',
              maxWidth: '62ch',
              textWrap: 'pretty' as any,
            }}
          >
            É a partir da conclusão da transação que começa o trabalho
            <br />
            de integração e captura de sinergias
          </p>
        </div>
        <div
          className="maiq-cycle-frame"
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: 16,
            border: '1px solid var(--p-hair,rgba(233,224,209,.14))',
            borderRadius: 16,
            background: 'var(--c-frame-bg)',
          }}
        >
          <div
            ref={cicloFasesRef}
            aria-hidden="true"
            className="maiq-cycle-lanes"
          >
            <svg className="maiq-cycle-lane-separators" viewBox="0 130 237 525" preserveAspectRatio="none">
              <defs>
                <linearGradient id="maiqCHFadeMobile" gradientUnits="userSpaceOnUse" x1="34" y1="0" x2="224" y2="0">
                  <stop offset="0" stopColor="var(--c-sep)" stopOpacity="0" />
                  <stop offset=".09" stopColor="var(--c-sep)" stopOpacity="1" />
                  <stop offset=".91" stopColor="var(--c-sep)" stopOpacity="1" />
                  <stop offset="1" stopColor="var(--c-sep)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#maiqCHFadeMobile)" strokeWidth="1.3" strokeDasharray="2.6 9" strokeLinecap="round">
                <path d="M34,252 H224" />
                <path d="M34,392.5 H224" />
                <path d="M34,533 H224" />
              </g>
            </svg>
            {LANES.map((lane) => {
              const LaneIcon = lane.Icon;
              return (
                <div key={lane.label} className="maiq-cycle-lane" style={{ top: lane.top }}>
                  <LaneIcon size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span>{lane.label}</span>
                </div>
              );
            })}
          </div>
          <div
            ref={cicloScrollRef}
            tabIndex={0}
            role="group"
            aria-label="Diagrama do fluxo contínuo de M&A. Clique e arraste para visualizar."
            data-c-scroll=""
            className="maiq-cycle-scroll"
          >
            <svg
              ref={cicloSvgRef}
              viewBox="0 130 1400 525"
              preserveAspectRatio="xMidYMid meet"
              textRendering="geometricPrecision"
              style={{ flex: '1 1 auto', minWidth: 0, width: '100%', height: '100%', display: 'block' }}
            >
            <defs>
              <linearGradient id="maiqCVFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--c-dot)" stopOpacity="0" />
                <stop offset=".16" stopColor="var(--c-dot)" stopOpacity="1" />
                <stop offset=".84" stopColor="var(--c-dot)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--c-dot)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="maiqCHFadeA" gradientUnits="userSpaceOnUse" x1="252" y1="0" x2="1392" y2="0">
                <stop offset="0" stopColor="var(--c-sep)" stopOpacity="0" />
                <stop offset=".09" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset=".91" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--c-sep)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="maiqCHFadeB" gradientUnits="userSpaceOnUse" x1="252" y1="0" x2="930" y2="0">
                <stop offset="0" stopColor="var(--c-sep)" stopOpacity="0" />
                <stop offset=".09" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset=".91" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--c-sep)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="maiqCHFadeC" gradientUnits="userSpaceOnUse" x1="1140" y1="0" x2="1392" y2="0">
                <stop offset="0" stopColor="var(--c-sep)" stopOpacity="0" />
                <stop offset=".09" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset=".91" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--c-sep)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="maiqCHFadeLabels" gradientUnits="userSpaceOnUse" x1="34" y1="0" x2="224" y2="0">
                <stop offset="0" stopColor="var(--c-sep)" stopOpacity="0" />
                <stop offset=".12" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset=".88" stopColor="var(--c-sep)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--c-sep)" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="maiqCGlow">
                <stop offset="0" stopColor="var(--c-flow)" stopOpacity=".72" />
                <stop offset=".10" stopColor="var(--c-flow)" stopOpacity=".5" />
                <stop offset=".22" stopColor="var(--c-flow)" stopOpacity=".3" />
                <stop offset=".38" stopColor="var(--c-flow)" stopOpacity=".16" />
                <stop offset=".58" stopColor="var(--c-flow)" stopOpacity=".06" />
                <stop offset=".78" stopColor="var(--c-flow)" stopOpacity=".02" />
                <stop offset="1" stopColor="var(--c-flow)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="maiqCCore">
                <stop offset="0" stopColor="var(--c-flow-core)" stopOpacity=".95" />
                <stop offset=".35" stopColor="var(--c-flow-core)" stopOpacity=".78" />
                <stop offset=".7" stopColor="var(--c-flow-core)" stopOpacity=".3" />
                <stop offset="1" stopColor="var(--c-flow-core)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g data-c-sep="" aria-hidden="true" fill="none" strokeWidth="1.3" strokeDasharray="2.6 9" strokeLinecap="round">
              <path d="M34,252 H224" stroke="url(#maiqCHFadeLabels)" />
              <path d="M34,392.5 H224" stroke="url(#maiqCHFadeLabels)" />
              <path d="M34,533 H224" stroke="url(#maiqCHFadeLabels)" />
              <path d="M252,252 H1392" stroke="url(#maiqCHFadeA)" />
              <path d="M252,392.5 H1392" stroke="url(#maiqCHFadeA)" />
              <path d="M252,533 H930" stroke="url(#maiqCHFadeB)" />
              <path d="M1140,533 H1392" stroke="url(#maiqCHFadeC)" />
            </g>
            <path aria-hidden="true" d="M237,142 V643" stroke="url(#maiqCVFade)" strokeWidth="1" fill="none" />
            <g data-c-lines="" fill="none" stroke="var(--c-line)" strokeWidth="1.5" strokeLinecap="round">
              <path data-c-seg="" d="M374.5,216 V288" />
              <path data-c-seg="" d="M374.5,356 V429" />
              <path data-c-seg="" d="M476,463 H502" />
              <path data-c-seg="" d="M554,463 H580" />
              <path data-c-seg="" d="M783,463 H809" />
              <path data-c-seg="" d="M861,463 H888" />
              <path data-c-seg="" d="M989.5,497 V507" />
              <path data-c-seg="" d="M989.5,559 V569" />
              <path data-c-seg="" d="M1091,603 H1173" />
              <path data-c-seg="" d="M810,603 H888" />
              <path data-c-seg="" d="M528,437 V345 H467" />
              <path data-c-seg="" d="M835,437 V322 H476" />
              <path data-c-seg="" d="M1015.5,533 H1122 V297 H465" />
              <path data-c-seg="" d="M1274.5,569 V182 H476" />
            </g>
            <g
              data-c-flowlayer=""
              aria-hidden="true"
              fill="none"
              stroke="none"
              style={{ opacity: 0, transition: 'opacity 720ms cubic-bezier(.16,1,.3,1)' }}
            >
              <g data-c-route="main" data-route-start="p1" data-route-seed="s1,s5,s8">
                <g data-c-step="" data-step-id="s1" data-step-node="p2" data-step-next="s2">
                  <path d="M374.5,216 V288" />
                </g>
                <g data-c-step="" data-step-id="s2" data-step-node="p3" data-step-next="s3">
                  <path d="M374.5,356 V429" />
                </g>
                <g data-c-step="" data-step-id="s3" data-step-node="d1" data-step-next="s4,s4b">
                  <path d="M476,463 H502" />
                </g>
                <g data-c-step="" data-step-id="s4" data-step-node="p4" data-step-next="s5">
                  <path d="M554,463 H580" />
                </g>
                <g data-c-step="" data-step-id="s4b" data-step-node="p2" data-step-next="s2">
                  <path d="M528,437 V345 H467" />
                </g>
                <g data-c-step="" data-step-id="s5" data-step-node="d2" data-step-next="s6,s6b">
                  <path d="M783,463 H809" />
                </g>
                <g data-c-step="" data-step-id="s6" data-step-node="p5" data-step-next="s7">
                  <path d="M861,463 H888" />
                </g>
                <g data-c-step="" data-step-id="s6b" data-step-node="p2" data-step-next="s2">
                  <path d="M835,437 V322 H476" />
                </g>
                <g data-c-step="" data-step-id="s7" data-step-node="d3" data-step-next="s8,s8b">
                  <path d="M989.5,497 V507" />
                </g>
                <g data-c-step="" data-step-id="s8" data-step-node="p6" data-step-next="s9,s9x">
                  <path d="M989.5,559 V569" />
                </g>
                <g data-c-step="" data-step-id="s8b" data-step-node="p2" data-step-next="s2">
                  <path d="M1015.5,533 H1122 V297 H465" />
                </g>
                <g data-c-step="" data-step-id="s9" data-step-node="p7" data-step-next="">
                  <path d="M1091,603 H1173" />
                </g>
                <g data-c-step="" data-step-id="s9x" data-step-node="exit" data-step-next="">
                  <path d="M888,603 H810" />
                </g>
                <g data-c-trav="" style={{ opacity: 0, transition: 'opacity 190ms linear' }}>
                  <circle r="23" fill="url(#maiqCGlow)" />
                  <circle r="5.6" fill="url(#maiqCCore)" />
                </g>
                <g data-c-trav="" style={{ opacity: 0, transition: 'opacity 190ms linear' }}>
                  <circle r="23" fill="url(#maiqCGlow)" />
                  <circle r="5.6" fill="url(#maiqCCore)" />
                </g>
                <g data-c-trav="" style={{ opacity: 0, transition: 'opacity 190ms linear' }}>
                  <circle r="23" fill="url(#maiqCGlow)" />
                  <circle r="5.6" fill="url(#maiqCCore)" />
                </g>
              </g>
              <g data-c-route="cycle" data-route-start="p7">
                <g data-c-step="" data-step-id="c1" data-step-node="p1" data-step-next="">
                  <path d="M1274.5,569 V182 H476" />
                </g>
                <g data-c-trav="" style={{ opacity: 0, transition: 'opacity 190ms linear' }}>
                  <circle r="23" fill="url(#maiqCGlow)" />
                  <circle r="5.6" fill="url(#maiqCCore)" />
                </g>
              </g>
            </g>
            <g data-c-fases="">
              <g data-c-phase="0">
                <LaneSvgIcon name="target" x={49} y={172} />
                <text x="81" y="189" textAnchor="start" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Estratégia
                </text>
              </g>
              <g data-c-phase="1">
                <LaneSvgIcon name="search" x={49} y={312} />
                <text x="81" y="329" textAnchor="start" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Originação
                </text>
              </g>
              <g data-c-phase="2">
                <LaneSvgIcon name="cog" x={49} y={453} />
                <text x="81" y="470" textAnchor="start" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Execução
                </text>
              </g>
              <g data-c-phase="3">
                <LaneSvgIcon name="file-check" x={49} y={593} />
                <text x="81" y="610" textAnchor="start" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Efetivação
                </text>
              </g>

            </g>
            <g data-c-phase="0">
              <g data-c-node="p1">
                <rect x="273" y="148" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="374.5" y="178" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  Tese de
                  <tspan x="374.5" dy="21">
                    Investimento
                  </tspan>
                </text>
              </g>
            </g>
            <g data-c-phase="1">
              <g data-c-node="p2">
                <rect x="273" y="288" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="374.5" y="318" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  Pipeline de
                  <tspan x="374.5" dy="21">
                    Targets
                  </tspan>
                </text>
              </g>
            </g>
            <g data-c-phase="2">
              <g data-c-node="p3">
                <rect x="273" y="429" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="374.5" y="459" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  Negociação e
                  <tspan x="374.5" dy="21">
                    Valuation
                  </tspan>
                </text>
              </g>
              <g data-c-node="p4">
                <rect x="580" y="429" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="681.5" y="459" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  NBO – Oferta
                  <tspan x="681.5" dy="21">
                    não vinculante
                  </tspan>
                </text>
              </g>
              <g data-c-node="p5">
                <rect x="888" y="429" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="989.5" y="469" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  Due Diligence
                </text>
              </g>
              <g data-c-node="d1">
                <polygon points="528,437 554,463 528,489 502,463" fill="none" stroke="var(--c-line)" strokeWidth="1.5" />
              </g>
              <g data-c-node="d2">
                <polygon points="835,437 861,463 835,489 809,463" fill="none" stroke="var(--c-line)" strokeWidth="1.5" />
              </g>
            </g>
            <g data-c-phase="3">
              <g data-c-node="d3">
                <polygon points="989.5,507 1015.5,533 989.5,559 963.5,533" fill="none" stroke="var(--c-line)" strokeWidth="1.5" />
              </g>
              <g data-c-node="exit">
                <rect x="648" y="569" width="162" height="68" rx="34" fill="var(--c-exit)" />
                <text x="729" y="609" textAnchor="middle" fill="var(--c-exit-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  Full Exit
                </text>
              </g>
              <g data-c-node="p6">
                <rect x="888" y="569" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="989.5" y="609" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  Signing &amp; Closing
                </text>
              </g>
              <g data-c-node="p7">
                <rect x="1173" y="569" width="203" height="68" rx="34" fill="var(--c-block-bg)" stroke="var(--c-block-hair)" />
                <text x="1274.5" y="609" textAnchor="middle" fill="var(--c-block-fg)" style={{ fontSize: 17, fontWeight: 500 }}>
                  PMI – Integração
                </text>
              </g>
            </g>
            </svg>
          </div>
          <div
            ref={cicloDragHintRef}
            className="maiq-cycle-drag-hint"
            aria-hidden="true"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            <span>Clique e arraste para visualizar</span>
            <ChevronRight size={14} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  );
}
