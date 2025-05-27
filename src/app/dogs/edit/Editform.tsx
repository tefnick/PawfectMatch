"use client";

import { updateDogProfile } from '@/app/actions/userActions';
import { DogEditSchema, dogEditSchema } from '@/lib/schemas/dogEditSchema';
import { handleFormServerErrors } from '@/lib/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@nextui-org/react';
import { Dog } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
  dog: Dog;
}

export default function Editform({ dog }: Props) {
  const router = useRouter();
  const { register, handleSubmit, reset, setError,
    formState: { isValid, isDirty, isSubmitting, errors }
  } =
    useForm<DogEditSchema>({
      resolver: zodResolver(dogEditSchema),
      mode: 'onTouched'
    })

  useEffect(() => {
    if (dog) {
      reset({
        name: dog.name,
        description: dog.description,
        city: dog.city,
        country: dog.country,
        //hobbies: dog.hobbies
      })
    }
  }, [dog, reset])

  const onSubmit = async (data: DogEditSchema) => {
    const nameUpdated = data.name !== dog.name; //check if name has changed
    const result = await updateDogProfile(data, nameUpdated)

    if (result.status === "success") {
      toast.success('Profile Updated!');
      router.refresh()
      reset({...data}) //reset all default field values and mark them as not dirty
    } else {
      handleFormServerErrors(result, setError)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
      <Input
        label="Name"
        variant="bordered"
        {...register('name')}
        defaultValue={dog.name}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      {/* <Input 
        label="hobbies"
        variant='bordered'
        {...register('hobbies')}
        defaultValue={dog.hobbies.toString()}
        isInvalid={!!errors.hobbies}
        errorMessage={errors.hobbies?.message}
      /> */}
      <Textarea 
        label="Description"
        variant='bordered'
        {...register('description')}
        defaultValue={dog.description}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        minRows={6}
      />
      <div className='flex flex-row gap-3'>
        <Input
          label="City"
          variant="bordered"
          {...register('city')}
          defaultValue={dog.city}
          isInvalid={!!errors.city}
          errorMessage={errors.city?.message}
        />

        <Input
          label="Country"
          variant="bordered"
          {...register('country')}
          defaultValue={dog.country}
          isInvalid={!!errors.country}
          errorMessage={errors.country?.message}
        />
      </div>

      {errors.root?.serverError && (
          <p className='text-danger text-sm'>{errors.root?.serverError.message}</p>
        )
      }

      <Button
        type="submit"
        className='flex self-end'
        variant='solid'
        isDisabled={!isValid || !isDirty}
        isLoading={isSubmitting}
        color='secondary'
      >
        Update Profile
      </Button>
    </form>
  )
}
