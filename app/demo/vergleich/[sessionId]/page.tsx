'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, ArrowRight, Star, AlertCircle, TrendingUp } from 'lucide-react'
import { getSession } from '@/lib/demo-session'
import { getSolutionsForScenario, type DemoSolution } from '@/data/demo-solutions'
import { KATEGORIE_META, formatEuroRange, komplexitaetLabel } from '@/lib/demo-engine'
import type { Kategorie } from '@/data/demo-scenarios'

function ComplexDots({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`h-1.5 w-4 rounded-full ${i <= value ? 'bg-accent' : 'bg-surface'}`} />
      ))}
    </div>
  )
}

function ROIBar({ monate, max }: { monate: number; max: number }) {
  const pct = Math.min(100, (monate / max) * 100)
  return (
    <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface overflow-hidden">
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

type Col = { solution: DemoSolution; highlight: boolean }

export default function VergleichPage() {
  const params = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [cols, setCols] = useState<Col[]>([])
  const [kategorie, setKategorie] = useState<Kategorie | null>(null)
  const [scenarioTitle, setScenarioTitle] = useState('')

  useEffect(() => {
    const session = getSession(params.sessionId)
    if (!session) { router.push('/demo'); return }

    const scenarioId = session.scenarioId ?? 'palettierung'
    const solutions = getSolutionsForScenario(scenarioId)
    setCols(solutions.map((s) => ({ solution: s, highlight: !!s.empfohlen })))
    setKategorie(session.kategorie ?? 'Hybrid')
    setScenarioTitle(session.problemText ?? '')
  }, [params.sessionId, router])

  if (!kategorie || cols.length === 0) return null

  const meta = KATEGORIE_META[kategorie]
  const maxROI = Math.max(...cols.map((c) => c.solution.roiMonate))

  const rows: Array<{ label: string; render: (s: DemoSolution) => React.ReactNode }> = [
    {
      label: 'Investition',
      render: (s) => (
        <p className="font-bold text-base text-foreground">
          {formatEuroRange(s.investitionMin, s.investitionMax)}
        </p>
      ),
    },
    {
      label: 'ROI-Horizont',
      render: (s) => (
        <div>
          <p className="font-bold text-base text-accent">{s.roiMonate} Monate</p>
          <ROIBar monate={s.roiMonate} max={maxROI} />
        </div>
      ),
    },
    {
      label: 'Automatisierungsgrad',
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-surface overflow-hidden">
            <div className="h-full rounded-full bg-accent" style={{ width: `${s.automatisierungsgrad}%` }} />
          </div>
          <span className="text-sm font-semibold text-foreground shrink-0">{s.automatisierungsgrad}%</span>
        </div>
      ),
    },
    {
      label: 'Umsetzungsdauer',
      render: (s) => <p className="text-sm text-foreground">{s.umsetzungsdauer}</p>,
    },
    {
      label: 'Zeitersparnis',
      render: (s) => <p className="text-sm text-foreground">{s.zeitersparnis}</p>,
    },
    {
      label: 'ROI-Potenzial',
      render: (s) => <p className="text-sm font-medium text-accent">{s.roiPotenzial}</p>,
    },
    {
      label: 'Techn. Komplexität',
      render: (s) => (
        <div>
          <p className="text-xs text-muted">{komplexitaetLabel(s.technischeKomplexitaet)}</p>
          <ComplexDots value={s.technischeKomplexitaet} />
        </div>
      ),
    },
    {
      label: 'Integrationsaufwand',
      render: (s) => (
        <div>
          <p className="text-xs text-muted">{komplexitaetLabel(s.integrationsaufwand)}</p>
          <ComplexDots value={s.integrationsaufwand} />
        </div>
      ),
    },
    {
      label: 'Hauptrisiken',
      render: (s) => (
        <ul className="space-y-1">
          {s.risiken.map((r) => (
            <li key={r} className="flex items-start gap-1.5 text-xs text-muted">
              <XCircle size={10} className="text-red-400 mt-0.5 shrink-0" /> {r}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: 'Voraussetzungen',
      render: (s) => (
        <ul className="space-y-1">
          {s.voraussetzungen.map((v) => (
            <li key={v} className="flex items-start gap-1.5 text-xs text-muted">
              <CheckCircle size={10} className="text-accent mt-0.5 shrink-0" /> {v}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: 'Nächster Schritt',
      render: (s) => <p className="text-xs text-muted italic">{s.naechsterSchritt}</p>,
    },
  ]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-4 ${meta.bg} ${meta.color}`}>
          <span>{meta.icon}</span> {meta.label}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Lösungsvergleich</h1>
        <p className="text-muted text-sm">
          {cols.length} Konzepte nebeneinander — ROI, Investition, Komplexität und Risiken auf einen Blick.
        </p>
        {scenarioTitle && (
          <div className="mt-3 inline-block rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted italic">
            „{scenarioTitle}"
          </div>
        )}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className={`grid gap-px bg-border rounded-2xl overflow-hidden min-w-[640px]`}
          style={{ gridTemplateColumns: `180px repeat(${cols.length}, 1fr)` }}>

          {/* Header row */}
          <div className="bg-background px-4 py-4 flex items-end">
            <p className="text-[10px] text-muted-2 uppercase tracking-wider">Kriterium</p>
          </div>
          {cols.map(({ solution, highlight }) => (
            <div key={solution.id} className={`px-4 py-4 ${highlight ? 'bg-accent-muted' : 'bg-surface'}`}>
              {highlight && (
                <div className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-background mb-2">
                  <Star size={8} /> ROBZEN Empfehlung
                </div>
              )}
              <h3 className={`font-semibold text-sm leading-snug mb-0.5 ${highlight ? 'text-foreground' : 'text-foreground'}`}>
                {solution.title}
              </h3>
              <p className="text-[10px] text-muted">{solution.subtitle}</p>
            </div>
          ))}

          {/* Data rows */}
          {rows.map(({ label, render }) => (
            <>
              <div key={`label-${label}`} className="bg-background px-4 py-3.5 flex items-start border-t border-border">
                <p className="text-xs font-medium text-muted-2">{label}</p>
              </div>
              {cols.map(({ solution, highlight }) => (
                <div key={`${solution.id}-${label}`} className={`px-4 py-3.5 border-t border-border ${highlight ? 'bg-accent-muted/50' : 'bg-surface'}`}>
                  {render(solution)}
                </div>
              ))}
            </>
          ))}

          {/* CTA row */}
          <div className="bg-background px-4 py-4 border-t border-border flex items-center">
            <p className="text-[10px] text-muted-2 uppercase tracking-wider">Aktion</p>
          </div>
          {cols.map(({ solution, highlight }) => (
            <div key={`cta-${solution.id}`} className={`px-4 py-4 border-t border-border ${highlight ? 'bg-accent-muted/50' : 'bg-surface'}`}>
              <Link
                href={`/demo/briefing/${params.sessionId}`}
                className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${highlight ? 'bg-accent text-background hover:bg-accent-hover' : 'border border-border text-foreground hover:border-accent/40 bg-background'}`}
              >
                Briefing erstellen <ArrowRight size={11} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Legend / disclaimer */}
      <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-2">
        <AlertCircle size={10} /> Indikative Richtwerte — kein verbindliches Angebot
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border pt-8 mt-8">
        <Link
          href={`/demo/briefing/${params.sessionId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
        >
          <TrendingUp size={14} /> Projektbriefing erstellen
        </Link>
        <Link
          href={`/demo/loesungen/${params.sessionId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
        >
          Zurück zu den Lösungen
        </Link>
      </div>
    </main>
  )
}
