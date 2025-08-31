import { PrismaClient } from "@prisma/client";
import { dogsSeedData } from "./dogdata";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient(); // use seperate prisma client for seeding as it will run outside our app

async function seedData() {
  return dogsSeedData.map(async (dog) => {
    await prisma.user.create({
      data: {
        email: dog.email,
        emailVerified: new Date(),
        name: dog.name,
        passwordHash: await bcrypt.hash("password", 10),
        image: dog.image,
        profileComplete: true,
        dog: {
          create: {
            dateOfBirth: new Date(dog.dateOfBirth),
            gender: dog.gender,
            breed: dog.breed,
            name: dog.name,
            createdAt: new Date(dog.created),
            updatedAt: new Date(dog.lastActive),
            description: dog.description,
            city: dog.city,
            country: dog.country,
            image: dog.image,
            photos: {
              create: {
                url: dog.image,
                isApproved: true,
              },
            },
          },
        },
      },
    });
  });
}

async function seedAdmin() {
  return prisma.user.create({
    data: {
      email: "admin@test.com",
      emailVerified: new Date(),
      name: "Admin",
      passwordHash: await bcrypt.hash("password", 10),
      role: "ADMIN",
    },
  });
}

/**
 * Main function below will be used as a wrapper function in case
 * we need more seed data functions to call at once
 */
async function main() {
  await seedData();
  await seedAdmin();
  console.log("Data seeded successfully");
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1); // exit with error code if seeding fails
  })
  .finally(async () => await prisma.$disconnect()); // disconnect from db after seeding data
