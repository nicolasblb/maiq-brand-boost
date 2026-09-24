import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FastForward, Maximize2, Minimize2, Pause, Play, RotateCw, Rewind } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import MaiqButton from '@/components/maiq/MaiqButton';
import videoEscuro from '@/assets/conviccao/valor-na-mesa-noite.mp4';
import videoClaro from '@/assets/conviccao/valor-na-mesa-claro.mp4';
import posterEscuro from '@/assets/conviccao/valor-na-mesa-noite-poster.jpg';
import posterClaro from '@/assets/conviccao/valor-na-mesa-claro-poster.jpg';

const DURATION = 20.5;
// Chave de sessão para a dica "Gire o aparelho" (fullscreen rotacionado do
// modal em celular portrait) não repetir a cada reabertura na mesma sessão.
const ROTATE_HINT_STORAGE_KEY = 'maiq-conviction-rotate-hint-seen';
const ROTATE_HINT_VISIBLE_MS = 2500;
const ROTATE_HINT_FADE_BUFFER_MS = 220;
const NARROW_PORTRAIT_QUERY = '(max-width:800px) and (orientation:portrait)';

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
  // Depois da primeira ampliação, os vídeos remontados (modal ao abrir, card ao
  // fechar) carregam com preload="auto": com "none" o loadedmetadata nunca
  // chega sozinho, e a transferência de tempo/reprodução ficava esperando —
  // o vídeo parava na capa.
  const [modalUsed, setModalUsed] = useState(false);
  const startedRef = useRef(false);
  const transferTimeRef = useRef(0);
  const previousThemeRef = useRef(light);
  const [rotateHintMounted, setRotateHintMounted] = useState(false);
  const [rotateHintShown, setRotateHintShown] = useState(false);
  // O vídeo do tema inativo só é montado depois da primeira troca real de
  // tema — evita reservar dois elementos <video> (e dois decoders) enquanto
  // o visitante nunca trocou de tema. `hasReadRef` distingue essa primeira
  // leitura (na montagem) de uma troca de verdade feita pelo usuário.
  const [secondThemeMounted, setSecondThemeMounted] = useState(false);

  // Os vídeos do modal são montados pelo portal do Radix uma renderização depois
  // de modalOpen virar true; os efeitos que dependem do elemento ativo precisam
  // rodar de novo quando ele aparece. mountTick muda a cada (des)montagem.
  const [mountTick, setMountTick] = useState(0);
  const assignVideo = (target: React.MutableRefObject<HTMLVideoElement | null>, el: HTMLVideoElement | null) => {
    if (target.current === el) return;
    target.current = el;
    setMountTick((value) => value + 1);
  };
  const bindDark = useCallback((el: HTMLVideoElement | null) => assignVideo(darkRef, el), []);
  const bindLight = useCallback((el: HTMLVideoElement | null) => assignVideo(lightRef, el), []);
  const bindModalDark = useCallback((el: HTMLVideoElement | null) => assignVideo(modalDarkRef, el), []);
  const bindModalLight = useCallback((el: HTMLVideoElement | null) => assignVideo(modalLightRef, el), []);

  const activeRef = useCallback(() => {
    if (modalOpen) return light ? modalLightRef.current : modalDarkRef.current;
    return light ? lightRef.current : darkRef.current;
    // mountTick: nova identidade quando um <video> monta/desmonta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [light, modalOpen, mountTick]);

  // tema da página (data-theme="claro" no escopo Maiq)
  useEffect(() => {
    const scope = rootRef.current?.closest('[data-maiq-scope]') ?? document.documentElement;
    setLight(scope.getAttribute('data-theme') === 'claro');
    // `useMaiqTheme` corrige o tema (heurística de horário/localStorage) num
    // efeito que roda logo após montar, o que também dispara este observer —
    // indistinguível de um toggle real só pelo evento em si. Uma folga de
    // 600ms cobre essa correção automática (acontece em 1-2 ciclos de efeito,
    // bem abaixo disso) sem risco de ignorar um toggle de verdade, que só
    // pode acontecer bem depois (o usuário precisa notar a página e clicar).
    let graceOver = false;
    const graceTimer = window.setTimeout(() => { graceOver = true; }, 600);
    const observer = new MutationObserver(() => {
      setLight(scope.getAttribute('data-theme') === 'claro');
      if (graceOver) setSecondThemeMounted(true);
    });
    observer.observe(scope, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      observer.disconnect();
      window.clearTimeout(graceTimer);
    };
  }, []);

  // sincroniza o tempo entre as duas versões apenas quando o tema muda
  const stateRef = useRef({ playing: false, visible: false });
  // Com o modal aberto o vídeo está na tela mesmo que o card (observado pelo
  // IntersectionObserver) não esteja.
  const onScreen = visible || modalOpen;
  stateRef.current = { playing, visible: onScreen };
  // A sincronização fica pendente até o vídeo do novo tema existir e ter
  // metadados — na primeira troca ele acabou de ser montado, e a remontagem
  // (mountTick) cancelaria o listener antes de o tempo ser aplicado.
  const pendingThemeTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (previousThemeRef.current !== light) {
      previousThemeRef.current = light;
      const other = modalOpen
        ? (light ? modalDarkRef.current : modalLightRef.current)
        : (light ? darkRef.current : lightRef.current);
      if (other) other.pause();
      pendingThemeTimeRef.current = other?.currentTime ?? activeRef()?.currentTime ?? null;
    }
    const sourceTime = pendingThemeTimeRef.current;
    if (sourceTime == null) return;
    const active = activeRef();
    if (!active) return;
    // Com `preload="none"`, o vídeo que acabou de ser montado pode ainda não
    // ter metadados — ajustar `currentTime` antes disso é aceito pelo
    // navegador, mas só surte efeito depois do `loadedmetadata`.
    const applyTime = () => {
      pendingThemeTimeRef.current = null;
      if (Math.abs(active.currentTime - sourceTime) > 0.05) active.currentTime = sourceTime;
      if (stateRef.current.playing && stateRef.current.visible) void active.play().catch(() => undefined);
    };
    if (active.readyState >= 1) {
      applyTime();
      return;
    }
    active.addEventListener('loadedmetadata', applyTime, { once: true });
    return () => active.removeEventListener('loadedmetadata', applyTime);
  }, [light, modalOpen, activeRef]);

  // Transfere o instante atual entre a exibição normal e a ampliada. Roda só
  // quando o modal abre/fecha: antes dependia também de playing/visible e, a
  // cada play, recolocava o vídeo no instante da abertura ("trecho aleatório").
  // O elemento de origem já foi desmontado aqui; o tempo vem de transferTimeRef,
  // gravado em setExpanded.
  // A transferência fica pendente (setExpanded) até o elemento de destino existir
  // e ter metadados; só então é consumida.
  const pendingTransferRef = useRef(false);
  useEffect(() => {
    if (!pendingTransferRef.current) return;
    const target = activeRef();
    if (!target) return;
    const startTime = transferTimeRef.current;
    const synchronize = () => {
      pendingTransferRef.current = false;
      if (Math.abs(target.currentTime - startTime) > 0.05) target.currentTime = startTime;
      if (stateRef.current.playing && stateRef.current.visible) void target.play().catch(() => undefined);
    };
    if (target.readyState >= 1) {
      synchronize();
      return;
    }
    target.addEventListener('loadedmetadata', synchronize, { once: true });
    return () => target.removeEventListener('loadedmetadata', synchronize);
  }, [activeRef]);


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
    if (playing && onScreen) void active.play().catch(() => undefined);
    else active.pause();
  }, [playing, onScreen, activeRef]);

  // progresso fluido
  useEffect(() => {
    if (!playing || !onScreen) return;
    let frame = 0;
    const tick = () => {
      const active = activeRef();
      if (active) setTime(active.currentTime);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, onScreen, activeRef]);

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

  const setExpanded = (expanded: boolean) => {
    transferTimeRef.current = activeRef()?.currentTime ?? time;
    pendingTransferRef.current = true;
    if (expanded) setModalUsed(true);
    setModalOpen(expanded);
  };

  // Dica "Gire o aparelho": só na primeira vez que o modal abre em celular
  // portrait (mesma condição da rotação CSS abaixo), e só uma vez por sessão.
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

  const duration = activeRef()?.duration || DURATION;

  const videoPair = (
    darkVideoRef: (el: HTMLVideoElement | null) => void,
    lightVideoRef: (el: HTMLVideoElement | null) => void,
  ) => (
    <>
      {!light || secondThemeMounted ? (
        <video
          ref={darkVideoRef}
          className="maiq-conviction-video"
          data-active={!light}
          poster={posterEscuro}
          muted
          playsInline
          preload={modalUsed ? 'auto' : 'none'}
          loop
          aria-label={light ? undefined : 'Animação Valor na mesa: comparação entre crescimento orgânico e crescimento com M&A'}
          aria-hidden={light ? 'true' : undefined}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        >
          <source src={videoEscuro} type="video/mp4" />
        </video>
      ) : null}
      {light || secondThemeMounted ? (
        <video
          ref={lightVideoRef}
          className="maiq-conviction-video"
          data-active={light}
          poster={posterClaro}
          muted
          playsInline
          preload={modalUsed ? 'auto' : 'none'}
          loop
          aria-label={light ? 'Animação Valor na mesa: comparação entre crescimento orgânico e crescimento com M&A' : undefined}
          aria-hidden={light ? undefined : 'true'}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        >
          <source src={videoClaro} type="video/mp4" />
        </video>
      ) : null}
    </>
  );

  const controls = (expanded: boolean) => (
    <div className="maiq-conviction-controls" aria-label="Controles da animação">
      <div className="maiq-conviction-controls-group">
        <TimeButton direction="back" onClick={() => seek(-5)} />
        <PlaybackButton playing={playing && onScreen} value={Math.min(1, time / duration)} onClick={toggle} />
        <TimeButton direction="forward" onClick={() => seek(5)} />
      </div>
      <MaiqButton
        variant="ghost"
        size="sm"
        className="maiq-media-icon-button"
        aria-label={expanded ? 'Reduzir vídeo' : 'Maximizar vídeo'}
        title={expanded ? 'Reduzir' : 'Maximizar'}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
      </MaiqButton>
    </div>
  );

  return (
    <div ref={rootRef} className="maiq-conviction-player-wrap">
      <div className="maiq-conviction-player">
        {!modalOpen ? videoPair(bindDark, bindLight) : null}
        {controls(false)}
      </div>

      <DialogPrimitive.Root open={modalOpen} onOpenChange={setExpanded}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="maiq-platform-modal-overlay" />
          <DialogPrimitive.Content className="maiq-conviction-modal" data-maiq-scope="" data-theme={light ? 'claro' : undefined}>
            <DialogPrimitive.Title className="maiq-platform-modal-title">Valor na mesa</DialogPrimitive.Title>
            <div className="maiq-conviction-modal-media">
              {modalOpen ? videoPair(bindModalDark, bindModalLight) : null}
              {controls(true)}
            </div>
            {rotateHintMounted ? (
              <div className="maiq-conviction-rotate-hint" data-visible={rotateHintShown} role="status">
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
