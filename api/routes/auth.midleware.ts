import { NextFunction, Request, Response } from 'express';
import { IVerifyOptions, Strategy } from 'passport-http-bearer';
import * as passport from 'passport';
import { User } from '../models';
import { errorResponse } from '../utils/responses';
import { LpUser } from '../interfaces/user';

passport.use(
  new Strategy(
    async (
      token: string,
      cb: (error: any, user?: any, options?: IVerifyOptions | string) => void
    ) => {
      const user = await User.findByToken(token);
      if (user) {
        return cb(null, user);
      }
      return cb(null, false, { message: 'User Not Found' } as IVerifyOptions);
    }
  )
);

const authenticated = passport.authenticate('bearer', {
  session: false,
});

const isAuthenticated = [
  authenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as LpUser;

    if (!user) {
      return errorResponse(res, 'Not logged in', 403);
    }

    next();
  },
];

export default isAuthenticated;
