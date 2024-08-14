import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpLink } from "./link";

export interface LpCategory extends LpBase {
    name: string;
    description?: string;
    Parent?: LpCategory;
    Children?: LpCategory[];
    Links?: LpLink[];
}

export interface LpCategoryCreationAttributes extends Optional<LpCategory, "id"> { }

export interface LpCategoryInstance
    extends Model<LpCategory, LpCategoryCreationAttributes>,
    LpCategory { }