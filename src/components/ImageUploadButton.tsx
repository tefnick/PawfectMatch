"use client";

import React from 'react'
import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { HiPhoto } from 'react-icons/hi2';

type Props = {
  onUploadImage: (result: CloudinaryUploadWidgetResults) => void;
}

export default function ImageUploadButton({onUploadImage}: Props) {
  return (
    <CldUploadButton
      options={{maxFiles: 1}}
      onSuccess={onUploadImage}
      signatureEndpoint='/api/sign-image'
      uploadPreset='pawfect-match-demo'
      className={`flex items-center gap-2 bg-primary 
          text-white rounded-lg py-2 px-4 hover:bg-secondary`}
    >
      <HiPhoto size={28} />
      Upload New Image
    </CldUploadButton>
  )
}
