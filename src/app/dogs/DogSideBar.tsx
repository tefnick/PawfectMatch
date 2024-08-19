'use client';

import { calculateAge } from '@/lib/util';
import { Button, Card, CardBody, CardFooter, Divider, Image } from '@nextui-org/react';
import { Dog } from '@prisma/client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

type Props = {
  dog: Dog
}

export default function DogSideBar({ dog }: Props) {
  const pathName = usePathname();
  const basePath = `/dogs/${dog.userId}`;

  const navLinks = [
    {name: 'Profile', href: `${basePath}`},
    {name: 'Photos', href: `${basePath}/photos`},
    {name: 'Chat', href: `${basePath}/chat`}
  ];

  return (
    <Card 
      className='w-full mt-10 items-center h-[80vh]'
    >
      <Image 
        height={200}
        width={200}
        src={dog.image || 'images/user.png'}
        alt='Dog profile main image'
        className='rounded-full mt-6 aspect-square object-cover'
      />
        <CardBody>
          <div className='flex flex-col items-center'>
            <div className='text-2xl'>{dog.name}, {calculateAge(dog.dateOfBirth)}</div>
            <div className='text-xl'>{dog.breed}</div>
          </div>
          <div className='text-sm text-neutral-500 text-center mt-2'>
            {dog.city}, {dog.country}
          </div>
        <Divider className='my-3'/>
        <nav className='flex flex-col p-4 ml-4 text-2xl gap-4'>
          {navLinks.map((link) => (
            <Link 
              href={link.href}
              key={link.name}
              className={`block rounded 
                  ${pathName === link.href ? 'text-secondary' : 'hover:text-secondary/50'}`}
            > 
              {link.name}
            </Link>
          ))}
        </nav>
        </CardBody>
        <CardFooter>
          <Button
            as={Link}
            href='/dogs'
            fullWidth
            color='secondary'
            variant='bordered'
          >
            Go back
          </Button>
        </CardFooter>
    </Card>
  )
}
