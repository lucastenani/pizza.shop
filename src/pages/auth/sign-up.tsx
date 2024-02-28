import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerRestaurant } from '@/api/register-restaurant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signUpForm = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

type SignUpFormInputs = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormInputs>()

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  })

  async function handleSignUp({
    email,
    managerName,
    phone,
    restaurantName,
  }: SignUpFormInputs) {
    try {
      await registerRestaurantFn({ email, managerName, phone, restaurantName })

      toast.success('Restaurant successfully registered', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${email}`),
        },
      })
    } catch (error) {
      toast.error('Error when registering restaurant')
    }
  }

  return (
    <>
      <Helmet title="Register" />
      <div className="p-8">
        <Button className="absolute right-4 top-8" variant={'ghost'} asChild>
          <Link to={'/sign-in'}>Login</Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create a free account
            </h1>
            <p className="text-sm text-muted-foreground">
              Become a partner and start your sales
            </p>
          </div>
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant name</Label>
              <Input
                id="restaurantName"
                type="text"
                {...register('restaurantName')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerName">Your name</Label>
              <Input
                id="managerName"
                type="text"
                {...register('managerName')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Your phone</Label>
              <Input id="phone" type="tel" {...register('phone')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your email</Label>
              <Input id="email" type="email" {...register('email')} required />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Finish registration
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              By continuing you agree to{' '}
              <a className="underline underline-offset-4" href="#">
                our terms
              </a>{' '}
              and{' '}
              <a className="underline underline-offset-4" href="#">
                service policies
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
