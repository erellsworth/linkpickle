import { Response } from 'express';
import { ApiResponse } from '../interfaces/api';
import { LpUser } from '../interfaces/user';

export const successResponse = <T>(
  res: Response,
  data: T,
  user?: LpUser,
): void => {
  if (data) {
    const response: ApiResponse<T> = {
      success: Boolean(data),
      data,
    };

    if (user) {
      response.user = user;
    }

    res.json(response);
  } else {
    // this is just a fallback. successResponse should not be called if there is no data
    notFoundResponse(res);
  }
};

export const errorResponse = <T>(
  res: Response,
  message: string,
  code: number = 500,
  data?: T,
): void => {
  const response: ApiResponse<T> = {
    success: false,
    error: {
      message,
      code,
    },
    data,
  };

  res.status(code).json(response);
};

export const notFoundResponse = (
  res: Response,
  contentType: string = 'Page',
): void => {
  errorResponse(res, `${contentType} not found`, 404);
};
