import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import type { User } from '@supabase/supabase-js';
import Ciclo from '@/components/sections/Ciclo';
import Conviccao from '@/components/sections/Conviccao';
// O Domínio removido da página institucional; componente e logos preservados
// (src/components/sections/Dominio.tsx e src/assets/logo-*.asset.json) para a
// futura página "Sobre nós > Domínios".
import Faq from '@/components/sections/Faq';
import PageLoader from '@/components/maiq/PageLoader';
import AuthLeadDialogs from '@/components/AuthLeadDialogs';
import PlatformShowcase from '@/components/maiq/PlatformShowcase';
import SiteFooter from '@/components/maiq/SiteFooter';
import SiteHeader from '@/components/maiq/SiteHeader';
import { useMaiqTheme } from '@/hooks/use-maiq-theme';
import { useSupabaseUser } from '@/hooks/use-supabase-user';
import logoBranco from '@/assets/logo-maiq-branco.png';
import logoMadeira from '@/assets/logo-maiq-madeira.png';

type Any = any;

const DNA_ROW_CFG = [
  { inset: 25, width: 206 },
  { inset: 31, width: 201 },
  { inset: 52, width: 188 },
];
// Dimensões do Venn desktop (raio = metade da altura). A geometria do hover (arco,
// máscara e centro das pontas) deriva daqui — manter em sincronia com o markup.
const VENN_W = 710;
const VENN_H = 308;
const VENN_R = VENN_H / 2;
const DNA_EASE = 'cubic-bezier(.33,0,.2,1)';
const DNA_DUR = 560;

