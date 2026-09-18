import { FastForward, Pause, Play, Rewind } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import MaiqButton from '@/components/maiq/MaiqButton';
import videoEscuro from '@/assets/valor-na-mesa-escuro.mp4.asset.json';
import videoClaro from '@/assets/valor-na-mesa-claro.mp4.asset.json';
import posterEscuro from '@/assets/valor-na-mesa-escuro-poster.jpg.asset.json';
import posterClaro from '@/assets/valor-na-mesa-claro-poster.jpg.asset.json';

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
  const [light, setLight] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const startedRef = useRef(false);

  const activeRef = useCallback(() => (light ? lightRef.current : darkRef.current), [light]);

  // tema da página (data-theme="claro" no escopo Maiq)
  useEffect(() => {
    const scope = rootRef.current?.closest('[data-maiq-scope]') ?? document.documentElement;
    const read = () => setLight(scope.getAttribute('data-theme') === 'claro');
    read();
    const observer = new MutationObserver(read);
    observer.observe(scope, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // sincroniza o tempo entre as duas versões ao trocar de tema
  useEffect(() => {
    const active = light ? lightRef.current : darkRef.current;
    const other = light ? darkRef.current : lightRef.current;
    if (!active) return;
    if (other) {
      other.pause();
      if (Math.abs(other.currentTime - active.currentTime) > 0.05) active.currentTime = other.currentTime;
    }
    if (playing && visible) void active.play().catch(() => undefined);
  }, [light, playing, visible]);

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
    const other = light ? darkRef.current : lightRef.current;
    if (other) other.currentTime = next;
    setTime(next);
  };

  const toggle = () => {
    const active = activeRef();
    if (!active) return;
    if (active.ended || active.currentTime >= DURATION - 0.05) {
      active.currentTime = 0;
      setTime(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  };

  const duration = activeRef()?.duration || DURATION;

  return (
    <div ref={rootRef} className="maiq-conviction-player">
      <video
        ref={darkRef}
        className="maiq-conviction-video"
        data-active={!light}
        src={videoEscuro.url}
        poster={posterEscuro.url}
        muted
        playsInline
        preload="auto"
        aria-label="Animação Valor na mesa: comparação entre crescimento orgânico e crescimento com M&A"
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
      />
      <video
        ref={lightRef}
        className="maiq-conviction-video"
        data-active={light}
        src={videoClaro.url}
        poster={posterClaro.url}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
      />
      <div className="maiq-conviction-controls" aria-label="Controles da animação">
        <TimeButton direction="back" onClick={() => seek(-5)} />
        <PlaybackButton playing={playing && visible} value={Math.min(1, time / duration)} onClick={toggle} />
        <TimeButton direction="forward" onClick={() => seek(5)} />
      </div>
    </div>
  );
}
