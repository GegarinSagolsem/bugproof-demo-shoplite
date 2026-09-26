// BugProof case: case_20260926_2c6c — dispatch cutoff uses UTC hour instead of IST hour
import { describe, it, expect } from 'vitest'
import { estimateDelivery } from '../../src/delivery/estimate'

describe('estimateDelivery dispatch cutoff uses IST hour', () => {
  it('order at 21:00 IST (15:30 UTC) on Tue 10 Mar 2026 delivers Sat 14 Mar 2026', () => {
    // 2026-03-10T15:30:00Z = 21:00 IST — past the 20:00 cutoff, so dispatch is Wed 11 Mar
    // 3 transit days skipping Sunday: Thu 12, Fri 13, Sat 14 → delivery 2026-03-14
    const orderedAt = new Date('2026-03-10T15:30:00Z')
    expect(estimateDelivery(orderedAt)).toBe('2026-03-14') // actual (buggy): 2026-03-13
  })
})
