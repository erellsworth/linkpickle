import { Request, Response } from "express";
import linksRouter from "./router";
import { successResponse } from "../utils/responses";

linksRouter.get('/:page?', async (req: Request<{ page: number }>, res: Response) => {

    let { page } = req.params;

    if (!page) {
        page = 1;
    }

    successResponse(res, { page });
});

export default linksRouter;