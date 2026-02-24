import type { Request, Response, NextFunction } from 'express';
import type { LoginUseCase } from '../../../core/application/use-cases/login.usecase';
import type { RefreshUseCase } from '../../../core/application/use-cases/refresh.usecase';
import type { LogoutUseCase } from '../../../core/application/use-cases/logout.usecase';
import type { ValidateAccessTokenUseCase } from '../../../core/application/use-cases/validate-access-token.usecase';
import type { GetDepartmentsUseCase } from '../../../core/application/use-cases/get-departments';

import type { AccessValidationBody, LoginBody, LogoutBody, RefreshBody } from './schemas';

export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly refresh: RefreshUseCase,
    private readonly logout: LogoutUseCase,
    private readonly validateAccessToken: ValidateAccessTokenUseCase,
    private readonly getDepartments: GetDepartmentsUseCase,
  ) {}

  loginHandler = async (req: Request<unknown, unknown, LoginBody>, res: Response, next: NextFunction) => {
    try {
      const result = await this.login.execute(req.body);
      res.status(200).json(result);
    } catch (e) { next(e); }
  };

  refreshHandler = async (req: Request<unknown, unknown, RefreshBody>, res: Response, next: NextFunction) => {
    try {
      const result = await this.refresh.execute(req.body);
      res.status(200).json(result);
    } catch (e) { next(e); }
  };

  logoutHandler = async (req: Request<unknown, unknown, LogoutBody>, res: Response, next: NextFunction) => {
    try {
      await this.logout.execute(req.body);
      res.status(204).send();
    } catch (e) { next(e); }
  };

  validateAccessTokenHandler = async (req: Request<unknown, unknown, AccessValidationBody>, res: Response, next: NextFunction) => {
    try {
      const { authorization } = res.locals.auth as { authorization: string };
      const result = await this.validateAccessToken.execute({ accessToken: authorization });
      res.setHeader('X-Empleado-Id', result.id);
      res.setHeader('X-Correo', result.email);
      res.setHeader('X-Roles', result.roles.join(','));
      res.status(204).send();
    } catch (e) { next(e); }
  };

  getDepartmentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getDepartments.execute();
      res.status(200).json(result);
    } catch (e) { next(e); }
  };
}