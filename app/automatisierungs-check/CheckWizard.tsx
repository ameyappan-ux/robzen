'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { automatisierungsScore, fundingEligibility } from '@/lib/scoring'
import { encodeProfile } from '@/lib/project-profile'
import type { BudgetRange, Schichtmodell } from '@/lib/project-profile'
import { v4 as uuidv4 } from 'uuid'

interface FormState {
  branche: string
  mitarbeiter: string
  prozess: string
  ziel: string
  budget: BudgetRange | ''
  zeithorizont: string
  schichten: Schichtmodell | ''
}

const INITIAL: FormState = {
  branche: '',
  mitarbeiter: '',
  prozess: '',
  ziel: '',
  budget: '',
  zeithorizont: '',
  schichten: '',
}

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: '<50k', label: 'Unter 50.000 €' },
  { value: '50-150k', label: '50.000 – 150.000 €' },
  { value: '150-500k', label: '150.000 – 500.000 €' },
  { value: '>500k', label: 'Über 500.000 €' },
  { value: 'unklar', label: 'Noch nicht definiert' },
]

const SCHICHT_OPTIONS: { value: Schichtmodell; label: string }[] = [
  { value: '1-Schicht', label: 'Einschicht (ca. 8 Std./Tag)' },
  { value: '2-Schicht', label: 'Zweischicht (ca. 16 Std./Tag)' },
  { value: '3-Schicht / 24/7', label: 'Dreischicht / 24/7-Betrieb' },
]

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-muted mb-2">
        <span>Schritt {step} von {total}</span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default function CheckWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL)

  const total = 5

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return form.branche.trim().length > 0 && form.mitarbeiter.trim().length > 0
      case 2: return form.prozess.trim().length >= 10
      case 3: return form.ziel.trim().length > 0
      case 4: return form.budget !== '' && form.schichten !== ''
      case 5: return form.zeithorizont.trim().length > 0
      default: return false
    }
  }

  function handleSubmit() {
    const score = automatisierungsScore({
      budget: form.budget as BudgetRange,
      ziel: form.ziel,
      mitarbeiter: form.mitarbeiter,
      zeithorizont: form.zeithorizont,
      prozess: form.prozess,
    })
    const funding = fundingEligibility({
      budget: form.budget as BudgetRange,
      ziel: form.ziel,
      mitarbeiter: form.mitarbeiter,
      zeithorizont: form.zeithorizont,
      prozess: form.prozess,
    })

    const profile = {
      id: uuidv4(),
      prozess: form.prozess,
      mitarbeiter: form.mitarbeiter,
      schichten: form.schichten as Schichtmodell,
      ziel: form.ziel,
      budget: form.budget as BudgetRange,
      zeithorizont: form.zeithorizont,
      raeumlich: '',
      automationLevel: score,
      fundingEligibility: funding,
      createdAt: new Date().toISOString(),
    }

    const encoded = encodeProfile(profile)
    router.push(`/automatisierungs-check/ergebnis?p=${encoded}`)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <ProgressBar step={step} total={total} />

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Ihr Unternehmen</h2>
            <p className="text-sm text-muted">Kurze Einordnung — hilft uns, relevante Beispiele zu zeigen.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Branche / Produktbereich</label>
            <input
              type="text"
              placeholder="z.B. Metallverarbeitung, Lebensmittelproduktion, Kunststoff…"
              value={form.branche}
              onChange={(e) => set('branche', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mitarbeiteranzahl im Betrieb</label>
            <input
              type="text"
              placeholder="z.B. 80"
              value={form.mitarbeiter}
              onChange={(e) => set('mitarbeiter', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Welcher Prozess soll automatisiert werden?</h2>
            <p className="text-sm text-muted">Beschreiben Sie konkret, was heute manuell läuft.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Prozessbeschreibung</label>
            <textarea
              rows={4}
              placeholder="z.B. Wir palettieren derzeit per Hand. 3 Mitarbeiter packen täglich 400–600 Kartons auf Paletten, zweischichtig…"
              value={form.prozess}
              onChange={(e) => set('prozess', e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-muted mt-1">
              {form.prozess.length < 10
                ? `Noch ${10 - form.prozess.length} Zeichen mindestens`
                : `${form.prozess.length} Zeichen`}
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Was ist das Ziel der Automatisierung?</h2>
            <p className="text-sm text-muted">Was soll sich konkret verbessern?</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              'Kapazität erhöhen',
              'Fachkräftemangel ausgleichen',
              'Fehlerquote senken',
              'Kosten reduzieren',
              'Durchlaufzeiten verkürzen',
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => set('ziel', option)}
                className={`rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                  form.ziel === option
                    ? 'border-accent bg-accent-muted text-accent'
                    : 'border-border bg-background text-foreground hover:border-accent/40'
                }`}
              >
                {option}
              </button>
            ))}
            <div>
              <input
                type="text"
                placeholder="Sonstiges Ziel eingeben…"
                value={![
                  'Kapazität erhöhen',
                  'Fachkräftemangel ausgleichen',
                  'Fehlerquote senken',
                  'Kosten reduzieren',
                  'Durchlaufzeiten verkürzen',
                ].includes(form.ziel) ? form.ziel : ''}
                onChange={(e) => set('ziel', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Budget & Schichtmodell</h2>
            <p className="text-sm text-muted">Beide Faktoren beeinflussen den ROI maßgeblich.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Investitionsrahmen (indikativ)</label>
            <div className="grid grid-cols-1 gap-2">
              {BUDGET_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set('budget', o.value)}
                  className={`rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                    form.budget === o.value
                      ? 'border-accent bg-accent-muted text-accent'
                      : 'border-border bg-background text-foreground hover:border-accent/40'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Schichtmodell im betreffenden Bereich</label>
            <div className="grid grid-cols-1 gap-2">
              {SCHICHT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set('schichten', o.value)}
                  className={`rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                    form.schichten === o.value
                      ? 'border-accent bg-accent-muted text-accent'
                      : 'border-border bg-background text-foreground hover:border-accent/40'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Zeitrahmen</h2>
            <p className="text-sm text-muted">Bis wann soll eine Lösung in Betrieb sein?</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              '3–6 Monate',
              '6–12 Monate',
              '1–2 Jahre',
              'Noch offen',
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => set('zeithorizont', option)}
                className={`rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                  form.zeithorizont === option
                    ? 'border-accent bg-accent-muted text-accent'
                    : 'border-border bg-background text-foreground hover:border-accent/40'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={15} /> Zurück
        </button>

        {step < total ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Weiter <ChevronRight size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Auswertung anzeigen <ChevronRight size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
