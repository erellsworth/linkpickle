import { DataTypes, FindAndCountOptions, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpLink, LpLinkInstance } from "../interfaces/link";

const attributes: ModelAttributes<LpLinkInstance> = {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail: {
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

const LinkModel = db.define<LpLinkInstance>('Link', attributes);

const Link = {
    model: LinkModel,
    findByUserId: async (id: number): Promise<{ rows: LpLink[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$User.id$': id
            },
            order: [['createdAt', 'DESC']],
            distinct: true
        };

        return LinkModel.findAndCountAll(options)
    },
    findBySiteId: async (id: number): Promise<{ rows: LpLink[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$Site.id$': id
            },
            order: [['createdAt', 'DESC']],
            distinct: true
        };

        return LinkModel.findAndCountAll(options)
    },
    findByCategoryId: async (id: number): Promise<{ rows: LpLink[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$Category.id$': id
            },
            order: [['createdAt', 'DESC']],
            distinct: true
        };

        return LinkModel.findAndCountAll(options)
    },
    findAll: async (): Promise<{ rows: LpLink[]; count: number }> => {
        return LinkModel.findAndCountAll();
    }
};

export {
    Link
}