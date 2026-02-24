import type { RequestHandler } from 'express';
import z, { ZodType } from 'zod';

export const validateHeaders =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse({
      authorization: req.header('authorization') ?? '',
    });

    if (!parsed.success) {
      return next({
        type: 'Unauthorized',
        message: 'Missing or invalid Authorization header',
        details: z.treeifyError(parsed.error),
      });
    }

    res.locals.auth = parsed.data;
    return next();
  };