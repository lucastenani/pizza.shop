import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ArrowRight, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { approveOrder } from '@/api/approve-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliverOrder } from '@/api/deliver-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { GetOrdersResponse } from '@/api/get-orders'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { OrderDetails } from './order-details'

export interface OrderTableRowProps {
  order: {
    orderId: string
    createdAt: string
    status: OrderStatus
    customerName: string
    total: number
  }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { createdAt, customerName, orderId, status, total } = order
  const queryClient = useQueryClient()

  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders'],
    })

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) return

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          return order.orderId === orderId ? { ...order, status } : order
        }),
      })
    })
  }

  const { mutateAsync: cancelOrderFn, isLoading: isCancelingOrder } =
    useMutation({
      mutationFn: cancelOrder,

      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'canceled')
      },
    })

  const { mutateAsync: approveOrderFn, isLoading: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,

      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'processing')
      },
    })

  const { mutateAsync: dispatchOrderFn, isLoading: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,

      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'delivering')
      },
    })

  const { mutateAsync: deliverOrderFn, isLoading: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,

      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, 'delivered')
      },
    })

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Order Details</span>
            </Button>
          </DialogTrigger>

          <OrderDetails orderId={orderId} open={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">{orderId}</TableCell>
      <TableCell className="text-muted-foreground">
        {createdAt &&
          formatDistanceToNow(createdAt, {
            locale: enUS,
            addSuffix: true,
          })}
      </TableCell>
      <TableCell>
        <OrderStatus status={status} />
      </TableCell>
      <TableCell className="font-md">{customerName}</TableCell>
      <TableCell className="font-medium">
        {(total / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </TableCell>
      <TableCell>
        {status === 'pending' && (
          <Button
            disabled={isApprovingOrder}
            variant={'outline'}
            size={'xs'}
            onClick={() => {
              approveOrderFn({ orderId })
            }}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Approve
          </Button>
        )}

        {status === 'processing' && (
          <Button
            disabled={isDispatchingOrder}
            variant={'outline'}
            size={'xs'}
            onClick={() => {
              dispatchOrderFn({ orderId })
            }}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            In delivery
          </Button>
        )}

        {status === 'delivering' && (
          <Button
            disabled={isDeliveringOrder}
            variant={'outline'}
            size={'xs'}
            onClick={() => {
              deliverOrderFn({ orderId })
            }}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Delivered
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          disabled={
            !['pending', 'processing'].includes(order.status) ||
            isCancelingOrder
          }
          variant={'ghost'}
          size={'xs'}
          onClick={() => cancelOrderFn({ orderId })}
        >
          <X className="mr-2 h-3 w-3" />
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  )
}
