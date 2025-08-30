import { z } from "zod";
import { calculateAge } from "../util";

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const profileSchema = z.object({
  gender: z.string().min(1, { message: "gender is required" }),
  breed: z.string().min(1, { message: "breed is required" }),
  description: z.string().min(1, { message: "description is required" }),
  akcRegistered: z.boolean(),
  city: z.string().min(1, { message: "city is required" }),
  country: z.string().min(1, { message: "country is required" }),
  dateOfBirth: z.string().min(1, { message: "date of birth is required" }),
  // .refine(dateString => {
  //   const age = calculateAge(new Date(dateString));
  //   return age >= 18;
  // }, { message: "You must be at least 18 years old to use this app" }),
});

export const combinedRegisteredSchema = registerSchema.and(profileSchema);

export type ProfileSchema = z.infer<typeof profileSchema>;

export type RegisterSchema = z.infer<
  typeof registerSchema & typeof profileSchema
>;
