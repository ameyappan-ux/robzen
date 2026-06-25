import { randomUUID } from 'crypto'
import { readContacts, writeContacts } from '@/lib/callbase-db'

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

interface Contact {
  id: string
  project: string
  company: string
  contactName: string
  role: string
  phone: string
  email: string
  createdAt: string
  lastContactedAt: string
  status: string
  callIds: string[]
}

export async function GET() {
  try {
    const contacts = await readContacts<Contact>()
    return Response.json(contacts)
  } catch {
    return Response.json({ error: 'Fehler beim Laden' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const contacts = await readContacts<Contact>()

    const normPhone = normalizePhone(body.phone || '')
    const normCompany = (body.company || '').toLowerCase().trim()

    const dup = contacts.find((c) => {
      const phoneMatch = normPhone.length > 4 && normalizePhone(c.phone) === normPhone
      const companyMatch = normCompany.length > 1 && c.company.toLowerCase().trim() === normCompany
      return phoneMatch || companyMatch
    })

    if (dup) {
      return Response.json({ duplicate: true, existing: dup }, { status: 409 })
    }

    const now = new Date().toISOString()
    const contact: Contact = {
      id: randomUUID(),
      project: body.project || 'robzen',
      company: body.company || '',
      contactName: body.contactName || '',
      role: body.role || '',
      phone: body.phone || '',
      email: body.email || '',
      createdAt: now,
      lastContactedAt: now,
      status: 'offen',
      callIds: [],
    }

    contacts.push(contact)
    await writeContacts(contacts)
    return Response.json(contact, { status: 201 })
  } catch {
    return Response.json({ error: 'Fehler beim Erstellen' }, { status: 500 })
  }
}
