import { Request, Response } from "express";
import urlMetadata from 'url-metadata';
import linksRouter from "./router";
import { errorResponse, successResponse } from "../utils/responses";
import { Category, Comment, Link, Site, User } from "../models";
import isAuthenticated from "./auth.midleware";
import { LpUser } from "../interfaces/user";
import { LpLink } from "../interfaces/link";
import { LpCategory } from "../interfaces/category";

linksRouter.get('/links/category/:id', isAuthenticated, async (req: Request<{ id: number; page: number }, {}, {}, { limit?: number }>, res: Response) => {

    const page = req.params.page || 1;
    const limit = req.query.limit || 9;
    const user = req.user as LpUser;

    try {
        const links = await Link.findByCategoryId(user.id, req.params.id, page, limit);
        successResponse(res, links);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

linksRouter.get('/links/:page?', isAuthenticated, async (req: Request<{ page: number; }, {}, {}, { limit?: number }>, res: Response) => {

    const page = req.params.page || 1;
    const limit = req.query.limit || 9;
    const user = req.user as LpUser;

    try {
        const links = await Link.findByUserId(user.id, page, limit);
        successResponse(res, links);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

linksRouter.get('/link/:id', isAuthenticated, async (req: Request<{ id: number; }>, res: Response) => {

    try {
        const links = await Link.model.findByPk(req.params.id, {
            include: [Category.model, Comment.model, Site.model, User.model],
        });
        successResponse(res, links);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

linksRouter.post('/links', isAuthenticated, async (req: Request<{}, { link: LpLink, categoryIds: number[] }>, res: Response) => {

    if (!req.body.link || !req.body.link.url) {
        return errorResponse(res, "Missing required link data", 400);
    }

    try {
        const url = new URL(req.body.link.url);
        const linkRecord = await Link.findByUrl(url.toString());

        if (linkRecord) {
            return errorResponse(res, 'Link already exists', 200, linkRecord);
        }

        const metadata = await urlMetadata(url.toString());

        const user = req.user as LpUser;

        const site = await Site.getFromDomain(url.hostname.replace(/^[^.]+\./g, ''), metadata);

        const link = {
            ...req.body.link, ...{
                UserId: user.id,
                SiteId: site.id
            }
        };

        link.description = link.description || metadata.description || metadata['og:description'];
        link.title = link.title || metadata.title || metadata['og:title'];

        const img = metadata.image || metadata['og:image'];

        if (img) {
            link.thumbnail = img;
        }

        const newLink = await Link.model.create(link);

        // @ts-ignore
        newLink.addCategories(req.body.categoryIds);

        successResponse(res, newLink);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

export default linksRouter;