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

// Camada 2: o que serve de prova na tela.
// `pre` cobre o diagrama Mermaid e o bloco de código — os dois são literais.
// `ol` entra porque lista numerada é sequência a executar, não narração: num
// bloco de mão na massa, é justamente o que o aluno precisa ver enquanto faz.
// `ul` fica de fora — lista com marcador é enumeração narrada.
// `blockquote:not(.callout)` é a citação projetada; callout do Obsidian é nota,
// e nota é narração.
const PROVA = [
  "figure.au-fig",
  ".au-term",
  "table",
  "pre",
  "ol",
  "blockquote:not(.callout)",
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

type Bloco = { titulo: HTMLElement | null; nos: HTMLElement[]; divisor: boolean }
type Passo = { titulo: HTMLElement | null; no: HTMLElement | null; divisor: boolean }

function montarBlocos(raiz: HTMLElement): Bloco[] {
  const blocos: Bloco[] = []
  let atual: Bloco | null = null

  for (const no of Array.from(raiz.children) as HTMLElement[]) {
    // A aula acaba aqui. Daqui para baixo é aparato — questões, "para ir além",
    // referências — que existe para o estudo em casa e nunca projeta.
    if (no.matches("hr.au-fim-aula")) break

    if (no.matches(APARATO)) continue

    // Um h2 abre um bloco novo. É a camada 1: a afirmação.
    if (no.tagName === "H2") {
      atual = { titulo: no, nos: [], divisor: false }
      blocos.push(atual)
      continue
    }

    // Antes do primeiro h2 vive a abertura (o caminho, a recuperação).
    if (!atual) {
      if (no.matches(PROVA)) blocos.push({ titulo: null, nos: [no], divisor: false })
      continue
    }

    // h3 é sub-afirmação: abre bloco próprio. E se ele vier logo depois de um h2
    // ainda vazio, aquele h2 não era um bloco sem prova — era o anúncio da
    // seção. Vira divisor, que é sinalização (Mayer), não defeito.
    if (no.tagName === "H3") {
      if (atual.titulo?.tagName === "H2" && atual.nos.length === 0) atual.divisor = true
      atual = { titulo: no, nos: [], divisor: false }
      blocos.push(atual)
      continue
    }

    // Camada 2: a prova. É o que sobe à tela junto com a afirmação.
    if (no.matches(PROVA)) atual.nos.push(no)

    // Todo o resto é camada 3 (narração) — fica no arquivo, não na tela.
  }

  return blocos
}

// Uma prova por tela. Duas evidências disputando a mesma tela é atenção
// dividida; separadas, com a afirmação repetida, viram segmentação.
// Bloco sem prova nenhuma e que não é divisor continua aparecendo com o aviso
// de vazio — é assim que o professor descobre, ensaiando, que escreveu um
// título que era narração disfarçada.
function montarPassos(blocos: Bloco[]): Passo[] {
  const passos: Passo[] = []
  for (const b of blocos) {
    if (b.nos.length === 0) {
      passos.push({ titulo: b.titulo, no: null, divisor: b.divisor })
      continue
    }
    for (const no of b.nos) passos.push({ titulo: b.titulo, no, divisor: false })
  }
  return passos
}

function montarPalco(passos: Passo[]): HTMLElement {
  const palco = document.createElement("div")
  palco.className = "au-palco"

  passos.forEach((p, i) => {
    const tela = document.createElement("section")
    tela.className = p.divisor ? "au-tela au-tela-divisor" : "au-tela"
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

    if (p.no) {
      const corpo = document.createElement("div")
      corpo.className = "au-tela-prova"
      corpo.appendChild(p.no.cloneNode(true))
      tela.appendChild(corpo)
    } else if (!p.divisor) {
      const vazio = document.createElement("div")
      vazio.className = "au-tela-vazia"
      vazio.textContent =
        "Sem prova visual. Este bloco era narração — no padrão, ele não sobe a título."
      tela.appendChild(vazio)
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

  const passos = montarPassos(montarBlocos(artigo))
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
