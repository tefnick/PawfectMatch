import { getDogByUserId } from '@/app/actions/dogActions'
import CardInnerWrapper from '@/components/CardInnerWrapper';
import { CardBody, CardHeader } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function DogDetailedPage({ params }: {params: {userId: string}}) {
  const dog = await getDogByUserId(params.userId);

  if (!dog) {
    return notFound();
  }

  return (
    <>
      <CardInnerWrapper 
        header="Profile" 
        body={<div>{dog.description}</div>}
      />
    </>
  )
}
