import { Response } from "express";
import { ApiResponse } from "../interfaces/api";

export const successResponse = <T>(res: Response, data: T): void => {
    if (data) {
        const response: ApiResponse<T> = {
            success: Boolean(data),
            data
        };
        res.json(response);
    } else {
        // this is just a fallback. successResponse should not be called if there is no data
        notFoundResponse(res);
    }
}

export const errorResponse = (res: Response, message: string, code: number = 500): void => {
    const response: ApiResponse = {
        success: false,
        error: {
            message,
            code
        }
    };

    res.json(response);
}

export const notFoundResponse = (res: Response): void => {
    errorResponse(res, 'Page not found', 404);
}
