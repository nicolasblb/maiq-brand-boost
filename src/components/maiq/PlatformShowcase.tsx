import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import MaiqButton from '@/components/maiq/MaiqButton';
import etapasClaro from '@/assets/plataforma/plataforma-etapas-claro.mp4';
import etapasNoite from '@/assets/plataforma/plataforma-etapas-noite.mp4';
import iaClaro from '@/assets/plataforma/plataforma-ia-claro.mp4';
import iaNoite from '@/assets/plataforma/plataforma-ia-noite.mp4';
import salaClaro from '@/assets/plataforma/plataforma-sala-de-dados-claro.mp4';
import salaNoite from '@/assets/plataforma/plataforma-sala-de-dados-noite.mp4';
import tesesClaro from '@/assets/plataforma/plataforma-teses-claro.mp4';
import tesesNoite from '@/assets/plataforma/plataforma-teses-noite.mp4';

const FEATURE_DURATION = 15;
// Chave de sessão para a dica "Gire o aparelho" (fullscreen rotacionado do
// modal em celular portrait) não repetir a cada reabertura na mesma sessão —
// mesmo padrão de .maiq-conviction-modal em ConvictionScene.tsx.
const ROTATE_HINT_STORAGE_KEY = 'maiq-platform-rotate-hint-seen';
const ROTATE_HINT_VISIBLE_MS = 2500;
const ROTATE_HINT_FADE_BUFFER_MS = 220;
const NARROW_PORTRAIT_QUERY = '(max-width:800px) and (orientation:portrait)';
// Abaixo de 1024px o vídeo fica numa faixa estreita sob o texto; tocar nele
// abre o modal de tela cheia (o botão Maximizar continua disponível).
const TAP_TO_EXPAND_QUERY = '(max-width:1023px)';

const FEATURES = [
  {
    name: 'IA para M&A',
    title: 'Agentes e Assistentes de IA para M&A',
    points: [
      'Integração com os melhores LLMs do mercado',
      'Assistente de IA treinada especificamente para Fusões e Aquisições',
      'Agregação de diversas tecnologias para contexto mais acurado',
    ],
    video: { noite: iaNoite, claro: iaClaro },
  },
  {
    name: 'Teses de Investimento',
    title: 'Explore suas Teses de Investimento',
    points: [
      'Desenhe seus objetivos de M&A e conecte com a estratégia do seu negócio',
      'Crie múltiplos cenários: possíveis compradores, investidores ou concorrentes para aquisição',
    ],
    video: { noite: tesesNoite, claro: tesesClaro },
  },
  {
    name: 'Etapas do M&A',
    title: 'Acompanhe as etapas do M&A',
    points: [
      'Funcionalidades específicas para apoiar da negociação até o estágio de integração',
      'Ferramenta de análise de documentos',
      'Gerador de apresentações com uso de IA',
    ],
    video: { noite: etapasNoite, claro: etapasClaro },
  },
  {
    name: 'Virtual Data Room',
    title: 'Compartilhamento de arquivos',
    points: [
      'Segurança para dividir e acessar arquivos',
      'Rastreabilidade, controle e auditoria de todos os documentos compartilhados',
    ],
    video: { noite: salaNoite, claro: salaClaro },
  },
] as const;

function FeaturePoints({ points, id }: { points: readonly string[]; id?: string }) {
  return (
    <ul className="maiq-platform-points" id={id}>
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

function PlaybackButton({ playing, progress, onClick }: { playing: boolean; progress: number; onClick: () => void }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  return (
    <MaiqButton
      variant="ghost"
      size="sm"
      aria-label={playing ? 'Pausar vídeo' : progress >= 1 ? 'Reproduzir vídeo novamente' : 'Reproduzir vídeo'}
      title={playing ? 'Pausar' : 'Reproduzir'}
      onClick={onClick}
      className="maiq-media-icon-button"
    >
      <svg className="maiq-media-progress" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="maiq-media-progress-track" cx="22" cy="22" r={radius} />
        <circle
          className="maiq-media-progress-value"
          cx="22"
          cy="22"
          r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - progress) }}
        />
      </svg>
      {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
    </MaiqButton>
  );
}

