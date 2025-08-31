import { getDogPhotosByUserId } from "@/app/actions/dogActions";
import { CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import DogPhotos from "@/components/DogPhotos";

export default async function PhotosPage({
  params,
}: {
  params: { userId: string };
}) {
  const photos = await getDogPhotosByUserId(params.userId);
  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Photos
      </CardHeader>
      <Divider />
      <CardBody>
        <DogPhotos photos={photos} />
      </CardBody>
    </>
  );
}
