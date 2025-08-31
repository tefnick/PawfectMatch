"use server";

import { prisma } from "@/lib/prisma";
import { dogEditSchema, DogEditSchema } from "@/lib/schemas/dogEditSchema";
import { ActionResult } from "@/types";
import { Dog, Photo } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { error } from "console";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function updateDogProfile(
  data: DogEditSchema,
  nameUpdated: boolean
): Promise<ActionResult<Dog>> {
  try {
    const userId = await getAuthUserId();
    const validated = dogEditSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.errors };

    const { name, description, city, country } = validated.data; //TODO: implement hobbies later

    if (nameUpdated) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: name },
      });
    }

    const dog = await prisma.dog.update({
      where: {
        userId: userId,
      },
      data: {
        name: name, // syntax can be shortened with just 'name', but adding for clarity
        description: description,
        city: city,
        country: country,
      },
    });

    return {
      status: "success",
      data: dog,
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

/**
 * Persists the uploaded image url, publicId into the db
 * @param url The URL of the image in Cloudinary
 * @param publicId The public ID of the image in Cloudinary
 * @returns
 */
export async function addImage(url: string, publicId: string) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("User not authenticated");

    return prisma.dog.update({
      where: { userId: userId },
      data: {
        photos: {
          create: {
            url: url,
            publicId: publicId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteImage(photo: Photo) {
  try {
    const userId = await getAuthUserId();

    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId); // delete file from cloudinary

      //delete photo record from db
      return prisma.dog.update({
        where: { userId: userId },
        data: {
          photos: {
            delete: { id: photo.id },
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function setMainImage(photo: Photo) {
  if (!photo.isApproved)
    throw new Error("Only approved photos can be set to default image");
  try {
    const userId = await getAuthUserId();

    await prisma.user.update({
      where: { id: userId },
      data: {
        image: photo.url,
      },
    });

    return prisma.dog.update({
      where: { userId: userId },
      data: { image: photo.url },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfoForNav() {
  try {
    const userId = await getAuthUserId();
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
