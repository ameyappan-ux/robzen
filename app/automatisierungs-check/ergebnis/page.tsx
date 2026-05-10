import type { Metadata } from 'next'
import ResultScreen from './ResultScreen'

export const metadata: Metadata = {
  title: 'Ihr Ergebnis — Automatisierungs-Check — ROBZEN',
}

export default function ErgebnisPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <ResultScreen />
      </div>
    </div>
  )
}
