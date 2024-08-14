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

/**
 * TODO: This should be more robust. It:
 *  - will require some kind of user permission scheme
 *  - should be managable by an admin user in the UI
 *  - should handle different variable types
 *  - could just be a single JSON object?
 */

const Setting = {
    model: SettingModel,
    findAll: async (): Promise<{ [key: string]: string }> => {
        const settings = await SettingModel.findAll();
        const settingObj: { [key: string]: string } = {};
        return settings.reduce((a, b) => { a[b.name] = b.value; return a; }, settingObj);
    },
    findByName: async (name: string, defaultValue: string = ''): Promise<string> => {
        const setting = await SettingModel.findOne({
            where: {
                name
            }
        });

        return setting?.value || defaultValue;
    }
};

export {
    Setting
}