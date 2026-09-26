// BugProof case: case_20260926_db4f — duplicate DIWALI60 coupon stacks discount to negative total
import { describe, it, expect } from 'vitest'
import { createCart, addItem } from '../../src/cart/cart'
import { applyCoupon } from '../../src/cart/coupons'
import { computeTotals } from '../../src/cart/totals'

describe('applyCoupon — duplicate coupon is a no-op', () => {
  it('applying DIWALI60 twice should not produce a negative cart total', () => {
    // Build a ₹2,499 cart (Bluetooth Speaker p13)
    let cart = createCart('test-cart-bug08')
    cart = addItem(cart, 'p13', 1)

    // Apply the same 60%-off coupon twice
    cart = applyCoupon(cart, 'DIWALI60')
    cart = applyCoupon(cart, 'DIWALI60')

    const { total } = computeTotals(cart)

    // Expected: coupon is only counted once → total >= 0
    // Actual (buggy): coupon stacks twice → 120% discount → total is negative
    expect(total).toBeGreaterThanOrEqual(0)
  })
})
