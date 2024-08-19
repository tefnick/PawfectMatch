'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Photo } from "@prisma/client";

export async function getDogs() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    return prisma.dog.findMany({
      where: {
        NOT: { 
          userId: session.user.id
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getDogByUserId(userId: string) {
  try {
    return prisma.dog.findUnique({
      where: {
        userId
      }
    })
  } catch (error) {
    console.log(error);
  }
}

export async function getDogPhotosByUserId(userId: string) {
  const dog = await prisma.dog.findUnique({
    where: {
      userId
    },
    select: { // "includes" would work also but would do a `select * from dog` and also include photos, we only want photos
      photos: true,
    }
  })

  if (!dog) return null;

  return dog.photos.map(p => p) as Photo[];
}