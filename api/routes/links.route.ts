import { Request, Response } from 'express';
import urlMetadata from 'url-metadata';
import linksRouter from './router';
import { errorResponse, successResponse } from '../utils/responses';
import { Category, Comment, Link, Site, User } from '../models';
import isAuthenticated from './auth.midleware';
import { LpUser } from '../interfaces/user';
import { LpLink, LpLinkPreview } from '../interfaces/link';
import { LpCategory } from '../interfaces/category';
import { LpLinkQuery } from '../interfaces/query';
import { Op } from 'sequelize';
import { Notification } from '../models/Notification.model';

linksRouter.get(
  '/links/search',
  isAuthenticated,
  async (req: Request<{}, {}, {}, LpLinkQuery>, res: Response) => {
    if (!req.query) {
      return errorResponse(res, 'Query missing');
    }

    try {
      const user = req.user as LpUser;
      const links = await Link.search(user.id, req.query);
      successResponse(res, links);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

linksRouter.get(
  '/links/category/:id/:page?',
  isAuthenticated,
  async (
    req: Request<{ id: number; page: number }, {}, {}, { limit?: number }>,
    res: Response
  ) => {
    const page = req.params.page || 1;
    const limit = req.query.limit || 9;
    const user = req.user as LpUser;

    try {
      const links = await Link.findByCategoryId(
        user.id,
        req.params.id,
        page,
        limit
      );
      successResponse(res, links);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

linksRouter.get(
  '/links/linkPreview',
  isAuthenticated,
  async (req: Request<{}, {}, {}, { url: string }>, res: Response) => {
    try {
      const url = new URL(req.query.url);
      const user = req.user as LpUser;

      const linkRecord = await Link.findByUrl(user.id, url.toString());

      if (linkRecord) {
        return errorResponse(res, 'Link already exists', 200, linkRecord);
      }

      const metadata = await urlMetadata(url.toString());

      const domain = url.hostname.replace(/^[^.]+\./g, '');

      const siteName = metadata ? metadata['og:site_name'] : domain;

      const preview: LpLinkPreview = {
        url: url.toString(),
        title: metadata.title || metadata['og:title'],
        description: metadata.description || metadata['og:description'],
      };

      const img = metadata.image || metadata['og:image'];

      if (img) {
        preview.thumbnail = img;
      }

      successResponse(res, { preview, siteName, metadata });
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

linksRouter.get(
  '/links/:page?',
  isAuthenticated,
  async (
    req: Request<{ page: number }, {}, {}, { limit?: number }>,
    res: Response
  ) => {
    const page = req.params.page || 1;
    const limit = req.query.limit || 9;
    const user = req.user as LpUser;

    try {
      const links = await Link.findByUserId(user.id, page, limit);
      successResponse(res, links);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

linksRouter.post(
  '/links',
  isAuthenticated,
  async (
    req: Request<{}, { link: LpLink; categories: LpCategory[] }>,
    res: Response
  ) => {
    if (!req.body.link || !req.body.link.url) {
      return errorResponse(res, 'Missing required link data', 400);
    }

    try {
      const url = new URL(req.body.link.url);
      const user = req.user as LpUser;

      const linkRecord = await Link.findByUrl(user.id, url.toString());

      if (linkRecord) {
        return errorResponse(res, 'Link already exists', 200, linkRecord);
      }

      const metadata = await urlMetadata(url.toString());

      const site = await Site.getFromDomain(
        url.hostname.replace(/^[^.]+\./g, ''),
        metadata
      );

      const link = {
        ...req.body.link,
        ...{
          UserId: user.id,
          SiteId: site.id,
        },
      };

      link.description =
        link.description || metadata.description || metadata['og:description'];
      link.title = link.title || metadata.title || metadata['og:title'];

      const img = metadata.image || metadata['og:image'];

      if (img) {
        link.thumbnail = img;
      }

      const newCategories = req.body.categories.filter(
        (cat: LpCategory) => !Boolean(cat.id)
      );

      const newCatIds: number[] = [];

      for (const cat of newCategories) {
        const newCat = await Category.model.create(cat);
        newCatIds.push(newCat.id);
      }

      const categoryIds: number[] = req.body.categories
        .filter((cat: LpCategory) => Boolean(cat.id))
        .map((cat: LpCategory) => cat.id)
        .concat(newCatIds);

      const newLink = await Link.model.create(link);

      // @ts-ignore
      newLink.addCategories(categoryIds);

      successResponse(res, newLink);

      Notification.model.create(
        {
          title: `${user.userName} posted a new link`,
          text: newLink.title,
          UserId: user.id,
          LinkId: newLink.id,
          status: 'unread',
        },
        {
          include: [Link.model],
        }
      );
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

linksRouter.put(
  '/links',
  isAuthenticated,
  async (
    req: Request<{}, { link: LpLink; categories: LpCategory[] }>,
    res: Response
  ) => {
    if (!req.body.link || !req.body.link.url || !req.body.link.id) {
      return errorResponse(res, 'Missing required link data', 400);
    }

    try {
      const url = new URL(req.body.link.url);
      const user = req.user as LpUser;

      const linkRecord = await Link.model.findByPk(req.body.link.id);

      if (!linkRecord) {
        return errorResponse(res, 'Link not found', 404);
      }

      // prevent user from creating duplicate when updating url
      if (linkRecord.url !== req.body.link.url) {
        const duplicateLink = await Link.findDuplicate(
          user.id,
          url.toString(),
          req.body.link.id
        );
        if (duplicateLink) {
          return errorResponse(
            res,
            'Another link already exists with this url',
            404
          );
        }
      }

      const metadata = await urlMetadata(url.toString());

      const site = await Site.getFromDomain(
        url.hostname.replace(/^[^.]+\./g, ''),
        metadata
      );

      const link = {
        ...req.body.link,
        ...{
          UserId: user.id,
          SiteId: site.id,
        },
      };

      link.description =
        link.description || metadata.description || metadata['og:description'];
      link.title = link.title || metadata.title || metadata['og:title'];

      const img = metadata.image || metadata['og:image'];

      if (img) {
        link.thumbnail = img;
      }

      const newCategories = req.body.categories.filter(
        (cat: LpCategory) => !Boolean(cat.id)
      );

      const newCatIds: number[] = [];

      for (const cat of newCategories) {
        const newCat = await Category.model.create(cat);
        newCatIds.push(newCat.id);
      }

      const categoryIds: number[] = req.body.categories
        .filter((cat: LpCategory) => Boolean(cat.id))
        .map((cat: LpCategory) => cat.id)
        .concat(newCatIds);

      linkRecord.set(link);

      await linkRecord.save();

      // @ts-ignore
      linkRecord.addCategories(categoryIds);

      successResponse(res, linkRecord);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

linksRouter.delete(
  '/link/:id',
  isAuthenticated,
  async (req: Request<{ id: number }>, res: Response) => {
    try {
      const user = req.user as LpUser;

      const link = await Link.model.findOne({
        where: {
          id: req.params.id,
          UserId: user.id,
        },
      });

      if (link) {
        // @ts-ignore
        await link.setCategories([]);
        await link.destroy();
        successResponse(res, true);
      } else {
        errorResponse(res, 'Link not found', 400);
      }
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

export default linksRouter;
