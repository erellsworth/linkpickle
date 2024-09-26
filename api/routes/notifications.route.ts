import { Request, Response } from 'express';
import sitesRouter from './router';
import { errorResponse, successResponse } from '../utils/responses';
import isAuthenticated from './auth.midleware';
import { LpUser } from '../interfaces/user';
import { Notification } from '../models/Notification.model';
import { LpNotification } from '../interfaces/notification';
import { NotificationStatus } from '../models/NotificationStatus.model';

sitesRouter.get(
  '/notifications',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const notifications = await Notification.findForUser(req.user as LpUser);

      successResponse(res, notifications);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

sitesRouter.patch(
  '/notifications/read/:id',
  isAuthenticated,
  async (req: Request<{ id: number }>, res: Response) => {
    try {
      const notification = await Notification.model.findByPk(req.params.id);

      if (!notification) {
        return errorResponse(res, 'Notification not found', 404);
      }

      const user = req.user as LpUser;

      const [status, success] = await NotificationStatus.model.findOrBuild({
        where: {
          NotificationId: req.params.id,
          UserId: user.id,
        },
        defaults: {
          status: 'read',
          UserId: user.id,
          NotificationId: req.params.id,
        },
      });

      if (success) {
        status.status = 'read';
        status.save();
        return successResponse(res, status);
      }

      errorResponse(res, 'Failed to update notification status');
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

export default sitesRouter;
