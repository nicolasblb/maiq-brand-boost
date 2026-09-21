import ConvictionScene from '@/components/maiq/ConvictionScene';

export default function Conviccao() {
  return (
    <section data-maiq-sec="fundacao" aria-labelledby="conviccao-title" className="maiq-conviction">
      <div className="maiq-conviction-inner">
        <header className="maiq-conviction-head">
          <h2 id="conviccao-title">Nossa Convicção</h2>
          <h3>A empresa que só cresce de forma orgânica pode estar limitando o próprio futuro.</h3>
        </header>
        <div className="maiq-conviction-body">
          <p className="maiq-conviction-lede">
            Se feita da maneira correta, como disciplina contínua, um M&amp;A pode criar valor
            incomparável e acelerar o caminho de uma companhia. Com uma combinação de negócios, uma
            média empresa pode incorporar competências que levariam décadas para serem construídas
            internamente. Para isso, organização e método para reduzir incertezas é fator
            fundamental.
          </p>
          <ConvictionScene />
        </div>
      </div>
    </section>
  );
}
