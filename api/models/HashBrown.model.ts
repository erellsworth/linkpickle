import { DataTypes, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpHashBrown, LpHashBrownInstance } from "../interfaces/hash";
import * as bcrypt from 'bcrypt';
import { GenericResult } from "../interfaces/api";
import { User } from "./User.model";

const attributes: ModelAttributes<LpHashBrownInstance> = {
    hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('updatedAt');
            return new Date(rawValue as string).toDateString();
        }
    },

};

const HashBrownModel = db.define<LpHashBrownInstance>('HashBrown', attributes, { timestamps: false });

const HashBrown = {
    model: HashBrownModel,
    generate: async (UserId: number, email: string, password: string): Promise<GenericResult> => {
        try {
            const hash = await HashBrown.hash(email, password);
            await HashBrownModel.create({
                hash,
                UserId
            } as LpHashBrown);

            return {
                success: true
            }
        } catch (e) {
            return {
                success: false,
                error: e as Error
            }
        }
    },
    hash: async (email: string, password: string): Promise<string> => {
        return bcrypt.hash(password + email, 10);
    }
};

export {
    HashBrown
}