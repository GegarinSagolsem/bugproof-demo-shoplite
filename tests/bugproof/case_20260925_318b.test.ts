// BugProof case: case_20260925_318b — Negative quantity accepted in setQuantity — negative cart total enables fraudulent charge
import { describe, it, expect } from 'vitest'
import { createCart, addItem, setQuantity, parseQuantity, InvalidQuantityError } from '../../src/cart/cart'

describe('setQuantity rejects negative quantities', () => {
  it('parseQuantity throws InvalidQuantityError for a negative number', () => {
    // Actual: returns -3 (no validation on sign)
    expect(() => parseQuantity(-3)).toThrow(InvalidQuantityError)
  })

  it('setQuantity throws InvalidQuantityError when quantity is -3 (numeric)', () => {
    let cart = createCart('cart-test')
    cart = addItem(cart, 'p14', 1)
    // Actual: cart items updated with quantity=-3 → negative total
    expect(() => setQuantity(cart, 'p14', -3)).toThrow(InvalidQuantityError)
  })

  it('setQuantity throws InvalidQuantityError when quantity is "-3" (string from JSON body)', () => {
    let cart = createCart('cart-test-2')
    cart = addItem(cart, 'p14', 1)
    // Simulates body={"quantity":"-3"} arriving as a string from JSON payload (as in the log)
    expect(() => setQuantity(cart, 'p14', '-3')).toThrow(InvalidQuantityError)
  })
})
