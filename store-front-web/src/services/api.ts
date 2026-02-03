import axios from "axios"

export type ApiProduct = {
  id: number | string
  titulo: string
  descricao: string
  fotos?: string[]
  preco: number
  quantidade: number
}

export const api = axios.create({
  baseURL: "http://localhost:8082/api/v1",
})

export async function fetchProducts(): Promise<ApiProduct[]> {
  const { data } = await api.get<ApiProduct[]>("/products")
  return data
}

export async function fetchProductById(
  id: number | string
): Promise<ApiProduct> {
  const { data } = await api.get<ApiProduct>(`/products/${id}`)
  return data
}
