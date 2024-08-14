import { Request, Response } from "express";
import settingsRouter from "./router";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responses";
import { Setting } from "../models";
import isAuthenticated from "./auth.midleware";

settingsRouter.get('/settings/:name?', isAuthenticated, async (req: Request<{ name?: string }>, res: Response) => {

    try {

        if (req.params.name) {
            const setting = await Setting.findByName(req.params.name);
            if (setting) {
                return successResponse(res, setting);
            }

            return notFoundResponse(res, 'Setting');
        }

        const settings = await Setting.findAll();
        successResponse(res, settings);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }

});

export default settingsRouter;