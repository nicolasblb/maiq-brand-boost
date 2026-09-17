// Ported from vdr-scene.jsx — "Maiq — Sala de Dados (VDR)" — 1:1, 15s,
// continuous loop, no text.
import { type CSSProperties, type ReactElement } from 'react';
import {
  Scale,
  LineChart,
  Receipt,
  Users,
  FileSignature,
  Building,
  ShieldCheck,
  Gavel,
  Percent,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { Easing, animate, interpolate, useComposition } from './engine';
import { OM_SCENES } from './scenes';

const C = {
  deep: '#143737',
  deeper: '#0F2A2A',
  sand: '#E9E0D1',
  bot: '#33605A',
  mint: '#91A398',
  wood: '#68462B',
};
const FONT = 'Grandview, "Helvetica Neue", Helvetica, Arial, sans-serif';
const sand = (a: number) => `rgba(233,224,209,${a})`;
const mint = (a: number) => `rgba(145,163,152,${a})`;

const OUT = Easing.easeOutCubic;
const IO = Easing.easeInOutCubic;
const ease = (from: number, to: number, start: number, end: number, e?: (t: number) => number) =>
  animate({ from, to, start, end, ease: e || IO });

// canvas 1080; room 620x700 centered; 3x3 grid of 150x180 docs
const DW = 150, DH = 180;
const GX = [285, 465, 645];
const GY = [244, 450, 656];
const ROOM = { x: 230, y: 190, w: 620, h: 700, r: 18 };

interface DocDef {
  icon: LucideIcon[];
  ghosts: boolean;
  from: [number, number];
}

const DOCS: DocDef[] = [
  { icon: [Scale], ghosts: true, from: [-1, -0.6] },
  { icon: [LineChart], ghosts: true, from: [0, -1] },
  { icon: [Receipt], ghosts: false, from: [1, -0.7] },
  { icon: [Users], ghosts: false, from: [-1, 0.2] },
  { icon: [FileSignature], ghosts: true, from: [0, 1] },
  { icon: [Building], ghosts: false, from: [1, 0.1] },
  { icon: [ShieldCheck], ghosts: false, from: [-1, 0.8] },
  { icon: [Gavel], ghosts: false, from: [0.3, 1] },
  { icon: [Percent], ghosts: false, from: [1, 0.9] },
];

// per-doc content lines (0 = paragraph break)
const LINES: number[][] = [
  [0.92, 0.7, 0.84, 0, 0.9, 0.6, 0.78],
  [0.86, 0.64, 0.92, 0, 0.72, 0.88, 0.55],
  [0.9, 0.78, 0.6, 0, 0.84, 0.66, 0.9],
  [0.82, 0.9, 0.7, 0, 0.6, 0.86, 0.74],
  [0.9, 0.72, 0.86, 0, 0.64, 0.9, 0.7],
  [0.76, 0.88, 0.66, 0, 0.9, 0.62, 0.82],
  [0.88, 0.6, 0.9, 0, 0.78, 0.7, 0.86],
  [0.7, 0.9, 0.74, 0, 0.88, 0.58, 0.8],
  [0.9, 0.66, 0.8, 0, 0.7, 0.9, 0.62],
];
const SCATTER: [number, number, number][] = [
  [-22, 14, -4], [16, -18, 3], [24, 10, 5], [-18, -12, -3], [10, 16, 2],
  [20, -14, 4], [-24, -10, -5], [-12, 18, 3], [18, 12, -4],
];
const GHOSTS: [number, number, number][] = [[-30, 18, -7], [26, -14, 6]];

type ShapeKind = 'circle' | 'square' | 'diamond' | 'triangle';

interface NodeDef {
  shape: ShapeKind;
  x: number;
  y: number;
  label: string;
  reach: number[];
  lockAt?: number;
}

const NODES: NodeDef[] = [
  { shape: 'circle', x: 120, y: 268, label: 'Diretoria', reach: [2, 2, 2, 2, 2, 2, 2, 2, 2] },
  { shape: 'square', x: 960, y: 268, label: 'Financeiro', reach: [2, 2, 2, 1, 2, 1, 1, 1, 2] },
  { shape: 'diamond', x: 960, y: 812, label: 'Compradores', reach: [1, 0, 0, 0, 1, 1, 0, 1, 0], lockAt: 1 },
  { shape: 'triangle', x: 120, y: 812, label: 'Jurídico', reach: [0, 2, 2, 1, 0, 0, 0, 0, 1] },
];

interface EditDef {
  at: number;
  line: number;
  shape: ShapeKind;
  to: number;
}

const EDITS: EditDef[] = [
  { at: 8.7, line: 1, shape: 'square', to: 0.58 },
  { at: 9.9, line: 4, shape: 'circle', to: 0.86 },
  { at: 11.0, line: 5, shape: 'square', to: 0.52 },
];

function Icon({
  icon,
  size = 16,
  color = 'currentColor',
  style,
}: {
  icon: LucideIcon[];
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const Cmp = icon[0];
  if (!Cmp) return null;
  return (
    <Cmp
      width={size}
      height={size}
      color={color}
      strokeWidth={1.75}
      style={style}
    />
  );
}

function Shape({
  kind,
  size = 26,
  color,
  opacity = 1,
  style,
}: {
  kind: ShapeKind;
  size?: number;
  color: string;
  opacity?: number;
  style?: CSSProperties;
}) {
  const s = size, h = s / 2;
  const common = { fill: color, opacity };
  let el: ReactElement;
  if (kind === 'circle') el = <circle cx={h} cy={h} r={h} {...common} />;
  else if (kind === 'square') el = <rect x="0" y="0" width={s} height={s} rx="2" {...common} />;
  else if (kind === 'diamond') el = <polygon points={`${h},0 ${s},${h} ${h},${s} 0,${h}`} {...common} />;
  else el = <polygon points={`${h},0 ${s},${s} 0,${s}`} {...common} />;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={style}>
      {el}
    </svg>
  );
}

function docCenter(i: number): [number, number] {
  return [GX[i % 3]! + DW / 2, GY[Math.floor(i / 3)]! + DH / 2];
}

interface DocProps {
  i: number;
  T: number;
  cue: Record<string, number>;
  accent: string;
  showGhosts: boolean;
}

function Doc({ i, T, cue, accent, showGhosts }: DocProps) {
  const d = DOCS[i]!, gx = GX[i % 3]!, gy = GY[Math.floor(i / 3)]!;
  const st = 0.04 + i * 0.1;
  const p = ease(0, 1, st, st + 1.25, OUT)(T);
  const settle = ease(0, 1, 3.5, 4.25, IO)(T);
  const sc = SCATTER[i]!;
  const ex = d.from[0] * 760 * (1 - p), ey = d.from[1] * 760 * (1 - p);
  const x = gx + sc[0] * (1 - settle) + ex;
  const y = gy + sc[1] * (1 - settle) + ey;
  const rot = sc[2] * (1 - settle);

  // qual nó está ativo agora → escurece o que está fora do alcance
  const AL = cue['Alçadas']!;
  let dim = 1;
  NODES.forEach((n, k) => {
    const s0 = AL + 0.28 + k * 0.78;
    const on = Math.min(ease(0, 1, s0, s0 + 0.3)(T), ease(1, 0, s0 + 0.62, s0 + 0.85)(T));
    if (on > 0.02) { dim = 1 - 0.62 * on * (n.reach[i] === 0 ? 1 : 0); }
  });

  const resolved = ease(0, 1, cue['Prontidão']! + 0.2 + i * 0.12, cue['Prontidão']! + 0.62 + i * 0.12)(T);
  const isCenter = i === 4;
  const lockOn = (() => {
    const k = 2, s0 = AL + 0.28 + k * 0.78;
    if (NODES[k]!.lockAt !== i) return 0;
    return Math.min(ease(0, 1, s0 + 0.25, s0 + 0.5)(T), ease(1, 0, s0 + 0.7, s0 + 0.95)(T));
  })();

  const border = `1px solid ${resolved > 0.02 ? mint(0.22 + 0.5 * resolved) : sand(0.22)}`;

  return (
    <>
      {showGhosts && d.ghosts && GHOSTS.map((g, gi) => {
        const col = ease(1, 0, 3.45, 3.9)(T);
        return (
          <div key={gi} style={{
            position: 'absolute', left: x + g[0] * col, top: y + g[1] * col, width: DW, height: DH,
            border: `1px solid ${sand(0.13)}`, borderRadius: 10, background: sand(0.02),
            transform: `rotate(${rot + g[2] * col}deg)`, opacity: p * 0.55 * col, zIndex: 1,
          }} />
        );
      })}
      <div style={{
        position: 'absolute', left: x, top: y, width: DW, height: DH, boxSizing: 'border-box',
        border, borderRadius: 10,
        background: resolved > 0.02 ? `rgba(51,96,90,${0.26 * resolved})` : sand(0.04),
        transform: `rotate(${rot}deg)`, opacity: p * dim, padding: '13px 14px 0',
        zIndex: isCenter ? 4 : 2,
      }}>
        <Icon icon={d.icon} size={17} color={resolved > 0.3 ? mint(0.85) : sand(0.5)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 13 }}>
          {LINES[i]!.map((w, li) => {
            let wid = w;
            if (isCenter) {
              const e = EDITS.find((ed) => ed.line === li);
              if (e) {
                wid = w + (0 - w) * ease(0, 1, e.at, e.at + 0.3)(T)
                  + (e.to) * ease(0, 1, e.at + 0.34, e.at + 0.72)(T);
              }
            }
            if (w === 0) return <div key={li} style={{ height: 0, marginTop: 5 }} />;
            return <div key={li} style={{
              height: 4, width: `${Math.max(0, wid) * 100}%`, borderRadius: 1,
              background: sand(li % 3 === 1 ? 0.11 : 0.17),
            }} />;
          })}
        </div>
        {lockOn > 0.01 && (
          <div style={{
            position: 'absolute', right: 12, bottom: 12, opacity: lockOn,
            transform: `scale(${0.86 + 0.14 * lockOn})`,
          }}>
            <Icon icon={[Lock]} size={20} color={accent} />
          </div>
        )}
      </div>
    </>
  );
}

