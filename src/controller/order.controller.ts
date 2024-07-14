import { NextFunction, Request, Response } from "express";
import { ResultType } from "../util/result";
import { Order } from "../model/order.model";
import { Food } from "../model/food.model";
import { ModelProperties } from "../util/common";
import { Op } from "sequelize";
import { OrderFood } from "../model/orderfood.model";
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
                // check if there's enough food quantity available and all specified foods exist
                || await (async (n: number) => {
                    let results = (await Food.findAll({
                        where: {
                            id: {
                                [Op.in]: foods.map((x: any) => x.id) 
                            }
                        }
                    }));
                    return results.length === foods.length
                    && results.every((x: Food, idx: number) => x.quantity >= foods.at(idx)!.quantity);
                })(foods.length)
            ) {
                next(ResultType.InvalidInput);
            }

            req.body.foods = { OrderFood: req.body.foods };
            let order = await Order.create(req.body, { include: Food });
            req.result = resultFactory
            .generate(ResultType.CreatedOrder)
            .setData(order);
            next();
        }
        catch(err) {
            next(ResultType.InvalidInput);
        }
    }

    public static async read(req: Request, res: Response, next: NextFunction) {
        // use query parameters
        let orders = await Order.findAll({ where: req.params, include: {
            model: Food, 
            attributes: ['name']
        }});
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
        let rows = await Order.update(req.body, { where: req.params });
        if(rows[0] !== 0) {
            req.result = resultFactory
            .generate(ResultType.UpdatedOrder);
            next();
        }
        else {
            next(ResultType.OrderNotFound);
        }
    }

    public static async destroy(req: Request, res: Response, next: NextFunction) {
        let rows = await Order.destroy({ where: req.params });
        if(rows !== 0) {
            req.result = resultFactory
            .generate(ResultType.DestroyedOrder);
            next();
        }
        else {
            next(ResultType.OrderNotFound);
        }
    }
}
