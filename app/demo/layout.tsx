import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'ROBZEN Interactive Demo',
  description: 'Automation Opportunity Finder — Finden Sie Ihre Automatisierungslösung in wenigen Minuten.',
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Demo-specific top bar */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 h-12 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors">
            <ArrowLeft size={12} /> Zurück zur Hauptseite
          </Link>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted">Interaktive Demo · Alle Daten simuliert</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
