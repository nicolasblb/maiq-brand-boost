import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FastForward, Maximize2, Minimize2, Pause, Play, Rewind } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import MaiqButton from '@/components/maiq/MaiqButton';
import videoEscuro from '@/assets/valor-na-mesa-escuro-v2.mp4.asset.json';
import videoClaro from '@/assets/valor-na-mesa-claro-v2.mp4.asset.json';
import posterEscuro from '@/assets/valor-na-mesa-escuro-v2-poster.jpg.asset.json';
import posterClaro from '@/assets/valor-na-mesa-claro-v2-poster.jpg.asset.json';
import webmEscuro from '@/assets/valor-na-mesa-escuro-v2.webm.asset.json';
import webmClaro from '@/assets/valor-na-mesa-claro-v2.webm.asset.json';

const DURATION = 20.5;

function PlaybackButton({ playing, value, onClick }: { playing: boolean; value: number; onClick: () => void }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  return (
    <MaiqButton
      variant="ghost"
      size="sm"
      className="maiq-media-icon-button"
      aria-label={playing ? 'Pausar animação' : value >= 1 ? 'Reproduzir animação novamente' : 'Reproduzir animação'}
      title={playing ? 'Pausar' : 'Reproduzir'}
      onClick={onClick}
    >
      <svg className="maiq-media-progress" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="maiq-media-progress-track" cx="22" cy="22" r={radius} />
        <circle className="maiq-media-progress-value" cx="22" cy="22" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - value) }} />
      </svg>
      {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
    </MaiqButton>
  );
}

function TimeButton({ direction, onClick }: { direction: 'back' | 'forward'; onClick: () => void }) {
  const Icon = direction === 'back' ? Rewind : FastForward;
  const label = direction === 'back' ? 'Recuar 5 segundos' : 'Avançar 5 segundos';
  return (
    <MaiqButton variant="ghost" size="sm" className="maiq-media-icon-button maiq-conviction-skip" aria-label={label} title={label} onClick={onClick}>
      <Icon size={17} fill="currentColor" /><span aria-hidden="true">5</span>
    </MaiqButton>
  );
}

