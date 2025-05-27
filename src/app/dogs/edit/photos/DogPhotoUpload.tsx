"use client";

import { addImage } from '@/app/actions/userActions';
import ImageUploadButton from '@/components/ImageUploadButton'
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'react-toastify';

export default function DogPhotoUpload() {
  const router = useRouter();

  // handler for when an image uploaded
  const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === 'object') {
      await addImage(result.info.secure_url, result.info.public_id);
      router.refresh();
      toast.success('Nice photo, lookin good!');
    } else {
      toast.error("Oh no! There was a problem uploading your image");
    }
  }

  return (
    <div>
      <ImageUploadButton onUploadImage={onAddImage}/>
    </div>  
  )
}