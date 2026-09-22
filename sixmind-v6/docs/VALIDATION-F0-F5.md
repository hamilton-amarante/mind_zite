# Validação técnica — SixMind V6 F0 a F5

Data: 2026-09-13

## F0 — Isolamento
Status: PASS
- V6 criada em diretório próprio
- V4.5 não alterada
- estrutura `src`, `assets`, `docs` presente

## F1 — Arquitetura comercial
Status: PASS
- Hero
- Problemas
- Soluções
- Demonstração
- Jornada cinematográfica
- Antes x Depois
- CTA
- navegação interna presente

## F2 — Sanitização
Status: PASS
- nenhum screenshot real `platform-*.png` usado pela V6
- dados de demo sintéticos
- cinco cenários de demonstração presentes

## F3 — Jornada cinematográfica
Status: PASS
- cinco cenas
- scroll controla cena ativa
- navegação manual entre cenas
- indicador de progresso
- Canvas de partículas carregado

## F4 — Caos operacional
Status: PASS
- cinco dores operacionais representadas
- seção posicionada antes da solução/demonstração

## F5 — Antes x Depois
Status: PASS
- fluxo fragmentado representado
- fluxo orquestrado representado
- comparação responsiva

## Verificações executadas
- `node --check src/main.js`: PASS
- HTML parseado com IDs únicos: PASS
- assets referenciados existentes: PASS
- CSS/JS/HTML servidos via servidor HTTP local: PASS
- seções obrigatórias detectadas: PASS
- cenários B2B, Saúde, Telecom, Imobiliário e Varejo detectados: PASS
- ausência de screenshots reais da plataforma: PASS

## Observação GitHub
A integração GitHub está habilitada para escrita e a versão foi preparada em branch separada, preservando a V4.5 na `main`.
