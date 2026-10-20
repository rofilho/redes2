import { QuartzTransformerPlugin } from "../types"
import { PERIODO, PERIODO_ROTULO } from "../../periodo"

// =========================================================================
// PeriodoToken — injeta o período corrente do portal (Modelo A).
// -------------------------------------------------------------------------
// Substitui, no markdown-fonte (antes do parse), os tokens:
//   {{PERIODO}}   -> "2026-2"   (rótulo canônico ANO-SEMESTRE)
//   {{ANO}}       -> "2026"
//   {{SEMESTRE}}  -> "2"
//   {{CODIGO}}    -> "49309"    (código da disciplina)
// A fonte única é quartz/periodo.ts. Troca o semestre num lugar só; todas as
// páginas que usam o token acompanham no próximo build.
// =========================================================================

const TOKENS: Record<string, string> = {
  "{{PERIODO}}": PERIODO_ROTULO,
  "{{ANO}}": String(PERIODO.ano),
  "{{SEMESTRE}}": String(PERIODO.semestre),
  "{{CODIGO}}": PERIODO.codigo,
}

export const PeriodoToken: QuartzTransformerPlugin = () => {
  return {
    name: "PeriodoToken",
    textTransform(_ctx, src) {
      let out = src
      for (const [token, value] of Object.entries(TOKENS)) {
        out = out.split(token).join(value)
      }
      return out
    },
  }
}
