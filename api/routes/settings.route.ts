import { Request, Response } from 'express';
import settingsRouter from './router';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../utils/responses';
import { Setting } from '../models';
import isAuthenticated from './auth.midleware';
import { LpUser } from '../interfaces/user';
import { LpSetting } from '../interfaces/setting';

settingsRouter.get(
  '/settings/:name?',
  isAuthenticated,
  async (req: Request<{ name?: string }>, res: Response) => {
    try {
      const user = req.user as LpUser;
      if (req.params.name) {
        const setting = await Setting.findByName(user, req.params.name);
        if (setting) {
          return successResponse(res, setting);
        }

        return notFoundResponse(res, 'Setting');
      }

      const settings = await Setting.findAll(user);
      successResponse(res, settings);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  },
);

settingsRouter.patch(
  '/settings',
  isAuthenticated,
  async (
    req: Request<{}, {}, { settings: { [key: string]: string } }>,
    res: Response,
  ) => {
    try {
      const { settings } = req.body;
      await Promise.all(
        Object.keys(settings).map(async (name) => {
          const value = settings[name].toString();
          return Setting.model.update(
            { value },
            {
              where: { name },
            },
          );
        }),
      );

      successResponse(res, settings);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  },
);

settingsRouter.post(
  '/settings',
  isAuthenticated,
  async (req: Request<{}, {}, { setting: LpSetting }>, res: Response) => {},
);

export default settingsRouter;
