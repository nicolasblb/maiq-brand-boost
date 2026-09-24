import { useEffect, useRef, useState } from 'react';
import abcDia from '@/assets/logos/banco-abc-brasil-dia.webp';
import abcNoite from '@/assets/logos/banco-abc-brasil-noite.webp';
import bradescoDia from '@/assets/logos/bradesco-dia.webp';
import bradescoNoite from '@/assets/logos/bradesco-noite.webp';
import deloitteDia from '@/assets/logos/deloitte-dia.webp';
import deloitteNoite from '@/assets/logos/deloitte-noite.webp';
import falconiDia from '@/assets/logos/falconi-dia.webp';
import falconiNoite from '@/assets/logos/falconi-noite.webp';
import pwcDia from '@/assets/logos/pwc-dia.webp';
import pwcNoite from '@/assets/logos/pwc-noite.webp';
import thomsonDia from '@/assets/logos/thomson-reuters-dia.webp';
import thomsonNoite from '@/assets/logos/thomson-reuters-noite.webp';

// Cada logo tem uma versão por tema (branca no noturno, original no diurno);
// o CSS mostra só a do tema ativo. Sem loading="lazy" de propósito: dentro do
// marquee (overflow:hidden) a logo só entraria em carregamento ao deslizar para
// a área visível, piscando vazia. As 12 versões somam ~47 KB, em prioridade baixa.
const COMPANIES = [
  { name: 'Falconi', noite: falconiNoite, dia: falconiDia },
  { name: 'Deloitte', noite: deloitteNoite, dia: deloitteDia },
  { name: 'PwC', noite: pwcNoite, dia: pwcDia },
  { name: 'Bradesco', noite: bradescoNoite, dia: bradescoDia },
  { name: 'Banco ABC Brasil', noite: abcNoite, dia: abcDia },
  { name: 'Thomson Reuters', noite: thomsonNoite, dia: thomsonDia, wide: true },
];

function LogoGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="maiq-team-logo-group" aria-hidden={duplicate || undefined}>
      {COMPANIES.map((company) => (
        <div className={`maiq-team-logo${company.wide ? ' maiq-team-logo--tr' : ''}`} key={company.name}>
          <img
            className="maiq-team-logo-noite"
            src={company.noite}
            alt={duplicate ? '' : company.name}
            fetchPriority="low"
            decoding="async"
          />
          <img
            className="maiq-team-logo-dia"
            src={company.dia}
            alt={duplicate ? '' : company.name}
            fetchPriority="low"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

// Faixa de logos que fechava "Nosso Time" — realocada para o fim de
// Nossa Convicção (ver ADR 0002, escopo 2). Mecanismo inalterado: o
// IntersectionObserver liga/desliga a animação contínua via data-active
// conforme a faixa entra/sai da viewport.
export default function TeamMarquee() {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '10% 0px', threshold: 0.08 },
    );
    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={bandRef} className="maiq-team-band">
      <p id="team-marquee-label" className="maiq-team-band-label">
        Experiências de nossos especialistas<span className="maiq-subhead-break maiq-subhead-break-team" aria-hidden="true" />
        que endossam este conceito
      </p>
      <span className="maiq-team-band-divider" aria-hidden="true" />
      <div className="maiq-team-marquee" aria-labelledby="team-marquee-label">
        <div className="maiq-team-logo-track" data-active={isVisible}>
          <LogoGroup />
          <LogoGroup duplicate />
        </div>
      </div>
    </div>
  );
}