export interface VdrSceneProps {
  accent?: string;
  showGhosts?: boolean;
  playing?: boolean;
  time?: number;
  initialTime?: number;
  /** bump to seek back to the supplied initial time */
  resetSignal?: number;
  onProgress?: ((time: number, duration: number) => void) | undefined;
}

export function VdrScene({ accent = C.mint, showGhosts = true, playing = true, time: controlledTime, initialTime = 0, resetSignal = 0 }: VdrSceneProps) {
  const { T, CUES, authoredTotal } = useComposition(OM_SCENES, {
    loop: false,
    autoplay: true,
    playing,
    time: controlledTime,
    initialTime,
    resetSignal,
  });
  const AL = CUES['Alçadas']!, RA = CUES['Rastreabilidade']!, PR = CUES['Prontidão']!;
  const TT = authoredTotal;

  // câmera: afasta para revelar contexto, avança para revelar detalhe, sem corte
  const camScale = interpolate(
    [0, 2.4, AL + 0.4, RA + 1.5, RA + 3.6, PR + 0.6, TT - 1.0, TT - 0.4],
    [1.0, 1.05, 0.8, 2.85, 2.85, 0.8, 0.8, 1.0], IO)(T);
  const groupOpacity = ease(1, 0, TT - 1.1, TT - 0.4)(T);
  const groupScale = ease(1, 0.93, TT - 1.1, TT - 0.4)(T);

  const roomDraw = ease(0, 1, 2.5, 3.55)(T);
  const per = 2 * ((ROOM.w - 2 * ROOM.r) + (ROOM.h - 2 * ROOM.r)) + 2 * Math.PI * ROOM.r;

  const nodesIn = ease(0, 1, AL - 0.25, AL + 0.55, OUT)(T);
  const arcDraw = ease(0, 1, PR + 0.15, PR + 2.0)(T);

  const cursorEdit = EDITS.reduce<EditDef | null>((acc, e) => (T >= e.at - 0.35 ? e : acc), null);
  const cursorOn = Math.min(ease(0, 1, RA + 0.35, RA + 0.7)(T), ease(1, 0, RA + 3.3, RA + 3.7)(T));
  const cursorY = cursorEdit ? GY[1]! + 39 + cursorEdit.line * 12 : 0;
  const cursorX = GX[1]! + 26 + 60 * (cursorEdit ? cursorEdit.to : 0.5);

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.deep, fontFamily: FONT, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.7,
        background: 'radial-gradient(72% 58% at 50% 46%, rgba(51,96,90,0.5) 0%, rgba(51,96,90,0.14) 48%, rgba(20,55,55,0) 78%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0, opacity: groupOpacity,
        transform: `scale(${camScale * groupScale})`, transformOrigin: '50% 50%',
      }}>
        <svg width="1080" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {/* contorno da sala — traço único e contínuo */}
          <rect x={ROOM.x} y={ROOM.y} width={ROOM.w} height={ROOM.h} rx={ROOM.r}
            fill="none" stroke={sand(0.3)} strokeWidth="1.5"
            strokeDasharray={per} strokeDashoffset={per * (1 - roomDraw)} />

          {/* arco de prontidão — percorre o próprio contorno da sala */}
          <rect x={ROOM.x} y={ROOM.y} width={ROOM.w} height={ROOM.h} rx={ROOM.r}
            fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="butt"
            strokeDasharray={per} strokeDashoffset={per * (1 - arcDraw)}
            opacity={arcDraw > 0.001 ? 0.95 : 0} />

          {/* linhas de alçada */}
          {NODES.map((n, k) => {
            const s0 = AL + 0.28 + k * 0.78;
            const on = Math.min(ease(0, 1, s0, s0 + 0.34, OUT)(T), ease(1, 0, s0 + 0.62, s0 + 0.88)(T));
            if (on < 0.01) return null;
            return (
              <g key={k}>
                {n.reach.map((lv, i) => {
                  if (!lv) {
                    if (n.lockAt !== i) return null;
                    const [dx, dy] = docCenter(i);
                    const t = 0.72; // para na borda do documento
                    return <line key={i} x1={n.x} y1={n.y} x2={n.x + (dx - n.x) * t} y2={n.y + (dy - n.y) * t}
                      stroke={sand(0.14)} strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" opacity={on} />;
                  }
                  const [dx, dy] = docCenter(i);
                  const len = Math.hypot(dx - n.x, dy - n.y);
                  const grow = ease(0, 1, s0 + (k === 0 ? 0 : 0.04 * i), s0 + 0.34 + (k === 0 ? 0 : 0.04 * i), OUT)(T);
                  if (lv === 1) {
                    return <line key={i} x1={n.x} y1={n.y} x2={n.x + (dx - n.x) * grow} y2={n.y + (dy - n.y) * grow}
                      stroke={sand(0.34)} strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" opacity={on} />;
                  }
                  return <line key={i} x1={n.x} y1={n.y} x2={dx} y2={dy}
                    stroke={mint(0.72)} strokeWidth="1.5"
                    strokeDasharray={len} strokeDashoffset={len * (1 - grow)} opacity={on} />;
                })}
              </g>
            );
          })}
        </svg>

        {DOCS.map((_, i) => (
          <Doc key={i} i={i} T={T} cue={CUES} accent={accent} showGhosts={showGhosts} />
        ))}

        {/* nós de alçada */}
        {NODES.map((n, k) => {
          const s0 = AL + 0.28 + k * 0.78;
          const lit = Math.min(ease(0, 1, s0, s0 + 0.3)(T), ease(1, 0, s0 + 0.62, s0 + 0.9)(T));
          const size = 30;
          return (
            <div key={k} style={{
              position: 'absolute', left: n.x - 95, top: n.y - size / 2, width: 190,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              opacity: nodesIn * (0.45 + 0.55 * lit), zIndex: 5,
            }}>
              <div style={{ transform: `scale(${0.9 + 0.1 * lit})` }}>
                <Shape kind={n.shape} size={size} color={lit > 0.05 ? accent : sand(0.4)} />
              </div>
              <div style={{
                font: `500 20px/1 ${FONT}`, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                color: lit > 0.05 ? sand(0.62 + 0.32 * lit) : sand(0.52),
              }}>{n.label}</div>
            </div>
          );
        })}

        {/* legenda dos níveis de acesso */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 938,
          display: 'flex', justifyContent: 'center', gap: 56, zIndex: 5,
          opacity: Math.min(ease(0, 1, AL + 0.5, AL + 1.05, OUT)(T), ease(1, 0, AL + 3.1, AL + 3.5)(T)),
        }}>
          {[
            { label: 'Edição', dash: false },
            { label: 'Visualização', dash: true },
          ].map((it) => (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <svg width="66" height="4" viewBox="0 0 66 4">
                <line x1="0" y1="2" x2="66" y2="2"
                  stroke={it.dash ? sand(0.34) : mint(0.72)}
                  strokeWidth={it.dash ? 1 : 1.5}
                  strokeDasharray={it.dash ? '2 6' : undefined}
                  strokeLinecap={it.dash ? 'round' : 'butt'} />
              </svg>
              <span style={{ font: `500 20px/1 ${FONT}`, letterSpacing: '-0.01em', color: sand(0.72) }}>{it.label}</span>
            </div>
          ))}
        </div>

        {/* coluna de marcadores de versão */}
        <div style={{
          position: 'absolute', left: GX[1]! - 6, top: GY[1]! + 22, width: 13,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, zIndex: 6,
        }}>
          {EDITS.map((e, i) => {
            const p = ease(0, 1, e.at + 0.5, e.at + 0.9, OUT)(T);
            return (
              <div key={i} style={{ opacity: p, transform: `translateY(${10 * (1 - p)}px)` }}>
                <Shape kind={e.shape} size={13} color={accent} />
              </div>
            );
          })}
        </div>

        {/* cursor de edição, com a forma do autor */}
        {cursorOn > 0.01 && cursorEdit && (
          <div style={{
            position: 'absolute', left: cursorX, top: cursorY, opacity: cursorOn, zIndex: 6,
            transition: 'none',
          }}>
            <div style={{ width: 1.5, height: 15, background: C.sand }} />
            <div style={{ position: 'absolute', left: 6, top: -4 }}>
              <Shape kind={cursorEdit.shape} size={11} color={accent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VdrScene;
