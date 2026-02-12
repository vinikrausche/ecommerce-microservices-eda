import axios from "axios"

export type CreateUserPayload = {
  name: string
  lastname: string
  email: string
  address: string
  zipcode: string
  national_id: string
  phone: string
  state: string
  password: string
}

export type UserResponse = {
  id: number
  name: string
  lastname: string
  email: string
  address: string
  zipcode: string
  national_id: string
  phone: string
  state: string
}

export type LoginPayload = {
  email: string
  password: string
}

const TOKEN_STORAGE_KEY = "authToken"
const USER_ID_STORAGE_KEY = "userId"
const AUTH_EVENT = "auth:updated"
const LEGACY_CART_STORAGE_KEY = "cartState"

export const userApi = axios.create({
  baseURL: "http://localhost:8081/api/v1",
})

export async function createUser(payload: CreateUserPayload): Promise<UserResponse> {
  const { data } = await userApi.post<UserResponse>("/users", payload)
  return data
}

export async function loginUser(payload: LoginPayload): Promise<string> {
  const { data } = await userApi.post<string>("/login", payload)
  return data
}

function dispatchAuthUpdated(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

function extractUserIdFromToken(token: string): number | null {
  if (typeof window === "undefined") return null
  const parts = token.split(".")
  if (parts.length < 2) return null

  try {
    const payloadBase64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=")
    const payloadJson = window.atob(payloadBase64)
    const payload = JSON.parse(payloadJson) as { userId?: unknown }
    const claim = payload.userId

    if (typeof claim === "number" && Number.isFinite(claim)) {
      return claim
    }
    if (typeof claim === "string" && claim.trim().length > 0) {
      const parsed = Number(claim)
      return Number.isFinite(parsed) ? parsed : null
    }
    return null
  } catch {
    return null
  }
}

export function storeToken(token: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  const userId = extractUserIdFromToken(token)
  if (userId !== null) {
    window.localStorage.setItem(USER_ID_STORAGE_KEY, String(userId))
  }
  dispatchAuthUpdated()
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(USER_ID_STORAGE_KEY)
  window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY)
  dispatchAuthUpdated()
}

export function storeUserId(id: number): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_ID_STORAGE_KEY, String(id))
  dispatchAuthUpdated()
}

export function getStoredUserId(): number | null {
  if (typeof window === "undefined") return null
  const value = window.localStorage.getItem(USER_ID_STORAGE_KEY)
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function clearStoredUserId(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(USER_ID_STORAGE_KEY)
  dispatchAuthUpdated()
}

export function subscribeToAuthUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(AUTH_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(AUTH_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}
