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
  '/settings',
  isAuthenticated,
  async (req: Request<{ name?: string }>, res: Response) => {
    try {
      const user = req.user as LpUser;

      const settings = await Setting.findAll(req.user as LpUser);
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
  async (req: Request<{}, {}, { setting: LpSetting }>, res: Response) => {
    try {
      const { setting } = req.body;
      const user = req.user as LpUser;

      const restrictedSettings = ['allowRegistration'];
      if (
        user.role !== 'picklemaster' &&
        restrictedSettings.includes(setting.name)
      ) {
        return errorResponse(res, 'Only an admin can alter that setting', 400);
      }

      const existing = await Setting.findByUserIdAndName(user.id, setting.name);

      if (existing) {
        return errorResponse(res, 'Setting already exists', 400);
      }

      setting.UserId = user?.id || 0;
      const newSetting = await Setting.model.create(setting);

      successResponse(res, newSetting);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  },
);

export default settingsRouter;
