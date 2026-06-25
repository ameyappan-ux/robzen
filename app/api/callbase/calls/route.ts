import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const CALLS_PATH = path.join(process.cwd(), 'data', 'calls.json')
const CONTACTS_PATH = path.join(process.cwd(), 'data', 'contacts.json')

function readCalls() {
  if (!fs.existsSync(CALLS_PATH)) {
    fs.writeFileSync(CALLS_PATH, '[]', 'utf8')
    return []
  }
  return JSON.parse(fs.readFileSync(CALLS_PATH, 'utf8'))
}

function readContacts() {
  if (!fs.existsSync(CONTACTS_PATH)) return []
  return JSON.parse(fs.readFileSync(CONTACTS_PATH, 'utf8'))
}

export async function GET() {
  try {
    const calls = readCalls()
    return Response.json(calls)
  } catch {
    return Response.json({ error: 'Fehler beim Laden' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const calls = readCalls()

    const call = {
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
    fs.writeFileSync(CALLS_PATH, JSON.stringify(calls, null, 2), 'utf8')

    // Update contact: add callId + update lastContactedAt + status
    if (call.contactId) {
      const contacts = readContacts()
      const idx = contacts.findIndex((c: { id: string }) => c.id === call.contactId)
      if (idx !== -1) {
        const contact = contacts[idx]
        contact.callIds = [...(contact.callIds || []), call.id]
        contact.lastContactedAt = call.date
        contact.status = 'kontaktiert'
        contacts[idx] = contact
        fs.writeFileSync(CONTACTS_PATH, JSON.stringify(contacts, null, 2), 'utf8')
      }
    }

    return Response.json(call, { status: 201 })
  } catch {
    return Response.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}
