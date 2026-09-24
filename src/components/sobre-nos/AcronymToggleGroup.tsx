import type { ReactNode } from 'react';

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
  onHover: (index: AcronymIndex) => void;
  onHoverEnd: () => void;
};

/**
 * Três cards MA/AI/IQ. Fidelidade literal ao protótipo: a seleção acontece
 * por hover (e clique), e não pelo padrão `role="group"`/`aria-pressed` que
 * seria mais acessível — troca consciente registrada no ADR 0002.
 */
export default function AcronymToggleGroup({ active, onSelect, onHover, onHoverEnd }: AcronymToggleGroupProps) {
  return (
    <div className="maiq-about-cards" role="tablist" aria-label="Acrônimos do nome Maiq">
      {CARDS.map((card, index) => {
        const acronymIndex = index as AcronymIndex;
        const selected = acronymIndex === active;
        return (
          <button
            key={card.acronym}
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
  );
}
