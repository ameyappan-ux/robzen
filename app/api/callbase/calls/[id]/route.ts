import { readCalls, writeCalls } from '@/lib/callbase-db'

interface Call {
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
    const calls = await readCalls<Call>()
    const idx = calls.findIndex((c) => c.id === id)
    if (idx === -1) return Response.json({ error: 'Nicht gefunden' }, { status: 404 })
    calls[idx] = { ...calls[idx], ...body }
    await writeCalls(calls)
    return Response.json(calls[idx])
  } catch {
    return Response.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}
