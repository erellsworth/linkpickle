import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpUser } from "./user";

export interface LpToken extends LpBase {
    token: string;
    User: LpUser;
    expiresAt: string;
}

export interface LpTokenCreationAttributes extends Optional<LpToken, "id"> { }

export interface LpTokenInstance
    extends Model<LpToken, LpTokenCreationAttributes>,
    LpToken { }