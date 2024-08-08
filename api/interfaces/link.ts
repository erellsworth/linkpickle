import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpCategory } from "./category";
import { LpSite } from "./site";
import { LpUser } from "./user";

export interface LpLink extends LpBase {
    url: string;
    title: string;
    User: LpUser;
    Categories: LpCategory[];
    Site: LpSite;
    thumbnail?: string;
}

export interface LpLinkCreationAttributes extends Optional<LpLink, "id"> { }

export interface LpLinkInstance
    extends Model<LpLink, LpLinkCreationAttributes>,
    LpLink { }