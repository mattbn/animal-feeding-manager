import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { Order, OrderStatus } from "../model/order.model";
import { ResultType } from "../util/result";
import { resultFactory } from "../util/factory/result.factory";

/**
 * Translates date ranges in query parameters to a single query parameter.
 * @param paramName - The name of the output parameter
 * @param beginName - The name of the range's lower bound date query parameter
 * @param endName - The name of the range's upper bound date query paramter
 */
export function adaptQueryDateRanges(paramName: string, beginName: string, endName: string) {
    return function(req: Request, res: Response, next: NextFunction) {
        let obj: any;
        if(req.query[beginName] !== undefined && req.query[endName] !== undefined) {
            obj = {
                [Op.gte]: req.query[beginName] as string, 
                [Op.lte]: req.query[endName] as string, 
            };
            delete req.query[beginName];
            delete req.query[endName];
        }
        else if(req.query[beginName] !== undefined) {
            obj = { [Op.gte]: req.query[beginName] as string };
            delete req.query[beginName];
        }
        else if(req.query[endName] !== undefined) {
            obj = { [Op.lte]: req.query[endName] as string };
            delete req.query[endName];
        }
        if(obj !== undefined) {
            req.query[paramName] = obj;
        }
        next();
    }
}

/**
 * Applies a map function and translates a list in query parameters to another list parameter
 * @param paramName - The output list parameter name
 * @param queryName - The name of the list in query parameters
 * @param mapFn - The map function that will be applied to the list values
 */
export function adaptQueryObjectList(
    paramName: string, 
    queryName: string, 
    mapFn: (x: any) => any
) {
    return function(req: Request, res: Response, next: NextFunction) {
        let obj: any;
        if(req.query[queryName] !== undefined) {
            obj = {
                [Op.in]: req.query[queryName]
                    .toString()
                    .split(',')
                    .map(mapFn)
            };
        }
        if(obj !== undefined) {
            delete req.query[queryName];
            req.query[paramName] = obj;
        }
        next();
    }
}

/**
 * Checks if the current order is not failed or completed.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function isOrderActive(req: Request, res: Response, next: NextFunction) {
    let invalidStatuses = [OrderStatus.Completed, OrderStatus.Failed];
    if(!req.result || invalidStatuses.includes(req.result.getData().status)) {
        next(ResultType.InactiveOrder);
    }
    else {
        next();
    }
}

/**
 * Checks if the food list has duplicates.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function hasDuplicates(req: Request, res: Response, next: NextFunction) {
    if(req.body.foods.some((x: any, i: number, self: any[]) => {
        return self.indexOf(self.find((y: any) => x.id === y.id)) !== i;
    })) {
        next(ResultType.DuplicateFoods);
    }
    else {
        next();
    }
}

/**
 * Translates a food list to a sequelize where option.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function adaptFoods(req: Request, res: Response, next: NextFunction) {
    (req.params.id as any) = {
        [Op.in]: req.body.foods.map((f: any) => f.id)
    };
    next();
}

/**
 * Checks if all current foods exist.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function foodsExist(req: Request, res: Response, next: NextFunction) {
    let foods = req.result.getData();
    if(!(foods instanceof Array)) {
        foods = [foods];
    }
    if(req.body.foods.length !== foods.length) {
        req.result = resultFactory
        .generate(ResultType.FoodNotFound);
        next(ResultType.FoodNotFound);
    }
    else {
        next();
    }
}

/**
 * Changes food objects shape by adding the current order's required quantity.
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function prepareFoods(req: Request, res: Response, next: NextFunction) {
    let foods = req.result.getData();
    if(foods instanceof Array) {
        req.body.foods = req.body.foods.map((x: any) => {
            return {
                required: x.quantity, 
                food: foods.find((y: any) => y.id == x.id)
            };
        });
    }
    else {
        req.body.foods = [{
            required: req.body.foods[0].quantity, 
            food: foods, 
        }];
    }
    next();
}

/**
 * Checks if the caller is the Order owner or an admin
 * @param req - Express.js Request object
 * @param res - Express.js Response object
 * @param next - Express.js NextFunction object
 */
export function isOrderOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
    if(req.result !== undefined && req.caller) {
        let order = req.result.getData() as Order;
        if(order.owner === req.caller.name || req.caller.role === 'admin') {
            next();
        }
        else {
            next(ResultType.Unauthorized);
        }
    }
}
