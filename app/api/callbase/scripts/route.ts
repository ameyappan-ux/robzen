import fs from 'fs'
import path from 'path'

const SCRIPTS_PATH = path.join(process.cwd(), 'data', 'scripts.json')

function readScripts() {
  if (!fs.existsSync(SCRIPTS_PATH)) {
    return {}
  }
  return JSON.parse(fs.readFileSync(SCRIPTS_PATH, 'utf8'))
}

export async function GET() {
  try {
    const scripts = readScripts()
    return Response.json(scripts)
  } catch {
    return Response.json({ error: 'Fehler beim Laden der Skripte' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    fs.writeFileSync(SCRIPTS_PATH, JSON.stringify(body, null, 2), 'utf8')
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}
