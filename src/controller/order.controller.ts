import { NextFunction, Request, Response } from "express";
import { ResultType } from "../util/result";
import { ErrorMessage, Order, OrderStatus } from "../model/order.model";
import { Food } from "../model/food.model";
import { resultFactory } from "../util/factory/result.factory";
import { Event } from "../model/event.model";

export class OrderController {
    /**
     * Creates an Order in the database.
     * @param req - Express.js Request object
     * @param res - Express.js Response object
     * @param next - Express.js NextFunction object
     */
    public static async create(req: Request, res: Response, next: NextFunction) {
        try {
            if(req.body.foods.every((f: any) => f.required <= f.food.quantity)) {
                req.body.owner = req.caller!.name;
                let order = await Order.create(
                    req.body, 
                    {
                        transaction: req.transaction ? req.transaction : undefined
                    }
                );
                for(let f of req.body.foods) {
                    await order.addFood(
                        f.food.id, 
                        {
                            through: { quantity: f.required }, 
                            transaction: req.transaction ? req.transaction : undefined
                        }
                    );
                }
                req.result = resultFactory
                .generate(ResultType.CreatedOrder)
                .setData(order);
                next();
            }
            else {
                next(ResultType.NotEnoughFood);
            }
        }
        catch(err) {
            next(ResultType.Unknown);
        }
    }

    /**
     * Reads all Orders in the database.
     * @param req - Express.js Request object
     * @param res - Express.js Response object
     * @param next - Express.js NextFunction object
     */
    public static async readAll(req: Request, res: Response, next: NextFunction) {
        try {
            let orders: any = await Order.findAll({
                where: req.params, 
                include: {
                    model: Food, 
                    attributes: ['id'], 
                    through: {
                        attributes: ['quantity'], 
                        as: 'details', 
                    }, 
                    where: req.query, 
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
        catch(err) {
            next(ResultType.Unknown);
        }
    }

    /**
     * Reads a specific Order.
     * @param req - Express.js Request object
     * @param res - Express.js Response object
     * @param next - Express.js NextFunction object
     */
    public static async read(req: Request, res: Response, next: NextFunction) {
        let orders: any = await Order.findAll({
            where: req.params, 
            include: [
                {
                    model: Food, 
                    attributes: ['id'], 
                    through: {
                        attributes: ['quantity'], 
                        as: 'details', 
                    }
                }, 
            ], 
            transaction: req.transaction ? req.transaction : undefined
        });
        if(orders && orders.length !== 0) {
            orders = orders[0];
            req.result = resultFactory
            .generate(ResultType.ReadOrder)
            .setData(orders);
            next();
        }
        else {
            next(ResultType.OrderNotFound);
        }
    }

    /**
     * Reads all Events of a specific Order.
     * @param req - Express.js Request object
     * @param res - Express.js Response object
     * @param next - Express.js NextFunction object
     */
    public static async readEvents(req: Request, res: Response, next: NextFunction) {
        try {
            let options: any = {
                transaction : req.transaction ? req.transaction : undefined
            };
            let order: any = await Order.findByPk(req.params.id, {
                transaction: options.transaction, 
                include: [
                    {
                        model: Food, 
                        attributes: ['id'], 
                        through: {
                            attributes: ['quantity'], 
                            as: 'details', 
                        }
                    }, 
                    Event, 
                ], 
            });
            if(order) {
                let events = await order.getEvents(options);
                let total_load_time: number | undefined;
                let foods: any[] | undefined;
                if(order.status === OrderStatus.Completed) {
                    foods = order.Foods.map((f: any) => {
                        let loaded = events.find((e: any) => e.food === f.id)!.quantity;
                        f = f.toJSON();
                        f.quantity_difference = Math.abs(loaded - f.details.quantity);
                        return f;
                    });
                    total_load_time = new Date(events.at(events.length - 1)!.created_at).getTime() - 
                        new Date(events.at(0)!.created_at).getTime();
                }
                if(foods !== undefined && total_load_time !== undefined) {
                    order = order.toJSON();
                    order.total_load_time = total_load_time;
                    order.Foods = foods;
                }
                req.result = resultFactory
                .generate(ResultType.ReadOrder)
                .setData(order);
                next();
            }
            else {
                next(ResultType.OrderNotFound);
            }
        }
        catch(err) {
            next(ResultType.Unknown);
        }
    }

    /**
     * Updates a specific Order.
     * @param req - Express.js Request object
     * @param res - Express.js Response object
     * @param next - Express.js NextFunction object
     */
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
            let type: ResultType = ResultType.UpdatedOrder;
            if(req.body.status === OrderStatus.Failed) {
                type = (req.body.msg === ErrorMessage.InvalidLoadSequence ? 
                ResultType.InvalidLoadSequence : ResultType.InvalidLoadedQuantity);
            }
            else {
                // update food quantity
                let food = await Food.findByPk(req.body.food);
                if(food) {
                    req.body.quantity = food.quantity - req.body.quantity;
                }
                else {
                    next(ResultType.FoodNotFound);
                    return;
                }
            }
            req.result = resultFactory
            .generate(type);
            next();
        }
        else {
            next(ResultType.OrderNotFound);
        }
    }
}
