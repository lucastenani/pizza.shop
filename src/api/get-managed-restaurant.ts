import { api } from '@/lib/axios'

export interface GetManagedRestaurantResponse {
  id: string
  name: string
  description: string | null
  managerID: string | null
  cratedAt: Date | null
  updatedAt: Date | null
}

export async function getManagedRestaurant() {
  const response = await api.get<GetManagedRestaurantResponse>(
    '/managed-restaurant',
  )

  return response.data
}
