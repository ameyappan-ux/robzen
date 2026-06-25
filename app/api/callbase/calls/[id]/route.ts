import fs from 'fs'
import path from 'path'

const CALLS_PATH = path.join(process.cwd(), 'data', 'calls.json')

function readCalls() {
  if (!fs.existsSync(CALLS_PATH)) return []
  return JSON.parse(fs.readFileSync(CALLS_PATH, 'utf8'))
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const calls = readCalls()
    const idx = calls.findIndex((c: { id: string }) => c.id === id)
    if (idx === -1) return Response.json({ error: 'Nicht gefunden' }, { status: 404 })
    calls[idx] = { ...calls[idx], ...body }
    fs.writeFileSync(CALLS_PATH, JSON.stringify(calls, null, 2), 'utf8')
    return Response.json(calls[idx])
  } catch {
    return Response.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}
