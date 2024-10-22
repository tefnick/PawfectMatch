"use client";

import { DogEditSchema, dogEditSchema } from '@/lib/schemas/dogEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { Dog } from '@prisma/client';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

type Props = {
  dog: Dog;
}

export default function Editform({ dog }: Props) {
  const { register, handleSubmit, reset, formState: { isValid, isDirty, isSubmitting, errors } } = useForm<DogEditSchema>({
    resolver: zodResolver(dogEditSchema)
  })

  useEffect(() => {
    if (dog) {
      reset({
        name: dog.name,
        hobbies: dog.hobbies,
        description: dog.description,
        city: dog.city,
        country: dog.country,
      })
    }
  }, [dog, reset])

  const onSubmit = (data: DogEditSchema) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        variant="bordered"
        {...register('name')}
        defaultValue={dog.name}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />

      <Button
        type="submit"
      >
        Save
      </Button>
    </form>
  )
}
