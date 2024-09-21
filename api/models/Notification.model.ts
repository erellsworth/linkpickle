import { DataTypes, ModelAttributes, Op } from 'sequelize';
import { db } from '../utils/db';
import {
  LpNotification,
  LpNotificationInstance,
} from '../interfaces/notification';
import { title } from 'process';
import { Link } from './Link.model';

const attributes: ModelAttributes<LpNotificationInstance> = {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
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
  findForUser: async (userId: number): Promise<LpNotification[]> => {
    // find all the notifications originating from other users
    // TODO: consider reworking this so users can get notifications only from specific users
    return NotificationModel.findAll({
      where: {
        UserId: { [Op.ne]: userId },
      },
      include: [Link.model],
    });
  },
};

export { Notification };
