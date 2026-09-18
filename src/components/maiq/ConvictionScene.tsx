import { FastForward, Pause, Play, Rewind } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import MaiqButton from '@/components/maiq/MaiqButton';

const DURATION = 20.5;
const YEARS = ['Ano 01', 'Ano 02', 'Ano 03', 'Ano 04', 'Ano 05'];
const ORG = [100, 105, 110, 116, 122];
const MNA = [100, 110, 140, 160, 180];
const READINESS = [30, 45, 60, 75, 85];
const STEPS = [5.2, 7, 8.8, 11, 12.8];
const MILESTONES = [
  ['Só orgânico', 'Faturamento sem explorar sinergias'],
  ['Ano 01', 'Melhoria de controles internos'],
  ['Ano 02', 'Governança e conselho funcional'],
  ['Ano 03', '1º M&A bem-sucedido'],
  ['Ano 04', 'Time executivo profissional'],
  ['Ano 05', 'Venda estratégica da empresa'],
] as const;
const RADAR = [[5, 3, 2, 3, 2, 3], [6, 5, 3, 4, 4, 5], [7, 6, 5, 6, 6, 6], [8, 7, 7, 8, 7, 8], [9, 8, 8, 9, 8, 9]];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const progress = (time: number, start: number, duration: number) => clamp((time - start) / duration);
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const easeInOut = (value: number) => value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

