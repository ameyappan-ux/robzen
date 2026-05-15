'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowRight, AlertCircle, TrendingUp, Banknote, Clock, Zap } from 'lucide-react'
import RobotikCell from './RobotikCell'

type RobotTyp = 'Cobot' | 'Industrieroboter' | 'SCARA' | 'Delta'
type Greifer = 'Vakuum-Sauger' | 'Parallelgreifer' | 'Magnetgreifer' | 'Adaptiver Greifer'
type Sicherheit = 'Ohne Gitter (Cobot)' | 'Sicherheitsgitter' | 'Lichtschranken' | 'Laserscanner'

const ROBOT_BASE_COST: Record<RobotTyp, [number, number]> = {
  Cobot: [45000, 90000],
  Industrieroboter: [80000, 160000],
  SCARA: [35000, 70000],
  Delta: [50000, 100000],
}

const SAFETY_COST: Record<Sicherheit, number> = {
  'Ohne Gitter (Cobot)': 0,
  Sicherheitsgitter: 15000,
  Lichtschranken: 8000,
  Laserscanner: 12000,
}

const GRIPPER_COST: Record<Greifer, number> = {
  'Vakuum-Sauger': 3000,
  Parallelgreifer: 6000,
  Magnetgreifer: 4000,
  'Adaptiver Greifer': 12000,
}

function calcResult(params: {
  robotTyp: RobotTyp; traglast: number; taktzeit: number; flaeche: number
  schichten: number; stundenlohn: number; greifer: Greifer; sicherheit: Sicherheit; budget: number
}) {
  const [baseMin, baseMax] = ROBOT_BASE_COST[params.robotTyp]
  const traglastMult = params.traglast > 50 ? 1.3 : params.traglast > 20 ? 1.15 : 1.0
  const flaecheMult = params.flaeche < 15 ? 0.9 : params.flaeche > 40 ? 1.15 : 1.0
  const safetyAdd = SAFETY_COST[params.sicherheit]
  const gripperAdd = GRIPPER_COST[params.greifer]

  const costMin = Math.round((baseMin * traglastMult * flaecheMult + safetyAdd + gripperAdd) / 5000) * 5000
  const costMax = Math.round((baseMax * traglastMult * flaecheMult + safetyAdd + gripperAdd) / 5000) * 5000

  const annualSavings = params.schichten * 8 * 220 * params.stundenlohn
  const costMid = (costMin + costMax) / 2
  const roiMonate = annualSavings > 0 ? Math.round((costMid / annualSavings) * 12) : 36

  const teileProStunde = Math.round(3600 / params.taktzeit)
  const machbarkeit = params.traglast > 80 ? 'Eingeschränkt' : params.flaeche < 8 ? 'Eingeschränkt' : 'Hoch'
  const empfohlenTyp = params.traglast > 50 ? 'Industrieroboter' : params.taktzeit < 8 ? 'Delta' : 'Cobot'

  const withinBudget = params.budget === 0 || costMax <= params.budget

  return { costMin, costMax, roiMonate, annualSavings, teileProStunde, machbarkeit, empfohlenTyp, withinBudget }
}

function fmt(n: number) { return n >= 1000 ? `${Math.round(n / 1000)}k €` : `${n} €` }

function RobotikKonfiguratorContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sid')

  const [robotTyp, setRobotTyp] = useState<RobotTyp>('Cobot')
  const [traglast, setTraglast] = useState(15)
  const [taktzeit, setTaktzeit] = useState(12)
  const [flaeche, setFlaeche] = useState(25)
  const [schichten, setSchichten] = useState(2)
  const [stundenlohn, setStundenlohn] = useState(35)
  const [greifer, setGreifer] = useState<Greifer>('Vakuum-Sauger')
  const [sicherheit, setSicherheit] = useState<Sicherheit>('Ohne Gitter (Cobot)')
  const [foerderband, setFoerderband] = useState(true)
  const [kamera, setKamera] = useState(false)
  const [budget, setBudget] = useState(0)

  const result = useMemo(() =>
    calcResult({ robotTyp, traglast, taktzeit, flaeche, schichten, stundenlohn, greifer, sicherheit, budget }),
    [robotTyp, traglast, taktzeit, flaeche, schichten, stundenlohn, greifer, sicherheit, budget]
  )

  const ROBOT_TYPES: RobotTyp[] = ['Cobot', 'Industrieroboter', 'SCARA', 'Delta']
  const GREIFER_TYPES: Greifer[] = ['Vakuum-Sauger', 'Parallelgreifer', 'Magnetgreifer', 'Adaptiver Greifer']
  const SICHERHEIT_TYPES: Sicherheit[] = ['Ohne Gitter (Cobot)', 'Sicherheitsgitter', 'Lichtschranken', 'Laserscanner']

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs text-accent mb-4">
          <Zap size={11} /> Robotik-Konfigurator · Indikative Schätzung
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Automatisierungszelle konfigurieren</h1>
        <p className="text-muted text-sm">Parameter ändern — Visualisierung und Ergebnis aktualisieren sich sofort.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT: Parameters */}
        <div className="space-y-8">
          {/* Robot type */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Robotertyp</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROBOT_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setRobotTyp(t)}
                  className={`rounded-xl border px-3 py-2.5 text-xs transition-all ${robotTyp === t ? 'border-accent bg-accent-muted text-accent' : 'border-border bg-background text-foreground hover:border-accent/40'}`}>
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-2 mt-2">
              {robotTyp === 'Cobot' && 'Kollaborativ, ohne Schutzgitter, ideal für KMU mit begrenztem Platz.'}
              {robotTyp === 'Industrieroboter' && 'Höhere Geschwindigkeit und Traglast, benötigt Sicherheitsgitter.'}
              {robotTyp === 'SCARA' && 'Ideal für schnelle Montage- und Pick-&-Place-Aufgaben.'}
              {robotTyp === 'Delta' && 'Sehr hohe Taktrate, ideal für leichte Teile in Verpackungslinien.'}
            </p>
          </section>

          {/* Sliders */}
          <section className="grid sm:grid-cols-2 gap-6">
            {[
              { label: 'Traglast', value: traglast, set: setTraglast, min: 1, max: 100, unit: 'kg' },
              { label: 'Taktzeit', value: taktzeit, set: setTaktzeit, min: 3, max: 60, unit: 's / Teil' },
              { label: 'Verfügbare Fläche', value: flaeche, set: setFlaeche, min: 5, max: 100, unit: 'm²' },
              { label: 'Schichten / Tag', value: schichten, set: setSchichten, min: 1, max: 3, unit: 'Schichten' },
              { label: 'Stundenlohn (Ø)', value: stundenlohn, set: setStundenlohn, min: 15, max: 70, unit: '€/h' },
            ].map(({ label, value, set, min, max, unit }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>{label}</span>
                  <span className="text-accent font-semibold">{value} <span className="text-muted font-normal text-xs">{unit}</span></span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer" />
                <div className="flex justify-between text-[10px] text-muted-2 mt-0.5">
                  <span>{min} {unit}</span><span>{max} {unit}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Greifer + Sicherheit */}
          <section className="grid sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold mb-2">Greiferart</h2>
              <div className="space-y-1.5">
                {GREIFER_TYPES.map((g) => (
                  <button key={g} onClick={() => setGreifer(g)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-all ${greifer === g ? 'border-accent bg-accent-muted text-accent' : 'border-border bg-background text-foreground hover:border-accent/40'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Sicherheitskonzept</h2>
              <div className="space-y-1.5">
                {SICHERHEIT_TYPES.map((s) => (
                  <button key={s} onClick={() => setSicherheit(s)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-all ${sicherheit === s ? 'border-accent bg-accent-muted text-accent' : 'border-border bg-background text-foreground hover:border-accent/40'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Optionen */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Anlagenkomponenten</h2>
            <div className="flex gap-3">
              {[
                { label: 'Förderband', value: foerderband, set: setFoerderband },
                { label: 'Kamera / Sensorik', value: kamera, set: setKamera },
              ].map(({ label, value, set }) => (
                <button key={label} onClick={() => set(!value)}
                  className={`rounded-xl border px-4 py-2 text-xs transition-all ${value ? 'border-accent bg-accent-muted text-accent' : 'border-border text-muted hover:border-accent/40'}`}>
                  {value ? '✓ ' : ''}{label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Visualization + Results */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* SVG Cell */}
          <div className="rounded-2xl border border-border bg-[#13131e] p-4 overflow-hidden">
            <RobotikCell
              robotTyp={robotTyp} foerderband={foerderband} greifer={greifer}
              kamera={kamera} traglast={traglast} schichten={schichten}
            />
          </div>

          {/* Results panel */}
          <div className="rounded-2xl border border-accent/20 bg-accent-muted p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Konfigurationsergebnis</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-2 mb-0.5 flex items-center gap-1"><Banknote size={10} /> Investition</p>
                <p className="text-xl font-bold text-foreground">{fmt(result.costMin)} – {fmt(result.costMax)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-2 mb-0.5 flex items-center gap-1"><Clock size={10} /> ROI-Horizont</p>
                <p className="text-xl font-bold text-accent">{result.roiMonate} Monate</p>
              </div>
              <div>
                <p className="text-xs text-muted-2 mb-0.5">Teile / Stunde</p>
                <p className="text-lg font-bold text-foreground">{result.teileProStunde}</p>
              </div>
              <div>
                <p className="text-xs text-muted-2 mb-0.5">Jährliche Einsparung</p>
                <p className="text-lg font-bold text-foreground">{fmt(result.annualSavings)}</p>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-2">Machbarkeit</span>
                <span className={result.machbarkeit === 'Hoch' ? 'text-accent font-medium' : 'text-yellow-400 font-medium'}>{result.machbarkeit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-2">Empfohlener Typ</span>
                <span className="text-foreground font-medium">{result.empfohlenTyp}</span>
              </div>
            </div>

            {!result.withinBudget && budget > 0 && (
              <div className="flex items-center gap-2 text-xs text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 rounded-lg px-3 py-2">
                <AlertCircle size={12} /> Investition übersteigt Budget
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

export default function RobotikKonfiguratorPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted py-20">Wird geladen…</div>}>
      <RobotikKonfiguratorContent />
    </Suspense>
  )
}
