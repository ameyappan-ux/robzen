import type { Kategorie } from '@/data/demo-scenarios'

export interface DemoSession {
  id: string
  scenarioId?: string
  kategorie?: Kategorie
  problemText?: string
  advisorAnswers: Record<string, string>
  selectedSolutionId?: string
  konfiguratorParams?: Record<string, unknown>
  createdAt: string
}

const KEY = (id: string) => `robzen-demo-${id}`

export function createSession(overrides?: Partial<DemoSession>): DemoSession {
  const id = Math.random().toString(36).slice(2, 10)
  const session: DemoSession = {
    id,
    advisorAnswers: {},
    createdAt: new Date().toISOString(),
    ...overrides,
  }
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(KEY(id), JSON.stringify(session))
  }
  return session
}

export function getSession(id: string): DemoSession | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(KEY(id))
  if (!raw) return null
  try {
    return JSON.parse(raw) as DemoSession
  } catch {
    return null
  }
}

export function updateSession(id: string, updates: Partial<DemoSession>): DemoSession | null {
  const session = getSession(id)
  if (!session) return null
  const updated = { ...session, ...updates }
  sessionStorage.setItem(KEY(id), JSON.stringify(updated))
  return updated
}
