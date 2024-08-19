import React from 'react'
import { Dog } from '@prisma/client'
import { Card, CardFooter, Image } from '@nextui-org/react'
import Link from 'next/link'
import { calculateAge } from '@/lib/util'

type Props = {
  dog: Dog
}

export default function DogCard({ dog }: Props) {
  return (
    <Card fullWidth
      as={Link}
      href={`/dogs/${dog.userId}`}
      isPressable
    >
      <Image 
        isZoomed
        alt={dog.name}
        width={300}
        src={dog.image || 'images/user.png'}
        className='aspect-square object-cover'
      />
      <CardFooter className='flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient'>
        <div className='flex flex-col text-white '>
          <span className='font-semibold'>{dog.name}, {calculateAge(dog.dateOfBirth) || 'Unknown Age'}</span>
          <span className='font-semibold'>{dog.breed}</span>
          <span className='text-sm'>{dog.city}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
