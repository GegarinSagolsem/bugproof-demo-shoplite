# Cart total is ₹0.01 lower than it should be for some products

**Labels:** `checkout`, `money`

## Description

For some carts the GST line — and therefore the order total — is one paisa short of 18% of the
subtotal. Finance noticed it while reconciling invoices: our invoice generator (which computes GST
from the subtotal) disagrees with the amount we charged by ₹0.01 on a handful of orders.

It does not happen for every product, which is why nobody caught it in review.

## Steps to reproduce

1. Open the shop and add **Cast Iron Tawa** (₹1,049.25) to an empty cart, quantity 1.
2. Look at the cart summary.

## Expected

- Subtotal: ₹1,049.25
- GST (18%): **₹188.87** (18% of ₹1,049.25 is ₹188.865, which rounds half-up to ₹188.87)
- Shipping: Free
- Total: **₹1,238.12**

## Actual

- Subtotal: ₹1,049.25
- GST (18%): **₹188.86**
- Shipping: Free
- Total: **₹1,238.11**

## Notes

- Carts with whole-rupee prices look fine.
- The standalone GST helper gives the right answer for the same amount, so the difference seems
  to come from how the cart adds things up.
- The charged amount matches the (wrong) cart total, so customers are under-charged by ₹0.01.
