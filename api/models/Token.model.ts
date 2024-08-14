import { DataTypes, ModelAttributes } from "sequelize";
import { DateTime } from "luxon";
import { db } from "../utils/db";
import { LpToken, LpTokenInstance } from "../interfaces/token";
import { randomBytes } from "crypto";

const attributes: ModelAttributes<LpTokenInstance> = {
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('expiresAt');
            return new Date(rawValue as string).toDateString();
        }
    }
};

const TokenModel = db.define<LpTokenInstance>('Token', attributes, { timestamps: false });

const getNewExpiration = () => DateTime.now().plus({ months: 1 }).toSQL({ includeOffset: false });
const getToken = () => randomBytes(48).toString('hex');

const Token = {
    model: TokenModel,
    generate: async (UserId: number): Promise<LpToken | string> => {
        try {

            const expiresAt = getNewExpiration();
            const token = getToken();

            const userToken = await TokenModel.create({
                UserId,
                token,
                expiresAt
            } as LpToken);

            return userToken;

        } catch (e) {
            return (e as Error).message;
        }
    },
    refresh: async (UserId: number): Promise<LpToken | string> => {
        try {
            const userToken = await TokenModel.findOne({
                where: { UserId }
            });

            if (userToken) {
                userToken.expiresAt = getNewExpiration();
                userToken.token = getToken();
                await userToken.save();
                return userToken;
            } else {
                return Token.generate(UserId);
            }

        } catch (e) {
            return (e as Error).message;
        }
    }
};

export {
    Token
}