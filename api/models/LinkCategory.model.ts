import { DataTypes, ModelAttributes } from 'sequelize';
import { db } from '../utils/db';

const attributes: ModelAttributes = {
  LinkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const LinkCategoryModel = db.define('LinkCategory', attributes, {
  timestamps: false,
  tableName: 'LinkCategory',
});

export { LinkCategoryModel };
