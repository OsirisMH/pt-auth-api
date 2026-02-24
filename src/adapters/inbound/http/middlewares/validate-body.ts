import type { RequestHandler } from 'express';
import z, { ZodType } from 'zod';

export const validateBody = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next({ type: 'BadRequest', message: 'Invalid request body', details: z.treeifyError(parsed.error) });
  }
  req.body = parsed.data;
  next();
};
