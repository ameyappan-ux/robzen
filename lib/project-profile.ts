export type Schichtmodell = '1-Schicht' | '2-Schicht' | '3-Schicht / 24/7'
export type BudgetRange = '<50k' | '50-150k' | '150-500k' | '>500k' | 'unklar'
export type AutomationLevel = 'Niedrig' | 'Mittel' | 'Hoch'
export type FundingEligibility = 'Wahrscheinlich' | 'Möglicherweise' | 'Unwahrscheinlich'

export interface ProjectProfile {
  id: string
  prozess: string
  mitarbeiter: string
  schichten: Schichtmodell
  ziel: string
  budget: BudgetRange
  zeithorizont: string
  raeumlich: string
  automationLevel: AutomationLevel
  fundingEligibility: FundingEligibility
  createdAt: string
}

export function encodeProfile(profile: ProjectProfile): string {
  return btoa(encodeURIComponent(JSON.stringify(profile)))
}

export function decodeProfile(encoded: string | null | undefined): ProjectProfile | null {
  if (!encoded) return null
  try {
    return JSON.parse(decodeURIComponent(atob(encoded))) as ProjectProfile
  } catch {
    return null
  }
}
