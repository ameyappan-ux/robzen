'use client'

import { useState, useEffect } from 'react'
import type { Scripts, Contact, Call, ScriptNode, Project, CallOutcome } from './types'

interface Props {
  scripts: Scripts | null
  contacts: Contact[]
  onCallSaved: () => void
}

type Step = 'contact' | 'calling' | 'outcome'

const EMPTY_OUTCOME: CallOutcome & { quotes: string; notes: string } = {
  problemConfirmed: 'unklar',
  energy: 3,
  priceAnchor: '',
  strongSignal: false,
  referral: '',
  quotes: '',
  notes: '',
}

export default function CallMode({ scripts, contacts, onCallSaved }: Props) {
  const [step, setStep] = useState<Step>('contact')
  const [project, setProject] = useState<Project>('robzen')
  const [form, setForm] = useState({ company: '', contactName: '', role: '', phone: '', email: '' })
  const [dupWarning, setDupWarning] = useState<{ contact: Contact; type: 'phone' | 'company' } | null>(null)
  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [currentNodeId, setCurrentNodeId] = useState<string>('')
  const [callPath, setCallPath] = useState<string[]>([])
  const [outcome, setOutcome] = useState(EMPTY_OUTCOME)
  const [saving, setSaving] = useState(false)

  const projectScript = scripts?.[project]
  const currentNode: ScriptNode | null = projectScript?.nodes[currentNodeId] ?? null

  // Live dedup check
  useEffect(() => {
    const normPhone = form.phone.replace(/[^0-9]/g, '')
    const normCompany = form.company.toLowerCase().trim()

    const phoneDup = normPhone.length > 4
      ? contacts.find((c) => c.phone.replace(/[^0-9]/g, '') === normPhone)
      : null
    if (phoneDup) { setDupWarning({ contact: phoneDup, type: 'phone' }); return }

    const companyDup = normCompany.length > 2
      ? contacts.find((c) => c.company.toLowerCase().trim() === normCompany && c.project === project)
      : null
    if (companyDup) { setDupWarning({ contact: companyDup, type: 'company' }); return }

    setDupWarning(null)
  }, [form.phone, form.company, contacts, project])

  async function startCall() {
    let contact = dupWarning?.contact ?? null

    if (!contact) {
      const res = await fetch('/api/callbase/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, project }),
      })

      if (res.status === 409) {
        const data = await res.json()
        setActiveContact(data.existing)
        beginCallMode(data.existing)
        return
      }

      if (!res.ok) return
      contact = await res.json()
    }

    if (!contact) return
    setActiveContact(contact)
    beginCallMode(contact)
  }

  function beginCallMode(contact: Contact) {
    const startNode = scripts?.[contact.project ?? project]?.startNode ?? ''
    setCurrentNodeId(startNode)
    setCallPath([startNode])
    setStep('calling')
    setOutcome(EMPTY_OUTCOME)
  }

  function chooseOption(nextId: string) {
    setCurrentNodeId(nextId)
    setCallPath((prev) => [...prev, nextId])
  }

  function endCall() {
    setStep('outcome')
  }

  async function saveSession() {
    if (!activeContact) return
    setSaving(true)
    try {
      await fetch('/api/callbase/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: activeContact.id,
          project: activeContact.project,
          path: callPath,
          outcome: {
            problemConfirmed: outcome.problemConfirmed,
            energy: outcome.energy,
            priceAnchor: outcome.priceAnchor,
            strongSignal: outcome.strongSignal,
            referral: outcome.referral,
          },
          quotes: outcome.quotes,
          notes: outcome.notes,
        }),
      })
      onCallSaved()
      resetAll()
    } finally {
      setSaving(false)
    }
  }

  function resetAll() {
    setStep('contact')
    setForm({ company: '', contactName: '', role: '', phone: '', email: '' })
    setActiveContact(null)
    setCallPath([])
    setCurrentNodeId('')
    setOutcome(EMPTY_OUTCOME)
  }

  function useExisting() {
    if (!dupWarning) return
    setActiveContact(dupWarning.contact)
    beginCallMode(dupWarning.contact)
  }

  if (step === 'contact') {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-xl mx-auto">
        {/* Project selector */}
        <div className="flex gap-2">
          {(['robzen', 'zenmind'] as Project[]).map((p) => (
            <button
              key={p}
              onClick={() => setProject(p)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                project === p
                  ? 'bg-accent text-background'
                  : 'bg-surface-2 text-muted hover:text-foreground border border-border'
              }`}
            >
              {p === 'robzen' ? 'ROBZEN' : 'Zenmind'}
            </button>
          ))}
        </div>

        {/* Dedup warning */}
        {dupWarning && (
          <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
            <p className="font-semibold text-yellow-400 text-sm mb-1">
              ⚠ {dupWarning.type === 'phone' ? 'Nummer' : 'Firma'} bereits bekannt
            </p>
            <p className="text-sm text-foreground mb-1">
              <strong>{dupWarning.contact.company}</strong> – {dupWarning.contact.contactName}
            </p>
            <p className="text-xs text-muted mb-2">
              Status: {dupWarning.contact.status} · Anrufe: {dupWarning.contact.callIds.length} ·
              Letzter Kontakt: {dupWarning.contact.lastContactedAt ? new Date(dupWarning.contact.lastContactedAt).toLocaleDateString('de-DE') : '—'}
            </p>
            <button
              onClick={useExisting}
              className="rounded-lg bg-yellow-500/20 border border-yellow-500/40 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-500/30 transition-colors"
            >
              Trotzdem anrufen (existierenden Kontakt verwenden)
            </button>
          </div>
        )}

        {/* Contact form */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-foreground">Kontaktdaten</h2>
          <input
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            placeholder="Firma *"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            placeholder="Ansprechpartner"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          />
          <input
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            placeholder="Rolle (z. B. Produktionsleiter)"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            type="tel"
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            placeholder="Telefonnummer *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <button
          onClick={startCall}
          disabled={!form.company.trim() && !form.phone.trim()}
          className="rounded-2xl bg-accent py-4 text-lg font-bold text-background hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anruf starten →
        </button>
      </div>
    )
  }

  if (step === 'outcome') {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-xl mx-auto">
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
          <h2 className="font-bold text-xl text-foreground">Anruf speichern</h2>
          <p className="text-sm text-muted">{activeContact?.company} · {activeContact?.contactName}</p>

          {/* Problem confirmed */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Problem bestätigt?</label>
            <div className="grid grid-cols-4 gap-2">
              {(['ja', 'teils', 'nein', 'unklar'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setOutcome({ ...outcome, problemConfirmed: v })}
                  className={`py-3 rounded-xl text-sm font-semibold transition-colors ${
                    outcome.problemConfirmed === v
                      ? 'bg-accent text-background'
                      : 'bg-surface-2 text-muted border border-border hover:border-accent'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Energie des Gesprächs: <span className="text-accent font-bold">{outcome.energy}</span>/5
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setOutcome({ ...outcome, energy: n })}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                    outcome.energy === n
                      ? 'bg-accent text-background'
                      : 'bg-surface-2 text-muted border border-border hover:border-accent'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Strong signal */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={outcome.strongSignal}
              onChange={(e) => setOutcome({ ...outcome, strongSignal: e.target.checked })}
            />
            <span className="text-sm font-medium text-foreground">⭐ Starkes Signal</span>
          </label>

          {/* Price anchor */}
          <input
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            placeholder="Preisanker / Budget (z. B. '5–10k€ pro Jahr')"
            value={outcome.priceAnchor}
            onChange={(e) => setOutcome({ ...outcome, priceAnchor: e.target.value })}
          />

          {/* Referral */}
          <input
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            placeholder="Empfehlung erhalten? (Name / Firma)"
            value={outcome.referral}
            onChange={(e) => setOutcome({ ...outcome, referral: e.target.value })}
          />

          {/* Quotes */}
          <textarea
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
            placeholder="Wörtliche Zitate (Gold für Investoren!)"
            rows={3}
            value={outcome.quotes}
            onChange={(e) => setOutcome({ ...outcome, quotes: e.target.value })}
          />

          {/* Notes */}
          <textarea
            className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
            placeholder="Notizen"
            rows={2}
            value={outcome.notes}
            onChange={(e) => setOutcome({ ...outcome, notes: e.target.value })}
          />

          {/* Path taken */}
          <p className="text-xs text-muted-2">
            Pfad: {callPath.join(' → ')}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={resetAll}
              className="flex-1 py-3 rounded-xl border border-border text-muted hover:text-foreground transition-colors"
            >
              Verwerfen
            </button>
            <button
              onClick={saveSession}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-accent font-bold text-background hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Speichern…' : 'Speichern ✓'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // step === 'calling'
  if (!currentNode) {
    return (
      <div className="p-4 text-center text-muted">
        <p>Skript-Knoten nicht gefunden.</p>
        <button onClick={resetAll} className="mt-4 text-accent underline">Zurücksetzen</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-10">
        <div>
          <span className="text-xs text-muted">{activeContact?.company}</span>
          {activeContact?.contactName && (
            <span className="text-xs text-muted"> · {activeContact.contactName}</span>
          )}
        </div>
        <button
          onClick={endCall}
          className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          Anruf beenden
        </button>
      </div>

      {/* Node content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Phase + title */}
        <div>
          <span className="text-xs font-medium text-accent uppercase tracking-wider">{currentNode.phase}</span>
          <h2 className="text-2xl font-bold text-foreground mt-1">{currentNode.title}</h2>
        </div>

        {/* Say */}
        {currentNode.say && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold text-muted uppercase mb-2">Du sagst:</p>
            <p className="text-base leading-relaxed text-foreground">{currentNode.say}</p>
          </div>
        )}

        {/* Signal */}
        {currentNode.signal && (
          <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3">
            <p className="text-sm font-semibold text-accent">{currentNode.signal}</p>
          </div>
        )}

        {/* Tip */}
        {currentNode.tip && (
          <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
            <p className="text-xs font-semibold text-muted uppercase mb-1">Profi-Tipp</p>
            <p className="text-sm text-muted leading-relaxed">{currentNode.tip}</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="p-4 flex flex-col gap-3 border-t border-border bg-background">
        {currentNode.type === 'choice' ? (
          <>
            <p className="text-xs text-muted text-center">Wähle eine Situation:</p>
            {currentNode.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => chooseOption(opt.next)}
                className="w-full py-4 px-5 rounded-2xl bg-surface border border-border text-left text-base font-medium text-foreground hover:border-accent hover:bg-accent/5 transition-colors active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </>
        ) : (
          <>
            <p className="text-xs text-muted text-center">Was antwortet dein Gegenüber?</p>
            {currentNode.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => chooseOption(opt.next)}
                className="w-full py-4 px-5 rounded-2xl bg-surface border border-border text-left text-base font-medium text-foreground hover:border-accent hover:bg-accent/5 transition-colors active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
