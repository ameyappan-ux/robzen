'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ContactState {
  success: boolean
  error?: string
}

export async function sendContactEmail(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()
  const datenschutz = formData.get('datenschutz')

  if (!name || !email || !message) {
    return { success: false, error: 'Bitte alle Pflichtfelder ausfüllen.' }
  }

  if (!datenschutz) {
    return { success: false, error: 'Bitte stimmen Sie der Datenschutzerklärung zu.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }
  }

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'E-Mail-Versand nicht konfiguriert.' }
  }

  const toEmail = process.env.CONTACT_EMAIL ?? 'kontakt@robzen.de'

  function escHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  const safeName = escHtml(name)
  const safeEmail = escHtml(email)
  const safeMessage = escHtml(message).replace(/\n/g, '<br>')

  const { error } = await resend.emails.send({
    from: 'ROBZEN Kontakt <onboarding@resend.dev>',
    to: [toEmail],
    replyTo: email,
    subject: `Neue Anfrage von ${name} — ROBZEN`,
    text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}\n\n---\nGesendet über robzen.de`,
    html: `<p><strong>Name:</strong> ${safeName}<br><strong>E-Mail:</strong> ${safeEmail}</p><p><strong>Nachricht:</strong></p><p>${safeMessage}</p><hr><p style="color:#888;font-size:12px">Gesendet über robzen.de</p>`,
  })

  if (error) {
    return { success: false, error: 'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.' }
  }

  return { success: true }
}
