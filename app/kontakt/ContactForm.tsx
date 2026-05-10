'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'
import { sendContactEmail } from '@/actions/contact'
import type { ContactState } from '@/actions/contact'

const initialState: ContactState = { success: false }

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState)

  if (state.success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent-muted p-8 text-center">
        <CheckCircle size={32} className="text-accent mx-auto mb-3" />
        <h2 className="font-semibold text-lg mb-2">Nachricht gesendet</h2>
        <p className="text-sm text-muted">
          Wir haben Ihre Anfrage erhalten und melden uns innerhalb eines Werktages.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 flex gap-2 text-sm text-red-400">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ihr Name"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          E-Mail <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="ihre@email.de"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Nachricht <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihr Automatisierungsprojekt…"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="datenschutz"
          name="datenschutz"
          type="checkbox"
          required
          className="mt-0.5 size-4 rounded border-border accent-accent"
        />
        <label htmlFor="datenschutz" className="text-sm text-muted leading-relaxed">
          Ich habe die{' '}
          <Link href="/datenschutz" className="text-accent hover:text-accent-hover underline">
            Datenschutzerklärung
          </Link>{' '}
          gelesen und stimme der Verarbeitung meiner Daten zu. <span className="text-red-400">*</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {pending ? (
          <>
            <span className="animate-spin size-4 border-2 border-background/30 border-t-background rounded-full" />
            Wird gesendet…
          </>
        ) : (
          <>
            <Send size={15} />
            Nachricht senden
          </>
        )}
      </button>
    </form>
  )
}
