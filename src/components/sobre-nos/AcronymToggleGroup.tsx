import { useEffect, useRef, type ReactNode } from 'react';

import type { AcronymIndex } from './IdentityMark';

type Card = {
  acronym: string;
  name: ReactNode;
  description: string;
};

const CARDS: Card[] = [
  {
    acronym: 'MA',
    name: (
      <>
        <em>M</em>ergers &amp; <em>A</em>cquisitions
      </>
    ),
    description: 'Nossa expertise e foco central.',
  },
  {
    acronym: 'AI',
    name: (
      <>
        <em>A</em>rtificial <em>I</em>ntelligence
      </>
    ),
    description: 'Nossa ferramenta e nova fronteira de oportunidades.',
  },
  {
    acronym: 'IQ',
    name: (
      <>
        <em>I</em>ntelligence <em>Q</em>uotient
      </>
    ),
    description: 'Nossa obstinação por conhecimento multidisciplinar.',
  },
];

type AcronymToggleGroupProps = {
  active: AcronymIndex;
  onSelect: (index: AcronymIndex) => void;
  onMobileSelect: (index: AcronymIndex) => void;
  onHover: (index: AcronymIndex) => void;
  onHoverEnd: () => void;
};

/**
 * Três cards MA/AI/IQ. Fidelidade literal ao protótipo: a seleção acontece
 * por hover (e clique), e não pelo padrão `role="group"`/`aria-pressed` que
 * seria mais acessível — troca consciente registrada no ADR 0002.
 */
export default function AcronymToggleGroup({ active, onSelect, onMobileSelect, onHover, onHoverEnd }: AcronymToggleGroupProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 760px)').matches) return;
    cardsRef.current[active]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  useEffect(() => () => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  const handleScroll = () => {
    if (!window.matchMedia('(max-width: 760px)').matches || scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const track = trackRef.current;
      if (!track) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest: AcronymIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (distance < nearestDistance) {
          nearest = index as AcronymIndex;
          nearestDistance = distance;
        }
      });
      if (nearest !== active) onMobileSelect(nearest);
    });
  };

  return (
    <div className="maiq-about-carousel">
      <div ref={trackRef} className="maiq-about-cards" role="tablist" aria-label="Acrônimos do nome Maiq" onScroll={handleScroll}>
        {CARDS.map((card, index) => {
          const acronymIndex = index as AcronymIndex;
          const selected = acronymIndex === active;
          return (
            <button
              key={card.acronym}
              ref={(node) => { cardsRef.current[index] = node; }}
              type="button"
              role="tab"
              aria-selected={selected}
              className="maiq-about-card"
              onClick={() => onSelect(acronymIndex)}
              onMouseEnter={() => onHover(acronymIndex)}
              onMouseLeave={onHoverEnd}
            >
              <span className="maiq-about-card-acronym">{card.acronym}</span>
              <span className="maiq-about-card-body">
                <span className="maiq-about-card-name">{card.name}</span>
                <span className="maiq-about-card-desc">{card.description}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="maiq-about-carousel-dots" aria-label="Selecionar acrônimo">
        {CARDS.map((card, index) => (
          <button
            key={card.acronym}
            type="button"
            aria-label={`Exibir ${card.acronym}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => onSelect(index as AcronymIndex)}
          />
        ))}
      </div>
    </div>
  );
}
