'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Photo } from "@prisma/client";
import { UserFilters } from "@/types";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";

export async function getDogs(searchParams: UserFilters) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const ageRange = searchParams?.ageRange?.toString()?.split(",") || [0, 20] // default age range
  const currentDate = new Date();
  const minDob = addYears(currentDate, -ageRange[1] - 1); // -1 to account if birthday already happened this year
  const maxDob = addYears(currentDate, -ageRange[0]); // no -1 to be inclusive of the min age

  const orderBySelector = searchParams?.orderBy || "updatedAt";

  const selectedGender = searchParams?.gender?.toString()?.split(",") || ["male", "female"];

  try {
    return prisma.dog.findMany({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } }
        ],
        NOT: { 
          userId: session.user.id
        }
      },
      orderBy: { [String(orderBySelector)]: 'desc' }
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

export async function updateLastActive() {
  const userId = await getAuthUserId();

  try {
    return prisma.dog.update({
      where: { userId },
      data: { updatedAt: new Date() }
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}