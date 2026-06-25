'use client'

import { useState, useEffect } from 'react'
import type { Scripts, ScriptNode, ScriptOption, NodeType, Project } from './types'

interface Props {
  scripts: Scripts | null
  onScriptsUpdated: (s: Scripts) => void
}

export default function ScriptEditor({ scripts, onScriptsUpdated }: Props) {
  const [project, setProject] = useState<Project>('robzen')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<ScriptNode | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newNodeId, setNewNodeId] = useState('')
  const [showNewNode, setShowNewNode] = useState(false)

  const nodes = scripts?.[project]?.nodes ?? {}
  const nodeIds = Object.keys(nodes).sort()
  const selected = selectedId ? nodes[selectedId] : null

  useEffect(() => {
    if (selected && (!draft || draft.id !== selected.id)) {
      setDraft({ ...selected, options: selected.options.map((o) => ({ ...o })) })
    }
  }, [selected?.id]) // eslint-disable-line

  function select(id: string) {
    setSelectedId(id)
    const node = nodes[id]
    setDraft({ ...node, options: node.options.map((o) => ({ ...o })) })
    setSaved(false)
  }

  function updateDraft(field: keyof ScriptNode, value: string) {
    if (!draft) return
    setDraft({ ...draft, [field]: value })
  }

  function updateOption(idx: number, field: keyof ScriptOption, value: string) {
    if (!draft) return
    const opts = draft.options.map((o, i) => (i === idx ? { ...o, [field]: value } : o))
    setDraft({ ...draft, options: opts })
  }

  function addOption() {
    if (!draft) return
    setDraft({ ...draft, options: [...draft.options, { label: 'Neue Option', next: '' }] })
  }

  function removeOption(idx: number) {
    if (!draft) return
    setDraft({ ...draft, options: draft.options.filter((_, i) => i !== idx) })
  }

  async function saveNode() {
    if (!draft || !scripts) return
    setSaving(true)
    const updated: Scripts = {
      ...scripts,
      [project]: {
        ...scripts[project],
        nodes: { ...scripts[project].nodes, [draft.id]: draft },
      },
    }
    const res = await fetch('/api/callbase/scripts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSaving(false)
    if (res.ok) {
      onScriptsUpdated(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function deleteNode() {
    if (!selectedId || !scripts) return
    if (!confirm(`Knoten "${selectedId}" wirklich löschen?`)) return
    const newNodes = { ...scripts[project].nodes }
    delete newNodes[selectedId]
    const updated: Scripts = {
      ...scripts,
      [project]: { ...scripts[project], nodes: newNodes },
    }
    await fetch('/api/callbase/scripts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    onScriptsUpdated(updated)
    setSelectedId(null)
    setDraft(null)
  }

  async function addNewNode() {
    const id = newNodeId.trim()
    if (!id || !scripts || nodes[id]) return
    const node: ScriptNode = {
      id,
      phase: 'Neue Phase',
      title: 'Neuer Knoten',
      type: 'script',
      say: '',
      tip: '',
      signal: '',
      options: [],
    }
    const updated: Scripts = {
      ...scripts,
      [project]: {
        ...scripts[project],
        nodes: { ...scripts[project].nodes, [id]: node },
      },
    }
    await fetch('/api/callbase/scripts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    onScriptsUpdated(updated)
    setNewNodeId('')
    setShowNewNode(false)
    select(id)
  }

  if (!scripts) {
    return <div className="p-4 text-muted">Skripte werden geladen…</div>
  }

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-4 p-4 max-w-4xl mx-auto h-full">
      {/* Sidebar – node list */}
      <div className="md:w-56 flex flex-col gap-2 shrink-0">
        <div className="flex gap-2 mb-2">
          {(['robzen', 'zenmind'] as Project[]).map((p) => (
            <button
              key={p}
              onClick={() => { setProject(p); setSelectedId(null); setDraft(null) }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                project === p ? 'bg-accent text-background' : 'bg-surface-2 border border-border text-muted hover:text-foreground'
              }`}
            >
              {p === 'robzen' ? 'ROB' : 'ZEN'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1 max-h-[40vh] md:max-h-[70vh] overflow-y-auto">
          {nodeIds.map((id) => (
            <button
              key={id}
              onClick={() => select(id)}
              className={`text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedId === id
                  ? 'bg-accent text-background'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              <span className="font-mono text-xs">{id}</span>
              <span className="ml-2 truncate text-xs opacity-70">{nodes[id]?.title}</span>
            </button>
          ))}
        </div>

        {showNewNode ? (
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent font-mono"
              placeholder="node-id"
              value={newNodeId}
              onChange={(e) => setNewNodeId(e.target.value.replace(/\s/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && addNewNode()}
            />
            <button onClick={addNewNode} className="px-3 py-2 rounded-xl bg-accent text-background text-sm font-bold">+</button>
            <button onClick={() => setShowNewNode(false)} className="px-3 py-2 rounded-xl border border-border text-muted text-sm">✕</button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewNode(true)}
            className="mt-2 py-2 rounded-xl border border-border text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
          >
            + Neuer Knoten
          </button>
        )}
      </div>

      {/* Edit panel */}
      {draft ? (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-2 bg-surface-2 px-2 py-1 rounded">{draft.id}</span>
              <button onClick={deleteNode} className="text-xs text-muted-2 hover:text-red-400 transition-colors">Löschen</button>
            </div>

            <Field label="Titel" value={draft.title} onChange={(v) => updateDraft('title', v)} />
            <Field label="Phase" value={draft.phase} onChange={(v) => updateDraft('phase', v)} />

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Typ</label>
              <div className="flex gap-2">
                {(['choice', 'script', 'info'] as NodeType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => updateDraft('type', t)}
                    className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                      draft.type === t ? 'bg-accent text-background' : 'bg-surface-2 border border-border text-muted hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Textarea label="Was du sagst (say)" value={draft.say} onChange={(v) => updateDraft('say', v)} rows={4} />
            <Textarea label="Profi-Tipp (tip)" value={draft.tip} onChange={(v) => updateDraft('tip', v)} rows={2} />
            <Textarea label="Signal (grün)" value={draft.signal} onChange={(v) => updateDraft('signal', v)} rows={2} />

            {/* Options */}
            <div>
              <p className="text-xs font-medium text-muted mb-2">Antwort-Optionen</p>
              <div className="flex flex-col gap-2">
                {draft.options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      className="flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
                      placeholder="Label der Option"
                      value={opt.label}
                      onChange={(e) => updateOption(i, 'label', e.target.value)}
                    />
                    <span className="text-muted text-xs">→</span>
                    <input
                      className="w-24 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent font-mono"
                      placeholder="node-id"
                      value={opt.next}
                      onChange={(e) => updateOption(i, 'next', e.target.value)}
                    />
                    <button
                      onClick={() => removeOption(i)}
                      className="text-muted-2 hover:text-red-400 transition-colors px-2 py-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="self-start text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  + Option hinzufügen
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={saveNode}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-accent font-bold text-background hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {saving ? 'Speichern…' : saved ? '✓ Gespeichert' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted text-sm">← Knoten auswählen oder neu erstellen</p>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      <input
        className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      <textarea
        className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent resize-none"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
