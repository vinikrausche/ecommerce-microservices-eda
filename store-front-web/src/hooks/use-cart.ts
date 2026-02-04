import { useCallback, useEffect, useState } from "react"

import {
  addToCart,
  loadCartState,
  resolveUserId,
  storeCartState,
  subscribeToCartUpdates,
  type CartResponse,
  type CartState,
} from "@/services/cart"

const toCartState = (response: CartResponse): CartState => ({
  id: response.id,
  items: response.cart_items ?? [],
})

export function useCart() {
  const [cart, setCart] = useState<CartState>(() => loadCartState())

  useEffect(() => {
    return subscribeToCartUpdates(() => {
      setCart(loadCartState())
    })
  }, [])

  const count = cart.items.length

  const updateCart = useCallback((next: CartState) => {
    storeCartState(next)
    setCart(next)
  }, [])

  const addItem = useCallback(
    async (productId: number) => {
      const payload = {
        id: cart.id ?? undefined,
        cart_items: [productId],
        user_id: resolveUserId(),
        status: "ACTIVE" as const,
      }
      const response = await addToCart(payload)
      const next = toCartState(response)
      updateCart(next)
      return next
    },
    [cart.id, updateCart]
  )

  return {
    cart,
    count,
    addItem,
    updateCart,
  }
}
