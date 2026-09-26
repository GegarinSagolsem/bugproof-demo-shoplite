// BugProof case: case_20260926_7e5e — searchProducts is case-sensitive (regression)
import { describe, it, expect } from 'vitest'
import { PRODUCTS } from '../../src/catalog/products'
import { searchProducts } from '../../src/catalog/search'

describe('searchProducts is case-insensitive', () => {
  it('finds "Ceramic Coffee Mug" with lowercase query "mug"', () => {
    expect(searchProducts(PRODUCTS, 'mug')).toHaveLength(1) // actual: 0 (case-sensitive bug)
  })

  it('finds all 5 Kitchen products with uppercase query "KITCHEN"', () => {
    expect(searchProducts(PRODUCTS, 'KITCHEN')).toHaveLength(5) // actual: 0 (case-sensitive bug)
  })

  it('finds Bluetooth product with lowercase query "bluetooth"', () => {
    expect(searchProducts(PRODUCTS, 'bluetooth')).toHaveLength(1) // actual: 0 (case-sensitive bug)
  })
})
