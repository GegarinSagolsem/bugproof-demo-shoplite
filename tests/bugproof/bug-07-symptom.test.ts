// BugProof case: case_20260926_9afc — placeOrder race condition creates two orders and charges twice
import { describe, it, expect } from 'vitest'
import { OrderService } from '../../src/orders/service'
import { FakePaymentGateway } from '../../src/orders/payments'

describe('OrderService.placeOrder concurrent calls — symptom only', () => {
  it('creates exactly one order and one payment charge when the same cart is placed twice concurrently', async () => {
    // Latency >0 ensures both calls pass the in-flight guard before either resolves
    const payments = new FakePaymentGateway(10)
    const service = new OrderService({ payments })

    const cart = {
      id: 'cart-race-symptom',
      items: [{ productId: 'p1', name: 'Widget', unitPrice: 100, quantity: 1 }],
      couponCodes: [],
    }

    // Fire both concurrently — neither awaits before the other starts
    await Promise.allSettled([
      service.placeOrder(cart),
      service.placeOrder(cart),
    ])

    const orders = service.listOrders()

    // Reported symptom: two orders and two charges were created instead of one
    expect(orders.length).toBe(1)           // actual (pre-fix): 2
    expect(payments.charges.length).toBe(1) // actual (pre-fix): 2
  })
})
