import { Model, Optional } from 'sequelize';
import { LpBase } from './base';

export interface LpSetting extends LpBase {
  name: string;
  value: string;
  UserId?: number;
}

export interface LpSettingCreationAttributes
  extends Optional<LpSetting, 'id'> {}

export interface LpSettingInstance
  extends Model<LpSetting, LpSettingCreationAttributes>,
    LpSetting {}
