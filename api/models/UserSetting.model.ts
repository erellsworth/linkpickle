import { DataTypes, ModelAttributes } from 'sequelize';
import { db } from '../utils/db';

const attributes: ModelAttributes = {
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SettingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const UserSettingModel = db.define('UserSetting', attributes, {
  timestamps: false,
  tableName: 'UserSetting',
});

export { UserSettingModel };
