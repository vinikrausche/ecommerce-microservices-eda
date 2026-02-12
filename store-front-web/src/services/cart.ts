import { api } from "@/services/api"
import { getStoredUserId } from "@/services/users"

export type CartResponse = {
  id: number | null
  cart_items: number[]
}

export type AddToCartPayload = {
  id?: number | null
  cart_items: number[]
  user_id: number
  status?: "ACTIVE" | "INACTIVE"
}

export type ReplaceCartItemsPayload = {
  cart_items: number[]
}

export type CartState = {
  id: number | null
  items: number[]
}

export async function addToCart(payload: AddToCartPayload): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>("/cart", payload)
  return data
}

export async function fetchActiveCartByUser(userId: number): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>(`/cart/user/${userId}`)
  return data
}

export async function replaceCartItems(
  cartId: number,
  payload: ReplaceCartItemsPayload
): Promise<CartResponse> {
  const { data } = await api.put<CartResponse>(`/cart/${cartId}/items`, payload)
  return data
}

export function resolveUserId(): number | null {
  return getStoredUserId()
}
