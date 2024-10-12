import { Model, Optional } from 'sequelize';
import { LpBase } from './base';

export interface LpSetting extends LpBase {
  name: string;
  label: string;
  isAdmin: boolean;
  dataType: 'boolean' | 'string' | 'number';
  SettingValue?: LpSettingValue;
}

export interface LpSettingValue {
  UserId: number;
  SettingId: number;
  value: string;
}

export interface LpSettingCreationAttributes
  extends Optional<LpSetting, 'id'> {}

export interface LpSettingInstance
  extends Model<LpSetting, LpSettingCreationAttributes>,
    LpSetting {}
