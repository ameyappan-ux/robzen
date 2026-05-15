'use client'

// Visual workflow builder for AI/Software automation
// Nodes connected by SVG arrows, changes based on parameters

interface WorkflowParams {
  eingabe: string
  ki: boolean
  pruefung: boolean
  approval: boolean
  ausgabe: string
  volumen: number
  automatisierungsgrad: number
}

const NODE_W = 110
const NODE_H = 44
const GAP = 70
const START_X = 30
const Y = 90

interface NodeDef {
  id: string
  label: string
  sublabel: string
  color: string
  show: boolean
  x: number
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const mx = (x1 + x2) / 2
  return (
    <g>
      <path d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
        fill="none" stroke="#2d4a3e" strokeWidth={2} strokeDasharray="5,3" />
      <polygon points={`${x2},${y2} ${x2 - 6},${y2 - 4} ${x2 - 6},${y2 + 4}`} fill="#2d4a3e" />
    </g>
  )
}

function WorkflowNode({ label, sublabel, color, x, active }: {
  label: string; sublabel: string; color: string; x: number; active: boolean
}) {
  return (
    <g transform={`translate(${x}, ${Y - NODE_H / 2})`} opacity={active ? 1 : 0.25}>
      <rect width={NODE_W} height={NODE_H} rx={8} fill={active ? `${color}18` : '#1a1a24'} stroke={color} strokeWidth={active ? 1.5 : 0.5} />
      <text x={NODE_W / 2} y={16} textAnchor="middle" fill={active ? color : '#4b5563'} fontSize={9} fontWeight="600" fontFamily="system-ui">
        {label}
      </text>
      <text x={NODE_W / 2} y={30} textAnchor="middle" fill="#6b7280" fontSize={8} fontFamily="system-ui">
        {sublabel}
      </text>
    </g>
  )
}

export default function AIWorkflow({ eingabe, ki, pruefung, approval, ausgabe, automatisierungsgrad }: WorkflowParams) {
  const nodes: NodeDef[] = [
    { id: 'input', label: eingabe || 'Eingabe', sublabel: 'E-Mail / PDF / Formular', color: '#818cf8', show: true, x: 0 },
    { id: 'ki', label: 'KI-Verarbeitung', sublabel: 'Analyse & Entscheidung', color: '#00c896', show: ki, x: 0 },
    { id: 'pruefung', label: 'Datenprüfung', sublabel: 'Validierung & Regeln', color: '#f59e0b', show: pruefung, x: 0 },
    { id: 'approval', label: 'Human Approval', sublabel: 'Freigabe durch Mensch', color: '#f87171', show: approval, x: 0 },
    { id: 'ausgabe', label: ausgabe || 'Ausgabe', sublabel: 'ERP / CRM / E-Mail', color: '#34d399', show: true, x: 0 },
  ]

  // Layout: place visible nodes horizontally
  let curX = START_X
  const placed = nodes.map((n) => {
    const x = curX
    if (n.show) curX += NODE_W + GAP
    return { ...n, x }
  })

  const visibleNodes = placed.filter((n) => n.show)
  const totalWidth = curX - GAP + START_X
  const svgWidth = Math.max(500, totalWidth + 40)

  // Auto-arrows between visible nodes
  const arrows: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
  for (let i = 0; i < visibleNodes.length - 1; i++) {
    const a = visibleNodes[i]
    const b = visibleNodes[i + 1]
    arrows.push({ x1: a.x + NODE_W, y1: Y, x2: b.x, y2: Y })
  }

  // Automation percentage arc
  const r = 28
  const circumference = 2 * Math.PI * r
  const pct = automatisierungsgrad / 100
  const dashOffset = circumference * (1 - pct)

  return (
    <svg viewBox={`0 0 ${svgWidth} 200`} className="w-full" style={{ maxHeight: 200 }}>
      {/* Background */}
      <rect width={svgWidth} height={200} fill="#0d0d14" rx={12} />

      {/* Grid lines */}
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1={20} y1={y} x2={svgWidth - 20} y2={y} stroke="#1a1a2e" strokeWidth={0.5} />
      ))}

      {/* Arrows */}
      {arrows.map((a, i) => <Arrow key={i} {...a} />)}

      {/* Nodes */}
      {placed.map((n) => (
        <WorkflowNode key={n.id} label={n.label} sublabel={n.sublabel} color={n.color} x={n.x} active={n.show} />
      ))}

      {/* Automation % donut */}
      <g transform={`translate(${svgWidth - 55}, 155)`}>
        <circle cx={0} cy={0} r={r} fill="none" stroke="#1e2030" strokeWidth={6} />
        <circle cx={0} cy={0} r={r} fill="none" stroke="#00c896" strokeWidth={6}
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform="rotate(-90)" />
        <text x={0} y={4} textAnchor="middle" fill="#00c896" fontSize={11} fontWeight="700" fontFamily="monospace">{automatisierungsgrad}%</text>
        <text x={0} y={18} textAnchor="middle" fill="#6b7280" fontSize={7} fontFamily="system-ui">Automatisierung</text>
      </g>
    </svg>
  )
}
