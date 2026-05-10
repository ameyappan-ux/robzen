export type UseCaseCategory =
  | 'Cobot-Montage'
  | 'Cobot-Palettierung'
  | 'AMR-Transport'
  | 'Qualitätsprüfung'
  | 'Verpackung'
  | 'KI-Prozesssteuerung'

export interface UseCase {
  id: string
  title: string
  category: UseCaseCategory
  branche: string
  mitarbeiter: string
  ergebnis: string
  investition: string
  roi: string
  beschreibung: string
}

export const USE_CASES: UseCase[] = [
  {
    id: 'uc-01',
    title: 'Cobot-Montage Elektronikbaugruppen',
    category: 'Cobot-Montage',
    branche: 'Elektronikindustrie',
    mitarbeiter: '3 ersetzt, 5 umgeschult',
    ergebnis: '+35% Durchsatz, Fehlerquote −60%',
    investition: '85k–120k €',
    roi: '28 Monate',
    beschreibung:
      'Ein Zulieferer für die Automobilindustrie automatisierte die Bestückung von Steuergeräte-Gehäusen. Zwei UR10e-Cobots arbeiten nun im Zweischichtbetrieb neben den verbliebenen Mitarbeitenden.',
  },
  {
    id: 'uc-02',
    title: 'Palettierung Lebensmittelproduktion',
    category: 'Cobot-Palettierung',
    branche: 'Lebensmittelproduktion',
    mitarbeiter: '4 umgeschult',
    ergebnis: '600 Kartons/Schicht statt 380',
    investition: '60k–90k €',
    roi: '22 Monate',
    beschreibung:
      'Ein mittelständischer Backwarenhersteller palettiert jetzt automatisch. Der Cobot arbeitet dreischichtig durch — die Mitarbeitenden haben körperlich entlastende Tätigkeiten übernommen.',
  },
  {
    id: 'uc-03',
    title: 'AMR-Intralogistik Maschinenbau',
    category: 'AMR-Transport',
    branche: 'Maschinenbau',
    mitarbeiter: '2 umgeschult',
    ergebnis: 'Materialfluss +40%, 0 Wegeunfälle',
    investition: '120k–180k €',
    roi: '30 Monate',
    beschreibung:
      'Drei autonome Mobile Robots übernehmen den Materialtransport zwischen Lager und Fertigung auf 8.000 m² Hallenfläche. Gabelstapler werden nur noch für den Schwerlasttransport eingesetzt.',
  },
  {
    id: 'uc-04',
    title: 'KI-Qualitätsprüfung Kunststoffteile',
    category: 'Qualitätsprüfung',
    branche: 'Kunststofftechnik',
    mitarbeiter: '2 inspekteure umgeschult',
    ergebnis: 'Ausschuss −78%, 100% Prüfquote',
    investition: '45k–70k €',
    roi: '18 Monate',
    beschreibung:
      'Ein Kamerasystem mit KI-Auswertung prüft Spritzgussteile auf Oberflächenfehler, Maßhaltigkeit und Farbabweichungen — schneller und zuverlässiger als manuelle Sichtkontrolle.',
  },
  {
    id: 'uc-05',
    title: 'Automatische Verpackungsanlage',
    category: 'Verpackung',
    branche: 'Konsumgüter',
    mitarbeiter: '3 umgeschult',
    ergebnis: '2.400 Einheiten/h statt 800',
    investition: '100k–160k €',
    roi: '26 Monate',
    beschreibung:
      'Vollautomatische Kartonieranlage für Kosmetikartikel — inkl. automatischem Aufrichter, Befüller und Verschließer. Drei Schichten, sieben Tage pro Woche, ohne Personalaufstockung.',
  },
  {
    id: 'uc-06',
    title: 'KI-Prozesssteuerung CNC-Fertigung',
    category: 'KI-Prozesssteuerung',
    branche: 'Metallverarbeitung',
    mitarbeiter: '6 CNC-Operatoren umgeschult',
    ergebnis: 'Rüstzeit −45%, Maschinenlaufzeit +28%',
    investition: '80k–130k €',
    roi: '24 Monate',
    beschreibung:
      'KI-System optimiert automatisch die Reihenfolge und Parameter von CNC-Bearbeitungsaufträgen. Werkzeugverschleiß wird prädiktiv erkannt, Maschinenstillstände deutlich reduziert.',
  },
  {
    id: 'uc-07',
    title: 'Cobot-Schweißen Stahlbau',
    category: 'Cobot-Montage',
    branche: 'Stahlbau / Stahlverarbeitung',
    mitarbeiter: '2 Schweißer umgeschult',
    ergebnis: 'Schweißnahtqualität +90%, Durchsatz +55%',
    investition: '140k–200k €',
    roi: '32 Monate',
    beschreibung:
      'Cobot-Schweißzelle für Standardbaugruppen im Stahlbau. Der Cobot übernimmt repetitive Schweißnähte; qualifizierte Schweißer konzentrieren sich auf komplexe und sicherheitskritische Verbindungen.',
  },
  {
    id: 'uc-08',
    title: 'AMR-Kommissionierung Lager',
    category: 'AMR-Transport',
    branche: 'Logistik / Großhandel',
    mitarbeiter: '5 Kommissionierer umgeschult',
    ergebnis: 'Kommissionierzeit −55%, Fehlerquote −90%',
    investition: '200k–320k €',
    roi: '28 Monate',
    beschreibung:
      'Ware-zur-Person-Prinzip mit AMR-Flotte im Hochregallager. Die Mitarbeitenden stehen an festen Pick-Stationen — die Roboter bringen die Ware. Deutliche Reduktion der Laufwege.',
  },
]

export const CATEGORIES: UseCaseCategory[] = [
  'Cobot-Montage',
  'Cobot-Palettierung',
  'AMR-Transport',
  'Qualitätsprüfung',
  'Verpackung',
  'KI-Prozesssteuerung',
]
