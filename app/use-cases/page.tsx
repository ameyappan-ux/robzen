import type { Metadata } from 'next'
import UseCaseCatalog from './UseCaseCatalog'

export const metadata: Metadata = {
  title: 'Use Cases — ROBZEN',
  description: 'Reale Automatisierungsprojekte aus dem deutschen Mittelstand — nach Lösungstyp filterbar.',
}

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted mb-4">
          Demo-Daten — repräsentative Beispiele, keine Kundendaten
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Use-Case-Katalog</h1>
        <p className="text-muted max-w-xl">
          Typische Automatisierungsprojekte aus dem deutschen Mittelstand — nach Lösungstyp filtern.
          Alle Angaben sind indikative Schätzwerte.
        </p>
      </div>
      <UseCaseCatalog />
    </div>
  )
}
