import { describe, it, expect } from 'vitest'
import { lookupCostRange, formatEuro } from '../cost-lookup'

describe('lookupCostRange', () => {
  it('Teilautomatisierung + 1-Schicht', () => {
    const r = lookupCostRange('Teilautomatisierung', '1-Schicht')
    expect(r.costMin).toBe(40000)
    expect(r.costMax).toBe(80000)
    expect(r.roiMin).toBe(30)
    expect(r.roiMax).toBe(42)
    expect(r.disclaimer).toMatch(/Indikative/)
  })

  it('Teilautomatisierung + 2-Schicht', () => {
    const r = lookupCostRange('Teilautomatisierung', '2-Schicht')
    expect(r.costMin).toBe(50000)
    expect(r.costMax).toBe(100000)
    expect(r.roiMin).toBe(24)
    expect(r.roiMax).toBe(36)
  })

  it('Vollautomatisierung + 1-Schicht', () => {
    const r = lookupCostRange('Vollautomatisierung', '1-Schicht')
    expect(r.costMin).toBe(80000)
    expect(r.costMax).toBe(150000)
    expect(r.roiMin).toBe(24)
    expect(r.roiMax).toBe(36)
  })

  it('Vollautomatisierung + 2-Schicht', () => {
    const r = lookupCostRange('Vollautomatisierung', '2-Schicht')
    expect(r.costMin).toBe(100000)
    expect(r.costMax).toBe(200000)
    expect(r.roiMin).toBe(18)
    expect(r.roiMax).toBe(30)
  })

  it('Vollautomatisierung + 24/7', () => {
    const r = lookupCostRange('Vollautomatisierung', '3-Schicht / 24/7')
    expect(r.costMin).toBe(150000)
    expect(r.costMax).toBe(350000)
    expect(r.roiMin).toBe(18)
    expect(r.roiMax).toBe(24)
  })
})

describe('formatEuro', () => {
  it('formats thousands as k €', () => {
    expect(formatEuro(40000)).toBe('40k €')
    expect(formatEuro(150000)).toBe('150k €')
  })

  it('formats small amounts as-is', () => {
    expect(formatEuro(500)).toBe('500 €')
  })
})
