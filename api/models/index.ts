import { Category } from './Category.model';
import { Comment } from './Comment.model';
import { HashBrown } from './HashBrown.model';
import { Link } from './Link.model';
import { Site } from './Site.model';
import { User } from './User.model';
import { Setting } from './Setting.model';
import { Token } from './Token.model';
import { LinkCategoryModel } from './LinkCategory.model';
import { db } from '../utils/db';
import { Notification } from './Notification.model';
import { NotificationStatus } from './NotificationStatus.model';
import { UserSettingModel } from './UserSetting.model';
import { SettingValueModel } from './SettingValue.model';

Category.model.hasMany(Category.model, {
  as: 'Children',
  foreignKey: 'ParentId',
});
Category.model.belongsTo(Category.model, {
  as: 'Parent',
  foreignKey: 'ParentId',
});
Category.model.belongsToMany(Link.model, {
  through: 'LinkCategory',
  timestamps: false,
});
Comment.model.belongsTo(Link.model);
Comment.model.belongsTo(User.model);
HashBrown.model.belongsTo(User.model);
Link.model.belongsToMany(Category.model, {
  through: 'LinkCategory',
  timestamps: false,
});
Link.model.hasMany(Comment.model);
Link.model.belongsTo(Site.model);
Link.model.belongsTo(User.model);
Notification.model.belongsTo(Comment.model);
Notification.model.belongsTo(Link.model);
Notification.model.belongsTo(User.model);
NotificationStatus.model.belongsTo(Notification.model);
Setting.model.belongsToMany(User.model, { through: SettingValueModel });
Setting.model.hasOne(SettingValueModel);
Site.model.hasMany(Link.model);
Token.model.belongsTo(User.model);
User.model.hasMany(Comment.model);
User.model.hasOne(HashBrown.model);
User.model.hasMany(Link.model);
User.model.hasOne(Token.model);
User.model.hasMany(NotificationStatus.model);

const prepare = async () => {
  const tables: any = await db.getQueryInterface().showAllSchemas();

  if (!tables.length) {
    await Category.model.sync();
    await Comment.model.sync();
    await HashBrown.model.sync();
    await Link.model.sync();
    await Setting.model.sync();
    await Site.model.sync();
    await Token.model.sync();
    await User.model.sync();
    await LinkCategoryModel.sync();
    await Notification.model.sync();
    await NotificationStatus.model.sync();
    await UserSettingModel.sync();
    await SettingValueModel.sync();

    const allowRegistration = await Setting.findByName('allowRegistration');

    if (!allowRegistration) {
      Setting.model.create({
        name: 'allowRegistration',
        value: 'true',
        label: 'Allow Registration',
        isAdmin: true,
        dataType: 'boolean',
      });
    }
  }
};

prepare();

export { Category, Comment, Link, Site, User, Setting, Token };
