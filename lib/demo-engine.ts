import { KATEGORIE_KEYWORDS, type Kategorie } from '@/data/demo-scenarios'

export function detectKategorie(text: string): Kategorie {
  const lower = text.toLowerCase()
  const scores: Record<Kategorie, number> = {
    Robotik: 0,
    'AI-Agent': 0,
    Workflow: 0,
    Dokument: 0,
    Vision: 0,
    Hybrid: 0,
  }

  for (const [kat, keywords] of Object.entries(KATEGORIE_KEYWORDS) as [Kategorie, string[]][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[kat] += 1
    }
  }

  const best = (Object.entries(scores) as [Kategorie, number][]).sort((a, b) => b[1] - a[1])[0]
  // if no keyword matched at all, default to Hybrid
  if (best[1] === 0) return 'Hybrid'
  return best[0]
}

export const KATEGORIE_META: Record<Kategorie, { label: string; color: string; bg: string; icon: string; description: string }> = {
  Robotik: {
    label: 'Robotik & physische Automatisierung',
    color: 'text-accent',
    bg: 'bg-accent-muted border-accent/30',
    icon: '🤖',
    description: 'Cobots, Industrieroboter, AMR, Fördertechnik, Maschinenbestückung',
  },
  'AI-Agent': {
    label: 'AI-Agent & Kommunikation',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/30',
    icon: '🧠',
    description: 'Kundenservice, E-Mail-Automatisierung, Wissensassistent, Chatbot',
  },
  Workflow: {
    label: 'Workflow-Automatisierung',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/30',
    icon: '⚙️',
    description: 'Genehmigungs-Workflows, Prozessautomatisierung, No-Code / RPA',
  },
  Dokument: {
    label: 'Dokumenten-Automatisierung',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    icon: '📄',
    description: 'OCR, Datenextraktion, ERP-Übertragung, Rechnungsverarbeitung',
  },
  Vision: {
    label: 'Computer Vision & Qualitätsprüfung',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/30',
    icon: '👁️',
    description: 'Sichtkontrolle, Inline-Prüfung, Fehlererkennnung, Deep Learning',
  },
  Hybrid: {
    label: 'Hybridlösung (Robotik + Software)',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10 border-pink-400/30',
    icon: '⚡',
    description: 'Kombination aus physischer Automatisierung und AI/Software',
  },
}

export function komplexitaetLabel(n: number): string {
  return ['', 'Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'][n] ?? '–'
}

export function formatEuroRange(min: number, max: number): string {
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`
  return `${fmt(min)} – ${fmt(max)} €`
}
