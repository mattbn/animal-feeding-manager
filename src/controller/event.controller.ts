import { NextFunction, Request, Response } from "express";
import { Event } from "../model/event.model";
import { ResultType } from "../util/result";
import { Food } from "../model/food.model";
import { ErrorMessage, Order, OrderStatus } from "../model/order.model";

const N = parseInt(process.env.N || '0');

export class EventController {
    public static async loadFood(req: Request, res: Response, next: NextFunction) {
        let food: Food = req.result.getData();
        req.body.quantity = food.quantity + req.body.quantity;
        try {
            let event = await Event.create(
                {
                    user: req.caller!.name, 
                    quantity: req.body.quantity, 
                    food: food.id, 
                }, 
                {
                    transaction: req.transaction ? req.transaction : undefined, 
                }
            );
            next();
        }
        catch(err) {
            next(ResultType.Unknown);
        }
    }

    public static async loadOrder(req: Request, res: Response, next: NextFunction) {
        let options = { transaction: req.transaction ? req.transaction : undefined };
        let order: Order = req.result.getData();
        let loaded = req.body.quantity;
        try {
            req.body.status = order.status;
            req.body.msg = order.msg;
            let food = await Food.findByPk(req.body.food, options);
            if(food!.quantity < loaded) {
                next(ResultType.NotEnoughFood);
            }
            else {
                await Event.create({
                    user: req.caller!.name, 
                    order: order.id, 
                    food: req.body.food, 
                    quantity: loaded, 
                }, options);
                let events = await order.getEvents({
                    transaction: options.transaction, 
                });
                if(order.status === OrderStatus.Created) {
                    order.status = OrderStatus.Running;
                    req.body.status = OrderStatus.Running;
                }
                let orderFoods = await order.getFoods({
                    include: [{
                        model: Order, 
                        through: {
                            attributes: ['quantity'], 
                        }
                    }], 
                    order: [['created_at', 'asc']], 
                    transaction: options.transaction, 
                });
                let zipped = events.map((e: Event, i: number) => {
                    return { event: e, food: orderFoods[i] };
                });
                if(zipped.some((x: any) => x.event.food !== x.food.id)) {
                    req.body.status = OrderStatus.Failed;
                    req.body.msg = ErrorMessage.InvalidLoadSequence;
                    next();
                }
                else if(zipped.some((x: any) => {
                    let required = x.food.OrderFoods.quantity;
                    let loaded = x.event.quantity;
                    return loaded < required - required*(N/100)
                    || loaded > required + required*(N/100);
                })) {
                    req.body.status = OrderStatus.Failed;
                    req.body.msg = ErrorMessage.InvalidLoadedQuantity;
                    next();
                }
                else {
                    if(events.length === orderFoods.length) {
                        req.body.status = OrderStatus.Completed;
                    }
                    next();
                }
            }
        }
        catch(err) {
            next(ResultType.Unknown);
        }
    }
}
