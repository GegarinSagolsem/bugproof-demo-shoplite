# ShopLite

> **Demo target for [Cimex Fix](https://github.com/GegarinSagolsem/cimex-fix).** This shop has 8 planted bugs, each
> introduced by an ordinary-looking commit, so IBM Bob can reproduce, bisect and fix them. The bug reports are in
> [`intake/`](intake), every fix commit adds its repro test under `tests/bugproof/`, and each case's Proof of Fix is at
> <https://cimex-fix.vercel.app/cases>.

A small, in-memory TypeScript shop: product catalog with search and pagination, a cart with
coupons, 18% GST and shipping, delivery-date estimates in India Standard Time, and order
placement against a fake payment gateway. There is no backend or database — everything is plain
TypeScript modules, so the domain logic is easy to read and test.

## Getting started

Requires Node 24 (see `.nvmrc`; Node ≥ 22.12 also works) and npm.

```sh
npm install
npm test          # Vitest unit + integration tests
npm run dev       # UI at http://localhost:5173
npm run build     # type-check everything and build the UI into ui/dist
```

## Layout

| Path            | What lives there                                                    |
| --------------- | ------------------------------------------------------------------- |
| `src/catalog/`  | product list, search, pagination                                    |
| `src/cart/`     | cart state, line items, coupons, totals                             |
| `src/tax/`      | GST calculation                                                     |
| `src/currency/` | INR formatting (`₹1,23,456.50`) and paise helpers                   |
| `src/delivery/` | delivery-date estimate (Asia/Kolkata, 8 PM dispatch cutoff)         |
| `src/orders/`   | order placement, order history, fake payment gateway                |
| `tests/`        | Vitest tests mirroring `src/`                                       |
| `ui/`           | tiny Vite + vanilla TS storefront that imports straight from `src/` |

## Business rules

- Prices are pre-tax rupees. GST is 18% of the subtotal, rounded to the paisa.
- Shipping is ₹49, free when the subtotal is ₹999 or more.
- Coupons (`SAVE10`, `WELCOME15`, `FLAT200`, `DIWALI60`) come off the pre-tax subtotal.
- Orders placed before 8 PM IST are dispatched the same day, later orders the next day; transit
  is 3 days and there are no Sunday deliveries.

## License

MIT
