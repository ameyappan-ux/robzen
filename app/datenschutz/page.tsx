import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — ROBZEN',
}

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <div>
          <h2 className="text-foreground font-semibold mb-1">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher für die Verarbeitung personenbezogener Daten auf dieser Website ist
            ROBZEN (Youssef Ayad, Tung Dao, Arun Meyappan), Waldenserstr. 30, 10551 Berlin.
            Kontakt: info@robzen.com.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">2. Welche Daten wir erheben</h2>
          <p>
            Wenn Sie unser Kontaktformular nutzen, erheben wir: Name, E-Mail-Adresse und den Inhalt
            Ihrer Nachricht. Diese Daten verwenden wir ausschließlich zur Beantwortung Ihrer Anfrage
            und geben sie nicht an Dritte weiter.
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
            allgemeinen Website-Nutzung.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">4. E-Mail-Versand (Resend)</h2>
          <p>
            Für den Versand von E-Mails über das Kontaktformular nutzen wir den Dienst Resend
            (Resend Inc., 2261 Market Street, San Francisco, CA 94114, USA). Ihre Kontaktdaten
            werden zur Übermittlung der E-Mail an Resend weitergegeben und danach nicht gespeichert.
            Es besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">5. KI-Chatbot (Claude API)</h2>
          <p>
            Der ROBZEN KI-Chatbot nutzt die Claude API von Anthropic, PBC (548 Market St,
            San Francisco, CA 94104, USA). Ihre Eingaben werden zur Generierung der Antwort an
            Anthropic übermittelt. Anthropic verarbeitet diese Daten gemäß deren
            Datenschutzrichtlinien (anthropic.com/privacy). Geben Sie im Chat keine sensiblen
            persönlichen Informationen ein.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">6. Hosting</h2>
          <p>
            Diese Website wird bei Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104,
            USA gehostet. Es gilt die Datenschutzerklärung von Vercel (vercel.com/legal/privacy-policy).
            Die Datenübertragung in die USA erfolgt auf Basis der Standardvertragsklauseln der
            EU-Kommission.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">7. Speicherdauer</h2>
          <p>
            Kontaktformulardaten werden nur so lange gespeichert, wie es zur Bearbeitung Ihrer
            Anfrage erforderlich ist, spätestens jedoch nach 6 Monaten gelöscht, sofern keine
            gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold mb-1">8. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung
            (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20).
            Sie haben außerdem das Recht, bei einer Aufsichtsbehörde Beschwerde einzulegen.
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an info@robzen.com.
          </p>
        </div>
      </div>
    </div>
  )
}
