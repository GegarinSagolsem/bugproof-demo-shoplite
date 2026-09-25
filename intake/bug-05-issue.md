# Search is case-sensitive now

**Labels:** `catalog`, `regression`

## Description

Product search used to ignore case. Since the latest deploy it only matches when the capitalisation
is exactly the same as the product name, so most real searches (people type in lowercase on
mobile) come back empty.

## Steps to reproduce

1. Open the shop.
2. Type `mug` in the search box.

## Expected

**Ceramic Coffee Mug** is listed (same as searching `Mug`).

## Actual

"No products match “mug”."

## More examples

| Query         | Before  | Now       |
| ------------- | ------- | --------- |
| `Mug`         | 1 result | 1 result |
| `mug`         | 1 result | 0 results |
| `KITCHEN`     | 5 results | 0 results |
| `bluetooth`   | 1 result | 0 results |

## Notes

This is a regression — it definitely worked last sprint. Nothing about search was mentioned in
the release notes.
