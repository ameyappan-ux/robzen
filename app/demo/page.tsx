'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Zap } from 'lucide-react'
import { DEMO_SCENARIOS, type DemoScenario } from '@/data/demo-scenarios'
import { createSession } from '@/lib/demo-session'
import { detectKategorie, KATEGORIE_META } from '@/lib/demo-engine'

const EXAMPLE_INPUTS = [
  'Wir möchten Kartons automatisch auf Paletten stapeln.',
  'Unser Kundenservice beantwortet jeden Tag dieselben Fragen.',
  'Unsere Mitarbeitenden übertragen Daten aus PDFs manuell ins ERP.',
  'Wir möchten Produktionsfehler früher erkennen.',
  'Wir verlieren viel Zeit mit manueller Angebotserstellung.',
  'Unsere Disposition ist sehr manuell und unübersichtlich.',
]

const SCENARIO_COLORS: Record<string, string> = {
  palettierung: 'border-accent/30 hover:border-accent/60 bg-accent-muted/30',
  kundenservice: 'border-blue-400/30 hover:border-blue-400/60 bg-blue-400/5',
  'pdf-erp': 'border-yellow-400/30 hover:border-yellow-400/60 bg-yellow-400/5',
  qualitaetspruefung: 'border-orange-400/30 hover:border-orange-400/60 bg-orange-400/5',
}

function ScenarioCard({ scenario, onClick }: { scenario: DemoScenario; onClick: () => void }) {
  const meta = KATEGORIE_META[scenario.kategorie]
  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-2xl border p-6 transition-all group ${SCENARIO_COLORS[scenario.id] ?? 'border-border hover:border-accent/40'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-2xl">{meta.icon}</span>
        <ArrowRight size={16} className="text-muted group-hover:text-accent transition-colors mt-1 flex-shrink-0" />
      </div>
      <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{scenario.title}</h3>
      <p className="text-xs text-muted mb-3">{scenario.subtitle}</p>
      <p className="text-xs text-muted-2 leading-relaxed">{scenario.description}</p>
      <div className="flex flex-wrap gap-1 mt-4">
        {scenario.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] text-muted-2 border border-border rounded-full px-2 py-0.5">{tag}</span>
        ))}
      </div>
    </button>
  )
}

export default function DemoStartPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  function startWithScenario(scenario: DemoScenario) {
    const session = createSession({
      scenarioId: scenario.id,
      kategorie: scenario.kategorie,
      problemText: scenario.problemText,
      advisorAnswers: scenario.advisorAnswers,
    })
    router.push(`/demo/loesungen/${session.id}`)
  }

  function startWithInput() {
    if (!input.trim()) return
    setLoading(true)
    const kategorie = detectKategorie(input)
    const session = createSession({ problemText: input.trim(), kategorie })
    router.push(`/demo/advisor/${session.id}`)
  }

  function useExample(text: string) {
    setInput(text)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs text-accent mb-6">
          <Zap size={11} /> ROBZEN Automation Opportunity Finder
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
          Was möchten Sie in Ihrem Betrieb{' '}
          <span className="text-accent">automatisieren?</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Beschreiben Sie Ihr Problem in eigenen Worten. ROBZEN erkennt automatisch die passende Lösungskategorie und führt Sie Schritt für Schritt zur richtigen Lösung.
        </p>
      </div>

      {/* Input area */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startWithInput() } }}
            placeholder="Beschreiben Sie Ihr Problem oder Ihre Anforderung…"
            className="w-full resize-none rounded-2xl border border-border bg-surface px-5 py-4 pr-14 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors leading-relaxed"
          />
          <button
            onClick={startWithInput}
            disabled={!input.trim() || loading}
            className="absolute right-3 bottom-3 size-10 rounded-xl bg-accent flex items-center justify-center text-background hover:bg-accent-hover disabled:opacity-40 transition-all"
            aria-label="Analyse starten"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Example chips */}
        <div className="mt-3">
          <p className="text-xs text-muted-2 mb-2">Beispiele:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_INPUTS.map((ex) => (
              <button
                key={ex}
                onClick={() => useExample(ex)}
                className="text-xs text-muted border border-border rounded-full px-3 py-1 hover:border-accent/40 hover:text-foreground transition-colors"
              >
                {ex.length > 48 ? ex.slice(0, 47) + '…' : ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted-2">oder Demo-Szenario starten</span>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {DEMO_SCENARIOS.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} onClick={() => startWithScenario(scenario)} />
        ))}
      </div>

      <p className="text-center text-xs text-muted-2 mt-10">
        Alle Ergebnisse sind indikativ und basieren auf typischen Projektparametern — keine verbindliche Beratung.
      </p>
    </main>
  )
}
