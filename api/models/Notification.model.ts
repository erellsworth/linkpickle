import { DataTypes, Includeable, ModelAttributes, Op } from 'sequelize';
import { db } from '../utils/db';
import {
  LpNotification,
  LpNotificationInstance,
} from '../interfaces/notification';
import { Link } from './Link.model';
import { NotificationStatus } from './NotificationStatus.model';
import { User } from './User.model';
import { Comment } from './Comment.model';
import { LpUser } from '../interfaces/user';
import { LpSocketMessage } from '../interfaces/web-socket.interface';
import { WebSocket } from 'ws';
import { LpNotificationStatus } from '../interfaces/notificationStatus.interface';

const attributes: ModelAttributes<LpNotificationInstance> = {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue('createdAt');
      return new Date(rawValue as string).toDateString();
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue('updatedAt');
      return new Date(rawValue as string).toDateString();
    },
  },
};

const NotificationModel = db.define<LpNotificationInstance>(
  'Notification',
  attributes,
);

const Notification = {
  model: NotificationModel,
  read: async (
    UserId: number,
    NotificationId: number,
  ): Promise<LpNotificationStatus | false> => {
    try {
      const [status] = await NotificationStatus.model.findOrBuild({
        where: {
          NotificationId,
          UserId,
        },
        defaults: {
          status: 'read',
          UserId,
          NotificationId,
        },
      });

      status.status = 'read';
      status.save();
      return status;
    } catch (e) {
      return false;
    }
  },
  findForUser: async (user: LpUser, limit = 10): Promise<LpNotification[]> => {
    // find all the notifications originating from other users
    // TODO: consider reworking this so users can get notifications only from specific users
    const notifications = await NotificationModel.findAll({
      where: {
        UserId: { [Op.ne]: user.id },
      },
      include: [Link.model, Comment.model],
      order: [['createdAt', 'DESC']],
      limit,
    });

    return notifications.map((notification) => {
      const notificationObj = notification.toJSON();
      const status = user.NotificationStatuses?.find(
        (stat) => stat.NotificationId === notificationObj.id,
      );
      notificationObj.status = status?.status || 'unread';
      return notificationObj;
    });
  },
  clean: async (UserId: number): Promise<number> => {
    // remove all but the 10 newest notifications
    const notifications = await NotificationModel.findAll({
      where: {
        UserId: { [Op.ne]: UserId },
      },
      order: [['createdAt', 'DESC']],
      limit: -1,
      offset: 10,
    });

    const ids = notifications.map((notification) => notification.id);

    NotificationStatus.model.destroy({
      where: {
        NotificationId: ids,
      },
    });

    return NotificationModel.destroy({
      where: {
        id: ids,
      },
    });
  },
  setupSocket: (ws: WebSocket) => {
    NotificationModel.afterCreate((notification) => {
      const message: LpSocketMessage = {
        channel: 'notifications',
        Notification: {
          ...notification.toJSON(),
          ...{
            status: 'unread',
          },
        },
        fromUserId: notification.UserId as number,
      };
      ws.send(JSON.stringify(message));
    });
  },
};

export { Notification };
