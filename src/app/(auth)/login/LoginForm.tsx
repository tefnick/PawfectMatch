'use client'

import { signInUser } from '@/app/actions/authActions'
import { LoginSchema, loginSchema } from '@/lib/schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'
import { toast } from 'react-toastify'

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isLoading, isValid, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  })

  const onSubmit = async (data: LoginSchema) => {
    const result = await signInUser(data);

    if (result.status === 'success') {
      router.push('/members')
      router.refresh();
    } else {
      console.log(result.error) //TODO: use toast message later
      toast.error(result.error as string);
    }
  }

  return (
    <Card className='md:w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'> 
        <div className='flex flex-col gap-2 items-center text-primary'>
          <div className='flex flex-row items-center gap-3'>
            <GiPadlock size={30} />
            <h1 className='text-3xl font-semibold'>Login</h1>
          </div>
          <p className='text-neutral-500'>Welcome back to Pawfect Match!</p>
        </div>
      </CardHeader>
      <CardBody >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <Input
              label="Email" 
              variant='bordered' 
              {...register('email')}
              defaultValue =''
              isInvalid = { !!errors.email } // !! is a double negation to convert to boolean
              errorMessage = { errors.email?.message as string }
            />
            <Input 
              label="Password" 
              type='password'
              variant='bordered'
              {...register('password')}
              defaultValue=''
              isInvalid = { !!errors.password }
              errorMessage = { errors.password?.message as string }
            />
            <Button isLoading={isSubmitting} isDisabled={!isValid} fullWidth color="primary" type='submit'>
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
