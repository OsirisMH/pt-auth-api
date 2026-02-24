import { buildContext } from './context';
import { buildAuthModule } from './auth.module';

export const buildContainer = async () => {
  const ctx = await buildContext();
  return {
    ctx,
    auth: buildAuthModule(ctx),
  };
};