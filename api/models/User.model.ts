import { DataTypes, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpUser, LpUserInstance } from "../interfaces/user";
import { ApiResponse, GenericResult } from "../interfaces/api";
import { HashBrown } from "./HashBrown.model";
import { authenticate } from "passport";
import { Token } from "./Token.model";

const attributes: ModelAttributes<LpUserInstance> = {
    email: {
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
    model: UserModel,
    findByEmail: async (email: string): Promise<LpUserInstance | null> => {
        return UserModel.findOne({
            where: {
                email
            }
        });
    },
    findByToken: async (token: string): Promise<LpUser | false> => {
        const userToken = await Token.model.findOne({
            where: {
                token
            },
            include: UserModel
        });

        if (userToken) { return userToken.User; }

        return false;
    },
    authenticate: async (email: string, passport: string): Promise<LpUser | string> => {
        const hash = await HashBrown.hash(email, passport);
        const hashBrown = await HashBrown.model.findOne({
            where: {
                hash
            },
            include: UserModel
        });

        if (hashBrown) {
            const refresh = await Token.refresh(hashBrown.User.id);
            if (refresh.success) {
                return hashBrown.User;
            } else {
                return `Login failed: ${refresh.error?.message}`;
            }
        }

        const user = await User.findByEmail(email);

        if (user) { return 'Invalid Password'; }

        return `User ${email} Not Found`;

    },
    register: async (email: string, password: string): Promise<GenericResult> => {
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            return {
                success: false,
                error: { message: "User already exists" }
            }
        }

        try {
            const newUser = await User.model.create({
                email
            } as LpUser);

            return HashBrown.generate(newUser.id, email, password);

        } catch (e) {
            return {
                success: false,
                error: e as Error
            }
        }
    }
};

export {
    User
}