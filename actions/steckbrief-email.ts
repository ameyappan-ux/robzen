'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SteckbriefData {
  prozesstyp?: string
  mitarbeiter?: string
  schichten?: string
  ziel?: string
  budget?: string
  zeithorizont?: string
  raeumlich?: string
  email?: string
  automationLevel?: string
  fundingEligibility?: string
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function row(label: string, value: string | undefined) {
  if (!value) return ''
  return `<tr><td style="padding:6px 0;color:#888;font-size:13px;width:160px">${escHtml(label)}</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a">${escHtml(value)}</td></tr>`
}

export async function sendSteckbriefEmail(data: SteckbriefData): Promise<{ ok: boolean }> {
  if (!data.email || !process.env.RESEND_API_KEY) return { ok: false }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) return { ok: false }

  const levelLabel = data.automationLevel
    ? `${data.automationLevel} Automatisierungspotenzial`
    : 'Wird ausgewertet'

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#f5f5f5;padding:32px 0;margin:0">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0">
  <div style="background:#0a0a0a;padding:24px 32px">
    <p style="color:#00c896;font-weight:800;font-size:22px;margin:0">ROBZEN</p>
    <p style="color:#737373;font-size:13px;margin:4px 0 0">Ihr Projekt-Steckbrief</p>
  </div>
  <div style="padding:32px">
    <p style="font-size:15px;color:#1a1a1a;margin:0 0 24px">
      Hier ist der Steckbrief aus Ihrem Gespräch mit ZENI, dem KI-Assistenten von ROBZEN.
    </p>
    <div style="background:#f0fdf8;border:1px solid #a7f3d0;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#065f46;font-weight:600">${escHtml(levelLabel)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row('Prozesstyp', data.prozesstyp)}
      ${row('Mitarbeitende', data.mitarbeiter)}
      ${row('Schichtmodell', data.schichten)}
      ${row('Ziel', data.ziel)}
      ${row('Investitionsrahmen', data.budget)}
      ${row('Zeithorizont', data.zeithorizont)}
      ${row('Räumliche Constraints', data.raeumlich)}
      ${row('Förderung', data.fundingEligibility)}
    </table>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
      <p style="font-size:13px;color:#555;margin:0 0 16px">Möchten Sie den nächsten Schritt gehen?</p>
      <a href="https://robzen.de/kontakt" style="display:inline-block;background:#00c896;color:#0a0a0a;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none">
        Beratung anfragen
      </a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #e0e0e0">
    <p style="font-size:11px;color:#999;margin:0">
      Diese E-Mail wurde automatisch generiert. Alle Angaben sind Demo-Daten und unverbindliche Orientierungswerte.
      Gesendet über robzen.de
    </p>
  </div>
</div>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'ROBZEN <onboarding@resend.dev>',
      to: [data.email],
      subject: 'Ihr ROBZEN Projekt-Steckbrief',
      html,
      text: `Ihr ROBZEN Projekt-Steckbrief\n\nPotenzial: ${levelLabel}\nProzesstyp: ${data.prozesstyp ?? '—'}\nMitarbeitende: ${data.mitarbeiter ?? '—'}\nZiel: ${data.ziel ?? '—'}\nInvestitionsrahmen: ${data.budget ?? '—'}\nZeithorizont: ${data.zeithorizont ?? '—'}\n\nNächster Schritt: https://robzen.de/kontakt`,
    })
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
