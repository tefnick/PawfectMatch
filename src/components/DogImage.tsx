"use client";

import React from "react";
import { Photo } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import { Button, Image } from "@nextui-org/react";
import clsx from "clsx";
import { useRole } from "@/app/hooks/useRole";
import { ImCheckmark, ImCross } from "react-icons/im";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { approvePhoto, rejectPhoto } from "@/app/actions/adminActions";

type Props = {
  photo: Photo | null;
};

export default function DogImage({ photo }: Props) {
  const role = useRole();
  const router = useRouter();

  if (!photo) return null;

  const approve = async (photoId: string) => {
    try {
      await approvePhoto(photoId);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.error(error);
    }
  };

  const reject = async (photo: Photo) => {
    try {
      await rejectPhoto(photo);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <div>
      {photo?.publicId ? (
        <CldImage
          alt="Image of dog"
          src={photo.publicId} // since using a cloudinary component, we use the publicId directly
          width={300}
          height={300}
          crop="fill"
          gravity="face"
          className={clsx("rounded-2xl", {
            "opacity-40": !photo.isApproved && role !== "ADMIN",
          })}
          priority
        />
      ) : (
        <Image
          height={208}
          width={220}
          src={photo?.url || "/images/user.png"}
          alt="Image of dog"
        />
      )}
      {!photo?.isApproved && role !== "ADMIN" && (
        <div className="absolute bottom-2 w-full bg-slate-200 p-1">
          <div className="flex justify-center text-danger font-semibold">
            Awaiting approval
          </div>
        </div>
      )}
      {role === "ADMIN" && (
        <div className={"flex flex-row gap-2 mt-2"}>
          <Button
            color={"success"}
            variant={"shadow"}
            fullWidth
            onClick={() => approve(photo.id)}
          >
            <ImCheckmark size={20} /> Approve
          </Button>
          <Button
            color={"danger"}
            variant={"shadow"}
            fullWidth
            onClick={() => reject(photo)}
          >
            <ImCross size={20} /> Deny
          </Button>
        </div>
      )}
    </div>
  );
}
