import axios from "axios"

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
}

export const orderApi = axios.create({
  baseURL: "http://localhost:8083/api/v1",
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
