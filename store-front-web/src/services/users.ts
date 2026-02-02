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

export const userApi = axios.create({
  baseURL: "http://localhost:8081/api/v1",
})

export async function createUser(payload: CreateUserPayload): Promise<UserResponse> {
  const { data } = await userApi.post<UserResponse>("/users", payload)
  return data
}

export async function loginUser(payload: LoginPayload): Promise<void> {
  await userApi.post("/login", payload)
}
