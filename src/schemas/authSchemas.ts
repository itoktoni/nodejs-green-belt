import { z } from 'zod';

export const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
  account: z.string().length(9),
  password: z.string(),
});