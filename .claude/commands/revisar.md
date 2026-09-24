---
description: Fase de verificação sobre código existente (Testes + Segurança → correções aprovadas pelo Qualidade). Use antes de commit/deploy.
argument-hint: [escopo: arquivos, módulo ou "branch atual"]
---

# Revisão pré-commit / pré-deploy

Você é o **orquestrador**. Rode a fase de verificação sobre o escopo em `$ARGUMENTS` (se vazio, use as mudanças pendentes da branch atual). Subagentes não chamam uns aos outros — você encadeia. Não aplique correções sem autorização.

Antes de começar, leia o `CLAUDE.md` da raiz.

## Verificar (em paralelo)

- **testing** — cobre as áreas afetadas e reporta bugs revelados (sem alterar código de produção). **O projeto não tem suíte de testes hoje**: para mudanças majoritariamente visuais, o agente deve indicar a conferência visual em vez de instalar a infraestrutura por conta própria.
- **security** — audita exposição de dados pessoais e LGPD; gera relatório com achados por severidade.

Sempre, independente de haver testes: `npm run lint`, `npx tsc --noEmit` e `npm run build`.

## PORTÃO — Aprovar correções

Consolide bugs + achados de segurança por severidade e **pare**. Só com autorização do usuário, acione **code-quality** para corrigir e **testing** para re-rodar a suíte. Repita até zerar pendências críticas/altas.

## Encerrar

Resumo final: testes (passaram/falharam), achados de segurança e status, e o que ficou pendente. Indique se está apto a commit/deploy. **Não** faça commit/push sem o usuário pedir.
