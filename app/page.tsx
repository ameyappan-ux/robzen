import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, ShieldCheck, TrendingUp, Zap, Users, Factory } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Automatisierungs-Check',
    description: 'In 5 Minuten analysieren Sie Ihr Automatisierungspotenzial — kostenlos und anonym.',
  },
  {
    number: '02',
    title: 'KI-Intake-Gespräch',
    description: 'Unser KI-Assistent stellt Ihnen die richtigen Fragen und erstellt ein strukturiertes Projektprofil.',
  },
  {
    number: '03',
    title: 'Projekt-Steckbrief',
    description: 'Sie erhalten einen konkreten Steckbrief mit Kostenrahmen, ROI-Orientierung und Fördermittelpotenzial.',
  },
  {
    number: '04',
    title: 'Neutrale Beratung',
    description: 'Wir vermitteln passende Lösungsanbieter — ohne Verkaufsprovision auf Ihre Entscheidung.',
  },
]

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Herstellerneutral',
    body: 'Wir verkaufen keine Roboter. Wir helfen Ihnen, die richtige Entscheidung zu treffen — egal welcher Anbieter am Ende gewinnt.',
  },
  {
    icon: Clock,
    title: 'Schnell statt 12 Monate',
    body: 'Der typische Entscheidungszyklus im Mittelstand dauert 12–24 Monate. Mit ROBZEN kommen Sie in Wochen auf einen klaren Kurs.',
  },
  {
    icon: TrendingUp,
    title: 'Fördermittel inklusive',
    body: 'Wir prüfen gemeinsam, welche staatlichen Förderprogramme für Ihr Projekt in Frage kommen — als Orientierung, kein Versprechen.',
  },
  {
    icon: Users,
    title: 'Für GFs gemacht',
    body: 'Kein Tech-Jargon. Keine Verkaufspräsentationen. Klare Zahlen, klare Optionen — damit Sie Ihren Gesellschaftern etwas vorlegen können.',
  },
]

const useCaseTeaser = [
  { label: 'Cobot-Montage', icon: Factory },
  { label: 'Palettierung', icon: Zap },
  { label: 'AMR-Transport', icon: ArrowRight },
  { label: 'Qualitätsprüfung', icon: CheckCircle },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--accent-muted)_0%,_transparent_60%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 py-28 md:py-36 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs text-accent mb-6">
              <span className="size-1.5 rounded-full bg-accent" />
              Kostenloser Automatisierungs-Check für KMU
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Automatisierung ohne{' '}
              <span className="text-accent">Fehlentscheidung.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl leading-relaxed mb-10">
              ROBZEN hilft deutschen Familienunternehmen, die richtigen Robotik- und
              KI-Lösungen zu finden — ohne Verkaufsdruck, ohne monatelange Recherche,
              ohne teure Berater.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/automatisierungs-check"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
              >
                Kostenlosen Check starten
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/use-cases"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
              >
                Use Cases ansehen
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-2">
              Kein Konto erforderlich · Anonym · In 5 Minuten fertig
            </p>
          </div>
        </div>
      </section>

      {/* Wie ROBZEN funktioniert */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-xl">
          <h2 className="text-3xl font-bold mb-3">Wie ROBZEN funktioniert</h2>
          <p className="text-muted">
            Von der ersten Frage bis zum klaren Projektprofil — in wenigen Schritten.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-xl border border-border bg-surface p-6">
              <div className="text-4xl font-bold text-accent/20 mb-4 font-mono">{step.number}</div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warum ROBZEN */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 max-w-xl">
            <h2 className="text-3xl font-bold mb-3">Warum ROBZEN?</h2>
            <p className="text-muted">
              Der Markt ist unübersichtlich. Anbieter haben Eigeninteressen.
              Wir nicht.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustPoints.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.title} className="rounded-xl border border-border bg-background p-6 flex gap-4">
                  <div className="flex-shrink-0 size-10 rounded-lg bg-accent-muted flex items-center justify-center">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{point.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Case Teaser */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Typische Anwendungsfälle</h2>
            <p className="text-muted">Was andere Mittelständler bereits automatisiert haben.</p>
          </div>
          <Link
            href="/use-cases"
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Alle Use Cases ansehen <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {useCaseTeaser.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href="/use-cases"
              className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3 hover:border-accent/40 hover:bg-surface-2 transition-all group"
            >
              <div className="size-9 rounded-lg bg-accent-muted flex items-center justify-center">
                <Icon size={18} className="text-accent" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Was kostet ROBZEN? */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 max-w-xl">
          <h2 className="text-3xl font-bold mb-3">Was kostet ROBZEN?</h2>
          <p className="text-muted">Transparenz von Anfang an — keine versteckten Provisionen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">Für Unternehmen</p>
            <p className="text-2xl font-bold mb-1">Kostenlos</p>
            <p className="text-sm text-muted">Automatisierungs-Check, KI-Gespräch, Projekt-Steckbrief — ohne Konto, ohne Kreditkarte.</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-2 mb-3">Projektbegleitung</p>
            <p className="text-2xl font-bold mb-1">Nach Aufwand</p>
            <p className="text-sm text-muted">Wenn Sie möchten, dass wir aktiv vermitteln und begleiten — sprechen wir über Ihr Projekt.</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-2">Wir verdienen keine Provision von Anbietern auf Ihre Kaufentscheidung. Unser Interesse ist Ihr Projekterfolg.</p>
      </section>

      {/* CTA strip */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für Ihren Automatisierungs-Check?
          </h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            Kostenlos. Anonym. In 5 Minuten. Kein Konto, kein Verkäufer.
          </p>
          <Link
            href="/automatisierungs-check"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
          >
            Jetzt starten <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
