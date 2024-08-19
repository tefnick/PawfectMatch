import { getDogByUserId } from '@/app/actions/dogActions'
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function DogDetailedPage({ params }: {params: {userId: string}}) {
  const dog = await getDogByUserId(params.userId);

  if (!dog) {
    return notFound();
  }

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>Profile</CardHeader>
      <Divider />
      <CardBody>
        {dog.description}
      </CardBody>
    </>
  )
}
