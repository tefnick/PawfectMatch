import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import type { Dog } from '@prisma/client';
import React from 'react'
import Editform from './Editform';
import { getDogByUserId } from '@/app/actions/dogActions';
import { getAuthUserId } from '@/app/actions/authActions';
import { notFound } from 'next/navigation';

export default async function MemberEditPage() { 

  const userId = await getAuthUserId();
  
  if (!userId) return notFound();
  
  const dog = await getDogByUserId(userId);
  
  if (!dog) return notFound();

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'
      > 
        Edit Profile
      </CardHeader>
      <Divider />
      <CardBody>
        <Editform dog={dog} />
      </CardBody>
    </>
  )
}
