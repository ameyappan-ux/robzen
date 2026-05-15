'use client'

// Isometric SVG visualization of a robot automation cell.
// Parameters change: robot type shape, conveyor visibility, gripper style, safety zone size.

type RobotTyp = 'Cobot' | 'Industrieroboter' | 'SCARA' | 'Delta'

interface Props {
  robotTyp: RobotTyp
  foerderband: boolean
  greifer: string
  kamera: boolean
  traglast: number
  schichten: number
}

const ROBOT_COLORS: Record<RobotTyp, string> = {
  Cobot: '#00c896',
  Industrieroboter: '#6b7280',
  SCARA: '#818cf8',
  Delta: '#f59e0b',
}

// Isometric helper: convert grid (col, row) to SVG (x, y)
// Tile size = 28px
const T = 28
const OX = 240 // origin x
const OY = 120 // origin y

function iso(col: number, row: number, z = 0): [number, number] {
  const x = OX + (col - row) * T
  const y = OY + (col + row) * (T / 2) - z * T
  return [x, y]
}

// Draw a flat rhombus (floor tile)
function FloorTile({ col, row, fill = '#1c1c24' }: { col: number; row: number; fill?: string }) {
  const [x, y] = iso(col, row)
  const points = [
    `${x},${y - T / 2}`,
    `${x + T},${y}`,
    `${x},${y + T / 2}`,
    `${x - T},${y}`,
  ].join(' ')
  return <polygon points={points} fill={fill} stroke="#2a2a38" strokeWidth={0.5} />
}

// Draw a cube face (left side)
function CubeLeft({ col, row, h = 1, fill = '#252530' }: { col: number; row: number; h?: number; fill?: string }) {
  const [x, y] = iso(col, row, 0)
  const [, yt] = iso(col, row, h)
  const points = [
    `${x},${y + T / 2}`,
    `${x - T},${y}`,
    `${x - T},${yt}`,
    `${x},${yt + T / 2}`,
  ].join(' ')
  return <polygon points={points} fill={fill} stroke="#1a1a24" strokeWidth={0.5} />
}

// Draw a cube face (right side)
function CubeRight({ col, row, h = 1, fill = '#1e1e2a' }: { col: number; row: number; h?: number; fill?: string }) {
  const [x, y] = iso(col, row, 0)
  const [, yt] = iso(col, row, h)
  const points = [
    `${x},${y + T / 2}`,
    `${x + T},${y}`,
    `${x + T},${yt}`,
    `${x},${yt + T / 2}`,
  ].join(' ')
  return <polygon points={points} fill={fill} stroke="#1a1a24" strokeWidth={0.5} />
}

// Conveyor belt (4 tiles × 1 tile, slightly elevated)
function ConveyorBelt() {
  const beltColor = '#2d6a56'
  const sideL = '#1d4a3c'
  const sideR = '#17382e'
  // top face
  const tiles = [0, 1, 2, 3]
  return (
    <g>
      {tiles.map((i) => {
        const [x, y] = iso(i + 1, 4, 0.4)
        const pts = [`${x},${y - T / 2}`, `${x + T},${y}`, `${x},${y + T / 2}`, `${x - T},${y}`].join(' ')
        return <polygon key={i} points={pts} fill={beltColor} stroke="#1d4a3c" strokeWidth={0.5} />
      })}
      {/* conveyor sides */}
      {tiles.map((i) => (
        <g key={`side-${i}`}>
          <CubeLeft col={i + 1} row={4} h={0.4} fill={sideL} />
          <CubeRight col={i + 1} row={4} h={0.4} fill={sideR} />
        </g>
      ))}
      {/* stripe marks on belt */}
      {tiles.map((i) => {
        const [x, y] = iso(i + 1.5, 4, 0.42)
        return <line key={`stripe-${i}`} x1={x - 6} y1={y - 3} x2={x + 6} y2={y + 3} stroke="#1d4a3c" strokeWidth={1.5} />
      })}
    </g>
  )
}

// Palette stack
function Palette({ col, row }: { col: number; row: number }) {
  const top = '#b5895a'
  const sideL = '#8b6540'
  const sideR = '#7a5535'
  const [x, y] = iso(col, row, 0)
  const pts = [`${x},${y - T / 2}`, `${x + T},${y}`, `${x},${y + T / 2}`, `${x - T},${y}`].join(' ')
  return (
    <g>
      <polygon points={pts} fill={top} stroke="#8b6540" strokeWidth={0.5} />
      <CubeLeft col={col} row={row} h={0.25} fill={sideL} />
      <CubeRight col={col} row={row} h={0.25} fill={sideR} />
      {/* slats */}
      <line x1={x - T * 0.5} y1={y} x2={x + T * 0.5} y2={y} stroke={sideL} strokeWidth={1.5} />
      <line x1={x - T * 0.2} y1={y - T * 0.15} x2={x + T * 0.8} y2={y + T * 0.25} stroke={sideL} strokeWidth={1} />
    </g>
  )
}

