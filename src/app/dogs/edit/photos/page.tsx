import { CardHeader, CardBody, Image } from '@nextui-org/react'
import React from 'react'
import Editform from '../Editform'
import { getAuthUserId } from '@/app/actions/authActions'
import { getDogByUserId, getDogPhotosByUserId } from '@/app/actions/dogActions';
import StarButton from '@/components/StarButton';
import DeleteButton from '@/components/DeleteButton';
import ImageUploadButton from '@/components/ImageUploadButton';
import DogPhotoUpload from './DogPhotoUpload';
import DogImage from '@/components/DogImage';
import DogPhotos from '@/components/DogPhotos';
import CardInnerWrapper from '@/components/CardInnerWrapper';

export default async function EditPhotosPage() {
  const userId = await getAuthUserId() as string;
  const dog = await getDogByUserId(userId)
  const photos = await getDogPhotosByUserId(userId);
  return (
    <>
      <CardInnerWrapper 
        header="Edit Photos"
        body={
          <DogPhotos photos={photos} mainImageUrl={dog?.image} editing/>
        }
      />
    </>
  )
}