// Vídeo da funcionalidade ativa. Os vídeos têm exatamente FEATURE_DURATION
// segundos, então o timer da aba segue sendo a referência: ao montar (card ↔
// modal), trocar de tema ou reiniciar, o vídeo é posicionado no tempo do timer
// e depois apenas acompanha play/pause.
function MediaVisual({ src, playing, run, time, onExpand }: { src: string; playing: boolean; run: number; time: number; onExpand?: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      const limit = (Number.isFinite(video.duration) ? video.duration : FEATURE_DURATION) - 0.05;
      video.currentTime = Math.max(0, Math.min(timeRef.current, limit));
    };
    if (video.readyState >= 1) {
      sync();
      return;
    }
    video.addEventListener('loadedmetadata', sync, { once: true });
    return () => video.removeEventListener('loadedmetadata', sync);
  }, [src, run]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      // Autoplay mudo é permitido; a rejeição (ex.: economia de dados) só deixa o quadro parado.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing, src, run]);

  return (
    <video
      key={src}
      ref={videoRef}
      className="maiq-platform-video"
      src={src}
      muted
      playsInline
      loop
      preload="auto"
      aria-hidden="true"
      data-expandable={onExpand ? 'true' : undefined}
      onClick={onExpand}
    />
  );
}

export default function PlatformShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabsViewportRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [theme, setTheme] = useState<'noite' | 'claro'>('noite');
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mediaArmed, setMediaArmed] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);
  const [navProgress, setNavProgress] = useState(0);
  const [navSettling, setNavSettling] = useState(false);
  const [rotateHintMounted, setRotateHintMounted] = useState(false);
  const [rotateHintShown, setRotateHintShown] = useState(false);
  const progressRef = useRef(0);
  const segmentProgressRef = useRef(0);
  const mediaLastRef = useRef<number | null>(null);
  const navLastRef = useRef<number | null>(null);
  const feature = FEATURES[active] ?? FEATURES[0];
  const timerPaused = hovered || !visible || modalOpen;
  const mediaPlaying = playing && visible;
  const videoSrc = feature.video[theme];

  const restartMedia = (index: number) => {
    setActive(index);
    progressRef.current = 0;
    setProgress(0);
    setPlaying(true);
    setRun((value) => value + 1);
  };

  const selectFeature = (index: number) => {
    const normalized = (index + FEATURES.length) % FEATURES.length;
    mediaLastRef.current = null;
    navLastRef.current = null;
    restartMedia(normalized);
    segmentProgressRef.current = 0;
    setNavSettling(true);
    window.requestAnimationFrame(() => setNavProgress(normalized));
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.12 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // O vídeo só é montado (e baixado) quando a seção se aproxima da tela — não
  // disputa banda com o carregamento inicial da página.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.IntersectionObserver) {
      setMediaArmed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setMediaArmed(true);
      observer.disconnect();
    }, { rootMargin: '100% 0px' });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Tema acompanhado continuamente (não só ao abrir o modal): cada tema tem seu vídeo.
  // data-theme-ready marca que o useMaiqTheme já aplicou o tema real; antes disso o
  // escopo mostra o 'noite' provisório do SSR, e montar o vídeo ali baixaria o do
  // tema errado. Sem escopo (uso fora da home), segue sem esperar.
  useEffect(() => {
    const scope = rootRef.current?.closest('[data-maiq-scope]');
    if (!scope) {
      setThemeReady(true);
      return;
    }
    const read = () => {
      setTheme(scope.getAttribute('data-theme') === 'claro' ? 'claro' : 'noite');
      setThemeReady(scope.hasAttribute('data-theme-ready'));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(scope, { attributes: true, attributeFilter: ['data-theme', 'data-theme-ready'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navSettling) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(() => setNavSettling(false), reducedMotion ? 0 : 620);
    return () => window.clearTimeout(timeout);
  }, [navSettling, navProgress]);

  useEffect(() => {
    const viewport = tabsViewportRef.current;
    const tab = tabRefs.current[active];
    if (!viewport || !tab || viewport.scrollWidth <= viewport.clientWidth) return;
    const left = tab.offsetLeft - (viewport.clientWidth - tab.offsetWidth) / 2;
    viewport.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  // Dica "Gire o aparelho": só na primeira vez que o modal abre em celular
  // portrait (mesma condição da rotação CSS), e só uma vez por sessão.
  useEffect(() => {
    if (!modalOpen) {
      setRotateHintMounted(false);
      setRotateHintShown(false);
      return;
    }
    if (typeof window === 'undefined') return;
    if (!window.matchMedia(NARROW_PORTRAIT_QUERY).matches) return;
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(ROTATE_HINT_STORAGE_KEY) === '1';
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return;
    try {
      window.sessionStorage.setItem(ROTATE_HINT_STORAGE_KEY, '1');
    } catch {
      // sessionStorage indisponível (ex.: modo privado) — pior caso é a dica
      // reaparecer em reaberturas na mesma sessão, sem impacto funcional.
    }
    setRotateHintMounted(true);
    const showFrame = window.requestAnimationFrame(() => setRotateHintShown(true));
    const hideTimer = window.setTimeout(() => setRotateHintShown(false), ROTATE_HINT_VISIBLE_MS);
    const unmountTimer = window.setTimeout(
      () => setRotateHintMounted(false),
      ROTATE_HINT_VISIBLE_MS + ROTATE_HINT_FADE_BUFFER_MS,
    );
    return () => {
      window.cancelAnimationFrame(showFrame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [modalOpen]);

  useEffect(() => {
    if (timerPaused) {
      navLastRef.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (navLastRef.current == null) navLastRef.current = now;
      const elapsed = now - navLastRef.current;
      navLastRef.current = now;
      const nextSegmentProgress = Math.min(1, segmentProgressRef.current + elapsed / (FEATURE_DURATION * 1000));
      segmentProgressRef.current = nextSegmentProgress;
      setNavProgress(active + nextSegmentProgress);

      if (nextSegmentProgress >= 1) {
        segmentProgressRef.current = 0;
        if (active === FEATURES.length - 1) {
          restartMedia(0);
          setNavProgress(FEATURES.length);
          setNavSettling(true);
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => setNavProgress(0)));
        } else {
          restartMedia(active + 1);
          setNavProgress(active + 1);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, timerPaused]);

  useEffect(() => {
    if (!mediaPlaying || progressRef.current >= 1) {
      mediaLastRef.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (mediaLastRef.current == null) mediaLastRef.current = now;
      let next = progressRef.current + (now - mediaLastRef.current) / (FEATURE_DURATION * 1000);
      mediaLastRef.current = now;
      // Loop: quando a aba não avança sozinha (mouse sobre o card ou modal
      // aberto), o vídeo recomeça — o <video loop> faz isso nativamente e o
      // progresso só dá a volta junto, sem seek.
      if (next >= 1) next -= 1;
      progressRef.current = next;
      setProgress(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mediaPlaying, run, active]);

  const togglePlayback = () => {
    if (progressRef.current >= 1) {
      progressRef.current = 0;
      setProgress(0);
      setRun((value) => value + 1);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const expandFromTap = () => {
    if (window.matchMedia(TAP_TO_EXPAND_QUERY).matches) openModal();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const mediaControls = (expanded: boolean) => (
    <div className="maiq-media-controls">
      <PlaybackButton playing={mediaPlaying} progress={progress} onClick={togglePlayback} />
      <MaiqButton
        variant="ghost"
        size="sm"
        aria-label={expanded ? 'Reduzir vídeo' : 'Maximizar vídeo'}
        title={expanded ? 'Reduzir' : 'Maximizar'}
        className="maiq-media-icon-button"
        onClick={expanded ? closeModal : openModal}
      >
        {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
      </MaiqButton>
    </div>
  );

  return (
    <div ref={rootRef} className="maiq-platform-showcase">
      <div ref={tabsViewportRef} className="maiq-platform-tabs-viewport">
        <div className="maiq-platform-tabs" role="tablist" aria-label="Funcionalidades da plataforma">
          {FEATURES.map((item, index) => (
            <MaiqButton
              key={item.name}
              ref={(node) => { tabRefs.current[index] = node; }}
              variant="ghost"
              size="sm"
              role="tab"
              aria-selected={active === index}
              className="maiq-platform-tab"
              data-active={active === index}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => selectFeature(index)}
            >
              <span>{item.name}</span>
            </MaiqButton>
          ))}
          <span className="maiq-platform-line" aria-hidden="true">
            <span
              className="maiq-platform-line-progress"
              data-settling={navSettling}
              style={{ clipPath: `inset(0 ${100 - (navProgress / FEATURES.length) * 100}% 0 0)` }}
            >
            </span>
            {FEATURES.slice(1).map((item, index) => (
              <span
                key={item.name}
                className="maiq-platform-line-divider"
                data-lit={navProgress >= index + 1}
                style={{ left: `${((index + 1) / FEATURES.length) * 100}%` }}
              />
            ))}
          </span>
        </div>
      </div>

      <div className="maiq-platform-card">
        <div className="maiq-platform-copy" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <div key={active} className="maiq-platform-copy-inner">
            <h3>{feature.title}</h3>
            <FeaturePoints points={feature.points} />
          </div>
        </div>
        <div className="maiq-platform-media" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          {!modalOpen && mediaArmed && themeReady ? <MediaVisual src={videoSrc} playing={mediaPlaying} run={run} time={progress * FEATURE_DURATION} onExpand={expandFromTap} /> : null}
          {mediaControls(false)}
        </div>
      </div>

      <DialogPrimitive.Root open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="maiq-platform-modal-overlay" />
          <DialogPrimitive.Content className="maiq-platform-modal" data-maiq-scope="" data-theme={theme === 'claro' ? 'claro' : undefined} aria-describedby="maiq-platform-modal-description">
            <DialogPrimitive.Title className="maiq-platform-modal-title">{feature.name}</DialogPrimitive.Title>
            <div className="maiq-platform-modal-layout">
              <div className="maiq-platform-modal-media">
                {modalOpen ? <MediaVisual src={videoSrc} playing={mediaPlaying} run={run} time={progress * FEATURE_DURATION} /> : null}
                {mediaControls(true)}
              </div>
              <div className="maiq-platform-modal-copy">
                <p className="maiq-platform-feature-name">{feature.name}</p>
                <h3>{feature.title}</h3>
                <FeaturePoints points={feature.points} id="maiq-platform-modal-description" />
                <div className="maiq-platform-modal-nav">
                  <MaiqButton variant="ghost" size="sm" aria-label="Funcionalidade anterior" title="Anterior" className="maiq-platform-icon-nav" onClick={() => selectFeature(active - 1)}><ChevronLeft size={20} /></MaiqButton>
                  <span>{active + 1} / {FEATURES.length}</span>
                  <MaiqButton variant="ghost" size="sm" aria-label="Próxima funcionalidade" title="Próxima" className="maiq-platform-icon-nav" onClick={() => selectFeature(active + 1)}><ChevronRight size={20} /></MaiqButton>
                </div>
              </div>
            </div>
            {rotateHintMounted ? (
              <div className="maiq-platform-rotate-hint" data-visible={rotateHintShown} role="status">
                <RotateCw size={15} aria-hidden="true" />
                <span>Gire o aparelho</span>
              </div>
            ) : null}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
