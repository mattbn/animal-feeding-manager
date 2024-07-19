import { NextFunction, Request, Response } from "express";
import { ResultType } from "../util/result";
import { Order } from "../model/order.model";
import { Food } from "../model/food.model";
import { Op } from "sequelize";
import { resultFactory } from "../util/factory/result.factory";

export class OrderController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            // check if foods exist
            let foods = (req.body.foods as {id: bigint, quantity: number}[])
            // remove duplicates
            .filter((x: any, idx: number, self: any[]) => idx === self.indexOf(x));
            if(foods === undefined 
                || foods instanceof Array === false 
                || foods.length === 0
            ) {
                next(ResultType.InvalidInput);
            }
            else {
                // check if there's enough food quantity available and all specified foods exist
                let result = await (async () => {
                    let results = (await Food.findAll({
                        where: {
                            id: {
                                [Op.in]: foods.map((x: any) => x.id) 
                            }
                        }, 
                        transaction: req.transaction ? req.transaction : undefined
                    }));
                    return [
                        results.length !== foods.length, 
                        results.some((x: Food, idx: number) => x.quantity < foods.at(idx)!.quantity)
                    ];
                })();
                if(result[0]) {
                    next(ResultType.SomeFoodsNotFound);
                }
                else if(result[1]) {
                    next(ResultType.NotEnoughFood);
                }
                else {
                    let order = await Order.create(
                        req.body, 
                        { transaction: req.transaction ? req.transaction : undefined }
                    );
                    for(let food of foods) {
                        await order.addFood(
                            food.id, 
                            {
                                through: { quantity: food.quantity }, 
                                transaction: req.transaction ? req.transaction : undefined
                            }
                        );
                    }
                    req.result = resultFactory
                    .generate(ResultType.CreatedOrder)
                    .setData(order);
                    next();
                }
            }
        }
        catch(err) {
            next(ResultType.Unknown);
        }
    }

    public static async read(req: Request, res: Response, next: NextFunction) {
        let orders = await Order.findAll({
            where: req.params, 
            include: {
                model: Food, 
                attributes: ['name'], 
                through: {
                    attributes: ['quantity'], 
                    as: 'details', 
                }
            }, 
            transaction: req.transaction ? req.transaction : undefined
        });
        if(orders && orders.length !== 0) {
            req.result = resultFactory
            .generate(ResultType.ReadOrder)
            .setData(orders.length === 1 ? orders[0] : orders);
            next();
        }
        else {
            next(ResultType.OrderNotFound);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction) {
        // can update status or msg
        let rows = await Order.update(
            req.body, 
            {
                where: req.params, 
                transaction: req.transaction ? req.transaction : undefined
            }
        );
        if(rows[0] !== 0) {
            req.result = resultFactory
            .generate(ResultType.UpdatedOrder);
            next();
        }
        else {
            next(ResultType.OrderNotFound);
        }
    }
}
