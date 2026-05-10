import { describe, it, expect } from 'vitest'
import { automatisierungsScore, fundingEligibility } from '../scoring'

describe('automatisierungsScore', () => {
  it('returns Hoch for budget ≥50k, ziel Kapazität, mitarbeiter ≥2', () => {
    expect(automatisierungsScore({ budget: '50-150k', ziel: 'Kapazität erhöhen', mitarbeiter: '3', zeithorizont: '6 Monate', prozess: 'Montage Linie' })).toBe('Hoch')
  })

  it('returns Hoch for Fachkräfte goal', () => {
    expect(automatisierungsScore({ budget: '150-500k', ziel: 'Fachkräftemangel ausgleichen', mitarbeiter: '5', zeithorizont: '1 Jahr', prozess: 'Palettierung' })).toBe('Hoch')
  })

  it('returns Hoch for Personal goal', () => {
    expect(automatisierungsScore({ budget: '>500k', ziel: 'Personal reduzieren', mitarbeiter: '10', zeithorizont: '8 Monate', prozess: 'Verpackungsanlage' })).toBe('Hoch')
  })

  it('returns Niedrig for budget <50k', () => {
    expect(automatisierungsScore({ budget: '<50k', ziel: 'Kapazität', mitarbeiter: '3', zeithorizont: '6 Monate', prozess: 'Montage Linie' })).toBe('Niedrig')
  })

  it('returns Mittel for unklar budget — early-stage buyer should not get Niedrig', () => {
    expect(automatisierungsScore({ budget: 'unklar', ziel: 'Kapazität', mitarbeiter: '3', zeithorizont: '6 Monate', prozess: 'Montage Linie' })).toBe('Mittel')
  })

  it('returns Mittel for "1–2 Jahre" — valid wizard option must not trigger Niedrig', () => {
    expect(automatisierungsScore({ budget: '50-150k', ziel: 'Kapazität', mitarbeiter: '3', zeithorizont: '1–2 Jahre', prozess: 'Montage Linie' })).toBe('Hoch')
  })

  it('returns Niedrig for zeithorizont > 2 Jahre', () => {
    expect(automatisierungsScore({ budget: '50-150k', ziel: 'Kapazität', mitarbeiter: '3', zeithorizont: '3 Jahre', prozess: 'Montage Linie' })).toBe('Niedrig')
  })

  it('returns Niedrig for vague prozess (<10 chars)', () => {
    expect(automatisierungsScore({ budget: '50-150k', ziel: 'Kapazität', mitarbeiter: '3', zeithorizont: '6 Monate', prozess: 'unklar' })).toBe('Niedrig')
  })

  it('returns Mittel for mitarbeiter < 2 — Hoch condition not met, but no Niedrig trigger', () => {
    expect(automatisierungsScore({ budget: '50-150k', ziel: 'Kapazität', mitarbeiter: '1', zeithorizont: '6 Monate', prozess: 'Montage Linie' })).toBe('Mittel')
  })

  it('returns Mittel for good budget but ziel not matching', () => {
    expect(automatisierungsScore({ budget: '50-150k', ziel: 'Kosten senken', mitarbeiter: '5', zeithorizont: '6 Monate', prozess: 'Qualitätskontrolle' })).toBe('Mittel')
  })
})

describe('fundingEligibility', () => {
  it('returns Wahrscheinlich for large budget and many employees', () => {
    expect(fundingEligibility({ budget: '150-500k', ziel: 'Kapazität', mitarbeiter: '20', zeithorizont: '1 Jahr', prozess: 'Montage' })).toBe('Wahrscheinlich')
  })

  it('returns Unwahrscheinlich for very small budget', () => {
    expect(fundingEligibility({ budget: '<50k', ziel: 'Kapazität', mitarbeiter: '5', zeithorizont: '6 Monate', prozess: 'Montage' })).toBe('Unwahrscheinlich')
  })

  it('returns Möglicherweise for mid budget', () => {
    expect(fundingEligibility({ budget: '50-150k', ziel: 'Kapazität', mitarbeiter: '5', zeithorizont: '6 Monate', prozess: 'Montage' })).toBe('Möglicherweise')
  })
})
