import { z } from "zod";

export const dogEditSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  hobbies: z.string().array().nullable(), 
  description: z.string().min(1, {
    message: "Description is required",
  }),
  city: z.string().min(1, {
    message: "City is required"
  }),
  country: z.string().min(1, {
    message: "Country is required"
  }),
});

export type DogEditSchema = z.infer<typeof dogEditSchema>;