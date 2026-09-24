---
description: Pipeline completo para uma nova funcionalidade (planejar → aprovar → implementar → verificar → aprovar → finalizar).
argument-hint: <descrição da funcionalidade>
---

# Fluxo completo de funcionalidade

Você é o **orquestrador**. Conduza a funcionalidade descrita em `$ARGUMENTS` pelo pipeline abaixo, delegando a cada subagente e **parando nos portões de aprovação**. Subagentes não chamam uns aos outros — você é quem encadeia. Nunca pule um portão; nunca implemente nada antes da aprovação do usuário.

Antes de começar, leia o `CLAUDE.md` da raiz para contexto.

## Fase 1 — Planejar (em paralelo, apenas proposta)

Acione, conforme o escopo da funcionalidade:

- **architecture** — se houver qualquer mudança estrutural (schema, rotas, integrações, novo módulo). Produz plano + ADR.
- **frontend-design** — se houver UI nova ou alterada. Produz mockup/especificação e, se necessário, atualiza a proposta do `DESIGN.md`.

Se a funcionalidade claramente não toca um desses domínios, pule o agente correspondente e diga por quê.

Consolide as duas propostas num resumo único.

## PORTÃO 1 — Aprovação do usuário

Apresente o plano + design consolidados e **pare**. Liste explicitamente o que muda de comportamento. Só avance com o "ok" do usuário. Se ele pedir ajustes, volte à Fase 1.

## Fase 2 — Implementar

Acione **code-quality** para implementar exatamente o que foi aprovado (plano da Arquitetura + especificação do Design), preservando o comportamento existente e respeitando TS strict + ESLint.

## Fase 3 — Verificar (em paralelo)

- **testing** — cobre as áreas afetadas (priorize server functions e validação de leads, autenticação, navegação entre rotas). **O projeto não tem suíte de testes hoje**: se o que foi construído for majoritariamente visual, o agente deve dizer que não compensa automatizar e indicar a conferência visual em vez de instalar Vitest/Playwright por conta própria.
- **security** — audita exposição de dados pessoais e LGPD sobre o que foi construído; gera relatório.

Sempre, independente de haver testes: `npm run lint`, `npx tsc --noEmit` e, se a mudança tocou rotas, configuração ou imports de asset, `npm run build`.

Reúna os achados: bugs revelados pelos testes + achados de segurança + o que exige conferência visual sua.

## PORTÃO 2 — Aprovar correções

Se houver bugs ou achados, apresente-os por severidade e **pare**. Só aplique correções com autorização do usuário. Ao aprovar, acione **code-quality** para corrigir e **testing** para re-rodar a suíte. Repita este portão até não restarem itens críticos/altos pendentes.

## Fase 4 — Finalizar

Quando os testes passarem e não houver pendência crítica de segurança, entregue um resumo final (o que foi feito, testes, status de segurança, ADR gerado) e indique que está pronto para commit/deploy. **Não** faça commit/push sem o usuário pedir.
