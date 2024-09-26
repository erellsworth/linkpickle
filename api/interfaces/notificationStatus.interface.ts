import { Model, Optional } from 'sequelize';
import { LpBase } from './base';

export interface LpNotificationStatus extends LpBase {
  status: 'read' | 'unread';
  UserId: number;
  NotificationId: number;
}

export interface LpNotificationStatusCreationAttributes
  extends Optional<LpNotificationStatus, 'id'> {}

export interface LpNotificationStatusInstance
  extends Model<LpNotificationStatus, LpNotificationStatusCreationAttributes>,
    LpNotificationStatus {}
