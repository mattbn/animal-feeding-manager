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
            next(ResultType.InvalidInput);
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
        let rows = await Food.update(
            req.body, 
            {
                where: req.params, 
                transaction: req.transaction ? req.transaction : undefined
            }
        );
        if(rows[0] !== 0) {
            req.result = resultFactory
            .generate(ResultType.UpdatedFood);
            next();
        }
        else {
            next(ResultType.FoodNotFound);
        }
    }
}
