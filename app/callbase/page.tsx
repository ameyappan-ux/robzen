'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Scripts, Contact, Call } from './types'
import CallMode from './CallMode'
import ContactsView from './ContactsView'
import Dashboard from './Dashboard'
import ScriptEditor from './ScriptEditor'

const TABS = ['Anruf', 'Kontakte', 'Auswertung', 'Skript'] as const
type Tab = typeof TABS[number]

export default function CallbasePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Anruf')
  const [scripts, setScripts] = useState<Scripts | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    try {
      const [sRes, cRes, callRes] = await Promise.all([
        fetch('/api/callbase/scripts'),
        fetch('/api/callbase/contacts'),
        fetch('/api/callbase/calls'),
      ])
      if (sRes.ok) setScripts(await sRes.json())
      if (cRes.ok) setContacts(await cRes.json())
      if (callRes.ok) setCalls(await callRes.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  async function refreshContacts() {
    const res = await fetch('/api/callbase/contacts')
    if (res.ok) setContacts(await res.json())
  }

  async function refreshCalls() {
    const [cRes, callRes] = await Promise.all([
      fetch('/api/callbase/contacts'),
      fetch('/api/callbase/calls'),
    ])
    if (cRes.ok) setContacts(await cRes.json())
    if (callRes.ok) setCalls(await callRes.json())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Wird geladen…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-accent text-lg">CALL</span>
            <span className="font-bold text-foreground text-lg">BASE</span>
            <span className="ml-1 text-xs text-muted border border-border rounded px-1.5 py-0.5">Beta</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted hidden sm:block">
              {contacts.length} Kontakte · {calls.length} Anrufe
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-t border-border max-w-4xl mx-auto w-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'Anruf' && (
          <CallMode
            scripts={scripts}
            contacts={contacts}
            onCallSaved={refreshCalls}
          />
        )}
        {activeTab === 'Kontakte' && (
          <ContactsView
            contacts={contacts}
            calls={calls}
            onRefresh={refreshContacts}
          />
        )}
        {activeTab === 'Auswertung' && (
          <Dashboard contacts={contacts} calls={calls} />
        )}
        {activeTab === 'Skript' && (
          <ScriptEditor
            scripts={scripts}
            onScriptsUpdated={(s) => setScripts(s)}
          />
        )}
      </main>
    </div>
  )
}