export default function ConvictionScene() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const darkRef = useRef<HTMLVideoElement | null>(null);
  const lightRef = useRef<HTMLVideoElement | null>(null);
  const modalDarkRef = useRef<HTMLVideoElement | null>(null);
  const modalLightRef = useRef<HTMLVideoElement | null>(null);
  const [light, setLight] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const startedRef = useRef(false);

  const activeRef = useCallback(() => {
    if (modalOpen) return light ? modalLightRef.current : modalDarkRef.current;
    return light ? lightRef.current : darkRef.current;
  }, [light, modalOpen]);

  // tema da página (data-theme="claro" no escopo Maiq)
  useEffect(() => {
    const scope = rootRef.current?.closest('[data-maiq-scope]') ?? document.documentElement;
    const read = () => setLight(scope.getAttribute('data-theme') === 'claro');
    read();
    const observer = new MutationObserver(read);
    observer.observe(scope, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // sincroniza o tempo entre as duas versões apenas quando o tema muda
  const stateRef = useRef({ playing: false, visible: false });
  stateRef.current = { playing, visible };
  useEffect(() => {
    const active = activeRef();
    const other = modalOpen
      ? (light ? modalDarkRef.current : modalLightRef.current)
      : (light ? darkRef.current : lightRef.current);
    if (!active) return;
    if (other) {
      other.pause();
      if (Math.abs(other.currentTime - active.currentTime) > 0.05) active.currentTime = other.currentTime;
    }
    if (stateRef.current.playing && stateRef.current.visible) void active.play().catch(() => undefined);
  }, [light, modalOpen, activeRef]);

  // transfere o instante atual entre a exibição normal e a ampliada
  useEffect(() => {
    const source = modalOpen
      ? (light ? lightRef.current : darkRef.current)
      : (light ? modalLightRef.current : modalDarkRef.current);
    const target = activeRef();
    if (!target) return;
    const synchronize = () => {
      if (source) {
        source.pause();
        target.currentTime = source.currentTime;
      }
      if (playing && visible) void target.play().catch(() => undefined);
    };
    if (target.readyState >= 1) synchronize();
    else target.addEventListener('loadedmetadata', synchronize, { once: true });
    return () => target.removeEventListener('loadedmetadata', synchronize);
  }, [modalOpen, light, playing, visible, activeRef]);


  // visibilidade
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.12 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // início automático na primeira exibição
  useEffect(() => {
    if (!visible || startedRef.current) return;
    startedRef.current = true;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
  }, [visible]);

  // aplica play/pause no elemento ativo
  useEffect(() => {
    const active = activeRef();
    if (!active) return;
    if (playing && visible) void active.play().catch(() => undefined);
    else active.pause();
  }, [playing, visible, activeRef]);

  // progresso fluido
  useEffect(() => {
    if (!playing || !visible) return;
    let frame = 0;
    const tick = () => {
      const active = activeRef();
      if (active) setTime(active.currentTime);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, visible, activeRef]);

  const seek = (delta: number) => {
    const active = activeRef();
    if (!active) return;
    const next = Math.max(0, Math.min(DURATION, active.currentTime + delta));
    active.currentTime = next;
    const other = modalOpen
      ? (light ? modalDarkRef.current : modalLightRef.current)
      : (light ? darkRef.current : lightRef.current);
    if (other) other.currentTime = next;
    setTime(next);
  };

  const toggle = () => {
    setPlaying((value) => !value);
  };


  const duration = activeRef()?.duration || DURATION;

  const videoPair = (
    darkVideoRef: React.RefObject<HTMLVideoElement | null>,
    lightVideoRef: React.RefObject<HTMLVideoElement | null>,
  ) => (
    <>
      <video
        ref={darkVideoRef}
        className="maiq-conviction-video"
        data-active={!light}
        poster={posterEscuro.url}
        muted
        playsInline
        preload="auto"
        loop
        aria-label="Animação Valor na mesa: comparação entre crescimento orgânico e crescimento com M&A"
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
      >
        <source src={videoEscuro.url} type="video/mp4" />
        <source src={webmEscuro.url} type="video/webm" />
      </video>
      <video
        ref={lightVideoRef}
        className="maiq-conviction-video"
        data-active={light}
        poster={posterClaro.url}
        muted
        playsInline
        preload="auto"
        loop
        aria-hidden="true"
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
      >
        <source src={videoClaro.url} type="video/mp4" />
        <source src={webmClaro.url} type="video/webm" />
      </video>
    </>
  );

  const controls = (expanded: boolean) => (
    <div className="maiq-conviction-controls" aria-label="Controles da animação">
      <div className="maiq-conviction-controls-group">
        <TimeButton direction="back" onClick={() => seek(-5)} />
        <PlaybackButton playing={playing && visible} value={Math.min(1, time / duration)} onClick={toggle} />
        <TimeButton direction="forward" onClick={() => seek(5)} />
      </div>
      <MaiqButton
        variant="ghost"
        size="sm"
        className="maiq-media-icon-button"
        aria-label={expanded ? 'Reduzir vídeo' : 'Maximizar vídeo'}
        title={expanded ? 'Reduzir' : 'Maximizar'}
        onClick={() => setModalOpen(!expanded)}
      >
        {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
      </MaiqButton>
    </div>
  );

  return (
    <div ref={rootRef} className="maiq-conviction-player-wrap">
      <div className="maiq-conviction-player">
        {!modalOpen ? videoPair(darkRef, lightRef) : null}
        {controls(false)}
      </div>

      <DialogPrimitive.Root open={modalOpen} onOpenChange={setModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="maiq-platform-modal-overlay" />
          <DialogPrimitive.Content className="maiq-conviction-modal" data-maiq-scope="" data-theme={light ? 'claro' : undefined}>
            <DialogPrimitive.Title className="maiq-platform-modal-title">Valor na mesa</DialogPrimitive.Title>
            <div className="maiq-conviction-modal-media">
              {modalOpen ? videoPair(modalDarkRef, modalLightRef) : null}
              {controls(true)}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
