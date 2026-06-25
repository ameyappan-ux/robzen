'use client'

import { useState } from 'react'
import type { Contact, Call, Project, ContactStatus } from './types'

interface Props {
  contacts: Contact[]
  calls: Call[]
  onRefresh: () => void
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  offen: 'Offen',
  kontaktiert: 'Kontaktiert',
  'nicht erreicht': 'Nicht erreicht',
  Folgetermin: 'Folgetermin',
  abgeschlossen: 'Abgeschlossen',
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  offen: 'text-muted border-border',
  kontaktiert: 'text-accent border-accent/40',
  'nicht erreicht': 'text-yellow-400 border-yellow-500/40',
  Folgetermin: 'text-blue-400 border-blue-500/40',
  abgeschlossen: 'text-muted-2 border-border',
}

export default function ContactsView({ contacts, calls, onRefresh }: Props) {
  const [filterProject, setFilterProject] = useState<Project | 'alle'>('alle')
  const [filterStatus, setFilterStatus] = useState<ContactStatus | 'alle'>('alle')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<Record<string, ContactStatus>>({})

  const filtered = contacts.filter((c) => {
    if (filterProject !== 'alle' && c.project !== filterProject) return false
    if (filterStatus !== 'alle' && c.status !== filterStatus) return false
    if (search) {
      const s = search.toLowerCase()
      if (!c.company.toLowerCase().includes(s) && !c.contactName.toLowerCase().includes(s)) return false
    }
    return true
  })

  async function updateStatus(contactId: string, status: ContactStatus) {
    setEditStatus((prev) => ({ ...prev, [contactId]: status }))
    await fetch(`/api/callbase/contacts/${contactId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    onRefresh()
  }

  async function deleteContact(contactId: string) {
    if (!confirm('Kontakt wirklich löschen?')) return
    await fetch(`/api/callbase/contacts/${contactId}`, { method: 'DELETE' })
    onRefresh()
  }

  function getCallsForContact(contactId: string): Call[] {
    return calls.filter((c) => c.contactId === contactId).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <input
          className="rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
          placeholder="Suche nach Firma oder Name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['alle', 'robzen', 'zenmind'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterProject(p)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterProject === p ? 'bg-accent text-background' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              {p === 'alle' ? 'Alle Projekte' : p === 'robzen' ? 'ROBZEN' : 'Zenmind'}
            </button>
          ))}
          <div className="w-px bg-border mx-1" />
          {(['alle', 'offen', 'kontaktiert', 'nicht erreicht', 'Folgetermin', 'abgeschlossen'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterStatus === s ? 'bg-accent text-background' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              {s === 'alle' ? 'Alle Status' : STATUS_LABELS[s as ContactStatus]}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-muted">{filtered.length} Kontakt{filtered.length !== 1 ? 'e' : ''}</p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-muted">Keine Kontakte gefunden.</p>
          <p className="text-xs text-muted-2 mt-1">Starte einen Anruf, um den ersten Kontakt anzulegen.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((contact) => {
            const contactCalls = getCallsForContact(contact.id)
            const isOpen = expanded === contact.id
            const currentStatus = editStatus[contact.id] ?? contact.status

            return (
              <div key={contact.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
                {/* Contact header */}
                <div
                  className="flex items-start justify-between gap-3 p-4 cursor-pointer hover:bg-surface-2 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : contact.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{contact.company}</span>
                      <span className={`text-xs border rounded-full px-2 py-0.5 ${STATUS_COLORS[currentStatus]}`}>
                        {STATUS_LABELS[currentStatus]}
                      </span>
                      <span className="text-xs text-muted-2 rounded-full border border-border px-2 py-0.5">
                        {contact.project === 'robzen' ? 'ROBZEN' : 'Zenmind'}
                      </span>
                    </div>
                    {contact.contactName && (
                      <p className="text-sm text-muted mt-0.5">{contact.contactName}{contact.role ? ` · ${contact.role}` : ''}</p>
                    )}
                    <p className="text-sm text-muted-2 mt-0.5">
                      {contact.phone}
                      {contactCalls.length > 0 && ` · ${contactCalls.length} Anruf${contactCalls.length !== 1 ? 'e' : ''}`}
                    </p>
                  </div>
                  <span className="text-muted text-lg">{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-border p-4 flex flex-col gap-4 bg-surface-2">
                    {/* Status editor */}
                    <div>
                      <p className="text-xs text-muted mb-2 font-medium">Status ändern:</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(STATUS_LABELS) as ContactStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(contact.id, s)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              currentStatus === s
                                ? 'bg-accent text-background'
                                : 'bg-surface border border-border text-muted hover:text-foreground'
                            }`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Call history */}
                    {contactCalls.length > 0 && (
                      <div>
                        <p className="text-xs text-muted mb-2 font-medium">Anruf-Verlauf:</p>
                        <div className="flex flex-col gap-2">
                          {contactCalls.map((call) => (
                            <div key={call.id} className="rounded-xl border border-border bg-surface p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted">
                                  {new Date(call.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </span>
                                <div className="flex gap-2">
                                  {call.outcome.strongSignal && (
                                    <span className="text-xs text-accent font-semibold">⭐ Signal</span>
                                  )}
                                  <span className="text-xs text-muted">
                                    Problem: <strong className="text-foreground">{call.outcome.problemConfirmed}</strong>
                                  </span>
                                  <span className="text-xs text-muted">E: {call.outcome.energy}/5</span>
                                </div>
                              </div>
                              {call.outcome.priceAnchor && (
                                <p className="text-xs text-accent mt-1">💰 {call.outcome.priceAnchor}</p>
                              )}
                              {call.quotes && (
                                <p className="text-xs text-muted mt-1 italic">"{call.quotes}"</p>
                              )}
                              {call.notes && (
                                <p className="text-xs text-muted-2 mt-1">{call.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="self-start text-xs text-muted-2 hover:text-red-400 transition-colors"
                    >
                      Kontakt löschen
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
