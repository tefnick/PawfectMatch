"use client";

import React, { useState } from "react";
import DogImage from "./DogImage";
import StarButton from "./StarButton";
import DeleteButton from "./DeleteButton";
import { Photo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { deleteImage, setMainImage } from "@/app/actions/userActions";
import { toast } from "react-toastify";
import { unknown } from "zod";
import EmptyState from "@/components/EmptyState";

type Props = {
  photos: Photo[] | null;
  editing?: boolean;
  mainImageUrl?: string | null;
};

export default function DogPhotos({ photos, editing, mainImageUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState({
    type: "",
    isLoading: false,
    id: "",
  });

  async function onSetMain(photo: Photo) {
    if (photo.url === mainImageUrl) return null;
    setLoading({ isLoading: true, id: photo.id, type: "main" });
    try {
      await setMainImage(photo);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading({ isLoading: false, id: "", type: "" });
    }

    router.refresh(); // refresh UI
    setLoading({ isLoading: false, id: "", type: "" });
  }

  const onDelete = async (photo: Photo) => {
    if (photo.url === mainImageUrl) return null;
    setLoading({ isLoading: true, id: photo.id, type: "delete" });
    await deleteImage(photo);
    router.refresh(); // refresh UI
    setLoading({ isLoading: false, id: "", type: "" });
  };

  return (
    <>
      {photos?.length === 0 && (
        <EmptyState
          customText="There are no more photos to review"
          customBodyText="Good Job! How about a nap?"
        />
      )}
      <div className="grid grid-cols-5 gap-3 p-5">
        {photos &&
          photos.map((photo) => (
            <div key={photo.id} className="relative">
              <DogImage photo={photo} />
              {editing && (
                <>
                  <div
                    onClick={() => onSetMain(photo)}
                    className="absolute top-3 left-3 z-50"
                  >
                    <StarButton
                      selected={photo.url === mainImageUrl}
                      loading={
                        loading.isLoading &&
                        loading.type === "main" &&
                        loading.id === photo.id
                      }
                    />
                  </div>
                  <div
                    onClick={() => onDelete(photo)}
                    className="absolute top-3 right-3 z-50"
                  >
                    <DeleteButton
                      loading={
                        loading.isLoading &&
                        loading.type === "delete" &&
                        loading.id === photo.id
                      }
                    />
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
