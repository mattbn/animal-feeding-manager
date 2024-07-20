import { NextFunction, Request, Response } from "express";
import { ResultType } from "../util/result";
import { JwtPayload, verify } from "jsonwebtoken";

/**
 * Checks if the caller provided a valid JWT token.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function hasToken(req: Request, res: Response, next: NextFunction) {
    if(req.headers.authorization) {
        req.encondedToken = req.headers.authorization.split(' ')[1];
        next();
    }
    else {
        next(ResultType.Unauthenticated);
    }
}

/**
 * Validates the JWT token.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function validateToken(req: Request, res: Response, next: NextFunction) {
    try {
        let caller = verify(
            req.encondedToken, 
            process.env.SECRET_KEY!, 
            {
                audience: 'animal-feeding-manager', 
            }
        ) as JwtPayload;
        req.caller = {
            name: caller.name, 
            role: caller.role, 
        };
        next();
    }
    catch(err) {
        next(ResultType.Unauthorized);
    }
}

/**
 * Packs authentication middlewares
 * @returns The list of middlewares that can be used to check if the caller is authenticated
 */
export function isAuthenticated() {
    return [
        hasToken, 
        validateToken, 
    ];
}

/**
 * Checks if the caller has a specific role.
 * @param role - A set of roles
 */
export function hasRoles(role: string[]) {
    return function(req: Request, res: Response, next: NextFunction) {
        if(req.caller && role.includes(req.caller.role)) {
            next();
        }
        else {
            next(ResultType.Unauthorized);
        }
    }
}
