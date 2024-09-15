import { Request, Response } from 'express';
import usersRouter from './router';
import { errorResponse, successResponse } from '../utils/responses';
import { Setting, User } from '../models';
import isAuthenticated from './auth.midleware';
import { LpUser } from '../interfaces/user';

usersRouter.get(
  '/user/check',
  isAuthenticated,
  async (req: Request, res: Response) => {
    successResponse(res, {});
  }
);

//TODO: add email verification step
usersRouter.post(
  '/user/register',
  async (
    req: Request<
      {},
      { email: string; password: string; confirmPassword: string }
    >,
    res: Response
  ) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords to not match');
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters');
    }

    if (password.length > 16) {
      return errorResponse(res, 'Password must be 16 characters or less');
    }

    //TODO add password strength test

    try {
      const allowRegistration = await Setting.findByName('allowRegistration');

      if (!Boolean(allowRegistration)) {
        return errorResponse(res, 'Registration currently disabled');
      }

      const result = await User.register(email, password);

      if (result.success) {
        return successResponse(res, {});
      }

      return errorResponse(res, result.error?.message as string);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

usersRouter.post(
  '/user/login',
  async (
    req: Request<{}, { email: string; password: string }>,
    res: Response
  ) => {
    try {
      const { email, password } = req.body;

      const user = await User.authenticate(email, password);

      if (typeof user === 'string') {
        return errorResponse(res, user);
      }

      return successResponse(res, user);
    } catch (e) {
      errorResponse(res, (e as Error).message);
    }
  }
);

export default usersRouter;
