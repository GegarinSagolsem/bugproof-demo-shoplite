# QA Report: Delivery estimate is one day early for evening orders

**Report ID:** QA-2026-117
**Component:** Checkout / delivery estimate
**Severity:** Major (customer-facing promise is wrong)
**Environment:** staging, Chrome 141 on macOS, device clock set to Asia/Kolkata (IST)
**Tester:** QA team, Bengaluru

## Summary

The estimated delivery date shown in the cart and stored on the order is one day too early for
orders placed at or after 8:00 PM IST. Our dispatch cutoff is 8 PM IST: anything ordered after
that is dispatched the next day, so the promise should move out by a day. It does not.

## Business rule under test

- Orders placed before 20:00 IST are dispatched the same day.
- Orders placed at or after 20:00 IST are dispatched the next day.
- Transit takes 3 days; Sundays are not delivery days.

## Steps to reproduce

1. Set the device clock (or the service clock in the test harness) to **Tuesday 10 March 2026,
   21:00 IST** (15:30 UTC).
2. Add any product to the cart, e.g. Ceramic Coffee Mug.
3. Read the "Estimated delivery" line under the cart totals.
4. Place the order and open "Your orders"; read "arrives ...".

## Expected result

Dispatch Wednesday 11 March, delivery **Sat, 14 Mar** (2026-03-14).

## Actual result

Cart and order both show **Fri, 13 Mar** (2026-03-13) - the same date as a morning order.

## Additional observations

| Order time (IST)        | UTC equivalent | Expected   | Actual     | Result |
| ----------------------- | -------------- | ---------- | ---------- | ------ |
| Tue 10 Mar, 10:00       | 04:30          | Fri 13 Mar | Fri 13 Mar | Pass   |
| Tue 10 Mar, 19:55       | 14:25          | Fri 13 Mar | Fri 13 Mar | Pass   |
| Tue 10 Mar, 20:05       | 14:35          | Sat 14 Mar | Fri 13 Mar | FAIL   |
| Tue 10 Mar, 21:00       | 15:30          | Sat 14 Mar | Fri 13 Mar | FAIL   |
| Tue 10 Mar, 23:45       | 18:15          | Sat 14 Mar | Fri 13 Mar | FAIL   |
| Thu 12 Mar, 21:30       | 16:00          | Tue 17 Mar | Mon 16 Mar | FAIL   |

- Every failing case is at or after 20:00 IST; the estimate is always exactly one day early.
- Morning and afternoon orders are correct, including orders just after midnight IST.
- Reproduced on two machines, one with the OS timezone set to UTC and one set to IST, so it
  does not depend on the browser's local timezone.
- This worked in the previous release that QA signed off; it looks like a regression.

## Attachments

- Screen recording available on request.
