# Last product never shows up in the catalog

**Labels:** `catalog`, `ui`

## Description

We have 25 products but I can only ever page through 24 of them in the storefront. The **Wool
Pashmina Shawl** is in the catalog data, shows up when you search for it, and can be added to a
cart, but it never appears when browsing the product grid.

## Steps to reproduce

1. Open the shop with an empty search box (6 products per page).
2. Click **Next ›** until the button is disabled.

## Expected

25 products at 6 per page is 5 pages. Page 5 shows the Wool Pashmina Shawl and the footer says
**Page 5 of 5 · Showing 25–25 of 25**.

## Actual

The pager stops at **Page 4 of 4 · Showing 19–24 of 25** and **Next ›** is disabled. The footer
itself says there are 25 products, but only 24 can be reached.

## Notes

- Searching "Shawl" finds it (a single page of results), so the product data is fine.
- Looks like it only bites when the last page would hold exactly one product; when we had 23
  products nobody noticed.
