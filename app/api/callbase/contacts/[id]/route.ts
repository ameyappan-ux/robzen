import { readContacts, writeContacts } from '@/lib/callbase-db'

interface Contact {
  id: string
  [key: string]: unknown
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const contacts = await readContacts<Contact>()
    const idx = contacts.findIndex((c) => c.id === id)
    if (idx === -1) return Response.json({ error: 'Nicht gefunden' }, { status: 404 })
    contacts[idx] = { ...contacts[idx], ...body }
    await writeContacts(contacts)
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
    const contacts = await readContacts<Contact>()
    const filtered = contacts.filter((c) => c.id !== id)
    await writeContacts(filtered)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
