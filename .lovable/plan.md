# Formulários de login e cadastro de leads

Criar os formulários seguindo a lógica do projeto de referência **maiq**, mas com releitura visual dentro da identidade atual da página institucional Maiq.

## Decisões já alinhadas

- **Sem dados de perfil de usuário**: o login usará apenas a conta de acesso, sem tabela extra de perfil.
- **Referência visual/funcional**: usar o projeto **maiq** como base para os elementos atuais de login e cadastro de leads.
- **Leads**: coletar contato básico — nome, email, telefone e empresa.
- **Área logada**: ficará como “em breve” por enquanto, sem criar uma área interna completa nesta etapa.

## O que será criado

1. **Ação do botão “Entrar”**
   - O botão passa a abrir o formulário de login.
   - Após login bem-sucedido, mostrar uma experiência simples de “área em breve”, sem redirecionar para um painel inexistente.
   - Incluir opção de sair quando houver usuário logado.

2. **Formulário de login**
   - Email e senha.
   - Estados de carregamento, erro e sucesso.
   - Link/ação de recuperação de senha.
   - Visual integrado ao design Maiq atual: fundos, bordas, tipografia, botões e divisórias no mesmo vocabulário da página institucional.

3. **Recuperação de senha**
   - Fluxo público para solicitar recuperação por email.
   - Página/formulário de redefinição de senha quando o usuário abrir o link recebido.
   - Mensagens claras para senha atualizada, link inválido ou erro.

4. **Cadastro de leads via “Fale Conosco”**
   - O botão “Fale Conosco” abre o formulário de lead.
   - Campos: nome, email, telefone e empresa.
   - Validação de campos antes do envio.
   - Salvar o lead para consulta posterior.
   - Mostrar confirmação visual após cadastro.

5. **Estado do cabeçalho**
   - Quando deslogado: manter “Entrar” e “Fale Conosco”.
   - Quando logado: trocar “Entrar” por uma opção de conta/sair e preservar “Fale Conosco”.
   - Não criar navegação para uma área logada real ainda; apenas indicar “em breve”.

## Base técnica

- Ativar Lovable Cloud para login, armazenamento dos leads e ações seguras no servidor.
- Usar autenticação por email/senha, sem tabela de perfis.
- Criar uma tabela simples de leads com permissões seguras.
- Validar todos os dados do formulário no navegador e no servidor.
- Reaproveitar a intenção dos formulários do projeto **maiq**, sem copiar dependências antigas incompatíveis com o stack atual.
- Manter a página institucional atual como rota principal `/`.
