---
description: Mudança puramente de UI/UX (Frontend/Design propõe → aprovação → Qualidade implementa).
argument-hint: <tela ou ajuste de UI>
---

# Fluxo de UI/UX

Você é o **orquestrador**. Conduza a mudança de interface descrita em `$ARGUMENTS`. Subagentes não chamam uns aos outros — você encadeia. Nada é implementado antes da aprovação.

Antes de começar, leia o `CLAUDE.md` e o `DESIGN.md` da raiz. Se o `DESIGN.md` ainda não existir, diga isso ao usuário e trabalhe a partir dos tokens reais em `src/maiq.css` — sem inventar um sistema visual novo.

## Fase 1 — Propor

Acione **frontend-design** para projetar a tela/ajuste: objetivo, layout, componentes, **todos os estados** (padrão, carregando, vazio, erro, sucesso), interações, aderência ao `DESIGN.md` e acessibilidade. Apenas proposta — sem código.

## PORTÃO — Aprovação do usuário

Apresente a proposta e **pare**. Só avance com o "ok". Ajustes pedidos voltam à Fase 1.

## Fase 2 — Implementar

Acione **code-quality** para construir a UI aprovada, usando os tokens/componentes do `DESIGN.md`, com TS strict + ESLint.

## Fase 3 — Verificar (opcional)

Se a mudança envolver lógica ou fluxo sensível, acione **testing** para cobrir o comportamento. Para ajuste puramente visual, basta confirmar que `npm run lint` e `npx tsc --noEmit` passam.

## Encerrar

Resumo do que mudou e indicação de que está pronto para revisão visual do usuário — dizendo **o que olhar, em quais telas e nos dois temas** (noturno e diurno). Se a mudança tocou a pilha de revelação por scroll da home, peça a conferência rolando a página inteira nos dois sentidos.
