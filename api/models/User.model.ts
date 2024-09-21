import { DataTypes, ModelAttributes, Op } from 'sequelize';
import { db } from '../utils/db';
import { LpUser, LpUserInstance } from '../interfaces/user';
import { GenericResult } from '../interfaces/api';
import { HashBrown } from './HashBrown.model';
import { Token } from './Token.model';

const attributes: ModelAttributes<LpUserInstance> = {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pickler',
  },
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue('createdAt');
      return new Date(rawValue as string).toDateString();
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    get() {
      const rawValue = this.getDataValue('updatedAt');
      return new Date(rawValue as string).toDateString();
    },
  },
};

const UserModel = db.define<LpUserInstance>('User', attributes);

const User = {
  model: UserModel,
  findByEmail: async (email: string): Promise<LpUserInstance | null> => {
    return UserModel.findOne({
      where: {
        email,
      },
      include: HashBrown.model,
    });
  },
  findByToken: async (token: string): Promise<LpUser | false> => {
    const userToken = await Token.model.findOne({
      where: {
        token,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      include: UserModel,
    });

    if (userToken) {
      return userToken.User;
    }

    return false;
  },
  authenticate: async (
    email: string,
    password: string
  ): Promise<LpUser | string> => {
    const user = await User.findByEmail(email);

    if (!user || !user.HashBrown) {
      return `Invalid credentials`;
    }

    const validCredentials = await HashBrown.verifiy(
      email,
      password,
      user.HashBrown.hash
    );

    if (validCredentials) {
      const refresh = await Token.refresh(user.id);
      if (typeof refresh === 'string') {
        return `Login failed: ${refresh}`;
      } else {
        const userResult = { ...user.toJSON() };
        userResult.Token = refresh;
        delete userResult.HashBrown;
        return userResult;
      }
    } else {
      return `Invalid credentials`;
    }
  },
  register: async (
    email: string,
    userName: string,
    password: string
  ): Promise<GenericResult> => {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return {
        success: false,
        error: { message: 'User already exists' },
      };
    }

    try {
      const newUser = await User.model.create({
        email,
        userName,
      } as LpUser);

      return HashBrown.generate(newUser.id, email, password);
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  },
};

export { User };
