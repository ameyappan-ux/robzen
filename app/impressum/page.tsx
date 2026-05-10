import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum — ROBZEN',
}

export default function Impressum() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <div className="rounded-lg border border-border bg-surface p-4 text-accent text-xs">
          Platzhalter — wird vor dem offiziellen Live-Gang mit vollständigen Angaben aktualisiert (§ 5 TMG).
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Angaben gemäß § 5 TMG</h2>
          <p>ROBZEN</p>
          <p>[Vollständiger Name des Unternehmens / Inhabers]</p>
          <p>[Straße und Hausnummer]</p>
          <p>[PLZ und Ort], Deutschland</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Kontakt</h2>
          <p>E-Mail: [kontakt@robzen.de]</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Handelsregister</h2>
          <p>[Amtsgericht und Registernummer, sofern eingetragen]</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Umsatzsteuer-ID</h2>
          <p>[USt-IdNr. gemäß § 27a UStG, sofern vorhanden]</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Alle Kosten- und ROI-Angaben auf dieser
            Plattform sind indikative Schätzungen und stellen kein Angebot dar.
          </p>
        </div>
      </div>
    </div>
  )
}
