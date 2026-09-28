import { RotateCw, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

const MOBILE_PORTRAIT = '(max-width:760px) and (orientation:portrait)';

/** Aviso temporário somente na tela cheia do celular em pé. */
export default function OrientationHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_PORTRAIT);
    let timer: number | undefined;
    const update = () => {
      window.clearTimeout(timer);
      setVisible(query.matches);
      if (query.matches) timer = window.setTimeout(() => setVisible(false), 4000);
    };
    update();
    query.addEventListener('change', update);
    return () => {
      window.clearTimeout(timer);
      query.removeEventListener('change', update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="maiq-orientation-hint" role="status">
      <span className="maiq-orientation-hint-icon" aria-hidden="true">
        <RotateCw className="maiq-orientation-hint-arrow" size={31} strokeWidth={1.4} />
        <Smartphone className="maiq-orientation-hint-phone" size={19} strokeWidth={1.8} />
      </span>
      <span>Gire o aparelho</span>
    </div>
  );
}