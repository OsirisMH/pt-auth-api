import type { NextFunction, Request, Response } from "express";
import { env } from "../../../../config/env";

export function ensureInternal(req: Request, res: Response, next: NextFunction) {
  if (req.header('x-internal-auth') !== env.INTERNAL_AUTH_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}