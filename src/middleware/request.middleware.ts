import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize";

export function filterRequest(requestType: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        let request = new requestType(req.params, req.query, req.body);
        req.params = request.params;
        req.body = request.body;
        req.query = request.query;
        next();
    }
}

export function beginTransaction(sequelize: Sequelize) {
    return async function(req: Request, res: Response, next: NextFunction) {
        if(req.transaction === undefined) {
            req.transaction = await sequelize.transaction();
        }
        next();
    }
}

export async function endTransaction(req: Request, res: Response, next: NextFunction) {
    if(req.transaction !== undefined) {
        await req.transaction.commit();
        req.transaction = undefined;
    }
    next();
}
