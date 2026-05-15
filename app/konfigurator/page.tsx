import KonfiguratorUI from './KonfiguratorUI'

export const metadata = {
  title: 'ROI-Konfigurator — ROBZEN',
  description: 'Berechnen Sie indikative Investitionsrahmen und ROI-Horizonte für Ihr Automatisierungsprojekt.',
}

export default function KonfiguratorPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs text-accent mb-4">
          <span className="size-1.5 rounded-full bg-accent" />
          Indikative Schätzung · Demo-Daten
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">ROI-Konfigurator</h1>
        <p className="text-muted text-lg leading-relaxed">
          Stellen Sie Ihren Prozesstyp, Schichtmodell und Automatisierungsgrad ein — und sehen Sie sofort
          einen indikativen Investitionsrahmen, ROI-Horizont und Förderpotenzial.
        </p>
      </div>

      <KonfiguratorUI />
    </main>
  )
}
