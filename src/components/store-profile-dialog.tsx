import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getManagedRestaurant,
  GetManagedRestaurantResponse,
} from '@/api/get-managed-restaurant'
import { updateProfile } from '@/api/update-profile'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const storeProfileSchema = z.object({
  name: z.string(),
  description: z.string(),
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()

  const { data: restaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      description: restaurant?.description ?? '',
      name: restaurant?.name ?? '',
    },
  })

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onSuccess(_, { description, name }) {
      const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
        'managed-restaurant',
      ])

      cached &&
        queryClient.setQueryData(['managed-restaurant'], {
          ...cached,
          name,
          description,
        })
    },
  })

  async function handleUpdateProfile({
    name,
    description,
  }: StoreProfileSchema) {
    try {
      await updateProfileFn({ name, description })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Store profile</DialogTitle>
        <DialogDescription>
          Update your restaurant information visible to your customer
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Description
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="success" type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
