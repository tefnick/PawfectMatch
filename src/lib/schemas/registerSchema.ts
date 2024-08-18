import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 
    {
      message: 'Name must be at least 2 characters'
    }
  ),
  email: z.string().email(
    { 
      message: 'Please enter a valid email address'
    }
  ), 
  password: z.string().min(8, 
    {
      message: 'Password must be at least 8 characters'
    }
  ),
});

export type RegisterSchema = z.infer<typeof registerSchema>