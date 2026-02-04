import { api } from "@/services/api"
import { getStoredUserId } from "@/services/users"

export type CartResponse = {
  id: number
  cart_items: number[]
}

export type AddToCartPayload = {
  id?: number | null
  cart_items: number[]
  user_id: number
  status?: "ACTIVE" | "INACTIVE"
}

export type CartState = {
  id: number | null
  items: number[]
}

const CART_STORAGE_KEY = "cartState"
const CART_EVENT = "cart:updated"

const defaultCartState: CartState = { id: null, items: [] }

export function loadCartState(): CartState {
  if (typeof window === "undefined") return defaultCartState
  const raw = window.localStorage.getItem(CART_STORAGE_KEY)
  if (!raw) return defaultCartState
  try {
    const parsed = JSON.parse(raw) as CartState
    return {
      id: typeof parsed.id === "number" ? parsed.id : null,
      items: Array.isArray(parsed.items)
        ? parsed.items.filter((item) => typeof item === "number")
        : [],
    }
  } catch {
    return defaultCartState
  }
}

export function storeCartState(state: CartState): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function clearCartState(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(CART_STORAGE_KEY)
  window.dispatchEvent(new Event(CART_EVENT))
}

export function getCartItemCount(state?: CartState): number {
  const current = state ?? loadCartState()
  return current.items.length
}

export async function addToCart(payload: AddToCartPayload): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>("/cart", payload)
  return data
}

export function resolveUserId(): number {
  const stored = getStoredUserId()
  return stored ?? 1
}

export function subscribeToCartUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(CART_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(CART_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}
