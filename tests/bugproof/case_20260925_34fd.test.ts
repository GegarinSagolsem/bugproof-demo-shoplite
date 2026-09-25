// BugProof case: case_20260925_34fd — Last product never shows up in the catalog
import { describe, it, expect } from 'vitest'
import { paginate } from '../../src/catalog/paginate'
import { PRODUCTS } from '../../src/catalog/products'

describe('Last product never shows up in the catalog', () => {
  // 25 products at 6 per page → 5 pages; page 5 must be reachable
  it('reports 5 total pages for 25 products at 6 per page', () => {
    const result = paginate(PRODUCTS, 1, 6)
    expect(result.totalPages).toBe(5) // actual: 4
  })

  it('page 5 contains the last product (Wool Pashmina Shawl)', () => {
    const result = paginate(PRODUCTS, 5, 6)
    expect(result.items.length).toBeGreaterThan(0)
    expect(result.items.some(p => (p as { name: string }).name === 'Wool Pashmina Shawl')).toBe(true)
  })

  it('hasNext is false only on the last page (page 5)', () => {
    expect(paginate(PRODUCTS, 4, 6).hasNext).toBe(true)  // page 4 should still have next
    expect(paginate(PRODUCTS, 5, 6).hasNext).toBe(false) // page 5 is the last page
  })
})
