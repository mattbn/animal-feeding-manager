import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export function validateQuery(req: Request, res: Response, next: NextFunction) {
    let created_at: any;
    let updated_at: any;
    let foods: any;
    if(req.query.created_from && req.query.created_to) {
        created_at = {
            [Op.gt]: new Date(req.query.created_from as string), 
            [Op.lt]: new Date(req.query.created_to as string)
        };
    }
    else if(req.query.created_from) {
        created_at = { [Op.gt]: new Date(req.query.created_from as string) };
    }
    else if(req.query.created_to) {
        created_at = { [Op.lt]: new Date(req.query.created_to as string) };
    }
    if(req.query.updated_from && req.query.updated_to) {
        created_at = {
            [Op.gt]: new Date(req.query.updated_from as string), 
            [Op.lt]: new Date(req.query.updated_to as string)
        };
    }
    else if(req.query.updated_from) {
        updated_at = { [Op.gt]: new Date(req.query.updated_from as string) };
    }
    else if(req.query.updated_to) {
        updated_at = { [Op.lt]: new Date(req.query.updated_to as string) };
    }
    if(req.query.foods) {
        foods = req.query.foods
        .toString()
        .split(',')
        .map((x: string) => BigInt(x));
    }
    if(created_at !== undefined) {
        req.params.created_at = created_at;
    }
    if(updated_at !== undefined) {
        req.params.updated_at = updated_at;
    }
    if(foods !== undefined) {
        req.params.foods = foods;
    }
    next();
}
