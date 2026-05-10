'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Send, Loader2, FileText, MessageSquare } from 'lucide-react'
import { encodeProfile, decodeProfile } from '@/lib/project-profile'
import type { ProjectProfile, Schichtmodell, BudgetRange, AutomationLevel, FundingEligibility } from '@/lib/project-profile'
import { automatisierungsScore, fundingEligibility } from '@/lib/scoring'
import { sendSteckbriefEmail } from '@/actions/steckbrief-email'
import { v4 as uuidv4 } from 'uuid'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Steckbrief {
  prozesstyp?: string
  mitarbeiter?: string
  schichten?: string
  ziel?: string
  budget?: string
  zeithorizont?: string
  raeumlich?: string
  email?: string
}

function parseSteckbrief(text: string): Steckbrief | null {
  const match = text.match(/<steckbrief>([\s\S]*?)<\/steckbrief>/)
  if (!match) return null
  try {
    return JSON.parse(match[1]) as Steckbrief
  } catch {
    return null
  }
}

function stripSteckbrief(text: string): string {
  return text.replace(/<steckbrief>[\s\S]*?<\/steckbrief>/g, '').trim()
}

const STECKBRIEF_FIELDS: { key: keyof Steckbrief; label: string }[] = [
  { key: 'prozesstyp', label: 'Prozesstyp' },
  { key: 'mitarbeiter', label: 'Mitarbeitende' },
  { key: 'schichten', label: 'Schichtmodell' },
  { key: 'ziel', label: 'Ziel' },
  { key: 'budget', label: 'Investitionsrahmen' },
  { key: 'zeithorizont', label: 'Zeithorizont' },
  { key: 'raeumlich', label: 'Räumliche Constraints' },
  { key: 'email', label: 'E-Mail für Steckbrief' },
]

function countFilled(s: Steckbrief) {
  return Object.values(s).filter(Boolean).length
}

