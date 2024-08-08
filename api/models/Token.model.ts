import { DataTypes, FindAndCountOptions, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpLink, LpLinkInstance } from "../interfaces/link";
import { LpTokenInstance } from "../interfaces/token";

const attributes: ModelAttributes<LpTokenInstance> = {
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('createdAt');
            return new Date(rawValue as string).toDateString();
        }
    },
    expiresAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('expiresAt');
            return new Date(rawValue as string).toDateString();
        }
    }
};

const TokenModel = db.define<LpTokenInstance>('Token', attributes);

const Token = {
    model: TokenModel
};

export {
    Token
}