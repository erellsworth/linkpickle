import { DataTypes, FindAndCountOptions, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpComment, LpCommentInstance } from "../interfaces/comment";

const attributes: ModelAttributes<LpCommentInstance> = {
    text: {
        type: DataTypes.STRING,
        allowNull: true
    },
    html: {
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

const CommentModel = db.define<LpCommentInstance>('Comment', attributes);

const Comment = {
    model: CommentModel,
    findByLinkId: async (id: number): Promise<{ rows: LpComment[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$Link.id$': id
            },
            order: [['createdAt', 'DESC']],
            distinct: true
        };

        return CommentModel.findAndCountAll(options)
    },
    findByUserId: async (id: number): Promise<{ rows: LpComment[]; count: number }> => {
        const options: FindAndCountOptions = {
            where: {
                '$User.id$': id
            },
            order: [['createdAt', 'DESC']],
            distinct: true
        };

        return CommentModel.findAndCountAll(options)
    },
};

export {
    Comment
}