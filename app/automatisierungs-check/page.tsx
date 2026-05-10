import type { Metadata } from 'next'
import CheckWizard from './CheckWizard'

export const metadata: Metadata = {
  title: 'Automatisierungs-Check — ROBZEN',
  description:
    'Analysieren Sie Ihr Automatisierungspotenzial in 5 Minuten — kostenlos und anonym.',
}

export default function AutomatisierungsCheckPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs text-accent mb-4">
            Kostenlos · Anonym · 5 Minuten
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Automatisierungs-Check</h1>
          <p className="text-muted">
            Beantworten Sie 5 kurze Fragen. Wir analysieren Ihr Automatisierungspotenzial
            und zeigen Ihnen, ob ein Projekt realistisch ist.
          </p>
        </div>
        <CheckWizard />
      </div>
    </div>
  )
}
