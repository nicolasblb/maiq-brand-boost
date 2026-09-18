import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [hiding, setHiding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let hideTimer = 0;
    let removeTimer = 0;

    const start = () => {
      hideTimer = window.setTimeout(() => {
        setHiding(true);
        removeTimer = window.setTimeout(() => setDone(true), 480);
      }, 220);
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    const safety = window.setTimeout(start, 6000);

    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(safety);
    };
  }, []);

  if (done) return null;

  return (
    <div className="maiq-loader" data-hiding={hiding} aria-hidden="true">
      <div className="maiq-loader-hero">
        <span className="maiq-loader-block maiq-loader-mark" />
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
