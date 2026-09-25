# Intake

How each reported problem reached the team. These are the raw artifacts a debugger starts from:
a QA report, a server log, a few GitHub issues and two screenshots.

| File                                      | Kind            |
| ----------------------------------------- | --------------- |
| `bug-01-screenshot.png`                   | screenshot (capture manually, see below) |
| `bug-02-issue.md`                         | GitHub issue    |
| `bug-03-qa-report.md` / `.pdf`            | QA report       |
| `bug-04-issue.md`                         | GitHub issue    |
| `bug-05-issue.md`                         | GitHub issue    |
| `bug-06-server.log`                       | server log      |
| `bug-07-issue.md`                         | GitHub issue with log excerpt |
| `bug-08-screenshot.png`                   | screenshot (capture manually, see below) |

## Capturing the two screenshots

The screenshots are deliberately not generated. Capture them from the real UI:

1. From the repository root run `npm install`, then `cd ui && npm run dev` and open the printed
   URL (normally <http://localhost:5173>).
2. **`bug-01-screenshot.png`** — add any product (e.g. *Ceramic Coffee Mug*) to the cart, leave
   the coupon field **empty** and click **Apply**. The cart summary now shows `₹NaN` for the
   discount and the total. Screenshot the cart panel and save it as
   `intake/bug-01-screenshot.png`.
3. **`bug-08-screenshot.png`** — reload, add *Bluetooth Speaker* (₹2,499), type `DIWALI60` and
   click **Apply**, then type `DIWALI60` again and click **Apply** a second time. The summary
   shows `Discount (120% off)` and a negative total. Screenshot the cart panel and save it as
   `intake/bug-08-screenshot.png`.

## Regenerating the QA report PDF

```sh
node scripts/render-pdf.mjs intake/bug-03-qa-report.md intake/bug-03-qa-report.pdf
```
