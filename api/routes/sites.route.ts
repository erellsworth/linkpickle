import { Request, Response } from "express";
import sitesRouter from "./router";
import { errorResponse, successResponse } from "../utils/responses";
import { Link, Site } from "../models";
import isAuthenticated from "./auth.midleware";
import { LpSite } from "../interfaces/site";

sitesRouter.get('/sites', isAuthenticated, async (req: Request<{ page: number }>, res: Response) => {

    try {
        const sites = await Site.model.findAll({
            include: Link.model
        });

        successResponse<LpSite[]>(res, sites);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }
});

export default sitesRouter;