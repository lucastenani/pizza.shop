export type OrderStatus =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

interface OrderStatusProps {
  status: OrderStatus
}

const orderStatusMap: Record<OrderStatus, string> = {
  canceled: 'bg-rose-500',
  delivered: 'bg-emerald-500',
  delivering: 'bg-amber-400',
  pending: 'bg-slate-400',
  processing: 'bg-amber-400',
}

export function OrderStatus(status: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${orderStatusMap[status.status]}`}
      />
      <span className="font-medium capitalize text-muted-foreground">
        {status.status}
      </span>
    </div>
  )
}
