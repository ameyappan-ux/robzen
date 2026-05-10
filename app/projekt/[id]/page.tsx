import type { Metadata } from 'next'
import SteckbriefView from './SteckbriefView'

export const metadata: Metadata = {
  title: 'Ihr Projekt-Steckbrief — ROBZEN',
}

export default function ProjektPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SteckbriefView />
      </div>
    </div>
  )
}
