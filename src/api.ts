import dotenv from "dotenv";
dotenv.config();
import { json, NextFunction, Request, Response, Router } from "express";
import { result } from "./middleware/result.middleware";
import { FoodController } from "./controller/food.controller";
import { OrderController } from "./controller/order.controller";
import { CreateFoodRequest, ReadFoodRequest, UpdateFoodRequest } from "./request/food.request";
import { beginTransaction, endTransaction, filterRequest } from "./middleware/request.middleware";
import { CreateOrderRequest, LoadOrderRequest, ReadOrderRequest, UpdateOrderRequest } from "./request/order.request";
import { StatusCodes } from "http-status-codes";
import { DatabaseHandler } from "./util/handlers/database.handler";
import { Food } from "./model/food.model";
import { Order } from "./model/order.model";
import { OrderFood } from "./model/orderfood.model";
import { ApiHandler } from "./util/handlers/api.handler";
import { Event } from "./model/event.model";
import { EventController } from "./controller/event.controller";
import { adaptFoods, adaptQueryDateRanges, adaptQueryObjectList, foodsExist, hasDuplicates, isOrderActive, isOrderOwnerOrAdmin, prepareFoods } from "./middleware/order.middleware";
import { NullRequest } from "./util/request";
import { hasRoles, isAuthenticated } from "./middleware/auth.middleware";

(async () => {
    let db = DatabaseHandler.getInstance();
    try {
        await db.initializeModels(
            console.log, 
            [Food, Order, OrderFood, Event], 
            { force: process.env.FORCE_SYNC === 'true' }
        );
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }

    let api = ApiHandler.getInstance();
    api.initializeRoutes(
        [
            {
                name: 'foods', 
                router: Router()
                    .use(json())
                    .use(beginTransaction(db.getConnection()))
                    .get('/', [
                        filterRequest(NullRequest), 
                        FoodController.read, 
                    ])
                    .post('/', 
                        isAuthenticated(), [
                        hasRoles(['worker', 'admin']), 
                        filterRequest(CreateFoodRequest), 
                        FoodController.create, 
                    ])
                    .get('/:id', 
                        isAuthenticated(), [
                        filterRequest(ReadFoodRequest), 
                        FoodController.read, 
                    ])
                    .get('/:id/events', 
                        isAuthenticated(), [
                        filterRequest(ReadFoodRequest), 
                        adaptQueryDateRanges('created_at', 'from', 'to'), 
                        FoodController.readEvents, 
                    ])
                    .put('/:id', 
                        isAuthenticated(), [
                        hasRoles(['worker', 'admin']), 
                        filterRequest(UpdateFoodRequest), 
                        FoodController.read, 
                        EventController.loadFood, 
                        FoodController.update, 
                    ])
                    .use(endTransaction)
                    .use(result(api.getLogger()))
            }, 
            {
                name: 'orders', 
                router: Router()
                    .use(json())
                    .use(beginTransaction(db.getConnection()))
                    .get('/', [
                        filterRequest(NullRequest), 
                        adaptQueryObjectList('id', 'foods', (x: string) => BigInt(x)), 
                        adaptQueryDateRanges('created_at', 'created_from', 'created_to'), 
                        adaptQueryDateRanges('updated_at', 'updated_from', 'updated_to'), 
                        OrderController.readAll, 
                    ])
                    .post('/', 
                        isAuthenticated(), [
                        filterRequest(CreateOrderRequest), 
                        hasDuplicates, 
                        adaptFoods, 
                        FoodController.read, 
                        foodsExist, 
                        prepareFoods, 
                        OrderController.create, 
                    ])
                    .get('/:id', 
                        isAuthenticated(), [
                        filterRequest(ReadOrderRequest), 
                        OrderController.read, 
                        isOrderOwnerOrAdmin, 
                    ])
                    .get('/:id/info', 
                        isAuthenticated(), [
                        filterRequest(ReadOrderRequest), 
                        OrderController.readEvents, 
                        isOrderOwnerOrAdmin, 
                    ])
                    .post('/:id/load', 
                        isAuthenticated(), [
                        hasRoles(['worker', 'admin']), 
                        filterRequest(LoadOrderRequest), 
                        OrderController.read, 
                        isOrderActive, 
                        EventController.loadOrder, 
                        filterRequest(UpdateOrderRequest), 
                        OrderController.update, 
                        FoodController.update, 
                    ])
                    .use(endTransaction)
                    .use(result(api.getLogger()))
            }, 
            {
                name: '', 
                router: Router()
                    .get('/healthcheck', (req: Request, res: Response) => {
                        res.sendStatus(StatusCodes.OK);
                    })
                    .all('*', (req: Request, res: Response) => {
                        res.sendStatus(StatusCodes.IM_A_TEAPOT);
                    })
            }
        ], 
        console.log, 
    );
    api.run(parseInt(process.env.API_PORT || '8000'));
})();
