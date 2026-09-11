import { useEffect, useRef } from 'react';

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
  const cicloFadeRef = useRef<HTMLDivElement | null>(null);

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

    // piso de legibilidade: os rótulos são 17px no viewBox e nunca renderizam
    // abaixo de ~13px. Se a largura disponível não sustenta isso, o diagrama
    // deixa de encolher: recorta a coluna de Fases (que volta fixa em HTML) e
    // passa a rolar horizontalmente. A altura acompanha a proporção.
    const MIN_FULL = 1071;
    const MIN_CROP = 890;
    const AR = 525 / 1400;
    const ARC = 525 / 1163;
    const layout = () => {
      const fases = cicloFasesRef.current;
      const fade = cicloFadeRef.current;
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
        if (fade) fade.style.display = 'none';
      } else {
        const w = Math.max(MIN_CROP, Math.min(availW - 230, Math.round(availH / ARC)));
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
        if (fade) fade.style.display = w + 230 > availW ? 'block' : 'none';
      }
    };
    layout();
    window.addEventListener('resize', layout);

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
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
      if (cicloIO) cicloIO.disconnect();
      cicloTimeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <section
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
        <div>
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
            O Ciclo
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--p-muted,#91A398)',
              margin: '14px 0 0',
              maxWidth: '62ch',
              textWrap: 'pretty' as any,
            }}
          >
            O deal de sucesso não nasce nas negociações e tampouco se limita à assinatura de um contrato. O M&A é
            um ciclo contínuo que fomenta oportunidades.
          </p>
        </div>
        <div
          ref={cicloScrollRef}
          tabIndex={0}
          role="group"
          aria-label="Diagrama do fluxo contínuo de M&A"
          data-c-scroll=""
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            outline: 'none',
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
            style={{
              display: 'none',
              position: 'sticky',
              left: 0,
              flex: '0 0 auto',
              width: 230,
              alignSelf: 'center',
              zIndex: 2,
              background: 'linear-gradient(var(--c-frame-bg),var(--c-frame-bg)),var(--p-bg,#0D2423)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '2%',
                bottom: '2%',
                width: 1,
                background:
                  'linear-gradient(180deg,transparent,var(--c-dot) 16%,var(--c-dot) 84%,transparent)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: '9.90%',
                transform: 'translateY(-50%)',
                width: 186,
                height: 80,
                borderRadius: 10,
                boxSizing: 'border-box',
                background: 'var(--c-lane-bg)',
                border: '1px solid var(--c-lane-hair)',
                color: 'var(--c-lane-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Estratégia
            </div>
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: '36.57%',
                transform: 'translateY(-50%)',
                width: 186,
                height: 80,
                borderRadius: 10,
                boxSizing: 'border-box',
                background: 'var(--c-lane-bg)',
                border: '1px solid var(--c-lane-hair)',
                color: 'var(--c-lane-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Originação
            </div>
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: '63.43%',
                transform: 'translateY(-50%)',
                width: 186,
                height: 80,
                borderRadius: 10,
                boxSizing: 'border-box',
                background: 'var(--c-lane-bg)',
                border: '1px solid var(--c-lane-hair)',
                color: 'var(--c-lane-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Execução
            </div>
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: '90.10%',
                transform: 'translateY(-50%)',
                width: 186,
                height: 80,
                borderRadius: 10,
                boxSizing: 'border-box',
                background: 'var(--c-lane-bg)',
                border: '1px solid var(--c-lane-hair)',
                color: 'var(--c-lane-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Efetivação
            </div>
          </div>
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
            <g data-c-sep="" aria-hidden="true" fill="none" strokeWidth="1" strokeDasharray="2 9">
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
                <rect x="34" y="142" width="190" height="80" rx="10" fill="var(--c-lane-bg)" stroke="var(--c-lane-hair)" />
                <text x="129" y="189" textAnchor="middle" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Estratégia
                </text>
              </g>
              <g data-c-phase="1">
                <rect x="34" y="282" width="190" height="80" rx="10" fill="var(--c-lane-bg)" stroke="var(--c-lane-hair)" />
                <text x="129" y="329" textAnchor="middle" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Originação
                </text>
              </g>
              <g data-c-phase="2">
                <rect x="34" y="423" width="190" height="80" rx="10" fill="var(--c-lane-bg)" stroke="var(--c-lane-hair)" />
                <text x="129" y="470" textAnchor="middle" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
                  Execução
                </text>
              </g>
              <g data-c-phase="3">
                <rect x="34" y="563" width="190" height="80" rx="10" fill="var(--c-lane-bg)" stroke="var(--c-lane-hair)" />
                <text x="129" y="610" textAnchor="middle" fill="var(--c-lane-fg)" style={{ fontSize: 19, fontWeight: 500 }}>
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
          <div
            ref={cicloFadeRef}
            aria-hidden="true"
            style={{
              display: 'none',
              position: 'absolute',
              right: 1,
              top: 1,
              bottom: 1,
              width: 64,
              borderRadius: '0 15px 15px 0',
              pointerEvents: 'none',
              zIndex: 3,
              background: 'linear-gradient(90deg,var(--p-fade,rgba(20,55,55,0)),var(--p-bg,#0D2423))',
            }}
          />
        </div>
      </div>
    </section>
  );
}
