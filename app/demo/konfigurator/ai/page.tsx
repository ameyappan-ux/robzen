'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, AlertCircle, TrendingUp, Banknote, Clock, Zap } from 'lucide-react'
import AIWorkflow from './AIWorkflow'

type Eingabe = 'E-Mail' | 'PDF / Dokument' | 'Formular' | 'API / Datenbank' | 'Telefon / Sprache'
type Ausgabe = 'E-Mail-Antwort' | 'ERP-Eintrag' | 'Ticket / CRM' | 'Report / Dashboard' | 'Freigabe / Benachrichtigung'
type Integration = 'No-Code (Zapier / Make)' | 'API-Integration' | 'RPA (UiPath / AA)' | 'Custom Development'

function calcAIResult(p: {
  volumen: number; bearbeitungszeit: number; fehlerrate: number
  systeme: number; approval: boolean; datenschutz: number
  automatisierungsgrad: number; integration: Integration; budget: number
}) {
  // Cost model based on complexity
  const complexityScore = (p.systeme * 10) + (p.datenschutz * 15) + (p.approval ? 20 : 0)
  const integrationBase: Record<Integration, [number, number]> = {
    'No-Code (Zapier / Make)': [3000, 12000],
    'API-Integration': [15000, 40000],
    'RPA (UiPath / AA)': [20000, 60000],
    'Custom Development': [40000, 120000],
  }
  const [baseMin, baseMax] = integrationBase[p.integration]
  const costMin = Math.round((baseMin * (1 + complexityScore / 100)) / 1000) * 1000
  const costMax = Math.round((baseMax * (1 + complexityScore / 100)) / 1000) * 1000

  // Time savings: volumen × bearbeitungszeit × automatisierungsgrad%
  const savedMinPerMonth = p.volumen * p.bearbeitungszeit * (p.automatisierungsgrad / 100)
  const savedHoursPerYear = Math.round((savedMinPerMonth * 12) / 60)
  const savedCostPerYear = Math.round(savedHoursPerYear * 38) // 38€/h avg

  const roiMonate = savedCostPerYear > 0 ? Math.round((((costMin + costMax) / 2) / savedCostPerYear) * 12) : 24
  const fehlervermeidung = Math.round(p.volumen * (p.fehlerrate / 100) * p.automatisierungsgrad * 0.9)

  return { costMin, costMax, roiMonate, savedHoursPerYear, savedCostPerYear, fehlervermeidung }
}

function fmt(n: number) { return n >= 1000 ? `${Math.round(n / 1000)}k €` : `${n} €` }

const EINGABE_OPTIONS: Eingabe[] = ['E-Mail', 'PDF / Dokument', 'Formular', 'API / Datenbank', 'Telefon / Sprache']
const AUSGABE_OPTIONS: Ausgabe[] = ['E-Mail-Antwort', 'ERP-Eintrag', 'Ticket / CRM', 'Report / Dashboard', 'Freigabe / Benachrichtigung']
const INTEGRATION_OPTIONS: Integration[] = ['No-Code (Zapier / Make)', 'API-Integration', 'RPA (UiPath / AA)', 'Custom Development']

function AIKonfiguratorContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sid')

  const [eingabe, setEingabe] = useState<Eingabe>('E-Mail')
  const [ausgabe, setAusgabe] = useState<Ausgabe>('ERP-Eintrag')
  const [volumen, setVolumen] = useState(300)
  const [bearbeitungszeit, setBearbeitungszeit] = useState(15)
  const [fehlerrate, setFehlerrate] = useState(5)
  const [systeme, setSysteme] = useState(3)
  const [datenschutz, setDatenschutz] = useState(1)
  const [approval, setApproval] = useState(true)
  const [pruefung, setPruefung] = useState(true)
  const [automatisierungsgrad, setAutomatisierungsgrad] = useState(75)
  const [integration, setIntegration] = useState<Integration>('API-Integration')

  const result = useMemo(() =>
    calcAIResult({ volumen, bearbeitungszeit, fehlerrate, systeme, approval, datenschutz, automatisierungsgrad, integration, budget: 0 }),
    [volumen, bearbeitungszeit, fehlerrate, systeme, approval, datenschutz, automatisierungsgrad, integration]
  )

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs text-blue-400 mb-4">
          <Zap size={11} /> AI & Software-Konfigurator · Indikative Schätzung
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Automatisierungsprozess konfigurieren</h1>
        <p className="text-muted text-sm">Prozessparameter einstellen — Workflow und ROI aktualisieren sich live.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* LEFT: Parameters */}
        <div className="space-y-8">
          {/* Input/Output */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold mb-2">Eingabequelle</h2>
              <div className="space-y-1.5">
                {EINGABE_OPTIONS.map((e) => (
                  <button key={e} onClick={() => setEingabe(e)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-all ${eingabe === e ? 'border-blue-400/60 bg-blue-400/10 text-blue-400' : 'border-border bg-background text-foreground hover:border-blue-400/30'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Ausgabe / Ziel</h2>
              <div className="space-y-1.5">
                {AUSGABE_OPTIONS.map((a) => (
                  <button key={a} onClick={() => setAusgabe(a)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-all ${ausgabe === a ? 'border-accent/60 bg-accent-muted text-accent' : 'border-border bg-background text-foreground hover:border-accent/40'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sliders */}
          <section className="grid sm:grid-cols-2 gap-6">
            {[
              { label: 'Vorgänge / Monat', value: volumen, set: setVolumen, min: 10, max: 5000, unit: 'Stück' },
              { label: 'Bearbeitungszeit / Vorgang', value: bearbeitungszeit, set: setBearbeitungszeit, min: 1, max: 120, unit: 'Min.' },
              { label: 'Aktuelle Fehlerrate', value: fehlerrate, set: setFehlerrate, min: 0, max: 30, unit: '%' },
              { label: 'Beteiligte Systeme', value: systeme, set: setSysteme, min: 1, max: 8, unit: 'Systeme' },
              { label: 'Datenschutzsensibilität', value: datenschutz, set: setDatenschutz, min: 1, max: 3, unit: '/3' },
              { label: 'Gewünschter Automatisierungsgrad', value: automatisierungsgrad, set: setAutomatisierungsgrad, min: 20, max: 100, unit: '%' },
            ].map(({ label, value, set, min, max, unit }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>{label}</span>
                  <span className="text-accent font-semibold">{value} <span className="text-muted font-normal text-xs">{unit}</span></span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer" />
              </div>
            ))}
          </section>

          {/* Workflow steps */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Prozessschritte</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'KI-Analyse', value: true, static: true },
                { label: 'Datenprüfung', value: pruefung, set: setPruefung },
                { label: 'Human Approval', value: approval, set: setApproval },
              ].map(({ label, value, set, static: isStatic }) => (
                <button key={label}
                  onClick={() => !isStatic && set && set(!value)}
                  className={`rounded-xl border px-4 py-2 text-xs transition-all ${value ? 'border-accent bg-accent-muted text-accent' : 'border-border text-muted'} ${isStatic ? 'opacity-70 cursor-default' : 'hover:border-accent/40 cursor-pointer'}`}>
                  {value ? '✓ ' : '+ '}{label}
                </button>
              ))}
            </div>
          </section>

          {/* Integration */}
          <section>
            <h2 className="text-sm font-semibold mb-2">Integrationsart</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {INTEGRATION_OPTIONS.map((i) => (
                <button key={i} onClick={() => setIntegration(i)}
                  className={`text-left rounded-xl border px-3 py-2.5 text-xs transition-all ${integration === i ? 'border-accent bg-accent-muted text-accent' : 'border-border bg-background text-foreground hover:border-accent/40'}`}>
                  <div className="font-medium">{i}</div>
                  <div className="text-muted mt-0.5">
                    {i === 'No-Code (Zapier / Make)' && '3–12k €, 2–4 Wochen'}
                    {i === 'API-Integration' && '15–40k €, 6–10 Wochen'}
                    {i === 'RPA (UiPath / AA)' && '20–60k €, 8–14 Wochen'}
                    {i === 'Custom Development' && '40–120k €, 12–24 Wochen'}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Workflow + Results */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Workflow visualization */}
          <div className="rounded-2xl border border-border bg-[#0d0d14] p-4 overflow-hidden">
            <p className="text-[10px] text-muted-2 mb-3 uppercase tracking-wider">Automatisierungsworkflow</p>
            <AIWorkflow
              eingabe={eingabe} ki={true} pruefung={pruefung}
              approval={approval} ausgabe={ausgabe}
              volumen={volumen} automatisierungsgrad={automatisierungsgrad}
            />
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-accent/20 bg-accent-muted p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Potenzialschätzung</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-2 mb-0.5 flex items-center gap-1"><Banknote size={10} /> Investition</p>
                <p className="text-xl font-bold text-foreground">{fmt(result.costMin)} – {fmt(result.costMax)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-2 mb-0.5 flex items-center gap-1"><Clock size={10} /> ROI</p>
                <p className="text-xl font-bold text-accent">{result.roiMonate} Monate</p>
              </div>
              <div>
                <p className="text-xs text-muted-2 mb-0.5">Zeitersparnis / Jahr</p>
                <p className="text-lg font-bold text-foreground">{result.savedHoursPerYear} h</p>
              </div>
              <div>
                <p className="text-xs text-muted-2 mb-0.5">Kosteneinsparung / Jahr</p>
                <p className="text-lg font-bold text-foreground">{fmt(result.savedCostPerYear)}</p>
              </div>
            </div>

            {result.fehlervermeidung > 0 && (
              <div className="border-t border-border/60 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-2">Vermiedene Fehler / Monat</span>
                  <span className="text-foreground font-medium">ca. {result.fehlervermeidung}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href={sessionId ? `/demo/vergleich/${sessionId}` : '/demo/vergleich/demo'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold text-background hover:bg-accent-hover transition-colors"
              >
                Lösungen vergleichen <ArrowRight size={12} />
              </Link>
              <Link
                href={sessionId ? `/demo/briefing/${sessionId}` : '/demo/briefing/demo'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-medium text-foreground hover:border-accent/40 transition-colors"
              >
                Projektbriefing erstellen
              </Link>
            </div>
          </div>

          <p className="text-[10px] text-muted-2 text-center flex items-center justify-center gap-1">
            <AlertCircle size={9} /> Indikative Schätzung — kein verbindliches Angebot
          </p>
        </div>
      </div>
    </main>
  )
}

export default function AIKonfiguratorPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted py-20">Wird geladen…</div>}>
      <AIKonfiguratorContent />
    </Suspense>
  )
}