function PlaybackButton({ playing, value, onClick }: { playing: boolean; value: number; onClick: () => void }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  return (
    <MaiqButton variant="ghost" size="sm" className="maiq-media-icon-button" aria-label={playing ? 'Pausar animação' : value >= 1 ? 'Reproduzir animação novamente' : 'Reproduzir animação'} title={playing ? 'Pausar' : 'Reproduzir'} onClick={onClick}>
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

function polygonPoints(values: number[], radius = 116) {
  return values.map((value, index) => {
    const angle = (-90 + index * 60) * Math.PI / 180;
    const r = radius * value / 10;
    return `${(1510 + r * Math.cos(angle)).toFixed(1)},${(512 + r * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
}

function ConvictionArtwork({ time }: { time: number }) {
  const switchAmount = easeInOut(progress(time, 3.7, 0.6)) - easeInOut(progress(time, 19.4, 0.6));
  const outro = easeInOut(progress(time, 18.8, 0.8));
  const activeYear = STEPS.reduce((current, step, index) => time >= step ? index : current, 0);
  const radarValues = useMemo(() => {
    let values = [1, 1, 1, 1, 1, 1];
    STEPS.forEach((step, index) => {
      if (time >= step + 0.2) {
        const from = index === 0 ? [1, 1, 1, 1, 1, 1] : RADAR[index - 1] ?? RADAR[0];
        const to = RADAR[index] ?? RADAR[RADAR.length - 1];
        const amount = easeInOut(progress(time, step + 0.2, 1));
        values = to.map((value, dimension) => mix(from?.[dimension] ?? 1, value, amount));
      }
    });
    return values.map((value) => value * (1 - easeInOut(progress(time, 19, 1))));
  }, [time]);
  const milestoneIndex = time < 5 ? 0 : Math.min(5, activeYear + 1);
  const readinessAmount = (index: number) => easeOut(progress(time, (STEPS[index] ?? 0) + 0.3, 0.9));
  const cam = 1 + 0.08 * easeInOut(progress(time, 14.4, 1)) - 0.08 * easeInOut(progress(time, 18.7, 0.8));

  return (
    <svg className="maiq-conviction-svg" viewBox="0 0 1920 1080" role="img" aria-label="Comparação animada entre crescimento orgânico e crescimento com fusões e aquisições">
      <rect className="maiq-conviction-bg" width="1920" height="1080" />
      <g style={{ transform: `scale(${cam})`, transformOrigin: '960px 540px' }}>
        <g className="maiq-conviction-toggle">
          <rect x="96" y="80" width="640" height="64" rx="32" />
          <rect className="maiq-conviction-toggle-pill" x={101 + 312 * switchAmount} y="85" width="312" height="54" rx="27" />
          <text x="257" y="120" data-active={switchAmount < 0.5}>Crescimento orgânico</text>
          <text x="569" y="120" data-active={switchAmount >= 0.5}>Orgânico + M&amp;A</text>
        </g>

        <g className="maiq-conviction-legend" opacity={easeOut(progress(time, 4.3, 0.6)) * (1 - outro)}>
          <rect className="ghost" x="1180" y="101" width="28" height="18" rx="4" /><text x="1220" y="117">Só orgânico</text>
          <rect className="base" x="1380" y="101" width="28" height="18" rx="4" /><text x="1420" y="117">Orgânico + M&amp;A</text>
          <rect className="accent" x="1645" y="101" width="28" height="18" rx="4" /><text x="1685" y="117">Potencial não capturado</text>
        </g>

        <g className="maiq-conviction-panel">
          <rect x="96" y="190" width="1140" height="760" rx="20" />
          {YEARS.map((year, index) => <text key={year} className={activeYear === index ? 'active' : ''} x={396 + index * 140} y="252" textAnchor="middle">{year}</text>)}
          <rect className="year-line" x={348 + activeYear * 140} y="270" width="96" height="3" rx="2" opacity={easeOut(progress(time, 5.2, 0.4)) * (1 - outro)} />
          <text x="136" y="702">Faturamento</text>
          <text x="136" y="858">M&amp;A: nível de prontidão</text>
          <line x1="336" y1="790" x2="1016" y2="790" />
          {ORG.map((organic, index) => {
            const x = 348 + index * 140;
            const organicHeight = organic * 2.33 * easeOut(progress(time, 0.4 + 0.3 * index, 0.9));
            const growth = easeOut(progress(time, (STEPS[index] ?? 0) + 0.2, index === 2 ? 1.6 : 1.1));
            const fullHeight = (MNA[index] ?? 0) * 2.33 * growth * (1 - outro);
            const baseHeight = Math.min(fullHeight, organic * 2.33);
            return <g key={index}>
              <rect className="bar-organic" x={x} y={790 - organicHeight} width="96" height={organicHeight} rx="12" opacity={1 - easeInOut(progress(time, 3.9, 0.7))} />
              <rect className="bar-ghost" x={x} y={790 - organic * 2.33} width="96" height={organic * 2.33} rx="12" opacity={easeInOut(progress(time, 3.9, 0.7)) * (1 - outro)} />
              <rect className="bar-base" x={x} y={790 - baseHeight} width="96" height={baseHeight} rx="10" />
              <rect className="bar-accent" x={x} y={790 - fullHeight} width="96" height={Math.max(0, fullHeight - baseHeight)} rx="8" />
              <rect className="readiness" x={x - 7} y="838" width="110" height="56" rx="10" opacity={readinessAmount(index)} />
              <text className="readiness-label" x={x + 48} y="874" textAnchor="middle" opacity={readinessAmount(index)}>{Math.round(mix(index ? READINESS[index - 1] ?? 0 : 0, READINESS[index] ?? 0, readinessAmount(index)))}%</text>
              <text className="readiness-empty" x={x + 48} y="874" textAnchor="middle" opacity={1 - readinessAmount(index)}>–%</text>
            </g>;
          })}
          <g opacity={easeOut(progress(time, 14.6, 0.5)) * (1 - outro)}>
            <line x1="1046" y1="218" x2="1046" y2="908" />
            <text className="accent-text" x="1136" y="258" textAnchor="middle">Deixado na mesa</text>
            <text className="result" x="1136" y="424" textAnchor="middle">0,9 ano</text>
            <text x="1136" y="866" textAnchor="middle">de faturamento</text>
          </g>
        </g>

        <g className="maiq-conviction-side" opacity={1 - 0.45 * easeInOut(progress(time, 14.6, 0.8)) + 0.45 * easeInOut(progress(time, 18.7, 0.8))}>
          <rect x="1284" y="190" width="540" height="480" rx="20" />
          <text className="side-title" x="1554" y="252" textAnchor="middle">Dimensões do negócio</text>
          {[0.2, 0.4, 0.6, 0.8, 1].map((ring) => <polygon key={ring} className="radar-ring" points={polygonPoints(Array(6).fill(ring * 10))} />)}
          {['Dim. 01', 'Dim. 02', 'Dim. 03', 'Dim. 04', 'Dim. 05', 'Dim. 06'].map((label, index) => {
            const angle = (-90 + index * 60) * Math.PI / 180;
            return <text key={label} className="radar-label" x={1510 + 148 * Math.cos(angle)} y={518 + 148 * Math.sin(angle)} textAnchor="middle">{label}</text>;
          })}
          <polygon className="radar-value" points={polygonPoints(radarValues)} opacity={time >= 5.4 ? 1 - progress(time, 19.8, 0.2) : 0} />
          <rect x="1284" y="694" width="540" height="256" rx="20" />
          <circle className="milestone-icon" cx="1372" cy="822" r="40" />
          <path className="milestone-mark" d="M1355 826l13 13 23-30" />
          <text className="milestone-kicker" x="1432" y="800">{MILESTONES[milestoneIndex]?.[0]}</text>
          <text className="milestone-title" x="1432" y="842">{MILESTONES[milestoneIndex]?.[1]}</text>
        </g>
      </g>
    </svg>
  );
}

export default function ConvictionScene() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotionRef.current) setPlaying(true);
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.12 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) { lastRef.current = null; return; }
    let frame = 0;
    const tick = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const next = Math.min(DURATION, timeRef.current + (now - lastRef.current) / 1000);
      lastRef.current = now;
      timeRef.current = next;
      setTime(next);
      if (next >= DURATION) { setPlaying(false); return; }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, visible]);

  const seek = (delta: number) => {
    const next = Math.max(0, Math.min(DURATION, timeRef.current + delta));
    timeRef.current = next;
    lastRef.current = null;
    setTime(next);
    if (next >= DURATION) setPlaying(false);
  };

  const toggle = () => {
    if (timeRef.current >= DURATION) {
      timeRef.current = 0;
      setTime(0);
      lastRef.current = null;
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  };

  return (
    <div ref={rootRef} className="maiq-conviction-player">
      <ConvictionArtwork time={time} />
      <div className="maiq-conviction-controls" aria-label="Controles da animação">
        <TimeButton direction="back" onClick={() => seek(-5)} />
        <PlaybackButton playing={playing && visible} value={time / DURATION} onClick={toggle} />
        <TimeButton direction="forward" onClick={() => seek(5)} />
      </div>
    </div>
  );
}
