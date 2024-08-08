import { DataTypes, FindAndCountOptions, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpUser, LpUserInstance } from "../interfaces/user";

const attributes: ModelAttributes<LpUserInstance> = {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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

const UserModel = db.define<LpUserInstance>('User', attributes);

const User = {
    model: UserModel
};

export {
    User
}