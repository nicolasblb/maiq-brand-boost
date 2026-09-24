import { useEffect, useRef, useState } from 'react';

import AcronymToggleGroup from './AcronymToggleGroup';
import IdentityMark, { type AcronymIndex } from './IdentityMark';

const AUTOPLAY_MS = 3600;
const HOVER_RESUME_MS = 1000;

/**
 * Seção "Nossa Identidade": logo animada, pronúncia/gênero e os três cards
 * MA/AI/IQ. O autoplay avança o card ativo a cada 3600ms; clicar num card
 * pausa em definitivo (até recarregar a página), enquanto passar o mouse
 * sobre um card pausa apenas enquanto o hover dura, retomando 1s depois que
 * o mouse sai (só o hover nos cards conta para essa retomada). Respeita
 * `prefers-reduced-motion` desligando o autoplay de saída.
 */
export default function NossaIdentidade() {
  const [active, setActive] = useState<AcronymIndex>(0);
  const pausedRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      if (pausedRef.current || hoverPausedRef.current) return;
      setActive((current) => ((current + 1) % 3) as AcronymIndex);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const handleSelect = (index: AcronymIndex) => {
    pausedRef.current = true;
    setActive(index);
  };

  const handleHover = (index: AcronymIndex) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    hoverPausedRef.current = true;
    setActive(index);
  };

  const handleHoverEnd = () => {
    resumeTimerRef.current = setTimeout(() => {
      hoverPausedRef.current = false;
      resumeTimerRef.current = null;
    }, HOVER_RESUME_MS);
  };

  return (
    <section className="maiq-about-section" aria-labelledby="sobre-nos-identidade">
      <h2 id="sobre-nos-identidade" className="maiq-about-title">
        Nossa Identidade
      </h2>

      <div className="maiq-about-identity-row">
        <IdentityMark active={active} />

        <div className="maiq-about-meta">
          <div className="maiq-about-meta-col maiq-about-meta-col--pronuncia">
            <span className="maiq-about-meta-overline">Pronúncia</span>
            <span className="maiq-about-meta-value">“Mike”</span>
            <span className="maiq-about-meta-note">/maɪk/</span>
          </div>
          <div className="maiq-about-meta-col maiq-about-meta-col--genero">
            <span className="maiq-about-meta-overline">Gênero Gramatical</span>
            <span className="maiq-about-meta-value">Masculino</span>
            <span className="maiq-about-meta-note">O hub Maiq</span>
          </div>
        </div>
      </div>

      <AcronymToggleGroup
        active={active}
        onSelect={handleSelect}
        onHover={handleHover}
        onHoverEnd={handleHoverEnd}
      />
    </section>
  );
}
