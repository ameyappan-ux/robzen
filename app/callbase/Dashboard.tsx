'use client'

import { useState, useEffect } from 'react'
import type { Contact, Call, Project } from './types'

interface Props {
  contacts: Contact[]
  calls: Call[]
}

type Light = 'grün' | 'gelb' | 'rot'

function TrafficLight({ color, label, reason }: { color: Light; label: string; reason: string }) {
  const dot =
    color === 'grün' ? 'bg-green-400' : color === 'gelb' ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 flex gap-3 items-start">
      <div className={`mt-0.5 w-3 h-3 rounded-full shrink-0 ${dot}`} />
      <div>
        <p className="font-semibold text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted mt-0.5">{reason}</p>
      </div>
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-center">
      <p className="text-3xl font-bold text-accent">{value}</p>
      <p className="text-sm text-foreground mt-1">{label}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

const GUT_KEY = 'callbase-gut-check'

export default function Dashboard({ contacts, calls }: Props) {
  const [activeProject, setActiveProject] = useState<Project>('robzen')
  const [gut, setGut] = useState<Record<Project, number>>({ robzen: 3, zenmind: 3 })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUT_KEY)
      if (stored) setGut(JSON.parse(stored))
    } catch {}
  }, [])

  function setGutCheck(project: Project, value: number) {
    const updated = { ...gut, [project]: value }
    setGut(updated)
    localStorage.setItem(GUT_KEY, JSON.stringify(updated))
  }

  const pc = contacts.filter((c) => c.project === activeProject)
  const pcalls = calls.filter((c) => c.project === activeProject)

  const total = pc.length
  const attempted = pc.filter((c) => c.status !== 'offen').length
  const reached = pc.filter((c) => c.callIds.length > 0).length
  const reachRate = attempted > 0 ? Math.round((reached / attempted) * 100) : 0

  const confirmed = pcalls.filter((c) => c.outcome.problemConfirmed === 'ja').length
  const confirmedRate = reached > 0 ? Math.round((confirmed / reached) * 100) : 0

  const strongSignals = pcalls.filter((c) => c.outcome.strongSignal)
  const priceAnchors = pcalls.filter((c) => c.outcome.priceAnchor.trim() !== '')
  const referrals = pcalls.filter((c) => c.outcome.referral.trim() !== '')

  // Validation lights
  const light1: Light = confirmed > 0 && confirmedRate > 50 ? 'grün' : confirmedRate > 25 ? 'gelb' : 'rot'
  const light1reason =
    reached === 0
      ? 'Noch keine Gespräche.'
      : `${confirmed} von ${reached} Erreichten (${confirmedRate}%) bestätigen das Problem.`

  const light2: Light = priceAnchors.length > 0 ? 'grün' : pcalls.length > 0 ? 'rot' : 'gelb'
  const light2reason =
    priceAnchors.length > 0
      ? `${priceAnchors.length} Preisanker / Budget${priceAnchors.length !== 1 ? 's' : ''} erfasst.`
      : 'Noch kein Preisanker erfasst.'

  const light3: Light = reachRate > 30 ? 'grün' : reachRate > 15 ? 'gelb' : attempted > 0 ? 'rot' : 'gelb'
  const light3reason =
    attempted === 0
      ? 'Noch keine Kontaktversuche.'
      : `${reached} von ${attempted} Versuchen erfolgreich (${reachRate}% Erreichbarkeit).`

  const gutValue = gut[activeProject]
  const light4: Light = gutValue >= 4 ? 'grün' : gutValue >= 3 ? 'gelb' : 'rot'
  const light4reason = `Team-Bauchgefühl: ${gutValue}/5`

  const allGreen = [light1, light2, light3, light4].every((l) => l === 'grün')
  const anyRed = [light1, light2, light3, light4].some((l) => l === 'rot')
  const verdict = allGreen ? 'Grünes Licht' : anyRed ? 'Noch nicht validiert' : 'Auf dem richtigen Weg'
  const verdictColor = allGreen ? 'text-green-400' : anyRed ? 'text-red-400' : 'text-yellow-400'

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6">
      {/* Project selector */}
      <div className="flex gap-2">
        {(['robzen', 'zenmind'] as Project[]).map((p) => (
          <button
            key={p}
            onClick={() => setActiveProject(p)}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
              activeProject === p
                ? 'bg-accent text-background'
                : 'bg-surface-2 text-muted hover:text-foreground border border-border'
            }`}
          >
            {p === 'robzen' ? 'ROBZEN' : 'Zenmind'}
          </button>
        ))}
      </div>

      {/* Verdict */}
      <div className="rounded-2xl border border-border bg-surface p-5 text-center">
        <p className="text-xs text-muted uppercase tracking-wider mb-1">Validierungsstatus</p>
        <p className={`text-3xl font-bold ${verdictColor}`}>{verdict}</p>
        <p className="text-xs text-muted mt-1">
          {activeProject === 'robzen' ? 'ROBZEN' : 'Zenmind'} · Stand: jetzt
        </p>
      </div>

      {/* Funnel metrics */}
      <div>
        <p className="text-xs text-muted uppercase tracking-wider mb-3">Funnel</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Kontakte" value={total} />
          <Metric label="Versuche" value={attempted} />
          <Metric label="Erreicht" value={reached} sub={attempted > 0 ? `${reachRate}%` : undefined} />
          <Metric label="Problem bestätigt" value={confirmed} sub={reached > 0 ? `${confirmedRate}%` : undefined} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Metric label="Starke Signale ⭐" value={strongSignals.length} />
          <Metric label="Preisanker 💰" value={priceAnchors.length} />
        </div>
      </div>

      {/* 4 Validation lights */}
      <div>
        <p className="text-xs text-muted uppercase tracking-wider mb-3">4 Validierungs-Fragen</p>
        <div className="flex flex-col gap-2">
          <TrafficLight color={light1} label="Problem real?" reason={light1reason} />
          <TrafficLight
            color={light2}
            label={activeProject === 'robzen' ? 'Zahlt jemand? (Anbieter-Seite)' : 'Zahlt jemand? (Studierendenwerk)'}
            reason={light2reason}
          />
          <TrafficLight color={light3} label="Kommt ihr ran?" reason={light3reason} />
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex gap-3 items-start mb-3">
              <div
                className={`mt-0.5 w-3 h-3 rounded-full shrink-0 ${
                  light4 === 'grün' ? 'bg-green-400' : light4 === 'gelb' ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
              <p className="font-semibold text-foreground text-sm">Wollt ihr es?</p>
            </div>
            <p className="text-xs text-muted mb-3">Team-Bauchgefühl (manuell setzen):</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setGutCheck(activeProject, n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                    gutValue === n
                      ? 'bg-accent text-background'
                      : 'bg-surface-2 border border-border text-muted hover:border-accent'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strong signals list */}
      {strongSignals.length > 0 && (
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-3">⭐ Starke Signale (Gold fürs Team)</p>
          <div className="flex flex-col gap-2">
            {strongSignals.map((call) => {
              const contact = contacts.find((c) => c.id === call.contactId)
              return (
                <div key={call.id} className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground text-sm">{contact?.company ?? '—'}</span>
                    <span className="text-xs text-muted">
                      {new Date(call.date).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {contact?.contactName && <p className="text-xs text-muted">{contact.contactName}</p>}
                  {call.outcome.priceAnchor && (
                    <p className="text-xs text-accent mt-1">💰 {call.outcome.priceAnchor}</p>
                  )}
                  {call.quotes && <p className="text-sm text-foreground mt-2 italic">"{call.quotes}"</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Referrals */}
      {referrals.length > 0 && (
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-3">Empfehlungen – warme Leads</p>
          <div className="flex flex-col gap-2">
            {referrals.map((call) => {
              const contact = contacts.find((c) => c.id === call.contactId)
              return (
                <div key={call.id} className="rounded-xl border border-border bg-surface p-3 flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <div>
                    <p className="text-sm text-foreground">{call.outcome.referral}</p>
                    <p className="text-xs text-muted mt-0.5">via {contact?.company ?? '—'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Follow-ups */}
      {(() => {
        const followUps = pc.filter((c) => c.status === 'Folgetermin')
        if (!followUps.length) return null
        return (
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-3">Offene Folgetermine</p>
            <div className="flex flex-col gap-2">
              {followUps.map((c) => (
                <div key={c.id} className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3">
                  <p className="text-sm font-semibold text-foreground">{c.company}</p>
                  {c.contactName && <p className="text-xs text-muted">{c.contactName} · {c.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
