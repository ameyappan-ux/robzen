export type Kategorie = 'Robotik' | 'AI-Agent' | 'Workflow' | 'Dokument' | 'Vision' | 'Hybrid'

export interface AdvisorQuestion {
  id: string
  question: string
  hint?: string
  options?: string[]
  type: 'select' | 'text'
}

export interface DemoScenario {
  id: string
  title: string
  subtitle: string
  kategorie: Kategorie
  problemText: string
  description: string
  advisorAnswers: Record<string, string>
  tags: string[]
}

export const KATEGORIE_QUESTIONS: Record<Kategorie, AdvisorQuestion[]> = {
  Robotik: [
    { id: 'werkstuck', question: 'Was soll bewegt, sortiert oder bearbeitet werden?', hint: 'Z. B. Kartons, Metallteile, Flaschen, Platinen', type: 'text' },
    { id: 'gewicht', question: 'Wie schwer ist ein typisches Werkstück?', options: ['< 1 kg', '1–5 kg', '5–20 kg', '20–80 kg', '> 80 kg'], type: 'select' },
    { id: 'taktrate', question: 'Wie viele Einheiten pro Stunde werden aktuell verarbeitet?', hint: 'Z. B. 200 Kartons/h', type: 'text' },
    { id: 'flaeche', question: 'Wie viel Fläche steht für die Anlage zur Verfügung?', options: ['< 10 m²', '10–25 m²', '25–50 m²', '> 50 m²'], type: 'select' },
    { id: 'schichten', question: 'Wie viele Schichten pro Tag?', options: ['1 Schicht (8h)', '2 Schichten (16h)', '3 Schichten (24h)', 'Wechselschicht'], type: 'select' },
    { id: 'bestand', question: 'Gibt es bestehende Förderbänder oder Maschinen die integriert werden müssen?', options: ['Nein', 'Ja, einfach integrierbar', 'Ja, komplex'], type: 'select' },
    { id: 'budget', question: 'Welcher Investitionsrahmen ist vorgesehen?', options: ['< 50.000 €', '50.000–150.000 €', '150.000–500.000 €', '> 500.000 €', 'Noch offen'], type: 'select' },
  ],
  'AI-Agent': [
    { id: 'aufgabe', question: 'Welche Aufgabe wird aktuell manuell erledigt?', hint: 'Z. B. E-Mails beantworten, Anfragen bearbeiten, Berichte erstellen', type: 'text' },
    { id: 'systeme', question: 'Welche Systeme sind beteiligt?', hint: 'Z. B. E-Mail, CRM, ERP, Excel, Telefon, Website', type: 'text' },
    { id: 'volumen', question: 'Wie viele Vorgänge werden pro Monat bearbeitet?', options: ['< 100', '100–500', '500–2.000', '> 2.000'], type: 'select' },
    { id: 'standardisierung', question: 'Wie standardisiert ist der Prozess?', options: ['Sehr standardisiert (> 80% gleich)', 'Teilweise standardisiert', 'Stark individuell'], type: 'select' },
    { id: 'approval', question: 'Muss ein Mensch Ergebnisse prüfen und freigeben?', options: ['Immer', 'Nur bei Ausnahmen', 'Nein'], type: 'select' },
    { id: 'datenschutz', question: 'Gibt es besondere Datenschutz- oder Compliance-Anforderungen?', options: ['Nein', 'Standard (DSGVO)', 'Hoch (Gesundheit, Finanzen, Recht)'], type: 'select' },
    { id: 'budget', question: 'Welcher Investitionsrahmen ist vorgesehen?', options: ['< 15.000 €', '15.000–50.000 €', '50.000–150.000 €', '> 150.000 €', 'Noch offen'], type: 'select' },
  ],
  Workflow: [
    { id: 'prozess', question: 'Welcher Workflow soll automatisiert werden?', hint: 'Z. B. Rechnungsfreigabe, Urlaubsantrag, Bestellprozess', type: 'text' },
    { id: 'systeme', question: 'Welche Systeme sind beteiligt?', hint: 'Z. B. E-Mail, SharePoint, ERP, Excel', type: 'text' },
    { id: 'volumen', question: 'Wie viele Vorgänge pro Monat?', options: ['< 50', '50–200', '200–1.000', '> 1.000'], type: 'select' },
    { id: 'komplexitaet', question: 'Wie komplex sind die Entscheidungsregeln?', options: ['Einfach (klare Regeln)', 'Mittel', 'Komplex (viele Ausnahmen)'], type: 'select' },
    { id: 'approval', question: 'Gibt es Freigabeschritte durch Menschen?', options: ['Ja, immer', 'Nur bei Ausnahmen', 'Nein'], type: 'select' },
    { id: 'budget', question: 'Investitionsrahmen?', options: ['< 10.000 €', '10.000–30.000 €', '30.000–80.000 €', '> 80.000 €'], type: 'select' },
  ],
  Dokument: [
    { id: 'dokumenttyp', question: 'Welche Art von Dokumenten sollen verarbeitet werden?', options: ['Rechnungen', 'Lieferscheine', 'Angebote', 'Verträge', 'Formulare', 'Sonstiges'], type: 'select' },
    { id: 'quelle', question: 'Woher kommen die Dokumente?', options: ['E-Mail-Anhänge', 'Scanner', 'Kundenportal', 'FTP / Cloud', 'Gemischt'], type: 'select' },
    { id: 'zielsystem', question: 'In welches System sollen die Daten übertragen werden?', hint: 'Z. B. SAP, DATEV, Excel, eigenes System', type: 'text' },
    { id: 'volumen', question: 'Wie viele Dokumente werden pro Monat verarbeitet?', options: ['< 100', '100–500', '500–2.000', '> 2.000'], type: 'select' },
    { id: 'struktur', question: 'Wie einheitlich sind die Dokumente?', options: ['Sehr einheitlich (eigene Vorlagen)', 'Gemischt (viele Lieferanten)', 'Sehr unterschiedlich'], type: 'select' },
    { id: 'freigabe', question: 'Muss jemand die extrahierten Daten prüfen?', options: ['Immer', 'Stichproben', 'Nein'], type: 'select' },
    { id: 'budget', question: 'Investitionsrahmen?', options: ['< 10.000 €', '10.000–30.000 €', '30.000–80.000 €', '> 80.000 €'], type: 'select' },
  ],
  Vision: [
    { id: 'pruefung', question: 'Was soll optisch geprüft werden?', hint: 'Z. B. Oberfläche, Maße, Vollständigkeit, Beschriftung', type: 'text' },
    { id: 'produkttyp', question: 'Was für ein Produkt wird geprüft?', hint: 'Z. B. Metallteile, Platinen, Verpackungen, Lebensmittel', type: 'text' },
    { id: 'fehlerarten', question: 'Welche Fehler sollen erkannt werden?', hint: 'Z. B. Risse, Kratzer, Falschteile, fehlende Komponenten', type: 'text' },
    { id: 'taktrate', question: 'Wie schnell läuft die Linie?', options: ['< 10 Teile/min', '10–30 Teile/min', '30–100 Teile/min', '> 100 Teile/min'], type: 'select' },
    { id: 'umgebung', question: 'Wie ist die Prüfumgebung?', options: ['Kontrolliert (feste Beleuchtung)', 'Variabel', 'Schwierig (Staub, Erschütterungen)'], type: 'select' },
    { id: 'budget', question: 'Investitionsrahmen?', options: ['< 30.000 €', '30.000–100.000 €', '100.000–300.000 €', '> 300.000 €'], type: 'select' },
  ],
  Hybrid: [
    { id: 'prozess', question: 'Was ist der übergeordnete Prozess, den Sie verbessern möchten?', type: 'text' },
    { id: 'physisch', question: 'Gibt es physische Arbeitsschritte (Bewegen, Prüfen, Sortieren)?', options: ['Ja, hauptsächlich', 'Ja, teilweise', 'Nein'], type: 'select' },
    { id: 'digital', question: 'Gibt es digitale Prozessschritte (Daten, Entscheidungen, Kommunikation)?', options: ['Ja, hauptsächlich', 'Ja, teilweise', 'Nein'], type: 'select' },
    { id: 'volumen', question: 'Welches Volumen hat der Prozess?', hint: 'Z. B. 500 Teile/Tag, 200 Vorgänge/Monat', type: 'text' },
    { id: 'budget', question: 'Gesamtinvestitionsrahmen?', options: ['< 50.000 €', '50.000–200.000 €', '200.000–500.000 €', '> 500.000 €'], type: 'select' },
  ],
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'palettierung',
    title: 'Kartons automatisch palettieren',
    subtitle: 'Robotik · Fertigung & Logistik',
    kategorie: 'Robotik',
    problemText: 'Wir möchten Kartons automatisch auf Paletten stapeln. Aktuell machen das 2 Mitarbeitende manuell in 2 Schichten täglich.',
    description: 'Cobot- oder Industrieroboter-Lösungen für Palettieraufgaben — eine der häufigsten Automatisierungsanwendungen.',
    advisorAnswers: {
      werkstuck: 'Kartons, ca. 40×30×25 cm',
      gewicht: '5–20 kg',
      taktrate: '180 Kartons/h pro Linie',
      flaeche: '25–50 m²',
      schichten: '2 Schichten (16h)',
      bestand: 'Ja, einfach integrierbar',
      budget: '50.000–150.000 €',
    },
    tags: ['Palettierung', 'Cobot', 'Roboterarm', 'Logistik'],
  },
  {
    id: 'kundenservice',
    title: 'Kundenservice mit AI automatisieren',
    subtitle: 'AI-Agent · Service & Kommunikation',
    kategorie: 'AI-Agent',
    problemText: 'Unser Kundenservice beantwortet täglich dieselben 20 Fragen. Das kostet 2 Vollzeitkräfte und die Reaktionszeit ist zu langsam.',
    description: 'AI-Agenten beantworten standardisierte Anfragen 24/7 — und eskalieren komplexe Fälle an Menschen.',
    advisorAnswers: {
      aufgabe: 'Kundenanfragen beantworten: Lieferstatus, Produktfragen, Reklamationen, Öffnungszeiten',
      systeme: 'E-Mail, Telefon, Website-Kontaktformular, CRM (Salesforce)',
      volumen: '500–2.000',
      standardisierung: 'Sehr standardisiert (> 80% gleich)',
      approval: 'Nur bei Ausnahmen',
      datenschutz: 'Standard (DSGVO)',
      budget: '15.000–50.000 €',
    },
    tags: ['Chatbot', 'E-Mail-Agent', 'Kundenservice', 'NLP'],
  },
  {
    id: 'pdf-erp',
    title: 'PDF-Dokumente ins ERP übertragen',
    subtitle: 'Dokument-Automatisierung · Buchhaltung',
    kategorie: 'Dokument',
    problemText: 'Unsere Mitarbeitenden übertragen täglich Daten aus Lieferscheinen und Rechnungen manuell ins ERP. Das kostet 3 Stunden täglich.',
    description: 'OCR und AI extrahieren Daten automatisch aus Dokumenten und übertragen sie in ERP-Systeme.',
    advisorAnswers: {
      dokumenttyp: 'Rechnungen',
      quelle: 'E-Mail-Anhänge',
      zielsystem: 'SAP Business One',
      volumen: '100–500',
      struktur: 'Gemischt (viele Lieferanten)',
      freigabe: 'Stichproben',
      budget: '10.000–30.000 €',
    },
    tags: ['OCR', 'Dokumentenextraktion', 'ERP-Integration', 'Buchhaltung'],
  },
  {
    id: 'qualitaetspruefung',
    title: 'Produktionsfehler mit Computer Vision erkennen',
    subtitle: 'Vision + AI · Qualitätssicherung',
    kategorie: 'Vision',
    problemText: 'Wir möchten Produktionsfehler früher erkennen. Aktuell prüft ein Mitarbeitender 1.000 Teile/Schicht visuell — mit 2% Fehlerrate.',
    description: 'KI-gestützte Bildverarbeitung erkennt Defekte schneller und zuverlässiger als visuelle Sichtkontrolle.',
    advisorAnswers: {
      pruefung: 'Oberflächenfehler, Kratzer, Risse, Formabweichungen',
      produkttyp: 'Kunststoff-Formteile für Automobilindustrie',
      fehlerarten: 'Kratzer, Einschlüsse, Formfehler, Farbunebenheiten',
      taktrate: '10–30 Teile/min',
      umgebung: 'Kontrolliert (feste Beleuchtung)',
      budget: '30.000–100.000 €',
    },
    tags: ['Computer Vision', 'Deep Learning', 'Inline-Prüfung', 'Qualitätssicherung'],
  },
]

export const KATEGORIE_KEYWORDS: Record<Kategorie, string[]> = {
  Robotik: ['palettier', 'roboter', 'cobot', 'förder', 'stapel', 'transport', 'heben', 'montage', 'bestück', 'sortier', 'pick', 'greifen', 'verpack'],
  'AI-Agent': ['kundenservice', 'anfragen', 'e-mail', 'chat', 'support', 'antwort', 'kommunikation', 'assistent', 'wissen', 'fragen', 'crm'],
  Workflow: ['genehmig', 'freigabe', 'workflow', 'prozess', 'bestellung', 'urlaub', 'antrag', 'automatisch melden', 'übertrag', 'benachrichtig'],
  Dokument: ['pdf', 'rechnung', 'lieferschein', 'dokument', 'excel', 'eingabe', 'daten aus', 'übertrag', 'erp', 'datev', 'buchhalt', 'formular'],
  Vision: ['sichtprüf', 'qualität', 'fehler erkenn', 'kamera', 'vision', 'inspektion', 'oberfläche', 'kratzer', 'mängel', 'kontrolle'],
  Hybrid: ['komplex', 'kombination', 'mehrere schritte', 'physisch und digital', 'end-to-end'],
}
