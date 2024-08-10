import { DataTypes, ModelAttributes } from "sequelize";
import { DateTime } from "luxon";
import { db } from "../utils/db";
import { LpToken, LpTokenInstance } from "../interfaces/token";
import { randomBytes } from "crypto";
import { GenericResult } from "../interfaces/api";

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

const getNewExpiration = () => DateTime.now().plus({ months: 1 }).toSQL({ includeOffset: false });
const getToken = () => randomBytes(48).toString('hex');

const Token = {
    model: TokenModel,
    generate: async (UserId: number): Promise<GenericResult> => {
        try {

            const expiresAt = getNewExpiration();
            const token = getToken();

            await TokenModel.create({
                UserId,
                token,
                expiresAt
            } as LpToken);

            return {
                success: true
            }

        } catch (e) {
            return {
                success: true,
                error: e as Error
            }
        }
    },
    refresh: async (UserId: number): Promise<GenericResult> => {
        try {
            let userToken = await TokenModel.findOne({
                where: { UserId }
            });

            if (userToken) {
                userToken.expiresAt = getNewExpiration();
                userToken.token = getToken();
                await userToken.save();
                return {
                    success: true
                }
            } else {
                return Token.generate(UserId);
            }

        } catch (e) {
            return {
                success: false,
                error: e as Error
            }
        }
    }
};

export {
    Token
}