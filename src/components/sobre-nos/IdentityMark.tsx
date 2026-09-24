import logoBranco from '@/assets/logo-maiq-branco.png';

export type AcronymIndex = 0 | 1 | 2;

// Recortes calculados a partir dos limites das letras no PNG da logo (% da
// largura): m 0–41.5, a 44.4–67.3, i 70–74.4, q 77–100 — ver
// design_handoff_identidade_maiq/README.md.
const CLIP_PATHS: Record<AcronymIndex, string> = {
  0: 'inset(0 31.3% 0 0)',
  1: 'inset(0 24.3% 0 42.9%)',
  2: 'inset(0 0 0 68.7%)',
};

const INDICATOR_POSITIONS: Record<AcronymIndex, { left: string; width: string }> = {
  0: { left: '0%', width: '67.3%' },
  1: { left: '44.4%', width: '30%' },
  2: { left: '70%', width: '30%' },
};

type IdentityMarkProps = {
  active: AcronymIndex;
};

/**
 * Wordmark da Maiq usada como máscara: uma camada apagada de base e uma
 * camada em destaque recortada por `clip-path`, revelando só o par de letras
 * do acrônimo ativo (MA/AI/IQ). A barra abaixo espelha o mesmo estado.
 */
export default function IdentityMark({ active }: IdentityMarkProps) {
  const indicator = INDICATOR_POSITIONS[active];

  return (
    <div className="maiq-about-logo" role="img" aria-label="Logo Maiq">
      <div className="maiq-about-logo-frame">
        <div
          className="maiq-about-logo-base"
          style={{ WebkitMaskImage: `url(${logoBranco})`, maskImage: `url(${logoBranco})` }}
        />
        <div
          className="maiq-about-logo-highlight"
          style={{
            WebkitMaskImage: `url(${logoBranco})`,
            maskImage: `url(${logoBranco})`,
            clipPath: CLIP_PATHS[active],
          }}
        />
      </div>
      <div className="maiq-about-logo-track">
        <div
          className="maiq-about-logo-indicator"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>
    </div>
  );
}
