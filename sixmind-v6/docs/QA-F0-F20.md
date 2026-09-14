# QA SixMind V6

QA automatizado executado na branch `v6/site-completo`.

- validação estática de arquivos, IDs e referências
- `node --check` em todos os módulos JavaScript
- servidor HTTP local em CI
- Chromium real via Playwright
- smoke test desktop e mobile
- interação com cenário de Saúde
- abertura do FAQ
- screenshots desktop/mobile gerados como artefato

Primeira execução completa do workflow `SixMind V6 QA`: sucesso.

O deploy Vercel não foi realizado porque a integração Vercel desta sessão não possui team/project conectado. Antes de produção ainda devem ser definidos domínio canônico, canal oficial de leads e provedor de analytics externo.
