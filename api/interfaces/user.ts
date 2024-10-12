import { LpBase } from './base';
import { LpComment } from './comment';
import { LpLink } from './link';
import { Model, Optional } from 'sequelize';
import { LpToken } from './token';
import { LpHashBrown } from './hash';
import { LpNotificationStatus } from './notificationStatus.interface';
import { LpSetting } from './setting';

export type LpUserRole = 'pickler' | 'picklemaster';

export interface LpUser extends LpBase {
  email: string;
  userName: string;
  Link: LpLink[];
  Comments: LpComment[];
  Settings?: LpSetting[];
  Token?: LpToken;
  HashBrown?: LpHashBrown;
  role: LpUserRole;
  NotificationStatuses?: LpNotificationStatus[];
}

export interface LpUserCreationAttributes extends Optional<LpUser, 'id'> {}

export interface LpUserInstance
  extends Model<LpUser, LpUserCreationAttributes>,
    LpUser {}
