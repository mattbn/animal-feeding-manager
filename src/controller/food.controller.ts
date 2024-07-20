import { NextFunction, Request, Response } from "express";
import { Food } from "../model/food.model";
import { resultFactory } from "../util/factory/result.factory";
import { ResultType } from "../util/result";
import { UniqueConstraintError } from "sequelize";

export class FoodController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            let food = await Food.create(
                req.body, 
                { transaction: req.transaction ? req.transaction : undefined }
            );
            req.result = resultFactory
            .generate(ResultType.CreatedFood)
            .setData(food);
            next();
        }
        catch(err) {
            if(err instanceof UniqueConstraintError) {
                next(ResultType.FoodAlreadyCreated);
            }
            else {
                next(ResultType.InvalidInput);
            }
        }
    }

    public static async read(req: Request, res: Response, next: NextFunction) {
        let foods = await Food.findAll({
            where: req.params, 
            transaction: req.transaction ? req.transaction : undefined
        });
        if(foods && foods.length !== 0) {
            req.result = resultFactory
            .generate(ResultType.ReadFood)
            .setData(foods.length === 1 ? foods[0] : foods);
            next();
        }
        else {
            next(ResultType.FoodNotFound);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction) {
        req.body.user = req.caller!.name;
        let rows = await Food.update(
            req.body, 
            {
                where: req.params, 
                transaction: req.transaction ? req.transaction : undefined
            }
        );
        if(rows[0] !== 0) {
            if(req.result === undefined || req.result.getType() === ResultType.ReadFood) {
                req.result = resultFactory
                .generate(ResultType.UpdatedFood);
            }
            next();
        }
        else {
            next(ResultType.FoodNotFound);
        }
    }

    public static async readEvents(req: Request, res: Response, next: NextFunction) {
        try {
            let options: any = { transaction: req.transaction ? req.transaction : undefined };
            let food = await Food.findByPk(req.params.id, options);
            if(food) {
                if(req.params.created_at) {
                    options.where = { created_at: req.params.created_at };
                }
                let events = await food.getEvents(options);
                req.result = resultFactory
                .generate(ResultType.ReadFoodEvents)
                .setData(events);
                next();
            }
            else {
                next(ResultType.FoodNotFound);
            }
        }
        catch(err) {
            next(ResultType.Unknown);
        }
    }
}
