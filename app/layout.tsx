import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ROBZEN — Ihr neutraler Automatisierungsberater',
  description:
    'ROBZEN hilft deutschen KMU, die richtigen Automatisierungslösungen zu finden — schnell, neutral, ohne Verkaufsdruck.',
  metadataBase: new URL('https://robzen.de'),
  openGraph: {
    title: 'ROBZEN — Ihr neutraler Automatisierungsberater',
    description: 'Kostenloser Automatisierungs-Check für mittelständische Unternehmen.',
    locale: 'de_DE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
