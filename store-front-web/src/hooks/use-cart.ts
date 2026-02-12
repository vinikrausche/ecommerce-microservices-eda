import { useCallback, useEffect, useMemo, useState } from "react"

import {
  addToCart,
  fetchActiveCartByUser,
  replaceCartItems,
  resolveUserId,
  type CartResponse,
  type CartState,
} from "@/services/cart"
import { subscribeToAuthUpdates } from "@/services/users"

const emptyCart: CartState = { id: null, items: [] }

const toCartState = (response: CartResponse): CartState => ({
  id: typeof response.id === "number" ? response.id : null,
  items: Array.isArray(response.cart_items)
    ? response.cart_items.filter((item) => typeof item === "number")
    : [],
})

export function useCart() {
  const [cart, setCart] = useState<CartState>(emptyCart)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    const userId = resolveUserId()
    if (userId === null) {
      setLoading(false)
      setCart(emptyCart)
      return emptyCart
    }

    setLoading(true)
    try {
      const response = await fetchActiveCartByUser(userId)
      const next = toCartState(response)
      setCart(next)
      return next
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    refresh().catch(() => {
      if (mounted) {
        setCart(emptyCart)
      }
    })
    const unsubscribe = subscribeToAuthUpdates(() => {
      refresh().catch(() => setCart(emptyCart))
    })
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [refresh])

  const count = useMemo(() => cart.items.length, [cart.items])

  const addItem = useCallback(
    async (productId: number) => {
      const userId = resolveUserId()
      if (userId === null) {
        throw new Error("AUTH_REQUIRED")
      }

      const payload = {
        id: cart.id ?? undefined,
        cart_items: [productId],
        user_id: userId,
        status: "ACTIVE" as const,
      }
      const response = await addToCart(payload)
      const next = toCartState(response)
      setCart(next)
      return next
    },
    [cart.id]
  )

  const clearCart = useCallback(async () => {
    if (cart.id === null) {
      setCart(emptyCart)
      return emptyCart
    }
    const response = await replaceCartItems(cart.id, { cart_items: [] })
    const next = toCartState(response)
    setCart(next)
    return next
  }, [cart.id])

  return {
    cart,
    count,
    loading,
    refresh,
    addItem,
    clearCart,
  }
}
