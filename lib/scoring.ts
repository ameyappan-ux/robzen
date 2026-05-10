import type { BudgetRange, AutomationLevel, FundingEligibility } from './project-profile'

export interface CheckInput {
  budget: BudgetRange
  ziel: string
  mitarbeiter: string
  zeithorizont: string
  prozess: string
}

const ZIELE_HOCH = ['kapazität', 'kapazitaet', 'fachkräfte', 'fachkraefte', 'personal']
const BUDGETS_HOCH: BudgetRange[] = ['50-150k', '150-500k', '>500k']
const BUDGETS_NIEDRIG: BudgetRange[] = ['<50k']

function parseMitarbeiter(s: string): number {
  const n = parseInt(s.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? 0 : n
}

function isZeitHorizontLang(zeithorizont: string): boolean {
  const lower = zeithorizont.toLowerCase()
  const match = lower.match(/(\d+)\s*(jahr|jahre|years?)/)
  if (match) return parseInt(match[1], 10) > 2
  return false
}

function isProzessVague(prozess: string): boolean {
  return prozess.trim().length < 10
}

export function automatisierungsScore(input: CheckInput): AutomationLevel {
  const budgetHoch = BUDGETS_HOCH.includes(input.budget)
  const budgetNiedrig = BUDGETS_NIEDRIG.includes(input.budget)
  const zielLower = input.ziel.toLowerCase()
  const zielPasst = ZIELE_HOCH.some((z) => zielLower.includes(z))
  const mitarbeiter = parseMitarbeiter(input.mitarbeiter)
  const zeitLang = isZeitHorizontLang(input.zeithorizont)
  const prozessVague = isProzessVague(input.prozess)

  if (budgetNiedrig || zeitLang || prozessVague) return 'Niedrig'
  if (budgetHoch && zielPasst && mitarbeiter >= 2) return 'Hoch'
  return 'Mittel'
}

export function fundingEligibility(input: CheckInput): FundingEligibility {
  const budgetOk = BUDGETS_HOCH.includes(input.budget)
  const mitarbeiter = parseMitarbeiter(input.mitarbeiter)
  if (budgetOk && mitarbeiter >= 10) return 'Wahrscheinlich'
  if (input.budget === '<50k') return 'Unwahrscheinlich'
  return 'Möglicherweise'
}
