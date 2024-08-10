import { Category } from "./Category.model";
import { Comment } from "./Comment.model";
import { HashBrown } from "./HashBrown.model";
import { Link } from "./Link.model";
import { Site } from "./Site.model";
import { User } from "./User.model";
import { Setting } from './Setting.model';
import { Token } from "./Token.model"

Category.model.belongsToMany(Link.model, { through: 'LinkCategory' });
Comment.model.belongsTo(Link.model);
Comment.model.belongsTo(User.model);
HashBrown.model.belongsTo(User.model);
Link.model.belongsToMany(Category.model, { through: 'LinkCategory' });
Link.model.belongsTo(Site.model);
Link.model.belongsTo(User.model);
Site.model.hasMany(Link.model);
Token.model.belongsTo(User.model);
User.model.hasMany(Comment.model);
User.model.hasOne(HashBrown.model);
User.model.hasMany(Link.model);
User.model.hasOne(Token.model);

export {
    Category,
    Comment,
    Link,
    Site,
    User,
    Setting,
    Token
}

