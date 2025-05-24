'use server';

import { prisma } from "@/lib/prisma";
import { dogEditSchema, DogEditSchema } from "@/lib/schemas/dogEditSchema";
import { ActionResult } from "@/types";
import { Dog } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { error } from "console";

export async function updateDogProfile(data: DogEditSchema): Promise<ActionResult<Dog>> {
  try {
    const userId = await getAuthUserId()
    const validated = dogEditSchema.safeParse(data);

    if (!validated.success) return { status: "error", "error": validated.error.errors}

    const { name, description, city, country} = validated.data

    const dog = await prisma.dog.update({
      where: {
        userId: userId
      },
      data: {
        name: name,
        description: description,
        city: city,
        country: country
      }
    });

    return { 
        status: "success", 
        data: dog 
    }
  } catch (error) {
    console.log(error)
    return { status: "error", error: "Something went wrong" }
  }
}