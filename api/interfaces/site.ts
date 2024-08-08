import { Model, Optional } from "sequelize";
import { LpBase } from "./base";
import { LpLink } from "./link";

export interface LpSite extends LpBase {
    domain: string;
    name: string;
    Links: LpLink[];
    thumbnail?: string;
}

export interface LpSiteCreationAttributes extends Optional<LpSite, "id"> { }

export interface LpSiteInstance
    extends Model<LpSite, LpSiteCreationAttributes>,
    LpSite { }