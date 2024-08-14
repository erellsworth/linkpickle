import { LpBase } from "./base";
import { LpComment } from "./comment";
import { LpLink } from "./link";
import { Model, Optional } from "sequelize";
import { LpToken } from "./token";
import { LpHashBrown } from "./hash";

export interface LpUser extends LpBase {
    email: string;
    Link: LpLink[];
    Comments: LpComment[];
    Token?: LpToken;
    HashBrown?: LpHashBrown;
}

export interface LpUserCreationAttributes extends Optional<LpUser, "id"> { }

export interface LpUserInstance
    extends Model<LpUser, LpUserCreationAttributes>,
    LpUser { }