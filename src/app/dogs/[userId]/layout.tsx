import { getDogByUserId } from '@/app/actions/dogActions'
import React, { ReactNode } from 'react'
import DogSideBar from '../DogSideBar';
import { notFound } from 'next/navigation';
import { Card } from '@nextui-org/react';

export default async function Layout({ children, params }: 
    {children: ReactNode, params: {userId: string}}) {
  const dog = await getDogByUserId(params.userId);
  if (!dog) return notFound();

  return (
    <div className='grid grid-cols-12 gap-5 h-[80vh]'>
      <div className='col-span-3'>
        <DogSideBar dog={dog}/>
      </div>
      <div className='col-span-9'>
        <Card className='w-full mt-10 h-[80vh]'>
          {children}
        </Card>
      </div>
    </div>
  )
}
