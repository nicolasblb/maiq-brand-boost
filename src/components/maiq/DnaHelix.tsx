import type { CSSProperties } from 'react';

/*
 * Hélice de DNA da interseção de "Nosso Modelo" (referência: referencias/nova-helix-dna).
 * Colunas de largura zero distribuídas por space-between; cada uma tem um degrau e dois
 * pontos (frente/trás) que sobem e descem em sentidos opostos. Tudo em `em` (font-size =
 * amplitude) e animado só com transform/opacity — keyframes e cores em maiq.css (.maiq-dna).
 * Nasce horizontal; o Venn desktop a gira 90° por CSS.
 */
type Props = {
  width: number; // px, comprimento da hélice
  amplitude: number; // px, deslocamento máximo do ponto a partir do eixo
  columns: number; // pares de bases
  turns?: number; // voltas completas ao longo do comprimento
  period?: number; // s, uma volta completa (maior = mais lento)
  className?: string;
};

export default function DnaHelix({ width, amplitude, columns, turns = 1, period = 3.2, className }: Props) {
  const cols = [];
  for (let i = 0; i < columns; i++) {
    // defasagem negativa (fração do período): a fase avança ao longo do eixo
    const style = { '--dna-d': `${(-(i * period * turns) / columns).toFixed(3)}s` } as CSSProperties;
    cols.push(
      <div key={i} className="maiq-dna-col" style={style}>
        <div className="maiq-dna-rung" />
        <div className="maiq-dna-dot maiq-dna-dot--front" />
        <div className="maiq-dna-dot maiq-dna-dot--back" />
      </div>,
    );
  }
  return (
    <div
      className={className ? `maiq-dna ${className}` : 'maiq-dna'}
      aria-hidden="true"
      style={{ width, height: amplitude * 2 + 8, fontSize: amplitude, '--dna-half': `${period / 2}s` } as CSSProperties}
    >
      {cols}
    </div>
  );
}
