'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Banknote, Clock, Wrench, AlertCircle, CheckCircle } from 'lucide-react'
import { formatEuro } from '@/lib/cost-lookup'
import type { AutomationDegree } from '@/lib/cost-lookup'
import type { Schichtmodell } from '@/lib/project-profile'

type Prozesstyp = 'Palettierung' | 'Cobot-Montage' | 'AMR-Transport' | 'Qualitätsprüfung' | 'Verpackung' | 'KI-Prozesssteuerung'
type Branche = 'Fertigung' | 'Lebensmittel' | 'Elektronik' | 'Logistik' | 'Metall' | 'Sonstiges'
type Serviceumfang = 'Nur Lieferung' | 'Inbetriebnahme' | 'Vollservice' | 'RaaS/Miete'
type FundingLevel = 'Wahrscheinlich' | 'Möglicherweise' | 'Unwahrscheinlich'

const PROZESS_MULT: Record<Prozesstyp, number> = {
  'Palettierung': 1.0,
  'Cobot-Montage': 1.15,
  'AMR-Transport': 0.85,
  'Qualitätsprüfung': 1.1,
  'Verpackung': 0.9,
  'KI-Prozesssteuerung': 1.3,
}

const SERVICE_MULT: Record<Serviceumfang, number> = {
  'Nur Lieferung': 1.0,
  'Inbetriebnahme': 1.12,
  'Vollservice': 1.25,
  'RaaS/Miete': 1.0,
}

const BASE: Record<AutomationDegree, Record<Schichtmodell, { min: number; max: number; roiMin: number; roiMax: number }>> = {
  Teilautomatisierung: {
    '1-Schicht':        { min: 40000,  max: 80000,  roiMin: 30, roiMax: 42 },
    '2-Schicht':        { min: 50000,  max: 100000, roiMin: 24, roiMax: 36 },
    '3-Schicht / 24/7': { min: 60000,  max: 120000, roiMin: 20, roiMax: 30 },
  },
  Vollautomatisierung: {
    '1-Schicht':        { min: 80000,  max: 150000, roiMin: 24, roiMax: 36 },
    '2-Schicht':        { min: 100000, max: 200000, roiMin: 18, roiMax: 30 },
    '3-Schicht / 24/7': { min: 150000, max: 350000, roiMin: 18, roiMax: 24 },
  },
}

const FUNDING_PROGRAMS: Record<FundingLevel, string[]> = {
  'Wahrscheinlich': ['Digital Jetzt (BMWK)', 'go-digital', 'KfW Digitalisierung & Innovation'],
  'Möglicherweise': ['go-digital', 'BAFA Beratungsförderung', 'Länderprogramme (z. B. Berlin, NRW)'],
  'Unwahrscheinlich': [],
}

const FUNDING_COLOR: Record<FundingLevel, string> = {
  'Wahrscheinlich': 'text-accent',
  'Möglicherweise': 'text-yellow-400',
  'Unwahrscheinlich': 'text-muted',
}

function calcFunding(grad: AutomationDegree, costMin: number, mitarbeiter: number): FundingLevel {
  if (grad === 'Vollautomatisierung' && costMin >= 80000) return 'Wahrscheinlich'
  if (costMin >= 50000 || mitarbeiter >= 5) return 'Möglicherweise'
  return 'Unwahrscheinlich'
}

