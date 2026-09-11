// Ported from vdr-embed.jsx — embeds the VDR scene into the page: no
// playback bar, no stage backdrop, no auto-scale (the host sizes the 1:1
// box and this component scales it with CSS to fill its parent).
import { useEffect, useRef, useState } from 'react';
import { VdrScene } from './VdrScene';

export interface VdrEmbedProps {
  accent?: string;
  showGhosts?: boolean;
}

export function VdrEmbed({ accent = '#91A398', showGhosts = true }: VdrEmbedProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onRestart = () => setRun((n) => n + 1);
    window.addEventListener('maiq-vdr-restart', onRestart);
    return () => window.removeEventListener('maiq-vdr-restart', onRestart);
  }, []);

  useEffect(() => {
    const root = ref.current, box = boxRef.current;
    if (!root || !box) return;
    const fit = () => {
      // preenche pelo maior lado; o excedente é cortado pelo overflow
      const s = Math.max(root.clientWidth, root.clientHeight) / 1080;
      box.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    if (!window.ResizeObserver) return;
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '120px', threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#143737' }}>
      <div ref={boxRef} style={{
        position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1080,
        transformOrigin: 'center', transform: 'translate(-50%, -50%)',
      }}>
        {visible ? <VdrScene accent={accent} showGhosts={showGhosts} resetSignal={run} /> : null}
      </div>
    </div>
  );
}

export default VdrEmbed;
