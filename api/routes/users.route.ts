import { Request, Response } from "express";
import usersRouter from "./router";
import { errorResponse, successResponse } from "../utils/responses";
import { User } from "../models";

usersRouter.post('/user/register', async (req: Request<{}, { email: string, password: string }>, res: Response) => {

    try {
        const { email, password } = req.body;

        const result = await User.register(email, password);

        if (result.success) {
            return successResponse(res, {});
        }

        return errorResponse(res, result.error?.message as string);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }
});

usersRouter.post('/user/login', async (req: Request<{}, { email: string, password: string }>, res: Response) => {

    try {
        const { email, password } = req.body;

        const result = await User.register(email, password);

        if (result.success) {
            return successResponse(res, {});
        }

        return errorResponse(res, result.error?.message as string);
    } catch (e) {
        errorResponse(res, (e as Error).message);
    }
});

export default usersRouter;