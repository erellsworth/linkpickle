import { DataTypes, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpTokenInstance } from "../interfaces/token";
import { LpSettingInstance } from "../interfaces/setting";

const attributes: ModelAttributes<LpSettingInstance> = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
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

const SettingModel = db.define<LpSettingInstance>('Setting', attributes);

const Setting = {
    model: SettingModel
};

export {
    Setting
}