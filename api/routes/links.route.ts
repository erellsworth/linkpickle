import { Request, Response } from "express";
import linksRouter from "./router";
import { errorResponse, successResponse } from "../utils/responses";
import { Category, Comment, Link, Site, User } from "../models";
import isAuthenticated from "./auth.midleware";
import { LpUser } from "../interfaces/user";
import { LpLink } from "../interfaces/link";

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

linksRouter.post('/links', isAuthenticated, async (req: Request<{}, { link: LpLink }>, res: Response) => {

    try {
        const user = req.user as LpUser;

        const link = {
            ...req.body.link, ...{
                UserId: user.id
            }
        };

        const newLink = await Link.model.create(link);

        successResponse(res, newLink);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

export default linksRouter;