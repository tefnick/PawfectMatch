"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Dog, Photo } from "@prisma/client";
import { GetDogParams, PaginatedResponse, UserFilters } from "@/types";
import { addYears } from "date-fns";
import { getAuthUserId } from "./authActions";
import { image } from "@nextui-org/react";

// refactored to use offset pagination
export async function getDogs({
  ageRange = "0,20",
  gender = "male,female",
  orderBy = "updatedAt",
  pageNumber = "1",
  pageSize = "12",
  withPhoto = "true",
}: GetDogParams): Promise<PaginatedResponse<Dog>> {
  const userId = await getAuthUserId();

  const [minAge, maxAge] = ageRange.split(",");
  const currentDate = new Date();
  const minDob = addYears(currentDate, -maxAge - 1); // -1 to account if birthday already happened this year
  const maxDob = addYears(currentDate, -minAge); // no -1 to be inclusive of the min age

  const selectedGender = gender.split(",");

  const page = parseInt(pageNumber);
  const limit = parseInt(pageSize);

  const skip = (page - 1) * limit;

  try {
    const count = await prisma.dog.count({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } },
          ...(withPhoto === "true" ? [{ image: { not: null } }] : []),
        ],
        NOT: {
          userId,
        },
      },
    });

    const dogs = await prisma.dog.findMany({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } },
          ...(withPhoto === "true" ? [{ image: { not: null } }] : []),
        ],
        NOT: {
          userId,
        },
      },
      orderBy: { [orderBy]: "desc" },
      skip,
      take: limit,
    });

    return {
      items: dogs,
      totalCount: count,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDogByUserId(userId: string) {
  try {
    return prisma.dog.findUnique({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getDogPhotosByUserId(userId: string) {
  const currentUserId = await getAuthUserId();
  const dog = await prisma.dog.findUnique({
    where: {
      userId,
    },
    select: {
      // "includes" would work also but would do a `select * from dog` and also include photos, we only want photos
      photos: {
        where: currentUserId === userId ? {} : { isApproved: true },
      },
    },
  });

  if (!dog) return null;

  return dog.photos as Photo[];
}

export async function updateLastActive() {
  const userId = await getAuthUserId();

  try {
    return prisma.dog.update({
      where: { userId },
      data: { updatedAt: new Date() },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
