import { Request, Response } from 'express';
import sitesRouter from './router';
import { errorResponse, successResponse } from '../utils/responses';
import isAuthenticated from './auth.midleware';
import { LpUser } from '../interfaces/user';
import { Notification } from '../models/Notification.model';
import { LpNotification } from '../interfaces/notification';

sitesRouter.get(
  '/notifications',
  isAuthenticated,
  async (req: Request<{ page: number }>, res: Response) => {
    try {
      const user = req.user as LpUser;

      const notifications = await Notification.findForUser(user.id);

      successResponse<LpNotification[]>(res, notifications);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

export default sitesRouter;
