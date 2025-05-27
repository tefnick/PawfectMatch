"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";

/**
 * Toggle like status for a dog.
 * @param targetUserId the ID of the user whose dog is being liked or unliked
 * @param isLiked if the dog is already liked by the current user
 */
export async function toggleLikeDog(targetUserId: string, isLiked: boolean) {
  try {
    const loggedInUserId = await getAuthUserId();

    if (!loggedInUserId) {
      throw new Error("Not authorized");
    }

    if (isLiked) { // if the dog is already liked, delete the like
      await prisma.like.delete({
          where: {
            sourceUserId_targetUserId: {
              sourceUserId: loggedInUserId,
              targetUserId: targetUserId
            }
          }
        })
    } else { // otherwise if the dog is not liked, create a new like
      await prisma.like.create({
        data: {
          sourceUserId: loggedInUserId,
          targetUserId: targetUserId
        }
      })
    }
  } catch (error) {
    console.error(error);;
  }
}

/**
 * Fetch the IDs of users that the current user has liked.
 * @returns an array of user IDs that the current user has liked
 */
export async function fetchCurrentUserLikeIds() {
  try {
    const loggedInUserId = await getAuthUserId();
    const likeIds = await prisma.like.findMany({
      where: {
        sourceUserId: loggedInUserId
      }, 
      select: {
        targetUserId: true
      }
    })

    return likeIds.map(like => like.targetUserId);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchLikedDogs(type = 'source') {
  try {
    const userId = await getAuthUserId();

    switch (type) {
      case 'source':
        return await fetchSourceLikes(userId);
      case 'target':
        return await fetchTargetLikes(userId);
      case 'mutual':
        return await fetchMutualLikes(userId);
      default:
        return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchSourceLikes(userId: string | undefined) {
  const sourceList = await prisma.like.findMany({
    where: {
      sourceUserId: userId
    },
    select: {
      targetDog: true
    }
  })
  return sourceList.map(like => like.targetDog); // return the list of dogs that the user has liked w/o the user info w/ it
}
async function fetchTargetLikes(userId: string | undefined) {
  const targetList = await prisma.like.findMany({
    where: {
      targetUserId: userId
    },
    select: {
      sourceDog: true
    }
  })
  return targetList.map(like => like.sourceDog);
}

async function fetchMutualLikes(userId: string | undefined) {
  const myLikedUsers = await prisma.like.findMany({
    where: {
      sourceUserId: userId
    },
    select: {
      targetUserId: true
    }
  });

  const myLikedIds = myLikedUsers.map(like => like.targetUserId);

  const mutualLikesList = await prisma.like.findMany({
    where: {
      AND: [
        {
          targetUserId: userId // where target is the current userId (i.e. who liked me)
        },
        {
          sourceUserId: { // where the source is the current userId (i.e. who I liked)
            in: myLikedIds
          }
        }
      ]
    },
    select: {
      sourceDog: true
    }
  })

  return mutualLikesList.map(like => like.sourceDog);
}

