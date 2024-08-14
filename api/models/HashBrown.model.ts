import { DataTypes, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpHashBrown, LpHashBrownInstance } from "../interfaces/hash";
import * as bcrypt from 'bcrypt';
import { GenericResult } from "../interfaces/api";

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
    }
};

const HashBrownModel = db.define<LpHashBrownInstance>('HashBrown', attributes, { timestamps: false });

const HashBrown = {
    model: HashBrownModel,
    generate: async (UserId: number, email: string, password: string): Promise<GenericResult> => {
        try {
            const hash = await bcrypt.hash(password + email, 10);
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
    verifiy: async (email: string, password: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(password + email, hash);
    }
};

export {
    HashBrown
}