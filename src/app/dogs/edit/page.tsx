import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import type { Dog } from '@prisma/client';
import React from 'react'
import Editform from './Editform';
import { getDogByUserId } from '@/app/actions/dogActions';
import { getAuthUserId } from '@/app/actions/authActions';
import { notFound } from 'next/navigation';

export default async function DogEditPage() {

  const userId = await getAuthUserId(); // get currently logged in user
  
  if (!userId) return notFound();
  
  const dog = await getDogByUserId(userId); // get dog profile by currently logged in user id
  
  if (!dog) return notFound();

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>Edit Profile</CardHeader>
      <Divider />
      <CardBody>
        <Editform dog={dog} />
      </CardBody>
    </>
  )
}
