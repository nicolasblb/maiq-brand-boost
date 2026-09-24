import { useEffect, useState } from 'react';

import logoBranco from '@/assets/logo-maiq-branco.png';
import logoMadeira from '@/assets/logo-maiq-madeira.png';

export default function PageLoader() {
  const [hiding, setHiding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let minimumTimer = 0;
    let safetyTimer = 0;
    let removeTimer = 0;
    let raf1 = 0;
    let raf2 = 0;
    let cancelled = false;
    const previousOverflow = document.documentElement.style.overflow;
    const previousRestoration = window.history.scrollRestoration;

    document.documentElement.style.overflow = 'hidden';
    window.history.scrollRestoration = 'manual';
    if (!window.location.hash) window.scrollTo(0, 0);

    const finish = () => {
      if (cancelled) return;
      setHiding(true);
      document.documentElement.style.overflow = previousOverflow;
      removeTimer = window.setTimeout(() => setDone(true), 520);
    };

    // O conteúdo já vem completo no HTML do SSR — esperar `window.load`
    // (que também espera os vídeos abaixo da dobra) trava o primeiro paint
    // sem necessidade. Dois `requestAnimationFrame` bastam para garantir que
    // a hidratação já pintou o quadro antes de revelar.
    const waitForFirstView = async () => {
      const minimum = new Promise<void>((resolve) => {
        minimumTimer = window.setTimeout(resolve, 300);
      });
      const hydrated = new Promise<void>((resolve) => {
        raf1 = window.requestAnimationFrame(() => {
          raf2 = window.requestAnimationFrame(() => resolve());
        });
      });
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      await Promise.all([minimum, hydrated, fontsReady]);
      finish();
    };

    void waitForFirstView();
    safetyTimer = window.setTimeout(() => {
      if (!cancelled) {
        setHiding(true);
        document.documentElement.style.overflow = previousOverflow;
        removeTimer = window.setTimeout(() => setDone(true), 520);
      }
    }, 1500);

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = previousOverflow;
      window.history.scrollRestoration = previousRestoration;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(removeTimer);
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, []);

  if (done) return null;

  return (
    <div className="maiq-loader" data-hiding={hiding} aria-hidden="true">
      <div className="maiq-loader-hero">
        <span className="maiq-loader-mark">
          <img className="maiq-loader-logo maiq-loader-logo-night" src={logoBranco} alt="" />
          <img className="maiq-loader-logo maiq-loader-logo-day" src={logoMadeira} alt="" />
        </span>
        <span className="maiq-loader-block maiq-loader-overline" />
        <span className="maiq-loader-block maiq-loader-line-1" />
        <span className="maiq-loader-block maiq-loader-line-2" />
        <span className="maiq-loader-block maiq-loader-body" />
        <span className="maiq-loader-actions">
          <span className="maiq-loader-block maiq-loader-cta" />
          <span className="maiq-loader-block maiq-loader-cta maiq-loader-cta-ghost" />
        </span>
      </div>
    </div>
  );
}
