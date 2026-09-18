import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [hiding, setHiding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let minimumTimer = 0;
    let safetyTimer = 0;
    let removeTimer = 0;
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

    const waitForFirstView = async () => {
      const minimum = new Promise<void>((resolve) => {
        minimumTimer = window.setTimeout(resolve, 850);
      });
      const pageReady = document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      await Promise.all([minimum, pageReady, fontsReady]);
      finish();
    };

    void waitForFirstView();
    safetyTimer = window.setTimeout(() => {
      if (!cancelled) {
        setHiding(true);
        document.documentElement.style.overflow = previousOverflow;
        removeTimer = window.setTimeout(() => setDone(true), 520);
      }
    }, 5000);

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = previousOverflow;
      window.history.scrollRestoration = previousRestoration;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div className="maiq-loader" data-hiding={hiding} aria-hidden="true">
      <div className="maiq-loader-hero">
        <span className="maiq-loader-mark">MAIQ</span>
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
