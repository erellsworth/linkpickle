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
  attributes
);

const Notification = {
  model: NotificationModel,
  findForUser: async (user: LpUser): Promise<LpNotification[]> => {
    // find all the notifications originating from other users
    // TODO: consider reworking this so users can get notifications only from specific users
    const notifications = await NotificationModel.findAll({
      where: {
        UserId: { [Op.ne]: user.id },
      },
      include: [Link.model, Comment.model],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return notifications.map((notification) => {
      const notificationObj = notification.toJSON();
      const status = user.NotificationStatuses?.find(
        (stat) => stat.NotificationId === notificationObj.id
      );
      notificationObj.status = status?.status || 'unread';
      return notificationObj;
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
