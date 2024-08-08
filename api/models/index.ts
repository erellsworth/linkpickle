import { Category } from "./Category.model";
import { Comment } from "./Comment.model";
import { Link } from "./Link.model";
import { Site } from "./Site.model";
import { User } from "./User.model";

Category.model.belongsToMany(Link.model, { through: 'LinkCategory' });
Link.model.belongsToMany(Category.model, { through: 'LinkCategory' });
Link.model.belongsTo(User.model);
Comment.model.belongsTo(Link.model);
Comment.model.belongsTo(User.model);
User.model.hasMany(Link.model);
User.model.hasMany(Comment.model);
Site.model.hasMany(Link.model);
Link.model.belongsTo(Site.model);

export {
    Category,
    Comment,
    Link,
    Site,
    User
}

