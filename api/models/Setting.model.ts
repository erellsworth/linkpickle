import { DataTypes, ModelAttributes, Op, WhereOptions } from 'sequelize';
import { db } from '../utils/db';
import { LpTokenInstance } from '../interfaces/token';
import { LpSetting, LpSettingInstance } from '../interfaces/setting';
import { LpUser } from '../interfaces/user';
import { SettingValueModel } from './SettingValue.model';

const attributes: ModelAttributes<LpSettingInstance> = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataType: {
    type: DataTypes.STRING,
    defaultValue: 'string',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

const SettingModel = db.define<LpSettingInstance>('Setting', attributes);

/**
 * TODO: This should be more robust. It:
 *  - will require some kind of user permission scheme
 *  - should be managable by an admin user in the UI
 *  - should handle different variable types
 *  - could just be a single JSON object?
 */

const Setting = {
  model: SettingModel,
  findAll: async (user: LpUser): Promise<LpSetting[]> => {
    const include = SettingValueModel;
    if (user.role === 'picklemaster') {
      return SettingModel.findAll({
        include,
      });
    }
    return SettingModel.findAll({
      where: {
        isAdmin: false,
      },
      include,
    });
  },
  findByName: async (
    name: string,
    defaultValue: string = '',
  ): Promise<string> => {
    const setting = await SettingModel.findOne({
      where: {
        name,
      },
    });

    return setting?.value || defaultValue;
  },
  findByUserIdAndName: async (UserId: number, name: string) => {
    return SettingModel.findOne({
      where: {
        UserId,
        name,
      },
    });
  },
};

export { Setting };
