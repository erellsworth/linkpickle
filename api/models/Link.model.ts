import { DataTypes, FindAndCountOptions, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpLink, LpLinkInstance } from "../interfaces/link";
import { PaginatedResults } from "../interfaces/api";
import { Site } from "./Site.model";
import { Comment } from "./Comment.model";
import { Category } from "./Category.model";

const attributes: ModelAttributes<LpLinkInstance> = {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pinned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
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
    create: async (link: LpLink) => {
        if (!link.SiteId) {

        }
    },
    findByUrl: async (url: string) => {
        return LinkModel.findOne({
            where: {
                url
            }
        });
    },
    findByUserId: async (UserId: number, page: number, limit: number): Promise<PaginatedResults<LpLink>> => {
        const options: FindAndCountOptions = {
            where: {
                UserId
            },
            order: [['createdAt', 'DESC']],
            distinct: true,
            limit,
            offset: (page - 1) * limit,
            include: [Category.model, Comment.model, Site.model]
        };

        const { count, rows } = await LinkModel.findAndCountAll(options);

        return {
            contents: rows,
            total: count,
            page
        };
    },
    findBySiteId: async (id: number): Promise<{ rows: LpLink[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$Site.id$': id
            },
            order: [['createdAt', 'DESC']],
            distinct: true,
            include: [Category.model, Comment.model]
        };

        return LinkModel.findAndCountAll(options)
    },
    findByCategoryId: async (UserId: number, id: number, page: number, limit: number): Promise<{ rows: LpLink[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$Category.id$': id,
                UserId
            },
            order: [['createdAt', 'DESC']],
            distinct: true,
            limit,
            offset: (page - 1) * limit,
            include: [Comment.model, Site.model]

        };

        return LinkModel.findAndCountAll(options);
    },
    findAll: async (): Promise<{ rows: LpLink[]; count: number }> => {
        return LinkModel.findAndCountAll({
            include: [Category.model, Comment.model, Site.model]
        });
    }
};

export {
    Link
}