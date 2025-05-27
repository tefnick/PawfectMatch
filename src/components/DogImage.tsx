"use client";

import React from 'react'
import { Photo } from '@prisma/client'
import { CldImage } from 'next-cloudinary';
import { Image } from '@nextui-org/react'

type Props = {
  photo: Photo | null;
}

export default function DogImage({photo}: Props) {
  return (
    <div>
      { photo?.publicId ? (
        <CldImage 
          alt='Image of dog'
          src={photo.publicId} // since using a cloudinary component, we use the publicId directly
          width={300}
          height={300}
          crop='fill'
          gravity='face'
          className='rounded-2xl'
          priority
        />
      ) : (
        <Image 
            height={208}
            width={220}
            src={photo?.url || '/images/user.png'}
            alt='Image of dog'
        />
      )}
    </div>
  )
}
