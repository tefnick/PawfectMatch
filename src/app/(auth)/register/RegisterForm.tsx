'use client'

import { registerUser } from '@/app/actions/authActions'
import { registerSchema, RegisterSchema } from '@/lib/schemas/registerSchema'
import { handleFormServerErrors } from '@/lib/util'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import { error } from 'console'
import React from 'react'
import { useForm } from 'react-hook-form'
import { GiPadlock } from 'react-icons/gi'

export default function RegisterForm() {
  const { register, handleSubmit, setError, formState: { errors, isValid, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched'
  })

  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data);
    if (result.status === 'success')  {
      console.log('User registered successfully') //TODO: add more logic, email verification etc.
    } else {
      handleFormServerErrors(result, setError)
    }
  }

  return (
    <Card className='md:w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'> 
        <div className='flex flex-col gap-2 items-center text-primary'>
          <div className='flex flex-row items-center gap-3'>
            <GiPadlock size={30} />
            <h1 className='text-3xl font-semibold'>Register</h1>
          </div>
          <p className='text-neutral-500'>Welcome to Pawfect Match!</p>
        </div>
      </CardHeader>
      <CardBody >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
          <Input
              label="Name" 
              variant='bordered' 
              {...register('name')}
              defaultValue =''
              isInvalid = { !!errors.name } // !! is a double negation to convert to boolean
              errorMessage = { errors.name?.message }
            />
            <Input
              label="Email" 
              variant='bordered' 
              {...register('email')}
              defaultValue =''
              isInvalid = { !!errors.email } // !! is a double negation to convert to boolean
              errorMessage = { errors.email?.message }
            />
            <Input 
              label="Password" 
              type='password'
              variant='bordered'
              {...register('password')}
              defaultValue=''
              isInvalid = { !!errors.password }
              errorMessage = { errors.password?.message }
            />
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root?.serverError.message}</p>
            )}
            <Button isLoading={isSubmitting} isDisabled={!isValid} fullWidth color="primary" type='submit'>
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
