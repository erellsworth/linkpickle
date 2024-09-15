import {
  DataTypes,
  FindAndCountOptions,
  Includeable,
  ModelAttributes,
  Op,
  Order,
  WhereOptions,
} from 'sequelize';
import OpTypes from 'sequelize/types/operators';
import { db } from '../utils/db';
import { LpLink, LpLinkInstance } from '../interfaces/link';
import { PaginatedResults } from '../interfaces/api';
import { Site } from './Site.model';
import { Comment } from './Comment.model';
import { Category } from './Category.model';
import { User } from './User.model';
import { LpLinkQuery } from '../interfaces/query';

const attributes: ModelAttributes<LpLinkInstance> = {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pinned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
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

const LinkModel = db.define<LpLinkInstance>('Link', attributes);

const Link = {
  model: LinkModel,
  findByUrl: async (UserId: number, url: string) => {
    return LinkModel.findOne({
      where: {
        UserId,
        url,
      },
    });
  },
  findDuplicate: async (UserId: number, url: string, id: number) => {
    return LinkModel.findOne({
      where: {
        UserId,
        url,
        id: { [Op.ne]: id },
      },
    });
  },
  findByUserId: async (
    UserId: number,
    page: number,
    limit: number
  ): Promise<PaginatedResults<LpLink>> => {
    const options: FindAndCountOptions = {
      where: {
        [Op.or]: [{ UserId }, { public: 1 }],
      },
      order: [['createdAt', 'DESC']],
      distinct: true,
      limit,
      offset: (page - 1) * limit,
      include: [Category.model, Comment.model, Site.model],
    };

    const { count, rows } = await LinkModel.findAndCountAll(options);

    return {
      contents: rows,
      total: count,
      page,
    };
  },
  findBySiteId: async (
    id: number
  ): Promise<{ rows: LpLink[]; count: number }> => {
    const options: FindAndCountOptions = {
      where: {
        '$Site.id$': id,
      },
      order: [['createdAt', 'DESC']],
      distinct: true,
      include: [Category.model, Comment.model],
    };

    return LinkModel.findAndCountAll(options);
  },
  findByCategoryId: async (
    UserId: number,
    id: number,
    page: number,
    limit: number
  ): Promise<PaginatedResults<LpLink>> => {
    const options: FindAndCountOptions = {
      where: {
        [Op.or]: [{ UserId }, { public: 1 }],
      },
      order: [['createdAt', 'DESC']],
      distinct: true,
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: Category.model,
          where: {
            id,
          },
        },
        Comment.model,
        Site.model,
        User.model,
      ],
    };

    const { count, rows } = await LinkModel.findAndCountAll(options);

    return {
      contents: rows,
      total: count,
      page,
    };
  },
  findAll: async (): Promise<{ rows: LpLink[]; count: number }> => {
    return LinkModel.findAndCountAll({
      include: [Category.model, Comment.model, Site.model],
    });
  },
  search: async (
    UserId: number,
    query: LpLinkQuery
  ): Promise<PaginatedResults<LpLink>> => {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const isPublic = typeof query.isPublic === 'undefined' ? 1 : query.isPublic;
    const pinned = typeof query.pinned === 'undefined' ? 0 : query.pinned;

    const and: WhereOptions[] = [
      { [Op.or]: [{ UserId }, { isPublic: 1 }] },
      { pinned },
      { isPublic },
    ];

    if (query.title && !query.searchTerm) {
      and.push({ title: { [Op.substring]: query.title } });
    }

    if (query.url && !query.searchTerm) {
      and.push({ url: { [Op.substring]: query.url } });
    }

    if (query.siteId) {
      and.push({ SiteId: query.siteId });
    }

    let searchTerm: {
      [OpTypes.substring]: string;
    } | null = null;

    if (query.searchTerm) {
      searchTerm = { [Op.substring]: query.searchTerm };
      and.push({
        [Op.or]: [
          {
            title: searchTerm,
          },
          {
            url: searchTerm,
          },
          {
            description: searchTerm,
          },
        ],
      });
    }

    if (query.keywords) {
      const keyWordSearch = query.keywords.map((keyword) => {
        return { [Op.substring]: keyword };
      });

      if (searchTerm) {
        keyWordSearch.push(searchTerm);
      }

      and.push({
        description: {
          [Op.or]: keyWordSearch,
        },
      });
    }

    const where: WhereOptions = {
      [Op.and]: and,
    };

    const order: Order = [
      [query.orderBy || 'createdAt', query.order || 'DESC'],
    ];

    const include: Includeable[] = [Comment.model, Site.model];

    if (query.categoryIds) {
      include.push({
        model: Category.model,
        where: {
          id: { [Op.in]: query.categoryIds },
        },
      });
    } else {
      include.push(Category.model);
    }

    const options: FindAndCountOptions = {
      where,
      order,
      distinct: true,
      limit,
      offset: (page - 1) * limit,
      include,
    };

    const { count, rows } = await LinkModel.findAndCountAll(options);

    // This is ugly but it's an ongoing problem in sequelize: https://github.com/sequelize/sequelize/issues/8754
    const contents = await Promise.all(
      rows.map(async (row) => {
        const content = row.toJSON();
        // @ts-ignore
        content.Categories = await row.getCategories();
        return content;
      })
    );

    return {
      contents,
      total: count,
      page,
    };
  },
};

export { Link };
