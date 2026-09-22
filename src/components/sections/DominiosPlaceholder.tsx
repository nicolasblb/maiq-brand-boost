import { useEffect, useRef, useState } from 'react';
import logoAbc from '@/assets/logo-abc.png.asset.json';
import logoBradesco from '@/assets/logo-bradesco.png.asset.json';
import logoDeloitte from '@/assets/logo-deloitte.png.asset.json';
import logoFalconi from '@/assets/logo-falconi.png.asset.json';
import logoPwc from '@/assets/logo-pwc.png.asset.json';
import logoThomsonReuters from '@/assets/logo-thomson-reuters.png.asset.json';

const COMPANIES = [
  { name: 'Falconi', src: logoFalconi.url },
  { name: 'Deloitte', src: logoDeloitte.url },
  { name: 'PwC', src: logoPwc.url },
  { name: 'Bradesco', src: logoBradesco.url },
  { name: 'Banco ABC', src: logoAbc.url },
  { name: 'Thomson Reuters', src: logoThomsonReuters.url },
];

function LogoGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="maiq-team-logo-group" aria-hidden={duplicate || undefined}>
      {COMPANIES.map((company) => (
        <div className="maiq-team-logo" key={company.name}>
          <img
            src={company.src}
            alt={duplicate ? '' : company.name}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

export default function DominiosPlaceholder() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '10% 0px', threshold: 0.08 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-maiq-sec="dominios"
      aria-labelledby="dominios-title"
      className="maiq-dominios-placeholder"
    >
      <div className="maiq-dominios-placeholder-inner">
        <header className="maiq-team-heading">
          <h2 id="dominios-title">Nosso Time</h2>
          <p className="maiq-section-subhead">
            Empresas que nossos especialistas<span className="maiq-team-subhead-break" aria-hidden="true" />tiveram experiência
          </p>
        </header>

        <div className="maiq-team-marquee" aria-label="Empresas onde nossos especialistas tiveram experiência">
          <div className="maiq-team-logo-track" data-active={isVisible}>
            <LogoGroup />
            <LogoGroup duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}