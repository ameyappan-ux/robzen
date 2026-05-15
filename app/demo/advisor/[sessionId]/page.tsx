'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { getSession, updateSession } from '@/lib/demo-session'
import { KATEGORIE_QUESTIONS } from '@/data/demo-scenarios'
import { KATEGORIE_META } from '@/lib/demo-engine'
import type { Kategorie, AdvisorQuestion } from '@/data/demo-scenarios'

function QuestionStep({
  question,
  value,
  onChange,
}: {
  question: AdvisorQuestion
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-2 font-medium">{question.hint && <span className="italic">{question.hint}</span>}</p>
      {question.type === 'select' && question.options ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                value === opt
                  ? 'border-accent bg-accent-muted text-accent'
                  : 'border-border bg-background text-foreground hover:border-accent/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.hint ?? 'Ihre Antwort…'}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
        />
      )}
    </div>
  )
}

export default function AdvisorPage() {
  const params = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [kategorie, setKategorie] = useState<Kategorie | null>(null)
  const [problemText, setProblemText] = useState('')

  useEffect(() => {
    const session = getSession(params.sessionId)
    if (!session) { router.push('/demo'); return }
    setKategorie(session.kategorie ?? 'Hybrid')
    setProblemText(session.problemText ?? '')
    setAnswers(session.advisorAnswers ?? {})
  }, [params.sessionId, router])

  if (!kategorie) return null

  const questions: AdvisorQuestion[] = KATEGORIE_QUESTIONS[kategorie] ?? []
  const meta = KATEGORIE_META[kategorie]
  const currentQ = questions[step]
  const currentAnswer = currentQ ? (answers[currentQ.id] ?? '') : ''
  const progress = Math.round(((step) / questions.length) * 100)
  const isLast = step === questions.length - 1

  function setAnswer(v: string) {
    if (!currentQ) return
    setAnswers((prev) => ({ ...prev, [currentQ.id]: v }))
  }

  function next() {
    if (!currentAnswer.trim()) return
    updateSession(params.sessionId, { advisorAnswers: answers })
    if (isLast) {
      updateSession(params.sessionId, { advisorAnswers: { ...answers } })
      router.push(`/demo/loesungen/${params.sessionId}`)
    } else {
      setStep((s) => s + 1)
    }
  }

  function back() {
    if (step === 0) router.push('/demo')
    else setStep((s) => s - 1)
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      {/* Category badge */}
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-8 ${meta.bg} ${meta.color}`}>
        <span>{meta.icon}</span> {meta.label}
      </div>

      {/* Problem recap */}
      <div className="rounded-xl border border-border bg-surface px-5 py-4 mb-8 text-sm text-muted italic">
        „{problemText}"
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted-2 mb-2">
          <span>Frage {step + 1} von {questions.length}</span>
          <span>{progress}% abgeschlossen</span>
        </div>
        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Advisor message */}
      <div className="flex gap-3 mb-6">
        <div className="size-8 rounded-full bg-accent flex items-center justify-center text-background text-xs font-bold flex-shrink-0">R</div>
        <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-5 py-4 flex-1">
          <p className="text-sm text-foreground font-medium">{currentQ?.question}</p>
        </div>
      </div>

      {/* Answer */}
      {currentQ && (
        <div className="mb-8 ml-11">
          <QuestionStep question={currentQ} value={currentAnswer} onChange={setAnswer} />
        </div>
      )}

      {/* Already answered */}
      {step > 0 && (
        <div className="ml-11 mb-6 space-y-2">
          {questions.slice(0, step).map((q) => (
            <div key={q.id} className="flex items-start gap-2 text-xs text-muted-2">
              <CheckCircle size={12} className="text-accent flex-shrink-0 mt-0.5" />
              <span>{answers[q.id] ?? '–'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 ml-11">
        <button
          onClick={back}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:text-foreground hover:border-accent/40 transition-colors"
        >
          <ArrowLeft size={14} /> Zurück
        </button>
        <button
          onClick={next}
          disabled={!currentAnswer.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isLast ? 'Analyse starten' : 'Weiter'} <ArrowRight size={14} />
        </button>
      </div>
    </main>
  )
}
