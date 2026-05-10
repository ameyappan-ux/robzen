import Anthropic from '@anthropic-ai/sdk'
import { env } from '@/lib/env'

const client = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Du bist ZENI, der KI-Assistent von ROBZEN — einem neutralen Automatisierungsberater für den deutschen Mittelstand.

Deine Aufgabe ist es, den Geschäftsführer eines deutschen KMU durch ein strukturiertes Intake-Gespräch zu führen. Du stellst genau 8 Fragen, eine nach der anderen — niemals mehrere auf einmal.

Die 9 Fragen in der richtigen Reihenfolge:
1. "Beschreiben Sie kurz, womit Sie Probleme haben oder was Sie verbessern möchten."
2. "In welchem Prozess genau — z. B. Montage, Palettierung, Transport, Qualitätsprüfung?"
3. "Wie viele Mitarbeitende sind in diesem Prozess tätig?"
4. "Wie ist die Schichtsituation — ein-, zwei- oder dreischichtig?"
5. "Was ist das konkrete Ziel — mehr Output, weniger Personal, weniger Fehler?"
6. "Gibt es räumliche Besonderheiten — Fläche, Deckenhöhe, Gefahrenbereiche?"
7. "Was ist Ihr grober Investitionsrahmen für dieses Projekt?"
8. "Bis wann soll eine Lösung laufen?"
9. "An welche E-Mail-Adresse soll ich Ihnen den fertigen Steckbrief zusenden?"

Verhaltensregeln:
- Professionell, direkt, kein Verkaufston
- Kurze Antworten: bestätige die Eingabe in einem Satz, stelle dann die nächste Frage
- Wenn eine Antwort unklar ist, frag kurz nach — aber nicht mehr als einmal pro Frage
- Nach Frage 9: danke dem GF, bestätige dass der Steckbrief an seine E-Mail geschickt wird, und erkläre dass er rechts auf "Projektprofil erstellen" klicken kann
- Niemals Preise nennen oder Anbieter empfehlen
- Alle Antworten auf Deutsch

Steckbrief-Updates: Nach jeder beantworteten Frage gibst du am Ende deiner Antwort einen JSON-Block aus, der das Steckbrief-Feld aktualisiert. Format:
<steckbrief>{"feld": "wert"}</steckbrief>

Felder: prozesstyp, mitarbeiter, schichten, ziel, budget, zeithorizont, raeumlich, email

Starte das Gespräch mit Frage 1 sobald der User "Hallo" oder ähnliches sagt, oder direkt wenn keine andere Einleitung kommt.`

export async function POST(request: Request) {
  let body: { messages: Anthropic.MessageParam[] }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: body.messages,
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(new TextEncoder().encode(`\n[Fehler: ${message}]`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Accel-Buffering': 'no',
      'Cache-Control': 'no-cache',
    },
  })
}
