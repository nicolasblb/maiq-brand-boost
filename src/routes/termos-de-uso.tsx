import { createFileRoute } from '@tanstack/react-router';

import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const Route = createFileRoute('/termos-de-uso')({
  head: () => ({
    meta: [
      { title: 'Termos de Uso — Maiq' },
      {
        name: 'description',
        content:
          'Termos de Uso da Maiq: condições de acesso à plataforma de fusões, aquisições e combinação de negócios, incluindo cadastro, planos, propriedade intelectual e uso de inteligência artificial.',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Termos de Uso — Maiq' },
      {
        property: 'og:description',
        content: 'Condições de uso do site e da plataforma Maiq para empresas que conduzem processos de M&A.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: 'https://maiq.app.br/termos-de-uso' }],
  }),
  component: TermosPage,
});

// Título da rota e do h1 é "Termos de Uso" (decisão registrada em
// docs/spec-paginas-legais.md, item 8.1); o corpo do texto mantém "Termos de
// Serviço" onde o documento original o usa — publicado sem adaptação.
const SECOES: LegalSection[] = [
  {
    title: 'Aceitação dos Termos',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Estes Termos de Serviço regem o acesso e uso da plataforma Maiq, disponível em maiq.app.br, por empresas e seus representantes legais. Ao criar uma conta, assinar um plano ou utilizar qualquer funcionalidade da plataforma, você, na qualidade de representante da empresa contratante, declara ter plenos poderes para vinculá-la e concorda com estes Termos e com a nossa Política de Privacidade. Se Você não concordar com qualquer disposição destes Termos, não deve utilizar a plataforma Maiq.',
      },
    ],
  },
  {
    title: 'Descrição dos Serviços',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'A Maiq oferece uma plataforma SaaS especializada em fusões, aquisições e combinação de negócios, que inclui, sem se limitar a:',
      },
      {
        kind: 'list',
        items: [
          'Gestão e organização de processos de M&A;',
          'Ferramentas de análise financeira e estratégica com tecnologia de inteligência artificial;',
          'Âmbito para condução de due diligence e troca segura de documentos;',
          'Conectividade com potenciais compradores, vendedores e investidores;',
          'Relatórios e dashboards para acompanhamento de operações.',
        ],
      },
      {
        kind: 'paragraph',
        content:
          'A Maiq reserva-se o direito de modificar, suspender ou descontinuar qualquer funcionalidade da plataforma a qualquer momento, com aviso prévio razoável ao Cliente.',
      },
    ],
  },
  {
    title: 'Cadastro e Contas',
    subsections: [
      {
        title: 'Elegibilidade',
        blocks: [
          {
            kind: 'paragraph',
            content:
              'O uso da plataforma Maiq é restrito a pessoas jurídicas e a pessoas físicas maiores de 18 anos que representem legalmente uma empresa. É vedado o uso por pessoas físicas em caráter pessoal.',
          },
        ],
      },
      {
        title: 'Obrigações do Cadastro',
        blocks: [
          {
            kind: 'paragraph',
            content: 'O Cliente compromete-se a:',
          },
          {
            kind: 'list',
            items: [
              'Fornecer informações precisas, completas e atualizadas no cadastro;',
              'Manter a confidencialidade de suas credenciais de acesso;',
              'Notificar imediatamente a Maiq em caso de acesso não autorizado à sua conta;',
              'Ser o único responsável por todas as atividades realizadas por meio de sua conta.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Planos, Preços e Pagamentos',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Os planos e preços dos serviços são disponibilizados na plataforma e podem ser alterados mediante aviso prévio de 30 (trinta) dias.',
      },
      {
        kind: 'list',
        items: [
          'Os pagamentos serão cobrados conforme o plano contratado (mensal ou anual);',
          'Em caso de inadimplência, a Maiq poderá suspender o acesso sem aviso prévio após 30 (trinta) dias de inadimplência, contados a partir do dia de vencimento da primeira fatura em aberto;',
          'Não há reembolso por períodos parcialmente utilizados, salvo disposição contratável específica;',
          'Todos os preços são expressos em Reais (BRL) e sujeitos a impostos aplicáveis.',
        ],
      },
    ],
  },
  {
    title: 'Obrigações e Responsabilidades do Cliente',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'O Cliente compromete-se a utilizar a plataforma Maiq exclusivamente para finalidades lícitas e de acordo com estes Termos, sendo-lhe vedado:',
      },
      {
        kind: 'list',
        items: [
          'Usar a plataforma para fins ilegais ou não autorizados;',
          'Copiar, modificar, distribuir ou fazer engenharia reversa do software;',
          'Tentar obter acesso não autorizado a sistemas ou redes relacionados à plataforma;',
          'Inserir informações falsas ou enganosas sobre empresas ou transações;',
          'Violar direitos de propriedade intelectual da Maiq ou de terceiros;',
          'Transmitir códigos maliciosos ou qualquer conteúdo que prejudique a plataforma.',
        ],
      },
      {
        kind: 'paragraph',
        content:
          'O Cliente é integralmente responsável pela veracidade, legitimidade e licitude das informações inseridas na plataforma.',
      },
    ],
  },
  {
    title: 'Confidencialidade',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Ambas as partes se comprometem a manter sigilo sobre todas as informações confidenciais trocadas no contexto do uso da plataforma, incluindo dados financeiros, estratégicos e operacionais. Esta obrigação persiste por 5 (cinco) anos após o término do contrato.',
      },
    ],
  },
  {
    title: 'Propriedade Intelectual',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Todos os direitos de propriedade intelectual relativos à plataforma Maiq, incluindo software, algoritmos, design, marca e conteúdo, são de titularidade exclusiva da Maiq ou de seus licenciantes. Ao inserir conteúdo na plataforma, o Cliente concede à Maiq licença não exclusiva, mundial e livre de royalties para processar e armazenar tal conteúdo exclusivamente para a prestação dos serviços contratados.',
      },
    ],
  },
  {
    title: 'Uso de Inteligência Artificial',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'A plataforma Maiq integra modelos de linguagem (LLMs) de mercado para potencializar suas funcionalidades. O Cliente reconhece que:',
      },
      {
        kind: 'list',
        items: [
          'As saídas geradas por IA são de caráter orientativo e não substituem o julgamento profissional;',
          'A Maiq não se responsabiliza por decisões tomadas com base exclusivamente em conteúdo gerado por IA;',
          'Os dados inseridos para processamento por LLMs estão sujeitos aos contratos de privacidade com os respectivos fornecedores de IA.',
        ],
      },
    ],
  },
  {
    title: 'Limitação de Responsabilidade',
    blocks: [
      {
        kind: 'paragraph',
        content: 'Na máxima extensão permitida pela lei aplicável, a Maiq não será responsável por:',
      },
      {
        kind: 'list',
        items: [
          'Danos indiretos, incidentais, especiais ou consequentes;',
          'Lucros cessantes ou perda de dados;',
          'Interrupções temporárias do serviço decorrentes de manutenção ou caso fortuito;',
          'Decisões de negócio tomadas com base nas informações processadas na plataforma.',
        ],
      },
      {
        kind: 'paragraph',
        content:
          'A responsabilidade total da Maiq, em qualquer caso, não excederá o valor pago pelo Cliente nos últimos 12 (doze) meses de serviço.',
      },
    ],
  },
  {
    title: 'Vigência, Suspensão e Rescisão',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Estes Termos vigoram por prazo indeterminado a partir da criação da conta. Qualquer das partes pode rescindir o contrato mediante aviso prévio de 30 (trinta) dias.',
      },
      {
        kind: 'paragraph',
        content:
          'A Maiq poderá suspender ou encerrar imediatamente o acesso em caso de violação destes Termos, sem prejuízo das medidas legais cabíveis.',
      },
      {
        kind: 'paragraph',
        content:
          'Após a rescisão, os dados do Cliente serão retidos conforme descrito na Política de Privacidade e, após o prazo legal, serão definitivamente excluídos.',
      },
    ],
  },
  {
    title: 'Alterações dos Termos',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'A Maiq poderá revisar estes Termos a qualquer momento. Em caso de alterações substanciais, notificaremos o Cliente com pelo menos 30 (trinta) dias de antecedência. A continuação do uso após esse prazo implica aceitação dos novos termos.',
      },
    ],
  },
  {
    title: 'Disposições Gerais',
    blocks: [
      {
        kind: 'paragraph',
        content:
          'Caso qualquer disposição destes Termos seja considerada inválida, as demais permanecerão em pleno vigor. Estes Termos constituem o acordo integral entre as partes e prevalecem sobre quaisquer entendimentos anteriores.',
      },
      {
        kind: 'paragraph',
        content:
          'Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca do Rio de Janeiro - RJ para resolução de litígios.',
      },
    ],
  },
];

function TermosPage() {
  return <LegalPage title="Termos de Uso" version="1.0" effectiveDate="27 de março de 2026" sections={SECOES} />;
}
