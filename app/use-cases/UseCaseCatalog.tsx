'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Clock, Banknote } from 'lucide-react'
import { USE_CASES, CATEGORIES } from '@/data/usecases'
import type { UseCaseCategory } from '@/data/usecases'

const CATEGORY_COLORS: Record<UseCaseCategory, string> = {
  'Cobot-Montage': 'text-accent bg-accent-muted border-accent/30',
  'Cobot-Palettierung': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'AMR-Transport': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  'Qualitätsprüfung': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Verpackung': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'KI-Prozesssteuerung': 'text-pink-400 bg-pink-400/10 border-pink-400/30',
}

export default function UseCaseCatalog() {
  const [active, setActive] = useState<UseCaseCategory | 'Alle'>('Alle')

  const filtered = active === 'Alle' ? USE_CASES : USE_CASES.filter((uc) => uc.category === active)

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActive('Alle')}
          className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
            active === 'Alle'
              ? 'border-accent bg-accent-muted text-accent'
              : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
          }`}
        >
          Alle ({USE_CASES.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
              active === cat
                ? `border-accent bg-accent-muted text-accent`
                : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
            }`}
          >
            {cat} ({USE_CASES.filter((u) => u.category === cat).length})
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((uc) => (
          <div
            key={uc.id}
            className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4 hover:border-border/80 transition-all"
          >
            {/* Category + demo badge */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-medium rounded-full border px-2.5 py-1 ${CATEGORY_COLORS[uc.category]}`}>
                {uc.category}
              </span>
              <span className="text-xs text-muted-2 rounded-full border border-border px-2 py-0.5">
                Demo-Daten
              </span>
            </div>

            {/* Title + branche */}
            <div>
              <h3 className="font-semibold text-foreground leading-snug mb-1">{uc.title}</h3>
              <p className="text-xs text-muted">{uc.branche}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed flex-1">{uc.beschreibung}</p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-2 mb-0.5">
                  <TrendingUp size={10} /> Ergebnis
                </div>
                <p className="text-xs text-accent font-medium">{uc.ergebnis}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-2 mb-0.5">
                  <Banknote size={10} /> Investition
                </div>
                <p className="text-xs text-foreground">{uc.investition}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-2 mb-0.5">
                  <Clock size={10} /> ROI
                </div>
                <p className="text-xs text-foreground">{uc.roi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-muted mb-4">Sehen Sie Parallelen zu Ihrem Betrieb?</p>
        <Link
          href="/automatisierungs-check"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background hover:bg-accent-hover transition-colors"
        >
          Kostenlosen Check starten <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
