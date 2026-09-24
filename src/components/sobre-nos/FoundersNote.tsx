import assinaturaEnzo from '@/assets/assinatura-enzo-rodrigues.png';
import assinaturaNicolas from '@/assets/assinatura-nicolas-bernard.png';

type Founder = {
  name: string;
  role: string;
  signature: string;
  ariaLabel: string;
  aspectRatio: string;
};

const FOUNDERS: Founder[] = [
  {
    name: 'Enzo Rodrigues',
    role: 'Business',
    signature: assinaturaEnzo,
    ariaLabel: 'Assinatura de Enzo Rodrigues',
    aspectRatio: '227 / 71',
  },
  {
    name: 'Nicolas Bernard',
    role: 'Digital',
    signature: assinaturaNicolas,
    ariaLabel: 'Assinatura de Nicolas Bernard',
    aspectRatio: '227 / 83',
  },
];

/**
 * Seção "Uma nota dos fundadores": manifesto entre aspas decorativas e as
 * assinaturas, usadas como máscara sobre a cor de texto do tema.
 */
export default function FoundersNote() {
  return (
    <section className="maiq-about-section" aria-labelledby="sobre-nos-fundadores">
      <h2 id="sobre-nos-fundadores" className="maiq-about-title">
        Uma nota dos fundadores
      </h2>

      <blockquote className="maiq-about-quote">
        <span className="maiq-about-quote-mark maiq-about-quote-mark--open" aria-hidden="true">
          “
        </span>
        <p className="maiq-about-quote-lead">
          A empresa que só cresce de forma orgânica pode estar limitando o próprio futuro.
        </p>
        <p className="maiq-about-quote-p">
          Um M&amp;A pode incorporar competências que levariam décadas para serem construídas
          internamente. Ainda assim, a maioria das médias empresas trata o tema como evento
          pontual, uma possibilidade específica, sem preparação ou olhar coerente de longo prazo.
        </p>
        <p className="maiq-about-quote-p">
          Isso ajuda a explicar o alto índice de falhas em fusões e aquisições.
        </p>
        <p className="maiq-about-quote-p">
          O problema raramente está na negociação. Está na ausência de uma tese clara, na baixa
          prontidão da organização, na avaliação limitada das opções e na condução fragmentada do
          processo. Porque o M&amp;A não termina na assinatura de um contrato. É a partir dele que
          começa o trabalho decisivo de captura de valor.
        </p>
        <p className="maiq-about-quote-highlight">
          O Maiq existe para transformar essa capacidade de crescimento dos clientes e parceiros.
        </p>
        <p className="maiq-about-quote-p">
          Somos um hub de fusões e aquisições dedicado às médias empresas. Combinamos método,
          tecnologia e conhecimento multidisciplinar para sistematizar o processo de M&amp;A,
          reduzir incertezas e aumentar a probabilidade de sucesso em cada etapa do desenho de uma
          transação até a integração efetiva das estruturas.
        </p>
        <p className="maiq-about-quote-p">
          Enxergamos a expansão inorgânica como competência permanente de gestão. Uma disciplina
          contínua que deve ser desenvolvida e incorporada à estratégia da empresa. Acreditamos
          que a construção de valor só é verdadeiramente favorecida quando há uma visão holística
          sobre a evolução do negócio.
        </p>
        <span className="maiq-about-quote-mark maiq-about-quote-mark--close" aria-hidden="true">
          ”
        </span>
      </blockquote>

      <div className="maiq-about-founders">
        <span className="maiq-about-founders-label">Fundadores</span>
        {FOUNDERS.map((founder) => (
          <div key={founder.name} className="maiq-about-founder">
            <div
              className="maiq-about-founder-signature"
              role="img"
              aria-label={founder.ariaLabel}
              style={{
                aspectRatio: founder.aspectRatio,
                WebkitMaskImage: `url(${founder.signature})`,
                maskImage: `url(${founder.signature})`,
              }}
            />
            <div className="maiq-about-founder-meta">
              <span className="maiq-about-founder-name">{founder.name}</span>
              <span className="maiq-about-founder-role">{founder.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
