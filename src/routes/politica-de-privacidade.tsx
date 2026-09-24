import { createFileRoute } from '@tanstack/react-router';

import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const Route = createFileRoute('/politica-de-privacidade')({
  head: () => ({
    meta: [
      { title: 'Política de Privacidade — Maiq' },
      {
        name: 'description',
        content:
          'Política de Privacidade e Uso de Dados da Maiq: como coletamos, usamos, compartilhamos e protegemos os dados pessoais de representantes das empresas clientes, em conformidade com a LGPD.',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Política de Privacidade — Maiq' },
      {
        property: 'og:description',
        content:
          'Como a Maiq trata os dados pessoais compartilhados por empresas em processos de M&A, em conformidade com a LGPD.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://maiq.app.br/politica-de-privacidade' }],
  }),
  component: PoliticaPage,
});

const SECOES: LegalSection[] = [
  {
    title: 'Introdução',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'A Maiq, disponível em maiq.app.br, é uma plataforma especializada em fusões, aquisições e combinação de negócios, que une experiência financeira, estratégia e tecnologia de vanguarda para auxiliar empresários na compra, venda ou integração de companhias.',
      },
      {
        kind: 'paragraph',
        content:
          'Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos e protegemos os dados pessoais dos representantes das empresas clientes que utilizam nossa plataforma, bem como de visitantes e potenciais clientes que entrem em contato conosco pelo site, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018) e demais normas aplicáveis.',
      },
      {
        kind: 'paragraph',
        content:
          'Ao acessar ou utilizar a plataforma Maiq, você declara ter lido, entendido e concordado com os termos desta Política. Caso não concorde, não utilize nossos serviços.',
      },
    ],
  },
  {
    title: 'Dados que coletamos',
    subsections: [
      {
        title: 'Dados fornecidos diretamente',
        blocks: [
          {
            kind: 'paragraph',
            content: 'Coletamos os seguintes dados fornecidos pelo representante da empresa contratante:',
          },
          {
            kind: 'list',
            items: [
              'Nome completo e cargo',
              'Endereço de e-mail corporativo',
              'Número de telefone',
              'Dados de pagamento (cartão de crédito, processados via gateway seguro)',
              'Informações sobre a empresa para finalidades de M&A (dados operacionais, financeiros e estratégicos compartilhados na plataforma)',
            ],
          },
        ],
      },
      {
        title: 'Dados coletados automaticamente',
        blocks: [
          {
            kind: 'list',
            items: [
              'Endereço IP',
              'Dados de uso e interação com a plataforma',
              'Cookies e tecnologias similares (conforme nossa Política de Cookies)',
              'Logs de acesso',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Finalidades e Base Legal do Tratamento',
    blocks: [
      {
        kind: 'table',
        caption: 'Finalidades e Base Legal do Tratamento',
        columns: ['Finalidade', 'Base Legal (LGPD)', 'Artigo'],
        rows: [
          ['Criação e gestão de conta na plataforma', 'Execução de contrato', 'Art. 7º, V'],
          ['Prestação dos serviços de M&A', 'Execução de contrato', 'Art. 7º, V'],
          ['Processamento de pagamentos', 'Execução de contrato', 'Art. 7º, V'],
          ['Cumprimento de obrigações legais e regulatórias', 'Obrigação legal', 'Art. 7º, II'],
          ['Comunicações sobre o serviço', 'Interesse legítimo', 'Art. 7º, IX'],
          ['Análises e melhorias da plataforma', 'Interesse legítimo', 'Art. 7º, IX'],
          ['Marketing e comunicações promocionais', 'Consentimento', 'Art. 7º, I'],
          [
            'Atendimento a solicitações de contato comercial (leads)',
            'Procedimento preliminar a contrato, a pedido do titular',
            'Art. 7º, V',
          ],
        ],
      },
    ],
  },
  {
    title: 'Compartilhamento de Dados',
    blocks: [
      { kind: 'paragraph', content: 'Seus dados poderão ser compartilhados com:' },
      {
        kind: 'list',
        items: [
          'Provedores de infraestrutura em nuvem (AWS, Google Cloud ou Azure) para hospedagem segura da plataforma;',
          'Fornecedores de serviços de análise (Google Analytics ou similar) para análise de uso e melhoria da plataforma;',
          'Provedores de modelos de linguagem (LLMs) para processamento de funcionalidades de inteligência artificial da plataforma;',
          'Gateways de pagamento para processamento de transações financeiras;',
          'Autoridades públicas, quando exigido por lei ou ordem judicial.',
        ],
      },
      {
        kind: 'paragraph',
        content:
          'Todos os terceiros com quem compartilhamos dados são contratualmente obrigados a manter a confidencialidade e a segurança das informações, além de cumprir as exigências da LGPD.',
      },
    ],
  },
  {
    title: 'Transferência Internacional de Dados',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Alguns de nossos fornecedores podem processar dados fora do Brasil. Nestes casos, garantimos que as transferências são realizadas em conformidade com a LGPD, mediante cláusulas contratuais específicas, políticas corporativas globais ou certificados reconhecidos pela ANPD.',
      },
    ],
  },
  {
    title: 'Retenção de Dados',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Mantemos seus dados pelo tempo necessário para a prestação dos serviços e cumprimento das finalidades descritas nesta Política, observando os seguintes critérios:',
      },
      {
        kind: 'list',
        items: [
          'Dados de conta ativa: mantidos durante a vigência do contrato;',
          'Dados financeiros e contábeis: mínimo de 5 anos, conforme legislação fiscal e comercial;',
          'Logs de acesso: 6 meses, conforme Marco Civil da Internet (Lei nº 12.965/2014);',
          'Dados para defesa em processos judiciais: até a prescrição dos direitos correspondentes.',
          'Dados de contato comercial (leads) que não resultem em contratação: mantidos por até 24 meses a partir do último contato, findo o qual são eliminados ou anonimizados, salvo solicitação de exclusão antecipada pelo titular.',
        ],
      },
    ],
  },
  {
    title: 'Direitos do Titular',
    blocks: [
      {
        kind: 'paragraph',
        content: 'Nos termos da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:',
      },
      {
        kind: 'list',
        items: [
          'Confirmação da existência de tratamento;',
          'Acesso aos dados;',
          'Correção de dados incompletos, inexatos ou desatualizados;',
          'Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;',
          'Portabilidade dos dados a outro fornecedor;',
          'Eliminação dos dados tratados com consentimento;',
          'Informações sobre entidades públicas e privadas com as quais compartilhamos os dados;',
          'Revogação do consentimento;',
          'Oposição ao tratamento.',
        ],
      },
      {
        kind: 'paragraph',
        content: (
          <>
            Para exercer seus direitos, entre em contato pelo e-mail:{' '}
            <a href="mailto:contato@maiq.app.br">contato@maiq.app.br</a>. Responderemos às solicitações no prazo
            máximo de 20 (vinte) dias úteis.
          </>
        ),
      },
    ],
  },
  {
    title: 'Segurança dos Dados',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda, destruição ou divulgação, incluindo:',
      },
      {
        kind: 'list',
        items: [
          'Criptografia em trânsito (TLS/HTTPS) e em repouso;',
          'Controle de acesso baseado em função (RBAC);',
          'Monitoramento contínuo de segurança;',
          'Política de senhas robusta e autenticação multifator;',
          'Realização periódica de backups e testes de recuperação.',
        ],
      },
      {
        kind: 'paragraph',
        content:
          'Em caso de incidente de segurança que possa acarretar risco aos titulares, notificaremos a ANPD e os afetados dentro do prazo razoável previsto na LGPD.',
      },
    ],
  },
  {
    title: 'Encarregado de Proteção de Dados (DPO)',
    blocks: [
      {
        kind: 'paragraph',
        content: (
          <>
            Nos termos do Art. 41 da LGPD, a Maiq indicará um Encarregado de Proteção de Dados (DPO). Até a
            designação formal, as comunicações relacionadas à privacidade devem ser encaminhadas para:{' '}
            <a href="mailto:contato@maiq.app.br">contato@maiq.app.br</a>.
          </>
        ),
      },
    ],
  },
  {
    title: 'Alterações desta Política',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Podemos atualizar esta Política periodicamente. Em caso de alterações relevantes, notificaremos os usuários ativos por e-mail ou por aviso na plataforma. A continuação do uso após a notificação implica aceitação das novas condições.',
      },
    ],
  },
  {
    title: 'Lei Aplicável e Foro',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Esta Política é regida pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca do Rio de Janeiro - RJ para dirimir quaisquer controvérsias dela decorrentes, com renúncia expressa a qualquer outro, por mais privilegiado que seja.',
      },
    ],
  },
];

function PoliticaPage() {
  return (
    <LegalPage
      title="Política de Privacidade e Uso de Dados"
      version="1.0"
      effectiveDate="27 de março de 2026"
      sections={SECOES}
    />
  );
}
