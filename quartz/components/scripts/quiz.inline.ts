// Quiz autocorretivo — verificação ativa, sem backend e sem nota.
//
// Mesmo padrão dos Flashcards (ver flashcards.inline.ts): o Quartz sanitiza
// <script> executável vindo do Markdown, então a marcação na aula é SÓ dados
// (um <script type="application/json">) + esqueleto; o comportamento mora aqui
// e hidrata todo bloco .au-quiz, em qualquer aula. O aluno clica numa opção,
// a questão trava, revela a explicação e soma no placar. NADA é enviado nem
// guardado — é estudo, não avaliação. Ver Kit de Componentes §16.

type Questao = {
  q: string
  opcoes: string[]
  correta: number
  explica?: string
}

function hidratar(root: HTMLElement): void {
  if (root.dataset.quizReady === "1") return // idempotente: o nav pode reprocessar
  const dataEl = root.querySelector<HTMLElement>(".au-quiz-data")
  const stage = root.querySelector<HTMLElement>(".au-quiz-stage")
  const enun = root.querySelector<HTMLElement>(".au-quiz-q")
  const opcoesWrap = root.querySelector<HTMLElement>(".au-quiz-opcoes")
  const feedback = root.querySelector<HTMLElement>(".au-quiz-feedback")
  const count = root.querySelector<HTMLElement>(".au-quiz-count")
  const score = root.querySelector<HTMLElement>(".au-quiz-score")
  const prev = root.querySelector<HTMLButtonElement>(".au-quiz-prev")
  const next = root.querySelector<HTMLButtonElement>(".au-quiz-next")
  if (!dataEl || !stage || !enun || !opcoesWrap || !feedback || !count || !score || !prev || !next) {
    return
  }

  let questoes: Questao[] = []
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
    questoes = JSON.parse(decoded) as Questao[]
  } catch {
    questoes = []
  }
  if (questoes.length === 0) {
    enun.textContent = "Sem questões."
    return
  }

  let i = 0
  // Estado por questão: null = não respondida; número = índice escolhido.
  const escolhido: (number | null)[] = questoes.map(() => null)

  const acertos = () =>
    escolhido.reduce<number>((n, esc, idx) => (esc === questoes[idx].correta ? n + 1 : n), 0)
  const respondidas = () => escolhido.filter((e) => e !== null).length

  const pintar = () => {
    const quest = questoes[i]
    enun.innerHTML = quest.q
    count.textContent = `${i + 1} / ${questoes.length}`

    // Reconstrói as opções do zero a cada pintura (idempotente ao navegar).
    opcoesWrap.innerHTML = ""
    const jaRespondida = escolhido[i] !== null

    quest.opcoes.forEach((texto, idx) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "au-quiz-opcao"
      btn.innerHTML = texto
      btn.setAttribute("role", "radio")
      btn.setAttribute("aria-checked", "false")

      if (jaRespondida) {
        btn.disabled = true
        const ehCorreta = idx === quest.correta
        const foiEscolhida = idx === escolhido[i]
        if (ehCorreta) btn.classList.add("is-correta")
        if (foiEscolhida && !ehCorreta) btn.classList.add("is-errada")
        if (foiEscolhida) btn.setAttribute("aria-checked", "true")
      } else {
        btn.addEventListener("click", () => responder(idx))
      }
      opcoesWrap.appendChild(btn)
    })

    if (jaRespondida) {
      const esc = escolhido[i] as number
      const acertou = esc === quest.correta
      feedback.className = `au-quiz-feedback ${acertou ? "is-correta" : "is-errada"}`
      const marca = acertou ? "✓ Correto." : "✗ Não é essa."
      feedback.innerHTML = quest.explica ? `<b>${marca}</b> ${quest.explica}` : `<b>${marca}</b>`
    } else {
      feedback.className = "au-quiz-feedback"
      feedback.innerHTML = ""
    }

    score.textContent = `Placar: ${acertos()} / ${respondidas()} respondida(s)`
    prev.disabled = i === 0
    next.disabled = i === questoes.length - 1
  }

  const responder = (idx: number) => {
    if (escolhido[i] !== null) return // trava: uma resposta por questão
    escolhido[i] = idx
    pintar()
  }

  const ir = (d: number) => {
    const novo = i + d
    if (novo < 0 || novo >= questoes.length) return
    i = novo
    pintar()
  }

  stage.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      ir(1)
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      ir(-1)
    }
  })
  prev.addEventListener("click", () => ir(-1))
  next.addEventListener("click", () => ir(1))

  root.dataset.quizReady = "1"
  pintar()
}

function hidratarTodos(): void {
  document.querySelectorAll<HTMLElement>(".au-quiz").forEach(hidratar)
}

// Hidrata na carga inicial E a cada 'nav' (SPA) — idempotente via dataset.
// Só o 'nav' deixava o quiz vazio numa carga direta (abrir a URL / F5).
document.addEventListener("nav", hidratarTodos)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hidratarTodos)
} else {
  hidratarTodos()
}
