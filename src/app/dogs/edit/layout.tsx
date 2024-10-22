import { getDogByUserId } from '@/app/actions/dogActions'
import React, { ReactNode } from 'react'
import DogSideBar from '../DogSideBar';
import { notFound } from 'next/navigation';
import { Card } from '@nextui-org/react';
import { getAuthUserId } from '@/app/actions/authActions';

export default async function Layout({ children }: 
    {children: ReactNode }) {
  
  const userId = await getAuthUserId();
  if (!userId) {
    return notFound();
  }

  const dog = await getDogByUserId(userId);
  if (!dog) { 
    return notFound();
  }

  const basePath = `/dogs/edit`;

  const navLinks = [
    {name: 'Edit Profile', href: `${basePath}`},
    {name: 'Update Photos', href: `${basePath}/photos`},
  ];

  return (
    <div className='grid grid-cols-12 gap-5 h-[80vh]'>
      <div className='col-span-3'>
        <DogSideBar dog={dog} navLinks={navLinks}/>
      </div>
      <div className='col-span-9'>
        <Card className='w-full mt-10 h-[80vh]'>
          {children}
        </Card>
      </div>
    </div>
  )
}
