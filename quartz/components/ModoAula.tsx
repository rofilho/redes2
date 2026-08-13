import { QuartzComponent, QuartzComponentConstructor } from "./types"
import modoAulaScript from "./scripts/modoaula.inline"

// Componente sem marcação própria: ele só carrega o script e o CSS do Modo Aula.
// O botão e o palco são criados em runtime, a partir do conteúdo que já está na
// página — porque o padrão é "uma fonte, duas renderizações", e uma segunda
// marcação seria uma segunda fonte.
const ModoAula: QuartzComponent = () => null

ModoAula.afterDOMLoaded = modoAulaScript

ModoAula.css = `
/* ==========================================================================
   MODO AULA — a página renderizada para projeção
   --------------------------------------------------------------------------
   Piso tipográfico: nada abaixo do equivalente a 24 pt, que é o mínimo
   recomendado para slide projetado a uma plateia ao vivo.
   Fundo claro e texto escuro: sala clara e lâmpada cansada lavam a imagem, e
   cor clara sobre fundo claro some primeiro.
   Fonte de verdade do padrão: _CEREBRO/PADRAO_APRESENTACAO_AULA.md
   ========================================================================== */

/* ── o botão de entrada ── */
.au-botao-aula {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--au-par-laranja, #d9702a) 45%, transparent);
  background: color-mix(in srgb, var(--au-par-laranja, #d9702a) 10%, transparent);
  color: var(--au-par-laranja, #d9702a);
  font-family: var(--au-mono, monospace);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 180ms ease, transform 180ms ease;
}
.au-botao-aula:hover {
  background: color-mix(in srgb, var(--au-par-laranja, #d9702a) 18%, transparent);
  transform: translateY(-1px);
}
.au-botao-aula span { font-size: 0.7rem; }

/* ── com o modo ligado, a página de leitura sai de cena ── */
html.au-modo-aula,
html.au-modo-aula body { overflow: hidden; height: 100%; }
html.au-modo-aula body > *:not(.au-palco):not(.au-hud) { display: none !important; }

/* ── o palco ── */
.au-palco {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: #fafaf8;
  color: #2b2e35;
}

.au-tela {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 2.5vh;
  padding: 6vh 7vw 11vh;
  overflow: hidden;
}
.au-tela.on { display: flex; }

/* ── camada 1: a afirmação ──
   Frase completa, não rótulo. É a diferença medida em p < 0,01 entre a
   estrutura afirmação-evidência e o título-tópico com bullets. */
.au-tela-afirmacao {
  font-family: var(--au-display, system-ui), sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.12;
  font-size: clamp(1.9rem, 3.6vw, 3.4rem);
  max-width: 22ch;
  flex: none;
}
/* h3 é sub-afirmação: mesma família, um degrau abaixo, e uma marca à esquerda
   para o aluno saber que continua dentro do bloco anterior. */
.au-tela-afirmacao[data-nivel="H3"] {
  font-size: clamp(1.5rem, 2.6vw, 2.5rem);
  max-width: 26ch;
  padding-left: 0.7em;
  border-left: 5px solid var(--au-par-laranja, #d9702a);
}

/* ── camada 2: a prova ── */
.au-tela-prova {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vh;
}
.au-tela-prova > * { margin: 0 !important; max-width: none !important; }

/* a figura manda: ela é a evidência, e ocupa o que sobrar */
.au-tela-prova figure.au-fig,
.au-tela-prova figure.au-fig img,
.au-tela-prova svg {
  max-height: 62vh;
  width: auto;
  max-width: 100%;
  margin-inline: auto;
}
/* a legenda diz o que SIGNIFICA — e por isso continua na tela, ao contrário
   da narração. Mas em corpo menor: ela apoia a figura, não compete com ela. */
.au-tela-prova .au-legenda {
  font-size: clamp(0.95rem, 1.15vw, 1.25rem);
  line-height: 1.4;
  text-align: center;
  max-width: 70ch;
  margin-inline: auto !important;
}

/* terminal e tabela: piso de legibilidade a distância */
.au-tela-prova .au-term { font-size: clamp(0.95rem, 1.25vw, 1.45rem); }
.au-tela-prova .au-term-b { line-height: 1.6; }
.au-tela-prova table { font-size: clamp(0.95rem, 1.3vw, 1.5rem); width: 100%; }
.au-tela-prova table :is(td, th) { padding: 0.6em 0.8em; }

/* a prática vira checklist projetável: um item por linha, conferível de longe */
.au-tela-prova .au-pratica li { font-size: clamp(1rem, 1.4vw, 1.6rem); margin-bottom: 0.5em; }

/* a aposta: a pergunta ocupa a tela; a resposta só aparece quando o professor
   abre. É o Prever-Observar-Explicar, mecanizado. */
.au-tela-prova details.au-aposta > summary {
  font-size: clamp(1.2rem, 2vw, 2.1rem);
  line-height: 1.25;
  font-weight: 600;
}
.au-tela-prova details.au-aposta :is(p, li) { font-size: clamp(1rem, 1.3vw, 1.5rem); }
.au-tela-prova .au-caminho summary { font-size: clamp(1.05rem, 1.6vw, 1.8rem); }

/* o bloco que não tem prova — o defeito aparece ensaiando, não em sala */
.au-tela-vazia {
  font-family: var(--au-mono, monospace);
  font-size: 1rem;
  color: #a33c33;
  border: 1px dashed #d7a8a2;
  border-radius: 10px;
  padding: 1.2rem 1.5rem;
  background: #fdf5f4;
}

/* ── o HUD ── */
.au-hud {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  z-index: 9001;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.7rem 2.5vw;
  background: #fafaf8;
  border-top: 1px solid #e8e6e0;
  font-family: var(--au-mono, monospace);
  font-size: 0.85rem;
  color: #8a8f98;
}
.au-hud-n { font-weight: 700; color: #2b2e35; }
.au-hud-bar { flex: 1; height: 3px; background: #e8e6e0; border-radius: 2px; overflow: hidden; }
.au-hud-bar i { display: block; height: 100%; background: var(--au-par-laranja, #d9702a); transition: width 180ms ease; }
.au-hud-dica { letter-spacing: 0.05em; }

@media print { .au-botao-aula { display: none; } }
`

export default (() => ModoAula) satisfies QuartzComponentConstructor
