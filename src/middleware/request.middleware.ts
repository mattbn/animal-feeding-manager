import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize";
import { ResultType } from "../util/result";
import { BaseRequest } from "../util/request";

/**
 * Checks if all request parameters are present in the request data, then removes any other parameter
 * @param requestType - The request type
 */
export function filterRequest(requestType: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        let request = new requestType(req.params, req.query, req.body);
        if(
            Object.getOwnPropertyNames(request.params).some((prop: string) => !(prop in req.params))
            || Object.getOwnPropertyNames(request.body).some((prop: string) => !(prop in req.body))
        ) {
            next(ResultType.InvalidInput);
        }
        else {
            (req.params as any) = BaseRequest.keepDefinedValues(request.params);
            req.body = BaseRequest.keepDefinedValues(request.body);
            (req.query as any) = BaseRequest.keepDefinedValues(request.query);
            next();
        }
    }
}

/**
 * Begins a transaction in the database.
 * @param sequelize - The database connection
 */
export function beginTransaction(sequelize: Sequelize) {
    return async function(req: Request, res: Response, next: NextFunction) {
        if(req.transaction === undefined) {
            req.transaction = await sequelize.transaction();
        }
        next();
    }
}

/**
 * Performs a commit in the database.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export async function endTransaction(req: Request, res: Response, next: NextFunction) {
    if(req.transaction !== undefined) {
        await req.transaction.commit();
        req.transaction = undefined;
    }
    next();
}
