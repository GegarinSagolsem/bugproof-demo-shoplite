// BugProof case: case_20260926_9afc — placeOrder race condition charges twice for the same cart
import { describe, it, expect, vi } from 'vitest'
import { OrderService } from '../../src/orders/service'
import { FakePaymentGateway } from '../../src/orders/payments'

describe('OrderService.placeOrder concurrent duplicate guard', () => {
  it('places only one order and charges only once when two calls race for the same cart', async () => {
    // Use a latency >0 so both calls pass the guard before either resolves
    const payments = new FakePaymentGateway(10)
    const service = new OrderService({ payments })

    const cart = {
      id: 'cart-race-001',
      items: [{ productId: 'p1', name: 'Widget', unitPrice: 100, quantity: 1 }],
      couponCodes: [],
    }

    // Fire both concurrently — neither awaits before the other starts
    const results = await Promise.allSettled([
      service.placeOrder(cart),
      service.placeOrder(cart),
    ])

    const fulfilled = results.filter((r) => r.status === 'fulfilled')
    const orders = service.listOrders()

    // Only one order should exist
    expect(orders.length).toBe(1)                  // actual (buggy): 2
    // Only one charge should have been made
    expect(payments.charges.length).toBe(1)        // actual (buggy): 2
    // Exactly one call should have succeeded
    expect(fulfilled.length).toBe(1)               // actual (buggy): 2
  })
})
