import { NextFunction, Request, Response } from "express";
import { Event } from "../model/event.model";
import { ResultType } from "../util/result";
import { Food } from "../model/food.model";
import { ErrorMessage, Order, OrderStatus } from "../model/order.model";
import sequelize from "sequelize";
import { OrderFood } from "../model/orderfood.model";
import { resultFactory } from "../util/factory/result.factory";

const N = parseInt(process.env.N || '0');

export class EventController {
    public static async loadFood(req: Request, res: Response, next: NextFunction) {
        let food: Food = req.result.getData();
        req.body.quantity = food.quantity + req.body.quantity;
        try {
            let event = await Event.create(
                {
                    user: req.body.user, 
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
                    user: req.body.user, // req.caller.name
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

    /*
    private static async isQuantityInRange(order: any, events: any[], food: Food | bigint): Promise<boolean> {
        if(typeof(food) === 'bigint') {
            food = (await Food.findByPk(food))!;
        }
        let required = order.foods.find((f: any) => f.id === food.id).details.quantity;
        let loaded =  events.filter((e: any) => e.food === food)
            .map((x: any) => x.quantity)
            .reduce((x: number, y: number) => x + y);
        if(
            loaded < required - (N/100) * required
            || loaded > required + (N/100) * required
        ) {
            return false;
        }
        return true;
    }

    public static async create(req: Request, res: Response, next: NextFunction) {
        let options = {
            transaction: req.transaction ? req.transaction : undefined
        };
        if(req.body.food) { // it's an order load
            let order: Order = req.result.getData();
            let orderFoods = await order.getFoods({
                attributes: ['id', 'quantity'], 
                include: [{
                    model: Event, 
                    attributes: ['id', 'quantity'], 
                }], 
                order: [['created_at', 'asc']], 
                transaction: req.transaction ? req.transaction : undefined
            }); // [ { quantity, { id, quantity, [ id, quantity ] } } ]
            //          ^required         ^available     ^loaded
            console.log(JSON.stringify(orderFoods, undefined, 2));
            let foodInstance = orderFoods.find((x: any) => x.id == req.body.food);
            if(foodInstance !== undefined) {
                let event = await Event.create(
                    {
                        quantity: req.body.quantity,
                        user: req.body.user, 
                        food: req.body.food, 
                        order: order.id, 
                    }, 
                    {
                        transaction: req.transaction ? req.transaction : undefined
                    }
                );

                if(order.status === OrderStatus.Created) {
                    req.body.status = OrderStatus.Running;
                }
                orderFoods = await Promise.all(
                    orderFoods.map(async (f: Food, i: number) => await f.reload({
                        transaction: req.transaction ? req.transaction : undefined
                    }))
                );
                console.log(JSON.stringify(orderFoods, undefined, 2));
                let events: any[] = await order.getEvents({
                    group: ['food'], 
                    order: [['created_at', 'desc']], 
                    attributes: [
                        'food', 
                        [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity']
                    ], 
                    transaction: req.transaction ? req.transaction : undefined
                });
                if(events.at(0).food != req.body.food && events.at(1).food != req.body.food) {
                    next(ResultType.InvalidLoadSequence);
                }
                else {
                    // is order completed?
                    if(events.length === orderFoods.length) {
                        // are load quantities respected?
                        let invalidFood: any | undefined;
                        let invalidQuantity = orderFoods.some((f: any) => {
                            let loaded = f.Events.map((e: any) => e.quantity)
                                .reduce((x: number, y: number) => x + y);
                            let required = f.OrderFoods.quantity;
                            if(loaded < required - required*(N/100) 
                                || loaded > required + required*(N/100)
                            ) {
                                invalidFood = {
                                    id: f.id, 
                                    required: required, 
                                    loaded: loaded, 
                                };
                                return true;
                            }
                            return false;
                        });
                        if(invalidQuantity) {
                            req.result = resultFactory
                            .generate(ResultType.InvalidLoadedQuantity)
                            .setData(invalidFood);
                            next(ResultType.InvalidLoadedQuantity);
                            return;
                        }
                        else {
                            req.body.status = OrderStatus.Completed;
                        }
                    }
                    next();
                }
            }
        }
        else { // it's a food load
            let food: Food = req.result.getData();
            req.body.quantity = food.quantity + req.body.quantity;
        }
        next();
    }
        */
}
