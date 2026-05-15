'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/automatisierungs-check', label: 'Automatisierungs-Check' },
  { href: '/konfigurator', label: 'Konfigurator' },
  { href: '/demo', label: 'Demo' },
  { href: '/use-cases', label: 'Use Cases' },
  { href: '/projekt-starten', label: 'Projekt starten' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="text-accent font-bold text-xl">ROB</span>
          <span className="text-xl">ZEN</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${pathname.startsWith(l.href) ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/automatisierungs-check"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
          >
            Kostenlos starten
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menü öffnen"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${pathname.startsWith(l.href) ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/automatisierungs-check"
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background text-center hover:bg-accent-hover transition-colors"
            onClick={() => setOpen(false)}
          >
            Kostenlos starten
          </Link>
        </div>
      )}
    </header>
  )
}
