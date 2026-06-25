import { readScripts, writeScripts } from '@/lib/callbase-db'

export async function GET() {
  try {
    const scripts = await readScripts()
    return Response.json(scripts ?? {})
  } catch {
    return Response.json({ error: 'Fehler beim Laden der Skripte' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    await writeScripts(body)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}
