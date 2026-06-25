export type NodeType = 'choice' | 'script' | 'info'
export type Project = 'robzen' | 'zenmind'
export type ContactStatus = 'offen' | 'kontaktiert' | 'nicht erreicht' | 'Folgetermin' | 'abgeschlossen'
export type ProblemConfirmed = 'ja' | 'teils' | 'nein' | 'unklar'

export interface ScriptOption {
  label: string
  next: string
}

export interface ScriptNode {
  id: string
  phase: string
  title: string
  type: NodeType
  say: string
  tip: string
  signal: string
  options: ScriptOption[]
}

export interface ProjectScript {
  startNode: string
  nodes: Record<string, ScriptNode>
}

export interface Scripts {
  robzen: ProjectScript
  zenmind: ProjectScript
}

export interface Contact {
  id: string
  project: Project
  company: string
  contactName: string
  role: string
  phone: string
  email: string
  createdAt: string
  lastContactedAt: string
  status: ContactStatus
  callIds: string[]
}

export interface CallOutcome {
  problemConfirmed: ProblemConfirmed
  energy: number
  priceAnchor: string
  strongSignal: boolean
  referral: string
}

export interface Call {
  id: string
  contactId: string
  project: Project
  date: string
  path: string[]
  outcome: CallOutcome
  quotes: string
  notes: string
}
