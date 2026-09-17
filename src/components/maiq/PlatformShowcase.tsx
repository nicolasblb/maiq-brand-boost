import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import MaiqButton from '@/components/maiq/MaiqButton';
import VdrEmbed from '@/components/maiq/vdr/VdrEmbed';

const FEATURE_DURATION = 15;

const FEATURES = [
  {
    name: 'M&AI',
    title: 'O chat para o próximo passo',
    description: 'Converse com uma IA treinada profundamente em frameworks e métodos para atender a sua necessidade. Escolha o tema, suas referências e você estará pronto para iniciar um debate que mudará o rumo da sua empresa.',
    visual: 'circle',
  },
  {
    name: 'QUARPX®',
    title: 'Onde estamos na jornada do M&A?',
    description: 'Avalie a prontidão da sua empresa para uma transação de M&A bem sucedida. Acompanhe a evolução de cada competência por um painel intuitivo e monitore as ações priorizadas em cada estágio.',
    visual: 'diamond',
  },
  {
    name: 'Teses',
    title: 'Construindo oportunidades',
    description: 'Elabore suas teses e planeje o crescimento inorgânico da sua empresa de forma assistida, organizada e segura. Explore as possibilidades do seu setor e garanta a melhor estratégia para o futuro.',
    visual: 'rings',
  },
  {
    name: 'Diligência',
    title: 'Segurança e organização em poucos cliques',
    description: 'Tenha controle sobre sua documentação durante todo o processo de Due Diligence. Centralize e compartilhe todos os documentos com acessos controlados, rastreabilidade e controle de versões.',
    visual: 'vdr',
  },
  {
    name: 'Conteúdo',
    title: 'Conhecimento como alma da transação',
    description: 'Mergulhe no universo de M&A com nossos conteúdos. Trazemos reflexões, cases, aspectos técnicos, notícias e outros temas para permitir que você esteja cada vez mais preparado para o próximo passo.',
    visual: 'hexagon',
  },
] as const;

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

function MediaVisual({ index, playing, run, initialTime }: { index: number; playing: boolean; run: number; initialTime: number }) {
  const feature = FEATURES[index];
  if (!feature) return null;
  if (feature.visual === 'vdr') {
    return <VdrEmbed playing={playing} resetSignal={run} initialTime={initialTime} />;
  }
  if (feature.visual === 'circle') return <div className="maiq-platform-placeholder maiq-platform-placeholder-circle" data-playing={playing} />;
  if (feature.visual === 'diamond') return <div className="maiq-platform-placeholder maiq-platform-placeholder-diamond" data-playing={playing} />;
  if (feature.visual === 'rings') return <div className="maiq-platform-placeholder maiq-platform-placeholder-rings" data-playing={playing}><i /><i /><i /></div>;
  return <div className="maiq-platform-placeholder maiq-platform-placeholder-hexagon" data-playing={playing} />;
}

export default function PlatformShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [theme, setTheme] = useState<'noite' | 'claro'>('noite');
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);
  const [navProgress, setNavProgress] = useState(0);
  const [navSettling, setNavSettling] = useState(false);
  const progressRef = useRef(0);
  const segmentProgressRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const feature = FEATURES[active] ?? FEATURES[0];
  const timerPaused = hovered || !visible || modalOpen;
  const mediaPlaying = playing && visible;

  const restartMedia = (index: number) => {
    setActive(index);
    progressRef.current = 0;
    setProgress(0);
    setPlaying(true);
    setRun((value) => value + 1);
  };

  const selectFeature = (index: number) => {
    const normalized = (index + FEATURES.length) % FEATURES.length;
    restartMedia(normalized);
    segmentProgressRef.current = 0;
    setNavSettling(true);
    setNavProgress(normalized);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.12 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navSettling) return;
    const timeout = window.setTimeout(() => setNavSettling(false), 620);
    return () => window.clearTimeout(timeout);
  }, [navSettling, navProgress]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [active]);

  useEffect(() => {
    if (timerPaused || navSettling) {
      lastRef.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const elapsed = now - lastRef.current;
      lastRef.current = now;
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
  }, [active, navSettling, timerPaused]);

  useEffect(() => {
    if (!mediaPlaying || progressRef.current >= 1) {
      lastRef.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const next = Math.min(1, progressRef.current + (now - lastRef.current) / (FEATURE_DURATION * 1000));
      lastRef.current = now;
      progressRef.current = next;
      setProgress(next);
      if (next >= 1) {
        setPlaying(false);
        return;
      }
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
    const scope = rootRef.current?.closest('[data-maiq-scope]');
    setTheme(scope?.getAttribute('data-theme') === 'claro' ? 'claro' : 'noite');
    setModalOpen(true);
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
    <div
      ref={rootRef}
      className="maiq-platform-showcase"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="maiq-platform-tabs-viewport">
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
              onClick={() => selectFeature(index)}
            >
              <span>{item.name}</span>
            </MaiqButton>
          ))}
          <span className="maiq-platform-line" aria-hidden="true">
            <span
              className="maiq-platform-line-progress"
              data-settling={navSettling}
              style={{ width: `${(navProgress / FEATURES.length) * 100}%` }}
            >
              <span className="maiq-platform-line-core" />
            </span>
          </span>
        </div>
      </div>

      <div className="maiq-platform-card">
        <div className="maiq-platform-media">
          {!modalOpen ? <MediaVisual index={active} playing={mediaPlaying} run={run} initialTime={progress * FEATURE_DURATION} /> : null}
          {mediaControls(false)}
        </div>
        <div className="maiq-platform-copy">
          <div key={active} className="maiq-platform-copy-inner">
            <p className="maiq-platform-feature-name">{feature.name}</p>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      </div>

      <DialogPrimitive.Root open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="maiq-platform-modal-overlay" />
          <DialogPrimitive.Content className="maiq-platform-modal" data-maiq-scope="" data-theme={theme === 'claro' ? 'claro' : undefined} aria-describedby="maiq-platform-modal-description">
            <DialogPrimitive.Title className="maiq-platform-modal-title">{feature.name}</DialogPrimitive.Title>
            <div className="maiq-platform-modal-layout">
              <div className="maiq-platform-modal-media">
                {modalOpen ? <MediaVisual index={active} playing={mediaPlaying} run={run} initialTime={progress * FEATURE_DURATION} /> : null}
                {mediaControls(true)}
              </div>
              <div className="maiq-platform-modal-copy">
                <p className="maiq-platform-feature-name">{feature.name}</p>
                <h3>{feature.title}</h3>
                <DialogPrimitive.Description id="maiq-platform-modal-description">{feature.description}</DialogPrimitive.Description>
                <div className="maiq-platform-modal-nav">
                  <MaiqButton variant="ghost" size="sm" aria-label="Funcionalidade anterior" title="Anterior" className="maiq-platform-icon-nav" onClick={() => selectFeature(active - 1)}><ChevronLeft size={20} /></MaiqButton>
                  <span>{active + 1} / {FEATURES.length}</span>
                  <MaiqButton variant="ghost" size="sm" aria-label="Próxima funcionalidade" title="Próxima" className="maiq-platform-icon-nav" onClick={() => selectFeature(active + 1)}><ChevronRight size={20} /></MaiqButton>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
