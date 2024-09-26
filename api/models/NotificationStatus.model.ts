import { DataTypes, ModelAttributes, Op } from 'sequelize';
import { db } from '../utils/db';
import {
  LpNotificationStatus,
  LpNotificationStatusInstance,
} from '../interfaces/notificationStatus.interface';
import { Link } from './Link.model';

const attributes: ModelAttributes<LpNotificationStatusInstance> = {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
};

const NotificationStatusModel = db.define<LpNotificationStatusInstance>(
  'NotificationStatus',
  attributes,
  { tableName: 'NotificationStatus', timestamps: false }
);

const NotificationStatus = {
  model: NotificationStatusModel,
};

export { NotificationStatus };
