import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-1 font-semibold text-foreground mb-1">
              <span className="text-accent font-bold">ROB</span>
              <span>ZEN</span>
            </div>
            <p className="text-xs text-muted max-w-xs">
              Ihr neutraler Automatisierungsberater für den deutschen Mittelstand.
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row gap-4 text-xs text-muted">
            <Link href="/use-cases" className="hover:text-foreground transition-colors">
              Use Cases
            </Link>
            <Link href="/projekt-starten" className="hover:text-foreground transition-colors">
              Projekt starten
            </Link>
            <Link href="/kontakt" className="hover:text-foreground transition-colors">
              Kontakt
            </Link>
            <Link href="/impressum" className="hover:text-foreground transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">
              Datenschutz
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-2">
          <p>© {new Date().getFullYear()} ROBZEN. Alle Rechte vorbehalten.</p>
          <p className="italic">
            Alle Kosten- und ROI-Angaben sind indikative Schätzungen — kein Angebot.
          </p>
        </div>
      </div>
    </footer>
  )
}
