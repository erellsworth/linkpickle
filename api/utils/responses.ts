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

export const errorResponse = <T>(res: Response, message: string, code: number = 500, data?: T): void => {
    const response: ApiResponse<T> = {
        success: false,
        error: {
            message,
            code
        },
        data
    };

    res.json(response);
}

export const notFoundResponse = (res: Response, contentType: string = 'Page'): void => {
    errorResponse(res, `${contentType} not found`, 404);
}
