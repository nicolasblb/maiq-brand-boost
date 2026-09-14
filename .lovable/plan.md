# Remover as nebulosas de fundo do hero

## O que será feito

- Remover do hero o contêiner das 4 nebulosas (os volumes animados maiqVolA–D, com blur de 34px e opacidade .58), deixando o fundo limpo com a cor sólida do tema.
- Manter intactos: órbitas luminosas (halos, orbes, flash), vinheta, conteúdo, carrossel de chips, voo do logo e comportamento de scroll.
- Opcionalmente remover os keyframes maiqVolA–D do CSS (ficam sem uso).

## Verificação

- Conferir o hero nos dois temas (noite e dia) e confirmar que as órbitas e o restante do efeito seguem idênticos, apenas sobre fundo limpo.

## Detalhes técnicos

- Arquivo: `src/components/PaginaInstitucional.tsx` (remover o bloco de ~linhas 1087–1096) e `src/maiq.css` (keyframes maiqVol*).
- Nenhuma outra seção é afetada — o contêiner é independente e nada referencia as nebulosas.
- Efeito colateral positivo: elimina um blur de tela cheia, reduzindo o custo de renderização da primeira tela.
