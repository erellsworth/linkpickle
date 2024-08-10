import { NextFunction, Request, Response } from "express";
import { IVerifyOptions, Strategy } from 'passport-http-bearer';
import * as passport from 'passport';
import { User } from "../models";


passport.use(new Strategy(async (
    token: string,
    cb: (error: any, user?: any, options?: IVerifyOptions | string) => void) => {
    const user = await User.findByToken(token);
    if (user) {
        return cb(null, user);
    }
    return cb('User Not Found');
}));

const isAuthenticated = passport.authenticate('bearer', { session: false });

export default isAuthenticated;