const SCHICHT_OPTIONS: Schichtmodell[] = ['1-Schicht', '2-Schicht', '3-Schicht / 24/7']
const PROZESS_OPTIONS: Prozesstyp[] = ['Palettierung', 'Cobot-Montage', 'AMR-Transport', 'Qualitätsprüfung', 'Verpackung', 'KI-Prozesssteuerung']
const BRANCHE_OPTIONS: Branche[] = ['Fertigung', 'Lebensmittel', 'Elektronik', 'Logistik', 'Metall', 'Sonstiges']
const SERVICE_OPTIONS: Serviceumfang[] = ['Nur Lieferung', 'Inbetriebnahme', 'Vollservice', 'RaaS/Miete']

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
  cols?: number
}) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-lg border px-3 py-2.5 text-xs text-left transition-all ${
            value === opt
              ? 'border-accent bg-accent-muted text-accent'
              : 'border-border bg-background text-foreground hover:border-accent/40'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

export default function KonfiguratorUI() {
  const [prozess, setProzess] = useState<Prozesstyp>('Palettierung')
  const [branche, setBranche] = useState<Branche>('Fertigung')
  const [mitarbeiter, setMitarbeiter] = useState(5)
  const [schicht, setSchicht] = useState<Schichtmodell>('2-Schicht')
  const [grad, setGrad] = useState<AutomationDegree>('Vollautomatisierung')
  const [service, setService] = useState<Serviceumfang>('Inbetriebnahme')

  const result = useMemo(() => {
    const base = BASE[grad][schicht]
    const prozessMult = PROZESS_MULT[prozess]
    const serviceMult = SERVICE_MULT[service]

    const rawMin = Math.round(base.min * prozessMult * serviceMult / 5000) * 5000
    const rawMax = Math.round(base.max * prozessMult * serviceMult / 5000) * 5000

    // Mitarbeitende influence on ROI: more workers = faster ROI
    const mitFactor = mitarbeiter >= 10 ? 0.8 : mitarbeiter >= 5 ? 1.0 : 1.25
    const roiMin = Math.round(base.roiMin * mitFactor)
    const roiMax = Math.round(base.roiMax * mitFactor)

    const funding = calcFunding(grad, rawMin, mitarbeiter)
    const isRaaS = service === 'RaaS/Miete'
    const monthlyMin = Math.round(rawMin / 48 / 100) * 100
    const monthlyMax = Math.round(rawMax / 36 / 100) * 100

    return { costMin: rawMin, costMax: rawMax, roiMin, roiMax, funding, isRaaS, monthlyMin, monthlyMax }
  }, [prozess, grad, schicht, service, mitarbeiter])

  const programs = FUNDING_PROGRAMS[result.funding]

  return (
    <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 space-y-6 lg:space-y-0">
      {/* Left: Parameters */}
      <div className="space-y-6">
        {/* Row 1: Prozesstyp + Branche */}
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Prozesstyp" options={PROZESS_OPTIONS} value={prozess} onChange={setProzess} />
          <SelectField label="Branche" options={BRANCHE_OPTIONS} value={branche} onChange={setBranche} />
        </div>

        {/* Row 2: Mitarbeitende slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Mitarbeitende im Prozess</label>
            <span className="text-sm font-semibold text-accent">{mitarbeiter}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={mitarbeiter}
            onChange={(e) => setMitarbeiter(Number(e.target.value))}
            className="w-full accent-[var(--accent)] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-2 mt-1">
            <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>

        {/* Row 3: Schichtmodell */}
        <div>
          <label className="block text-sm font-medium mb-2">Schichtmodell</label>
          <ToggleGroup options={SCHICHT_OPTIONS} value={schicht} onChange={setSchicht} cols={3} />
        </div>

        {/* Row 4: Automatisierungsgrad */}
        <div>
          <label className="block text-sm font-medium mb-2">Automatisierungsgrad</label>
          <ToggleGroup
            options={['Teilautomatisierung', 'Vollautomatisierung'] as AutomationDegree[]}
            value={grad}
            onChange={setGrad}
            cols={2}
          />
        </div>

        {/* Row 5: Serviceumfang */}
        <div>
          <label className="block text-sm font-medium mb-2">Serviceumfang</label>
          <ToggleGroup options={SERVICE_OPTIONS} value={service} onChange={setService} cols={2} />
          {service === 'RaaS/Miete' && (
            <p className="text-xs text-muted-2 mt-2 flex items-center gap-1">
              <AlertCircle size={11} /> Robotics-as-a-Service: monatliche Rate statt Einmalinvestition
            </p>
          )}
          {service === 'Vollservice' && (
            <p className="text-xs text-muted-2 mt-2 flex items-center gap-1">
              <AlertCircle size={11} /> Inkl. Wartung, Support und Ersatzteile über Vertragslaufzeit
            </p>
          )}
        </div>

        <p className="text-xs text-muted-2 italic flex items-center gap-1 pt-2 border-t border-border">
          <AlertCircle size={11} />
          Alle Angaben sind indikative Schätzungen auf Basis typischer Projektparameter — kein verbindliches Angebot.
        </p>
      </div>

      {/* Right: Result panel (sticky on desktop) */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-accent/20 bg-accent-muted p-6 space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Ihre Konfiguration</span>
          </div>

          {/* Cost */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-2 mb-1">
              <Banknote size={12} />
              {result.isRaaS ? 'Monatliche Rate (indikativ)' : 'Investitionsrahmen'}
            </div>
            {result.isRaaS ? (
              <p className="text-2xl font-bold text-foreground">
                {formatEuro(result.monthlyMin)} – {formatEuro(result.monthlyMax)}<span className="text-sm font-normal text-muted">/Monat</span>
              </p>
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {formatEuro(result.costMin)} – {formatEuro(result.costMax)}
              </p>
            )}
          </div>

          {/* ROI */}
          {!result.isRaaS && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-2 mb-1">
                <Clock size={12} /> ROI-Horizont
              </div>
              <p className="text-xl font-bold text-foreground">
                {result.roiMin}–{result.roiMax} <span className="text-sm font-normal text-muted">Monate</span>
              </p>
            </div>
          )}

          {/* Service info */}
          <div className="rounded-lg border border-border bg-background/50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-2 mb-1">
              <Wrench size={11} /> Serviceumfang
            </div>
            <p className="text-sm text-foreground font-medium">{service}</p>
            <p className="text-xs text-muted mt-0.5">
              {service === 'Nur Lieferung' && 'Hardware-Lieferung ohne Integrations-Support'}
              {service === 'Inbetriebnahme' && 'Inkl. Installation und Inbetriebnahme vor Ort'}
              {service === 'Vollservice' && 'Wartung, Support und Updates im Paket'}
              {service === 'RaaS/Miete' && 'Flexibles Mieten ohne Kapitalbindung (3–5 Jahre)'}
            </p>
          </div>

          {/* Funding */}
          <div className="border-t border-border/60 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-2 mb-2">
              <Banknote size={11} /> Förderpotenzial
            </div>
            <p className={`text-sm font-semibold mb-2 ${FUNDING_COLOR[result.funding]}`}>
              {result.funding}
            </p>
            {programs.length > 0 ? (
              <ul className="space-y-1">
                {programs.map((p) => (
                  <li key={p} className="flex items-center gap-1.5 text-xs text-muted">
                    <CheckCircle size={11} className="text-accent flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">Bei diesem Projektvolumen sind staatliche Programme weniger relevant.</p>
            )}
            <p className="text-xs text-muted-2 italic mt-2">Orientierung — kein Förderversprechen.</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/projekt-starten"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
            >
              Projekt starten <ArrowRight size={14} />
            </Link>
            <Link
              href="/kontakt"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
            >
              Beratung anfragen
            </Link>
          </div>
        </div>

        {/* Use case hint */}
        <div className="mt-3 rounded-xl border border-border bg-surface px-4 py-3">
          <p className="text-xs text-muted">
            Ähnliche Projekte im Use-Case-Katalog:{' '}
            <Link href="/use-cases" className="text-accent hover:text-accent-hover transition-colors">
              {prozess} ansehen →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
