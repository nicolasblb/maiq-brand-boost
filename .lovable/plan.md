# Refinar o topo das duas sobreposições da Home

## Objetivo
Eliminar as abas retas que reaparecem atrás das quinas superiores de “Nosso Modelo / Nossa Convicção” e “Nossa Perspectiva”.

## Causa a confirmar
Os blocos estáticos e suas sobreposições começam hoje na mesma linha horizontal. Como o bloco de cima tem quinas arredondadas, a base reta que começa exatamente atrás dele fica visível nos recortes dos cantos. Portanto, a hipótese principal é a linha de corte — não o raio das bordas.

## Alteração proposta
- Medir separadamente os encontros Plataforma → Modelo e FAQ → Perspectiva durante a rolagem.
- Antecipar a linha de entrada de cada sobreposição pelo espaço exato do raio superior, fazendo a base reta começar somente onde o bloco arredondado já ocupa toda a largura.
- Manter retos os topos das seções estáticas quando exibidas sozinhas; não voltar a arredondar ou recortar essas bases.
- Preservar a altura integral do FAQ, a ordem das seções e toda a lógica de rolagem e rotação.
- Aplicar a mesma regra geométrica aos dois encontros para evitar que o defeito reapareça isoladamente.
- Registrar o resultado no roadmap.

## Verificação
- Capturar o início, o meio e o fim das duas transições em desktop e celular, nos temas noite e dia.
- Confirmar visualmente os quatro cantos superiores, inclusive após giros repetidos do celular.
- Confirmar que Plataforma e FAQ continuam com topo reto quando estáticos, que FAQ + rodapé ocupam a tela inteira e que a rolagem permanece estável.
