import { NextFunction, Request, Response } from "express";
import { ResultType } from "../util/result";
import { JwtPayload, verify } from "jsonwebtoken";

export function hasToken(req: Request, res: Response, next: NextFunction) {
    if(req.headers.authorization) {
        req.encondedToken = req.headers.authorization.split(' ')[1];
        next();
    }
    else {
        next(ResultType.Unauthenticated);
    }
}

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

export function isAuthenticated() {
    return [
        hasToken, 
        validateToken, 
    ];
}

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
