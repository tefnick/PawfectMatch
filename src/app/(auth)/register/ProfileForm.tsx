"use client";

import { Input, Radio, RadioGroup, Select, SelectItem, Switch, Textarea } from '@nextui-org/react';
import { useFormContext } from 'react-hook-form';
import React, { useState } from 'react'
import { format, subYears } from 'date-fns';
import { dogBreedSelectOptions } from '@/lib/dogBreedData';

export default function ProfileForm() {
  const { register, getValues, setValue, formState: { errors } } = useFormContext();
  const [akcRegistered, setAkcRegistered] = useState(false);

  const genderList = [
    {label: "Male", value: "male"},
    {label: "Female", value: "female"}
  ];

  const handleAkcRegisteredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("toggle change")
    console.log(e.target.value)
    setAkcRegistered(prev => !prev)
    setValue("akcRegistered", e.target.value)
    console.log(akcRegistered)
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <Select
          defaultSelectedKeys={getValues("gender")}
          label="Gender"
          aria-label='Select Gender'
          variant='bordered'
          {...register('gender')}
          isInvalid={!!errors.gender} // !! is a double negation to convert to boolean
          errorMessage={errors.gender?.message as string}
          onChange={e => setValue("gender", e.target.value)}
        >
          {genderList.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          defaultSelectedKeys={getValues("breed")}
          label="Breed"
          aria-label='Select Breed'
          variant='bordered'
          {...register('breed')}
          isInvalid={!!errors.breed} // !! is a double negation to convert to boolean
          errorMessage={errors.breed?.message as string}
          onChange={e => setValue("breed", e.target.value)}
        >
          {dogBreedSelectOptions.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          defaultValue={getValues("dateOfBirth")}
          label="Date of birth"
          // max={format(subYears(new Date(), 18), "yyyy-MM-dd")}
          type='date'
          variant='bordered'
          {...register('dateOfBirth')}
          isInvalid={!!errors.dateOfBirth} // !! is a double negation to convert to boolean
          errorMessage={errors.dateOfBirth?.message as string}
        />
        <Textarea
          defaultValue={getValues("description")}
          label="Description"
          variant='bordered'
          {...register('description')}
          
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message as string}
        />
        <Input
          defaultValue={getValues("city")}
          label="City"
          variant='bordered'
          {...register('city')}
          isInvalid={!!errors.city} // !! is a double negation to convert to boolean
          errorMessage={errors.city?.message as string}
        />
        <Input
          defaultValue={getValues("country")}
          label="Country"
          variant='bordered'
          {...register('country')}
          isInvalid={!!errors.country} // !! is a double negation to convert to boolean
          errorMessage={errors.country?.message as string}
        />
        <div>
          <p className='text-medium mb-2'>AKC Registered</p>
          <Switch 
            {...register("akcRegistered")}
            color='secondary'
            defaultSelected={false}
            size='lg'
            onChange={e => setValue("akcRegistered", e.target.checked)}
          />  
        </div>
      </div>
    </div>
  )
}
