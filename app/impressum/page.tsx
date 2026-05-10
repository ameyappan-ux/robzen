import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum — ROBZEN',
}

export default function Impressum() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <div>
          <h2 className="text-foreground font-semibold mb-1">Angaben gemäß § 5 TMG</h2>
          <p className="font-medium text-foreground">ROBZEN</p>
          <p>Youssef Ayad, Tung Dao, Arun Meyappan</p>
          <p>Waldenserstr. 30</p>
          <p>10551 Berlin, Deutschland</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Kontakt</h2>
          <p>Telefon: +49 173 173 9704</p>
          <p>E-Mail: info@robzen.com</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Alle Kosten- und ROI-Angaben auf dieser
            Plattform sind indikative Schätzungen und stellen kein Angebot dar.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich.
          </p>
        </div>
      </div>
    </div>
  )
}
