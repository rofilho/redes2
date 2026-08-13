// Modo Aula — a mesma página, renderizada para projeção.
//
// Por que ele existe: as duas situações do aluno têm ótimos opostos. Projetada,
// a evidência manda quase nenhum texto (princípio da redundância de Mayer: texto
// na tela compete com a voz do professor). Lida em casa, sem a voz, o texto tem
// de carregar tudo. Um layout não serve aos dois — então são duas renderizações
// da MESMA fonte.
//
// O que ele mostra: só as camadas 1 (afirmação) e 2 (prova). A narração (camada 3)
// e o aparato (camada 4) continuam no arquivo e somem da tela.
//
// Ver _CEREBRO/PADRAO_APRESENTACAO_AULA.md (fonte de verdade do padrão).

const PROVA = [
  "figure.au-fig",
  ".au-term",
  "table",
  ".au-pratica",
  ".au-resumo",
  ".au-slot",
  ".au-caminho",
  "details.au-aposta",
].join(",")

// Camada 4: aparato. Nunca projeta.
const APARATO = [
  ".au-antes",
  ".au-refs",
  ".au-proxima",
  ".au-reflexao",
  ".au-podcast",
  ".au-aposta-nota",
].join(",")

type Passo = { titulo: HTMLElement | null; nos: HTMLElement[] }

function montarPassos(raiz: HTMLElement): Passo[] {
  const passos: Passo[] = []
  let atual: Passo | null = null

  for (const no of Array.from(raiz.children) as HTMLElement[]) {
    if (no.matches(APARATO)) continue

    // Um h2 abre um passo novo. É a camada 1: a afirmação.
    if (no.tagName === "H2") {
      atual = { titulo: no, nos: [] }
      passos.push(atual)
      continue
    }

    // Antes do primeiro h2 vive a abertura (o caminho, a recuperação).
    if (!atual) {
      if (no.matches(PROVA)) {
        atual = { titulo: null, nos: [no] }
        passos.push(atual)
        atual = null
      }
      continue
    }

    // h3 é sub-afirmação: abre passo próprio, herdando o contexto do h2.
    if (no.tagName === "H3") {
      atual = { titulo: no, nos: [] }
      passos.push(atual)
      continue
    }

    // Camada 2: a prova. É o que sobe à tela junto com a afirmação.
    if (no.matches(PROVA)) atual.nos.push(no)

    // Todo o resto é camada 3 (narração) — fica no arquivo, não na tela.
  }

  // Passo sem prova nenhuma continua existindo de propósito: na tela ele aparece
  // com o aviso de vazio, e é assim que o professor descobre, ensaiando, que
  // escreveu um título que era narração disfarçada.
  return passos
}

function montarPalco(passos: Passo[]): HTMLElement {
  const palco = document.createElement("div")
  palco.className = "au-palco"

  passos.forEach((p, i) => {
    const tela = document.createElement("section")
    tela.className = "au-tela"
    tela.dataset.n = String(i + 1)

    if (p.titulo) {
      const h = document.createElement("div")
      h.className = "au-tela-afirmacao"
      // Sem o [Conceito ⏳ 10 min] e sem a âncora: nenhum dos dois é a afirmação.
      const limpo = p.titulo.cloneNode(true) as HTMLElement
      limpo.querySelectorAll("a[role='anchor'], .au-selo").forEach((n) => n.remove())
      h.textContent = (limpo.textContent ?? "").replace(/\s*\[[^\]]*\]\s*$/, "").trim()
      h.dataset.nivel = p.titulo.tagName
      tela.appendChild(h)
    }

    if (p.nos.length === 0) {
      const vazio = document.createElement("div")
      vazio.className = "au-tela-vazia"
      vazio.textContent =
        "Sem prova visual. Este bloco era narração — no padrão, ele não sobe a título."
      tela.appendChild(vazio)
    } else {
      const corpo = document.createElement("div")
      corpo.className = "au-tela-prova"
      p.nos.forEach((n) => corpo.appendChild(n.cloneNode(true)))
      tela.appendChild(corpo)
    }

    palco.appendChild(tela)
  })

  return palco
}

document.addEventListener("nav", () => {
  const artigo = document.querySelector(".au-leitura") as HTMLElement | null
  const raiz = document.documentElement

  // Limpa o palco de uma navegação anterior (o Quartz troca o <article> inteiro).
  document.querySelectorAll(".au-palco, .au-hud, .au-botao-aula").forEach((n) => n.remove())
  raiz.classList.remove("au-modo-aula")

  if (!artigo) return

  const passos = montarPassos(artigo)
  if (passos.length === 0) return

  let i = 0
  let palco: HTMLElement | null = null
  let hud: HTMLElement | null = null

  const pintar = () => {
    if (!palco || !hud) return
    Array.from(palco.children).forEach((t, k) =>
      (t as HTMLElement).classList.toggle("on", k === i),
    )
    hud.querySelector(".au-hud-n")!.textContent = `${i + 1} / ${passos.length}`
    ;(hud.querySelector(".au-hud-bar i") as HTMLElement).style.width =
      `${((i + 1) / passos.length) * 100}%`
  }

  const ir = (d: number) => {
    const novo = i + d
    if (novo < 0 || novo >= passos.length) return
    i = novo
    pintar()
  }

  const sair = () => {
    raiz.classList.remove("au-modo-aula")
    palco?.remove()
    hud?.remove()
    palco = null
    hud = null
    document.removeEventListener("keydown", teclas)
  }

  const teclas = (e: KeyboardEvent) => {
    if (!raiz.classList.contains("au-modo-aula")) return
    if (e.key === "Escape") return sair()
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault()
      return ir(1)
    }
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault()
      return ir(-1)
    }
  }

  const entrar = () => {
    i = 0
    palco = montarPalco(passos)
    hud = document.createElement("div")
    hud.className = "au-hud"
    hud.innerHTML =
      '<span class="au-hud-n"></span>' +
      '<span class="au-hud-bar"><i></i></span>' +
      '<span class="au-hud-dica">← → navega · Esc sai</span>'
    document.body.appendChild(palco)
    document.body.appendChild(hud)
    raiz.classList.add("au-modo-aula")
    document.addEventListener("keydown", teclas)
    pintar()
  }

  const botao = document.createElement("button")
  botao.className = "au-botao-aula"
  botao.type = "button"
  botao.title = "Modo Aula — projetar (tecla A)"
  botao.innerHTML = "<span>▶</span> Modo Aula"
  botao.addEventListener("click", entrar)
  artigo.parentElement?.insertBefore(botao, artigo)

  document.addEventListener("keydown", (e) => {
    if (raiz.classList.contains("au-modo-aula")) return
    const alvo = e.target as HTMLElement
    if (alvo && /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName)) return
    if (e.key === "a" || e.key === "A") entrar()
  })
})
