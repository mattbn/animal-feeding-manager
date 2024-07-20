import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { OrderStatus } from "../model/order.model";
import { ResultType } from "../util/result";
import { resultFactory } from "../util/factory/result.factory";

export function adaptQueryDateRanges(paramName: string, beginName: string, endName: string) {
    return function(req: Request, res: Response, next: NextFunction) {
        let obj: any;
        if(req.query[beginName] !== undefined && req.query[endName] !== undefined) {
            obj = {
                [Op.gt]: new Date(req.query[beginName] as string), 
                [Op.lt]: new Date(req.query[endName] as string), 
            };
            delete req.query[beginName];
            delete req.query[endName];
        }
        else if(req.query[beginName] !== undefined) {
            obj = { [Op.gt]: new Date(req.query[beginName] as string) };
            delete req.query[beginName];
        }
        else if(req.query[endName] !== undefined) {
            obj = { [Op.lt]: new Date(req.query[endName] as string) };
            delete req.query[endName];
        }
        if(obj !== undefined) {
            req.query[paramName] = obj;
        }
        next();
    }
}

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

export function isOrderActive(req: Request, res: Response, next: NextFunction) {
    let invalidStatuses = [OrderStatus.Completed, OrderStatus.Failed];
    if(!req.result || invalidStatuses.includes(req.result.getData().status)) {
        next(ResultType.InactiveOrder);
    }
    else {
        next();
    }
}

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

export function adaptFoods(req: Request, res: Response, next: NextFunction) {
    (req.params.id as any) = {
        [Op.in]: req.body.foods.map((f: any) => f.id)
    };
    next();
}

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