function OdometerValue({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const digits = String(value).split('');
  return (
    <span className="maiq-odometer" data-maiq-odo="" aria-label={`${prefix}${value.toLocaleString('pt-BR')}${suffix ? ` ${suffix}` : ''}`}>
      {prefix ? <span className="maiq-odometer-prefix" aria-hidden="true">{prefix}</span> : null}
      <span className="maiq-odometer-digits" aria-hidden="true">
        {digits.map((digit, index) => {
          const target = Number(digit);
          const turns = digits.length - index + 1;
          const sequence = Array.from({ length: turns * 10 + target + 1 }, (_, step) => step % 10);
          return (
            <span
              className="maiq-odometer-digit"
              data-maiq-odo-digit=""
              data-maiq-odo-stop={String(sequence.length - 1)}
              key={`${digit}-${index}`}
            >
              <span className="maiq-odometer-strip">
                {sequence.map((number, step) => <span key={step}>{number}</span>)}
              </span>
            </span>
          );
        })}
      </span>
      {suffix ? <span className="maiq-odometer-suffix" aria-hidden="true">{suffix}</span> : null}
    </span>
  );
}

function buildHelix() {
  const N = 26, STEP = 0.52, A = 78;
  const lanes: React.ReactNode[] = [];
  const MASK = 'radial-gradient(ellipse 96px 74px at 50% 50%, transparent 0%, transparent 50%, #000 100%)';
  for (let i = 0; i < N; i++) {
    const d = -((N - 1 - i) * STEP);
    const rung = React.createElement('div', {
      'data-maiq-anim': '', style: {
        position: 'absolute', top: 'calc(50% - .75px)', left: 'calc(50% - ' + A + 'px)',
        height: '1.5px', width: (A * 2) + 'px', background: 'var(--p-helix,rgba(159,214,210,.6))',
        transformOrigin: '50% 50%', animation: 'maiqRung 4.5s cubic-bezier(.4,0,.6,1) infinite',
        animationDelay: d.toFixed(3) + 's', willChange: 'transform,opacity',
      },
    });
    const node = (off: number, key: string) => React.createElement('div', {
      key, 'data-maiq-anim': '', style: {
        position: 'absolute', top: 'calc(50% - 3px)', left: 'calc(50% - 3px)',
        width: '6px', height: '6px', borderRadius: '50%',
        background: 'var(--p-helix-hi,rgba(234,217,204,.92))',
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
  const { theme, dia, ready: themeReady, toggleTheme } = useMaiqTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const supabaseUser = useSupabaseUser();
  // AuthLeadDialogs atualiza o usuário de forma otimista (onUserChange) logo
  // após login/logout, antes que o listener do hook propague a mudança —
  // espelhar aqui evita um piscar da view "Conta" no dialog.
  const [user, setUser] = useState<User | null>(supabaseUser);
  useEffect(() => setUser(supabaseUser), [supabaseUser]);

  // Posição de rolagem que enquadra a seção, calculada com o layout do momento.
  const sectionScrollTarget = (id: string): number | null => {
    if (id === 'topo') return 0;
    const el = (document.querySelector('[data-maiq-sec="' + id + '"]') as HTMLElement | null)
      ?? (document.getElementById(id) as HTMLElement | null);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    let top = rect.top + window.scrollY;
    // Rolagem contínua: não há pilha nem holds (ficam ocultos). O título da seção para
    // a 108px do topo, logo abaixo do header flutuante.
    if (S._layoutMode !== 'stacked') {
      const heading = el.querySelector('h2') ?? el;
      return Math.max(0, Math.min(heading.getBoundingClientRect().top + window.scrollY - 108, document.documentElement.scrollHeight - window.innerHeight));
    }
    // Plataforma e FAQ são bases sticky de seus respectivos blocos. Seus
    // elementos ficam visualmente no topo em uma faixa inteira de scroll;
    // os holds marcam o ponto em que cada base deve ser mostrada por completo.
    if (id === 'plataforma' && platformHoldRef.current) {
      // Meio da pausa: a Plataforma inteira, com os dois blocos à mesma distância.
      top = platformHoldRef.current.getBoundingClientRect().top + window.scrollY + (S._platPause || 0) / 2;
    } else if (id === 'faq' && finalHoldRef.current) {
      top = finalHoldRef.current.getBoundingClientRect().top + window.scrollY;
    } else if (rect.height < window.innerHeight) {
      // Seções em fluxo normal (Nosso Modelo, Nossa Convicção) mais baixas
      // que a tela — comum em alturas curtas — ficam com um vão embaixo se
      // só alinharmos o topo, revelando a seção seguinte antes da hora.
      // Alinhar a base ao fundo da tela evita isso; o respiro sobra em cima,
      // mostrando um pouco da seção anterior, o que é natural num scroll.
      top = rect.bottom + window.scrollY - window.innerHeight;
    }
    // Cada seção já reserva internamente o espaço do cabeçalho. Alinhar a
    // borda da seção ao topo mantém todo o conteúdo dentro da viewport.
    return Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  };

  // Rola até a seção e confere o enquadramento quando a rolagem para. No meio do caminho
  // o destino pode mudar ou a rolagem ser desfeita: o roteador volta ao topo logo depois
  // de uma troca de página (vindo de Insights, chegava a desfazer a navegação), as fontes
  // terminam de carregar, o enquadramento proporcional se refaz. Até 3 correções; qualquer
  // rolagem do próprio usuário (roda, toque, teclado) cancela a conferência.
  const goToSection = (id: string) => {
    S._navCancel?.();
    const first = sectionScrollTarget(id);
    if (first === null) return;
    const startY = Math.round(window.scrollY);
    window.scrollTo({ top: first, behavior: 'smooth' });
    // `moved`: a rolagem suave pode demorar a começar com a página ocupada; parado na
    // origem só conta como "chegou" depois de 1,5s.
    let corrections = 0, lastY = -1, stableTicks = 0, ticks = 0, moved = false;
    const cancel = () => {
      window.clearInterval(timer);
      ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.removeEventListener(t, cancel));
      if (S._navCancel === cancel) S._navCancel = null;
    };
    const timer = window.setInterval(() => {
      ticks += 1;
      const y = Math.round(window.scrollY);
      stableTicks = y === lastY ? stableTicks + 1 : 0;
      lastY = y;
      if (ticks > 60) { cancel(); return; } // ~6s: desiste
      if (y !== startY) moved = true;
      if (stableTicks < 2 || (!moved && ticks < 15)) return; // ainda rolando (ou por começar)
      const target = sectionScrollTarget(id);
      if (target === null || Math.abs(target - y) <= 2 || corrections >= 3) { cancel(); return; }
      corrections += 1;
      stableTicks = 0;
      window.scrollTo({ top: target, behavior: 'smooth' });
    }, 100);
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.addEventListener(t, cancel, { passive: true }));
    S._navCancel = cancel;
  };

  // Volta de outra página (ex.: Insights) com destino a uma seção da home
  const navState = useRouterState({ select: (s) => s.location.state as { secao?: string } | null });
  useEffect(() => {
    if (!navState?.secao) return;
    const timer = setTimeout(() => goToSection(navState.secao as string), 650);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  const scopeRef = useRef<Any>(null);
  const headerSlotRef = useRef<Any>(null);
  const headerLogoRef = useRef<Any>(null);
  const flyLogoRef = useRef<Any>(null);
  const heroLogoSlotRef = useRef<Any>(null);
  const netWrapRef = useRef<Any>(null);
  const iconSunRef = useRef<Any>(null);
  const iconMoonRef = useRef<Any>(null);
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
    scopeRef,
    dnaRowRef, vennBoxRef, scoreRowRef, chatRowRef, lRow1Ref, lRow3Ref,
    rRow1Ref, rRow2Ref, lColRef, rColRef, lClipRef, rClipRef, lTextRef, rTextRef,
    scoreTextRef, chatTextRef,
  };

  const setDnaDot = (el: Any, active: boolean, delay: number) => {
    const dot = el.querySelector('[data-maiq-dot]');
    if (!dot) return;
    // Mesma linguagem luminosa dos divisórios da barra da Plataforma.
    // O ponto reage imediatamente; a linha mantém o movimento escalonado.
    dot.style.transition = `opacity 180ms ${DNA_EASE}, background-color 180ms ${DNA_EASE}, box-shadow 180ms ${DNA_EASE}`;
    dot.style.zIndex = '3';
    dot.style.transform = 'translateZ(0)';
    dot.style.opacity = active ? '1' : '0';
    dot.style.background = active ? 'var(--c-flow,#9FD6D2)' : 'var(--p-text,#EAD9CC)';
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
      el.style.borderTopColor = 'var(--p-hair-strong,rgba(234,217,204,.32))';
      setDnaDot(el, true, delay);
    } else {
      if (i === 0) {
        el.style[marginProp] = cfg.inset + 'px';
        el.style.width = cfg.width + 'px';
      }
      el.style.borderTopColor = 'var(--p-hair,rgba(234,217,204,.14))';
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
    setupMarquee();
    S._paintLogo = setupLogoFlight();
    setupScroll();
    setupOffscreenPause();
    setupOdometers();
    setupDna();

    // A medição inicial de _fitNet/_fitFinal roda com a fonte de fallback
    // (display:swap). Quando a Barlow termina de carregar, o texto muda de
    // altura e a margem/hold ficam desatualizados — re-executar uma vez
    // corrige a costura sem trocar o mecanismo de medição.
    let unmounted = false;
    document.fonts?.ready.then(() => {
      if (unmounted) return;
      S._fitZoom?.();
      S._fitNet?.();
      S._fitFinal?.();
    });

    return () => {
      unmounted = true;
      S._navCancel?.();
      if (S._odoIO) S._odoIO.disconnect();
      if (S._odos) S._odos.forEach((o: Any) => { if (o.raf) cancelAnimationFrame(o.raf); });
      if (S._checkOdos) {
        window.removeEventListener('scroll', S._checkOdos);
        window.removeEventListener('resize', S._checkOdos);
      }
      if (S._pauseIO) S._pauseIO.disconnect();
      if (S._raf) cancelAnimationFrame(S._raf);
      if (S._remeasure) window.removeEventListener('resize', S._remeasure);
      if (S._measureDna) window.removeEventListener('resize', S._measureDna);
      if (S._onScroll) { window.removeEventListener('scroll', S._onScroll); window.removeEventListener('resize', S._onScroll); }
      if (S._logoMode) window.removeEventListener('resize', S._logoMode);
      if (S._setUf) window.removeEventListener('resize', S._setUf);
      if (S._logoLoad) window.removeEventListener('load', S._logoLoad);
      if (S._refit) {
        window.removeEventListener('resize', S._refit);
        window.removeEventListener('orientationchange', S._refit);
      }
      if (S._clearRefit) S._clearRefit();

      if (S._faqGuard) { window.removeEventListener('scroll', S._faqGuard); window.removeEventListener('resize', S._faqGuard); }

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

  // Odômetro: cada casa decimal acompanha a posição da seção na tela.
  function setupOdometers() {
    const scope = scopeRef.current;
    if (!scope) return;
    const section = scope.querySelector('[data-maiq-sec="modelo"]') as HTMLElement | null;
    const row = scope.querySelector('[data-maiq-odo-row]') as HTMLElement | null;
    const digits = Array.from(scope.querySelectorAll('[data-maiq-odo-digit]')) as HTMLElement[];
    if (!section || !row || !digits.length) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Faixa da contagem, em fração da altura da tela, medida pelo topo da própria linha de
    // números (01/10/2026): começa quando ela entra pela base e termina quando chega a `end`.
    // Antes a referência era o topo da seção, e a contagem quase toda acontecia com os números
    // ainda fora da tela (no celular, inteira).
    const ODO_RANGE = { desktop: { start: 1, end: 0.85 }, mobile: { start: 1, end: 0.7 } } as const;
    const odoWide = window.matchMedia('(min-width:761px)');
    let queued = false;
    const paintOdos = () => {
      queued = false;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = row.getBoundingClientRect();
      const range = odoWide.matches ? ODO_RANGE.desktop : ODO_RANGE.mobile;
      // Reversível: o mesmo cálculo em sentido contrário desfaz a contagem.
      const raw = Math.min(1, Math.max(0, (range.start * viewportHeight - rect.top) / ((range.start - range.end) * viewportHeight)));
      const progress = reduceMotion ? (raw > 0 ? 1 : 0) : raw * raw * (3 - 2 * raw);
      digits.forEach((digit) => {
        const stop = Number(digit.dataset['maiqOdoStop'] || 0);
        digit.style.setProperty('--maiq-odo-step', String(stop * progress));
      });
    };
    const requestPaint = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paintOdos);
    };
    S._checkOdos = requestPaint;
    window.addEventListener('scroll', requestPaint, { passive: true });
    window.addEventListener('resize', requestPaint);
    requestAnimationFrame(paintOdos);
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
      // Posição/escala terminam de convergir cedo (t=1 já em pf=0.7, curva
      // suavizada) para chegar exatamente sobre `mark` ANTES do crossfade de
      // opacidade começar. Antes, `e` usava o mesmo pf do crossfade: durante
      // a troca de opacidade (pf 0.9-1 originalmente) a logo voadora ainda
      // estava a caminho (ex.: 94% do trajeto em pf=0.85), então por um
      // instante duas cópias parcialmente opacas apareciam sobrepostas com um
      // deslocamento de ~15-20px — visto como logo "duplicada". Com a posição
      // já resolvida antes do crossfade, as duas coincidem exatamente e a
      // transição vira um dissolve limpo, sem deslocamento visível.
      const posT = Math.min(1, pf / 0.7);
      const e = posT * posT * (3 - 2 * posT);
      const s = 1 + (b.height / a.height - 1) * e;
      const x = a.left + (b.left - a.left) * e, y = a.top + (b.top - a.top) * e;
      fly.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';
      fly.style.opacity = (pf < 0.85 ? 1 : Math.max(0, (1 - pf) / 0.15)).toFixed(3);
      slot.style.width = (b.width * e).toFixed(2) + 'px';
      slot.style.marginRight = (28 * e).toFixed(2) + 'px';
      mark.style.opacity = (pf < 0.85 ? 0 : (pf - 0.85) / 0.15).toFixed(3);
    };
    paintLogo(0);
    S._logoLoad = () => { S._logoMode(); paintLogo(0); };
    window.addEventListener('load', S._logoLoad);
    return paintLogo;
  }

  // o hero fica preso no topo; o conteúdo recua e desvanece.
  // Rolagem contínua (modo "flat"): a pilha de sobreposições é desarmada (ver maiq.css).
  // Vale no celular/tablet deitado — em ~300px de altura as margens negativas medidas
  // quebram a ordem das seções — e em janelas baixas demais para o enquadramento
  // proporcional (ver FIT_FLAT_MAX_H).
  function setupScroll() {
    const scope = scopeRef.current as HTMLElement | null;
    const flatQuery = window.matchMedia('(orientation:landscape) and (max-height:520px) and (pointer:coarse)');
    const usesFlatFlow = () => S._layoutMode !== 'stacked';

    // Enquadramento proporcional (desktop e tablet, ≥761px): cada seção é desenhada em 1440×900
    // e reduzida por igual em CSS (`--u`/`--uf`; ver docs/diretriz-enquadramento-home.md). Em
    // janelas com menos de FIT_FLAT_MAX_H de altura a Home passa para a rolagem contínua (modo
    // "flat", o mesmo do celular deitado).
    // Abaixo desta altura (desktop/tablet), rolagem contínua. Por ser só da janela, não oscila.
    const FIT_FLAT_MAX_H = 560;
    const fitQuery = window.matchMedia('(min-width:761px)');
    // Fator do quadro proporcional (--uf, sem unidade): o mesmo `--u` do CSS como número, para
    // propriedades que só aceitam número (zoom). Vem só do tamanho da janela — nenhuma medição
    // de conteúdo — e é atualizado a cada resize, sem atraso.
    S._setUf = () => {
      const uf = Math.min(window.innerHeight / 900, window.innerWidth / 1440, 1);
      scope?.style.setProperty('--uf', uf.toFixed(4));
    };
    S._setUf();
    window.addEventListener('resize', S._setUf);
    S._fitZoom = () => {
      // Venn por largura: escala contínua (antes, degraus em 930/750/620px), cheia a partir de ~1180px.
      // Na pilha (≥761px) o tamanho vem do quadro proporcional de "Nosso Modelo" (maiq.css).
      const venn = vennBoxRef.current;
      if (venn) {
        const s = Math.min(1, Math.max(0.46, 0.000889 * window.innerWidth - 0.0467));
        venn.style.zoom = fitQuery.matches && S._layoutMode !== 'stacked' && s < 1 ? s.toFixed(4) : '';
      }
      if (!fitQuery.matches) return;
      S._measureDna?.();
    };
    // Rolagem contínua por altura da janela (diretriz, D4/R7), não por medição: antes, uma seção
    // ainda no _fitZoom que precisasse de menos de 70% derrubava a Home inteira para o modo
    // contínuo — e as seções já em quadro proporcional voltavam ao tamanho cheio antigo
    // (ex.: 1192×642, por causa de "Nossa Plataforma" a 69%).
    const desiredMode = (): 'flat' | 'stacked' => {
      if (flatQuery.matches) return 'flat';
      return fitQuery.matches && window.innerHeight < FIT_FLAT_MAX_H ? 'flat' : 'stacked';
    };
    // Primeira medição na pilha; depois decide o modo inicial.
    S._layoutMode = 'stacked';
    if (scope) scope.dataset['maiqLayout'] = 'stacked';
    S._fitZoom();
    S._layoutMode = desiredMode();
    if (scope) scope.dataset['maiqLayout'] = S._layoutMode;
    if (S._layoutMode !== 'stacked') S._fitZoom();

    const hero = heroRef.current;
    if (hero) {
      S._fitHero = () => {
        if (usesFlatFlow()) { hero.style.top = ''; return; }
        hero.style.top = Math.min(0, window.innerHeight - hero.offsetHeight) + 'px';
      };
      S._fitHero();
    }

    // A Plataforma fica parada ao fundo enquanto os blocos anterior e seguinte
    // passam por cima. A margem negativa sobrepõe a primeira seção sem reservar
    // duas vezes a altura da camada fixa.
    // Folgas da pilha (01/10/2026), em fração da altura da tela: respiro antes de o bloco 1
    // aparecer sobre o Hero; margens internas dos cartões (acima e abaixo das seções, que
    // continuam enquadradas nos mesmos pontos); e a pausa da Plataforma — o espaço de rolagem
    // reservado a ela entre os dois blocos (1 = só o tempo de revelá-la). No celular (<761px)
    // valores próprios, com um espaço também entre Modelo e Convicção (`block1Between`), dentro do
    // mesmo fundo do bloco. `faqHold` é a pausa do FAQ antes do rodapé, que no celular é um bloco
    // de sobreposição próprio (no desktop o rodapé faz parte da tela do FAQ: 1 = sem pausa).
    // Ver docs/diretriz-enquadramento-home.md, ficha "Pilha de rolagem".
    const STACK_GAPS = {
      desktop: { heroBreath: 0.05, block1: [0.05, 0.15], block1Between: 0, platformHold: 1.3, block2: [0.1, 0.15], faqHold: 1 },
      mobile: { heroBreath: 0.05, block1: [0.15, 0.25], block1Between: 0.15, platformHold: 1.25, block2: [0.15, 0.15], faqHold: 1.25 },
    } as const;
    const stackGaps = () => (fitQuery.matches ? STACK_GAPS.desktop : STACK_GAPS.mobile);
    const stack = (scope?.querySelector('.maiq-scroll-stack') as HTMLElement | null) ?? null;
    const convictionSec = (scope?.querySelector('[data-maiq-sec="fundacao"]') as HTMLElement | null) ?? null;
    const net = netWrapRef.current;
    if (net) {
      S._fitNet = () => {
        const primary = overlayRef.current;
        const hold = platformHoldRef.current;
        if (usesFlatFlow()) {
          net.style.top = '';
          if (stack) stack.style.marginTop = '';
          if (convictionSec) convictionSec.style.marginTop = '';
          if (primary) { primary.style.marginTop = ''; primary.style.paddingTop = ''; primary.style.paddingBottom = ''; }
          if (hold) hold.style.height = '';
          const flatPlatInner = net.querySelector('.maiq-platform-section-inner') as HTMLElement | null;
          if (flatPlatInner) flatPlatInner.style.zoom = '';
          S._platPause = 0;
          return;
        }
        const ih = window.innerHeight;
        const g = stackGaps();
        // Celular (<761px): em telas baixas o conteúdo da Plataforma passa da altura da tela e a
        // base fixa corta o fim do cartão (ex.: 390×664). Só nesse caso ele reduz por igual até
        // caber entre os paddings da seção; quando cabe, nada muda. No ≥761px quem reduz é o
        // quadro proporcional (zoom: var(--uf) no CSS), por isso o inline é limpo ali.
        const platInner = net.querySelector('.maiq-platform-section-inner') as HTMLElement | null;
        if (platInner) {
          platInner.style.zoom = '';
          const platSec = platInner.parentElement;
          if (!fitQuery.matches && platSec) {
            const ps = getComputedStyle(platSec);
            const avail = ih - parseFloat(ps.paddingTop) - parseFloat(ps.paddingBottom);
            const natural = platInner.getBoundingClientRect().height;
            if (natural > avail + 1) platInner.style.zoom = (avail / natural).toFixed(4);
          }
        }
        // Anchor from the top: bottom alignment hid the heading beneath the
        // floating navigation whenever this section exceeded the viewport.
        net.style.top = '0px';
        const netHeight = Math.ceil(net.getBoundingClientRect().height);
        // A camada sobreposta começa um raio antes da linha reta da base.
        // Assim, a base não aparece pelas áreas externas das quinas superiores.
        const cornerOverlap = 24;
        if (primary) {
          primary.style.marginTop = `${-(netHeight + cornerOverlap)}px`;
          primary.style.paddingTop = `${Math.round(g.block1[0] * ih)}px`;
          primary.style.paddingBottom = `${Math.round(g.block1[1] * ih)}px`;
        }
        // Espaço entre as seções do bloco 1: margem na Convicção, dentro do fundo em degradê comum
        // (.maiq-model-pilares-bg), que segue contínuo.
        if (convictionSec) convictionSec.style.marginTop = g.block1Between ? `${Math.round(g.block1Between * ih)}px` : '';
        // O bloco 1 começa 24px acima da pilha (cornerOverlap): a margem da pilha o empurra
        // para heroBreath abaixo do fim do Hero, que segue parado (sticky) por trás.
        if (stack) stack.style.marginTop = `${Math.round(g.heroBreath * ih) + cornerOverlap}px`;
        // Pausa: além do tempo de revelar a base, (platformHold - 1) de tela com ela inteira.
        const pause = Math.round(Math.max(0, g.platformHold - 1) * ih);
        S._platPause = pause;
        if (hold) hold.style.height = `${netHeight + cornerOverlap + pause}px`;
      };
      S._fitNet();
    }



    // FAQ + rodapé formam a camada final parada. O bloco Ciclo + Domínios
    // ocupa a mesma posição visual e, ao sair, revela essa camada.
    const final = finalWrapRef.current;
    if (final) {
      S._fitFinal = () => {
        const middle = overlay2Ref.current;
        const hold = finalHoldRef.current;
        if (usesFlatFlow()) {
          final.style.top = '';
          if (middle) { middle.style.marginTop = ''; middle.style.paddingTop = ''; middle.style.paddingBottom = ''; }
          if (hold) hold.style.height = '';
          return;
        }
        // FAQ follows the same top-anchored reveal rule as Plataforma.
        final.style.top = '0px';
        const finalHeight = Math.ceil(final.getBoundingClientRect().height);
        // Repete a mesma linha de corte usada na primeira sobreposição.
        const cornerOverlap = 24;
        if (middle) {
          const ih = window.innerHeight;
          const g = stackGaps();
          middle.style.marginTop = `${-(finalHeight + cornerOverlap)}px`;
          middle.style.paddingTop = `${Math.round(g.block2[0] * ih)}px`;
          middle.style.paddingBottom = `${Math.round(g.block2[1] * ih)}px`;
        }
        const faqPause = Math.round(Math.max(0, stackGaps().faqHold - 1) * window.innerHeight);
        if (hold) hold.style.height = `${finalHeight + cornerOverlap + faqPause}px`;
      };
      S._fitFinal();
    }

    // Estabilizador de giro: o celular dispara dezenas de "resize" durante a
    // animação de rotação (e enquanto a barra de endereços se ajusta). Medir no
    // meio disso grava margens erradas, que pioram a cada novo giro. Aqui todas
    // as medições acontecem uma única vez, depois que as dimensões assentam.
    // Ao trocar de modo (deitado <-> em pé) a posição de rolagem do modo
    // anterior não vale mais: guardamos a seção visível e voltamos a ela.
    let refitTimers: number[] = [];
    let anchorId: string | null = null;
    const captureAnchor = () => {
      const secs = Array.from(document.querySelectorAll('[data-maiq-sec]'));
      const line = window.innerHeight * 0.3;
      const containing = secs.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      const nearest = containing ?? secs.reduce<Element | null>((best, section) => {
        if (!best) return section;
        return Math.abs(section.getBoundingClientRect().top - line) < Math.abs(best.getBoundingClientRect().top - line)
          ? section
          : best;
      }, null);
      return nearest?.getAttribute('data-maiq-sec') ?? null;
    };
    const restoreAnchor = () => {
      if (!anchorId) return;
      const target = document.querySelector(`[data-maiq-sec="${anchorId}"]`);
      if (!target) return;
      let ref: Element = target;
      if (S._layoutMode === 'stacked' && anchorId === 'plataforma' && platformHoldRef.current) ref = platformHoldRef.current;
      if (S._layoutMode === 'stacked' && anchorId === 'faq' && finalHoldRef.current) ref = finalHoldRef.current;
      let y = ref.getBoundingClientRect().top + window.scrollY;
      if (ref === platformHoldRef.current) y += (S._platPause || 0) / 2;
      window.scrollTo({ top: Math.max(0, S._layoutMode === 'flat' ? y - 60 : y), behavior: 'auto' });
    };
    const runFit = (restore = false) => {
      S._fitZoom?.();
      S._fitHero?.();
      S._fitNet?.();
      S._fitFinal?.();
      S._faqGuard?.();
      if (restore) restoreAnchor();
      S._heroCovered = undefined;
      S._onScroll?.();
    };
    S._refit = () => {
      refitTimers.forEach((t) => window.clearTimeout(t));
      // Fora de uma troca de orientação, resize só estabiliza as medidas do
      // modo atual (inclui abrir/fechar a barra de endereço do navegador).
      refitTimers = [240, 600].map((ms, i, arr) =>
        window.setTimeout(() => {
          runFit();
          if (i === arr.length - 1) {
            refitTimers = [];
            // Janela baixa demais (ou de volta a uma altura confortável): troca de modo.
            // Também conclui uma troca interrompida — um resize no meio dela cancelava os
            // timers de _changeLayout e a página ficava presa em "settling" (rolagem
            // contínua) mesmo depois de a janela voltar a crescer.
            if (desiredMode() !== S._layoutMode) S._changeLayout();
          }
        }, ms),
      );
    };
    S._changeLayout = () => {
      const nextMode = desiredMode();
      if (nextMode === S._layoutMode) return;
      anchorId = captureAnchor();
      refitTimers.forEach((timer) => window.clearTimeout(timer));

      // Ao voltar para retrato, mantemos temporariamente o fluxo linear. Assim
      // nenhuma camada sticky é remontada durante a animação de rotação.
      S._layoutMode = nextMode === 'stacked' ? 'settling' : 'flat';
      if (scope) scope.dataset['maiqLayout'] = S._layoutMode;
      runFit();

      refitTimers = [420, 800, 1200].map((ms, index, times) =>
        window.setTimeout(() => {
          if (index === 0) {
            S._layoutMode = nextMode;
            if (scope) scope.dataset['maiqLayout'] = nextMode;
            // Elimina qualquer geometria gravada no modo anterior antes de
            // medir a pilha vertical a partir do layout natural.
            if (hero) hero.style.top = '';
            if (net) net.style.top = '';
            if (stack) stack.style.marginTop = '';
            if (convictionSec) convictionSec.style.marginTop = '';
            [overlayRef.current, overlay2Ref.current].forEach((o) => {
              if (o) { o.style.marginTop = ''; o.style.paddingTop = ''; o.style.paddingBottom = ''; }
            });
            if (platformHoldRef.current) platformHoldRef.current.style.height = '';
            if (final) final.style.top = '';
            if (finalHoldRef.current) finalHoldRef.current.style.height = '';
            void document.body.offsetHeight;
          }
          runFit(index === 0);
          if (index === times.length - 1) {
            refitTimers = [];
            anchorId = null;
          }
        }, ms),
      );
    };
    window.addEventListener('resize', S._refit);
    window.addEventListener('orientationchange', S._refit);
    window.visualViewport?.addEventListener('resize', S._refit);
    flatQuery.addEventListener('change', S._changeLayout);
    S._clearRefit = () => {
      refitTimers.forEach((t) => window.clearTimeout(t));
      window.visualViewport?.removeEventListener('resize', S._refit);
      flatQuery.removeEventListener('change', S._changeLayout);
      if (scope) delete scope.dataset['maiqLayout'];
    };


    // A lista do FAQ é rolável e fica sob "Nossa Perspectiva" na pilha. O
    // Chromium chega a entregar o wheel a esse contêiner coberto, e a página
    // "trava" até a lista chegar ao fim. Enquanto coberta, ela fica inerte.
    const faqList = (final as HTMLElement | null)?.querySelector<HTMLElement>('.maiq-faq-list');
    const middleLayer = overlay2Ref.current;
    if (faqList && middleLayer) {
      let guardQueued = false;
      const guard = () => {
        guardQueued = false;
        const covered = middleLayer.getBoundingClientRect().bottom > faqList.getBoundingClientRect().top + 1;
        if (covered !== S._faqCovered) {
          S._faqCovered = covered;
          faqList.style.pointerEvents = covered ? 'none' : '';
        }
      };
      S._faqGuard = () => {
        if (guardQueued) return;
        guardQueued = true;
        requestAnimationFrame(guard);
      };
      guard();
      window.addEventListener('scroll', S._faqGuard, { passive: true });
      window.addEventListener('resize', S._faqGuard);
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
      // As medidas de tela (getBoundingClientRect) incluem o zoom da seção (fz) e o do Venn;
      // o que é gravado em estilo nas colunas precisa estar em px locais da seção (÷ fz).
      const inner = venn.closest('.maiq-model-inner') as HTMLElement | null;
      const fz = (inner && parseFloat(getComputedStyle(inner).zoom)) || 1;
      const scale = vr.width / VENN_W;
      const vennScale = scale / fz;
      const arcAt = (y: number) => { const dy = y - VENN_R; return VENN_R - Math.sqrt(Math.max(0, VENN_R * VENN_R - dy * dy)); };
      const geom: Any = {};
      const side = (name: string, col: Any, clip: Any, textEl: Any, spanEl: Any, rowEls: Any[], capX: number) => {
        if (!col || !clip || !spanEl) return;
        const cr = col.getBoundingClientRect();
        if (!cr.width) return;
        const cx = ((vr.left - cr.left) + capX * scale) / fz;
        const cy = ((vr.top - cr.top) + VENN_R * scale) / fz;
        const mask = `radial-gradient(circle ${VENN_R * vennScale}px at ${cx}px ${cy}px, rgba(0,0,0,0) 99.6%, #000 100%)`;
        col.style.webkitMaskImage = mask;
        col.style.maskImage = mask;
        const base = Math.round((spanEl.getBoundingClientRect().top - vr.top) / fz);
        clip.style.marginTop = base + 'px';
        const pEl = textEl && textEl.querySelector('p');
        if (pEl && pEl.firstChild && pEl.firstChild.length) {
          const rg = document.createRange();
          rg.setStart(pEl.firstChild, 0);
          rg.setEnd(pEl.firstChild, Math.min(8, pEl.firstChild.length));
          const delta = rg.getBoundingClientRect().top - spanEl.getBoundingClientRect().top;
          if (delta) clip.style.marginTop = Math.round(base - delta / fz) + 'px';
        }
        const g = {
          tuck: Math.ceil(cr.width / fz),
          rail: Math.round((name === 'left' ? (vr.left - cr.left) : (cr.right - vr.right)) / scale),
          arc: rowEls.map((el) => el ? Math.round(arcAt((el.getBoundingClientRect().top - vr.top) / scale)) : 0),
        };
        geom[name] = g;
        if (S._dnaSide !== name && textEl) textEl.style.transform = `translateX(${(g.rail + DNA_ROW_CFG[0]!.inset) * (name === 'left' ? 1 : -1)}px)`;
      };
      side('left', lColRef.current, lClipRef.current, lTextRef.current, scoreTextRef.current,
        [scoreRowRef.current, lRow1Ref.current, lRow3Ref.current], VENN_R);
      side('right', rColRef.current, rClipRef.current, rTextRef.current, chatTextRef.current,
        [chatRowRef.current, rRow1Ref.current, rRow2Ref.current], VENN_W - VENN_R);
      S._dnaGeom = geom;
    };
    S._measureDna();
    window.addEventListener('resize', S._measureDna);
  }

  void refs; void iconSunRef; void iconMoonRef; void lRailRef; void rRailRef; void overlay2WrapRef; void overlay3Ref; void netContentRef;

  return (
    <div data-maiq-scope="" data-theme={dia ? 'claro' : undefined} data-theme-ready={themeReady ? '' : undefined} ref={scopeRef} style={{ fontFamily: "'Barlow',Helvetica,Arial,sans-serif", background: "var(--p-bg,#0F2B2A)", color: "var(--p-text,#EAD9CC)", minHeight: "100vh", transition: "background 320ms cubic-bezier(.16,1,.3,1),color 320ms cubic-bezier(.16,1,.3,1)" }}>
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
      <SiteHeader
        dia={dia}
        onToggleTheme={toggleTheme}
        user={user}
        onEntrarClick={() => setAuthOpen(true)}
        onFaleConoscoClick={() => setLeadOpen(true)}
        onSelectSection={goToSection}
        logoSlot={
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
                <img src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "22px", width: "auto", display: "block", objectFit: "contain", opacity: dia ? 1 : 0, transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
              </Link>
            </div>
          </div>
        }
      />
      <div ref={flyLogoRef} aria-hidden="true" className="maiq-fly-logo" style={{ position: "fixed", left: "0", top: "0", transformOrigin: "0 0", zIndex: "51", pointerEvents: "none", display: "flex", willChange: "transform,opacity" }}>
        <img src={logoBranco} alt="" style={{ height: "clamp(22px,3.4vw,44px)", width: "auto", display: "block" }} />
        <img src={logoMadeira} alt="" style={{ position: "absolute", left: "0", top: "0", height: "clamp(22px,3.4vw,44px)", width: "auto", display: "block", opacity: dia ? 1 : 0, transition: "opacity 320ms cubic-bezier(.16,1,.3,1)" }} />
      </div>
      <div ref={heroLogoSlotRef} aria-hidden="true" className="maiq-hero-logo-slot" style={{ position: "fixed", left: "48px", top: "52px", transform: "translateY(-50%)", height: "clamp(22px,3.4vw,44px)", zIndex: "51", pointerEvents: "none", opacity: "0" }}>
        <img src={logoBranco} alt="" style={{ height: "clamp(22px,3.4vw,44px)", width: "auto", display: "block" }} />
      </div>
      <section ref={heroRef} className="maiq-hero" style={{ background: "var(--p-hero-bg,#143937)", padding: "clamp(140px,12.5vh,160px) 48px clamp(44px,6.5vh,84px)", boxSizing: "border-box", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", position: "sticky", top: "0", zIndex: "0", overflow: "hidden", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", overflow: "hidden", isolation: "isolate" }}>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathA 45s linear infinite", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExA 45s linear infinite" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyA 45s linear infinite" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyA 45s linear infinite", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleA 45s linear infinite", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "36vw", height: "36vw", margin: "-18vw 0 0 -18vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(159,214,210,.30)) 0%,var(--p-halo,rgba(159,214,210,.30)) 40%,var(--p-halo-2,rgba(159,214,210,.14)) 66%,var(--p-halo-0,rgba(159,214,210,0)) 88%)", animation: "maiqHaloA 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "26.25vw", height: "26.25vw", margin: "-13.125vw 0 0 -13.125vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(159,214,210,0)) 0%,var(--p-shade-0,rgba(159,214,210,0)) 30%,var(--p-shade,rgba(159,214,210,0)) 62%,var(--p-shade-0,rgba(159,214,210,0)) 92%)", animation: "maiqCoreA 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "15vw", height: "15vw", margin: "-7.5vw 0 0 -7.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(159,214,210,.54)) 0%,var(--p-orb-2,rgba(159,214,210,.20)) 44%,var(--p-orb-0,rgba(159,214,210,0)) 78%)", animation: "maiqCoreA 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "25vw", height: "25vw", margin: "-12.5vw 0 0 -12.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(22px)", background: "radial-gradient(closest-side,var(--p-flash,rgba(223,244,243,.95)) 0%,var(--p-flash-2,rgba(223,244,243,.34)) 38%,var(--p-orb-0,rgba(159,214,210,0)) 70%)", animation: "maiqFlash 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
            </div>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathB 45s linear infinite", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExB 45s linear infinite" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyB 45s linear infinite" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyB 45s linear infinite", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleB 45s linear infinite", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "34vw", height: "34vw", margin: "-17vw 0 0 -17vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(159,214,210,.30)) 0%,var(--p-halo,rgba(159,214,210,.30)) 40%,var(--p-halo-2,rgba(159,214,210,.14)) 66%,var(--p-halo-0,rgba(159,214,210,0)) 88%)", animation: "maiqHaloB 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "24.5vw", height: "24.5vw", margin: "-12.25vw 0 0 -12.25vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(159,214,210,0)) 0%,var(--p-shade-0,rgba(159,214,210,0)) 30%,var(--p-shade,rgba(159,214,210,0)) 62%,var(--p-shade-0,rgba(159,214,210,0)) 92%)", animation: "maiqCoreB 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "14vw", height: "14vw", margin: "-7vw 0 0 -7vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(159,214,210,.54)) 0%,var(--p-orb-2,rgba(159,214,210,.20)) 44%,var(--p-orb-0,rgba(159,214,210,0)) 78%)", animation: "maiqCoreB 45s linear infinite", willChange: "opacity" } as unknown as React.CSSProperties}>
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
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "32vw", height: "32vw", margin: "-16vw 0 0 -16vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(159,214,210,.30)) 0%,var(--p-halo,rgba(159,214,210,.30)) 40%,var(--p-halo-2,rgba(159,214,210,.14)) 66%,var(--p-halo-0,rgba(159,214,210,0)) 88%)", animation: "maiqHaloA 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "22.75vw", height: "22.75vw", margin: "-11.375vw 0 0 -11.375vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(159,214,210,0)) 0%,var(--p-shade-0,rgba(159,214,210,0)) 30%,var(--p-shade,rgba(159,214,210,0)) 62%,var(--p-shade-0,rgba(159,214,210,0)) 92%)", animation: "maiqCoreA 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "13vw", height: "13vw", margin: "-6.5vw 0 0 -6.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(159,214,210,.54)) 0%,var(--p-orb-2,rgba(159,214,210,.20)) 44%,var(--p-orb-0,rgba(159,214,210,0)) 78%)", animation: "maiqCoreA 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "25vw", height: "25vw", margin: "-12.5vw 0 0 -12.5vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(22px)", background: "radial-gradient(closest-side,var(--p-flash,rgba(223,244,243,.95)) 0%,var(--p-flash-2,rgba(223,244,243,.34)) 38%,var(--p-orb-0,rgba(159,214,210,0)) 70%)", animation: "maiqFlash 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
            </div>
          </div>
          <div data-maiq-anim="" style={{ position: "absolute", inset: "0", animation: "maiqPathB 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
            <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqExB 45s linear infinite", animationDelay: "-22.5s" }}>
              <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqEyB 45s linear infinite", animationDelay: "-22.5s" }}>
                <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqBodyB 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", animation: "maiqHaloScaleB 45s linear infinite", animationDelay: "-22.5s", willChange: "transform" }}>
                    <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "30vw", height: "30vw", margin: "-15vw 0 0 -15vw", opacity: "0", mixBlendMode: "var(--p-halo-blend,plus-lighter)", filter: "blur(18px)", background: "radial-gradient(closest-side,var(--p-halo,rgba(159,214,210,.30)) 0%,var(--p-halo,rgba(159,214,210,.30)) 40%,var(--p-halo-2,rgba(159,214,210,.14)) 66%,var(--p-halo-0,rgba(159,214,210,0)) 88%)", animation: "maiqHaloB 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                    </div>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "21vw", height: "21vw", margin: "-10.5vw 0 0 -10.5vw", opacity: "0", mixBlendMode: "var(--p-shade-blend,normal)", filter: "blur(26px)", background: "radial-gradient(closest-side,var(--p-shade-0,rgba(159,214,210,0)) 0%,var(--p-shade-0,rgba(159,214,210,0)) 30%,var(--p-shade,rgba(159,214,210,0)) 62%,var(--p-shade-0,rgba(159,214,210,0)) 92%)", animation: "maiqCoreB 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                  <div data-maiq-anim="" style={{ position: "absolute", left: "0", top: "0", width: "12vw", height: "12vw", margin: "-6vw 0 0 -6vw", opacity: "0", mixBlendMode: "var(--p-core-blend,plus-lighter)", filter: "blur(6px)", background: "radial-gradient(closest-side,var(--p-orb,rgba(159,214,210,.54)) 0%,var(--p-orb-2,rgba(159,214,210,.20)) 44%,var(--p-orb-0,rgba(159,214,210,0)) 78%)", animation: "maiqCoreB 45s linear infinite", animationDelay: "-22.5s", willChange: "opacity" } as unknown as React.CSSProperties}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", inset: "0", background: "radial-gradient(120% 110% at 62% 34%, var(--p-fade,rgba(5,18,17,0)) 44%, var(--p-vignette,rgba(5,18,17,.42)) 100%)" }}>
        </div>
        <div ref={heroContentRef} className="maiq-hero-content" style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "clamp(30px,5vh,72px)", willChange: "transform,opacity" }}>
          <h1 style={{ fontFamily: "Inter, var(--font-core)", fontSize: "clamp(40px, 4.6vw, 68px)", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "600", margin: "0", maxWidth: "30ch", color: "var(--p-h1,#EAD9CC)", textWrap: "balance" }}>
            O hub de Fusões e Aquisições para Médias Empresas
          </h1>
          <div className="maiq-hero-subwrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(30px,5vh,72px)", width: "100%" }}>
            <div className="maiq-hero-divider" style={{ width: "clamp(120px,18vw,260px)", height: "1px", background: "linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(234,217,204,.14)) 18%,var(--p-hair,rgba(234,217,204,.14)) 82%,transparent 100%)" }}>
            </div>
            <p className="maiq-hero-subhead" style={{ color: "var(--p-text-2,#AFE3E0)", margin: "0", maxWidth: "min(1080px,94%)", textWrap: "balance" }}>
              <span className="maiq-hero-subhead-part">Combinamos método e tecnologia</span>{" "}
              <span className="maiq-hero-subhead-part">para sistematizar o processo de M&A</span>
            </p>
          </div>
        </div>
        <div className="maiq-hero-cta" style={{ position: "relative", margin: "clamp(30px,5vh,72px) auto 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(30px,5vh,72px)" }}>
          <div className="maiq-hero-rule" style={{ width: "68px", height: "1px", background: "linear-gradient(90deg,transparent 0%,var(--p-hair,rgba(234,217,204,.14)) 22%,var(--p-hair,rgba(234,217,204,.14)) 78%,transparent 100%)" }}>
          </div>
          <div className="maiq-hero-label" style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#9FD6D2)", textAlign: "center" }}>
            <span>Como ajudamos nossos</span> <span>clientes e parceiros</span>
          </div>
        </div>
        <div ref={marqueeRef} className="maiq-hero-marquee" style={{ position: "relative", margin: "clamp(16px,2.2vh,28px) auto 0", width: "80%", display: "flex", flexDirection: "column", gap: "10px", maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)" }}>
          <div style={{ overflow: "hidden" }}>
            <div ref={rowARef} style={{ display: "flex", gap: "10px", width: "max-content", willChange: "transform" }}>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Venda de empresa
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Aquisição de concorrente
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Captação de recursos
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Atração de investidores
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Coordenação de M&A
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Venda de empresa
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Aquisição de concorrente
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Captação de recursos
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Atração de investidores
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Coordenação de M&A
              </div>
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div ref={rowBRef} style={{ display: "flex", gap: "10px", width: "max-content", willChange: "transform" }}>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Avaliação de empresas — valuation
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Fairness Opinion
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Estruturação de dívida
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Joint ventures
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Consolidação de mercado
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Avaliação de empresas — valuation
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Fairness Opinion
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Estruturação de dívida
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
                Joint ventures
              </div>
              <div style={{ display: "flex", alignItems: "center", height: "36px", padding: "0 16px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "999px", background: "var(--p-chip-bg,rgba(234,217,204,.04))", fontSize: "15px", fontWeight: "500", color: "var(--p-chip-text,#D8D0C2)", whiteSpace: "nowrap" }}>
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
                <p className="maiq-section-subhead">
                  Funcionalidades específicas<span className="maiq-subhead-break maiq-subhead-break-platform" aria-hidden="true" />
                  a serviço do M&A
                </p>
              </div>
              <PlatformShowcase />
            </div>
          </section>
        </div>
      </div>
      <div ref={overlayRef} className="maiq-primary-overlay">
        <div className="maiq-model-pilares-bg" style={{ position: "relative", zIndex: "2", transition: "background 320ms cubic-bezier(.16,1,.3,1)" }}>
        <section data-maiq-sec="modelo" aria-label="Nosso Modelo" className="maiq-model-section" style={{ position: "relative", zIndex: "1", minHeight: "100vh", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "clamp(104px,13vh,150px) 48px clamp(36px,4.5vh,64px)" }}>
          <div className="maiq-model-inner" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,3vh,44px)" }}>
            <div style={{ textAlign: "center" }}>
              <h2 data-maiq-modelo-h2="" style={{ fontFamily: "Inter,var(--font-core)", fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1.04", letterSpacing: "-.022em", fontWeight: "600", margin: "0" }}>
                Nosso Modelo
              </h2>
              <p className="maiq-section-subhead" style={{ color: "var(--p-muted,#9FD6D2)", margin: "14px auto 0", textWrap: "pretty" }}>
                Convergência entre método e tecnologia,<span className="maiq-subhead-break maiq-subhead-break-model" aria-hidden="true" />
                potencializada por experiência e ampla rede construída.
              </p>
            </div>
            <div ref={dnaRowRef} className="maiq-model-dna-row" onMouseMove={handleDnaMove} onMouseLeave={handleDnaLeave} style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", padding: "0 clamp(24px,4vw,48px)", boxSizing: "border-box", display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "0" }}>
              <div data-maiq-side-text="" ref={lColRef} style={{ flex: "1 1 0", minWidth: "246px", maxWidth: "312px", marginRight: "-48px", position: "relative", display: "flex", justifyContent: "flex-end" }}>
                <div ref={lClipRef} style={{ maxWidth: "100%" }}>
                  <div ref={lTextRef} style={{ opacity: "0", transform: "translateX(312px)", transition: "opacity 260ms cubic-bezier(.4,0,1,1),transform 320ms cubic-bezier(.4,0,1,1)" }}>
                    <p style={{ margin: "0", paddingRight: "76px", fontSize: "15px", lineHeight: "1.6", color: "var(--p-text-2,#AFE3E0)", textAlign: "right", textWrap: "pretty" }}>
                      Conjugamos experiências em mercado de capitais, investimentos privados, bagagem em consultoria, auditoria e empreendedorismo.
                    </p>
                  </div>
                </div>
              </div>
              <div ref={vennBoxRef} data-maiq-venn="" style={{ position: "relative", width: "710px", height: "308px", flex: "0 0 auto" }}>
                {/* Lente = interseção das pontas arredondadas (círculos de 308px centrados em
                    x=303 e x=407; lente de 204px de largura, entre x=253 e x=457). A hélice
                    (240×360, compartilhada com o mobile) fica a 85% no centro da lente, mantendo a
                    proporção da configuração anterior (360px). */}
                <div aria-hidden="true" style={{ position: "absolute", left: "149px", top: "0", width: "308px", height: "308px", borderRadius: "50%", clipPath: "circle(50% at 50% 50%)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: "104px", top: "0", width: "308px", height: "308px", borderRadius: "50%", clipPath: "circle(50% at 50% 50%)", overflow: "hidden" }}>
                    <div className="maiq-venn-helix">
                      {helixBars}
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", width: "457px", height: "308px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "154px", background: "var(--p-chip-bg,rgba(234,217,204,.04))" }}>
                </div>
                <div aria-hidden="true" style={{ position: "absolute", left: "253px", top: "0", width: "457px", height: "308px", border: "1px solid var(--p-hair,rgba(234,217,204,.14))", borderRadius: "154px", background: "var(--p-chip-bg,rgba(234,217,204,.04))" }}>
                </div>
                <div style={{ position: "absolute", left: "355px", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center", fontSize: "14px", lineHeight: "1.34", fontWeight: "600", letterSpacing: ".01em", color: "var(--p-text,#EAD9CC)", whiteSpace: "nowrap" }}>
                  <div>
                    Sistematização
                  </div>
                  <div>
                    do M&A
                  </div>
                </div>
                <div style={{ position: "absolute", left: "0", top: "0", width: "253px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                  <div style={{ marginLeft: "30px", width: "210px", textAlign: "right" }}>
                    <div style={{ fontSize: "26px", lineHeight: "1.1", fontWeight: "600", letterSpacing: "-.012em" }}>
                      QUARPX
                      <sup style={{ fontSize: ".5em", fontWeight: "500", top: "-.7em", position: "relative" }}>
                        ®
                      </sup>
                    </div>
                    <div style={{ fontSize: "15.6px", fontWeight: "500", marginTop: "8px" }}>
                      Metodologia proprietária
                    </div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: "var(--p-muted,#9FD6D2)", marginTop: "2px" }}>
                      unknown unknowns
                    </div>
                  </div>
                  <div style={{ marginTop: "20px", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div ref={scoreRowRef} style={{ position: "relative", marginLeft: "25px", width: "206px", padding: "11px 0", borderTop: "1px solid var(--p-hair,rgba(234,217,204,.14))", fontSize: "16.8px", color: "var(--p-text-2,#AFE3E0)", textAlign: "right", transitionDelay: "0ms" }}>
                      <span ref={scoreTextRef}>
                        Score de prontidão
                      </span>
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#EAD9CC)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow1Ref} style={{ position: "relative", marginLeft: "31px", width: "201px", padding: "11px 0", borderTop: "1px solid var(--p-hair,rgba(234,217,204,.14))", fontSize: "16.8px", color: "var(--p-text-2,#AFE3E0)", textAlign: "right" }}>
                      Roadmap de evolução
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#EAD9CC)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={lRow3Ref} style={{ position: "relative", marginLeft: "52px", width: "188px", padding: "11px 0", borderTop: "1px solid var(--p-hair,rgba(234,217,204,.14))", fontSize: "16.8px", color: "var(--p-text-2,#AFE3E0)", textAlign: "right" }}>
                      Playbooks por etapa
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", left: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#EAD9CC)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ position: "absolute", right: "0", top: "0", width: "253px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
                  <div style={{ marginRight: "30px", width: "210px", textAlign: "left" }}>
                    <div style={{ fontSize: "26px", lineHeight: "1.1", fontWeight: "600", letterSpacing: "-.012em" }}>
                      M&AI
                    </div>
                    <div style={{ fontSize: "15.6px", fontWeight: "500", marginTop: "8px" }}>
                      Arquitetura tecnológica
                    </div>
                    <div style={{ fontSize: "13px", fontStyle: "italic", color: "var(--p-muted,#9FD6D2)", marginTop: "2px" }}>
                      known unknowns
                    </div>
                  </div>
                  <div style={{ marginTop: "20px", alignSelf: "stretch", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div ref={chatRowRef} style={{ position: "relative", marginRight: "25px", width: "206px", padding: "11px 0", borderTop: "1px solid var(--p-hair,rgba(234,217,204,.14))", fontSize: "16.8px", color: "var(--p-text-2,#AFE3E0)", textAlign: "left" }}>
                      <span ref={chatTextRef}>
                        Plataforma de dados
                      </span>
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#EAD9CC)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow1Ref} style={{ position: "relative", marginRight: "31px", width: "201px", padding: "11px 0", borderTop: "1px solid var(--p-hair,rgba(234,217,204,.14))", fontSize: "16.8px", color: "var(--p-text-2,#AFE3E0)", textAlign: "left" }}>
                      Chat e agentes de IA
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#EAD9CC)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                    <div ref={rRow2Ref} style={{ position: "relative", marginRight: "52px", width: "188px", padding: "11px 0", borderTop: "1px solid var(--p-hair,rgba(234,217,204,.14))", fontSize: "16.8px", color: "var(--p-text-2,#AFE3E0)", textAlign: "left" }}>
                      Integrações
                      <div data-maiq-dot="" style={{ position: "absolute", top: "-3.7px", right: "-4.2px", width: "8.4px", height: "8.4px", borderRadius: "999px", background: "var(--p-text,#EAD9CC)", opacity: "0", pointerEvents: "none" }}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-maiq-side-text="" ref={rColRef} style={{ flex: "1 1 0", minWidth: "246px", maxWidth: "312px", marginLeft: "-48px", position: "relative", display: "flex", justifyContent: "flex-start" }}>
                <div ref={rClipRef} style={{ maxWidth: "100%" }}>
                  <div ref={rTextRef} style={{ opacity: "0", transform: "translateX(-312px)", transition: "opacity 260ms cubic-bezier(.4,0,1,1),transform 320ms cubic-bezier(.4,0,1,1)" }}>
                    <p style={{ margin: "0", paddingLeft: "76px", fontSize: "15px", lineHeight: "1.6", color: "var(--p-text-2,#AFE3E0)", textAlign: "left", textWrap: "pretty" }}>
                      Integramos as melhores tecnologias do mercado para transformar o processo de fusões e aquisições em um fluxo seguro de decisão informada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="maiq-model-mobile">
              <div className="maiq-model-mobile-pill maiq-model-mobile-pill--top" aria-hidden="true" />
              <div className="maiq-model-mobile-pill maiq-model-mobile-pill--bottom" aria-hidden="true" />
              {/* Recorte duplo = interseção exata das duas pílulas (mesma técnica do Venn desktop). */}
              <div className="maiq-model-mobile-clip-a" aria-hidden="true">
                <div className="maiq-model-mobile-clip-b">
                  <div className="maiq-model-mobile-helix">
                    {helixBars}
                  </div>
                </div>
              </div>
              <div className="maiq-model-mobile-content maiq-model-mobile-content--top">
                <div className="maiq-model-mobile-card-title">
                  QUARPX<sup style={{ fontSize: ".5em", fontWeight: "500", top: "-.7em", position: "relative" }}>®</sup>
                </div>
                <div className="maiq-model-mobile-card-sub">Metodologia proprietária</div>
                <div className="maiq-model-mobile-card-tag">unknown unknowns</div>
                <ul className="maiq-model-mobile-list">
                  <li>Score de prontidão</li>
                  <li>Roadmap de evolução</li>
                  <li>Playbooks por etapa</li>
                </ul>
              </div>
              <div className="maiq-model-mobile-center">
                <div>Sistematização</div>
                <div>do M&A</div>
              </div>
              <div className="maiq-model-mobile-content maiq-model-mobile-content--bottom">
                <div className="maiq-model-mobile-card-title">M&AI</div>
                <div className="maiq-model-mobile-card-sub">Arquitetura tecnológica</div>
                <div className="maiq-model-mobile-card-tag">known unknowns</div>
                <ul className="maiq-model-mobile-list">
                  <li>Plataforma de dados</li>
                  <li>Chat e agentes de IA</li>
                  <li>Integrações</li>
                </ul>
              </div>
            </div>
              <div data-maiq-odo-row="" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "clamp(24px,4vw,56px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }}>
                  <OdometerValue value={32} />
                </div>
                <div style={{ height: "3px", background: "var(--p-mark-1,#9FD6D2)" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#9FD6D2)" }}>
                  Investidores na nossa rede
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }}>
                  <OdometerValue value={291} prefix="R$" suffix="M" />
                </div>
                <div style={{ height: "3px", background: "var(--p-mark-2,#308984)" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#9FD6D2)" }}>
                  Em transações realizadas
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                <div style={{ fontSize: "clamp(38px,4.2vw,58px)", lineHeight: "1", fontWeight: "600", letterSpacing: "-.022em", fontVariantNumeric: "tabular-nums" }}>
                  <OdometerValue value={16} />
                </div>
                <div style={{ height: "3px", background: "var(--p-hair,rgba(234,217,204,.14))" }}>
                </div>
                <div style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: "500", color: "var(--p-muted,#9FD6D2)" }}>
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
            <div className="maiq-footer-desktop"><SiteFooter dia={dia} /></div>
          </div>
        </div>
        <div ref={overlay2Ref} className="maiq-cycle-domains-overlay">
          <div className="maiq-model-pilares-bg">
            <Ciclo />
          </div>
        </div>
        <div ref={finalHoldRef} className="maiq-final-hold" aria-hidden="true" />
        <div className="maiq-footer-mobile"><SiteFooter dia={dia} /></div>
      </div>
      </div>
      </div>


  );
}
