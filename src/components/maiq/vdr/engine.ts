// Ported from animations-v3.jsx — a minimal, typed subset of the
// continuous-composition timeline engine needed by VdrScene/VdrEmbed.
// Dropped vs. the original: the playback bar, host video-export seek
// protocol, localStorage persistence, watercolor helpers, Shot/Captions,
// and the "unknown cue" preview badge — none of those are exercised by
// the VDR scene, which only needs {T, CUES, authoredTotal} driven by a
// looping requestAnimationFrame clock.
import { useEffect, useRef, useState } from 'react';

export type Ease = (t: number) => number;

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
export const Easing = {
  linear: (t: number) => t,

  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },

  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeOutBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core interpolation helpers ──────────────────────────────────────────────

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function interpolate(
  input: number[],
  output: number[],
  ease: Ease | Ease[] = Easing.linear
): (t: number) => number {
  return (t: number) => {
    if (t <= input[0]!) return output[0]!;
    if (t >= input[input.length - 1]!) return output[output.length - 1]!;
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i]! && t <= input[i + 1]!) {
        const span = input[i + 1]! - input[i]!;
        const local = span === 0 ? 0 : (t - input[i]!) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i]! + (output[i + 1]! - output[i]!) * eased;
      }
    }
    return output[output.length - 1]!;
  };
}

export interface AnimateOpts {
  from?: number;
  to?: number;
  start?: number;
  end?: number;
  ease?: Ease;
}

export function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic,
}: AnimateOpts): (t: number) => number {
  return (t: number) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Scene schedule (derived from OM_SCENES) ─────────────────────────────────

export interface SceneEntry {
  name: string;
  dur: number;
  desc?: string;
  /** authored-length anchor; defaults to dur when absent */
  nat?: number;
}

export interface Section {
  name: string;
  playStart: number;
  dur: number;
  authStart: number;
  nat: number;
}

export interface DerivedSchedule {
  sections: Section[];
  table: Record<string, number>;
  total: number;
  authoredTotal: number;
}

export function deriveSchedule(scenes: SceneEntry[]): DerivedSchedule {
  let playStart = 0;
  let authStart = 0;
  const sections: Section[] = [];
  const table: Record<string, number> = Object.create(null);
  for (const s of scenes) {
    const nat = typeof s.nat === 'number' && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur;
    sections.push({ name: s.name, playStart, dur: s.dur, authStart, nat });
    if (!Object.prototype.hasOwnProperty.call(table, s.name)) {
      table[s.name] = Math.round(authStart * 1000) / 1000;
    }
    playStart += s.dur;
    authStart += nat;
  }
  return {
    sections,
    table,
    total: Math.round(playStart * 1000) / 1000,
    authoredTotal: Math.round(authStart * 1000) / 1000,
  };
}

// Warps wall/playback time `t` into authored time T, per the section the
// playhead currently sits in (a retimed section replays its authored slice
// over its new playback length).
export function warpTime(d: DerivedSchedule, t: number): number {
  const ss = d.sections;
  if (ss.length === 0) return 0;
  let idx = ss.length - 1;
  for (let i = 0; i < ss.length; i++) {
    if (t < ss[i]!.playStart + ss[i]!.dur) {
      idx = i;
      break;
    }
  }
  const s = ss[idx]!;
  const local = Math.min(Math.max(t - s.playStart, 0), s.dur);
  const T = s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0);
  return Math.min(T, d.authoredTotal);
}

// ── Composition clock hook ───────────────────────────────────────────────
// A self-contained replacement for <CompositionStage>+<Stage>+useComposition:
// owns a looping requestAnimationFrame clock and exposes the composition
// state VdrScene needs. SSR-safe: nothing touches window/document outside
// the effect.

export interface CompositionState {
  /** authored seconds — key all choreography to this */
  T: number;
  /** section name -> authored start time */
  CUES: Record<string, number>;
  /** raw playback-clock seconds (0..duration) */
  time: number;
  duration: number;
  authoredTotal: number;
  playing: boolean;
}

export interface UseCompositionOpts {
  loop?: boolean;
  autoplay?: boolean;
  /** bump to seek back to 0 and resume playback */
  resetSignal?: number;
}

export function useComposition(
  scenes: SceneEntry[],
  { loop = true, autoplay = true, resetSignal = 0 }: UseCompositionOpts = {}
): CompositionState {
  const derived = deriveSchedule(scenes);
  const duration = derived.total;

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(autoplay);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const resetRef = useRef(resetSignal);

  useEffect(() => {
    if (resetRef.current === resetSignal) return;
    resetRef.current = resetSignal;
    lastTsRef.current = null;
    setTime(0);
    setPlaying(true);
  }, [resetSignal]);

  useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) {
            next = duration > 0 ? next % duration : 0;
          } else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  const T = warpTime(derived, time);

  return {
    T,
    CUES: derived.table,
    time,
    duration,
    authoredTotal: derived.authoredTotal,
    playing,
  };
}
