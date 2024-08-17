import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpCategory } from "./category";
import { LpSite } from "./site";
import { LpUser } from "./user";

export interface LpLink extends LpBase {
    url: string;
    title: string;
    description?: string;
    User: LpUser;
    UserId?: number;
    Categories: LpCategory[];
    Site: LpSite;
    SiteId?: number;
    thumbnail?: string;

}

export interface LpLinkCreationAttributes extends Optional<LpLink, "id"> { }

export interface LpLinkInstance
    extends Model<LpLink, LpLinkCreationAttributes>,
    LpLink { }