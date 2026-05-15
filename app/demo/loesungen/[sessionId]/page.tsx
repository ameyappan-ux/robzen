'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Clock, Banknote, TrendingUp, AlertTriangle, CheckCircle, Star } from 'lucide-react'
import { getSession } from '@/lib/demo-session'
import { getSolutionsForScenario, type DemoSolution } from '@/data/demo-solutions'
import { KATEGORIE_META, formatEuroRange, komplexitaetLabel } from '@/lib/demo-engine'
import type { Kategorie } from '@/data/demo-scenarios'

function KomplexBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <div key={i} className={`h-1.5 w-4 rounded-full ${i <= value ? 'bg-accent' : 'bg-surface'}`} />
      ))}
    </div>
  )
}

function SolutionCard({ solution, onSelect }: { solution: DemoSolution; onSelect: () => void }) {
  return (
    <div className={`rounded-2xl border bg-surface p-6 flex flex-col gap-4 relative ${solution.empfohlen ? 'border-accent/40' : 'border-border'}`}>
      {solution.empfohlen && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-background">
          <Star size={9} /> ROBZEN Empfehlung
        </div>
      )}

      <div>
        <h3 className="font-semibold text-foreground leading-snug mb-1">{solution.title}</h3>
        <p className="text-xs text-muted">{solution.subtitle}</p>
      </div>

      <p className="text-sm text-muted leading-relaxed">{solution.beschreibung}</p>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-xs">
        <div>
          <div className="flex items-center gap-1 text-muted-2 mb-0.5"><Banknote size={10} /> Investition</div>
          <p className="font-medium text-foreground">{formatEuroRange(solution.investitionMin, solution.investitionMax)}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-2 mb-0.5"><Clock size={10} /> ROI</div>
          <p className="font-medium text-accent">{solution.roiMonate} Monate</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-2 mb-0.5"><TrendingUp size={10} /> Automatisierung</div>
          <p className="font-medium text-foreground">{solution.automatisierungsgrad}%</p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-2 mb-0.5">Umsetzung</div>
          <p className="font-medium text-foreground">{solution.umsetzungsdauer}</p>
        </div>
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-2 mb-1">Techn. Komplexität</p>
          <KomplexBar value={solution.technischeKomplexitaet} />
          <p className="text-muted mt-0.5">{komplexitaetLabel(solution.technischeKomplexitaet)}</p>
        </div>
        <div>
          <p className="text-muted-2 mb-1">Integrationsaufwand</p>
          <KomplexBar value={solution.integrationsaufwand} />
          <p className="text-muted mt-0.5">{komplexitaetLabel(solution.integrationsaufwand)}</p>
        </div>
      </div>

      {/* Risks + Prerequisites */}
      <div className="space-y-2 text-xs">
        <div>
          <p className="text-muted-2 flex items-center gap-1 mb-1"><AlertTriangle size={10} /> Hauptrisiken</p>
          <ul className="space-y-0.5">
            {solution.risiken.map((r) => <li key={r} className="text-muted pl-3 relative before:absolute before:left-0 before:top-1.5 before:size-1 before:rounded-full before:bg-muted-2">{r}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-muted-2 flex items-center gap-1 mb-1"><CheckCircle size={10} /> Voraussetzungen</p>
          <ul className="space-y-0.5">
            {solution.voraussetzungen.map((v) => <li key={v} className="text-muted pl-3 relative before:absolute before:left-0 before:top-1.5 before:size-1 before:rounded-full before:bg-accent">{v}</li>)}
          </ul>
        </div>
      </div>

      {/* Next step */}
      <div className="rounded-xl bg-accent-muted border border-accent/20 px-4 py-3 text-xs">
        <p className="text-accent font-medium mb-0.5">Nächster Schritt</p>
        <p className="text-muted">{solution.naechsterSchritt}</p>
      </div>

      <button
        onClick={onSelect}
        className="mt-auto w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-background hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
      >
        Konfigurieren & Vergleichen <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default function LoesungenPage() {
  const params = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [solutions, setSolutions] = useState<DemoSolution[]>([])
  const [kategorie, setKategorie] = useState<Kategorie | null>(null)
  const [problemText, setProblemText] = useState('')
  const [scenarioId, setScenarioId] = useState<string | undefined>()

  useEffect(() => {
    const session = getSession(params.sessionId)
    if (!session) { router.push('/demo'); return }
    setKategorie(session.kategorie ?? 'Hybrid')
    setProblemText(session.problemText ?? '')
    setScenarioId(session.scenarioId)
    if (session.scenarioId) {
      setSolutions(getSolutionsForScenario(session.scenarioId))
    } else {
      // For custom inputs, use first scenario as fallback demo
      setSolutions(getSolutionsForScenario('palettierung'))
    }
  }, [params.sessionId, router])

  if (!kategorie) return null

  const meta = KATEGORIE_META[kategorie]
  const isRobotik = kategorie === 'Robotik'

  function handleSelect() {
    const target = isRobotik
      ? `/demo/konfigurator/robotik?sid=${params.sessionId}`
      : `/demo/konfigurator/ai?sid=${params.sessionId}`
    router.push(target)
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-4 ${meta.bg} ${meta.color}`}>
          <span>{meta.icon}</span> {meta.label}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Passende Lösungskonzepte</h1>
        <p className="text-muted text-sm max-w-2xl">
          Basierend auf Ihren Angaben hat ROBZEN {solutions.length} Lösungskonzepte identifiziert — von einfach und kostengünstig bis vollständig automatisiert.
        </p>
        {problemText && (
          <div className="mt-3 inline-block rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted italic">
            „{problemText}"
          </div>
        )}
      </div>

      {/* Solution cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {solutions.map((s) => (
          <SolutionCard key={s.id} solution={s} onSelect={handleSelect} />
        ))}
      </div>

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-border pt-8">
        <button
          onClick={handleSelect}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
        >
          Konfigurator öffnen <ArrowRight size={14} />
        </button>
        <Link
          href={`/demo/vergleich/${params.sessionId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
        >
          Alle vergleichen
        </Link>
        <Link
          href={`/demo/briefing/${params.sessionId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
        >
          Projektbriefing erstellen
        </Link>
      </div>
    </main>
  )
}
