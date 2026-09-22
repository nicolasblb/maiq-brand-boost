import { useEffect, useRef } from 'react';
import socioEnzo from '@/assets/socio-enzo.jpg.asset.json';
import socioNicolas from '@/assets/socio-nicolas.jpg.asset.json';
import logoFalconi from '@/assets/logo-falconi.png.asset.json';
import logoDeloitte from '@/assets/logo-deloitte.png.asset.json';
import logoPwc from '@/assets/logo-pwc.png.asset.json';
import logoBradesco from '@/assets/logo-bradesco.png.asset.json';
import logoAbc from '@/assets/logo-abc.png.asset.json';
import logoThomsonReuters from '@/assets/logo-thomson-reuters.png.asset.json';

const FOUNDERS = [
  { name: 'Enzo Braga Rodrigues', role: 'Business', initials: 'EB', src: socioEnzo.url as string | null },
  { name: 'Nicolas Bernard', role: 'Digital', initials: 'NB', src: socioNicolas.url as string | null },
];

const PARTNERS = [
  { name: 'Falconi', src: logoFalconi.url as string | null },
  { name: 'Deloitte', src: logoDeloitte.url as string | null },
  { name: 'PwC', src: logoPwc.url as string | null },
  { name: 'Bradesco', src: logoBradesco.url as string | null },
  { name: 'Banco ABC', src: logoAbc.url as string | null },
  { name: 'Thomson Reuters', src: logoThomsonReuters.url as string | null },
];

const QUOTE = {
  text: 'A empresa que só cresce de forma orgânica pode estar limitando o próprio futuro.',
  author: 'Enzo Rodrigues',
};

function FounderCard({ person, index }: { person: typeof FOUNDERS[0]; index: number }) {
  const hasPhoto = Boolean(person.src);
  return (
    <div
      data-dominio-reveal=""
      data-dominio-delay={index}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flex: '1 1 0',
        minWidth: '0',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '3 / 4',
          borderRadius: 'var(--radius-xl,24px)',
          border: '1px solid var(--p-hair,rgba(234,217,204,.14))',
          background: 'var(--p-chip-bg,rgba(234,217,204,.04))',
          overflow: 'hidden',
        }}
      >
        {hasPhoto ? (
          <img
            src={person.src!}
            alt={person.name}
            loading="lazy"
            decoding="async"
            width={600}
            height={800}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,var(--p-surface-inset,#113331),var(--p-surface-card,#1C5250))',
              color: 'var(--p-muted,#9FD6D2)',
              fontSize: 'clamp(40px,5vw,64px)',
              fontWeight: 600,
              letterSpacing: '-.02em',
            }}
          >
            {person.initials}
          </div>
        )}
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-core)',
            fontSize: 'var(--fs-h4,20px)',
            lineHeight: 1.3,
            fontWeight: 600,
            color: 'var(--p-text,#EAD9CC)',
          }}
        >
          {person.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-core)',
            fontSize: 'var(--fs-caption,13px)',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: 'var(--p-muted,#9FD6D2)',
            marginTop: '4px',
          }}
        >
          {person.role}
        </div>
      </div>
    </div>
  );
}

