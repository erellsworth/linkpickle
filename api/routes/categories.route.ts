import { Request, Response } from 'express';
import categoriesRouter from './router';
import { errorResponse, successResponse } from '../utils/responses';
import { Category, Link } from '../models';
import isAuthenticated from './auth.midleware';
import { LpCategory } from '../interfaces/category';

categoriesRouter.get(
  '/categories',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const cats = await Category.model.findAll({
        include: [{ as: 'Children', model: Category.model }, Link.model],
      });
      successResponse(res, cats);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

categoriesRouter.post(
  '/categories',
  isAuthenticated,
  async (req: Request<{}, { category: LpCategory }>, res: Response) => {
    try {
      const { category } = req.body;

      const newCat = await Category.model.create(category);

      successResponse(res, newCat);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

export default categoriesRouter;
