// BugProof case: case_20260926_b86b — GST on Cast Iron Tawa rounds down by one paisa
import { describe, it, expect } from 'vitest'
import { computeTotals } from '../../src/cart/totals'
import type { Cart } from '../../src/cart/cart'

describe('computeTotals GST rounding for Cast Iron Tawa ₹1,049.25 × 18%', () => {
  it('calculates GST as ₹188.87 (not ₹188.86)', () => {
    const cart: Cart = {
      id: 'cart-test',
      couponCodes: [],
      items: [
        {
          productId: 'cast-iron-tawa',
          name: 'Cast Iron Tawa',
          unitPrice: 1049.25,
          quantity: 1,
        },
      ],
    }

    const totals = computeTotals(cart)
    expect(totals.tax).toBe(188.87)   // actual: 188.86
    expect(totals.total).toBe(1238.12) // actual: 1238.11
  })
})