function PartnerLogo({ partner }: { partner: typeof PARTNERS[0] }) {
  const hasLogo = Boolean(partner.src);
  return (
    <div
      className="dominio-partner-logo"
      style={{
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '44px',
        padding: '0 28px',
        opacity: 0.55,
        transition: 'opacity 220ms cubic-bezier(.2,0,0,1),filter 220ms cubic-bezier(.2,0,0,1)',
      }}
      data-hover-style="opacity:1"
    >
      {hasLogo ? (
        <img
          src={partner.src!}
          alt={partner.name}
          loading="lazy"
          decoding="async"
          style={{ height: '28px', width: 'auto', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span
          style={{
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: 'var(--p-muted,#9FD6D2)',
            whiteSpace: 'nowrap',
          }}
        >
          {partner.name}
        </span>
      )}
    </div>
  );
}

export default function Dominio() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      sec.querySelectorAll('[data-dominio-reveal]').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const items = Array.prototype.slice.call(sec.querySelectorAll('[data-dominio-reveal]')) as HTMLElement[];
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 640ms cubic-bezier(.16,1,.3,1),transform 640ms cubic-bezier(.16,1,.3,1)';
    });

    let io: IntersectionObserver | null = null;
    const onEnter = () => {
      items.forEach((el, i) => {
        const delay = (parseInt(el.getAttribute('data-dominio-delay') || '0', 10) || 0) * 120 + i * 60;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
      });
      if (io) io.disconnect();
    };

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onEnter();
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(sec);

    return () => {
      if (io) io.disconnect();
    };
  }, []);

  // Marquee contínuo: duplica os filhos até preencher a largura visível.
  useEffect(() => {
    const track = marqueeRef.current;
    if (!track) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let cancelled = false;
    let raf: number | null = null;

    const start = () => {
      if (cancelled) return;
      const children = Array.from(track.children) as HTMLElement[];
      if (!children.length) return;
      const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      const span = children.reduce((w, n) => w + n.getBoundingClientRect().width + gap, 0) - gap;
      if (!span) return;

      const parent = track.parentElement!;
      const target = Math.min(parent.clientWidth + span * 2, 12000);
      // Duplica no máximo 8 vezes; sem esse teto uma medição de largura
      // inválida (imagem ainda sem layout) trava a aba num laço infinito.
      for (let i = 0; i < 8 && track.scrollWidth < target; i++) {
        const frag = document.createDocumentFragment();
        children.forEach((n) => frag.appendChild(n.cloneNode(true)));
        track.appendChild(frag);
      }

      let x = 0;
      let last = performance.now();
      const speed = 42; // px/s
      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        x -= speed * dt;
        if (x <= -span) x += span;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Espera as imagens carregarem antes de medir a largura dos logos.
    const imgs = Array.from(track.querySelectorAll('img'));
    if (imgs.length) {
      Promise.all(imgs.map((im) => im.decode().catch(() => undefined))).then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-maiq-sec="dominio"
      aria-label="O Domínio"
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: 'clamp(104px,13vh,150px) clamp(24px,5vw,48px) clamp(36px,4.5vh,64px)',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'clip',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <div data-dominio-reveal="" data-dominio-delay={0} style={{ marginBottom: 'clamp(40px,6vh,72px)' }}>
          <h2
            style={{
              fontFamily: "Inter,var(--font-core)",
              fontSize: 'clamp(38px,4.2vw,58px)',
              lineHeight: 1.04,
              letterSpacing: '-.022em',
              fontWeight: 600,
              margin: 0,
            }}
          >
            O Domínio
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--p-muted,#9FD6D2)',
              margin: '14px 0 0',
              maxWidth: '56ch',
              textWrap: 'pretty',
            }}
          >
            Conhecimento de quem vive o mercado de M&A, compartilhado com segurança e praticidade.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,clamp(280px,42%,480px)) minmax(0,1fr)',
            gap: 'clamp(32px,5vw,80px)',
            alignItems: 'start',
          }}
        >
          {/* Fotos dos sócios */}
          <div
            style={{
              display: 'flex',
              gap: 'clamp(16px,2.5vw,28px)',
              alignItems: 'flex-start',
            }}
          >
            {FOUNDERS.map((person, i) => (
              <FounderCard key={person.name} person={person} index={i} />
            ))}
          </div>

          {/* Citação + carrossel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(24px,3.5vh,40px)',
              paddingTop: 'clamp(0px,2vh,24px)',
              minWidth: 0,
            }}
          >
            <div data-dominio-reveal="" data-dominio-delay={1}>
              <div
                style={{
                  fontFamily: "Inter,var(--font-core)",
                  fontSize: 'clamp(28px,2.8vw,42px)',
                  lineHeight: 1.18,
                  letterSpacing: '-.018em',
                  fontWeight: 500,
                  color: 'var(--p-text,#EAD9CC)',
                  textWrap: 'pretty',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    color: 'var(--p-mark-1,#9FD6D2)',
                    fontSize: '1.15em',
                    lineHeight: 0.6,
                    marginRight: '0.12em',
                    verticalAlign: 'top',
                  }}
                >
                  “
                </span>
                {QUOTE.text}
                <span
                  style={{
                    display: 'inline-block',
                    color: 'var(--p-mark-1,#9FD6D2)',
                    fontSize: '1.15em',
                    lineHeight: 0.6,
                    marginLeft: '0.08em',
                    verticalAlign: 'bottom',
                  }}
                >
                  ”
                </span>
              </div>
              <div
                style={{
                  height: '1px',
                  width: '100%',
                  margin: 'clamp(24px,3.5vh,40px) 0',
                  background: 'linear-gradient(90deg, transparent 0%, var(--p-hair,rgba(234,217,204,.14)) 20%, var(--p-hair,rgba(234,217,204,.14)) 80%, transparent 100%)',
                  opacity: 0.65,
                }}
                aria-hidden="true"
              />
            </div>

            <div data-dominio-reveal="" data-dominio-delay={2}>
              <div
                style={{
                  fontSize: 'var(--fs-caption,13px)',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: 'var(--p-muted,#9FD6D2)',
                  marginBottom: 'clamp(24px,3.5vh,40px)',
                  textAlign: 'center',
                }}
              >
                Experiência com múltiplos líderes de mercado
              </div>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  maskImage: 'linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%)',
                }}
              >
                <div
                  ref={marqueeRef}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    width: 'max-content',
                    willChange: 'transform',
                  }}
                >
                  {PARTNERS.map((partner) => (
                    <PartnerLogo key={partner.name} partner={partner} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Logos monocromáticas pretas: invertemos para claro no tema noturno */
        .dominio-partner-logo img {
          filter: invert(1) brightness(1.05);
        }
        [data-theme="claro"] .dominio-partner-logo img {
          filter: none;
        }
        @media (max-width: 900px) {
          [aria-label="O Domínio"] > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          [aria-label="O Domínio"] > div > div:last-child > div:first-child {
            justify-content: center;
          }
        }
        @media (max-width: 520px) {
          [aria-label="O Domínio"] > div > div:last-child > div:first-child {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
