"use client";

import React from 'react'
import { Dog } from '@prisma/client'
import { Card, CardFooter, Image } from '@nextui-org/react'
import Link from 'next/link'
import { calculateAge, transformImageUrl } from '@/lib/util'
import LikeButton from '@/components/LikeButton'
import PresenceDot from "@/components/PresenceDot"

type Props = {
  dog: Dog,
  likeIds: string[]
}

export default function DogCard({ dog, likeIds }: Props) {
  const hasLiked = likeIds.includes(dog.userId);

  function preventLinkAction(e: React.MouseEvent) {
    e.preventDefault(); 
    e.stopPropagation(); // prevents the click into the Dog's profile
  }

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
        src={transformImageUrl(dog.image) || 'images/user.png'}
        className='aspect-square object-cover'
      />

      {/* Like Button */}
      <div onClick={preventLinkAction}>
        <div className='absolute top-3 right-3 z-50'>
          <LikeButton targetUserId={dog.userId} hasLiked={hasLiked} />
        </div>
        <div className="absolute top-2 left-3 z-50">
          <PresenceDot dog={dog}/>
        </div>
      </div>
      
      
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
