import { describe, it, expect } from 'vitest'
import { encodeProfile, decodeProfile } from '../project-profile'
import type { ProjectProfile } from '../project-profile'

const sample: ProjectProfile = {
  id: 'test-uuid-1234',
  prozess: 'Montage Endprodukte',
  mitarbeiter: '5',
  schichten: '2-Schicht',
  ziel: 'Kapazität erhöhen und Fehlerquote reduzieren',
  budget: '50-150k',
  zeithorizont: '6 Monate',
  raeumlich: 'Niedrige Decke ca. 3m, beengte Verhältnisse',
  automationLevel: 'Hoch',
  fundingEligibility: 'Wahrscheinlich',
  createdAt: '2026-05-10T10:00:00Z',
}

describe('project-profile encode/decode round-trip', () => {
  it('decodes back to the original profile', () => {
    expect(decodeProfile(encodeProfile(sample))).toEqual(sample)
  })

  it('handles special characters in strings', () => {
    const profile = { ...sample, raeumlich: 'Umlaute: ä ö ü & "special" chars' }
    expect(decodeProfile(encodeProfile(profile))).toEqual(profile)
  })

  it('returns null for undefined input', () => {
    expect(decodeProfile(undefined)).toBeNull()
  })

  it('returns null for null input', () => {
    expect(decodeProfile(null)).toBeNull()
  })

  it('returns null for invalid base64', () => {
    expect(decodeProfile('not-valid-base64!!!')).toBeNull()
  })

  it('returns null for valid base64 but invalid JSON', () => {
    expect(decodeProfile(btoa('not json'))).toBeNull()
  })
})
