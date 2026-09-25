# Double-clicking "Place order" creates two orders and charges twice

**Labels:** `orders`, `payments`, `priority: high`

## Description

A customer double-clicked **Place order** (the button takes a moment while the payment goes
through) and ended up with **two identical orders** and **two charges** for the same cart. Support
has seen three of these this week.

## Steps to reproduce

1. Add **Bluetooth Speaker** to the cart.
2. Double-click **Place order** quickly (both clicks within the ~1 second the payment takes).

## Expected

One order (`ORD-0001`) and one payment. The second click should be ignored or should return the
same order.

## Actual

Two orders, `ORD-0001` and `ORD-0002`, both for the same cart, each with its own payment.
Placing the *same* cart again after the first order has finished is correctly rejected with
"Cart … has already been ordered", so the duplicate check exists — it just does not catch the
second click while the first one is still in progress.

## Log excerpt

```
2026-09-21T09:14:07.201Z info  [http] POST /api/orders 202 1ms cartId=cart-3310 requestId=req_a1
2026-09-21T09:14:07.203Z info  [payments] charge requested reference=cart-3310 amount=2948.82
2026-09-21T09:14:07.389Z info  [http] POST /api/orders 202 1ms cartId=cart-3310 requestId=req_a2
2026-09-21T09:14:07.390Z info  [payments] charge requested reference=cart-3310 amount=2948.82
2026-09-21T09:14:08.004Z info  [orders] order placed id=ORD-0001 cartId=cart-3310 paymentId=pay_000001 total=2948.82
2026-09-21T09:14:08.191Z info  [orders] order placed id=ORD-0002 cartId=cart-3310 paymentId=pay_000002 total=2948.82
2026-09-21T09:14:08.192Z warn  [reconciliation] duplicate charge reference=cart-3310 payments=pay_000001,pay_000002
```

## Notes

Disabling the button in the UI would hide it, but the API should be idempotent per cart —
mobile clients and retries hit the same path.
