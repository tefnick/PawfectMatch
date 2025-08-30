"use client";

import { Input } from '@nextui-org/react'
import React from 'react'
import { useFormContext } from 'react-hook-form';

export default function UserDetailsForm() {
  const { register, getValues, formState: { errors } } = useFormContext();
  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <Input
          label="Name"
          variant='bordered'
          {...register('name')}
          defaultValue={getValues("name")}
          isInvalid={!!errors.name} // !! is a double negation to convert to boolean
          errorMessage={errors.name?.message as string}
        />
        <Input
          label="Email"
          variant='bordered'
          {...register('email')}
          defaultValue={getValues("email")}
          isInvalid={!!errors.email} // !! is a double negation to convert to boolean
          errorMessage={errors.email?.message as string}
        />
        <Input
          label="Password"
          type='password'
          variant='bordered'
          {...register('password')}
          defaultValue={getValues("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message as string}
        />
      </div>
    </div>
  )
}
