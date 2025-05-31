import { getDogPhotosByUserId } from '@/app/actions/dogActions'
import CardInnerWrapper from '@/components/CardInnerWrapper';
import { CardBody, CardHeader, Image } from '@nextui-org/react'
import React from 'react'

export default async function PhotosPage({ params }: { params: { userId: string } }) {
  const photos = await getDogPhotosByUserId(params.userId);
  return (
    <>
      <CardInnerWrapper
        header='Photos'
        body={
          <div className='grid grid-cols-5 gap-3'>
            {photos && photos.map((photo) => (
              <div key={photo.id}>
                <Image 
                  width={300}
                  height={300}
                  src={photo.url}
                  alt='Image of dog'
                  className='object-cover aspect-square'
                />
              </div>
            ))}
          </div>
        }
      />
    </>
  )
}
