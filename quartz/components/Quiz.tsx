import { QuartzComponent, QuartzComponentConstructor } from "./types"
import quizScript from "./scripts/quiz.inline"

// Componente sem marcação própria: carrega o CSS e o comportamento do quiz
// autocorretivo. A marcação (o bloco .au-quiz com as questões em JSON) é escrita
// na aula, no Markdown — e este componente a hidrata em runtime.
// Ver quartz/components/scripts/quiz.inline.ts e Kit de Componentes §16.
const Quiz: QuartzComponent = () => null

Quiz.afterDOMLoaded = quizScript

Quiz.css = `
/* ==========================================================================
   QUIZ AUTOCORRETIVO — verificação ativa, sem backend e sem nota.
   Cores ancoradas no Design System de Aulas (pares T568B):
     azul    #1f5fa8  navegação / enunciado
     verde   #2e7d52  acerto (estado verificado/convergido)
     laranja #b1541b  erro (atenção / quebra deliberada)
   ========================================================================== */
.au-quiz { max-width: 620px; margin: 1.5rem auto; }
.au-quiz .au-quiz-data { display: none; }

.au-quiz-stage {
  background: var(--au-sfc, var(--secondary, #f0f3f8));
  color: var(--au-tx, var(--dark, #1d2057));
  border: 1px solid color-mix(in srgb, var(--au-par-azul, #1f5fa8) 30%, transparent);
  border-radius: 14px;
  padding: 1.5rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.au-quiz-q {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.5;
}
.au-quiz-opcoes {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.au-quiz-opcao {
  text-align: left;
  width: 100%;
  background: var(--au-sfc-opt, color-mix(in srgb, var(--au-par-azul, #1f5fa8) 6%, transparent));
  color: inherit;
  border: 1px solid color-mix(in srgb, var(--au-par-azul, #1f5fa8) 35%, transparent);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-size: 1rem;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
}
.au-quiz-opcao:hover:not(:disabled),
.au-quiz-opcao:focus-visible:not(:disabled) {
  border-color: var(--au-par-azul, #1f5fa8);
  background: color-mix(in srgb, var(--au-par-azul, #1f5fa8) 14%, transparent);
  outline: none;
  transform: translateY(-1px);
}
.au-quiz-opcao:disabled { cursor: default; transform: none; }
/* acerto: verde do design system */
.au-quiz-opcao.is-correta {
  border-color: var(--au-par-verde, #2e7d52);
  background: color-mix(in srgb, var(--au-par-verde, #2e7d52) 20%, transparent);
  font-weight: 600;
}
/* erro escolhido: laranja do design system */
.au-quiz-opcao.is-errada {
  border-color: var(--au-par-laranja, #b1541b);
  background: color-mix(in srgb, var(--au-par-laranja, #b1541b) 20%, transparent);
}
.au-quiz-feedback {
  font-size: 0.95rem;
  line-height: 1.5;
  min-height: 1.2em;
  padding-left: 0.1rem;
  border-left: 3px solid transparent;
  padding-left: 0.75rem;
}
.au-quiz-feedback:empty { display: none; }
.au-quiz-feedback.is-correta { border-left-color: var(--au-par-verde, #2e7d52); }
.au-quiz-feedback.is-errada { border-left-color: var(--au-par-laranja, #b1541b); }
.au-quiz-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.4rem;
}
.au-quiz-score {
  font-family: var(--au-mono, monospace);
  font-size: 0.85rem;
  opacity: 0.75;
}
.au-quiz-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.au-quiz-nav button {
  background: var(--au-par-azul, #1f5fa8);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 38px;
  height: 38px;
  font-size: 1.05rem;
  cursor: pointer;
  transition: opacity 140ms ease, transform 140ms ease;
}
.au-quiz-nav button:hover:not(:disabled) { transform: translateY(-1px); }
.au-quiz-nav button:disabled { opacity: 0.35; cursor: default; }
.au-quiz-count {
  font-family: var(--au-mono, monospace);
  font-size: 0.85rem;
  opacity: 0.7;
  min-width: 3.5rem;
  text-align: center;
}
@media print {
  .au-quiz-nav { display: none; }
  .au-quiz-opcao { cursor: default; }
}
`

export default (() => Quiz) satisfies QuartzComponentConstructor
