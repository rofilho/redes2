// Flashcards — revisão ativa, sem backend.
//
// Por que componente global e não <script> na página: o Quartz sanitiza
// <script> executável vindo do Markdown (sobra só o <script type="application/json">
// dos dados). Então a marcação na aula é SÓ dados + esqueleto; o comportamento
// mora aqui e hidrata todo bloco .au-flashcards, em qualquer aula. É a esteira:
// o autor cola o bloco mínimo, o componente faz o resto.
//
// Fonte de verdade do padrão de interatividade: relatório de pesquisa
// (workspace/relatorio-interatividade-portal-aulas.md) + Kit de Componentes §15.

type Card = { q: string; a: string }

function hidratar(root: HTMLElement): void {
  if (root.dataset.fcReady === "1") return // idempotente: o nav pode reprocessar
  const dataEl = root.querySelector<HTMLElement>(".au-fc-data")
  const stage = root.querySelector<HTMLElement>(".au-fc-stage")
  const face = root.querySelector<HTMLElement>(".au-fc-face")
  const count = root.querySelector<HTMLElement>(".au-fc-count")
  const prev = root.querySelector<HTMLButtonElement>(".au-fc-prev")
  const next = root.querySelector<HTMLButtonElement>(".au-fc-next")
  if (!dataEl || !stage || !face || !count || !prev || !next) return

  let cards: Card[] = []
  try {
    // Quartz escapa entidades HTML (&quot;, &lt;, &amp;) dentro do <script type=
    // "application/json"> vindo do Markdown; o textContent de um <script> NÃO
    // decodifica entidades, então decodificamos à mão antes do JSON.parse.
    const raw = dataEl.textContent ?? "[]"
    const decoded = (() => {
      const ta = document.createElement("textarea")
      ta.innerHTML = raw
      return ta.value
    })()
    cards = JSON.parse(decoded) as Card[]
  } catch {
    cards = []
  }
  if (cards.length === 0) {
    face.textContent = "Sem cards."
    return
  }

  let i = 0
  let showingAnswer = false

  const pintar = () => {
    const c = cards[i]
    face.innerHTML = showingAnswer ? c.a : c.q
    stage.classList.toggle("au-fc-q", !showingAnswer)
    stage.classList.toggle("is-answer", showingAnswer)
    count.textContent = `${i + 1} / ${cards.length}`
    prev.disabled = i === 0
    next.disabled = i === cards.length - 1
  }

  const virar = () => {
    showingAnswer = !showingAnswer
    pintar()
  }

  const ir = (d: number) => {
    const novo = i + d
    if (novo < 0 || novo >= cards.length) return
    i = novo
    showingAnswer = false
    pintar()
  }

  stage.addEventListener("click", virar)
  stage.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      virar()
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      ir(1)
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      ir(-1)
    }
  })
  prev.addEventListener("click", (e) => {
    e.stopPropagation()
    ir(-1)
  })
  next.addEventListener("click", (e) => {
    e.stopPropagation()
    ir(1)
  })

  root.dataset.fcReady = "1"
  pintar()
}

document.addEventListener("nav", () => {
  document.querySelectorAll<HTMLElement>(".au-flashcards").forEach(hidratar)
})
