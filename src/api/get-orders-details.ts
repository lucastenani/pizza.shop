import { OrderStatus } from '@/components/order-status'
import { api } from '@/lib/axios'

export interface GetOrdersDetailsParams {
  orderId?: string | null
}

export interface GetOrdersDetailsResponse {
  status: OrderStatus
  id: string
  createdAt: string
  totalInCents: number
  customer: {
    name: string
    email: string
    phone: string | null
  }
  orderItems: {
    id: string
    priceInCents: number
    quantity: number
    product: { name: string }
  }[]
}

export async function getOrdersDetails({ orderId }: GetOrdersDetailsParams) {
  const response = await api.get<GetOrdersDetailsResponse>(
    `/orders/${orderId}`,
    {
      params: {
        orderId,
      },
    },
  )

  return response.data
}
