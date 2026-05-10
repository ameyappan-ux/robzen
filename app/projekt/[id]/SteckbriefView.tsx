'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, MessageSquare, Printer } from 'lucide-react'
import { decodeProfile } from '@/lib/project-profile'
import { lookupCostRange, formatEuro } from '@/lib/cost-lookup'
import type { AutomationLevel, FundingEligibility } from '@/lib/project-profile'
import type { AutomationDegree } from '@/lib/cost-lookup'
import type { Schichtmodell } from '@/lib/project-profile'

const LEVEL_COLOR: Record<AutomationLevel, string> = {
  Hoch: 'text-accent',
  Mittel: 'text-yellow-400',
  Niedrig: 'text-red-400',
}

const FUNDING_COLOR: Record<FundingEligibility, string> = {
  Wahrscheinlich: 'text-accent',
  Möglicherweise: 'text-yellow-400',
  Unwahrscheinlich: 'text-muted',
}

const SCHICHT_OPTIONS: Schichtmodell[] = ['1-Schicht', '2-Schicht', '3-Schicht / 24/7']

function SteckbriefContent() {
  const params = useSearchParams()
  const profile = decodeProfile(params.get('p'))

  const [automationDegree, setAutomationDegree] = useState<AutomationDegree>('Teilautomatisierung')
  const [schicht, setSchicht] = useState<Schichtmodell>(profile?.schichten ?? '1-Schicht')

  if (!profile) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <AlertCircle size={32} className="text-muted mx-auto mb-3" />
        <p className="text-muted mb-4">Kein Projektprofil gefunden.</p>
        <Link
          href="/projekt-starten"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
        >
          Projekt neu starten
        </Link>
      </div>
    )
  }

  const costRange = lookupCostRange(automationDegree, schicht)

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/projekt-starten"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Zurück zum Chat
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Ihr Projekt-Steckbrief</h1>
            <p className="text-sm text-muted">Erstellt am {new Date(profile.createdAt).toLocaleDateString('de-DE')}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end items-center">
            <span className={`text-xs font-semibold rounded-full px-3 py-1 bg-surface border border-border ${LEVEL_COLOR[profile.automationLevel]}`}>
              {profile.automationLevel} Potenzial
            </span>
            <span className="text-xs rounded-full px-3 py-1 bg-surface border border-border text-muted">
              Demo-Daten
            </span>
            <button
              onClick={() => window.print()}
              className="print:hidden inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              aria-label="Drucken / PDF exportieren"
            >
              <Printer size={12} /> Drucken / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Profile fields */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-semibold text-sm text-muted uppercase tracking-wider mb-4">Projektdetails</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {[
            { label: 'Prozesstyp', value: profile.prozess },
            { label: 'Mitarbeitende', value: profile.mitarbeiter },
            { label: 'Schichtmodell', value: profile.schichten },
            { label: 'Ziel', value: profile.ziel },
            { label: 'Budget', value: profile.budget },
            { label: 'Zeithorizont', value: profile.zeithorizont },
            { label: 'Förderung', value: profile.fundingEligibility },
            ...(profile.raeumlich ? [{ label: 'Räumliche Constraints', value: profile.raeumlich }] : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-muted-2 mb-0.5">{label}</dt>
              <dd className={`text-foreground ${label === 'Förderung' ? FUNDING_COLOR[profile.fundingEligibility] : ''}`}>
                {value || '—'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Configurator */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Kostenrechner</h2>
          <span className="text-xs text-muted-2 rounded-full border border-border px-2 py-0.5">
            Indikative Schätzung
          </span>
        </div>

        <div className="space-y-5 mb-6">
          {/* Automation degree */}
          <div>
            <label className="block text-sm font-medium mb-2">Automatisierungsgrad</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Teilautomatisierung', 'Vollautomatisierung'] as AutomationDegree[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setAutomationDegree(d)}
                  className={`rounded-lg border px-4 py-2.5 text-sm transition-all ${
                    automationDegree === d
                      ? 'border-accent bg-accent-muted text-accent'
                      : 'border-border bg-background text-foreground hover:border-accent/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Shift model */}
          <div>
            <label className="block text-sm font-medium mb-2">Schichtmodell</label>
            <div className="grid grid-cols-3 gap-2">
              {SCHICHT_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchicht(s)}
                  className={`rounded-lg border px-3 py-2.5 text-xs transition-all ${
                    schicht === s
                      ? 'border-accent bg-accent-muted text-accent'
                      : 'border-border bg-background text-foreground hover:border-accent/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-accent/20 bg-accent-muted p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-2 mb-1">Investitionsrahmen</p>
              <p className="text-xl font-bold text-accent">
                {formatEuro(costRange.costMin)} – {formatEuro(costRange.costMax)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-2 mb-1">ROI-Horizont</p>
              <p className="text-xl font-bold text-accent">
                {costRange.roiMin}–{costRange.roiMax} Monate
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-2 italic flex items-center gap-1">
            <AlertCircle size={11} />
            {costRange.disclaimer}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm mb-1">Bereit für den nächsten Schritt?</p>
          <p className="text-sm text-muted">Wir vermitteln passende Anbieter — neutral und ohne Verkaufsdruck.</p>
        </div>
        <Link
          href="/kontakt"
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
        >
          <MessageSquare size={15} /> Beratung anfragen
        </Link>
      </div>
    </div>
  )
}

export default function SteckbriefView() {
  return (
    <Suspense fallback={<div className="text-center text-muted py-20">Wird geladen…</div>}>
      <SteckbriefContent />
    </Suspense>
  )
}
