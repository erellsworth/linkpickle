import { Model, Optional } from 'sequelize';
import { LpBase } from './base';
import { LpCategory } from './category';
import { LpSite } from './site';
import { LpUser } from './user';

export interface LpLinkPreview {
  url: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
}

export interface LpLink extends LpBase, LpLinkPreview {
  User: LpUser;
  UserId?: number;
  Categories?: LpCategory[];
  Site: LpSite;
  SiteId?: number;
  pinned: boolean;
  isPublic: boolean;
}

export interface LpLinkCreationAttributes extends Optional<LpLink, 'id'> {}

export interface LpLinkInstance
  extends Model<LpLink, LpLinkCreationAttributes>,
    LpLink {}
