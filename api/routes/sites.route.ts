import { Request, Response } from "express";
import sitesRouter from "./router";
import { errorResponse, successResponse } from "../utils/responses";
import { Link, Site, User } from "../models";
import isAuthenticated from "./auth.midleware";

sitesRouter.get('/sites/:page?', isAuthenticated, async (req: Request<{ page: number }>, res: Response) => {

    let { page } = req.params;

    if (!page) {
        page = 1;
    }

    try {
        const sites = await Site.model.findAll({
            include: {
                model: Link.model,
                include: [User.model]
            }
        });
        successResponse(res, { sites });
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

export default sitesRouter;