# Material de referência — `referencias/`

Pasta **fora do git** (listada no `.gitignore`), só para consulta local. Nada aqui é importado
pelo build. Ao citar esse material em código ou documentação, use o caminho abaixo, mas não
dependa dele para compilar: quem clonar o repositório não terá essa pasta.

| Pasta | O que é | Quando consultar |
| --- | --- | --- |
| `referencias/site-lovable-antigo/` | Projeto Lovable anterior (Vite + React + shadcn; `lovable.dev/projects/1bdee6b3-…`). **Tem `.env` próprio** — nunca copiar valores dele para cá nem expô-los. | Ao integrar esta página ao site com área logada, ou para ver como algo funcionava antes. |
| `referencias/rebranding-design-system/` | Handoff do rebrand futuro (`uploads/maiq_design_system_handoff/`: paleta, nomenclatura de tokens, 29 componentes). | Só quando o rebrand for iniciado — ver pendência 5 no `CLAUDE.md` e a seção dedicada no `DESIGN.md`. |
| `referencias/identidade-origem-do-nome/` | Handoff de design da identidade da marca (`design_handoff_identidade_maiq/`: `README.md`, `.dc.html`, assets). | Base da `/sobre-nos` (MA/AI/IQ) — ver ADR 0002. |
| `referencias/midias-origem/` | Mídias brutas enviadas pelo usuário: vídeos da Plataforma e da Convicção, logos do carrossel por tema, favicon. | Para regerar as versões otimizadas de `src/assets`/`public` — processo descrito na seção "Assets" do `CLAUDE.md`. Nunca copiar o bruto direto. |

Ao receber novo material de referência, colocá-lo aqui (nome sem espaços/acentos) e
acrescentar uma linha nesta tabela.
