import { Model, Optional } from 'sequelize';
import { LpBase } from './base';

export interface LpNotification extends LpBase {
  status?: 'read' | 'unread';
  title: string;
  text: string;
  LinkId?: number;
  CommentId?: number;
  UserId?: number;
}

export interface LpNotificationCreationAttributes
  extends Optional<LpNotification, 'id'> {}

export interface LpNotificationInstance
  extends Model<LpNotification, LpNotificationCreationAttributes>,
    LpNotification {}
