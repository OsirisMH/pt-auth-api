import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(200),
});

export const refreshSchema = z.object({
  employeeId: z.number().int().positive(),
  refreshToken: z.string().min(20),
});

export const accessValidationSchema = z.object({
  authorization: z
    .string()
    .min(1)
    .regex(/^Bearer\s.+$/i, 'Authorization must be "Bearer <token>"'),

});

export const logoutSchema = refreshSchema;

export type LoginBody = z.infer<typeof loginSchema>;
export type RefreshBody = z.infer<typeof refreshSchema>;
export type LogoutBody = z.infer<typeof logoutSchema>;
export type AccessValidationBody = z.infer<typeof accessValidationSchema>;