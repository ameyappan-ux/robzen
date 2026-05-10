'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Banknote, MessageSquare, RotateCcw } from 'lucide-react'
import { decodeProfile } from '@/lib/project-profile'
import type { AutomationLevel, FundingEligibility } from '@/lib/project-profile'

const LEVEL_CONFIG: Record<AutomationLevel, { label: string; color: string; bg: string; description: string }> = {
  Hoch: {
    label: 'Hohes Potenzial',
    color: 'text-accent',
    bg: 'bg-accent-muted border-accent/30',
    description:
      'Ihr Projekt hat die Voraussetzungen für eine wirtschaftlich sinnvolle Automatisierung. Budget, Zielsetzung und Prozessvolumen passen zusammen.',
  },
  Mittel: {
    label: 'Mittleres Potenzial',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    description:
      'Automatisierung ist möglich, aber es gibt offene Fragen — zum Beispiel zu Budget oder konkreten Zielen. Ein Gespräch hilft, Klarheit zu schaffen.',
  },
  Niedrig: {
    label: 'Geringes Potenzial',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    description:
      'Mit den aktuellen Angaben ist eine wirtschaftliche Automatisierung schwer darstellbar. Das kann sich ändern — sprechen Sie uns an.',
  },
}

const FUNDING_CONFIG: Record<FundingEligibility, { label: string; detail: string }> = {
  Wahrscheinlich: {
    label: 'Fördermittel wahrscheinlich',
    detail: 'Basierend auf Ihren Angaben kommen Sie möglicherweise für staatliche Förderprogramme (z.B. „Digital Jetzt") in Frage.',
  },
  Möglicherweise: {
    label: 'Fördermittel möglich',
    detail: 'Je nach finalem Projektvolumen und Unternehmensstruktur können Förderprogramme relevant sein.',
  },
  Unwahrscheinlich: {
    label: 'Förderung eher unwahrscheinlich',
    detail: 'Bei diesem Projektvolumen sind staatliche Förderprogramme weniger wahrscheinlich.',
  },
}

const USE_CASES: Record<string, string[]> = {
  'Kapazität erhöhen': ['Cobot-Montage', 'Vollautomatische Fertigungslinie', 'AMR-Transport'],
  'Fachkräftemangel ausgleichen': ['Cobot-Palettierung', 'Automatische Qualitätsprüfung', 'AMR-Transport'],
  'Fehlerquote senken': ['KI-Qualitätsprüfung', 'Cobot-Montage mit Kamerasystem'],
  'Kosten reduzieren': ['Cobot-Palettierung', 'AMR-Transport', 'Automatische Verpackung'],
  'Durchlaufzeiten verkürzen': ['AMR-Transport', 'Cobot-Montage', 'KI-Prozesssteuerung'],
}

function ResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const encoded = params.get('p')
  const profile = decodeProfile(encoded)

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-muted mb-4">Kein gültiges Ergebnis gefunden.</p>
        <button
          onClick={() => router.push('/automatisierungs-check')}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
        >
          <RotateCcw size={14} /> Neu starten
        </button>
      </div>
    )
  }

  const levelCfg = LEVEL_CONFIG[profile.automationLevel]
  const fundingCfg = FUNDING_CONFIG[profile.fundingEligibility]
  const useCases = USE_CASES[profile.ziel] ?? USE_CASES['Kapazität erhöhen']

  const chatParams = new URLSearchParams({ p: encoded! })

  return (
    <div className="space-y-6">
      {/* Score badge */}
      <div className={`rounded-2xl border p-6 ${levelCfg.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={20} className={levelCfg.color} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${levelCfg.color}`}>
            Automatisierungspotenzial
          </span>
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${levelCfg.color}`}>{levelCfg.label}</h2>
        <p className="text-sm text-muted leading-relaxed">{levelCfg.description}</p>
      </div>

      {/* Profile summary */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-sm text-muted uppercase tracking-wider mb-4">Ihre Angaben</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt className="text-muted-2 text-xs mb-0.5">Prozess</dt><dd className="text-foreground">{profile.prozess.slice(0, 60)}{profile.prozess.length > 60 ? '…' : ''}</dd></div>
          <div><dt className="text-muted-2 text-xs mb-0.5">Mitarbeiter</dt><dd className="text-foreground">{profile.mitarbeiter}</dd></div>
          <div><dt className="text-muted-2 text-xs mb-0.5">Ziel</dt><dd className="text-foreground">{profile.ziel}</dd></div>
          <div><dt className="text-muted-2 text-xs mb-0.5">Budget</dt><dd className="text-foreground">{profile.budget}</dd></div>
          <div><dt className="text-muted-2 text-xs mb-0.5">Schichten</dt><dd className="text-foreground">{profile.schichten}</dd></div>
          <div><dt className="text-muted-2 text-xs mb-0.5">Zeithorizont</dt><dd className="text-foreground">{profile.zeithorizont}</dd></div>
        </dl>
      </div>

      {/* Relevant use cases */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-semibold mb-3">Passende Lösungsansätze</h3>
        <ul className="space-y-2">
          {useCases.map((uc) => (
            <li key={uc} className="flex items-center gap-2 text-sm text-muted">
              <span className="size-1.5 rounded-full bg-accent flex-shrink-0" />
              {uc}
            </li>
          ))}
        </ul>
        <Link href="/use-cases" className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover mt-3 transition-colors">
          Alle Use Cases ansehen <ArrowRight size={12} />
        </Link>
      </div>

      {/* Funding hint */}
      <div className="rounded-2xl border border-border bg-surface p-6 flex gap-4">
        <Banknote size={20} className="text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">{fundingCfg.label}</p>
          <p className="text-sm text-muted leading-relaxed">{fundingCfg.detail}</p>
          <p className="text-xs text-muted-2 mt-1 italic">Orientierung — kein Förderversprechen.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-accent/20 bg-accent-muted p-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={18} className="text-accent" />
          <h3 className="font-semibold">Nächster Schritt: Projektprofil erstellen</h3>
        </div>
        <p className="text-sm text-muted mb-4">
          Unser KI-Assistent stellt Ihnen gezielte Fragen und erstellt daraus ein konkretes
          Projekt-Steckbrief — mit Kostenrahmen und nächsten Schritten.
        </p>
        <Link
          href={`/projekt-starten?${chatParams}`}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
        >
          Jetzt Projekt starten <ArrowRight size={15} />
        </Link>
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push('/automatisierungs-check')}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <RotateCcw size={12} /> Check neu starten
        </button>
      </div>
    </div>
  )
}

export default function ResultScreen() {
  return (
    <Suspense fallback={<div className="text-center text-muted py-20">Ergebnis wird geladen…</div>}>
      <ResultContent />
    </Suspense>
  )
}
