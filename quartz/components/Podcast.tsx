import { QuartzComponent, QuartzComponentConstructor } from "./types"

// Componente SEM JavaScript: o <audio controls> nativo já traz os controles de
// play/pausa/seek, então aqui só estilizamos o container .au-podcast nas cores
// do design system. A marcação (título, descrição, aviso de origem IA e o
// <audio>) é escrita na aula, no Markdown — ver Kit de Componentes §17.
// Não há hidratador: nada a executar, só CSS global.
const Podcast: QuartzComponent = () => null

Podcast.css = `
/* ==========================================================================
   PODCAST DA AULA — apoio de revisão em áudio (gerado por IA no NotebookLM).
   CSS-only: o <audio controls> nativo basta; estilizamos só a moldura.
   Cor-assinatura: azul do design system.
   ========================================================================== */
.au-podcast {
  max-width: 620px;
  margin: 1.5rem auto;
  background: var(--au-sfc, var(--secondary, #f0f3f8));
  color: var(--au-tx, var(--dark, #1d2057));
  border: 1px solid color-mix(in srgb, var(--au-par-azul, #1f5fa8) 30%, transparent);
  border-left: 4px solid var(--au-par-azul, #1f5fa8);
  border-radius: 12px;
  padding: 1.1rem 1.3rem;
}
.au-podcast p { margin: 0.35rem 0; line-height: 1.5; }
.au-podcast p:first-child {
  font-size: 1.05rem;
  font-weight: 600;
}
.au-podcast .au-podcast-origem {
  font-size: 0.82rem;
  opacity: 0.7;
  font-family: var(--au-mono, monospace);
}
.au-podcast audio {
  width: 100%;
  margin-top: 0.6rem;
  border-radius: 8px;
}
@media print {
  .au-podcast audio { display: none; }
}
`

export default (() => Podcast) satisfies QuartzComponentConstructor
