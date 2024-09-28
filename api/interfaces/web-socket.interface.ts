import { LpComment } from './comment';
import { LpLink } from './link';
import { LpNotification } from './notification';

export interface LpSocketMessage {
  channel: 'links' | 'notifications' | 'comments' | 'generic';
  Link?: LpLink;
  Notification?: LpNotification;
  Comment?: LpComment;
  message?: string;
  fromUserId: number;
}
