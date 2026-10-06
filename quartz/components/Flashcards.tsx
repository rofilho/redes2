import { QuartzComponent, QuartzComponentConstructor } from "./types"
import flashcardsScript from "./scripts/flashcards.inline"

// Componente sem marcação própria: carrega o CSS e o comportamento dos
// flashcards. A marcação (o bloco .au-flashcards com os dados em JSON) é escrita
// na aula, no Markdown — e este componente a hidrata em runtime.
// Ver quartz/components/scripts/flashcards.inline.ts e Kit de Componentes §15.
const Flashcards: QuartzComponent = () => null

Flashcards.afterDOMLoaded = flashcardsScript

Flashcards.css = `
/* ==========================================================================
   FLASHCARDS — revisão ativa (vira-e-revela), sem backend
   Cores ancoradas no Design System de Aulas (pares T568B):
     azul  #1f5fa8  navegação
     verde #2e7d52  estado "resposta revelada" (verificação/convergido)
   ========================================================================== */
.au-flashcards { max-width: 560px; margin: 1.5rem auto; }
.au-flashcards .au-fc-data { display: none; }

.au-fc-stage {
  background: var(--au-sfc, var(--secondary, #f0f3f8));
  color: var(--au-tx, var(--dark, #1d2057));
  border: 1px solid color-mix(in srgb, var(--au-par-azul, #1f5fa8) 30%, transparent);
  border-radius: 14px;
  padding: 1.6rem 1.5rem;
  min-height: 7.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.6rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}
.au-fc-stage:hover,
.au-fc-stage:focus-visible {
  border-color: var(--au-par-verde, #2e7d52);
  outline: none;
}
.au-fc-face { font-size: 1.15rem; line-height: 1.5; }
.au-fc-q .au-fc-face { font-weight: 600; }
.au-fc-stage.is-answer {
  background: var(--au-sfc-verde, color-mix(in srgb, var(--au-par-verde, #2e7d52) 12%, var(--secondary, #f0f3f8)));
  border-color: var(--au-par-verde, #2e7d52);
}
.au-fc-hint {
  font-size: 0.8rem;
  opacity: 0.6;
  font-family: var(--au-mono, monospace);
  letter-spacing: 0.03em;
}
.au-fc-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.75rem;
}
.au-fc-nav button {
  background: var(--au-par-azul, #1f5fa8);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 160ms ease, transform 160ms ease;
}
.au-fc-nav button:hover:not(:disabled) { transform: translateY(-1px); }
.au-fc-nav button:disabled { opacity: 0.35; cursor: default; }
.au-fc-count {
  font-family: var(--au-mono, monospace);
  font-size: 0.9rem;
  opacity: 0.7;
  min-width: 3.5rem;
}
@media print {
  .au-fc-nav, .au-fc-hint { display: none; }
  .au-fc-stage { cursor: default; }
}
`

export default (() => Flashcards) satisfies QuartzComponentConstructor
