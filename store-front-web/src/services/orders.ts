import axios from "axios"
import { getStoredToken } from "@/services/users"

export type PaymentMethod = "PIX" | "CREDIT_CARD" | "DEBIT_CARD"

export type CheckoutPayload = {
  userId: number
  productIds: number[]
  amount: number
  paymentMethod: PaymentMethod
}

export type CheckoutResponse = {
  orderId: number
  status: string
  paymentLink?: string | null
  invoiceUrl?: string | null
  pixQrCodeImage?: string | null
  pixQrCodeImageUrl?: string | null
  pixQrCodeBase64?: string | null
  pixQrCode?: string | null
  pixCopyPaste?: string | null
  qrCodeImage?: string | null
  qrCodeBase64?: string | null
  qrCode?: string | null
}

export const orderApi = axios.create({
  baseURL: "http://localhost:8083/api/v1",
})

orderApi.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }
  return config
})

export async function checkoutOrder(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  const { data } = await orderApi.post<CheckoutResponse>(
    "/orders/checkout",
    payload
  )
  return data
}
