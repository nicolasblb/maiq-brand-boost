import { useCallback, useEffect, useRef, useState } from 'react';

export type MaiqTheme = 'noite' | 'claro';

const STORAGE_KEY = 'maiq-theme';
const BG_NOITE = '#0F2B2A';
const BG_CLARO = '#EEE0D4';

// Preferência salva > horário do visitante (6h–18h = diurno). Extraído de
// PaginaInstitucional.tsx, que já usava esta mesma heurística.
function heuristicaHoraria(): MaiqTheme {
  const hora = new Date().getHours();
  return hora >= 6 && hora < 18 ? 'claro' : 'noite';
}

function pintarFundo(theme: MaiqTheme) {
  // Evita o flash de fundo fora do escopo [data-maiq-scope] antes do CSS assumir.
  document.body.style.background = theme === 'claro' ? BG_CLARO : BG_NOITE;
}

/**
 * Fonte única do tema Maiq. Não escreve `data-theme` no DOM — quem consome o
 * hook decide onde aplicar (`data-theme={dia ? 'claro' : undefined}` no
 * elemento com `data-maiq-scope`).
 *
 * A leitura de `localStorage` acontece dentro de um efeito, não no
 * inicializador do `useState`, para não causar mismatch de hidratação no SSR.
 */
export function useMaiqTheme() {
  const [theme, setTheme] = useState<MaiqTheme>('noite');
  const themeRef = useRef<MaiqTheme>('noite');
  // false até a preferência salva/heurística ser aplicada (primeiro efeito). Permite
  // a quem depende do tema real — ex.: qual vídeo baixar — esperar em vez de
  // agir sobre o 'noite' provisório do SSR.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* localStorage indisponível (modo privado, SSR etc.) — segue com a heurística */
    }
    const inicial: MaiqTheme = saved === 'claro' || saved === 'noite' ? saved : heuristicaHoraria();
    themeRef.current = inicial;
    setTheme(inicial);
    setReady(true);
    pintarFundo(inicial);
  }, []);

  const toggleTheme = useCallback(() => {
    const proximo: MaiqTheme = themeRef.current === 'claro' ? 'noite' : 'claro';
    themeRef.current = proximo;
    setTheme(proximo);
    pintarFundo(proximo);
    try {
      localStorage.setItem(STORAGE_KEY, proximo);
    } catch {
      /* localStorage indisponível — a preferência só não persiste entre sessões */
    }
  }, []);

  return { theme, dia: theme === 'claro', ready, toggleTheme };
}
