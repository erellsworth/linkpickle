import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpLink } from "./link";
import { LpUser } from "./user";

export interface LpComment extends LpBase {
    text: string;
    html: string;
    User: LpUser;
    Link: LpLink;
}

export interface LpCommentCreationAttributes extends Optional<LpComment, "id"> { }

export interface LpCommentInstance
    extends Model<LpComment, LpCommentCreationAttributes>,
    LpComment { }