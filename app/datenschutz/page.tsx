import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — ROBZEN',
}

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <div className="rounded-lg border border-border bg-surface p-4 text-accent text-xs">
          Platzhalter — wird vor dem offiziellen Live-Gang durch eine vollständige DSGVO-konforme
          Datenschutzerklärung ersetzt.
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher für die Verarbeitung personenbezogener Daten auf dieser Website ist
            ROBZEN, [Adresse]. Kontakt: [kontakt@robzen.de].
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">2. Welche Daten wir erheben</h2>
          <p>
            Wenn Sie unser Kontaktformular nutzen, erheben wir: Name, E-Mail-Adresse und den Inhalt
            Ihrer Nachricht. Diese Daten verwenden wir ausschließlich zur Beantwortung Ihrer Anfrage.
          </p>
          <p className="mt-2">
            Bei der Nutzung des Automatisierungs-Checks und des KI-Chatbots werden keine
            personenbezogenen Daten dauerhaft gespeichert. Die Eingaben werden serverseitig
            verarbeitet und nicht persistiert.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">3. Rechtsgrundlage</h2>
          <p>
            Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) beim
            Kontaktformular und Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen) bei der
            Website-Nutzung.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">4. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
            Verarbeitung und Datenübertragbarkeit. Zur Ausübung Ihrer Rechte wenden Sie sich bitte
            an [kontakt@robzen.de].
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">5. Hosting</h2>
          <p>
            Diese Website wird bei Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104,
            USA gehostet. Es gilt die Datenschutzerklärung von Vercel: vercel.com/legal/privacy-policy.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">6. KI-Chatbot (Claude API)</h2>
          <p>
            Der ROBZEN KI-Chatbot nutzt die Claude API von Anthropic, PBC. Ihre Eingaben werden zur
            Generierung der Antwort an Anthropic übermittelt. Anthropic verarbeitet diese Daten
            gemäß deren Datenschutzrichtlinien (anthropic.com/privacy). Geben Sie im Chat keine
            sensiblen persönlichen Informationen an.
          </p>
        </div>
      </div>
    </div>
  )
}
