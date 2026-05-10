const required = ['ANTHROPIC_API_KEY', 'RESEND_API_KEY'] as const

const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}\n` +
      `Copy .env.example to .env.local and fill in the values.`,
  )
}

export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL ?? 'info@robzen.com',
}
