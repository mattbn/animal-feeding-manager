import dotenv from "dotenv";
dotenv.config();
import { ApplicationHandler } from "./util/handlers/application.handler";
import { json, Request, Response, Router } from "express";
import { result } from "./middleware/result.middleware";
import { FoodController } from "./controller/food.controller";
import { OrderController } from "./controller/order.controller";
import { validateQuery } from "./middleware/order.middleware";
import { CreateFoodRequest, DestroyFoodRequest, ReadFoodRequest, UpdateFoodRequest } from "./request/food.request";
import { filterRequest } from "./middleware/request.middleware";
import { CreateOrderRequest, DestroyOrderRequest, ReadOrderRequest, UpdateOrderRequest } from "./request/order.request";
import { StatusCodes } from "http-status-codes";
import { DatabaseConnection, DatabaseHandler } from "./util/handlers/database.handler";
import { Food } from "./model/food.model";
import { Order } from "./model/order.model";
import { OrderFood } from "./model/orderfood.model";
import { ApiHandler } from "./util/handlers/api.handler";

(async () => {
    let app = new ApplicationHandler()
        .initialize(
            (await new DatabaseHandler()
                .initialize(
                    new DatabaseConnection('postgres')
                        .addUsername(process.env.DB_USERNAME || 'postgres')
                        .addPassword(process.env.DB_PASSWORD || 'password')
                        .addHost(process.env.DB_HOST || 'localhost')
                        .addPort(parseInt(process.env.DB_PORT || '5432'))
                        .addDatabase(process.env.DB_DATABASE || 'postgres')
                        .addDefine({
                            paranoid: true, 
                            deletedAt: 'deleted_at', 
                            createdAt: 'created_at', 
                            updatedAt: 'updated_at', 
                        }).create()
                        .getConnection()
                ).initializeModels(
                    console.log, [
                        Food, Order, OrderFood, 
                    ], 
                    { force: true }
                )).handler, 
            new ApiHandler()
                .initialize(console.log, [{
                    name: 'foods', 
                    router: Router()
                        .use(json())
                        .get('/', filterRequest(ReadFoodRequest), FoodController.read)
                        .post('/', filterRequest(CreateFoodRequest), FoodController.create)
                        .put('/', filterRequest(UpdateFoodRequest), FoodController.update)
                        .get('/:id', filterRequest(ReadFoodRequest), FoodController.read)
                        .put('/:id', filterRequest(UpdateFoodRequest), FoodController.update)
                        .delete('/:id', filterRequest(DestroyFoodRequest), FoodController.destroy)
                        .use(result(console.log))
                }, {
                    name: 'orders', 
                    router: Router()
                        .use(json())
                        .get('/', filterRequest(ReadOrderRequest), validateQuery, OrderController.read)
                        .post('/', filterRequest(CreateOrderRequest), OrderController.create)
                        .get('/:id', filterRequest(ReadOrderRequest), OrderController.read)
                        .put('/:id', filterRequest(UpdateOrderRequest), OrderController.update)
                        .delete('/:id', filterRequest(DestroyOrderRequest), OrderController.destroy)
                        .use(result(console.log))
                }, {
                    name: '', 
                    router: Router()
                        .get('*', (req: Request, res: Response) => {
                            res.sendStatus(StatusCodes.IM_A_TEAPOT);
                        })
                }])
                .run(parseInt(process.env.API_PORT || '8000'))
        );
})();
