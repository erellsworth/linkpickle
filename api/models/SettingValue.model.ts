import { DataTypes, ModelAttributes } from 'sequelize';
import { db } from '../utils/db';

const attributes: ModelAttributes = {
  UserId: {
    type: DataTypes.INTEGER,
  },
  SettingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
  },
};

const SettingValueModel = db.define('SettingValue', attributes, {
  timestamps: false,
  tableName: 'SettingValues',
});

export { SettingValueModel };
