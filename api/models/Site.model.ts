import { DataTypes, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpSiteInstance } from "../interfaces/site";

const attributes: ModelAttributes<LpSiteInstance> = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    createdAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('createdAt');
            return new Date(rawValue as string).toDateString();
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('updatedAt');
            return new Date(rawValue as string).toDateString();
        }
    }
};

const SiteModel = db.define<LpSiteInstance>('Site', attributes);

const Site = {
    model: SiteModel
};

export {
    Site
}