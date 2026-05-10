import type { Metadata } from 'next'
import ChatInterface from './ChatInterface'

export const metadata: Metadata = {
  title: 'Projekt starten — ROBZEN',
  description: 'Beschreiben Sie Ihr Automatisierungsprojekt. Unser KI-Assistent erstellt ein strukturiertes Projektprofil.',
}

export default function ProjektStartenPage() {
  return <ChatInterface />
}
