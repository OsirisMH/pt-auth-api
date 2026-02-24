import type { Request, Response, NextFunction } from 'express';
import {
  InvalidCredentialsError,
  UserInactiveError,
  RefreshTokenExpiredError,
  RefreshTokenInvalidError,
} from '../../../../core/application/errors/auth.errors';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Zod/validateBody
  if (typeof err === 'object' && err !== null && 'type' in err) {
    const e = err as any;
    if (e.type === 'BadRequest') return res.status(400).json({ message: e.message, details: e.details });
  }

  if (err instanceof InvalidCredentialsError) return res.status(401).json({ message: err.message });
  if (err instanceof UserInactiveError) return res.status(403).json({ message: err.message });
  if (err instanceof RefreshTokenInvalidError) return res.status(401).json({ message: err.message });
  if (err instanceof RefreshTokenExpiredError) return res.status(401).json({ message: err.message });

  console.error(JSON.stringify(err));
  return res.status(500).json({ message: 'Internal server error' });
};