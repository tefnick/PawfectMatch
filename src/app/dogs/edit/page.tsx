import { CardHeader, CardBody } from '@nextui-org/react'
import type { Dog } from '@prisma/client';
import React from 'react'
import Editform from './Editform';
import { getDogByUserId } from '@/app/actions/dogActions';
import { getAuthUserId } from '@/app/actions/authActions';
import { notFound } from 'next/navigation';
import CardInnerWrapper from '@/components/CardInnerWrapper';

export default async function DogEditPage() {

  const userId = await getAuthUserId(); // get currently logged in user
  
  if (!userId) return notFound();
  
  const dog = await getDogByUserId(userId); // get dog profile by currently logged in user id
  
  if (!dog) return notFound();

  return (
    <>
      <CardInnerWrapper 
        header="Edit Profile"
        body= {
          <Editform dog={dog} />
        }
      />
    </>
  )
}
