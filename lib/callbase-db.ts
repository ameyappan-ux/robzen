import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function isVercel(): boolean {
  return !!process.env.KV_REST_API_URL
}

async function kvGet<T>(key: string): Promise<T | null> {
  const { kv } = await import('@vercel/kv')
  return kv.get<T>(key)
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(key, value)
}

function fsRead<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf8')
    return fallback
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function fsWrite(filename: string, value: unknown): void {
  const filePath = path.join(DATA_DIR, filename)
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8')
}

export async function readContacts<T>(): Promise<T[]> {
  if (isVercel()) return (await kvGet<T[]>('callbase:contacts')) ?? []
  return fsRead<T[]>('contacts.json', [])
}

export async function writeContacts<T>(data: T[]): Promise<void> {
  if (isVercel()) { await kvSet('callbase:contacts', data); return }
  fsWrite('contacts.json', data)
}

export async function readCalls<T>(): Promise<T[]> {
  if (isVercel()) return (await kvGet<T[]>('callbase:calls')) ?? []
  return fsRead<T[]>('calls.json', [])
}

export async function writeCalls<T>(data: T[]): Promise<void> {
  if (isVercel()) { await kvSet('callbase:calls', data); return }
  fsWrite('calls.json', data)
}

export async function readScripts<T>(): Promise<T | null> {
  if (isVercel()) {
    const kv = await kvGet<T>('callbase:scripts')
    if (kv) return kv
  }
  return fsRead<T | null>('scripts.json', null)
}

export async function writeScripts<T>(data: T): Promise<void> {
  if (isVercel()) { await kvSet('callbase:scripts', data); return }
  fsWrite('scripts.json', data)
}
