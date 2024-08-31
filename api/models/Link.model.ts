import { DataTypes, FindAndCountOptions, Includeable, ModelAttributes, Op, Order, WhereOptions } from "sequelize";
import { db } from "../utils/db";
import { LpLink, LpLinkInstance } from "../interfaces/link";
import { PaginatedResults } from "../interfaces/api";
import { Site } from "./Site.model";
import { Comment } from "./Comment.model";
import { Category } from "./Category.model";
import { User } from "./User.model";
import { LpLinkQuery } from "../interfaces/query";

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
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
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
                [Op.or]: [{ UserId }, {public: 1}]
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
    findByCategoryId: async (UserId: number, id: number, page: number, limit: number):  Promise<PaginatedResults<LpLink>> => {
        const options: FindAndCountOptions = {
            where: {
                [Op.or]: [{UserId}, {public: 1}]
            },
            order: [['createdAt', 'DESC']],
            distinct: true,
            limit,
            offset: (page - 1) * limit,
            include: [
                {
                    model: Category.model,
                    where: {
                        id
                    }
                },
                Comment.model,
                Site.model,
                User.model
            ]
        };

        const { count, rows } = await LinkModel.findAndCountAll(options);

        return {
            contents: rows,
            total: count,
            page
        };
    },
    findAll: async (): Promise<{ rows: LpLink[]; count: number }> => {
        return LinkModel.findAndCountAll({
            include: [Category.model, Comment.model, Site.model]
        });
    },
    search: async (UserId: number, query: LpLinkQuery): Promise<PaginatedResults<LpLink>> => {

        const limit = query.limit || 10;
        const page = query.page || 1;
        const isPublic = query.isPublic === undefined ? 1 : query.isPublic;

        const where: WhereOptions = {
            [Op.or]: [{ UserId }, { isPublic: 1 }],
            isPublic
        };

        if (query.title) {
            where.title = {[Op.substring]: query.title}
        }

        if (query.siteId) {
            where.SiteId = query.siteId;
        }

        if (query.keywords) {
            where.description = {
                [Op.or]: query.keywords.map(keyword => {
                    return { [Op.substring]: keyword }
                })
            }
        }

        const order: Order = [[query.orderBy || 'createdAt', query.order || 'DESC']];
      
        const include: Includeable[] = [
            Comment.model,
            Site.model,
            User.model
        ];

        if (query.categoryIds) {
            include.push({
                model: Category.model,
                where: {
                    id: { [Op.in]: query.categoryIds }
                }
            })
        } else {
            include.push(Category.model);
        }

        const options: FindAndCountOptions = {
            where,
            order,
            distinct: true,
            limit,
            offset: (page - 1) * limit,
            include
        };

        const { count, rows } = await LinkModel.findAndCountAll(options);

        return {
            contents: rows,
            total: count,
            page
        };
    }
};

export {
    Link
}