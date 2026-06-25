import fs from 'fs'
import path from 'path'

const CONTACTS_PATH = path.join(process.cwd(), 'data', 'contacts.json')

function readContacts() {
  if (!fs.existsSync(CONTACTS_PATH)) return []
  return JSON.parse(fs.readFileSync(CONTACTS_PATH, 'utf8'))
}

function writeContacts(contacts: unknown[]) {
  fs.writeFileSync(CONTACTS_PATH, JSON.stringify(contacts, null, 2), 'utf8')
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const contacts = readContacts()
    const idx = contacts.findIndex((c: { id: string }) => c.id === id)
    if (idx === -1) return Response.json({ error: 'Nicht gefunden' }, { status: 404 })
    contacts[idx] = { ...contacts[idx], ...body }
    writeContacts(contacts)
    return Response.json(contacts[idx])
  } catch {
    return Response.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contacts = readContacts()
    const filtered = contacts.filter((c: { id: string }) => c.id !== id)
    writeContacts(filtered)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
