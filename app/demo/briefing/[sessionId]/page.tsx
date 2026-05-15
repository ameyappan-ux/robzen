'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Download, Mail, CheckCircle, AlertTriangle, ArrowRight, Building2, Calendar, TrendingUp } from 'lucide-react'
import { getSession, type DemoSession } from '@/lib/demo-session'
import { getSolutionsForScenario, type DemoSolution } from '@/data/demo-solutions'
import { KATEGORIE_META, formatEuroRange } from '@/lib/demo-engine'
import type { Kategorie } from '@/data/demo-scenarios'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-2 border-b border-border pb-2 mb-4">{title}</h2>
      {children}
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-border/40 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="text-foreground font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

function SolutionBlock({ solution, rank }: { solution: DemoSolution; rank: number }) {
  return (
    <div className={`rounded-xl border p-4 mb-3 ${solution.empfohlen ? 'border-accent/40 bg-accent-muted' : 'border-border bg-surface'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-muted-2 bg-surface rounded px-1.5 py-0.5">#{rank}</span>
            {solution.empfohlen && (
              <span className="text-[10px] font-semibold text-accent">★ ROBZEN Empfehlung</span>
            )}
          </div>
          <h3 className="font-semibold text-sm text-foreground">{solution.title}</h3>
          <p className="text-xs text-muted">{solution.subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-foreground">{formatEuroRange(solution.investitionMin, solution.investitionMax)}</p>
          <p className="text-xs text-accent">ROI: {solution.roiMonate} Mo.</p>
        </div>
      </div>
      <p className="text-xs text-muted mb-3">{solution.beschreibung}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-muted-2 mb-0.5">Zeitersparnis</p>
          <p className="text-foreground">{solution.zeitersparnis}</p>
        </div>
        <div>
          <p className="text-muted-2 mb-0.5">Umsetzung</p>
          <p className="text-foreground">{solution.umsetzungsdauer}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border/40">
        <p className="text-[10px] text-muted-2 mb-1 flex items-center gap-1"><ArrowRight size={9} /> Nächster Schritt</p>
        <p className="text-xs text-muted italic">{solution.naechsterSchritt}</p>
      </div>
    </div>
  )
}

function getPhaseList(kategorie: Kategorie, solution: DemoSolution): string[] {
  const isRobotik = ['Robotik', 'Vision'].includes(kategorie)
  if (isRobotik) {
    return [
      'Machbarkeitsstudie & Layoutplanung',
      'Systemauslegung & Angebotseinholung (3 Integratoren)',
      'Investitionsgenehmigung',
      `Beschaffung & Inbetriebnahme (${solution.umsetzungsdauer})`,
      'Abnahme & Mitarbeiterschulung',
      'Betrieb & kontinuierliche Optimierung',
    ]
  }
  return [
    'Prozessanalyse & Anforderungsworkshop',
    'Systemauswahl & Datenschutz-Check',
    'Pilotprojekt (30 Tage)',
    `Rollout & Integration (${solution.umsetzungsdauer})`,
    'Mitarbeiterschulung & Change Management',
    'Monitoring & kontinuierliches Finetuning',
  ]
}

function buildAdvisorSummary(session: DemoSession): Record<string, string> {
  const answers = session.advisorAnswers ?? {}
  const result: Record<string, string> = {}

  // Map raw advisor question IDs to readable labels
  const labelMap: Record<string, string> = {
    aufgabe: 'Automatisierungsaufgabe',
    volumen: 'Prozessvolumen',
    teileGewicht: 'Teilegewicht',
    formatwechsel: 'Formatwechsel',
    schichten: 'Schichtbetrieb',
    platzbedarf: 'Verfügbare Fläche',
    budget: 'Budgetrahmen',
    anfrageVolumen: 'Anfragevolumen',
    anfrageKanaele: 'Kommunikationskanäle',
    crm: 'CRM-System',
    dokumentTyp: 'Dokumenttyp',
    dokumentVolumen: 'Dokumentenvolumen',
    erp: 'ERP-System',
    fehlertypen: 'Fehlertypen',
    pruefraten: 'Prüfrate',
    mes: 'MES-Integration',
    ziel: 'Projektziel',
    timeline: 'Zeitrahmen',
    itReife: 'IT-Reifegrad',
  }

  for (const [key, value] of Object.entries(answers)) {
    const label = labelMap[key] ?? key
    result[label] = value
  }
  return result
}

export default function BriefingPage() {
  const params = useParams<{ sessionId: string }>()
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)

  const [session, setSession] = useState<DemoSession | null>(null)
  const [solutions, setSolutions] = useState<DemoSolution[]>([])
  const [kategorie, setKategorie] = useState<Kategorie | null>(null)
  const [printed, setPrinted] = useState(false)

  useEffect(() => {
    const s = getSession(params.sessionId)
    if (!s) { router.push('/demo'); return }
    setSession(s)
    setKategorie(s.kategorie ?? 'Hybrid')

    const sid = s.scenarioId ?? 'palettierung'
    setSolutions(getSolutionsForScenario(sid))
  }, [params.sessionId, router])

  function handlePrint() {
    setPrinted(true)
    setTimeout(() => window.print(), 100)
  }

  if (!session || !kategorie || solutions.length === 0) return null

  const meta = KATEGORIE_META[kategorie]
  const empfohlen = solutions.find((s) => s.empfohlen) ?? solutions[0]
  const advisorData = buildAdvisorSummary(session)
  const hasAdvisorData = Object.keys(advisorData).length > 0
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const phases = getPhaseList(kategorie, empfohlen)

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { background: white !important; color: black !important; }
          body { background: white !important; }
        }
      `}</style>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Top bar */}
        <div className="no-print flex items-center justify-between mb-10">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-2 ${meta.bg} ${meta.color}`}>
              <span>{meta.icon}</span> {meta.label}
            </div>
            <h1 className="text-2xl font-bold">Projektbriefing</h1>
            <p className="text-muted text-sm mt-1">Generiert von ROBZEN · {today}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
            >
              <Download size={14} /> PDF speichern
            </button>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
            >
              <Mail size={14} /> Beratung anfragen
            </Link>
          </div>
        </div>

        {/* The briefing document */}
        <div ref={printRef} className="rounded-2xl border border-border bg-surface p-8 print-page space-y-0">
          {/* Document header */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-accent font-bold text-2xl">ROB</span>
                  <span className="text-2xl font-semibold">ZEN</span>
                  <span className="text-muted text-sm ml-2">Automatisierungsberatung</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">Automatisierungs-Projektbriefing</h2>
                <p className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full border px-3 py-1 ${meta.bg} ${meta.color}`}>
                  <span>{meta.icon}</span> {meta.label}
                </p>
              </div>
              <div className="text-right text-xs text-muted space-y-0.5">
                <p className="flex items-center gap-1 justify-end"><Calendar size={11} /> {today}</p>
                <p className="flex items-center gap-1 justify-end"><Building2 size={11} /> Vertraulich · Demo-Dokument</p>
              </div>
            </div>
          </div>

          {/* Problem statement */}
          {session.problemText && (
            <Section title="Ausgangssituation">
              <div className="rounded-xl border border-border bg-background px-5 py-4">
                <p className="text-sm text-foreground italic leading-relaxed">„{session.problemText}"</p>
              </div>
            </Section>
          )}

          {/* Advisor inputs */}
          {hasAdvisorData && (
            <Section title="Analyseparameter">
              <div className="rounded-xl border border-border bg-background overflow-hidden">
                {Object.entries(advisorData).map(([label, value]) => (
                  <InfoRow key={label} label={label} value={value} />
                ))}
              </div>
            </Section>
          )}

          {/* Recommended solution */}
          <Section title="ROBZEN-Empfehlung">
            <SolutionBlock solution={empfohlen} rank={1} />
          </Section>

          {/* Alternative solutions */}
          {solutions.filter((s) => !s.empfohlen).length > 0 && (
            <Section title="Alternativkonzepte">
              {solutions.filter((s) => !s.empfohlen).map((s, i) => (
                <SolutionBlock key={s.id} solution={s} rank={i + 2} />
              ))}
            </Section>
          )}

          {/* ROI summary table */}
          <Section title="ROI-Übersicht">
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <div className="grid grid-cols-4 gap-px bg-border">
                {['Lösung', 'Investition', 'Jährl. Einsparung', 'ROI-Horizont'].map((h) => (
                  <div key={h} className="bg-surface px-3 py-2">
                    <p className="text-[10px] font-semibold text-muted-2 uppercase tracking-wider">{h}</p>
                  </div>
                ))}
                {solutions.map((s) => (
                  <>
                    <div key={`n-${s.id}`} className={`px-3 py-2.5 ${s.empfohlen ? 'bg-accent-muted' : 'bg-background'}`}>
                      <p className="text-xs font-medium text-foreground">{s.title}</p>
                    </div>
                    <div key={`i-${s.id}`} className={`px-3 py-2.5 ${s.empfohlen ? 'bg-accent-muted' : 'bg-background'}`}>
                      <p className="text-xs text-foreground">{formatEuroRange(s.investitionMin, s.investitionMax)}</p>
                    </div>
                    <div key={`r-${s.id}`} className={`px-3 py-2.5 ${s.empfohlen ? 'bg-accent-muted' : 'bg-background'}`}>
                      <p className="text-xs text-accent">{s.roiPotenzial}</p>
                    </div>
                    <div key={`roi-${s.id}`} className={`px-3 py-2.5 ${s.empfohlen ? 'bg-accent-muted' : 'bg-background'}`}>
                      <p className="text-xs font-semibold text-foreground">{s.roiMonate} Monate</p>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </Section>

          {/* Implementation roadmap */}
          <Section title="Umsetzungs-Roadmap (Empfehlung)">
            <div className="space-y-2">
              {phases.map((phase, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-muted border border-accent/30 shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-accent">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground pt-0.5">{phase}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Key risks */}
          <Section title="Hauptrisiken & Voraussetzungen">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-2 flex items-center gap-1 mb-2">
                  <AlertTriangle size={11} /> Zu berücksichtigende Risiken
                </p>
                <ul className="space-y-1.5">
                  {empfohlen.risiken.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-muted">
                      <span className="text-red-400 mt-0.5 shrink-0">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-2 flex items-center gap-1 mb-2">
                  <CheckCircle size={11} /> Voraussetzungen schaffen
                </p>
                <ul className="space-y-1.5">
                  {empfohlen.voraussetzungen.map((v) => (
                    <li key={v} className="flex items-start gap-2 text-xs text-muted">
                      <span className="text-accent mt-0.5 shrink-0">•</span> {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Next step CTA */}
          <Section title="Nächster Schritt">
            <div className="rounded-xl border border-accent/30 bg-accent-muted p-5">
              <div className="flex items-start gap-3">
                <TrendingUp size={18} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground mb-1">{empfohlen.naechsterSchritt}</p>
                  <p className="text-sm text-muted">
                    ROBZEN begleitet Sie vom ersten Konzept bis zur laufenden Anlage — von der Machbarkeitsstudie über die Integratoren-Auswahl bis zur Abnahme.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-muted-2">
              <p className="font-medium text-muted mb-0.5">ROBZEN GmbH · Automatisierungsberatung</p>
              <p>hallo@robzen.de · robzen.de</p>
            </div>
            <div className="text-xs text-muted-2 text-right">
              <p>Dieses Dokument enthält indikative Richtwerte.</p>
              <p>Kein verbindliches Angebot. Alle Daten simuliert.</p>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="no-print mt-8 flex flex-col sm:flex-row gap-3 border-t border-border pt-8">
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
          >
            <Mail size={14} /> Jetzt Beratung anfragen
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
          >
            <Download size={14} /> Als PDF speichern
          </button>
          <Link
            href={`/demo/vergleich/${params.sessionId}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
          >
            Zurück zum Vergleich
          </Link>
        </div>

        {printed && (
          <p className="no-print text-xs text-muted-2 text-center mt-4">
            Tipp: Im Druckdialog „Als PDF speichern" wählen.
          </p>
        )}
      </main>
    </>
  )
}
