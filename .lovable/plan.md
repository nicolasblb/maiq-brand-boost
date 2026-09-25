# Corrigir rotação da Home

## Objetivo
Manter a ordem original dos blocos no celular deitado e reconstruir corretamente as sobreposições ao voltar para a posição vertical, inclusive quando a página foi carregada inicialmente na horizontal.

## Alterações
- Preservar a sequência visual original da Home no modo horizontal contínuo: Nossa Plataforma, Nosso Modelo, Nossa Convicção, Nossa Perspectiva e FAQ/rodapé.
- Tornar explícita a transição entre os modos horizontal contínuo e vertical com uma classe de estado, evitando depender apenas da atualização tardia das media queries.
- Ao entrar no modo vertical, limpar todas as medidas do modo horizontal, aguardar o navegador estabilizar a altura útil e recalcular a pilha a partir de valores limpos.
- Manter a seção que o usuário estava lendo após o giro, sem reutilizar posições ou alturas do modo anterior.
- Executar essa inicialização também quando a primeira carga acontecer na horizontal.

## Validação
- Testar carga inicial em horizontal seguida de retorno à vertical.
- Testar múltiplos ciclos vertical ↔ horizontal.
- Conferir a ordem de todos os blocos, o scroll e as sobreposições nos temas noturno e diurno.
- Registrar o ajuste no roadmap do projeto.
