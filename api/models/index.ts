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
Notification.model.belongsTo(User.model);
Notification.model.belongsTo(Link.model);
Setting.model.belongsTo(User.model);
Site.model.hasMany(Link.model);
Token.model.belongsTo(User.model);
User.model.hasMany(Comment.model);
User.model.hasOne(HashBrown.model);
User.model.hasMany(Link.model);
User.model.hasOne(Token.model);
User.model.hasMany(Setting.model);
//User.model.hasMany(Notification.model);

const prepare = async () => {
  const tables: any = await db.getQueryInterface().showAllSchemas();

  if (!tables.length) {
    await Category.model.sync({ alter: true });
    await Comment.model.sync({ alter: true });
    await HashBrown.model.sync({ alter: true });
    await Link.model.sync({ alter: true });
    await Setting.model.sync({ alter: true });
    await Site.model.sync({ alter: true });
    await Token.model.sync({ alter: true });
    await User.model.sync({ alter: true });
    await LinkCategoryModel.sync({ alter: true });
    await Notification.model.sync({ alter: true });

    const allowRegistration = await Setting.findByName('allowRegistration');

    if (!allowRegistration) {
      Setting.model.create({
        name: 'allowRegistration',
        value: 'true',
      });
    }
  }
};

prepare();

export { Category, Comment, Link, Site, User, Setting, Token };