// Robot arm (stylized, changes color by type)
function RobotArm({ col, row, robotTyp, traglast }: { col: number; row: number; robotTyp: RobotTyp; traglast: number }) {
  const color = ROBOT_COLORS[robotTyp]
  const [bx, by] = iso(col, row, 0)
  // base height depends on type
  const baseH = robotTyp === 'Delta' ? 0.6 : 1.2
  const armLen = Math.min(2.2, 1.4 + traglast / 50)

  // Base block
  const basePts = [`${bx},${by - T / 2}`, `${bx + T},${by}`, `${bx},${by + T / 2}`, `${bx - T},${by}`].join(' ')

  return (
    <g>
      {/* Base top */}
      <polygon points={basePts} fill={color} opacity={0.9} stroke={color} strokeWidth={0.5} />
      <CubeLeft col={col} row={row} h={baseH} fill={`${color}88`} />
      <CubeRight col={col} row={row} h={baseH} fill={`${color}55`} />

      {robotTyp !== 'Delta' ? (
        <>
          {/* Lower arm vertical */}
          <line
            x1={bx} y1={by - T * baseH}
            x2={bx - T * 0.3} y2={by - T * (baseH + armLen * 0.5)}
            stroke={color} strokeWidth={8} strokeLinecap="round"
          />
          {/* Upper arm */}
          <line
            x1={bx - T * 0.3} y1={by - T * (baseH + armLen * 0.5)}
            x2={bx + T * 0.4} y2={by - T * (baseH + armLen)}
            stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.8}
          />
          {/* Joint */}
          <circle cx={bx - T * 0.3} cy={by - T * (baseH + armLen * 0.5)} r={5} fill={color} />
          {/* Gripper */}
          <g transform={`translate(${bx + T * 0.4}, ${by - T * (baseH + armLen)})`}>
            <rect x={-10} y={-3} width={20} height={6} fill={color} rx={2} />
            <rect x={-10} y={3} width={5} height={8} fill={color} rx={1} />
            <rect x={5} y={3} width={5} height={8} fill={color} rx={1} />
          </g>
        </>
      ) : (
        // Delta robot: 3 arms from top platform
        <>
          {[-1, 0, 1].map((i) => (
            <line key={i}
              x1={bx + i * 8} y1={by - T * baseH}
              x2={bx + i * 4} y2={by - T * (baseH + armLen)}
              stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.8}
            />
          ))}
          <circle cx={bx} cy={by - T * (baseH + armLen)} r={8} fill={color} opacity={0.9} />
        </>
      )}
    </g>
  )
}

// Camera on pole
function Camera({ col, row }: { col: number; row: number }) {
  const [x, y] = iso(col, row, 0)
  return (
    <g>
      {/* pole */}
      <line x1={x} y1={y} x2={x} y2={y - T * 2} stroke="#4b5563" strokeWidth={3} />
      {/* camera body */}
      <rect x={x - 8} y={y - T * 2 - 6} width={16} height={10} fill="#e5e7eb" rx={2} />
      <circle cx={x} cy={y - T * 2 - 1} r={4} fill="#6b7280" />
      {/* scan line */}
      <line x1={x} y1={y - T * 2 - 1} x2={x + 20} y2={y + 10} stroke="#00c89644" strokeWidth={1} strokeDasharray="3,3" />
    </g>
  )
}

// Safety zone dashed border
function SafetyZone({ size = 5 }: { size?: number }) {
  const corners = [
    iso(-1, -1),
    iso(size, -1),
    iso(size, size),
    iso(-1, size),
  ]
  const pts = corners.map(([x, y]) => `${x},${y}`).join(' ')
  return <polygon points={pts} fill="none" stroke="#facc15" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.6} />
}

export default function RobotikCell({ robotTyp, foerderband, kamera, traglast, schichten }: Props) {
  const floorTiles: Array<[number, number]> = []
  for (let c = 0; c < 6; c++) {
    for (let r = 0; r < 6; r++) {
      floorTiles.push([c, r])
    }
  }

  // Color floor based on shift count
  const floorColor = schichten >= 3 ? '#16192a' : schichten >= 2 ? '#1a1c2e' : '#1e2030'

  return (
    <svg viewBox="0 0 480 380" className="w-full h-full" style={{ maxHeight: 380 }}>
      {/* Floor tiles */}
      {floorTiles.map(([c, r]) => (
        <FloorTile key={`${c}-${r}`} col={c} row={r} fill={floorColor} />
      ))}

      {/* Safety zone */}
      <SafetyZone size={6} />

      {/* Conveyor belt */}
      {foerderband && <ConveyorBelt />}

      {/* Palette */}
      <Palette col={5} row={2} />

      {/* Robot arm */}
      <RobotArm col={2} row={2} robotTyp={robotTyp} traglast={traglast} />

      {/* Camera */}
      {kamera && <Camera col={4} row={0} />}

      {/* Label */}
      <text x={16} y={362} fontSize={10} fill="#4b5563" fontFamily="monospace">
        {robotTyp} · {traglast}kg · {schichten}x8h
      </text>
    </svg>
  )
}
