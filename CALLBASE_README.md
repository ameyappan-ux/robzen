# CALLBASE – Validierungs-Tool für Kaltakquise

## Starten

```bash
npm run dev
```

Dann im Browser öffnen: **http://localhost:3000/callbase**

## Was das Tool macht

CALLBASE führt dich während eines Kaltanrufs Schritt für Schritt durch ein Gesprächsskript (wie ein Entscheidungsbaum). Es speichert alle Kontakte und Anruf-Ergebnisse und zeigt dir, ob deine Idee valide ist.

## Wo die Daten liegen

Alle Daten liegen als echte JSON-Dateien im `data/`-Ordner:

| Datei | Inhalt |
|-------|--------|
| `data/scripts.json` | Die Gesprächsskripte (ROBZEN + Zenmind) |
| `data/contacts.json` | Alle Kontakte |
| `data/calls.json` | Alle Anruf-Sessions |

> **Tipp:** Den `data/`-Ordner kannst du in iCloud oder deinen Obsidian-Vault symlinken, damit die Daten automatisch gesichert werden:
> ```bash
> # Beispiel: data-Ordner in iCloud sichern
> mv data ~/Library/Mobile\ Documents/com~apple~CloudDocs/callbase-data
> ln -s ~/Library/Mobile\ Documents/com~apple~CloudDocs/callbase-data data
> ```

## Den Entscheidungsbaum erweitern

Öffne `data/scripts.json` in einem Editor. Jeder Knoten hat diese Felder:

```json
{
  "id": "mein-knoten",
  "phase": "Phase A",
  "title": "Titel des Knotens",
  "type": "script",      // "choice" | "script" | "info"
  "say": "Was du sagst",
  "tip": "Profi-Tipp",
  "signal": "Grünes Signal",
  "options": [
    { "label": "Button-Text", "next": "ziel-knoten-id" }
  ]
}
```

Oder nutze den **Skript-Editor** direkt im Tool (Tab „Skript") – ohne Code anzufassen.

## Projekte

- **ROBZEN** – B2B-Marktplatz für Automatisierungs- & KI-Projekte. Zielgruppe: Produktions-/Betriebsleiter im Mittelstand.
- **Zenmind** – Digitale Frühunterstützung für Studierende. Drei Gesprächstypen: Beratungsstelle, Studierendenwerk, AStA.
