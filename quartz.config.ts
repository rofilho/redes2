import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 — Redes de Computadores II (49309) · Uniube · 2026-2
 *
 * Paleta e tipografia seguem o Design System de Aulas v2.0
 * (vault: .claude\skills\criacao-aulas\references\design-system-html.md).
 * Cores ancoradas nos pares do cabo T568B — semântica fixa em toda a disciplina:
 *   azul    #1f5fa8  conceito, link, VLAN de dados
 *   verde   #2e7d52  sucesso, verificação, estado convergido
 *   laranja #b1541b  atenção, quebra deliberada, VLAN de voz
 *   marrom  #6b4423  legado, "não faça isso"
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "🌐 Redes de Computadores II",
    pageTitleSuffix: " | Prof. Romualdo",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "pt-BR",
    baseUrl: "rofilho.github.io/redes2",
    ignorePatterns: [
      "private",
      ".obsidian",
      // Regra Hard #2 — nada de prova, gabarito ou banco de questões no site.
      "avaliacoes",
      "Provas",
      // arquivos de planejamento do professor: ficam no vault, não no portal
      "_Sistema_de_Aulas",
      "_Template_Aula",
      "Redes2_Plano_Semestre",
      "Redes2_Cronograma",
      "Redes2_Avaliacoes",
      "Redes2_Semana*",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        // Space Grotesk no display: geometrica, com corte tecnico de instrumento
        // de medicao — vocabulario do proprio assunto. Usada com parcimonia
        // (hero, titulos de bloco, codigo da semana). Inter no corpo, como pedido.
        header: "Space Grotesk",
        body: "Inter",
        code: "JetBrains Mono",
      },
      // Paleta ancorada na identidade REAL da Uniube, extraida dos proprios
      // ativos da instituicao em 26/07/2026 (nao inventada):
      //   #1D2057  tinta do logo oficial (logo_azul.svg, fill:rgb(29,32,87))
      //   #11275B  azul profundo do uniube.br
      //   #2778C4  azul de acao/link do uniube.br
      //   #00AA9F  turquesa — o acento distintivo da marca
      colors: {
        // claro = a CARA do portal (off-white nitido, navy institucional)
        lightMode: {
          light: "#fafaf8",
          lightgray: "#e9e7e2",
          gray: "#8a8f98",
          darkgray: "#252a3f",
          dark: "#1d2057",
          secondary: "#2778c4",
          tertiary: "#00aa9f",
          highlight: "rgba(39, 120, 196, 0.07)",
          textHighlight: "#ffd97d66",
        },
        // escuro = modo operação (bancada, ao lado do Packet Tracer).
        // O navy vira o proprio fundo — a marca continua presente no escuro.
        darkMode: {
          light: "#10131f",
          lightgray: "#272c42",
          gray: "#7b8397",
          darkgray: "#e2e5ef",
          dark: "#f4f5f9",
          secondary: "#3fd0c4",
          tertiary: "#7fb4ea",
          highlight: "rgba(63, 208, 196, 0.10)",
          textHighlight: "#2778c466",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