function ChatContent() {
  const router = useRouter()
  const params = useSearchParams()
  const initialProfile = decodeProfile(params.get('p'))

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [steckbrief, setSteckbrief] = useState<Steckbrief>({})
  const [activeTab, setActiveTab] = useState<'chat' | 'steckbrief'>('chat')
  const [sessionId] = useState(() => uuidv4())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialized = useRef(false)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Seed initial greeting to trigger the bot's first question
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    sendMessage('Hallo, ich möchte ein Automatisierungsprojekt besprechen.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function sendMessage(text: string) {
    const userMsg: Message = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages([...nextMessages, assistantMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })

        const parsed = parseSteckbrief(accumulated)
        if (parsed) {
          setSteckbrief((prev) => ({ ...prev, ...parsed }))
        }

        const display = stripSteckbrief(accumulated)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: display }
          return updated
        })
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        }
        return updated
      })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !loading) sendMessage(input.trim())
    }
  }

  async function handleCreateProfile() {
    const level = automatisierungsScore({
      budget: (steckbrief.budget as BudgetRange) ?? initialProfile?.budget ?? 'unklar',
      ziel: steckbrief.ziel ?? initialProfile?.ziel ?? '',
      mitarbeiter: steckbrief.mitarbeiter ?? initialProfile?.mitarbeiter ?? '0',
      zeithorizont: steckbrief.zeithorizont ?? initialProfile?.zeithorizont ?? '',
      prozess: steckbrief.prozesstyp ?? initialProfile?.prozess ?? '',
    }) as AutomationLevel

    const funding = fundingEligibility({
      budget: (steckbrief.budget as BudgetRange) ?? initialProfile?.budget ?? 'unklar',
      ziel: steckbrief.ziel ?? initialProfile?.ziel ?? '',
      mitarbeiter: steckbrief.mitarbeiter ?? initialProfile?.mitarbeiter ?? '0',
      zeithorizont: steckbrief.zeithorizont ?? initialProfile?.zeithorizont ?? '',
      prozess: steckbrief.prozesstyp ?? initialProfile?.prozess ?? '',
    }) as FundingEligibility

    const profile: ProjectProfile = {
      id: sessionId,
      prozess: steckbrief.prozesstyp ?? initialProfile?.prozess ?? '',
      mitarbeiter: steckbrief.mitarbeiter ?? initialProfile?.mitarbeiter ?? '',
      schichten: (steckbrief.schichten as Schichtmodell) ?? initialProfile?.schichten ?? '1-Schicht',
      ziel: steckbrief.ziel ?? initialProfile?.ziel ?? '',
      budget: (steckbrief.budget as BudgetRange) ?? initialProfile?.budget ?? 'unklar',
      zeithorizont: steckbrief.zeithorizont ?? initialProfile?.zeithorizont ?? '',
      raeumlich: steckbrief.raeumlich ?? '',
      automationLevel: level,
      fundingEligibility: funding,
      createdAt: new Date().toISOString(),
    }

    if (steckbrief.email) {
      sendSteckbriefEmail({ ...steckbrief, automationLevel: level, fundingEligibility: funding }).catch(() => {})
    }

    const encoded = encodeProfile(profile)
    router.push(`/projekt/${sessionId}?p=${encoded}`)
  }

  const filled = countFilled(steckbrief)
  const canCreate = filled >= 5

  const SteckbriefPanel = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">Projekt-Steckbrief</h2>
        <p className="text-xs text-muted mt-0.5">Wird automatisch befüllt während Sie schreiben</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {STECKBRIEF_FIELDS.map((f) => (
          <div key={f.key} className="text-sm">
            <dt className="text-xs text-muted-2 mb-0.5">{f.label}</dt>
            <dd className={steckbrief[f.key] ? 'text-foreground' : 'text-muted-2 italic'}>
              {steckbrief[f.key] ?? 'Noch nicht erfasst'}
            </dd>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-border">
        <div className="text-xs text-muted mb-3">{filled} / {STECKBRIEF_FIELDS.length} Felder erfasst</div>
        <button
          onClick={handleCreateProfile}
          disabled={!canCreate}
          className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <FileText size={15} />
          Projektprofil erstellen
        </button>
        {!canCreate && (
          <p className="text-xs text-muted-2 text-center mt-2">
            Noch {5 - filled} Felder benötigt
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Desktop: split screen */}
      <div className="hidden md:flex flex-1 flex-col border-r border-border">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.filter((m) => !(m.role === 'user' && m.content === 'Hallo, ich möchte ein Automatisierungsprojekt besprechen.')).map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-accent text-background rounded-br-sm'
                    : 'bg-surface border border-border text-foreground rounded-bl-sm'
                }`}
              >
                {msg.content || (loading && msg.role === 'assistant' ? (
                  <Loader2 size={14} className="animate-spin text-muted" />
                ) : null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Schreiben Sie hier…"
              className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50 transition-colors max-h-36 overflow-y-auto"
            />
            <button
              onClick={() => { if (input.trim() && !loading) sendMessage(input.trim()) }}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 size-11 rounded-xl bg-accent flex items-center justify-center text-background hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Senden"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <p className="text-xs text-muted-2 mt-2">Enter zum Senden · Shift+Enter für Zeilenumbruch</p>
        </div>
      </div>

      {/* Desktop: steckbrief panel */}
      <div className="hidden md:flex w-80 flex-col bg-surface">
        {SteckbriefPanel}
      </div>

      {/* Mobile: tab switcher */}
      <div className="flex md:hidden flex-1 flex-col">
        {/* Tab header */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat' ? 'text-accent border-b-2 border-accent' : 'text-muted'
            }`}
          >
            <MessageSquare size={15} /> Chat
          </button>
          <button
            onClick={() => setActiveTab('steckbrief')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'steckbrief' ? 'text-accent border-b-2 border-accent' : 'text-muted'
            }`}
          >
            <FileText size={15} /> Steckbrief {filled > 0 && <span className="size-4 rounded-full bg-accent text-background text-[10px] flex items-center justify-center">{filled}</span>}
          </button>
        </div>

        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.filter((m) => !(m.role === 'user' && m.content === 'Hallo, ich möchte ein Automatisierungsprojekt besprechen.')).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-accent text-background rounded-br-sm'
                        : 'bg-surface border border-border text-foreground rounded-bl-sm'
                    }`}
                  >
                    {msg.content || (loading && msg.role === 'assistant' ? <Loader2 size={14} className="animate-spin text-muted" /> : null)}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-border px-4 py-3">
              <div className="flex gap-2 items-end">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder="Schreiben Sie hier…"
                  className="flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={() => { if (input.trim() && !loading) sendMessage(input.trim()) }}
                  disabled={!input.trim() || loading}
                  className="flex-shrink-0 size-10 rounded-xl bg-accent flex items-center justify-center text-background hover:bg-accent-hover disabled:opacity-40 transition-all"
                  aria-label="Senden"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-surface">
            {SteckbriefPanel}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatInterface() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-muted">Wird geladen…</div>}>
      <ChatContent />
    </Suspense>
  )
}
