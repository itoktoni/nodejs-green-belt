import { z } from 'zod';

export const transactionSchema = z.object({
  account: z.string(),
  deposit: z.number(),
});

export const userLoginSchema = z.object({
  account: z.string().length(9),
  password: z.string(),
});