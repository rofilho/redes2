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
        // identidade LMS clean (Brilliant/LearnHouse): sans moderna em tudo
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        // claro = a CARA do portal (off-white, pastel, cards arredondados)
        lightMode: {
          light: "#fafaf8",
          lightgray: "#eceae5",
          gray: "#8a8f98",
          darkgray: "#2b2e35",
          dark: "#16181d",
          secondary: "#3b6ce0",
          tertiary: "#2f9469",
          highlight: "rgba(59, 108, 224, 0.07)",
          textHighlight: "#f5d68a66",
        },
        // escuro = modo operação (bancada, ao lado do Packet Tracer)
        darkMode: {
          light: "#12161c",
          lightgray: "#29313c",
          gray: "#6b7683",
          darkgray: "#dfe4ea",
          dark: "#f2f3f5",
          secondary: "#63c78e",
          tertiary: "#8fc4f5",
          highlight: "rgba(99, 199, 142, 0.10)",
          textHighlight: "#b1541b66",
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
