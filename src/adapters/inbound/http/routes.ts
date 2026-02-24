import { Router } from 'express';
import { AuthController } from './controller';

import { validateBody } from './middlewares/validate-body';
import { accessValidationSchema, loginSchema, logoutSchema, refreshSchema } from './schemas';
import { errorHandler } from './middlewares/error-handler';
import { validateHeaders } from './middlewares/validate-header';

export const buildRoutes = (controller: AuthController) => {
  const r = Router();
  
  r.post('/login', validateBody(loginSchema), controller.loginHandler);
  r.post('/refresh', validateBody(refreshSchema), controller.refreshHandler);
  r.post('/logout', validateBody(logoutSchema), controller.logoutHandler);
  r.get('/departments', controller.getDepartmentsHandler);
  r.get('/validate-access-token', validateHeaders(accessValidationSchema), controller.validateAccessTokenHandler);

  r.use(errorHandler);

  return r;
};