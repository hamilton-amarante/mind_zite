# SixMind V4.5 — Cinematic Scroll Experience

Esta é a evolução completa da V3, executada em sequência como V4.1 → V4.5.

## Como visualizar no VS Code

### Opção recomendada — Live Server
1. Extraia o ZIP.
2. Abra a pasta `sixmind-v4-cinematic` no VS Code.
3. Instale a extensão **Live Server**.
4. Clique com o botão direito em `index.html`.
5. Clique em **Open with Live Server**.
6. Role a página devagar na seção “Agora entre na plataforma”.

### Opção sem extensão
No terminal do VS Code:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`.

## O que foi entregue

### V4.1 — celular premium + entrada cinematográfica
- moldura metálica preto/dourado
- botões laterais
- vidro, reflexo e dynamic island
- tilt com cursor em desktop
- aproximação cinematográfica via scroll
- transição de entrada pela tela

### V4.2 — WebGL e profundidade real
- canvas WebGL nativo, sem biblioteca externa
- partículas 3D em profundidade
- túnel de dados acelerando conforme o scroll
- render loop otimizado e DPR limitado

### V4.3 — dados viajando entre módulos
- canvas 2D sobreposto para pacotes de dados
- partículas viajando entre conversa, pipeline, agenda, canais e integrações
- bursts de dados acionados pela própria conversa

### V4.4 — conversa acionando a operação
- cenários: Vendas B2B, Saúde, Telecom, Imobiliário e Varejo
- efeito “digitando...”
- extração de intenção/contexto
- ações operacionais aparecendo em paralelo
- fluxo visual: conversa → pipeline → agenda → canais → integrações

### V4.5 — polimento, mobile e performance
- responsividade mobile
- redução de partículas em aparelhos menos potentes
- `prefers-reduced-motion`
- lazy loading das telas secundárias
- canvas com DPR limitado
- scroll com requestAnimationFrame
- pausa de WebGL quando a aba perde foco

## Estrutura

- `index.html` — experiência principal
- `src/style.css` — identidade e animações
- `src/main.js` — interações, WebGL, chat e timeline de scroll
- `assets/` — logo e telas reais da plataforma
- `portfolio-lab/` — base para os próximos conceitos do portfólio
- `CHANGELOG-V4.md` — evolução por etapa

## Próxima fase

O diretório `portfolio-lab/` já deixa preparado o terreno para:
1. Cidade Operacional
2. Funil Inteligente
3. Cérebro Neural
4. Raio-X de Gargalos

A regra do portfólio será manter a mesma assinatura SixMind, mas usar uma metáfora visual diferente em cada experiência.
