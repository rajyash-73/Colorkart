import { z } from "zod";

export type User = {
  id: number;
  username: string;
  password: string;
};

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;