"use server";

import { getUserRole } from "@/app/actions/authActions";
import { prisma } from "@/lib/prisma";
import { Photo } from "@prisma/client";
import cloudinary from "cloudinary";

export async function getUnapprovedPhotos() {
  try {
    const role = await getUserRole();

    if (role !== "ADMIN") throw new Error("Forbidden access");

    return prisma.photo.findMany({
      where: {
        isApproved: false,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function approvePhoto(photoId: string) {
  try {
    const role = await getUserRole();

    if (role !== "ADMIN") throw new Error("Forbidden access");

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { dog: { include: { user: true } } },
    });

    if (!photo || !photo.dog || !photo.dog.user) {
      throw new Error("Cannot approve this image");
    }

    const { dog } = photo;

    // if user does not currently have a default image, set to default upon approval
    const userUpdate =
      dog.user && dog.user.image === null ? { image: photo.url } : {};

    // if dog does not currently have a default image, set to default upon approval
    const dogUpdate = dog.image === null ? { image: photo.url } : {};

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: {
          id: dog.userId,
        },
        data: userUpdate,
      });
    }

    return prisma.dog.update({
      where: {
        id: dog.id,
      },
      data: {
        ...dogUpdate,
        photos: {
          update: {
            where: { id: photo.id },
            data: { isApproved: true },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function rejectPhoto(photo: Photo) {
  try {
    const role = await getUserRole();

    if (role !== "ADMIN") throw new Error("Forbidden access");

    if (photo.publicId) {
      // delete from cloudinary bucket
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    return prisma.photo.delete({ where: { id: photo.id } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
