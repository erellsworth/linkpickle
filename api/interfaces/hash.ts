import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpUser } from "./user";

export interface LpHashBrown extends LpBase {
    hash: string;
    User: LpUser;
    updatedAt: string;
    UserId?: number;
}

export interface LpHashBrownCreationAttributes extends Optional<LpHashBrown, "id" | "createdAt"> { }

export interface LpHashBrownInstance
    extends Model<LpHashBrown, LpHashBrownCreationAttributes>,
    LpHashBrown { }