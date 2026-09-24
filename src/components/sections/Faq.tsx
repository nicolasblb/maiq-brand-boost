import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import MaiqButton from '@/components/maiq/MaiqButton';

const FAQ_ITEMS = [
  {
    question: 'Para quais empresas a Maiq é indicada?',
    answer:
      'Atuamos com médias empresas que enxergam fusões e aquisições como parte de uma estratégia contínua de crescimento, consolidação ou sucessão.',
  },
  {
    question: 'Em quais etapas de M&A a Maiq atua?',
    answer:
      'Acompanhamos toda a jornada: definição da tese, originação de oportunidades, avaliação, negociação, diligência e preparação para a integração.',
  },
  {
    question: 'Como a tecnologia participa do processo?',
    answer:
      'Nossa plataforma organiza dados, documentos e análises em um ambiente seguro, dando mais clareza às decisões sem substituir o julgamento dos especialistas.',
  },
  {
    question: 'As informações da empresa ficam protegidas?',
    answer:
      'Sim. O acesso às informações é controlado por etapa e por participante, seguindo práticas de confidencialidade adequadas a processos de M&A.',
  },
  {
    question: 'Como começar uma conversa com a Maiq?',
    answer:
      'Envie seus dados pelo formulário de contato. Nossa equipe fará uma conversa inicial para entender o contexto, os objetivos e o momento da sua empresa.',
  },
];

type FaqProps = {
  onContact: () => void;
};

export default function Faq({ onContact }: FaqProps) {
  const [openIndex, setOpenIndex] = useState(-1);
  const sectionId = useId();

  return (
    <section id="faq" aria-labelledby={`${sectionId}-title`} className="maiq-faq">
      <div className="maiq-faq-inner">
        <div className="maiq-faq-intro">
          <h2 id={`${sectionId}-title`}>FAQ</h2>
          <p className="maiq-faq-sub maiq-section-subhead">
            Respostas às perguntas frequentes{' '}
            <br className="maiq-faq-sub-break" />
            sobre a atuação do Maiq
          </p>
          <MaiqButton type="button" variant="primary" size="md" className="maiq-faq-contact" onClick={onContact}>
            Envie sua dúvida
            <span aria-hidden="true">→</span>
          </MaiqButton>
        </div>

        <div className="maiq-faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `${sectionId}-answer-${index}`;
            const triggerId = `${sectionId}-trigger-${index}`;

            return (
              <article className="maiq-faq-item" data-open={isOpen} key={item.question}>
                <MaiqButton
                  id={triggerId}
                  type="button"
                  variant="ghost"
                  className="maiq-faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className="maiq-faq-icon" aria-hidden="true">
                    {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                  </span>
                </MaiqButton>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="maiq-faq-answer"
                  data-visible={isOpen}
                >
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}