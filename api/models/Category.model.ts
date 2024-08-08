import { DataTypes, ModelAttributes } from "sequelize";
import { db } from "../utils/db";
import { LpCategory, LpCategoryInstance } from "../interfaces/category";

const attributes: ModelAttributes<LpCategoryInstance> = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent: {
        type: DataTypes.VIRTUAL
    },
    children: {
        type: DataTypes.VIRTUAL
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

const CategoryModel = db.define<LpCategoryInstance>('Category', attributes);

const Category = {
    model: CategoryModel,
    findAll: async (id: number): Promise<{ rows: LpCategory[]; count: number }> => {
        return CategoryModel.findAndCountAll();
    }
};

export {
    Category
}