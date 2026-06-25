import { randomUUID } from 'crypto'
import { readCalls, writeCalls, readContacts, writeContacts } from '@/lib/callbase-db'

interface Contact {
  id: string
  callIds: string[]
  lastContactedAt: string
  status: string
  [key: string]: unknown
}

interface Call {
  id: string
  contactId: string
  project: string
  date: string
  path: string[]
  outcome: {
    problemConfirmed: string
    energy: number
    priceAnchor: string
    strongSignal: boolean
    referral: string
  }
  quotes: string
  notes: string
}

export async function GET() {
  try {
    const calls = await readCalls<Call>()
    return Response.json(calls)
  } catch {
    return Response.json({ error: 'Fehler beim Laden' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const calls = await readCalls<Call>()

    const call: Call = {
      id: randomUUID(),
      contactId: body.contactId || '',
      project: body.project || 'robzen',
      date: new Date().toISOString(),
      path: body.path || [],
      outcome: {
        problemConfirmed: body.outcome?.problemConfirmed || 'unklar',
        energy: body.outcome?.energy || 3,
        priceAnchor: body.outcome?.priceAnchor || '',
        strongSignal: body.outcome?.strongSignal || false,
        referral: body.outcome?.referral || '',
      },
      quotes: body.quotes || '',
      notes: body.notes || '',
    }

    calls.push(call)
    await writeCalls(calls)

    if (call.contactId) {
      const contacts = await readContacts<Contact>()
      const idx = contacts.findIndex((c) => c.id === call.contactId)
      if (idx !== -1) {
        contacts[idx] = {
          ...contacts[idx],
          callIds: [...(contacts[idx].callIds || []), call.id],
          lastContactedAt: call.date,
          status: 'kontaktiert',
        }
        await writeContacts(contacts)
      }
    }

    return Response.json(call, { status: 201 })
  } catch {
    return Response.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}
