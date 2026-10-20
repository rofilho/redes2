// =========================================================================
// FONTE ÚNICA DE PERÍODO (period-as-config, Modelo A)
// -------------------------------------------------------------------------
// Troque APENAS este arquivo quando o semestre virar. Todas as páginas que
// usam o token {{PERIODO}} (ou {{ANO}}, {{SEMESTRE}}) no markdown acompanham
// automaticamente no próximo build. Histórico preservado: aulas de semestres
// encerrados que precisem do carimbo de origem escrevem o período no texto,
// não via token.
//
// Decisão: 2026-10-20 (Romualdo). Nível 1 / Modelo A — a aula sempre mostra o
// período corrente do portal. Mecanismo: transformer PeriodoToken.
// =========================================================================

export const PERIODO = {
  /** Código da disciplina na Uniube (aparece ao lado do período). */
  codigo: "49309",
  /** Ano letivo corrente. */
  ano: 2026,
  /** Semestre corrente (1 ou 2). */
  semestre: 2,
} as const

/** Rótulo canônico "ANO-SEMESTRE", ex.: "2026-2". É o que {{PERIODO}} injeta. */
export const PERIODO_ROTULO = `${PERIODO.ano}-${PERIODO.semestre}`
