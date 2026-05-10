import type { Schichtmodell } from './project-profile'

export type AutomationDegree = 'Teilautomatisierung' | 'Vollautomatisierung'

export interface CostRange {
  costMin: number
  costMax: number
  roiMin: number
  roiMax: number
  disclaimer: string
}

const DISCLAIMER = 'Indikative Schätzung — kein Angebot'

const TABLE: Record<AutomationDegree, Record<Schichtmodell, CostRange>> = {
  Teilautomatisierung: {
    '1-Schicht':        { costMin: 40000,  costMax: 80000,  roiMin: 30, roiMax: 42, disclaimer: DISCLAIMER },
    '2-Schicht':        { costMin: 50000,  costMax: 100000, roiMin: 24, roiMax: 36, disclaimer: DISCLAIMER },
    '3-Schicht / 24/7': { costMin: 60000,  costMax: 120000, roiMin: 20, roiMax: 30, disclaimer: DISCLAIMER },
  },
  Vollautomatisierung: {
    '1-Schicht':        { costMin: 80000,  costMax: 150000, roiMin: 24, roiMax: 36, disclaimer: DISCLAIMER },
    '2-Schicht':        { costMin: 100000, costMax: 200000, roiMin: 18, roiMax: 30, disclaimer: DISCLAIMER },
    '3-Schicht / 24/7': { costMin: 150000, costMax: 350000, roiMin: 18, roiMax: 24, disclaimer: DISCLAIMER },
  },
}

export function lookupCostRange(level: AutomationDegree, shift: Schichtmodell): CostRange {
  return TABLE[level][shift]
}

export function formatEuro(amount: number): string {
  if (amount >= 1000) return `${Math.round(amount / 1000)}k €`
  return `${amount} €`
}
