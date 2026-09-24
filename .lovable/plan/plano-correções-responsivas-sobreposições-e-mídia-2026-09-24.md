# Plano — correções responsivas, sobreposições e mídia

## Objetivo
Corrigir os problemas visuais relatados sem alterar a sequência de rolagem e sobreposição da página.

## Alterações
1. **Nosso Modelo no celular**
   - Reorganizar as três métricas em colunas estáveis, com largura mínima zero e tamanho numérico adaptado ao espaço disponível.
   - Impedir que prefixo e dígitos do odômetro se sobreponham.
   - Manter as seis marcas de tecnologia em uma única linha, reduzindo espaçamento e escala apenas no celular.

2. **Quina do primeiro bloco sobreposto**
   - Remover a faixa reta que aparece atrás do topo arredondado.
   - Preservar o contorno, a sombra e o recorte arredondado em desktop e celular, sem mudar alturas ou posições da pilha de rolagem.

3. **Nossa Identidade no celular**
   - Transformar os cartões MA/AI/IQ em um carrossel horizontal com um cartão completo por vez.
   - Usar encaixe suave, margens laterais, indicadores discretos e navegação por gesto/toque.
   - Manter a grade atual no desktop e sincronizar o cartão visível com a animação da identidade.

4. **Menu compacto**
   - Uniformizar em branco os textos do menu no modo noturno em todas as páginas.
   - Aplicar uma divisória leve com fade após as duas primeiras opções móveis, mantendo a outra divisória entre seções e páginas.

5. **Vídeos ampliados**
   - Eliminar as linhas finas na lateral direita e na base usando recorte interno e sobreposição subpixel da mídia, preservando o enquadramento completo.
   - Corrigir a Plataforma em celular deitado para manter o layout horizontal após a rotação nativa do aparelho, como já ocorre em Nossa Convicção e Nossa Perspectiva.
   - Manter a simulação horizontal por CSS somente quando o aparelho ainda estiver em retrato.

## Verificação
- Conferir Home e Sobre nós em celular e desktop, nos modos noite e dia.
- Validar odômetros, logos em uma linha, carrossel por gesto e seleção, menus e divisórias.
- Abrir e fechar as três experiências ampliadas; testar retrato, rotação para paisagem e diferentes proporções de desktop.
- Confirmar a página inteira nos dois sentidos de rolagem para garantir que a pilha de sobreposição permaneceu intacta.
